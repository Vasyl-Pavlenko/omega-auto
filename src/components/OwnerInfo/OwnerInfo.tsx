import { Eye, Heart } from 'lucide-react';
import { Tyre } from '../../types/tyre';
import { TyreStatusLabel } from '../TyreStatusLabel';

export const OwnerInfo = ({
  tyre,
  createdDate,
  expiresDate,
  isExpired,
  isExpiringSoon,
  isActive,
  isDeleted,
}: {
  tyre: Tyre;
  createdDate: string;
  expiresDate: string;
  isExpired: boolean;
  isExpiringSoon: boolean;
  isActive: boolean;
  isDeleted: boolean;
}) => (
  <div className="mt-3 text-sm text-gray-600 space-y-1">
    {/* Відображення переглядів, обраного і статусу */}
    <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
      <div className="flex items-center gap-3 text-gray-500">
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {tyre.views}
        </span>

        <span className="flex items-center gap-1">
          <Heart className="w-4 h-4" />
          {tyre.favoritesCount}
        </span>
      </div>

      <TyreStatusLabel
        isExpired={isExpired}
        isExpiringSoon={isExpiringSoon}
        isActive={isActive}
        isDeleted={isDeleted}
      />
    </div>

    {/* Дата створення і дата завершення */}
    <div className="flex flex-wrap justify-between text-xs text-gray-500">
      <span>Додано: {createdDate}</span>
      <span>Дійсне до: {expiresDate}</span>
    </div>
  </div>
);
