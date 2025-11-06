import React from 'react';
import { Badge } from '../Badge';
import { Layers } from 'lucide-react';

interface TreadBadgeProps {
  treadDepth?: number | null;
  treadPercent?: number | null;
  iconClassName?: string;
}

export const TreadBadge: React.FC<TreadBadgeProps> = ({
  treadDepth,
  treadPercent,
  iconClassName,
}) => {
  const title =
    treadPercent !== undefined && treadPercent !== null
      ? `Глибина протектора: ${treadPercent}%`
      : undefined;

  return (
    <Badge
      label={treadDepth !== undefined && treadDepth !== null ? `${treadDepth} мм` : '—'}
      title={title}
      icon={<Layers className={iconClassName} />}
    />
  );
};
