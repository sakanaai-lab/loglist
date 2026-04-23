'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!password) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.status === 401) {
        setError('パスワードが違います');
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error('ログインに失敗しました');
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-slate-400 placeholder-gray-300"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-slate-700 text-white py-3 rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
      >
        {loading ? 'ログイン中...' : 'ログイン'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <h1 className="text-xl font-semibold text-center mb-8 text-slate-700">管理者ログイン</h1>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
