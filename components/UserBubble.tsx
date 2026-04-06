export default function UserBubble({ content }: { content: string }) {
  return (
    <div className="bg-blue-100 border border-blue-200 rounded-2xl px-4 py-3 text-base text-slate-700 whitespace-pre-wrap leading-relaxed">
      {content}
    </div>
  );
}
