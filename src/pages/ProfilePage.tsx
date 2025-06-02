import { useEffect} from 'react';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';

import {
  fetchUserProfile,
  updateUserProfile,
  changePassword,
  resetProfileState,
} from '../store/slices/profile/profileSlice';

import { OverlayLoader, TextInput, PasswordInput } from '../components';
import { useAppDispatch, useAppSelector} from '../hooks/reduxHooks';
import { RootState } from '../store/store';

import '../styles/buttons.css';
import { usePhoneVerification } from '../hooks/usePhoneVerification';
import { PROFILE_SCHEMA, PASSSWORD_CHANGE_SCHEMA } from '../schemas/validationSchemas';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { profile, loading, success, error } = useAppSelector((state: RootState) => state.profile);

  const {
    phone,
    setPhone,
    code,
    setCode,
    isVerifying,
    isEditingPhone,
    setIsEditingPhone,
    timer,
    sendCode,
    verifyCode,
  } = usePhoneVerification(profile?.phone || '');

  useEffect(() => {
    if (success) {
      toast.success('Операція успішна');
      dispatch(resetProfileState());
    }

    if (error) {
      toast.error(error);
      dispatch(resetProfileState());
    }
  }, [success, error, dispatch]);  

  const handleChangePassword = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      await dispatch(changePassword(values)).unwrap();

      toast.success('Пароль змінено');
    } catch {
      toast.error('Не вдалося змінити пароль');
    }
  };

  if (loading) {
    return <OverlayLoader />;
  }

  if (!profile) {
    return (
      <div className="max-w-xl mx-auto p-5 bg-white rounded-xl shadow space-y-6 my-10 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-5 bg-white rounded-xl shadow space-y-6 my-10">
      <h2 className="text-xl font-semibold">Особистий кабінет</h2>

      <Formik
        initialValues={{
          name: profile.name || '',
          city: profile.city || '',
        }}
        validationSchema={PROFILE_SCHEMA}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await dispatch(updateUserProfile(values)).unwrap();
            await dispatch(fetchUserProfile()).unwrap();
            toast.success('Профіль оновлено');
          } catch {
            toast.error('Помилка оновлення профілю');
          } finally {
            setSubmitting(false);
          }
        }}>
        <Form className="space-y-4">
          <TextInput name="name" label="Ім’я" placeholder="Ваше ім’я" />

          {/* Тепер поле телефону не у Formik */}
          <TextInput name="city" label="Місто" placeholder="Ваше місто" />

          <button type="submit" className="btn btn-cyan ml-4" aria-label='Зберегти'>
            Зберегти
          </button>
        </Form>
      </Formik>

      {/* Окремо керуємо телефоном */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Телефон
        </label>

        <input
          id="phone"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0931234567"
          disabled={profile.phoneVerified && !isEditingPhone}
          className={`w-full mb-4 p-3 border rounded-md focus:outline-none focus:ring-2 transition duration-200 ease-in-out shadow-sm ${
            profile.phoneVerified && !isEditingPhone
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
        />

        <div className="flex gap-2">
          {isEditingPhone || !profile.phoneVerified ? (
            <>
              <button
                type="button"
                aria-label='Надіслати код'
                onClick={sendCode}
                disabled={timer > 0}
                className="btn btn-green ml-4"
              >
                Надіслати код {timer > 0 && `(${timer}с)`}
              </button>

              {profile.phoneVerified && (
                <button
                  type="button"
                  aria-label='Скасувати'
                  onClick={() => {
                    setIsEditingPhone(false);
                    setPhone(profile.phone || '');
                    setCode('');
                  }}
                  className="btn btn-red"
                >
                  Скасувати
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              aria-label='Змінити номер'
              onClick={() => setIsEditingPhone(true)}
              className="btn btn-green ml-4"
            >
              Змінити номер
            </button>
          )}
        </div>

        {isVerifying && (
          <div className="flex items-center mt-2">
            <input
              type="text"
              placeholder="Код підтвердження"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border p-2 rounded w-full mr-2 mb-2"
            />

            <button onClick={verifyCode} type="button" className="btn btn-green" aria-label='Підтвердити'>
              Підтвердити
            </button>
          </div>
        )}
      </div>

      <Formik
        initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
        validationSchema={PASSSWORD_CHANGE_SCHEMA}
        onSubmit={handleChangePassword}>
        <Form className="space-y-2">
          <PasswordInput
            name="currentPassword"
            label="Поточний пароль"
            placeholder="Поточний пароль"
          />

          <PasswordInput name="newPassword" label="Новий пароль" placeholder="Новий пароль" />

          <PasswordInput
            name="confirmPassword"
            label="Підтвердження нового пароля"
            placeholder="Підтвердження паролю"
          />

          <button type="submit" aria-label='Змінити пароль' className="btn btn-cyan ml-4">
            Змінити пароль
          </button>
        </Form>
      </Formik>
    </div>
  );
}
