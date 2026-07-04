import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// POST /api/revalidate
// Body: { "path": "/post/<conversation_id>" } OR { "conversationId": "<id>" }
// Busts the ISR cache for the given post page so a regenerated article is
// visible immediately. Guarded by a shared secret so it can't be abused.
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    let path = body.path;
    if (!path && body.conversationId) {
      path = `/post/${body.conversationId}`;
    }
    if (!path || typeof path !== 'string' || !path.startsWith('/post/')) {
      return NextResponse.json({ success: false, detail: 'A valid `path` starting with /post/ or a `conversationId` is required' }, { status: 400 });
    }

    const token = request.headers.get('x-revalidate-token') || '';
    const expected = process.env.REVALIDATE_TOKEN;
    if (expected && token !== expected) {
      return NextResponse.json({ success: false, detail: 'Unauthorized' }, { status: 401 });
    }

    revalidatePath(path);
    return NextResponse.json({ success: true, revalidated: path });
  } catch (err) {
    console.error('Revalidate failed:', err);
    return NextResponse.json({ success: false, detail: String(err && err.message || err) }, { status: 500 });
  }
}