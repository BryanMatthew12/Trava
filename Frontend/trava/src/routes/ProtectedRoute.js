import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { token as selectToken } from '../slices/auth/authSlice'; // Import the token selector

const ProtectedRoute = ({ children }) => {
  const userToken = useSelector(selectToken); // Get the token from Redux

  // If no token, redirect to "/"
  if (!userToken) {
    console.log('No token, redirecting to login');
    return <Navigate to="/Login" replace />;
  }

  // If token exists, render the children (protected component)
  return children;
};

export default ProtectedRoute;