import React from 'react';
import { cn } from '@/lib/utils';

interface ContentTypeToggleProps {
  value: 'videos' | 'shorts';
  onChange: (value: 'videos' | 'shorts') => void;
}

export function ContentTypeToggle({ value, onChange }: ContentTypeToggleProps) {
  return (
    <div className="inline-flex bg-white shadow-sm rounded-lg p-1">
      <button
        className={cn(
          'px-6 py-2 rounded-md text-sm font-medium transition-colors',
          value === 'videos'
            ? 'bg-indigo-50 text-indigo-700 shadow-sm'
            : 'text-gray-500 hover:text-gray-900'
        )}
        onClick={() => onChange('videos')}
      >
        Videos
      </button>
      <button
        className={cn(
          'px-6 py-2 rounded-md text-sm font-medium transition-colors',
          value === 'shorts'
            ? 'bg-indigo-50 text-indigo-700 shadow-sm'
            : 'text-gray-500 hover:text-gray-900'
        )}
        onClick={() => onChange('shorts')}
      >
        Shorts
      </button>
    </div>
  );
}