import { useState, useMemo } from 'react';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Trophy,
  Flame,
  Crown,
  User,
  ChevronRight,
  Calendar,
  Coins,
  UserCheck,
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ambassadorProfile, getNextRASRunDate } from '../../data/mockData';
import type { ManagedMember } from '../../types';
import { MemberDetailPanel } from './MemberDetailPanel';

type FilterTab = 'all' | 'needs-action' | 'submitted' | 'has-results';

const STATUS_CONFIG = {
  'not-started': {
    label: 'Not Started',
    icon: AlertCircle,
    color: 'rgb(185,28,28)',
    bg: 'rgba(185,28,28,0.08)',
    border: 'rgba(185,28,28,0.2)',
  },
  'in-progress': {
    label: 'In Progress',
    icon: Clock,
    color: 'rgb(180,83,9)',
    bg: 'rgba(180,83,9,0.08)',
    border: 'rgba(180,83,9,0.2)',
  },
  submitted: {
    label: 'Submitted',
    icon: CheckCircle,
    color: 'var(--color-teal)',
    bg: 'rgba(27,102,117,0.07)',
    border: 'rgba(27,102,117,0.2)',
  },
  'results-available': {
    label: 'Results Ready',
    icon: Trophy,
    color: 'var(--color-gold-dark)',
    bg: 'rgba(201,169,110,0.1)',
    border: 'rgba(201,169,110,0.25)',
  },
};

export function AmbassadorDashboard() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);
  const [members, setMembers] = useState<ManagedMember[]>(() => structuredClone(ambassadorProfile.members));

  const activeMember = useMemo(
    () => (activeMemberId ? members.find((m) => m.user.id === activeMemberId) ?? null : null),
    [members, activeMemberId]
  );

  const handleUpdateMember = (updated: ManagedMember) => {
    setMembers((prev) => prev.map((m) => (m.user.id === updated.user.id ? updated : m)));
  };
  const rasRunDate = getNextRASRunDate();
  const daysUntilRun = differenceInDays(rasRunDate, new Date());

  const submitted = members.filter((m) =>
    m.rasStatus === 'submitted' || m.rasStatus === 'results-available'
  );
  const notStarted = members.filter((m) => m.rasStatus === 'not-started');
  const hasResults = members.filter((m) => m.rasStatus === 'results-available');

  const filteredMembers = members.filter((m) => {
    if (activeFilter === 'needs-action') return m.rasStatus === 'not-started' || m.rasStatus === 'in-progress';
    if (activeFilter === 'submitted') return m.rasStatus === 'submitted';
    if (activeFilter === 'has-results') return m.rasStatus === 'results-available';
    return true;
  });

  const filterTabs: { id: FilterTab; label: string; count: number }[] = [
    { id: 'all', label: 'All Members', count: members.length },
    { id: 'needs-action', label: 'Needs Action', count: members.filter((m) => m.rasStatus === 'not-started' || m.rasStatus === 'in-progress').length },
    { id: 'submitted', label: 'Submitted', count: submitted.length },
    { id: 'has-results', label: 'Has Results', count: hasResults.length },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* Ambassador identity bar */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-9 h-9 flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--er-slate-800)', borderRadius: 'var(--er-radius-sm)' }}
        >
          <UserCheck className="w-4.5 h-4.5 text-white" style={{ width: '1.125rem', height: '1.125rem' }} />
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--er-font-serif)', fontWeight: 300, fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'var(--er-slate-800)', margin: 0, lineHeight: 1.1 }}>
            {ambassadorProfile.name}
          </h2>
          <p className="label-caps mt-0.5" style={{ color: 'var(--er-gray-400)' }}>
            Ambassador · Compass V2 · Q2 2025 Release
          </p>
        </div>
      </div>

      {/* Release summary banner */}
      <div
        className="mb-6 px-6 py-5"
        style={{
          background: 'var(--er-white)',
          border: '1px solid var(--er-gray-200)',
          borderRadius: 'var(--er-radius-xl)',
          boxShadow: 'var(--er-shadow-sm)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-8 flex-wrap">
            <Stat value={members.length} label="Total members" />
            <div style={{ width: '1px', height: '36px', background: 'var(--er-gray-200)' }} />
            <Stat value={submitted.length} label="Submitted" color="var(--color-teal)" />
            <div style={{ width: '1px', height: '36px', background: 'var(--er-gray-200)' }} />
            <Stat value={notStarted.length} label="Not started" color="rgb(185,28,28)" />
            {hasResults.length > 0 && (
              <>
                <div style={{ width: '1px', height: '36px', background: 'var(--er-gray-200)' }} />
                <Stat value={hasResults.length} label="Results ready" color="var(--color-gold-dark)" />
              </>
            )}
          </div>
          <div
            className="flex-shrink-0 px-4 py-2.5 flex items-center gap-2"
            style={{
              background: daysUntilRun <= 7 ? 'rgba(180,83,9,0.08)' : 'var(--er-gray-50)',
              border: `1px solid ${daysUntilRun <= 7 ? 'rgba(180,83,9,0.2)' : 'var(--er-gray-200)'}`,
              borderRadius: 'var(--er-radius-lg)',
            }}
          >
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: daysUntilRun <= 7 ? 'rgb(180,83,9)' : 'var(--er-gray-400)' }} />
            <div>
              <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', fontWeight: 500, color: daysUntilRun <= 7 ? 'rgb(154,52,18)' : 'var(--er-slate-800)' }}>
                {daysUntilRun} days until lottery
              </p>
              <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.6875rem', color: 'var(--er-gray-400)' }}>
                Runs {format(rasRunDate, 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-500)' }}>
              Submission progress
            </p>
            <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', fontWeight: 500, color: 'var(--er-slate-800)' }}>
              {submitted.length} / {members.length}
            </p>
          </div>
          <div style={{ height: '6px', background: 'var(--er-gray-100)', borderRadius: 'var(--er-radius-full)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${(submitted.length / members.length) * 100}%`,
                background: 'var(--color-teal)',
                borderRadius: 'var(--er-radius-full)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div
        className="flex items-center gap-1 mb-5 p-1"
        style={{ background: 'var(--er-gray-100)', borderRadius: 'var(--er-radius-lg)', display: 'inline-flex' }}
      >
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className="flex items-center gap-2 px-4 py-2 transition-all"
            style={{
              borderRadius: 'var(--er-radius-md)',
              fontFamily: 'var(--er-font-sans)',
              fontSize: '0.8125rem',
              fontWeight: activeFilter === tab.id ? 500 : 400,
              background: activeFilter === tab.id ? 'var(--er-white)' : 'transparent',
              color: activeFilter === tab.id ? 'var(--er-slate-800)' : 'var(--er-gray-500)',
              boxShadow: activeFilter === tab.id ? 'var(--er-shadow-xs)' : 'none',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            {tab.label}
            <span
              style={{
                fontFamily: 'var(--er-font-sans)',
                fontSize: '0.6875rem',
                fontWeight: 500,
                color: activeFilter === tab.id ? 'var(--er-slate-800)' : 'var(--er-gray-400)',
                background: activeFilter === tab.id ? 'var(--er-gray-100)' : 'transparent',
                borderRadius: 'var(--er-radius-full)',
                padding: activeFilter === tab.id ? '1px 6px' : '0',
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Member table */}
      <div
        style={{
          background: 'var(--er-white)',
          border: '1px solid var(--er-gray-200)',
          borderRadius: 'var(--er-radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--er-shadow-sm)',
        }}
      >
        {/* Table header */}
        <div
          className="hidden md:grid px-5 py-3"
          style={{
            gridTemplateColumns: '1fr 140px 180px 160px 80px 40px',
            background: 'var(--er-gray-50)',
            borderBottom: '1px solid var(--er-gray-200)',
          }}
        >
          {['Member', 'Status', 'Requests', 'Points', 'Submitted by', ''].map((h) => (
            <p key={h} className="label-caps" style={{ color: 'var(--er-gray-400)' }}>{h}</p>
          ))}
        </div>

        {filteredMembers.length === 0 ? (
          <div className="py-16 text-center">
            <p style={{ fontFamily: 'var(--er-font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: '1.0625rem', color: 'var(--er-gray-400)' }}>
              No members match this filter.
            </p>
          </div>
        ) : (
          filteredMembers.map((member, i) => (
            <MemberRow
              key={member.user.id}
              member={member}
              isLast={i === filteredMembers.length - 1}
              onManage={() => setActiveMemberId(member.user.id)}
            />
          ))
        )}
      </div>

      {/* Member detail panel */}
      {activeMember && (
        <MemberDetailPanel member={activeMember} onClose={() => setActiveMemberId(null)} onUpdateMember={handleUpdateMember} />
      )}
    </div>
  );
}

// ─── Stat block ──────────────────────────────────────────────────────────────
function Stat({ value, label, color }: { value: number; label: string; color?: string }) {
  return (
    <div>
      <p
        className="tabular-nums"
        style={{ fontFamily: 'var(--er-font-sans)', fontSize: '1.75rem', fontWeight: 300, color: color ?? 'var(--er-slate-800)', lineHeight: 1 }}
      >
        {value}
      </p>
      <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-500)', marginTop: '2px' }}>
        {label}
      </p>
    </div>
  );
}

// ─── Member row ───────────────────────────────────────────────────────────────
function MemberRow({
  member,
  isLast,
  onManage,
}: {
  member: ManagedMember;
  isLast: boolean;
  onManage: () => void;
}) {
  const status = STATUS_CONFIG[member.rasStatus];
  const StatusIcon = status.icon;

  const totalAllocated = member.requests.reduce((sum, r) => sum + r.pointsAllocated, 0);
  const highDemandCount = member.requests.filter((r) => r.destination.demandTier === 'super-peak').length;

  const submittedByMember = member.requests.some((r) => r.submittedBy === 'member');
  const submittedByAmbassador = member.requests.some((r) => r.submittedBy === 'ambassador');
  const submittedByLabel =
    submittedByMember && submittedByAmbassador
      ? 'Mixed'
      : submittedByAmbassador
        ? 'Ambassador'
        : submittedByMember
          ? 'Member'
          : '—';

  const wins = member.results.filter((r) => r.status === 'won');
  const pendingAcceptance = wins.filter((r) => r.acceptStatus === 'pending');

  const totalQuarters = member.history?.length ?? 0;
  const participatedQuarters = member.history?.filter((h) => h.participated).length ?? 0;
  const participationRate = totalQuarters > 0 ? participatedQuarters / totalQuarters : null;

  return (
    <div
      className="flex flex-col md:grid items-center gap-3 md:gap-0 px-5 py-4 cursor-pointer transition-colors hover:bg-gray-50 group"
      style={{
        gridTemplateColumns: '1fr 140px 180px 160px 80px 40px',
        borderBottom: isLast ? 'none' : '1px solid var(--er-gray-100)',
      }}
      onClick={onManage}
    >
      {/* Member name + type */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div
          className="w-9 h-9 flex items-center justify-center flex-shrink-0"
          style={{
            background: member.user.memberType === 'ultra'
              ? 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))'
              : 'var(--er-gray-100)',
            borderRadius: 'var(--er-radius-sm)',
          }}
        >
          {member.user.memberType === 'ultra' ? (
            <Crown className="w-4 h-4 text-white" />
          ) : (
            <User className="w-4 h-4" style={{ color: 'var(--er-gray-400)' }} />
          )}
        </div>
        <div>
          <p style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '0.9375rem', color: 'var(--er-slate-800)' }}>
            {member.user.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-400)' }}>
              {member.user.memberType === 'ultra' ? 'Ultra Member' : 'Regular Member'}
            </p>
            {participationRate !== null && (
              <span
                style={{
                  fontFamily: 'var(--er-font-sans)',
                  fontSize: '0.625rem',
                  fontWeight: 500,
                  color: participationRate === 1
                    ? 'var(--color-teal)'
                    : participationRate >= 0.5
                      ? 'rgb(161,98,7)'
                      : 'rgb(185,28,28)',
                  background: participationRate === 1
                    ? 'rgba(27,102,117,0.07)'
                    : participationRate >= 0.5
                      ? 'rgba(161,98,7,0.08)'
                      : 'rgba(185,28,28,0.08)',
                  borderRadius: 'var(--er-radius-full)',
                  padding: '1px 6px',
                }}
              >
                {participatedQuarters}/{totalQuarters} qtrs
              </span>
            )}
            {member.user.isFirstTime && (
              <span
                style={{
                  fontFamily: 'var(--er-font-sans)',
                  fontSize: '0.625rem',
                  fontWeight: 500,
                  color: 'var(--color-teal)',
                  background: 'rgba(27,102,117,0.08)',
                  borderRadius: 'var(--er-radius-full)',
                  padding: '1px 6px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                First time
              </span>
            )}
            {pendingAcceptance.length > 0 && (
              <span
                style={{
                  fontFamily: 'var(--er-font-sans)',
                  fontSize: '0.625rem',
                  fontWeight: 500,
                  color: 'rgb(180,83,9)',
                  background: 'rgba(180,83,9,0.08)',
                  borderRadius: 'var(--er-radius-full)',
                  padding: '1px 6px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Awaiting acceptance
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      <div>
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1"
          style={{
            background: status.bg,
            border: `1px solid ${status.border}`,
            borderRadius: 'var(--er-radius-full)',
            fontFamily: 'var(--er-font-sans)',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: status.color,
          }}
        >
          <StatusIcon className="w-3 h-3 flex-shrink-0" />
          {status.label}
        </span>
      </div>

      {/* Requests */}
      <div>
        {member.requests.length === 0 ? (
          <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-400)', fontStyle: 'italic' }}>
            No requests yet
          </p>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-slate-800)', fontWeight: 500 }}>
              {member.requests.length} request{member.requests.length !== 1 ? 's' : ''}
            </p>
            {highDemandCount > 0 && (
              <span
                className="inline-flex items-center gap-1"
                style={{
                  fontFamily: 'var(--er-font-sans)',
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  color: 'rgb(194,65,12)',
                  background: 'rgba(194,65,12,0.08)',
                  borderRadius: 'var(--er-radius-full)',
                  padding: '1px 6px',
                }}
              >
                <Flame className="w-2.5 h-2.5" />
                {highDemandCount} high demand
              </span>
            )}
          </div>
        )}
      </div>

      {/* Points */}
      <div>
        <div className="flex items-center gap-1.5">
          <Coins className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-gold)' }} />
          <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-slate-800)', fontWeight: 500 }}>
            {totalAllocated}
          </span>
          <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-400)' }}>
            / {member.pointsBudget}
          </span>
        </div>
        {member.requests.length > 0 && (
          <div className="mt-1.5" style={{ height: '3px', background: 'var(--er-gray-100)', borderRadius: 'var(--er-radius-full)', width: '80px' }}>
            <div
              style={{
                height: '100%',
                width: `${Math.min((totalAllocated / member.pointsBudget) * 100, 100)}%`,
                background: totalAllocated >= member.pointsBudget ? 'var(--color-teal)' : 'var(--color-gold)',
                borderRadius: 'var(--er-radius-full)',
              }}
            />
          </div>
        )}
      </div>

      {/* Submitted by */}
      <div>
        {member.requests.length > 0 ? (
          <span
            style={{
              fontFamily: 'var(--er-font-sans)',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: submittedByLabel === 'Ambassador' ? 'var(--color-gold-dark)' : submittedByLabel === 'Member' ? 'var(--color-teal)' : 'var(--er-gray-500)',
              background: submittedByLabel === 'Ambassador' ? 'rgba(201,169,110,0.1)' : submittedByLabel === 'Member' ? 'rgba(27,102,117,0.07)' : 'var(--er-gray-50)',
              borderRadius: 'var(--er-radius-full)',
              padding: '2px 8px',
            }}
          >
            {submittedByLabel}
          </span>
        ) : (
          <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-300)' }}>—</span>
        )}
      </div>

      {/* Chevron */}
      <div className="flex justify-end">
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" style={{ color: 'var(--er-gray-300)' }} />
      </div>
    </div>
  );
}
