// src/components/NoRequireAuth.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const NoRequireAuth = () => {
  const { isLoggedIn, user, token } = useSelector((state) => state.auth);

  // ✅ Enhanced debugging (remove in production)
  console.log("🔍 NoRequireAuth Debug:");
  console.log("isLoggedIn:", isLoggedIn);
  console.log("user:", user);
  console.log("user._id:", user?._id);
  console.log("token:", token);

  // ✅ More comprehensive auth check
  const isAuthenticated = isLoggedIn && user && (user._id || user.id) && token;

  // ✅ If authenticated, redirect to dashboard
  // ✅ If not authenticated, allow access to public routes
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default NoRequireAuth;
