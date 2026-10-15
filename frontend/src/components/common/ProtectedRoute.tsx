import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Role } from '../../types/auth';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

/**
 * Rota koruma bileseni (Protected Route).
 * Oturumu olmayan kullanicilari /login'e, yetkisi olmayan kullanicilari
 * ise ana sayfaya yonlendirir.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
