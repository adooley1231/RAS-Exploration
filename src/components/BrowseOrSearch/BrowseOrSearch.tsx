import { useState } from 'react';
import { MapPin, ArrowRight, ChevronUp, ChevronDown, AlertTriangle, Crown, X, Pencil, Trash2, Compass } from 'lucide-react';
import { useRAS } from '../../context/RASContext';
import { DateRangePicker } from '../RequestBuilder/DateRangePicker';
import { EditRequestModal } from './EditRequestModal';
import { DestinationMiniPanel } from './DestinationMiniPanel';
import { PointsBank } from '../shared/PointsBank';
import { destinations } from '../../data/mockData';
import { formatDateRange, getNights } from '../../utils/helpers';
import type { Destination, VacationRequest } from '../../types';

export function BrowseOrSearch() {
  const { state, setView, addRequest, removeRequest } = useRAS();
  const { user, requests } = state;

  const MAX_REQUESTS = user.memberType === 'ultra' ? 12 : 10;

  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [editingRequest, setEditingRequest] = useState<VacationRequest | null>(null);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const featuredDestinations = destinations.filter((d) => d.featured || d.available);
  const otherDestinations = destinations.filter((d) => !d.featured && !d.available);
  const canAddMore = requests.length < MAX_REQUESTS;
  const requestsNeedingDates = requests.filter((r) => r.isPlaceholderDates);

  const handleCardClick = (dest: Destination) => {
    if (!canAddMore) return;
    setSelectedDestination((prev) => (prev?.id === dest.id ? null : dest));
  };

  const handleMiniPanelAdd = (request: VacationRequest) => {
    addRequest(request);
    setSelectedDestination(null);
  };

  const handleMiniPanelAdvanced = (request: VacationRequest) => {
    addRequest(request);
    setSelectedDestination(null);
    setEditingRequest(request);
  };

  const slotPct = Math.min((requests.length / MAX_REQUESTS) * 100, 100);

  // For the asymmetric featured layout: first is the hero, rest are secondary
  const [featuredHero, ...featuredSecondary] = featuredDestinations;

  return (
    <div className="relative">

      {/* ── Light section: Ultra ribbon + Points + Date + Featured ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Ultra ribbon */}
            {user.memberType === 'ultra' && !bannerDismissed && (
              <div
                className="mb-6 ultra-shimmer"
                style={{
                  background: 'linear-gradient(135deg, var(--er-slate-700) 0%, var(--er-slate-600) 100%)',
                  borderRadius: 'var(--er-radius-lg)',
                }}
              >
                <div className="flex items-center gap-3 px-4 py-2.5">
                  <Crown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-gold-light)' }} />
                  <p className="flex-1" style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.9)' }}>
                    <span style={{ fontWeight: 500 }}>Ultra Member</span>
                    {' '}— 12 request spots &amp; additional points to allocate
                  </p>
                  <button
                    type="button"
                    onClick={() => setBannerDismissed(true)}
                    className="transition-colors"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                    aria-label="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Points bank */}
            <div className="mb-8">
              <PointsBank user={user} requests={requests} />
            </div>

            {/* Travel window */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-4">
                <p className="label-caps whitespace-nowrap" style={{ color: 'var(--er-gray-400)' }}>
                  Travel window
                </p>
                <div className="flex-1 h-px" style={{ background: 'var(--er-gray-200)' }} />
                <p
                  className="whitespace-nowrap hidden sm:block"
                  style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-400)' }}
                >
                  Applies to new requests
                </p>
              </div>
              <div
                className="px-5 py-4"
                style={{
                  background: 'var(--er-white)',
                  border: '1px solid var(--er-gray-200)',
                  borderRadius: 'var(--er-radius-xl)',
                  boxShadow: 'var(--er-shadow-xs)',
                }}
              >
                <DateRangePicker
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onChange={(from, to) => {
                    setCheckIn(from);
                    setCheckOut(to);
                  }}
                />
              </div>
            </div>

            {/* ── Featured — asymmetric editorial layout ── */}
            {featuredDestinations.length > 0 && (
              <section className="mb-14">
                <SectionHeading label="Featured" />
                {featuredDestinations.length === 1 ? (
                  <HeroCard
                    destination={featuredHero}
                    isSelected={selectedDestination?.id === featuredHero.id}
                    onClick={() => handleCardClick(featuredHero)}
                    disabled={!canAddMore}
                    variant="primary"
                  />
                ) : (
                  /* Asymmetric: 63% primary + 37% secondary, matching heights */
                  <div className="flex flex-col md:flex-row md:items-stretch gap-4">
                    <div className="md:flex-[0_0_62%]">
                      <HeroCard
                        destination={featuredHero}
                        isSelected={selectedDestination?.id === featuredHero.id}
                        onClick={() => handleCardClick(featuredHero)}
                        disabled={!canAddMore}
                        variant="primary"
                      />
                    </div>
                    <div className="md:flex-1 flex flex-col gap-4">
                      {featuredSecondary.map((dest, i) => (
                        <HeroCard
                          key={dest.id}
                          destination={dest}
                          isSelected={selectedDestination?.id === dest.id}
                          onClick={() => handleCardClick(dest)}
                          disabled={!canAddMore}
                          variant="secondary"
                          fillHeight={featuredSecondary.length === 1}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* ── Wishlist sidebar (desktop only in light section) ── */}
          <div className="hidden lg:block lg:w-[22rem] flex-shrink-0">
            <WishlistSidebar
              requests={requests}
              requestsNeedingDates={requestsNeedingDates}
              panelCollapsed={panelCollapsed}
              setPanelCollapsed={setPanelCollapsed}
              slotPct={slotPct}
              MAX_REQUESTS={MAX_REQUESTS}
              user={user}
              setView={setView}
              setEditingRequest={setEditingRequest}
              removeRequest={removeRequest}
            />
          </div>
        </div>
      </div>

      {/* ── Dark section: All Destinations ── */}
      <div
        className="mt-2 pb-16"
        style={{ background: 'var(--color-navy)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 min-w-0">
              <SectionHeadingDark label="All destinations" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(otherDestinations.length > 0 ? otherDestinations : destinations).map((dest) => (
                  <DestinationCard
                    key={dest.id}
                    destination={dest}
                    isSelected={selectedDestination?.id === dest.id}
                    onClick={() => handleCardClick(dest)}
                    disabled={!canAddMore}
                  />
                ))}
              </div>
            </div>

            {/* Sidebar placeholder on dark section for layout alignment */}
            <div className="hidden lg:block lg:w-[22rem] flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Mobile wishlist sidebar (outside layout flow, below everything) */}
      <div className="lg:hidden px-4 py-6" style={{ background: 'var(--er-stone-50)' }}>
        <WishlistSidebar
          requests={requests}
          requestsNeedingDates={requestsNeedingDates}
          panelCollapsed={panelCollapsed}
          setPanelCollapsed={setPanelCollapsed}
          slotPct={slotPct}
          MAX_REQUESTS={MAX_REQUESTS}
          user={user}
          setView={setView}
          setEditingRequest={setEditingRequest}
          removeRequest={removeRequest}
        />
      </div>

      {/* Mini panel */}
      {selectedDestination && (
        <DestinationMiniPanel
          destination={selectedDestination}
          globalCheckIn={checkIn}
          globalCheckOut={checkOut}
          onAdd={handleMiniPanelAdd}
          onClose={() => setSelectedDestination(null)}
          onOpenAdvanced={handleMiniPanelAdvanced}
        />
      )}

      {/* Edit modal */}
      {editingRequest && (
        <EditRequestModal
          request={editingRequest}
          onClose={() => setEditingRequest(null)}
        />
      )}
    </div>
  );
}

/* ── Wishlist sidebar (extracted) ────────────────────────────────── */
function WishlistSidebar({
  requests,
  requestsNeedingDates,
  panelCollapsed,
  setPanelCollapsed,
  slotPct,
  MAX_REQUESTS,
  user,
  setView,
  setEditingRequest,
  removeRequest,
}: {
  requests: VacationRequest[];
  requestsNeedingDates: VacationRequest[];
  panelCollapsed: boolean;
  setPanelCollapsed: (v: boolean) => void;
  slotPct: number;
  MAX_REQUESTS: number;
  user: { memberType: string };
  setView: (v: string) => void;
  setEditingRequest: (r: VacationRequest | null) => void;
  removeRequest: (id: string) => void;
}) {
  return (
    <div className="lg:sticky lg:top-20">
      <div
        className="overflow-hidden"
        style={{
          borderRadius: 'var(--er-radius-2xl)',
          boxShadow: 'var(--er-shadow-md)',
          border: '1px solid var(--er-gray-200)',
        }}
      >
        {/* Dark header */}
        <button
          type="button"
          onClick={() => setPanelCollapsed(!panelCollapsed)}
          className="w-full text-left lg:cursor-default"
          style={{ background: 'var(--color-navy)', padding: '16px 20px 12px' }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <h3 style={{
              fontFamily: 'var(--er-font-serif)',
              fontWeight: 300,
              fontSize: '1rem',
              color: '#fff',
              margin: 0,
              letterSpacing: '-0.01em',
            }}>
              Your Wishlist
            </h3>
            <div className="flex items-center gap-3">
              <span
                className="tabular-nums"
                style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 500 }}
              >
                {requests.length} / {MAX_REQUESTS}
              </span>
              <span className="lg:hidden" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {panelCollapsed
                  ? <ChevronDown className="w-4 h-4" />
                  : <ChevronUp className="w-4 h-4" />}
              </span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-px overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '1px' }}>
            <div
              className="h-full wishlist-progress"
              style={{ width: `${slotPct}%`, background: 'var(--color-gold)', opacity: 0.7 }}
            />
          </div>
        </button>

        {/* Body */}
        <div
          className={panelCollapsed ? 'hidden lg:block' : 'block'}
          style={{ background: 'var(--er-white)' }}
        >
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            {requests.length === 0 ? (
              <div className="py-12 text-center">
                <div
                  className="w-12 h-12 flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'var(--er-gray-50)', borderRadius: 'var(--er-radius-full)' }}
                >
                  <Compass className="w-5 h-5" style={{ color: 'var(--er-gray-300)' }} />
                </div>
                <p
                  className="italic"
                  style={{
                    fontFamily: 'var(--er-font-serif)',
                    fontWeight: 300,
                    fontSize: '0.9375rem',
                    color: 'var(--er-gray-400)',
                    lineHeight: 1.5,
                    maxWidth: '14rem',
                    margin: '0 auto',
                  }}
                >
                  Your next great escape begins here.
                </p>
                <p
                  className="mt-2"
                  style={{
                    fontFamily: 'var(--er-font-sans)',
                    fontSize: '0.75rem',
                    color: 'var(--er-gray-400)',
                  }}
                >
                  Select a destination to add it.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {requests.map((req, index) => (
                  <RequestListItem
                    key={req.id}
                    request={req}
                    rank={index + 1}
                    onEdit={() => setEditingRequest(req)}
                    onRemove={() => removeRequest(req.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {requests.length > 0 && (
            <div className="px-4 pb-4 space-y-3">
              {requestsNeedingDates.length > 0 && (
                <div
                  className="flex items-start gap-2 px-3 py-2.5 text-xs"
                  style={{
                    background: 'rgba(217,119,6,0.06)',
                    border: '1px solid rgba(217,119,6,0.2)',
                    borderRadius: 'var(--er-radius-lg)',
                    color: '#92400e',
                    fontFamily: 'var(--er-font-sans)',
                  }}
                >
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-amber)' }} />
                  <span>
                    {requestsNeedingDates.length === 1
                      ? '1 request needs real dates.'
                      : `${requestsNeedingDates.length} requests need real dates.`}{' '}
                    Edit or continue and update in the next step.
                  </span>
                </div>
              )}
              <button
                onClick={() => setView('allocate-points')}
                className="w-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{
                  padding: '14px 16px',
                  background: 'linear-gradient(135deg, var(--color-gold-dark) 0%, var(--color-gold) 100%)',
                  color: '#fff',
                  borderRadius: 'var(--er-radius-xl)',
                  fontFamily: 'var(--er-font-sans)',
                  fontWeight: 500,
                  fontSize: '0.8125rem',
                  letterSpacing: '0.04em',
                }}
              >
                Continue to Allocate Points
                <ArrowRight className="w-4 h-4" />
              </button>
              {requests.length >= MAX_REQUESTS && (
                <p className="label-caps text-center" style={{ color: 'var(--er-gray-400)' }}>
                  {user.memberType === 'ultra' ? 'All 12 Ultra spots used' : 'Maximum 10 requests reached'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Section heading (light) ──────────────────────────────────────── */
function SectionHeading({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <p className="label-caps whitespace-nowrap" style={{ color: 'var(--er-gray-500)' }}>{label}</p>
      <div
        className="flex-1 h-px"
        style={{ background: 'linear-gradient(to right, rgba(201,169,110,0.3), transparent)' }}
      />
    </div>
  );
}

/* ── Section heading (dark) ───────────────────────────────────────── */
function SectionHeadingDark({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <p className="label-caps whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
      <div
        className="flex-1 h-px"
        style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.1), transparent)' }}
      />
    </div>
  );
}

/* ── Request list item ────────────────────────────────────────────── */
function RequestListItem({
  request,
  rank,
  onEdit,
  onRemove,
}: {
  request: VacationRequest;
  rank: number;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const nights = getNights(request.checkInDate, request.checkOutDate);
  const isReady = !request.isPlaceholderDates;

  return (
    <div
      className="flex gap-3 p-2.5 group transition-colors hover:bg-gray-50"
      style={{ borderRadius: 'var(--er-radius-lg)' }}
    >
      {/* Thumbnail with rank overlay */}
      <div
        className="relative w-12 h-12 overflow-hidden flex-shrink-0"
        style={{ borderRadius: 'var(--er-radius-sm)' }}
      >
        <img
          src={request.destination.imageUrl}
          alt={request.destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
        <span
          className="absolute inset-0 flex items-center justify-center tabular-nums"
          style={{ color: '#fff', fontSize: '0.6875rem', fontFamily: 'var(--er-font-sans)', fontWeight: 500 }}
        >
          {rank}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p
            className="truncate"
            style={{ fontFamily: 'var(--er-font-sans)', fontWeight: 500, fontSize: '0.8125rem', color: 'var(--er-slate-800)' }}
          >
            {request.destination.name}
          </p>
          <span
            className="flex-shrink-0 inline-block w-1.5 h-1.5"
            style={{ borderRadius: '50%', background: isReady ? '#34d399' : 'var(--color-amber)' }}
          />
        </div>
        <p
          className="mt-0.5 leading-snug"
          style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.6875rem', color: 'var(--er-gray-400)' }}
        >
          {request.flexibleDates && <span style={{ color: 'var(--color-gold)' }}>Flexible · </span>}
          {formatDateRange(request.checkInDate, request.checkOutDate)}
          <span style={{ color: 'var(--er-gray-300)' }}> · </span>
          {nights}n
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={onEdit}
          className="p-1.5 transition-colors hover:bg-gray-100"
          style={{ borderRadius: 'var(--er-radius-sm)', color: 'var(--er-gray-400)' }}
          aria-label="Edit"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 transition-colors"
          style={{ borderRadius: 'var(--er-radius-sm)', color: 'var(--er-gray-400)' }}
          aria-label="Remove"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ── Hero card (featured) ─────────────────────────────────────────── */
function HeroCard({
  destination,
  isSelected,
  onClick,
  disabled,
  variant = 'primary',
  fillHeight = false,
}: {
  destination: Destination;
  isSelected?: boolean;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  fillHeight?: boolean;
}) {
  const isPrimary = variant === 'primary';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="destination-card group text-left w-full overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        borderRadius: 'var(--er-radius-sm)',
        border: isSelected ? '1px solid var(--color-gold)' : '1px solid var(--er-gray-200)',
        boxShadow: isSelected ? '0 0 0 3px rgba(201,169,110,0.2)' : 'none',
        display: 'block',
        height: fillHeight ? '100%' : 'auto',
      }}
    >
      <div
        className="overflow-hidden relative"
        style={{
          aspectRatio: fillHeight ? undefined : isPrimary ? '16/10' : '16/9',
          height: fillHeight ? '100%' : undefined,
          minHeight: fillHeight ? '220px' : undefined,
        }}
      >
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Cinematic gradient — deeper bottom weight */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 45%, rgba(0,0,0,0) 100%)' }}
        />

        {/* Inset ring on select */}
        {isSelected && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: 'inset 0 0 0 2px rgba(201,169,110,0.7)', borderRadius: 'var(--er-radius-sm)' }}
          />
        )}

        {/* Bottom text */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <p
            style={{
              fontFamily: 'var(--er-font-serif)',
              fontWeight: 300,
              fontSize: isPrimary ? '1.875rem' : '1.375rem',
              color: '#fff',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {destination.name}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <MapPin className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.55)' }} />
            <span
              className="label-caps"
              style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em' }}
            >
              {destination.region}
            </span>
          </div>
          <div
            className="mt-3 inline-flex items-center gap-1.5 transition-all duration-200"
            style={{
              fontFamily: 'var(--er-font-sans)',
              fontSize: '0.75rem',
              fontWeight: 400,
              color: isSelected ? 'var(--color-gold-light)' : 'rgba(255,255,255,0)',
            }}
          >
            <span className="group-hover:text-gold-light transition-all duration-200" style={{ color: isSelected ? 'var(--color-gold-light)' : 'rgba(255,255,255,0.5)' }}>
              {isSelected ? '— close' : 'Request stay →'}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ── Destination card (all destinations — dark section) ───────────── */
function DestinationCard({
  destination,
  isSelected,
  onClick,
  disabled,
}: {
  destination: Destination;
  isSelected?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="destination-card group text-left w-full overflow-hidden transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        borderRadius: 'var(--er-radius-sm)',
        border: isSelected ? '1px solid var(--color-gold)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isSelected ? '0 0 0 3px rgba(201,169,110,0.2)' : 'none',
        display: 'block',
      }}
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0) 100%)' }}
        />

        {isSelected && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: 'inset 0 0 0 2px rgba(201,169,110,0.7)', borderRadius: 'var(--er-radius-sm)' }}
          />
        )}

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <p
            style={{
              fontFamily: 'var(--er-font-serif)',
              fontWeight: 300,
              fontSize: '1.125rem',
              color: '#fff',
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {destination.name}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.45)' }} />
            <span
              className="label-caps"
              style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.09em' }}
            >
              {destination.region}
            </span>
          </div>
          <div
            className="mt-2 transition-all duration-200"
            style={{
              fontFamily: 'var(--er-font-sans)',
              fontSize: '0.7rem',
              color: isSelected ? 'var(--color-gold-light)' : 'rgba(255,255,255,0)',
            }}
          >
            <span
              className="group-hover:opacity-100 transition-opacity duration-200"
              style={{ opacity: isSelected ? 1 : 0, color: 'var(--color-gold-light)' }}
            >
              {isSelected ? '— close' : 'Request stay →'}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
