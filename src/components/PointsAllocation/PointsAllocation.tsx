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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-semibold text-navy">Allocate Your Points</h2>
        <p className="text-slate-500 mt-2">
          Distribute your points across requests to signal priority. More points = better odds. You
          can use 0 on any request to “try your luck.”
        </p>
      </div>

      <div className="mb-6">
        <PointsBank user={user} requests={requests} />
      </div>

      {showTip && (
        <div className="mb-6 p-4 bg-gold/10 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-navy-light">
              <strong className="text-navy">Strategy:</strong> Putting more points on a request
              improves its odds, but spreading too thin lowers odds everywhere. Super-peak
              destinations benefit most from heavier allocation. Flexible dates act as a multiplier.
            </p>
          </div>
          <button
            onClick={() => setShowTip(false)}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Quick allocation tools */}
      <div className="mb-6 p-4 bg-white rounded-xl card-shadow">
        <p className="text-sm font-medium text-slate-600 mb-3">Quick allocation</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handlePrioritizeTop3}
            className="px-3 py-2 bg-slate-100 text-navy text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            Prioritize Top 3
          </button>
          <button
            type="button"
            onClick={handleEvenSplit}
            className="px-3 py-2 bg-slate-100 text-navy text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            Even Split
          </button>
          <button
            type="button"
            onClick={handleAllIn}
            className="px-3 py-2 bg-slate-100 text-navy text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            All-in (#1)
          </button>
          <button
            type="button"
            onClick={handleSafeSpread}
            className="px-3 py-2 bg-slate-100 text-navy text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            Safe Spread
          </button>
        </div>
      </div>

      {hasDuplicates && (
        <div className="mb-6 p-4 bg-amber/10 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-amber flex-shrink-0 mt-0.5" />
          <p className="text-sm text-navy-light">
            You have multiple requests for the same destination. Use “Limit to 1 win” on a request
            if you only want one win at that destination.
          </p>
        </div>
      )}

      <div className="mb-6 p-4 bg-white rounded-xl card-shadow flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Maximum possible wins this quarter</p>
          <p className="text-2xl font-semibold text-navy tabular-nums">{maxWins}</p>
        </div>
        {user.memberType === 'ultra' && (
          <div className="px-3 py-1 gold-gradient text-white text-sm font-medium rounded-full">
            Ultra: Unlimited
          </div>
        )}
      </div>

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

      {isOverAllocated && (
        <div className="mt-6 p-4 bg-coral/10 rounded-xl text-coral font-medium text-sm">
          You’ve allocated {allocated} points but only have {totalPoints}. Reduce points on one or
          more requests before continuing.
        </div>
      )}

      <div className="flex gap-4 mt-8">
        <button
          onClick={() => setView('browse-or-search')}
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border border-slate-200 text-navy rounded-xl font-medium transition-premium hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Requests
        </button>
        <button
          onClick={() => setView('review')}
          disabled={isOverAllocated}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-premium ${
            isOverAllocated
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'gold-gradient text-white hover:opacity-90'
          }`}
        >
          Review & Submit
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
