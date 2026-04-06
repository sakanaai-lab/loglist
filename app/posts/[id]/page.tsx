import { getDb } from '@/lib/db';
import type { PostWithMessages } from '@/lib/types';
import type { MaskRule } from '@/lib/masks';
import { applyMasks } from '@/lib/masks';
import MaskedChatLog from '@/components/MaskedChatLog';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(Number(id)) as PostWithMessages | undefined;
  if (!post) notFound();

  const messages = db
    .prepare('SELECT * FROM messages WHERE post_id = ? ORDER BY position')
    .all(Number(id)) as PostWithMessages['messages'];

  const masks = db.prepare('SELECT * FROM masks ORDER BY position').all() as MaskRule[];

  const fullPost: PostWithMessages = {
    ...post,
    title: applyMasks(post.title, masks),
    model_name: applyMasks(post.model_name, masks),
    messages: messages.map((m) => ({ ...m, content: applyMasks(m.content, masks) })),
  };

  return (
    <article>
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
          ← 一覧へ
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">{fullPost.title}</h1>
        <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
          <span className="bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
            {fullPost.model_name}
          </span>
          <span>{formatDate(post.created_at)}</span>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <MaskedChatLog post={fullPost} />
      </div>

      <div className="mt-10 pt-6 border-t border-slate-200">
        <Link href="/" className="text-sm text-slate-400 hover:text-slate-600">
          ← 一覧へ戻る
        </Link>
      </div>
    </article>
  );
}
