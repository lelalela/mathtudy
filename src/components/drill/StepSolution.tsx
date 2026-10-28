'use client';

import React from 'react';
import { ProblemStep } from '@/lib/generators/types';
import MathRenderer from '../ui/MathRenderer';
import { CheckCircle2, AlertCircle, HelpCircle, AlertTriangle, Sparkles } from 'lucide-react';

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
      className={`p-6 rounded-md3-xl border space-y-6 shadow-sm transition-all ${
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
            {isCorrect ? '정답입니다! 완벽해요.' : '아쉽네요. 상세한 단계별 풀이를 확인해 보세요.'}
          </h4>
          {correctAnswerLatex && (
            <div className="text-xs text-on-surface-variant mt-1 flex items-center gap-1.5 flex-wrap">
              <span className="font-medium">최종 정답:</span>
              <div className="inline-block px-2.5 py-0.5 rounded-md3-sm bg-surface-container-high border border-outline-variant/40">
                <MathRenderer latex={correctAnswerLatex} className="font-semibold text-primary" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step by Step Breakdown */}
      <div className="space-y-4 border-t border-outline-variant/30 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>단계별 상세 해설 (Step-by-Step)</span>
          </span>
          <span className="text-[11px] text-on-surface-variant/70">
            총 {steps.length}단계 풀이 과정
          </span>
        </div>

        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.stepNumber}
              className="p-4 sm:p-5 bg-surface-container border border-outline-variant/50 rounded-md3-lg space-y-3.5 shadow-xs"
            >
              {/* Step Header */}
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-md3-full bg-primary-container text-on-primary-container font-mono text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
                  {step.stepNumber}
                </span>
                <span className="text-sm font-bold text-on-surface">{step.title}</span>
              </div>

              {/* Step Main Explanation */}
              <p className="text-xs sm:text-sm text-on-surface/90 pl-8 leading-relaxed">
                {step.explanation}
              </p>

              {/* Why & Intuition Box */}
              {step.why && (
                <div className="ml-8 p-3 rounded-md3-md bg-primary-container/20 border border-primary/30 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-primary text-xs">
                    <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>왜 이렇게 하나요? (원리 & 직관)</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {step.why}
                  </p>
                </div>
              )}

              {/* Math Equation Breakdown */}
              {step.mathLatex && (
                <div className="ml-8 p-3.5 bg-surface-container-lowest border border-outline-variant/40 rounded-md3-md text-center overflow-x-auto shadow-inner">
                  <MathRenderer latex={step.mathLatex} displayMode />
                </div>
              )}

              {/* Pitfall / Common Mistake Warning */}
              {step.pitfall && (
                <div className="ml-8 p-3 rounded-md3-md bg-amber-500/10 border border-amber-500/30 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-300 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <span>⚠️ 조심하세요! (흔한 실수 & 함정)</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {step.pitfall}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Concept Summary Note */}
      {conceptSummary && (
        <div className="p-4 bg-surface-container-high border border-outline-variant/50 rounded-md3-lg text-xs text-on-surface-variant flex items-start gap-2.5 leading-relaxed shadow-xs">
          <span className="font-bold text-primary shrink-0">📌 단원 핵심 정리:</span>
          <span>{conceptSummary}</span>
        </div>
      )}
    </div>
  );
};

export default StepSolution;
