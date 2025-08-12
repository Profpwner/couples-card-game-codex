import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { RequireAuth, useAuth } from '../components/AuthContext';
import AnalyticsCards, { Sales, Engagement } from '../components/AnalyticsCards';


export default function AnalyticsPage() {
  return (
    <RequireAuth>
      <Layout>
        <CreatorAnalytics />
      </Layout>
    </RequireAuth>
  );
}

function CreatorAnalytics() {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sales | null>(null);
  const [eng, setEng] = useState<Engagement | null>(null);
  const [err, setErr] = useState<string>('');

  useEffect(() => {
    const run = async () => {
      try {
        const [s, e] = await Promise.all([
          fetch(`/api/creator/analytics/sales?userId=${user?.userId}`).then(r => r.json()),
          fetch(`/api/creator/analytics/engagement?userId=${user?.userId}`).then(r => r.json()),
        ]);
        if (s.error) throw new Error(s.error);
        if (e.error) throw new Error(e.error);
        setSales({ packsSold: s.packsSold, revenueCents: s.revenueCents });
        setEng({ readers: e.readers, avgSessionSec: e.avgSessionSec });
      } catch (ex: any) {
        setErr(ex.message || 'Failed to fetch analytics');
      }
    };
    if (user?.userId) run();
  }, [user?.userId]);

  return (
    <div>
      <h1>Creator Analytics (Stub)</h1>
      {err && <p style={{ color: 'crimson' }}>{err}</p>}
      <AnalyticsCards sales={sales} eng={eng} />
    </div>
  );
}
