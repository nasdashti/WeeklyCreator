import { useState, useCallback } from 'react';
import { signIn, signOut, isAuthenticated } from '@/services/youtubeAuth';
import { useChannelStore } from '@/features/channels/stores/channelStore';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const clearChannels = useChannelStore(state => state.clearChannels);

  const login = useCallback(async () => {
    setIsLoading(true);
    try {
      await signIn();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await signOut();
      clearChannels();
    } finally {
      setIsLoading(false);
    }
  }, [clearChannels]);

  return {
    login,
    logout,
    isLoading,
    isAuthenticated: isAuthenticated()
  };
}