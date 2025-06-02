import { PhoneCall } from 'lucide-react';
import { OwnerControls } from '../index';
import { Tyre } from '../../types/tyre';

interface TyreActionsProps {
  tyre: Tyre;
  isOwner: boolean;
  contact: string;
  onBack: () => void;
  onDeleteClick: () => void;
  onExtend: () => void;
  isDeleting: boolean;
  isExtending: boolean;
}

export const TyreActions = ({
  tyre,
  isOwner,
  contact,
  onBack,
  onDeleteClick,
  onExtend,
  isDeleting,
  isExtending,
}: TyreActionsProps) => {
  return (
    <div className="mb-4 flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4">
      <button
        type="button"
        aria-label="Назад до списку шин"
        onClick={onBack}
        className="btn-blue btn-lg w-full sm:w-auto text-center"
      >
        Назад до списку шин
      </button>

      {!isOwner && (
        <a
          href={`tel:${contact}`}
          className="btn-green btn-lg w-full sm:w-auto flex justify-center items-center gap-2"
          aria-label="Зателефонувати власнику"
        >
          <PhoneCall className="w-6 h-6" />
          
          Зателефонувати
        </a>
      )}

      {isOwner && (
        <OwnerControls
          tyre={tyre}
          onDeleteClick={onDeleteClick}
          onExtend={onExtend}
          isDeleting={isDeleting}
          isExtending={isExtending}
        />
      )}
    </div>
  );
};
