import { FavoriteButton } from '../FavoriteButton';

interface Props {
  title: string;
  tyreId: string;
  isFavorite: boolean;
  loading: boolean;
  onToggle: () => void;
  isOwner: boolean;
}

export const TyreHeader = ({ title, isFavorite, loading, onToggle, isOwner, tyreId }: Props) => (
  <div className="relative flex items-center justify-between mb-4 gap-4 sm:gap-6">
    <h1 className="flex-1 text-2xl sm:text-4xl font-extrabold text-blue-700 text-center sm:text-left">
      {title}
    </h1>

    {!isOwner && (
      <FavoriteButton
        tyreId={tyreId}
        isFavorite={isFavorite}
        isLoading={loading}
        onToggle={onToggle}
      />
    )}
  </div>
);
