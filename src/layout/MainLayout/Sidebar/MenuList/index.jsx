import React, { useContext } from 'react';

// material-ui
import { Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { ConfigContext } from 'context/ConfigContext';
import { hasPermission } from 'Middleware/permissionUtils';
// ==============================|| MENULIST ||============================== //
const filterMenuItemsByPermission = (items, permissions) => {
  return items
    .map((item) => {
      if (item.type === 'item') {
        // Match with item.moduleName instead of item.id
        return hasPermission(permissions, item.moduleName) ? item : null;
      }

      if (item.type === 'collapse' || item.type === 'group') {
        const visibleChildren = filterMenuItemsByPermission(item.children || [], permissions);
        return visibleChildren.length ? { ...item, children: visibleChildren } : null;
      }

      return null;
    })
    .filter(Boolean);
};


const MenuList = ({ drawerToggle }) => {
  const { permissions } = useContext(ConfigContext);


  const filteredMenu = filterMenuItemsByPermission(menuItem.items, permissions);
  console.log(filteredMenu, 'sssssssssssssssss');

  const navItems = filteredMenu.map((item) => {
    console.log(item, 'wwwwwwwwwwwwwwww');

    if (item.type === 'group') {
      return <NavGroup key={item.id} item={item} drawerToggle={drawerToggle} />;
    }

    return (
      <Typography key={item.id} variant="h6" color="error" align="center">
        Menu Items Error
      </Typography>
    );
  });


  return navItems;
};

export default MenuList;
