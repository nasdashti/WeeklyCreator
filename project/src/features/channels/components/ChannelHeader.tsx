import React from 'react';
import { Channel } from '@/types/channel';
import { cn } from '@/lib/utils';

interface ChannelHeaderProps {
  channel: Channel;
}

export const ChannelHeader: React.FC<ChannelHeaderProps> = ({ channel }) => {
  const isStreakActive = channel.streak.current > 0;

  return (
    <div className="flex items-center space-x-4">
      <img
        src={channel.thumbnailUrl}
        alt={channel.name}
        className="w-16 h-16 rounded-full"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg truncate">{channel.name}</h3>
        <p className="text-gray-500 truncate">@{channel.handle}</p>
      </div>
      <div className={cn(
        'flex flex-col items-end',
        isStreakActive ? 'text-green-500' : 'text-red-500'
      )}>
        <span className="font-bold text-xl">{channel.streak.current}</span>
        <span className="text-sm">weeks</span>
      </div>
    </div>
  );
};