import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import youtube from '@/services/youtubeApi';
import { Channel } from '@/types/channel';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/Input';

interface ChannelSearchProps {
  onSelect: (channel: Channel) => void;
  disabled?: boolean;
}

export const ChannelSearch: React.FC<ChannelSearchProps> = ({
  onSelect,
  disabled = false,
}) => {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(input, 300);
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
    const search = async () => {
      if (debouncedSearch.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await youtube.searchChannels(debouncedSearch);
        setResults(searchResults);
        setIsOpen(searchResults.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    search();
  }, [debouncedSearch]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10"
          placeholder="Search channels or enter handle (e.g., @channelname)"
          disabled={disabled}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      </div>

      {isOpen && (input.length >= 2 || results.length > 0) && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
          <ul className="max-h-60 overflow-auto py-1">
            {isLoading ? (
              <li className="px-4 py-2 text-sm text-gray-500">Searching...</li>
            ) : results.length > 0 ? (
              results.map((channel) => (
                <li
                  key={channel.id}
                  onClick={() => {
                    onSelect(channel);
                    setInput('');
                    setIsOpen(false);
                  }}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <img
                      src={channel.thumbnailUrl}
                      alt={channel.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {channel.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        @{channel.handle}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-gray-500">
                No channels found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};