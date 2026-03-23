import { useState } from 'react';
import { MapPin, ArrowRight, ChevronUp, ChevronDown, AlertTriangle, Crown, X, Pencil, Trash2, Compass, LayoutGrid, List, Home, Search } from 'lucide-react';
import { useRAS } from '../../context/RASContext';
import { DateRangePicker } from '../RequestBuilder/DateRangePicker';
import { EditRequestModal } from './EditRequestModal';
import { DestinationMiniPanel } from './DestinationMiniPanel';
import { PointsBank } from '../shared/PointsBank';
import { destinations } from '../../data/mockData';
import { formatDateRange, getNights } from '../../utils/helpers';
import type { AppView, AnnotationCalloutId, Destination, VacationRequest } from '../../types';

export function BrowseOrSearch() {
  const { state, setView, addRequest, removeRequest, openAnnotationCallout } = useRAS();
  const { user, requests } = state;

  const MAX_REQUESTS = user.memberType === 'ultra' ? 12 : 10;

  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [editingRequest, setEditingRequest] = useState<VacationRequest | null>(null);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [destViewMode, setDestViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredDestinations = destinations.filter((d) => d.featured || d.available);
  const allOtherDestinations = destinations.filter((d) => !d.featured && !d.available);
  const otherDestinations = searchQuery.trim()
    ? destinations.filter((d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.region.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allOtherDestinations;
  const canAddMore = requests.length < MAX_REQUESTS;
  const requestsNeedingDates = requests.filter((r) => r.isPlaceholderDates);

  const handleCardClick = (dest: Destination) => {
    if (!canAddMore) return;
    setSelectedDestination((prev) => (prev?.id === dest.id ? null : dest));
  };

  const handleMiniPanelAdd = (request: VacationRequest) => {
    addRequest(request);
    setSelectedDestination(null);
    setCheckIn(null);
    setCheckOut(null);
  };

  const handleMiniPanelAdvanced = (request: VacationRequest) => {
    addRequest(request);
    setSelectedDestination(null);
    setEditingRequest(request);
  };

  const slotPct = Math.min((requests.length / MAX_REQUESTS) * 100, 100);

  return (
    <div className="relative">

      {/* ── Light section: Points bank only (compact) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-6">

        {/* Ultra ribbon */}
        {user.memberType === 'ultra' && !bannerDismissed && (
          <div
            className="mb-4 ultra-shimmer"
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

        <PointsBank user={user} requests={requests} />
      </div>

      {/* ── Dark section: search + dates + destinations ── */}
      <div
        className="mt-0 pb-16"
        style={{ background: '#F0E8DC' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">

          {/* Search + dates bar — dark frosted */}
          <div
            className="mb-8 flex flex-col sm:flex-row"
            style={{
              background: 'rgba(255,255,255,0.75)',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 'var(--er-radius-xl)',
            }}
          >
            {/* Search */}
            <div className="flex items-center gap-3 px-4 py-3.5 flex-1" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--er-gray-400)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations or regions…"
                className="flex-1 outline-none bg-transparent"
                style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', color: 'var(--er-slate-800)' }}
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} style={{ color: 'var(--er-gray-400)' }}>
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px flex-shrink-0" style={{ background: 'rgba(0,0,0,0.08)' }} />

            {/* Date picker */}
            <div className="sm:w-72 flex-shrink-0 px-4 py-2.5" style={{ position: 'relative' }}>
              <DateRangePicker
                checkIn={checkIn}
                checkOut={checkOut}
                onChange={(from, to) => { setCheckIn(from); setCheckOut(to); }}
                hintText={null}
                compact
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 min-w-0">
              <SectionHeadingDark
                label="All destinations"
                viewMode={destViewMode}
                onToggleView={setDestViewMode}
              />

              {/* ── Featured strip ── */}
              {featuredDestinations.length > 0 && (
                <div className="mb-10">
                  <p className="label-caps mb-4" style={{ color: 'var(--er-gray-500)', letterSpacing: '0.11em' }}>Featured</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {featuredDestinations.slice(0, 3).map((dest) => (
                      <FeaturedStripCard
                        key={dest.id}
                        destination={dest}
                        isSelected={selectedDestination?.id === dest.id}
                        onClick={() => handleCardClick(dest)}
                        disabled={!canAddMore}
                      />
                    ))}
                  </div>
                </div>
              )}

              {destViewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {otherDestinations.length > 0 ? otherDestinations.map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      isSelected={selectedDestination?.id === dest.id}
                      onClick={() => handleCardClick(dest)}
                      disabled={!canAddMore}
                    />
                  )) : (
                    <div className="col-span-3 py-16 text-center">
                      <p style={{ fontFamily: 'var(--er-font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: '1.125rem', color: 'var(--er-gray-400)' }}>
                        No destinations match "{searchQuery}"
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {otherDestinations.length > 0 ? otherDestinations.map((dest) => (
                    <DestinationListRow
                      key={dest.id}
                      destination={dest}
                      isSelected={selectedDestination?.id === dest.id}
                      onClick={() => handleCardClick(dest)}
                      disabled={!canAddMore}
                    />
                  )) : (
                    <div className="py-16 text-center">
                      <p style={{ fontFamily: 'var(--er-font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: '1.125rem', color: 'var(--er-gray-400)' }}>
                        No destinations match "{searchQuery}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist sidebar in dark section */}
            <div className="hidden lg:block lg:w-[22rem] flex-shrink-0">
              <div className="lg:sticky lg:top-20">
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
                  openAnnotationCallout={openAnnotationCallout}
                />
              </div>
            </div>
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
          openAnnotationCallout={openAnnotationCallout}
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
  openAnnotationCallout,
}: {
  requests: VacationRequest[];
  requestsNeedingDates: VacationRequest[];
  panelCollapsed: boolean;
  setPanelCollapsed: (v: boolean) => void;
  slotPct: number;
  MAX_REQUESTS: number;
  user: { memberType: string };
  setView: (v: AppView) => void;
  setEditingRequest: (r: VacationRequest | null) => void;
  removeRequest: (id: string) => void;
  openAnnotationCallout: (id: AnnotationCalloutId) => void;
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
          style={{ background: 'var(--er-slate-800)', padding: '16px 20px 12px' }}
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
              <span className="lg:hidden" style={{ color: 'var(--er-gray-400)' }}>
                {panelCollapsed
                  ? <ChevronDown className="w-4 h-4" />
                  : <ChevronUp className="w-4 h-4" />}
              </span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-px overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '1px' }}>
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
                onClick={() => {
                  setView('allocate-points');
                  openAnnotationCallout('member-continue-allocate');
                }}
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
/* ── Featured strip card (dark section) ──────────────────────────── */
function FeaturedStripCard({
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
  const beds = bedroomRange(destination.units);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="destination-card group text-left w-full overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        borderRadius: 'var(--er-radius-sm)',
        border: isSelected ? '1px solid var(--color-gold)' : '1px solid rgba(0,0,0,0.08)',
        boxShadow: isSelected ? '0 0 0 3px rgba(201,169,110,0.2)' : 'none',
      }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0) 100%)' }}
        />
        {isSelected && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: 'inset 0 0 0 2px rgba(201,169,110,0.7)', borderRadius: 'var(--er-radius-sm)' }}
          />
        )}
        {destination.demandTier === 'super-peak' && (
          <div
            className="absolute top-2.5 left-2.5 px-2 py-0.5"
            style={{
              background: 'rgba(194,65,12,0.82)',
              backdropFilter: 'blur(6px)',
              borderRadius: 'var(--er-radius-full)',
              fontFamily: 'var(--er-font-sans)',
              fontSize: '0.625rem',
              fontWeight: 500,
              color: '#fff',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            High Demand
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p style={{
            fontFamily: 'var(--er-font-serif)',
            fontWeight: 300,
            fontSize: '1.125rem',
            color: '#fff',
            letterSpacing: '-0.01em',
            lineHeight: 1.15,
          }}>
            {destination.name}
          </p>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
              <MapPin className="w-2.5 h-2.5" />
              <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.6875rem', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                {destination.region}
              </span>
            </div>
            {beds && (
              <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.6875rem', color: 'rgba(255,255,255,0.45)' }}>
                {beds}
              </span>
            )}
          </div>
          <p
            className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 500 }}
          >
            Request stay &rarr;
          </p>
        </div>
      </div>
    </button>
  );
}


/* ── Section heading (dark) ───────────────────────────────────────── */
function SectionHeadingDark({
  label,
  viewMode,
  onToggleView,
}: {
  label: string;
  viewMode?: 'grid' | 'list';
  onToggleView?: (mode: 'grid' | 'list') => void;
}) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <p className="label-caps whitespace-nowrap" style={{ color: 'var(--er-gray-400)' }}>{label}</p>
      <div
        className="flex-1 h-px"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.1), transparent)' }}
      />
      {viewMode && onToggleView && (
        <div
          className="flex items-center gap-0.5 flex-shrink-0"
          style={{ background: 'rgba(0,0,0,0.06)', borderRadius: 'var(--er-radius-sm)', padding: '3px' }}
        >
          <button
            type="button"
            onClick={() => onToggleView('grid')}
            className="flex items-center justify-center w-7 h-7 transition-colors"
            style={{
              borderRadius: '3px',
              background: viewMode === 'grid' ? 'rgba(0,0,0,0.10)' : 'transparent',
              color: viewMode === 'grid' ? 'var(--er-slate-800)' : 'var(--er-gray-400)',
            }}
            title="Grid view"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onToggleView('list')}
            className="flex items-center justify-center w-7 h-7 transition-colors"
            style={{
              borderRadius: '3px',
              background: viewMode === 'list' ? 'rgba(0,0,0,0.10)' : 'transparent',
              color: viewMode === 'list' ? 'var(--er-slate-800)' : 'var(--er-gray-400)',
            }}
            title="List view"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
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

/* ── Helpers ──────────────────────────────────────────────────────── */
function bedroomRange(units: { bedrooms: number }[]): string | null {
  if (!units.length) return null;
  const beds = units.map((u) => u.bedrooms);
  const min = Math.min(...beds);
  const max = Math.max(...beds);
  return min === max ? `${min} bed${min !== 1 ? 's' : ''}` : `${min}–${max} beds`;
}

/* ── Destination list row (list view) ────────────────────────────── */
function DestinationListRow({
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
  const beds = bedroomRange(destination.units);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="destination-card group text-left w-full overflow-hidden transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-stretch"
      style={{
        borderRadius: 'var(--er-radius-sm)',
        border: isSelected ? '1px solid var(--color-gold)' : '1px solid rgba(0,0,0,0.07)',
        boxShadow: isSelected ? '0 0 0 3px rgba(201,169,110,0.2)' : 'none',
        background: isSelected ? 'rgba(201,169,110,0.10)' : 'rgba(255,255,255,0.55)',
      }}
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-28 sm:w-36 overflow-hidden" style={{ minHeight: '80px' }}>
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {isSelected && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: 'inset 0 0 0 2px rgba(201,169,110,0.7)' }}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex items-center px-4 py-3 min-w-0 gap-4">
        <div className="flex-1 min-w-0">
          <p
            style={{
              fontFamily: 'var(--er-font-serif)',
              fontWeight: 300,
              fontSize: '1.0625rem',
              color: 'var(--er-slate-800)',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {destination.name}
          </p>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <div className="flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 flex-shrink-0" style={{ color: 'var(--er-gray-400)' }} />
              <span className="label-caps" style={{ color: 'var(--er-gray-400)', letterSpacing: '0.09em' }}>
                {destination.region}
              </span>
            </div>
            {destination.units.length > 0 && (
              <div className="flex items-center gap-1">
                <Home className="w-2.5 h-2.5 flex-shrink-0" style={{ color: 'var(--er-gray-400)' }} />
                <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.6875rem', color: 'var(--er-gray-400)' }}>
                  {destination.units.length} {destination.units.length === 1 ? 'residence' : 'residences'}
                  {beds ? ` · ${beds}` : ''}
                </span>
              </div>
            )}
            {destination.demandTier === 'super-peak' && (
              <span
                style={{
                  fontFamily: 'var(--er-font-sans)',
                  fontSize: '0.5625rem',
                  fontWeight: 500,
                  color: 'rgb(251,146,60)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                High Demand
              </span>
            )}
          </div>
        </div>

        {/* CTA */}
        <div
          className="flex-shrink-0 transition-all duration-200"
          style={{
            fontFamily: 'var(--er-font-sans)',
            fontSize: '0.75rem',
            color: isSelected ? 'var(--color-gold-dark)' : 'transparent',
          }}
        >
          <span
            className="group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
            style={{ opacity: isSelected ? 1 : 0, color: 'var(--color-gold-light)' }}
          >
            {isSelected ? '— close' : 'Request stay →'}
          </span>
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
        border: isSelected ? '1px solid var(--color-gold)' : '1px solid rgba(0,0,0,0.09)',
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

        {/* Demand badge — super-peak only */}
        {destination.demandTier === 'super-peak' && (
          <div
            className="absolute top-2.5 left-2.5 px-2 py-0.5"
            style={{
              background: 'rgba(194,65,12,0.82)',
              backdropFilter: 'blur(6px)',
              borderRadius: 'var(--er-radius-full)',
              fontFamily: 'var(--er-font-sans)',
              fontSize: '0.5625rem',
              fontWeight: 500,
              color: '#fff',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            High Demand
          </div>
        )}

        {/* Residence count badge */}
        {destination.units.length > 0 && (
          <div
            className="absolute top-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5"
            style={{
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(6px)',
              borderRadius: 'var(--er-radius-full)',
              fontFamily: 'var(--er-font-sans)',
              fontSize: '0.625rem',
              color: 'rgba(255,255,255,0.8)',
              letterSpacing: '0.03em',
            }}
          >
            <Home className="w-2 h-2" style={{ opacity: 0.7 }} />
            {destination.units.length} {destination.units.length === 1 ? 'residence' : 'residences'}
          </div>
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
