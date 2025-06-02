// hooks/usePhoneVerification.ts
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from './reduxHooks';
import {
  fetchUserProfile,
  sendPhoneVerificationCode,
  verifyPhone,
} from '../store/slices/profile/profileSlice';
import { toast } from 'react-toastify';

export const usePhoneVerification = (initialPhone: string = '') => {
  const dispatch = useAppDispatch();

  const [phone, setPhone] = useState(initialPhone);
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Оновлюємо початкове значення телефону
  useEffect(() => {
    setPhone(initialPhone);
  }, [initialPhone]);

  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timer]);

  const sendCode = async () => {
    if (!phone.match(/^(\+?38)?0\d{9}$/)) {
      toast.error('Некоректний формат номера телефону');
      return;
    }

    try {
      await dispatch(sendPhoneVerificationCode(phone)).unwrap();
      toast.success('Код підтвердження надіслано');
      setIsVerifying(true);
      setTimer(300);
    } catch {
      toast.error('Помилка при надсиланні SMS');
    }
  };

  const verifyCode = async () => {
    if (!code.trim()) {
      toast.warning('Введіть код');
      return;
    }

    try {
      await dispatch(verifyPhone(code)).unwrap();
      await dispatch(fetchUserProfile()).unwrap();
      toast.success('Телефон підтверджено і збережено');
      setIsVerifying(false);
      setIsEditingPhone(false);
      setCode('');
    } catch {
      toast.error('Невірний або прострочений код');
    }
  };

  return {
    phone,
    setPhone,
    code,
    setCode,
    isVerifying,
    setIsVerifying,
    isEditingPhone,
    setIsEditingPhone,
    timer,
    sendCode,
    verifyCode,
  };
};
