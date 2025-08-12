import React, { useEffect, useState } from 'react';

export default function GoogleCallback() {
  const [status, setStatus] = useState('Exchanging code...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const redirectUri = `${window.location.origin}/oauth/google/callback`;
    const authBase = process.env.NEXT_PUBLIC_AUTH_BASE_URL || 'http://localhost:4000/api';
    if (!code) {
      setStatus('Missing code parameter');
      return;
    }
    fetch(`${authBase}/auth/oauth/google/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code, redirectUri }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          window.location.replace('/dashboard');
        } else {
          setStatus(`Login failed: ${data.error || 'Unknown error'}`);
        }
      })
      .catch(err => setStatus(`Login failed: ${String(err)}`));
  }, []);

  return <div style={{ padding: 24 }}>{status}</div>;
}
