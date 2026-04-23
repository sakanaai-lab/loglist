import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="bg-slate-700 text-slate-200 px-4 py-2 text-xs flex items-center justify-between max-w-2xl mx-auto">
        <span>管理画面</span>
        <div className="flex gap-4">
          <Link href="/admin" className="hover:text-white transition-colors">一覧</Link>
          <Link href="/posts/new" className="hover:text-white transition-colors">投稿する</Link>
          <Link href="/settings" className="hover:text-white transition-colors">マスク設定</Link>
          <Link href="/" className="hover:text-white transition-colors">← 公開ページ</Link>
        </div>
      </div>
      {children}
    </div>
  );
}
