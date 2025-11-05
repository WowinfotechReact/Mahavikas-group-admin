import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'context/ConfigContext';

const LogoutRoute = () => {
  const { logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Clear all auth data
    logout();
    
    // Prevent caching for logout page
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = function () {
        window.history.pushState(null, '', window.location.href);
      };
    }
  }, [logout]);

  // Always redirect to login
  return <Navigate to="/login" state={{ from: location }} replace />;
};
