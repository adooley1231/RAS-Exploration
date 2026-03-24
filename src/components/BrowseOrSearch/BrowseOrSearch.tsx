import { useState, useEffect } from 'react';
import { MapPin, ArrowRight, ChevronUp, ChevronDown, AlertTriangle, Crown, X, Pencil, Trash2, Compass, LayoutGrid, List, Home, Search, ChevronLeft, Settings2 } from 'lucide-react';
import { addDays, addMonths, isBefore, startOfDay, differenceInDays } from 'date-fns';
import { useRAS } from '../../context/RASContext';
import { DateRangePicker } from '../RequestBuilder/DateRangePicker';
import { UnitSelector } from '../RequestBuilder/UnitSelector';
import { EditRequestModal } from './EditRequestModal';
import { PointsBank } from '../shared/PointsBank';
import { destinations } from '../../data/mockData';
import { formatDateRange, getNights, generateId } from '../../utils/helpers';
import type { AppView, AnnotationCalloutId, Destination, VacationRequest, Unit } from '../../types';

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

  const handleDetailAdd = (request: VacationRequest) => {
    addRequest(request);
    setSelectedDestination(null);
    setCheckIn(null);
    setCheckOut(null);
  };

  const handleDetailAdvanced = (request: VacationRequest) => {
    addRequest(request);
    setSelectedDestination(null);
    setEditingRequest(request);
  };

  const slotPct = Math.min((requests.length / MAX_REQUESTS) * 100, 100);

  const wishlistProps = {
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
  };

  const detailPanelProps = selectedDestination
    ? {
        destination: selectedDestination,
        checkIn,
        checkOut,
        onDateChange: (ci: Date | null, co: Date | null) => {
          setCheckIn(ci);
          setCheckOut(co);
        },
        onAdd: handleDetailAdd,
        onClose: () => setSelectedDestination(null),
        onOpenAdvanced: handleDetailAdvanced,
        canAddMore,
      }
    : null;

  const destinationBrowserContent = (
    <>
      {/* Search bar */}
      <div
        className="mb-8 flex flex-col sm:flex-row"
        style={{
          background: '#fff',
          border: '1px solid var(--er-gray-200)',
          borderRadius: 'var(--er-radius-xl)',
          boxShadow: 'var(--er-shadow-xs)',
        }}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 flex-1" style={{ borderBottom: '1px solid var(--er-gray-100)' }}>
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
        <div className="hidden sm:block w-px flex-shrink-0" style={{ background: 'var(--er-gray-100)' }} />
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

      {/* Featured strip */}
      {featuredDestinations.length > 0 && !searchQuery && (
        <div className="mb-10">
          <p className="label-caps mb-4" style={{ color: 'var(--er-gray-400)', letterSpacing: '0.11em' }}>Featured</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
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

      {/* All destinations */}
      <SectionHeadingDark
        label={searchQuery ? `Results for "${searchQuery}"` : 'All destinations'}
        viewMode={destViewMode}
        onToggleView={setDestViewMode}
      />

      {destViewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
    </>
  );

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh' }}>

      {/* Top context bar: Ultra ribbon + Points bank */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--er-gray-100)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3">
          {user.memberType === 'ultra' && !bannerDismissed && (
            <div
              className="ultra-shimmer"
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
      </div>

      {/* ── Desktop: two-column split pane ── */}
      <div className="hidden lg:flex max-w-7xl mx-auto">

        {/* LEFT: scrollable destination browser */}
        <div className="flex-1 min-w-0 px-6 py-8 pb-24">
          {destinationBrowserContent}
        </div>

        {/* RIGHT: sticky panel */}
        <div
          className="flex-shrink-0"
          style={{
            width: '380px',
            borderLeft: '1px solid var(--er-gray-100)',
            position: 'sticky',
            top: '96px',
            height: 'calc(100vh - 96px)',
            overflowY: 'auto',
            background: '#fff',
          }}
        >
          <div
            key={selectedDestination?.id ?? 'wishlist'}
            style={{ animation: 'fadeIn 0.18s ease' }}
          >
            {detailPanelProps ? (
              <DestinationDetailPanel {...detailPanelProps} />
            ) : (
              <WishlistSidebar {...wishlistProps} desktopMode />
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile: single-column layout ── */}
      <div className="lg:hidden px-4 py-6 pb-10">
        {destinationBrowserContent}
        <div className="mt-8">
          <WishlistSidebar {...wishlistProps} />
        </div>
      </div>

      {/* ── Mobile: destination detail bottom sheet ── */}
      {selectedDestination && detailPanelProps && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedDestination(null)}
          />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white overflow-y-auto"
            style={{ borderRadius: '20px 20px 0 0', maxHeight: '88vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <DestinationDetailPanel {...detailPanelProps} />
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editingRequest && (
        <EditRequestModal
          request={editingRequest}
          onClose={() => setEditingRequest(null)}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ── Destination Detail Panel (inline, replaces modal) ─────────────── */
function DestinationDetailPanel({
  destination,
  checkIn,
  checkOut,
  onDateChange,
  onAdd,
  onClose,
  onOpenAdvanced,
  canAddMore,
}: {
  destination: Destination;
  checkIn: Date | null;
  checkOut: Date | null;
  onDateChange: (ci: Date | null, co: Date | null) => void;
  onAdd: (request: VacationRequest) => void;
  onClose: () => void;
  onOpenAdvanced: (request: VacationRequest) => void;
  canAddMore: boolean;
}) {
  const [preferredUnits, setPreferredUnits] = useState<Unit[]>([]);
  const [mustIncludeWeekend, setMustIncludeWeekend] = useState(false);

  // Reset unit + weekend pref when destination changes
  useEffect(() => {
    setPreferredUnits([]);
    setMustIncludeWeekend(false);
  }, [destination.id]);

  const hasDates = !!(checkIn && checkOut);
  const nights = hasDates ? differenceInDays(checkOut!, checkIn!) : 0;
  const beds = bedroomRange(destination.units);

  const today = startOfDay(new Date());
  const maxDate = addMonths(today, 12);

  const buildRequest = (isPlaceholder: boolean): VacationRequest => {
    const effectiveCheckIn = checkIn ?? addDays(today, 30);
    const effectiveCheckOut = checkOut ?? addDays(today, 35);
    return {
      id: generateId(),
      destination,
      checkInDate: effectiveCheckIn,
      checkOutDate: effectiveCheckOut,
      selectedUnit: preferredUnits[0] ?? null,
      preferredUnits: preferredUnits.length > 0 ? preferredUnits : undefined,
      flexibleDates: false,
      mustIncludeWeekend,
      pointsAllocated: 0,
      isPlaceholderDates: isPlaceholder,
    };
  };

  const isDateDisabled = (d: Date) => isBefore(d, today) || isBefore(maxDate, d);
  void isDateDisabled; // used by DateRangePicker internally

  return (
    <div>
      {/* Hero image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.04) 100%)' }}
        />

        {/* Back button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 left-3.5 flex items-center gap-1 px-2.5 py-1.5 transition-opacity hover:opacity-80"
          style={{
            background: 'rgba(0,0,0,0.42)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--er-radius-full)',
            fontFamily: 'var(--er-font-sans)',
            fontSize: '0.6875rem',
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: '0.04em',
          }}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          All destinations
        </button>

        {/* Destination name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <h2
            style={{
              fontFamily: 'var(--er-font-serif)',
              fontWeight: 300,
              fontSize: '1.75rem',
              color: '#fff',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {destination.name}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <MapPin className="w-3 h-3" />
              <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {destination.region}
              </span>
            </div>
            {beds && (
              <div className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <Home className="w-3 h-3" />
                <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.6875rem' }}>{beds}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form content */}
      <div className="px-5 py-5 space-y-5">

        {/* Date range */}
        <div>
          <p
            className="label-caps mb-2"
            style={{ color: 'var(--er-gray-400)', letterSpacing: '0.1em' }}
          >
            Travel Dates
          </p>
          <DateRangePicker
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={onDateChange}
            minNights={2}
            maxNights={14}
            suggestedStartDay={destination.suggestedStartDay}
            destinationName={destination.name}
            hintText={null}
            compact
          />
        </div>

        {/* Unit preference */}
        {destination.units.length > 1 && (
          <div>
            <p
              className="label-caps mb-2"
              style={{ color: 'var(--er-gray-400)', letterSpacing: '0.1em' }}
            >
              Residence Preference
            </p>
            <UnitSelector
              units={destination.units}
              value={preferredUnits}
              onChange={setPreferredUnits}
              destinationName={destination.name}
            />
          </div>
        )}

        {/* Must include weekend */}
        <label
          className="flex items-center gap-3 cursor-pointer"
          style={{ paddingTop: '2px' }}
        >
          <div
            className="flex-shrink-0 w-4 h-4 flex items-center justify-center transition-colors"
            style={{
              border: mustIncludeWeekend ? '1px solid var(--color-gold)' : '1px solid var(--er-gray-300)',
              borderRadius: '3px',
              background: mustIncludeWeekend ? 'var(--color-gold)' : '#fff',
            }}
          >
            {mustIncludeWeekend && (
              <svg viewBox="0 0 12 12" fill="none" style={{ width: '8px', height: '8px' }}>
                <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <input
            type="checkbox"
            className="sr-only"
            checked={mustIncludeWeekend}
            onChange={(e) => setMustIncludeWeekend(e.target.checked)}
          />
          <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-slate-700)' }}>
            Must include a weekend
          </span>
        </label>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--er-gray-100)' }} />

        {/* Add to Wishlist CTA */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => onAdd(buildRequest(!hasDates))}
            disabled={!canAddMore}
            className="w-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              padding: '13px 16px',
              background: 'linear-gradient(135deg, var(--color-gold-dark) 0%, var(--color-gold) 100%)',
              color: '#fff',
              borderRadius: 'var(--er-radius-xl)',
              fontFamily: 'var(--er-font-sans)',
              fontWeight: 500,
              fontSize: '0.8125rem',
              letterSpacing: '0.04em',
            }}
          >
            {hasDates
              ? `Add to Wishlist — ${nights} night${nights !== 1 ? 's' : ''}`
              : 'Add to Wishlist'}
            <ArrowRight className="w-4 h-4 flex-shrink-0" />
          </button>

          {!hasDates && (
            <p
              className="text-center"
              style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.6875rem', color: 'var(--er-gray-400)' }}
            >
              No dates? We'll use a placeholder — update them in the next step.
            </p>
          )}

          <button
            type="button"
            onClick={() => onOpenAdvanced(buildRequest(!hasDates))}
            className="w-full flex items-center justify-center gap-1.5 py-2 transition-colors hover:bg-gray-50"
            style={{
              borderRadius: 'var(--er-radius-lg)',
              fontFamily: 'var(--er-font-sans)',
              fontSize: '0.75rem',
              color: 'var(--er-gray-500)',
            }}
          >
            <Settings2 className="w-3.5 h-3.5" />
            Advanced options
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Wishlist sidebar ──────────────────────────────────────────────── */
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
  desktopMode,
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
  desktopMode?: boolean;
}) {
  if (desktopMode) {
    // Desktop: clean flat panel with no card chrome
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--er-gray-100)' }}
        >
          <div>
            <h3
              style={{
                fontFamily: 'var(--er-font-serif)',
                fontWeight: 300,
                fontSize: '1rem',
                color: 'var(--er-slate-800)',
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              Your Wishlist
            </h3>
            <p
              className="mt-0.5 label-caps"
              style={{ color: 'var(--er-gray-400)', letterSpacing: '0.06em' }}
            >
              {requests.length} of {MAX_REQUESTS} slots used
            </p>
          </div>
          {requests.length > 0 && (
            <div
              className="tabular-nums"
              style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 500 }}
            >
              {requests.length}/{MAX_REQUESTS}
            </div>
          )}
        </div>

        {/* Progress bar */}
        {requests.length > 0 && (
          <div
            className="flex-shrink-0 mx-5 mb-0"
            style={{ height: '2px', background: 'var(--er-gray-100)', borderRadius: '1px', marginTop: '-1px' }}
          >
            <div
              style={{
                width: `${slotPct}%`,
                height: '100%',
                background: 'var(--color-gold)',
                opacity: 0.7,
                borderRadius: '1px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {requests.length === 0 ? (
            <div className="py-16 px-5 text-center">
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
                style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-400)' }}
              >
                Select a destination to add it.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-1">
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

        {/* Footer CTA */}
        {requests.length > 0 && (
          <div
            className="flex-shrink-0 px-4 pb-4 pt-3 space-y-3"
            style={{ borderTop: '1px solid var(--er-gray-100)' }}
          >
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
    );
  }

  // Mobile: card-style panel (unchanged from original)
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
          <div className="h-px overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '1px' }}>
            <div
              className="h-full wishlist-progress"
              style={{ width: `${slotPct}%`, background: 'var(--color-gold)', opacity: 0.7 }}
            />
          </div>
        </button>

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
                  style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-400)' }}
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

/* ── Section heading ──────────────────────────────────────────────── */
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

/* ── Featured strip card ──────────────────────────────────────────── */
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

/* ── Destination list row ─────────────────────────────────────────── */
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
        border: isSelected ? '1px solid var(--color-gold)' : '1px solid var(--er-gray-200)',
        boxShadow: isSelected ? '0 0 0 3px rgba(201,169,110,0.2)' : 'none',
        background: isSelected ? 'rgba(201,169,110,0.08)' : '#fff',
      }}
    >
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
          </div>
        </div>

        <div className="flex-shrink-0">
          <span
            className="transition-opacity duration-200 whitespace-nowrap"
            style={{
              fontFamily: 'var(--er-font-sans)',
              fontSize: '0.75rem',
              opacity: isSelected ? 1 : 0,
              color: 'var(--color-gold-light)',
            }}
          >
            {isSelected ? '— close' : 'Request stay →'}
          </span>
        </div>
      </div>
    </button>
  );
}

/* ── Destination card (grid view) ─────────────────────────────────── */
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
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
              <MapPin className="w-2.5 h-2.5" />
              <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.6875rem', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                {destination.region}
              </span>
            </div>
            <p
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.6875rem', color: 'var(--color-gold)', fontWeight: 500 }}
            >
              Request &rarr;
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
