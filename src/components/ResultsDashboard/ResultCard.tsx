import {
  Trophy,
  MapPin,
  Calendar,
  Moon,
  Check,
  X,
  Shuffle,
  Home,
  Flame,
} from 'lucide-react';
import { format, isSameDay, differenceInDays } from 'date-fns';
import type { RASResult } from '../../types';
import { CountdownTimer } from '../shared/CountdownTimer';

interface ResultCardProps {
  result: RASResult;
  onAccept: () => void;
  onDecline: () => void;
  /** Controlled waitlist opt-in state — managed by parent */
  waitlistOptIn?: boolean;
  onToggleWaitlist?: (id: string, checked: boolean) => void;
  /** True after the parent has submitted the waitlist selection */
  waitlistConfirmed?: boolean;
}

export function ResultCard({ result, onAccept, onDecline, waitlistOptIn = false, onToggleWaitlist, waitlistConfirmed = false }: ResultCardProps) {
  const isWin = result.status === 'won';
  const isPending = result.acceptStatus === 'pending';
  const isAccepted = result.acceptStatus === 'accepted';
  const isDeclined = result.acceptStatus === 'declined';

  const isHighDemand = result.destination.demandTier === 'super-peak';

  const datesChanged =
    result.matchedDates && !isSameDay(result.matchedDates.checkIn, result.originalCheckIn);

  const nights = result.matchedDates
    ? differenceInDays(result.matchedDates.checkOut, result.matchedDates.checkIn)
    : differenceInDays(result.originalCheckOut, result.originalCheckIn);

  return (
    <div
      className="relative overflow-hidden transition-premium"
      style={{
        background: 'var(--er-white)',
        borderRadius: 'var(--er-radius-xl)',
        border: isWin ? '1.5px solid var(--color-gold)' : '1px solid var(--er-gray-200)',
        boxShadow: isWin ? 'var(--er-shadow-md)' : 'var(--er-shadow-sm)',
      }}
    >
      {/* Win/Lost badge */}
      <div
        className="absolute top-4 right-4 z-10 px-3 py-1.5 flex items-center gap-1.5"
        style={{
          background: isWin
            ? 'linear-gradient(135deg, var(--color-gold-dark) 0%, var(--color-gold) 100%)'
            : 'rgba(0,0,0,0.45)',
          color: '#fff',
          borderRadius: 'var(--er-radius-full)',
          fontFamily: 'var(--er-font-sans)',
          fontSize: '0.75rem',
          fontWeight: isWin ? 500 : 400,
          backdropFilter: 'blur(4px)',
        }}
      >
        {isWin ? (
          <>
            <Trophy className="w-3.5 h-3.5" />
            You Won
          </>
        ) : (
          'Not Selected'
        )}
      </div>

      {/* Rank badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
        <div
          className="px-2.5 py-1"
          style={{
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(4px)',
            borderRadius: 'var(--er-radius-full)',
            fontFamily: 'var(--er-font-sans)',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'var(--er-slate-800)',
          }}
        >
          #{result.originalRank} choice
        </div>
        {result.pointsInvested != null && (
          <div
            className="px-2.5 py-1"
            style={{
              background: 'rgba(201,169,110,0.18)',
              backdropFilter: 'blur(4px)',
              borderRadius: 'var(--er-radius-full)',
              fontFamily: 'var(--er-font-sans)',
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: 'var(--color-gold-dark)',
            }}
          >
            {result.pointsInvested} pts
            {result.percentOfBudget != null ? ` · ${result.percentOfBudget}%` : ''}
          </div>
        )}
      </div>

      {/* Image */}
      <div className="relative h-48">
        <img
          src={result.destination.imageUrl}
          alt={result.destination.name}
          className="w-full h-full object-cover"
          style={{ filter: !isWin ? 'grayscale(100%) brightness(0.65)' : undefined }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)' }} />

        {/* Destination overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 style={{
            fontFamily: 'var(--er-font-serif)',
            fontWeight: 300,
            fontSize: '1.625rem',
            color: '#fff',
            margin: 0,
            letterSpacing: '-0.01em',
          }}>
            {result.destination.name}
          </h3>
          <div className="flex items-center gap-1 mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <MapPin className="w-3 h-3" />
            <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem' }}>
              {result.destination.region}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {isWin && result.matchedDates && (
          <>
            {/* High-demand win callout */}
            {isHighDemand && (
              <div
                className="mb-4 p-3 flex items-start gap-2"
                style={{ background: 'rgba(194,65,12,0.07)', borderRadius: 'var(--er-radius-md)', border: '1px solid rgba(194,65,12,0.18)' }}
              >
                <Flame className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgb(194,65,12)' }} />
                <div>
                  <p style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '0.875rem', color: 'rgb(154,52,18)' }}>
                    Highly sought-after reservation
                  </p>
                  <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-600)', marginTop: '2px' }}>
                    This is one of our most requested destinations — congratulations on securing it.
                  </p>
                </div>
              </div>
            )}

            {/* Dates and stay */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" />
                <div>
                  <p className="label-caps" style={{ color: 'var(--er-gray-400)' }}>Check-in</p>
                  <p style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '0.875rem', color: 'var(--er-slate-800)' }}>
                    {format(result.matchedDates.checkIn, 'EEE, MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-gold" />
                <div>
                  <p className="label-caps" style={{ color: 'var(--er-gray-400)' }}>Stay</p>
                  <p style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '0.875rem', color: 'var(--er-slate-800)' }}>
                    {nights} nights
                  </p>
                </div>
              </div>
            </div>

            {/* Unit info */}
            {result.unit && (
              <div
                className="mb-4 p-3 flex items-center gap-2"
                style={{ background: 'var(--er-gray-50)', borderRadius: 'var(--er-radius-md)', border: '1px solid var(--er-gray-100)' }}
              >
                <Home className="w-4 h-4 text-gold" />
                <div>
                  <p style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '0.875rem', color: 'var(--er-slate-800)' }}>
                    {result.unit.name}
                  </p>
                  <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-500)' }}>
                    {result.unit.bedrooms} bedroom{result.unit.bedrooms !== 1 ? 's' : ''} · Sleeps {result.unit.sleeps}
                  </p>
                </div>
              </div>
            )}

            {/* Points note */}
            {result.pointsInvested != null && result.percentOfBudget != null && (
              <div
                className="mb-4 p-3"
                style={{ background: 'rgba(201,169,110,0.07)', borderRadius: 'var(--er-radius-md)', border: '1px solid rgba(201,169,110,0.15)' }}
              >
                <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-600)' }}>
                  You allocated{' '}
                  <strong style={{ color: 'var(--er-slate-800)', fontWeight: 500 }}>{result.pointsInvested} points</strong>{' '}
                  ({result.percentOfBudget}% of your budget) to this request.
                </p>
              </div>
            )}

            {/* Flexible date match */}
            {datesChanged && (
              <div
                className="mb-4 p-3 flex items-start gap-2"
                style={{ background: 'rgba(201,169,110,0.07)', borderRadius: 'var(--er-radius-md)', border: '1px solid rgba(201,169,110,0.15)' }}
              >
                <Shuffle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-600)' }}>
                  <strong style={{ color: 'var(--er-slate-800)', fontWeight: 500 }}>Dates adjusted:</strong>{' '}
                  Your flexible dates option allowed us to match you to{' '}
                  {format(result.matchedDates.checkIn, 'MMM d')} instead of your
                  originally requested {format(result.originalCheckIn, 'MMM d')}.
                </p>
              </div>
            )}

            {/* Accept/Decline or status */}
            {isPending ? (
              <div className="space-y-3">
                <div
                  className="flex items-center justify-between p-3"
                  style={{ background: 'var(--er-gray-50)', borderRadius: 'var(--er-radius-md)', border: '1px solid var(--er-gray-100)' }}
                >
                  <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-500)' }}>
                    Time to respond:
                  </span>
                  <CountdownTimer deadline={result.declineDeadline} size="md" />
                </div>
                <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-400)', textAlign: 'center' }}>
                  If you take no action, this reservation will be automatically released when the timer expires.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={onDecline}
                    className="flex-1 flex items-center justify-center gap-2 transition-premium"
                    style={{
                      padding: '12px 16px',
                      background: 'var(--er-white)',
                      border: '1px solid var(--er-gray-200)',
                      color: 'var(--er-gray-600)',
                      borderRadius: 'var(--er-radius-xl)',
                      fontFamily: 'var(--er-font-sans)',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      cursor: 'pointer',
                    }}
                  >
                    <X className="w-4 h-4" />
                    Decline
                  </button>
                  <button
                    onClick={onAccept}
                    className="flex-1 flex items-center justify-center gap-2 transition-premium"
                    style={{
                      padding: '12px 16px',
                      background: 'var(--color-teal)',
                      color: '#fff',
                      borderRadius: 'var(--er-radius-xl)',
                      fontFamily: 'var(--er-font-sans)',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </button>
                </div>
              </div>
            ) : isAccepted ? (
              <div
                className="p-4 flex items-center gap-3"
                style={{ background: 'rgba(43,142,115,0.07)', borderRadius: 'var(--er-radius-md)', border: '1px solid rgba(43,142,115,0.15)' }}
              >
                <Check className="w-5 h-5 text-teal" />
                <div>
                  <p style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '0.875rem', color: 'var(--color-teal)' }}>
                    Reservation Confirmed
                  </p>
                  <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-500)' }}>
                    Accepted on {format(result.acceptedAt!, 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            ) : isDeclined ? (
              <div
                className="p-4 flex items-center gap-3"
                style={{ background: 'var(--er-gray-50)', borderRadius: 'var(--er-radius-md)', border: '1px solid var(--er-gray-200)' }}
              >
                <X className="w-5 h-5" style={{ color: 'var(--er-gray-400)' }} />
                <div>
                  <p style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '0.875rem', color: 'var(--er-gray-600)' }}>
                    Declined
                  </p>
                  <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-500)' }}>
                    This reservation was released back to the secondary lottery.
                  </p>
                </div>
              </div>
            ) : null}
          </>
        )}

        {/* Lost state */}
        {!isWin && (
          <div className="py-3">
            {result.pointsInvested != null && (
              <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-500)', marginBottom: '0.5rem', textAlign: 'center' }}>
                You allocated {result.pointsInvested} points
                {result.percentOfBudget != null ? ` (${result.percentOfBudget}% of budget)` : ''}.
              </p>
            )}
            <p style={{ fontFamily: 'var(--er-font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: '0.9375rem', color: 'var(--er-gray-500)', textAlign: 'center', marginBottom: '1rem' }}>
              This destination was not available for your requested dates.
            </p>

            {/* Cancellation waitlist opt-in */}
            {waitlistConfirmed ? (
              <div
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(27,102,117,0.06)', border: '1px solid rgba(27,102,117,0.2)' }}
              >
                <div
                  className="w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0"
                  style={{ background: 'var(--color-teal)' }}
                >
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '0.8125rem', color: 'var(--color-teal)' }}>
                  On the cancellation waitlist
                </p>
              </div>
            ) : (
              <label
                className="flex items-start gap-3 cursor-pointer p-3 rounded-xl transition-all"
                style={{
                  background: waitlistOptIn ? 'rgba(27,102,117,0.06)' : 'var(--er-gray-50)',
                  border: waitlistOptIn ? '1px solid rgba(27,102,117,0.25)' : '1px solid var(--er-gray-200)',
                }}
              >
                <input
                  type="checkbox"
                  checked={waitlistOptIn}
                  onChange={(e) => onToggleWaitlist?.(result.id, e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded flex-shrink-0"
                  style={{ accentColor: 'var(--color-teal)' }}
                />
                <div>
                  <p style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '0.8125rem', color: 'var(--er-slate-800)' }}>
                    Cancellation waitlist
                  </p>
                  <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-500)', marginTop: '2px' }}>
                    Notify me if a spot opens at {result.destination.name}
                  </p>
                </div>
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
