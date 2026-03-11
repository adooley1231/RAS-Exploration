import { Trophy, Frown, RefreshCw, Gift } from 'lucide-react';
import { useRAS } from '../../context/RASContext';
import { ResultCard } from './ResultCard';

export function ResultsDashboard() {
  const { state, acceptResult, declineResult, setView, reset } = useRAS();
  const { results } = state;

  const wins = results.filter((r) => r.status === 'won');
  const losses = results.filter((r) => r.status === 'lost');
  const pendingWins = wins.filter((r) => r.acceptStatus === 'pending');
  const acceptedWins = wins.filter((r) => r.acceptStatus === 'accepted');

  const hasNoWins = wins.length === 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-semibold text-navy">Your Results</h2>
        <p className="text-slate-500 mt-2">Q2 2025 Vacation Lottery Results</p>
      </div>

      {/* Summary banner */}
      <div className="mb-8 p-6 bg-white rounded-2xl card-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Stats */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  wins.length > 0 ? 'gold-gradient' : 'bg-slate-100'
                }`}
              >
                {wins.length > 0 ? (
                  <Trophy className="w-6 h-6 text-white" />
                ) : (
                  <Frown className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-navy tabular-nums">{wins.length}</p>
                <p className="text-sm text-slate-500">Win{wins.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {pendingWins.length > 0 && (
              <div className="pl-8 border-l border-slate-200">
                <p className="text-2xl font-bold text-amber tabular-nums">{pendingWins.length}</p>
                <p className="text-sm text-slate-500">Pending response</p>
              </div>
            )}

            {acceptedWins.length > 0 && (
              <div className="pl-8 border-l border-slate-200">
                <p className="text-2xl font-bold text-teal tabular-nums">{acceptedWins.length}</p>
                <p className="text-sm text-slate-500">Confirmed</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* No wins state */}
      {hasNoWins && (
        <div className="text-center py-16 bg-white rounded-2xl card-shadow mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
            <Frown className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="font-serif text-2xl font-semibold text-navy mb-2">
            No Wins This Quarter
          </h3>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            Unfortunately, none of your requests were selected in the primary lottery. Don't
            worry—you're automatically entered in the secondary lottery for any declined
            reservations!
          </p>

          <div className="max-w-md mx-auto p-4 bg-gold/10 rounded-xl">
            <div className="flex items-start gap-3">
              <Gift className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-medium text-navy">Secondary RAS Coming Soon</p>
                <p className="text-sm text-slate-500 mt-1">
                  When other members decline their wins, those reservations return to the pool.
                  You'll be notified if you're selected in the secondary lottery.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wins section */}
      {wins.length > 0 && (
        <div className="mb-8">
          <h3 className="font-serif text-xl font-semibold text-navy mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gold" />
            Your Wins ({wins.length})
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {wins.map((result) => (
              <ResultCard
                key={result.id}
                result={result}
                onAccept={() => acceptResult(result.id)}
                onDecline={() => declineResult(result.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Losses section */}
      {losses.length > 0 && (
        <div className="mb-8">
          <h3 className="font-serif text-xl font-semibold text-slate-400 mb-4">
            Not Selected ({losses.length})
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {losses.map((result) => (
              <ResultCard
                key={result.id}
                result={result}
                onAccept={() => {}}
                onDecline={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
        <button
          onClick={reset}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-navy rounded-xl font-medium transition-premium hover:bg-slate-50"
        >
          <RefreshCw className="w-4 h-4" />
          Start New Session
        </button>
        <button
          onClick={() => setView('browse-or-search')}
          className="flex items-center justify-center gap-2 px-6 py-3 gold-gradient text-white rounded-xl font-medium transition-premium hover:opacity-90"
        >
          Try Request Flow Again
        </button>
      </div>
    </div>
  );
}
