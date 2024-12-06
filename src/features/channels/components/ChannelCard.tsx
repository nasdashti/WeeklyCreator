import React from 'react';
import { Channel } from '@/types/channel';
import { formatDistanceToNow } from 'date-fns';
import { getStreakEmoji } from '../utils/channelUtils';

interface ChannelCardProps {
  channel: Channel;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ channel }) => {
  const lastUploadDate = channel.latestVideo?.publishedAt;
  const uploadTimeAgo = lastUploadDate
    ? formatDistanceToNow(new Date(lastUploadDate), { addSuffix: true })
    : 'No uploads yet';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4">
        <img
          src={channel.thumbnailUrl}
          alt={channel.name}
          className="w-16 h-16 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{channel.name}</h3>
          <p className="text-gray-500 truncate">@{channel.handle}</p>
          <p className="text-sm text-gray-500">{uploadTimeAgo}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl" role="img" aria-label="streak indicator">
              {getStreakEmoji(channel.streak.current)}
            </span>
            <span className="font-bold text-xl">{channel.streak.current}</span>
          </div>
          <span className="text-sm text-gray-500">week streak</span>
        </div>
      </div>
    </div>
  );
};