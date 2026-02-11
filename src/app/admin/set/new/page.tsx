'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuizStore } from '@/hooks/useQuizStore';
import SetForm from '@/components/admin/SetForm';
import QuizList from '@/components/admin/QuizList';
import { Quiz } from '@/types';

export default function NewSetPage() {
  const router = useRouter();
  const { addSet, addQuiz } = useQuizStore();

  const [formData, setFormData] = useState({ title: '', description: '' });
  const [pendingQuizzes, setPendingQuizzes] = useState<
    Omit<Quiz, 'id' | 'setId' | 'createdAt' | 'updatedAt'>[]
  >([]);
  const [error, setError] = useState('');

  function handleSave() {
    if (!formData.title.trim()) {
      setError('セットタイトルを入力してください');
      return;
    }
    const newSet = addSet({ title: formData.title.trim(), description: formData.description.trim() || undefined });
    for (const q of pendingQuizzes) {
      addQuiz({ ...q, setId: newSet.id });
    }
    router.push('/admin');
  }

  // pending quizzes management (before set is saved)
  function handleAddPending(data: Omit<Quiz, 'id' | 'setId' | 'createdAt' | 'updatedAt'>) {
    setPendingQuizzes((prev) => [...prev, data]);
  }

  function handleUpdatePending(index: number, data: Omit<Quiz, 'id' | 'setId' | 'createdAt' | 'updatedAt'>) {
    setPendingQuizzes((prev) => prev.map((q, i) => (i === index ? data : q)));
  }

  function handleDeletePending(index: number) {
    setPendingQuizzes((prev) => prev.filter((_, i) => i !== index));
  }

  // Convert pending quizzes to Quiz-like objects for QuizList
  const now = new Date().toISOString();
  const displayQuizzes: Quiz[] = pendingQuizzes.map((q, i) => ({
    ...q,
    id: `pending-${i}`,
    setId: '',
    createdAt: now,
    updatedAt: now,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin" className="text-gray-400 hover:text-gray-600 transition-colors">←</Link>
          <h1 className="text-lg font-bold text-gray-800">セット作成</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <SetForm onChange={setFormData} />
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <QuizList
            quizzes={displayQuizzes}
            onAdd={handleAddPending}
            onUpdate={(id, data) => {
              const index = parseInt(id.replace('pending-', ''));
              handleUpdatePending(index, data);
            }}
            onDelete={(id) => {
              const index = parseInt(id.replace('pending-', ''));
              handleDeletePending(index);
            }}
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          保存する
        </button>
      </div>
    </div>
  );
}
