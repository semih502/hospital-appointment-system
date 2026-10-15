import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface PublicOnlyRouteProps {
  children: React.ReactElement;
}

/**
 * Oturum acmis kullanicilarin login veya register sayfalarina tekrar girmesini
 * engelleyerek onlari rollerine uygun panoya yonlendiren rota koruyucu.
 */
export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
  const { isAuthenticated, role } = useAuthStore();

  if (isAuthenticated && role) {
    if (role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (role === 'DOCTOR') return <Navigate to="/doctor" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
