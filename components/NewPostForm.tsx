'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Round {
  user: string;
  ai: string;
}

export default function NewPostForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [modelName, setModelName] = useState('');
  const [rounds, setRounds] = useState<Round[]>([{ user: '', ai: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function updateRound(index: number, field: 'user' | 'ai', value: string) {
    setRounds((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  }

  function addRound() {
    setRounds((prev) => [...prev, { user: '', ai: '' }]);
  }

  function removeRound(index: number) {
    setRounds((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!title.trim()) return setError('タイトルを入力してください');
    if (!modelName.trim()) return setError('モデル名を入力してください');
    for (let i = 0; i < rounds.length; i++) {
      if (!rounds[i].user.trim() || !rounds[i].ai.trim()) {
        return setError(`ラリー${i + 1}のメッセージが空です`);
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), model_name: modelName.trim(), rounds }),
      });
      if (!res.ok) throw new Error('投稿に失敗しました');
      const { post } = await res.json();
      router.push(`/posts/${post.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿に失敗しました');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <input
          type="text"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-xl font-semibold border-0 border-b border-gray-200 pb-2 focus:outline-none focus:border-gray-400 placeholder-gray-300"
        />
      </div>

      {/* Model name */}
      <div>
        <input
          type="text"
          placeholder="モデル名（例：GPT-4o, Claude 3.5）"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400 placeholder-gray-300"
        />
      </div>

      {/* Rounds */}
      <div className="space-y-6">
        {rounds.map((round, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                ラリー {i + 1}
              </span>
              {rounds.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRound(i)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  削除
                </button>
              )}
            </div>

            {/* User message */}
            <div className="bg-gray-50 rounded-xl px-3 py-2">
              <div className="text-xs text-gray-400 mb-1">あなた</div>
              <textarea
                rows={3}
                placeholder="ユーザーのメッセージ..."
                value={round.user}
                onChange={(e) => updateRound(i, 'user', e.target.value)}
                className="w-full text-sm bg-transparent focus:outline-none placeholder-gray-300 resize-none"
              />
            </div>

            {/* AI message */}
            <div className="border border-gray-100 rounded-xl px-3 py-2">
              <div className="text-xs text-gray-400 mb-1">AI</div>
              <textarea
                rows={5}
                placeholder="AIの返答..."
                value={round.ai}
                onChange={(e) => updateRound(i, 'ai', e.target.value)}
                className="w-full text-sm bg-transparent focus:outline-none placeholder-gray-300 resize-none"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add round button */}
      <button
        type="button"
        onClick={addRound}
        className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors"
      >
        ＋ ラリーを追加
      </button>

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? '投稿中...' : '投稿する'}
      </button>
    </form>
  );
}
