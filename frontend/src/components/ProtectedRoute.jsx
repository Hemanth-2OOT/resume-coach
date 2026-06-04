import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin=false }){
  const { isLoading, isAuthenticated, isAdmin } = useContext(AuthContext);
  if(isLoading) return <div>Loading...</div>;
  if(!isAuthenticated) return <Navigate to="/login" replace />;
  if(requireAdmin && !isAdmin) return <Navigate to="/" replace />;
  return children;
}
