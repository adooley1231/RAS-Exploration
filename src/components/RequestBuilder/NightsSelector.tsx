import { Minus, Plus, Moon } from 'lucide-react';

interface NightsSelectorProps {
  value: number;
  onChange: (nights: number) => void;
  min?: number;
  max?: number;
}

export function NightsSelector({ value, onChange, min = 2, max = 14 }: NightsSelectorProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <label className="block text-sm font-medium text-navy mb-2">Number of Nights</label>

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        {/* Counter */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={value <= min}
            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-premium ${
              value <= min
                ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                : 'border-navy text-navy hover:bg-navy hover:text-white'
            }`}
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-gold" />
            <span className="text-3xl font-semibold text-navy tabular-nums">{value}</span>
            <span className="text-slate-500">night{value !== 1 ? 's' : ''}</span>
          </div>

          <button
            type="button"
            onClick={handleIncrement}
            disabled={value >= max}
            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-premium ${
              value >= max
                ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                : 'border-navy text-navy hover:bg-navy hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Slider */}
        <div className="relative">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full gold-gradient rounded-full transition-all duration-200"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span>{min} nights</span>
          <span>{max} nights</span>
        </div>
      </div>
    </div>
  );
}
