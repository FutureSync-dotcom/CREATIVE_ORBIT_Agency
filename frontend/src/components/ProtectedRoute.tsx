import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, permission }) => {
  const token = localStorage.getItem('adminToken');
  const userData = localStorage.getItem('adminUser');

  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userData);

  // If a specific permission is required, check if user has it
  if (permission && user.permissions && !user.permissions.includes(permission)) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
