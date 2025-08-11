import React from 'react';

export function Stars({ rating, outOf = 5, size = 18 }: { rating: number; outOf?: number; size?: number }) {
  const full = Math.round(Math.max(0, Math.min(outOf, rating)));
  const empty = Math.max(0, outOf - full);
  const style: React.CSSProperties = { fontSize: size, color: '#f5a623' };
  return (
    <span aria-label={`Rating ${full} of ${outOf}`} style={style}>
      {'★'.repeat(full)}{'☆'.repeat(empty)}
    </span>
  );
}

export default Stars;

