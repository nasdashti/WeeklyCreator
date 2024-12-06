import React, { useState } from 'react';
import { ChannelSearch } from './ChannelSearch';
import { useChannelActions } from '../hooks/useChannelActions';
import { WeeklyCommitmentDialog } from './WeeklyCommitmentDialog';
import { Channel } from '@/types/channel';

export const AddChannelForm: React.FC = () => {
  const { addNewChannel, isLoading } = useChannelActions();
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [showCommitment, setShowCommitment] = useState(false);

  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
    setShowCommitment(true);
  };

  const handleConfirm = async () => {
    if (selectedChannel) {
      const success = await addNewChannel(selectedChannel.handle);
      if (success) {
        setSelectedChannel(null);
        setShowCommitment(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Join Weekly Creator Community</h2>
      <p className="text-gray-600 mb-6">
        Track your weekly content creation journey and maintain your streak!
      </p>
      
      <div className="space-y-4">
        <ChannelSearch
          onSelect={handleChannelSelect}
          disabled={isLoading}
        />
      </div>

      <WeeklyCommitmentDialog
        isOpen={showCommitment}
        onClose={() => setShowCommitment(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}