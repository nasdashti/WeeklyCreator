import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { parseYouTubeHandle } from '../lib/utils';
import { fetchChannelByHandle } from '../lib/youtube';
import { useChannelStore } from '../store/channelStore';
import toast from 'react-hot-toast';

export function AddChannel() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const addChannel = useChannelStore((state) => state.addChannel);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const handle = parseYouTubeHandle(input);
    if (!handle) {
      setError('Please enter a valid YouTube channel URL or handle');
      return;
    }

    setIsLoading(true);
    try {
      const channel = await fetchChannelByHandle(handle);
      addChannel(channel);
      setInput('');
      toast.success('Channel added successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add channel');
      toast.error('Failed to add channel');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Add YouTube Channel"
        placeholder="Enter channel URL or handle (e.g., @channelname)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        error={error}
        disabled={isLoading}
      />
      <Button type="submit" isLoading={isLoading}>
        Add Channel
      </Button>
    </form>
  );
}