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
    <div className="w-full max-w-3xl mx-auto space-y-8 pb-16">
      {/* Top Header / App Bar Bar */}
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
        {/* MD3 Text Button with Icon */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-medium text-on-surface-variant hover:text-on-surface px-3 py-1.5 rounded-md3-full hover:bg-surface-container-high transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>커리큘럼 목록으로</span>
        </button>
        {/* MD3 Assist Chip */}
        <span className="text-xs font-mono px-3 py-1 rounded-md3-full bg-surface-container-high border border-outline-variant/40 text-on-surface-variant font-medium">
          약 {lesson.estimatedMinutes}분 소요
        </span>
      </div>

      {/* Title & Overview */}
      <div className="space-y-2">
        <span className="text-xs font-semibold tracking-wider text-primary uppercase font-mono">
          {lesson.unit}
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
          {lesson.title}
        </h1>
        <p className="text-sm text-on-surface-variant">{lesson.subtitle}</p>
      </div>

      {/* Summary Box (MD3 Surface Container High) */}
      <div className="p-6 bg-surface-container-high border border-outline-variant/40 rounded-md3-xl relative overflow-hidden">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-md3-md bg-primary-container text-on-primary-container shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-sm text-on-surface leading-relaxed">{lesson.summary}</p>
        </div>
      </div>

      {/* Interactive Visualizer if available */}
      {lesson.hasInteractiveGraph && (
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-on-surface">시각화로 원리 체득하기</h3>
          <InteractiveGraph type={lesson.graphType} />
        </div>
      )}

      {/* Key Points */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-on-surface flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <span>핵심 개념 & 공식 정리</span>
        </h3>
        <div className="grid gap-4">
          {lesson.keyPoints.map((point, idx) => (
            <div
              key={idx}
              className="p-6 bg-surface-container-low border border-outline-variant/50 hover:border-outline/60 rounded-md3-xl space-y-3 md3-card-hover"
            >
              <h4 className="text-base font-semibold text-on-surface">{point.title}</h4>
              <p className="text-xs sm:text-sm text-on-surface-variant whitespace-pre-line leading-relaxed">
                {point.description}
              </p>
              {point.formulaLatex && (
                <div className="p-4 bg-surface-container-lowest border border-outline-variant/50 rounded-md3-md overflow-x-auto text-center shadow-inner">
                  <MathRenderer latex={point.formulaLatex} displayMode />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Worked Example */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-on-surface">대표 예제 풀이</h3>
        {lesson.examples.map((ex, idx) => (
          <div
            key={idx}
            className="p-6 bg-surface-container-low border border-outline-variant/50 rounded-md3-xl space-y-4"
          >
            <div className="space-y-2">
              <span className="text-xs font-mono font-medium text-primary">Example {idx + 1}</span>
              <p className="text-sm font-medium text-on-surface">{ex.question}</p>
              <div className="py-3 px-4 text-center bg-surface-container-lowest border border-outline-variant/40 rounded-md3-md">
                <MathRenderer latex={ex.questionLatex} displayMode />
              </div>
            </div>

            <div className="border-t border-outline-variant/30 pt-3 space-y-2">
              <span className="text-xs font-semibold text-on-surface-variant">단계별 풀이 과정:</span>
              <ul className="space-y-1.5 text-xs text-on-surface">
                {ex.solutionSteps.map((step, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 p-3 bg-surface-container-high border border-outline-variant/50 rounded-md3-md text-center">
                <span className="text-xs text-primary mr-2 font-medium">정답:</span>
                <MathRenderer latex={ex.answerLatex} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA to start drill (MD3 Filled Card + Filled Button) */}
      <div className="p-6 bg-surface-container-high border border-outline-variant/50 rounded-md3-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-semibold text-on-surface">개념 이해를 마쳤나요?</h4>
          <p className="text-xs text-on-surface-variant mt-0.5">
            무한 알고리즘 연습 문제로 손에 완전히 익혀보세요.
          </p>
        </div>
        {/* MD3 Filled Button */}
        <button
          onClick={() => onStartDrill(lesson.generatorId)}
          className="w-full sm:w-auto px-6 py-3 bg-primary text-on-primary font-medium text-xs rounded-md3-full hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xs shrink-0"
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
