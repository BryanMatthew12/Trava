import React from 'react';
import { useSelector } from 'react-redux';
import { token as selectToken } from './slices/auth/authSlice'; // Rename the imported selector
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userToken = useSelector(selectToken); // Use a different name for the local variable

  // If no token, redirect to "/"
  if (!userToken || userToken === 'undefined') {
    return <Navigate to="/Login" replace />;
  }

  // If token exists, render the children (protected component)
  return children;
};

export default ProtectedRoute;