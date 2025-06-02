import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../api/api';

interface LoginResponse {
  token: string;
  userId: string;
}

export interface LoginValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function useLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const login = async (values: LoginValues, onFinish: () => void) => {
    const { email, password, rememberMe } = values;

    try {
      setIsLoading(true);
      setError('');
      setMessage('');

      const response = await loginUser({ email, password });

      if (typeof response === 'object') {
        const { token, userId } = response as LoginResponse;

        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);

        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        toast.success('Ви успішно увійшли 👋');
        navigate('/');
      } else if (typeof response === 'string') {
        setError(response);
        toast.error(response);
      }
    } catch (err) {
      const backendMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(backendMessage);
      toast.error(backendMessage);
    } finally {
      setIsLoading(false);
      onFinish();
    }
  };

  return {
    login,
    isLoading,
    error,
    message,
  };
}
