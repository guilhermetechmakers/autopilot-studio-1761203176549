/**
 * Authentication context provider
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser, getCurrentSession, onAuthStateChange } from '@/api/auth';
import type { AuthContextType, User, AuthSession } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get current user
  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  // Get current session
  const { data: currentSession, isLoading: sessionLoading } = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: getCurrentSession,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  // Set up auth state change listener
  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user || null);
        setSession(session);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Update state when queries resolve
  useEffect(() => {
    setUser(currentUser || null);
    setSession(currentSession || null);
    setIsLoading(userLoading || sessionLoading);
  }, [currentUser, currentSession, userLoading, sessionLoading]);

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user && !!session,
    error: null,
    login: async () => {
      throw new Error('Use useAuth hook for login');
    },
    signup: async () => {
      throw new Error('Use useAuth hook for signup');
    },
    logout: async () => {
      throw new Error('Use useAuth hook for logout');
    },
    resetPassword: async () => {
      throw new Error('Use useAuth hook for resetPassword');
    },
    confirmPasswordReset: async () => {
      throw new Error('Use useAuth hook for confirmPasswordReset');
    },
    resendVerification: async () => {
      throw new Error('Use useAuth hook for resendVerification');
    },
    signInWithProvider: async () => {
      throw new Error('Use useAuth hook for signInWithProvider');
    },
    clearError: () => {},
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}