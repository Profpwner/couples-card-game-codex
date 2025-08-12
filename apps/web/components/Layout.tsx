import React, { ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }} data-theme="light">
      <a
        href="#main-content"
        style={{
          position: 'absolute', left: 8, top: 8, background: '#fff', color: '#0070f3',
          padding: '6px 10px', borderRadius: 4, transform: 'translateY(-200%)',
        }}
        onFocus={(e) => { (e.currentTarget.style as any).transform = 'none'; }}
        onBlur={(e) => { (e.currentTarget.style as any).transform = 'translateY(-200%)'; }}
      >
        Skip to content
      </a>
      <header style={{ marginBottom: '2rem' }}>
        <a
          href="#primary-nav"
          style={{
            position: 'absolute', left: 8, top: 48, background: '#fff', color: '#0070f3',
            padding: '6px 10px', borderRadius: 4, transform: 'translateY(-200%)',
          }}
          onFocus={(e) => { (e.currentTarget.style as any).transform = 'none'; }}
          onBlur={(e) => { (e.currentTarget.style as any).transform = 'translateY(-200%)'; }}
        >
          Skip to navigation
        </a>
        <nav id="primary-nav" aria-label="Primary">
          <a href="/dashboard" aria-label="Go to Dashboard">Dashboard</a>
          <a href="/proxy-demo" aria-label="Open Proxy Demo" style={{ marginLeft: 12 }}>Proxy Demo</a>
          <a href="/onboard" aria-label="Creator Onboarding" style={{ marginLeft: 12 }}>Onboard</a>
          <a href="/analytics" aria-label="View Analytics" style={{ marginLeft: 12 }}>Analytics</a>
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
      <main id="main-content" tabIndex={-1}>{children}</main>
    </div>
  );
}
