import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { path = [] } = req.query as { path?: string[] };
  const targetBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  const url = `${targetBase}/${Array.isArray(path) ? path.join('/') : path}`;
  try {
    const ax = axios.create({ validateStatus: () => true });
    const resp = await ax.request({ url, method: 'GET' });
    res.status(resp.status).json(resp.data);
  } catch (err: any) {
    res.status(500).json({ error: 'Proxy error', detail: err.message || String(err) });
  }
}

