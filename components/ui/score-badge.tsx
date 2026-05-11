'use client';

import { cn } from '@/lib/utils';
import { scoreToPercentage, getPercentageLabel, getPercentageColor, getPercentageBgColor } from '@/lib/csv-utils';

interface ScoreBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ScoreBadge({ 
  score, 
  showLabel = false, 
  size = 'md',
  className 
}: ScoreBadgeProps) {
  const percentage = scoreToPercentage(score);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        getPercentageBgColor(percentage),
        getPercentageColor(percentage),
        sizeClasses[size],
        className
      )}
    >
      <span className="font-semibold">{percentage}%</span>
      {showLabel && (
        <span className="hidden sm:inline text-current/70">
          - {getPercentageLabel(percentage)}
        </span>
      )}
    </span>
  );
}

interface ScoreBarProps {
  score: number;
  maxScore?: number;
  showValue?: boolean;
  className?: string;
}

export function ScoreBar({ 
  score, 
  maxScore = 8, 
  showValue = true,
  className 
}: ScoreBarProps) {
  const percentage = scoreToPercentage(score, maxScore);
  
  const getBarColor = () => {
    if (percentage >= 87.5) return 'bg-success';
    if (percentage >= 62.5) return 'bg-primary';
    if (percentage >= 37.5) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', getBarColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <span className={cn('text-sm font-semibold min-w-[3.5rem] text-right tabular-nums', getPercentageColor(percentage))}>
          {percentage}%
        </span>
      )}
    </div>
  );
}
