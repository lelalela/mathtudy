'use client';

import React from 'react';
import MathRenderer from '../ui/MathRenderer';

interface MultipleChoiceProps {
  choices: string[];
  selectedChoice: string | null;
  onSelect: (choice: string) => void;
  isSubmitted: boolean;
  correctAnswer: string;
  disabled?: boolean;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  choices,
  selectedChoice,
  onSelect,
  isSubmitted,
  correctAnswer,
  disabled = false,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl mx-auto">
      {choices.map((choice, idx) => {
        const isSelected = selectedChoice === choice;
        const isCorrect = choice === correctAnswer;

        let btnStyle = 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:border-neutral-700';

        if (isSelected && !isSubmitted) {
          btnStyle = 'bg-indigo-950/60 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/20';
        }

        if (isSubmitted) {
          if (isCorrect) {
            btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold ring-2 ring-emerald-500/20';
          } else if (isSelected && !isCorrect) {
            btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
          } else {
            btnStyle = 'opacity-40 bg-neutral-900 border-neutral-800';
          }
        }

        return (
          <button
            key={idx}
            type="button"
            disabled={disabled || isSubmitted}
            onClick={() => onSelect(choice)}
            className={`p-4 rounded-xl border text-center transition-all flex items-center justify-center relative min-h-[56px] active:scale-[0.98] ${btnStyle}`}
          >
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-mono font-medium text-neutral-500">
              {['①', '②', '③', '④'][idx] || `${idx + 1}.`}
            </span>
            <div className="text-base font-medium">
              <MathRenderer latex={choice} />
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default MultipleChoice;
