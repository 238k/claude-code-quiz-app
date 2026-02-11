'use client';

import Link from 'next/link';
import { QuizSet } from '@/types';

type Props = {
  sets: QuizSet[];
  quizCountMap: Record<string, number>;
  onDelete: (id: string) => void;
};

export default function SetList({ sets, quizCountMap, onDelete }: Props) {
  function handleDelete(set: QuizSet) {
    const count = quizCountMap[set.id] ?? 0;
    const message = count > 0
      ? `「${set.title}」を削除しますか？\nこのセットに含まれる${count}問のクイズも削除されます。`
      : `「${set.title}」を削除しますか？`;
    if (window.confirm(message)) {
      onDelete(set.id);
    }
  }

  if (sets.length === 0) {
    return (
      <p className="text-center text-gray-400 py-8 text-sm">
        セットがありません。「+ セット追加」で作成してください。
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sets.map((set) => {
        const count = quizCountMap[set.id] ?? 0;
        return (
          <div
            key={set.id}
            className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl px-4 py-4 shadow-sm"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 text-sm truncate">{set.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{count}問</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link
                href={`/admin/set/${set.id}/edit`}
                className="px-3 py-1.5 text-xs text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                編集
              </Link>
              <button
                onClick={() => handleDelete(set)}
                className="px-3 py-1.5 text-xs text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                削除
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
