import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { RequireAuth, useAuth } from '../components/AuthContext';
import { useRouter } from 'next/router';

export default function OnboardPage() {
  return (
    <RequireAuth>
      <Layout>
        <OnboardForm />
      </Layout>
    </RequireAuth>
  );
}

function OnboardForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [payoutToken, setPayoutToken] = useState('test-payout-token');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (!user?.userId) return;
      try {
        const r = await fetch(`/api/creator/status?userId=${user.userId}`);
        const d = await r.json();
        if (d?.isCreator) {
          router.replace('/dashboard');
        }
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [user?.userId, router]);

  const submit = async () => {
    try {
      setStatus('Submitting...');
      const res = await fetch('/api/creator/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: user?.userId,
          displayName,
          payoutToken,
          termsAccepted,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Onboarding failed');
      setStatus('Onboarding successful');
      setTimeout(() => router.replace('/dashboard'), 800);
    } catch (e: any) {
      setStatus(`Failed: ${e.message}`);
    }
  };

  return (
    <div style={{ maxWidth: 520 }}>
      {loading && <p>Checking status…</p>}
      <h1>Creator Onboarding</h1>
      <label>Display Name</label>
      <input
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Your creator name"
        style={{ display: 'block', width: '100%', marginBottom: 12 }}
      />
      <label>Payout Token (stub)</label>
      <input
        value={payoutToken}
        onChange={(e) => setPayoutToken(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: 12 }}
      />
      <label style={{ display: 'block', marginBottom: 12 }}>
        <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} /> I agree to the Terms of Service
      </label>
      <button onClick={submit} disabled={!displayName || !payoutToken || !termsAccepted} aria-busy={status === "Submitting..."}>
        Complete Onboarding
      </button>
      <p role="status" aria-live="polite" style={{ marginTop: 12 }}>{status}</p>
    </div>
  );
}
