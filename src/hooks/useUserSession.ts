import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import { UserSession } from '../types/session';

export function useUserSession() {
  const { user, authenticated, getAccessToken, ready } = usePrivy();
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && authenticated && user) {
      fetchSession();
    } else if (ready && !authenticated) {
      setLoading(false);
      setSession(null);
    } else if (ready) {
      setLoading(false);
    }
  }, [ready, authenticated, user]);

  async function fetchSession() {
    try {
      setLoading(true);
      const token = await getAccessToken();

      if (!token) {
        throw new Error('No access token available');
      }

      const response = await fetch('/api/user/session', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch session');
      }

      const sessionData = await response.json();
      setSession(sessionData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setSession(null);
    } finally {
      setLoading(false);
    }
  }

  async function refreshSession() {
    await fetchSession();
  }

  function hasPermission(permission: string): boolean {
    return session?.permissions.includes(permission) || false;
  }

  function hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(p => session?.permissions.includes(p)) || false;
  }

  function hasRole(role: string): boolean {
    return session?.role === role;
  }

  return {
    session,
    loading,
    error,
    refreshSession,
    hasPermission,
    hasAnyPermission,
    hasRole,
    isAdmin: session?.role === 'admin',
    isDeveloper: session?.role === 'developer' || session?.role === 'admin'
  };
}
