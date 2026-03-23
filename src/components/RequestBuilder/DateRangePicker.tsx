import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, addMonths, addDays, isBefore, startOfDay, differenceInDays, getDay } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import 'react-day-picker/style.css';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface DateRangePickerProps {
  checkIn: Date | null;
  checkOut: Date | null;
  onChange: (checkIn: Date | null, checkOut: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  minNights?: number;
  maxNights?: number;
  /** Suggested check-in day (0=Sunday) for popular destinations. */
  suggestedStartDay?: number;
  /** Destination name for hint text. */
  destinationName?: string;
  /** Override the default "Stays must be N-N nights" hint. Pass null to hide it. */
  hintText?: string | null;
}

export function DateRangePicker({
  checkIn,
  checkOut,
  onChange,
  minDate,
  maxDate,
  minNights = 2,
  maxNights = 14,
  suggestedStartDay,
  destinationName,
  hintText,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<DateRange>({
    from: checkIn || undefined,
    to: checkOut || undefined,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const today = startOfDay(new Date());
  const effectiveMinDate = minDate || today;
  const effectiveMaxDate = maxDate || addMonths(today, 12);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setRange({
      from: checkIn || undefined,
      to: checkOut || undefined,
    });
  }, [checkIn, checkOut]);

  const handleSelect = (
    newRange: { from?: Date; to?: Date } | undefined,
    _triggerDate: Date
  ) => {
    if (!newRange) {
      setRange({ from: undefined, to: undefined });
      return;
    }

    setRange({ from: newRange.from, to: newRange.to });
    // Calendar stays open — user confirms via the "Confirm dates" button below.
  };

  const isDateDisabled = (date: Date) => {
    if (isBefore(date, effectiveMinDate) || isBefore(effectiveMaxDate, date)) {
      return true;
    }
    return false;
  };

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;

  const getNextSuggestedDay = (): Date | null => {
    if (suggestedStartDay == null) return null;
    const d = startOfDay(new Date());
    const currentDay = getDay(d);
    let daysUntil = (suggestedStartDay - currentDay + 7) % 7;
    if (daysUntil === 0) daysUntil = 7;
    const next = addDays(d, daysUntil);
    return isBefore(next, effectiveMaxDate) ? next : null;
  };

  const nextSuggestedDate = getNextSuggestedDay();
  const suggestedDayName = suggestedStartDay != null ? DAY_NAMES[suggestedStartDay] : null;

  const handleQuickSelectNextSuggested = () => {
    if (nextSuggestedDate) {
      const checkOut = addDays(nextSuggestedDate, minNights);
      if (!isBefore(effectiveMaxDate, checkOut)) {
        onChange(nextSuggestedDate, checkOut);
        setIsOpen(false);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-navy mb-2">Travel Dates</label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 px-4 py-3 bg-white border rounded-xl transition-premium ${
          isOpen ? 'border-gold ring-2 ring-gold/20' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <Calendar className="w-5 h-5 text-gold flex-shrink-0" />
        <div className="flex-1 flex items-center gap-2">
          {checkIn && checkOut ? (
            <>
              <span className="font-medium text-navy">{format(checkIn, 'MMM d, yyyy')}</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-navy">{format(checkOut, 'MMM d, yyyy')}</span>
              <span className="text-sm text-slate-500 ml-2">
                ({nights} night{nights !== 1 ? 's' : ''})
              </span>
            </>
          ) : checkIn ? (
            <>
              <span className="font-medium text-navy">{format(checkIn, 'MMM d, yyyy')}</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400">Select check-out</span>
            </>
          ) : (
            <span className="text-slate-400">Select check-in and check-out dates</span>
          )}
        </div>
      </button>

      {/* Stay length hint */}
      <div className="mt-1.5 space-y-1">
        {hintText !== null && (
          <p className="text-xs text-slate-500">
            {hintText ?? `Stays must be ${minNights}–${maxNights} nights`}
          </p>
        )}
        {suggestedDayName && (
          <p className="text-xs text-gold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {destinationName
              ? `Suggested check-in: ${suggestedDayName}s for ${destinationName}`
              : `Popular check-in: ${suggestedDayName}s`}
          </p>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 p-5 min-w-[320px]">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            disabled={isDateDisabled}
            defaultMonth={range.from || effectiveMinDate}
            numberOfMonths={2}
            showOutsideDays
            navLayout="around"
            components={{
              Chevron: ({ orientation }) =>
                orientation === 'left' ? (
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                ),
            }}
            classNames={{
              root: 'font-sans',
              months: 'flex gap-8',
              month: 'grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr] gap-y-4 flex-1 min-w-0',
              month_caption: 'flex justify-center items-center h-11 col-start-2 row-start-1',
              caption_label: 'font-serif text-lg font-semibold text-navy',
              nav: 'hidden',
              button_previous:
                '!static col-start-1 row-start-1 w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-navy transition-colors disabled:opacity-40 disabled:pointer-events-none self-center justify-self-start',
              button_next:
                '!static col-start-3 row-start-1 w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-navy transition-colors disabled:opacity-40 disabled:pointer-events-none self-center justify-self-end',
              month_grid: 'col-span-3 row-start-2',
              weekdays: 'grid grid-cols-7 gap-1',
              weekday: 'text-xs font-medium text-slate-400 text-center py-2',
              week: 'grid grid-cols-7 gap-1 mt-1',
              day: 'text-center',
              day_button:
                'w-10 h-10 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100 text-navy',
              selected: '!bg-gold !text-white hover:!bg-gold-dark',
              range_start: '!bg-gold !text-white rounded-l-lg rounded-r-none',
              range_end: '!bg-gold !text-white rounded-r-lg rounded-l-none',
              range_middle: '!bg-gold/20 !text-navy rounded-none',
              today: 'font-bold text-gold',
              outside: 'text-slate-300',
              disabled: 'text-slate-200 cursor-not-allowed hover:bg-transparent',
            }}
          />

          {/* Confirm button — always visible so users aren't forced to use quick pills */}
          <div className="mt-4 flex items-center justify-between gap-3">
            {range.from && !range.to && (
              <p className="text-xs text-slate-400">Now select a check-out date</p>
            )}
            {(!range.from || range.to) && <span />}
            <button
              type="button"
              onClick={() => {
                if (range.from && range.to) {
                  onChange(range.from, range.to);
                  setIsOpen(false);
                }
              }}
              disabled={!range.from || !range.to}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                range.from && range.to
                  ? 'bg-navy text-white hover:bg-navy-light'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              {range.from && range.to
                ? `Confirm — ${differenceInDays(range.to, range.from)} nights`
                : 'Confirm dates'}
            </button>
          </div>

          {/* Quick selection */}
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
            {nextSuggestedDate && suggestedDayName && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">
                  Quick select: Next {suggestedDayName}
                </p>
                <button
                  type="button"
                  onClick={handleQuickSelectNextSuggested}
                  className="px-3 py-1.5 text-sm rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors font-medium"
                >
                  {format(nextSuggestedDate, 'MMM d')} – {minNights} nights
                </button>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Quick select duration:</p>
              <div className="flex gap-2 flex-wrap">
              {[3, 5, 7, 10, 14].filter((n) => n >= minNights).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    if (range.from) {
                      const newTo = new Date(range.from);
                      newTo.setDate(newTo.getDate() + n);
                      if (!isBefore(effectiveMaxDate, newTo)) {
                        onChange(range.from, newTo);
                        setIsOpen(false);
                      }
                    }
                  }}
                  disabled={!range.from}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    range.from
                      ? 'bg-slate-100 text-navy hover:bg-slate-200'
                      : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  {n} nights
                </button>
              ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
