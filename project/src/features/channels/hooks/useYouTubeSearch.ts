import { useState, useCallback } from 'react';
import { searchChannels } from '../services/youtubeApi';
import { Channel } from '@/types/channel';
import toast from 'react-hot-toast';

export function useYouTubeSearch() {
  const [results, setResults] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const search = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const channels = await searchChannels(query);
      setResults(channels);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed';
      setError(message);
      setResults([]);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { results, isLoading, error, search };
}