import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ArrowLeft, ArrowRight, Info } from 'lucide-react';
import { useRAS } from '../../context/RASContext';
import { PointsBank } from '../shared/PointsBank';
import { SortablePointsCard } from './SortablePointsCard';
import {
  getMemberPoints,
  getPointsAllocated,
  getPointsRemaining,
  hasDuplicateDestinations,
  calculateMaxWins,
} from '../../utils/helpers';

export function PointsAllocation() {
  const { state, reorderRequests, updateRequest, setView } = useRAS();
  const { requests, user } = state;

  const [showTip, setShowTip] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const totalPoints = getMemberPoints(user);
  const allocated = getPointsAllocated(requests);
  const remaining = getPointsRemaining(user, requests);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = requests.findIndex((r) => r.id === active.id);
      const newIndex = requests.findIndex((r) => r.id === over.id);
      const newOrder = arrayMove(requests, oldIndex, newIndex);
      reorderRequests(newOrder);
    }
  };

  const setPointsForRequest = (id: string, newPoints: number) => {
    const request = requests.find((r) => r.id === id);
    if (!request) return;
    const otherAllocated = requests
      .filter((r) => r.id !== id)
      .reduce((sum, r) => sum + r.pointsAllocated, 0);
    const maxAllowed = Math.max(0, totalPoints - otherAllocated);
    const clamped = Math.min(maxAllowed, Math.max(0, newPoints));
    updateRequest({ ...request, pointsAllocated: clamped });
  };

  const getMaxForRequest = (id: string) => {
    const otherAllocated = requests
      .filter((r) => r.id !== id)
      .reduce((sum, r) => sum + r.pointsAllocated, 0);
    return Math.max(0, totalPoints - otherAllocated);
  };

  // Quick allocation: Prioritize Top 3 (70% to top 3, 30% to rest)
  const handlePrioritizeTop3 = () => {
    const top3 = requests.slice(0, 3);
    const rest = requests.slice(3);
    const pointsForTop3 = Math.round(totalPoints * 0.7);
    const pointsForRest = totalPoints - pointsForTop3;
    const perTop3 = top3.length > 0 ? Math.floor(pointsForTop3 / top3.length) : 0;
    const perRest = rest.length > 0 ? Math.floor(pointsForRest / rest.length) : 0;
    let remainder = totalPoints - perTop3 * top3.length - perRest * rest.length;
    const updated = requests.map((req, idx) => {
      const newPoints = idx < 3 ? perTop3 : perRest;
      let add = 0;
      if (remainder > 0) {
        add = 1;
        remainder--;
      }
      return { ...req, pointsAllocated: newPoints + add };
    });
    updated.forEach((r) => updateRequest(r));
  };

  const handleEvenSplit = () => {
    const perRequest = requests.length > 0 ? Math.floor(totalPoints / requests.length) : 0;
    let remainder = totalPoints - perRequest * requests.length;
    const updated = requests.map((req) => {
      let add = 0;
      if (remainder > 0) {
        add = 1;
        remainder--;
      }
      return { ...req, pointsAllocated: perRequest + add };
    });
    updated.forEach((r) => updateRequest(r));
  };

  const handleAllIn = () => {
    const first = requests[0];
    if (!first) return;
    updateRequest({ ...first, pointsAllocated: totalPoints });
    requests.slice(1).forEach((r) => updateRequest({ ...r, pointsAllocated: 0 }));
  };

  const handleSafeSpread = () => {
    // Balanced: spread more evenly with slight emphasis on first few
    const n = requests.length;
    if (n === 0) return;
    const weights = requests.map((_, i) => (i < 3 ? 2 : 1));
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let remainder = totalPoints;
    const points = weights.map((w) => {
      const p = Math.floor((totalPoints * w) / totalWeight);
      remainder -= p;
      return p;
    });
    let i = 0;
    while (remainder > 0 && i < points.length) {
      points[i]++;
      remainder--;
      i = (i + 1) % points.length;
    }
    requests.forEach((req, idx) => updateRequest({ ...req, pointsAllocated: points[idx] ?? 0 }));
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) reorderRequests(arrayMove(requests, index, index - 1));
  };

  const handleMoveDown = (index: number) => {
    if (index < requests.length - 1) reorderRequests(arrayMove(requests, index, index + 1));
  };

  const hasDuplicates = hasDuplicateDestinations(requests);
  const maxWins = calculateMaxWins(user, requests);
  const isOverAllocated = remaining < 0;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h2 style={{
          fontFamily: 'var(--er-font-serif)',
          fontWeight: 300,
          fontSize: '2rem',
          letterSpacing: '-0.02em',
          color: 'var(--er-slate-800)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          Allocate Your Points
        </h2>
        <p className="mt-2" style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', color: 'var(--er-gray-500)' }}>
          Distribute points across requests to signal priority. More points = better odds. Use 0 to try your luck.
        </p>
      </div>

      <div className="mb-6">
        <PointsBank user={user} requests={requests} />
      </div>

      {/* Strategy tip */}
      {showTip && (
        <div
          className="mb-6 flex items-start gap-3 px-4 py-3.5"
          style={{
            background: 'rgba(201,169,110,0.07)',
            border: '1px solid rgba(201,169,110,0.2)',
            borderRadius: 'var(--er-radius-xl)',
          }}
        >
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-gold)' }} />
          <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-700)', flex: 1 }}>
            <span style={{ fontWeight: 500 }}>Strategy:</span> Heavier allocation improves odds on that request — but spreading too thin lowers all odds. Super-peak destinations benefit most. Flexible dates act as a multiplier.
          </p>
          <button
            onClick={() => setShowTip(false)}
            style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-400)' }}
            className="transition-colors hover:text-gray-600"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Quick allocation */}
      <div
        className="mb-6 px-4 py-4"
        style={{
          background: 'var(--er-white)',
          border: '1px solid var(--er-gray-200)',
          borderRadius: 'var(--er-radius-xl)',
          boxShadow: 'var(--er-shadow-xs)',
        }}
      >
        <p className="label-caps mb-3" style={{ color: 'var(--er-gray-400)' }}>Quick allocation</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Prioritize Top 3', fn: handlePrioritizeTop3 },
            { label: 'Even Split', fn: handleEvenSplit },
            { label: 'All-in (#1)', fn: handleAllIn },
            { label: 'Safe Spread', fn: handleSafeSpread },
          ].map(({ label, fn }) => (
            <button
              key={label}
              type="button"
              onClick={fn}
              style={{
                fontFamily: 'var(--er-font-sans)',
                fontSize: '0.8125rem',
                fontWeight: 400,
                color: 'var(--er-gray-700)',
                background: 'var(--er-gray-50)',
                border: '1px solid var(--er-gray-200)',
                borderRadius: 'var(--er-radius-sm)',
                padding: '6px 12px',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Duplicate warning */}
      {hasDuplicates && (
        <div
          className="mb-6 flex items-start gap-3 px-4 py-3.5"
          style={{
            background: 'rgba(217,119,6,0.06)',
            border: '1px solid rgba(217,119,6,0.18)',
            borderRadius: 'var(--er-radius-xl)',
          }}
        >
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-amber)' }} />
          <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-700)' }}>
            You have multiple requests for the same destination. Use "Limit to 1 win" if you only want one win there.
          </p>
        </div>
      )}

      {/* Max wins stat — dark feature card */}
      <div
        className="mb-6 flex items-center justify-between px-5 py-4"
        style={{
          background: 'var(--er-slate-800)',
          borderRadius: 'var(--er-radius-xl)',
          boxShadow: 'var(--er-shadow-md)',
        }}
      >
        <div>
          <p className="label-caps" style={{ color: 'rgba(255,255,255,0.45)' }}>Maximum possible wins this quarter</p>
          <p className="tabular-nums mt-1" style={{ fontFamily: 'var(--er-font-sans)', fontSize: '2rem', fontWeight: 300, color: 'var(--color-gold)', lineHeight: 1 }}>
            {maxWins}
          </p>
        </div>
        {user.memberType === 'ultra' && (
          <span
            className="label-caps px-3 py-1.5"
            style={{
              background: 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))',
              color: '#fff',
              borderRadius: 'var(--er-radius-full)',
              letterSpacing: '0.1em',
            }}
          >
            Ultra · Unlimited
          </span>
        )}
      </div>

      {/* Cards */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={requests.map((r) => r.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {requests.map((request, index) => (
              <SortablePointsCard
                key={request.id}
                request={request}
                rank={index + 1}
                totalRequests={requests.length}
                totalPoints={totalPoints}
                maxPoints={getMaxForRequest(request.id)}
                onPointsChange={(pts) => setPointsForRequest(request.id, pts)}
                onToggleLimitToOne={() => {
                  const req = requests.find((r) => r.id === request.id);
                  if (req) updateRequest({ ...req, limitToOneWin: !req.limitToOneWin });
                }}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
                allRequests={requests}
                user={user}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Over-allocated warning */}
      {isOverAllocated && (
        <div
          className="mt-6 px-4 py-3.5"
          style={{
            background: 'rgba(206,84,87,0.06)',
            border: '1px solid rgba(206,84,87,0.18)',
            borderRadius: 'var(--er-radius-xl)',
            fontFamily: 'var(--er-font-sans)',
            fontSize: '0.8125rem',
            color: 'var(--color-coral)',
            fontWeight: 500,
          }}
        >
          You've allocated {allocated} points but only have {totalPoints}. Reduce points on one or more requests before continuing.
        </div>
      )}

      {/* Nav buttons */}
      <div className="flex gap-4 mt-10">
        <button
          onClick={() => setView('browse-or-search')}
          className="flex-1 flex items-center justify-center gap-2 transition-premium hover:opacity-80"
          style={{
            padding: '14px 16px',
            background: 'var(--er-white)',
            border: '1px solid var(--er-gray-200)',
            borderRadius: 'var(--er-radius-xl)',
            fontFamily: 'var(--er-font-sans)',
            fontSize: '0.875rem',
            fontWeight: 400,
            color: 'var(--er-slate-700)',
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Requests
        </button>
        <button
          onClick={() => setView('review')}
          disabled={isOverAllocated}
          className="flex-1 flex items-center justify-center gap-2 transition-premium"
          style={{
            padding: '14px 16px',
            background: isOverAllocated
              ? 'var(--er-gray-100)'
              : 'linear-gradient(135deg, var(--color-gold-dark) 0%, var(--color-gold) 100%)',
            color: isOverAllocated ? 'var(--er-gray-400)' : '#fff',
            borderRadius: 'var(--er-radius-xl)',
            fontFamily: 'var(--er-font-sans)',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: isOverAllocated ? 'not-allowed' : 'pointer',
            opacity: isOverAllocated ? 0.7 : 1,
          }}
        >
          Review & Submit
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
