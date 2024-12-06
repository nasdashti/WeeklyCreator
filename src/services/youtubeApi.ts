import { Channel, Video } from '@/types/channel';
import { parseYouTubeHandle } from '@/lib/utils';
import toast from 'react-hot-toast';
import { YOUTUBE_CONFIG } from '@/config/youtube';

const youtube = {
  async searchChannels(query: string): Promise<Channel[]> {
    if (!query || query.length < 2) return [];

    try {
      const response = await fetch(
        `${YOUTUBE_CONFIG.BASE_URL}/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&maxResults=5&key=${YOUTUBE_CONFIG.API_KEY}`
      );
      
      if (!response.ok) throw new Error('Failed to search channels');
      
      const data = await response.json();
      if (!data.items?.length) return [];

      return Promise.all(
        data.items.map(async (item: any) => {
          try {
            const channelId = item.id.channelId;
            const videos = await youtube.fetchChannelVideos(channelId);
            
            return {
              id: channelId,
              handle: item.snippet.customUrl?.replace(/^@/, '') || channelId,
              name: item.snippet.title,
              thumbnailUrl: item.snippet.thumbnails.default.url,
              description: item.snippet.description,
              url: `https://youtube.com/channel/${channelId}`,
              videos,
              latestVideo: videos[0] || null,
              streak: {
                current: 0,
                longest: 0,
                lastUploadDate: videos[0]?.publishedAt || new Date().toISOString(),
                startDate: new Date().toISOString()
              }
            };
          } catch (error) {
            console.error('Error fetching channel details:', error);
            return null;
          }
        })
      ).then(channels => channels.filter((c): c is Channel => c !== null));
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search channels');
      return [];
    }
  },

  async fetchChannelByHandle(handle: string): Promise<Channel> {
    const cleanHandle = parseYouTubeHandle(handle);
    if (!cleanHandle) {
      throw new Error('Invalid YouTube channel URL or handle');
    }

    try {
      const response = await fetch(
        `${YOUTUBE_CONFIG.BASE_URL}/search?part=snippet&q=@${cleanHandle}&type=channel&maxResults=1&key=${YOUTUBE_CONFIG.API_KEY}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch channel');
      
      const data = await response.json();
      if (!data.items?.[0]) {
        throw new Error('Channel not found');
      }

      const channelId = data.items[0].id.channelId;
      const videos = await youtube.fetchChannelVideos(channelId);

      return {
        id: channelId,
        handle: cleanHandle,
        name: data.items[0].snippet.title,
        thumbnailUrl: data.items[0].snippet.thumbnails.default.url,
        description: data.items[0].snippet.description,
        url: `https://youtube.com/@${cleanHandle}`,
        videos,
        latestVideo: videos[0] || null,
        streak: {
          current: 0,
          longest: 0,
          lastUploadDate: videos[0]?.publishedAt || new Date().toISOString(),
          startDate: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error fetching channel:', error);
      throw new Error('Failed to fetch channel');
    }
  },

  async fetchChannelVideos(channelId: string): Promise<Video[]> {
    try {
      const response = await fetch(
        `${YOUTUBE_CONFIG.BASE_URL}/search?part=snippet&channelId=${channelId}&order=date&maxResults=10&type=video&key=${YOUTUBE_CONFIG.API_KEY}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch videos');
      
      const data = await response.json();
      return data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
        url: `https://youtube.com/watch?v=${item.id.videoId}`
      }));
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  }
};

export default youtube;