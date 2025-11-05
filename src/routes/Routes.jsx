import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'context/ConfigContext';

const PrivateRoute = () => {
  const { authToken } = useAuth();

  return authToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
