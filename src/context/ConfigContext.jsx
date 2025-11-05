import React, { createContext, useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Loader from '../Loader'; // Ensure correct import path for Loader

// Initial state for Config Context
export const ConfigContext = createContext();

// Config Provider
export const ConfigProvider = ({ children }) => {


  const [loader, setLoader] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [companyID, setCompanyID] = useState(localStorage.getItem('companyID') || null);
  const navigate = useNavigate();
  const [reloadOnce, setReloadOnce] = useState(false); // Flag to control reload


  const [user, setUser] = useState(() => {
    // Retrieve user from localStorage if available
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  const [permissions, setPermissions] = useState(() => {
    const storedPermissions = localStorage.getItem('permissions');
    return storedPermissions ? JSON.parse(storedPermissions) : [];
  });

  const [roleTypeName, setRoleTypeName] = useState(() => {
    return localStorage.getItem('roleTypeName') || '';
  });

  // Login handler
  const login = (token, userData) => {
    // Remove the password property from userData
    const { password, userAccessList, roleTypeName, ...userDataWithoutPassword } = userData;

    // Set token and user data in state
    setAuthToken(token);
    setUser(userDataWithoutPassword);

    setPermissions(userAccessList || []);
    setRoleTypeName(roleTypeName || '');

    // Save token and user details (without password) to localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userDataWithoutPassword));
    localStorage.setItem('permissions', JSON.stringify(userAccessList || []));
    localStorage.setItem('roleTypeName', roleTypeName || '');

    navigate('/'); // Navigate to the desired route after login
  };

  // Logout handler
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setCompanyID(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); // Remove user details from localStorage
    localStorage.removeItem('companyID');

    localStorage.removeItem('permissions');
    localStorage.removeItem('roleTypeName');


    navigate('/login');
    window.location.reload();

  };

  // Handle company selection
  const changeCompany = (newCompanyID) => {
    if (newCompanyID && newCompanyID !== companyID) {
      setCompanyID(newCompanyID);
      localStorage.setItem('companyID', newCompanyID);
      setReloadOnce(true); // Set flag to trigger a one-time reload
    }
  };

  useEffect(() => {
    if (reloadOnce) {
      // Reload the component or perform necessary actions
      window.location.reload(); // Reloads the page without using the cache

      console.log('Reloading component for companyID:', companyID);
      setReloadOnce(false); // Reset the flag after reload
    }
  }, [reloadOnce, companyID]); // Only run when reloadOnce is true or companyID changes


  // Redirect to login if no token is present
  useEffect(() => {
    if (!authToken) {
      navigate('/login');
    }
  }, [authToken, navigate]);

  const formatTimeToAmPm = (time) => {
    return dayjs(time).format('hh:mm A');
  };

  const setListCount = (list) => {
    return list.length;
  };


  useEffect(() => {
    // Check if we're accessing through /logout path
    if (location.pathname === '/logout') {
      logout(); // Clear auth data
      // Force reload after logout
      // window.location.reload();
    }
  }, [logout]);

  return (
    <ConfigContext.Provider
      value={{
        loader,
        setLoader,
        authToken,
        user,
        login,
        companyID,
        changeCompany,
        logout,
        formatTimeToAmPm,
        setListCount,
        roleTypeID: user?.roleTypeID,
        roleTypeName,
        permissions, // 👈 Add this

      }}
    >
      {children}
      {loader && <Loader />}
    </ConfigContext.Provider>
  );
};

ConfigProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook for authentication
export const useAuth = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useAuth must be used within a ConfigProvider');
  }
  return {
    authToken: context?.authToken,
    user: context?.user,
    companyID: context?.companyID,
    changeCompany: context?.changeCompany,
    login: context?.login,
    logout: context?.logout,
  };
};

// Utility function for formatting date
export const formatDate = (newValue) => {
  if (dayjs(newValue).isValid()) {
    return dayjs(newValue).format('YYYY-MM-DD');
  }
};

export default ConfigProvider;
