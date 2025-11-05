import PropTypes from 'prop-types';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

// third party
import { useSelector, useDispatch } from 'react-redux';

// project import
import * as actionTypes from 'store/actions';

// assets
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// ==============================|| NAV ITEM ||============================== //

const NavItem = ({ item, level,drawerToggle  }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Check if the screen is mobile

  const customization = useSelector((state) => state.customization || {});
  const dispatch = useDispatch();
  const Icon = item.icon;
  const itemIcon = item.icon ? <Icon color="inherit" /> : <ArrowForwardIcon color="inherit" fontSize={level > 0 ? 'inherit' : 'default'} />;
  const location = useLocation();
  const isActive = location.pathname === item.url; // Check if current route matches the item's URL
  const handleClick = () => {
    if (isMobile) {
      drawerToggle(); // Close sidebar only if on mobile
    }
  };
  let itemTarget = '';
  if (item.target) {
    itemTarget = '_blank';
  }
  let listItemProps = { component: Link, to: item.url };
  if (item.external) {
    listItemProps = { component: 'a', href: item.url };
  }

  return (
    <ListItemButton
      disabled={item.disabled}
      sx={{
        backgroundColor: isActive ? 'rgba(0, 0, 255, 0.1)' : 'transparent', // Highlight active link
        ...(level > 1 && { backgroundColor: isActive ? 'rgba(0, 0, 255, 0.1)' : 'transparent', }),
        borderRadius: '5px',
        marginBottom: '5px',
        pl: `${level * 16}px`,
        
      }}
      selected={customization.isOpen === item.id}
      component={Link}
      onClick={() => dispatch({ type: actionTypes.MENU_OPEN, isOpen: item.id },handleClick())}
      to={item.url}
      target={itemTarget}
      {...listItemProps}
    >
      <ListItemIcon sx={{ minWidth: 25 }}>{itemIcon}</ListItemIcon>
      <ListItemText
      primary={item.title}
      primaryTypographyProps={{
        color: isActive ? 'rgb(51,102,255)' : 'gray', // Change text color for active link
        fontWeight: isActive ? 'normal' : 'normal', // Bold font for active link
      }}    
      />
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  icon: PropTypes.object,
  target: PropTypes.object,
  url: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  title: PropTypes.string,
  caption: PropTypes.string,
  chip: PropTypes.object,
  color: PropTypes.string,
  label: PropTypes.string,
  avatar: PropTypes.object
};

export default NavItem;
