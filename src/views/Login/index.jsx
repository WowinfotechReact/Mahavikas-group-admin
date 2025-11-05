import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import BGVdo from '../../assets/images/loginAnimation.jpg';
// import BGVdo from '../../assets/images/istockphoto.mp4';

// project import
import AuthLogin from './AuthLogin';

// assets

import Logo from '../../assets/images/alphatechLogo.jpg';
// import Logo from '../../assets/images/velvetLogo.png'

// ==============================|| LOGIN ||============================== //

const Login = () => {
  const theme = useTheme();

  return (
    <Grid
      container
      justifyContent="flex-end"
      alignItems="center"
      sx={{
        backgroundImage: `url(${BGVdo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Grid item xs={11} sm={7} md={6} lg={4} xl={3} sx={{ mr: theme.spacing(5) }}>
        <Card
          sx={{
            overflow: 'visible',
            display: 'flex',
            position: 'relative',
            maxWidth: '475px',
            borderRadius: theme.spacing(2),
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          <CardContent sx={{ p: theme.spacing(5, 4, 3, 4) }}>
            <Grid container direction="column" spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <Grid container justifyContent="center">
                  <Grid style={{ background: 'transparent' }}>
                    <img height={100} width={120} alt="Auth method" src={Logo} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <AuthLogin />
              </Grid>
              <Grid container justifyContent="flex-start" sx={{ mt: theme.spacing(2), mb: theme.spacing(1) }}>
                <Grid item></Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Login;
