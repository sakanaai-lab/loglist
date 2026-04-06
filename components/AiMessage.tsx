function renderContent(content: string) {
  const parts = content.split(/(\([^)]*\))/g);
  return parts.map((part, i) => {
    if (/^\([^)]*\)$/.test(part)) {
      return <span key={i} className="text-slate-400 italic">{part}</span>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function AiMessage({ content, modelName }: { content: string; modelName: string }) {
  return (
    <div>
      <div className="text-xs text-slate-400 font-semibold mb-1">{modelName}</div>
      <div className="text-base text-slate-700 whitespace-pre-wrap leading-relaxed">
        {renderContent(content)}
      </div>
    </div>
  );
}
