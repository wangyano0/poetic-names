import { NextRequest } from 'next/server';
export const runtime = 'nodejs';

// 轻量翻译接口（懒加载调用）：优先使用 LibreTranslate 公共服务
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text: string = String(body.text || '').trim();
    const target: string = (body.target || 'en').toString();
    if (!text) return Response.json({ ok: false, error: 'text required' }, { status: 400 });

    // 请求 LibreTranslate 公共服务
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    try {
      const res = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: { 'accept': 'application/json', 'content-type': 'application/json' },
        body: JSON.stringify({ q: text, source: 'zh', target, format: 'text' }),
        signal: controller.signal
      });
      clearTimeout(timer);
      if (!res.ok) {
        return Response.json({ ok: false, error: `upstream ${res.status}` }, { status: 200 });
      }
      const data = await res.json();
      const translated = (data?.translatedText || '').toString();
      return Response.json({ ok: true, data: translated });
    } catch (e) {
      clearTimeout(timer);
      return Response.json({ ok: false, error: 'translate_failed' }, { status: 200 });
    }
  } catch (e) {
    return Response.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }
}


