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
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Diagnostic Prompt Banner */}
      {!progress.diagnosticScore && (
        <div className="p-5 bg-gradient-to-r from-indigo-950/70 via-purple-950/40 to-neutral-900 border border-indigo-800/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">
                어디서부터 시작해야 할지 고민이신가요?
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                5분 빠른 레벨 테스트로 나의 현재 수학 실력을 진단하고 최적의 시작 단원을 추천받아 보세요.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenDiagnostic}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-md active:scale-95"
          >
            <span>진단 평가 시작하기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Curriculum Units */}
      <div className="space-y-8">
        {units.map((unitName) => {
          const topics = CURRICULUM_TOPICS.filter((t) => t.unit === unitName);

          return (
            <div key={unitName} className="space-y-3">
              <div className="flex items-center gap-2 border-b border-neutral-800/80 pb-2">
                <span className="w-1.5 h-4 bg-indigo-500 rounded-full" />
                <h2 className="text-base font-bold tracking-tight text-neutral-200">{unitName}</h2>
              </div>

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
                      className="p-5 bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700/80 rounded-2xl flex flex-col justify-between gap-4 transition-all hover:shadow-lg group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-neutral-500">
                            단원 {topic.order}
                          </span>
                          {stats.level > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                              <Award className="w-3 h-3 text-indigo-400" />
                              <span>Lv.{stats.level} 마스터</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-neutral-500">미시작</span>
                          )}
                        </div>

                        <h3 className="text-base font-semibold text-neutral-100 group-hover:text-indigo-300 transition-colors">
                          {topic.title}
                        </h3>
                        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                          {topic.subtitle}
                        </p>
                      </div>

                      {/* Stats mini bar */}
                      {stats.solved > 0 && (
                        <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-400">
                          <span>풀이 {stats.solved}문제</span>
                          <span className="font-mono text-emerald-400 font-medium">정답률 {accuracy}%</span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => onSelectLesson(topic)}
                          className="py-2 px-3 rounded-xl bg-neutral-800/70 hover:bg-neutral-800 text-neutral-200 text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                          <span>개념 정독</span>
                        </button>
                        <button
                          onClick={() => onSelectDrill(topic.generatorId)}
                          className="py-2 px-3 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
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
