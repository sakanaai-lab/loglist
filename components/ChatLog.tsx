import type { PostWithMessages } from '@/lib/types';
import UserBubble from './UserBubble';
import AiMessage from './AiMessage';

export default function ChatLog({ post }: { post: PostWithMessages }) {
  const messages = [...post.messages].sort((a, b) => a.position - b.position);

  return (
    <div className="space-y-4">
      {messages.map((msg) =>
        msg.role === 'user' ? (
          <UserBubble key={msg.id} content={msg.content} />
        ) : (
          <AiMessage key={msg.id} content={msg.content} modelName={post.model_name} />
        )
      )}
    </div>
  );
}
