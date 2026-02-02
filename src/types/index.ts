// ============================================
// CreatorToolbox - Type Definitions
// ============================================

// User Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  credits: number;
  created_at: string;
  updated_at: string;
}

// Credits & Transactions
export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: "purchase" | "usage" | "refund" | "bonus";
  description: string;
  tool_id?: string;
  created_at: string;
}

// Pricing
export interface PricingTier {
  id: string;
  name: string;
  price: number;
  credits: number;
  description: string;
  features: string[];
  popular: boolean;
}

// Tools
export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  creditsPerUse: number;
  route: string;
}

// Thumbnail Generator
export interface ThumbnailRequest {
  prompt: string;
  style?: "realistic" | "illustration" | "3d" | "minimalist";
  aspectRatio?: "16:9" | "1:1";
}

export interface ThumbnailResult {
  id: string;
  user_id: string;
  prompt: string;
  image_url: string;
  created_at: string;
}

// Viral Ideas
export interface ViralIdeaRequest {
  niche: string;
  audience?: string;
  tone?: "educational" | "entertaining" | "inspirational";
}

export interface ViralIdea {
  id: string;
  title: string;
  hook: string;
  description: string;
  estimated_views: string;
  tags: string[];
}

// Shorts Creator
export interface ShortsRequest {
  video_url: string;
  max_duration?: number;
  style?: "highlights" | "educational" | "entertaining";
}

export interface ShortsResult {
  id: string;
  user_id: string;
  original_video_url: string;
  shorts: Array<{
    id: string;
    video_url: string;
    thumbnail_url: string;
    duration: number;
    start_time: number;
    end_time: number;
  }>;
  created_at: string;
}

// API Responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
