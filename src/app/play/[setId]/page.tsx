'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/hooks/useQuizStore';
import { useAnswerSession } from '@/hooks/useAnswerSession';
import { CharacterState, SwipeState } from '@/types';
import Character from '@/components/character/Character';
import CardStack from '@/components/quiz/CardStack';
import ChoiceIndicator from '@/components/quiz/ChoiceIndicator';

type Props = { params: Promise<{ setId: string }> };

const FEEDBACK_DURATION = 1300;

export default function PlayPage({ params }: Props) {
  const { setId } = use(params);
  const router = useRouter();
  const { isLoaded, sets, getQuizzesBySetId } = useQuizStore();
  const { initSession, addRecord, clearSession } = useAnswerSession();

  const set = sets.find((s) => s.id === setId);
  const quizzes = getQuizzesBySetId(setId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeState, setSwipeState] = useState<SwipeState>('Idle');
  const [characterState, setCharacterState] = useState<CharacterState>('idle');
  const [feedbackCorrect, setFeedbackCorrect] = useState<boolean | null>(null);
  const [dragProgress, setDragProgress] = useState(0); // -1〜1

  useEffect(() => {
    initSession();
  }, [initSession]);

  if (!isLoaded) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  if (!set || quizzes.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">クイズが見つかりません</p>
          <button onClick={() => router.push('/')} className="text-indigo-600 text-sm">
            トップへ戻る
          </button>
        </div>
      </div>
    );
  }

  function handleDragStart() {
    setSwipeState('Dragging');
    setCharacterState('thinking');
  }

  function handleDragCancel() {
    setSwipeState('Idle');
    setCharacterState('idle');
    setDragProgress(0);
  }

  function handleDragProgress(progress: number) {
    setDragProgress(progress);
  }

  function handleSwipeConfirm(direction: 'left' | 'right') {
    const quiz = quizzes[currentIndex];
    const selectedAnswer = direction === 'left' ? 'A' : 'B';
    const isCorrect = selectedAnswer === quiz.correctAnswer;

    addRecord(quiz, selectedAnswer);
    setSwipeState('Feedback');
    setFeedbackCorrect(isCorrect);
    setCharacterState(isCorrect ? 'correct' : 'incorrect');
    setDragProgress(0);

    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= quizzes.length) {
        router.push(`/result/${setId}`);
      } else {
        setCurrentIndex(nextIndex);
        setSwipeState('Idle');
        setCharacterState('idle');
        setFeedbackCorrect(null);
      }
    }, FEEDBACK_DURATION);
  }

  function handleTapChoice(direction: 'left' | 'right') {
    if (swipeState !== 'Idle') return;
    handleSwipeConfirm(direction);
  }

  function handleQuit() {
    if (window.confirm('プレイを終了しますか？\n途中の結果は保存されません。')) {
      clearSession();
      router.push('/');
    }
  }

  const leftProgress = dragProgress < 0 ? Math.abs(dragProgress) : 0;
  const rightProgress = dragProgress > 0 ? dragProgress : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="max-w-lg w-full mx-auto flex flex-col flex-1">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <span className="text-base font-medium text-gray-700">
            {currentIndex + 1} / {quizzes.length}
          </span>
          <button
            onClick={handleQuit}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            × 終了
          </button>
        </div>

        {/* キャラクター */}
        <div className="flex justify-center py-3">
          <Character state={characterState} />
        </div>

        {/* 選択肢ゾーン + カードエリア */}
        <div className="flex-1 flex flex-col px-4 pb-8 gap-3">
          {/* 選択肢ゾーン（カード上） */}
          <div className="flex gap-3">
            <ChoiceIndicator
              label="A"
              text={quizzes[currentIndex].optionA}
              side="left"
              progress={leftProgress}
              onTap={() => handleTapChoice('left')}
            />
            <ChoiceIndicator
              label="B"
              text={quizzes[currentIndex].optionB}
              side="right"
              progress={rightProgress}
              onTap={() => handleTapChoice('right')}
            />
          </div>

          {/* カードスタック */}
          <div className="relative flex-1 min-h-48 max-h-72">
            {swipeState !== 'Feedback' && (
              <CardStack
                quizzes={quizzes}
                currentIndex={currentIndex}
                onSwipeConfirm={handleSwipeConfirm}
                onDragStart={handleDragStart}
                onDragCancel={handleDragCancel}
                onDragProgress={handleDragProgress}
              />
            )}

            {/* フィードバックオーバーレイ */}
            {swipeState === 'Feedback' && feedbackCorrect !== null && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-3xl shadow-lg border border-gray-100">
                <span className="text-5xl mb-3">{feedbackCorrect ? '✅' : '❌'}</span>
                <span className={`text-2xl font-bold ${feedbackCorrect ? 'text-green-600' : 'text-red-500'}`}>
                  {feedbackCorrect ? '正解！' : '不正解...'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
