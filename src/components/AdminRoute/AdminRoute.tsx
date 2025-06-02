import {  Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/reduxHooks';
import { OverlayLoader } from '../OverlayLoader';
import { RootState } from '../../store/store';

interface AdminRouteProps {
  children: React.ReactElement;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { profile, loading } = useAppSelector((state: RootState) => state.profile);

  if (loading) {
    return <OverlayLoader />;
  }

  if (!profile || !profile.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};
