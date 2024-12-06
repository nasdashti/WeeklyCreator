import React from 'react';
import { Video } from '@/types/channel';
import { formatDistanceToNow } from 'date-fns';

interface LatestVideoProps {
  video: Video | null;
}

export const LatestVideo: React.FC<LatestVideoProps> = ({ video }) => {
  if (!video) return null;

  return (
    <div className="mt-4">
      <div className="relative">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-48 object-cover rounded"
        />
        <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
          {formatDistanceToNow(new Date(video.publishedAt))} ago
        </span>
      </div>
      <h4 className="mt-2 font-medium line-clamp-2">
        {video.title}
      </h4>
    </div>
  );
};