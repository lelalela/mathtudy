'use client';

import React, { Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserProgress } from '@/lib/storage';
import { TopicConcept, CURRICULUM_TOPICS } from '@/lib/curriculum-data';
import { GENERATORS } from '@/lib/generators';

// Components
import RoadmapView from '@/components/curriculum/RoadmapView';
import LessonReader from '@/components/curriculum/LessonReader';
import DrillView from '@/components/drill/DrillView';
import DiagnosticModal from '@/components/diagnostic/DiagnosticModal';
import BackupModal from '@/components/stats/BackupModal';
import PwaInstallButton from '@/components/pwa/PwaInstallButton';

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

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const progress = useUserProgress();

  // Extract navigation state from URL query parameters (Supports browser Back / Forward)
  const tabParam = searchParams.get('tab') || 'roadmap';
  const idParam = searchParams.get('id');
  const modalParam = searchParams.get('modal');

  const view: 'roadmap' | 'lesson' | 'drill' | 'stats' = 
    ['roadmap', 'lesson', 'drill', 'stats'].includes(tabParam)
      ? (tabParam as 'roadmap' | 'lesson' | 'drill' | 'stats')
      : 'roadmap';

  // Active Lesson resolved from URL id or fallback
  const currentLesson: TopicConcept | null = useMemo(() => {
    if (view === 'lesson') {
      return CURRICULUM_TOPICS.find((t) => t.id === idParam) || CURRICULUM_TOPICS[0];
    }
    return null;
  }, [view, idParam]);

  // Active Generator for Drill
  const currentGeneratorId: string = useMemo(() => {
    if (idParam && GENERATORS.some((g) => g.id === idParam)) {
      return idParam;
    }
    return 'fractions';
  }, [idParam]);

  // Modal states synchronized with URL
  const isDiagnosticOpen = modalParam === 'diagnostic';
  const isBackupOpen = modalParam === 'backup';

  // Navigation helpers that push browser history
  const navigateTo = (tab: 'roadmap' | 'lesson' | 'drill' | 'stats', id?: string) => {
    const params = new URLSearchParams();
    if (tab !== 'roadmap') {
      params.set('tab', tab);
    }
    if (id) {
      params.set('id', id);
    }
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : '/');
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      navigateTo('roadmap');
    }
  };

  const handleSelectLesson = (lesson: TopicConcept) => {
    navigateTo('lesson', lesson.id);
  };

  const handleStartDrill = (generatorId: string) => {
    navigateTo('drill', generatorId);
  };

  const openModal = (modalName: 'diagnostic' | 'backup') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('modal', modalName);
    router.push(`/?${params.toString()}`);
  };

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('modal');
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : '/');
  };

  const handleDiagnosticComplete = (recommendedTopicId: string) => {
    closeModal();
    const foundTopic = CURRICULUM_TOPICS.find(
      (t) => t.generatorId === recommendedTopicId || t.id === recommendedTopicId
    );
    if (foundTopic) {
      handleSelectLesson(foundTopic);
    } else {
      navigateTo('roadmap');
    }
  };

  const accuracy =
    progress.totalSolved > 0
      ? Math.round((progress.totalCorrect / progress.totalSolved) * 100)
      : 0;

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      {/* MD3 Top App Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-outline-variant/30 bg-surface-container/90 backdrop-blur-md transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => navigateTo('roadmap')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-md3-lg bg-primary-container text-on-primary-container flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-xs">
              <Sigma className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-base tracking-tight text-on-surface group-hover:text-primary transition-colors">
                  Mathtudy
                </span>
                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-md3-xs bg-secondary-container text-on-secondary-container font-mono">
                  M3
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant block leading-tight font-medium">
                성인을 위한 수학 독학 스튜디오
              </span>
            </div>
          </div>

          {/* Quick Metrics & Actions (MD3 Chips & Tonal Buttons) */}
          <div className="flex items-center gap-2.5">
            {/* Streak Chip */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md3-full bg-surface-container-high border border-outline-variant/50 text-xs font-medium text-amber-300 font-mono">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{progress.streak}일 연속</span>
            </div>

            {/* Solved Stat Chip */}
            <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-md3-full bg-surface-container-high border border-outline-variant/50 text-xs text-on-surface font-mono font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {progress.totalSolved}문제 ({accuracy}%)
              </span>
            </div>

            {/* Diagnostic Button (MD3 Filled Tonal Button) */}
            <button
              onClick={() => openModal('diagnostic')}
              className="h-9 px-3.5 rounded-md3-full bg-secondary-container text-on-secondary-container hover:brightness-110 active:scale-95 transition-all text-xs font-medium flex items-center gap-1.5 shadow-xs"
              title="진단 평가 다시보기"
            >
              <Compass className="w-4 h-4 text-primary" />
              <span className="hidden md:inline">진단 평가</span>
            </button>

            {/* PWA Install Button */}
            <PwaInstallButton />

            {/* Backup Button (MD3 Standard Icon Button) */}
            <button
              onClick={() => openModal('backup')}
              className="h-9 w-9 rounded-md3-full flex items-center justify-center bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/50 text-on-surface-variant hover:text-on-surface active:scale-95 transition-all"
              title="로컬 데이터 백업 / 복원"
              aria-label="데이터 백업"
            >
              <HardDriveDownload className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MD3 Navigation Bar / Tabs with Active Indicator Pill */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto py-1 border-t border-outline-variant/20">
          <button
            onClick={() => navigateTo('roadmap')}
            className={`px-4 py-1.5 rounded-md3-full text-xs font-medium transition-all flex items-center gap-2 shrink-0 md3-button-motion ${
              view === 'roadmap'
                ? 'bg-secondary-container text-on-secondary-container shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>커리큘럼 로드맵</span>
          </button>

          <button
            onClick={() => navigateTo('drill', currentGeneratorId)}
            className={`px-4 py-1.5 rounded-md3-full text-xs font-medium transition-all flex items-center gap-2 shrink-0 md3-button-motion ${
              view === 'drill'
                ? 'bg-secondary-container text-on-secondary-container shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>연습 드릴</span>
          </button>

          <button
            onClick={() => navigateTo('stats')}
            className={`px-4 py-1.5 rounded-md3-full text-xs font-medium transition-all flex items-center gap-2 shrink-0 md3-button-motion ${
              view === 'stats'
                ? 'bg-secondary-container text-on-secondary-container shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
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
            onOpenDiagnostic={() => openModal('diagnostic')}
          />
        )}

        {view === 'lesson' && currentLesson && (
          <LessonReader
            lesson={currentLesson}
            onBack={handleBack}
            onStartDrill={handleStartDrill}
          />
        )}

        {view === 'drill' && (
          <div className="space-y-6">
            {/* MD3 Filter Chips for Generator Selection */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {GENERATORS.map((gen) => {
                const isActive = currentGeneratorId === gen.id;
                return (
                  <button
                    key={gen.id}
                    onClick={() => navigateTo('drill', gen.id)}
                    className={`h-8 px-4 rounded-md3-full text-xs font-medium shrink-0 transition-all md3-button-motion ${
                      isActive
                        ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                        : 'bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {gen.name}
                  </button>
                );
              })}
            </div>

            <DrillView
              key={currentGeneratorId}
              generatorId={currentGeneratorId}
              onBack={handleBack}
              onRefreshProgress={() => {}}
            />
          </div>
        )}

        {view === 'stats' && (
          <div className="w-full max-w-3xl mx-auto space-y-6 pb-16">
            {/* Header Title */}
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">내 학습 분석</h2>
              <p className="text-xs text-on-surface-variant">
                로컬에 안전하게 기록된 나의 수학 공부 데이터입니다.
              </p>
            </div>

            {/* Overview Metric Cards (MD3 Elevated Tonal Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-5 bg-surface-container-low border border-outline-variant/40 rounded-md3-lg space-y-1 md3-card-hover">
                <span className="text-xs text-on-surface-variant font-medium">총 푼 문제</span>
                <p className="text-2xl font-mono font-bold text-on-surface">
                  {progress.totalSolved}
                </p>
              </div>
              <div className="p-5 bg-surface-container-low border border-outline-variant/40 rounded-md3-lg space-y-1 md3-card-hover">
                <span className="text-xs text-on-surface-variant font-medium">정답률</span>
                <p className="text-2xl font-mono font-bold text-emerald-400">{accuracy}%</p>
              </div>
              <div className="p-5 bg-surface-container-low border border-outline-variant/40 rounded-md3-lg space-y-1 md3-card-hover">
                <span className="text-xs text-on-surface-variant font-medium">연속 학습일</span>
                <p className="text-2xl font-mono font-bold text-amber-400">{progress.streak}일</p>
              </div>
              <div className="p-5 bg-surface-container-low border border-outline-variant/40 rounded-md3-lg space-y-1 md3-card-hover">
                <span className="text-xs text-on-surface-variant font-medium">진단 평가 점수</span>
                <p className="text-2xl font-mono font-bold text-primary">
                  {progress.diagnosticScore ? `${progress.diagnosticScore.score}점` : '미응시'}
                </p>
              </div>
            </div>

            {/* Unit by Unit Mastery Table (MD3 Card Container) */}
            <div className="p-6 bg-surface-container-low border border-outline-variant/50 rounded-md3-xl space-y-4">
              <h3 className="text-base font-semibold text-on-surface">단원별 마스터리 현황</h3>
              <div className="divide-y divide-outline-variant/30">
                {GENERATORS.map((gen) => {
                  const s = progress.topicMastery[gen.id] || { solved: 0, correct: 0, level: 0 };
                  const acc = s.solved > 0 ? Math.round((s.correct / s.solved) * 100) : 0;

                  return (
                    <div key={gen.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-on-surface">{gen.name}</span>
                          <span className="text-[11px] font-mono text-on-surface-variant">({gen.unit})</span>
                        </div>
                        <span className="text-xs text-on-surface-variant">
                          풀이: {s.solved}문제 · 정답률: {acc}%
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded-md3-full bg-surface-container-highest text-on-surface font-medium">
                          Lv.{s.level}
                        </span>
                        {/* MD3 Filled Tonal Button */}
                        <button
                          onClick={() => handleStartDrill(gen.id)}
                          className="px-4 py-1.5 rounded-md3-full bg-secondary-container hover:brightness-110 text-xs font-medium text-on-secondary-container transition-all active:scale-95"
                        >
                          드릴 풀기
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Backup CTA (MD3 Filled Card) */}
            <div className="p-6 bg-surface-container border border-outline-variant/40 rounded-md3-xl flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-on-surface">데이터 백업 및 이전</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">기록을 JSON 파일로 내보내거나 안전하게 복원할 수 있습니다.</p>
              </div>
              <button
                onClick={() => openModal('backup')}
                className="px-5 py-2 rounded-md3-full bg-secondary-container hover:brightness-110 text-xs font-medium text-on-secondary-container transition-all active:scale-95"
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
        onClose={closeModal}
        onComplete={handleDiagnosticComplete}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={closeModal}
        onRefresh={() => {}}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <HomePageContent />
    </Suspense>
  );
}
