import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Tabs, Tab, Button } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import Select from 'react-select';
import { Table } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { ImportDeviceCSV } from 'services/DeviceTabCsv/DeviceCSVApi';
import { ConfigContext } from 'context/ConfigContext';
import { AddUpdateDeviceTransfer, GetDeviceTransferList, GetDeviceTransferredList } from 'services/DeviceTabCsv/DeviceTransferApi';
import { GetEmployeeLookupList } from 'services/Employee Staff/EmployeeApi';
import { GetRoleTypeLookupList } from 'services/Master Crud/MasterRoleTypeApi';
import GovPortalDataImportModal from 'views/Gov-Portal-Data/GovPortalDataImportModal';
import ImportNewDeviceAddUpdateModal from './ImportNewDeviceAddUpdateModal';
import { ChangeDeviceStatus, GetDeviceList } from 'services/DeviceTabCsv/AddNewDeviceApi';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { AddUpdateDeviceAcceptance, GetAcceptDeviceList } from 'services/DeviceTabCsv/AcceptDeviceApi';
import DeviceConfirmationModal from 'component/DeviceConfirmationModal';
import Android12Switch from 'component/Android12Switch';
import StatusChangeModal from 'component/StatusChangeModal ';
import DeviceViewModal from './DeviceViewModal';

const DeviceTabs = () => {
  const [moduleName, setModuleName] = useState('');
  const [showCustomerViewModel, setShowCustomerViewModel] = useState(false);
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [showNewDeviceAddUpdateModal, setShowNewDeviceAddUpdateModal] = useState(false);
  const [newDeviceImportListMap, setNewDeviceImportListData] = useState();
  const [error, setErrors] = useState(null);
  const [errorMessage, setErrorMessage] = useState();
  const [confirmImportedMsg, setConfirmImportedMsg] = useState('')
  const [importResponseData, setImportResponseData] = useState(null);

  const [ActiveTab, setActiveTab] = useState('importNewDevice');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState();
  const [currentApiAction, setCurrentApiAction] = useState(null); // Store the function dynamically
  const [modelRequestData, setModelRequestData] = useState({
    Action: null,
    subAction: null,
    employeeKeyID: null,
    userKeyID: null,
    deviceID: null
  });
  const [stateChangeStatus, setStateChangeStatus] = useState('');

  const [transferDeviceObj, setTransferDeviceObj] = useState({
    deviceID: [], // Selected devices
    employeeKeyID: null, // Selected employee
    roleTypeID: null, // Selected role type
    userKeyID: null, // User ID
    companyKeyID: null, // Company ID
    roleTypeOptions: [], // Lookup list for role types
    employeeOptions: [] // Lookup list for employees
  });

  const [acceptRejectDeviceObj, setAcceptRejectDeviceObj] = useState({
    deviceID: [], // Selected devices
    employeeKeyID: null, // Selected employee
    roleTypeID: null, // Selected role type
    userKeyID: null, // User ID
    companyKeyID: null, // Company ID
    roleTypeOptions: [], // Lookup list for role types
    employeeOptions: [], // Lookup list for employees
    acceptRejectStatus: null,
    acceptRejectRemark: null
  });

  const [searchKeyword, setSearchKeyword] = useState('');
  const [totalRecords, setTotalRecords] = useState(-1);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const { setLoader, user, companyID } = useContext(ConfigContext);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modelAction, setModelAction] = useState('');
  const [pageSize, setPageSize] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalCount, setTotalCount] = useState(null);
  const [transferListData, setTransferListData] = useState([]);
  const [acceptListData, setAcceptListData] = useState([]);
  const [transferredListData, setTransferredListData] = useState([]);
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);

  useEffect(() => {
    if (isAddUpdateActionDone) {
      if (ActiveTab === 'importNewDevice') {
        GetNewDeviceImportListData(1, null, toDate, fromDate);
      } else if (ActiveTab === 'AcceptDevice') {
        GetAcceptDeviceListListData(1, null, null, null, acceptRejectDeviceObj.employeeKeyID);
      } else if (ActiveTab === 'TransferDevice') {
        GetDeviceTransferListData(1, null, null, null);
      }
      setSearchKeyword('')
      // Reset the flag after actions are done
      setIsAddUpdateActionDone(false);
    }
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    ModuleNameFunc();
  }, [ActiveTab]);

  useEffect(() => {
    GetNewDeviceImportListData(1, null, toDate, fromDate);
  }, [setIsAddUpdateActionDone]);

  useEffect(() => {
    if (transferDeviceObj.roleTypeID) {
      GetEmployeeLookupListData(transferDeviceObj.roleTypeID, companyID);
    }
  }, [transferDeviceObj.roleTypeID]);
  useEffect(() => {
    if (acceptRejectDeviceObj.roleTypeID) {
      GetEmployeeLookupListData(acceptRejectDeviceObj.roleTypeID, companyID);
    }
  }, [acceptRejectDeviceObj.roleTypeID]);

  useEffect(() => {
    GetRoleTypeLookupListData();
  }, []);

  const GetRoleTypeLookupListData = async () => {
    setLoader(true);
    try {
      const response = await GetRoleTypeLookupList(user.userKeyID); // Ensure this function is imported correctly
      if (response?.data?.statusCode === 200) {
        setLoader(false);
        const roleTypeLookupList = response?.data?.responseData?.data;
        const formattedRoleList = roleTypeLookupList.map((roleType) => ({
          value: roleType.roleTypeID,
          label: roleType.roleTypeName
        }));
        setTransferDeviceObj((prevState) => ({
          ...prevState,
          roleTypeOptions: formattedRoleList,
          roleTypeID: formattedRoleList.length > 0 ? formattedRoleList[0].value : null // Set default role type (optional)
        }));
        setAcceptRejectDeviceObj((prevState) => ({
          ...prevState,
          roleTypeOptions: formattedRoleList,
          roleTypeID: formattedRoleList.length > 0 ? formattedRoleList[0].value : null // Set default role type (optional)
        }));
      } else {
        setLoader(false);
        console.error('Failed to fetch role type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      setLoader(false);
      console.error('Error fetching role type lookup list:', error);
    }
  };

  const GetEmployeeLookupListData = async (roleTypeID, companyID) => {
    setLoader(true);
    try {
      let response = await GetEmployeeLookupList(roleTypeID, companyID); // Call to get employee list based on roleTypeID
      if (response?.data?.statusCode === 200) {
        setLoader(false);
        const employeeList = response?.data?.responseData?.data;

        const filteredEmployees = employeeList.map((emp) => ({
          value: emp.employeeKeyID,
          label: emp.name
        }));

        // Update employee options state
        setTransferDeviceObj((prevState) => ({
          ...prevState,
          employeeOptions: filteredEmployees
        }));
        setAcceptRejectDeviceObj((prevState) => ({
          ...prevState,
          employeeOptions: filteredEmployees
        }));
      } else {
        setLoader(false);
        console.error('Bad request');
      }
    } catch (error) {
      setLoader(false);
      console.error('Error fetching employee list:', error);
    }
  };

  const handleTransferDeviceEmployeeChange = (selectedOption) => {
    setTransferDeviceObj((prevState) => ({
      ...prevState,
      employeeKeyID: selectedOption.value
    }));

    if (ActiveTab === 'TransferDevice') {
      let empKeyID = selectedOption?.value;

      GetDeviceTransferListData(1, null, null, null, empKeyID);
      setAcceptListData(null);
    }
  };

  const handleAcceptRejectDeviceEmployeeChange = (selectedOption) => {
    if (!selectedOption?.value) {
      setErrorMessage('Please select an employee first');
      return;
    }

    setErrorMessage(''); // Clear error message if employee is selected

    setAcceptRejectDeviceObj((prevState) => ({
      ...prevState,
      employeeKeyID: selectedOption.value
    }));
    if (ActiveTab === 'AcceptDevice') {
      let empKeyID = selectedOption?.value;

      GetAcceptDeviceListListData(1, null, null, null, empKeyID);
      setAcceptListData(null);
    }
  };

  const handleCheckboxChange = (id) => {
    setTransferDeviceObj((prevState) => ({
      ...prevState,
      deviceID: prevState.deviceID.includes(id)
        ? prevState.deviceID.filter((deviceId) => deviceId !== id) // Remove if unchecked
        : [...prevState.deviceID, id] // Add if checked
    }));
  };

  const handleSelectAllCheckboxChange = (e) => {
    if (e.target.checked) {
      setTransferDeviceObj((prevState) => ({
        ...prevState,
        deviceID: transferListData.map((item) => item.deviceID) // Select all devices
      }));
    } else {
      setTransferDeviceObj((prevState) => ({
        ...prevState,
        deviceID: [] // Deselect all devices
      }));
    }
  };

  const handleAcceptRejectCheckboxChange = (id) => {
    setAcceptRejectDeviceObj((prevState) => ({
      ...prevState,
      deviceID: prevState.deviceID.includes(id)
        ? prevState.deviceID.filter((deviceId) => deviceId !== id) // Remove if unchecked
        : [...prevState.deviceID, id] // Add if checked
    }));
  };

  const handleAcceptRejectSelectAllCheckboxChange = (e) => {
    if (e.target.checked) {
      setAcceptRejectDeviceObj((prevState) => ({
        ...prevState,
        deviceID: acceptListData.map((item) => item.deviceID) // Select all devices
      }));
    } else {
      setAcceptRejectDeviceObj((prevState) => ({
        ...prevState,
        deviceID: [] // Deselect all devices
      }));
    }
  };

  const handleUncheckAll = () => {
    setAcceptRejectDeviceObj((prevState) => ({
      ...prevState,
      deviceID: [] // Uncheck all checkboxes
    }));
  };

  const NewDeviceModalAddBtnClicked = () => {
    setModelRequestData({
      ...modelRequestData,
      deviceKeyID: null,
      Action: null
    });
    setShowNewDeviceAddUpdateModal(true);
  };

  const handleNewDeviceImport = async (selectedFile, containsHeader, userKeyID, companyKeyID) => {
    setLoader(true);
    const formData = new FormData();
    formData.append('CSV_File', selectedFile);

    try {
      const response = await ImportDeviceCSV(formData, userKeyID, companyKeyID);

      if (response?.data?.statusCode === 200) {
        setLoader(false);
        const data = response.data.responseData;
        setModelAction('New Device CSV Parsed Successfully!');
        setConfirmImportedMsg(data.importedRecords);
        setImportResponseData(data); // 💡 save responseData for modal


        setShowSuccessModal(true);
        setIsAddUpdateActionDone(true);
        setShowModal(false);
      } else {
        setLoader(false);
        setErrorMessage(response?.data?.errorMessage);
      }
    } catch (error) {
      console.error('Error importing Trackin:', error);
    }
  };

  // Handle Submit Button
  const TransferDeviceBtnClick = () => {
    let isValid = false;
    if (
      transferDeviceObj.deviceID.length === 0 ||
      transferDeviceObj.employeeKeyID === '' ||
      transferDeviceObj.employeeKeyID === null ||
      transferDeviceObj.employeeKeyID === undefined
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }
    const apiParam = {
      deviceID: transferDeviceObj.deviceID,
      employeeKeyID: transferDeviceObj.employeeKeyID,
      roleTypeID: transferDeviceObj.roleTypeID,
      userKeyID: user.userKeyID,
      companyKeyID: companyID
    };
    if (!isValid) {
      DeviceTransferModalData(apiParam);
    }
  };

  const DeviceTransferModalData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateDeviceTransfer'; // Default URL for Adding Data

      const response = await AddUpdateDeviceTransfer(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(' Device Transfer Successfully!'); //Do not change this naming convention

          setIsAddUpdateActionDone(true);
          setTransferDeviceObj((prevState) => ({
            ...prevState,
            deviceID: []
          }));
        } else {
          setLoader(false);
          setErrorMessage(response?.response?.data?.errorMessage);
        }
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  // accept Device Add

  const AddUpdateDeviceAcceptanceModalData = async (apiParam, actionType) => {
    setLoader(true);
    try {
      let url = '/AddUpdateDeviceAcceptance'; // Default URL for Adding Data

      const response = await AddUpdateDeviceAcceptance(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          const actionMessage = actionType === 'accept' ? 'Device Accepted Successfully!' : 'Device Rejected Successfully!';
          setModelAction(actionMessage); // Use dynamic message here
          setIsAddUpdateActionDone(true);
        } else {
          setLoader(false);
          setErrorMessage(response?.response?.data?.errorMessage);
        }
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  // --------------------4th  tab old device ---new device

  const [oldDeviceSelectedRows, setOldDeviceSelectedRows] = useState([]); // Selected rows for Old Devices
  const [newDeviceSelectedRows, setNewDeviceSelectedRows] = useState([]);

  // Example table data for Old Devices
  const oldDeviceData = [
    { id: 1, imei: '123456789012345', vehicle: 'Vehicle A', roomNo: 1, phoneNo: 1234567890, rtoNo: 1234567890 },
    { id: 1, imei: '123456789012345', vehicle: 'Vehicle A', roomNo: 1, phoneNo: 1234567890, rtoNo: 1234567890 },
    { id: 1, imei: '123456789012345', vehicle: 'Vehicle A', roomNo: 1, phoneNo: 1234567890, rtoNo: 1234567890 },
    { id: 1, imei: '123456789012345', vehicle: 'Vehicle A', roomNo: 1, phoneNo: 1234567890, rtoNo: 1234567890 },
    { id: 1, imei: '123456789012345', vehicle: 'Vehicle A', roomNo: 1, phoneNo: 1234567890, rtoNo: 1234567890 },
    { id: 1, imei: '123456789012345', vehicle: 'Vehicle A', roomNo: 1, phoneNo: 1234567890, rtoNo: 1234567890 },
    { id: 1, imei: '123456789012345', vehicle: 'Vehicle A', roomNo: 1, phoneNo: 1234567890, rtoNo: 1234567890 },
    { id: 1, imei: '123456789012345', vehicle: 'Vehicle A', roomNo: 1, phoneNo: 1234567890, rtoNo: 1234567890 },
    { id: 1, imei: '123456789012345', vehicle: 'Vehicle A', roomNo: 1, phoneNo: 1234567890, rtoNo: 1234567890 },
    { id: 1, imei: '123456789012345', vehicle: 'Vehicle A', roomNo: 1, phoneNo: 1234567890, rtoNo: 1234567890 },
    { id: 1, imei: '123456789012345', vehicle: 'Vehicle A', roomNo: 1, phoneNo: 1234567890, rtoNo: 1234567890 },
    { id: 1, imei: '123456789012345', vehicle: 'Vehicle A', roomNo: 1, phoneNo: 1234567890, rtoNo: 1234567890 },
    { id: 1, imei: '123456789012345', vehicle: 'Vehicle A', roomNo: 1, phoneNo: 1234567890, rtoNo: 1234567890 },
    { id: 1, imei: '123456789012345', vehicle: 'Vehicle A', roomNo: 1, phoneNo: 1234567890, rtoNo: 1234567890 },
    { id: 1, imei: '123456789012345', vehicle: 'Vehicle A', roomNo: 1, phoneNo: 1234567890, rtoNo: 1234567890 },
    { id: 1, imei: '123456789012345', vehicle: 'Vehicle A', roomNo: 1, phoneNo: 1234567890, rtoNo: 1234567890 },
    { id: 1, imei: '123456789012345', vehicle: 'Vehicle A', roomNo: 1, phoneNo: 1234567890, rtoNo: 1234567890 },
    { id: 1, imei: '123456789012345', vehicle: 'Vehicle A', roomNo: 1, phoneNo: 1234567890, rtoNo: 1234567890 },
    { id: 1, imei: '123456789012345', vehicle: 'Vehicle A', roomNo: 1, phoneNo: 1234567890, rtoNo: 1234567890 },
    { id: 1, imei: '123456789012345', vehicle: 'Vehicle A', roomNo: 1, phoneNo: 1234567890, rtoNo: 1234567890 }
  ];

  // Example table data for New Devices
  const newDeviceData = [
    { id: 1, imei: '543210987654321', manufacturedId: 'M001', userId: 'U001' },
    { id: 2, imei: '987654321012345', manufacturedId: 'M002', userId: 'U002' },
    { id: 3, imei: '123456789098765', manufacturedId: 'M003', userId: 'U003' },
    { id: 4, imei: '123456789098765', manufacturedId: 'M003', userId: 'U003' },
    { id: 5, imei: '123456789098765', manufacturedId: 'M003', userId: 'U003' },
    { id: 6, imei: '123456789098765', manufacturedId: 'M003', userId: 'U003' },
    { id: 7, imei: '123456789098765', manufacturedId: 'M003', userId: 'U003' },
    { id: 8, imei: '123456789098765', manufacturedId: 'M003', userId: 'U003' }
  ];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetNewDeviceImportListData(pageNumber, null, toDate, fromDate);
  };
  const handleTransferDevicePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetDeviceTransferListData(pageNumber, null, null, null);
  };
  const handleTransferredDevicePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetDeviceTransferredListData(pageNumber, null, null, null);
  };
  const handleAcceptRejectDevicePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetAcceptDeviceListListData(pageNumber, null, toDate, fromDate, acceptRejectDeviceObj.employeeKeyID);
  };

  const GetNewDeviceImportListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    setLoader(true);
    try {
      const data = await GetDeviceList({
        pageSize,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        userKeyID: user.userKeyID,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        sortingDirection: null,
        sortingColumnName: null,
        companyKeyID: companyID
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const newDeviceImportListData = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(newDeviceImportListData.length);
            setNewDeviceImportListData(newDeviceImportListData);
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

  const [selectedOption, setSelectedOption] = useState({
    value: 'transferDevice',
    label: 'Transfer Device'
  });

  const options = [
    { value: 'transferDevice', label: 'Transfer Device' },
    { value: 'transferredDevice', label: 'Transferred Device' }
  ];

  // Handle Submit Button
  const handleSubmitOldNew = () => {
    if (oldDeviceSelectedRows.length === 0 && newDeviceSelectedRows.length === 0) {
      alert('Please select at least one row from either table!');
      return;
    }

    // Collect selected data from both tables
    const selectedOldDevices = oldDeviceData.filter((item) => oldDeviceSelectedRows.includes(item.id));
    const selectedNewDevices = newDeviceData.filter((item) => newDeviceSelectedRows.includes(item.id));

    alert(
      `Selected Old Devices: ${JSON.stringify(
        selectedOldDevices,
        null,
        2
      )}\nSelected New Devices: ${JSON.stringify(selectedNewDevices, null, 2)}`
    );
  };

  // Handle checkbox selection in Old Device table
  const handleOldDeviceCheckboxChange = (id) => {
    if (oldDeviceSelectedRows.includes(id)) {
      setOldDeviceSelectedRows(oldDeviceSelectedRows.filter((rowId) => rowId !== id));
    } else {
      setOldDeviceSelectedRows([...oldDeviceSelectedRows, id]);
    }
  };

  // Handle checkbox selection in New Device table
  const handleNewDeviceCheckboxChange = (id) => {
    if (newDeviceSelectedRows.includes(id)) {
      setNewDeviceSelectedRows(newDeviceSelectedRows.filter((rowId) => rowId !== id));
    } else {
      setNewDeviceSelectedRows([...newDeviceSelectedRows, id]);
    }
  };
  const handleSelectionChange = (selected) => {
    // console.log(selected.transferredDevice,'1111111dddddddd');
    if (selected.value === 'transferredDevice') {
      GetDeviceTransferredListData(1, null, null, null);
    } else if (selected.value === 'transferDevice') {
      GetDeviceTransferListData(1, null, null, null);
    }
    setSelectedOption(selected);
  };

  const handleTabSelect = (key) => {
    setConfirmImportedMsg(false)
    setErrors(false);
    setErrorMessage(false);
    setSearchKeyword('');
    setCurrentPage(1);
    setTotalCount(0);

    if (key === 'importNewDevice') {
      setActiveTab('importNewDevice');
      GetNewDeviceImportListData(1, null, null, null);
    } else if (key === 'TransferDevice') {
      setActiveTab('TransferDevice');
      // Ensure selectedOption updates correctly
      setSelectedOption({ value: 'transferDevice', label: 'Transfer Device' });

      GetDeviceTransferListData(1, null, null, null);
      if (selectedOption.value === 'transferredDevice') {
        GetDeviceTransferredListData(1, null, null, null);
      }
      // GetDeviceTransferredListData(1, null, null, null);

      // setInitialData();
    } else if (key === 'AcceptDevice') {
      setActiveTab('AcceptDevice');

      if (acceptRejectDeviceObj.employeeKeyID) {
        GetAcceptDeviceListListData(1, null, null, null, acceptRejectDeviceObj.employeeKeyID);
      } else {
        return false;
      }
      // setInitialData();
    } else if (key === 'ReplaceDevice') {
      setActiveTab('ReplaceDevice');
      setInitialData();
    } else if (key === 'DeviceReplaceTable') {
      // setInitialData();
      setActiveTab('DeviceReplaceTable');
    }
  };


  const downloadCSV = () => {
    const excludedRecords = responseData?.excludedRecords || [];

    if (!excludedRecords.length) return;

    const headers = Object.keys(excludedRecords[0]);

    const csvRows = [
      headers.join(','), // header row
      ...excludedRecords.map(row =>
        headers.map(field => {
          let value = row[field];
          if (typeof value === 'object' && value !== null) {
            value = JSON.stringify(value); // handle nested objects
          }
          return `"${String(value ?? '')}"`; // quote and handle null/undefined
        }).join(',')
      )
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'excluded-records.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const setInitialData = () => {
    setNewDeviceSelectedRows('');
    setOldDeviceSelectedRows('');
    handleUncheckAll();
  };
  const closeAllModal = () => {
    setShowSuccessModal(false);
    setShowNewDeviceAddUpdateModal(false);
    setShowModal(false);
    handleUncheckAll();
    setImportResponseData(null);
  };

  const GetDeviceTransferredListData = async (pageNumber, searchKeywordValue, toDate, fromDate, empKeyID) => {
    // debugger
    setLoader(true);
    try {
      const data = await GetDeviceTransferredList({
        pageSize,
        userKeyID: user.userKeyID,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        sortingDirection: null,
        sortingColumnName: null,
        companyKeyID: companyID,
        employeeKeyID: empKeyID
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const transferredList = data.data.responseData.data;

            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(transferredList?.length);
            setTransferredListData(transferredList);
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
  const GetDeviceTransferListData = async (pageNumber, searchKeywordValue, toDate, fromDate, empKeyID) => {
    // debugger
    setLoader(true);
    try {
      const data = await GetDeviceTransferList({
        pageSize,
        userKeyID: user.userKeyID,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        sortingDirection: null,
        sortingColumnName: null,
        companyKeyID: companyID,
        employeeKeyID: empKeyID
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const TransferListData = data.data.responseData.data;

            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(TransferListData.length);
            setTransferListData(TransferListData);
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

  const GetAcceptDeviceListListData = async (pageNumber, searchKeywordValue, toDate, fromDate, empKeyID) => {
    // debugger
    setLoader(true);
    try {
      const data = await GetAcceptDeviceList({
        pageSize,
        userKeyID: user.userKeyID,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        sortingDirection: null,
        sortingColumnName: null,
        companyKeyID: companyID,
        employeeKeyID: empKeyID
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const TransferListData = data.data.responseData.data;

            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(TransferListData.length);
            setAcceptListData(TransferListData);
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

  const TrackingExportBtnClicked = () => {
    setModelRequestData({
      ...modelRequestData,
      Action: 'Device-New-Tab'
    });
    setCurrentApiAction(() => handleNewDeviceImport); // Pass appropriate function
    setShowModal(true);
  };

  const EditBtnClickImportNewDevice = (item) => {
    setModelRequestData({
      ...modelRequestData,
      Action: 'Update',
      deviceKeyID: item.deviceKeyID
    });
    setShowNewDeviceAddUpdateModal(true);
  };

  const handleSearch = (e) => {
    let searchKeywordValue = e.target.value;
    const trimmedValue = searchKeywordValue.replace(/^\s+/g, '');
    const capitalizedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1).toLowerCase();
    if (searchKeywordValue.length === 1 && searchKeywordValue.startsWith(' ')) {
      searchKeywordValue = searchKeywordValue.trimStart();
      return;
    }
    setSearchKeyword(capitalizedValue);
    if (ActiveTab === 'importNewDevice') {
      GetNewDeviceImportListData(1, capitalizedValue, toDate, fromDate);
    } else if (ActiveTab === 'AcceptDevice') {
      GetAcceptDeviceListListData(1, capitalizedValue, toDate, fromDate, acceptRejectDeviceObj.employeeKeyID);
    } else if (ActiveTab === 'TransferDevice') {
      GetDeviceTransferListData(1, capitalizedValue, null, null);
    }
    if (selectedOption.value === 'transferredDevice') {
      GetDeviceTransferredListData(1, capitalizedValue, toDate, fromDate, acceptRejectDeviceObj.employeeKeyID);
    }
  };

  const handleRoleTypeChange = (selectedOption) => {
    setTransferDeviceObj((prevState) => ({
      ...prevState,
      roleTypeID: selectedOption.value,
      employeeKeyID: null // Clear employee selection when role type changes
    }));

    if (ActiveTab === 'AcceptDevice') {
      setAcceptListData(null);
    }
  };
  const handleAcceptRejectRoleTypeChange = (selectedOption) => {
    // debugger
    setAcceptRejectDeviceObj((prevState) => ({
      ...prevState,
      roleTypeID: selectedOption.value,
      employeeKeyID: null // Clear employee selection when role type changes
    }));
    setAcceptListData([]);
  };

  const AcceptDeviceConfirmationModal = () => {
    setModelRequestData({
      ...modelRequestData,
      Action: 'AcceptDeviceConfirm',
      subAction: 'ApproveDevice',
      deviceID: acceptRejectDeviceObj?.deviceID,
      employeeKeyID: acceptRejectDeviceObj.employeeKeyID,
      userKeyID: user.userKeyID
    });

    let isValid = false;
    // Validation logic here
    if (
      acceptRejectDeviceObj?.deviceID.length === 0 ||
      acceptRejectDeviceObj.employeeKeyID === '' ||
      acceptRejectDeviceObj.employeeKeyID === null ||
      acceptRejectDeviceObj.employeeKeyID === undefined
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }
    if (!isValid) {
      setShowConfirmationModal(true);
    }
  };
  const RejectDeviceConfirmationModal = () => {
    setModelRequestData({
      ...modelRequestData,
      Action: 'AcceptDeviceConfirm',
      subAction: 'RejectDevice',
      deviceID: acceptRejectDeviceObj?.deviceID,
      employeeKeyID: acceptRejectDeviceObj.employeeKeyID,
      userKeyID: user.userKeyID
    });
    let isValid = false;
    // Validation logic here
    if (
      acceptRejectDeviceObj?.deviceID.length === 0 ||
      acceptRejectDeviceObj.employeeKeyID === '' ||
      acceptRejectDeviceObj.employeeKeyID === null ||
      acceptRejectDeviceObj.employeeKeyID === undefined
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }
    if (!isValid) {
      setShowConfirmationModal(true);
    }
  };

  const ModuleNameFunc = () => {
    if (ActiveTab === 'importNewDevice') {
      setModuleName('Import New Device');
    } else if (ActiveTab === 'TransferDevice') {
      setModuleName('Transfer Device');
    } else if (ActiveTab === 'AcceptDevice') {
      setModuleName('Accept / Reject Device');
    } else if (ActiveTab === 'ReplaceDevice') {
      setModuleName('Replace Device');
    } else if (ActiveTab === 'DeviceReplaceTable') {
      setModuleName('Device Replace Table');
    }
  };

  const handleStatusChange = (item) => {
    setStateChangeStatus(item); // You can set only relevant data if needed
    setShowStatusChangeModal(true);
  };

  const confirmStatusChange = async (item, user) => {
    // debugger
    try {
      const { deviceKeyID } = item; // Destructure to access only what's needed
      const response = await ChangeDeviceStatus(deviceKeyID, user.userKeyID);

      if (response && response.data.statusCode === 200) {
        // Successfully changed the status
        setShowStatusChangeModal(false);
        setStateChangeStatus(null);
        GetNewDeviceImportListData(currentPage, null, toDate, fromDate);
        setShowSuccessModal(true);
        setModelAction('Device status changed successfully.');
      } else {
        console.error(response?.data?.errorMessage);
        setShowSuccessModal(true);
        setModelAction('Failed to change Device status.');
      }
    } catch (error) {
      console.error('Error changing Device status:', error);
      setShowSuccessModal(true);
      setModelAction('An error occurred while changing the Device status.');
    }
  };

  const CustomerViewBtnClicked = async (item) => {
    setModelRequestData({
      ...modelRequestData,
      deviceKeyID: item.deviceKeyID
    });
    setShowCustomerViewModel(true);
  };
  return (
    <div className="card w-full max-w-[50vh] md:max-w-[90vw] mx-auto h-auto">
      <div className="card-body p-2 bg-white shadow-md rounded-lg">
        <div className="d-flex justify-content-between items-center flex-wrap gap-2">
          <h5 className="text-lg md:text-xl">{moduleName}</h5>
        </div>
        <Row>
          <Col>
            <Tabs activeKey={ActiveTab} id="justify-tab-example" className="whitespace-nowrap" onSelect={handleTabSelect}>
              {/* csv export tab */}
              <Tab
                eventKey="importNewDevice"
                title={
                  <Tooltip title="Import New Device">
                    <span className="text-sm md:text-base">Import New Device</span>
                  </Tooltip>
                }
                tabClassName="tab-upcoming"
              >
                <div className="container d-flex justify-content-center align-items-center vh-80">
                  <div className="p-1 col-12 col-md-8" style={{ width: '100%' }}>
                    <div className="d-flex align-items-center justify-content-between flex-column flex-md-row" style={{ gap: '10px' }}>
                      <input
                        type="text"
                        style={{ maxWidth: '300px', flex: 1 }}
                        value={searchKeyword}
                        onChange={(e) => {
                          handleSearch(e);
                        }}
                        className="form-control "
                        placeholder="Search.."
                      />
                      <div className="d-flex justify-content-end  w-md-auto ">
                        <Tooltip title="Import New Device">
                          <button className="btn btn-primary me-2 btn-sm " onClick={TrackingExportBtnClicked}>
                            Import New Device
                          </button>
                        </Tooltip>
                        <Tooltip title="Add New Device">
                          <button className="btn btn-primary btn-sm  " onClick={NewDeviceModalAddBtnClicked}>
                            <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i> Add New Device
                          </button>
                        </Tooltip>
                      </div>
                    </div>

                    <div className="tab-content-scroll-New-Device">
                      <Table striped bordered hover style={{ minWidth: '800px' }}>
                        <thead>
                          <tr
                            className="text-nowrap"
                            style={{
                              position: 'sticky',
                              top: -1,
                              backgroundColor: '#fff',
                              zIndex: 10,
                              boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
                            }}
                          >
                            <th>ID</th>
                            <th>Model No</th>
                            <th>IMEI No</th>
                            <th>Serial No</th>
                            <th>Sim 1 Mobile No</th>
                            <th>Sim 1 Name </th>
                            <th>Sim 2 Mobile No</th>
                            <th>Sim 2 Name </th>
                            <th>Issue Date</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {newDeviceImportListMap?.map((item, idx) => (
                            <tr key={idx}>
                              <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                              {/* <td>{item.modelNumber || '-'}</td> */}
                              <td className="text-center">
                                {item.modelNumber?.length > 17 ? (
                                  <Tooltip title={item.modelNumber}>{`${item.modelNumber?.substring(0, 17)}...`}</Tooltip>
                                ) : (
                                  <>{item.modelNumber}</>
                                )}
                              </td>
                              <td>{item.imei || '-'}</td>
                              <td>{item.serialNo || '-'}</td>
                              <td>{item.sim1MobileNo || '-'}</td>
                              <td>{item.sim1OperatorName || '-'}</td>
                              <td>{item.sim2MobileNo || '-'}</td>
                              <td>{item.sim2OperatorName || '-'}</td>
                              <td>{item.issuedDate || '-'}</td>
                              <td className="text-center text-nowrap">
                                <Tooltip title={item.status === true ? 'Enable' : 'Disable'}>
                                  {item.status === true ? 'Enable' : 'Disable'}
                                  <Android12Switch
                                    style={{ padding: '8px' }}
                                    onClick={() => handleStatusChange(item)}
                                    checked={item.status === true}
                                  />
                                </Tooltip>
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Tooltip title="Update Device">
                                    <button className="btn btn-primary btn-sm " onClick={() => EditBtnClickImportNewDevice(item)}>
                                      <i class="fas fa-edit"></i>
                                    </button>
                                  </Tooltip>
                                  <Tooltip title="View Device">
                                    <button className="btn btn-primary btn-sm " onClick={() => CustomerViewBtnClicked(item)}>
                                      <i className="fa-solid fa-eye"></i>
                                    </button>
                                  </Tooltip>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                    </div>
                    <div className="d-flex justify-content-end align-bottom mt-3">
                      {totalCount > pageSize && (
                        <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
                      )}
                    </div>
                  </div>
                </div>
              </Tab>

              {/* 2nd table , where select , search , checkbox, submit */}
              <Tab
                eventKey="TransferDevice"
                title={
                  <Tooltip title="Transfer Device">
                    <span className="text-sm md:text-base">Transfer Device</span>
                  </Tooltip>
                }
                tabClassName="tab-completed"
              >
                {selectedOption.value === 'transferDevice' && (
                  <div className="container d-flex flex-column align-items-center vh-80">
                    <div style={{ width: '100%' }}>
                      <div className="d-flex flex-column mb-2 w-100">
                        <div
                          className="d-flex mb-2 align-items-center justify-content-between flex-column flex-md-row w-100"
                          style={{ gap: '10px' }}
                        >
                          <div className="w-100" style={{ maxWidth: '400px' }}>
                            <input
                              type="text"
                              style={{ maxWidth: '400px' }}
                              value={searchKeyword}
                              onChange={handleSearch}
                              className="form-control mt-1 w-100"
                              placeholder="Search.."
                            />
                          </div>
                          <div className="w-100" style={{ maxWidth: '400px' }}>
                            <Select
                              options={options}
                              value={selectedOption}
                              onChange={handleSelectionChange}
                              className="mt-1 w-100"

                            // styles={{ container: (base) => ({ ...base, width: "30%" }) }}
                            />
                          </div>
                        </div>

                        <div
                          className="d-flex flex-column flex-md-row justify-content-between align-items-start w-100"
                          style={{ gap: '10px' }}
                        >
                          <div className="w-100" style={{ maxWidth: '400px' }}>
                            <Select
                              options={transferDeviceObj.roleTypeOptions}
                              placeholder="Select a Role Type"
                              value={transferDeviceObj.roleTypeOptions.find((option) => option.value === transferDeviceObj.roleTypeID)}
                              onChange={handleRoleTypeChange}
                              className="w-100"
                            />
                          </div>

                          <div className="w-100" style={{ maxWidth: '400px' }}>
                            <Select
                              options={transferDeviceObj.employeeOptions}
                              placeholder="Select an Employee"
                              value={
                                transferDeviceObj.employeeOptions.find((option) => option.value === transferDeviceObj.employeeKeyID) || null
                              }
                              onChange={handleTransferDeviceEmployeeChange}
                              className="w-100"
                              isDisabled={!transferDeviceObj.roleTypeID}
                            />
                            {error && !transferDeviceObj.employeeKeyID && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="tab-content-scroll-Device">
                        <Table striped bordered hover style={{ minWidth: '800px' }}>
                          <thead>
                            <tr className='text-nowrap' style={{ position: 'sticky', top: -1, backgroundColor: '#fff' }}>
                              <th>
                                <input
                                  type="checkbox"
                                  onChange={handleSelectAllCheckboxChange}
                                  checked={transferDeviceObj.deviceID.length === transferListData.length && transferListData.length > 0}
                                />
                              </th>
                              <th>IMEI Number</th>
                              <th>Model Number</th>
                              <th>Sim 1 Operator Name</th>
                              <th>Sim 1 Mobile No.</th>
                              <th>Sim 2 Operator Name</th>
                              <th>Sim 2 Mobile No.</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transferListData?.map((item, idx) => (
                              <tr key={idx}>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={transferDeviceObj.deviceID.includes(item.deviceID)}
                                    onChange={() => handleCheckboxChange(item.deviceID)}
                                  />
                                </td>
                                <td>{item.imei || '-'}</td>
                                <td>{item.modelNumber || '-'}</td>
                                <td>{item.sim1OperatorName || '-'}</td>
                                <td>{item.sim1MobileNo || '-'}</td>
                                <td>{item.sim2OperatorName || '-'}</td>
                                <td>{item.sim2MobileNo || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                      </div>
                      {totalCount > pageSize && (
                        <PaginationComponent
                          totalPages={totalPage}
                          currentPage={currentPage}
                          onPageChange={handleTransferDevicePageChange}
                        />
                      )}
                    </div>
                    {error && transferDeviceObj.deviceID.length === 0 && (
                      <span style={{ color: 'red' }}>Please Check At Least 1 Device</span>
                    )}
                    <Tooltip title="Transfer Device">
                      <Button onClick={TransferDeviceBtnClick} className="mt-2 btn-sm justify-content-center">
                        Transfer Device
                      </Button>
                    </Tooltip>
                  </div>
                )}

                {selectedOption.value === 'transferredDevice' && (
                  <div className="container d-flex flex-column align-items-center vh-80">
                    <div style={{ width: '100%' }}>
                      <div className="d-flex flex-column mb-2 w-100">
                        <div
                          className="d-flex mb-2 align-items-center justify-content-between flex-column flex-md-row w-100"
                          style={{ gap: '10px' }}
                        >
                          <div className="w-100" style={{ maxWidth: '400px' }}>
                            <input
                              type="text"
                              style={{ maxWidth: '400px' }}
                              value={searchKeyword}
                              onChange={handleSearch}
                              className="form-control mt-1 w-100"
                              placeholder="Search.."
                            />
                          </div>
                          <div className="w-100" style={{ maxWidth: '400px' }}>
                            <Select
                              options={options}
                              value={selectedOption}
                              onChange={handleSelectionChange}
                              className="mt-1 w-100"
                              styles={{ container: (base) => ({ ...base, width: '40%' }) }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="tab-content-scroll-Device">
                        <Table striped bordered hover style={{ minWidth: '800px' }}>
                          <thead>
                            <tr style={{ position: 'sticky', top: -1, backgroundColor: '#fff' }}>
                              <th>IMEI Number</th>
                              <th>Model Number</th>
                              <th>Employee Name</th>
                              <th>Accept / Reject Status</th>
                              <th>Accept / Reject Remark</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transferredListData?.map((item, idx) => (
                              <tr key={idx}>
                                <td>{item.imei || '-'}</td>
                                <td>{item.modelNumber || '-'}</td>
                                <td>{item.employeeName || '-'}</td>
                                <td className="text-center">
                                  <span
                                    className={`badge d-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm ${item.acceptRejectStatus === 'Pending'
                                        ? 'bg-warning text-dark'
                                        : item.acceptRejectStatus === 'Accepted'
                                          ? 'bg-success text-white'
                                          : 'bg-secondary text-white'
                                      }`}
                                    style={{
                                      borderRadius: '11px', // Smooth pill-like shape
                                      fontSize: '0.8rem',
                                      letterSpacing: '0.1px',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      maxWidth: '180px', // Uniform width
                                      justifyContent: 'center'
                                    }}
                                  >
                                    <i
                                      className={`fa-solid ${item.acceptRejectStatus === 'Pending'
                                          ? 'fa-clock'
                                          : item.acceptRejectStatus === 'Accepted'
                                            ? 'fa-circle-check'
                                            : 'fa-ban'
                                        }`}
                                      style={{
                                        fontSize: '1rem',
                                        color: 'black',
                                        marginRight: '5px'
                                      }}
                                    ></i>
                                    {item.acceptRejectStatus || '-'}
                                  </span>
                                </td>
                                {/* <td>{item.acceptRejectStatus}</td> */}
                                <td>{item.acceptRejectRemark}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                      </div>
                      {totalCount > pageSize && (
                        <PaginationComponent
                          totalPages={totalPage}
                          currentPage={currentPage}
                          onPageChange={handleTransferredDevicePageChange}
                        />
                      )}
                    </div>
                  </div>
                )}
              </Tab>

              {/* 3rd table start */}
              <Tab
                eventKey="AcceptDevice"
                title={
                  <Tooltip title="Accept Device">
                    <span className="text-sm md:text-base">Accept / Reject Device</span>
                  </Tooltip>
                }
                tabClassName="tab-cancelled"
              >
                <div className="container d-flex flex-column align-items-center vh-80">
                  <div style={{ width: '100%' }}>
                    <div className="d-flex flex-column mb-2 w-100">
                      <div
                        className="d-flex mb-2 align-items-center justify-content-between flex-column flex-md-row w-100"
                        style={{ gap: '10px' }}
                      >
                        <input
                          type="text"
                          style={{ maxWidth: '400px' }} // Set a consistent max width
                          value={searchKeyword}
                          onChange={(e) => {
                            handleSearch(e);
                          }}
                          className="form-control mt-1 w-100"
                          placeholder="Search.."
                        />
                        {/* <input type="text" className="form-control mt-1 " placeholder="Search.." /> */}
                      </div>
                      <div
                        className="d-flex flex-column flex-md-row justify-content-between align-items-start w-100"
                        style={{ gap: '10px' }}
                      >
                        <div className="w-100" style={{ maxWidth: '400px' }}>
                          <Select
                            options={acceptRejectDeviceObj.roleTypeOptions}
                            placeholder="Select a Role Type"
                            value={acceptRejectDeviceObj.roleTypeOptions.find(
                              (option) => option.value === acceptRejectDeviceObj.roleTypeID
                            )}
                            onChange={handleAcceptRejectRoleTypeChange}
                            className="w-100"
                          />
                        </div>

                        {/* User Type Dropdown */}
                        <div className="w-100" style={{ maxWidth: '400px' }}>
                          <Select
                            options={acceptRejectDeviceObj.employeeOptions}
                            placeholder="Select an Employee"
                            value={
                              acceptRejectDeviceObj.employeeOptions.find(
                                (option) => option.value === acceptRejectDeviceObj.employeeKeyID
                              ) || null
                            }
                            onChange={handleAcceptRejectDeviceEmployeeChange}
                            className="w-100"
                            // styles={{ container: (base) => ({ ...base, width: '30%' }) }}
                            isDisabled={!acceptRejectDeviceObj.roleTypeID} // Disable dropdown if no role type is selected
                          />
                          {error &&
                            (acceptRejectDeviceObj.employeeKeyID === null ||
                              acceptRejectDeviceObj.employeeKeyID === undefined ||
                              acceptRejectDeviceObj.employeeKeyID === '') ? (
                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="tab-content-scroll-Accept-Device">
                      <Table striped bordered hover style={{ minWidth: '800px' }}>
                        <thead>
                          <tr
                            style={{
                              position: 'sticky',
                              top: -1,
                              backgroundColor: '#fff'
                            }}
                          >
                            <th>
                              <input
                                type="checkbox"
                                onChange={handleAcceptRejectSelectAllCheckboxChange}
                                checked={acceptRejectDeviceObj.deviceID?.length === acceptListData?.length && acceptListData?.length > 0}
                              />
                            </th>
                            <th>IMEI</th>
                            <th>Employee Name</th>
                            <th>Model Number</th>
                          </tr>
                        </thead>
                        <tbody>
                          {acceptListData?.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={acceptRejectDeviceObj.deviceID.includes(item.deviceID)}
                                  onChange={() => handleAcceptRejectCheckboxChange(item.deviceID)}
                                />
                              </td>
                              <td>{item.imei}</td>
                              <td>{item?.employeeName}</td>
                              <td>{item?.modelNumber}</td>
                              {/* <td>{item?.acceptRejectStatus}</td>
                              <td>{item?.acceptRejectRemark}</td> */}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                    </div>

                    {totalCount > pageSize && (
                      <PaginationComponent
                        totalPages={totalPage}
                        currentPage={currentPage}
                        onPageChange={handleAcceptRejectDevicePageChange}
                      />
                    )}
                  </div>
                  {error &&
                    (acceptRejectDeviceObj?.deviceID.length === 0 ||
                      acceptRejectDeviceObj?.deviceID === undefined ||
                      acceptRejectDeviceObj?.deviceID === '') ? (
                    <span style={{ color: 'red' }}>Please Check At Least 1 Device</span>
                  ) : (
                    ''
                  )}
                  {errorMessage && <div className="text-danger text-center mb-3">{errorMessage}</div>}
                  <div className="d-flex justify-content-center">
                    {acceptRejectDeviceObj?.deviceID.length !== 0 && (
                      <>
                        {' '}
                        <Button onClick={() => AcceptDeviceConfirmationModal()} variant="primary" className="me-2 mb-3 btn-sm">
                          Accept  Device
                        </Button>
                        <Button onClick={() => RejectDeviceConfirmationModal()} variant="danger" className="mb-3">
                          Reject Device
                        </Button>
                      </>
                    )}
                  </div>
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
        confirmImportedMsg={confirmImportedMsg}
        responseData={importResponseData} // ✅ send it here
      />


      <StatusChangeModal
        open={showStatusChangeModal}
        onClose={() => setShowStatusChangeModal(false)}
        onConfirm={() => confirmStatusChange(stateChangeStatus, user)} // Pass the required arguments
      />

      <GovPortalDataImportModal
        show={showModal}
        modelRequestData={modelRequestData}
        onHide={() => closeAllModal()}
        userKeyID={user.userKeyID}
        companyKeyID={companyID}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        apiAction={currentApiAction} // Dynamically set the function
      />

      {showNewDeviceAddUpdateModal && (
        <ImportNewDeviceAddUpdateModal
          show={showNewDeviceAddUpdateModal}
          onHide={() => closeAllModal()}
          modelRequestData={modelRequestData}
          setModelRequestData={setModelRequestData}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        />
      )}
      <DeviceConfirmationModal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        modelRequestData={modelRequestData}
        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        UpdatedStatus={(apiParam) =>
          AddUpdateDeviceAcceptanceModalData(apiParam, modelRequestData.subAction === 'RejectDevice' ? 'reject' : 'accept')
        }
      />
      <DeviceViewModal show={showCustomerViewModel} onHide={() => setShowCustomerViewModel(false)} modelRequestData={modelRequestData} />
    </div>
  );
};

export default DeviceTabs;
