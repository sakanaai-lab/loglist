'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({ postId }: { postId: number }) {
  const router = useRouter();
  const [step, setStep] = useState<'idle' | 'confirm' | 'password'>('idle');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleClick() {
    if (step === 'idle') {
      setStep('confirm');
      return;
    }
    if (step === 'confirm') {
      setStep('password');
      return;
    }
    // step === 'password'
    setError('');
    const res = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.status === 401) {
      setError('パスワードが違います');
      return;
    }
    router.push('/');
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
            onKeyDown={(e) => e.key === 'Enter' && handleClick()}
            className="text-xs border border-gray-200 rounded px-2 py-1 w-28 focus:outline-none focus:border-red-300"
            autoFocus
          />
          <button
            onClick={handleClick}
            className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600"
          >
            削除
          </button>
          <button
            onClick={() => { setStep('idle'); setPassword(''); setError(''); }}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            キャンセル
          </button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
        step === 'confirm'
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-300'
      }`}
    >
      {step === 'confirm' ? '本当に削除？' : '削除'}
    </button>
  );
}
