import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // If no token, redirect to 404 or login
  if (!token) return <Navigate to="/404" replace />;

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded); // Optional: see token contents

    // Check if role is admin
    if (decoded.role !== 'admin') {
      return <Navigate to="/404" replace />;
    }
    
    return children;

  } catch (err) {
    // Invalid or malformed token
    console.error("Token decode error:", err.message);
    return <Navigate to="/404" replace />;
  }
};

export default ProtectedAdminRoute;
