import axios from 'axios';

const api = axios.create({ baseURL: process.env.API_BASE_URL ?? 'http://localhost:5000' });

export interface PackSummary {
  pack_id: string;
  title: string;
}

export interface PackDetail extends PackSummary {
  creator_id: string;
  description?: string;
  created_at: string;
}

export async function fetchPacks(): Promise<PackSummary[]> {
  const res = await api.get<PackSummary[]>('/packs');
  return res.data;
}

export async function fetchPackDetail(packId: string): Promise<PackDetail> {
  const res = await api.get<PackDetail>(`/packs/${packId}`);
  return res.data;
}
export interface Review {
  review_id: string;
  user_id: string;
  rating: number;
  review_text?: string;
  created_at: string;
}

export async function fetchReviews(packId: string): Promise<Review[]> {
  const res = await api.get<Review[]>(`/packs/${packId}/reviews`);
  return res.data;
}

export async function postReview(packId: string, userId: string, rating: number, reviewText?: string): Promise<Review> {
  const res = await api.post<Review>(`/packs/${packId}/reviews`, { userId, rating, reviewText });
  return res.data;
}

export async function followCreator(creatorId: string, userId: string): Promise<void> {
  await api.post(`/creators/${creatorId}/follow`, { userId });
}

export async function unfollowCreator(creatorId: string, userId: string): Promise<void> {
  await api.delete(`/creators/${creatorId}/follow`, { data: { userId } });
}

export async function getFollowStatus(creatorId: string, userId: string): Promise<boolean> {
  const res = await api.get<{ isFollowing: boolean }>(`/creators/${creatorId}/follow`, { params: { userId } });
  return res.data.isFollowing;
}