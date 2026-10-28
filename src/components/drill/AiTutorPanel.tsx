'use client';

import React, { useState, useEffect } from 'react';
import { Problem } from '@/lib/generators/types';
import { askGeminiTutor, AiTutorMode, AiTutorResponse } from '@/lib/gemini';
import MathRenderer from '../ui/MathRenderer';
import {
  Sparkles,
  Compass,
  BookOpen,
  RefreshCw,
  Settings,
  X,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

interface AiTutorPanelProps {
  problem: Problem;
  apiKey: string;
  onOpenKeySettings: () => void;
  onClose: () => void;
}

// Formats mixed text containing KaTeX equations ($...$ and $$...$$) and markdown bullets
const FormattedAiText: React.FC<{ content: string }> = ({ content }) => {
  // Split content by display math blocks ($$...$$)
  const displayBlocks = content.split(/(\$\$[\s\S]*?\$\$)/g);

  return (
    <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-on-surface/90">
      {displayBlocks.map((block, idx) => {
        if (block.startsWith('$$') && block.endsWith('$$')) {
          const math = block.slice(2, -2).trim();
          return (
            <div
              key={idx}
              className="my-2.5 p-3 rounded-md3-md bg-surface-container-lowest border border-outline-variant/40 text-center overflow-x-auto shadow-inner"
            >
              <MathRenderer latex={math} displayMode />
            </div>
          );
        }

        // Regular text block: split into lines/paragraphs
        const lines = block.split('\n');
        return (
          <div key={idx} className="space-y-2">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return null;

              // Check for headers (e.g., ### or 1단계 등)
              const isHeader = trimmed.startsWith('#') || trimmed.startsWith('**1단계') || trimmed.startsWith('**2단계') || trimmed.startsWith('**3단계');
              const cleanLine = trimmed.replace(/^#+\s*/, '');

              // Parse inline math ($...$)
              const inlineParts = cleanLine.split(/(\$[^\$]+?\$)/g);

              return (
                <div
                  key={lIdx}
                  className={`${
                    isHeader
                      ? 'font-bold text-primary text-sm pt-2 border-t border-outline-variant/20 first:border-t-0 first:pt-0'
                      : trimmed.startsWith('- ') || trimmed.startsWith('• ')
                      ? 'pl-3.5 relative before:content-["•"] before:absolute before:left-0 before:text-primary font-normal'
                      : 'font-normal'
                  }`}
                >
                  {inlineParts.map((part, pIdx) => {
                    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
                      const inlineMath = part.slice(1, -1);
                      return (
                        <MathRenderer
                          key={pIdx}
                          latex={inlineMath}
                          className="mx-1 text-on-surface font-semibold"
                        />
                      );
                    }
                    // Strip bold markdown markers if any
                    const boldClean = part.replace(/\*\*(.*?)\*\*/g, '$1');
                    return <span key={pIdx}>{boldClean}</span>;
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export const AiTutorPanel: React.FC<AiTutorPanelProps> = ({
  problem,
  apiKey,
  onOpenKeySettings,
  onClose,
}) => {
  const [mode, setMode] = useState<AiTutorMode>('guide');
  const [cache, setCache] = useState<Record<string, AiTutorResponse>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const cacheKey = `${problem.id}_${mode}`;
  const currentResult = cache[cacheKey];

  // Fetch when mode or problem changes and not yet in cache
  useEffect(() => {
    let isCancelled = false;

    if (!cache[cacheKey]) {
      askGeminiTutor({
        apiKey,
        unit: problem.unit,
        title: problem.title,
        questionText: problem.questionText,
        questionLatex: problem.questionLatex,
        choices: problem.choices,
        correctAnswer: problem.correctAnswer,
        mode,
      })
        .then((response) => {
          if (!isCancelled) {
            setCache((prev) => ({ ...prev, [cacheKey]: response }));
            setIsLoading(false);
          }
        })
        .catch((err) => {
          if (!isCancelled) {
            const msg = err instanceof Error ? err.message : 'AI 풀이를 불러오는 중 오류가 발생했습니다.';
            setErrorMessage(msg);
            setIsLoading(false);
          }
        });
    }

    return () => {
      isCancelled = true;
    };
  }, [cacheKey, problem, apiKey, mode, cache]);

  const handleSelectMode = (newMode: AiTutorMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setErrorMessage('');
    const newKey = `${problem.id}_${newMode}`;
    if (!cache[newKey]) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    setIsLoading(true);
    setErrorMessage('');
    askGeminiTutor({
      apiKey,
      unit: problem.unit,
      title: problem.title,
      questionText: problem.questionText,
      questionLatex: problem.questionLatex,
      choices: problem.choices,
      correctAnswer: problem.correctAnswer,
      mode,
    })
      .then((response) => {
        setCache((prev) => ({ ...prev, [cacheKey]: response }));
        setIsLoading(false);
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : 'AI 풀이를 불러오는 중 오류가 발생했습니다.';
        setErrorMessage(msg);
        setIsLoading(false);
      });
  };

  return (
    <div className="p-5 sm:p-6 bg-surface-container-high/90 border border-primary/40 rounded-md3-xl shadow-lg space-y-4 animate-in fade-in transition-all">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md3-full bg-primary/20 text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-on-surface flex items-center gap-1.5">
              <span>Gemini AI 과외 선생님</span>
              {currentResult && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-container border border-outline-variant/40 text-on-surface-variant font-medium">
                  {currentResult.modelUsed}
                </span>
              )}
            </h3>
            <p className="text-[11px] text-on-surface-variant">
              이해하기 쉽게 친절한 비유와 생략 없는 전개로 설명해 드려요.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenKeySettings}
            className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-md3-lg hover:bg-surface-container-highest transition-colors"
            title="Gemini API 키 변경"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-md3-lg hover:bg-surface-container-highest transition-colors"
            title="AI 튜터 닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode Selector Segmented Buttons */}
      <div className="flex items-center gap-2 bg-surface-container-lowest p-1 rounded-md3-full border border-outline-variant/50 w-full sm:w-fit">
        <button
          onClick={() => handleSelectMode('guide')}
          className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-md3-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            mode === 'guide'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>풀이 길잡이 (스포일러 방지)</span>
        </button>

        <button
          onClick={() => handleSelectMode('full')}
          className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-md3-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            mode === 'full'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>정답 & 완벽 풀이</span>
        </button>
      </div>

      {/* Mode Brief Info */}
      <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant/80 px-1">
        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>
          {mode === 'guide'
            ? '정답을 직접 알려주지 않고, 첫 단추를 어떻게 꿰어야 하는지 스스로 풀 수 있도록 힌트를 줍니다.'
            : '정답과 함께 처음부터 끝까지 생략 없는 전개 과정과 쉬운 비유를 모두 제공합니다.'}
        </span>
      </div>

      {/* Content Area */}
      <div className="min-h-[140px] p-4 sm:p-5 bg-surface-container-low rounded-md3-lg border border-outline-variant/40">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10 space-y-3 text-on-surface-variant">
            <Sparkles className="w-6 h-6 text-primary animate-spin" />
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-on-surface">
                AI 튜터가 맞춤 해설을 작성하고 있습니다...
              </p>
              <p className="text-[11px] text-on-surface-variant/70 font-mono">
                호출 모델: gemini-3.5-flash-lite (장애 시 gemini-3.8-flash)
              </p>
            </div>
          </div>
        )}

        {errorMessage && !isLoading && (
          <div className="p-4 bg-error-container/40 border border-error/40 rounded-md3-md space-y-3 text-error">
            <div className="flex items-center gap-2 text-xs font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>해설을 불러오지 못했습니다.</span>
            </div>
            <p className="text-xs text-on-error-container leading-relaxed break-all font-mono">
              {errorMessage}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleRegenerate}
                className="px-3 py-1.5 bg-error text-on-error text-xs font-semibold rounded-md3-full flex items-center gap-1.5 hover:brightness-110 transition-all shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>다시 시도</span>
              </button>
              <button
                onClick={onOpenKeySettings}
                className="px-3 py-1.5 bg-surface-container-highest text-on-surface text-xs font-semibold rounded-md3-full flex items-center gap-1.5 hover:bg-surface-container-high transition-all"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>API 키 확인</span>
              </button>
            </div>
          </div>
        )}

        {!isLoading && !errorMessage && currentResult && (
          <div className="space-y-4">
            <FormattedAiText content={currentResult.text} />

            {/* Refresh / Regenerate button */}
            <div className="pt-3 border-t border-outline-variant/30 flex justify-end">
              <button
                onClick={handleRegenerate}
                className="text-[11px] text-on-surface-variant hover:text-on-surface flex items-center gap-1 px-2.5 py-1 rounded-md3-md hover:bg-surface-container transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>해설 다시 생성</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiTutorPanel;
