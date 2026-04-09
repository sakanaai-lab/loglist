import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { checkPassword } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const postResult = await db.execute({ sql: 'SELECT * FROM posts WHERE id = ?', args: [Number(id)] });
  const post = postResult.rows[0];
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const messagesResult = await db.execute({ sql: 'SELECT * FROM messages WHERE post_id = ? ORDER BY position', args: [Number(id)] });
  return NextResponse.json({ post: { ...post, messages: messagesResult.rows } });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  if (!checkPassword(body?.password)) {
    return NextResponse.json({ error: 'パスワードが違います' }, { status: 401 });
  }

  const db = getDb();
  const result = await db.execute({ sql: 'DELETE FROM posts WHERE id = ?', args: [Number(id)] });
  if (result.rowsAffected === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
