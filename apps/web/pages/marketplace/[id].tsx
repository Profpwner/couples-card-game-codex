import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../components/AuthContext';
import {
  fetchPackViaMarketplaceProxy,
  fetchReviewsViaCreatorProxy,
  getFollowStatusViaProxy,
  followCreatorViaProxy,
  unfollowCreatorViaProxy,
  postReviewViaProxy,
} from '../../lib/proxyClient';
import Stars from '../../components/Stars';
import ReviewItem, { Review as ReviewModel } from '../../components/ReviewItem';
import ReviewsHistogram from '../../components/ReviewsHistogram';

interface PackDetail { pack_id: string; creator_id: string; title: string; description?: string; created_at: string }
interface Review { review_id: string; user_id: string; rating: number; review_text?: string; created_at: string }

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return <span aria-label={`Rating ${full} of 5`}>{'★'.repeat(full)}{'☆'.repeat(5-full)}</span>;
}

export default function MarketplaceDetailPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const { user } = useAuth();
  const [pack, setPack] = useState<PackDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sort, setSort] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [visible, setVisible] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [reviewBusy, setReviewBusy] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const [p, r] = await Promise.all([
          fetchPackViaMarketplaceProxy(id),
          fetchReviewsViaCreatorProxy(id),
        ]);
        if (!alive) return;
        setPack(p);
        setReviews(Array.isArray(r) ? r : []);
        if (user?.userId && p?.creator_id) {
          try {
            const f = await getFollowStatusViaProxy(p.creator_id, user.userId);
            if (alive) setIsFollowing(f);
          } catch {}
        }
      } catch (e: any) {
        if (alive) setError(e.message || 'Failed to load');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id, user?.userId]);

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((a, b) => a + (b.rating || 0), 0) / reviews.length;
  }, [reviews]);

  const sorted = useMemo(() => {
    const arr = [...reviews];
    if (sort === 'highest') arr.sort((a,b) => b.rating - a.rating || Date.parse(b.created_at) - Date.parse(a.created_at));
    else if (sort === 'lowest') arr.sort((a,b) => a.rating - b.rating || Date.parse(b.created_at) - Date.parse(a.created_at));
    // newest default: created_at DESC (already by API) but ensure
    else arr.sort((a,b) => Date.parse(b.created_at) - Date.parse(a.created_at));
    return arr;
  }, [reviews, sort]);

  const toggleFollow = async () => {
    if (!pack?.creator_id || !user?.userId) return;
    setFollowBusy(true);
    try {
      if (isFollowing) await unfollowCreatorViaProxy(pack.creator_id);
      else await followCreatorViaProxy(pack.creator_id);
      setIsFollowing(!isFollowing);
    } catch (e) {
      console.error(e);
    } finally {
      setFollowBusy(false);
    }
  };

  const submitReview = async () => {
    if (!id) return;
    setReviewBusy(true);
    try {
      await postReviewViaProxy({ packId: id, rating, reviewText });
      // refresh reviews
      const r = await fetchReviewsViaCreatorProxy(id);
      setReviews(Array.isArray(r) ? r : []);
      setReviewText('');
      setRating(5);
      setToast('Review posted!');
      setTimeout(() => setToast(null), 1500);
    } catch (e) {
      console.error(e);
    } finally {
      setReviewBusy(false);
    }
  };

  return (
    <Layout>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}
      {pack && (
        <div>
          <h1>{pack.title}</h1>
          <p style={{ color: '#666' }}>{new Date(pack.created_at).toLocaleString()}</p>
          {pack.description && <p>{pack.description}</p>}
          <div style={{ margin: '8px 0' }}>
            <strong>Average Rating:</strong> <Stars rating={avgRating} /> ({reviews.length})
          </div>
          <ReviewsHistogram ratings={reviews.map(r => r.rating)} />
          {toast && (
            <div role="status" aria-live="polite" style={{ position: 'fixed', right: 16, bottom: 16, background: '#333', color: '#fff', padding: '8px 12px', borderRadius: 6 }}>
              {toast}
            </div>
          )}
          <div style={{ margin: '8px 0' }}>
            <button onClick={toggleFollow} disabled={!user?.userId || followBusy}>
              {isFollowing ? 'Unfollow Creator' : 'Follow Creator'}
            </button>
            {!user?.userId && <span style={{ marginLeft: 8, color: '#888' }}>(login to follow)</span>}
          </div>

          <hr />
          <h2>Reviews</h2>
          <div style={{ marginBottom: 8 }}>
            <label>Sort:&nbsp;</label>
            <select value={sort} onChange={e => { setSort(e.target.value as any); setVisible(5); }}>
              <option value="newest">Newest</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>
          <div style={{ margin: '12px 0' }}>
            <label style={{ marginRight: 8 }}>Your Rating:</label>
            <select value={rating} onChange={e => setRating(Number(e.target.value))}>
              {[5,4,3,2,1].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <br />
            <textarea
              placeholder="Write your thoughts (optional)"
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              style={{ width: '100%', height: 80, marginTop: 8 }}
            />
            <div style={{ marginTop: 8 }}>
              <button onClick={submitReview} disabled={reviewBusy || !user?.userId}>
                Post Review
              </button>
              {!user?.userId && <span style={{ marginLeft: 8, color: '#888' }}>(login to review)</span>}
            </div>
          </div>

          {sorted.length === 0 && <p>No reviews yet.</p>}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {sorted.slice(0, visible).map((r: ReviewModel) => (
              <ReviewItem key={r.review_id} review={r} />
            ))}
          </ul>
          {visible < sorted.length && (
            <button onClick={() => setVisible(v => v + 5)} style={{ marginTop: 8 }}>Load more</button>
          )}
        </div>
      )}
    </Layout>
  );
}
