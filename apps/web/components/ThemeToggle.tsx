import React, { useEffect, useState } from 'react';

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const saved = window.localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') return saved as 'light' | 'dark';
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getInitialTheme());

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      window.localStorage.setItem('theme', theme);
    }
  }, [theme]);

  return (
    <button
      aria-label="Toggle color theme"
      onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
      style={{ marginLeft: 12 }}
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}

