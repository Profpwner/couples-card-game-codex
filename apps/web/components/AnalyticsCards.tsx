import React from 'react';

export interface Sales { packsSold: number; revenueCents: number }
export interface Engagement { readers: number; avgSessionSec: number }

export function AnalyticsCards({ sales, eng }: { sales: Sales | null; eng: Engagement | null }) {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <section style={{ padding: 12, border: '1px solid #ddd' }}>
        <h3>Sales</h3>
        {sales ? (
          <ul>
            <li>Packs sold: {sales.packsSold}</li>
            <li>Revenue: ${(sales.revenueCents / 100).toFixed(2)}</li>
          </ul>
        ) : (
          <p>Loading…</p>
        )}
      </section>
      <section style={{ padding: 12, border: '1px solid #ddd' }}>
        <h3>Engagement</h3>
        {eng ? (
          <ul>
            <li>Readers: {eng.readers}</li>
            <li>Avg session: {eng.avgSessionSec}s</li>
          </ul>
        ) : (
          <p>Loading…</p>
        )}
      </section>
    </div>
  );
}

export default AnalyticsCards;

