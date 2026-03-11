import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import type { TRVRInfo } from '../../types';

interface BoostIndicatorProps {
  trvr?: TRVRInfo;
  wishListBoost?: number | null;
  ultraBoost?: boolean;
  compact?: boolean;
}

export function BoostIndicator({
  trvr,
  wishListBoost,
  ultraBoost,
  compact = false,
}: BoostIndicatorProps) {
  const indicators: React.ReactNode[] = [];

  if (trvr?.hasBoost) {
    indicators.push(
      <div
        key="trvr-boost"
        className={`inline-flex items-center gap-1 ${
          compact ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm'
        } bg-teal/10 text-teal rounded-full`}
        title={trvr.reason}
      >
        <TrendingUp className={compact ? 'w-3 h-3' : 'w-4 h-4'} />
        {!compact && <span>+{trvr.boostPercentage}%</span>}
      </div>
    );
  }

  if (trvr?.hasPenalty) {
    indicators.push(
      <div
        key="trvr-penalty"
        className={`inline-flex items-center gap-1 ${
          compact ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm'
        } bg-amber/10 text-amber rounded-full`}
        title={trvr.reason}
      >
        <TrendingDown className={compact ? 'w-3 h-3' : 'w-4 h-4'} />
        {!compact && <span>-{trvr.penaltyPercentage}%</span>}
      </div>
    );
  }

  if (wishListBoost) {
    indicators.push(
      <div
        key="wishlist"
        className={`inline-flex items-center gap-1 ${
          compact ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm'
        } bg-gold/20 text-gold-dark rounded-full`}
        title="Wish list destination"
      >
        <Star className={compact ? 'w-3 h-3' : 'w-4 h-4'} fill="currentColor" />
        {!compact && <span>+{wishListBoost}%</span>}
      </div>
    );
  }

  if (ultraBoost) {
    indicators.push(
      <div
        key="ultra"
        className={`inline-flex items-center gap-1 ${
          compact ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm'
        } gold-gradient text-white rounded-full font-medium`}
        title="Ultra member 1.2x boost"
      >
        {compact ? '1.2x' : 'Ultra 1.2x'}
      </div>
    );
  }

  if (indicators.length === 0) return null;

  return <div className="flex flex-wrap gap-1">{indicators}</div>;
}
