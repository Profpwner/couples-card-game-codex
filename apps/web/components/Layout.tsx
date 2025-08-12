import React, { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/router';
import ThemeToggle from './ThemeToggle';
import BackToTop from './BackToTop';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const path = router?.pathname || '';
  const [showHelp, setShowHelp] = React.useState(false);
  const [pageAnnounce, setPageAnnounce] = React.useState('');
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target as any).isContentEditable)) return;
      if (e.key === '/') {
        const el = document.querySelector<HTMLElement>('[data-key-focus="search"]');
        if (el) { e.preventDefault(); el.focus(); }
      }
      if (e.altKey && e.shiftKey && (e.key.toLowerCase() === 'n')) {
        const nav = document.getElementById('primary-nav');
        if (nav) { (nav as HTMLElement).focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    const onQ = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName==='INPUT' || target.tagName==='TEXTAREA' || (target as any).isContentEditable)) return;
      if (e.key === '?') { e.preventDefault(); setShowHelp(true); }
    };
    window.addEventListener('keydown', onQ);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('keydown', onQ); };
  }, []);

  React.useEffect(() => {
    const handleRouteChange = () => {
      const main = document.getElementById('main-content') as HTMLElement | null;
      if (main) main.focus();
      const title = document.title || path || 'Page changed';
      setPageAnnounce(`Navigated to ${title}`);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => { router.events.off('routeChangeComplete', handleRouteChange); };
  }, [router.events, path]);
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
          <a href="/dashboard" aria-label="Go to Dashboard" aria-current={path === '/dashboard' ? 'page' : undefined}>Dashboard</a>
          <a href="/proxy-demo" aria-label="Open Proxy Demo" aria-current={path === '/proxy-demo' ? 'page' : undefined} style={{ marginLeft: 12 }}>Proxy Demo</a>
          <a href="/onboard" aria-label="Creator Onboarding" aria-current={path === '/onboard' ? 'page' : undefined} style={{ marginLeft: 12 }}>Onboard</a>
          <a href="/analytics" aria-label="View Analytics" aria-current={path === '/analytics' ? 'page' : undefined} style={{ marginLeft: 12 }}>Analytics</a>
          <button aria-label="Open keyboard shortcuts help" title="Keyboard shortcuts (?)" style={{ marginLeft: 12 }} onClick={() => setShowHelp(true)}>?</button>
          <span style={{ marginLeft: 16 }} />
          {isAuthenticated ? (
            <>
              <span style={{ color: '#555' }}>
                Signed in as {user?.userId} {user?.isCreator ? '(Creator)' : ''}
              </span>
              <button style={{ marginLeft: 12 }} onClick={logout}>Logout</button>
              <ThemeToggle />
            </>
          ) : (
            <a href="/login">Login</a>
          )}
        </nav>
      </header>
      <div className="sr-only" aria-live="polite">{pageAnnounce}</div>
      <main id="main-content" tabIndex={-1}>{children}</main>
      <BackToTop />
      <KeyboardShortcutsHelp visible={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
