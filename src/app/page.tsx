'use client';

import React, { useState } from 'react';
import { useUserProgress } from '@/lib/storage';
import { TopicConcept, CURRICULUM_TOPICS } from '@/lib/curriculum-data';
import { GENERATORS } from '@/lib/generators';

// Components
import RoadmapView from '@/components/curriculum/RoadmapView';
import LessonReader from '@/components/curriculum/LessonReader';
import DrillView from '@/components/drill/DrillView';
import DiagnosticModal from '@/components/diagnostic/DiagnosticModal';
import BackupModal from '@/components/stats/BackupModal';

// Icons
import {
  Compass,
  Flame,
  CheckCircle2,
  BookOpen,
  Dumbbell,
  BarChart3,
  HardDriveDownload,
  Sigma,
} from 'lucide-react';

export default function HomePage() {
  const progress = useUserProgress();
  const [view, setView] = useState<'roadmap' | 'lesson' | 'drill' | 'stats'>('roadmap');
  const [currentLesson, setCurrentLesson] = useState<TopicConcept | null>(null);
  const [currentGeneratorId, setCurrentGeneratorId] = useState<string>('fractions');

  // Modals
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  const handleSelectLesson = (lesson: TopicConcept) => {
    setCurrentLesson(lesson);
    setView('lesson');
  };

  const handleStartDrill = (generatorId: string) => {
    setCurrentGeneratorId(generatorId);
    setView('drill');
  };

  const handleDiagnosticComplete = (recommendedTopicId: string) => {
    const foundTopic = CURRICULUM_TOPICS.find(
      (t) => t.generatorId === recommendedTopicId || t.id === recommendedTopicId
    );
    if (foundTopic) {
      handleSelectLesson(foundTopic);
    } else {
      setView('roadmap');
    }
  };

  const accuracy =
    progress.totalSolved > 0
      ? Math.round((progress.totalCorrect / progress.totalSolved) * 100)
      : 0;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={() => setView('roadmap')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-all">
              <Sigma className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                Mathtudy
              </span>
              <span className="text-[10px] text-neutral-500 block leading-none font-mono">
                Adult Math Studio
              </span>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-3">
            {/* Streak */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-amber-300 font-mono">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{progress.streak}일 연속</span>
            </div>

            {/* Solved Stat */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {progress.totalSolved}문제 ({accuracy}%)
              </span>
            </div>

            {/* Diagnostic Button */}
            <button
              onClick={() => setIsDiagnosticOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 transition-all"
              title="진단 평가 다시보기"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">진단 평가</span>
            </button>

            {/* Backup Button */}
            <button
              onClick={() => setIsBackupOpen(true)}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 transition-all"
              title="로컬 데이터 백업 / 복원"
              aria-label="데이터 백업"
            >
              <HardDriveDownload className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-1 overflow-x-auto border-t border-neutral-900">
          <button
            onClick={() => setView('roadmap')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              view === 'roadmap'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>커리큘럼 로드맵</span>
          </button>

          <button
            onClick={() => setView('drill')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              view === 'drill'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>연습 드릴</span>
          </button>

          <button
            onClick={() => setView('stats')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              view === 'stats'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>내 학습 통계</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6">
        {view === 'roadmap' && (
          <RoadmapView
            progress={progress}
            onSelectLesson={handleSelectLesson}
            onSelectDrill={handleStartDrill}
            onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
          />
        )}

        {view === 'lesson' && currentLesson && (
          <LessonReader
            lesson={currentLesson}
            onBack={() => setView('roadmap')}
            onStartDrill={handleStartDrill}
          />
        )}

        {view === 'drill' && (
          <div className="space-y-6">
            {/* Generator Switcher Pill Menu */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {GENERATORS.map((gen) => (
                <button
                  key={gen.id}
                  onClick={() => setCurrentGeneratorId(gen.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
                    currentGeneratorId === gen.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800'
                  }`}
                >
                  {gen.name}
                </button>
              ))}
            </div>

            <DrillView
              key={currentGeneratorId}
              generatorId={currentGeneratorId}
              onBack={() => setView('roadmap')}
              onRefreshProgress={() => {}}
            />
          </div>
        )}

        {view === 'stats' && (
          <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in pb-16">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-100">내 학습 분석</h2>
              <p className="text-xs text-neutral-400">
                로컬에 안전하게 기록된 나의 수학 공부 데이터입니다.
              </p>
            </div>

            {/* Overview Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-1">
                <span className="text-xs text-neutral-500">총 푼 문제</span>
                <p className="text-2xl font-mono font-bold text-neutral-100">
                  {progress.totalSolved}
                </p>
              </div>
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-1">
                <span className="text-xs text-neutral-500">정답률</span>
                <p className="text-2xl font-mono font-bold text-emerald-400">{accuracy}%</p>
              </div>
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-1">
                <span className="text-xs text-neutral-500">연속 학습일</span>
                <p className="text-2xl font-mono font-bold text-amber-400">{progress.streak}일</p>
              </div>
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-1">
                <span className="text-xs text-neutral-500">진단 평가 점수</span>
                <p className="text-2xl font-mono font-bold text-indigo-400">
                  {progress.diagnosticScore ? `${progress.diagnosticScore.score}점` : '미응시'}
                </p>
              </div>
            </div>

            {/* Unit by Unit Mastery Table */}
            <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
              <h3 className="text-base font-semibold text-neutral-200">단원별 마스터리 현황</h3>
              <div className="divide-y divide-neutral-800/80">
                {GENERATORS.map((gen) => {
                  const s = progress.topicMastery[gen.id] || { solved: 0, correct: 0, level: 0 };
                  const acc = s.solved > 0 ? Math.round((s.correct / s.solved) * 100) : 0;

                  return (
                    <div key={gen.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-neutral-200">{gen.name}</span>
                          <span className="text-[11px] font-mono text-neutral-500">({gen.unit})</span>
                        </div>
                        <span className="text-xs text-neutral-400">
                          풀이: {s.solved}문제 · 정답률: {acc}%
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                          Lv.{s.level}
                        </span>
                        <button
                          onClick={() => handleStartDrill(gen.id)}
                          className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
                        >
                          드릴 풀기
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Backup CTA */}
            <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-neutral-200">데이터 백업 및 이전</h4>
                <p className="text-xs text-neutral-400">기록을 JSON 파일로 내보내거나 복원할 수 있습니다.</p>
              </div>
              <button
                onClick={() => setIsBackupOpen(true)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
              >
                관리하기
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <DiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        onComplete={handleDiagnosticComplete}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        onRefresh={() => {}}
      />
    </div>
  );
}
