'use client';

import { useContext } from 'react';
import { QuizStoreContext } from '@/context/QuizStoreContext';

export function useQuizStore() {
  const ctx = useContext(QuizStoreContext);
  if (!ctx) {
    throw new Error('useQuizStore must be used within QuizStoreProvider');
  }
  return ctx;
}
