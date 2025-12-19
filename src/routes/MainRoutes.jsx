import React, { Suspense, lazy, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';
import { useAuth } from 'context/ConfigContext';

const Followup = Loadable(lazy(() => import('views/Follow Up/FollowupList')));
import Loader from 'Loader';
import ProductList from 'views/Product/ProductList';

import PermissionList from 'views/Master Crud/Role/PermissionList';

import FieldServiceReport from 'views/Field Service Report/FieldServiceReport';
import ProjectViewDetails from 'views/Product/ProjectViewDetails';
import MasterVillageList from 'views/Master Crud/Master Village/MasterVillageList';
import MasterTalukaList from 'views/Master Crud/Master Taluka/MasterTalukaList';
import MasterDistrictList from 'views/Master Crud/Master District/MasterDistrictList';
import MasterStateList from 'views/Master Crud/Master State/MasterStateList';
import ProjectWiseAttendanceReport from 'views/Reports/ProjectWiseAttendanceReport';
import InstituteWiseAttendanceReport from 'views/Reports/InstituteWiseAttendanceReport';
import MasterServiceList from 'views/Master Crud/Master Service/MasterServiceList';
import SiteEngineerReport from 'views/Reports/SiteEngineerReport';
import ZoneManager from 'views/Master Crud/Zone Master/ZoneAssignedList';
import InstituteEmployeeList from 'views/Customer Firm Master/Institute Employee/InstituteEmployeeList';
import AdminEmployeeList from 'views/Admin Employee/AdminEmployeeList';
import AttendanceLetter from 'views/Hazeri/AttendanceLetter';
import AttandanceFormat from 'views/Attandance Format/AttandanceFormat';
import MasterZoneList from 'views/Master Crud/Master Zone/MasterZoneList';
import MapCityList from 'views/Master Crud/Zone Master/MapCityList';
import MvgEmployeeReportList from 'views/Reports/MvgEmployeeReportList';
import SuperWiserList from 'views/Super Wiser/SuperWiserList';
import HelpAndSupportList from 'views/Help & Support/HelpAndSupportList';
import ImgUploadList from 'views/Product/Img Upload/ImgUploadList';
const Profile = Loadable(lazy(() => import('Profile')));
const EmployeeList = Loadable(lazy(() => import('views/Employee/EmployeeList')));
const CustomerFirmList = Loadable(lazy(() => import('views/Customer Firm Master/CustomerFirmList')));
const Designation = Loadable(lazy(() => import('views/Master Crud/Designation/Designation')));
const DashboardDefault = Loadable(lazy(() => import('views/Dashboard/Default')));
const ProtectedRoute = ({ children }) => {


  const navigate = useNavigate()
  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem("user"));
    if (!storedAuth) {
      navigate("/login")
    }
  }, []);
  const { authToken } = useAuth();

  return authToken ? <Suspense fallback={<Loader />}>{children}</Suspense> : <Navigate to="/login" />;
};
// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '/',
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardDefault />
        </Suspense>
      )
    },


    {
      path: '/follow-up',
      element: (
        <Suspense fallback={<Loader />}>
          <Followup />
        </Suspense>
      )
    },

    {
      path: '/employee-list',
      element: (
        <Suspense fallback={<Loader />}>
          <EmployeeList />
        </Suspense>
      )
    },

    {
      path: '/institute-master',
      element: (
        <Suspense fallback={<Loader />}>
          <CustomerFirmList />
        </Suspense>
      )
    },

    {
      path: '/designation',
      element: (
        <Suspense fallback={<Loader />}>
          <Designation />
        </Suspense>
      )
    },



    {
      path: '/project',
      element: <ProductList />
    },

    {
      path: '/project-details-view',
      element: <ProjectViewDetails />
    },
    {
      path: '/field-service-report',
      element: <FieldServiceReport />
    },


    {
      path: '/master-village',
      element: (
        <Suspense fallback={<Loader />}>
          <MasterVillageList />
        </Suspense>
      )
    },
    {
      path: '/master-state',
      element: (
        <Suspense fallback={<Loader />}>
          <MasterStateList />
        </Suspense>
      )
    },
    {
      path: '/project-wise-attendance-report',
      element: (
        <Suspense fallback={<Loader />}>
          <ProjectWiseAttendanceReport />
        </Suspense>
      )
    },
    {
      path: '/institute-wise-attendance-report',
      element: (
        <Suspense fallback={<Loader />}>
          <InstituteWiseAttendanceReport />
        </Suspense>
      )
    },


    {
      path: '/master-district',
      element: (
        <Suspense fallback={<Loader />}>
          <MasterDistrictList />
        </Suspense>
      )
    },
    {
      path: '/master-taluka',
      element: (
        <Suspense fallback={<Loader />}>
          <MasterTalukaList />
        </Suspense>
      )
    },

    {
      path: '/master-role-type',
      element: (
        <Suspense fallback={<Loader />}>
          <PermissionList />
        </Suspense>
      )
    },
    {
      path: '/zone-manager',
      element: (
        <Suspense fallback={<Loader />}>
          <MasterZoneList />
        </Suspense>
      )
    },
    {
      path: '/mapped-city',
      element: (
        <Suspense fallback={<Loader />}>
          <MapCityList />
        </Suspense>
      )
    },
    {
      path: '/employee-wise-attendance-report',
      element: (
        <Suspense fallback={<Loader />}>
          <MvgEmployeeReportList />
        </Suspense>
      )
    },
    {
      path: '/super-wiser',
      element: (
        <Suspense fallback={<Loader />}>
          <SuperWiserList />
        </Suspense>
      )
    },
    {
      path: '/admin-employee',
      element: (
        <Suspense fallback={<Loader />}>
          <AdminEmployeeList />
        </Suspense>
      )
    },
    {
      path: '/help-and-support',
      element: (
        <Suspense fallback={<Loader />}>
          <HelpAndSupportList />
        </Suspense>
      )
    },
    {
      path: '/hazeri-namuna',
      element: (
        <Suspense fallback={<Loader />}>
          <AttendanceLetter />
        </Suspense>
      )
    },
    {
      path: '/attandance-format',
      element: (
        <Suspense fallback={<Loader />}>
          <AttandanceFormat />
        </Suspense>
      )
    },
    {
      path: '/institute-employee',
      element: (
        <Suspense fallback={<Loader />}>
          <InstituteEmployeeList />
        </Suspense>
      )
    },
    {
      path: '/project-documents-upload',
      element: (
        <Suspense fallback={<Loader />}>
          <ImgUploadList />
        </Suspense>
      )
    },





    {
      path: '/admin-profile',
      element: (
        <Suspense fallback={<Loader />}>
          <Profile />
        </Suspense>
      )
    },







    {
      path: '/master-service',
      element: (
        <Suspense fallback={<Loader />}>
          <MasterServiceList />
        </Suspense>
      )
    },

    {
      path: '/site-engineer-report',
      element: (
        <Suspense fallback={<Loader />}>
          <SiteEngineerReport />
        </Suspense>
      )
    },
  ]
};

export default MainRoutes;
