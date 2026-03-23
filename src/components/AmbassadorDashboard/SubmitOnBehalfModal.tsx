import { useState, useMemo, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ClipboardCheck,
  Coins,
  ListOrdered,
  Shield,
} from 'lucide-react';
import type { ManagedMember, VacationRequest } from '../../types';

type Step = 'review' | 'confirm' | 'success';

export interface SubmitOnBehalfModalProps {
  member: ManagedMember;
  open: boolean;
  onClose: () => void;
  /** Called after simulated API success with updated member snapshot */
  onSubmitSuccess: (updated: ManagedMember) => void;
}

function getValidation(member: ManagedMember) {
  const total = member.requests.reduce((s, r) => s + r.pointsAllocated, 0);
  const hasRequests = member.requests.length > 0;
  const budgetFull = total === member.pointsBudget;
  const placeholderDates = member.requests.some((r) => r.isPlaceholderDates);
  /** Enough to open the confirm step (placeholders need extra checkbox there). */
  const canProceedToConfirm = hasRequests && budgetFull;
  return {
    total,
    hasRequests,
    budgetFull,
    placeholderDates,
    canProceedToConfirm,
  };
}

export function SubmitOnBehalfModal({ member, open, onClose, onSubmitSuccess }: SubmitOnBehalfModalProps) {
  const [step, setStep] = useState<Step>('review');
  const [confirmPolicy, setConfirmPolicy] = useState(false);
  const [confirmPlaceholder, setConfirmPlaceholder] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const v = useMemo(() => getValidation(member), [member]);

  useEffect(() => {
    if (!open) return;
    setStep('review');
    setConfirmPolicy(false);
    setConfirmPlaceholder(false);
    setIsSubmitting(false);
  }, [open, member.user.id]);

  if (!open) return null;

  const resetAndClose = () => {
    setStep('review');
    setConfirmPolicy(false);
    setConfirmPlaceholder(false);
    setIsSubmitting(false);
    onClose();
  };

  const handlePrimaryNext = () => {
    if (step === 'review') {
      if (!v.canProceedToConfirm) return;
      setStep('confirm');
      return;
    }
    if (step === 'confirm') {
      if (!confirmPolicy) return;
      if (v.placeholderDates && !confirmPlaceholder) return;
      setIsSubmitting(true);
      window.setTimeout(() => {
        const now = new Date();
        const requests: VacationRequest[] = member.requests.map((r) => ({
          ...r,
          submittedBy: 'ambassador',
        }));
        const updated: ManagedMember = {
          ...member,
          requests,
          rasStatus: 'submitted',
          lastActivity: now,
          lastSubmission: { at: now, by: 'ambassador' },
        };
        onSubmitSuccess(updated);
        setIsSubmitting(false);
        setStep('success');
      }, 900);
    }
  };

  const confirmStepDisabled =
    !confirmPolicy || (v.placeholderDates && !confirmPlaceholder) || isSubmitting;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={resetAndClose}
      />
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl"
        style={{
          background: 'var(--er-white)',
          border: '1px solid var(--er-gray-200)',
        }}
        role="dialog"
        aria-labelledby="submit-behalf-title"
      >
        <div
          className="flex items-start justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--er-gray-100)' }}
        >
          <div>
            <p className="label-caps mb-1" style={{ color: 'var(--color-gold-dark)' }}>
              Ambassador action
            </p>
            <h2
              id="submit-behalf-title"
              style={{
                fontFamily: 'var(--er-font-serif)',
                fontWeight: 400,
                fontSize: '1.25rem',
                color: 'var(--er-slate-800)',
                margin: 0,
              }}
            >
              {step === 'success' ? 'Submission complete' : `Submit for ${member.user.name}`}
            </h2>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100"
            style={{ color: 'var(--er-gray-400)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          {step === 'review' && (
            <>
              <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', color: 'var(--er-gray-600)', lineHeight: 1.6, marginTop: 0 }}>
                You’re about to finalize this member’s Q2 requests and enter them into the lottery. This matches what they would do on the
                member app — with your action recorded for audit.
              </p>

              <ul className="mt-5 space-y-3">
                <CheckRow
                  ok={v.hasRequests}
                  label="At least one vacation request"
                  detail={v.hasRequests ? `${member.requests.length} in list` : 'Add requests before submitting'}
                />
                <CheckRow
                  ok={v.budgetFull}
                  label="Full points budget allocated"
                  detail={
                    v.budgetFull
                      ? `${v.total} / ${member.pointsBudget} pts`
                      : `${v.total} / ${member.pointsBudget} pts — allocate remaining points`
                  }
                />
                <CheckRow
                  ok={!v.placeholderDates}
                  label="Real travel dates (no placeholders)"
                  detail={
                    v.placeholderDates
                      ? 'Some dates are placeholders — confirm in the next step'
                      : 'Dates look set for lottery processing'
                  }
                  warn={v.placeholderDates}
                />
              </ul>

              {!v.hasRequests && (
                <div
                  className="mt-4 flex gap-2 p-3 rounded-lg"
                  style={{ background: 'rgba(185,28,28,0.06)', border: '1px solid rgba(185,28,28,0.15)' }}
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgb(185,28,28)' }} />
                  <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'rgb(127,29,29)', margin: 0, lineHeight: 1.5 }}>
                    This member has no requests yet. Use <strong>Add request</strong> in production, or have them build a list in the member
                    experience first.
                  </p>
                </div>
              )}

              {v.hasRequests && !v.budgetFull && (
                <div
                  className="mt-4 flex gap-2 p-3 rounded-lg"
                  style={{ background: 'rgba(180,83,9,0.06)', border: '1px solid rgba(180,83,9,0.2)' }}
                >
                  <Coins className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgb(180,83,9)' }} />
                  <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'rgb(154,52,18)', margin: 0, lineHeight: 1.5 }}>
                    Every point in the member’s budget must be assigned across their ranked requests before the system can accept a submission.
                  </p>
                </div>
              )}
            </>
          )}

          {step === 'confirm' && (
            <>
              <div
                className="p-4 rounded-xl mb-4"
                style={{ background: 'var(--er-gray-50)', border: '1px solid var(--er-gray-200)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <ListOrdered className="w-4 h-4" style={{ color: 'var(--er-gray-500)' }} />
                  <span className="label-caps" style={{ color: 'var(--er-gray-500)' }}>
                    Summary
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', color: 'var(--er-slate-800)', margin: 0 }}>
                  <strong>{member.requests.length}</strong> ranked requests · <strong>{v.total}</strong> pts · Member:{' '}
                  <strong>{member.user.name}</strong>
                </p>
              </div>

              {v.placeholderDates && (
                <label className="flex items-start gap-3 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={confirmPlaceholder}
                    onChange={(e) => setConfirmPlaceholder(e.target.checked)}
                    className="mt-1"
                  />
                  <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-700)', lineHeight: 1.5 }}>
                    I understand some dates are still placeholders. The member has confirmed these windows or will update them with club
                    services before the lottery lock.
                  </span>
                </label>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmPolicy}
                  onChange={(e) => setConfirmPolicy(e.target.checked)}
                  className="mt-1"
                />
                <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-700)', lineHeight: 1.5 }}>
                  I confirm this member has authorized me to submit their RAS requests for this release, and I’ve reviewed rank and point
                  allocation for accuracy.
                </span>
              </label>

              <div className="flex items-start gap-2 mt-4 p-3 rounded-lg" style={{ background: 'rgba(0, 71, 80, 0.06)' }}>
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#004750' }} />
                <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-600)', margin: 0, lineHeight: 1.5 }}>
                  Submissions are logged with ambassador ID and timestamp. The member will receive a confirmation email and can still contact
                  member services with changes until the submission deadline.
                </p>
              </div>
            </>
          )}

          {step === 'success' && (
            <div className="text-center py-2">
              <div
                className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full"
                style={{ background: 'rgba(27,102,117,0.1)' }}
              >
                <CheckCircle2 className="w-8 h-8" style={{ color: 'var(--color-teal)' }} />
              </div>
              <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.9375rem', color: 'var(--er-gray-700)', lineHeight: 1.6, margin: 0 }}>
                <strong>{member.user.name}</strong>’s requests are now marked <strong>Submitted</strong> for Q2. Each request is attributed to
                your ambassador submission for audit.
              </p>
            </div>
          )}
        </div>

        <div
          className="px-6 py-4 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end"
          style={{ borderTop: '1px solid var(--er-gray-100)', background: 'var(--er-gray-50)' }}
        >
          {step === 'success' ? (
            <button
              type="button"
              onClick={resetAndClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium"
              style={{
                fontFamily: 'var(--er-font-sans)',
                fontSize: '0.875rem',
                background: 'var(--er-slate-800)',
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
                onClick={step === 'review' ? resetAndClose : () => setStep('review')}
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
                {step === 'review' ? 'Cancel' : 'Back'}
              </button>
              <button
                type="button"
                disabled={step === 'review' ? !v.canProceedToConfirm : confirmStepDisabled}
                onClick={handlePrimaryNext}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium inline-flex items-center justify-center gap-2 disabled:opacity-45 disabled:cursor-not-allowed"
                style={{
                  fontFamily: 'var(--er-font-sans)',
                  fontSize: '0.875rem',
                  background: 'var(--er-slate-800)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting…
                  </>
                ) : step === 'review' ? (
                  <>
                    <ClipboardCheck className="w-4 h-4" />
                    Continue
                  </>
                ) : (
                  'Confirm & submit'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckRow({
  ok,
  label,
  detail,
  warn,
}: {
  ok: boolean;
  label: string;
  detail: string;
  warn?: boolean;
}) {
  return (
    <li className="flex gap-3">
      <div
        className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg"
        style={{
          background: ok ? 'rgba(27,102,117,0.08)' : warn ? 'rgba(180,83,9,0.08)' : 'rgba(185,28,28,0.08)',
        }}
      >
        {ok ? (
          <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--color-teal)' }} />
        ) : warn ? (
          <AlertTriangle className="w-4 h-4" style={{ color: 'rgb(180,83,9)' }} />
        ) : (
          <AlertTriangle className="w-4 h-4" style={{ color: 'rgb(185,28,28)' }} />
        )}
      </div>
      <div>
        <p style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '0.875rem', color: 'var(--er-slate-800)', margin: 0 }}>
          {label}
        </p>
        <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-500)', margin: '4px 0 0', lineHeight: 1.45 }}>
          {detail}
        </p>
      </div>
    </li>
  );
}
