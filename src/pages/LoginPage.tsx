import { lazy, useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Link, useNavigate } from 'react-router-dom';

import { TextInput, PasswordInput, OverlayLoader } from '../components';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { handleLogin } from '../utils/handleLogin';
import { LOGIN_SCHEMA } from '../schemas/validationSchemas';

const SubmitButton = lazy(() => import('../components/SubmitButton/SubmitButton'));

function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error } = useAppSelector((state) => state.user);
  const [initialEmail, setInitialEmail] = useState('');

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');

    if (rememberedEmail) {
      setInitialEmail(rememberedEmail);
    }
  }, []);

  const initialValues = {
    email: initialEmail || '',
    password: '',
    rememberMe: !!initialEmail,
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 relative">
      <div className="w-full max-w-md sm:p-8 p-6 bg-white rounded-lg shadow-lg relative">
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-center text-sm">
          <span className="text-gray-600">Відсутній аккаунт? </span>

          <Link to="/register" className="text-blue-600 hover:underline">
            Реєстрація
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-center text-gray-700 mb-6">Логін</h1>

        {loading ? (
          <OverlayLoader />
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={LOGIN_SCHEMA}
            validateOnBlur={false}
            enableReinitialize
            onSubmit={(values, { setSubmitting }) =>
              handleLogin(values, dispatch, navigate, setSubmitting)
            }>
            {({ isSubmitting }) => (
              <Form>
                <TextInput
                  autoFocus={true}
                  label="Email"
                  name="email"
                  placeholder="Email@example.com"
                  type="email"
                />

                <PasswordInput name="password" label="Пароль" placeholder="Пароль" />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <label className="inline-flex items-center text-sm text-gray-700">
                    <Field
                      type="checkbox"
                      name="rememberMe"
                      className="form-checkbox h-4 w-4 text-blue-600 rounded"
                    />

                    <span className="ml-2">Запам’ятати мене</span>
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:underline text-right">
                    Забули пароль?
                  </Link>
                </div>

                {error && <div className="text-red-500 text-center mb-4">{error}</div>}

                <SubmitButton isLoading={isSubmitting} text="Увійти" />
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
