'use client';

import { useEffect, useState } from 'react';
import type { PostWithMessages } from '@/lib/types';
import { loadMasks, applyMasks } from '@/lib/masks';
import UserBubble from './UserBubble';
import AiMessage from './AiMessage';

export default function MaskedChatLog({ post }: { post: PostWithMessages }) {
  const [masks, setMasks] = useState<ReturnType<typeof loadMasks>>([]);

  useEffect(() => {
    setMasks(loadMasks());
  }, []);

  const messages = [...post.messages].sort((a, b) => a.position - b.position);
  const modelName = applyMasks(post.model_name, masks);

  return (
    <div className="space-y-4">
      {messages.map((msg) => {
        const content = applyMasks(msg.content, masks);
        return msg.role === 'user' ? (
          <UserBubble key={msg.id} content={content} />
        ) : (
          <AiMessage key={msg.id} content={content} modelName={modelName} />
        );
      })}
    </div>
  );
}
