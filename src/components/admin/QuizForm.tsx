'use client';

import { useState } from 'react';
import { CorrectAnswer, Quiz } from '@/types';

type QuizFormData = {
  question: string;
  optionA: string;
  optionB: string;
  correctAnswer: CorrectAnswer;
  explanation: string;
};

type Props = {
  initialData?: Partial<Quiz>;
  onSave: (data: Omit<Quiz, 'id' | 'setId' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
};

export default function QuizForm({ initialData, onSave, onCancel }: Props) {
  const [form, setForm] = useState<QuizFormData>({
    question: initialData?.question ?? '',
    optionA: initialData?.optionA ?? '',
    optionB: initialData?.optionB ?? '',
    correctAnswer: initialData?.correctAnswer ?? 'A',
    explanation: initialData?.explanation ?? '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof QuizFormData, string>>>({});

  function validate(): boolean {
    const newErrors: Partial<Record<keyof QuizFormData, string>> = {};
    if (!form.question.trim()) newErrors.question = '問題文を入力してください';
    if (!form.optionA.trim()) newErrors.optionA = '選択肢Aを入力してください';
    if (!form.optionB.trim()) newErrors.optionB = '選択肢Bを入力してください';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSave({
      question: form.question.trim(),
      optionA: form.optionA.trim(),
      optionB: form.optionB.trim(),
      correctAnswer: form.correctAnswer,
      explanation: form.explanation.trim() || undefined,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">問題文 *</label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
          value={form.question}
          onChange={(e) => setForm((prev) => ({ ...prev, question: e.target.value }))}
          placeholder="問題文を入力..."
        />
        {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">選択肢A（← 左スワイプ） *</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={form.optionA}
          onChange={(e) => setForm((prev) => ({ ...prev, optionA: e.target.value }))}
          placeholder="選択肢Aを入力..."
        />
        {errors.optionA && <p className="text-red-500 text-xs mt-1">{errors.optionA}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">選択肢B（右スワイプ →） *</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={form.optionB}
          onChange={(e) => setForm((prev) => ({ ...prev, optionB: e.target.value }))}
          placeholder="選択肢Bを入力..."
        />
        {errors.optionB && <p className="text-red-500 text-xs mt-1">{errors.optionB}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">正解 *</label>
        <div className="flex gap-4">
          {(['A', 'B'] as CorrectAnswer[]).map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="correctAnswer"
                value={opt}
                checked={form.correctAnswer === opt}
                onChange={() => setForm((prev) => ({ ...prev, correctAnswer: opt }))}
                className="accent-indigo-600"
              />
              <span className="text-sm">選択肢{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">解説（任意）</label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={2}
          value={form.explanation}
          onChange={(e) => setForm((prev) => ({ ...prev, explanation: e.target.value }))}
          placeholder="解説を入力..."
        />
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          キャンセル
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          保存
        </button>
      </div>
    </div>
  );
}
