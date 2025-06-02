import { useState } from 'react';
import { resetPassword as resetPasswordAPI } from '../api/api';

export function useResetPassword(token?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const resetPassword = async (newPassword: string, onComplete?: () => void) => {
    if (!token) {
      setError('Невалідний токен');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await resetPasswordAPI(token, newPassword);
      setMessage(res);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
      onComplete?.();
    }
  };

  return { resetPassword, isLoading, message, error };
}
