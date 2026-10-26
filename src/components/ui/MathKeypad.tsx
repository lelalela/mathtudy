'use client';

import React from 'react';
import { Delete, CornerDownLeft } from 'lucide-react';

interface MathKeypadProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export const MathKeypad: React.FC<MathKeypadProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
}) => {
  const handleKeyClick = (char: string) => {
    if (disabled) return;
    onChange(value + char);
  };

  const handleBackspace = () => {
    if (disabled) return;
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    if (disabled) return;
    onChange('');
  };

  const keys = [
    ['7', '8', '9', '/', 'C'],
    ['4', '5', '6', '-', '⌫'],
    ['1', '2', '3', '+', 'x'],
    ['0', '.', ',', '^', '=']
  ];

  return (
    <div className="w-full max-w-md mx-auto p-3 bg-neutral-900/90 border border-neutral-800 rounded-2xl shadow-xl backdrop-blur-md">
      {/* Display preview */}
      <div className="mb-3 px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between min-h-[50px]">
        <span className="text-xs font-mono text-neutral-400 select-none">입력값:</span>
        <span className="text-xl font-mono font-semibold text-neutral-100 tracking-wider">
          {value || <span className="text-neutral-600 font-normal">터치 또는 키보드로 입력</span>}
        </span>
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-5 gap-1.5">
        {keys.map((row) =>
          row.map((k) => {
            if (k === '⌫') {
              return (
                <button
                  key="backspace"
                  type="button"
                  onClick={handleBackspace}
                  disabled={disabled}
                  className="h-11 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 active:scale-95 text-neutral-300 flex items-center justify-center transition-all disabled:opacity-40"
                  aria-label="지우기"
                >
                  <Delete className="w-4 h-4" />
                </button>
              );
            }
            if (k === 'C') {
              return (
                <button
                  key="clear"
                  type="button"
                  onClick={handleClear}
                  disabled={disabled}
                  className="h-11 rounded-lg bg-neutral-800/80 hover:bg-rose-950 hover:text-rose-400 active:scale-95 text-neutral-400 font-medium text-xs flex items-center justify-center transition-all disabled:opacity-40"
                >
                  CLR
                </button>
              );
            }

            const isOp = ['/', '-', '+', '^', '='].includes(k);
            return (
              <button
                key={k}
                type="button"
                onClick={() => handleKeyClick(k)}
                disabled={disabled}
                className={`h-11 rounded-lg font-mono text-base font-medium flex items-center justify-center transition-all active:scale-95 disabled:opacity-40 ${
                  isOp
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-amber-300'
                    : 'bg-neutral-800/50 hover:bg-neutral-700/80 text-neutral-200'
                }`}
              >
                {k}
              </button>
            );
          })
        )}
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled || !value.trim()}
        className="w-full mt-2.5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.99] shadow-lg shadow-indigo-950/30"
      >
        <span>정답 제출하기</span>
        <CornerDownLeft className="w-4 h-4" />
      </button>
    </div>
  );
};

export default MathKeypad;
