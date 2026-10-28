'use client';

import React, { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Problem, Difficulty } from '@/lib/generators/types';
import { getGenerator } from '@/lib/generators';
import { recordProblemResult } from '@/lib/storage';
import MathRenderer from '../ui/MathRenderer';
import MathKeypad from '../ui/MathKeypad';
import ScratchpadOverlay from '../ui/ScratchpadOverlay';
import GeminiKeyModal from '../ui/GeminiKeyModal';
import AiTutorPanel from './AiTutorPanel';
import MultipleChoice from './MultipleChoice';
import StepSolution from './StepSolution';
import { getGeminiApiKey } from '@/lib/gemini';
import { ArrowLeft, RefreshCw, Lightbulb, Keyboard, LayoutGrid, PenLine, Sparkles } from 'lucide-react';

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
  const [isScratchpadOpen, setIsScratchpadOpen] = useState<boolean>(false);
  const [showAiTutor, setShowAiTutor] = useState<boolean>(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [geminiKey, setGeminiKey] = useState<string>(() => getGeminiApiKey() || '');

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
    setShowAiTutor(false);
  }, [generatorItem, difficulty]);

  const handleToggleAiTutor = () => {
    const currentKey = geminiKey || getGeminiApiKey();
    if (!currentKey) {
      setIsKeyModalOpen(true);
      return;
    }
    setShowAiTutor((prev) => !prev);
  };

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
      <div className="p-8 text-center text-on-surface-variant">
        문제를 생성하는 중 오류가 발생했습니다.
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-16">
      {/* Navigation & Controls Bar */}
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
        {/* MD3 Text Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant hover:text-on-surface px-3 py-1.5 rounded-md3-full hover:bg-surface-container-high transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>단원 목록</span>
        </button>

        {/* MD3 Session Score Chip & Scratchpad Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsScratchpadOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md3-full border transition-all ${
              isScratchpadOpen
                ? 'bg-primary text-on-primary border-primary shadow-xs'
                : 'bg-surface-container-high border-outline-variant/40 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
            }`}
            title="수식 계산용 투명 연습장 열기"
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>연습장 {isScratchpadOpen ? 'ON' : '열기'}</span>
          </button>

          <span className="text-xs font-mono px-3 py-1 rounded-md3-full bg-surface-container-high border border-outline-variant/40 text-on-surface-variant font-medium">
            세션 성적: <span className="text-emerald-400 font-bold">{correctCountInSession}</span> / {solvedCountInSession}
          </span>
        </div>
      </div>

      {/* Problem Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono font-medium text-primary">{problem.unit}</span>
          <h2 className="text-lg font-bold text-on-surface">{problem.title}</h2>
        </div>

        {/* MD3 Segmented Button for Input Mode */}
        <div className="flex items-center bg-surface-container border border-outline-variant/60 rounded-md3-full p-1 shadow-xs">
          <button
            onClick={() => setInputMode('multiple')}
            className={`px-3 py-1 rounded-md3-full text-xs font-medium flex items-center gap-1.5 transition-all md3-button-motion ${
              inputMode === 'multiple'
                ? 'bg-secondary-container text-on-secondary-container shadow-xs font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>객관식</span>
          </button>
          <button
            onClick={() => setInputMode('keypad')}
            className={`px-3 py-1 rounded-md3-full text-xs font-medium flex items-center gap-1.5 transition-all md3-button-motion ${
              inputMode === 'keypad'
                ? 'bg-secondary-container text-on-secondary-container shadow-xs font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>키패드</span>
          </button>
        </div>
      </div>

      {/* Question Card (MD3 Elevated Card) */}
      <div
        suppressHydrationWarning
        className="p-6 sm:p-7 bg-surface-container-low border border-outline-variant/50 rounded-md3-xl space-y-4 shadow-sm text-center relative overflow-hidden"
      >
        <p suppressHydrationWarning className="text-sm text-on-surface-variant">{problem.questionText}</p>
        <div suppressHydrationWarning className="py-5 px-3 bg-surface-container-lowest border border-outline-variant/50 rounded-md3-lg shadow-inner">
          <MathRenderer latex={problem.questionLatex} displayMode className="text-xl sm:text-2xl text-on-surface" />
        </div>

        {/* Hint & AI Tutor toggle buttons */}
        {!isSubmitted && (
          <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => setShowHints(!showHints)}
              className="text-xs text-on-surface-variant hover:text-amber-300 px-3 py-1.5 rounded-md3-full hover:bg-surface-container flex items-center gap-1.5 transition-colors border border-outline-variant/30 hover:border-outline-variant/60"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>{showHints ? '힌트 숨기기' : '힌트 보기'}</span>
            </button>

            <button
              onClick={handleToggleAiTutor}
              className={`text-xs px-3.5 py-1.5 rounded-md3-full flex items-center gap-1.5 transition-all border ${
                showAiTutor
                  ? 'bg-primary/20 text-primary border-primary/50 shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container border-outline-variant/30 hover:border-primary/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>{showAiTutor ? 'AI 튜터 닫기' : 'AI 풀이 보기'}</span>
            </button>
          </div>
        )}

        {showHints && !isSubmitted && (
          <div className="p-4 bg-tertiary-container/30 border border-outline-variant/50 rounded-md3-md text-xs text-on-tertiary-container text-left space-y-1.5 leading-relaxed">
            {problem.hints.map((hint, idx) => (
              <p key={idx}>💡 {hint}</p>
            ))}
          </div>
        )}
      </div>

      {/* AI Tutor Panel (shown when requested) */}
      {showAiTutor && !isSubmitted && (
        <AiTutorPanel
          problem={problem}
          apiKey={geminiKey}
          onOpenKeySettings={() => setIsKeyModalOpen(true)}
          onClose={() => setShowAiTutor(false)}
        />
      )}

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

          {/* MD3 Filled Button: Next Problem */}
          <button
            onClick={loadNextProblem}
            className="w-full py-3.5 bg-primary text-on-primary font-semibold text-sm rounded-md3-full hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>다음 문제 생성하기 (새로운 난수)</span>
          </button>
        </div>
      )}

      {/* Floating Scratchpad Quick Action Button (when closed) */}
      {!isScratchpadOpen && (
        <button
          onClick={() => setIsScratchpadOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-md3-full bg-surface-container-high/95 hover:bg-primary text-on-surface hover:text-on-primary border border-outline-variant/60 hover:border-primary shadow-xl backdrop-blur-md transition-all text-xs font-semibold hover:scale-105 active:scale-95 group"
          title="수식 계산용 투명 연습장 열기"
        >
          <PenLine className="w-4 h-4 text-primary group-hover:text-on-primary transition-colors" />
          <span>연습장</span>
        </button>
      )}

      {/* Transparent Scratchpad Overlay */}
      <ScratchpadOverlay
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
        problemId={problem.id}
      />

      {/* Gemini API Key Modal */}
      <GeminiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onKeySaved={(newKey) => {
          setGeminiKey(newKey);
          setShowAiTutor(true);
        }}
      />
    </div>
  );
};

export default DrillView;
