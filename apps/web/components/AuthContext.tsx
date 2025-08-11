import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  user: { userId: string; isCreator: boolean } | null;
  refresh: () => void;
  logout: () => Promise<void>;
}

const AuthCtx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthState['user']>(null);

  const fetchMe = async () => {
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_AUTH_BASE_URL || 'http://localhost:4000/api';
      const res = await fetch(`${base}/auth/me`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser({ userId: data.userId, isCreator: !!data.isCreator });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const logout = async () => {
    const base = process.env.NEXT_PUBLIC_AUTH_BASE_URL || 'http://localhost:4000/api';
    await fetch(`${base}/auth/logout`, { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ loading, isAuthenticated: !!user, user, refresh: fetchMe, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!isAuthenticated) return <div style={{ padding: 24 }}>Please <a href="/login">login</a>.</div>;
  return <>{children}</>;
}
