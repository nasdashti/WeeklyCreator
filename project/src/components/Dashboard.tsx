import React, { useEffect } from 'react';
import { useChannelStore } from '../store/useChannelStore';
import { AddChannelForm } from './forms/AddChannelForm';
import { ChannelAvatars } from './channel/ChannelAvatars';
import { useYouTubeChannel } from '../hooks/useYouTubeChannel';

export const Dashboard: React.FC = () => {
  const { channels } = useChannelStore();
  const { refreshAllChannels } = useYouTubeChannel();

  // Refresh channels on component mount
  useEffect(() => {
    refreshAllChannels();
  }, []);

  // Sort channels by streak count for consistent ordering
  const sortedChannels = [...channels].sort((a, b) => {
    const streakA = a.streak.current;
    const streakB = b.streak.current;
    return streakB - streakA;
  });

  // Remove duplicates based on channel ID
  const uniqueChannels = sortedChannels.filter((channel, index, self) =>
    index === self.findIndex((c) => c.id === channel.id)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <AddChannelForm />
        </div>

        {uniqueChannels.length > 0 && (
          <div className="space-y-6">
            <ChannelAvatars channels={uniqueChannels} />
          </div>
        )}
      </main>
    </div>
  );
};