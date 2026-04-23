'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Round {
  user: string;
  ai: string;
}

interface PostData {
  id: number;
  title: string;
  description: string;
  model_name: string;
  messages: Array<{ role: 'user' | 'ai'; content: string; position: number }>;
}

export default function EditPostForm({ postId }: { postId: number }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [modelName, setModelName] = useState('');
  const [rounds, setRounds] = useState<Round[]>([{ user: '', ai: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPost() {
      const res = await fetch(`/api/posts/${postId}`);
      if (!res.ok) {
        setError('投稿の読み込みに失敗しました');
        setLoading(false);
        return;
      }
      const data = await res.json();
      const post: PostData = data.post;
      setTitle(post.title);
      setDescription(post.description || '');
      setModelName(post.model_name || '');

      // メッセージをラリー形式に変換
      const msgs = post.messages.sort((a, b) => a.position - b.position);
      const loadedRounds: Round[] = [];
      let currentRound: Partial<Round> = {};
      for (const msg of msgs) {
        if (msg.role === 'user') {
          currentRound = { user: msg.content };
        } else if (msg.role === 'ai') {
          currentRound.ai = msg.content;
          loadedRounds.push({
            user: currentRound.user || '',
            ai: currentRound.ai || '',
          });
          currentRound = {};
        }
      }
      // user だけ残ってる場合
      if (currentRound.user) {
        loadedRounds.push({ user: currentRound.user, ai: '' });
      }

      setRounds(loadedRounds.length > 0 ? loadedRounds : [{ user: '', ai: '' }]);
      setLoading(false);
    }
    loadPost();
  }, [postId]);

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
    for (let i = 0; i < rounds.length; i++) {
      if (!rounds[i].user.trim() || !rounds[i].ai.trim()) {
        return setError(`ラリー${i + 1}のメッセージが空です`);
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          model_name: modelName.trim(),
          rounds,
        }),
      });
      if (res.status === 401) {
        setError('認証が必要です。ログインしてください。');
        setSubmitting(false);
        return;
      }
      if (!res.ok) throw new Error('更新に失敗しました');
      router.push(`/posts/${postId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました');
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-slate-400 text-center py-8">読み込み中...</p>;
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
          className="w-full text-xl font-semibold border-0 border-b border-slate-200 pb-2 focus:outline-none focus:border-slate-400 placeholder-gray-300"
        />
      </div>

      {/* Description */}
      <div>
        <input
          type="text"
          placeholder="一言コメント（オプション）"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full text-sm border-0 border-b border-slate-200 pb-2 focus:outline-none focus:border-slate-400 placeholder-gray-300"
        />
      </div>

      {/* Model name */}
      <div>
        <input
          type="text"
          placeholder="モデル名（例：GPT-4o, Claude 3.5）（オプション）"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          className="w-full text-base border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-400 placeholder-gray-300"
        />
      </div>

      {/* Rounds */}
      <div className="space-y-6">
        {rounds.map((round, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
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
            <div className="bg-slate-50 rounded-xl px-3 py-2">
              <div className="text-xs text-slate-400 mb-1">あなた</div>
              <textarea
                rows={3}
                placeholder="ユーザーのメッセージ..."
                value={round.user}
                onChange={(e) => updateRound(i, 'user', e.target.value)}
                className="w-full text-base bg-transparent focus:outline-none placeholder-gray-300 resize-none"
              />
            </div>

            {/* AI message */}
            <div className="border border-gray-100 rounded-xl px-3 py-2">
              <div className="text-xs text-slate-400 mb-1">AI</div>
              <textarea
                rows={5}
                placeholder="AIの返答..."
                value={round.ai}
                onChange={(e) => updateRound(i, 'ai', e.target.value)}
                className="w-full text-base bg-transparent focus:outline-none placeholder-gray-300 resize-none"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add round button */}
      <button
        type="button"
        onClick={addRound}
        className="w-full border-2 border-dashed border-slate-200 rounded-xl py-3 text-sm text-slate-400 hover:border-slate-300 hover:text-slate-500 transition-colors"
      >
        ＋ ラリーを追加
      </button>

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-slate-700 text-white py-3 rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? '更新中...' : '更新する'}
      </button>
    </form>
  );
}
