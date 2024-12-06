export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
  url: string;
}

export interface Channel {
  id: string;
  handle: string;
  name: string;
  thumbnailUrl: string;
  description: string;
  url: string;
  latestVideo: Video | null;
  streak: {
    current: number;
    longest: number;
    lastUploadDate: string;
    startDate: string;
  };
}