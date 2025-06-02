export const TyreStatusLabel = ({
  isExpired,
  isExpiringSoon,
  isActive,
}: {
  isExpired: boolean;
  isExpiringSoon: boolean;
  isActive: boolean;
}) => {
  if (isExpired) {
    return (
      <span className="inline-block text-xs font-medium bg-red-100 text-red-800 px-2 py-1 rounded">
        ⛔ Закінчено
      </span>
    );
  }
  if (isExpiringSoon) {
    return (
      <span className="inline-block text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
        ⚠️ Завершується
      </span>
    );
  }
  if (isActive) {
    return (
      <span className="inline-block text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
        ✅ Активне
      </span>
    );
  }
  return null;
};
