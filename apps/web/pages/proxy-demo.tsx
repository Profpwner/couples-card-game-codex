import React, { useState } from 'react';
import Layout from '../components/Layout';
import { postReviewViaProxy, followCreatorViaProxy, unfollowCreatorViaProxy } from '../lib/proxyClient';
import { RequireAuth } from '../components/AuthContext';

export default function ProxyDemo() {
  const [packId, setPackId] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [message, setMessage] = useState('');

  const submitReview = async () => {
    try {
      const res = await postReviewViaProxy({ packId, rating, reviewText });
      setMessage(`Review posted: ${res.review_id || 'ok'}`);
    } catch (e: any) {
      setMessage(`Error: ${e.message}`);
    }
  };

  const follow = async () => {
    try {
      const res = await followCreatorViaProxy(creatorId);
      setMessage(res.message || 'Followed');
    } catch (e: any) {
      setMessage(`Error: ${e.message}`);
    }
  };

  const unfollow = async () => {
    try {
      const res = await unfollowCreatorViaProxy(creatorId);
      setMessage(res.message || 'Unfollowed');
    } catch (e: any) {
      setMessage(`Error: ${e.message}`);
    }
  };

  return (
    <RequireAuth>
      <Layout>
        <h1>Creator API Proxy Demo</h1>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <section>
            <h2>Post Review</h2>
            <div>
              <label>Pack ID: </label>
              <input value={packId} onChange={e => setPackId(e.target.value)} />
            </div>
            <div>
              <label>Rating: </label>
              <input type="number" min={1} max={5} value={rating} onChange={e => setRating(parseInt(e.target.value, 10))} />
            </div>
            <div>
              <label>Review: </label>
              <input value={reviewText} onChange={e => setReviewText(e.target.value)} />
            </div>
            <button onClick={submitReview}>Submit Review</button>
          </section>

          <section>
            <h2>Follow/Unfollow Creator</h2>
            <div>
              <label>Creator ID: </label>
              <input value={creatorId} onChange={e => setCreatorId(e.target.value)} />
            </div>
            <button onClick={follow}>Follow</button>
            <button onClick={unfollow} style={{ marginLeft: 8 }}>Unfollow</button>
          </section>
        </div>
        {message && <p style={{ marginTop: 16 }}>{message}</p>}
      </Layout>
    </RequireAuth>
  );
}
