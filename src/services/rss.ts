import { XMLParser } from 'fast-xml-parser';
import { Channel, Video } from '../types/channel';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
});

export async function getChannelFromHandle(handle: string): Promise<Channel | null> {
  try {
    const cleanHandle = handle.replace(/^@/, '');
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?user=${cleanHandle}`;
    
    const response = await fetch(rssUrl);
    if (!response.ok) {
      // Try channel ID if username doesn't work
      const channelResponse = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${cleanHandle}`);
      if (!channelResponse.ok) {
        throw new Error('Channel not found');
      }
      return parseChannelFeed(await channelResponse.text());
    }
    
    return parseChannelFeed(await response.text());
  } catch (error) {
    console.error('Error fetching channel:', error);
    return null;
  }
}

function parseChannelFeed(xml: string): Channel | null {
  try {
    const data = parser.parse(xml);
    const feed = data.feed;
    
    if (!feed) return null;

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
      handle: feed.author?.name || feed['yt:channelId'],
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
    console.error('Error parsing feed:', error);
    return null;
  }
}