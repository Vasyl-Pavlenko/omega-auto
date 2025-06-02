import { Tyre } from '../../types/tyre';
import { Badge, conditionIcons, seasonIcons } from '../Badge';
import { Calendar, Layers, MapPin, PackageCheck, Phone, Ruler, Truck } from 'lucide-react';

type TyreInfoGridProps = {
  tyre: Tyre;
  isOwner: boolean;
};

const iconStyle = 'w-4 h-4 text-gray-500';

export const TyreInfoGrid = ({ tyre, isOwner }: TyreInfoGridProps) => {
  const telNumber = tyre.contact.replace(/\D+/g, '');

  return (
    <div className="mb-6 space-y-4">
      {/* ЦІНА — окремий блок */}
      <div className="text-2xl font-bold mb-1 text-green-700 bg-green-100 px-4 py-2 rounded-lg inline-block shadow-sm">
        {tyre.price.toLocaleString()} грн
      </div>

      {/* Інші бейджі */}
      <div className="flex flex-wrap mb-4 gap-2 sm:gap-3 text-sm text-gray-800">
        <Badge label={tyre.condition} icon={conditionIcons[tyre.condition]} />
        
        <Badge label={tyre.season} icon={seasonIcons[tyre.season]} />

        <Badge label={`${tyre.width}/${tyre.height}/${tyre.radius}`}>
          <Ruler className={iconStyle} />
        </Badge>

        <Badge label={tyre.vehicle || '—'}>
          <Truck className={iconStyle} />
        </Badge>

        <Badge label={tyre.year ? `${tyre.year} р.` : '—'}>
          <Calendar className={iconStyle} />
        </Badge>

        <Badge label={tyre.treadDepth ? `${tyre.treadDepth} мм` : '—'}>
          <Layers className={iconStyle} />
        </Badge>

        <Badge label={tyre.quantity ? `${tyre.quantity} шт.` : '—'}>
          <PackageCheck className={iconStyle} />
        </Badge>

        <Badge label={tyre.city || '—'}>
          <MapPin className={iconStyle} />
        </Badge>

        {!isOwner && (
          <a
            href={`tel:${telNumber}`}
            aria-label="Зателефонувати власнику"
            className="no-underline"
          >
            <Badge label={tyre.contact}>
              <Phone className={iconStyle} />
            </Badge>
          </a>
        )}
      </div>
    </div>
  );
};
