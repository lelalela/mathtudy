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
    <div className={`p-5 rounded-2xl border space-y-5 animate-fade-in ${
      isCorrect 
        ? 'bg-emerald-950/20 border-emerald-900/50' 
        : 'bg-rose-950/20 border-rose-900/50'
    }`}>
      {/* Header Result */}
      <div className="flex items-center gap-3">
        {isCorrect ? (
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        ) : (
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
            <AlertCircle className="w-5 h-5" />
          </div>
        )}
        <div>
          <h4 className={`text-base font-bold ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
            {isCorrect ? '정답입니다! 완벽해요.' : '아쉽네요. 단계별 풀이를 확인해 보세요.'}
          </h4>
          {correctAnswerLatex && (
            <div className="text-xs text-neutral-300 mt-0.5 flex items-center gap-1.5">
              <span>최종 정답:</span>
              <MathRenderer latex={correctAnswerLatex} className="font-semibold text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Step by Step Breakdown */}
      <div className="space-y-3 border-t border-neutral-800 pt-3">
        <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
          단계별 수학적 전개 과정 (Step-by-Step)
        </span>
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.stepNumber}
              className="p-3.5 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                  {step.stepNumber}
                </span>
                <span className="text-xs font-semibold text-neutral-200">{step.title}</span>
              </div>
              <p className="text-xs text-neutral-300 pl-7 leading-relaxed">{step.explanation}</p>
              {step.mathLatex && (
                <div className="ml-7 p-2.5 bg-neutral-950/80 border border-neutral-850 rounded-lg text-center overflow-x-auto">
                  <MathRenderer latex={step.mathLatex} displayMode />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Concept Summary Note */}
      {conceptSummary && (
        <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-xl text-xs text-neutral-400 flex items-start gap-2">
          <span className="font-semibold text-indigo-400 shrink-0">📌 단원 핵심:</span>
          <span>{conceptSummary}</span>
        </div>
      )}
    </div>
  );
};

export default StepSolution;
