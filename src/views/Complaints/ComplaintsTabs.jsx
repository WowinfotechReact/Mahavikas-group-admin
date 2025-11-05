import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Tabs, Tab, Button } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import Select from 'react-select';
import { Table } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { ConfigContext } from 'context/ConfigContext';
import { Link, useNavigate } from 'react-router-dom';
import AmcChangeStatusModal from './AmcChangeStatusModal';
import AddUpdateComplaintModal from './AddUpdateComplaintModule';
import PaginationComponent from 'component/Pagination';
import {
  ComplaintSalesReturnAccept,
  ComplaintStageChangeStatus,
  GetComplaintList,
  SalesReturnTransferDevice
} from 'services/ComplaintsApi/ComplaintApi';
import ComplaintChangeStatusModal from './ComplaintChangeStatusModal';
import SaleReturnMultipleChangeStatusModal from './SaleReturnMultipleChangeStatusModal';
import NoResultFoundModel from 'component/NoResultFoundModal';
import { GetRoleTypeLookupList } from 'services/Master Crud/MasterRoleTypeApi';
import { GetEmployeeLookupList } from 'services/Employee Staff/EmployeeApi';
import TransferComplaintModal from './TransferComplaintModal';
import ApproveRejectComplaint from './ApproveRejectComplaint';
import PendingComplaintsTransferModal from './PendingComplaintsTransferModal';
import DeviceSendToManufacturerModal from './DeviceSendToManufacturerModal';
import DeviceReceivedFromManufactureIMEI from './DeviceReceivedFromManufactureIMEI';
import ComplaintTransferLogModal from './ComplaintTransferLogModal';

const ComplaintsTabs = () => {
  const [selectedComplaints, setSelectedComplaints] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [ActiveTab, setActiveTab] = useState('pendingComplaints');
  const [showAmcChangeStatusModal, setShowAmcChangeStatusModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [apiParams, setApiParams] = useState(null);
  const [adminSaleReturnSelectedIDs, setAdminSaleReturnSelectedIDs] = useState([]);
  const [adminSaleReturnSelectAll, setAdminSaleReturnSelectAll] = useState(false);
  const [adminSendSalesReturnSelectAll, setAdminSendSalesReturnSelectAll] = useState(false);
  const [adminSendSalesReturnSelectedIDs, setAdminSendSalesReturnSelectedIDs] = useState([]);
  const [showTransferComplaintLogsModal, setShowTransferComplaintLogsModal] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modelAction, setModelAction] = useState('');
  const [moduleName, setModuleName] = useState('Complaints');
  // table state ,
 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(null);
  const [totalPages, setTotalPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(-1);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [pageSize, setPageSize] = useState(30);
  const [searchKeyword, setSearchKeyword] = useState(null);
  const [manufacturerListData, setManufacturerListData] = useState([]);
  const [complaintListData, setComplaintListData] = useState([]);
  const [showAddUpdateComplaintModal, setShowAddUpdateComplaintModal] = useState(false);
  const [showPendingChangeStatusModal, setShowPendingChangeStatusModal] = useState(false);
  const [showTransferComplaintModal, setShowTransferComplaintModal] = useState(false);
  const [adminSendSalesReturnComplaintModal, setAdminSendSalesReturnComplaintModal] = useState(false);
  const [showSaleReturnMultipleChangeStatusModal, setShowSaleReturnMultipleChangeStatusModal] = useState(false);
  const navigate = useNavigate();
  const { user, setLoader, companyID } = useContext(ConfigContext);
  // pending complaints transfer
  const [showPendingComplaintModal, setShowPendingComplaintModal] = useState(false);
  const [selectedComplaintIDs, setSelectedComplaintIDs] = useState([]);
  const [selectAllPendingComplaint, setSelectAllPendingComplaint] = useState(false);
  const [transferComplaintIDs, setTransferComplaintIDs] = useState([]); // This will be passed to modal
  // device send to manufacture
  const [manufacturerSelectedComplaintIDs, setManufacturerSelectedComplaintIDs] = useState([]);
  const [manufacturerSelectAll, setManufacturerSelectAll] = useState(false);
  const [showSendToManufacturerModal, setShowSendToManufacturerModal] = useState(false);
  const [complaintsForTransfer, setComplaintsForTransfer] = useState([]); // Data to send to modal

  const [showDeviceReceivedFromMgfModal, setShowDeviceReceivedFromMgfModal] = useState(false); // Data to send to modal

  const [modelRequestData, setModelRequestData] = useState({
    Action: null,
    complaintKeyID: null
  });

  useEffect(() => {
    if (ActiveTab === 'pendingComplaints') {
      GetManufacturerListData(1, null, null, null, 'Pending', 1);
    } else if (ActiveTab === 'completedComplaints') {
      GetManufacturerListData(1, null, null, null, 'Completed', 4);
    } else if (ActiveTab === 'saleReturnComplaints') {
      GetManufacturerListData(1, null, null, null, 'Sales Return', 3);
    } else if (ActiveTab === 'salesReturnRequest') {
      GetManufacturerListData(1, null, null, null, 'Request for Sales Return', 2);
    } else if (ActiveTab === 'saleReturnAcceptedComplaints') {
      GetManufacturerListData(1, null, null, null, 'Admin Sales Return Accept', 3);
    } else if (ActiveTab === 'employeeAcceptPendingTab') {
      GetManufacturerListData(1, null, null, null, 'Employee Accept Pending', 3);
    } else if (ActiveTab === 'employeeAcceptedSalesReturn') {
      GetManufacturerListData(1, null, null, null, 'Employee Accepted Sales Return', 3);
    } else if (ActiveTab === 'DeviceReceiveFromManufacturer') {
      GetManufacturerListData(1, null, null, null, 'Device Receive From Manufacturer', 3);
    } else if (ActiveTab === 'DeviceSendToManufacturer') {
      GetManufacturerListData(1, null, null, null, 'Device Send to Manufacturer', 3);
    }
  }, [selectedEmployee]);

  const GetManufacturerListData = async (pageNumber, searchKeywordValue, toDate, fromDate, tabName, complaintStatusID) => {
    setLoader(true);
    try {
      const data = await GetComplaintList({
        pageSize,
        // employeeKeyID: null,
        employeeKeyID: selectedEmployee ? selectedEmployee.value : null,

        // employeeKeyID: user.userKeyID,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        companyKeyID: companyID,
        tabName: tabName,
        complaintStatusID: complaintStatusID
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const manufacturerListData = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(manufacturerListData.length);
            setManufacturerListData(manufacturerListData);
          }
        } else {
          setErrorMessage(data?.data?.errorMessage);
          setLoader(false);
        }
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

 

  const handleManufacturerCheckboxChange = (complaintID) => {
    setManufacturerSelectedComplaintIDs((prev) =>
      prev.includes(complaintID) ? prev.filter((id) => id !== complaintID) : [...prev, complaintID]
    );
  };

  const handleManufacturerSelectAllChange = () => {
    if (manufacturerSelectAll) {
      setManufacturerSelectedComplaintIDs([]);
      setManufacturerSelectAll(false);
    } else {
      const allComplaintIDs = manufacturerListData.map((item) => item.complaintID);
      setManufacturerSelectedComplaintIDs(allComplaintIDs);
      setManufacturerSelectAll(true);
    }
  };
  const handleSendToManufacturerClick = () => {
    if (manufacturerSelectedComplaintIDs.length > 0) {
      setComplaintsForTransfer(manufacturerSelectedComplaintIDs);
      setShowSendToManufacturerModal(true);
    }
  };

  // --------------------4th  tab old device ---new device

  const [oldDeviceSelectedRows, setOldDeviceSelectedRows] = useState([]); // Selected rows for Old Devices
  const [newDeviceSelectedRows, setNewDeviceSelectedRows] = useState([]);

  const ComplaintAddBtnClicked = () => {
    setModelRequestData(() => ({
      ...modelRequestData,
      Action: null,
      complaintKeyID: null
    }));
    setShowAddUpdateComplaintModal(true);
  };

  const ComplaintUpdateBtnClicked = (item) => {
    setModelRequestData({
      ...modelRequestData,
      Action: 'Update',
      complaintKeyID: item.complaintKeyID
    });
    setShowAddUpdateComplaintModal(true);
  };
  const ComplaintTransferLogViewBtnClicked = (item) => {
    setModelRequestData({
      ...modelRequestData,
      Action: 'TransferView',
      complaintKeyID: item.complaintKeyID
    });
    setShowTransferComplaintLogsModal(true);
  };
  const receivedDeviceFromManufacturer = (item) => {
    setModelRequestData({
      ...modelRequestData,
      Action: 'ReceivedDevice',
      complaintID: item.complaintID
    });
    setShowDeviceReceivedFromMgfModal(true);
  };

  useEffect(() => {
    if (isAddUpdateActionDone) {
      if (ActiveTab === 'pendingComplaints') {
        GetManufacturerListData(1, null, null, null, 'Pending', 1);
      } else if (ActiveTab === 'completedComplaints') {
        GetManufacturerListData(1, null, null, null, 'Completed', 4);
      } else if (ActiveTab === 'saleReturnComplaints') {
        GetManufacturerListData(1, null, null, null, 'Sales Return', 3);
      } else if (ActiveTab === 'salesReturnRequest') {
        GetManufacturerListData(1, null, null, null, 'Request for Sales Return', 2);
      } else if (ActiveTab === 'saleReturnAcceptedComplaints') {
        GetManufacturerListData(1, null, null, null, 'Admin Sales Return Accept', 3);
      } else if (ActiveTab === 'employeeAcceptPendingTab') {
        GetManufacturerListData(1, null, null, null, 'Employee Accept Pending', 3);
      } else if (ActiveTab === 'employeeAcceptedSalesReturn') {
        GetManufacturerListData(1, null, null, null, 'Employee Accepted Sales Return', 3);
      } else if (ActiveTab === 'DeviceReceiveFromManufacturer') {
        GetManufacturerListData(1, null, null, null, 'Device Receive From Manufacturer', 3);
      } else if (ActiveTab === 'DeviceSendToManufacturer') {
        GetManufacturerListData(1, null, null, null, 'Device Send to Manufacturer', 3);
      }
  
      setSearchKeyword('');
      setIsAddUpdateActionDone(false);
    }
  }, [isAddUpdateActionDone]);
  
  const handleTabSelect = (key) => {
    if (key === 'pendingComplaints') {
      setActiveTab('pendingComplaints');
      GetManufacturerListData(1, null, null, null, 'Pending', 1);

      setInitialData();
    } else if (key === 'completedComplaints') {
      setActiveTab('completedComplaints');

      GetManufacturerListData(1, null, null, null, 'Completed', 4);
      setInitialData();
    } else if (key === 'saleReturnComplaints') {
      setActiveTab('saleReturnComplaints');
      GetManufacturerListData(1, null, null, null, 'Sales Return', 3);
      setInitialData();
    } else if (key === 'salesReturnRequest') {
      setActiveTab('salesReturnRequest');

      GetManufacturerListData(1, null, null, null, 'Request for Sales Return', 2);
    } else if (key === 'saleReturnAcceptedComplaints') {
      setActiveTab('saleReturnAcceptedComplaints');
      GetManufacturerListData(1, null, null, null, 'Admin Sales Return Accept', 3);
    } else if (key === 'employeeAcceptPendingTab') {
      setActiveTab('employeeAcceptPendingTab');
      GetManufacturerListData(1, null, null, null, 'Employee Accept Pending', 3);
    } else if (key === 'employeeAcceptedSalesReturn') {
      setActiveTab('employeeAcceptedSalesReturn');
      GetManufacturerListData(1, null, null, null, 'Employee Accepted Sales Return', 3);
    } else if (key === 'DeviceReceiveFromManufacturer') {
      setActiveTab('DeviceReceiveFromManufacturer');
      GetManufacturerListData(1, null, null, null, 'Device Receive From Manufacturer', 3);
    } else if (key === 'DeviceSendToManufacturer') {
      setActiveTab('DeviceSendToManufacturer');
      GetManufacturerListData(1, null, null, null, 'Device Send to Manufacturer', 3);
    }
  };

  const setInitialData = () => {
    setNewDeviceSelectedRows('');
    setOldDeviceSelectedRows('');
    setData([]);
  };
  const closeAllModal = () => {
    setShowSuccessModal(false);
    setData([]);
  };

  const handleComplaintPageChange = (pagenumber) => {
    setCurrentPage(pagenumber); // Update the current page based on the clicked page
    GetManufacturerListData(pagenumber, null, null, null, 'Pending', 1);
  };
  const handleEmployeeAcceptPending = (pagenumber) => {
    setCurrentPage(pagenumber); // Update the current page based on the clicked page
    GetManufacturerListData(pagenumber, null, null, null, 'Employee Accept Pending', 2);
  };

  const handleSaleReturnPageChange = (pagenumber) => {
    setCurrentPage(pagenumber); // Update the current page based on the clicked page
    GetManufacturerListData(pagenumber, null, null, null, 'Pending', 1);
  };

  const handleAdminSaleReturnPageChange = (pagenumber) => {
    setCurrentPage(pagenumber); // Update the current page based on the clicked page
    GetManufacturerListData(pagenumber, null, null, null, 'Admin Sales Return Accept', 2);
  };

  const handleCompletedComplaintPageChange = (pagenumber) => {
    setCurrentPage(pagenumber); // Update the current page based on the clicked page
    GetManufacturerListData(pagenumber, null, null, null, 'Completed', 4);
  };

  const handleEmployeeAcceptedSaleReturnComplaintPageChange = (pagenumber) => {
    setCurrentPage(pagenumber); // Update the current page based on the clicked page
    GetManufacturerListData(pagenumber, null, null, null, 'Employee Accepted Sales Return', 2);
  };
  useEffect(() => {
    moduleNameKey();
  }, [ActiveTab]);

  const moduleNameKey = () => {
    console.log(ActiveTab, 'sajkudh072389hedr');
    if (ActiveTab === 'pendingComplaints') {
      setModuleName('Complaint');
    } else if (ActiveTab === 'salesReturnRequest') {
      setModuleName('Sales Return Request');
    } else if (ActiveTab === 'saleReturnComplaints') {
      setModuleName('Sale Return');
    } else if (ActiveTab === 'saleReturnAcceptedComplaints') {
      setModuleName('Sale Return Accepted ');
    } else if (ActiveTab === 'completedComplaints') {
      setModuleName('Complaint Completed ');
    }
  };

  const changeStatusClick = (item) => {
    const ChangeApiParam = {
      userKeyID: user.userKeyID,
      employeeKeyID: user.userKeyID,
      complaintKeyID: item.complaintKeyID
      // complaintStatusID: item.complaintKeyID,
    };

    setApiParams(ChangeApiParam); // Store parameters in state
    setShowPendingChangeStatusModal(true);
  };

  const ComplaintStageChangeStatusData = async (finalParam) => {
    setLoader(true);

    try {
      const response = await ComplaintStageChangeStatus(finalParam); //Call this api

      if (response?.data.statusCode === 200) {
        setLoader(false);
        setIsAddUpdateActionDone(true);
        setShowSuccessModal(true);
        setShowPendingChangeStatusModal(false);
        setModelAction('Complaint Status changed successfully');
        setShowSuccessModal(true);
      } else {
        setLoader(false);
        setErrorMessage(response.data.errorMessage);
        // setErrors(true);
        console.error('Bad request');
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const handleCheckboxChange = (complaintID) => {
    setSelectedComplaints((prevSelected) => {
      if (prevSelected.includes(complaintID)) {
        // If already selected, unselect it
        return prevSelected.filter((id) => id !== complaintID);
      } else {
        // Else, add it to selected list (multi-select)
        return [...prevSelected, complaintID];
      }
    });
  };
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      // Select all complaints
      setSelectedComplaints(manufacturerListData.map((item) => item.complaintID));
    } else {
      // Deselect all
      setSelectedComplaints([]);
    }
  };

  const btnClickOfSaleReturnMultipleChangeStatus = () => {
    if (selectedComplaints.length === 0) {
      alert('Please select at least one complaint.');
      return;
    }

    const formattedParams = {
      userKeyID: user.userKeyID,
      employeeKeyID: user.userKeyID,
      complaintID: selectedComplaints // Store IDs as an array
    };

    setApiParams(formattedParams);
    setShowSaleReturnMultipleChangeStatusModal(true);
  };

  const ComplaintSalesReturnAcceptData = async () => {
    setLoader(true);

    try {
      const response = await ComplaintSalesReturnAccept(apiParams); //Call this api

      if (response?.data.statusCode === 200) {
        setLoader(false);
        setIsAddUpdateActionDone(true);
        setShowSuccessModal(true);

        setModelAction('Complaint Status changed successfully');
        setShowSuccessModal(true);
        setShowSaleReturnMultipleChangeStatusModal(false);
      } else {
        setLoader(false);
        setErrorMessage(response.data.errorMessage);
        // setErrors(true);
        console.error('Bad request');
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const SalesReturnTransferDeviceData = async () => {
    const params = {
      userKeyID: user.userKeyID,
      employeeKeyID: user.userKeyID,
      complaintID: adminSaleReturnSelectedIDs
    };

    setLoader(true);

    try {
      const response = await SalesReturnTransferDevice(params); //Call this api

      if (response?.data.statusCode === 200) {
        setLoader(false);
        setIsAddUpdateActionDone(true);
        setShowSuccessModal(true);

        setModelAction('Complaint transfer successfully');
        setShowSuccessModal(true);
        setShowTransferComplaintModal(false);
      } else {
        setLoader(false);
        setErrorMessage(response.data.errorMessage);
        // setErrors(true);
        console.error('Bad request');
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  const SendSalesReturnApprovalRequestData = async () => {
    const params = {
      userKeyID: user.userKeyID,
      employeeKeyID: user.userKeyID,
      complaintID: adminSaleReturnSelectedIDs
    };

    setLoader(true);

    try {
      const response = await SalesReturnTransferDevice(params); //Call this api

      if (response?.data.statusCode === 200) {
        setLoader(false);
        setIsAddUpdateActionDone(true);
        setShowSuccessModal(true);

        setModelAction('Complaint transfer successfully');
        setShowSuccessModal(true);
        setShowTransferComplaintModal(false);
      } else {
        setLoader(false);
        setErrorMessage(response.data.errorMessage);
        // setErrors(true);
        console.error('Bad request');
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  useEffect(() => {
    GetRoleTypeLookupListData();
    // GetEmployeeLookupListData()
  }, [modelRequestData]);
  const GetRoleTypeLookupListData = async () => {
    setLoader(true);
    try {
      const response = await GetRoleTypeLookupList(user.userKeyID); // Ensure this function is imported correctly
      if (response?.data?.statusCode === 200) {
        setLoader(false);
        const roleTypeLookupList = response?.data?.responseData?.data;
        const formattedRoles = roleTypeLookupList.map((roleType) => ({
          value: roleType.roleTypeID,
          label: roleType.roleTypeName
        }));
        setRoleTypes(formattedRoles);
      } else {
        setLoader(false);
        console.error('Failed to fetch role type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      setLoader(false);
      console.error('Error fetching role type lookup list:', error);
    }
  };

  const handleRoleChange = async (selectedRole) => {
    setSelectedRole(selectedRole);
    setEmployees([]); // Clear previous employees
    setSelectedEmployee(null); // Reset selected employee
    if (!selectedRole) return;

    try {
      const response = await GetEmployeeLookupList(selectedRole.value, companyID);
      if (response?.data?.statusCode === 200) {
        const formattedEmployees = response.data.responseData.data.map((emp) => ({
          value: emp.employeeKeyID,
          label: emp.name
        }));
        setEmployees(formattedEmployees);
      } else {
        console.error('Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      // setLoading(false);
    }
  };
  const handleEmployeeChange = (selectedEmployee) => {
    setSelectedEmployee(selectedEmployee);
  };

  const handleAdminSaleReturnSelectAll = () => {
    // Just deselect all when trying to use select all
    setAdminSaleReturnSelectedIDs([]);
    setAdminSaleReturnSelectAll(false);
  };
  const handleAdminSendSaleReturnSelectAll = () => {
    if (adminSendSalesReturnSelectAll) {
      setAdminSendSalesReturnSelectedIDs([]);
    } else {
      const allIDs = manufacturerListData.map((item) => item.complaintID);
      setAdminSendSalesReturnSelectedIDs(allIDs);
    }
    setAdminSendSalesReturnSelectAll(!adminSendSalesReturnSelectAll);
  };

  const handleAdminSaleReturnSingleCheck = (complaintID) => {
    // If the clicked item is already selected, deselect it
    if (adminSaleReturnSelectedIDs.includes(complaintID)) {
      setAdminSaleReturnSelectedIDs([]);
      setAdminSaleReturnSelectAll(false);
    } else {
      // Otherwise, select only this one
      setAdminSaleReturnSelectedIDs([complaintID]);
      setAdminSaleReturnSelectAll(false);
    }
  };
  const handleAdminSendSaleReturnSingleCheck = (complaintID) => {
    setAdminSendSalesReturnSelectedIDs((prev) =>
      prev.includes(complaintID) ? prev.filter((id) => id !== complaintID) : [...prev, complaintID]
    );
  };
  const handleTransferClick = () => {
    // Handle your logic here (API call, confirmation, etc.)
    setShowTransferComplaintModal(true);
  };
  const handleAdminSendSalesReturnClick = () => {
    // Handle your logic here (API call, confirmation, etc.)
    setAdminSendSalesReturnComplaintModal(true);
  };

  const handleComplaintSelectAll = () => {
    if (selectAllPendingComplaint) {
      setSelectedComplaintIDs([]);
      setSelectAllPendingComplaint(false);
    } else {
      const allComplaintIDs = manufacturerListData.map((item) => item.complaintID);
      setSelectedComplaintIDs(allComplaintIDs);
      setSelectAllPendingComplaint(true);
    }
  };

  const handleComplaintCheckboxChange = (complaintID) => {
    if (selectedComplaintIDs.includes(complaintID)) {
      const updated = selectedComplaintIDs.filter((id) => id !== complaintID);
      setSelectedComplaintIDs(updated);
      setSelectAllPendingComplaint(false);
    } else {
      const updated = [...selectedComplaintIDs, complaintID];
      setSelectedComplaintIDs(updated);
      if (updated.length === manufacturerListData.length) setSelectAllPendingComplaint(true);
    }
  };

  const handleTransferComplaintBtnClick = () => {
    if (selectedComplaintIDs.length > 0) {
      setTransferComplaintIDs(selectedComplaintIDs); // store current selection
      setShowPendingComplaintModal(true); // open modal
    }
  };
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <h4>{moduleName}</h4>
          <Select
            options={roleTypes}
            placeholder="Select Role Type"
            onChange={handleRoleChange}
            value={selectedRole} // Ensure selected value is controlled
            styles={{ container: (base) => ({ ...base, width: '250px' }) }} // Fixed width
          />
          <Select
            options={employees}
            placeholder="Select Employee"
            isDisabled={!selectedRole}
            value={selectedEmployee} // Ensure selected value is controlled
            onChange={handleEmployeeChange}
            styles={{ container: (base) => ({ ...base, width: '250px' }) }} // Fixed width
          />
          {ActiveTab === 'pendingComplaints' && (
            <>
              <div style={{ padding: '5px' }}>
                <Tooltip title="Add Complaint">
                  <button type="button" onClick={() => ComplaintAddBtnClicked()} className="btn btn-sm btn-primary">
                    <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                    <span className="d-none d-sm-inline"> Add Complaint</span>
                    <span className="d-inline d-sm-none"> Add</span>
                  </button>
                </Tooltip>
              </div>
              <Tooltip title="Transfer Complaint">
                {selectedComplaintIDs?.length > 0 && (
                  <button className="btn btn-primary btn-sm" onClick={handleTransferComplaintBtnClick}>
                    <i className="fa-solid fa-right-left me-1" style={{ fontSize: '11px' }}></i>
                    <span className="d-none d-sm-inline">Transfer Comp..</span>
                  </button>
                )}
              </Tooltip>
            </>
          )}
          {ActiveTab === 'saleReturnComplaints' && <div style={{ padding: '5px' }}></div>}
        </div>
        <Row>
          <Col>
            <Tabs activeKey={ActiveTab} id="justify-tab-example" onSelect={handleTabSelect}>
              {/* Raw Lead tab */}
              <Tab
                eventKey="pendingComplaints"
                title={
                  <Tooltip title="Complaints">
                    <span>Complaints</span>
                  </Tooltip>
                }
                tabClassName="tab-upcoming"
              >
                <div>
                  {/* <div className="container d-flex flex-column align-items-center vh-90"> */}
                  {/* <div style={{ width: '100%' }}> */}
                  {/* Submit Button */}
                  {/* <Button onClick={AddLeadBtn} variant="primary" className="mb-3">
                        Add Complaints
                      </Button> */}

                  {/* Table */}
                  <div className="table-responsive table_wrapper">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th className="text-center">
                            <input type="checkbox" checked={selectAllPendingComplaint} onChange={handleComplaintSelectAll} />
                          </th>
                          <th style={{ whiteSpace: 'nowrap' }}>Sr No.</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Status</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Customer Name</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Mobile Number</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Type</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Remark</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Device IMEI Number</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Date & Time</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Installed By</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Status Name </th>

                          <th className="actionSticky" style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {manufacturerListData?.map((item, idx) => (
                          <tr key={idx}>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                checked={selectedComplaintIDs.includes(item.complaintID)}
                                onChange={() => handleComplaintCheckboxChange(item.complaintID)}
                              />
                            </td>
                            <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                              {(currentPage - 1) * pageSize + idx + 1}
                            </td>
                            <td>
                              {item.complaintResolvedDateTimeStatus === 'TimeOut' ? (
                                <span className="blink-red">⚠ TimeOut</span>
                              ) : item.complaintResolvedDateTimeStatus === 'Pending' ? (
                                <span style={{ color: '#faad14', fontWeight: 'bold' }}>⏳ Pending</span>
                              ) : (
                                <span>{item.complaintResolvedDateTimeStatus}</span>
                              )}
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}> {item.customerName}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item.customerMobileNo}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintType}</td>
                            {/* <td style={{ whiteSpace: 'nowrap' }}>{item?.remark}</td> */}
                            <td className="text-center">
                              {item?.remark?.length > 30 ? (
                                <Tooltip title={item?.remark}>{`${item?.remark?.substring(0, 30)}...`}</Tooltip>
                              ) : (
                                <>{item?.remark}</>
                              )}
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.deviceIMEINumber}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintDate}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.installedBy}</td>
                            {/* <td style={{ whiteSpace: 'nowrap' }}>
                              <Link onClick={() => changeStatusClick(item)}>{item?.complaintStatusName}</Link>
                            </td>  */}
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintStatusName}</td>

                            <td className="actionColSticky" >
                            <div className="d-flex gap-1">
                              <Tooltip title="Update Complaint ">
                                <Button className="btn-sm d-flex me-1" onClick={() => ComplaintUpdateBtnClicked(item)}>
                                  <i class="fas fa-edit"></i>
                                </Button>
                              </Tooltip>
                              <Tooltip title="View Transfer Complaint Logs">
                                <Button className="btn-sm d-flex ms-1" onClick={() => ComplaintTransferLogViewBtnClicked(item)}>
                                <i className="fa-solid fa-eye"></i>
                                </Button>
                              </Tooltip>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                  </div>
                  {/* </div> */}
                  {/* </div> */}
                  {/* Pagination */}
                  {totalCount > pageSize && (
                    <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handleComplaintPageChange} />
                  )}
                </div>
              </Tab>

              <Tab
                eventKey="salesReturnRequest"
                title={
                  <Tooltip title="Sales Return Request ">
                    <span>Sales Return Request</span>
                  </Tooltip>
                }
                tabClassName="tab-upcoming"
              >
                <div>
                  <div className="table-responsive table_wrapper" style={{ maxHeight: '51vh' }}>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th className="text-center">
                            <input
                              type="checkbox"
                              checked={
                                manufacturerListData.length > 0 && adminSendSalesReturnSelectedIDs.length === manufacturerListData.length
                              }
                              onChange={handleAdminSendSaleReturnSelectAll}
                            />
                          </th>
                          <th style={{ whiteSpace: 'nowrap' }}>Sr No.</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Customer Name</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Mobile Number</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Type</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Remark</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Device IMEI Number</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Date & Time</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Installed By</th>
                          {/* <th style={{ whiteSpace: 'nowrap' }}>Complaint Status Name </th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {manufacturerListData?.map((item, idx) => (
                          <tr key={idx}>
                            <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                              <input
                                type="checkbox"
                                checked={adminSendSalesReturnSelectedIDs.includes(item.complaintID)}
                                onChange={() => handleAdminSendSaleReturnSingleCheck(item.complaintID)}
                              />
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>{(currentPage - 1) * pageSize + idx + 1}</td>
                            <td style={{ whiteSpace: 'nowrap' }}> {item.customerName}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item.customerMobileNo}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintType}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.remark}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.deviceIMEINumber}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintDate}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.installedBy}</td>
                            {/* <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintStatusName}</td> */}
                            {/* <td style={{ whiteSpace: 'nowrap' }}>
                              <Link onClick={() => changeStatusClick(item)}>{item?.complaintStatusName}</Link>
                            </td> */}
                            <td className="actionColSticky" style={{ whiteSpace: 'nowrap', zIndex: 4 }}></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                  </div>
                  {adminSendSalesReturnSelectedIDs.length > 0 && (
                    <div className="my-2 d-flex justify-content-center">
                      <button className="btn btn-primary" onClick={handleAdminSendSalesReturnClick}>
                        Approved / Reject{adminSendSalesReturnSelectedIDs.length > 1 ? 's' : ''}
                      </button>
                    </div>
                  )}
                  {/* </div> */}
                  {/* </div> */}
                  {/* Pagination */}
                  {totalCount > pageSize && (
                    <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handleAdminSaleReturnPageChange} />
                  )}
                </div>
              </Tab>
              <Tab
                eventKey="saleReturnComplaints"
                title={
                  <Tooltip title="Sale Return ">
                    <span>Sale Return </span>
                  </Tooltip>
                }
                tabClassName="tab-upcoming"
              >
                <div>
                  <div className="table-responsive table_wrapper" style={{ maxHeight: '51vh' }}>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th style={{ whiteSpace: 'nowrap' }}>
                            <input
                              type="checkbox"
                              onChange={handleSelectAll}
                              checked={selectedComplaints.length === manufacturerListData.length && manufacturerListData.length > 0}
                            />
                          </th>
                          <th style={{ whiteSpace: 'nowrap' }}>Sr No.</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Customer Name</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Mobile Number</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Type</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Remark</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Device IMEI Number</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Temporary Device</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Date & Time</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Installed By</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Status Name </th>

                          {/* <th className="actionSticky" style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                            Action
                          </th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {manufacturerListData?.map((item, idx) => (
                          <tr key={idx}>
                            <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                              <input
                                type="checkbox"
                                checked={selectedComplaints.includes(item.complaintID)}
                                onChange={() => handleCheckboxChange(item.complaintID)}
                              />
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>{(currentPage - 1) * pageSize + idx + 1}</td>
                            <td style={{ whiteSpace: 'nowrap' }}> {item.customerName}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item.customerMobileNo}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintType}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.remark}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.deviceIMEINumber}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.temporaryDeviceName}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintDate}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.installedBy}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintStatusName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                  </div>

                  {/* </div> */}
                  {/* </div> */}
                  {/* Pagination */}
                  {totalCount > pageSize && (
                    <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handleSaleReturnPageChange} />
                  )}
                </div>
                {selectedComplaints.length !== 0 && (
                  <Tooltip title="Accept Complaint">
                    <div className="d-flex justify-content-center my-1">
                      <button id="addBtn" onClick={btnClickOfSaleReturnMultipleChangeStatus} className="customBtn btn btn-primary">
                        <span className="d-none d-sm-inline"> Accept </span>
                        <span className="d-inline d-sm-none"> Status</span>
                      </button>
                    </div>
                  </Tooltip>
                )}
              </Tab>
              <Tab
                eventKey="saleReturnAcceptedComplaints"
                title={
                  <Tooltip title="Admin Sale Return Accepted ">
                    <span>Admin Sale Return Accepted </span>
                  </Tooltip>
                }
                tabClassName="tab-upcoming"
              >
                <div>
                  <div className="table-responsive table_wrapper" style={{ maxHeight: '51vh' }}>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th className="text-center">
                            <input type="checkbox" checked={manufacturerSelectAll} onChange={handleManufacturerSelectAllChange} />
                          </th>

                          <th style={{ whiteSpace: 'nowrap' }}>Sr No.</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Customer Name</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Mobile Number</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Type</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Remark</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Device IMEI Number</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Temporary Device</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Date & Time</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Installed By</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Status Name </th>
                        </tr>
                      </thead>
                      <tbody>
                        {manufacturerListData?.map((item, idx) => (
                          <tr key={idx}>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                checked={manufacturerSelectedComplaintIDs.includes(item.complaintID)}
                                onChange={() => handleManufacturerCheckboxChange(item.complaintID)}
                              />
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>{(currentPage - 1) * pageSize + idx + 1}</td>
                            <td style={{ whiteSpace: 'nowrap' }}> {item.customerName}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item.customerMobileNo}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintType}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.remark}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.deviceIMEINumber}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.temporaryDeviceName}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintDate}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.installedBy}</td>
                            {/* <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintStatusName}</td> */}
                            <td style={{ whiteSpace: 'nowrap' }}>
                              <Link onClick={() => changeStatusClick(item)}>{item?.complaintStatusName}</Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                  </div>
                  {/* {adminSaleReturnSelectedIDs.length > 0 && (
                     <div className="my-2 d-flex justify-content-center">
                      <button className="btn btn-primary" onClick={handleTransferClick}>
                        Transfer Selected Complaint{adminSaleReturnSelectedIDs.length > 1 ? 's' : ''}
                      </button>
                    </div>
                  )} */}
                  {manufacturerSelectedComplaintIDs.length > 0 && (
                    <div className="my-2 d-flex justify-content-center">
                      <button className="btn btn-primary mt-1  btn-sm" onClick={handleSendToManufacturerClick}>
                        <i className="fa-solid fa-paper-plane me-1" style={{ fontSize: '11px' }}></i>
                        Send to Manufacturer
                      </button>
                    </div>
                  )}

                  {/* </div> */}
                  {/* </div> */}
                  {/* Pagination */}
                  {totalCount > pageSize && (
                    <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handleAdminSaleReturnPageChange} />
                  )}
                </div>
              </Tab>
              <Tab
                eventKey="DeviceSendToManufacturer"
                title={
                  <Tooltip title="Device Send To Manufacturer">
                    <span>Device Send To Mfg. </span>
                  </Tooltip>
                }
                tabClassName="tab-upcoming"
              >
                <div>
                  <div className="table-responsive table_wrapper" style={{ maxHeight: '51vh' }}>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th style={{ whiteSpace: 'nowrap' }}>Sr No.</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Customer Name</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Mobile Number</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Type</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Remark</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Device IMEI Number</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Temporary Device</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Date & Time</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Installed By</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Status Name </th>

                          <th className="actionSticky" style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {manufacturerListData?.map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ whiteSpace: 'nowrap' }}>{(currentPage - 1) * pageSize + idx + 1}</td>
                            <td style={{ whiteSpace: 'nowrap' }}> {item.customerName}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item.customerMobileNo}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintType}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.remark}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.deviceIMEINumber}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.temporaryDeviceName}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintDate}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.installedBy}</td>
                            {/* <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintStatusName}</td> */}
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintStatusName}</td>
                            {/* <td style={{ whiteSpace: 'nowrap' }}>
                              <Link onClick={() => changeStatusClick(item)}>{item?.complaintStatusName}</Link>
                            </td> */}
                            <td className="actionColSticky" style={{ whiteSpace: 'nowrap', zIndex: 4 }}>
                              {/* <Button className="btn-sm d-flex ms-2" onClick={() => ChangeStatusBtnClick(item)}>
                                    Change
                                  </Button> */}
                              <Tooltip title="Change Status">
                                <Button className="btn-sm d-flex ms-2" onClick={() => receivedDeviceFromManufacturer(item)}>
                                  Change Status
                                </Button>
                              </Tooltip>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                  </div>

                  {/* </div> */}
                  {/* </div> */}
                  {/* Pagination */}
                  {totalCount > pageSize && (
                    <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handleAdminSaleReturnPageChange} />
                  )}
                </div>
              </Tab>
              <Tab
                eventKey="DeviceReceiveFromManufacturer"
                title={
                  <Tooltip title="Device Receive From  Manufacturer">
                    <span>Device Receive From Mfg. </span>
                  </Tooltip>
                }
                tabClassName="tab-upcoming"
              >
                <div>
                  <div className="table-responsive table_wrapper" style={{ maxHeight: '51vh' }}>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th style={{ whiteSpace: 'nowrap' }}>
                            <Tooltip title="Deselect All">
                              <input type="checkbox" checked={adminSaleReturnSelectAll} onChange={handleAdminSaleReturnSelectAll} />
                            </Tooltip>
                          </th>
                          <th style={{ whiteSpace: 'nowrap' }}>Sr No.</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Customer Name</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Mobile Number</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Type</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Remark</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Device IMEI Number</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Temporary Device Number</th>
                          <th style={{ whiteSpace: 'nowrap' }}>IMEI Number</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Date & Time</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Installed By</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Status Name </th>
                        </tr>
                      </thead>
                      <tbody>
                        {manufacturerListData?.map((item, idx) => (
                          <tr key={idx}>
                            <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                              <input
                                type="checkbox"
                                checked={adminSaleReturnSelectedIDs.includes(item.complaintID)}
                                onChange={() => handleAdminSaleReturnSingleCheck(item.complaintID)}
                              />
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>{(currentPage - 1) * pageSize + idx + 1}</td>
                            <td style={{ whiteSpace: 'nowrap' }}> {item.customerName}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item.customerMobileNo}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintType}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.remark}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.deviceIMEINumber}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.temporaryDeviceName}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.imeInumber}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintDate}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.installedBy}</td>
                            {/* <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintStatusName}</td> */}
                            <td style={{ whiteSpace: 'nowrap' }}>
                              <Link onClick={() => changeStatusClick(item)}>{item?.complaintStatusName}</Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                  </div>
                  {adminSaleReturnSelectedIDs.length > 0 && (
                    <div className="my-2 d-flex justify-content-center">
                      <button className="btn btn-primary" onClick={handleTransferClick}>
                        Transfer Selected Complaint{adminSaleReturnSelectedIDs.length > 1 ? 's' : ''}
                      </button>
                    </div>
                  )}
                  {/* </div> */}
                  {/* </div> */}
                  {/* Pagination */}
                  {totalCount > pageSize && (
                    <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handleAdminSaleReturnPageChange} />
                  )}
                </div>
              </Tab>
              <Tab
                eventKey="employeeAcceptPendingTab"
                title={
                  <Tooltip title="Employee Accept Pending ">
                    <span>Employee Accept Pending </span>
                  </Tooltip>
                }
                tabClassName="tab-upcoming"
              >
                <div>
                  {/* <div className="container d-flex flex-column align-items-center vh-90"> */}
                  {/* <div style={{ width: '100%' }}> */}
                  {/* Submit Button */}
                  {/* <Button onClick={AddLeadBtn} variant="primary" className="mb-3">
                        Add Complaints
                      </Button> */}
                  {/* Table */}
                  <div className="table-responsive table_wrapper">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th style={{ whiteSpace: 'nowrap' }}>Sr No.</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Customer Name</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Mobile Number</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Type</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Remark</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Device IMEI Number</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Temporary Device</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Date & Time</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Installed By</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Status Name </th>
                        </tr>
                      </thead>
                      <tbody>
                        {manufacturerListData?.map((item, idx) => (
                          <tr key={idx}>
                            <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                              {(currentPage - 1) * pageSize + idx + 1}
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}> {item.customerName}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item.customerMobileNo}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintType}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.remark}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.deviceIMEINumber}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.temporaryDeviceName}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintDate}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.installedBy}</td>
                            {/* <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintStatusName}</td> */}
                            <td style={{ whiteSpace: 'nowrap' }}>
                              <Link onClick={() => changeStatusClick(item)}>{item?.complaintStatusName}</Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                  </div>
                  {/* </div> */}
                  {/* </div> */}
                  {/* Pagination */}
                  {totalCount > pageSize && (
                    <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handleEmployeeAcceptPending} />
                  )}
                </div>
              </Tab>
              <Tab
                eventKey="employeeAcceptedSalesReturn"
                title={
                  <Tooltip title="Employee Accepted Sales Return">
                    <span>Employee Accepted Sales Return</span>
                  </Tooltip>
                }
                tabClassName="tab-upcoming"
              >
                <div>
                  {/* <div className="container d-flex flex-column align-items-center vh-90"> */}
                  {/* <div style={{ width: '100%' }}> */}
                  {/* Submit Button */}
                  {/* <Button onClick={AddLeadBtn} variant="primary" className="mb-3">
                        Add Complaints
                      </Button> */}
                  {/* Table */}
                  <div className="table-responsive table_wrapper">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th style={{ whiteSpace: 'nowrap' }}>Sr No.</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Customer Name</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Mobile Number</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Type</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Remark</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Device IMEI Number</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Temporary Device</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Date & Time</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Installed By</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Status Name </th>
                        </tr>
                      </thead>
                      <tbody>
                        {manufacturerListData?.map((item, idx) => (
                          <tr key={idx}>
                            <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                              {(currentPage - 1) * pageSize + idx + 1}
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}> {item.customerName}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item.customerMobileNo}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintType}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.remark}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.deviceIMEINumber}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.temporaryDeviceName}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintDate}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.installedBy}</td>
                            {/* <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintStatusName}</td> */}
                            <td style={{ whiteSpace: 'nowrap' }}>
                              <Link onClick={() => changeStatusClick(item)}>{item?.complaintStatusName}</Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                  </div>
                  {/* </div> */}
                  {/* </div> */}
                  {/* Pagination */}
                  {totalCount > pageSize && (
                    <PaginationComponent
                      totalPages={totalPages}
                      currentPage={currentPage}
                      onPageChange={handleEmployeeAcceptedSaleReturnComplaintPageChange}
                    />
                  )}
                </div>
              </Tab>

              {/* 2nd table , Completed AMC */}
              <Tab
                eventKey="completedComplaints"
                title={
                  <Tooltip title="Completed Complaints">
                    <span>Completed Complaints</span>
                  </Tooltip>
                }
                tabClassName="tab-completed"
              >
                <div>
                  {/* <div className="container d-flex flex-column align-items-center vh-90"> */}
                  {/* <div style={{ width: '100%' }}> */}
                  {/* Submit Button */}

                  {/* Table */}
                  <div className="table-responsive table_wrapper">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th style={{ whiteSpace: 'nowrap' }}>Sr No.</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Customer Name</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Mobile Number</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Type</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Remark</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Device IMEI Number</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Temporary Device</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Date & Time</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Installed By</th>
                          <th style={{ whiteSpace: 'nowrap' }}>Complaint Status Name </th>
                        </tr>
                      </thead>
                      <tbody>
                        {manufacturerListData?.map((item, idx) => (
                          <tr key={idx}>
                            <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                              {(currentPage - 1) * pageSize + idx + 1}
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}> {item.customerName}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item.customerMobileNo}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintType}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.remark}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.deviceIMEINumber}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.temporaryDeviceName}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintDate}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.installedBy}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{item?.complaintStatusName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                  </div>
                  {/* </div> */}
                  {/* </div> */}
                  {/* Pagination */}
                  {totalCount > pageSize && (
                    <PaginationComponent
                      totalPages={totalPages}
                      currentPage={currentPage}
                      onPageChange={handleCompletedComplaintPageChange}
                    />
                  )}
                </div>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </div>
      <SuccessPopupModal
        show={showSuccessModal}
        onHide={() => closeAllModal()}
        setShowSuccessModal={setShowSuccessModal}
        modelAction={modelAction}
      />
      {/* <AddUpdateLeadModal
        show={showLeadModal}
        handleClose={() => setShowLeadModal(false)}
        setRequestModalData={setRequestModalData}
        requestModalData={requestModalData}
      />
      <AmcChangeStatusModal
        show={showLeadAssignModal}
        handleClose={() => setShowLeadAssignModal(false)}
        setRequestModalData={setRequestModalData}
        requestModalData={requestModalData}
      />
      */}
      <PendingComplaintsTransferModal
        show={showPendingComplaintModal}
        handleClose={() => setShowPendingComplaintModal(false)}
        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        selectedComplaintIDs={transferComplaintIDs} // pass selected leads here
      />
      <DeviceSendToManufacturerModal
        show={showSendToManufacturerModal}
        handleClose={() => setShowSendToManufacturerModal(false)}
        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        selectedComplaintIDs={complaintsForTransfer}
      />
      <DeviceReceivedFromManufactureIMEI
        show={showDeviceReceivedFromMgfModal}
        handleClose={() => setShowDeviceReceivedFromMgfModal(false)}
        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        selectedComplaintIDs={complaintsForTransfer}
        modelRequestData={modelRequestData}
      />
      <AmcChangeStatusModal
        show={showAmcChangeStatusModal}
        modelRequestData={setModelRequestData}
        handleClose={() => setShowAmcChangeStatusModal(false)}
      />
      <AddUpdateComplaintModal
        show={showAddUpdateComplaintModal}
        handleClose={() => setShowAddUpdateComplaintModal(false)}
        modelRequestData={modelRequestData}
        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
      />
      <ComplaintChangeStatusModal
        show={showPendingChangeStatusModal}
        handleClose={() => setShowPendingChangeStatusModal(false)}
        modelRequestData={apiParams}
        sendApprovalBtnClick={(finalParams) => ComplaintStageChangeStatusData(finalParams)}
        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
      />
      <ComplaintTransferLogModal
        show={showTransferComplaintLogsModal}
        onHide={() => setShowTransferComplaintLogsModal(false)}
        modelRequestData={modelRequestData}
        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        // onHide={setShowTransferComplaintLogsModal}
      />
      <TransferComplaintModal
        show={showTransferComplaintModal}
        handleClose={() => setShowTransferComplaintModal(false)}
        selectedComplaintIDs={adminSaleReturnSelectedIDs}
        onConfirmTransfer={SalesReturnTransferDeviceData}
      />
      <ApproveRejectComplaint
        show={adminSendSalesReturnComplaintModal}
        handleClose={() => setAdminSendSalesReturnComplaintModal(false)}
        selectedComplaintIDs={adminSendSalesReturnSelectedIDs}
        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
      />
      <SaleReturnMultipleChangeStatusModal
        show={showSaleReturnMultipleChangeStatusModal}
        handleClose={() => setShowSaleReturnMultipleChangeStatusModal(false)}
        modelRequestData={apiParams} // Pass selected complaints
        sendApprovalBtnClick={ComplaintSalesReturnAcceptData} // Call function on button click
        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
      />
    </div>
  );
};

export default ComplaintsTabs;
