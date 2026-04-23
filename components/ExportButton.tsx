'use client';

import { useState } from 'react';

export default function ExportButton() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    const res = await fetch('/api/export');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const disposition = res.headers.get('Content-Disposition') ?? '';
    const match = disposition.match(/filename="(.+)"/);
    a.download = match ? match[1] : 'loglist-export.md';
    a.click();
    URL.revokeObjectURL(url);
    setLoading(false);
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="text-sm border border-slate-300 text-slate-500 px-3 py-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors"
    >
      {loading ? 'エクスポート中...' : 'エクスポート'}
    </button>
  );
}
