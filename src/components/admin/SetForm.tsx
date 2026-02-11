'use client';

import { useState } from 'react';
import { QuizSet } from '@/types';

type Props = {
  initialData?: Partial<QuizSet>;
  onChange: (data: { title: string; description: string }) => void;
};

export default function SetForm({ initialData, onChange }: Props) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');

  function handleTitleChange(value: string) {
    setTitle(value);
    onChange({ title: value, description });
  }

  function handleDescriptionChange(value: string) {
    setDescription(value);
    onChange({ title, description: value });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          セットタイトル <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="例：一般常識クイズ"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">説明（任意）</label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={2}
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="セットの説明を入力..."
        />
      </div>
    </div>
  );
}
