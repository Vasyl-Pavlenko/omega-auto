import { Loader2, Heart } from 'lucide-react';
import clsx from 'clsx';

interface FavoriteButtonProps {
  tyreId: string;
  isFavorite: boolean;
  isLoading: boolean;
  className?: string;
  onToggle: (id: string, currentState: boolean) => void;
}

export const FavoriteButton = ({
  tyreId,
  isFavorite,
  isLoading,
  onToggle,
  className = '',
}: FavoriteButtonProps) => (
  <button
    type="button"
    aria-label={isFavorite ? 'Видалити з обраного' : 'Додати в обране'}
    onClick={() => onToggle(tyreId, isFavorite)}
    className={clsx(
      'p-2 bg-white/50 backdrop-blur rounded-full hover:scale-110 transition',
      className,
    )}
    title={isFavorite ? 'Видалити з обраного' : 'Додати в обране'}
  >
    {isLoading ? (
      <Loader2 className="w-6 h-6 animate-spin" />
    ) : (
      <Heart
        className={`w-6 h-6 ${
          isFavorite ? 'fill-red-500 animate-pulse' : 'stroke-red-500 fill-none'
        } transition-transform duration-200 hover:scale-110`}
      />
    )}
  </button>
);
