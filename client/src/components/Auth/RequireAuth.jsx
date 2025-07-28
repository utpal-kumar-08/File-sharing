// src/components/RequireAuth.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
  const { isLoggedIn, user, token } = useSelector((state) => state.auth);

  // ✅ Enhanced debugging (remove in production)
  console.log("🔍 RequireAuth Debug:");
  console.log("isLoggedIn:", isLoggedIn);
  console.log("user:", user);
  console.log("user._id:", user?._id);
  console.log("token:", token);

  // ✅ More comprehensive auth check
  const isAuthenticated = isLoggedIn && user && (user._id || user.id) && token;

  // ✅ Clear invalid auth state if detected
  if (isLoggedIn && (!user || !user._id)) {
    console.log("❌ Invalid auth state detected in RequireAuth");
    // You might want to dispatch a logout action here
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
