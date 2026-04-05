import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { checkPassword } from '@/lib/auth';
import type { CreatePostPayload } from '@/lib/types';

export async function GET() {
  const db = getDb();
  const posts = db.prepare(
    'SELECT id, title, model_name, created_at FROM posts ORDER BY created_at DESC'
  ).all();
  return NextResponse.json({ posts });
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

  const insertPost = db.prepare(
    'INSERT INTO posts (title, model_name) VALUES (?, ?)'
  );
  const insertMessage = db.prepare(
    'INSERT INTO messages (post_id, role, content, position) VALUES (?, ?, ?, ?)'
  );

  const transaction = db.transaction(() => {
    const result = insertPost.run(title.trim(), model_name.trim());
    const postId = result.lastInsertRowid as number;

    rounds.forEach((round, i) => {
      insertMessage.run(postId, 'user', round.user.trim(), i * 2);
      insertMessage.run(postId, 'ai', round.ai.trim(), i * 2 + 1);
    });

    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId) as Record<string, unknown>;
    const messages = db
      .prepare('SELECT * FROM messages WHERE post_id = ? ORDER BY position')
      .all(postId);
    return { ...post, messages };
  });

  const post = transaction();
  return NextResponse.json({ post }, { status: 201 });
}
