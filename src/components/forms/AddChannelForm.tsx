import React, { useState } from 'react';
import { useYouTubeChannel } from '../../hooks/useYouTubeChannel';
import { WeeklyCommitmentDialog } from '../dialogs/WeeklyCommitmentDialog';
import { ChannelSearch } from './ChannelSearch';
import { Channel } from '../../types/channel';
import toast from 'react-hot-toast';

export const AddChannelForm: React.FC = () => {
  const [channelInput, setChannelInput] = useState('');
  const [isCommitmentDialogOpen, setIsCommitmentDialogOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Partial<Channel> | null>(null);
  const { addNewChannel, loading } = useYouTubeChannel();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedChannel && !channelInput) {
      toast.error('Please select a channel from the search results');
      return;
    }

    setIsCommitmentDialogOpen(true);
  };

  const handleConfirmCommitment = async () => {
    if (!selectedChannel && !channelInput) return;

    // Always use the selected channel's handle if available
    const channelToAdd = selectedChannel?.handle || channelInput;
    const success = await addNewChannel(channelToAdd);
    
    if (success) {
      setChannelInput('');
      setSelectedChannel(null);
      setIsCommitmentDialogOpen(false);
      toast.success('Welcome to the weekly creator community! 🎉');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Join Weekly Creator Community</h2>
      <p className="text-gray-600 mb-6">
        Track your weekly content creation journey and maintain your streak!
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <ChannelSearch
          value={channelInput}
          onChange={(value) => {
            setChannelInput(value);
            setSelectedChannel(null);
          }}
          onSelect={(channel) => {
            setSelectedChannel(channel);
            setChannelInput(channel.handle || '');
          }}
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading || (!selectedChannel && !channelInput)}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            loading || (!selectedChannel && !channelInput) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Adding Channel...' : 'Start Tracking'}
        </button>
      </form>

      <WeeklyCommitmentDialog
        isOpen={isCommitmentDialogOpen}
        onClose={() => setIsCommitmentDialogOpen(false)}
        onConfirm={handleConfirmCommitment}
      />
    </div>
  );
};