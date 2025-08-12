export interface ReviewPayload {
  packId: string;
  rating: number;
  reviewText?: string;
}

export async function postReviewViaProxy(payload: ReviewPayload) {
  const res = await appFetch(`/api/creator/packs/${payload.packId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ rating: payload.rating, reviewText: payload.reviewText }),
  });
  if (!res.ok) throw new Error('Failed to post review');
  return res.json();
}

export async function followCreatorViaProxy(creatorId: string) {
  const res = await appFetch(`/api/creator/creators/${creatorId}/follow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to follow');
  return res.json();
}

export async function unfollowCreatorViaProxy(creatorId: string) {
  const res = await appFetch(`/api/creator/creators/${creatorId}/follow`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to unfollow');
  return res.json();
}

export async function submitPackViaProxy(packId: string) {
  const res = await appFetch(`/api/creator/packs/${packId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to submit pack');
  return res.json();
}

export async function listPacksViaMarketplaceProxy() {
  const res = await appFetch(`/api/marketplace/packs`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch packs');
  return res.json();
}

export async function fetchPackViaMarketplaceProxy(packId: string) {
  const res = await appFetch(`/api/marketplace/packs/${packId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch pack');
  return res.json();
}

export async function fetchReviewsViaCreatorProxy(packId: string) {
  const res = await appFetch(`/api/creator/packs/${packId}/reviews`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

export async function getFollowStatusViaProxy(creatorId: string, userId: string) {
  const url = `/api/creator/creators/${creatorId}/follow?userId=${encodeURIComponent(userId)}`;
  const res = await appFetch(url, { method: 'GET', credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch follow status');
  const json = await res.json();
  return !!json?.isFollowing;
}
