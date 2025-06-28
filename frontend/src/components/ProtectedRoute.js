import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Protected route component that checks if user is authenticated
export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="text-center p-5">Loading...</div>;
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login/client" />;
};

// Manager route - only allows manager users
export const ManagerRoute = () => {
  const { isAuthenticated, isManager, loading } = useAuth();
  
  if (loading) return <div className="text-center p-5">Loading...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/login/manager" />;
  }
  
  return isManager ? <Outlet /> : <Navigate to="/" />;
};

// Client route - only allows client users
export const ClientRoute = () => {
  const { isAuthenticated, isClient, loading } = useAuth();
  
  if (loading) return <div className="text-center p-5">Loading...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/login/client" />;
  }
  
  return isClient ? <Outlet /> : <Navigate to="/" />;
};
