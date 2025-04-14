import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { token as selectToken } from '../slices/auth/authSlice';

const PublicRoute = ({ children }) => {
  const userToken = useSelector(selectToken);

  if (userToken) {
    console.log('Token exists:', userToken);
    return <Navigate to="/home" replace />;
  }

  console.log('No token, rendering public route:', userToken);

  return children;
};

export default PublicRoute;