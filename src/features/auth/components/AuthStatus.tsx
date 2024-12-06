import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/Button';

export const AuthStatus: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-green-700 text-sm">Connected to YouTube</span>
      </div>
      <Button
        variant="secondary"
        onClick={logout}
        className="text-sm py-1"
      >
        Disconnect
      </Button>
    </div>
  );
};