export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ProblemStep {
  stepNumber: number;
  title: string;
  explanation: string;
  mathLatex?: string;
  why?: string;       // 왜 이렇게 하는지 직관적 이유와 원리
  pitfall?: string;   // 학생들이 흔히 저지르는 실수/주의점
}

export interface Problem {
  id: string;
  topicId: string;
  subtopicId: string;
  title: string;
  difficulty: Difficulty;
  questionText: string;
  questionLatex: string;
  correctAnswer: string;
  answerDisplayLatex?: string;
  distractors: string[]; // 3 wrong answers for multiple choice
  choices?: string[];    // randomized [correctAnswer, ...distractors]
  steps: ProblemStep[];
  hints: string[];
  conceptSummary: string;
  unit: string;
}

export interface ProblemGenerator {
  topicId: string;
  subtopicId: string;
  name: string;
  description: string;
  generate: (difficulty?: Difficulty) => Problem;
}

export interface UserProgressRecord {
  totalSolved: number;
  totalCorrect: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  topicMastery: Record<string, {
    solved: number;
    correct: number;
    lastPracticed: string;
    level: number; // 0 to 5
  }>;
  incorrectProblemIds: string[]; // for review
  diagnosticScore?: {
    date: string;
    score: number;
    recommendedTopicId: string;
  };
}
