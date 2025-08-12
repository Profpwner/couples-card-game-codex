import React, { useMemo, useState } from 'react';
import MarketplaceCard from './MarketplaceCard';

export interface PackSummary { pack_id: string; title: string }

export default function MarketplaceListPanel({ packs }: { packs: PackSummary[] }) {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'newest' | 'title'>('newest');
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let items = packs;
    if (term) items = items.filter(p => p.title.toLowerCase().includes(term));
    if (sort === 'title') items = [...items].sort((a,b) => a.title.localeCompare(b.title));
    return items;
  }, [packs, q, sort]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h1>Marketplace</h1>
        <div>
          <input placeholder="Search packs" value={q} onChange={e => setQ(e.target.value)} />
          <select value={sort} onChange={e => setSort(e.target.value as any)} style={{ marginLeft: 8 }}>
            <option value="newest">Newest</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {filtered.map(p => (
          <MarketplaceCard key={p.pack_id} title={p.title} averageRating={0} reviewsCount={0} />
        ))}
      </div>
      {filtered.length === 0 && <p>No packs found.</p>}
    </div>
  );
}
