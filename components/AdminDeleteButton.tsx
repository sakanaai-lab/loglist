'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminDeleteButton({ postId }: { postId: number }) {
  const router = useRouter();
  const [step, setStep] = useState<'idle' | 'confirm'>('idle');
  const [error, setError] = useState('');

  async function handleDelete() {
    setError('');
    const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    if (res.status === 401) {
      setError('認証が必要です');
      return;
    }
    router.refresh();
  }

  if (step === 'confirm') {
    return (
      <div className="flex items-center gap-2">
        <button onClick={handleDelete} className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">削除</button>
        <button onClick={() => { setStep('idle'); setError(''); }} className="text-xs text-slate-400 hover:text-slate-600">×</button>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setStep('confirm')}
      className="text-xs px-3 py-1 rounded transition-colors text-slate-400 border border-slate-200 hover:border-red-300 hover:text-red-400"
    >
      削除
    </button>
  );
}
