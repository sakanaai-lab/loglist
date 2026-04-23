'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({ postId }: { postId: number }) {
  const router = useRouter();
  const [step, setStep] = useState<'idle' | 'confirm'>('idle');
  const [error, setError] = useState('');

  async function handleDelete() {
    setError('');
    const res = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
    });
    if (res.status === 401) {
      setError('認証が必要です');
      return;
    }
    router.push('/');
    router.refresh();
  }

  if (step === 'confirm') {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600"
        >
          削除する
        </button>
        <button
          onClick={() => { setStep('idle'); setError(''); }}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          キャンセル
        </button>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setStep('confirm')}
      className="text-xs px-3 py-1.5 rounded-lg transition-colors text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-300"
    >
      削除
    </button>
  );
}
