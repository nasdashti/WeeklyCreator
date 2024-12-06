import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { searchChannels } from '../../services/youtubeApi';
import { Channel } from '../../types/channel';

interface ChannelSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (channel: Partial<Channel>) => void;
  disabled?: boolean;
}

export const ChannelSearch: React.FC<ChannelSearchProps> = ({
  value,
  onChange,
  onSelect,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Partial<Channel>[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(value, 300);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearch.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await searchChannels(debouncedSearch);
        setResults(searchResults);
        setIsOpen(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearch]);

  const handleSelect = (channel: Partial<Channel>) => {
    onSelect(channel);
    onChange(channel.handle || '');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label htmlFor="channelSearch" className="block text-sm font-medium text-gray-700">
        Search Channel
      </label>
      <div className="mt-1">
        <input
          type="text"
          id="channelSearch"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Enter channel name or handle"
          disabled={disabled}
        />
      </div>
      
      {isOpen && (value.length >= 2 || results.length > 0) && (
        <div 
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60"
        >
          {loading ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {results.map((channel) => (
                <li
                  key={channel.id}
                  className="cursor-pointer hover:bg-gray-50 px-4 py-2"
                  onClick={() => handleSelect(channel)}
                >
                  <div className="flex items-center">
                    {channel.thumbnailUrl && (
                      <img
                        src={channel.thumbnailUrl}
                        alt={channel.name}
                        className="h-8 w-8 rounded-full mr-3"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {channel.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        @{channel.handle?.replace(/^@+/, '')}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              No channels found
            </div>
          )}
        </div>
      )}
      
      <p className="mt-2 text-sm text-gray-500">
        Search by channel name or enter handle directly
      </p>
    </div>
  );
};