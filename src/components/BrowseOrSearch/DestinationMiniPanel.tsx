import { useState, useEffect } from 'react';
import { X, Plus, Settings2, MapPin, Calendar, ArrowRight, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format, addMonths, isBefore, startOfDay, differenceInDays } from 'date-fns';
import { UnitSelector } from '../RequestBuilder/UnitSelector';
import { generateId } from '../../utils/helpers';
import type { Destination, VacationRequest, Unit } from '../../types';

type PanelView = 'form' | 'dates';
interface DateRange { from: Date | undefined; to: Date | undefined; }

interface Props {
  destination: Destination;
  globalCheckIn: Date | null;
  globalCheckOut: Date | null;
  onAdd: (request: VacationRequest) => void;
  onClose: () => void;
  onOpenAdvanced: (request: VacationRequest) => void;
}

export function DestinationMiniPanel({
  destination, globalCheckIn, globalCheckOut, onAdd, onClose, onOpenAdvanced,
}: Props) {
  const [view, setView] = useState<PanelView>('form');
  const [range, setRange] = useState<DateRange>({
    from: globalCheckIn ?? undefined,
    to: globalCheckOut ?? undefined,
  });
  const [stagedRange, setStagedRange] = useState<DateRange>({
    from: globalCheckIn ?? undefined,
    to: globalCheckOut ?? undefined,
  });
  const [preferredUnits, setPreferredUnits] = useState<Unit[]>([]);
  const [mustIncludeWeekend, setMustIncludeWeekend] = useState(false);

  const today = startOfDay(new Date());
  const maxDate = addMonths(today, 12);
  const isDateDisabled = (d: Date) => isBefore(d, today) || isBefore(maxDate, d);

  const nights = range.from && range.to ? differenceInDays(range.to, range.from) : 0;
  const hasDates = !!(range.from && range.to);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const openDatePicker = () => {
    setStagedRange(range);
    setView('dates');
  };

  const confirmDates = () => {
    if (stagedRange.from && stagedRange.to) {
      setRange(stagedRange);
    }
    setView('form');
  };

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
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal shell */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none px-0 sm:px-4">
        <div
          className="pointer-events-auto w-full sm:max-w-[26rem] bg-white rounded-t-[1.5rem] sm:rounded-[1.25rem] shadow-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: '90vh' }}
        >
          {/* ── Sliding viewport ─────────────────────────────────────── */}
          {/* Container is 200% wide; transform slides between the two panels */}
          <div
            className="flex flex-col"
            style={{
              width: '200%',
              display: 'flex',
              flexDirection: 'row',
              transform: view === 'dates' ? 'translateX(-50%)' : 'translateX(0)',
              transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >

            {/* ══ PANEL 1: Main form ══════════════════════════════════ */}
            <div className="flex flex-col" style={{ width: '50%', flexShrink: 0 }}>

              {/* Image header */}
              <div className="relative h-36 flex-shrink-0 overflow-hidden">
                <img
                  src={destination.imageUrl}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                  style={{ transform: 'scale(1.04)' }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0) 100%)' }} />
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full transition-colors"
                  style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
                  aria-label="Close"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
                <div className="absolute bottom-3.5 left-4 right-10">
                  <p style={{ fontFamily: 'var(--er-font-serif)', fontWeight: 300, fontSize: '1.3rem', color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                    {destination.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    <MapPin className="w-2.5 h-2.5" />
                    <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.6875rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{destination.region}</span>
                  </div>
                </div>
              </div>

              {/* Form body */}
              <div className="flex flex-col flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-5 gap-3">

                {/* Date trigger row */}
                <button
                  type="button"
                  onClick={openDatePicker}
                  className="w-full flex items-center gap-3 transition-all group"
                  style={{
                    padding: '11px 14px',
                    border: `1px solid ${hasDates ? 'rgba(201,169,110,0.4)' : 'var(--er-gray-200)'}`,
                    borderRadius: 'var(--er-radius-lg)',
                    background: hasDates ? 'rgba(201,169,110,0.04)' : 'var(--er-gray-50)',
                  }}
                >
                  <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: hasDates ? 'var(--color-gold)' : 'var(--er-gray-400)' }} />
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    {hasDates ? (
                      <>
                        <span style={{ fontFamily: 'var(--er-font-serif)', fontWeight: 300, fontSize: '0.9375rem', color: 'var(--er-slate-800)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                          {format(range.from!, 'MMM d')}
                        </span>
                        <ArrowRight className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--er-gray-400)' }} />
                        <span style={{ fontFamily: 'var(--er-font-serif)', fontWeight: 300, fontSize: '0.9375rem', color: 'var(--er-slate-800)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                          {format(range.to!, 'MMM d, yyyy')}
                        </span>
                        <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--color-gold-dark)', background: 'rgba(201,169,110,0.12)', borderRadius: '99px', padding: '1px 8px', marginLeft: '2px', whiteSpace: 'nowrap' }}>
                          {nights}n
                        </span>
                      </>
                    ) : (
                      <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', color: 'var(--er-gray-400)' }}>
                        Select travel dates
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 opacity-40" style={{ color: 'var(--er-slate-700)' }} />
                </button>

                {/* Unit preference */}
                <div>
                  <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.6875rem', fontWeight: 500, color: 'var(--er-gray-400)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Unit Preference
                  </p>
                  <UnitSelector
                    units={destination.units}
                    value={preferredUnits}
                    onChange={setPreferredUnits}
                    destinationName={destination.name}
                  />
                </div>

                {/* Must include weekend */}
                <label
                  className="flex items-center gap-3 cursor-pointer transition-all"
                  style={{
                    padding: '10px 14px',
                    border: `1px solid ${mustIncludeWeekend ? 'rgba(201,169,110,0.35)' : 'var(--er-gray-200)'}`,
                    borderRadius: 'var(--er-radius-lg)',
                    background: mustIncludeWeekend ? 'rgba(201,169,110,0.04)' : 'transparent',
                  }}
                >
                  <div
                    className="w-4 h-4 flex-shrink-0 flex items-center justify-center transition-all"
                    style={{
                      borderRadius: '4px',
                      border: mustIncludeWeekend ? 'none' : '1.5px solid var(--er-gray-300)',
                      background: mustIncludeWeekend ? 'var(--color-gold)' : 'transparent',
                    }}
                  >
                    {mustIncludeWeekend && <X className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                  </div>
                  <input
                    type="checkbox"
                    checked={mustIncludeWeekend}
                    onChange={(e) => setMustIncludeWeekend(e.target.checked)}
                    className="sr-only"
                  />
                  <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" style={{ color: mustIncludeWeekend ? 'var(--color-gold)' : 'var(--er-gray-400)' }} />
                  <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', color: mustIncludeWeekend ? 'var(--er-slate-800)' : 'var(--er-gray-600)' }}>
                    Must include weekend
                  </span>
                </label>

                {/* CTA */}
                <div className="pt-1 space-y-2">
                  <button
                    type="button"
                    onClick={() => hasDates && onAdd(buildRequest())}
                    disabled={!hasDates}
                    className="w-full flex items-center justify-center gap-2 transition-all"
                    style={{
                      padding: '13px 16px',
                      borderRadius: 'var(--er-radius-lg)',
                      fontFamily: 'var(--er-font-sans)',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      letterSpacing: '0.02em',
                      background: hasDates
                        ? 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))'
                        : 'var(--er-gray-100)',
                      color: hasDates ? '#fff' : 'var(--er-gray-400)',
                      cursor: hasDates ? 'pointer' : 'not-allowed',
                      border: 'none',
                      boxShadow: hasDates ? '0 2px 12px rgba(168,135,60,0.3)' : 'none',
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    {hasDates ? 'Add to Wishlist' : 'Select dates to continue'}
                  </button>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => hasDates && onOpenAdvanced(buildRequest())}
                      disabled={!hasDates}
                      className="flex items-center gap-1.5 transition-colors"
                      style={{
                        fontFamily: 'var(--er-font-sans)',
                        fontSize: '0.75rem',
                        color: hasDates ? 'var(--er-gray-400)' : 'var(--er-gray-300)',
                        cursor: hasDates ? 'pointer' : 'not-allowed',
                        padding: '4px 8px',
                        background: 'none',
                        border: 'none',
                      }}
                    >
                      <Settings2 className="w-3 h-3" />
                      Advanced options
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ══ PANEL 2: Date picker ════════════════════════════════ */}
            <div className="flex flex-col" style={{ width: '50%', flexShrink: 0 }}>

              {/* Date picker header */}
              <div
                className="flex items-center justify-between px-4 py-3 flex-shrink-0"
                style={{ borderBottom: '1px solid var(--er-gray-100)' }}
              >
                <button
                  type="button"
                  onClick={() => setView('form')}
                  className="flex items-center gap-1.5 transition-colors"
                  style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-500)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <p style={{ fontFamily: 'var(--er-font-serif)', fontWeight: 300, fontSize: '1rem', color: 'var(--er-slate-800)', letterSpacing: '-0.01em', margin: 0 }}>
                  Travel Dates
                </p>
                <div style={{ width: '48px' }} />
              </div>

              {/* Selected range summary */}
              <div
                className="flex items-center justify-center gap-3 mx-4 mt-3"
                style={{
                  padding: '9px 14px',
                  background: stagedRange.from && stagedRange.to ? 'rgba(201,169,110,0.06)' : 'var(--er-gray-50)',
                  borderRadius: 'var(--er-radius-md)',
                  border: '1px solid var(--er-gray-100)',
                }}
              >
                {stagedRange.from && stagedRange.to ? (
                  <>
                    <span style={{ fontFamily: 'var(--er-font-serif)', fontWeight: 300, fontSize: '0.9375rem', color: 'var(--er-slate-800)' }}>
                      {format(stagedRange.from, 'MMM d')}
                    </span>
                    <ArrowRight className="w-3 h-3" style={{ color: 'var(--er-gray-400)' }} />
                    <span style={{ fontFamily: 'var(--er-font-serif)', fontWeight: 300, fontSize: '0.9375rem', color: 'var(--er-slate-800)' }}>
                      {format(stagedRange.to, 'MMM d')}
                    </span>
                    <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--color-gold-dark)', background: 'rgba(201,169,110,0.12)', borderRadius: '99px', padding: '1px 8px' }}>
                      {differenceInDays(stagedRange.to, stagedRange.from)}n
                    </span>
                  </>
                ) : stagedRange.from ? (
                  <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-400)' }}>
                    {format(stagedRange.from, 'MMM d')} → pick check-out
                  </span>
                ) : (
                  <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-400)' }}>
                    Pick a check-in date
                  </span>
                )}
              </div>

              {/* Calendar */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-3">
                <DayPicker
                  mode="range"
                  selected={stagedRange}
                  onSelect={(r) => setStagedRange({ from: r?.from, to: r?.to })}
                  disabled={isDateDisabled}
                  defaultMonth={stagedRange.from ?? today}
                  numberOfMonths={1}
                  showOutsideDays
                  navLayout="around"
                  components={{
                    Chevron: ({ orientation }) =>
                      orientation === 'left'
                        ? <ChevronLeft className="w-4 h-4" style={{ color: 'var(--er-gray-500)' }} />
                        : <ChevronRight className="w-4 h-4" style={{ color: 'var(--er-gray-500)' }} />,
                  }}
                  classNames={{
                    root: 'w-full',
                    months: 'flex justify-center',
                    month: 'grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr] gap-y-2 w-full',
                    month_caption: 'flex justify-center items-center h-9 col-start-2 row-start-1',
                    caption_label: 'text-sm font-light text-navy',
                    nav: 'hidden',
                    button_previous: '!static col-start-1 row-start-1 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-25 disabled:pointer-events-none self-center',
                    button_next: '!static col-start-3 row-start-1 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-25 disabled:pointer-events-none self-center',
                    month_grid: 'col-span-3 row-start-2 w-full',
                    weekdays: 'grid grid-cols-7',
                    weekday: 'text-[0.6875rem] font-medium text-slate-400 text-center py-1.5',
                    week: 'grid grid-cols-7 mt-0.5',
                    day: 'text-center',
                    day_button: 'w-full aspect-square rounded-md text-sm transition-colors hover:bg-slate-100 text-navy',
                    selected: '!bg-gold !text-white hover:!bg-gold-dark',
                    range_start: '!bg-gold !text-white rounded-l-md rounded-r-none',
                    range_end: '!bg-gold !text-white rounded-r-md rounded-l-none',
                    range_middle: '!bg-gold/15 !text-navy rounded-none',
                    today: 'font-semibold text-gold',
                    outside: 'text-slate-200',
                    disabled: 'text-slate-200 cursor-not-allowed hover:bg-transparent',
                  }}
                />
              </div>

              {/* Confirm */}
              <div className="px-4 pb-4 pt-2 flex-shrink-0 flex gap-2">
                {stagedRange.from && (
                  <button
                    type="button"
                    onClick={() => setStagedRange({ from: undefined, to: undefined })}
                    className="transition-colors"
                    style={{
                      padding: '11px 14px',
                      borderRadius: 'var(--er-radius-lg)',
                      border: '1px solid var(--er-gray-200)',
                      fontFamily: 'var(--er-font-sans)',
                      fontSize: '0.8125rem',
                      color: 'var(--er-gray-500)',
                      background: 'white',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={confirmDates}
                  disabled={!stagedRange.from || !stagedRange.to}
                  className="flex-1 transition-all"
                  style={{
                    padding: '11px 16px',
                    borderRadius: 'var(--er-radius-lg)',
                    fontFamily: 'var(--er-font-sans)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    background: stagedRange.from && stagedRange.to
                      ? 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))'
                      : 'var(--er-gray-100)',
                    color: stagedRange.from && stagedRange.to ? '#fff' : 'var(--er-gray-400)',
                    border: 'none',
                    cursor: stagedRange.from && stagedRange.to ? 'pointer' : 'not-allowed',
                    boxShadow: stagedRange.from && stagedRange.to ? '0 2px 10px rgba(168,135,60,0.25)' : 'none',
                  }}
                >
                  {stagedRange.from && stagedRange.to
                    ? `Confirm — ${differenceInDays(stagedRange.to, stagedRange.from)} nights`
                    : 'Select dates'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
