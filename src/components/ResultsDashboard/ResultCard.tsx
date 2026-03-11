import {
  Trophy,
  MapPin,
  Calendar,
  Moon,
  Check,
  X,
  Shuffle,
  Home,
} from 'lucide-react';
import { format, isSameDay, differenceInDays } from 'date-fns';
import type { RASResult } from '../../types';
import { CountdownTimer } from '../shared/CountdownTimer';

interface ResultCardProps {
  result: RASResult;
  onAccept: () => void;
  onDecline: () => void;
}

export function ResultCard({ result, onAccept, onDecline }: ResultCardProps) {
  const isWin = result.status === 'won';
  const isPending = result.acceptStatus === 'pending';
  const isAccepted = result.acceptStatus === 'accepted';
  const isDeclined = result.acceptStatus === 'declined';

  const datesChanged =
    result.matchedDates && !isSameDay(result.matchedDates.checkIn, result.originalCheckIn);

  const nights = result.matchedDates
    ? differenceInDays(result.matchedDates.checkOut, result.matchedDates.checkIn)
    : differenceInDays(result.originalCheckOut, result.originalCheckIn);

  return (
    <div
      className={`relative bg-white rounded-2xl overflow-hidden card-shadow transition-premium ${
        isWin ? 'ring-2 ring-gold' : ''
      }`}
    >
      {/* Win/Lost banner */}
      <div
        className={`absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full font-medium text-sm flex items-center gap-1.5 ${
          isWin ? 'gold-gradient text-white' : 'bg-slate-100 text-slate-500'
        }`}
      >
        {isWin ? (
          <>
            <Trophy className="w-4 h-4" />
            You Won!
          </>
        ) : (
          'Not Selected'
        )}
      </div>

      {/* Rank / points invested badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
        <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-navy shadow-md">
          Your #{result.originalRank} choice
        </div>
        {result.pointsInvested != null && (
          <div className="px-3 py-1.5 bg-gold/20 backdrop-blur-sm rounded-full text-xs font-medium text-gold-dark shadow-md">
            {result.pointsInvested} pts
            {result.percentOfBudget != null ? ` (${result.percentOfBudget}% of budget)` : ''}
          </div>
        )}
      </div>

      {/* Image */}
      <div className="relative h-48">
        <img
          src={result.destination.imageUrl}
          alt={result.destination.name}
          className={`w-full h-full object-cover ${!isWin ? 'grayscale opacity-60' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Destination info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-serif text-2xl text-white font-semibold">
            {result.destination.name}
          </h3>
          <div className="flex items-center gap-1 text-white/80 text-sm mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{result.destination.region}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {isWin && result.matchedDates && (
          <>
            {/* Matched dates and unit */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold" />
                <div>
                  <p className="text-sm text-slate-500">Check-in</p>
                  <p className="font-semibold text-navy">
                    {format(result.matchedDates.checkIn, 'EEE, MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-gold" />
                <div>
                  <p className="text-sm text-slate-500">Stay</p>
                  <p className="font-semibold text-navy">{nights} nights</p>
                </div>
              </div>
            </div>

            {/* Unit info */}
            {result.unit && (
              <div className="mb-4 p-3 bg-slate-50 rounded-lg flex items-center gap-2">
                <Home className="w-5 h-5 text-gold" />
                <div>
                  <p className="font-medium text-navy">{result.unit.name}</p>
                  <p className="text-sm text-slate-500">
                    {result.unit.bedrooms} bedroom{result.unit.bedrooms !== 1 ? 's' : ''} · Sleeps {result.unit.sleeps}
                  </p>
                </div>
              </div>
            )}

            {/* Points invested (for wins) */}
            {result.pointsInvested != null && result.percentOfBudget != null && (
              <div className="mb-4 p-3 bg-gold/10 rounded-lg">
                <p className="text-sm text-navy-light">
                  You allocated <strong className="text-navy">{result.pointsInvested} points</strong>{' '}
                  ({result.percentOfBudget}% of your budget) to this request.
                </p>
              </div>
            )}

            {/* Flexible date match notice */}
            {datesChanged && (
              <div className="mb-4 p-3 bg-gold/10 rounded-lg flex items-start gap-2">
                <Shuffle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <p className="text-sm text-navy-light">
                  <strong className="text-navy">Dates adjusted:</strong> Your flexible dates option
                  allowed us to match you to{' '}
                  {format(result.matchedDates.checkIn, 'MMM d')} instead of your
                  originally requested {format(result.originalCheckIn, 'MMM d')}.
                </p>
              </div>
            )}

            {/* Accept/Decline actions or status */}
            {isPending ? (
              <div className="space-y-4">
                {/* Countdown */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-500">Time to respond:</span>
                  <CountdownTimer deadline={result.declineDeadline} size="md" />
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onDecline}
                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-600 rounded-xl font-medium transition-premium hover:bg-slate-50 hover:border-slate-300"
                  >
                    <X className="w-4 h-4" />
                    Decline
                  </button>
                  <button
                    onClick={onAccept}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-teal text-white rounded-xl font-medium transition-premium hover:bg-teal-light"
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </button>
                </div>
              </div>
            ) : isAccepted ? (
              <div className="p-4 bg-teal/10 rounded-lg flex items-center gap-3">
                <Check className="w-5 h-5 text-teal" />
                <div>
                  <p className="font-medium text-teal">Reservation Confirmed</p>
                  <p className="text-sm text-slate-500">
                    Accepted on {format(result.acceptedAt!, 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            ) : isDeclined ? (
              <div className="p-4 bg-slate-100 rounded-lg flex items-center gap-3">
                <X className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-600">Declined</p>
                  <p className="text-sm text-slate-500">
                    This reservation was released back to the secondary lottery.
                  </p>
                </div>
              </div>
            ) : null}
          </>
        )}

        {/* Lost state */}
        {!isWin && (
          <div className="text-center py-4">
            {result.pointsInvested != null && (
              <p className="text-sm text-slate-500 mb-2">
                You allocated {result.pointsInvested} points
                {result.percentOfBudget != null ? ` (${result.percentOfBudget}% of budget)` : ''}.
              </p>
            )}
            <p className="text-slate-500">
              This destination was not available for your requested dates. Better luck next quarter!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
