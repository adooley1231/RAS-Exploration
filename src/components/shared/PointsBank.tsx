import { getMemberPoints, getPointsAllocated, getPointsRemaining } from '../../utils/helpers';
import type { User, VacationRequest } from '../../types';

interface PointsBankProps {
  user: User;
  requests: VacationRequest[];
  variant?: 'default' | 'compact';
  className?: string;
}

export function PointsBank({ user, requests, variant = 'default', className = '' }: PointsBankProps) {
  const total = getMemberPoints(user);
  const allocated = getPointsAllocated(requests);
  const remaining = getPointsRemaining(user, requests);
  const isOver = remaining < 0;
  const usedPct = Math.min((allocated / total) * 100, 100);

  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center gap-1.5 ${className}`}
        style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem' }}
      >
        <span className="tabular-nums" style={{ fontWeight: 500, color: 'var(--er-slate-800)' }}>{total}</span>
        <span style={{ color: 'var(--er-gray-400)' }}>available</span>
        <span style={{ color: 'var(--er-gray-300)' }}>|</span>
        <span className="tabular-nums" style={{ color: 'var(--er-gray-700)' }}>{allocated}</span>
        <span style={{ color: 'var(--er-gray-400)' }}>allocated</span>
        <span style={{ color: 'var(--er-gray-300)' }}>|</span>
        <span
          className="tabular-nums"
          style={{ color: isOver ? 'var(--color-coral)' : 'var(--color-teal)', fontWeight: isOver ? 500 : 400 }}
        >
          {remaining}
        </span>
        <span style={{ color: 'var(--er-gray-400)' }}>remaining</span>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 ${className}`}
      style={{
        background: 'var(--er-white)',
        border: '1px solid var(--er-gray-200)',
        borderRadius: 'var(--er-radius-xl)',
        boxShadow: 'var(--er-shadow-xs)',
      }}
    >
      {/* Left: label + total */}
      <div className="flex items-baseline gap-3">
        <p className="label-caps" style={{ color: 'var(--er-gray-400)' }}>Points budget</p>
        <p
          className="tabular-nums"
          style={{
            fontFamily: 'var(--er-font-sans)',
            fontSize: '1.25rem',
            fontWeight: 500,
            color: 'var(--er-slate-800)',
            lineHeight: 1,
          }}
        >
          {total}
          {' '}
          <span
            style={{ fontSize: '0.8125rem', fontWeight: 400, color: 'var(--er-gray-400)' }}
          >
            available
          </span>
          {user.memberType === 'ultra' && (
            <span
              className="label-caps ml-2 px-1.5 py-0.5"
              style={{
                background: 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))',
                color: '#fff',
                borderRadius: '2px',
                fontSize: '0.55rem',
              }}
            >
              1.2× Ultra
            </span>
          )}
        </p>
      </div>

      {/* Right: allocated | remaining */}
      <div
        className="flex items-center gap-3"
        style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem' }}
      >
        <span>
          <strong className="tabular-nums" style={{ fontWeight: 500, color: 'var(--er-slate-800)' }}>
            {allocated}
          </strong>
          <span style={{ color: 'var(--er-gray-400)', marginLeft: '4px' }}>allocated</span>
        </span>
        <span style={{ color: 'var(--er-gray-200)' }}>|</span>
        <span>
          <strong
            className="tabular-nums"
            style={{ fontWeight: 500, color: isOver ? 'var(--color-coral)' : 'var(--color-teal)' }}
          >
            {remaining}
          </strong>
          <span style={{ color: 'var(--er-gray-400)', marginLeft: '4px' }}>remaining</span>
        </span>
        {isOver && (
          <span
            className="label-caps px-2 py-1"
            style={{
              background: 'rgba(206,84,87,0.08)',
              color: 'var(--color-coral)',
              borderRadius: 'var(--er-radius-full)',
            }}
          >
            Over-allocated
          </span>
        )}
      </div>

      {/* Progress track */}
      {allocated > 0 && (
        <div className="w-full" style={{ height: '2px', background: 'var(--er-gray-100)', borderRadius: '1px' }}>
          <div
            style={{
              width: `${usedPct}%`,
              height: '100%',
              background: isOver
                ? 'var(--color-coral)'
                : `linear-gradient(to right, var(--color-gold-dark), var(--color-gold))`,
              borderRadius: '1px',
              transition: 'width 0.5s cubic-bezier(0.34, 1.2, 0.64, 1)',
            }}
          />
        </div>
      )}
    </div>
  );
}
