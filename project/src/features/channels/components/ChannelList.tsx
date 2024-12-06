import React from 'react';
import { useChannelStore } from '../stores/channelStore';
import { ChannelCard } from './ChannelCard';

export const ChannelList: React.FC = () => {
  const channels = useChannelStore(state => state.channels);

  if (channels.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No channels added yet. Add your first channel above!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {channels.map(channel => (
        <ChannelCard key={channel.id} channel={channel} />
      ))}
    </div>
  );
};