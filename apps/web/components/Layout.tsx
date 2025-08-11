import React, { ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/proxy-demo" style={{ marginLeft: 12 }}>Proxy Demo</a>
          <a href="/onboard" style={{ marginLeft: 12 }}>Onboard</a>
          <a href="/analytics" style={{ marginLeft: 12 }}>Analytics</a>
          <span style={{ marginLeft: 16 }} />
          {isAuthenticated ? (
            <>
              <span style={{ color: '#555' }}>
                Signed in as {user?.userId} {user?.isCreator ? '(Creator)' : ''}
              </span>
              <button style={{ marginLeft: 12 }} onClick={logout}>Logout</button>
            </>
          ) : (
            <a href="/login">Login</a>
          )}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
