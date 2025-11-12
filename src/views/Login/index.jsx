
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import BGVdo from '../../assets/images/loginAnimation.jpg';
// import BGVdo from '../../assets/images/istockphoto.mp4';
import indiaGate from '../../assets/images/india.jpg'
// project import
import AuthLogin from './AuthLogin';
import MVGlogo from '../../assets/images/logo.jpeg'
// assets
import './main.css'
import Logo from '../../assets/images/logo.jpeg';

import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Grid, TextField, FormControl, FormLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { VerifyLoginCredential } from 'services/LoginAuth/LoginApi';
import { ConfigContext, useAuth } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { useNavigate } from 'react-router';
// import Logo from '../../assets/images/velvetLogo.png'

// ==============================|| LOGIN ||============================== //

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setLoader } = useContext(ConfigContext);

  const { login, authToken } = useAuth();
  const [requireErrorMessage, setRequireErrorMessage] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [LoginObj, setLoginObj] = useState({
    mobileNo: null,
    password: '',
    loginFrom: null,
    macAddress: null
  });

  // Prevent authenticated users from accessing login page
  useEffect(() => {
    if (authToken) {
      navigate('/', { replace: true });
    }
  }, [authToken, navigate]);

  // Prevent back navigation on login page
  useEffect(() => {
    const preventBackNavigation = () => {
      window.history.pushState(null, '', window.location.href);
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', preventBackNavigation);

    return () => {
      window.removeEventListener('popstate', preventBackNavigation);
    };
  }, []);

  // 2] This function validate email id & password is in valid format
  const LoginBtnClicked = () => {
    setErrorMessage('');
    if (!LoginObj.mobileNo || !LoginObj.password) {
      setRequireErrorMessage("This fields are required");
      return false;
    } else if (LoginObj.mobileNo.length !== 10) {
      setRequireErrorMessage("Mobile number must be 10 digits");
      return false;
    } else {
      setRequireErrorMessage('');
    }



    const ApiRequest_ParamsObj = {
      mobileNo: LoginObj.mobileNo,
      password: LoginObj.password,
      roleID: 1,
      companyID: 1


      // mobileNo: "8798789798",
      // password: "Wowadmin@1",
      // loginFrom: "CRM Panel",
      // macAddress: "123456789"

    };
    LoginData(ApiRequest_ParamsObj);
  };

  const LoginData = async (ApiRequest_ParamsObj) => {
    setLoader(true); // Start loading
    try {
      const response = await VerifyLoginCredential(ApiRequest_ParamsObj);

      if (response?.data?.statusCode === 200) {
        setLoader(false);
        const userData = response.data.responseData.data; // Extract user data
        const token = userData.token; // Extract token
        login(token, userData);

        window.history.pushState(null, '', '/');
      } else {
        // Handle all types of errors
        const errorMessage = response.response?.data?.errorMessage || 'An error occurred.';
        setLoader(false);
        setErrorMessage(errorMessage);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoader(false);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (location.pathname === '/logout') {
      const { logout } = useAuth();
      logout();
      // Replace current history entry
      window.location.replace('/login');
    }
  }, [location.pathname]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // useEffect(() => {
  //   const fetchIp = async () => {
  //     try {
  //       const response = await fetch('https://api.ipify.org?format=json');
  //       const data = await response.json();
  //       // setIpAddress(data.ip);
  //       setLoginObj((prev) => ({
  //         ...prev,
  //         macAddress: data.ip
  //       }));
  //       console.log(data.ip, 'IP Address');
  //     } catch (error) {
  //       console.error('Error fetching IP address:', error);
  //     }
  //   };
  //   fetchIp();
  // }, []);

  return (
    <div className="limiter">
      <div className="container-login100" style={{
        backgroundImage: `url(${indiaGate})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}>
        <div className="wrap-login100">
          <div className="login100-pic js-tilt" data-tilt>
            <img src={MVGlogo} alt="IMG" />
          </div>
          <div className="login100-form validate-form">
            <span className="login100-form-title">
              Admin Login
            </span>
            <div className="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
              <input className="input100" type="text" name="email"
                value={LoginObj.mobileNo}
                inputProps={{ maxLength: 10 }}
                autoComplete="off"
                placeholder="Enter 10-digit mobile number"
                onChange={(e) => {
                  setRequireErrorMessage(false)
                  const inputValue = e.target.value;
                  const updatedValue = inputValue.replace(/[^0-9]/g, ''); // only numbers allowed
                  setLoginObj({
                    ...LoginObj,
                    mobileNo: updatedValue
                  });
                }} />

              <span className="focus-input100" />
              <span className="symbol-input100">
                <i className="fa fa-phone" aria-hidden="true"></i>
              </span>
            </div>

            {requireErrorMessage && (!LoginObj.mobileNo || LoginObj.mobileNo.trim() === "") && (
              <label className="validation mt-1" style={{ color: "red" }}>
                {ERROR_MESSAGES}
              </label>
            )}

            <div
              className="wrap-input100 validate-input"
              data-validate="Password is required"
              style={{ position: "relative" }}
            >
              <input
                className="input100"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const passwordWithoutSpaces = inputValue.replace(/\s+/g, "");
                  setLoginObj({
                    ...LoginObj,
                    password: passwordWithoutSpaces,
                  });
                }}
                type={showPassword ? "text" : "password"}
                name="pass"
                placeholder="Password"
                value={LoginObj.password || ""}
              />

              {requireErrorMessage && (!LoginObj.password || LoginObj.password.trim() === "") && (
                <label className="validation mt-1" style={{ color: "red" }}>
                  {ERROR_MESSAGES}
                </label>
              )}

              <span className="focus-input100" />

              {/* Lock icon (left side) */}
              <span className="symbol-input100">
                <i className="fa fa-lock" aria-hidden="true" />
              </span>

              {/* 👁️ Eye toggle icon (right side) */}
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#999",
                }}
              >
                <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true" />
              </span>
            </div>
            <div className="wrap-input100 validate-input" data-validate="Company selection is required">
              <select
                className="input100"
                name="company"

              >
                <option value="">Select Company</option>
                <option value="GovProject">Company 1</option>
                <option value="PrivateLtd">Company 1</option>
                <option value="StartupIndia">Startup India</option>
              </select>

              <span className="focus-input100" />
              <span className="symbol-input100">
                <i className="fa fa-building" aria-hidden="true" />
              </span>
            </div>

            <div className="container-login100-form-btn">
              <button onClick={LoginBtnClicked} className="login100-form-btn" style={{ background: '#ff7d34' }}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
