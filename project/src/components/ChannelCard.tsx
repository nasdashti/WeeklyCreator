import React from 'react';
import { Channel } from '../types/channel';
import { isStreakActive } from '../utils/channelUtils';
import { formatDistanceToNow } from 'date-fns';

interface ChannelCardProps {
  channel: Channel;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ channel }) => {
  const streakActive = isStreakActive(channel);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4">
        <img
          src={channel.thumbnailUrl}
          alt={channel.name}
          className="w-16 h-16 rounded-full"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{channel.name}</h3>
          <p className="text-gray-500">@{channel.handle}</p>
        </div>
        <div className={`flex items-center ${
          streakActive ? 'text-green-500' : 'text-red-500'
        }`}>
          <span className="font-bold text-xl">{channel.streak.current}</span>
          <span className="ml-1">weeks</span>
        </div>
      </div>

      {channel.latestVideo && (
        <div className="mt-4">
          <div className="relative">
            <img
              src={channel.latestVideo.thumbnailUrl}
              alt={channel.latestVideo.title}
              className="w-full h-48 object-cover rounded"
            />
            <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
              {formatDistanceToNow(new Date(channel.latestVideo.publishedAt))} ago
            </span>
          </div>
          <h4 className="mt-2 font-medium line-clamp-2">
            {channel.latestVideo.title}
          </h4>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {channel.categories.map((category: string) => (
          <span
            key={category}
            className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
          >
            {category}
          </span>
        ))}
      </div>
    </div>
  );
};