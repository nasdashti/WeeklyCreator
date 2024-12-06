import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Channel } from '@/types/channel';
import { calculateStreak } from '../utils/streakUtils';

interface ChannelState {
  channels: Channel[];
  categories: string[];
  addChannel: (channel: Channel) => void;
  removeChannel: (channelId: string) => void;
  updateChannel: (channelId: string, updates: Partial<Channel>) => void;
  isChannelTracked: (channelId: string) => boolean;
  clearChannels: () => void;
}

export const useChannelStore = create<ChannelState>()(
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
        const streak = calculateStreak(channel);
        const cleanChannel = {
          ...channel,
          handle: channel.handle.replace(/^@+/, ''),
          streak: {
            current: streak,
            longest: streak,
            lastUploadDate: channel.latestVideo?.publishedAt || new Date().toISOString(),
            startDate: new Date().toISOString()
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

      clearChannels: () => set({ channels: [] }),
    }),
    {
      name: 'youtube-tracker',
      version: 1,
      migrate: (persistedState: any) => {
        return {
          channels: [],
          categories: [
            'Education',
            'Entertainment',
            'Gaming',
            'Music',
            'Tech',
            'Vlog',
            'Other'
          ]
        };
      }
    }
  )
);