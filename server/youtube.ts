import { z } from "zod";

const REDIRECT_URI = "https://ytcreator-app.repl.co/youtube-callback";

// Configure YouTube OAuth credentials
const getYouTubeConfig = () => {
  const clientId = process.env.YOUTUBE_CLIENT_ID || "";
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET || "";
  
  if (!clientId || !clientSecret) {
    console.warn("YouTube API credentials not configured properly");
  }
  
  return { clientId, clientSecret };
};

// Generate YouTube OAuth authorization URL
export function generateYouTubeAuthUrl(): string {
  const { clientId } = getYouTubeConfig();
  
  // Use REPLIT_DOMAINS environment variable to get the dynamic domain
  const domains = process.env.REPLIT_DOMAINS?.split(",") || [];
  const callbackDomain = domains.length > 0 ? domains[0] : "ytcreator-app.repl.co";
  
  const redirectUri = `https://${callbackDomain}/youtube-callback`;
  
  const scopes = [
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly"
  ];
  
  const authUrl = new URL("https://accounts.google.com/o/oauth2/auth");
  authUrl.searchParams.append("client_id", clientId);
  authUrl.searchParams.append("redirect_uri", redirectUri);
  authUrl.searchParams.append("scope", scopes.join(" "));
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("access_type", "offline");
  authUrl.searchParams.append("prompt", "consent");
  
  return authUrl.toString();
}

// Exchange authorization code for token
export async function getYouTubeTokenFromCode(code: string): Promise<{
  accessToken: string;
  refreshToken: string;
  channelId: string;
  channelName: string;
}> {
  const { clientId, clientSecret } = getYouTubeConfig();
  
  // Use REPLIT_DOMAINS environment variable to get the dynamic domain
  const domains = process.env.REPLIT_DOMAINS?.split(",") || [];
  const callbackDomain = domains.length > 0 ? domains[0] : "ytcreator-app.repl.co";
  
  const redirectUri = `https://${callbackDomain}/youtube-callback`;
  
  try {
    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    
    if (!tokenResponse.ok) {
      throw new Error(`Failed to exchange code for token: ${await tokenResponse.text()}`);
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    
    // Get channel info
    const channelResponse = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!channelResponse.ok) {
      throw new Error(`Failed to get channel info: ${await channelResponse.text()}`);
    }
    
    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      throw new Error("No YouTube channel found for this user");
    }
    
    const channelId = channelData.items[0].id;
    const channelName = channelData.items[0].snippet.title;
    
    return { accessToken, refreshToken, channelId, channelName };
  } catch (error) {
    console.error("Error getting YouTube token:", error);
    throw error;
  }
}

// Mock implementation for uploading a video to YouTube
export async function uploadVideoToYouTube(
  accessToken: string, 
  videoData: { 
    title: string; 
    description: string; 
    tags: string[]; 
    videoFilePath: string;
    categoryId: string;
  }
): Promise<string> {
  try {
    // In a real implementation, this would:
    // 1. Upload the video file to YouTube
    // 2. Set metadata like title, description, tags
    // 3. Return the YouTube video ID
    
    // Since this is a mock, we return a fake YouTube ID after a delay to simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return `yt-${Math.random().toString(36).substring(2, 10)}`;
  } catch (error) {
    console.error("Error uploading video to YouTube:", error);
    throw error;
  }
}
