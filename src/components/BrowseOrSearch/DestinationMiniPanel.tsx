import { useState, useEffect } from 'react';
import { X, Plus, Settings2, MapPin, CalendarDays, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format, addMonths, isBefore, startOfDay, differenceInDays } from 'date-fns';
import { UnitSelector } from '../RequestBuilder/UnitSelector';
import { generateId } from '../../utils/helpers';
import type { Destination, VacationRequest, Unit } from '../../types';

interface DateRange { from: Date | undefined; to: Date | undefined; }

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
  const [range, setRange] = useState<DateRange>({
    from: globalCheckIn ?? undefined,
    to: globalCheckOut ?? undefined,
  });
  const [preferredUnits, setPreferredUnits] = useState<Unit[]>([]);
  const [mustIncludeWeekend, setMustIncludeWeekend] = useState(false);

  const today = startOfDay(new Date());
  const minDate = today;
  const maxDate = addMonths(today, 12);

  // Lock body scroll while panel is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const isDateDisabled = (date: Date) =>
    isBefore(date, minDate) || isBefore(maxDate, date);

  const nights = range.from && range.to ? differenceInDays(range.to, range.from) : 0;
  const hasDates = !!(range.from && range.to);

  const buildRequest = (): VacationRequest => ({
    id: generateId(),
    destination,
    checkInDate: range.from!,
    checkOutDate: range.to!,
    selectedUnit: preferredUnits[0] ?? null,
    preferredUnits: preferredUnits.length > 0 ? preferredUnits : undefined,
    flexibleDates: false,
    mustIncludeWeekend,
    pointsAllocated: 0,
    isPlaceholderDates: false,
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-navy/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal — full height on mobile, centered on desktop */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
        <div
          className="pointer-events-auto w-full sm:max-w-[38rem] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col"
          style={{ maxHeight: '92vh' }}
        >
          {/* Image header */}
          <div className="relative h-36 flex-shrink-0 overflow-hidden rounded-t-3xl sm:rounded-t-2xl">
            <img
              src={destination.imageUrl}
              alt={destination.name}
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3.5 right-3.5 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full transition-colors backdrop-blur-sm"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
            <div className="absolute bottom-4 left-5 right-14">
              <p className="font-serif text-[1.35rem] font-semibold text-white leading-tight">
                {destination.name}
              </p>
              <div className="flex items-center gap-1 text-white/60 text-xs mt-0.5">
                <MapPin className="w-3 h-3" />
                <span>{destination.region}</span>
              </div>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-5">

            {/* Date summary row */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{
                background: hasDates ? 'rgba(201,169,110,0.06)' : 'var(--er-gray-50)',
                border: `1px solid ${hasDates ? 'rgba(201,169,110,0.25)' : 'var(--er-gray-200)'}`,
                borderRadius: 'var(--er-radius-lg)',
              }}
            >
              {hasDates ? (
                <>
                  <div className="flex-1 flex items-center gap-2">
                    <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--er-slate-800)' }}>
                      {format(range.from!, 'MMM d, yyyy')}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" style={{ color: 'var(--er-gray-400)' }} />
                    <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--er-slate-800)' }}>
                      {format(range.to!, 'MMM d, yyyy')}
                    </span>
                  </div>
                  <span
                    className="flex-shrink-0 px-2 py-0.5"
                    style={{
                      fontFamily: 'var(--er-font-sans)',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--color-gold-dark)',
                      background: 'rgba(201,169,110,0.12)',
                      borderRadius: 'var(--er-radius-full)',
                    }}
                  >
                    {nights} night{nights !== 1 ? 's' : ''}
                  </span>
                </>
              ) : (
                <>
                  <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', color: 'var(--er-gray-400)' }}>
                    {range.from ? `${format(range.from, 'MMM d')} → select check-out` : 'Select your travel dates below'}
                  </span>
                </>
              )}
            </div>

            {/* Inline calendar */}
            <div className="flex justify-center">
              <DayPicker
                mode="range"
                selected={range}
                onSelect={(r) => setRange({ from: r?.from, to: r?.to })}
                disabled={isDateDisabled}
                defaultMonth={range.from ?? minDate}
                numberOfMonths={1}
                showOutsideDays
                navLayout="around"
                components={{
                  Chevron: ({ orientation }) =>
                    orientation === 'left'
                      ? <ChevronLeft className="w-5 h-5 text-slate-500" />
                      : <ChevronRight className="w-5 h-5 text-slate-500" />,
                }}
                classNames={{
                  root: 'font-sans w-full',
                  months: 'flex justify-center',
                  month: 'grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr] gap-y-3 w-full',
                  month_caption: 'flex justify-center items-center h-10 col-start-2 row-start-1',
                  caption_label: 'font-serif text-base font-light text-navy',
                  nav: 'hidden',
                  button_previous: '!static col-start-1 row-start-1 w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:pointer-events-none self-center',
                  button_next: '!static col-start-3 row-start-1 w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:pointer-events-none self-center',
                  month_grid: 'col-span-3 row-start-2 w-full',
                  weekdays: 'grid grid-cols-7',
                  weekday: 'text-xs font-medium text-slate-400 text-center py-2',
                  week: 'grid grid-cols-7 mt-1',
                  day: 'text-center',
                  day_button: 'w-full aspect-square rounded-lg text-sm font-medium transition-colors hover:bg-slate-100 text-navy',
                  selected: '!bg-gold !text-white hover:!bg-gold-dark',
                  range_start: '!bg-gold !text-white rounded-l-lg rounded-r-none',
                  range_end: '!bg-gold !text-white rounded-r-lg rounded-l-none',
                  range_middle: '!bg-gold/15 !text-navy rounded-none',
                  today: 'font-bold text-gold',
                  outside: 'text-slate-300',
                  disabled: 'text-slate-200 cursor-not-allowed hover:bg-transparent',
                }}
              />
            </div>

            {/* Clear dates */}
            {hasDates && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setRange({ from: undefined, to: undefined })}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Clear dates
                </button>
              </div>
            )}

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

            {/* CTAs */}
            <div className="space-y-3 pb-2">
              <button
                type="button"
                onClick={() => hasDates && onAdd(buildRequest())}
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
                  onClick={() => hasDates && onOpenAdvanced(buildRequest())}
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
      </div>
    </>
  );
}
