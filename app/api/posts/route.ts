import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { checkPassword } from '@/lib/auth';
import type { CreatePostPayload } from '@/lib/types';

export async function GET() {
  const db = getDb();
  const result = await db.execute('SELECT id, title, model_name, created_at FROM posts ORDER BY created_at DESC');
  return NextResponse.json({ posts: result.rows });
}

export async function POST(req: NextRequest) {
  const body: CreatePostPayload & { password?: string } = await req.json();
  const { title, model_name, rounds, password } = body;

  if (!checkPassword(password)) {
    return NextResponse.json({ error: 'パスワードが違います' }, { status: 401 });
  }

  if (!title?.trim() || !model_name?.trim() || !rounds?.length) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const db = getDb();

  const insertPostResult = await db.execute({
    sql: 'INSERT INTO posts (title, model_name) VALUES (?, ?)',
    args: [title.trim(), model_name.trim()]
  });
  const postId = Number(insertPostResult.lastInsertRowid!);

  for (let i = 0; i < rounds.length; i++) {
    const round = rounds[i];
    await db.execute({
      sql: 'INSERT INTO messages (post_id, role, content, position) VALUES (?, ?, ?, ?)',
      args: [postId, 'user', round.user.trim(), i * 2]
    });
    await db.execute({
      sql: 'INSERT INTO messages (post_id, role, content, position) VALUES (?, ?, ?, ?)',
      args: [postId, 'ai', round.ai.trim(), i * 2 + 1]
    });
  }

  const postResult = await db.execute({ sql: 'SELECT * FROM posts WHERE id = ?', args: [postId] });
  const postInfo = postResult.rows[0];
  const msgResult = await db.execute({ sql: 'SELECT * FROM messages WHERE post_id = ? ORDER BY position', args: [postId] });
  
  return NextResponse.json({ post: { ...postInfo, messages: msgResult.rows } }, { status: 201 });
}
