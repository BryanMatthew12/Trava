import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { token as selectToken } from '../slices/auth/authSlice';

const ProtectedRoute = ({ children }) => {
  const userToken = useSelector(selectToken);

  if (!userToken) {
    console.log('No token, redirecting to login');
    return <Navigate to="/Login" replace />;
  }

  return children;
};

export default ProtectedRoute;