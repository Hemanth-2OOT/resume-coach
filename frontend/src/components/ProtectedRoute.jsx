import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isLoading, isAuthenticated, isAdmin } = useContext(AuthContext);

  // 1. Keeps the app stable while the backend validates the localStorage token
  if (isLoading) return <div>Loading...</div>;

  // 2. If not logged in, send them to the login portal
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // 3. FIXED: If they try to access an admin page but aren't an admin, send them to /upload
  if (requireAdmin && !isAdmin) return <Navigate to="/upload" replace />;

  return children;
}