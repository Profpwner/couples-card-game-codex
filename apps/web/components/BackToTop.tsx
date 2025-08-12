import React, { useEffect, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  if (!visible) return null;
  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      style={{ position: 'fixed', right: 16, bottom: 16, padding: '10px 12px', borderRadius: 20 }}
    >
      ↑ Top
    </button>
  );
}

