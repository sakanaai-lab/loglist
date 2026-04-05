import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { checkPassword } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(Number(id));
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const messages = db
    .prepare('SELECT * FROM messages WHERE post_id = ? ORDER BY position')
    .all(Number(id));

  return NextResponse.json({ post: { ...post, messages } });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  if (!checkPassword(body?.password)) {
    return NextResponse.json({ error: 'パスワードが違います' }, { status: 401 });
  }

  const db = getDb();
  const result = db.prepare('DELETE FROM posts WHERE id = ?').run(Number(id));
  if (result.changes === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
