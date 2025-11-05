import React, { useContext, useState } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Fade, Button, ClickAwayListener, Paper, Popper, List, ListItemText, ListItemIcon, ListItemButton } from '@mui/material';
// assets
import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import MeetingRoomTwoToneIcon from '@mui/icons-material/MeetingRoomTwoTone';
import { Navigate, useNavigate } from 'react-router';
import { ConfigContext, useAuth } from 'context/ConfigContext';
import EmployeeProfileModal from 'component/EmployeeProfileModal';
import LogoutConfirmModal from 'component/LogoutConfirmModal';
import LogoutModal from 'component/LogoutConfirmModal';

// ==============================|| PROFILE SECTION ||============================== //

const ProfileSection = () => {
  const navigate = useNavigate()
  const theme = useTheme();
  const { user } = useContext(ConfigContext);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [showEmployeeProfile, setShowEmployeeProfile] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [modelRequestData, setModelRequestData] = useState({
    Action: null,
    employeeKeyID: null
  });
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };



  const ClickToProfileUpdate = (row) => {
    setOpen((prevOpen) => !prevOpen);
    {
      setModelRequestData({
        ...modelRequestData,
        Action: 'Update',
        employeeKeyID: user.userKeyID
      });
    }
    let adminProfile = {
      Action: 'Update',
      employeeKeyID: user.userKeyID
    };

    navigate('/admin-profile', { state: adminProfile });
  };

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const SessionLogout = () => {
    setShowLogoutModal(true);
  };

  return (
    <>
      <Button
        sx={{ minWidth: { sm: 50, xs: 35 } }}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        aria-label="Profile"
        onClick={handleToggle}
        color="inherit"
      >
        <AccountCircleTwoToneIcon sx={{ fontSize: '1.5rem' }} />
      </Button>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 10]
            }
          },
          {
            name: 'preventOverflow',
            options: {
              altAxis: true
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <List
                  sx={{
                    width: '100%',
                    maxWidth: 350,
                    minWidth: 250,
                    backgroundColor: theme.palette.background.paper,
                    pb: 0,
                    borderRadius: '10px'
                  }}
                >
                  <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
                    <ListItemIcon>
                      <PersonTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText primary="Profile" onClick={() => ClickToProfileUpdate()} />
                  </ListItemButton>

                  <ListItemButton selected={selectedIndex === 4}>
                    <ListItemIcon>
                      <MeetingRoomTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" onClick={SessionLogout} />
                  </ListItemButton>
                </List>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
      {showEmployeeProfile &&

        <EmployeeProfileModal show={showEmployeeProfile} onHide={() => setShowEmployeeProfile(false)} modelRequestData={modelRequestData} />
      }
      <LogoutModal show={showLogoutModal} onCancel={() => setShowLogoutModal(false)} modelRequestData={modelRequestData} />
      {/* <
      show={showLogoutModal}
      onConfirm={handleLogout}
      onCancel={() => setShowLogoutModal(false)}
    /> */}
    </>
  );
};

export default ProfileSection;
