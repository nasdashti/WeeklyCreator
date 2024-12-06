import { XMLParser } from 'fast-xml-parser';
import { Channel, Video } from '@/types/channel';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
});

export async function getChannelFromHandle(handle: string): Promise<Channel | null> {
  try {
    const cleanHandle = handle.replace(/^@/, '');
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${cleanHandle}`;
    
    const response = await fetch(rssUrl);
    if (!response.ok) {
      throw new Error('Channel not found');
    }
    
    const xml = await response.text();
    const data = parser.parse(xml);
    const feed = data.feed;
    
    if (!feed) {
      throw new Error('Invalid RSS feed');
    }

    const videos = (feed.entry || []).map((entry: any): Video => {
      const videoId = entry['yt:videoId'];
      const isShort = entry['media:group']?.['media:description']?.toLowerCase().includes('#shorts') ||
                     entry.title.toLowerCase().includes('#shorts');

      return {
        id: videoId,
        title: entry.title,
        thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
        publishedAt: entry.published,
        url: entry.link['@_href'],
        isShort
      };
    });

    const sortedVideos = videos.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return {
      id: feed['yt:channelId'],
      handle: cleanHandle,
      name: feed.title,
      thumbnailUrl: feed.author?.['yt:thumbnail']?.['@_url'] || 
                   `https://yt3.googleusercontent.com/channel/${feed['yt:channelId']}`,
      description: feed.subtitle || '',
      url: `https://youtube.com/channel/${feed['yt:channelId']}`,
      videos: sortedVideos,
      latestVideo: sortedVideos[0] || null,
      streak: {
        videos: { current: 0, longest: 0 },
        shorts: { current: 0, longest: 0 },
        lastUploadDate: sortedVideos[0]?.publishedAt || new Date().toISOString(),
        startDate: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error fetching channel:', error);
    return null;
  }
}

export async function searchChannels(query: string): Promise<Channel[]> {
  // Since YouTube doesn't provide a search RSS feed, we'll try to fetch by handle directly
  if (query.startsWith('@')) {
    const channel = await getChannelFromHandle(query);
    return channel ? [channel] : [];
  }
  
  // For non-handle queries, we'll need to inform the user to use channel handles
  throw new Error('Please enter a channel handle (e.g., @channelname)');
}