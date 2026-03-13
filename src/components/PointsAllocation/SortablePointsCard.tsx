import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  MapPin,
  Calendar,
  Moon,
  Shuffle,
  CalendarDays,
  Copy,
  Home,
  ChevronUp,
  ChevronDown,
  Coins,
} from 'lucide-react';
import type { VacationRequest, User } from '../../types';
import {
  formatDateRange,
  getDuplicateDestinationIds,
  getNights,
  formatUnitPreference,
  getEfficiencyLevel,
  calculateTRVR,
  getWishListBoost,
  computeRequestWeight,
} from '../../utils/helpers';
import { BoostIndicator } from '../shared/BoostIndicator';

interface SortablePointsCardProps {
  request: VacationRequest;
  rank: number;
  totalRequests: number;
  totalPoints: number;
  maxPoints: number;
  onPointsChange: (points: number) => void;
  onToggleLimitToOne: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  allRequests: VacationRequest[];
  user: User;
}

export function SortablePointsCard({
  request,
  rank,
  totalRequests,
  totalPoints,
  maxPoints,
  onPointsChange,
  onToggleLimitToOne,
  onMoveUp,
  onMoveDown,
  allRequests,
  user,
}: SortablePointsCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: request.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const duplicateIds = getDuplicateDestinationIds(allRequests);
  const isDuplicate = duplicateIds.has(request.destination.id);
  const nights = getNights(request.checkInDate, request.checkOutDate);
  const efficiency = getEfficiencyLevel(request.destination, request.pointsAllocated, user);
  const trvr = calculateTRVR(user, request.destination.id);
  const wishListBoost = getWishListBoost(user, request.destination.id);
  const pct = totalPoints > 0 ? Math.round((request.pointsAllocated / totalPoints) * 100) : 0;
  const weight = computeRequestWeight(user, request);

  const efficiencyClass = {
    good: 'bg-teal/10 text-teal',
    moderate: 'bg-amber/10 text-amber',
    low: 'bg-coral/10 text-coral',
  }[efficiency];

  return (
    <div
      ref={setNodeRef}
      style={style}
      style={{
        background: 'var(--er-white)',
        borderRadius: 'var(--er-radius-xl)',
        overflow: 'hidden',
        boxShadow: isDragging ? 'var(--er-shadow-xl)' : 'var(--er-shadow-sm)',
        border: '1px solid var(--er-gray-200)',
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'scale(1.015)' : undefined,
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="flex flex-shrink-0">
          <div
            {...attributes}
            {...listeners}
            className="w-10 sm:w-12 flex items-center justify-center cursor-grab active:cursor-grabbing"
            style={{ background: 'var(--er-gray-50)' }}
          >
            <GripVertical className="w-4 h-4" style={{ color: 'var(--er-gray-300)' }} />
          </div>

          <div
            className="flex flex-col items-center justify-center py-2 w-14"
            style={{ borderRight: '1px solid var(--er-gray-100)' }}
          >
            <button
              onClick={onMoveUp}
              disabled={rank === 1}
              className="p-1 rounded transition-colors"
              style={{ color: rank === 1 ? 'var(--er-gray-200)' : 'var(--er-gray-400)', cursor: rank === 1 ? 'not-allowed' : 'pointer' }}
              title="Move up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            {/* Editorial rank marker */}
            <div
              className="w-7 h-7 flex items-center justify-center my-0.5"
              style={{
                background: 'var(--er-slate-800)',
                borderRadius: '2px',
              }}
            >
              <span
                className="tabular-nums"
                style={{ color: '#fff', fontSize: '0.625rem', fontFamily: 'var(--er-font-sans)', fontWeight: 500, letterSpacing: '0.02em' }}
              >
                #{rank}
              </span>
            </div>
            <button
              onClick={onMoveDown}
              disabled={rank === totalRequests}
              className="p-1 rounded transition-colors"
              style={{ color: rank === totalRequests ? 'var(--er-gray-200)' : 'var(--er-gray-400)', cursor: rank === totalRequests ? 'not-allowed' : 'pointer' }}
              title="Move down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-shrink-0 w-20 h-24 sm:w-24 sm:h-28 relative">
          <img
            src={request.destination.imageUrl}
            alt={request.destination.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 p-4 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 style={{ fontFamily: 'var(--er-font-serif)', fontWeight: 300, fontSize: '1.125rem', color: 'var(--er-slate-800)', margin: 0, letterSpacing: '-0.01em' }}>
                {request.destination.name}
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--er-gray-400)' }} />
                <span className="label-caps" style={{ color: 'var(--er-gray-400)', letterSpacing: '0.09em' }}>{request.destination.region}</span>
              </div>
            </div>
              <div className="flex items-end gap-2 flex-wrap justify-end text-xs">
                <div className="flex items-center gap-1.5">
                  <BoostIndicator
                    trvr={trvr}
                    wishListBoost={wishListBoost}
                    ultraBoost={user.memberType === 'ultra'}
                    compact
                  />
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${efficiencyClass}`}
                    title={
                      efficiency === 'good'
                        ? 'Good odds for points invested'
                        : efficiency === 'moderate'
                          ? 'Moderate odds'
                          : 'Low odds — consider more points'
                    }
                  >
                    {efficiency === 'good' ? 'Good odds' : efficiency === 'moderate' ? 'Moderate' : 'Low odds'}
                  </span>
                </div>
                {weight > 0 && (
                  <div className="text-slate-500 tabular-nums">
                    <span className="font-semibold text-navy">{weight}</span>{' '}
                    <span className="text-[11px]">weight</span>
                  </div>
                )}
              </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-navy-light">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gold flex-shrink-0" />
              <span>{formatDateRange(request.checkInDate, request.checkOutDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Moon className="w-4 h-4 text-gold flex-shrink-0" />
              <span>{nights} nights</span>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-1 text-sm text-navy-light">
            <Home className="w-4 h-4 text-gold flex-shrink-0" />
            <span>{formatUnitPreference(request)}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {request.flexibleDates && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                <Shuffle className="w-3 h-3" />
                ±2 days
              </span>
            )}
            {request.mustIncludeWeekend && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                <CalendarDays className="w-3 h-3" />
                Weekend
              </span>
            )}
          </div>
        </div>

        {/* Points allocation */}
        <div
          className="flex-shrink-0 p-4 flex flex-col justify-center gap-2.5 min-w-[150px]"
          style={{ borderLeft: '1px solid var(--er-gray-100)' }}
        >
          {/* Value display */}
          <div className="flex items-baseline gap-1.5">
            <span
              className="tabular-nums"
              style={{ fontFamily: 'var(--er-font-sans)', fontSize: '1.5rem', fontWeight: 500, color: request.pointsAllocated === 0 ? 'var(--er-gray-400)' : 'var(--color-gold-dark)', lineHeight: 1 }}
            >
              {request.pointsAllocated}
            </span>
            <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-400)' }}>
              / {maxPoints} pts
            </span>
            {pct > 0 && (
              <span className="label-caps" style={{ color: 'var(--er-gray-400)', marginLeft: '2px' }}>({pct}%)</span>
            )}
          </div>

          {/* Slider */}
          <input
            type="range"
            min={0}
            max={maxPoints}
            value={request.pointsAllocated}
            onChange={(e) => onPointsChange(parseInt(e.target.value, 10))}
            className="w-full appearance-none accent-gold"
            style={{ height: '2px', borderRadius: '1px', background: 'var(--er-gray-200)' }}
          />

          {/* Number input */}
          <input
            type="number"
            min={0}
            max={maxPoints}
            value={request.pointsAllocated}
            onChange={(e) =>
              onPointsChange(Math.min(maxPoints, Math.max(0, parseInt(e.target.value, 10) || 0)))
            }
            className="w-16 text-center tabular-nums"
            style={{
              fontFamily: 'var(--er-font-sans)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--er-slate-800)',
              padding: '4px 8px',
              border: '1px solid var(--er-gray-200)',
              borderRadius: 'var(--er-radius-sm)',
            }}
          />
        </div>

        {isDuplicate && (
          <div className="flex-shrink-0 p-4 border-l border-slate-100 flex flex-col justify-center">
            <div className="flex items-center gap-1 text-amber text-xs mb-2">
              <Copy className="w-3.5 h-3.5" />
              <span>Same destination</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={request.limitToOneWin || false}
                onChange={onToggleLimitToOne}
                className="w-4 h-4 rounded border-slate-300 text-gold focus:ring-gold"
              />
              <span className="text-xs text-slate-600">Limit to 1 win</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
