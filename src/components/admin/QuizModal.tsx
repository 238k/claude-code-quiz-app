'use client';

import { Quiz } from '@/types';
import QuizForm from './QuizForm';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Quiz, 'id' | 'setId' | 'createdAt' | 'updatedAt'>) => void;
  initialQuiz?: Quiz;
};

export default function QuizModal({ isOpen, onClose, onSave, initialQuiz }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">
            {initialQuiz ? 'クイズを編集' : 'クイズを追加'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
            aria-label="閉じる"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-4">
          <QuizForm initialData={initialQuiz} onSave={onSave} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
}
