import React from 'react';
import Stars from './Stars';

export interface MarketplaceCardProps {
  title: string;
  description?: string;
  averageRating?: number; // 0..5
  reviewsCount?: number;
  onClick?: () => void;
}

export default function MarketplaceCard({ title, description, averageRating = 0, reviewsCount = 0, onClick }: MarketplaceCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } }}
      aria-label={`View ${title}`}
      style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, cursor: 'pointer' }}
    >
      <h3 style={{ margin: '0 0 4px' }}>{title}</h3>
      {description && <p style={{ margin: '0 0 8px', color: '#555' }}>{description}</p>}
      <div aria-label={`Average rating ${Math.round(averageRating)} of 5`} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#666' }}>
        <Stars rating={averageRating} />
        <span>({reviewsCount})</span>
      </div>
    </article>
  );
}

