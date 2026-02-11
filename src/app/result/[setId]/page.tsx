'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnswerRecord, CharacterState } from '@/types';
import { useAnswerSession } from '@/hooks/useAnswerSession';
import ScoreSummary from '@/components/result/ScoreSummary';
import ReviewCard from '@/components/result/ReviewCard';

type Props = { params: Promise<{ setId: string }> };

function getCharacterState(rate: number): CharacterState {
  if (rate === 100) return 'perfect';
  if (rate >= 70) return 'correct';
  if (rate >= 40) return 'idle';
  return 'low_score';
}

export default function ResultPage({ params }: Props) {
  const { setId } = use(params);
  const router = useRouter();
  const { getRecords, clearSession } = useAnswerSession();

  const [records, setRecords] = useState<AnswerRecord[]>([]);

  useEffect(() => {
    setRecords(getRecords());
  }, [getRecords]);

  const correctCount = records.filter((r) => r.isCorrect).length;
  const total = records.length;
  const rate = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const characterState = getCharacterState(rate);

  function handleRetry() {
    clearSession();
    router.push(`/play/${setId}`);
  }

  function handleTop() {
    clearSession();
    router.push('/');
  }

  if (records.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">結果データがありません</p>
          <button onClick={() => router.push('/')} className="text-indigo-600 text-sm">
            トップへ戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-lg font-bold text-gray-800 text-center mb-2">結果</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <ScoreSummary
            correctCount={correctCount}
            totalCount={total}
            characterState={characterState}
          />
        </div>

        <h2 className="text-sm font-semibold text-gray-500 mb-3">問題の振り返り</h2>
        <div className="flex flex-col gap-3 mb-8">
          {records.map((record, i) => (
            <ReviewCard key={record.quiz.id} record={record} index={i} />
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRetry}
            className="flex-1 py-3 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            もう一度
          </button>
          <button
            onClick={handleTop}
            className="flex-1 py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            トップへ
          </button>
        </div>
      </div>
    </div>
  );
}
