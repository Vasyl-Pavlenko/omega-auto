import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { confirmEmail, resendEmailConfirmation } from '../api/api';
import { OverlayLoader } from '../components/OverlayLoader';
import { toast } from 'react-toastify';
import '../styles/buttons.css';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { clearPendingEmail } from '../store/slices/user/userSlice';

export default function EmailConfirmationPage() {
  const reduxEmail = useAppSelector(({ user }) => user.pendingEmail);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [status, setStatus] = useState<'loading' | 'success' | 'expired' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();

  // Відновлюємо email з Redux або localStorage
  const email = reduxEmail || localStorage.getItem('pendingEmail');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Токен не знайдено. Будь ласка, перевірте посилання.');
      toast.warning('Підтверджуючий токен відсутній');
      return;
    }

    confirmEmail(token)
      .then((msg: string) => {
        if (
          msg.toLowerCase().includes('токен недійсний') ||
          msg.toLowerCase().includes('протермінований')
        ) {
          setStatus('expired');
          setMessage(msg);
          toast.warning(msg);
        } else {
          setStatus('success');
          setMessage(msg || 'Пошта підтверджена!');
          toast.success(msg || 'Пошта підтверджена!');
          localStorage.removeItem('pendingEmail');
          dispatch(clearPendingEmail());

          setTimeout(() => navigate('/login'), 5000);
        }
      })
      .catch((err) => {
        const errMsg = typeof err === 'string' ? err : err?.message || 'Сталася невідома помилка';

        const isExpired = errMsg.toLowerCase().includes('протермінований');
        setStatus(isExpired ? 'expired' : 'error');
        setMessage(errMsg);
        toast.error(errMsg);
      });
  }, [searchParams, navigate, dispatch]);

  const handleResend = async () => {
    if (!email) {
      toast.error(
        'Email для повторного надсилання відсутній. Спробуйте увійти або зареєструватись заново.',
      );
      return;
    }

    try {
      await resendEmailConfirmation(email);
      toast.success('Новий лист надіслано 📩');
    } catch (err) {
      toast.error('Не вдалося надіслати листа 😞');
    }
  };

  if (status === 'loading') {
    return <OverlayLoader />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-200">
        <h2
          className={`text-3xl font-bold mb-4 ${
            status === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
        >
          {status === 'success' ? 'Успішно!' : 'Підтвердження не виконано'}
        </h2>

        <p className="text-gray-700 text-lg mb-6">{message}</p>

        {status === 'success' && (
          <button type='button' aria-label='Перейти до входу' onClick={() => navigate('/login')} className="btn-blue btn-lg" >
            Перейти до входу
          </button>
        )}

        {status === 'expired' && (
          <div className="flex flex-col items-center gap-3">
            <button type='button' aria-label='Надіслати лист повторно' onClick={handleResend} className="btn-lime btn-lg">
              Надіслати лист повторно
            </button>

            <button type='button' aria-label='Повернутись на головну' onClick={() => navigate('/')} className="btn-blue btn-lg">
              Повернутись на головну
            </button>
          </div>
        )}

        {status === 'error' && (
          <button type='button' aria-label='Повернутись на головну' onClick={() => navigate('/')} className="btn-blue btn-lg">
            Повернутись на головну
          </button>
        )}
      </div>
    </div>
  );
}
