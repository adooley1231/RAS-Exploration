import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MapPin, Calendar, Moon, Shuffle, CalendarDays, Copy, Home, ChevronUp, ChevronDown } from 'lucide-react';
import type { VacationRequest } from '../../types';
import { formatDateRange, getDuplicateDestinationIds, getNights, formatUnitPreference } from '../../utils/helpers';

interface SortableRequestCardProps {
  request: VacationRequest;
  rank: number;
  totalRequests: number;
  allRequests: VacationRequest[];
  onToggleLimitToOne: (id: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function SortableRequestCard({
  request,
  rank,
  totalRequests,
  allRequests,
  onToggleLimitToOne,
  onMoveUp,
  onMoveDown,
}: SortableRequestCardProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white rounded-xl overflow-hidden card-shadow transition-premium ${
        isDragging ? 'opacity-50 scale-[1.02] shadow-xl' : ''
      }`}
    >
      <div className="flex">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 w-12 bg-slate-50 flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-5 h-5 text-slate-400" />
        </div>

        {/* Rank badge + mobile reorder buttons */}
        <div className="flex-shrink-0 w-16 flex flex-col items-center justify-center border-r border-slate-100 py-2">
          <button
            onClick={onMoveUp}
            disabled={rank === 1}
            className={`p-1 rounded transition-colors ${
              rank === 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-navy hover:bg-slate-100'
            }`}
            title="Move up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 flex items-center justify-center bg-navy text-white rounded-full my-1">
            <span className="text-sm font-bold">#{rank}</span>
          </div>
          <button
            onClick={onMoveDown}
            disabled={rank === totalRequests}
            className={`p-1 rounded transition-colors ${
              rank === totalRequests ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-navy hover:bg-slate-100'
            }`}
            title="Move down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Image */}
        <div className="flex-shrink-0 w-24 h-28 relative">
          <img
            src={request.destination.imageUrl}
            alt={request.destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 min-w-0">
          <h3 className="font-serif text-lg font-semibold text-navy truncate">{request.destination.name}</h3>
          <div className="flex items-center gap-1 text-sm text-slate-500 mt-0.5">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{request.destination.region}</span>
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

          {/* Unit info */}
          <div className="flex items-center gap-1 mt-1 text-sm text-navy-light">
            <Home className="w-4 h-4 text-gold flex-shrink-0" />
            <span>{formatUnitPreference(request)}</span>
          </div>

          {/* Flexibility badges */}
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

        {/* Duplicate destination indicator & limit to one */}
        {isDuplicate && (
          <div className="flex-shrink-0 w-40 p-4 border-l border-slate-100 flex flex-col justify-center">
            <div className="flex items-center gap-1 text-amber text-xs mb-2">
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicate destination</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={request.limitToOneWin || false}
                onChange={() => onToggleLimitToOne(request.id)}
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
