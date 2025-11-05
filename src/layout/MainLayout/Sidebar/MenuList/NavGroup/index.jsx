import PropTypes from 'prop-types';
import React, { useContext } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, Typography } from '@mui/material';

// project import
import NavItem from '../NavItem';
import NavCollapse from '../NavCollapse';
import { ConfigContext } from 'context/ConfigContext';

// ==============================|| NAVGROUP ||============================== //

const NavGroup = ({ item,drawerToggle  }) => {
  const {  user,  } = useContext(ConfigContext);
  console.log(typeof(user.roleTypeID) ,'doushadiusabdiusa');
  
  const hideCompany = user?.roleTypeID !== 1; // ❗ only show Company if roleTypeID is 1
console.log(hideCompany,'onjd983h2ndwsdsad');

  const theme = useTheme();
  const items = item.children.map((menu) => {
    if (hideCompany && menu.title === 'Company') {
      return null;
    }
    switch (menu.type) {
      case 'collapse':
        return <NavCollapse key={menu.id} menu={menu} level={1} drawerToggle={drawerToggle} />;
      case 'item':
        return <NavItem key={menu.id} item={menu} level={1} drawerToggle={drawerToggle} />;
      default:
        return (
          <Typography key={menu.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return (
    <>
      {items}
      </>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object,
  children: PropTypes.object,
  title: PropTypes.string,
  caption: PropTypes.string
};

export default NavGroup;
