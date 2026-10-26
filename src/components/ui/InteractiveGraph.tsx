'use client';

import React, { useState, useEffect, useRef } from 'react';
import MathRenderer from './MathRenderer';
import { RotateCcw } from 'lucide-react';

interface InteractiveGraphProps {
  type?: 'linear' | 'quadratic';
  initialA?: number;
  initialB?: number;
  initialC?: number;
}

export const InteractiveGraph: React.FC<InteractiveGraphProps> = ({
  type = 'linear',
  initialA = 1,
  initialB = 0,
  initialC = -4,
}) => {
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);
  const [c, setC] = useState(initialC);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const resetValues = () => {
    setA(initialA);
    setB(initialB);
    setC(initialC);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 25; // pixels per math unit (-8 to +8)

    // Clear background
    ctx.fillStyle = '#0a0b10';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = '#1e2230';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = centerX % scale; x < width; x += scale) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = centerY % scale; y < height; y += scale) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Draw Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // X Axis
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    // Y Axis
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Ticks & Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    for (let i = -8; i <= 8; i++) {
      if (i === 0) continue;
      // X ticks
      const px = centerX + i * scale;
      ctx.fillText(`${i}`, px - 4, centerY + 14);
      // Y ticks
      const py = centerY - i * scale;
      ctx.fillText(`${i}`, centerX + 6, py + 4);
    }

    // Draw Function Curve
    ctx.strokeStyle = '#38bdf8'; // Sky blue curve
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    let started = false;
    for (let px = 0; px <= width; px += 2) {
      const mathX = (px - centerX) / scale;
      let mathY = 0;
      if (type === 'linear') {
        mathY = a * mathX + b;
      } else {
        mathY = a * mathX * mathX + b * mathX + c;
      }

      const py = centerY - mathY * scale;
      if (py >= -100 && py <= height + 100) {
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      } else {
        started = false;
      }
    }
    ctx.stroke();

    // Highlight Intercepts / Key Points
    if (type === 'linear') {
      // Y-intercept (0, b)
      const yIntPy = centerY - b * scale;
      if (yIntPy >= 0 && yIntPy <= height) {
        ctx.fillStyle = '#f43f5e'; // Rose dot
        ctx.beginPath();
        ctx.arc(centerX, yIntPy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fda4af';
        ctx.font = '11px sans-serif';
        ctx.fillText(`(0, ${b})`, centerX + 8, yIntPy - 6);
      }

      // X-intercept if a !== 0: (-b/a, 0)
      if (a !== 0) {
        const rootX = -b / a;
        const rootPx = centerX + rootX * scale;
        if (rootPx >= 0 && rootPx <= width) {
          ctx.fillStyle = '#10b981'; // Emerald dot
          ctx.beginPath();
          ctx.arc(rootPx, centerY, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#6ee7b7';
          ctx.font = '11px sans-serif';
          ctx.fillText(`(${rootX.toFixed(1)}, 0)`, rootPx - 15, centerY - 8);
        }
      }
    } else {
      // Quadratic vertex (-b / (2a), f(-b / 2a))
      if (a !== 0) {
        const vx = -b / (2 * a);
        const vy = a * vx * vx + b * vx + c;
        const vPx = centerX + vx * scale;
        const vPy = centerY - vy * scale;
        if (vPx >= 0 && vPx <= width && vPy >= 0 && vPy <= height) {
          ctx.fillStyle = '#f59e0b'; // Amber vertex dot
          ctx.beginPath();
          ctx.arc(vPx, vPy, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fcd34d';
          ctx.font = '11px sans-serif';
          ctx.fillText(`꼭짓점 (${vx.toFixed(1)}, ${vy.toFixed(1)})`, vPx + 8, vPy - 4);
        }
      }
    }
  }, [a, b, c, type]);

  // Latex formula string
  const currentFormulaLatex =
    type === 'linear'
      ? `y = ${a === 1 ? '' : a === -1 ? '-' : a}x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}`
      : `y = ${a === 1 ? '' : a === -1 ? '-' : a}x^2 ${b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`} ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}`;

  return (
    <div className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-lg flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
          <h4 className="text-sm font-semibold text-neutral-200">인터랙티브 함수 시각화</h4>
        </div>
        <button
          onClick={resetValues}
          className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>초기화</span>
        </button>
      </div>

      {/* Formula Card */}
      <div className="py-2 px-3 bg-neutral-950/80 border border-neutral-800/80 rounded-xl text-center">
        <MathRenderer latex={currentFormulaLatex} displayMode />
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full flex justify-center overflow-hidden rounded-xl border border-neutral-800">
        <canvas
          ref={canvasRef}
          width={400}
          height={260}
          className="w-full max-w-[400px] h-[260px] cursor-crosshair"
        />
      </div>

      {/* Parameter Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-neutral-400">
            <span>{type === 'linear' ? '기울기 (a)' : '이차항 계수 (a)'}</span>
            <span className="font-mono font-bold text-sky-400">{a}</span>
          </div>
          <input
            type="range"
            min={type === 'linear' ? -4 : -3}
            max={type === 'linear' ? 4 : 3}
            step={1}
            value={a}
            onChange={(e) => {
              const val = Number(e.target.value);
              setA(val === 0 && type === 'quadratic' ? 1 : val);
            }}
            className="w-full accent-sky-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-neutral-400">
            <span>{type === 'linear' ? 'y절편 (b)' : '일차항 계수 (b)'}</span>
            <span className="font-mono font-bold text-rose-400">{b}</span>
          </div>
          <input
            type="range"
            min={-6}
            max={6}
            step={1}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
          />
        </div>

        {type === 'quadratic' && (
          <div className="space-y-1 md:col-span-2">
            <div className="flex justify-between text-xs text-neutral-400">
              <span>상수항 (c)</span>
              <span className="font-mono font-bold text-amber-400">{c}</span>
            </div>
            <input
              type="range"
              min={-6}
              max={6}
              step={1}
              value={c}
              onChange={(e) => setC(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveGraph;
