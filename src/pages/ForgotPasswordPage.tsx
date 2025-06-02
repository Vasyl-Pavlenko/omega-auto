import { Formik, Form } from 'formik';
import { lazy, useState } from 'react';
import { TextInput} from '../components';
import { requestPasswordReset } from '../api/api';
import { toast } from 'react-toastify';
import { FORGOT_PASSWORD_SCHEMA } from '../schemas/validationSchemas';

const SubmitButton = lazy(() => import('../components/SubmitButton/SubmitButton'));

const ForgotPasswordPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (
    { email }: { email: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      const message = await requestPasswordReset(email);

      toast.success(message || 'Лист надіслано, якщо такий користувач існує');

      setSubmitted(true);
    } catch (error: any) {
      toast.error(error?.message || 'Сталася помилка. Спробуйте ще раз');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Відновлення пароля</h2>

        {submitted ? (
          <p className="text-center text-green-600">
            Якщо користувач із цим email існує — ми надіслали інструкції для відновлення пароля на
            вказану електронну адресу 📩
          </p>
        ) : (
          <Formik
            initialValues={{ email: '' }}
            validationSchema={FORGOT_PASSWORD_SCHEMA}
            onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <TextInput
                  autoFocus
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Email@example.com"
                />

                <SubmitButton text="Скинути пароль" isLoading={isSubmitting} />
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
