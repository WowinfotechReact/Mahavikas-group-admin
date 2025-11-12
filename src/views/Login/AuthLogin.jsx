import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Grid, TextField, FormControl, FormLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { VerifyLoginCredential } from 'services/LoginAuth/LoginApi';
import { ConfigContext, useAuth } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { useNavigate } from 'react-router';
const AuthLogin = () => {
  const navigate = useNavigate();
  const { setLoader } = useContext(ConfigContext);

  const { login, authToken } = useAuth();
  const [requireErrorMessage, setRequireErrorMessage] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [LoginObj, setLoginObj] = useState({
    mobileNo: null,
    password: '',
    roleID: 1,
    companyID: 1
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
    // debugger;
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
    <>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          {ErrorMessage && (
            <div className="alert alert-danger fade show" style={{ fontSize: 'small', textAlign: 'center' }} role="alert">
              {ErrorMessage === 'Username or password is incorrect' ? 'Email or password is incorrect' : ErrorMessage}
            </div>
          )}
        </Grid>
      </Grid>

      <Grid container justifyContent="center" spacing={2} style={{ marginRight: '20px' }}>
        {/* Contact No. Field */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <FormLabel style={{ fontWeight: 500 }}>Contact No.</FormLabel>
            <TextField
              fullWidth
              margin="normal"
              name="mobileNo"
              type="text"
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
              }}
              variant="outlined"
              label=""
            />
            {requireErrorMessage && (
              <span className="mb-1" style={{ color: 'red' }}>
                {requireErrorMessage}
              </span>
            )}
          </FormControl>
        </Grid>

        {/* Password Field */}
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <FormLabel style={{ marginBottom: '4px', fontWeight: 500 }}>Password</FormLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              value={LoginObj.password}
              onChange={(e) => {
                const inputValue = e.target.value;
                const passwordWithoutSpaces = inputValue.replace(/\s+/g, '');
                setLoginObj({
                  ...LoginObj,
                  password: passwordWithoutSpaces
                });
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {requireErrorMessage && (!LoginObj.password || LoginObj.password.trim() === '') && (
              <label className="validation mt-1" style={{ color: 'red' }}>
                {ERROR_MESSAGES}
              </label>
            )}
          </FormControl>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Box mt={2}>
            <Button
              onClick={LoginBtnClicked}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#FF7D34',
                color: '#000', // Optional: set text color to black
                '&:hover': {
                  backgroundColor: '#e0e0e0' // Optional: hover effect
                }
              }}
            >
              Log In
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default AuthLogin;
