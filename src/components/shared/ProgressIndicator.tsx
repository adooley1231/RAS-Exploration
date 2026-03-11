import { Check } from 'lucide-react';
import type { AppView } from '../../types';

interface Step {
  id: AppView;
  label: string;
  shortLabel?: string;
}

const steps: Step[] = [
  { id: 'browse-or-search', label: 'Add Requests', shortLabel: 'Add' },
  { id: 'allocate-points', label: 'Allocate Points', shortLabel: 'Points' },
  { id: 'review', label: 'Review & Submit', shortLabel: 'Submit' },
];

interface ProgressIndicatorProps {
  currentStep: AppView;
  onStepClick?: (step: AppView) => void;
  allowNavigation?: boolean;
}

export function ProgressIndicator({
  currentStep,
  onStepClick,
  allowNavigation = true,
}: ProgressIndicatorProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  // Results view shows all steps as complete
  if (currentStep === 'results') {
    return (
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal/10 text-teal rounded-full">
          <Check className="w-4 h-4" />
          <span className="font-medium">Submitted</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-2 sm:gap-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = step.id === currentStep;
          const isClickable = allowNavigation && onStepClick && (isCompleted || isCurrent);

          return (
            <div key={step.id} className="flex items-center">
              {/* Step indicator */}
              <button
                onClick={() => isClickable && onStepClick?.(step.id)}
                disabled={!isClickable}
                className={`flex items-center gap-2 transition-premium ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                {/* Circle/Check */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-premium ${
                    isCompleted
                      ? 'bg-teal text-white'
                      : isCurrent
                      ? 'bg-navy text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`hidden sm:block text-sm font-medium transition-premium ${
                    isCurrent ? 'text-navy' : isCompleted ? 'text-teal' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
                <span
                  className={`sm:hidden text-xs font-medium transition-premium ${
                    isCurrent ? 'text-navy' : isCompleted ? 'text-teal' : 'text-slate-400'
                  }`}
                >
                  {step.shortLabel}
                </span>
              </button>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-0.5 mx-2 transition-premium ${
                    index < currentIndex ? 'bg-teal' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
