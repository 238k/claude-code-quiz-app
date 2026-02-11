'use client';

type Props = {
  label: string;
  text: string;
  side: 'left' | 'right';
  progress: number; // 0〜1（このside方向へのドラッグ量）
  onTap: () => void;
};

export default function ChoiceIndicator({ label, text, side, progress, onTap }: Props) {
  const isLeft = side === 'left';
  const isActive = progress > 0;

  const borderColor = isActive
    ? isLeft ? 'border-rose-400' : 'border-sky-400'
    : 'border-gray-200';
  const bgColor = isActive
    ? isLeft ? 'bg-rose-50' : 'bg-sky-50'
    : 'bg-white';
  const accentColor = isLeft ? 'text-rose-500' : 'text-sky-500';

  const opacity = 0.6 + progress * 0.4;
  const scale = 1 + progress * 0.05;

  return (
    <button
      onClick={onTap}
      className={`flex-1 flex flex-col ${isLeft ? 'items-start' : 'items-end'} gap-1 px-4 py-3 rounded-2xl border-2 min-h-20 transition-colors ${borderColor} ${bgColor}`}
      style={{ opacity, transform: `scale(${scale})` }}
      aria-label={`選択肢${label}を選択`}
    >
      <div className={`flex items-center gap-1.5 ${isLeft ? '' : 'flex-row-reverse'}`}>
        <span className={`text-2xl font-bold ${accentColor}`}>{isLeft ? '←' : '→'}</span>
        <span className={`text-xl font-bold ${accentColor}`}>{label}</span>
      </div>
      <span className="text-base text-gray-700 leading-snug line-clamp-3 text-left">
        {text}
      </span>
    </button>
  );
}
