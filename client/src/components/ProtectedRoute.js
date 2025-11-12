import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { manager, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!manager) return <Navigate to="/login" replace />;

  return children;
}
