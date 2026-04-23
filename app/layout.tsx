import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'loglist',
  description: 'LLMとのチャットログを記録・共有するサイト',
};

const isPrivate = process.env.PRIVATE_MODE === 'true';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={isPrivate
        ? 'min-h-screen bg-gray-900 text-gray-100'
        : 'min-h-screen bg-slate-100 text-slate-800'
      }>
        <header className={isPrivate
          ? 'bg-gray-800 border-b border-gray-700 px-4 py-3'
          : 'bg-slate-200 border-b border-slate-300 px-4 py-3'
        }>
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Link href="/" className={isPrivate
              ? 'text-lg font-semibold tracking-tight text-gray-100'
              : 'text-lg font-semibold tracking-tight text-slate-700'
            }>
              loglist {isPrivate && <span className="text-xs text-gray-400 ml-1">private</span>}
            </Link>
            <Link
              href="/admin"
              className={isPrivate
                ? 'text-xs text-gray-400 hover:text-gray-200 transition-colors'
                : 'text-xs text-slate-400 hover:text-slate-600 transition-colors'
              }
            >
              管理
            </Link>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
