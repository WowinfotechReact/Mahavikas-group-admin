// import React from 'react';
// import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { useAuth } from 'context/ConfigContext';

// const PrivateRoute = () => {
//   const { authToken } = useAuth();
//   const location = useLocation();

//   if (!authToken) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return <Outlet />;
// };