'use client';

import React, { useEffect, useCallback } from 'react';
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
  const handleKeyClick = useCallback(
    (char: string) => {
      if (disabled) return;
      onChange(value + char);
    },
    [disabled, onChange, value]
  );

  const handleBackspace = useCallback(() => {
    if (disabled) return;
    onChange(value.slice(0, -1));
  }, [disabled, onChange, value]);

  const handleClear = useCallback(() => {
    if (disabled) return;
    onChange('');
  }, [disabled, onChange]);

  // Physical keyboard binding
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is in an input, textarea, or contenteditable element
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (disabled) return;

      // Backspace
      if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
        return;
      }

      // Enter (Submit)
      if (e.key === 'Enter') {
        e.preventDefault();
        if (value.trim()) {
          onSubmit();
        }
        return;
      }

      // Escape key to clear
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
        return;
      }

      // Numbers (0-9)
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleKeyClick(e.key);
        return;
      }

      // Arithmetic operators (+, -, *, /)
      if (['+', '-', '*', '/'].includes(e.key)) {
        e.preventDefault();
        handleKeyClick(e.key);
        return;
      }

      // Parentheses (, )
      if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        handleKeyClick(e.key);
        return;
      }

      // Variables x, y (case-insensitive -> lower)
      if (e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        handleKeyClick('x');
        return;
      }
      if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        handleKeyClick('y');
        return;
      }

      // Symbols (=, ,, ., ^, Space)
      if (['=', ',', '.', '^', ' '].includes(e.key)) {
        e.preventDefault();
        handleKeyClick(e.key);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [disabled, value, onSubmit, handleKeyClick, handleBackspace, handleClear]);

  // Keypad grid: 5 columns x 5 rows
  const keys = [
    ['(', ')', '^', 'x', 'y'],
    ['7', '8', '9', '/', 'C'],
    ['4', '5', '6', '*', '⌫'],
    ['1', '2', '3', '-', '='],
    ['0', '.', ',', '+', '␣'],
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
            if (k === '␣') {
              return (
                <button
                  key="space"
                  type="button"
                  onClick={() => handleKeyClick(' ')}
                  disabled={disabled}
                  className="h-12 rounded-md3-md bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface active:scale-95 text-xs font-mono flex items-center justify-center transition-all md3-button-motion disabled:opacity-40"
                  aria-label="스페이스"
                  title="공백(스페이스)"
                >
                  ␣
                </button>
              );
            }

            const isOp = ['/', '*', '-', '+', '^', '='].includes(k);
            const isVar = ['x', 'y'].includes(k);
            const isParen = ['(', ')'].includes(k);

            let btnClass = 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface';
            if (isOp) {
              btnClass = 'bg-secondary-container hover:brightness-110 text-on-secondary-container font-semibold';
            } else if (isVar) {
              btnClass = 'bg-tertiary-container hover:brightness-110 text-on-tertiary-container font-bold';
            } else if (isParen) {
              btnClass = 'bg-surface-container-highest hover:brightness-110 text-primary font-semibold';
            }

            return (
              <button
                key={k}
                type="button"
                onClick={() => handleKeyClick(k)}
                disabled={disabled}
                className={`h-12 rounded-md3-md font-mono text-base font-medium flex items-center justify-center transition-all active:scale-95 md3-button-motion disabled:opacity-40 ${btnClass}`}
              >
                {k}
              </button>
            );
          })
        )}
      </div>

      {/* MD3 Filled Button: Submit */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled || !value.trim()}
        className="w-full mt-3.5 py-3.5 bg-primary hover:brightness-110 disabled:bg-surface-container-high disabled:text-on-surface-variant/40 text-on-primary font-medium text-sm rounded-md3-full transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-xs"
      >
        <span>정답 제출하기</span>
        <CornerDownLeft className="w-4 h-4" />
      </button>

      {/* Keyboard Shortcut Guide */}
      <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-on-surface-variant/70">
        <span className="inline-block px-1.5 py-0.5 rounded bg-surface-container-high font-mono text-[10px] text-on-surface-variant border border-outline-variant/40">PC 키보드</span>
        <span>0~9, 사칙연산(+,-,*,/), 괄호, x/y, Enter(제출) 지원</span>
      </div>
    </div>
  );
};

export default MathKeypad;
