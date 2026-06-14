import { getDb } from '@/lib/db';
import type { PostWithMessages } from '@/lib/types';
import type { MaskRule } from '@/lib/masks';
import { applyMasks } from '@/lib/masks';
import MaskedChatLog from '@/components/MaskedChatLog';
import SensitiveGate from '@/components/SensitiveGate';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { isSensitive } from '@/lib/sensitive';

export const dynamic = 'force-dynamic';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  
  const postResult = await db.execute({ sql: 'SELECT * FROM posts WHERE id = ?', args: [Number(id)] });
  const post = postResult.rows[0] as unknown as PostWithMessages | undefined;
  if (!post) notFound();

  const messagesResult = await db.execute({ sql: 'SELECT * FROM messages WHERE post_id = ? ORDER BY position', args: [Number(id)] });
  const messages = messagesResult.rows as unknown as PostWithMessages['messages'];

  const masksResult = await db.execute('SELECT * FROM masks ORDER BY position');
  const masks = masksResult.rows as unknown as MaskRule[];

  const fullPost: PostWithMessages = {
    ...post,
    title: applyMasks(post.title, masks),
    description: applyMasks(post.description || '', masks),
    model_name: post.model_name ? applyMasks(post.model_name, masks) : '',
    messages: messages.map((m) => ({
      ...m,
      content: applyMasks(m.content, masks),
      reasoning: applyMasks(m.reasoning || '', masks),
    })),
  };

  const authed = await isAuthenticated();

  const sensitive = isSensitive(
    post.title,
    post.description,
    ...messages.flatMap((m) => [m.content, m.reasoning || ''])
  );

  return (
    <article>
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
          ← 一覧へ
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl font-semibold text-slate-800">{fullPost.title}</h1>
          {authed && (
            <Link
              href={`/posts/${id}/edit`}
              className="text-xs px-3 py-1 rounded transition-colors text-slate-400 border border-slate-200 hover:border-slate-400 hover:text-slate-600 whitespace-nowrap"
            >
              編集
            </Link>
          )}
        </div>
        {fullPost.description && (
          <p className="mt-1 text-sm text-slate-500">{fullPost.description}</p>
        )}
        <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
          {fullPost.model_name && (
            <span className="bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
              {fullPost.model_name}
            </span>
          )}
          <span>{formatDate(post.created_at)}</span>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6">
        {sensitive ? (
          <SensitiveGate>
            <MaskedChatLog post={fullPost} />
          </SensitiveGate>
        ) : (
          <MaskedChatLog post={fullPost} />
        )}
      </div>

      <div className="mt-10 pt-6 border-t border-slate-200">
        <Link href="/" className="text-sm text-slate-400 hover:text-slate-600">
          ← 一覧へ戻る
        </Link>
      </div>
    </article>
  );
}
