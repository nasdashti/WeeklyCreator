import { Channel, Video } from '@/types/channel';
import { parseYouTubeHandle } from '../utils/channelUtils';
import toast from 'react-hot-toast';
import { initializeGapi, initializeTokenClient, authorize } from '@/services/youtubeAuth';

async function ensureAuthenticated() {
  try {
    await initializeGapi();
    await initializeTokenClient();
    await authorize();
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error('Failed to authenticate with YouTube');
  }
}

export async function searchChannels(query: string): Promise<Channel[]> {
  if (!query || query.length < 2) return [];

  try {
    await ensureAuthenticated();

    const response = await gapi.client.youtube.search.list({
      part: ['snippet'],
      q: query,
      type: ['channel'],
      maxResults: 5
    });

    if (!response.result.items?.length) return [];

    const channels = await Promise.all(
      response.result.items.map(async (item: any) => {
        try {
          const channelId = item.id.channelId;
          const videos = await fetchChannelVideos(channelId);
          
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
    );

    return channels.filter((channel): channel is Channel => channel !== null);
  } catch (error) {
    console.error('Search error:', error);
    toast.error('Failed to search channels');
    return [];
  }
}

export async function fetchChannelInfo(input: string): Promise<Channel> {
  const handle = parseYouTubeHandle(input);
  if (!handle) {
    throw new Error('Invalid YouTube channel URL or handle');
  }

  try {
    await ensureAuthenticated();

    // Search for the channel by handle
    const searchResponse = await gapi.client.youtube.search.list({
      part: ['snippet'],
      q: `@${handle}`,
      type: ['channel'],
      maxResults: 1
    });

    if (!searchResponse.result.items?.[0]) {
      throw new Error('Channel not found');
    }

    const channelId = searchResponse.result.items[0].id.channelId;

    // Get detailed channel information
    const channelResponse = await gapi.client.youtube.channels.list({
      part: ['snippet,contentDetails'],
      id: [channelId]
    });

    if (!channelResponse.result.items?.[0]) {
      throw new Error('Channel not found');
    }

    const channel = channelResponse.result.items[0];
    const videos = await fetchChannelVideos(channelId);

    return {
      id: channelId,
      handle: handle,
      name: channel.snippet.title,
      thumbnailUrl: channel.snippet.thumbnails.default.url,
      description: channel.snippet.description,
      url: `https://youtube.com/@${handle}`,
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
    const message = error instanceof Error ? error.message : 'Failed to fetch channel';
    toast.error(message);
    throw new Error(message);
  }
}

async function fetchChannelVideos(channelId: string): Promise<Video[]> {
  try {
    const response = await gapi.client.youtube.search.list({
      part: ['snippet'],
      channelId,
      order: 'date',
      maxResults: 10,
      type: ['video'],
      publishedAfter: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
    });

    return response.result.items.map((item: any) => ({
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