import React from 'react';
import { LoginButton } from '@/features/auth/components/LoginButton';
import { AuthStatus } from '@/features/auth/components/AuthStatus';
import { useAuthContext } from '@/features/auth/AuthProvider';
import { ChannelSearch } from '@/features/channels/components/ChannelSearch';
import { useChannelActions } from '@/features/channels/hooks/useChannelActions';
import { WeeklyCommitmentDialog } from '@/features/channels/components/WeeklyCommitmentDialog';
import { Channel } from '@/types/channel';

export function AddChannelForm() {
  const { isAuthenticated, isInitialized } = useAuthContext();
  const { addNewChannel, isLoading } = useChannelActions();
  const [selectedChannel, setSelectedChannel] = React.useState<Channel | null>(null);
  const [showCommitment, setShowCommitment] = React.useState(false);

  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
    setShowCommitment(true);
  };

  const handleConfirm = async () => {
    if (selectedChannel) {
      const success = await addNewChannel(selectedChannel.handle);
      if (success) {
        setSelectedChannel(null);
        setShowCommitment(false);
      }
    }
  };

  if (!isInitialized) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Join Weekly Creator Community</h2>
      <p className="text-gray-600 mb-6">
        Track your weekly content creation journey and maintain your streak!
      </p>
      
      <AuthStatus />
      
      {!isAuthenticated ? (
        <div className="space-y-4 mt-6">
          <p className="text-sm text-gray-500 mb-4">
            Connect your YouTube account to start tracking your weekly uploads
          </p>
          <LoginButton />
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          <ChannelSearch
            onSelect={handleChannelSelect}
            disabled={isLoading}
          />
        </div>
      )}

      <WeeklyCommitmentDialog
        isOpen={showCommitment}
        onClose={() => setShowCommitment(false)}
        onConfirm={handleConfirm}
        channelName={selectedChannel?.name}
      />
    </div>
  );
}