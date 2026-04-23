'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminDeleteButton({ postId }: { postId: number }) {
  const router = useRouter();
  const [step, setStep] = useState<'idle' | 'confirm' | 'password'>('idle');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleDelete() {
    setError('');
    const res = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.status === 401) { setError('パスワードが違います'); return; }
    router.refresh();
  }

  if (step === 'password') {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleDelete()}
            autoFocus
            className="text-xs border border-slate-300 rounded px-2 py-1 w-28 focus:outline-none"
          />
          <button onClick={handleDelete} className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">削除</button>
          <button onClick={() => { setStep('idle'); setPassword(''); setError(''); }} className="text-xs text-slate-400 hover:text-slate-600">×</button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <button
      onClick={() => step === 'idle' ? setStep('confirm') : setStep('password')}
      className={`text-xs px-3 py-1 rounded transition-colors ${
        step === 'confirm'
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'text-slate-400 border border-slate-200 hover:border-red-300 hover:text-red-400'
      }`}
    >
      {step === 'confirm' ? '本当に削除？' : '削除'}
    </button>
  );
}
