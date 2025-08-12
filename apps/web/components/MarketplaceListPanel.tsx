import React, { useMemo, useState } from 'react';

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
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filtered.map(p => (
          <li key={p.pack_id} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
            {p.title}
          </li>
        ))}
      </ul>
      {filtered.length === 0 && <p>No packs found.</p>}
    </div>
  );
}

