'use client';

import React from 'react';
import { ProblemStep } from '@/lib/generators/types';
import MathRenderer from '../ui/MathRenderer';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface StepSolutionProps {
  steps: ProblemStep[];
  conceptSummary?: string;
  isCorrect: boolean;
  correctAnswerLatex?: string;
}

export const StepSolution: React.FC<StepSolutionProps> = ({
  steps,
  conceptSummary,
  isCorrect,
  correctAnswerLatex,
}) => {
  return (
    <div
      className={`p-6 rounded-md3-xl border space-y-5 shadow-xs ${
        isCorrect
          ? 'bg-surface-container-low border-emerald-500/40'
          : 'bg-surface-container-low border-error/40'
      }`}
    >
      {/* Header Result */}
      <div className="flex items-center gap-3.5">
        {isCorrect ? (
          <div className="p-2.5 rounded-md3-full bg-emerald-500/20 text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        ) : (
          <div className="p-2.5 rounded-md3-full bg-error-container text-on-error-container shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
        )}
        <div>
          <h4
            className={`text-base font-bold ${
              isCorrect ? 'text-emerald-300' : 'text-error'
            }`}
          >
            {isCorrect ? '정답입니다! 완벽해요.' : '아쉽네요. 단계별 풀이를 확인해 보세요.'}
          </h4>
          {correctAnswerLatex && (
            <div className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1.5">
              <span>최종 정답:</span>
              <MathRenderer latex={correctAnswerLatex} className="font-semibold text-on-surface" />
            </div>
          )}
        </div>
      </div>

      {/* Step by Step Breakdown */}
      <div className="space-y-3 border-t border-outline-variant/30 pt-4">
        <span className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase font-mono">
          단계별 수학적 전개 과정 (Step-by-Step)
        </span>
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.stepNumber}
              className="p-4 bg-surface-container border border-outline-variant/40 rounded-md3-lg space-y-2.5"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md3-full bg-primary-container text-on-primary-container font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                  {step.stepNumber}
                </span>
                <span className="text-xs font-semibold text-on-surface">{step.title}</span>
              </div>
              <p className="text-xs text-on-surface-variant pl-7.5 leading-relaxed">
                {step.explanation}
              </p>
              {step.mathLatex && (
                <div className="ml-7.5 p-3 bg-surface-container-lowest border border-outline-variant/40 rounded-md3-md text-center overflow-x-auto shadow-inner">
                  <MathRenderer latex={step.mathLatex} displayMode />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Concept Summary Note */}
      {conceptSummary && (
        <div className="p-3.5 bg-surface-container-high border border-outline-variant/40 rounded-md3-md text-xs text-on-surface-variant flex items-start gap-2 leading-relaxed">
          <span className="font-semibold text-primary shrink-0">📌 단원 핵심:</span>
          <span>{conceptSummary}</span>
        </div>
      )}
    </div>
  );
};

export default StepSolution;
