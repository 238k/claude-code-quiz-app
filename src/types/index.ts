export type CorrectAnswer = 'A' | 'B';

export type CharacterState =
  | 'idle'
  | 'thinking'
  | 'correct'
  | 'incorrect'
  | 'perfect'
  | 'low_score';

export type SwipeState = 'Idle' | 'Dragging' | 'Feedback';

export interface Quiz {
  id: string;
  setId: string;
  question: string;
  optionA: string;
  optionB: string;
  correctAnswer: CorrectAnswer;
  explanation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizSet {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnswerRecord {
  quiz: Quiz;
  selectedAnswer: CorrectAnswer;
  isCorrect: boolean;
}
