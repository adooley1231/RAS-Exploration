import { useEffect, useMemo } from 'react';
import { X, Info } from 'lucide-react';
import { useRAS } from '../../context/RASContext';
import type { AnnotationCalloutId } from '../../types';

type CalloutContent = {
  title: string;
  summary: string;
  bullets: string[];
};

const getContent = (id: AnnotationCalloutId): CalloutContent => {
  switch (id) {
    case 'member-continue-allocate':
      return {
        title: 'Continue to Allocate Points',
        summary: 'This moves your saved requests into the point-allocation step.',
        bullets: [
          'Requests are already in `state.requests` with ranks assigned on add.',
          'In `PointsAllocation`, you redistribute `pointsAllocated` per request (and it stays within your remaining budget).',
          'We keep the step navigation state-only (prototype) using `setView("allocate-points")`.',
          'Your choices directly affect odds during the later Results step.',
        ],
      };

    case 'member-continue-review':
      return {
        title: 'Review & Submit',
        summary: 'This locks your allocation so you can enter the lottery.',
        bullets: [
          'Navigation to Review uses `setView("review")` but does not change request data.',
          'The Review screen calculates max wins from your member type + your current requests.',
          'It also detects duplicates and prevents submission in those cases.',
          'When you finally submit, the app sets `state.isSubmitted = true` via `SUBMIT_REQUESTS`.',
        ],
      };

    case 'member-confirm-submit':
      return {
        title: 'Submit to Lottery',
        summary: 'This enters your requests into the quarter’s lottery.',
        bullets: [
          'On confirm, `submitRequests()` dispatches `SUBMIT_REQUESTS` to mark the flow submitted.',
          'In this prototype, results are mocked (the real system would run the lottery server-side).',
          'After submission, the UI prevents editing requests, matching the “immutable after entry” backend constraint.',
          'Results later let you accept/decline wins within the acceptance window.',
        ],
      };

    case 'member-results-accept':
      return {
        title: 'Accept a Win',
        summary: 'This confirms that you want the reservation selected for you.',
        bullets: [
          '`ACCEPT_RESULT` updates the result to `acceptStatus: "accepted"` and stamps `acceptedAt`.',
          'When accepting, the reducer also deducts AR tokens from `state.user.arTokens` based on `arTokensUsed`.',
          'The UI then shows the accepted state and hides further accept/decline controls.',
          'In the real backend, this would also reserve the inventory for the member.',
        ],
      };

    case 'member-results-decline':
      return {
        title: 'Decline a Win',
        summary: 'This releases the reservation back into the pool.',
        bullets: [
          '`DECLINE_RESULT` updates `acceptStatus: "declined"` and stamps `declinedAt`.',
          'The prototype relies on local state updates only; the actual reroll/release would be backend-driven.',
          'If you do nothing, the UI indicates the reservation auto-releases when the timer ends.',
          'Declined destinations can be added to the cancellation waitlist.',
        ],
      };

    case 'member-waitlist-submit':
      return {
        title: 'Add to Cancellation Waitlist',
        summary: 'This opts you into notifications when a cancellation opens.',
        bullets: [
          'The waitlist checkboxes are managed locally in `ResultsDashboard` (`waitlistOptIns`).',
          'Submitting the waitlist copies those selections into `confirmedWaitlist` and triggers a toast.',
          'In this prototype, persistence is not server-backed, but the UX matches a real “notify me” workflow.',
          'In production, the backend would store the waitlist per user+destination and dispatch notifications.',
        ],
      };

    case 'ambassador-submit-on-behalf':
      return {
        title: 'Submit on Behalf',
        summary: 'This lets ambassadors submit a member’s RAS requests while preserving audit context.',
        bullets: [
          'Requests track `submittedBy?: "member" | "ambassador"` to show who initiated each request.',
          'Ambassadors can add requests using the same destination/date + points allocation UI as members.',
          'Demand tier labeling is visible to ambassadors in the detail panel (prototype merchandising).',
          'In a real backend, this action would be permission-checked and audited per member request.',
        ],
      };

    case 'ambassador-accept-on-behalf':
      return {
        title: 'Accept on Behalf',
        summary: 'This confirms the selected reservation for the managed member.',
        bullets: [
          'In this prototype, the accept/decline buttons are represented as “cards” with acceptStatus.',
          'The real backend would update the managed member’s result acceptance state with ambassador attribution.',
          'Request-level `submittedBy` and result-level acceptance state would be linked for auditability.',
          'Token deduction logic would be applied to the managed member’s effective budget.',
        ],
      };

    case 'ambassador-release-history':
      return {
        title: 'Release History',
        summary: 'This shows past participation quarter-by-quarter for the managed member.',
        bullets: [
          'Historical data is stored on the member as `history?: HistoricalRelease[]` in `ManagedMember`.',
          'Each quarter lists request outcomes (won/lost), destination/demand tier context, and points used.',
          'Ambassadors can use this timeline to understand performance and outreach needs.',
          'In production, this would come from backend release aggregation (not local mock data).',
        ],
      };

    default: {
      // Exhaustiveness safeguard
      const _exhaustive: never = id;
      void _exhaustive;
      return {
        title: 'Annotation',
        summary: '',
        bullets: [''],
      };
    }
  }
};

export function AnnotationCalloutModal() {
  const {
    state: { annotationCalloutId },
    closeAnnotationCallout,
  } = useRAS();

  const content = useMemo(() => {
    if (!annotationCalloutId) return null;
    return getContent(annotationCalloutId);
  }, [annotationCalloutId]);

  // Prevent background scroll while open (light UX polish for modal presentation).
  useEffect(() => {
    if (!annotationCalloutId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [annotationCalloutId]);

  if (!annotationCalloutId || !content) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={closeAnnotationCallout}
        aria-label="Close annotations"
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.35)' }}
      />

      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-xl w-[calc(100vw-2rem)] p-6"
        style={{
          background: 'var(--er-white)',
          border: '1px solid var(--er-gray-200)',
          borderRadius: 'var(--er-radius-xl)',
          boxShadow: 'var(--er-shadow-xl)',
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(27,102,117,0.07)',
                borderRadius: 'var(--er-radius-md)',
                border: '1px solid rgba(27,102,117,0.18)',
              }}
            >
              <Info className="w-5 h-5" style={{ color: 'var(--color-teal)' }} />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--er-font-serif)',
                  fontWeight: 300,
                  fontSize: '1.5rem',
                  letterSpacing: '-0.02em',
                  color: 'var(--er-slate-800)',
                  margin: 0,
                  lineHeight: 1.15,
                }}
              >
                {content.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--er-font-sans)',
                  fontSize: '0.875rem',
                  color: 'var(--er-gray-500)',
                  marginTop: '6px',
                  marginBottom: 0,
                  lineHeight: 1.4,
                }}
              >
                {content.summary}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAnnotationCallout}
            aria-label="Close annotations"
            className="p-2 rounded-lg transition-colors hover:bg-gray-100"
            style={{ border: 'none', cursor: 'pointer' }}
          >
            <X className="w-4 h-4" style={{ color: 'var(--er-gray-400)' }} />
          </button>
        </div>

        <div className="mt-4">
          <p className="label-caps" style={{ color: 'var(--er-gray-400)', marginBottom: '10px' }}>
            Backend support (in this prototype)
          </p>
          <ul className="space-y-2" style={{ paddingLeft: '1.1rem', margin: 0 }}>
            {content.bullets.map((b, idx) => (
              <li
                key={idx}
                style={{
                  fontFamily: 'var(--er-font-sans)',
                  fontSize: '0.875rem',
                  color: 'var(--er-slate-700)',
                  lineHeight: 1.45,
                }}
              >
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={closeAnnotationCallout}
            className="px-4 py-2 rounded-xl transition-colors"
            style={{
              background: 'var(--er-white)',
              border: '1px solid var(--er-gray-200)',
              color: 'var(--er-slate-700)',
              fontFamily: 'var(--er-font-sans)',
              fontSize: '0.875rem',
              fontWeight: 400,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

