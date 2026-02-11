'use client';

import Link from 'next/link';
import { useQuizStore } from '@/hooks/useQuizStore';
import SetList from '@/components/admin/SetList';

export default function AdminPage() {
  const { sets, quizzes, deleteSet } = useQuizStore();

  const quizCountMap: Record<string, number> = {};
  for (const quiz of quizzes) {
    quizCountMap[quiz.setId] = (quizCountMap[quiz.setId] ?? 0) + 1;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="トップへ戻る"
            >
              ←
            </Link>
            <h1 className="text-lg font-bold text-gray-800">管理画面</h1>
          </div>
        </div>

        <SetList sets={sets} quizCountMap={quizCountMap} onDelete={deleteSet} />

        <Link
          href="/admin/set/new"
          className="mt-4 flex items-center justify-center w-full py-3 text-sm text-indigo-600 border-2 border-dashed border-indigo-300 rounded-xl hover:bg-indigo-50 transition-colors"
        >
          + セット追加
        </Link>
      </div>
    </div>
  );
}
