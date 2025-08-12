import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth, RequireAuth } from '../../components/AuthContext';
import Stars from '../../components/Stars';
import { fetchCreatorProfileViaProxy, getFollowStatusViaProxy, followCreatorViaProxy, unfollowCreatorViaProxy } from '../../lib/proxyClient';
import { appFetch } from '../../lib/appFetch';
import ReviewsHistogram from '../../components/ReviewsHistogram';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function CreatorPage() {
  return (
    <RequireAuth>
      <Layout>
        <CreatorProfile />
      </Layout>
    </RequireAuth>
  );
}

function CreatorProfile() {
  const router = useRouter();
  const { user } = useAuth();
  const id = (router.query.id as string) || '';
  const [profile, setProfile] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [hist, setHist] = useState<{ counts: Record<number, number> } | null>(null);
  const [trend, setTrend] = useState<{ labels: string[]; followers: number[] } | null>(null);
  const [days, setDays] = useState<number>(7);

  useEffect(() => {
    const run = async () => {
      try {
        setErr('');
        const p = await fetchCreatorProfileViaProxy(id);
        setProfile(p);
        // fetch histogram and follows trend
        const [h, tr] = await Promise.all([
          appFetch(`/api/creator/creators/${id}/reviews/summary`).then(r => r.json()).catch(() => null),
          appFetch(`/api/creator/creators/${id}/follows/trends?days=${days}`).then(r => r.json()).catch(() => null),
        ]);
        if (h) setHist(h);
        if (tr) setTrend(tr);
        if (user?.userId) {
          const f = await getFollowStatusViaProxy(id, user.userId);
          setIsFollowing(f);
        }
      } catch (e: any) {
        setErr(e.message || 'Failed to load profile');
      }
    };
    if (id) run();
  }, [id, user?.userId]);

  const toggleFollow = async () => {
    try {
      setBusy(true);
      if (isFollowing) await unfollowCreatorViaProxy(id);
      else await followCreatorViaProxy(id);
      setIsFollowing(!isFollowing);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1>Creator Profile</h1>
      {err && <p style={{ color: 'crimson' }}>{err}</p>}
      {!profile ? (
        <p>Loading…</p>
      ) : (
        <div>
          <h2>{profile.display_name}</h2>
          {profile.bio && <p style={{ maxWidth: 640 }}>{profile.bio}</p>}

          <div style={{ margin: '6px 0', color: '#444' }}>
            <strong>Average:</strong> {profile.avg_rating?.toFixed ? profile.avg_rating.toFixed(1) : profile.avg_rating} ({(hist ? Object.values(hist.counts).reduce((a as number,b as number)=>a+b,0) : 0) as any} ratings)
          </div>
          <label>Followers range: <select value={days} onChange={e => setDays(parseInt(e.target.value,10))}><option value={7}>7d</option><option value={14}>14d</option><option value={30}>30d</option></select></label>

          <div style={{ margin: '8px 0' }}>
            <strong>Followers:</strong> {profile.followers} &nbsp;|&nbsp; <strong>Avg Rating:</strong> <Stars rating={profile.avg_rating} />
          </div>
          <button onClick={toggleFollow} disabled={busy} aria-pressed={isFollowing}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
          
          {hist && (
            <div style={{ marginTop: 16 }}>
              <h3>Ratings Histogram</h3>
              <ReviewsHistogram ratings={[...(new Array(hist.counts[5]).fill(5)), ...(new Array(hist.counts[4]).fill(4)), ...(new Array(hist.counts[3]).fill(3)), ...(new Array(hist.counts[2]).fill(2)), ...(new Array(hist.counts[1]).fill(1))]} />
            </div>
          )}
          {trend && (
            <div style={{ marginTop: 16 }}>
              <h3>Follower Trend</h3>
              <Line data={{ labels: trend.labels, datasets: [{ label: 'Followers', data: trend.followers, borderColor: '#0b5fff', backgroundColor: 'rgba(11,95,255,0.2)' }] }} options={{ plugins: { legend: { display: false } } }} />
            </div>
          )}
          <div style={{ marginTop: 8 }}>
            <a href={`mailto:support@example.com?subject=Report Creator ${profile.display_name}`}>Report creator</a>
            <span style={{ marginLeft: 12 }} />
            <a href={`mailto:${profile.display_name.replace(/\s+/g,'').toLowerCase()}@example.com?subject=Message from marketplace`}>Message creator</a>
          </div>
          <h3 style={{ marginTop: 24 }}>Packs</h3>
          <ul>
            {profile.packs?.map((p: any) => (
              <li key={p.pack_id}><a href={`/marketplace/${p.pack_id}`}>{p.title}</a></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
