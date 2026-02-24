import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem',
        color: '#666',
        background: '#0a0a0a'
      }}>
        Verifying Identity...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user has ONE of the required roles
  if (roles.length > 0 && !roles.includes(user?.role)) {
    // Redirect based on what they ARE allowed to see
    if (user.role === 'ROLE_SUPER_ADMIN') return <Navigate to="/super-admin" replace />;
    if (user.role === 'ROLE_TENANT_ADMIN') return <Navigate to="/dashboard" replace />;
    return <Navigate to="/my-subscriptions" replace />;
  }

  return children;
};

export default ProtectedRoute;
