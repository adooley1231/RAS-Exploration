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
  const { state, setView, submitRequests, setTokensToUse } = useRAS();
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
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    submitRequests();
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-teal/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-teal" />
        </div>
        <h2 className="font-serif text-3xl font-semibold text-navy mb-4">
          Requests Submitted Successfully!
        </h2>
        <p className="text-slate-500 mb-4">
          Your {requests.length} vacation request{requests.length > 1 ? 's have' : ' has'} been
          entered into the Q2 2025 lottery. You can win up to{' '}
          <strong className="text-navy">{tokensToUse}</strong> of your requests.
        </p>
        <p className="text-slate-500 mb-8">
          Results will be available on{' '}
          <strong className="text-navy">{format(rasRunDate, 'MMMM d, yyyy')}</strong>.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setView('results')}
            className="px-6 py-3 gold-gradient text-white rounded-xl font-medium transition-premium hover:opacity-90"
          >
            View Demo Results
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white border border-slate-200 text-navy rounded-xl font-medium transition-premium hover:bg-slate-50"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-semibold text-navy">Review & Submit</h2>
        <p className="text-slate-500 mt-2">
          Review your points allocation and requests before submitting to the lottery.
        </p>
      </div>

      {/* Points strategy summary */}
      {totalPoints > 0 && (
        <div className="mb-8 p-6 bg-white rounded-2xl card-shadow">
          <h3 className="font-serif text-lg font-semibold text-navy mb-4">Points allocation</h3>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-navy tabular-nums">{pointsAllocated}</span>
              <span className="text-slate-500">of {totalPoints} points allocated</span>
            </div>
            {pointsAllocated < totalPoints && (
              <span className="text-sm text-slate-500">
                {totalPoints - pointsAllocated} points unused (optional)
              </span>
            )}
          </div>
          {topRequest && topPercent >= 30 && (
            <p className="text-sm text-navy-light">
              You’re heavily prioritizing{' '}
              <strong className="text-navy">{topRequest.destination.name}</strong> (
              {topPercent}% of your points).
            </p>
          )}
          {/* Simple bar: relative weight of each request */}
          <div className="mt-4 space-y-2">
            {requests.map((req) => {
              const pct = totalPoints > 0 ? (req.pointsAllocated / totalPoints) * 100 : 0;
              return (
                <div key={req.id} className="flex items-center gap-3">
                  <div className="w-32 text-sm text-slate-600 truncate">
                    {req.destination.name}
                  </div>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full gold-gradient rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-sm font-medium text-navy tabular-nums">
                    {req.pointsAllocated} pts
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Request summary */}
        <div className="lg:col-span-2 space-y-4">
          {requests.map((request, index) => {
            const trvr = calculateTRVR(user, request.destination.id);
            const wishListBoost = getWishListBoost(user, request.destination.id);
            const isDuplicate = duplicateIds.has(request.destination.id);
            const nights = getNights(request.checkInDate, request.checkOutDate);

            return (
              <div key={request.id} className="bg-white rounded-xl overflow-hidden card-shadow">
                <div className="flex">
                  {/* Rank + points */}
                  <div className="flex-shrink-0 w-16 bg-navy flex flex-col items-center justify-center py-2">
                    <span className="text-xl font-bold text-white">#{index + 1}</span>
                    <span className="text-xs text-gold mt-0.5 tabular-nums">
                      {request.pointsAllocated} pts
                    </span>
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
                        <h3 className="font-serif text-lg font-semibold text-navy">
                          {request.destination.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{request.destination.region}</span>
                        </div>
                      </div>
                      <BoostIndicator
                        trvr={trvr}
                        wishListBoost={wishListBoost}
                        ultraBoost={user.memberType === 'ultra'}
                        compact
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-navy-light">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gold" />
                        <span>{formatDateRange(request.checkInDate, request.checkOutDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Moon className="w-4 h-4 text-gold" />
                        <span>{nights} nights</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mt-1 text-sm text-navy-light">
                      <Home className="w-4 h-4 text-gold" />
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
                      {isDuplicate && request.limitToOneWin && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber/10 text-amber text-xs rounded-full">
                          Limit to 1 win
                        </span>
                      )}
                    </div>

                    {request.notes && (
                      <p className="mt-2 text-sm text-slate-500 italic">"{request.notes}"</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 card-shadow sticky top-24">
            <h3 className="font-serif text-lg font-semibold text-navy mb-6">Summary</h3>

            {/* How many wins do you want? */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-gold" />
                <span className="font-medium text-navy">How many wins do you want?</span>
              </div>

              <p className="text-sm text-slate-500 mb-4">
                You can win up to this many of your requests in the lottery.
              </p>

              {/* Wins selector */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={() => setTokensToUse(Math.max(1, tokensToUse - 1))}
                  disabled={tokensToUse <= 1}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    tokensToUse <= 1
                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                      : 'bg-slate-100 text-navy hover:bg-slate-200'
                  }`}
                >
                  <Minus className="w-5 h-5" />
                </button>

                <div className="text-center">
                  <div className="text-4xl font-bold text-navy tabular-nums">{tokensToUse}</div>
                  <div className="text-sm text-slate-500">
                    {tokensToUse === 1 ? 'win' : 'wins'} max
                  </div>
                </div>

                <button
                  onClick={() => setTokensToUse(Math.min(user.arTokens, tokensToUse + 1))}
                  disabled={tokensToUse >= user.arTokens}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    tokensToUse >= user.arTokens
                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                      : 'bg-slate-100 text-navy hover:bg-slate-200'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {tokensToUse === 1 && requests.length > 1 && (
                <div className="flex items-start gap-2 mt-3 p-3 bg-gold/10 rounded-lg">
                  <Info className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-navy-light">
                    With 1 token, you can only win your highest-ranked available request. Your other requests serve as backups.
                  </p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="space-y-4 mb-6 pb-6 border-b border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Total requests</span>
                <span className="font-semibold text-navy">{requests.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Points allocated</span>
                <span className="font-semibold text-gold">{pointsAllocated} / {totalPoints}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Max wins</span>
                <span className="font-semibold text-navy">{tokensToUse}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Max possible wins</span>
                <span className="font-semibold text-navy">{Math.min(tokensToUse, maxWins)}</span>
              </div>
              {hasDuplicates && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Duplicate destinations</span>
                  <span className="font-semibold text-amber">{duplicateIds.size}</span>
                </div>
              )}
            </div>

            {/* RAS run date & acceptance deadline */}
            <div className="mb-6 p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                <Clock className="w-4 h-4" />
                <span>Lottery runs on</span>
              </div>
              <p className="font-semibold text-navy">{format(rasRunDate, 'EEEE, MMMM d, yyyy')}</p>
              <p className="text-sm text-slate-500">at 12:00 PM EST</p>
              <p className="text-xs text-slate-500 mt-2">
                You’ll have 48 hours to accept or decline any wins.
              </p>
            </div>

            {/* Submit button */}
            <button
              onClick={() => setIsConfirmOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-4 gold-gradient text-white rounded-xl font-medium transition-premium hover:opacity-90"
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
        className="mt-8 flex items-center gap-2 text-slate-500 hover:text-navy transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Allocate Points
      </button>

      {/* Confirmation modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full card-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-navy">Confirm Submission</h3>
            </div>
            <p className="text-slate-500 mb-4">
              You're about to submit {requests.length} vacation request
              {requests.length > 1 ? 's' : ''} to the Q2 2025 lottery.
            </p>
            <div className="p-3 bg-slate-50 rounded-lg mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500">Max wins requested:</span>
                <span className="font-semibold text-navy">{tokensToUse}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Possible wins:</span>
                <span className="font-semibold text-gold">{Math.min(tokensToUse, maxWins)}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              You won't be able to modify your requests after submission.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsConfirmOpen(false)}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-slate-100 text-navy rounded-xl font-medium transition-premium hover:bg-slate-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3 gold-gradient text-white rounded-xl font-medium transition-premium hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
