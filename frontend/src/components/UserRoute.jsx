import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function UserRoute({ children }){
  const { isLoading, isAuthenticated } = useContext(AuthContext);
  if(isLoading) return <div>Loading...</div>;
  if(!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
