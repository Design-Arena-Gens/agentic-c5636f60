export type GenerationType = 'image' | 'video';

export type GenerationRequest = {
  type: GenerationType;
  prompt: string;
  aspectRatio?: string; // e.g., '1:1', '16:9'
  durationSeconds?: number; // for video
  seed?: number;
};

export type GenerationResult = {
  type: GenerationType;
  url: string; // public URL to media
  width?: number;
  height?: number;
  info?: Record<string, unknown>;
  provider: 'veo3' | 'sora2' | 'replicate-fallback';
};

export type PublishPlatform = 'x' | 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'linkedin';

export type PublishRequest = {
  mediaUrl: string;
  caption: string;
  platforms: PublishPlatform[];
  mediaType: GenerationType;
};

export type PublishResult = {
  platform: PublishPlatform;
  status: 'success' | 'skipped' | 'error';
  message?: string;
  url?: string; // link to the created post if available
};
