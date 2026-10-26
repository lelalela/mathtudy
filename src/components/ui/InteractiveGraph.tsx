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

    // Clear background (MD3 surface container lowest)
    ctx.fillStyle = '#0E0E13';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid (MD3 surface container high)
    ctx.strokeStyle = '#202027';
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

    // Draw Axes (MD3 outline)
    ctx.strokeStyle = '#474552';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // X Axis
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    // Y Axis
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Ticks & Labels (MD3 on-surface-variant)
    ctx.fillStyle = '#918F9E';
    ctx.font = '10px Roboto, sans-serif';
    for (let i = -8; i <= 8; i++) {
      if (i === 0) continue;
      // X ticks
      const px = centerX + i * scale;
      ctx.fillText(`${i}`, px - 4, centerY + 14);
      // Y ticks
      const py = centerY - i * scale;
      ctx.fillText(`${i}`, centerX + 6, py + 4);
    }

    // Draw Function Curve (MD3 primary)
    ctx.strokeStyle = '#C3C0FF';
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

    // Highlight Intercepts / Key Points (MD3 Tertiary & Emerald)
    if (type === 'linear') {
      // Y-intercept (0, b)
      const yIntPy = centerY - b * scale;
      if (yIntPy >= 0 && yIntPy <= height) {
        ctx.fillStyle = '#EAB5DE'; // Tertiary dot
        ctx.beginPath();
        ctx.arc(centerX, yIntPy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFD6F6';
        ctx.font = '11px Roboto, sans-serif';
        ctx.fillText(`(0, ${b})`, centerX + 8, yIntPy - 6);
      }

      // X-intercept if a !== 0: (-b/a, 0)
      if (a !== 0) {
        const rootX = -b / a;
        const rootPx = centerX + rootX * scale;
        if (rootPx >= 0 && rootPx <= width) {
          ctx.fillStyle = '#34D399'; // Emerald dot
          ctx.beginPath();
          ctx.arc(rootPx, centerY, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#A7F3D0';
          ctx.font = '11px Roboto, sans-serif';
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
          ctx.fillStyle = '#FBBF24'; // Amber vertex dot
          ctx.beginPath();
          ctx.arc(vPx, vPy, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FDE68A';
          ctx.font = '11px Roboto, sans-serif';
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
    <div className="w-full bg-surface-container-low border border-outline-variant/50 rounded-md3-xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-md3-full bg-primary animate-pulse" />
          <h4 className="text-sm font-semibold text-on-surface">인터랙티브 함수 시각화</h4>
        </div>
        {/* MD3 Text Button */}
        <button
          onClick={resetValues}
          className="text-xs text-on-surface-variant hover:text-on-surface px-3 py-1 rounded-md3-full hover:bg-surface-container flex items-center gap-1.5 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>초기화</span>
        </button>
      </div>

      {/* Formula Card */}
      <div className="py-2.5 px-4 bg-surface-container-lowest border border-outline-variant/40 rounded-md3-md text-center">
        <MathRenderer latex={currentFormulaLatex} displayMode />
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full flex justify-center overflow-hidden rounded-md3-lg border border-outline-variant/40 bg-surface-container-lowest">
        <canvas
          ref={canvasRef}
          width={400}
          height={260}
          className="w-full max-w-[400px] h-[260px] cursor-crosshair"
        />
      </div>

      {/* Parameter Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>{type === 'linear' ? '기울기 (a)' : '이차항 계수 (a)'}</span>
            <span className="font-mono font-bold text-primary">{a}</span>
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
            className="w-full accent-primary cursor-pointer h-1.5 bg-surface-container-highest rounded-md3-full"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>{type === 'linear' ? 'y절편 (b)' : '일차항 계수 (b)'}</span>
            <span className="font-mono font-bold text-tertiary">{b}</span>
          </div>
          <input
            type="range"
            min={-6}
            max={6}
            step={1}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="w-full accent-tertiary cursor-pointer h-1.5 bg-surface-container-highest rounded-md3-full"
          />
        </div>

        {type === 'quadratic' && (
          <div className="space-y-1.5 md:col-span-2">
            <div className="flex justify-between text-xs text-on-surface-variant">
              <span>상수항 (c)</span>
              <span className="font-mono font-bold text-amber-300">{c}</span>
            </div>
            <input
              type="range"
              min={-6}
              max={6}
              step={1}
              value={c}
              onChange={(e) => setC(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-surface-container-highest rounded-md3-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveGraph;
