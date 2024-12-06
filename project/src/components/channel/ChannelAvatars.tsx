import React from 'react';
import { Channel } from '../../types/channel';
import { calculateStreak } from '../../utils/channelUtils';

interface ChannelAvatarsProps {
  channels: Channel[];
}

export const ChannelAvatars: React.FC<ChannelAvatarsProps> = ({ channels }) => {
  const sortedChannels = [...channels].sort((a, b) => {
    const streakA = calculateStreak(a);
    const streakB = calculateStreak(b);
    return streakB - streakA;
  });

  // Remove duplicates based on channel ID
  const uniqueChannels = sortedChannels.filter((channel, index, self) =>
    index === self.findIndex((c) => c.id === channel.id)
  );

  const getStreakEmoji = (streak: number): string => {
    if (streak === 0) return '📝';
    if (streak === 1) return '👍';
    if (streak === 2) return '🎯';
    return '🔥';
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Creator Community</h3>
      <div className="flex flex-wrap gap-6">
        {uniqueChannels.map((channel) => {
          const streak = calculateStreak(channel);
          const handle = channel.handle.replace(/^@+/, '');
          const streakEmoji = getStreakEmoji(streak);
          
          return (
            <div
              key={`${channel.id}-${channel.streak.startDate}`}
              className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3"
            >
              <div className="relative">
                <img
                  src={channel.thumbnailUrl}
                  alt={channel.name}
                  className="w-12 h-12 rounded-full"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {channel.name}
                </span>
                <span className="text-sm text-gray-500 truncate">
                  @{handle}
                </span>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-lg" role="img" aria-label="streak indicator">
                    {streakEmoji}
                  </span>
                  <span className="text-sm font-semibold text-indigo-600">
                    {streak} week{streak !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};