import React, { Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { AdminRoute, SuspenseSpinner, PrivateRoute } from './components';
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks';
import { fetchUserProfile } from './store/slices/profile/profileSlice';
import { fetchFavorites } from './store/slices/tyres/tyreSlice';

const HomePage = React.lazy(
  () => import(/* webpackChunkName: "HomePage" , webpackPrefetch: true */ './pages/HomePage'),
);

const LoginPage = React.lazy(() => import(/* webpackChunkName: "auth" , webpackPrefetch: true */  './pages/LoginPage'));

const RegisterPage = React.lazy(() => import(/* webpackChunkName: "auth" */ './pages/RegisterPage'));

const EmailConfirmationPage = React.lazy(() => import(/* webpackChunkName: "auth" */ './pages/EmailConfirmationPage'));

const EmailSentConfirmationPage = React.lazy(
  () => import(/* webpackChunkName: "auth" */ './pages/EmailSentConfirmation'),
);

const ForgotPasswordPage = React.lazy(
  () => import(/* webpackChunkName: "auth" */ './pages/ForgotPasswordPage'),
);

const ResetPasswordPage = React.lazy(
  () => import(/* webpackChunkName: "auth" */ './pages/ResetPasswordPage'),
);

const ProfilePage = React.lazy(
  () => import(/* webpackChunkName: "ProfilePage" */ './pages/ProfilePage'),
);

const AddTyrePage = React.lazy(
  () => import(/* webpackChunkName: "AddTyrePage" */ './pages/AddTyrePage'),
);

const EditTyrePage = React.lazy(
  () => import(/* webpackChunkName: "EditTyrePage" */ './pages/EditTyrePage'),
);

const MyAdsPage = React.lazy(() => import(/* webpackChunkName: "MyAdsPage", webpackPrefetch: true */ './pages/MyAdsPage'));

const AdminPage = React.lazy(() => import(/* webpackChunkName: "AdminPage" */ './pages/AdminPage'));

const TyreDetailsPage = React.lazy(
  () => import(/* webpackChunkName: "TyreDetailsPage" */ './pages/TyreDetailsPage'),
);

const NotFoundPage = React.lazy(
  () => import(/* webpackChunkName: "NotFoundPage" */ './pages/NotFoundPage'),
);

const Layout = React.lazy(() => import('./layouts/Layout'));

function App() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { favoriteLoaded } = useAppSelector((state) => state.tyre);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/ping`).catch((e) =>
      console.warn('Не вдалося пінгнути бекенд', e),
    );
  }, []);

  useEffect(() => {
    if (user?.token) {
      dispatch(fetchUserProfile())
        .unwrap()
        .then(() => {
          if (!favoriteLoaded) {
            dispatch(fetchFavorites());
          }
        });
    }
  }, [dispatch, user?.token, favoriteLoaded]);

  return (
    <Suspense fallback={<SuspenseSpinner />}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/confirm-email" element={<EmailConfirmationPage />} />
          <Route path="/sent-email-confirmation" element={<EmailSentConfirmationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/tyre/:id" element={<TyreDetailsPage />} />

          {/* Захищені */}
          <Route
            path="/add"
            element={
              <PrivateRoute>
                <AddTyrePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/my"
            element={
              <PrivateRoute>
                <MyAdsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <EditTyrePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Suspense>
  );
}

export default App;
