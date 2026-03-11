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
import { ArrowLeft, ArrowRight, Info, AlertTriangle } from 'lucide-react';
import { useRAS } from '../../context/RASContext';
import { SortableRequestCard } from './SortableRequestCard';
import { hasDuplicateDestinations, calculateMaxWins } from '../../utils/helpers';

export function RankingList() {
  const { state, reorderRequests, updateRequest, setView } = useRAS();
  const { requests, user } = state;

  const [showTip, setShowTip] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = requests.findIndex((r) => r.id === active.id);
      const newIndex = requests.findIndex((r) => r.id === over.id);
      const newOrder = arrayMove(requests, oldIndex, newIndex);
      reorderRequests(newOrder);
    }
  };

  const handleToggleLimitToOne = (id: string) => {
    const request = requests.find((r) => r.id === id);
    if (request) {
      updateRequest({
        ...request,
        limitToOneWin: !request.limitToOneWin,
      });
    }
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newOrder = arrayMove(requests, index, index - 1);
      reorderRequests(newOrder);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < requests.length - 1) {
      const newOrder = arrayMove(requests, index, index + 1);
      reorderRequests(newOrder);
    }
  };

  const hasDuplicates = hasDuplicateDestinations(requests);
  const maxWins = calculateMaxWins(user, requests);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-semibold text-navy">Rank Your Preferences</h2>
        <p className="text-slate-500 mt-2">
          Drag and drop to arrange your requests in order of priority. Your #1 choice has the
          highest priority in the lottery.
        </p>
      </div>

      {/* Tip banner */}
      {showTip && (
        <div className="mb-6 p-4 bg-gold/10 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-navy-light">
              <strong className="text-navy">Pro tip:</strong> If you have flexible dates enabled,
              consider ranking those requests higher as they have better chances of matching.
              Selecting "Any Unit" also improves your odds.
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

      {/* Duplicate destinations warning */}
      {hasDuplicates && (
        <div className="mb-6 p-4 bg-amber/10 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-navy-light">
              <strong className="text-navy">Duplicate destinations detected.</strong> You've added
              the same destination multiple times. Consider using the "Limit to 1 win" option to
              avoid winning the same destination multiple times.
            </p>
          </div>
        </div>
      )}

      {/* Max wins indicator */}
      <div className="mb-6 p-4 bg-white rounded-xl card-shadow">
        <div className="flex items-center justify-between">
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
      </div>

      {/* Sortable list */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={requests.map((r) => r.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {requests.map((request, index) => (
              <SortableRequestCard
                key={request.id}
                request={request}
                rank={index + 1}
                totalRequests={requests.length}
                allRequests={requests}
                onToggleLimitToOne={handleToggleLimitToOne}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Navigation buttons */}
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
          className="flex-1 flex items-center justify-center gap-2 py-4 gold-gradient text-white rounded-xl font-medium transition-premium hover:opacity-90"
        >
          Review & Submit
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
