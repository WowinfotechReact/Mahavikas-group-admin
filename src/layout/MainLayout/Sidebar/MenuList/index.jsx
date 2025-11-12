import React from 'react';

// material-ui
import { Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// ==============================|| MENULIST (NO PERMISSIONS) ||============================== //
const MenuList = ({ drawerToggle }) => {
  // Render all items from menuItem.items without permission checks
  const navItems = (menuItem.items || []).map((item) => {
    if (item.type === 'group') {
      return <NavGroup key={item.id} item={item} drawerToggle={drawerToggle} />;
    }

    // If you have collapse/item at root and want to handle them,
    // add more rendering logic here. For now keep a visible fallback.
    return (
      <Typography key={item.id} variant="h6" color="error" align="center">
        Menu Items Error
      </Typography>
    );
  });

  return <>{navItems}</>;
};

export default MenuList;
