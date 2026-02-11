import { AnswerRecord } from '@/types';

type Props = {
  record: AnswerRecord;
  index: number;
};

export default function ReviewCard({ record, index }: Props) {
  const { quiz, selectedAnswer, isCorrect } = record;
  const selectedText = selectedAnswer === 'A' ? quiz.optionA : quiz.optionB;
  const correctText = quiz.correctAnswer === 'A' ? quiz.optionA : quiz.optionB;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border p-4 ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
      <div className="flex items-start gap-2 mb-3">
        <span className="text-base">{isCorrect ? '✅' : '❌'}</span>
        <p className="text-sm font-medium text-gray-800 leading-snug">
          Q{index + 1}. {quiz.question}
        </p>
      </div>

      <div className="flex flex-col gap-1.5 text-xs text-gray-600 pl-6">
        <div className="flex gap-1">
          <span className="text-gray-400 shrink-0">あなた:</span>
          <span className={isCorrect ? 'text-green-700' : 'text-red-600'}>
            選択肢{selectedAnswer}（{selectedText}）
          </span>
        </div>
        {!isCorrect && (
          <div className="flex gap-1">
            <span className="text-gray-400 shrink-0">正解:</span>
            <span className="text-green-700">
              選択肢{quiz.correctAnswer}（{correctText}）
            </span>
          </div>
        )}
        {quiz.explanation && (
          <div className="flex gap-1 mt-1 pt-1.5 border-t border-gray-100">
            <span className="text-gray-400 shrink-0">解説:</span>
            <span className="text-gray-700 leading-relaxed">{quiz.explanation}</span>
          </div>
        )}
      </div>
    </div>
  );
}
