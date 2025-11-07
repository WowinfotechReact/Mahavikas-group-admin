import React, { Suspense, lazy, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';
const GpsTracking = Loadable(lazy(() => import('views/Gps-Tracking/GpsTracking'))); import { useAuth } from 'context/ConfigContext';

const DeviceTabs = Loadable(lazy(() => import('views/DeviceTabs/DeviceTabs')));
const ViewStaffList = Loadable(lazy(() => import('component/Staff/ViewStaffList')));
const RechargeTable = Loadable(lazy(() => import('component/VLTD/RechargeTable')));
const AddUpdateRechargeForm = Loadable(lazy(() => import('component/VLTD/AddUpdateRechargeForm')));
const MahakhanijList = Loadable(lazy(() => import('views/Gov-Portal-Data/Mahakhanij/MahakhanijList')));
const CGMTableList = Loadable(lazy(() => import('views/Gov-Portal-Data/CGM/CGMTableList')));
const CgmGpsDataReport = Loadable(lazy(() => import('views/Gov-Portal-Data/Cgm-Gps-Data-Report/CgmGpsDataReportList')));
const TransyncList = Loadable(lazy(() => import('views/Gov-Portal-Data/Transync/TransyncList')));
const TransGpsDataReportList = Loadable(lazy(() => import('views/Gov-Portal-Data/Transync Data Report/Transync-Gps-Data-Report-TableList')));
const MiliTrackTabs = Loadable(lazy(() => import('views/MiliTrack/MiliTrackTabs')));
const TrackinTableViewList = Loadable(lazy(() => import('views/Trackin/TrackinTableViewList')));
const MISSVTSCollection = Loadable(lazy(() => import('views/MIS/SVTS1/MISSVTSCollection')));
const MISSVTS2Collection = Loadable(lazy(() => import('views/MIS/SVTS2/MISSVTS2Collection')));
const VihaanaCollection = Loadable(lazy(() => import('views/MIS/Vihaana/VihaanaCollection')));
const MISTrackingCollection = Loadable(lazy(() => import('views/MIS/Trackin/MISTrackingCollection')));
const MisCrmVsOther = Loadable(lazy(() => import('views/MIS/CRM vs Other/MisCrmVsOther')));
const Recharge = Loadable(lazy(() => import('views/Recharge/RechargeList')));
const Followup = Loadable(lazy(() => import('views/Follow Up/FollowupList')));
const MahaKhanijViewComponent = Loadable(lazy(() => import('views/Gov-Portal-Data/Mahakhanij/MahaKhanijViewComponent')));
const CustomerView = Loadable(lazy(() => import('views/Customer/CustomerList')));
const VehicleTable = Loadable(lazy(() => import('views/Vehicle/VehicleTable')));
// const MasterStateList = Loadable(lazy(() => import('views/Master Crud/Master State/MasterStateList')));
// const MasterDistrictList = Loadable(lazy(() => import('views/Master Crud/Master District/MasterDistrictList')));
// const MasterTalukaList = Loadable(lazy(() => import('views/Master Crud/Master Taluka/MasterTalukaList')));
// const MasterCompanyList = Loadable(lazy(() => import('views/Master Crud/Master Company/MasterCompanyList')));
// const MasterVehicleList = Loadable(lazy(() => import('views/Master Crud/Master Vehicle/MasterVehicleList')));
// const MasterComplaintTypeList = Loadable(lazy(() => import('views/Master Crud/Master Complaint Type/MasterComplaintTypeList')));
// const CommandViewList = Loadable(lazy(() => import('views/Command/CommandViewList')));
// const ManufacturerList = Loadable(lazy(() => import('views/Manufacturer/ManufacturerList')));
// const ManufacturerModalList = Loadable(lazy(() => import('views/Manufacturer Model/ManufacturerModalList')));
// const InstallationDeviceList = Loadable(lazy(() => import('views/Installation Device/InstallationDeviceList')));
// const MasterVillageList = Loadable(lazy(() => import('views/Master Crud/Master Village/MasterVillageList')));
// const InstalledDevice = Loadable(lazy(() => import('views/Installed Device/InstalledDevice')));
import Loader from 'Loader';
import ProductList from 'views/Product/ProductList';
import ManufacturerList from 'views/Manufacturer/ManufacturerList';
import ModelList from 'views/Model/ModelList';
import VariantList from 'views/Master Crud/Variant/VariantList';
import QuotationNumberFormatList from 'views/Quotation-Number-Format/QuotationNumFormatList';
import TermsAndConditionsList from 'views/TermsAndConditions/TermsAndConditionsList';
import QuotationFormatWithProduct from 'views/Quotation Format/QuotationFormatWithProduct';
import QuotationPreviewPage from 'views/Quotation Format/QuotationPreviewPage';
import QuotationList from 'views/Quotation Tabs/QuotationList';
import PurchasedOrderManagementList from 'views/Sales WorkFlow/PurchasedOrderManagementList';
import SalesOrderList from 'views/Sales Order/SalesOrderList';
import SalesOrderProductSerialNo from 'views/Sales Order/SalesOrderProductSerialNo';
import StockAssignList from 'views/Model/Stock Assign/StockAssignList';
import CallRegistrationList from 'views/Call Registration/CallRegistrationList';
import PermissionList from 'views/Master Crud/Role/PermissionList';
import InvoiceList from 'views/Invoice/InvoiceList';
import WarrantyExpiredReportTabList from 'views/Reports/WarrantyExpiredReportTabList';
import AMCQuotationList from 'views/AMC/AMCQuotationList';
import AmcPOList from 'views/AMC/AmcPOList';
import AMCAddInvoiceList from 'views/AMC/AMCAddInvoiceList';
import AMCScheduleVisitList from 'views/AMC/AMCScheduleVisitList';
import OEMInstallationList from 'views/Original Equipment Manufacturer/OEMInstallationList';
import OEMWarrantyList from 'views/Original Equipment Manufacturer/OEMWarrantyList';
import OEMProductList from 'views/Original Equipment Manufacturer/OEMProductList';
import FieldServiceReport from 'views/Field Service Report/FieldServiceReport';
import ReadyForDispatchList from 'views/Sales WorkFlow/ReadyForDispatchList';
import DispatchedOrderList from 'views/Sales WorkFlow/DispatchedOrderList';
import InventoryAddUpdateList from 'views/Inventory/InventoryAddUpdateList';
import ActivityLogsList from 'views/Lead/Activity Logs/ActivityLogsList';
import InventoryReportList from 'views/Inventory/InventoryReportList';
import OemProductDetails from 'views/Original Equipment Manufacturer/OEM Purchased Order/OemProductDetails';
import OemMasterList from 'views/Original Equipment Manufacturer/OEM Master/OemMasterList';
import OemPoList from 'views/Original Equipment Manufacturer/OEM Purchased Order/OemPoList';
import WarrantyVisitSchedule from 'views/Warranty Visit Schedule/WarrantyVisitSchedule';
import CallDetailsJourney from 'views/Call Details Journey/CallDetailsJourney';
import PreInvoicePreview from 'views/AMC/AMC Invoice/PreInvoicePreview';
import BannerList from 'views/Banner/BannerList';
import OutStandingReport from 'views/Outstanding Report/OutStandingReport';
import AllCustomerLeadReport from 'views/Outstanding Report/AllCustomerLeadReportList';
import TaxInvoiceReport from 'views/TaxInvoiceReport';
import QuotationLogsList from 'views/Quotation Tabs/QuotationLogsList';
import AMCQuotationPreviewPage from 'views/Quotation Format/AMCQuotationPreviewPage';
import OEMQuotationPreview from 'views/Original Equipment Manufacturer/OEM Purchased Order/OEMQuotationPreview';
import ProjectViewDetails from 'views/Product/ProjectViewDetails';
import MasterVillageList from 'views/Master Crud/Master Village/MasterVillageList';
import MasterTalukaList from 'views/Master Crud/Master Taluka/MasterTalukaList';
import MasterDistrictList from 'views/Master Crud/Master District/MasterDistrictList';
import MasterStateList from 'views/Master Crud/Master State/MasterStateList';
import ProjectWiseAttendanceReport from 'views/Reports/ProjectWiseAttendanceReport';
import InstituteWiseAttendanceReport from 'views/Reports/InstituteWiseAttendanceReport';
import MasterServiceList from 'views/Master Crud/Master Service/MasterServiceList';
import SiteEngineerReport from 'views/Reports/SiteEngineerReport';
// const MasterZoneList = Loadable(lazy(() => import('views/Master Crud/Master Zone/MasterZoneList')));
// const MasterDistrictMap = Loadable(lazy(() => import('views/Master Crud/Master Zone/MasterDistrictMap')));
const LeadList = Loadable(lazy(() => import('views/Lead/LeadList')));
// const MasterStateMap = Loadable(lazy(() => import('views/Master Crud/Master Zone/MasterStateMap')));
// const PermissionList = Loadable(lazy(() => import('views/Master Crud/Role/PermissionList')));
const AmcTabs = Loadable(lazy(() => import('views/Annual-Maintenance-Contract/AmcTabs')));
const ComplaintsTabs = Loadable(lazy(() => import('views/Complaints/ComplaintsTabs')));
const Profile = Loadable(lazy(() => import('Profile')));
// const MasterGovPortalData = Loadable(lazy(() => import('views/Master Crud/Master Gov Protal Data/MasterGovPortalData')));
// const GovernmentPortalData = Loadable(lazy(() => import('views/Gov Portal Data/GovernmentPortalData')));
// const MasterOperatorList = Loadable(lazy(() => import('views/Master Crud/Master Operator/MasterOperatorList')));
// const CustomerDetailsTab = Loadable(lazy(() => import('views/Customer/CustomerDetailsTab')));
const EmployeeList = Loadable(lazy(() => import('views/Employee/EmployeeList')));
const CustomerFirmList = Loadable(lazy(() => import('views/Customer Firm Master/CustomerFirmList')));
const EmployeeTypeList = Loadable(lazy(() => import('views/Master Crud/Employee Type/EmployeeTypeList')));
const Designation = Loadable(lazy(() => import('views/Master Crud/Designation/Designation')));
const BloodGroupList = Loadable(lazy(() => import('views/Master Crud/Blood Group/BloodGroupList')));
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
      path: '/lead',
      element: (
        <Suspense fallback={<Loader />}>
          <LeadList />
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
      path: '/amc-tabs',
      element: (
        <Suspense fallback={<Loader />}>
          <AmcTabs />
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
      path: '/complaints-tabs',
      element: (
        <Suspense fallback={<Loader />}>
          <ComplaintsTabs />
        </Suspense>
      )
    },
    {
      path: '/gps-track',
      element: (
        <Suspense fallback={<Loader />}>
          <GpsTracking />
        </Suspense>
      )
    },
    {
      path: '/customer-view',
      element: (
        <Suspense fallback={<Loader />}>
          <CustomerView />
        </Suspense>
      )
    },
    {
      path: '/vehicle-table',
      element: (
        <Suspense fallback={<Loader />}>
          <VehicleTable />
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
      path: '/employee-type',
      element: (
        <Suspense fallback={<Loader />}>
          <EmployeeTypeList />
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
      path: '/blood-group',
      element: (
        <Suspense fallback={<Loader />}>
          <BloodGroupList />
        </Suspense>
      )
    },
    {
      path: '/device-tabs',
      element: (
        <Suspense fallback={<Loader />}>
          <DeviceTabs />
        </Suspense>
      )
    },


    {
      path: '/project',
      element: <ProductList />
    },
    {
      path: '/manufacturer',
      element: <ManufacturerList />
    },
    {
      path: '/model-list',
      element: <ModelList />
    },
    {
      path: '/rating',
      element: <VariantList />
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
      path: '/quotation-num-format',
      element: <QuotationNumberFormatList />
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
      path: 'termsAndConditions',
      element: <TermsAndConditionsList />
    },
    {
      path: '/sales-order-management',
      element: <SalesOrderList />
    },
    {
      path: '/add-update-quotation',
      element: (
        <Suspense fallback={<Loader />}>
          <QuotationFormatWithProduct />
        </Suspense>
      )
    },
    {
      path: '/add-product-sales-order',
      element: (
        <Suspense fallback={<Loader />}>
          <SalesOrderProductSerialNo />
        </Suspense>
      )
    },
    // {
    //   path: '/stock-assign-list',
    //   element: (
    //     <Suspense fallback={<Loader />}>
    //       <StockAssignList />
    //     </Suspense>
    //   )
    // },
    {
      path: '/master-role-type',
      element: (
        <Suspense fallback={<Loader />}>
          <PermissionList />
        </Suspense>
      )
    },
    {
      path: '/invoice-list',
      element: (
        <Suspense fallback={<Loader />}>
          <InvoiceList />
        </Suspense>
      )
    },
    {
      path: '/ready-for-dispatch',
      element: (
        <Suspense fallback={<Loader />}>
          <ReadyForDispatchList />
        </Suspense>
      )
    },
    {
      path: '/dispatched-order',
      element: (
        <Suspense fallback={<Loader />}>
          <DispatchedOrderList />
        </Suspense>
      )
    },
    {
      path: '/inventory-add-update',
      element: (
        <Suspense fallback={<Loader />}>
          <InventoryAddUpdateList />
        </Suspense>
      )
    },
    {
      path: '/call-registration',
      element: (
        <Suspense fallback={<Loader />}>
          <CallRegistrationList />
        </Suspense>
      )
    },
    {
      path: '/inventory-report',
      element: (
        <Suspense fallback={<Loader />}>
          <InventoryReportList />
        </Suspense>
      )
    },
    {
      path: '/quotation-preview',
      element: (
        <Suspense fallback={<Loader />}>
          <QuotationPreviewPage />
        </Suspense>
      )
    },
    {
      path: '/quotation-list',
      element: (
        <Suspense fallback={<Loader />}>
          <QuotationList />
        </Suspense>
      )
    },
    {
      path: '/warranty-expired-report',
      element: (
        <Suspense fallback={<Loader />}>
          <WarrantyExpiredReportTabList />
        </Suspense>
      )
    },
    {
      path: '/amc-purchase-order',
      element: (
        <Suspense fallback={<Loader />}>
          <AMCQuotationList />
        </Suspense>
      )
    },
    {
      path: '/amc-purchase-order-invoice',
      element: (
        <Suspense fallback={<Loader />}>
          <AmcPOList />
        </Suspense>
      )
    },
    {
      path: '/amc-add-invoice-list',
      element: (
        <Suspense fallback={<Loader />}>
          <AMCAddInvoiceList />
        </Suspense>
      )
    },
    {
      path: '/amc-visit-schedule',
      element: (
        <Suspense fallback={<Loader />}>
          <AMCScheduleVisitList />
        </Suspense>
      )
    },
    {
      path: '/original-equipment-manufacturer-purchased-order',
      element: (
        <Suspense fallback={<Loader />}>
          <OemProductDetails />
        </Suspense>
      )
    },
    {
      path: '/original-equipment-manufacturer-master',
      element: (
        <Suspense fallback={<Loader />}>
          <OemMasterList />
        </Suspense>
      )
    },
    {
      path: '/original-equipment-manufacturer-Purchased-order-list',
      element: (
        <Suspense fallback={<Loader />}>
          <OemPoList />
        </Suspense>
      )
    },
    {
      path: '/activity-logs-details',
      element: (
        <Suspense fallback={<Loader />}>
          <ActivityLogsList />
        </Suspense>
      )
    },
    {
      path: '/original-equipment-manufacturer-installation',
      element: (
        <Suspense fallback={<Loader />}>
          <OEMInstallationList />
        </Suspense>
      )
    },
    {
      path: '/original-equipment-manufacturer-warranty-report',
      element: (
        <Suspense fallback={<Loader />}>
          <OEMWarrantyList />
        </Suspense>
      )
    },
    {
      path: '/original-equipment-manufacturer-product-add-update',
      element: (
        <Suspense fallback={<Loader />}>
          <OEMProductList />
        </Suspense>
      )
    },
    {
      path: '/amc-add-invoice',
      element: (
        <Suspense fallback={<Loader />}>
          <AmcPOList />
        </Suspense>
      )
    },
    {
      path: '/purchase-order-management',
      element: (
        <Suspense fallback={<Loader />}>
          <PurchasedOrderManagementList />
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
      path: '/warranty-visit-schedule',
      element: (
        <Suspense fallback={<Loader />}>
          <WarrantyVisitSchedule />
        </Suspense>
      )
    },
    {
      path: '/call-details-journey',
      element: (
        <Suspense fallback={<Loader />}>
          <CallDetailsJourney />
        </Suspense>
      )
    },
    {
      path: '/quotation-logs',
      element: (
        <Suspense fallback={<Loader />}>
          <QuotationLogsList />
        </Suspense>
      )
    },
    {
      path: '/amc-quotation-preview',
      element: (
        <Suspense fallback={<Loader />}>
          <AMCQuotationPreviewPage />
        </Suspense>
      )
    },
    {
      path: '/oem-quotation-preview',
      element: (
        <Suspense fallback={<Loader />}>
          <OEMQuotationPreview />
        </Suspense>
      )
    },
    {
      path: '/pre-amc-invoice-preview',
      element: (
        <Suspense fallback={<Loader />}>
          <PreInvoicePreview />
        </Suspense>
      )
    },
    {
      path: '/banner',
      element: (
        <Suspense fallback={<Loader />}>
          <BannerList />
        </Suspense>
      )
    },
    {
      path: '/outstanding-report',
      element: (
        <Suspense fallback={<Loader />}>
          <OutStandingReport />
        </Suspense>
      )
    },
    {
      path: '/all-customer-lead-report',
      element: (
        <Suspense fallback={<Loader />}>
          <AllCustomerLeadReport />
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
      path: '/tax-invoice-report',
      element: (
        <Suspense fallback={<Loader />}>
          <TaxInvoiceReport />
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
