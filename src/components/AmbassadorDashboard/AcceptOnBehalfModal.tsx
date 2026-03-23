import { useState, useEffect, useMemo } from 'react';
import { X, CheckCircle2, Loader2, Trophy, Clock, Shield } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import type { ManagedMember, RASResult } from '../../types';

export interface AcceptOnBehalfModalProps {
  member: ManagedMember;
  open: boolean;
  onClose: () => void;
  onAcceptSuccess: (updated: ManagedMember) => void;
}

export function AcceptOnBehalfModal({ member, open, onClose, onAcceptSuccess }: AcceptOnBehalfModalProps) {
  const [confirmAuth, setConfirmAuth] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const pendingWins = useMemo(
    () => member.results.filter((r) => r.status === 'won' && r.acceptStatus === 'pending'),
    [member.results]
  );

  useEffect(() => {
    if (!open) return;
    setConfirmAuth(false);
    setIsSubmitting(false);
    setDone(false);
  }, [open, member.user.id]);

  if (!open) return null;

  const handleConfirm = () => {
    if (!confirmAuth || pendingWins.length === 0) return;
    setIsSubmitting(true);
    const now = new Date();
    window.setTimeout(() => {
      const acceptedIds = new Set(pendingWins.map((w) => w.id));
      const results: RASResult[] = member.results.map((r) =>
        acceptedIds.has(r.id) && r.status === 'won'
          ? { ...r, acceptStatus: 'accepted' as const, acceptedAt: now }
          : r
      );
      onAcceptSuccess({
        ...member,
        results,
        lastActivity: now,
      });
      setIsSubmitting(false);
      setDone(true);
    }, 800);
  };

  const resetAndClose = () => {
    setConfirmAuth(false);
    setDone(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 sm:p-6">
      <button type="button" className="absolute inset-0 bg-navy/40 backdrop-blur-sm" aria-label="Close" onClick={resetAndClose} />
      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl"
        style={{ background: 'var(--er-white)', border: '1px solid var(--er-gray-200)' }}
        role="dialog"
        aria-labelledby="accept-behalf-title"
      >
        <div className="flex items-start justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--er-gray-100)' }}>
          <div>
            <p className="label-caps mb-1" style={{ color: 'var(--color-teal)' }}>
              Accept reservation{pendingWins.length !== 1 ? 's' : ''}
            </p>
            <h2
              id="accept-behalf-title"
              style={{
                fontFamily: 'var(--er-font-serif)',
                fontWeight: 400,
                fontSize: '1.25rem',
                color: 'var(--er-slate-800)',
                margin: 0,
              }}
            >
              {done ? 'Accepted' : `On behalf of ${member.user.name}`}
            </h2>
          </div>
          <button type="button" onClick={resetAndClose} className="p-2 rounded-lg hover:bg-gray-100" style={{ color: 'var(--er-gray-400)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          {done ? (
            <div className="text-center py-2">
              <div
                className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full"
                style={{ background: 'rgba(27,102,117,0.1)' }}
              >
                <CheckCircle2 className="w-8 h-8" style={{ color: 'var(--color-teal)' }} />
              </div>
              <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.9375rem', color: 'var(--er-gray-700)', lineHeight: 1.6, margin: 0 }}>
                Win{pendingWins.length !== 1 ? 's are' : ' is'} now marked <strong>Accepted</strong>. The member will receive a booking confirmation
                summary.
              </p>
            </div>
          ) : (
            <>
              <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', color: 'var(--er-gray-600)', lineHeight: 1.6, marginTop: 0 }}>
                Confirming accepts the assigned unit and dates on the member’s behalf, subject to your club’s ambassador policy.
              </p>

              <div className="mt-4 space-y-2">
                {pendingWins.map((w) => (
                  <PendingWinCard key={w.id} result={w} />
                ))}
              </div>

              <label className="flex items-start gap-3 cursor-pointer mt-5">
                <input type="checkbox" checked={confirmAuth} onChange={(e) => setConfirmAuth(e.target.checked)} className="mt-1" />
                <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-700)', lineHeight: 1.5 }}>
                  The member has asked me to accept these wins, or I have reached them by phone/email per policy.
                </span>
              </label>

              <div className="flex items-start gap-2 mt-4 p-3 rounded-lg" style={{ background: 'rgba(0, 71, 80, 0.06)' }}>
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#004750' }} />
                <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-600)', margin: 0, lineHeight: 1.5 }}>
                  Acceptance is logged to the member record. AR token usage applies as shown on each win.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end" style={{ borderTop: '1px solid var(--er-gray-100)', background: 'var(--er-gray-50)' }}>
          {done ? (
            <button
              type="button"
              onClick={resetAndClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium"
              style={{
                fontFamily: 'var(--er-font-sans)',
                fontSize: '0.875rem',
                background: 'var(--color-teal)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={resetAndClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl"
                style={{
                  fontFamily: 'var(--er-font-sans)',
                  fontSize: '0.875rem',
                  background: 'transparent',
                  color: 'var(--er-gray-600)',
                  border: '1px solid var(--er-gray-200)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!confirmAuth || isSubmitting}
                onClick={handleConfirm}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium inline-flex items-center justify-center gap-2 disabled:opacity-45 disabled:cursor-not-allowed"
                style={{
                  fontFamily: 'var(--er-font-sans)',
                  fontSize: '0.875rem',
                  background: 'var(--color-teal)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Confirming…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm acceptance
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PendingWinCard({ result }: { result: RASResult }) {
  const nights =
    result.matchedDates != null
      ? differenceInDays(result.matchedDates.checkOut, result.matchedDates.checkIn)
      : differenceInDays(result.originalCheckOut, result.originalCheckIn);

  return (
    <div
      className="flex gap-3 p-3 rounded-xl"
      style={{ background: 'rgba(201,169,110,0.07)', border: '1px solid rgba(201,169,110,0.2)' }}
    >
      <div
        className="w-9 h-9 flex items-center justify-center flex-shrink-0 rounded-lg"
        style={{ background: 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))' }}
      >
        <Trophy className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ fontFamily: 'var(--er-font-serif)', fontWeight: 400, fontSize: '0.9375rem', color: 'var(--er-slate-800)', margin: 0 }}>
          {result.destination.name}
        </p>
        {result.matchedDates && (
          <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-600)', marginTop: 4 }}>
            {format(result.matchedDates.checkIn, 'MMM d')} – {format(result.matchedDates.checkOut, 'MMM d')} · {nights} nights
          </p>
        )}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span
            className="inline-flex items-center gap-1"
            style={{
              fontFamily: 'var(--er-font-sans)',
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: 'rgb(180,83,9)',
              background: 'rgba(180,83,9,0.08)',
              borderRadius: 'var(--er-radius-full)',
              padding: '2px 8px',
            }}
          >
            <Clock className="w-3 h-3" />
            Respond by {format(result.declineDeadline, 'MMM d')}
          </span>
          {result.arTokensUsed > 0 && (
            <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.6875rem', color: 'var(--er-gray-500)' }}>
              {result.arTokensUsed} AR token{result.arTokensUsed !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
