import { getDb } from '@/lib/db';
import type { Post } from '@/lib/types';
import PostCard from '@/components/PostCard';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const db = getDb();
  const posts = db
    .prepare('SELECT id, title, model_name, created_at FROM posts ORDER BY created_at DESC')
    .all() as Post[];

  return (
    <div>
      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">まだ投稿がありません</p>
          <p className="text-sm mt-2">「投稿する」からチャットログを追加しましょう</p>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
