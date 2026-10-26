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
    <div className="w-full max-w-md mx-auto p-4 bg-surface-container border border-outline-variant/60 rounded-md3-xl shadow-sm">
      {/* Display preview */}
      <div className="mb-3.5 px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-md3-md flex items-center justify-between min-h-[52px]">
        <span className="text-xs font-mono text-on-surface-variant select-none">입력값:</span>
        <span className="text-xl font-mono font-semibold text-on-surface tracking-wider">
          {value || <span className="text-on-surface-variant/50 font-normal text-sm">터치 또는 키보드로 입력</span>}
        </span>
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-5 gap-2">
        {keys.map((row) =>
          row.map((k) => {
            if (k === '⌫') {
              return (
                <button
                  key="backspace"
                  type="button"
                  onClick={handleBackspace}
                  disabled={disabled}
                  className="h-12 rounded-md3-md bg-surface-container-high hover:bg-surface-container-highest active:scale-95 text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-all md3-button-motion disabled:opacity-40"
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
                  className="h-12 rounded-md3-md bg-surface-container-high hover:bg-error-container hover:text-on-error-container active:scale-95 text-on-surface-variant font-medium text-xs flex items-center justify-center transition-all md3-button-motion disabled:opacity-40"
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
                className={`h-12 rounded-md3-md font-mono text-base font-medium flex items-center justify-center transition-all active:scale-95 md3-button-motion disabled:opacity-40 ${
                  isOp
                    ? 'bg-secondary-container hover:brightness-110 text-on-secondary-container font-semibold'
                    : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface'
                }`}
              >
                {k}
              </button>
            );
          })
        )}
      </div>

      {/* MD3 Filled Button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled || !value.trim()}
        className="w-full mt-3.5 py-3.5 bg-primary hover:brightness-110 disabled:bg-surface-container-high disabled:text-on-surface-variant/40 text-on-primary font-medium text-sm rounded-md3-full transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-xs"
      >
        <span>정답 제출하기</span>
        <CornerDownLeft className="w-4 h-4" />
      </button>
    </div>
  );
};

export default MathKeypad;
