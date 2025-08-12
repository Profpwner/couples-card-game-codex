import React, { useMemo } from 'react';
import ReviewItem from './ReviewItem';
import type { Review } from './ReviewItem';

export interface ReviewsListProps {
  reviews: Review[];
  sort: 'newest' | 'highest' | 'lowest';
  visible: number;
}

export default function ReviewsList({ reviews, sort, visible }: ReviewsListProps) {
  const sorted = useMemo(() => {
    const arr = [...reviews];
    if (sort === 'highest') arr.sort((a,b) => b.rating - a.rating || Date.parse(b.created_at) - Date.parse(a.created_at));
    else if (sort === 'lowest') arr.sort((a,b) => a.rating - b.rating || Date.parse(b.created_at) - Date.parse(a.created_at));
    else arr.sort((a,b) => Date.parse(b.created_at) - Date.parse(a.created_at));
    return arr;
  }, [reviews, sort]);
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {sorted.slice(0, visible).map(r => (
        <ReviewItem key={r.review_id} review={r} />
      ))}
    </ul>
  );
}

