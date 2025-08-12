import React from 'react';

function buildGoogleAuthUrl() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const redirectUri = `${typeof window !== 'undefined' ? window.location.origin : ''}/oauth/google/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

function buildAppleAuthUrl() {
  const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || '';
  const redirectUri = `${typeof window !== 'undefined' ? window.location.origin : ''}/oauth/apple/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'name email',
  });
  return `https://appleid.apple.com/auth/authorize?${params.toString()}`;
}

export default function LoginPage() {
  const googleUrl = buildGoogleAuthUrl();
  const appleUrl = buildAppleAuthUrl();
  return (
    <div style={{ padding: 24 }}>
      <h1>Login</h1>
      <p>Login with your provider:</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <a href={googleUrl} style={{ padding: '8px 12px', border: '1px solid #ccc' }}>Continue with Google</a>
        <a href={appleUrl} style={{ padding: '8px 12px', border: '1px solid #ccc' }}>Continue with Apple</a>
      </div>
      <p style={{ marginTop: 16, color: '#666' }}>
        After successful login, you will be redirected back and your session will be established via secure HttpOnly cookies.
      </p>
    </div>
  );
}
