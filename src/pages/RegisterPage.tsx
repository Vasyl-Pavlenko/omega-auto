import { Formik, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, OverlayLoader } from '../components/';

import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { clearError, registerUser, setPendingEmail } from '../store/slices/user/userSlice';
import { toast } from 'react-toastify';
import { lazy, useEffect } from 'react';
import { RegisterFormValues } from '../types/tyre';
import { REGISTER_SCHEMA } from '../schemas/validationSchemas';
import { Helmet } from 'react-helmet';

const SubmitButton = lazy(() => import('../components/SubmitButton/SubmitButton'));

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.user);
  const initialValues: RegisterFormValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  return (
    <>
      <Helmet>
        <title> Реєстрація нового користувача | Omega Auto</title>
        <meta
          name="description"
          content="Створіть обліковий запис на Omega Auto для публікації оголошень і доступу до особистого кабінету."
        />
      </Helmet>

      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 relative">
        <div className="w-full max-w-md sm:p-8 p-6 bg-white rounded-lg shadow-lg relative">
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-center text-sm">
            <span className="text-gray-600">Уже маєте аккаунт? </span>

            <Link to="/login" className="text-blue-600 hover:underline">
              Вхід
            </Link>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-center text-gray-700 mb-6">
            Реєстрація
          </h1>

          {loading ? (
            <OverlayLoader />
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={REGISTER_SCHEMA}
              validateOnBlur={false}
              onSubmit={(values) => {
                const { name, email, password } = values;
                dispatch(setPendingEmail(email));
                dispatch(registerUser({ name, email, password }))
                  .unwrap()
                  .then(() => {
                    toast.success('Реєстрація успішна. Підтвердіть пошту.');
                    navigate('/sent-email-confirmation');
                  })
                  .catch((err) => {
                    toast.error(err.message || 'Помилка при реєстрації');
                  });
              }}>
              {({ isSubmitting }) => (
                <Form>
                  <TextInput
                    type="text"
                    label="Ім'я"
                    name="name"
                    placeholder="Ім'я"
                    autoFocus={true}
                  />

                  <TextInput
                    label="Email"
                    name="email"
                    placeholder="Email@example.com"
                    type="email"
                  />

                  <PasswordInput label="Пароль" name="password" placeholder="Пароль" />

                  <PasswordInput
                    label="Підтвердіть пароль"
                    name="confirmPassword"
                    placeholder="Підтвердіть пароль"
                  />

                  <SubmitButton isLoading={loading} isSubmitting={isSubmitting} text="Увійти" />
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
