'use client';

import { Quiz } from '@/types';
import SwipeCard from './SwipeCard';

type Props = {
  quizzes: Quiz[];
  currentIndex: number;
  onSwipeConfirm: (direction: 'left' | 'right') => void;
  onDragStart: () => void;
  onDragCancel: () => void;
  onDragProgress: (progress: number) => void;
};

export default function CardStack({
  quizzes,
  currentIndex,
  onSwipeConfirm,
  onDragStart,
  onDragCancel,
  onDragProgress,
}: Props) {
  const current = quizzes[currentIndex];
  const next = quizzes[currentIndex + 1];

  return (
    <div className="absolute inset-0">
      {/* 背後のカード */}
      {next && (
        <SwipeCard
          key={`bg-${next.id}`}
          quiz={next}
          isTop={false}
          onSwipeConfirm={() => {}}
          onDragStart={() => {}}
          onDragCancel={() => {}}
          onDragProgress={() => {}}
        />
      )}
      {/* 現在のカード */}
      {current && (
        <SwipeCard
          key={current.id}
          quiz={current}
          isTop={true}
          onSwipeConfirm={onSwipeConfirm}
          onDragStart={onDragStart}
          onDragCancel={onDragCancel}
          onDragProgress={onDragProgress}
        />
      )}
    </div>
  );
}
