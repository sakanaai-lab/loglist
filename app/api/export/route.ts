import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { applyMasks } from '@/lib/masks';
import type { Post, PostWithMessages, Message } from '@/lib/types';
import type { MaskRule } from '@/lib/masks';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}

function postToMarkdown(post: PostWithMessages): string {
  const messages = [...post.messages].sort((a, b) => a.position - b.position);
  const lines: string[] = [];

  lines.push(`# ${post.title}`);
  if (post.description) {
    lines.push(`> ${post.description}`);
  }
  lines.push(`モデル: ${post.model_name}｜${formatDate(post.created_at)}`);
  lines.push('');

  for (const msg of messages) {
    if (msg.role === 'user') {
      lines.push(`> ${msg.content.replace(/\n/g, '\n> ')}`);
    } else {
      lines.push('');
      lines.push(msg.content);
    }
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

export async function GET() {
  const db = getDb();
  const postsResult = await db.execute('SELECT * FROM posts ORDER BY created_at DESC');
  const posts = postsResult.rows as unknown as Post[];
  
  const masksResult = await db.execute('SELECT * FROM masks ORDER BY position');
  const masks = masksResult.rows as unknown as MaskRule[];

  const sections: string[] = [];

  for (const post of posts) {
    const messagesResult = await db.execute({ sql: 'SELECT * FROM messages WHERE post_id = ? ORDER BY position', args: [post.id] });
    const messages = messagesResult.rows as unknown as Message[];

    const masked: PostWithMessages = {
      ...post,
      title: applyMasks(post.title, masks),
      description: applyMasks(post.description || '', masks),
      model_name: applyMasks(post.model_name, masks),
      messages: messages.map((m) => ({ ...m, content: applyMasks(m.content, masks) })),
    };

    sections.push(postToMarkdown(masked));
  }

  const markdown = sections.join('\n\n---\n\n');
  const now = new Date().toISOString().slice(0, 10);

  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="loglist-${now}.md"`,
    },
  });
}
