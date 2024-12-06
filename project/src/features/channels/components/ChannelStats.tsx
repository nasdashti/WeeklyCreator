import React from 'react';
import { Channel } from '@/types/channel';
import { formatDistanceToNow } from 'date-fns';

interface ChannelStatsProps {
  channel: Channel;
}

export const ChannelStats: React.FC<ChannelStatsProps> = ({ channel }) => {
  const lastUploadDate = channel.latestVideo?.publishedAt;
  const uploadTimeAgo = lastUploadDate
    ? formatDistanceToNow(new Date(lastUploadDate), { addSuffix: true })
    : 'No uploads yet';

  const videoCount = channel.videos?.length ?? 0;

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <StatItem
        label="Last Upload"
        value={uploadTimeAgo}
      />
      <StatItem
        label="Current Streak"
        value={`${channel.streak.current} weeks`}
        highlight={channel.streak.current > 0}
      />
      <StatItem
        label="Longest Streak"
        value={`${channel.streak.longest} weeks`}
      />
      <StatItem
        label="Total Videos"
        value={videoCount.toString()}
      />
    </div>
  );
};

interface StatItemProps {
  label: string;
  value: string;
  highlight?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, highlight }) => (
  <div className="bg-gray-50 p-3 rounded-lg">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`font-medium ${highlight ? 'text-green-600' : 'text-gray-900'}`}>
      {value}
    </p>
  </div>
);