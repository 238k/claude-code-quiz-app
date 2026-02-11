'use client';

import { useCallback } from 'react';
import { AnswerRecord, CorrectAnswer, Quiz } from '@/types';
import { sessionStore } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storageKeys';

export function useAnswerSession() {
  const initSession = useCallback(() => {
    sessionStore.remove(STORAGE_KEYS.ANSWER_SESSION);
  }, []);

  const addRecord = useCallback((quiz: Quiz, selectedAnswer: CorrectAnswer) => {
    const records = sessionStore.get<AnswerRecord[]>(STORAGE_KEYS.ANSWER_SESSION) ?? [];
    const newRecord: AnswerRecord = {
      quiz,
      selectedAnswer,
      isCorrect: selectedAnswer === quiz.correctAnswer,
    };
    sessionStore.set(STORAGE_KEYS.ANSWER_SESSION, [...records, newRecord]);
  }, []);

  const getRecords = useCallback((): AnswerRecord[] => {
    return sessionStore.get<AnswerRecord[]>(STORAGE_KEYS.ANSWER_SESSION) ?? [];
  }, []);

  const clearSession = useCallback(() => {
    sessionStore.remove(STORAGE_KEYS.ANSWER_SESSION);
  }, []);

  return { initSession, addRecord, getRecords, clearSession };
}
