import { CharacterState } from '@/types';

type Props = { state: CharacterState };

export default function CharacterFace({ state }: Props) {
  switch (state) {
    case 'thinking':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" />
          {/* 大きく開いた目（ハラハラ） */}
          <ellipse cx="35" cy="42" rx="8" ry="10" fill="#1F2937" />
          <ellipse cx="65" cy="42" rx="8" ry="10" fill="#1F2937" />
          <circle cx="37" cy="40" r="3" fill="white" />
          <circle cx="67" cy="40" r="3" fill="white" />
          {/* 口：少し開いた心配そうな表情 */}
          <path d="M 38 65 Q 50 60 62 65" fill="none" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
          {/* 汗 */}
          <ellipse cx="78" cy="35" rx="4" ry="6" fill="#93C5FD" opacity="0.8" />
        </svg>
      );

    case 'correct':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="#86EFAC" stroke="#22C55E" strokeWidth="2" />
          {/* 細くなった笑い目 */}
          <path d="M 28 42 Q 35 36 42 42" fill="none" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
          <path d="M 58 42 Q 65 36 72 42" fill="none" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
          {/* 大きな笑顔 */}
          <path d="M 32 60 Q 50 78 68 60" fill="#F9A8D4" stroke="#1F2937" strokeWidth="2" />
          {/* ほっぺ */}
          <ellipse cx="28" cy="60" rx="8" ry="5" fill="#FDA4AF" opacity="0.6" />
          <ellipse cx="72" cy="60" rx="8" ry="5" fill="#FDA4AF" opacity="0.6" />
          {/* 星マーク */}
          <text x="78" y="28" fontSize="14" textAnchor="middle">⭐</text>
        </svg>
      );

    case 'incorrect':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="#FCA5A5" stroke="#EF4444" strokeWidth="2" />
          {/* 下がった眉 */}
          <path d="M 28 36 Q 35 42 42 38" fill="none" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 72 36 Q 65 42 58 38" fill="none" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
          {/* 悲しい目（半円） */}
          <path d="M 28 46 Q 35 54 42 46" fill="none" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
          <path d="M 58 46 Q 65 54 72 46" fill="none" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
          {/* 口：への字 */}
          <path d="M 36 68 Q 50 60 64 68" fill="none" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
          {/* 涙 */}
          <ellipse cx="36" cy="60" rx="3" ry="5" fill="#93C5FD" opacity="0.8" />
        </svg>
      );

    case 'perfect':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="#A78BFA" stroke="#7C3AED" strokeWidth="2" />
          {/* 星目 */}
          <text x="35" y="50" fontSize="16" textAnchor="middle">★</text>
          <text x="65" y="50" fontSize="16" textAnchor="middle">★</text>
          {/* 大きな笑顔 */}
          <path d="M 28 62 Q 50 82 72 62" fill="#FDE68A" stroke="#1F2937" strokeWidth="2" />
          {/* ほっぺ */}
          <ellipse cx="24" cy="62" rx="9" ry="6" fill="#FDA4AF" opacity="0.7" />
          <ellipse cx="76" cy="62" rx="9" ry="6" fill="#FDA4AF" opacity="0.7" />
          {/* キラキラ */}
          <text x="18" y="28" fontSize="12" textAnchor="middle">✨</text>
          <text x="82" y="28" fontSize="12" textAnchor="middle">✨</text>
        </svg>
      );

    case 'low_score':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="2" />
          {/* うつむき加減の目 */}
          <ellipse cx="36" cy="46" rx="6" ry="7" fill="#1F2937" />
          <ellipse cx="64" cy="46" rx="6" ry="7" fill="#1F2937" />
          <circle cx="38" cy="44" r="2" fill="white" />
          <circle cx="66" cy="44" r="2" fill="white" />
          {/* への字口 */}
          <path d="M 38 66 Q 50 60 62 66" fill="none" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
          {/* 汗・涙 */}
          <ellipse cx="30" cy="60" rx="3" ry="5" fill="#93C5FD" opacity="0.7" />
          <ellipse cx="70" cy="60" rx="3" ry="5" fill="#93C5FD" opacity="0.7" />
        </svg>
      );

    default: // idle
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" />
          {/* 穏やかな目 */}
          <ellipse cx="36" cy="44" rx="6" ry="7" fill="#1F2937" />
          <ellipse cx="64" cy="44" rx="6" ry="7" fill="#1F2937" />
          <circle cx="38" cy="42" r="2" fill="white" />
          <circle cx="66" cy="42" r="2" fill="white" />
          {/* 穏やかな笑顔 */}
          <path d="M 36 62 Q 50 72 64 62" fill="none" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
          {/* ほっぺ */}
          <ellipse cx="28" cy="58" rx="7" ry="4" fill="#FDA4AF" opacity="0.5" />
          <ellipse cx="72" cy="58" rx="7" ry="4" fill="#FDA4AF" opacity="0.5" />
        </svg>
      );
  }
}
