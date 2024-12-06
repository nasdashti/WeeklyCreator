import { useState } from 'react';
import { fetchChannelInfo, fetchChannelVideos } from '../services/youtubeApi';
import { useChannelStore } from '../store/useChannelStore';
import { parseISO } from 'date-fns';
import { calculateWeeklyStreak } from '../utils/dateUtils';
import toast from 'react-hot-toast';

export const useYouTubeChannel = () => {
  const [loading, setLoading] = useState(false);
  const { addChannel, updateChannel, isChannelTracked } = useChannelStore();

  const addNewChannel = async (input: string) => {
    setLoading(true);
    try {
      const cleanHandle = input.trim()
        .replace(/^@+/, '')
        .replace('https://youtube.com/@', '')
        .replace('https://www.youtube.com/@', '');

      if (!cleanHandle) {
        toast.error('Please enter a valid channel handle');
        return false;
      }

      const channelInfo = await fetchChannelInfo(cleanHandle);
      
      if (!channelInfo || !channelInfo.id) {
        toast.error('Channel not found');
        return false;
      }

      if (isChannelTracked(channelInfo.id)) {
        toast.error('This channel is already being tracked');
        return false;
      }

      if (!channelInfo.videos?.length) {
        toast.error('No videos found for this channel');
        return false;
      }

      const uploadDates = channelInfo.videos.map(video => parseISO(video.publishedAt));
      const historicalDate = channelInfo.videos[channelInfo.videos.length - 1].publishedAt;
      const currentStreak = calculateWeeklyStreak(uploadDates, parseISO(historicalDate));

      const newChannel = {
        ...channelInfo,
        handle: cleanHandle,
        streak: {
          current: currentStreak,
          longest: currentStreak,
          lastUploadDate: channelInfo.videos[0].publishedAt,
          startDate: new Date().toISOString(),
          historicalDate,
        },
      };

      addChannel(newChannel as any);
      return true;
    } catch (error) {
      console.error('Error adding channel:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add channel');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshAllChannels = async () => {
    try {
      const channels = useChannelStore.getState().channels;
      const refreshPromises = channels.map(async (channel) => {
        try {
          const videos = await fetchChannelVideos(channel.id);
          if (videos.length > 0) {
            const uploadDates = videos.map(video => parseISO(video.publishedAt));
            const historicalDate = videos[videos.length - 1].publishedAt;
            const currentStreak = calculateWeeklyStreak(uploadDates, parseISO(historicalDate));

            updateChannel(channel.id, {
              videos,
              latestVideo: videos[0],
              streak: {
                ...channel.streak,
                current: currentStreak,
                longest: Math.max(currentStreak, channel.streak.longest),
                lastUploadDate: videos[0].publishedAt,
                historicalDate,
              },
            });
          }
        } catch (error) {
          console.error('Error refreshing channel:', error);
        }
      });

      await Promise.all(refreshPromises);
    } catch (error) {
      console.error('Error refreshing channels:', error);
    }
  };

  return {
    addNewChannel,
    refreshAllChannels,
    loading,
  };
};