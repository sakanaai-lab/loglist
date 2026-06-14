const isPrivate = process.env.PRIVATE_MODE === 'true';

function renderContent(content: string) {
  const parts = content.split(/(\([^)]*\))/g);
  return parts.map((part, i) => {
    if (/^\([^)]*\)$/.test(part)) {
      return <span key={i} className={isPrivate ? 'text-gray-500 italic' : 'text-slate-400 italic'}>{part}</span>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function AiMessage({ content, reasoning, modelName }: { content: string; reasoning?: string; modelName: string }) {
  return (
    <div>
      <div className={isPrivate ? 'text-xs text-gray-500 font-semibold mb-1' : 'text-xs text-slate-400 font-semibold mb-1'}>
        {modelName}
      </div>
      {reasoning && (
        <div className="reasoning-cloud mb-4">
          <div className="relative z-10">
            <div className={isPrivate ? 'text-xs font-semibold text-sky-300/70 mb-1.5' : 'text-xs font-semibold text-sky-500/80 mb-1.5'}>
              推論
            </div>
            <div className={isPrivate ? 'text-sm text-gray-300 whitespace-pre-wrap leading-relaxed' : 'text-sm text-slate-600 whitespace-pre-wrap leading-relaxed'}>
              {reasoning}
            </div>
          </div>
        </div>
      )}
      <div className={isPrivate ? 'text-base text-gray-200 whitespace-pre-wrap leading-relaxed' : 'text-base text-slate-700 whitespace-pre-wrap leading-relaxed'}>
        {renderContent(content)}
      </div>
    </div>
  );
}
