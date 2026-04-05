import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'loglist',
  description: 'LLMとのチャットログを記録・共有するサイト',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-white text-gray-900">
        <header className="border-b border-gray-200 px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              loglist
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/settings"
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                マスク
              </Link>
              <Link
                href="/posts/new"
                className="bg-black text-white text-sm px-4 py-1.5 rounded-full hover:bg-gray-800 transition-colors"
              >
                投稿する
              </Link>
            </div>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
