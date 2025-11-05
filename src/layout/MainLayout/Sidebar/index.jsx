import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { useMediaQuery, Divider, Drawer, Grid, Box } from '@mui/material';

// third party
import PerfectScrollbar from 'react-perfect-scrollbar';
import Logo from '../../../assets/images/alphatechLogo.jpg';

// project import
import MenuList from './MenuList';
import { drawerWidth } from 'config.js';
import NavCard from './MenuList/NavCard';

// custom style
const Nav = styled((props) => <nav {...props} />)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    width: drawerWidth,
    flexShrink: 0
  }
}));

// ==============================|| SIDEBAR ||============================== //

const Sidebar = ({ drawerOpen, drawerToggle, modalOpen }) => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const drawer = (
    <>
      <Box sx={{ display: { md: 'none', xs: 'block' } }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          elevation={5}
          alignItems="center"
          spacing={0}
          sx={{
            ...theme.mixins.toolbar,
            lineHeight: 0,
            background: theme.palette.primary.main,
            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
          }}
        >
          <Grid item>
            <img
              src={Logo}
              alt="Logo"
              style={{
                // background:'blue',
                width: '19%',
                height: '18%',
                marginLeft: '3px',
                objectFit: 'cover'
              }}
            />
            <span className="text-white" style={{ marginLeft: '2px' }}>
              Maha Vikas Group
            </span>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <PerfectScrollbar style={{ height: 'calc(100vh - 65px)', padding: '10px' }}>
        <MenuList drawerToggle={drawerToggle} />
        <NavCard />
      </PerfectScrollbar>
    </>
  );

  return (
    <Nav>
      {modalOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // Customize the backdrop color
            zIndex: theme.zIndex.drawer + 1 // Ensure it overlays the sidebar
          }}
        />
      )}
      <Drawer
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={drawerOpen}
        onClose={drawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            borderRight: 'none',
            boxShadow: '0 0.15rem 1.75rem 0 rgba(33, 40, 50, 0.15)',
            backgroundColor: modalOpen ? 'rgba(0, 0, 0, 0.5)' : 'white', // Dark overlay when modal is open
            transition: 'background-color 0.3s ease', // Smooth transition effect
            top: { md: 64, sm: 0 }
          }
        }}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
    </Nav>
  );
};

Sidebar.propTypes = {
  drawerOpen: PropTypes.bool,
  drawerToggle: PropTypes.func,
  modalOpen: PropTypes.bool
};

export default Sidebar;
