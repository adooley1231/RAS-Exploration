import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, addMonths, isBefore, startOfDay } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-day-picker/style.css';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({ value, onChange, minDate, maxDate }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      setIsOpen(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    return isBefore(date, effectiveMinDate) || isBefore(effectiveMaxDate, date);
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-navy mb-2">Check-in Date</label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 px-4 py-3 bg-white border rounded-xl transition-premium ${
          isOpen ? 'border-gold ring-2 ring-gold/20' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <Calendar className="w-5 h-5 text-gold" />
        {value ? (
          <span className="font-medium text-navy">{format(value, 'EEEE, MMMM d, yyyy')}</span>
        ) : (
          <span className="text-slate-400">Select a date...</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 p-4">
          <DayPicker
            mode="single"
            selected={value || undefined}
            onSelect={handleSelect}
            disabled={isDateDisabled}
            defaultMonth={value || effectiveMinDate}
            showOutsideDays
            components={{
              Chevron: ({ orientation }) =>
                orientation === 'left' ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                ),
            }}
            classNames={{
              root: 'font-sans',
              months: 'flex gap-4',
              month: 'space-y-4',
              month_caption: 'flex justify-center items-center h-10',
              caption_label: 'font-serif text-lg font-semibold text-navy',
              nav: 'flex items-center gap-1',
              button_previous:
                'p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600',
              button_next: 'p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600',
              weekdays: 'grid grid-cols-7 gap-1',
              weekday: 'text-xs font-medium text-slate-400 text-center py-2',
              week: 'grid grid-cols-7 gap-1 mt-1',
              day: 'text-center',
              day_button:
                'w-10 h-10 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100 text-navy',
              selected: '!bg-gold !text-white hover:!bg-gold-dark',
              today: 'font-bold text-gold',
              outside: 'text-slate-300',
              disabled: 'text-slate-200 cursor-not-allowed hover:bg-transparent',
            }}
          />
        </div>
      )}
    </div>
  );
}
