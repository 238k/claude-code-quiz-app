import { CharacterState } from '@/types';
import Character from '@/components/character/Character';

type Props = {
  correctCount: number;
  totalCount: number;
  characterState: CharacterState;
};

export default function ScoreSummary({ correctCount, totalCount, characterState }: Props) {
  const rate = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <Character state={characterState} />
      <div className="text-center">
        <p className="text-3xl font-bold text-gray-800">
          {correctCount} <span className="text-lg font-normal text-gray-500">/ {totalCount} 正解</span>
        </p>
        <p className="text-xl font-semibold text-indigo-600 mt-1">{rate}%</p>
      </div>
    </div>
  );
}
