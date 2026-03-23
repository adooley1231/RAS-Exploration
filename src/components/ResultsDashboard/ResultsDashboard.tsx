import { useState, useEffect } from 'react';
import { Trophy, Compass, RefreshCw, Gift, Clock, Bell, Check, AlertCircle } from 'lucide-react';
import { format, differenceInSeconds } from 'date-fns';
import { useRAS } from '../../context/RASContext';
import { ResultCard } from './ResultCard';
import { destinations } from '../../data/mockData';

export function ResultsDashboard() {
  const { state, acceptResult, declineResult, setView, reset, openAnnotationCallout } = useRAS();
  const { results, user } = state;

  const destMap = Object.fromEntries(destinations.map((d) => [d.id, d]));

  // Waitlist state
  const [waitlistOptIns, setWaitlistOptIns] = useState<Set<string>>(new Set());
  const [confirmedWaitlist, setConfirmedWaitlist] = useState<Set<string>>(new Set());
  const [showToast, setShowToast] = useState(false);

  const handleToggleWaitlist = (id: string, checked: boolean) => {
    setWaitlistOptIns((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const handleSubmitWaitlist = () => {
    openAnnotationCallout('member-waitlist-submit');
    setConfirmedWaitlist((prev) => new Set([...prev, ...waitlistOptIns]));
    setWaitlistOptIns(new Set());
    setShowToast(true);
  };

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 4000);
    return () => clearTimeout(t);
  }, [showToast]);

  // Shared deadline — use the first result's declineDeadline
  const sharedDeadline = results.find((r) => r.declineDeadline)?.declineDeadline ?? null;
  const [secondsLeft, setSecondsLeft] = useState<number>(
    sharedDeadline ? differenceInSeconds(sharedDeadline, new Date()) : 0
  );
  useEffect(() => {
    if (!sharedDeadline) return;
    const t = setInterval(() => {
      setSecondsLeft(differenceInSeconds(sharedDeadline, new Date()));
    }, 60000); // update every minute — days+hours only
    return () => clearInterval(t);
  }, [sharedDeadline]);
  const daysLeft = Math.floor(secondsLeft / 86400);
  const hoursLeft = Math.floor((secondsLeft % 86400) / 3600);

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

      {/* Response deadline banner */}
      {sharedDeadline && wins.some((r) => r.acceptStatus === 'pending') && (
        <div
          className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4"
          style={{
            background: 'var(--er-white)',
            border: '1px solid rgba(201,169,110,0.3)',
            borderRadius: 'var(--er-radius-xl)',
            boxShadow: '0 2px 12px rgba(201,169,110,0.08)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(201,169,110,0.1)', borderRadius: 'var(--er-radius-md)' }}
            >
              <AlertCircle className="w-4 h-4" style={{ color: 'var(--color-gold-dark)' }} />
            </div>
            <div>
              <p style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '0.875rem', color: 'var(--er-slate-800)' }}>
                Respond by {format(sharedDeadline, 'EEEE, MMMM d')}
              </p>
              <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-500)', marginTop: '1px' }}>
                Unreplied wins are automatically released after the deadline
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-2 flex-shrink-0 px-4 py-2"
            style={{ background: 'rgba(201,169,110,0.07)', borderRadius: 'var(--er-radius-lg)' }}
          >
            <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-gold-dark)' }} />
            <span className="tabular-nums" style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.9375rem', fontWeight: 500, color: 'var(--er-slate-800)' }}>
              {daysLeft > 0 && <><span>{daysLeft}</span><span style={{ fontWeight: 400, color: 'var(--er-gray-500)' }}>d </span></>}
              <span>{hoursLeft}</span><span style={{ fontWeight: 400, color: 'var(--er-gray-500)' }}>h</span>
            </span>
            <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-400)' }}>remaining</span>
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
                onAccept={() => {
                  openAnnotationCallout('member-results-accept');
                  acceptResult(result.id);
                }}
                onDecline={() => {
                  openAnnotationCallout('member-results-decline');
                  declineResult(result.id);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Losses section */}
      {losses.length > 0 && (
        <div className="mb-8">
          <div className="flex items-baseline justify-between mb-4">
            <h3 style={{
              fontFamily: 'var(--er-font-serif)',
              fontWeight: 300,
              fontSize: '1.375rem',
              color: 'var(--er-gray-400)',
              margin: 0,
              letterSpacing: '-0.01em',
            }}>
              Not Selected ({losses.length})
            </h3>
            {losses.some((r) => !confirmedWaitlist.has(r.id)) && (
              <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-400)' }}>
                Select destinations below to join the cancellation waitlist
              </p>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {losses.map((result) => (
              <ResultCard
                key={result.id}
                result={result}
                onAccept={() => {}}
                onDecline={() => {}}
                waitlistOptIn={waitlistOptIns.has(result.id)}
                onToggleWaitlist={handleToggleWaitlist}
                waitlistConfirmed={confirmedWaitlist.has(result.id)}
              />
            ))}
          </div>

          {/* Submit waitlist button */}
          {waitlistOptIns.size > 0 && (
            <div
              className="mt-6 flex items-center justify-between gap-4 px-5 py-4"
              style={{
                background: 'var(--er-white)',
                border: '1px solid rgba(27,102,117,0.25)',
                borderRadius: 'var(--er-radius-xl)',
                boxShadow: '0 4px 16px rgba(27,102,117,0.08)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(27,102,117,0.1)', borderRadius: 'var(--er-radius-md)' }}
                >
                  <Bell className="w-4 h-4" style={{ color: 'var(--color-teal)' }} />
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '0.875rem', color: 'var(--er-slate-800)' }}>
                    {waitlistOptIns.size} destination{waitlistOptIns.size !== 1 ? 's' : ''} selected
                  </p>
                  <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-500)' }}>
                    We'll notify you if a cancellation opens up
                  </p>
                </div>
              </div>
              <button
                onClick={handleSubmitWaitlist}
                className="flex items-center gap-2 transition-premium flex-shrink-0"
                style={{
                  padding: '10px 20px',
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
                Add to waitlist
              </button>
            </div>
          )}
        </div>
      )}

      {/* Win history */}
      {user.previousWins.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4" style={{ color: 'var(--er-gray-400)' }} />
            <h3 style={{
              fontFamily: 'var(--er-font-serif)',
              fontWeight: 300,
              fontSize: '1.375rem',
              color: 'var(--er-gray-500)',
              margin: 0,
              letterSpacing: '-0.01em',
            }}>
              Your Recent Wins
            </h3>
          </div>
          <div
            style={{
              background: 'var(--er-white)',
              border: '1px solid var(--er-gray-200)',
              borderRadius: 'var(--er-radius-xl)',
              overflow: 'hidden',
            }}
          >
            {user.previousWins.map((win, i) => {
              const dest = destMap[win.destinationId];
              return (
                <div
                  key={i}
                  className="flex items-center gap-4 px-5 py-4"
                  style={{ borderTop: i > 0 ? '1px solid var(--er-gray-100)' : 'none' }}
                >
                  {dest?.imageUrl && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={dest.imageUrl} alt={dest.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: 'var(--er-font-serif)', fontWeight: 300, fontSize: '1rem', color: 'var(--er-slate-800)', letterSpacing: '-0.01em' }}>
                      {dest?.name ?? win.destinationId}
                    </p>
                    <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-400)', marginTop: '2px' }}>
                      {format(win.date, 'MMMM yyyy')}
                    </p>
                  </div>
                  <div
                    className="flex-shrink-0 px-2.5 py-1"
                    style={{
                      background: 'rgba(201,169,110,0.1)',
                      borderRadius: 'var(--er-radius-full)',
                      fontFamily: 'var(--er-font-sans)',
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      color: 'var(--color-gold-dark)',
                      letterSpacing: '0.03em',
                    }}
                  >
                    {win.quarterAgo === 0 ? 'This quarter' : win.quarterAgo === 1 ? 'Last quarter' : `${win.quarterAgo}Q ago`}
                  </div>
                </div>
              );
            })}
          </div>
          <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-400)', marginTop: '0.75rem', textAlign: 'center' }}>
            Your win history helps ensure fair access across the member pool.
          </p>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 transition-all"
          style={{
            background: 'var(--er-slate-800)',
            borderRadius: 'var(--er-radius-xl)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            minWidth: '260px',
          }}
        >
          <div
            className="w-7 h-7 flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--color-teal)', borderRadius: 'var(--er-radius-full)' }}
          >
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '0.875rem', color: '#fff' }}>
              Waitlist updated
            </p>
            <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '1px' }}>
              We'll notify you if a cancellation opens up
            </p>
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
