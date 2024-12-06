import React from 'react';
import { Channel } from '../../types/channel';
import { isStreakActive, calculateStreak } from '../../utils/channelUtils';
import { format, parseISO } from 'date-fns';

interface ChannelCardProps {
  channel: Channel;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ channel }) => {
  const streakActive = isStreakActive(channel);
  const currentStreak = calculateStreak(channel);

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
          {channel.streak.startDate && (
            <p className="text-xs text-gray-400">
              Tracking since {format(parseISO(channel.streak.startDate), 'MMM d, yyyy')}
            </p>
          )}
        </div>
        <div className={`flex flex-col items-end ${
          streakActive ? 'text-green-500' : 'text-red-500'
        }`}>
          <span className="font-bold text-xl">{currentStreak}</span>
          <span className="text-sm">weeks</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {channel.categories.map((category) => (
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