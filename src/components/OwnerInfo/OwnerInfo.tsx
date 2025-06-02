import { Eye, Heart } from "lucide-react";
import { Tyre } from "../../types/tyre";
import { TyreStatusLabel } from "../TyreStatusLabel";

export const OwnerInfo = ({
  tyre,
  createdDate,
  expiresDate,
  isExpired,
  isExpiringSoon,
  isActive,
}: {
  tyre: Tyre;
  createdDate: string;
  expiresDate: string;
  isExpired: boolean;
  isExpiringSoon: boolean;
  isActive: boolean;
}) => (
  <div className="mt-2 text-sm text-gray-600">
    <div className="flex items-center gap-4">
      <span className="text-gray-500 text-sm flex items-center gap-1">
        <Eye className="w-4 h-4" /> {tyre.views}
      </span>

      <span className="text-gray-500 text-sm flex items-center gap-1">
        <Heart className="w-4 h-4" /> {tyre.favoritesCount}
      </span>
    </div>

    <div className="flex justify-between text-xs mt-1 mb-2">
      <span>Додано: {createdDate}</span>
      <span>Дійсне до: {expiresDate}</span>
    </div>

    <TyreStatusLabel isExpired={isExpired} isExpiringSoon={isExpiringSoon} isActive={isActive} />
  </div>
);
