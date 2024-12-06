import { useState } from 'react';
import { useChannelStore } from '../stores/channelStore';
import youtube from '@/services/youtubeApi';
import toast from 'react-hot-toast';

export function useChannelActions() {
  const [isLoading, setIsLoading] = useState(false);
  const { addChannel, isChannelTracked } = useChannelStore();

  const addNewChannel = async (input: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const channel = await youtube.fetchChannelByHandle(input);
      
      if (isChannelTracked(channel.id)) {
        toast.error('This channel is already being tracked');
        return false;
      }

      addChannel(channel);
      toast.success('Channel added successfully!');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add channel';
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addNewChannel,
    isLoading
  };
}