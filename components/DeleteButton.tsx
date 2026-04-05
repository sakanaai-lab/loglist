'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({ postId }: { postId: number }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    router.push('/');
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
        confirming
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-300'
      }`}
    >
      {confirming ? '本当に削除' : '削除'}
    </button>
  );
}
