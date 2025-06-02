import { Tyre } from '../../types/tyre';
import { MapPin, Calendar, Layers, PackageCheck, Zap } from 'lucide-react';
import { Badge, seasonIcons, conditionIcons } from '../Badge';

interface TyreDetailsProps {
  tyre: Tyre;
}

const iconStyle = 'w-4 h-4 text-gray-500';

export const TyreDetails = ({ tyre }: TyreDetailsProps) => {
  const { vehicle, year, quantity, treadDepth, city, season, condition } = tyre;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {season && <Badge label={season} icon={seasonIcons[season]} />}

      {condition && <Badge label={condition} icon={conditionIcons[condition]} />}

      {vehicle && (
        <Badge label={vehicle}>
          <Zap className={iconStyle} />
        </Badge>
      )}

      {year && (
        <Badge label={String(year)}>
          <Calendar className={iconStyle} />
        </Badge>
      )}

      {quantity && (
        <Badge label={`${quantity} шт.`}>
          <PackageCheck className={iconStyle} />
        </Badge>
      )}

      {treadDepth && (
        <Badge label={`${treadDepth} мм`}>
          <Layers className={iconStyle} />
        </Badge>
      )}

      {city && (
        <Badge label={city}>
          <MapPin className={iconStyle} />
        </Badge>
      )}
    </div>
  );
};
