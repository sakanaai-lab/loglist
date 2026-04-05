'use client';

import { useEffect, useState } from 'react';
import { loadMasks, saveMasks, type MaskRule } from '@/lib/masks';

function randomId() {
  return Math.random().toString(36).slice(2);
}

export default function MaskSettings() {
  const [rules, setRules] = useState<MaskRule[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setRules(loadMasks());
  }, []);

  function addRule() {
    setRules((prev) => [...prev, { id: randomId(), from: '', to: '' }]);
  }

  function updateRule(id: string, field: 'from' | 'to', value: string) {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  }

  function removeRule(id: string) {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }

  function handleSave() {
    saveMasks(rules);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      {rules.length === 0 && (
        <p className="text-gray-400 text-sm py-4 text-center">
          まだルールがありません
        </p>
      )}

      {rules.map((rule) => (
        <div key={rule.id} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="元の単語"
            value={rule.from}
            onChange={(e) => updateRule(rule.id, 'from', e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:border-gray-400"
          />
          <span className="text-gray-400">→</span>
          <input
            type="text"
            placeholder="置き換え後"
            value={rule.to}
            onChange={(e) => updateRule(rule.id, 'to', e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:border-gray-400"
          />
          <button
            onClick={() => removeRule(rule.id)}
            className="text-red-400 hover:text-red-600 px-1 text-lg"
          >
            ×
          </button>
        </div>
      ))}

      <button
        onClick={addRule}
        className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors"
      >
        ＋ ルールを追加
      </button>

      <button
        onClick={handleSave}
        className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        {saved ? '保存しました！' : '保存する'}
      </button>
    </div>
  );
}
