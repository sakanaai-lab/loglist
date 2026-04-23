'use client';

import { useState, useEffect } from 'react';

interface Rule {
  tempId: string;
  from_text: string;
  to_text: string;
}

function randomId() {
  return Math.random().toString(36).slice(2);
}

export default function MaskSettings() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [status, setStatus] = useState<'loading' | 'idle' | 'saving' | 'saved' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/masks');
      if (!res.ok) {
        setErrorMsg('マスクの読み込みに失敗しました');
        setStatus('error');
        return;
      }
      const data = await res.json();
      setRules(
        data.masks.map((m: { from_text: string; to_text: string }) => ({
          tempId: randomId(),
          from_text: m.from_text,
          to_text: m.to_text,
        }))
      );
      setStatus('idle');
    }
    load();
  }, []);

  function addRule() {
    setRules((prev) => [...prev, { tempId: randomId(), from_text: '', to_text: '' }]);
  }

  function updateRule(tempId: string, field: 'from_text' | 'to_text', value: string) {
    setRules((prev) => prev.map((r) => (r.tempId === tempId ? { ...r, [field]: value } : r)));
  }

  function removeRule(tempId: string) {
    setRules((prev) => prev.filter((r) => r.tempId !== tempId));
  }

  async function handleSave() {
    setStatus('saving');
    setErrorMsg('');
    const res = await fetch('/api/masks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rules: rules.map(({ from_text, to_text }) => ({ from_text, to_text })),
      }),
    });
    if (res.status === 401) {
      setErrorMsg('認証が必要です');
      setStatus('error');
      return;
    }
    if (!res.ok) {
      setErrorMsg('保存に失敗しました');
      setStatus('error');
      return;
    }
    setStatus('saved');
    setTimeout(() => setStatus('idle'), 2000);
  }

  if (status === 'loading') {
    return <p className="text-slate-400 text-sm py-4 text-center">読み込み中...</p>;
  }

  return (
    <div className="space-y-4">
      {rules.length === 0 && (
        <p className="text-slate-400 text-sm py-4 text-center">まだルールがありません</p>
      )}

      {rules.map((rule) => (
        <div key={rule.tempId} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="元の名前（本名）"
            value={rule.from_text}
            onChange={(e) => updateRule(rule.tempId, 'from_text', e.target.value)}
            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:border-slate-400"
          />
          <span className="text-slate-400">→</span>
          <input
            type="text"
            placeholder="表示する名前"
            value={rule.to_text}
            onChange={(e) => updateRule(rule.tempId, 'to_text', e.target.value)}
            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:border-slate-400"
          />
          <button onClick={() => removeRule(rule.tempId)} className="text-red-400 hover:text-red-600 px-1 text-lg">
            ×
          </button>
        </div>
      ))}

      <button
        onClick={addRule}
        className="w-full border-2 border-dashed border-slate-200 rounded-xl py-3 text-sm text-slate-400 hover:border-slate-300 hover:text-slate-500 transition-colors"
      >
        ＋ ルールを追加
      </button>

      <div className="border-t border-slate-100 pt-4">
        {errorMsg && <p className="text-sm text-red-500 mb-3">{errorMsg}</p>}
        <button
          onClick={handleSave}
          disabled={status === 'saving'}
          className="w-full bg-slate-700 text-white py-3 rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          {status === 'saving' ? '保存中...' : status === 'saved' ? '保存しました！' : '保存する'}
        </button>
      </div>
    </div>
  );
}
