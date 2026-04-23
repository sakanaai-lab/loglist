import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const postResult = await db.execute({ sql: 'SELECT * FROM posts WHERE id = ?', args: [Number(id)] });
  const post = postResult.rows[0];
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const messagesResult = await db.execute({ sql: 'SELECT * FROM messages WHERE post_id = ? ORDER BY position', args: [Number(id)] });
  return NextResponse.json({ post: { ...post, messages: messagesResult.rows } });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // 認証はmiddlewareで処理済み
  const { id } = await params;
  const db = getDb();
  const result = await db.execute({ sql: 'DELETE FROM posts WHERE id = ?', args: [Number(id)] });
  if (result.rowsAffected === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // 認証はmiddlewareで処理済み
  const { id } = await params;
  const body = await req.json();
  const { title, description, model_name, rounds } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: 'タイトルは必須です' }, { status: 400 });
  }

  const db = getDb();

  // 投稿の存在確認
  const existing = await db.execute({ sql: 'SELECT id FROM posts WHERE id = ?', args: [Number(id)] });
  if (existing.rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // 投稿情報を更新
  await db.execute({
    sql: 'UPDATE posts SET title = ?, description = ?, model_name = ? WHERE id = ?',
    args: [title.trim(), description?.trim() || '', model_name?.trim() || '', Number(id)]
  });

  // メッセージを差し替え
  if (rounds && Array.isArray(rounds)) {
    await db.execute({ sql: 'DELETE FROM messages WHERE post_id = ?', args: [Number(id)] });
    for (let i = 0; i < rounds.length; i++) {
      const round = rounds[i];
      await db.execute({
        sql: 'INSERT INTO messages (post_id, role, content, position) VALUES (?, ?, ?, ?)',
        args: [Number(id), 'user', round.user.trim(), i * 2]
      });
      await db.execute({
        sql: 'INSERT INTO messages (post_id, role, content, position) VALUES (?, ?, ?, ?)',
        args: [Number(id), 'ai', round.ai.trim(), i * 2 + 1]
      });
    }
  }

  const postResult = await db.execute({ sql: 'SELECT * FROM posts WHERE id = ?', args: [Number(id)] });
  const msgResult = await db.execute({ sql: 'SELECT * FROM messages WHERE post_id = ? ORDER BY position', args: [Number(id)] });
  return NextResponse.json({ post: { ...postResult.rows[0], messages: msgResult.rows } });
}
