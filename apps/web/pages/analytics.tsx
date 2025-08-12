import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { RequireAuth, useAuth } from '../components/AuthContext';
import AnalyticsCards, { Sales, Engagement } from '../components/AnalyticsCards';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { appFetch } from '../lib/appFetch';


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
  const [trend, setTrend] = useState<{ labels: string[]; sales: number[]; readers: number[] } | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const [s, e, t] = await Promise.all([
          appFetch(`/api/creator/analytics/sales?userId=${user?.userId}`).then(r => r.json()),
          appFetch(`/api/creator/analytics/engagement?userId=${user?.userId}`).then(r => r.json()),
          appFetch(`/api/creator/analytics/trends?userId=${user?.userId}`).then(r => r.json()),
        ]);
        if (s.error) throw new Error(s.error);
        if (e.error) throw new Error(e.error);
        setSales({ packsSold: s.packsSold, revenueCents: s.revenueCents });
        setEng({ readers: e.readers, avgSessionSec: e.avgSessionSec });
        setTrend(t);
      } catch (ex: any) {
        setErr(ex.message || 'Failed to fetch analytics');
      }
    };
    if (user?.userId) run();
  }, [user?.userId]);

  return (
    <div>
      <h1>Creator Analytics</h1>
      {err && <p style={{ color: 'crimson' }}>{err}</p>}
      <AnalyticsCards sales={sales} eng={eng} />
      {sales && eng && (
        <div style={{ marginTop: 24 }}>
          <AnalyticsCharts packsSold={sales.packsSold} revenueCents={sales.revenueCents} readers={eng.readers} avgSessionSec={eng.avgSessionSec} />
        </div>
      )}
      {trend && (
        <div style={{ marginTop: 24 }}>
          <h3>Weekly Trends</h3>
          <table style={{ borderCollapse: 'collapse' }}>
            <thead><tr>{trend.labels.map((l, i) => <th key={i} style={{ borderBottom: '1px solid #ccc', padding: 4 }}>{l}</th>)}</tr></thead>
            <tbody>
              <tr>{trend.sales.map((v, i) => <td key={i} style={{ padding: 4, textAlign: 'center' }}>{v}</td>)}</tr>
              <tr>{trend.readers.map((v, i) => <td key={i} style={{ padding: 4, textAlign: 'center' }}>{v}</td>)}</tr>
            </tbody>
          </table>
          <button style={{ marginTop: 8 }} onClick={() => exportCSV(trend!)}>Export CSV</button>
        </div>
      )}
    </div>
  );
}
