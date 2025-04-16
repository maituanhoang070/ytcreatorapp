import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChannelSettingsSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { generateYouTubeAuthUrl, getYouTubeTokenFromCode } from "./youtube";
import { analyzeTrendsForCategory, generateVideoContent } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  
  // YouTube Auth URL endpoint
  app.get("/api/youtube/auth-url", async (req: Request, res: Response) => {
    try {
      const authUrl = generateYouTubeAuthUrl();
      res.json({ authUrl });
    } catch (error) {
      console.error("Error generating YouTube auth URL:", error);
      res.status(500).json({ message: "Failed to generate YouTube authentication URL" });
    }
  });
  
  // YouTube Auth callback
  app.post("/api/youtube/auth-callback", async (req: Request, res: Response) => {
    try {
      const { code, userId } = req.body;
      
      if (!code || !userId) {
        return res.status(400).json({ message: "Missing code or userId" });
      }
      
      const userData = await getYouTubeTokenFromCode(code);
      const { accessToken, refreshToken, channelId, channelName } = userData;
      
      const updatedUser = await storage.updateUserYoutubeCredentials(
        Number(userId),
        accessToken,
        refreshToken,
        channelId,
        channelName
      );
      
      res.json({ 
        success: true, 
        channelName: updatedUser.youtubeChannelName 
      });
    } catch (error) {
      console.error("Error in YouTube auth callback:", error);
      res.status(500).json({ message: "Failed to authenticate with YouTube" });
    }
  });
  
  // YouTube Auth callback for redirect (handles GET requests)
  app.get("/youtube-callback", async (req: Request, res: Response) => {
    try {
      const code = req.query.code as string;
      const userId = 1; // Default user ID for demo
      
      if (!code) {
        return res.redirect("/?error=missing_code");
      }
      
      const userData = await getYouTubeTokenFromCode(code);
      const { accessToken, refreshToken, channelId, channelName } = userData;
      
      await storage.updateUserYoutubeCredentials(
        userId,
        accessToken,
        refreshToken,
        channelId,
        channelName
      );
      
      // Redirect back to the home page with success
      return res.redirect("/?youtube_connected=true");
    } catch (error) {
      console.error("Error in YouTube auth callback redirect:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return res.redirect(`/?error=${encodeURIComponent(errorMessage)}`);
    }
  });
  
  // Channel settings endpoints
  app.post("/api/channel-settings", async (req: Request, res: Response) => {
    try {
      const validatedData = insertChannelSettingsSchema.parse(req.body);
      const channelSettings = await storage.createChannelSettings(validatedData);
      res.status(201).json(channelSettings);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid channel settings data", errors: error.errors });
      } else {
        console.error("Error creating channel settings:", error);
        res.status(500).json({ message: "Failed to create channel settings" });
      }
    }
  });
  
  app.get("/api/channel-settings/:userId", async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      const channelSettings = await storage.getChannelSettings(userId);
      
      if (!channelSettings) {
        return res.status(404).json({ message: "Channel settings not found" });
      }
      
      res.json(channelSettings);
    } catch (error) {
      console.error("Error fetching channel settings:", error);
      res.status(500).json({ message: "Failed to fetch channel settings" });
    }
  });
  
  // Trends analysis endpoints
  app.get("/api/trends/:category", async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      let trends = await storage.getTrends(category);
      
      // If no trends found for this category, generate them
      if (trends.length === 0) {
        // Use OpenAI to analyze trends for this category
        const analysisResult = await analyzeTrendsForCategory(category);
        
        // Create a new trend record
        const newTrend = await storage.createTrend({
          category,
          keywords: analysisResult.keywords,
          topics: analysisResult.topics,
          score: 100, // Default high score for newly generated trends
        });
        
        trends = [newTrend];
      }
      
      res.json(trends);
    } catch (error) {
      console.error("Error fetching trends:", error);
      res.status(500).json({ message: "Failed to fetch trends data" });
    }
  });
  
  // Video generation endpoints
  app.post("/api/videos/generate", async (req: Request, res: Response) => {
    try {
      const { userId, topicId, category } = req.body;
      
      if (!userId || !topicId || !category) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
      
      // Get channel settings for this user
      const channelSettings = await storage.getChannelSettings(Number(userId));
      if (!channelSettings) {
        return res.status(404).json({ message: "Channel settings not found" });
      }
      
      // Get trends for the category to find the selected topic
      const trends = await storage.getTrends(category);
      const selectedTrend = trends[0]; // Assume we have at least one trend
      
      if (!selectedTrend || !selectedTrend.topics) {
        return res.status(404).json({ message: "Trend data not found" });
      }
      
      // Find the selected topic
      // Make sure topics is an array before using find
      const topics = Array.isArray(selectedTrend.topics) ? selectedTrend.topics : [];
      const selectedTopic = topics.find((t: any) => t.id === topicId || t.title === topicId);
      if (!selectedTopic) {
        return res.status(404).json({ message: "Selected topic not found" });
      }
      
      // Generate video content
      const videoContent = await generateVideoContent(
        selectedTopic.title,
        category,
        channelSettings.channelDescription
      );
      
      // Create a new video record
      const newVideo = await storage.createVideo({
        userId: Number(userId),
        title: videoContent.title,
        description: videoContent.description,
        tags: videoContent.tags,
        thumbnailUrl: null,
        videoUrl: null, // Will be populated once video is generated
        status: "processing",
        category,
        trendScore: selectedTopic.score || 0,
        scheduledFor: null,
      });
      
      res.status(201).json({
        id: newVideo.id,
        title: newVideo.title,
        status: newVideo.status,
        message: "Video generation started"
      });
    } catch (error) {
      console.error("Error generating video:", error);
      res.status(500).json({ message: "Failed to generate video" });
    }
  });
  
  // List videos endpoint
  app.get("/api/videos/:userId", async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      const videos = await storage.getVideos(userId);
      res.json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });
  
  // User endpoints
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user with the same email or username already exists
      const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      const existingUserByUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already in use" });
      }
      
      const user = await storage.createUser(validatedData);
      res.status(201).json({ id: user.id, username: user.username, email: user.email });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid user data", errors: error.errors });
      } else {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });
  
  // Mock login endpoint
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Missing username or password" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      res.json({ 
        id: user.id, 
        username: user.username, 
        email: user.email,
        youtubeChannelName: user.youtubeChannelName
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Failed to log in" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
