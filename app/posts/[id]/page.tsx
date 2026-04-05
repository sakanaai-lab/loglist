import { getDb } from '@/lib/db';
import type { PostWithMessages } from '@/lib/types';
import MaskedChatLog from '@/components/MaskedChatLog';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DeleteButton from '@/components/DeleteButton';

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

  const fullPost: PostWithMessages = { ...post, messages };

  return (
    <article>
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
          ← 一覧へ
        </Link>
      </div>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{post.title}</h1>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
            <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {post.model_name}
            </span>
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>
        <DeleteButton postId={post.id} />
      </div>

      <div className="border-t border-gray-100 pt-6">
        <MaskedChatLog post={fullPost} />
      </div>
    </article>
  );
}
