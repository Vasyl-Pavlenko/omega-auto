import React, { useState } from 'react';
import { renewTyre } from '../../api/api';
import { toast } from 'react-toastify';
import { OverlayLoader } from '../OverlayLoader';

interface RenewButtonProps {
  adId: string;
}

export const RenewButton: React.FC<RenewButtonProps> = ({ adId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRenew = async () => {
    try {
      setIsLoading(true);

      const response = await renewTyre(adId);

      toast.success(response.message || 'Оголошення оновлено');
    } catch (error: any) {
      toast.error(error.message || 'Не вдалося оновити оголошення');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      aria-label="Оновити оголошення"
      onClick={handleRenew}
      disabled={isLoading}
      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
    >
      {isLoading ? <OverlayLoader /> : 'Оновити оголошення'}
    </button>
  );
};
