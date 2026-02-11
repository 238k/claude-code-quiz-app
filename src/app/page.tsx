'use client';

import Link from 'next/link';
import { useQuizStore } from '@/hooks/useQuizStore';

export default function Home() {
  const { sets, quizzes } = useQuizStore();

  const quizCountMap: Record<string, number> = {};
  for (const quiz of quizzes) {
    quizCountMap[quiz.setId] = (quizCountMap[quiz.setId] ?? 0) + 1;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">スワイプクイズ</h1>
          <p className="text-sm text-gray-500 mt-1">カードをスワイプして答えよう</p>
        </div>

        {sets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm mb-4">セットがまだありません</p>
            <Link
              href="/admin"
              className="text-indigo-600 text-sm font-medium hover:underline"
            >
              管理画面でクイズを作成する →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            {sets.map((set) => {
              const count = quizCountMap[set.id] ?? 0;
              return (
                <div
                  key={set.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-base truncate">{set.title}</p>
                    {set.description && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{set.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{count}問</p>
                  </div>
                  {count > 0 ? (
                    <Link
                      href={`/play/${set.id}`}
                      className="ml-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shrink-0"
                    >
                      スタート
                    </Link>
                  ) : (
                    <span className="ml-4 px-4 py-2 text-sm text-gray-400 bg-gray-100 rounded-xl shrink-0">
                      問題なし
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="text-right">
          <Link
            href="/admin"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            管理画面へ →
          </Link>
        </div>
      </div>
    </div>
  );
}
