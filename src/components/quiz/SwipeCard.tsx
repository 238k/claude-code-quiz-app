'use client';

import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Quiz } from '@/types';

type Props = {
  quiz: Quiz;
  isTop: boolean;
  onSwipeConfirm: (direction: 'left' | 'right') => void;
  onDragStart: () => void;
  onDragCancel: () => void;
  onDragProgress: (progress: number) => void; // -1〜1
};

export default function SwipeCard({
  quiz,
  isTop,
  onSwipeConfirm,
  onDragStart,
  onDragCancel,
  onDragProgress,
}: Props) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const [isFlyingOut, setIsFlyingOut] = useState(false);
  const [flyDirection, setFlyDirection] = useState<'left' | 'right'>('right');

  function handleDragStart() {
    onDragStart();
  }

  function handleDrag() {
    const xVal = x.get();
    const threshold = typeof window !== 'undefined' ? window.innerWidth * 0.15 : 60;
    const progress = Math.min(Math.abs(xVal) / threshold, 1) * Math.sign(xVal);
    onDragProgress(progress);
  }

  function handleDragEnd() {
    const xVal = x.get();
    const threshold = typeof window !== 'undefined' ? window.innerWidth * 0.15 : 60;

    if (Math.abs(xVal) >= threshold) {
      const direction = xVal > 0 ? 'right' : 'left';
      setFlyDirection(direction);
      setIsFlyingOut(true);
      onSwipeConfirm(direction);
    } else {
      onDragCancel();
      onDragProgress(0);
    }
  }

  if (!isTop) {
    return (
      <div className="absolute inset-0 bg-white rounded-3xl shadow-md border border-gray-100 scale-95 -z-10" />
    );
  }

  return (
    <AnimatePresence>
      {!isFlyingOut ? (
        <motion.div
          className="absolute inset-0 bg-white rounded-3xl shadow-lg border border-gray-100 cursor-grab active:cursor-grabbing select-none"
          style={{ x, rotate }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          whileTap={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-center h-full px-8">
            <p className="text-center text-gray-900 font-medium text-lg leading-relaxed">
              {quiz.question}
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="absolute inset-0 bg-white rounded-3xl shadow-lg border border-gray-100"
          initial={{ x: x.get(), rotate: rotate.get() }}
          animate={{
            x: flyDirection === 'right' ? 600 : -600,
            rotate: flyDirection === 'right' ? 30 : -30,
            opacity: 0,
          }}
          transition={{ duration: 0.3, ease: 'easeIn' }}
        >
          <div className="flex items-center justify-center h-full px-8">
            <p className="text-center text-gray-900 font-medium text-lg leading-relaxed">
              {quiz.question}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
