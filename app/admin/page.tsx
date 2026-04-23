import { getDb } from '@/lib/db';
import type { Post } from '@/lib/types';
import type { MaskRule } from '@/lib/masks';
import { applyMasks } from '@/lib/masks';
import Link from 'next/link';
import AdminDeleteButton from '@/components/AdminDeleteButton';
import ExportButton from '@/components/ExportButton';

export const dynamic = 'force-dynamic';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function AdminPage() {
  const db = getDb();
  const postsResult = await db.execute('SELECT id, title, description, model_name, created_at FROM posts ORDER BY created_at DESC');
  const posts = postsResult.rows as unknown as Post[];
  
  const masksResult = await db.execute('SELECT * FROM masks ORDER BY position');
  const masks = masksResult.rows as unknown as MaskRule[];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-700">投稿一覧</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/viewer"
            className="text-sm border border-slate-300 text-slate-500 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ビューアー
          </Link>
          <ExportButton />
          <Link
            href="/posts/new"
            className="bg-slate-600 text-white text-sm px-4 py-1.5 rounded-full hover:bg-slate-700 transition-colors"
          >
            ＋ 投稿する
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="text-center py-20 text-slate-400">まだ投稿がありません</p>
      ) : (
        <div>
          {posts.map((post) => {
            const title = applyMasks(post.title, masks);
            const description = applyMasks(post.description || '', masks);
            const modelName = applyMasks(post.model_name, masks);
            return (
              <div
                key={post.id}
                className="border-b border-slate-200 py-4 flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/posts/${post.id}`}
                    className="font-medium text-slate-700 hover:text-slate-900 block truncate"
                  >
                    {title}
                  </Link>
                  {description && (
                    <p className="mt-0.5 text-sm text-slate-400 truncate">{description}</p>
                  )}
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                    <span className="bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                      {modelName}
                    </span>
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </div>
                <AdminDeleteButton postId={post.id} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
