import { MapPin, Calendar, Moon, Shuffle, CalendarDays } from 'lucide-react';
import type { Destination, VacationRequest } from '../../types';
import { formatDateRange, getNights } from '../../utils/helpers';

interface DestinationCardProps {
  destination: Destination;
  request?: VacationRequest;
  variant?: 'compact' | 'full' | 'result';
  rank?: number;
  showRank?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function DestinationCard({
  destination,
  request,
  variant = 'full',
  rank,
  showRank = false,
  onClick,
  children,
}: DestinationCardProps) {
  const isCompact = variant === 'compact';

  return (
    <div
      className={`relative bg-white rounded-xl overflow-hidden card-shadow transition-premium ${
        onClick ? 'cursor-pointer hover:card-shadow-hover hover:-translate-y-0.5' : ''
      }`}
      onClick={onClick}
    >
      {/* Rank badge */}
      {showRank && rank && (
        <div className="absolute top-3 left-3 z-10 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md">
          <span className="text-sm font-bold text-navy">#{rank}</span>
        </div>
      )}

      {/* Image */}
      <div className={`relative ${isCompact ? 'h-32' : 'h-48'} overflow-hidden`}>
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Destination name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className={`font-serif text-white ${isCompact ? 'text-lg' : 'text-xl'} font-semibold`}>
            {destination.name}
          </h3>
          <div className="flex items-center gap-1 text-white/80 text-sm mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{destination.region}</span>
          </div>
        </div>
      </div>

      {/* Details */}
      {request && (
        <div className="p-4">
          <div className="flex flex-wrap gap-3 text-sm text-navy-light">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gold" />
              <span>{formatDateRange(request.checkInDate, request.checkOutDate)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-gold" />
              <span>
                {getNights(request.checkInDate, request.checkOutDate)} night{getNights(request.checkInDate, request.checkOutDate) > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Flexibility badges */}
          {(request.flexibleDates || request.mustIncludeWeekend) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {request.flexibleDates && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                  <Shuffle className="w-3 h-3" />
                  ±2 days flexible
                </span>
              )}
              {request.mustIncludeWeekend && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                  <CalendarDays className="w-3 h-3" />
                  Weekend required
                </span>
              )}
            </div>
          )}

          {/* Custom content slot */}
          {children}
        </div>
      )}

      {/* For cards without request info */}
      {!request && children && <div className="p-4">{children}</div>}
    </div>
  );
}
