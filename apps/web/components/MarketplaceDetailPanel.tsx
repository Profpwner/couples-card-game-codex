import React, { useMemo, useState } from 'react';
import Stars from './Stars';
import ReviewsHistogram from './ReviewsHistogram';
import ReviewsList from './ReviewsList';
import type { Review } from './ReviewItem';
import FollowButton from './FollowButton';

export interface MarketplaceDetailPanelProps {
  title: string;
  description?: string;
  createdAt?: string;
  reviews: Review[];
  initialSort?: 'newest' | 'highest' | 'lowest';
  initialVisible?: number;
  following?: boolean;
  followDisabled?: boolean;
}

export default function MarketplaceDetailPanel({
  title,
  description,
  createdAt,
  reviews,
  initialSort = 'newest',
  initialVisible = 5,
  following = false,
  followDisabled = false,
}: MarketplaceDetailPanelProps) {
  const [sort, setSort] = useState<'newest' | 'highest' | 'lowest'>(initialSort);
  const [visible, setVisible] = useState(initialVisible);
  const avg = useMemo(() => (reviews.length ? reviews.reduce((a, b) => a + (b.rating || 0), 0) / reviews.length : 0), [reviews]);
  const ratings = useMemo(() => reviews.map(r => r.rating), [reviews]);

  return (
    <div>
      <h1>{title}</h1>
      {createdAt && <p style={{ color: '#666' }}>{new Date(createdAt).toLocaleString()}</p>}
      {description && <p>{description}</p>}
      <div style={{ margin: '8px 0' }}>
        <strong>Average Rating:</strong> <Stars rating={avg} /> ({reviews.length})
      </div>
      <ReviewsHistogram ratings={ratings} />
      <div style={{ margin: '8px 0' }}>
        <FollowButton following={following} disabled={followDisabled} />
      </div>
      <h2>Reviews</h2>
      <div style={{ marginBottom: 8 }}>
        <label>Sort:&nbsp;</label>
        <select value={sort} onChange={e => { setSort(e.target.value as any); setVisible(initialVisible); }}>
          <option value="newest">Newest</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>
      <ReviewsList reviews={reviews} sort={sort} visible={visible} />
      {visible < reviews.length && (
        <button onClick={() => setVisible(v => v + 5)} style={{ marginTop: 8 }}>Load more</button>
      )}
    </div>
  );
}

