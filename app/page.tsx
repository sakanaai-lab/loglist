import { getDb } from '@/lib/db';
import type { Post } from '@/lib/types';
import type { MaskRule } from '@/lib/masks';
import { applyMasks } from '@/lib/masks';
import PostCard from '@/components/PostCard';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const db = getDb();
  const posts = db
    .prepare('SELECT id, title, model_name, created_at FROM posts ORDER BY created_at DESC')
    .all() as Post[];
  const masks = db.prepare('SELECT * FROM masks ORDER BY position').all() as MaskRule[];

  const maskedPosts = posts.map((p) => ({
    ...p,
    title: applyMasks(p.title, masks),
    model_name: applyMasks(p.model_name, masks),
  }));

  return (
    <div>
      {maskedPosts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">まだ投稿がありません</p>
          <p className="text-sm mt-2">「投稿する」からチャットログを追加しましょう</p>
        </div>
      ) : (
        <div>
          {maskedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
