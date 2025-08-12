import { toast } from 'react-hot-toast';

export async function appFetch(input: RequestInfo | URL, init?: RequestInit) {
  try {
    const res = await fetch(input, init);
    if (!res.ok) {
      const text = await safeText(res);
      const msg = extractErrorMessage(text) || `Request failed (${res.status})`;
      toast.error(msg);
      throw new Error(msg);
    }
    return res;
  } catch (e: any) {
    toast.error(e?.message || 'Network error');
    throw e;
  }
}

async function safeText(res: Response) {
  try { return await res.text(); } catch { return ''; }
}

function extractErrorMessage(text: string) {
  try { const j = JSON.parse(text); return (j as any)?.error || (j as any)?.message; } catch { return text; }
}
