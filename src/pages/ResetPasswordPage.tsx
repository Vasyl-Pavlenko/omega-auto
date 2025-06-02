import { lazy, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, FormikHelpers } from 'formik';
import { toast } from 'react-toastify';
import { resetPassword } from '../api/api';
import { PasswordInput } from '../components';
import { PASSWORD_SCHEMA } from '../schemas/validationSchemas';

const SubmitButton = lazy(() => import('../components/SubmitButton/SubmitButton'));

interface FormValues {
  newPassword: string;
}

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (
    { newPassword }: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>,
  ) => {
    try {
      const message = await resetPassword(token!, newPassword);

      toast.success(message);
      setSuccess(true);
      resetForm();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Помилка при зміні пароля');
    } finally {
      setSubmitting(false);
    }
  };

  // ⏳ Переадресація через 3 секунди
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  if (!token) {
    return <p className="text-center text-red-500">Недійсне посилання</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Новий пароль</h2>

        {success ? (
          <p className="text-center text-green-600">
            Пароль успішно змінено! Ви будете перенаправлені на сторінку входу...
          </p>
        ) : (
          <Formik
            initialValues={{ newPassword: '' }}
            validationSchema={PASSWORD_SCHEMA}
            onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <PasswordInput
                  label="Новий пароль"
                  name="newPassword"
                  placeholder="Введіть новий пароль"
                />

                <SubmitButton text="Зберегти" isLoading={isSubmitting} />
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
