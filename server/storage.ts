import {
  User, InsertUser,
  ChannelSettings, InsertChannelSettings,
  Video, InsertVideo,
  Trend, InsertTrend
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserYoutubeCredentials(
    id: number, 
    accessToken: string, 
    refreshToken: string, 
    channelId: string, 
    channelName: string
  ): Promise<User>;

  // Channel settings methods
  getChannelSettings(userId: number): Promise<ChannelSettings | undefined>;
  createChannelSettings(settings: InsertChannelSettings): Promise<ChannelSettings>;
  updateChannelSettings(id: number, settings: Partial<InsertChannelSettings>): Promise<ChannelSettings>;

  // Videos methods
  getVideos(userId: number): Promise<Video[]>;
  getVideo(id: number): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video>;
  deleteVideo(id: number): Promise<boolean>;

  // Trends methods
  getTrends(category: string): Promise<Trend[]>;
  createTrend(trend: InsertTrend): Promise<Trend>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private channelSettings: Map<number, ChannelSettings>;
  private videos: Map<number, Video>;
  private trends: Map<number, Trend>;
  private userIdCounter: number;
  private channelSettingsIdCounter: number;
  private videoIdCounter: number;
  private trendIdCounter: number;

  constructor() {
    this.users = new Map();
    this.channelSettings = new Map();
    this.videos = new Map();
    this.trends = new Map();
    this.userIdCounter = 1;
    this.channelSettingsIdCounter = 1;
    this.videoIdCounter = 1;
    this.trendIdCounter = 1;
    
    // Add some sample trends data
    this.initializeTrends();
  }

  private initializeTrends() {
    const now = new Date();
    const categories = ["education", "entertainment", "gaming", "lifestyle", "technology", "cooking", "fitness", "business"];
    
    categories.forEach(category => {
      const trend: InsertTrend = {
        category,
        keywords: [`${category}_keyword1`, `${category}_keyword2`, `${category}_keyword3`],
        topics: [
          { title: `Xu hướng ${category} #1`, score: 95 },
          { title: `Xu hướng ${category} #2`, score: 87 },
          { title: `Xu hướng ${category} #3`, score: 82 },
        ],
        score: Math.floor(Math.random() * 100) + 1,
      };
      
      this.createTrend(trend);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now,
      youtubeAccessToken: null,
      youtubeRefreshToken: null,
      youtubeChannelId: null,
      youtubeChannelName: null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserYoutubeCredentials(
    id: number, 
    accessToken: string, 
    refreshToken: string, 
    channelId: string, 
    channelName: string
  ): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser: User = {
      ...user,
      youtubeAccessToken: accessToken,
      youtubeRefreshToken: refreshToken,
      youtubeChannelId: channelId,
      youtubeChannelName: channelName
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Channel settings methods
  async getChannelSettings(userId: number): Promise<ChannelSettings | undefined> {
    return Array.from(this.channelSettings.values()).find(
      (settings) => settings.userId === userId
    );
  }

  async createChannelSettings(settings: InsertChannelSettings): Promise<ChannelSettings> {
    const id = this.channelSettingsIdCounter++;
    const now = new Date();
    const channelSettings: ChannelSettings = {
      ...settings,
      id,
      isActive: true,
      createdAt: now
    };
    this.channelSettings.set(id, channelSettings);
    return channelSettings;
  }

  async updateChannelSettings(id: number, settings: Partial<InsertChannelSettings>): Promise<ChannelSettings> {
    const existingSettings = this.channelSettings.get(id);
    if (!existingSettings) {
      throw new Error("Channel settings not found");
    }
    
    const updatedSettings: ChannelSettings = {
      ...existingSettings,
      ...settings,
    };
    
    this.channelSettings.set(id, updatedSettings);
    return updatedSettings;
  }

  // Videos methods
  async getVideos(userId: number): Promise<Video[]> {
    return Array.from(this.videos.values())
      .filter((video) => video.userId === userId)
      .sort((a, b) => {
        // Sort by creation date in descending order
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const id = this.videoIdCounter++;
    const now = new Date();
    const newVideo: Video = {
      ...video,
      id,
      createdAt: now,
      publishedAt: null,
      youtubeVideoId: null,
    };
    this.videos.set(id, newVideo);
    return newVideo;
  }

  async updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video> {
    const existingVideo = this.videos.get(id);
    if (!existingVideo) {
      throw new Error("Video not found");
    }
    
    const updatedVideo: Video = {
      ...existingVideo,
      ...video,
    };
    
    this.videos.set(id, updatedVideo);
    return updatedVideo;
  }

  async deleteVideo(id: number): Promise<boolean> {
    return this.videos.delete(id);
  }

  // Trends methods
  async getTrends(category: string): Promise<Trend[]> {
    return Array.from(this.trends.values())
      .filter((trend) => trend.category === category)
      .sort((a, b) => b.score - a.score);
  }

  async createTrend(trend: InsertTrend): Promise<Trend> {
    const id = this.trendIdCounter++;
    const now = new Date();
    const newTrend: Trend = {
      ...trend,
      id,
      createdAt: now,
    };
    this.trends.set(id, newTrend);
    return newTrend;
  }
}

export const storage = new MemStorage();
