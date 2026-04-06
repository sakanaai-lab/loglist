import Link from 'next/link';
import type { Post } from '@/lib/types';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="block border-b border-slate-200 py-4 hover:bg-slate-200 -mx-2 px-2 rounded transition-colors group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="font-medium text-lg text-slate-700 group-hover:text-slate-900 truncate">
            {post.title}
          </h2>
          <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
            <span className="bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
              {post.model_name}
            </span>
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>
        <span className="text-slate-300 group-hover:text-slate-500 transition-colors mt-0.5">→</span>
      </div>
    </Link>
  );
}
