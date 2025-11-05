import React from 'react';

// material-ui
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';

// third-party
import { useSelector } from 'react-redux';

// project import
import theme from 'themes';
import Routes from 'routes/index';
import NavigationScroll from './NavigationScroll';
import CustomCursor from 'CustomCursor';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);


  return (
    <>
      {
        <NavigationScroll>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme(customization)}>
              <CssBaseline />
              <ToastContainer />
              {/* <CustomCursor /> */}
              <Routes />
            </ThemeProvider>
          </StyledEngineProvider>
        </NavigationScroll>
      }
    </>
  );
};

export default App;
