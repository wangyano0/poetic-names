import { NextRequest } from 'next/server';
export const runtime = 'nodejs';
import { searchWorks } from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const query = String(body.query || '').trim();
  const limit = Math.max(1, Math.min(50, Number(body.size) || 20));
  const sources: string[] = Array.isArray(body.sources) ? body.sources : [];
  if (!query) {
    return new Response(JSON.stringify({ ok: false, error: 'query required' }), { status: 400 });
  }
  const rows = searchWorks(query, limit, sources);
  return Response.json({ ok: true, data: rows });
}


