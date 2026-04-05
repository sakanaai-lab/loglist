export default function UserBubble({ content }: { content: string }) {
  return (
    <div className="bg-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
      {content}
    </div>
  );
}
