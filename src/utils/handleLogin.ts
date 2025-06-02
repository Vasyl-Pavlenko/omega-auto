import { toast } from 'react-toastify';
import { NavigateFunction } from 'react-router-dom';
import { AppDispatch } from '../store/store';
import { loginUser } from '../store/slices/user/userSlice';
import { LoginFormValues } from '../types/tyre';
import axios from 'axios';

export const handleLogin = async (
  values: LoginFormValues,
  dispatch: AppDispatch,
  navigate: NavigateFunction,
  setSubmitting: (isSubmitting: boolean) => void,
) => {
  const { email, password, rememberMe } = values;

  setSubmitting(true);
  try {
    await dispatch(loginUser({ email, password })).unwrap();

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    toast.success('Ви успішно увійшли 👋');
    navigate('/');
  } catch (err: any) {
    let errorMessage = 'Невідома помилка';

    if (err?.message) {
      errorMessage = err.message;
    } else if (axios.isAxiosError(err)) {
      errorMessage = err.response?.data?.message || err.message;
    } else if (typeof err === 'string') {
      errorMessage = err;
    }

    toast.error(errorMessage);
  } finally {
    setSubmitting(false);
  }
};
