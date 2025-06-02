import { useAppSelector } from '../../hooks/reduxHooks';
import { Navigate, useLocation } from 'react-router-dom';
import { OverlayLoader } from '../OverlayLoader';
import { RootState } from '../../store/store';

interface PrivateRouteProps {
  children: React.ReactElement;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = useAppSelector((state: RootState) => state.user);
  const location = useLocation();

  if (loading) {
    return <OverlayLoader />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
