import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Channel } from '../types/channel';
import { differenceInWeeks, parseISO } from 'date-fns';

interface ChannelStore {
  channels: Channel[];
  addChannel: (channel: Channel) => void;
  removeChannel: (channelId: string) => void;
  updateChannel: (channelId: string, updates: Partial<Channel>) => void;
  cleanupInactiveChannels: () => void;
  isChannelTracked: (channelId: string) => boolean;
}

const INACTIVE_WEEKS_LIMIT = 4;

const storage = createJSONStorage(() => localStorage);

export const useChannelStore = create<ChannelStore>()(
  persist(
    (set, get) => ({
      channels: [],

      addChannel: (channel) => {
        const state = get();
        // Remove any existing channel with the same ID before adding
        const filteredChannels = state.channels.filter(c => c.id !== channel.id);
        
        // Clean up the channel data
        const cleanedChannel = {
          ...channel,
          handle: channel.handle.replace(/^@+/, ''),
          streak: {
            ...channel.streak,
            startDate: channel.streak.startDate || new Date().toISOString(),
            historicalDate: channel.streak.historicalDate || channel.videos?.[channel.videos.length - 1]?.publishedAt,
          },
        };
        
        set({ channels: [...filteredChannels, cleanedChannel] });
      },

      removeChannel: (channelId) =>
        set((state) => ({
          channels: state.channels.filter((c) => c.id !== channelId),
        })),

      updateChannel: (channelId, updates) =>
        set((state) => ({
          channels: state.channels.map((channel) =>
            channel.id === channelId ? {
              ...channel,
              ...updates,
              handle: updates.handle?.replace(/^@+/, '') || channel.handle,
            } : channel
          ),
        })),

      cleanupInactiveChannels: () => {
        const now = new Date();
        set((state) => ({
          channels: state.channels.filter((channel) => {
            if (!channel.latestVideo) return false;
            
            const lastUploadDate = parseISO(channel.latestVideo.publishedAt);
            const weeksSinceLastUpload = differenceInWeeks(now, lastUploadDate);
            
            return weeksSinceLastUpload < INACTIVE_WEEKS_LIMIT;
          }),
        }));
      },

      isChannelTracked: (channelId) => {
        return get().channels.some((channel) => channel.id === channelId);
      },
    }),
    {
      name: 'youtube-tracker-storage',
      storage,
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Handle migration from version 0 to 1
          return {
            ...persistedState,
            channels: persistedState.channels.map((channel: Channel) => ({
              ...channel,
              handle: channel.handle.replace(/^@+/, ''),
              streak: {
                ...channel.streak,
                startDate: channel.streak.startDate || new Date().toISOString(),
                historicalDate: channel.streak.historicalDate || channel.videos?.[channel.videos.length - 1]?.publishedAt,
              }
            }))
          };
        }
        return persistedState;
      },
    }
  )
);

// Set up automatic cleanup of inactive channels
if (typeof window !== 'undefined') {
  setInterval(() => {
    useChannelStore.getState().cleanupInactiveChannels();
  }, 24 * 60 * 60 * 1000); // Run once per day
}