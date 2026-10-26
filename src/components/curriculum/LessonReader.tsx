'use client';

import React from 'react';
import { TopicConcept } from '@/lib/curriculum-data';
import MathRenderer from '../ui/MathRenderer';
import InteractiveGraph from '../ui/InteractiveGraph';
import { BookOpen, Dumbbell, Sparkles, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';

interface LessonReaderProps {
  lesson: TopicConcept;
  onBack: () => void;
  onStartDrill: (generatorId: string) => void;
}

export const LessonReader: React.FC<LessonReaderProps> = ({
  lesson,
  onBack,
  onStartDrill,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>커리큘럼 목록으로</span>
        </button>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-400">
          약 {lesson.estimatedMinutes}분 소요
        </span>
      </div>

      {/* Title & Overview */}
      <div className="space-y-2">
        <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
          {lesson.unit}
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-100">{lesson.title}</h1>
        <p className="text-base text-neutral-400">{lesson.subtitle}</p>
      </div>

      {/* Summary Box */}
      <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl relative overflow-hidden">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-sm text-neutral-300 leading-relaxed">{lesson.summary}</p>
        </div>
      </div>

      {/* Interactive Visualizer if available */}
      {lesson.hasInteractiveGraph && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-neutral-200">시각화로 원리 체득하기</h3>
          <InteractiveGraph type={lesson.graphType} />
        </div>
      )}

      {/* Key Points */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-200 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <span>핵심 개념 & 공식 정리</span>
        </h3>
        <div className="grid gap-4">
          {lesson.keyPoints.map((point, idx) => (
            <div
              key={idx}
              className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3 hover:border-neutral-700 transition-all"
            >
              <h4 className="text-base font-semibold text-neutral-200">{point.title}</h4>
              <p className="text-sm text-neutral-400 whitespace-pre-line leading-relaxed">
                {point.description}
              </p>
              {point.formulaLatex && (
                <div className="p-3 bg-neutral-950/70 border border-neutral-800/80 rounded-xl overflow-x-auto text-center">
                  <MathRenderer latex={point.formulaLatex} displayMode />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Worked Example */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-200">대표 예제 풀이</h3>
        {lesson.examples.map((ex, idx) => (
          <div
            key={idx}
            className="p-5 bg-neutral-900/40 border border-neutral-800 rounded-2xl space-y-4"
          >
            <div className="space-y-2">
              <span className="text-xs font-mono text-indigo-400">Example {idx + 1}</span>
              <p className="text-sm font-medium text-neutral-200">{ex.question}</p>
              <div className="py-2 text-center bg-neutral-950/50 rounded-lg">
                <MathRenderer latex={ex.questionLatex} displayMode />
              </div>
            </div>

            <div className="border-t border-neutral-800/80 pt-3 space-y-2">
              <span className="text-xs font-semibold text-neutral-400">단계별 풀이 과정:</span>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                {ex.solutionSteps.map((step, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 p-2 bg-emerald-950/20 border border-emerald-900/40 rounded-lg text-center">
                <span className="text-xs text-emerald-300 mr-2 font-medium">정답:</span>
                <MathRenderer latex={ex.answerLatex} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA to start drill */}
      <div className="p-6 bg-gradient-to-r from-indigo-950/40 to-neutral-900 border border-indigo-900/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-semibold text-neutral-100">개념 이해를 마쳤나요?</h4>
          <p className="text-xs text-neutral-400 mt-0.5">
            무한 알고리즘 연습 문제로 손에 완전히 익혀보세요.
          </p>
        </div>
        <button
          onClick={() => onStartDrill(lesson.generatorId)}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-indigo-950/50 shrink-0"
        >
          <Dumbbell className="w-4 h-4" />
          <span>연습 드릴 풀기</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default LessonReader;
