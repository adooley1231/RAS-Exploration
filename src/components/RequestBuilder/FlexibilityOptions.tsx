import { Info, Shuffle, CalendarDays } from 'lucide-react';
import { useState } from 'react';

interface FlexibilityOptionsProps {
  flexibleDates: boolean;
  mustIncludeWeekend: boolean;
  onFlexibleChange: (value: boolean) => void;
  onWeekendChange: (value: boolean) => void;
}

export function FlexibilityOptions({
  flexibleDates,
  mustIncludeWeekend,
  onFlexibleChange,
  onWeekendChange,
}: FlexibilityOptionsProps) {
  const [showFlexibleTooltip, setShowFlexibleTooltip] = useState(false);
  const [showWeekendTooltip, setShowWeekendTooltip] = useState(false);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-navy mb-2">Flexibility Options</label>

      {/* Flexible dates option */}
      <div className="relative">
        <label className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-premium has-[:checked]:border-gold has-[:checked]:bg-gold/5">
          <input
            type="checkbox"
            checked={flexibleDates}
            onChange={(e) => onFlexibleChange(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-slate-300 text-gold focus:ring-gold"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Shuffle className="w-4 h-4 text-gold" />
              <span className="font-medium text-navy">Flexible Dates (±2 days)</span>
              <button
                type="button"
                className="relative"
                onMouseEnter={() => setShowFlexibleTooltip(true)}
                onMouseLeave={() => setShowFlexibleTooltip(false)}
              >
                <Info className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Increases your chances by allowing check-in 2 days before or after your selected date.
            </p>
          </div>
        </label>

        {/* Tooltip */}
        {showFlexibleTooltip && (
          <div className="absolute z-50 left-12 top-0 w-64 p-3 bg-navy text-white text-sm rounded-lg shadow-lg">
            <p>
              With flexible dates enabled, if your exact date isn't available, you may be matched to
              a check-in within ±2 days of your request.
            </p>
            <div className="absolute left-0 top-4 -translate-x-2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-navy" />
          </div>
        )}
      </div>

      {/* Must include weekend option */}
      <div className="relative">
        <label className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-premium has-[:checked]:border-gold has-[:checked]:bg-gold/5">
          <input
            type="checkbox"
            checked={mustIncludeWeekend}
            onChange={(e) => onWeekendChange(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-slate-300 text-gold focus:ring-gold"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-gold" />
              <span className="font-medium text-navy">Must Include Weekend</span>
              <button
                type="button"
                className="relative"
                onMouseEnter={() => setShowWeekendTooltip(true)}
                onMouseLeave={() => setShowWeekendTooltip(false)}
              >
                <Info className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Ensure your stay includes at least one weekend day (Saturday or Sunday).
            </p>
          </div>
        </label>

        {/* Tooltip */}
        {showWeekendTooltip && (
          <div className="absolute z-50 left-12 top-0 w-64 p-3 bg-navy text-white text-sm rounded-lg shadow-lg">
            <p>
              If flexible dates are enabled and this is checked, the system will only match you to
              dates that include a weekend.
            </p>
            <div className="absolute left-0 top-4 -translate-x-2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-navy" />
          </div>
        )}
      </div>
    </div>
  );
}
