import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { differenceInSeconds } from 'date-fns';

interface CountdownTimerProps {
  deadline: Date;
  onExpire?: () => void;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CountdownTimer({
  deadline,
  onExpire,
  showIcon = true,
  size = 'md',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(differenceInSeconds(deadline, new Date()));

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = differenceInSeconds(deadline, new Date());
      setTimeLeft(newTimeLeft);

      if (newTimeLeft <= 0 && onExpire) {
        onExpire();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline, onExpire]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const isUrgent = hours < 12;
  const isExpired = timeLeft <= 0;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-semibold',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (isExpired) {
    return (
      <div className={`inline-flex items-center gap-1.5 text-coral ${sizeClasses[size]}`}>
        {showIcon && <AlertTriangle className={iconSizes[size]} />}
        <span className="tabular-nums font-semibold">Expired</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${
        isUrgent ? 'text-coral' : 'text-navy-light'
      } ${sizeClasses[size]}`}
    >
      {showIcon &&
        (isUrgent ? (
          <AlertTriangle className={`${iconSizes[size]} animate-pulse`} />
        ) : (
          <Clock className={iconSizes[size]} />
        ))}
      <span className="tabular-nums">
        {hours > 0 && (
          <>
            <span className="font-semibold">{hours}</span>
            <span className="opacity-60">h </span>
          </>
        )}
        <span className="font-semibold">{minutes.toString().padStart(2, '0')}</span>
        <span className="opacity-60">m </span>
        <span className="font-semibold">{seconds.toString().padStart(2, '0')}</span>
        <span className="opacity-60">s</span>
      </span>
    </div>
  );
}
