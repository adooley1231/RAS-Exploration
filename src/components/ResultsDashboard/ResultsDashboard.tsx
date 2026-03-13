import { Trophy, Compass, RefreshCw, Gift } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto px-6 py-10">
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
          Your Results
        </h2>
        <p className="mt-2" style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', color: 'var(--er-gray-500)' }}>
          Q2 2025 Vacation Lottery Results
        </p>
      </div>

      {/* Summary banner */}
      <div
        className="mb-8 p-6"
        style={{
          background: 'var(--er-white)',
          border: '1px solid var(--er-gray-200)',
          borderRadius: 'var(--er-radius-xl)',
          boxShadow: 'var(--er-shadow-sm)',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 flex items-center justify-center"
                style={{
                  background: wins.length > 0
                    ? 'linear-gradient(135deg, var(--color-gold-dark) 0%, var(--color-gold) 100%)'
                    : 'var(--er-gray-100)',
                  borderRadius: 'var(--er-radius-sm)',
                }}
              >
                {wins.length > 0 ? (
                  <Trophy className="w-6 h-6 text-white" />
                ) : (
                  <Compass className="w-6 h-6" style={{ color: 'var(--er-gray-400)' }} />
                )}
              </div>
              <div>
                <p
                  className="tabular-nums"
                  style={{ fontFamily: 'var(--er-font-sans)', fontSize: '1.75rem', fontWeight: 300, color: 'var(--er-slate-800)', lineHeight: 1 }}
                >
                  {wins.length}
                </p>
                <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-500)' }}>
                  Win{wins.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {pendingWins.length > 0 && (
              <div className="pl-8" style={{ borderLeft: '1px solid var(--er-gray-200)' }}>
                <p
                  className="tabular-nums"
                  style={{ fontFamily: 'var(--er-font-sans)', fontSize: '1.75rem', fontWeight: 300, color: 'var(--color-amber)', lineHeight: 1 }}
                >
                  {pendingWins.length}
                </p>
                <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-500)' }}>Pending response</p>
              </div>
            )}

            {acceptedWins.length > 0 && (
              <div className="pl-8" style={{ borderLeft: '1px solid var(--er-gray-200)' }}>
                <p
                  className="tabular-nums"
                  style={{ fontFamily: 'var(--er-font-sans)', fontSize: '1.75rem', fontWeight: 300, color: 'var(--color-teal)', lineHeight: 1 }}
                >
                  {acceptedWins.length}
                </p>
                <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-500)' }}>Confirmed</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* No wins state */}
      {hasNoWins && (
        <div
          className="text-center py-16 mb-8"
          style={{
            background: 'var(--er-white)',
            border: '1px solid var(--er-gray-200)',
            borderRadius: 'var(--er-radius-xl)',
            boxShadow: 'var(--er-shadow-sm)',
          }}
        >
          <div
            className="w-20 h-20 mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'rgba(201,169,110,0.08)', borderRadius: 'var(--er-radius-sm)', border: '1px solid rgba(201,169,110,0.2)' }}
          >
            <Compass className="w-10 h-10" style={{ color: 'var(--color-gold)' }} />
          </div>
          <h3 style={{
            fontFamily: 'var(--er-font-serif)',
            fontWeight: 300,
            fontSize: '1.75rem',
            letterSpacing: '-0.01em',
            color: 'var(--er-slate-800)',
            marginBottom: '0.5rem',
          }}>
            Not This Quarter
          </h3>
          <p style={{ fontFamily: 'var(--er-font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: '1.0625rem', color: 'var(--er-gray-500)', maxWidth: '28rem', margin: '0 auto 2rem' }}>
            Your next great escape is still ahead of you.
          </p>
          <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', color: 'var(--er-gray-500)', maxWidth: '28rem', margin: '0 auto 2rem' }}>
            None of your requests were selected in the primary lottery — but you're automatically entered in the secondary lottery for any declined reservations.
          </p>

          <div
            className="max-w-md mx-auto p-4 flex items-start gap-3 text-left"
            style={{ background: 'rgba(201,169,110,0.07)', border: '1px solid rgba(201,169,110,0.18)', borderRadius: 'var(--er-radius-xl)' }}
          >
            <Gift className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <p style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '0.875rem', color: 'var(--er-slate-800)' }}>
                Secondary RAS Coming Soon
              </p>
              <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-500)', marginTop: '4px' }}>
                When other members decline their wins, those reservations return to the pool.
                You'll be notified if you're selected in the secondary lottery.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Wins section */}
      {wins.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-gold" />
            <h3 style={{
              fontFamily: 'var(--er-font-serif)',
              fontWeight: 300,
              fontSize: '1.375rem',
              color: 'var(--er-slate-800)',
              margin: 0,
              letterSpacing: '-0.01em',
            }}>
              Your Wins ({wins.length})
            </h3>
          </div>
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
          <h3 style={{
            fontFamily: 'var(--er-font-serif)',
            fontWeight: 300,
            fontSize: '1.375rem',
            color: 'var(--er-gray-400)',
            margin: '0 0 1rem',
            letterSpacing: '-0.01em',
          }}>
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
          className="flex items-center justify-center gap-2 transition-premium"
          style={{
            padding: '12px 24px',
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
          <RefreshCw className="w-4 h-4" />
          Start New Session
        </button>
        <button
          onClick={() => setView('browse-or-search')}
          className="flex items-center justify-center gap-2 transition-premium"
          style={{
            padding: '12px 24px',
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
          Try Request Flow Again
        </button>
      </div>
    </div>
  );
}
