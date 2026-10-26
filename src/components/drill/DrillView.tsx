'use client';

import React, { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Problem, Difficulty } from '@/lib/generators/types';
import { getGenerator } from '@/lib/generators';
import { recordProblemResult } from '@/lib/storage';
import MathRenderer from '../ui/MathRenderer';
import MathKeypad from '../ui/MathKeypad';
import MultipleChoice from './MultipleChoice';
import StepSolution from './StepSolution';
import { ArrowLeft, RefreshCw, Lightbulb, Keyboard, LayoutGrid } from 'lucide-react';

interface DrillViewProps {
  generatorId: string;
  onBack: () => void;
  onRefreshProgress: () => void;
}

export const DrillView: React.FC<DrillViewProps> = ({
  generatorId,
  onBack,
  onRefreshProgress,
}) => {
  const [difficulty] = useState<Difficulty>('medium');
  const [inputMode, setInputMode] = useState<'multiple' | 'keypad'>('multiple');

  const generatorItem = getGenerator(generatorId);

  // Initialize problem directly
  const [problem, setProblem] = useState<Problem | null>(() => {
    return generatorItem ? generatorItem.generator('medium') : null;
  });

  // Answering states
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [keypadValue, setKeypadValue] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [solvedCountInSession, setSolvedCountInSession] = useState<number>(0);
  const [correctCountInSession, setCorrectCountInSession] = useState<number>(0);

  // Generate a fresh problem
  const loadNextProblem = useCallback(() => {
    if (!generatorItem) return;
    const newProb = generatorItem.generator(difficulty);
    setProblem(newProb);
    setSelectedChoice(null);
    setKeypadValue('');
    setIsSubmitted(false);
    setIsCorrect(false);
    setShowHints(false);
  }, [generatorItem, difficulty]);

  const handleSubmit = (userAnswer: string) => {
    if (!problem || isSubmitted) return;

    // Normalize for comparison
    const cleanUser = userAnswer.trim().replace(/\s+/g, '');
    const cleanCorrect = problem.correctAnswer.trim().replace(/\s+/g, '');

    // Check equivalence
    const correct = cleanUser === cleanCorrect;

    setIsCorrect(correct);
    setIsSubmitted(true);
    setSolvedCountInSession((c) => c + 1);
    if (correct) {
      setCorrectCountInSession((c) => c + 1);
      // Confetti burst
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // fallback
      }
    }

    // Persist to local storage
    recordProblemResult(generatorId, correct, problem.id);
    onRefreshProgress();
  };

  if (!generatorItem || !problem) {
    return (
      <div className="p-8 text-center text-neutral-400">
        문제를 생성하는 중 오류가 발생했습니다.
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Navigation & Controls Bar */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>단원 목록</span>
        </button>

        {/* Session Score */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-neutral-400">
            세션 성적: <span className="text-emerald-400 font-bold">{correctCountInSession}</span> / {solvedCountInSession}
          </span>
        </div>
      </div>

      {/* Problem Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-indigo-400">{problem.unit}</span>
          <h2 className="text-lg font-bold text-neutral-100">{problem.title}</h2>
        </div>

        {/* Input Mode Selector */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1">
          <button
            onClick={() => setInputMode('multiple')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
              inputMode === 'multiple'
                ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>객관식</span>
          </button>
          <button
            onClick={() => setInputMode('keypad')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
              inputMode === 'keypad'
                ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>키패드</span>
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 bg-neutral-900/90 border border-neutral-800 rounded-3xl space-y-4 shadow-xl text-center relative overflow-hidden">
        <p className="text-sm text-neutral-300">{problem.questionText}</p>
        <div className="py-4 px-2 bg-neutral-950/80 border border-neutral-850 rounded-2xl">
          <MathRenderer latex={problem.questionLatex} displayMode className="text-xl sm:text-2xl text-white" />
        </div>

        {/* Hint accordion button */}
        {!isSubmitted && (
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setShowHints(!showHints)}
              className="text-xs text-neutral-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>{showHints ? '힌트 숨기기' : '힌트 보기'}</span>
            </button>
          </div>
        )}

        {showHints && !isSubmitted && (
          <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-xs text-amber-200 text-left space-y-1">
            {problem.hints.map((hint, idx) => (
              <p key={idx}>💡 {hint}</p>
            ))}
          </div>
        )}
      </div>

      {/* Answer Inputs */}
      <div className="space-y-4">
        {inputMode === 'multiple' ? (
          <div className="space-y-4">
            <MultipleChoice
              choices={problem.choices || []}
              selectedChoice={selectedChoice}
              onSelect={(choice) => {
                setSelectedChoice(choice);
                handleSubmit(choice);
              }}
              isSubmitted={isSubmitted}
              correctAnswer={problem.correctAnswer}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <MathKeypad
              value={keypadValue}
              onChange={setKeypadValue}
              onSubmit={() => handleSubmit(keypadValue)}
              disabled={isSubmitted}
            />
          </div>
        )}
      </div>

      {/* Step Solution Breakdown (shown after submission) */}
      {isSubmitted && (
        <div className="space-y-4">
          <StepSolution
            steps={problem.steps}
            conceptSummary={problem.conceptSummary}
            isCorrect={isCorrect}
            correctAnswerLatex={problem.answerDisplayLatex}
          />

          {/* Next Problem Button */}
          <button
            onClick={loadNextProblem}
            className="w-full py-3.5 bg-neutral-100 hover:bg-white text-neutral-950 font-semibold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl active:scale-[0.99]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>다음 문제 생성하기 (새로운 난수)</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DrillView;
