import React from 'react';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { useMediaQuery, AppBar, Box, Toolbar } from '@mui/material';

// project import
import { drawerWidth } from 'config.js';
import Header from './Header';
import Sidebar from './Sidebar';

// custom style
const Main = styled((props) => <main {...props} />)(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  [theme.breakpoints.up('md')]: {
    marginLeft: -drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`
  }
}));

const OutletDiv = styled((props) => <div {...props} />)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3)
  },
  padding: theme.spacing(5)
}));

// ==============================|| MAIN LAYOUT ||============================== //
const routeTitles = {
  '/': 'Dashboard - Maha Vikas Group',
  '/admin-employee': 'Admin Employee - Maha Vikas Group',
  '/institute-employee': 'Institute Employee - Maha Vikas Group',
  '/attandance-format': 'Attendance Format  - Maha Vikas Group',
  '/institute-wise-attendance-report': 'Institute Wise Attendance Report - Maha Vikas Group',
  '/field-service-report': 'Field Service Report - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/designation': 'Designation - Maha Vikas Group',
  '/master-service': 'Services - Maha Vikas Group',
  '/site-engineer-report': 'Site Engineer Report - Maha Vikas Group',
  '/zone-manager': 'Zone Manager - Maha Vikas Group',
  '/employee-list': 'Employee Master - Maha Vikas Group',
  '/project-wise-attendance-report': 'Project Wise Attendance Report - Maha Vikas Group',
  '/employee-type': 'Employee Type - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/designation': 'Designation - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/blood-group': 'Blood Group - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/institute-master': 'Institute - Maha Vikas Group',
  '/follow-up': 'Follow Up - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/lead': 'Lead - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/amc-tabs': 'AMC - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/followup': 'Followup - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/complaints-tabs': 'Complaints - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/customer-view': 'Customer  - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/vehicle-table': 'Vehicle - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/device-tabs': 'Device  - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/staff-view': 'Employee - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance ',
  '/recharge-table': 'Recharge - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/recharge-foam': 'Add/Update Recharge - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/mahakhanij-data-list': 'Mahakhanij Data - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/master-company': 'Company - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/cgm-table-list': 'CGM - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/cgm-gps-report-data': 'CGM GPS - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/transync-table-list': 'Transync - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/transync-Gps-data-report': 'Transync GPS - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/militrack-tabs-list': 'Militrack - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/installation-tabs-list': 'Inventory - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/trackin-view-table': 'Trackin - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/svts-mis-collection': 'Mis SVTS  - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/svts-2-mis-collection': 'Mis SVTS 2 - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/vihaana-mis-collection': 'Mis Vihaana - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/trackin-mis-table': 'Mis Tracking - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/crm-vs-other-mis-collection': 'Mis CRM Vs Other - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/master-state': 'State - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/master-district': 'District - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/master-taluka': 'Taluka - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/master-village': 'Village - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/master-vehicle': 'Vehicle - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/master-complaint-type': 'Complaint type - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/recharge': 'Recharge - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/manufacturer-view': 'Manufacturer - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/login': 'Login - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/installation': 'Installation - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/maha-khanij-view-data': 'Mahakhanij View - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/master-zone': 'Zone - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/master-mapping-state': 'State Mapping - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/master-mapping-district': 'District Mapping - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/master-role-type': 'Role Type - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/manufacturer-model-view': 'Manufacture Model - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/admin-profile': 'Admin Profile - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/master-government-portal-data': 'Government Portal Data - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/add-product-sales-order': 'Serial No To Product - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/invoice-list': 'Invoice - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/inventory-add-update': 'Inventory - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/warranty-expired-report': 'Reports - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/amc-purchase-order': 'AMC PO - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/original-equipment-manufacturer-installation': 'OEM Installation - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/original-equipment-manufacturer-warranty-report': 'OEM Warranty Report - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/original-equipment-manufacturer-product-add-update': 'OEM Add Update - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/amc-purchase-order-invoice': 'AMC PO  - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/amc-add-invoice-list': 'AMC Invoice  - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/sales-order-management': 'Sales Order Management - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/activity-logs-details': 'Activity Logs - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/original-equipment-manufacturer-Purchased-order-list': 'OEM PO - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/original-equipment-manufacturer-purchased-order': 'OEM Purchase Order - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/warranty-visit-schedule': 'Warranty Visit Schedule - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/call-details-journey': 'Call Details Journey - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/quotation-logs': 'Quotation Logs - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/amc-quotation-preview': 'AMC Quotation - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/original-equipment-manufacturer-master': 'OEM Master - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/pre-amc-invoice-preview': 'Pre AMC Invoice - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/outstanding-report': 'Outstanding  - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/all-customer-lead-report': 'All Customer Lead Report  - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/banner': 'Banner - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/tax-invoice-report': 'Tax Invoice Report - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/oem-quotation-preview': 'OEM Quotation Preview - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/project-details-view': 'Project Details - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',

  // '/stock-assign-list': 'Stock Assign - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/government-portal-data': 'Government Portal Data - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/manufacturer': 'Manufacturer - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/rating': 'Rating - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/add-update-quotation': 'Quotation - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/quotation-num-format': 'Quotation Number Format - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/termsAndConditions': 'Terms And Conditions - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/inventory-report': 'Inventory Report - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/ready-for-dispatch': 'Ready For Dispatch - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/dispatched-order': 'Dispatched Order - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/amc-visit-schedule': 'Amc Visit Schedule - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/customer-details': 'Customer Details - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/project': 'Project - Maha Vikas Group',
  '/quotation-preview': 'Quotation Preview - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/quotation-list': 'Quotation List - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/purchase-order-management': 'Purchase Order management - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/call-registration': 'Call Registration - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance',
  '/model-list': 'Model - Alpha Tech System | Battery & Inverter Sales, Service & Maintenance'

};

const MainLayout = () => {
  // Detect route changes
  const location = useLocation();

  const theme = useTheme();
  const matchUpLg = useMediaQuery(theme.breakpoints.up('lg'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  React.useEffect(() => {
    // Update the document title based on the current path
    const title = routeTitles[location.pathname];
    document.title = title;
  }, [location]);

  React.useEffect(() => {
    setDrawerOpen(matchUpLg);
  }, [matchUpLg]);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <AppBar position="fixed" sx={{ backgroundColor: '#FF7D34', zIndex: 1201 }}>
        <Toolbar>
          <Header drawerOpen={drawerOpen} drawerToggle={handleDrawerToggle} />
        </Toolbar>
      </AppBar>
      <Sidebar drawerOpen={drawerOpen} drawerToggle={handleDrawerToggle} />
      <Main
        style={{
          ...(drawerOpen && {
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen
            }),
            marginLeft: 0,
            marginRight: 'inherit'
          })
        }}
      >
        <Box sx={theme.mixins.toolbar} />
        <OutletDiv>
          <Outlet />
        </OutletDiv>
      </Main>
    </Box>
  );
};

export default MainLayout;
