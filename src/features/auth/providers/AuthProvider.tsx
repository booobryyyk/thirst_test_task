'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  fetchUserAttributes,
  getCurrentUser,
  signOut as amplifySignOut,
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

import { amplifyClient } from '@/lib/amplify-client';

type AuthUser = {
  id: string;
  displayName: string;
  email: string;
};

type AuthState = {
  status: 'loading' | 'guest' | 'authenticated';
  user: AuthUser | null;
};

type AuthContextValue = AuthState & {
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    status: 'loading',
    user: null,
  });

  const refresh = useCallback(async () => {
    try {
      await amplifyClient.ensureConfigured();

      const [currentUser, attributes] = await Promise.all([
        getCurrentUser(),
        fetchUserAttributes(),
      ]);

      setState({
        status: 'authenticated',
        user: {
          id: currentUser.userId,
          displayName:
            attributes.given_name || attributes.name || currentUser.username,
          email: attributes.email || currentUser.username,
        },
      });
    } catch {
      setState({ status: 'guest', user: null });
    }
  }, []);

  useEffect(() => {
    let isActive = true;
    let stopListening: (() => void) | undefined;

    void amplifyClient
      .ensureConfigured()
      .then(() => {
        if (!isActive) return;

        stopListening = Hub.listen('auth', () => {
          void refresh();
        });
        return refresh();
      })
      .catch(() => {
        if (isActive) setState({ status: 'guest', user: null });
      });

    return () => {
      isActive = false;
      stopListening?.();
    };
  }, [refresh]);

  const signOut = useCallback(async () => {
    await amplifyClient.ensureConfigured();
    await amplifySignOut();
    await refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ ...state, refresh, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
