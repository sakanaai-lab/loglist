import Link from 'next/link';
import type { Post } from '@/lib/types';

const isPrivate = process.env.PRIVATE_MODE === 'true';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className={isPrivate
        ? 'block border-b border-gray-700 py-4 hover:bg-gray-800 -mx-2 px-2 rounded transition-colors group'
        : 'block border-b border-slate-200 py-4 hover:bg-slate-200 -mx-2 px-2 rounded transition-colors group'
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className={isPrivate
            ? 'font-medium text-lg text-gray-100 group-hover:text-white truncate'
            : 'font-medium text-lg text-slate-700 group-hover:text-slate-900 truncate'
          }>
            {post.title}
          </h2>
          {post.description && (
            <p className={isPrivate
              ? 'mt-0.5 text-sm text-gray-400 truncate'
              : 'mt-0.5 text-sm text-slate-400 truncate'
            }>
              {post.description}
            </p>
          )}
          <div className={isPrivate
            ? 'mt-1 flex items-center gap-2 text-sm text-gray-500'
            : 'mt-1 flex items-center gap-2 text-sm text-slate-400'
          }>
            <span className={isPrivate
              ? 'bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full'
              : 'bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full'
            }>
              {post.model_name}
            </span>
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>
        <span className={isPrivate
          ? 'text-gray-600 group-hover:text-gray-400 transition-colors mt-0.5'
          : 'text-slate-300 group-hover:text-slate-500 transition-colors mt-0.5'
        }>→</span>
      </div>
    </Link>
  );
}
