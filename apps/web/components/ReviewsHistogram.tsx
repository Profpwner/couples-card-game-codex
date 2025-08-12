import React, { useMemo } from 'react';

export interface ReviewHistogramProps {
  ratings: number[]; // array of rating values (1..5)
}

export default function ReviewsHistogram({ ratings }: ReviewHistogramProps) {
  const counts = useMemo(() => {
    const c = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>;
    for (const r of ratings) {
      if (r >= 1 && r <= 5) c[r as 1|2|3|4|5]++;
    }
    return c;
  }, [ratings]);
  const total = ratings.length || 1;
  const bar = (value: number) => ({
    width: `${Math.round((value / total) * 100)}%`,
    background: '#4caf50',
    height: 8,
    borderRadius: 4,
  } as React.CSSProperties);
  const row = (label: string, value: number) => (
    <div key={label} style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
      <span style={{ width: 42 }}>{label}</span>
      <div style={{ flex: 1, background: '#eee', height: 8, borderRadius: 4, marginRight: 8 }}>
        <div style={bar(value)} />
      </div>
      <span style={{ width: 24, textAlign: 'right', color: '#666' }}>{value}</span>
    </div>
  );
  return (
    <div aria-label="Ratings histogram">
      {row('5★', counts[5])}
      {row('4★', counts[4])}
      {row('3★', counts[3])}
      {row('2★', counts[2])}
      {row('1★', counts[1])}
    </div>
  );
}

