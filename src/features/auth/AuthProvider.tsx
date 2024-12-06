import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeGapi, isAuthenticated } from '@/services/youtubeAuth';
import toast from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isInitialized: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeGapi();
        setIsAuthed(isAuthenticated());
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        toast.error('Failed to initialize YouTube connection');
      } finally {
        setIsInitialized(true);
      }
    };

    initialize();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: isAuthed, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);