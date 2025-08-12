import axios from 'axios';

// Lazily create axios instance so tests can mock axios.create before usage
export const getApi = () =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  });

export interface PackSummary {
  pack_id: string;
  title: string;
}

export async function fetchPacks(): Promise<PackSummary[]> {
  const res = await getApi().get<PackSummary[]>('/packs');
  return res.data;
}
