import { useState, useEffect } from 'react';
import { Plus, ArrowRight, Trash2, Edit2, Home, FileText, Info, Coins } from 'lucide-react';
import { useRAS } from '../../context/RASContext';
import { DestinationSelect } from './DestinationSelect';
import { DateRangePicker } from './DateRangePicker';
import { UnitSelector } from './UnitSelector';
import { FlexibilityOptions } from './FlexibilityOptions';
import { BoostIndicator } from '../shared/BoostIndicator';
import { PointsBank } from '../shared/PointsBank';
import type { Destination, VacationRequest, Unit } from '../../types';
import {
  calculateTRVR,
  getWishListBoost,
  generateId,
  formatDateRange,
  getNights,
  formatUnitPreference,
  getMemberPoints,
  getPointsRemaining,
} from '../../utils/helpers';

const MAX_REQUESTS = 10;

export function RequestBuilder() {
  const { state, addRequest, updateRequest, removeRequest, setView, setBrowseDestination, setBrowseDateRange } = useRAS();
  const { user, requests, browseSelectedDestination, browseSelectedDateRange } = state;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [preferredUnits, setPreferredUnits] = useState<Unit[]>([]);
  const [flexibleDates, setFlexibleDates] = useState(false);
  const [mustIncludeWeekend, setMustIncludeWeekend] = useState(false);
  const [pointsAllocated, setPointsAllocated] = useState(0);
  const [minNights, setMinNights] = useState(2);
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setDestination(null);
    setCheckInDate(null);
    setCheckOutDate(null);
    setPreferredUnits([]);
    setFlexibleDates(false);
    setMustIncludeWeekend(false);
    setPointsAllocated(0);
    setMinNights(2);
    setNotes('');
  };

  // Pre-fill from Browse or Search step
  useEffect(() => {
    if (browseSelectedDestination && !editingId) {
      setDestination(browseSelectedDestination);
    }
  }, [browseSelectedDestination, editingId]);

  useEffect(() => {
    if (browseSelectedDateRange && !editingId) {
      setCheckInDate(browseSelectedDateRange.from);
      setCheckOutDate(browseSelectedDateRange.to);
    }
  }, [browseSelectedDateRange, editingId]);

  const handleDestinationChange = (newDestination: Destination) => {
    setDestination(newDestination);
    setPreferredUnits([]);
  };

  const handleEdit = (request: VacationRequest) => {
    setEditingId(request.id);
    setDestination(request.destination);
    setCheckInDate(request.checkInDate);
    setCheckOutDate(request.checkOutDate);
    setPreferredUnits(
      request.preferredUnits ?? (request.selectedUnit ? [request.selectedUnit] : [])
    );
    setFlexibleDates(request.flexibleDates);
    setMustIncludeWeekend(request.mustIncludeWeekend);
    setPointsAllocated(request.pointsAllocated);
    setMinNights(request.minNights ?? 2);
    setNotes(request.notes || '');
  };

  const handleDateChange = (newCheckIn: Date | null, newCheckOut: Date | null) => {
    setCheckInDate(newCheckIn);
    setCheckOutDate(newCheckOut);
  };

  const handleSubmit = () => {
    if (!destination || !checkInDate || !checkOutDate) return;

    const pointsRemaining = getPointsRemaining(user, requests);
    const maxPointsForThisRequest = editingId
      ? pointsRemaining +
        (requests.find((r) => r.id === editingId)?.pointsAllocated ?? 0)
      : pointsRemaining;
    const clampedPoints = Math.min(
      Math.max(0, pointsAllocated),
      maxPointsForThisRequest
    );

    const request: VacationRequest = {
      id: editingId || generateId(),
      destination,
      checkInDate,
      checkOutDate,
      selectedUnit: preferredUnits[0] ?? null,
      preferredUnits: preferredUnits.length > 0 ? preferredUnits : undefined,
      flexibleDates,
      mustIncludeWeekend,
      pointsAllocated: clampedPoints,
      minNights: minNights > 2 ? minNights : undefined,
      notes: notes.trim() || undefined,
    };

    if (editingId) {
      updateRequest(request);
    } else {
      addRequest(request);
      setBrowseDestination(null);
      setBrowseDateRange(null);
    }

    resetForm();
  };

  const canAddMore = requests.length < MAX_REQUESTS;
  const isFormValid = destination && checkInDate && checkOutDate;

  // Get TRVR and wish list info for selected destination
  const trvr = destination ? calculateTRVR(user, destination.id) : null;
  const wishListBoost = destination ? getWishListBoost(user, destination.id) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <PointsBank user={user} requests={requests} />
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <div className="bg-white rounded-2xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-navy">
                  {editingId ? 'Edit Request' : 'Add Request'}
                </h2>
                <p className="text-slate-500 mt-1">
                  {requests.length} of {MAX_REQUESTS} requests added
                </p>
              </div>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="text-sm text-slate-500 hover:text-navy transition-colors"
                >
                  Cancel edit
                </button>
              )}
            </div>

            {/* Context: points come in the next step */}
            <div className="mb-6 p-4 bg-gold/10 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-navy">
                  You have <strong className="tabular-nums">{getMemberPoints(user)} points</strong> to use this quarter.
                </p>
                <p className="text-sm text-navy-light mt-1">
                  Add your requests below. In the next step you’ll distribute your points across them to weight your favorites—more points on a request improves your odds for that one.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <DestinationSelect value={destination} onChange={handleDestinationChange} />

              {/* Boost indicators */}
              {destination && (
                <div className="flex items-center gap-2">
                  <BoostIndicator
                    trvr={trvr || undefined}
                    wishListBoost={wishListBoost}
                    ultraBoost={user.memberType === 'ultra'}
                  />
                </div>
              )}

              {/* Unit Selection */}
              <UnitSelector
                units={destination?.units || []}
                value={preferredUnits}
                onChange={setPreferredUnits}
                disabled={!destination}
                destinationName={destination?.name}
              />

              {/* Date Range Picker */}
              <DateRangePicker
                checkIn={checkInDate}
                checkOut={checkOutDate}
                onChange={handleDateChange}
                minNights={minNights}
                maxNights={14}
                suggestedStartDay={destination?.suggestedStartDay}
                destinationName={destination?.name}
              />

              {/* Minimum nights */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Minimum nights
                </label>
                <select
                  value={minNights}
                  onChange={(e) => setMinNights(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                >
                  {[2, 3, 4, 5, 7, 10, 14].map((n) => (
                    <option key={n} value={n}>
                      {n} night{n !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1.5">
                  Stays must be at least this many nights
                </p>
              </div>

              <FlexibilityOptions
                flexibleDates={flexibleDates}
                mustIncludeWeekend={mustIncludeWeekend}
                onFlexibleChange={setFlexibleDates}
                onWeekendChange={setMustIncludeWeekend}
              />

              {/* Notes field */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Notes (Optional)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add a note for this request (e.g., 'Anniversary trip', 'Family reunion')..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 resize-none"
                    rows={2}
                    maxLength={200}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">{notes.length}/200 characters</p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!isFormValid || (!editingId && !canAddMore)}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-premium ${
                  isFormValid && (editingId || canAddMore)
                    ? 'bg-navy text-white hover:bg-navy-light'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {editingId ? (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Update Request
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Request
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Continue button */}
          {requests.length > 0 && (
            <button
              onClick={() => setView('allocate-points')}
              className="w-full mt-4 flex items-center justify-center gap-2 py-4 gold-gradient text-white rounded-xl font-medium transition-premium hover:opacity-90"
            >
              Continue to Allocate Points
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Request List Section */}
        <div>
          <h2 className="font-serif text-2xl font-semibold text-navy mb-6">Your Requests</h2>

          {requests.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 card-shadow text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-serif text-xl text-navy mb-2">No requests yet</h3>
              <p className="text-slate-500">Add your first vacation request to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request, index) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  rank={index + 1}
                  totalPoints={getMemberPoints(user)}
                  onEdit={() => handleEdit(request)}
                  onRemove={() => removeRequest(request.id)}
                />
              ))}
            </div>
          )}

          {/* Progress indicator */}
          {requests.length > 0 && (
            <div className="mt-6 p-4 bg-white rounded-xl card-shadow">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Requests added</span>
                <span className="font-medium text-navy">
                  {requests.length} / {MAX_REQUESTS}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full gold-gradient rounded-full transition-all duration-300"
                  style={{ width: `${(requests.length / MAX_REQUESTS) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Extracted request card component for cleaner code
function RequestCard({
  request,
  rank,
  totalPoints,
  onEdit,
  onRemove,
}: {
  request: VacationRequest;
  rank: number;
  totalPoints: number;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const nights = getNights(request.checkInDate, request.checkOutDate);
  const pct = totalPoints > 0 ? Math.round((request.pointsAllocated / totalPoints) * 100) : 0;

  return (
    <div className="bg-white rounded-xl overflow-hidden card-shadow">
      <div className="relative">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md">
            <span className="text-sm font-bold text-navy">#{rank}</span>
          </div>
          <div className="px-2 py-1 bg-gold/20 text-gold-dark rounded-full text-xs font-semibold tabular-nums flex items-center gap-1">
            <Coins className="w-3 h-3" />
            {request.pointsAllocated} pts{pct > 0 ? ` (${pct}%)` : ''}
          </div>
        </div>

        {/* Image */}
        <div className="h-32 overflow-hidden">
          <img
            src={request.destination.imageUrl}
            alt={request.destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-navy">{request.destination.name}</h3>
        <p className="text-sm text-slate-500">{request.destination.region}</p>

        {/* Details */}
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-navy-light">
            <span className="font-medium">
              {formatDateRange(request.checkInDate, request.checkOutDate)}
            </span>
            <span className="text-slate-400">·</span>
            <span>{nights} nights</span>
          </div>

          <div className="flex items-center gap-2 text-navy-light">
            <Home className="w-4 h-4 text-gold" />
            <span>{formatUnitPreference(request)}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          {request.flexibleDates && (
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
              ±2 days flexible
            </span>
          )}
          {request.mustIncludeWeekend && (
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
              Weekend required
            </span>
          )}
          {request.minNights && request.minNights > 2 && (
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
              Min {request.minNights} nights
            </span>
          )}
        </div>

        {/* Notes */}
        {request.notes && (
          <p className="mt-3 text-sm text-slate-500 italic">"{request.notes}"</p>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-navy hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={onRemove}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-coral hover:bg-coral/5 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
