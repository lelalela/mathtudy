'use client';

import React, { useState } from 'react';
import { Problem } from '@/lib/generators/types';
import { generateFractionAddition } from '@/lib/generators/arithmetic';
import { generateTwoStepLinearEquation } from '@/lib/generators/linear-equations';
import { generateSpecialTrigValues } from '@/lib/generators/trigonometry-pythagoras';
import { generatePolynomialDerivative } from '@/lib/generators/calculus';
import { generateMatrixDeterminant } from '@/lib/generators/linear-algebra-stats';
import { saveProgress, loadProgress } from '@/lib/storage';
import MathRenderer from '../ui/MathRenderer';
import MultipleChoice from '../drill/MultipleChoice';
import { Compass, ArrowRight, X, Sparkles } from 'lucide-react';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (recommendedTopicId: string) => void;
}

const DiagnosticContent: React.FC<{
  onClose: () => void;
  onComplete: (recommendedTopicId: string) => void;
}> = ({ onClose, onComplete }) => {
  const [questions] = useState<Problem[]>(() => [
    generateFractionAddition('medium'),
    generateTwoStepLinearEquation('medium'),
    generateSpecialTrigValues('medium'),
    generatePolynomialDerivative('medium'),
    generateMatrixDeterminant('medium'),
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [recommendedTopic, setRecommendedTopic] = useState({ id: 'fractions', name: '01. 기초 산수' });

  const currentProb = questions[currentIndex];

  const handleSelectChoice = (choice: string) => {
    setSelectedChoices((prev) => ({ ...prev, [currentIndex]: choice }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Calculate score
      let correctCount = 0;
      let firstFailedTopicId = '';
      let firstFailedTopicName = '';

      questions.forEach((q, idx) => {
        const userAns = selectedChoices[idx]?.trim().replace(/\s+/g, '');
        const rightAns = q.correctAnswer.trim().replace(/\s+/g, '');
        if (userAns === rightAns) {
          correctCount++;
        } else if (!firstFailedTopicId) {
          firstFailedTopicId = q.subtopicId;
          firstFailedTopicName = q.unit;
        }
      });

      const scorePercent = Math.round((correctCount / questions.length) * 100);
      setFinalScore(scorePercent);

      // Determine recommendation
      let recId = firstFailedTopicId || 'derivatives';
      let recName = firstFailedTopicName || '미적분학 및 고급수학';
      if (scorePercent === 100) {
        recId = 'matrix-determinant';
        recName = '선형대수와 고급수학 마스터 과정';
      }
      setRecommendedTopic({ id: recId, name: recName });
      setIsFinished(true);

      // Save diagnostic to storage
      const cur = loadProgress();
      saveProgress({
        ...cur,
        diagnosticScore: {
          date: new Date().toISOString().split('T')[0],
          score: scorePercent,
          recommendedTopicId: recId,
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isFinished ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
                <Compass className="w-4 h-4" />
                <span>성인 맞춤 수학 진단 평가 ({currentIndex + 1} / {questions.length})</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-100">{currentProb.unit}</h3>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="p-5 bg-neutral-950/80 border border-neutral-800 rounded-2xl text-center space-y-3">
              <p className="text-xs text-neutral-400">{currentProb.questionText}</p>
              <div className="py-2">
                <MathRenderer latex={currentProb.questionLatex} displayMode className="text-xl" />
              </div>
            </div>

            {/* Choices */}
            <MultipleChoice
              choices={currentProb.choices || []}
              selectedChoice={selectedChoices[currentIndex] || null}
              onSelect={handleSelectChoice}
              isSubmitted={false}
              correctAnswer={currentProb.correctAnswer}
            />

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={!selectedChoices[currentIndex]}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-indigo-950/40"
            >
              <span>{currentIndex === questions.length - 1 ? '진단 완료하기' : '다음 문제'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center space-y-6 py-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 mx-auto flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-neutral-100">진단 평가 완료</h3>
              <p className="text-sm text-neutral-400">
                수학 진단 점수: <span className="text-indigo-400 font-bold font-mono text-base">{finalScore}점</span>
              </p>
            </div>

            <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-2xl text-left space-y-2">
              <span className="text-xs text-neutral-500 font-mono">추천 시작 단원</span>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-neutral-100">{recommendedTopic.name}</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 font-medium">
                  바로 추천
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                현재 수준에 가장 적합한 개념부터 탄탄하게 채워나갈 수 있습니다.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onComplete(recommendedTopic.id);
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-indigo-950/40"
            >
              <span>추천 단원으로 이동하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  if (!isOpen) return null;
  return <DiagnosticContent onClose={onClose} onComplete={onComplete} />;
};

export default DiagnosticModal;
