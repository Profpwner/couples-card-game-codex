import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth, RequireAuth } from '../../components/AuthContext';
import Stars from '../../components/Stars';
import { fetchCreatorProfileViaProxy, getFollowStatusViaProxy, followCreatorViaProxy, unfollowCreatorViaProxy } from '../../lib/proxyClient';

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

  useEffect(() => {
    const run = async () => {
      try {
        setErr('');
        const p = await fetchCreatorProfileViaProxy(id);
        setProfile(p);
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
          <div style={{ margin: '8px 0' }}>
            <strong>Followers:</strong> {profile.followers} &nbsp;|&nbsp; <strong>Avg Rating:</strong> <Stars rating={profile.avg_rating} />
          </div>
          <button onClick={toggleFollow} disabled={busy} aria-pressed={isFollowing}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
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
