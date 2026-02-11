'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuizStore } from '@/hooks/useQuizStore';
import SetForm from '@/components/admin/SetForm';
import QuizList from '@/components/admin/QuizList';
import { Quiz } from '@/types';

type Props = { params: Promise<{ id: string }> };

export default function EditSetPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { sets, getQuizzesBySetId, updateSet, addQuiz, updateQuiz, deleteQuiz } = useQuizStore();

  const set = sets.find((s) => s.id === id);
  const quizzes = getQuizzesBySetId(id);

  const [formData, setFormData] = useState({
    title: set?.title ?? '',
    description: set?.description ?? '',
  });
  const [error, setError] = useState('');

  if (!set) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">セットが見つかりません</p>
          <Link href="/admin" className="text-indigo-600 text-sm">管理画面へ戻る</Link>
        </div>
      </div>
    );
  }

  function handleSave() {
    if (!formData.title.trim()) {
      setError('セットタイトルを入力してください');
      return;
    }
    updateSet(id, { title: formData.title.trim(), description: formData.description.trim() || undefined });
    router.push('/admin');
  }

  function handleAddQuiz(data: Omit<Quiz, 'id' | 'setId' | 'createdAt' | 'updatedAt'>) {
    addQuiz({ ...data, setId: id });
  }

  function handleUpdateQuiz(quizId: string, data: Omit<Quiz, 'id' | 'setId' | 'createdAt' | 'updatedAt'>) {
    updateQuiz(quizId, data);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin" className="text-gray-400 hover:text-gray-600 transition-colors">←</Link>
          <h1 className="text-lg font-bold text-gray-800">セット編集</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <SetForm initialData={set} onChange={setFormData} />
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <QuizList
            quizzes={quizzes}
            onAdd={handleAddQuiz}
            onUpdate={handleUpdateQuiz}
            onDelete={deleteQuiz}
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
