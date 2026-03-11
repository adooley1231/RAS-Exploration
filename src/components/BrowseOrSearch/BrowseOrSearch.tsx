import { useState } from 'react';
import { MapPin, Sparkles, ArrowRight, ChevronUp, ChevronDown, AlertTriangle, Crown, X, Pencil, Trash2 } from 'lucide-react';
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

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-10">

        {/* ── Main browse content ─────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Ultra ribbon */}
          {user.memberType === 'ultra' && !bannerDismissed && (
            <div className="mb-6 ultra-shimmer gold-gradient rounded-xl">
              <div className="flex items-center gap-3 px-4 py-2.5">
                <Crown className="w-4 h-4 text-white/90 flex-shrink-0" />
                <p className="text-sm font-medium text-white flex-1">
                  <span className="font-semibold">Ultra Member</span>
                  {' '}— 12 request spots &amp; additional points to allocate
                </p>
                <button
                  type="button"
                  onClick={() => setBannerDismissed(true)}
                  className="text-white/60 hover:text-white transition-colors"
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

          {/* Date bar — minimal, integrated */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <p className="label-caps text-slate-400 whitespace-nowrap">Travel window</p>
              <div className="flex-1 h-px bg-slate-200" />
              <p className="text-xs text-slate-400 whitespace-nowrap hidden sm:block">
                Applies to new requests
              </p>
            </div>
            <div className="bg-white rounded-2xl px-5 py-4 border border-slate-100 card-shadow">
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

          {/* Featured section */}
          {featuredDestinations.length > 0 && (
            <section className="mb-14">
              <SectionHeading icon={<Sparkles className="w-3.5 h-3.5" />} label="Featured" />
              <div
                className={`grid gap-5 ${
                  featuredDestinations.length >= 3
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : featuredDestinations.length === 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1'
                }`}
              >
                {featuredDestinations.map((dest) => (
                  <HeroCard
                    key={dest.id}
                    destination={dest}
                    isSelected={selectedDestination?.id === dest.id}
                    onClick={() => handleCardClick(dest)}
                    disabled={!canAddMore}
                  />
                ))}
              </div>
            </section>
          )}

          {/* All destinations */}
          <section>
            <SectionHeading label="All destinations" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(otherDestinations.length > 0 ? otherDestinations : destinations).map((dest) => (
                <DestinationCard
                  key={dest.id}
                  destination={dest}
                  isSelected={selectedDestination?.id === dest.id}
                  onClick={() => handleCardClick(dest)}
                  showAvailableBadge={!!(dest.featured || dest.available)}
                  disabled={!canAddMore}
                />
              ))}
            </div>
          </section>
        </div>

        {/* ── Wishlist sidebar ────────────────────────────────────── */}
        <div className="lg:w-[22rem] flex-shrink-0">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl card-shadow border border-slate-200 overflow-hidden">

              {/* Dark header */}
              <button
                type="button"
                onClick={() => setPanelCollapsed(!panelCollapsed)}
                className="w-full bg-navy px-5 pt-4 pb-3 text-left lg:cursor-default"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-base font-medium text-white">Your Wishlist</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gold font-medium tabular-nums">
                      {requests.length} / {MAX_REQUESTS}
                    </span>
                    <span className="lg:hidden text-white/40">
                      {panelCollapsed
                        ? <ChevronDown className="w-4 h-4" />
                        : <ChevronUp className="w-4 h-4" />}
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold/70 rounded-full wishlist-progress"
                    style={{ width: `${slotPct}%` }}
                  />
                </div>
              </button>

              {/* Body */}
              <div className={`bg-white ${panelCollapsed ? 'hidden lg:block' : 'block'}`}>
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                  {requests.length === 0 ? (
                    <div className="py-10 text-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                        <MapPin className="w-5 h-5 text-slate-300" />
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed max-w-[16rem] mx-auto">
                        Select a destination below to start building your wishlist.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
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
                      <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span>
                          {requestsNeedingDates.length === 1
                            ? '1 request needs real dates.'
                            : `${requestsNeedingDates.length} requests need real dates.`}{' '}
                          Edit now or continue and update in the next step.
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => setView('allocate-points')}
                      className="w-full flex items-center justify-center gap-2 py-3.5 gold-gradient text-white rounded-xl font-medium text-sm tracking-wide hover:opacity-90 transition-opacity"
                    >
                      Continue to Allocate Points
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    {requests.length >= MAX_REQUESTS && (
                      <p className="label-caps text-center text-slate-400">
                        {user.memberType === 'ultra'
                          ? 'All 12 Ultra spots used'
                          : 'Maximum 10 requests reached'}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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

/* ── Section heading ──────────────────────────────────────────────── */
function SectionHeading({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {icon && <span className="text-gold">{icon}</span>}
      <p className="label-caps text-slate-500">{label}</p>
      <div className="flex-1 h-px bg-gradient-to-r from-gold/30 to-transparent" />
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
    <div className="flex gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
      {/* Thumbnail with rank overlay */}
      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={request.destination.imageUrl}
          alt={request.destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold">
          {rank}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-medium text-navy text-sm truncate">{request.destination.name}</p>
          <span className={`flex-shrink-0 inline-block w-1.5 h-1.5 rounded-full ${isReady ? 'bg-emerald-400' : 'bg-amber-400'}`} />
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
          {request.flexibleDates && <span className="text-gold">Flexible · </span>}
          {formatDateRange(request.checkInDate, request.checkOutDate)}
          <span className="text-slate-300"> · </span>
          {nights}n
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={onEdit}
          className="p-1.5 rounded-lg text-slate-400 hover:text-navy hover:bg-slate-100 transition-colors"
          aria-label="Edit"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 rounded-lg text-slate-400 hover:text-coral hover:bg-coral/5 transition-colors"
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
      className={`destination-card group text-left rounded-2xl overflow-hidden border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
        isSelected
          ? 'border-gold ring-2 ring-gold/40 shadow-lg'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="aspect-[16/9] overflow-hidden relative">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-gold/90 text-white label-caps rounded-full tracking-[0.08em]">
            {destination.available ? 'Available' : 'Featured'}
          </span>
        </div>

        {/* Selected ring inset */}
        {isSelected && (
          <div className="absolute inset-0 ring-2 ring-gold/60 ring-inset rounded-2xl pointer-events-none" />
        )}

        {/* Bottom text */}
        <div className="absolute bottom-4 left-4 right-4">
          <p className="font-serif text-[1.35rem] font-semibold text-white leading-tight">
            {destination.name}
          </p>
          <div className="flex items-center gap-1 text-white/70 text-xs mt-1">
            <MapPin className="w-3 h-3" />
            <span>{destination.region}</span>
          </div>
          <div className={`mt-3 inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200 ${isSelected ? 'text-gold' : 'text-white/60 group-hover:text-gold'}`}>
            {isSelected ? '— close' : '+ add request'}
          </div>
        </div>
      </div>
    </button>
  );
}

/* ── Destination card (standard grid) ────────────────────────────── */
function DestinationCard({
  destination,
  isSelected,
  onClick,
  showAvailableBadge,
  disabled,
}: {
  destination: Destination;
  isSelected?: boolean;
  onClick: () => void;
  showAvailableBadge?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`destination-card group text-left rounded-2xl overflow-hidden border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
        isSelected
          ? 'border-gold ring-2 ring-gold/40 shadow-lg'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Portrait image — no footer strip */}
      <div className="aspect-square overflow-hidden relative">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        {/* Available badge top-left */}
        {showAvailableBadge && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-0.5 bg-white/90 text-navy label-caps rounded-full tracking-[0.06em]">
              Available
            </span>
          </div>
        )}

        {/* Selected inset ring */}
        {isSelected && (
          <div className="absolute inset-0 ring-2 ring-gold/60 ring-inset rounded-2xl pointer-events-none" />
        )}

        {/* Bottom text */}
        <div className="absolute bottom-3.5 left-4 right-4">
          <p className="font-serif text-lg font-semibold text-white leading-tight truncate">
            {destination.name}
          </p>
          <div className="flex items-center gap-1 text-white/60 text-xs mt-0.5">
            <MapPin className="w-3 h-3" />
            <span>{destination.region}</span>
          </div>
          <div className={`mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200 ${isSelected ? 'text-gold' : 'text-white/0 group-hover:text-gold'}`}>
            {isSelected ? '— close' : '+ add request'}
          </div>
        </div>
      </div>
    </button>
  );
}
