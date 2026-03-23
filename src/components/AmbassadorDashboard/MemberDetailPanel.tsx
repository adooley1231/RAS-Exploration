import { useState } from 'react';
import {
  X,
  Crown,
  User,
  Calendar,
  Moon,
  Coins,
  Flame,
  Clock,
  Trophy,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  History,
  UserCheck,
  UserCircle,
  Plus,
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useRAS } from '../../context/RASContext';
import type { ManagedMember, VacationRequest, RASResult, HistoricalRelease } from '../../types';
import { SubmitOnBehalfModal } from './SubmitOnBehalfModal';
import { AcceptOnBehalfModal } from './AcceptOnBehalfModal';
import { EditAllocationGuideModal, AddRequestInfoModal } from './AmbassadorInfoModals';

const DEMAND_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  'super-peak': { label: 'High Demand', color: 'rgb(194,65,12)', bg: 'rgba(194,65,12,0.08)' },
  'peak': { label: 'Popular', color: 'rgb(161,98,7)', bg: 'rgba(161,98,7,0.08)' },
  'shoulder': { label: 'Moderate', color: 'var(--er-gray-500)', bg: 'var(--er-gray-100)' },
  'off-season': { label: 'Low Demand', color: 'var(--color-teal)', bg: 'rgba(27,102,117,0.07)' },
};

interface MemberDetailPanelProps {
  member: ManagedMember;
  onClose: () => void;
  onUpdateMember: (member: ManagedMember) => void;
}

export function MemberDetailPanel({ member, onClose, onUpdateMember }: MemberDetailPanelProps) {
  const { openAnnotationCallout } = useRAS();
  const [expandedQuarters, setExpandedQuarters] = useState<Set<string>>(new Set());
  const [showAddNote, setShowAddNote] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showEditGuideModal, setShowEditGuideModal] = useState(false);
  const [showAddRequestModal, setShowAddRequestModal] = useState(false);

  const toggleQuarter = (releaseId: string) => {
    setExpandedQuarters((prev) => {
      const next = new Set(prev);
      const isExpanding = !next.has(releaseId);
      if (next.has(releaseId)) next.delete(releaseId);
      else next.add(releaseId);
      if (isExpanding) openAnnotationCallout('ambassador-release-history');
      return next;
    });
  };
  const [ambassadorNote, setAmbassadorNote] = useState('');

  const totalAllocated = member.requests.reduce((sum, r) => sum + r.pointsAllocated, 0);
  const wins = member.results.filter((r) => r.status === 'won');
  const losses = member.results.filter((r) => r.status === 'lost');
  const hasResults = member.rasStatus === 'results-available';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-navy/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out panel */}
      <div
        className="fixed z-50 top-0 right-0 h-full flex flex-col"
        style={{
          width: 'min(100vw, 560px)',
          background: 'var(--er-white)',
          borderLeft: '1px solid var(--er-gray-200)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
        }}
      >
        {/* Panel header */}
        <div
          className="flex items-start justify-between px-6 py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--er-gray-100)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center flex-shrink-0"
              style={{
                background: member.user.memberType === 'ultra'
                  ? 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))'
                  : 'var(--er-gray-100)',
                borderRadius: 'var(--er-radius-sm)',
              }}
            >
              {member.user.memberType === 'ultra' ? (
                <Crown className="w-5 h-5 text-white" />
              ) : (
                <User className="w-5 h-5" style={{ color: 'var(--er-gray-500)' }} />
              )}
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--er-font-serif)', fontWeight: 300, fontSize: '1.375rem', letterSpacing: '-0.01em', color: 'var(--er-slate-800)', margin: 0 }}>
                {member.user.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="label-caps" style={{ color: 'var(--er-gray-400)' }}>
                  {member.user.memberType === 'ultra' ? 'Ultra Member' : 'Regular Member'}
                </p>
                {member.user.isFirstTime && (
                  <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.625rem', fontWeight: 500, color: 'var(--color-teal)', background: 'rgba(27,102,117,0.08)', borderRadius: 'var(--er-radius-full)', padding: '1px 6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    First time
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100"
            style={{ color: 'var(--er-gray-400)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Stats strip */}
          <div
            className="grid grid-cols-3 gap-0"
            style={{ background: 'var(--er-gray-50)', borderRadius: 'var(--er-radius-lg)', border: '1px solid var(--er-gray-200)', overflow: 'hidden' }}
          >
            <StatCell label="Points budget" value={`${member.pointsBudget} pts`} />
            <StatCell label="Allocated" value={`${totalAllocated} pts`} highlight={totalAllocated === member.pointsBudget} borderLeft />
            <StatCell label="Requests" value={String(member.requests.length)} borderLeft />
          </div>

          {/* Submitted-on-behalf banner */}
          {member.lastSubmission?.by === 'ambassador' && member.rasStatus === 'submitted' && (
            <div
              className="flex gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(27,102,117,0.07)', border: '1px solid rgba(27,102,117,0.2)' }}
            >
              <UserCheck className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-teal)' }} />
              <div>
                <p className="label-caps mb-0.5" style={{ color: 'var(--color-teal)', letterSpacing: '0.08em' }}>
                  Submitted by ambassador
                </p>
                <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-700)', margin: 0, lineHeight: 1.5 }}>
                  Submitted on behalf of {member.user.name} on{' '}
                  <strong>{format(member.lastSubmission.at, 'MMM d, yyyy · h:mm a')}</strong>. All requests are logged with ambassador attribution.
                </p>
              </div>
            </div>
          )}

          {/* Ambassador note */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="label-caps" style={{ color: 'var(--er-gray-400)' }}>Ambassador notes</p>
              <button
                type="button"
                onClick={() => setShowAddNote(!showAddNote)}
                className="flex items-center gap-1 transition-colors"
                style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--color-teal)' }}
              >
                <Plus className="w-3 h-3" />
                Add note
              </button>
            </div>
            {showAddNote && (
              <div>
                <textarea
                  value={ambassadorNote}
                  onChange={(e) => setAmbassadorNote(e.target.value)}
                  placeholder="Add a note about this member's preferences or special considerations..."
                  rows={3}
                  className="w-full resize-none outline-none"
                  style={{
                    fontFamily: 'var(--er-font-sans)',
                    fontSize: '0.875rem',
                    color: 'var(--er-slate-800)',
                    background: 'var(--er-gray-50)',
                    border: '1px solid var(--er-gray-200)',
                    borderRadius: 'var(--er-radius-md)',
                    padding: '10px 12px',
                  }}
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddNote(false)}
                    className="px-3 py-1.5 rounded-lg transition-colors"
                    style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', fontWeight: 500, background: 'var(--er-slate-800)', color: '#fff', border: 'none', cursor: 'pointer' }}
                  >
                    Save note
                  </button>
                </div>
              </div>
            )}
            {!showAddNote && !ambassadorNote && (
              <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-300)', fontStyle: 'italic' }}>
                No notes yet
              </p>
            )}
            {!showAddNote && ambassadorNote && (
              <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-600)', lineHeight: 1.5 }}>
                {ambassadorNote}
              </p>
            )}
          </div>

          {/* Results section — shown if results available */}
          {hasResults && member.results.length > 0 && (
            <div>
              <p className="label-caps mb-3" style={{ color: 'var(--er-gray-400)' }}>Lottery results</p>
              <div className="space-y-2">
                {wins.map((result) => (
                  <ResultRow key={result.id} result={result} status="won" />
                ))}
                {losses.map((result) => (
                  <ResultRow key={result.id} result={result} status="lost" />
                ))}
              </div>
            </div>
          )}

          {/* Requests section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="label-caps" style={{ color: 'var(--er-gray-400)' }}>
                Requests ({member.requests.length})
              </p>
              {member.rasStatus !== 'submitted' && member.rasStatus !== 'results-available' && (
                <button
                  type="button"
                  onClick={() => setShowAddRequestModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    fontFamily: 'var(--er-font-sans)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    background: 'rgba(27,102,117,0.08)',
                    color: 'var(--color-teal)',
                    border: '1px solid rgba(27,102,117,0.2)',
                    cursor: 'pointer',
                  }}
                >
                  <Plus className="w-3 h-3" />
                  Add request
                </button>
              )}
            </div>

            {member.requests.length === 0 ? (
              <div
                className="py-8 text-center"
                style={{ background: 'var(--er-gray-50)', borderRadius: 'var(--er-radius-lg)', border: '1px dashed var(--er-gray-200)' }}
              >
                <AlertCircle className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--er-gray-300)' }} />
                <p style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '0.875rem', color: 'var(--er-gray-500)' }}>
                  No requests yet
                </p>
                <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-400)', marginTop: '4px' }}>
                  This member has not started their RAS submission.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {member.requests.map((req, i) => (
                  <RequestRow key={req.id} request={req} rank={i + 1} budget={member.pointsBudget} />
                ))}
              </div>
            )}
          </div>

          {/* Release History */}
          {member.history && member.history.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <History className="w-3.5 h-3.5" style={{ color: 'var(--er-gray-400)' }} />
                <p className="label-caps" style={{ color: 'var(--er-gray-400)' }}>
                  Release history · past {member.history.length} quarters
                </p>
              </div>
              <div
                style={{
                  border: '1px solid var(--er-gray-200)',
                  borderRadius: 'var(--er-radius-lg)',
                  overflow: 'hidden',
                }}
              >
                {member.history.map((release, i) => (
                  <QuarterAccordion
                    key={release.releaseId}
                    release={release}
                    isExpanded={expandedQuarters.has(release.releaseId)}
                    onToggle={() => toggleQuarter(release.releaseId)}
                    hasBorder={i > 0}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Panel footer actions */}
        {(member.rasStatus === 'in-progress' || member.rasStatus === 'not-started') && (
          <div
            className="flex-shrink-0 px-6 py-4 flex flex-col gap-3"
            style={{ borderTop: '1px solid var(--er-gray-100)', background: 'var(--er-gray-50)' }}
          >
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowEditGuideModal(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors"
                style={{
                  fontFamily: 'var(--er-font-sans)',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  background: 'var(--er-white)',
                  color: 'var(--er-gray-600)',
                  border: '1px solid var(--er-gray-200)',
                  cursor: 'pointer',
                }}
              >
                Edit allocation
              </button>
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors"
                style={{
                  fontFamily: 'var(--er-font-sans)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  background: 'var(--er-slate-800)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <UserCheck className="w-4 h-4" />
                Submit on behalf
              </button>
            </div>
            <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-500)', margin: 0, lineHeight: 1.45 }}>
              Finishing locks this list for the lottery (same as member submit). You’ll confirm authorization in the next step.
            </p>
          </div>
        )}

        {member.rasStatus === 'results-available' && wins.some((r) => r.acceptStatus === 'pending') && (
          <div
            className="flex-shrink-0 px-6 py-4"
            style={{ borderTop: '1px solid var(--er-gray-100)', background: 'var(--er-gray-50)' }}
          >
            <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-600)', marginBottom: '12px' }}>
              This member has <strong style={{ color: 'var(--er-slate-800)' }}>{wins.filter((r) => r.acceptStatus === 'pending').length} win{wins.filter((r) => r.acceptStatus === 'pending').length !== 1 ? 's' : ''}</strong> awaiting acceptance.
            </p>
            <button
              type="button"
              onClick={() => setShowAcceptModal(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors"
              style={{
                fontFamily: 'var(--er-font-sans)',
                fontSize: '0.875rem',
                fontWeight: 500,
                background: 'var(--color-teal)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Check className="w-4 h-4" />
              Accept on behalf of member
            </button>
          </div>
        )}
      </div>

      <SubmitOnBehalfModal
        member={member}
        open={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmitSuccess={(updated) => {
          onUpdateMember(updated);
        }}
      />

      <AcceptOnBehalfModal
        member={member}
        open={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        onAcceptSuccess={(updated) => onUpdateMember(updated)}
      />

      <EditAllocationGuideModal open={showEditGuideModal} onClose={() => setShowEditGuideModal(false)} />
      <AddRequestInfoModal open={showAddRequestModal} onClose={() => setShowAddRequestModal(false)} />
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCell({ label, value, highlight, borderLeft }: { label: string; value: string; highlight?: boolean; borderLeft?: boolean }) {
  return (
    <div
      className="px-4 py-3"
      style={{ borderLeft: borderLeft ? '1px solid var(--er-gray-200)' : 'none' }}
    >
      <p className="label-caps" style={{ color: 'var(--er-gray-400)' }}>{label}</p>
      <p style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '1rem', color: highlight ? 'var(--color-teal)' : 'var(--er-slate-800)', marginTop: '2px' }}>
        {value}
      </p>
    </div>
  );
}

function RequestRow({ request, rank, budget }: { request: VacationRequest; rank: number; budget: number }) {
  const demand = request.destination.demandTier ? DEMAND_LABELS[request.destination.demandTier] : null;
  const nights = differenceInDays(request.checkOutDate, request.checkInDate);
  const pct = budget > 0 ? Math.round((request.pointsAllocated / budget) * 100) : 0;

  return (
    <div
      className="px-4 py-3"
      style={{
        background: 'var(--er-white)',
        border: '1px solid var(--er-gray-200)',
        borderRadius: 'var(--er-radius-lg)',
      }}
    >
      <div className="flex items-start gap-3">
        {/* Rank */}
        <div
          className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: 'var(--er-slate-800)', borderRadius: '3px', fontFamily: 'var(--er-font-sans)', fontSize: '0.6875rem', fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}
        >
          {rank}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p style={{ fontFamily: 'var(--er-font-serif)', fontWeight: 300, fontSize: '1rem', color: 'var(--er-slate-800)', letterSpacing: '-0.01em' }}>
              {request.destination.name}
            </p>
            {/* Ambassador-only demand badge */}
            {demand && (
              <span
                className="inline-flex items-center gap-1"
                style={{
                  fontFamily: 'var(--er-font-sans)',
                  fontSize: '0.625rem',
                  fontWeight: 500,
                  color: demand.color,
                  background: demand.bg,
                  borderRadius: 'var(--er-radius-full)',
                  padding: '1px 6px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {request.destination.demandTier === 'super-peak' && <Flame className="w-2.5 h-2.5" />}
                {demand.label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <div className="flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5" style={{ color: 'var(--er-gray-400)' }} />
              <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-400)' }}>
                {request.destination.region}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5" style={{ color: 'var(--er-gray-400)' }} />
              <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-500)' }}>
                {format(request.checkInDate, 'MMM d')} – {format(request.checkOutDate, 'MMM d')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Moon className="w-2.5 h-2.5" style={{ color: 'var(--er-gray-400)' }} />
              <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-500)' }}>
                {nights} nights{request.flexibleDates ? ' (flexible)' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Points + submitted by */}
        <div className="flex-shrink-0 text-right">
          <div className="flex items-center gap-1 justify-end">
            <Coins className="w-3 h-3" style={{ color: 'var(--color-gold)' }} />
            <span style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '0.875rem', color: 'var(--er-slate-800)' }}>
              {request.pointsAllocated}
            </span>
            <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-400)' }}>
              pts · {pct}%
            </span>
          </div>
          {request.submittedBy && (
            <div className="flex items-center gap-1 justify-end mt-1">
              {request.submittedBy === 'ambassador'
                ? <UserCheck className="w-2.5 h-2.5" style={{ color: 'var(--color-gold-dark)' }} />
                : <UserCircle className="w-2.5 h-2.5" style={{ color: 'var(--color-teal)' }} />
              }
              <span style={{
                fontFamily: 'var(--er-font-sans)',
                fontSize: '0.6875rem',
                color: request.submittedBy === 'ambassador' ? 'var(--color-gold-dark)' : 'var(--color-teal)',
              }}>
                {request.submittedBy === 'ambassador' ? 'Via ambassador' : 'Self-submitted'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultRow({ result, status }: { result: RASResult; status: 'won' | 'lost' }) {
  const isWon = status === 'won';
  const isPending = result.acceptStatus === 'pending';

  return (
    <div
      className="flex items-center gap-3 px-4 py-3"
      style={{
        background: isWon ? 'rgba(201,169,110,0.06)' : 'var(--er-gray-50)',
        border: `1px solid ${isWon ? 'rgba(201,169,110,0.2)' : 'var(--er-gray-200)'}`,
        borderRadius: 'var(--er-radius-lg)',
      }}
    >
      {/* Icon */}
      <div
        className="w-7 h-7 flex items-center justify-center flex-shrink-0"
        style={{
          background: isWon ? 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))' : 'var(--er-gray-200)',
          borderRadius: 'var(--er-radius-sm)',
        }}
      >
        {isWon ? <Trophy className="w-3.5 h-3.5 text-white" /> : <X className="w-3.5 h-3.5" style={{ color: 'var(--er-gray-500)' }} />}
      </div>

      <div className="flex-1 min-w-0">
        <p style={{ fontFamily: 'var(--er-font-serif)', fontWeight: 300, fontSize: '0.9375rem', color: 'var(--er-slate-800)', letterSpacing: '-0.01em' }}>
          {result.destination.name}
        </p>
        {isWon && result.matchedDates && (
          <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-500)', marginTop: '2px' }}>
            {format(result.matchedDates.checkIn, 'MMM d')} – {format(result.matchedDates.checkOut, 'MMM d')}
            {' · '}
            {differenceInDays(result.matchedDates.checkOut, result.matchedDates.checkIn)} nights
          </p>
        )}
      </div>

      {/* Status */}
      {isWon && isPending && (
        <span
          className="flex items-center gap-1 flex-shrink-0"
          style={{
            fontFamily: 'var(--er-font-sans)',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'rgb(180,83,9)',
            background: 'rgba(180,83,9,0.08)',
            borderRadius: 'var(--er-radius-full)',
            padding: '2px 8px',
          }}
        >
          <Clock className="w-3 h-3" />
          Pending
        </span>
      )}
      {isWon && result.acceptStatus === 'accepted' && (
        <span
          className="flex items-center gap-1 flex-shrink-0"
          style={{
            fontFamily: 'var(--er-font-sans)',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'var(--color-teal)',
            background: 'rgba(27,102,117,0.07)',
            borderRadius: 'var(--er-radius-full)',
            padding: '2px 8px',
          }}
        >
          <Check className="w-3 h-3" />
          Accepted
        </span>
      )}
      {!isWon && (
        <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-400)' }}>
          Not selected
        </span>
      )}
    </div>
  );
}

// ─── Release History Accordion ────────────────────────────────────────────────

function QuarterAccordion({
  release,
  isExpanded,
  onToggle,
  hasBorder,
}: {
  release: HistoricalRelease;
  isExpanded: boolean;
  onToggle: () => void;
  hasBorder: boolean;
}) {
  const submittedByColor =
    release.submittedBy === 'ambassador'
      ? 'var(--color-gold-dark)'
      : release.submittedBy === 'mixed'
        ? 'var(--er-gray-500)'
        : 'var(--color-teal)';
  const submittedByBg =
    release.submittedBy === 'ambassador'
      ? 'rgba(201,169,110,0.1)'
      : release.submittedBy === 'mixed'
        ? 'var(--er-gray-100)'
        : 'rgba(27,102,117,0.07)';

  return (
    <div style={{ borderTop: hasBorder ? '1px solid var(--er-gray-200)' : 'none' }}>
      {/* Quarter header row */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 group"
        style={{ cursor: 'pointer', border: 'none', background: 'var(--er-white)', textAlign: 'left' }}
      >
        {/* Quarter label */}
        <div className="flex-shrink-0 w-16">
          <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', fontWeight: 500, color: release.participated ? 'var(--er-slate-800)' : 'var(--er-gray-400)' }}>
            {release.quarter}
          </span>
        </div>

        {release.participated ? (
          <div className="flex-1 flex items-center gap-3 flex-wrap min-w-0">
            {/* Win/request count */}
            <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-600)' }}>
              <strong style={{ color: release.wins > 0 ? 'var(--color-gold-dark)' : 'var(--er-slate-800)' }}>
                {release.wins} win{release.wins !== 1 ? 's' : ''}
              </strong>
              {' of '}
              {release.requests.length} requests
            </span>
            {/* Points */}
            <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-400)' }}>
              · {release.totalPoints}/{release.pointsBudget} pts
            </span>
            {/* Submitted by badge */}
            {release.submittedBy && (
              <span
                style={{
                  fontFamily: 'var(--er-font-sans)',
                  fontSize: '0.625rem',
                  fontWeight: 500,
                  color: submittedByColor,
                  background: submittedByBg,
                  borderRadius: 'var(--er-radius-full)',
                  padding: '1px 6px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {release.submittedBy === 'mixed' ? 'Mixed' : release.submittedBy === 'ambassador' ? 'Ambassador' : 'Member'}
              </span>
            )}
          </div>
        ) : (
          <div className="flex-1">
            <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-400)', fontStyle: 'italic' }}>
              Did not participate
            </span>
          </div>
        )}

        {/* Chevron */}
        {release.participated ? (
          isExpanded
            ? <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--er-gray-400)' }} />
            : <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--er-gray-400)' }} />
        ) : (
          <span className="w-3.5" />
        )}
      </button>

      {/* Expanded request list */}
      {isExpanded && release.participated && release.requests.length > 0 && (
        <div style={{ background: 'var(--er-gray-50)', borderTop: '1px solid var(--er-gray-100)' }}>
          {release.requests.map((req, i) => (
            <HistoryRequestRow
              key={i}
              req={req}
              isLast={i === release.requests.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function HistoryRequestRow({
  req,
  isLast,
}: {
  req: HistoricalRelease['requests'][number];
  isLast: boolean;
}) {
  const demand = req.demandTier ? DEMAND_LABELS[req.demandTier] : null;
  const isWon = req.status === 'won';

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5"
      style={{ borderBottom: isLast ? 'none' : '1px solid var(--er-gray-100)' }}
    >
      {/* Rank */}
      <span
        className="flex-shrink-0 tabular-nums"
        style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--er-gray-400)', width: '16px', textAlign: 'center' }}
      >
        {req.rank}
      </span>

      {/* Destination name + demand */}
      <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
        <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-slate-800)' }}>
          {req.destinationName}
        </span>
        {demand && (
          <span
            className="inline-flex items-center gap-1 flex-shrink-0"
            style={{
              fontFamily: 'var(--er-font-sans)',
              fontSize: '0.6rem',
              fontWeight: 500,
              color: demand.color,
              background: demand.bg,
              borderRadius: 'var(--er-radius-full)',
              padding: '1px 5px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {req.demandTier === 'super-peak' && <Flame className="w-2 h-2" />}
            {demand.label}
          </span>
        )}
      </div>

      {/* Points */}
      <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-400)', flexShrink: 0 }}>
        {req.pointsAllocated} pts
      </span>

      {/* Outcome pill */}
      <span
        className="flex-shrink-0 flex items-center gap-1"
        style={{
          fontFamily: 'var(--er-font-sans)',
          fontSize: '0.6875rem',
          fontWeight: 500,
          color: isWon ? 'var(--color-gold-dark)' : 'var(--er-gray-500)',
          background: isWon ? 'rgba(201,169,110,0.1)' : 'var(--er-gray-100)',
          borderRadius: 'var(--er-radius-full)',
          padding: '2px 7px',
        }}
      >
        {isWon ? <Trophy className="w-2.5 h-2.5" /> : null}
        {isWon ? 'Won' : 'Lost'}
      </span>

      {/* Submitted by icon */}
      {req.submittedBy === 'ambassador' ? (
        <UserCheck className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--color-gold-dark)' }} />
      ) : (
        <UserCircle className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--er-gray-300)' }} />
      )}
    </div>
  );
}

