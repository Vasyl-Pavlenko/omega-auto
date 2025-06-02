import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Tyre } from '../../types/tyre';

import '../../styles/buttons.css';

interface Props {
  tyre: Tyre;
  onDeleteClick: () => void;
  onExtend?: () => void;
  isDeleting?: boolean;
  isExtending?: boolean;
}

export const OwnerControls = ({
  tyre,
  onDeleteClick,
  onExtend,
  isDeleting = false,
  isExtending = false,
}: Props) => {
  const isExpired = tyre.expiresAt && new Date(tyre.expiresAt) < new Date();
  const isExpiringSoon =
    tyre.expiresAt && new Date(tyre.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <Link to={`/edit/${tyre._id}`} className="btn-green btn-lg pl-3">
        ✏️ Редагувати
      </Link>

      <button
        type="button"
        aria-label="Видалити оголошення"
        onClick={onDeleteClick}
        disabled={isDeleting}
        className={
          `btn-red btn-lg pl-3 flex items-center gap-2 
          ${isDeleting ? ' btn-disabled' : ''}`
        }
      >
        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : '🗑 Видалити'}
      </button>

      {(isExpired || isExpiringSoon) && onExtend && (
        <button
          type="button"
          onClick={onExtend}
          disabled={isExtending}
          aria-label="Подовжити дію"
          className={
              `btn-green px-3 py-1 text-sm flex items-center gap-2 ${
              isExtending ? ' btn-disabled' : ''}`
          }
        >
          {isExtending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Подовжити дію'}
        </button>
      )}
    </div>
  );
};
