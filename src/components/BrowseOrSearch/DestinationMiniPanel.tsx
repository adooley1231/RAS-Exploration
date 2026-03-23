import { useState, useEffect } from 'react';
import { X, Plus, Settings2, MapPin, CalendarDays } from 'lucide-react';
import { DateRangePicker } from '../RequestBuilder/DateRangePicker';
import { UnitSelector } from '../RequestBuilder/UnitSelector';
import { generateId } from '../../utils/helpers';
import type { Destination, VacationRequest, Unit } from '../../types';

interface DestinationMiniPanelProps {
  destination: Destination;
  globalCheckIn: Date | null;
  globalCheckOut: Date | null;
  onAdd: (request: VacationRequest) => void;
  onClose: () => void;
  onOpenAdvanced: (request: VacationRequest) => void;
}

export function DestinationMiniPanel({
  destination,
  globalCheckIn,
  globalCheckOut,
  onAdd,
  onClose,
  onOpenAdvanced,
}: DestinationMiniPanelProps) {
  const [checkIn, setCheckIn] = useState<Date | null>(globalCheckIn);
  const [checkOut, setCheckOut] = useState<Date | null>(globalCheckOut);
  const [preferredUnits, setPreferredUnits] = useState<Unit[]>([]);
  const [mustIncludeWeekend, setMustIncludeWeekend] = useState(false);

  useEffect(() => {
    if (!checkIn && globalCheckIn) setCheckIn(globalCheckIn);
    if (!checkOut && globalCheckOut) setCheckOut(globalCheckOut);
  }, [globalCheckIn, globalCheckOut]);

  const hasDates = checkIn && checkOut;

  const buildRequest = (): VacationRequest => ({
    id: generateId(),
    destination,
    checkInDate: checkIn!,
    checkOutDate: checkOut!,
    selectedUnit: preferredUnits[0] ?? null,
    preferredUnits: preferredUnits.length > 0 ? preferredUnits : undefined,
    flexibleDates: false,
    mustIncludeWeekend,
    pointsAllocated: 0,
    isPlaceholderDates: false,
  });

  const handleAdd = () => {
    if (!hasDates) return;
    onAdd(buildRequest());
  };

  const handleOpenAdvanced = () => {
    if (!hasDates) return;
    onOpenAdvanced(buildRequest());
  };

  return (
    <>
      {/* Blur backdrop */}
      <div
        className="fixed inset-0 z-40 bg-navy/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — wider to accommodate 2-month calendar, no overflow-hidden so calendar popup isn't clipped */}
      <div className="panel-enter fixed z-50 bottom-0 left-0 right-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-[44rem] sm:w-full bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl">

        {/* Cinematic image header — overflow-hidden scoped here only so calendar isn't clipped */}
        <div className="relative h-40 overflow-hidden rounded-t-3xl sm:rounded-t-2xl">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full transition-colors backdrop-blur-sm"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>

          {/* Destination info */}
          <div className="absolute bottom-4 left-5 right-14">
            <p className="font-serif text-[1.4rem] font-semibold text-white leading-tight">
              {destination.name}
            </p>
            <div className="flex items-center gap-1 text-white/60 text-xs mt-1">
              <MapPin className="w-3 h-3" />
              <span>{destination.region}</span>
            </div>
          </div>
        </div>

        {/* Date picker — outside scroll container so calendar popup renders freely */}
        <div className="px-5 pt-5">
          <DateRangePicker
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={(from, to) => {
              setCheckIn(from);
              setCheckOut(to);
            }}
            suggestedStartDay={destination.suggestedStartDay}
            destinationName={destination.name}
          />
        </div>

        {/* Scrollable lower section — unit selector, options, CTAs */}
        <div className="px-5 pb-5 pt-4 space-y-4 max-h-[40vh] overflow-y-auto">

          {/* Unit preference */}
          <div>
            <p className="label-caps text-slate-400 mb-2">Unit preference</p>
            <UnitSelector
              units={destination.units}
              value={preferredUnits}
              onChange={setPreferredUnits}
              destinationName={destination.name}
            />
          </div>

          {/* Options */}
          <div>
            <p className="label-caps text-slate-400 mb-2">Options</p>
            <label className="flex items-center gap-3 py-2.5 px-3 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 has-[:checked]:border-gold has-[:checked]:bg-gold/5 transition-all">
              <input
                type="checkbox"
                checked={mustIncludeWeekend}
                onChange={(e) => setMustIncludeWeekend(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-gold focus:ring-gold"
              />
              <CalendarDays className="w-3.5 h-3.5 text-gold flex-shrink-0" />
              <span className="text-sm text-navy">Must include weekend</span>
            </label>
          </div>

          {/* Primary CTA */}
          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!hasDates}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm tracking-wide transition-all ${
                hasDates
                  ? 'gold-gradient text-white hover:opacity-90 shadow-sm'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
              {hasDates ? 'Add to Wishlist' : 'Select dates to continue'}
            </button>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleOpenAdvanced}
                disabled={!hasDates}
                className={`flex items-center gap-1.5 text-xs transition-colors ${
                  hasDates ? 'text-slate-400 hover:text-navy' : 'text-slate-300 cursor-not-allowed'
                }`}
              >
                <Settings2 className="w-3.5 h-3.5" />
                Advanced options — min nights, notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
