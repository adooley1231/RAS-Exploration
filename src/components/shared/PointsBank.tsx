import { Coins } from 'lucide-react';
import { getMemberPoints, getPointsAllocated, getPointsRemaining } from '../../utils/helpers';
import type { User, VacationRequest } from '../../types';

interface PointsBankProps {
  user: User;
  requests: VacationRequest[];
  /** Compact inline style for header; default is prominent bar */
  variant?: 'default' | 'compact';
  className?: string;
}

export function PointsBank({ user, requests, variant = 'default', className = '' }: PointsBankProps) {
  const total = getMemberPoints(user);
  const allocated = getPointsAllocated(requests);
  const remaining = getPointsRemaining(user, requests);
  const isOver = remaining < 0;

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        <Coins className="w-4 h-4 text-gold" />
        <span className="font-medium text-navy tabular-nums">{total}</span>
        <span className="text-slate-400">available</span>
        <span className="text-slate-300">|</span>
        <span className="text-navy-light tabular-nums">{allocated}</span>
        <span className="text-slate-400">allocated</span>
        <span className="text-slate-300">|</span>
        <span className={`tabular-nums ${isOver ? 'text-coral font-medium' : 'text-teal'}`}>
          {remaining}
        </span>
        <span className="text-slate-400">remaining</span>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200 card-shadow ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg gold-gradient flex items-center justify-center">
          <Coins className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Points budget
          </p>
          <p className="text-lg font-bold text-navy tabular-nums">
            {total} available
            {user.memberType === 'ultra' && (
              <span className="ml-1.5 text-xs font-normal text-gold">(1.2× Ultra)</span>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-slate-500">
          <strong className="text-navy tabular-nums">{allocated}</strong> allocated
        </span>
        <span className="text-slate-300">|</span>
        <span className={isOver ? 'text-coral font-semibold' : 'text-teal font-semibold'}>
          <span className="tabular-nums">{remaining}</span> remaining
        </span>
      </div>
      {isOver && (
        <span className="text-xs font-medium text-coral bg-coral/10 px-2 py-1 rounded-full">
          Over-allocated — reduce points on requests
        </span>
      )}
    </div>
  );
}
