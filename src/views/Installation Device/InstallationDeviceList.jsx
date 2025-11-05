import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import SuccessPopupModal from 'component/SuccessPopupModal';
import 'react-calendar/dist/Calendar.css';
import Select from 'react-select';
import { GetRoleTypeLookupList } from 'services/Master Crud/MasterRoleTypeApi';
import 'react-date-picker/dist/DatePicker.css';
import { ConfigContext } from 'context/ConfigContext';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { GetAvailableStockList, GetInstalledDeviceList, GetSaleReturnList } from 'services/Installation Device/InstallationDeviceapi';
import { useNavigate } from 'react-router';

const InstallationDeviceList = () => {
  dayjs.extend(customParseFormat);
  let moduleName = 'Inventory';
  const [ActiveTab, setActiveTab] = useState('AvailableStock');
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user, companyID } = useContext(ConfigContext);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modelAction, setModelAction] = useState('');
  const [availableStockData, setAvailableStock] = useState();
  const [installedDeviceData, setInstalledDeviceData] = useState();
  const [saleReturnData, setSaleReturnData] = useState();
  const [modelRequestData, setModelRequestData] = useState({
    InstallationKeyID:null,
    Action: null
  });

  const [totalRecords, setTotalRecords] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalCount, setTotalCount] = useState(null);
  const [pageSize, setPageSize] = useState(30);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);
  const [selectedRoleType, setSelectedRoleType] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [roleTypeOptions, setRoleTypeOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const navigate = useNavigate()
  const handleTabSelect = (key) => {
    // debugger
    setCurrentPage(1);
    if (key === 'AvailableStock') {
      setActiveTab('AvailableStock');
      GetAvailableStockListData(1, null, null, null);

      setInitialData();
    } else if (key === 'installedDevice') {
      setActiveTab('installedDevice');

      GetInstalledDeviceListData(1, null, null, null);

      setInitialData();
    } else if (key === 'saleReturn') {
      setActiveTab('saleReturn');
      GetSaleReturnListData(1, null, toDate, fromDate);

      setInitialData();
    }
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
    if (ActiveTab === 'AvailableStock') {
      GetAvailableStockListData(1, capitalizedValue, toDate, fromDate);
    } else if (ActiveTab === 'installedDevice') {
      GetInstalledDeviceListData(1, capitalizedValue, toDate, fromDate);
    } else if (ActiveTab === 'saleReturn') {
      GetSaleReturnListData(1, capitalizedValue, toDate, fromDate);
    }
  };

  useEffect(() => {
    fetchRoleTypeLookupList();
  }, []);

  useEffect(() => {
    if (selectedRoleType) {
      fetchEmployees(selectedRoleType.value, companyID);
    } else {
      // Clear employee dropdown when no role type is selected
      setEmployeeOptions([]);
      setSelectedEmployee(null);
    }
  }, [selectedRoleType]);

  useEffect(() => {
    if (selectedEmployee) {
      fetchDataBasedOnActiveTab();
    }
  }, [selectedEmployee, ActiveTab]);



  const fetchRoleTypeLookupList = async () => {
    setLoadingRoles(true);
    try {
      const response = await GetRoleTypeLookupList(user.userKeyID);
      if (response?.data?.statusCode === 200) {
        const roleTypeList = response?.data?.responseData?.data || [];
        setRoleTypeOptions(roleTypeList.map(role => ({ value: role.roleTypeID, label: role.roleTypeName })));
      }
    } catch (error) {
      console.error('Error fetching role types:', error);
    } finally {
      setLoadingRoles(false);
    }
  };
  


  useEffect(() => {
    // debugger
    if (isAddUpdateActionDone) {
    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    GetAvailableStockListData(1, null, toDate, fromDate);
  }, [setIsAddUpdateActionDone]);

  useEffect(() => {
    // debugger
    GetAvailableStockListData(1, null, toDate, fromDate);
  }, []);

  const GetAvailableStockListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    setLoader(true);
    try {
      const data = await GetAvailableStockList({
        pageSize,
        userKeyID: user.userKeyID,
        employeeKeyID: selectedEmployee?.value,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const availableStockListData = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(availableStockListData.length);
            setAvailableStock(availableStockListData);
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

  const GetInstalledDeviceListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    setLoader(true);
    try {
      const data = await GetInstalledDeviceList({
        pageSize,
        userKeyID: user.userKeyID,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        employeeKeyID: selectedEmployee?.value
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const InstalledDeviceListData = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(InstalledDeviceListData.length);
            setInstalledDeviceData(InstalledDeviceListData);
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
  const GetSaleReturnListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    setLoader(true);
    try {
      const data = await GetSaleReturnList({
        pageSize,
        // employeeKeyID: selectedEmployee?.value,
        userKeyID: user.userKeyID,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        employeeKeyID: user.employeeKeyID
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const SaleReturnListData = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(SaleReturnListData.length);
            setSaleReturnData(SaleReturnListData);
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

  const setInitialData = () => {

  };
  const closeAllModal = () => {
    setShowSuccessModal(false);
  };

  const handlePageSVTSChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handlePageSVTS1Change = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handlePageVihaanaChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRoleTypeChange = (option) => {
    setSelectedRoleType(option);
    setSelectedEmployee(null);
  };

  const handleEmployeeChange = (option) => {
    setSelectedEmployee(option);
  };

  const fetchDataBasedOnActiveTab = () => {
    if (!selectedEmployee) return;

    switch (ActiveTab) {
      case 'AvailableStock':
        GetAvailableStockListData(1, null, null, null, selectedEmployee.value);
        break;
      case 'installedDevice':
        GetInstalledDeviceListData(1, null, null, null, selectedEmployee.value);
        break;
      case 'saleReturn':
        GetSaleReturnListData(1, null, null, null, selectedEmployee.value);
        break;
      default:
        break;
    }
  };





  const addAMCBtnClick = (row) => {
    
    setModelRequestData({
      ...modelRequestData,
      InstallationKeyID:null
    });
    const MappingAMC = {
    
      InstallationKeyID:row.InstallationKeyID,
    };

    navigate("/amc-tabs", { state: MappingAMC });
  };

  return (
    <div className="card w-full max-w-[50vh] md:max-w-[90vw] mx-auto h-auto">
      <div className="card-body p-2 bg-white shadow-md rounded-lg">
        <div className="d-flex justify-content-between items-center flex-wrap gap-2">
          <h4 className="text-lg md:text-xl">{moduleName}</h4>
        </div>

        <Row>
          <Col>
            <Tabs activeKey={ActiveTab} id="justify-tab-example" onSelect={handleTabSelect}>
              <Tab
                eventKey="AvailableStock"
                title={
                  <Tooltip title="Available Stock List">
                    <span>Available Stock</span>
                  </Tooltip>
                }
                tabClassName="tab-upcoming"
              >
                <div className=" d-flex justify-content-center align-items-center py-1">
                  <div className=" col-12 col-md-10 col-lg-12 bg-light  rounded">
                    <div className=" col-12 bg-light rounded">
                      {/* Header with Search Bar and Buttons */}
                      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-md-between gap-2 mb-3">
                        <input
                          type="text"
                          placeholder="Search Available Stock"
                          className="form-control  w-md-auto"
                          value={searchKeyword}
                          onChange={(e) => {
                            handleSearch(e);
                          }}
                          style={{ width: '300px' }}
                        />
                        <div
                          className="d-flex flex-column flex-md-row gap-2 w-100 w-md-auto justify-content-md-end"
                          style={{ maxWidth: '300px' }}
                        >
                          <Select
                            options={roleTypeOptions}
                            placeholder={loadingRoles ? 'Loading Role Types...' : 'Select a Role Type'}
                            onChange={handleRoleTypeChange}
                            value={selectedRoleType}
                            isLoading={loadingRoles}
                            className="me-3"
                            menuPortalTarget={document.body}
                            styles={{ control: (base) => ({ ...base, minWidth: '200px', width: '100%' }) }}
                          />

                          <Select
                            options={employeeOptions}
                            placeholder={loadingEmployees ? 'Loading Employees...' : 'Select an Employee'}
                            onChange={handleEmployeeChange}
                            value={selectedEmployee}
                            isLoading={loadingEmployees}
                            isDisabled={!selectedRoleType}
                            menuPortalTarget={document.body}
                            styles={{ control: (base) => ({ ...base, minWidth: '200px', width: '100%' }) }}
                            noOptionsMessage={() => (!selectedRoleType ? 'Select a Role Type first' : 'No Employees available')}
                          />

                        </div>
                      </div>
                    </div>

                    <div className="table-responsive" style={{ maxHeight: '48vh', overflowY: 'auto', position: 'relative' }}>
                      <table className="table table-bordered table-striped">
                        <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                          <tr className="text-nowrap">
                            <th className="text-center">Sr No</th>
                            <th className="text-center"> Customer Name</th>
                            {/* <th className="text-center">Customer Name</th>
                            <th className="text-center">Mobile Number</th> */}
                            <th className="text-center">Model Number</th>
                            <th className="text-center">IMEI Number</th>
                            <th className="text-center">Sim 1 Number</th>
                            <th className="text-center">Sim 1 Type</th>
                            <th className="text-center">Sim 2 Number</th>
                            <th className="text-center">Sim 2 Type</th>
                            <th className="text-center"> Date</th>
                            <th className="text-center"> Serial No</th>
                            {/* <th className="text-center"> Installed By</th>
                            <th className="text-center"> Installed Date</th>
                            <th className="text-center">Issued Date</th>
                            <th className="text-center">Reason For SR</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {availableStockData?.map((row, idx) => (
                            <tr key={idx}>
                              <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                              <td className="text-center text-nowrap">{row.name || '-'}</td>
                              <td className="text-center">{row.modelNumber}</td>
                              
                              <td className="text-center">{row.imei || '-'}</td>
                              <td className="text-center">{row.sim1 || '-'}</td>
                              <td className="text-center">{row.sim1Type || '-'}</td>
                              <td className="text-center">{row.sim2 || '-'}</td>
                              <td className="text-center">{row.sim2Type || '-'}</td>
                              <td className="text-center">{row.date ? dayjs(row.date).format('DD/MM/YYYY') : '-' || '-'}</td>
                              <td className="text-center">{row.serialNo || '-'}</td>
                              {/* <td className="text-center">{row.installedBy || '-'}</td>
                              <td className="text-center">{row.installedDate || '-'}</td>
                              <td className="text-center">{row.issuedDate ? dayjs(row.issuedDate).format('DD/MM/YYYY') : '-' || '-'}</td>
                              <td className="text-center">{row.reasonForSR || '-'}</td> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                    </div>
                    <div className="d-flex justify-content-end ">
                      {totalCount > pageSize && (
                        <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageSVTSChange} />
                      )}
                    </div>
                  </div>
                </div>
              </Tab>

              {/* 2nd table , installedDevice 2 */}
              <Tab
                eventKey="installedDevice"
                title={
                  <Tooltip title="Installed Device List">
                    <span>Installed Device</span>
                  </Tooltip>
                }
                tabClassName="tab-completed"
              >
                <div className=" d-flex justify-content-center align-items-center py-1">
                  <div className=" col-12 col-md-10 col-lg-12 bg-light  rounded">
                    <div className=" col-12 bg-light rounded">
                      {/* Header with Search Bar and Buttons */}
                      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-md-between gap-2 mb-3">
                        <input
                          type="text"
                          className="form-control w-md-auto"
                          value={searchKeyword}
                          onChange={(e) => {
                            handleSearch(e);
                          }}
                          placeholder="Search Installed Device"
                          style={{ width: '300px' }}
                        />
                        <div
                          className="d-flex flex-column flex-md-row gap-2 w-100 w-md-auto justify-content-md-end"
                          style={{ maxWidth: '300px' }}
                        >
                          <Select
                            options={roleTypeOptions}
                            placeholder={loadingRoles ? 'Loading Role Types...' : 'Select a Role Type'}
                            onChange={handleRoleTypeChange}
                            value={selectedRoleType}
                            isLoading={loadingRoles}
                            className="me-3"
                            menuPortalTarget={document.body}
                            styles={{ control: (base) => ({ ...base, minWidth: '200px', width: '100%' }) }}
                          />

                          <Select
                            options={employeeOptions}
                            placeholder={loadingEmployees ? 'Loading Employees...' : 'Select an Employee'}
                            onChange={handleEmployeeChange}
                            value={selectedEmployee}
                            isLoading={loadingEmployees}
                            isDisabled={!selectedRoleType}
                            menuPortalTarget={document.body}
                            styles={{ control: (base) => ({ ...base, minWidth: '200px', width: '100%' }) }}
                            noOptionsMessage={() => (!selectedRoleType ? 'Select a Role Type first' : 'No Employees available')}
                          />

                        </div>
                      </div>
                    </div>

                    <div className="table-responsive" style={{ maxHeight: '48vh', overflowY: 'auto', position: 'relative' }}>
                      <table className="table table-bordered table-striped">
                        <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                          <tr className="text-nowrap">
                            <th className="text-center">Sr No</th>
                            <th className="text-center">Customer  Name</th>
                            {/* <th className="text-center">Employee Name</th> */}
                            <th className="text-center">Mobile Number</th>
                            <th className="text-center">Model Number</th>
                            <th className="text-center">IMEI Number</th>
                            {/* <th className="text-center">Sim 1 Number</th>
                            <th className="text-center">Sim 1 Type</th>
                            <th className="text-center">Sim 2 Number</th>
                            <th className="text-center">Sim 2 Type</th> */}
                            <th className="text-center"> Date</th>
                            <th className="text-center"> Serial No</th>
                            <th className="text-center"> Installed By</th>
                            <th className="text-center"> Installed Date</th>
                            {/* <th className="text-center">Issued Date</th>
                            <th className="text-center">Reason For SR</th>
                            <th className="text-center">Action</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {installedDeviceData?.map((row, idx) => (
                            <tr key={idx}>
                              <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                              <td className="text-center text-nowrap">{row.name || '-'}</td>
                              {/* <td className="text-center text-nowrap">{row.customerName || '-'}</td> */}
                              <td className="text-center">{row.mobileNumber || '-'}</td>
                              <td className="text-center">{row.modelNumber || '-'}</td>
                              <td className="text-center">{row.imei || '-'}</td>
                              {/* <td className="text-center">{row.sim1 || '-'}</td>
                              <td className="text-center">{row.sim1Type || '-'}</td>
                              <td className="text-center">{row.sim2 || '-'}</td>
                              <td className="text-center">{row.sim2Type || '-'}</td> */}
                              <td className="text-center">{row.date ? dayjs(row.date).format('DD/MM/YYYY') : '-' || '-'}</td>
                              <td className="text-center">{row.serialNo || '-'}</td>
                              <td className="text-center">{row.installedBy || '-'}</td>
                              <td className="text-center">{row.installedDate || '-'}</td>
                              {/* <td className="text-center">{row.issuedDate ? dayjs(row.issuedDate).format('DD/MM/YYYY') : '-' || '-'}</td>
                              <td className="text-center">{row.reasonForSR || '-'}</td> */}
                              {/* <td className="text-center">

                                <Tooltip title="Add AMC">
                                  <button
                                    onClick={() => addAMCBtnClick(row)}
                                    className="btn btn-primary btn-sm d-none d-sm-inline"
                                  >
                                    <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
                                    <span className="d-none d-sm-inline"></span>
                                  </button>
                                </Tooltip>
                              </td> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                    </div>
                    <div className="d-flex justify-content-end ">
                      {totalCount > pageSize && (
                        <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageSVTS1Change} />
                      )}
                    </div>
                  </div>
                </div>
              </Tab>

              {/* 3rd table start  saleReturn*/}
              <Tab
                eventKey="saleReturn"
                title={
                  <Tooltip title="Sale Return">
                    <span>Sale Return </span>
                  </Tooltip>
                }
                tabClassName="tab-cancelled"
              >
                <div className=" d-flex justify-content-center align-items-center py-1">
                  <div className=" col-12 col-md-10 col-lg-12 bg-light  rounded">
                    <div className=" col-12 bg-light rounded">
                      {/* Header with Search Bar and Buttons */}
                      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-md-between gap-2 mb-3">
                        <input
                          type="text"
                          className="form-control w-md-auto"
                          value={searchKeyword}
                          onChange={(e) => {
                            handleSearch(e);
                          }}
                          placeholder="Search Sale Return"
                          style={{ width: '300px' }}
                        />
                        <div
                          className="d-flex flex-column flex-md-row gap-2 w-100 w-md-auto justify-content-md-end"
                          style={{ maxWidth: '300px' }}
                        >
                          <Select
                            options={roleTypeOptions}
                            placeholder={loadingRoles ? 'Loading Role Types...' : 'Select a Role Type'}
                            onChange={handleRoleTypeChange}
                            value={selectedRoleType}
                            isLoading={loadingRoles}
                            className="me-3"
                            menuPortalTarget={document.body}
                            styles={{ control: (base) => ({ ...base, minWidth: '200px', width: '100%' }) }}
                          />

                          <Select
                            options={employeeOptions}
                            placeholder={loadingEmployees ? 'Loading Employees...' : 'Select an Employee'}
                            onChange={handleEmployeeChange}
                            value={selectedEmployee}
                            isLoading={loadingEmployees}
                            isDisabled={!selectedRoleType}
                            menuPortalTarget={document.body}
                            styles={{ control: (base) => ({ ...base, minWidth: '200px', width: '100%' }) }}
                            noOptionsMessage={() => (!selectedRoleType ? 'Select a Role Type first' : 'No Employees available')}
                          />

                        </div>
                      </div>
                    </div>

                    <div className="table-responsive" style={{ maxHeight: '48vh', overflowY: 'auto', position: 'relative' }}>
                      <table className="table table-bordered table-striped">
                        <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                          <tr className="text-nowrap">
                            <th className="text-center">Sr No</th>
                            <th className="text-center">Customer Name</th>
                            <th className="text-center">Employee Name</th>
                            <th className="text-center">Mobile Number</th>
                            <th className="text-center">Model Number</th>
                            <th className="text-center">IMEI Number</th>
                            <th className="text-center">Sim 1 Number</th>
                            <th className="text-center">Sim 1 Type</th>
                            <th className="text-center">Sim 2 Number</th>
                            <th className="text-center">Sim 2 Type</th>
                            <th className="text-center"> Date</th>
                            <th className="text-center"> Serial No</th>
                            <th className="text-center"> Installed By</th>
                            <th className="text-center"> Installed Date</th>
                            <th className="text-center">Issued Date</th>
                            <th className="text-center">Reason For SR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {saleReturnData?.map((row, idx) => (
                            <tr key={idx}>
                              <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                              <td className="text-center text-nowrap">{row.name || '-'}</td>
                              <td className="text-center text-nowrap">{row.customerName || '-'}</td>
                              <td className="text-center">{row.mobileNumber || '-'}</td>
                              <td className="text-center">{row.modelNumber || '-'}</td>
                              <td className="text-center">{row.imei || '-'}</td>
                              <td className="text-center">{row.sim1 || '-'}</td>
                              <td className="text-center">{row.sim1Type || '-'}</td>
                              <td className="text-center">{row.sim2 || '-'}</td>
                              <td className="text-center">{row.sim2Type || '-'}</td>
                              <td className="text-center">{row.date ? dayjs(row.date).format('DD/MM/YYYY') : '-' || '-'}</td>
                              <td className="text-center">{row.serialNo || '-'}</td>
                              <td className="text-center">{row.installedBy || '-'}</td>
                              <td className="text-center">{row.installedDate || '-'}</td>
                              <td className="text-center">{row.issuedDate ? dayjs(row.issuedDate).format('DD/MM/YYYY') : '-' || '-'}</td>
                              <td className="text-center">{row.reasonForSR || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                    </div>
                    <div className="d-flex justify-content-end ">
                      {totalCount > pageSize && (
                        <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageVihaanaChange} />
                      )}
                    </div>
                  </div>
                </div>
              </Tab>
              {/* 3rd table end  */}
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
      
    </div>
  );
};

export default InstallationDeviceList;
