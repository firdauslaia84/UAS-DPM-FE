export type VideoQuality = "360p" | "480p" | "720p" | "1080p";

export interface IQuality {
  quality: VideoQuality;
  bitrate: number;
  available: boolean;
}

export interface ISubtitle {
  language: string;
  languageName: string;
  url: string;
}

export interface IStreamingDetails {
  streamingUrl: string;
  quality: VideoQuality;
  title: string;
  duration: number;
  resumeTime: number;
  subtitles: ISubtitle[];
  supportedQualities: VideoQuality[];
}