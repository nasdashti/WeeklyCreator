export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
  url: string;
  isShort?: boolean;
}

export interface Channel {
  id: string;
  handle: string;
  name: string;
  thumbnailUrl: string;
  description: string;
  url: string;
  videos: Video[];
  latestVideo: Video | null;
  categories: string[];
  streak: {
    current: number;
    longest: number;
    lastUploadDate: string;
    startDate: string;
    historicalDate?: string;
  };
}