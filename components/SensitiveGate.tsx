'use client';

import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';

export default function SensitiveGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [revealed, setRevealed] = useState(false);

  if (revealed) {
    return <>{children}</>;
  }

  return (
    <div className="my-8 rounded-lg border border-amber-300 bg-amber-50 p-6 text-center">
      <p className="text-sm font-medium text-amber-800">
        この記事はセンシティブな内容を含みます。
      </p>
      <p className="mt-1 text-sm text-amber-700">表示しますか？</p>
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={() => setRevealed(true)}
          className="rounded-lg bg-amber-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-700"
        >
          はい（表示する）
        </button>
        <button
          onClick={() => router.push('/')}
          className="rounded-lg border border-amber-300 px-4 py-1.5 text-sm text-amber-700 transition-colors hover:bg-amber-100"
        >
          いいえ（戻る）
        </button>
      </div>
    </div>
  );
}
