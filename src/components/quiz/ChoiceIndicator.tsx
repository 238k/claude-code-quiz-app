'use client';

type Props = {
  label: string;
  text: string;
  side: 'left' | 'right';
  progress: number; // 0〜1（このside方向へのドラッグ量）
  onTap: () => void;
};

export default function ChoiceIndicator({ label, text, side, progress, onTap }: Props) {
  const opacity = 0.3 + progress * 0.7;
  const scale = 1 + progress * 0.08;

  return (
    <button
      onClick={onTap}
      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${
        side === 'left' ? 'text-rose-500' : 'text-sky-500'
      }`}
      style={{ opacity, transform: `scale(${scale})` }}
      aria-label={`${label}を選択`}
    >
      <span className="text-xl font-bold">{side === 'left' ? '←' : '→'}</span>
      <span className="text-xs font-semibold">{label}</span>
      <span className="text-xs text-gray-600 max-w-20 text-center leading-tight line-clamp-2">{text}</span>
    </button>
  );
}
