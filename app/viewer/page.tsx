'use client';

import { useState, useCallback } from 'react';

interface Round {
  user: string;
  ai: string;
}

interface Post {
  title: string;
  modelName: string;
  date: string;
  rounds: Round[];
}

function parseMarkdown(text: string): Post[] {
  const lines = text.split('\n');
  const postStarts: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('# ')) postStarts.push(i);
  }

  return postStarts.map((start, p) => {
    const end = p + 1 < postStarts.length ? postStarts[p + 1] : lines.length;
    return parsePost(lines.slice(start, end));
  }).filter(Boolean) as Post[];
}

function parsePost(lines: string[]): Post | null {
  if (!lines.length) return null;
  const title = lines[0].replace(/^# /, '').trim();

  let modelName = '';
  let date = '';
  if (lines[1]) {
    const m = lines[1].match(/モデル:\s*(.+?)｜(.+)/);
    if (m) { modelName = m[1].trim(); date = m[2].trim(); }
  }

  // Format: each message (user or AI) is followed by its own ---
  // > user msg\n\n---\n\n(empty)\nAI msg\n\n---\n\n> next user...
  const rounds: Round[] = [];
  let i = 2;
  while (i < lines.length) {
    // skip blank lines and stray ---
    if (lines[i].trim() === '' || lines[i].trim() === '---') { i++; continue; }

    if (lines[i].startsWith('> ')) {
      // Collect user lines until ---
      const userLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== '---') {
        if (lines[i].startsWith('> ')) {
          userLines.push(lines[i].replace(/^> /, ''));
        } else if (lines[i].trim() !== '') {
          userLines.push(lines[i]);
        }
        i++;
      }
      if (i < lines.length && lines[i].trim() === '---') i++; // skip ---

      // Skip blank lines before AI content
      while (i < lines.length && lines[i].trim() === '') i++;

      // Collect AI lines until next ---
      const aiLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== '---') {
        aiLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].trim() === '---') i++; // skip ---

      while (aiLines.length && aiLines[aiLines.length - 1].trim() === '') aiLines.pop();
      while (aiLines.length && aiLines[0].trim() === '') aiLines.shift();

      const userText = userLines.join('\n').trim();
      const aiText = aiLines.join('\n').trim();
      if (userText || aiText) rounds.push({ user: userText, ai: aiText });
    } else { i++; }
  }

  return { title, modelName, date, rounds };
}

function renderAi(text: string) {
  const parts = text.split(/(\([^)]*\))/g);
  return parts.map((part, i) => {
    if (/^\([^)]*\)$/.test(part)) {
      return <span key={i} className="text-slate-400 italic">{part}</span>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ViewerPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const loadFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setPosts(parseMarkdown(text));
      setSelected(null);
    };
    reader.readAsText(file, 'utf-8');
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  }, [loadFile]);

  // Drop zone
  if (!posts) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => document.getElementById('viewer-file-input')?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 cursor-pointer transition-colors ${
            dragging ? 'border-blue-400 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
          }`}
        >
          <div className="text-4xl mb-3">📂</div>
          <p className="text-slate-600 font-medium mb-1">エクスポートしたMDファイルを選択</p>
          <p className="text-slate-400 text-sm">タップして選択 または ドラッグ＆ドロップ</p>
        </div>
        <p className="mt-4 text-xs text-slate-400">ファイルはこのブラウザ内だけで処理されます（サーバーに送信されません）</p>
        <input
          id="viewer-file-input"
          type="file"
          accept=".md,text/plain"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) loadFile(e.target.files[0]); }}
        />
      </div>
    );
  }

  // Post detail
  if (selected !== null) {
    const post = posts[selected];
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button
          onClick={() => setSelected(null)}
          className="text-sm text-slate-400 hover:text-slate-600 mb-4 flex items-center gap-1"
        >
          ← 一覧に戻る
        </button>
        <h2 className="text-lg font-semibold text-slate-800 mb-2">{post.title}</h2>
        <div className="flex items-center gap-2 mb-6 text-xs text-slate-400">
          <span className="bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">{post.modelName}</span>
          <span>{post.date}</span>
        </div>

        {post.rounds.map((round, i) => (
          <div key={i}>
            {round.user && (
              <div className="flex justify-end mb-3">
                <div className="bg-blue-100 border border-blue-200 text-slate-700 rounded-2xl rounded-br-sm px-4 py-2.5 text-sm whitespace-pre-wrap max-w-[85%] leading-relaxed">
                  {round.user}
                </div>
              </div>
            )}
            {round.ai && (
              <div className="mb-3 pl-1">
                <div className="text-xs text-slate-400 font-semibold mb-1">{post.modelName}</div>
                <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {renderAi(round.ai)}
                </div>
              </div>
            )}
            {i < post.rounds.length - 1 && (
              <hr className="border-slate-200 my-4" />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Post list
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-600">{posts.length}件のログ</h2>
        <button
          onClick={() => { setPosts(null); }}
          className="text-xs text-slate-400 hover:text-slate-600 border border-slate-300 px-3 py-1 rounded-full"
        >
          別のファイルを開く
        </button>
      </div>
      {posts.map((post, i) => (
        <div
          key={i}
          onClick={() => setSelected(i)}
          className="border-b border-slate-200 py-3 px-2 cursor-pointer hover:bg-slate-100 rounded flex items-center justify-between gap-3"
        >
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-700 truncate">{post.title}</p>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
              <span className="bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">{post.modelName}</span>
              <span>{post.date}</span>
            </div>
          </div>
          <span className="text-slate-300">→</span>
        </div>
      ))}
    </div>
  );
}
