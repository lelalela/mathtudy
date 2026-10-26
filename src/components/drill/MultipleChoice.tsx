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

        let btnStyle = 'bg-surface-container-low border-outline-variant/60 text-on-surface hover:bg-surface-container hover:border-outline';

        if (isSelected && !isSubmitted) {
          btnStyle = 'bg-primary-container/40 border-primary text-on-surface ring-2 ring-primary/30';
        }

        if (isSubmitted) {
          if (isCorrect) {
            btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold ring-2 ring-emerald-500/30';
          } else if (isSelected && !isCorrect) {
            btnStyle = 'bg-error-container/60 border-error text-on-error-container';
          } else {
            btnStyle = 'opacity-35 bg-surface-container-low border-outline-variant/30 text-on-surface-variant';
          }
        }

        return (
          <button
            key={idx}
            type="button"
            disabled={disabled || isSubmitted}
            onClick={() => onSelect(choice)}
            className={`p-4 rounded-md3-lg border text-center transition-all flex items-center justify-center relative min-h-[58px] active:scale-[0.98] md3-button-motion ${btnStyle}`}
          >
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-medium text-on-surface-variant">
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
