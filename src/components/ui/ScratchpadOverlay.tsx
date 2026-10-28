'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  PenLine,
  Eraser,
  RotateCcw,
  Trash2,
  MousePointer2,
  X,
  Minimize2,
  Maximize2,
} from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  color: string;
  width: number;
  isEraser: boolean;
  points: Point[];
}

interface ScratchpadOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  problemId: string;
}

const PEN_COLORS = [
  { name: '시안', value: '#38BDF8' },
  { name: '옐로우', value: '#FACC15' },
  { name: '화이트', value: '#FFFFFF' },
  { name: '로즈', value: '#FB7185' },
];

const PEN_WIDTHS = [
  { label: '얇게', value: 2.5 },
  { label: '보통', value: 4.5 },
  { label: '굵게', value: 7.5 },
];

export const ScratchpadOverlay: React.FC<ScratchpadOverlayProps> = ({
  isOpen,
  onClose,
  problemId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Drawing state
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState<string>('#38BDF8');
  const [width, setWidth] = useState<number>(3.5);
  const [isPointerMode, setIsPointerMode] = useState<boolean>(false);
  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState<boolean>(false);

  // Track problem ID to auto-clear on new problem
  const [prevProblemId, setPrevProblemId] = useState(problemId);
  if (prevProblemId !== problemId) {
    setPrevProblemId(problemId);
    setStrokes([]);
  }

  // Ref to hold current drawing stroke without re-rendering per point
  const currentStrokeRef = useRef<Stroke | null>(null);

  // Redraw full canvas from strokes history
  const redraw = useCallback((strokesList: Stroke[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    strokesList.forEach((stroke) => {
      if (stroke.points.length < 1) return;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = stroke.width;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
      }

      ctx.beginPath();
      const first = stroke.points[0];
      ctx.moveTo(first.x, first.y);

      for (let i = 1; i < stroke.points.length; i++) {
        const p = stroke.points[i];
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.restore();
    });
  }, []);

  // Sync canvas dimensions with device pixel ratio
  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    }
  }, []);

  // Handle window resize and initial sizing
  useEffect(() => {
    if (!isOpen) return;

    syncCanvasSize();
    redraw(strokes);

    const handleResize = () => {
      syncCanvasSize();
      redraw(strokes);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, syncCanvasSize, redraw, strokes]);

  // Redraw when strokes change
  useEffect(() => {
    if (isOpen) {
      redraw(strokes);
    }
  }, [strokes, isOpen, redraw]);

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPointerMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newStroke: Stroke = {
      color,
      width: currentTool === 'eraser' ? 24 : width,
      isEraser: currentTool === 'eraser',
      points: [{ x, y }],
    };

    currentStrokeRef.current = newStroke;

    // Draw initial dot immediately
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (newStroke.isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = newStroke.width;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = newStroke.color;
        ctx.lineWidth = newStroke.width;
      }
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 0.1, y + 0.1);
      ctx.stroke();
      ctx.restore();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPointerMode) return;
    const current = currentStrokeRef.current;
    const canvas = canvasRef.current;
    if (!current || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lastPoint = current.points[current.points.length - 1];
    current.points.push({ x, y });

    // Draw segment incrementally
    const ctx = canvas.getContext('2d');
    if (ctx && lastPoint) {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (current.isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = current.width;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = current.color;
        ctx.lineWidth = current.width;
      }
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.restore();
    }
  };

  const handlePointerUp = () => {
    if (currentStrokeRef.current) {
      const finishedStroke = currentStrokeRef.current;
      currentStrokeRef.current = null;
      setStrokes((prev) => [...prev, finishedStroke]);
    }
  };

  const handlePointerCancel = () => {
    currentStrokeRef.current = null;
    redraw(strokes);
  };

  const handleUndo = () => {
    setStrokes((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setStrokes([]);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 select-none transition-all duration-200 ${
        isPointerMode
          ? 'pointer-events-none bg-black/40 backdrop-blur-[1px]'
          : 'pointer-events-auto bg-black/65 backdrop-blur-[2.5px]'
      }`}
      aria-label="수식 계산용 반투명 연습장"
    >
      {/* Drawing Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className={`w-full h-full block ${
          isPointerMode ? 'cursor-default' : currentTool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair'
        }`}
        style={{
          touchAction: 'none',
          backgroundColor: 'transparent',
        }}
      />

      {/* Floating Toolbar (MD3 Elevated Container) */}
      <div className="fixed top-4 right-4 pointer-events-auto flex flex-col items-end gap-2 max-w-[95vw]">
        {/* Main Control Pill */}
        <div className="bg-surface-container-high/95 backdrop-blur-md border border-outline-variant/60 rounded-md3-xl p-2 shadow-xl flex items-center gap-1.5 text-on-surface">
          {/* Collapse/Expand Toggle */}
          <button
            onClick={() => setIsToolbarCollapsed(!isToolbarCollapsed)}
            className="p-2 rounded-md3-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
            title={isToolbarCollapsed ? '도구함 펼치기' : '도구함 접기'}
          >
            {isToolbarCollapsed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>

          {!isToolbarCollapsed && (
            <>
              <div className="h-4 w-px bg-outline-variant/40 mx-0.5" />

              {/* Mode Toggle: Draw vs Pointer (Allows clicking through to answer choices) */}
              <button
                onClick={() => setIsPointerMode(!isPointerMode)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md3-lg text-xs font-medium transition-all ${
                  isPointerMode
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                }`}
                title={isPointerMode ? '필기 모드로 전환' : '화면 클릭/정답 선택 모드로 전환'}
              >
                <MousePointer2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isPointerMode ? '선택 모드' : '필기 모드'}</span>
              </button>

              <div className="h-4 w-px bg-outline-variant/40 mx-0.5" />

              {/* Tool: Pen */}
              <button
                onClick={() => {
                  setCurrentTool('pen');
                  setIsPointerMode(false);
                }}
                className={`p-2 rounded-md3-lg transition-all ${
                  currentTool === 'pen' && !isPointerMode
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                }`}
                title="펜 도구"
              >
                <PenLine className="w-4 h-4" />
              </button>

              {/* Tool: Eraser */}
              <button
                onClick={() => {
                  setCurrentTool('eraser');
                  setIsPointerMode(false);
                }}
                className={`p-2 rounded-md3-lg transition-all ${
                  currentTool === 'eraser' && !isPointerMode
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                }`}
                title="지우개 도구"
              >
                <Eraser className="w-4 h-4" />
              </button>

              {/* Pen Colors (visible when pen is active) */}
              {currentTool === 'pen' && (
                <div className="flex items-center gap-1 px-1 bg-surface-container-low rounded-md3-md py-0.5">
                  {PEN_COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => {
                        setColor(c.value);
                        setIsPointerMode(false);
                      }}
                      className={`w-5 h-5 rounded-full transition-all flex items-center justify-center ${
                        color === c.value ? 'ring-2 ring-primary scale-110' : 'hover:scale-105 opacity-80'
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={`${c.name} 색상`}
                    />
                  ))}
                </div>
              )}

              {/* Pen Width selector */}
              {currentTool === 'pen' && (
                <div className="hidden sm:flex items-center gap-0.5 bg-surface-container-low rounded-md3-md p-0.5">
                  {PEN_WIDTHS.map((w) => (
                    <button
                      key={w.value}
                      onClick={() => setWidth(w.value)}
                      className={`px-1.5 py-0.5 text-[10px] rounded font-medium transition-all ${
                        width === w.value
                          ? 'bg-surface-container-highest text-on-surface font-bold'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="h-4 w-px bg-outline-variant/40 mx-0.5" />

              {/* Undo Button */}
              <button
                onClick={handleUndo}
                disabled={strokes.length === 0}
                className="p-2 rounded-md3-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="한 획 되돌리기 (Undo)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Clear Button */}
              <button
                onClick={handleClear}
                disabled={strokes.length === 0}
                className="p-2 rounded-md3-lg text-on-surface-variant hover:text-rose-400 hover:bg-surface-container-highest disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="연습장 전체 지우기"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          <div className="h-4 w-px bg-outline-variant/40 mx-0.5" />

          {/* Close/Hide Overlay */}
          <button
            onClick={onClose}
            className="p-2 rounded-md3-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
            title="연습장 닫기 (필기 내용 유지됨)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pointer Mode Notification Banner */}
        {isPointerMode && (
          <div className="bg-amber-950/80 backdrop-blur-md border border-amber-500/50 text-amber-200 text-xs px-3 py-1.5 rounded-md3-full shadow-lg flex items-center gap-2 animate-in fade-in">
            <span>👆 정답 선택 및 스크롤 가능 모드</span>
            <button
              onClick={() => setIsPointerMode(false)}
              className="text-[11px] underline font-semibold hover:text-white"
            >
              필기 계속하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScratchpadOverlay;
