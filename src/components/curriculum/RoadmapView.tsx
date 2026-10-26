'use client';

import React from 'react';
import { CURRICULUM_TOPICS, TopicConcept } from '@/lib/curriculum-data';
import { UserProgressRecord } from '@/lib/generators/types';
import { BookOpen, Dumbbell, Award, Compass, ArrowRight } from 'lucide-react';

interface RoadmapViewProps {
  progress: UserProgressRecord;
  onSelectLesson: (lesson: TopicConcept) => void;
  onSelectDrill: (generatorId: string) => void;
  onOpenDiagnostic: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  progress,
  onSelectLesson,
  onSelectDrill,
  onOpenDiagnostic,
}) => {
  // Group by Unit
  const units = Array.from(new Set(CURRICULUM_TOPICS.map((t) => t.unit)));

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-16">
      {/* MD3 Diagnostic Prompt Banner (Primary Container) */}
      {!progress.diagnosticScore && (
        <div className="p-6 bg-surface-container-high border border-outline-variant/60 rounded-md3-xl flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-md3-lg bg-primary-container text-on-primary-container shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-on-surface">
                어디서부터 시작해야 할지 고민이신가요?
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                5분 빠른 레벨 테스트로 나의 현재 수학 실력을 진단하고 최적의 시작 단원을 추천받아 보세요.
              </p>
            </div>
          </div>
          {/* MD3 Filled Button */}
          <button
            onClick={onOpenDiagnostic}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-on-primary rounded-md3-full font-medium text-xs hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 shadow-xs"
          >
            <span>진단 평가 시작하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Curriculum Units */}
      <div className="space-y-8">
        {units.map((unitName) => {
          const topics = CURRICULUM_TOPICS.filter((t) => t.unit === unitName);

          return (
            <div key={unitName} className="space-y-3.5">
              {/* Unit Header with MD3 Pill Indicator */}
              <div className="flex items-center gap-2.5 border-b border-outline-variant/30 pb-2.5">
                <span className="w-1.5 h-4 bg-primary rounded-md3-full" />
                <h2 className="text-base font-semibold tracking-tight text-on-surface">{unitName}</h2>
              </div>

              {/* MD3 Topic Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topics.map((topic) => {
                  const stats = progress.topicMastery[topic.generatorId] || {
                    solved: 0,
                    correct: 0,
                    level: 0,
                  };
                  const accuracy = stats.solved > 0 ? Math.round((stats.correct / stats.solved) * 100) : 0;

                  return (
                    <div
                      key={topic.id}
                      className="p-5 sm:p-6 bg-surface-container-low border border-outline-variant/50 hover:border-outline/70 rounded-md3-xl flex flex-col justify-between gap-4 transition-all md3-card-hover group"
                    >
                      <div className="space-y-2">
                        {/* Topic Header: Order & Level Badge */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-on-surface-variant font-medium">
                            단원 {topic.order}
                          </span>
                          {stats.level > 0 ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-md3-full bg-primary-container text-on-primary-container">
                              <Award className="w-3.5 h-3.5" />
                              <span>Lv.{stats.level} 마스터</span>
                            </span>
                          ) : (
                            <span className="text-xs text-on-surface-variant font-medium">미시작</span>
                          )}
                        </div>

                        {/* Title and Subtitle */}
                        <h3 className="text-base font-semibold text-on-surface group-hover:text-primary transition-colors">
                          {topic.title}
                        </h3>
                        <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                          {topic.subtitle}
                        </p>
                      </div>

                      {/* Stats mini bar */}
                      {stats.solved > 0 && (
                        <div className="pt-2.5 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
                          <span>풀이 {stats.solved}문제</span>
                          <span className="font-mono text-emerald-400 font-medium">정답률 {accuracy}%</span>
                        </div>
                      )}

                      {/* MD3 Action Buttons */}
                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        {/* MD3 Outlined Button */}
                        <button
                          onClick={() => onSelectLesson(topic)}
                          className="py-2 px-3 rounded-md3-full border border-outline-variant/80 hover:border-outline text-on-surface text-xs font-medium transition-all flex items-center justify-center gap-1.5 hover:bg-surface-container active:scale-95"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-on-surface-variant" />
                          <span>개념 정독</span>
                        </button>
                        {/* MD3 Filled Tonal Button */}
                        <button
                          onClick={() => onSelectDrill(topic.generatorId)}
                          className="py-2 px-3 rounded-md3-full bg-secondary-container text-on-secondary-container hover:brightness-110 text-xs font-medium transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                        >
                          <Dumbbell className="w-3.5 h-3.5" />
                          <span>연습 드릴</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapView;
