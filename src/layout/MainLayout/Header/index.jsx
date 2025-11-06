import PropTypes from 'prop-types';
import React, { useEffect, useState, useMemo, useContext } from 'react';
import Select from 'react-select';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { GetCompanyLookupList } from 'services/Master Crud/MasterCompany';

// project import
import ProfileSection from './ProfileSection';
import Logo from '../../../assets/images/logo.jpeg';
// assets

import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { ConfigContext, useAuth } from 'context/ConfigContext';

// ==============================|| HEADER ||============================== //

const Header = ({ drawerToggle, drawerWidth }) => {
  const { user } = useContext(ConfigContext);

  console.log(user.roleTypeID, 'iujgd08s7agd08s7agdysa');

  const { companyID, changeCompany } = useAuth();
  const [companyOption, setCompanyOption] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const theme = useTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536
      }
    }
  });

  // useEffect(() => {
  //   const initializeComponent = async () => {
  //     await GetCompanyLookupListData();
  //     setIsInitialized(true);
  //   };
  //   initializeComponent();
  // }, []);

  const selectedCompany = useMemo(() => {
    if (!companyOption?.length) return null;
    return companyOption?.find((option) => option.value == companyID) || null;
  }, [companyID, companyOption]);

  const GetCompanyLookupListData = async () => {
    try {
      const response = await GetCompanyLookupList(user?.userKeyID);

      if (response?.data?.statusCode === 200) {
        const companyLookupList = response?.data?.responseData?.data || [];
        const formattedCompanyList = companyLookupList?.map((company) => ({
          value: company?.companyKeyID,
          label: company?.companyName,
          companyKeyID: company?.companyKeyID
        }));

        setCompanyOption(formattedCompanyList);

        if (!companyID && formattedCompanyList?.length > 0) {
          changeCompany(formattedCompanyList[0]?.value);
        } else if (companyID) {
          const companyExists = formattedCompanyList?.some((company) => company.value == companyID);
          if (!companyExists && formattedCompanyList?.length > 0) {
            changeCompany(formattedCompanyList[0]?.value);
          } else {
            changeCompany(companyID);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching company list:', error);
    }
  };

  const handleCompanyChange = (selectedOption) => {
    if (!selectedOption) return;
    const selectedCompanyID = selectedOption.value;
    changeCompany(selectedCompanyID);
    refreshProjectData(selectedCompanyID);
  };

  const refreshProjectData = (selectedCompanyID) => {
    console.log(`Refreshing data for companyID: ${selectedCompanyID}`);
  };

  const renderHeaderContent = () => (
    <>
      <Box
        width={drawerWidth}
      //  sx={{ zIndex: 1201 }}
      >
        <Grid container justifyContent="space-between" alignItems="center">
          {/* Logo & Text Section - Hidden on mobile */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' }, // Responsive display
              alignItems: 'center',
              marginRight: theme.spacing(8)
            }}
          >
            {/* Logo image box */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: '#f0f0f0',
                marginRight: theme.spacing(1.5)
              }}
            >
              <img
                src={Logo}
                alt="Logo"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                  objectFit: 'contain',
                  padding: '5px'
                }}
              />
            </Box>

            {/* Text */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#fff',
                  display: { xs: 'none', md: 'block' } // Double protection
                }}
              >
                Maha Vikas Group

              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'white',
                  display: { xs: 'none', md: 'block' }
                }}
              >
                {/* {user.roleTypeID === 1 && "Super Admin"}
                {user.roleTypeID === 2 && "Admin"}
                {user.roleTypeID === 3 && "CRM"}
                {user.roleTypeID === 4 && "Store"}
                {user.roleTypeID === 5 && "Accountant"} */}
                Admin
              </Typography>

            </Box>
          </Box>


          {/* Company Dropdown & Hamburger Icon */}
          <Grid
            item
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
              justifyContent: { xs: 'space-between', md: 'flex-start' } // Adjust spacing
            }}
          >
            <IconButton
              edge="start"
              sx={{ mr: theme.spacing(1.25) }}
              color="inherit"
              aria-label="open drawer"
              onClick={drawerToggle}
              size="large"
            >
              <MenuTwoToneIcon sx={{ fontSize: '1.5rem' }} />
            </IconButton>

            {/* <Box sx={{ 
            width: { xs: '200px', md: '250px' }, // Responsive width
            ml: { xs: theme.spacing(1), md: theme.spacing(2) }
          }}>
            <Select
              options={companyOption}
              value={selectedCompany}
              onChange={handleCompanyChange}
              menuPosition="fixed"
              placeholder="Select a company"
              isLoading={!isInitialized || companyOption.length === 0}
              isClearable={false}
              styles={{
                container: (base) => ({
                  ...base,
                  width: '100%', // Use full container width
                }),
                control: (base) => ({
                  ...base,
                  width: '100%',
                  minWidth: { xs: '190px', md: '350px' } // Responsive min-width
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: '#808080'
                }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected ? '#606060' : isFocused ? '#707070' : '#808080',
                  color: '#FFFFFF'
                }),
                singleValue: (base) => ({
                  ...base,
                  color: '#000000'
                })
              }}
            />
          </Box> */}
          </Grid>
        </Grid>
      </Box>

      {/* Spacer with responsive adjustment */}
      <Box
        sx={{
          flexGrow: 1,
          display: { xs: 'none', md: 'block' } // Hide on mobile if needed
        }}
      />

      {/* Profile Section - Moved to the end in mobile */}
      <Box sx={{ display: { xs: 'flex', md: 'block' }, ml: 'auto' }}>
        <ProfileSection sx={{ paddingRight: { xs: theme.spacing(2), md: 0 } }} />
      </Box>
    </>
  );

  return renderHeaderContent();
};

Header.propTypes = {
  drawerToggle: PropTypes.func.isRequired,
  drawerWidth: PropTypes.number.isRequired
};

export default Header;
