'use client';

import { useState } from 'react';
import { Quiz } from '@/types';
import QuizModal from './QuizModal';

type Props = {
  quizzes: Quiz[];
  onAdd: (data: Omit<Quiz, 'id' | 'setId' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, data: Omit<Quiz, 'id' | 'setId' | 'createdAt' | 'updatedAt'>) => void;
  onDelete: (id: string) => void;
};

export default function QuizList({ quizzes, onAdd, onUpdate, onDelete }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | undefined>(undefined);

  function openAdd() {
    setEditingQuiz(undefined);
    setIsModalOpen(true);
  }

  function openEdit(quiz: Quiz) {
    setEditingQuiz(quiz);
    setIsModalOpen(true);
  }

  function handleSave(data: Omit<Quiz, 'id' | 'setId' | 'createdAt' | 'updatedAt'>) {
    if (editingQuiz) {
      onUpdate(editingQuiz.id, data);
    } else {
      onAdd(data);
    }
    setIsModalOpen(false);
  }

  function handleDelete(id: string) {
    if (window.confirm('このクイズを削除しますか？')) {
      onDelete(id);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">クイズ（{quizzes.length}問）</h3>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {quizzes.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">クイズがありません</p>
        ) : (
          quizzes.map((quiz, index) => (
            <div
              key={quiz.id}
              className="flex items-start justify-between gap-3 bg-gray-50 rounded-lg px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 font-medium">
                  Q{index + 1}. {quiz.question}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  正解: 選択肢{quiz.correctAnswer}（{quiz.correctAnswer === 'A' ? quiz.optionA : quiz.optionB}）
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => openEdit(quiz)}
                  className="px-3 py-1 text-xs text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(quiz.id)}
                  className="px-3 py-1 text-xs text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                >
                  削除
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={openAdd}
        className="w-full py-2 text-sm text-indigo-600 border-2 border-dashed border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors"
      >
        + クイズを追加
      </button>

      <QuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialQuiz={editingQuiz}
      />
    </div>
  );
}
