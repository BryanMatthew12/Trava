import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { token as selectToken } from '../slices/auth/authSlice';

const PublicRoute = ({ children }) => {
  const userToken = useSelector(selectToken);

  if (userToken) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;