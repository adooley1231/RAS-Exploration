import { useState } from 'react';
import { X, Edit2, FileText } from 'lucide-react';
import { useRAS } from '../../context/RASContext';
import { DestinationSelect } from '../RequestBuilder/DestinationSelect';
import { DateRangePicker } from '../RequestBuilder/DateRangePicker';
import { UnitSelector } from '../RequestBuilder/UnitSelector';
import { FlexibilityOptions } from '../RequestBuilder/FlexibilityOptions';
import { BoostIndicator } from '../shared/BoostIndicator';
import type { Destination, VacationRequest, Unit } from '../../types';
import { calculateTRVR, getWishListBoost } from '../../utils/helpers';

interface EditRequestModalProps {
  request: VacationRequest;
  onClose: () => void;
}

export function EditRequestModal({ request, onClose }: EditRequestModalProps) {
  const { state, updateRequest } = useRAS();
  const { user } = state;

  const [destination, setDestination] = useState<Destination>(request.destination);
  const [checkInDate, setCheckInDate] = useState<Date>(request.checkInDate);
  const [checkOutDate, setCheckOutDate] = useState<Date>(request.checkOutDate);
  const [preferredUnits, setPreferredUnits] = useState<Unit[]>(
    request.preferredUnits ?? (request.selectedUnit ? [request.selectedUnit] : [])
  );
  const [flexibleDates, setFlexibleDates] = useState(request.flexibleDates);
  const [mustIncludeWeekend, setMustIncludeWeekend] = useState(request.mustIncludeWeekend);
  const [minNights, setMinNights] = useState(request.minNights ?? 2);
  const [notes, setNotes] = useState(request.notes || '');

  const trvr = calculateTRVR(user, destination.id);
  const wishListBoost = getWishListBoost(user, destination.id);

  const isFormValid = destination && checkInDate && checkOutDate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !checkInDate || !checkOutDate) return;

    updateRequest({
      ...request,
      destination,
      checkInDate,
      checkOutDate,
      selectedUnit: preferredUnits[0] ?? null,
      preferredUnits: preferredUnits.length > 0 ? preferredUnits : undefined,
      flexibleDates,
      mustIncludeWeekend,
      pointsAllocated: request.pointsAllocated,
      minNights: minNights > 2 ? minNights : undefined,
      notes: notes.trim() || undefined,
      isPlaceholderDates: false,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-navy">Edit Request</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <DestinationSelect value={destination} onChange={setDestination} />

          {destination && (
            <div className="flex items-center gap-2">
              <BoostIndicator
                trvr={trvr || undefined}
                wishListBoost={wishListBoost}
                ultraBoost={user.memberType === 'ultra'}
              />
            </div>
          )}

          <UnitSelector
            units={destination?.units || []}
            value={preferredUnits}
            onChange={setPreferredUnits}
            disabled={!destination}
            destinationName={destination?.name}
          />

          <DateRangePicker
            checkIn={checkInDate}
            checkOut={checkOutDate}
            onChange={(from, to) => {
              if (from) setCheckInDate(from);
              if (to) setCheckOutDate(to);
            }}
            minNights={minNights}
            maxNights={14}
            suggestedStartDay={destination?.suggestedStartDay}
            destinationName={destination?.name}
          />

          <div>
            <label className="block text-sm font-medium text-navy mb-2">Minimum nights</label>
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
          </div>

          <FlexibilityOptions
            flexibleDates={flexibleDates}
            mustIncludeWeekend={mustIncludeWeekend}
            onFlexibleChange={setFlexibleDates}
            onWeekendChange={setMustIncludeWeekend}
          />

          <div>
            <label className="block text-sm font-medium text-navy mb-2">Notes (Optional)</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a note for this request..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 resize-none"
                rows={2}
                maxLength={200}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{notes.length}/200 characters</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-slate-200 text-navy rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${
                isFormValid
                  ? 'bg-navy text-white hover:bg-navy-light'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Edit2 className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
