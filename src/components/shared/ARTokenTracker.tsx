import { Coins } from 'lucide-react';

interface ARTokenTrackerProps {
  current: number;
  max: number;
  used?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ARTokenTracker({
  current,
  max,
  used = 0,
  showLabel = true,
  size = 'md',
}: ARTokenTrackerProps) {
  const percentage = (current / max) * 100;
  const usedPercentage = (used / max) * 100;

  const sizeConfig = {
    sm: {
      container: 'gap-2',
      icon: 'w-4 h-4',
      text: 'text-sm',
      bar: 'h-1.5',
      number: 'text-lg',
    },
    md: {
      container: 'gap-3',
      icon: 'w-5 h-5',
      text: 'text-base',
      bar: 'h-2',
      number: 'text-xl',
    },
    lg: {
      container: 'gap-4',
      icon: 'w-6 h-6',
      text: 'text-lg',
      bar: 'h-3',
      number: 'text-2xl',
    },
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex flex-col ${config.container}`}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-navy-light">
            <Coins className={`${config.icon} text-gold`} />
            <span className={config.text}>AR Tokens</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`${config.number} font-semibold text-navy tabular-nums`}>
              {current}
            </span>
            <span className={`${config.text} text-slate-400`}>/ {max}</span>
          </div>
        </div>
      )}

      <div className={`relative w-full bg-slate-100 rounded-full overflow-hidden ${config.bar}`}>
        {/* Available tokens */}
        <div
          className="absolute inset-y-0 left-0 gold-gradient rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
        {/* Tokens that would be used */}
        {used > 0 && (
          <div
            className="absolute inset-y-0 bg-amber/30 rounded-full transition-all duration-300"
            style={{
              left: `${percentage - usedPercentage}%`,
              width: `${usedPercentage}%`,
            }}
          />
        )}
      </div>

      {used > 0 && (
        <p className="text-xs text-slate-500">
          {used} token{used > 1 ? 's' : ''} will be used for your requests
        </p>
      )}
    </div>
  );
}
