import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { token as selectToken } from '../slices/auth/authSlice'; // Import the token selector

const PublicRoute = ({ children }) => {
  const userToken = useSelector(selectToken); // Get the token from Redux

  // If token exists, redirect to "/home"
  if (userToken) {
    console.log('Token exists:', userToken);
    return <Navigate to="/home" replace />;
  }

  console.log('No token, rendering public route:', userToken);

  // If no token, render the children (public component)
  return children;
};

export default PublicRoute;