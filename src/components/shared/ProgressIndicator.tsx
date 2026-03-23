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

  if (currentStep === 'results') {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5"
          style={{
            background: 'rgba(74,158,142,0.08)',
            color: 'var(--color-teal)',
            borderRadius: 'var(--er-radius-full)',
          }}
        >
          <Check className="w-3.5 h-3.5" />
          <span className="label-caps" style={{ color: 'var(--color-teal)', letterSpacing: '0.1em' }}>
            Submitted
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex items-center gap-1 sm:gap-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = step.id === currentStep;
          const isClickable = allowNavigation && onStepClick && (isCompleted || isCurrent);

          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => isClickable && onStepClick?.(step.id)}
                disabled={!isClickable}
                className={`flex items-center gap-2.5 transition-premium ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                {/* Marker — minimal dot/dash editorial style */}
                <div
                  className="flex items-center justify-center transition-premium"
                  style={{
                    width: isCompleted ? '18px' : '18px',
                    height: '18px',
                    borderRadius: 'var(--er-radius-full)',
                    background: isCompleted
                      ? 'var(--color-teal)'
                      : isCurrent
                      ? 'var(--er-slate-800)'
                      : 'transparent',
                    border: isCompleted
                      ? 'none'
                      : isCurrent
                      ? 'none'
                      : '1px solid var(--er-gray-300)',
                  }}
                >
                  {isCompleted ? (
                    <Check style={{ width: '9px', height: '9px', color: '#fff', strokeWidth: 2.5 }} />
                  ) : (
                    <span
                      className="tabular-nums"
                      style={{
                        fontSize: '0.625rem',
                        fontWeight: 500,
                        fontFamily: 'var(--er-font-sans)',
                        color: isCurrent ? '#fff' : 'var(--er-gray-400)',
                        lineHeight: 1,
                      }}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Label — Gotham small-caps style */}
                <span
                  className="hidden sm:block label-caps transition-premium"
                  style={{
                    color: isCurrent
                      ? 'var(--er-slate-800)'
                      : isCompleted
                      ? 'var(--color-teal)'
                      : 'var(--er-gray-400)',
                    letterSpacing: '0.1em',
                  }}
                >
                  {step.label}
                </span>
                <span
                  className="sm:hidden label-caps transition-premium"
                  style={{
                    color: isCurrent
                      ? 'var(--er-slate-800)'
                      : isCompleted
                      ? 'var(--color-teal)'
                      : 'var(--er-gray-400)',
                  }}
                >
                  {step.shortLabel}
                </span>
              </button>

              {/* Connector — ultra-thin line */}
              {index < steps.length - 1 && (
                <div
                  className="transition-premium"
                  style={{
                    width: '32px',
                    height: '1px',
                    margin: '0 10px',
                    background: index < currentIndex ? 'var(--color-teal)' : 'var(--er-gray-200)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
