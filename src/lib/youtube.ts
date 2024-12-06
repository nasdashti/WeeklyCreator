import axios from 'axios';
import { Channel } from '@/types/channel';
import { calculateWeeklyStreak } from '@/features/channels/utils/streakUtils';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const youtube = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  params: { key: YOUTUBE_API_KEY },
});

export async function searchChannels(query: string): Promise<Channel[]> {
  if (!query || query.length < 2) return [];

  try {
    const { data } = await youtube.get('/search', {
      params: {
        part: 'snippet',
        type: 'channel',
        q: query,
        maxResults: 5,
      },
    });

    if (!data.items?.length) return [];

    const channels = await Promise.all(
      data.items.map(async (item: any) => {
        const channelId = item.id?.channelId;
        if (!channelId) return null;

        try {
          const { data: channelData } = await youtube.get('/channels', {
            params: {
              part: 'snippet,contentDetails',
              id: channelId,
            },
          });

          if (!channelData.items?.[0]) return null;

          const channel = channelData.items[0];
          const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;

          if (!uploadsPlaylistId) return null;

          const { data: videosData } = await youtube.get('/playlistItems', {
            params: {
              part: 'snippet',
              playlistId: uploadsPlaylistId,
              maxResults: 10,
            },
          });

          const videos = videosData.items
            ?.map((videoItem: any) => ({
              id: videoItem.snippet?.resourceId?.videoId || '',
              title: videoItem.snippet?.title || '',
              thumbnailUrl: videoItem.snippet?.thumbnails?.medium?.url || '',
              publishedAt: new Date(videoItem.snippet?.publishedAt || Date.now()).toISOString(),
              url: `https://youtube.com/watch?v=${videoItem.snippet?.resourceId?.videoId || ''}`,
            }))
            .filter((video: any) => video.id) || [];

          const sortedVideos = videos.sort((a, b) => 
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          );

          const streak = calculateWeeklyStreak(sortedVideos);

          return {
            id: channelId,
            handle: (channel.snippet?.customUrl || '').replace(/^@/, ''),
            name: channel.snippet?.title || '',
            thumbnailUrl: channel.snippet?.thumbnails?.default?.url || '',
            description: channel.snippet?.description || '',
            url: `https://youtube.com/channel/${channelId}`,
            latestVideo: sortedVideos[0] || null,
            streak: {
              current: streak,
              longest: Math.max(streak, 0),
              lastUploadDate: sortedVideos[0]?.publishedAt || new Date().toISOString(),
              startDate: new Date().toISOString(),
            },
          };
        } catch (error) {
          console.error('Error fetching channel details:', error);
          return null;
        }
      })
    );

    return channels.filter((channel): channel is Channel => channel !== null);
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

export async function fetchChannelByHandle(channelId: string): Promise<Channel> {
  if (!channelId) {
    throw new Error('Channel ID is required');
  }

  try {
    const { data: channelData } = await youtube.get('/channels', {
      params: {
        part: 'snippet,contentDetails',
        id: channelId,
      },
    });

    if (!channelData.items?.length) {
      throw new Error('Channel not found');
    }

    const channel = channelData.items[0];
    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      throw new Error('No uploads playlist found');
    }

    const { data: videosData } = await youtube.get('/playlistItems', {
      params: {
        part: 'snippet',
        playlistId: uploadsPlaylistId,
        maxResults: 50,
      },
    });

    const videos = videosData.items
      ?.map((item: any) => ({
        id: item.snippet?.resourceId?.videoId || '',
        title: item.snippet?.title || '',
        thumbnailUrl: item.snippet?.thumbnails?.medium?.url || '',
        publishedAt: new Date(item.snippet?.publishedAt || Date.now()).toISOString(),
        url: `https://youtube.com/watch?v=${item.snippet?.resourceId?.videoId || ''}`,
      }))
      .filter((video: any) => video.id) || [];

    const sortedVideos = videos.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    const streak = calculateWeeklyStreak(sortedVideos);

    return {
      id: channel.id,
      handle: (channel.snippet?.customUrl || '').replace(/^@/, ''),
      name: channel.snippet?.title || '',
      thumbnailUrl: channel.snippet?.thumbnails?.default?.url || '',
      description: channel.snippet?.description || '',
      url: `https://youtube.com/channel/${channel.id}`,
      latestVideo: sortedVideos[0] || null,
      streak: {
        current: streak,
        longest: Math.max(streak, 0),
        lastUploadDate: sortedVideos[0]?.publishedAt || new Date().toISOString(),
        startDate: new Date().toISOString(),
      },
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error?.message || error.message;
      throw new Error(`Failed to fetch channel: ${message}`);
    }
    throw error;
  }
}