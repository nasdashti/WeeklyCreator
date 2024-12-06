import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Channel } from '../types/channel';

interface ChannelStore {
  channels: Channel[];
  categories: string[];
  addChannel: (channel: Channel) => void;
  removeChannel: (channelId: string) => void;
  updateChannel: (channelId: string, updates: Partial<Channel>) => void;
  isChannelTracked: (channelId: string) => boolean;
  clearChannels: () => void;
}

export const useChannelStore = create<ChannelStore>()(
  persist(
    (set, get) => ({
      channels: [],
      categories: [
        'Education',
        'Entertainment',
        'Gaming',
        'Music',
        'Tech',
        'Vlog',
        'Other'
      ],
      
      addChannel: (channel) => {
        const cleanChannel = {
          ...channel,
          handle: channel.handle.replace(/^@+/, ''),
          categories: channel.categories || [],
          streak: {
            ...channel.streak,
            startDate: channel.streak.startDate || new Date().toISOString(),
          }
        };
        
        set((state) => ({
          channels: [...state.channels, cleanChannel]
        }));
      },

      removeChannel: (channelId) =>
        set((state) => ({
          channels: state.channels.filter((c) => c.id !== channelId)
        })),

      updateChannel: (channelId, updates) =>
        set((state) => ({
          channels: state.channels.map((channel) =>
            channel.id === channelId ? { ...channel, ...updates } : channel
          )
        })),

      isChannelTracked: (channelId) => {
        return get().channels.some((channel) => channel.id === channelId);
      },

      clearChannels: () => set({ channels: [] })
    }),
    {
      name: 'youtube-tracker',
      version: 1
    }
  )
);