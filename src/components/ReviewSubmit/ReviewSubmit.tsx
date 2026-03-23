import { useState } from 'react';
import {
  ArrowLeft,
  Send,
  Calendar,
  MapPin,
  Moon,
  Shuffle,
  CalendarDays,
  CheckCircle2,
  Clock,
  AlertCircle,
  Home,
  Minus,
  Plus,
  Info,
  Trophy,
} from 'lucide-react';
import { format } from 'date-fns';
import { useRAS } from '../../context/RASContext';
import { BoostIndicator } from '../shared/BoostIndicator';
import {
  formatDateRange,
  calculateMaxWins,
  hasDuplicateDestinations,
  getDuplicateDestinationIds,
  calculateTRVR,
  getWishListBoost,
  getNights,
  formatUnitPreference,
  getMemberPoints,
  getPointsAllocated,
} from '../../utils/helpers';

export function ReviewSubmit() {
  const { state, setView, submitRequests, setTokensToUse, openAnnotationCallout } = useRAS();
  const { requests, user, rasRunDate, tokensToUse } = state;

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const maxWins = calculateMaxWins(user, requests);
  const hasDuplicates = hasDuplicateDestinations(requests);
  const duplicateIds = getDuplicateDestinationIds(requests);
  const totalPoints = getMemberPoints(user);
  const pointsAllocated = getPointsAllocated(requests);
  const topRequest = requests.length > 0
    ? requests.reduce((a, b) =>
        (a.pointsAllocated ?? 0) >= (b.pointsAllocated ?? 0) ? a : b
      )
    : null;
  const topPercent =
    topRequest && totalPoints > 0
      ? Math.round((topRequest.pointsAllocated / totalPoints) * 100)
      : 0;

  const handleSubmit = async () => {
    openAnnotationCallout('member-confirm-submit');
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    submitRequests();
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div
          className="w-20 h-20 mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'rgba(43,142,115,0.08)', borderRadius: '50%' }}
        >
          <CheckCircle2 className="w-10 h-10 text-teal" />
        </div>
        <h2 style={{
          fontFamily: 'var(--er-font-serif)',
          fontWeight: 300,
          fontSize: '2rem',
          letterSpacing: '-0.02em',
          color: 'var(--er-slate-800)',
          marginBottom: '1rem',
        }}>
          Requests Submitted
        </h2>
        <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.9375rem', color: 'var(--er-gray-500)', marginBottom: '0.75rem' }}>
          Your {requests.length} vacation request{requests.length > 1 ? 's have' : ' has'} been
          entered into the Q2 2025 lottery. You can win up to{' '}
          <strong style={{ color: 'var(--er-slate-800)', fontWeight: 500 }}>{tokensToUse}</strong> of your requests.
        </p>
        <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.9375rem', color: 'var(--er-gray-500)', marginBottom: '2.5rem' }}>
          Results will be available on{' '}
          <strong style={{ color: 'var(--er-slate-800)', fontWeight: 500 }}>{format(rasRunDate, 'MMMM d, yyyy')}</strong>.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setView('results')}
            style={{
              padding: '14px 24px',
              background: 'linear-gradient(135deg, var(--color-gold-dark) 0%, var(--color-gold) 100%)',
              color: '#fff',
              borderRadius: 'var(--er-radius-xl)',
              fontFamily: 'var(--er-font-sans)',
              fontSize: '0.875rem',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            View Demo Results
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '14px 24px',
              background: 'var(--er-white)',
              border: '1px solid var(--er-gray-200)',
              color: 'var(--er-slate-700)',
              borderRadius: 'var(--er-radius-xl)',
              fontFamily: 'var(--er-font-sans)',
              fontSize: '0.875rem',
              fontWeight: 400,
              cursor: 'pointer',
            }}
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
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
          Review & Submit
        </h2>
        <p className="mt-2" style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', color: 'var(--er-gray-500)' }}>
          Review your points allocation and requests before submitting to the lottery.
        </p>
      </div>

      {/* Points strategy summary */}
      {totalPoints > 0 && (
        <div
          className="mb-8 p-6"
          style={{
            background: 'var(--er-white)',
            border: '1px solid var(--er-gray-200)',
            borderRadius: 'var(--er-radius-xl)',
            boxShadow: 'var(--er-shadow-sm)',
          }}
        >
          <h3 style={{
            fontFamily: 'var(--er-font-serif)',
            fontWeight: 300,
            fontSize: '1.25rem',
            color: 'var(--er-slate-800)',
            marginBottom: '1rem',
          }}>
            Points allocation
          </h3>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span
                className="tabular-nums"
                style={{ fontFamily: 'var(--er-font-sans)', fontSize: '1.5rem', fontWeight: 500, color: 'var(--er-slate-800)' }}
              >
                {pointsAllocated}
              </span>
              <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', color: 'var(--er-gray-500)' }}>
                of {totalPoints} points allocated
              </span>
            </div>
            {pointsAllocated < totalPoints && (
              <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-500)' }}>
                {totalPoints - pointsAllocated} points unused (optional)
              </span>
            )}
          </div>
          {topRequest && topPercent >= 30 && (
            <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', color: 'var(--er-gray-600)' }}>
              You're heavily prioritizing{' '}
              <strong style={{ color: 'var(--er-slate-800)', fontWeight: 500 }}>{topRequest.destination.name}</strong>{' '}
              ({topPercent}% of your points).
            </p>
          )}
          {/* Points bars */}
          <div className="mt-4 space-y-2">
            {requests.map((req) => {
              const pct = totalPoints > 0 ? (req.pointsAllocated / totalPoints) * 100 : 0;
              return (
                <div key={req.id} className="flex items-center gap-3">
                  <div
                    className="flex-1 min-w-0 truncate"
                    style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-600)' }}
                  >
                    {req.destination.name}
                  </div>
                  <div
                    className="w-28 flex-shrink-0 overflow-hidden"
                    style={{ height: '4px', background: 'var(--er-gray-100)', borderRadius: '2px' }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: 'linear-gradient(to right, var(--color-gold-dark), var(--color-gold))',
                        borderRadius: '2px',
                        transition: 'width 0.3s',
                      }}
                    />
                  </div>
                  <span
                    className="flex-shrink-0 w-14 text-right tabular-nums"
                    style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', fontWeight: 500, color: req.pointsAllocated === 0 ? 'var(--er-gray-400)' : 'var(--color-gold-dark)' }}
                  >
                    {req.pointsAllocated} pts
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Request cards */}
        <div className="lg:col-span-2 space-y-4">
          {requests.map((request, index) => {
            const trvr = calculateTRVR(user, request.destination.id);
            const wishListBoost = getWishListBoost(user, request.destination.id);
            const isDuplicate = duplicateIds.has(request.destination.id);
            const nights = getNights(request.checkInDate, request.checkOutDate);

            return (
              <div
                key={request.id}
                style={{
                  background: 'var(--er-white)',
                  borderRadius: 'var(--er-radius-xl)',
                  overflow: 'hidden',
                  border: '1px solid var(--er-gray-200)',
                  boxShadow: 'var(--er-shadow-sm)',
                }}
              >
                <div className="flex">
                  {/* Rank + points strip */}
                  <div
                    className="flex-shrink-0 w-16 flex flex-col items-center justify-center py-3 gap-1"
                    style={{ background: 'var(--er-slate-800)' }}
                  >
                    <div
                      className="tabular-nums"
                      style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}
                    >
                      #{index + 1}
                    </div>
                    <div
                      className="tabular-nums"
                      style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '1rem', color: 'var(--color-gold)', lineHeight: 1 }}
                    >
                      {request.pointsAllocated}
                    </div>
                    <div style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.625rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      pts
                    </div>
                  </div>

                  {/* Image */}
                  <div className="flex-shrink-0 w-28 h-32 relative">
                    <img
                      src={request.destination.imageUrl}
                      alt={request.destination.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 style={{
                          fontFamily: 'var(--er-font-serif)',
                          fontWeight: 300,
                          fontSize: '1.125rem',
                          color: 'var(--er-slate-800)',
                          margin: 0,
                          letterSpacing: '-0.01em',
                        }}>
                          {request.destination.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--er-gray-400)' }} />
                          <span className="label-caps" style={{ color: 'var(--er-gray-400)', letterSpacing: '0.09em' }}>
                            {request.destination.region}
                          </span>
                        </div>
                      </div>
                      <BoostIndicator
                        trvr={trvr}
                        wishListBoost={wishListBoost}
                        ultraBoost={user.memberType === 'ultra'}
                        compact
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 flex-shrink-0 text-gold" />
                        <span style={{ fontFamily: 'var(--er-font-sans)', color: 'var(--er-gray-600)' }}>
                          {formatDateRange(request.checkInDate, request.checkOutDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Moon className="w-4 h-4 flex-shrink-0 text-gold" />
                        <span style={{ fontFamily: 'var(--er-font-sans)', color: 'var(--er-gray-600)' }}>
                          {nights} nights
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mt-1">
                      <Home className="w-4 h-4 flex-shrink-0 text-gold" />
                      <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', color: 'var(--er-gray-600)' }}>
                        {formatUnitPreference(request)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {request.flexibleDates && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs"
                          style={{ background: 'var(--er-gray-50)', color: 'var(--er-gray-600)', borderRadius: 'var(--er-radius-full)', border: '1px solid var(--er-gray-200)' }}
                        >
                          <Shuffle className="w-3 h-3" />
                          ±2 days
                        </span>
                      )}
                      {request.mustIncludeWeekend && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs"
                          style={{ background: 'var(--er-gray-50)', color: 'var(--er-gray-600)', borderRadius: 'var(--er-radius-full)', border: '1px solid var(--er-gray-200)' }}
                        >
                          <CalendarDays className="w-3 h-3" />
                          Weekend
                        </span>
                      )}
                      {isDuplicate && request.limitToOneWin && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs"
                          style={{ background: 'rgba(217,119,6,0.06)', color: 'var(--color-amber)', borderRadius: 'var(--er-radius-full)' }}
                        >
                          Limit to 1 win
                        </span>
                      )}
                    </div>

                    {request.notes && (
                      <p
                        className="mt-2 italic"
                        style={{ fontFamily: 'var(--er-font-serif)', fontSize: '0.875rem', color: 'var(--er-gray-500)' }}
                      >
                        "{request.notes}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary sidebar */}
        <div className="lg:col-span-1">
          <div
            className="sticky top-24 p-6"
            style={{
              background: 'var(--er-white)',
              border: '1px solid var(--er-gray-200)',
              borderRadius: 'var(--er-radius-xl)',
              boxShadow: 'var(--er-shadow-sm)',
            }}
          >
            <h3 style={{
              fontFamily: 'var(--er-font-serif)',
              fontWeight: 300,
              fontSize: '1.25rem',
              color: 'var(--er-slate-800)',
              marginBottom: '1.5rem',
            }}>
              Summary
            </h3>

            {/* How many wins */}
            <div
              className="mb-6 pb-6"
              style={{ borderBottom: '1px solid var(--er-gray-100)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-gold" />
                <span style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '0.875rem', color: 'var(--er-slate-800)' }}>
                  How many wins do you want?
                </span>
              </div>

              <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-500)', marginBottom: '1rem' }}>
                You can win up to this many of your requests in the lottery.
              </p>

              {/* Wins selector */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={() => setTokensToUse(Math.max(1, tokensToUse - 1))}
                  disabled={tokensToUse <= 1}
                  className="w-9 h-9 flex items-center justify-center transition-colors"
                  style={{
                    background: tokensToUse <= 1 ? 'var(--er-gray-50)' : 'var(--er-gray-100)',
                    color: tokensToUse <= 1 ? 'var(--er-gray-300)' : 'var(--er-slate-700)',
                    borderRadius: 'var(--er-radius-sm)',
                    border: '1px solid var(--er-gray-200)',
                    cursor: tokensToUse <= 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <div
                    className="tabular-nums"
                    style={{ fontFamily: 'var(--er-font-sans)', fontSize: '2.5rem', fontWeight: 300, color: 'var(--er-slate-800)', lineHeight: 1 }}
                  >
                    {tokensToUse}
                  </div>
                  <div style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-400)', marginTop: '2px' }}>
                    {tokensToUse === 1 ? 'win' : 'wins'} max
                  </div>
                </div>

                <button
                  onClick={() => setTokensToUse(Math.min(user.arTokens, tokensToUse + 1))}
                  disabled={tokensToUse >= user.arTokens}
                  className="w-9 h-9 flex items-center justify-center transition-colors"
                  style={{
                    background: tokensToUse >= user.arTokens ? 'var(--er-gray-50)' : 'var(--er-gray-100)',
                    color: tokensToUse >= user.arTokens ? 'var(--er-gray-300)' : 'var(--er-slate-700)',
                    borderRadius: 'var(--er-radius-sm)',
                    border: '1px solid var(--er-gray-200)',
                    cursor: tokensToUse >= user.arTokens ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {tokensToUse === 1 && requests.length > 1 && (
                <div
                  className="flex items-start gap-2 mt-3 p-3"
                  style={{ background: 'rgba(201,169,110,0.07)', borderRadius: 'var(--er-radius-md)', border: '1px solid rgba(201,169,110,0.18)' }}
                >
                  <Info className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-600)' }}>
                    With this setting, you can only win your highest-ranked available request. Your other requests serve as backups.
                  </p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div
              className="space-y-3 mb-6 pb-6"
              style={{ borderBottom: '1px solid var(--er-gray-100)' }}
            >
              {[
                { label: 'Total requests', value: requests.length, valueColor: 'var(--er-slate-800)' },
                { label: 'Points allocated', value: `${pointsAllocated} / ${totalPoints}`, valueColor: 'var(--color-gold-dark)' },
              ].map(({ label, value, valueColor }) => (
                <div key={label} className="flex justify-between items-baseline">
                  <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-500)' }}>{label}</span>
                  <span className="tabular-nums" style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', fontWeight: 500, color: valueColor }}>{value}</span>
                </div>
              ))}
              {hasDuplicates && (
                <div className="flex justify-between items-baseline">
                  <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-500)' }}>Duplicate destinations</span>
                  <span className="tabular-nums" style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-amber)' }}>{duplicateIds.size}</span>
                </div>
              )}
            </div>

            {/* Lottery date */}
            <div
              className="mb-6 p-4"
              style={{ background: 'var(--er-gray-50)', borderRadius: 'var(--er-radius-md)', border: '1px solid var(--er-gray-100)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3.5 h-3.5" style={{ color: 'var(--er-gray-400)' }} />
                <span className="label-caps" style={{ color: 'var(--er-gray-400)' }}>Lottery runs on</span>
              </div>
              <p style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '0.9375rem', color: 'var(--er-slate-800)' }}>
                {format(rasRunDate, 'EEEE, MMMM d, yyyy')}
              </p>
              <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-500)' }}>at 12:00 PM EST</p>
              <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-400)', marginTop: '6px' }}>
                You'll have 48 hours to accept or decline any wins.
              </p>
            </div>

            {/* Submit */}
            <button
              onClick={() => setIsConfirmOpen(true)}
              className="w-full flex items-center justify-center gap-2 transition-premium"
              style={{
                padding: '14px 16px',
                background: 'linear-gradient(135deg, var(--color-gold-dark) 0%, var(--color-gold) 100%)',
                color: '#fff',
                borderRadius: 'var(--er-radius-xl)',
                fontFamily: 'var(--er-font-sans)',
                fontSize: '0.9375rem',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Send className="w-4 h-4" />
              Submit to Lottery
            </button>
          </div>
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={() => setView('allocate-points')}
        className="mt-8 flex items-center gap-2 transition-colors"
        style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', color: 'var(--er-gray-400)', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Allocate Points
      </button>

      {/* Confirmation modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div
            className="max-w-md w-full p-8"
            style={{
              background: 'var(--er-white)',
              borderRadius: 'var(--er-radius-xl)',
              boxShadow: 'var(--er-shadow-xl)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{ background: 'rgba(201,169,110,0.1)', borderRadius: 'var(--er-radius-sm)' }}
              >
                <AlertCircle className="w-5 h-5 text-gold" />
              </div>
              <h3 style={{
                fontFamily: 'var(--er-font-serif)',
                fontWeight: 300,
                fontSize: '1.375rem',
                color: 'var(--er-slate-800)',
                margin: 0,
              }}>
                Confirm Submission
              </h3>
            </div>
            <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', color: 'var(--er-gray-500)', marginBottom: '1rem' }}>
              You're about to submit {requests.length} vacation request
              {requests.length > 1 ? 's' : ''} to the Q2 2025 lottery.
            </p>
            <div
              className="p-4 mb-6"
              style={{ background: 'var(--er-gray-50)', borderRadius: 'var(--er-radius-md)', border: '1px solid var(--er-gray-100)' }}
            >
              <div className="flex justify-between mb-1.5">
                <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-500)' }}>Max wins requested:</span>
                <span className="tabular-nums" style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, color: 'var(--er-slate-800)' }}>{tokensToUse}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-500)' }}>Possible wins:</span>
                <span className="tabular-nums" style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, color: 'var(--color-gold-dark)' }}>{Math.min(tokensToUse, maxWins)}</span>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-400)', marginBottom: '1.5rem' }}>
              You won't be able to modify your requests after submission.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsConfirmOpen(false)}
                disabled={isSubmitting}
                className="flex-1 transition-premium"
                style={{
                  padding: '12px 16px',
                  background: 'var(--er-gray-50)',
                  border: '1px solid var(--er-gray-200)',
                  color: 'var(--er-slate-700)',
                  borderRadius: 'var(--er-radius-xl)',
                  fontFamily: 'var(--er-font-sans)',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.5 : 1,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 transition-premium"
                style={{
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, var(--color-gold-dark) 0%, var(--color-gold) 100%)',
                  color: '#fff',
                  borderRadius: 'var(--er-radius-xl)',
                  fontFamily: 'var(--er-font-sans)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? 'Submitting…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
