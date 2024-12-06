import { Channel, Video } from '../types/channel';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface Cache {
  [key: string]: CacheItem<any>;
}

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
let cache: Cache = {};

export const getCached = <T>(key: string): T | null => {
  const item = cache[key];
  if (item && Date.now() - item.timestamp < CACHE_DURATION) {
    return item.data;
  }
  return null;
};

export const setCache = <T>(key: string, data: T): void => {
  cache[key] = {
    data,
    timestamp: Date.now(),
  };
};

export const clearCache = (): void => {
  cache = {};
};

// Type-safe cache getters
export const getChannelCache = (key: string): Partial<Channel> | null => {
  return getCached<Partial<Channel>>(key);
};

export const getVideoCache = (key: string): Video[] | null => {
  return getCached<Video[]>(key);
};