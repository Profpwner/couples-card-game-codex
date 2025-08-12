import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { listPacksViaMarketplaceProxy } from '../../lib/proxyClient';

interface PackSummary { pack_id: string; title: string }

export default function MarketplaceListPage() {
  const [packs, setPacks] = useState<PackSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'title' | 'newest'>('newest');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await listPacksViaMarketplaceProxy();
        if (alive) setPacks(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (alive) setError(e.message || 'Failed to load');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let items = packs;
    if (term) items = items.filter(p => p.title.toLowerCase().includes(term));
    if (sort === 'title') items = [...items].sort((a,b) => a.title.localeCompare(b.title));
    // newest ordering is returned by backend already
    return items;
  }, [packs, q, sort]);

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Marketplace</h1>
        <div>
          <input placeholder="Search packs" aria-label="Search packs" data-key-focus="search" value={q} onChange={e => setQ(e.target.value)} />
          <select value={sort} onChange={e => setSort(e.target.value as any)} style={{ marginLeft: 8 }}>
            <option value="newest">Newest</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}
      {!loading && !error && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filtered.map(p => (
            <li key={p.pack_id} style={{ padding: 12, border: '1px solid #eee', marginBottom: 8 }}>
              <Link href={`/marketplace/${p.pack_id}`}>{p.title}</Link>
            </li>
          ))}
          {filtered.length === 0 && <li>No packs found.</li>}
        </ul>
      )}
    </Layout>
  );
}
