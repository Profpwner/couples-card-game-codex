import React from 'react';
import Stars from './Stars';

export interface Review {
  review_id: string;
  user_id: string;
  rating: number;
  review_text?: string;
  created_at: string;
}

export function ReviewItem({ review }: { review: Review }) {
  return (
    <li style={{ borderTop: '1px solid #eee', padding: '8px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Stars rating={review.rating} />
        <span style={{ color: '#999' }}>{new Date(review.created_at).toLocaleDateString()}</span>
      </div>
      {review.review_text && <p style={{ marginTop: 4 }}>{review.review_text}</p>}
    </li>
  );
}

export default ReviewItem;

