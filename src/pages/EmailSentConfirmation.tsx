import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resendEmailConfirmation } from '../api/api';
import { toast } from 'react-toastify';
import { useAppSelector } from '../hooks/reduxHooks';
import { Helmet } from 'react-helmet';

const COOLDOWN_SECONDS = 60;
const STORAGE_KEY = 'resendEmailCooldownStart';

export default function EmailSentConfirmationPage() {
  const email = useAppSelector(({ user }) => user.pendingEmail);
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Ініціалізація таймера
  useEffect(() => {
    if (!email) {
      toast.error('Email не знайдено. Будь ласка, зареєструйтесь.');
      navigate('/register');
      
      return;
    }

    const start = localStorage.getItem(STORAGE_KEY);

    if (start) {
      const elapsed = Math.floor((Date.now() - parseInt(start, 10)) / 1000);
      const remaining = COOLDOWN_SECONDS - elapsed;

      if (remaining > 0) {
        setCooldown(remaining);
      }
    }
  }, [email, navigate]);

  // Запуск зворотного відліку
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            localStorage.removeItem(STORAGE_KEY);
            clearInterval(timer);
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email || cooldown > 0) {
      return;
    }

    setResending(true);

    try {
      const msg = await resendEmailConfirmation(email);
      toast.success(msg || 'Лист повторно надіслано!');
      const now = Date.now().toString();
      localStorage.setItem(STORAGE_KEY, now);
      setCooldown(COOLDOWN_SECONDS);
    } catch (err: any) {
      toast.error(err.message || 'Не вдалося надіслати лист.');
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Відправлено лист підтвердження | Omega Auto</title>
        <meta
          name="description"
          content="Лист з посиланням для підтвердження пошти відправлено. Перевірте свій email."
        />
      </Helmet>
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <h1 className="text-3xl font-bold mb-3 text-gray-800">
          Підтвердіть вашу електронну адресу
        </h1>

        <p className="mb-4 text-gray-700 text-base max-w-md">
          Ми надіслали лист з посиланням для підтвердження на адресу:
          <br />
          <span className="font-semibold text-blue-600 break-words">{email}</span>
        </p>

        <p className="text-sm text-gray-600 mb-6 max-w-md">
          Якщо ви не отримали листа, перевірте папку "Спам" або натисніть кнопку нижче, щоб
          надіслати ще раз.
        </p>

        <button
          className={`btn-green transition-all duration-200 ${
            resending || cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          type="button"
          title="Надіслати лист повторно"
          onClick={handleResend}
          disabled={resending || cooldown > 0}>
          {resending
            ? 'Надсилаємо...'
            : cooldown > 0
            ? `Повторити через ${cooldown} сек`
            : 'Надіслати лист повторно'}
        </button>
      </div>
    </>
  );
}
