import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  youtubeAccessToken: text("youtube_access_token"),
  youtubeRefreshToken: text("youtube_refresh_token"),
  youtubeChannelId: text("youtube_channel_id"),
  youtubeChannelName: text("youtube_channel_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Channel settings table
export const channelSettings = pgTable("channel_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  channelName: text("channel_name").notNull(),
  channelCategory: text("channel_category").notNull(),
  channelDescription: text("channel_description").notNull(),
  contentTypes: text("content_types").array().notNull(),
  targetLanguage: text("target_language").notNull().default("vietnamese"),
  targetAgeGroup: text("target_age_group"),
  youtubeChannelLink: text("youtube_channel_link"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Generated videos table
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tags: text("tags").array(),
  thumbnailUrl: text("thumbnail_url"),
  videoUrl: text("video_url"),
  youtubeVideoId: text("youtube_video_id"),
  status: text("status").notNull().default("draft"), // draft, processing, published, failed
  category: text("category").notNull(),
  trendScore: integer("trend_score").default(0),
  publishedAt: timestamp("published_at"),
  scheduledFor: timestamp("scheduled_for"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Trends data
export const trends = pgTable("trends", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  keywords: text("keywords").array().notNull(),
  topics: jsonb("topics").notNull(),
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  youtubeAccessToken: true,
  youtubeRefreshToken: true,
  youtubeChannelId: true,
  youtubeChannelName: true,
});

export const insertChannelSettingsSchema = createInsertSchema(channelSettings).omit({
  id: true,
  createdAt: true,
  isActive: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
  publishedAt: true,
  youtubeVideoId: true,
});

export const insertTrendSchema = createInsertSchema(trends).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ChannelSettings = typeof channelSettings.$inferSelect;
export type InsertChannelSettings = z.infer<typeof insertChannelSettingsSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Trend = typeof trends.$inferSelect;
export type InsertTrend = z.infer<typeof insertTrendSchema>;
