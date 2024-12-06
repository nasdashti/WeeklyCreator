import { useState } from 'react';
import { useChannelStore } from '../stores/channelStore';
import { getChannelDetails } from '../services/youtubeApi';
import toast from 'react-hot-toast';
import { Channel } from '@/types/channel';

export function useAddChannel() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const { addChannel, isChannelTracked } = useChannelStore();

  const handleAddChannel = async (channel: Channel): Promise<boolean> => {
    setIsLoading(true);
    setError(undefined);

    try {
      if (isChannelTracked(channel.id)) {
        throw new Error('Channel is already being tracked');
      }

      // Get fresh channel details
      const details = await getChannelDetails(channel.id);
      if (!details) {
        throw new Error('Could not fetch channel details');
      }

      addChannel(details);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add channel';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addChannel: handleAddChannel,
    isLoading,
    error,
  };
}