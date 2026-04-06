const isPrivate = process.env.PRIVATE_MODE === 'true';

export default function UserBubble({ content }: { content: string }) {
  return (
    <div className={isPrivate
      ? 'bg-gray-700 border border-gray-600 rounded-2xl px-4 py-3 text-base text-gray-100 whitespace-pre-wrap leading-relaxed'
      : 'bg-blue-100 border border-blue-200 rounded-2xl px-4 py-3 text-base text-slate-700 whitespace-pre-wrap leading-relaxed'
    }>
      {content}
    </div>
  );
}
