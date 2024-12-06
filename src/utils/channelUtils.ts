import { parseISO, isValid } from 'date-fns';
import { Channel } from '../types/channel';
import { calculateWeeklyStreak, formatDateToUTC12 } from './dateUtils';

export const calculateStreak = (channel: Channel): number => {
  if (!channel.videos || channel.videos.length === 0) return 0;
  
  const startDate = channel.streak.historicalDate 
    ? parseISO(channel.streak.historicalDate)
    : parseISO(channel.streak.startDate);

  if (!isValid(startDate)) return 0;

  // Convert all video dates to UTC-12 and parse them
  const uploadDates = channel.videos
    .map(video => parseISO(formatDateToUTC12(video.publishedAt)))
    .filter(date => isValid(date));

  return calculateWeeklyStreak(uploadDates, startDate);
};

export const isStreakActive = (channel: Channel): boolean => {
  return calculateStreak(channel) > 0;
};

export const extractChannelHandle = (url: string): string => {
  const match = url.match(/(?:youtube\.com\/(@[\w-]+)|youtube\.com\/channel\/([\w-]+))/);
  return match ? match[1] || match[2] : '';
};