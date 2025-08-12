import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path = [] } = req.query as { path?: string[] };
  const targetBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  const url = `${targetBase}/${Array.isArray(path) ? path.join('/') : path}`;
  try {
    const accessToken = req.cookies['access_token'];
    const headers: Record<string, string> = {};
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    // Forward JSON body directly
    const ax = axios.create({ validateStatus: () => true });
    const resp = await ax.request({
      url,
      method: req.method,
      headers,
      data: req.body,
    });
    res.status(resp.status).json(resp.data);
  } catch (err: any) {
    res.status(500).json({ error: 'Proxy error', detail: err.message || String(err) });
  }
}
