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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      {/* MD3 Dialog Container (28px corner radius) */}
      <div className="w-full max-w-lg bg-surface-container-high border border-outline-variant/60 rounded-md3-xl p-6 sm:p-7 shadow-xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-9 w-9 rounded-md3-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {!isFinished ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-1 pr-8">
              <div className="flex items-center gap-2 text-primary text-xs font-semibold">
                <Compass className="w-4 h-4" />
                <span>성인 맞춤 수학 진단 평가 ({currentIndex + 1} / {questions.length})</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface">{currentProb.unit}</h3>
            </div>

            {/* MD3 Linear Progress Bar */}
            <div className="w-full h-1 bg-surface-container-highest rounded-md3-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="p-5 bg-surface-container-lowest border border-outline-variant/40 rounded-md3-lg text-center space-y-3 shadow-inner">
              <p className="text-xs text-on-surface-variant">{currentProb.questionText}</p>
              <div className="py-2">
                <MathRenderer latex={currentProb.questionLatex} displayMode className="text-xl text-on-surface" />
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

            {/* MD3 Filled Button */}
            <button
              onClick={handleNext}
              disabled={!selectedChoices[currentIndex]}
              className="w-full py-3.5 bg-primary hover:brightness-110 disabled:bg-surface-container-highest disabled:text-on-surface-variant/40 text-on-primary font-medium text-sm rounded-md3-full transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xs"
            >
              <span>{currentIndex === questions.length - 1 ? '진단 완료하기' : '다음 문제'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center space-y-6 py-3">
            <div className="w-14 h-14 rounded-md3-xl bg-primary-container text-on-primary-container mx-auto flex items-center justify-center shadow-xs">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-on-surface">진단 평가 완료</h3>
              <p className="text-sm text-on-surface-variant">
                수학 진단 점수: <span className="text-primary font-bold font-mono text-base">{finalScore}점</span>
              </p>
            </div>

            <div className="p-5 bg-surface-container border border-outline-variant/50 rounded-md3-lg text-left space-y-2">
              <span className="text-xs text-on-surface-variant font-mono font-medium">추천 시작 단원</span>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-on-surface">{recommendedTopic.name}</span>
                <span className="text-xs px-2.5 py-1 rounded-md3-full bg-primary-container text-on-primary-container font-medium">
                  바로 추천
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                현재 수준에 가장 적합한 개념부터 탄탄하게 채워나갈 수 있습니다.
              </p>
            </div>

            {/* MD3 Filled Button */}
            <button
              onClick={() => {
                onClose();
                onComplete(recommendedTopic.id);
              }}
              className="w-full py-3.5 bg-primary hover:brightness-110 text-on-primary font-medium text-sm rounded-md3-full transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xs"
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
