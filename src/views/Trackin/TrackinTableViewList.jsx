import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import dayjs from 'dayjs';
import { Tooltip } from '@mui/material';
import React, { useContext, useState, useEffect } from 'react';
import { GetTrackinList, ImportTrackinCSV } from 'services/Trackin/TrackinApi';

import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import GovPortalDataImportModal from 'views/Gov-Portal-Data/GovPortalDataImportModal';
import { ChangeRegistrationStatus, GetInstallationList } from 'services/Installation Device/InstallationDeviceapi';
import Android12Switch from 'component/Android12Switch';
import RegistrationCompletedModal from 'component/RegistrationCompletedModal';
import { Link } from 'react-router-dom';
import CompletedTabLoggedInModal from 'component/Completed Tab Login Modal/CompletedTabLoggedInModal';

const TrackinTableViewList = () => {
  const [showCompletedTabModal,setShowCompletedTabModal]=useState(false)
  const [totalRecords, setTotalRecords] = useState(-1);
  const [finalListOfInstallation, setFinalListOfInstallation] = useState([]);
  const { setLoader, user, companyID } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState();
  const [currentApiAction, setCurrentApiAction] = useState(null); // Store the function dynamically
  const [errorMessage, setErrorMessage] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalCount, setTotalCount] = useState(null);
  const [pageSize, setPageSize] = useState(30);
  const [ActiveTab, setActiveTab] = useState('PendingTrackinTable');
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);
  const [stateChangeStatus, setStateChangeStatus] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState('pending')
  const [showModal, setShowModal] = useState(false);
  const [moduleName, setModuleName] = useState('');
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState();
  const [modelRequestData, setModelRequestData] = useState({
    adminID: null,
    machineID: null,
    machineName: null,
    price: null,
    Action: null
  });

  useEffect(() => {
    ModuleNameFunc();
  }, [ActiveTab]);

  useEffect(() => {
    // debugger
    if (isAddUpdateActionDone) {
      // GetTrackingListData(1, null, toDate, fromDate);
    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    // GetTrackingListData(1, null, toDate, fromDate);
  }, [setIsAddUpdateActionDone]);


  const handleSearch = (e) => {
    let searchKeywordValue = e.target.value;
    const trimmedValue = searchKeywordValue.replace(/^\s+/g, '');
    const capitalizedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1).toLowerCase();
    if (searchKeywordValue.length === 1 && searchKeywordValue.startsWith(' ')) {
      searchKeywordValue = searchKeywordValue.trimStart();
      return;
    }
    setSearchKeyword(capitalizedValue);

    if (ActiveTab === 'PendingTrackinTable') {

      GetInstallationListData(1, capitalizedValue, toDate, fromDate, 0);
    } else if (ActiveTab === 'CompletedTrackinTable') {

      GetInstallationListData(1, capitalizedValue, toDate, fromDate, 1);
    }
  };

  const ModuleNameFunc = () => {
    if (ActiveTab === 'PendingTrackinTable') {
      setModuleName('Pending Trackin');
    } else if (ActiveTab === 'CompletedTrackinTable') {
      setModuleName('Completed Trackin');
    }
  };

  const closeAllModal = () => {
    setShowSuccessModal(false);
    // setShowSVTSModal(false);
    setShowCompletedTabModal(false)
    setShowModal(false);
    setData([]);
  };



  const TrackingExportBtnClicked = () => {
    setModelRequestData({ Action: 'Trackin-Export' });
    setCurrentApiAction(() => handleTrackingImport); // Pass appropriate function
    setShowModal(true);
  };

  const handleTrackingImport = async (file, containsHeader, userKeyID, companyKeyID) => {
    // debugger
    const formData = new FormData();
    formData.append('CSV_File', file);
    // formData.append('Contains_Header', containsHeader);

    try {
      const response = await ImportTrackinCSV(formData, userKeyID, companyKeyID);

      if (response?.data?.statusCode === 200) {
        setLoader(false);
        setModelAction('Trackin CSV Imported Successfully!');
        setShowSuccessModal(true);
        setIsAddUpdateActionDone(true);
        setShowModal(false);
      } else {
        setLoader(false);
        setErrorMessage(response?.response?.data?.errorMessage);
      }
    } catch (error) {
      console.error('Error importing Trackin:', error);
      alert('Failed to import Trackin data!');
    }
  };




  const handleTabSelect = (key) => {
    setSearchKeyword('');
    setCurrentPage(1);
    setTotalCount(0);

    if (key === 'PendingTrackinTable') {

      setActiveTab('PendingTrackinTable');

      setRegistrationStatus('pending')

      GetInstallationListData(1, null, null, null, 0)

    } else if (key === 'CompletedTrackinTable') {
      setActiveTab('CompletedTrackinTable');
      setRegistrationStatus('completed')
      GetInstallationListData(1, null, null, null, 1)


    }
  };


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetInstallationListData(pageNumber, null, toDate, fromDate);
  };
  useEffect(() => {
    GetInstallationListData(1, null, toDate, fromDate, 0);
  }, [setIsAddUpdateActionDone]);

  const handleStatusChange = (row) => {
    // debugger
    setStateChangeStatus(row); // You can set only relevant data if needed
    setShowStatusChangeModal(true);
  };

  const GetInstallationListData = async (pageNumber, searchKeywordValue, toDate, fromDate, trackingAppRegStatus) => {
    setLoader(true);
    try {
      const data = await GetInstallationList({
        pageSize,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        sortingDirection: null,
        userKeyID: user.userKeyID,
        companyKeyID: companyID,
        sortingColumnName: null,
        govtPortalRegStatus: 1,
        trackingAppID: 1,
        trackingAppRegStatus: trackingAppRegStatus

      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const MasterVillageListData = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(MasterVillageListData.length);
            setFinalListOfInstallation(MasterVillageListData);
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


  const confirmStatusChange = async (row, user) => {
    setLoader(true);
    // debugger
    try {
      const { installationKeyID } = row; // Destructure to access only what's needed
      const response = await ChangeRegistrationStatus(installationKeyID, companyID, 'TrackingAppRegStatus');

      if (response && response.data.statusCode === 200) {
        setLoader(false);
        // Successfully changed the status
        setShowStatusChangeModal(false);
        setStateChangeStatus(null);

        if (ActiveTab === 'PendingTrackinTable') {



          GetInstallationListData(1, null, null, null, 0)

        }

        // GetInstallationListData(currentPage, null, toDate, fromDate);
        setShowSuccessModal(true);
        setModelAction('Installation status changed successfully.');
      } else {
        setLoader(false);
        setShowSuccessModal(true);
        setModelAction('Failed to change Installation status.');
      }
    } catch (error) {
      setLoader(false);
      setShowSuccessModal(true);
      setModelAction('An error occurred while changing the Installation status.');
    }
  };
  const trackingCompletedTabBtnClicked=(row)=>{

    setModelRequestData({
      ...modelRequestData,
      openFromModule:'TrackingTab',
      customerKeyID:row.customerKeyID

    })
    setShowCompletedTabModal(true)
  }
  return (
    <div className="card w-full max-w-[50vh] md:max-w-[90vw] mx-auto h-auto">
      <div className="card-body p-2 bg-white shadow-md rounded-lg">
        <div className="d-flex justify-content-between items-center flex-wrap gap-2">
          <h5 className="text-lg md:text-xl">{moduleName}</h5>
        </div>
        <Row>
          <Col>
            <Tabs activeKey={ActiveTab} id="justify-tab-example" className="whitespace-nowrap" onSelect={handleTabSelect}>
              <Tab
                eventKey="PendingTrackinTable"
                title={
                  <Tooltip title="Pending Trackin">
                    <span className="text-sm md:text-base">Pending </span>
                  </Tooltip>
                }
                tabClassName="tab-cancelled"
              >
                <div className="container d-flex flex-column align-items-center vh-80">
                  <div style={{ width: '100%' }}>
                    {/* Dropdown and Input Field */}
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                      <div
                        className="d-flex mb-2 align-items-center justify-content-between flex-column flex-md-row w-100"
                        style={{ gap: '10px' }}
                      >
                        <input
                          type="text"
                          className="form-control "
                          placeholder="Search Pending Tracking"
                          style={{ maxWidth: "350px" }}
                          value={searchKeyword}
                          onChange={(e) => {
                            handleSearch(e);
                          }}
                        />
                      </div>
                      <div className="d-flex gap-">
                        {/* <button className="btn btn-primary btn-sm text-nowrap" onClick={TrackingExportBtnClicked}>
                          <i className="fa-solid fa-file-import me-2"></i>Trackin Import
                        </button> */}
                        {/* <button
                className="btn btn-danger btn-sm"
                //  onClick={generateDeviceCSV}
              >
                <i className="fa-solid fa-trash me-2"></i>Delete Data
              </button> */}
                      </div>

                    </div>

                    <div className="table-responsive" style={{ maxHeight: '60vh', overflowY: 'auto', position: 'relative' }}>

                      <table className="table table-bordered table-striped">
                        <thead className="table-light">
                          <tr
                            style={{
                              position: 'sticky',
                              top: -1,
                              backgroundColor: '#fff',
                              zIndex: 10,
                              boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
                            }}
                            className="text-nowrap"
                          >
                            <th className="text-center">Sr No</th>
                            <th className="text-center">Employee Name</th>
                            <th className="text-center">Customer Name</th>
                            <th className="text-center">Vehicle Number</th>
                            <th className="text-center">Vehicle Type Name</th>
                            <th className="text-center">Installation Date</th>
                            <th className="text-center">Model Name</th>
                            <th className="text-center">Gov Portal Reg. Status</th>
                            <th className="text-center">Trackin Application Reg. Status</th>
                            <th className="text-center">Modal Number</th>
                            <th className="text-center">IMEI</th>
                            {/* <th className="text-center">Temporary Device Installed</th> */}
                            <th className="text-center">Government Portal Name</th>
                            <th className="text-center">Payment Amount</th>
                            <th className="text-center">Payment Mode Name</th>
                            <th className="text-center">Payment Status</th>
                            <th className="text-center">Payment Date</th>
                            {/* <th className="text-center">Payment Verified By Employee Name</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {finalListOfInstallation?.map((row, idx) => (
                            <tr key={idx}>
                              <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                              {/* <td className="text-center">{row.companyName || '-'}</td> */}
                              <td className="text-center">{row.employeeName || '-'}</td>
                              <td className="text-center">{row.customerName || '-'}</td>
                              <td className="text-center">{(row.vehicleNumber).toUpperCase() || '-'}</td>

                              <td className="text-center">{row.vehicleTypeName || '-'}</td>
                              <td className="text-center">
                                {row.installationDate
                                  ? (() => {
                                    const parts = row.installationDate.split("/");
                                    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
                                    return dayjs(formattedDate).isValid() ? dayjs(formattedDate).format("DD/MM/YYYY") : "-";
                                  })()
                                  : "-"}
                              </td>
                              <td className="text-center">{row.modalName || '-'}</td>
                              <td className="text-center text-nowrap">
                                {row.govtPortalRegStatus === 'Pending' ? ( // Show button only if status is "Pending"
                                  <Tooltip title={row.status ? 'Enable' : 'Disable'}>
                                    <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(row)} checked={row.status === true} />
                                  </Tooltip>
                                ) : (
                                  <span
                                    className="d-inline-flex align-items-center px-3 py-1 rounded-pill text-white"
                                    style={{ backgroundColor: '#137c3b', fontWeight: 'bold' }}
                                  >
                                    <i className="fa fa-check-circle me-2" style={{ fontSize: '14px' }}></i>
                                    Completed
                                  </span>
                                  // <span className="text-success fw-bold">Completed</span> // Show text if "Completed"
                                )}
                              </td>
                              <td className="text-center text-nowrap " >
                                <Tooltip title={row.trackingAppRegStatus === "Pending" ? 'Pending' : 'Complete'}>
                                  {row.trackingAppRegStatus === "Pending" ? 'Pending' : 'Complete'}
                                  <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(row)} checked={row.trackingAppRegStatus === true} />
                                </Tooltip>
                              </td>
                              <td className="text-center">{row.modelNumber || '-'}</td>
                              <td className="text-center">{row.imei || '-'}</td>
                              {/* <td className="text-center">{row.isTemporaryDeviceInstalled || '-'}</td> */}
                              <td className="text-center">{row.governmentPortalName || '-'}</td>
                              <td className="text-center">
                                {new Intl.NumberFormat('en-IN', {
                                  style: 'decimal',
                                  maximumFractionDigits: 0,
                                  minimumFractionDigits: 0
                                }).format(Math.round(row.paymentAmount)) || '-'}
                              </td>
                              <td className="text-center">
                      <span className="d-flex align-items-center justify-content-center gap-2 fw-semibold">
                        {row.paymentModeName === 'Credit' && (
                          <>
                            <i className="fa-solid fa-credit-card text-primary fs-5"></i>
                            <span>Credit</span>
                          </>
                        )}
                        {row.paymentModeName === 'Account' && (
                          <>
                            <i className="fa-solid fa-building-columns text-success fs-5"></i>
                            <span>Account</span>
                          </>
                        )}
                        {row.paymentModeName === 'Cash' && (
                          <>
                            <i className="fa-solid fa-money-bill-wave text-warning fs-5"></i>
                            <span>Cash</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* <td className="text-center">{row.paymentStatus || '-'}</td> */}
                    <td className="text-center">
                      <span
                        className={`badge d-flex align-items-center gap-2 px-3 py-2 fw-semibold text-white shadow-sm ${
                          row.paymentStatus === 'Paid' ? 'bg-success' : 'bg-danger'
                        }`}
                        style={{
                          borderRadius: '11px', // Smooth pill-like shape
                          fontSize: '0.85rem',
                          letterSpacing: '0.5px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          minWidth: '100px', // Keeps size uniform
                          justifyContent: 'center'
                        }}
                      >
                        <i
                          className={`fa-solid ${row.paymentStatus === 'Paid' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}
                          style={{
                            fontSize: '1rem',
                            color: 'white',
                            marginRight: '5px'
                          }}
                        ></i>
                        {row.paymentStatus === 'Paid' ? 'Paid' : 'Un-Paid'}
                      </span>
                    </td>
                              <td className="text-center">
                                {row.paymentDate && dayjs(row.paymentDate).isValid() ? dayjs(row.paymentDate).format("DD/MM/YYYY") : "-"}
                              </td>
                              {/* <td className="text-center">{row.paymentVerifiedByEmployeeName || '-'}</td> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}

                    </div>

                    <div className="d-flex justify-content-end ">
                      {totalCount > pageSize && (
                        <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
                      )}
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab
                eventKey="CompletedTrackinTable"
                title={
                  <Tooltip title="Completed Trackin">
                    <span className="text-sm md:text-base">Completed </span>
                  </Tooltip>
                }
                tabClassName="tab-cancelled"
              >
                <div className="container d-flex flex-column align-items-center vh-80">
                  <div style={{ width: '100%' }}>
                    {/* Dropdown and Input Field */}
                    <div className="d-flex flex-column mb-2 w-100">
                      <div
                        className="d-flex mb-2 align-items-center justify-content-between flex-column flex-md-row w-100"
                        style={{ gap: '10px' }}
                      >
                        <input
                          type="text"
                          className="form-control "
                          placeholder="Search Completed Tracking"
                          style={{ maxWidth: "350px" }}
                          value={searchKeyword}
                          onChange={(e) => {
                            handleSearch(e);
                          }}
                        />
                      </div>
                    </div>

                    <div className="table-responsive" style={{ maxHeight: '60vh', overflowY: 'auto', position: 'relative' }}>
                      <table className="table table-bordered table-striped">
                        <thead className="table-light">
                          <tr
                            style={{
                              position: 'sticky',
                              top: -1,
                              backgroundColor: '#fff',
                              zIndex: 10,
                              boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
                            }}
                            className="text-nowrap"
                          >
                            <th className="text-center">Sr No</th>
                            <th className="text-center">Employee Name</th>
                            <th className="text-center">Customer Name</th>
                            <th className="text-center">Vehicle Number</th>
                            <th className="text-center">Vehicle Type Name</th>
                            <th className="text-center">Installation Date</th>
                            <th className="text-center">Model Name</th>
                            <th className="text-center">Gov Portal Reg. Status</th>
                            <th className="text-center">Tracking Application Reg. Status</th>
                            <th className="text-center">Modal Number</th>
                            <th className="text-center">IMEI</th>
                            {/* <th className="text-center">Temporary Device Installed</th> */}
                            <th className="text-center">Government Portal Name</th>
                            <th className="text-center">Payment Amount</th>
                            <th className="text-center">Payment Mode Name</th>
                            <th className="text-center">Payment Status</th>
                            <th className="text-center">Payment Date</th>
                            {/* <th className="text-center">Payment Verified By Employee Name</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {finalListOfInstallation?.map((row, idx) => (
                            <tr key={idx}>
                              <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                              {/* <td className="text-center">{row.companyName || '-'}</td> */}
                              <td className="text-center">{row.employeeName || '-'}</td>
                              <td className="text-center">
                                <Link onClick={()=>trackingCompletedTabBtnClicked(row)}>
                                {row.customerName || '-'}
                                </Link>
                                </td>
                              <td className="text-center">{(row.vehicleNumber).toUpperCase() || '-'}</td>

                              <td className="text-center">{row.vehicleTypeName || '-'}</td>

                              <td className="text-center">
                                {row.installationDate
                                  ? (() => {
                                    const parts = row.installationDate.split("/");
                                    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
                                    return dayjs(formattedDate).isValid() ? dayjs(formattedDate).format("DD/MM/YYYY") : "-";
                                  })()
                                  : "-"}
                              </td>


                              <td className="text-center">{row.modalName || '-'}</td>
                              <td className="text-center text-nowrap">
                                {row.govtPortalRegStatus === 'Pending' ? ( // Show button only if status is "Pending"
                                  <Tooltip title={row.status ? 'Enable' : 'Disable'}>
                                    <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(row)} checked={row.status === true} />
                                  </Tooltip>
                                ) : (
                                  <span
                                    className="d-inline-flex align-items-center px-3 py-1 rounded-pill text-white"
                                    style={{ backgroundColor: '#137c3b', fontWeight: 'bold' }}
                                  >
                                    <i className="fa fa-check-circle me-2" style={{ fontSize: '14px' }}></i>
                                    Completed
                                  </span>
                                  // <span className="text-success fw-bold">Completed</span> // Show text if "Completed"
                                )}
                              </td>


                              <td className="text-center">
                                <span
                                  className="d-inline-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm text-white"
                                  style={{
                                    backgroundColor:
                                      row.trackingAppRegStatus === 'Pending'
                                        ? '#ffc107' // Bootstrap warning yellow
                                        : row.trackingAppRegStatus === 'Completed'
                                          ? '#137c3b' // Same green as your previous request
                                          : '#6c757d', // Bootstrap secondary gray
                                    borderRadius: '20px',
                                    fontSize: '0.9rem',
                                    letterSpacing: '0.2px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    minWidth: '150px',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <i
                                    className={`fa-solid ${row.trackingAppRegStatus === 'Pending'
                                        ? 'fa-clock'
                                        : row.trackingAppRegStatus === 'Completed'
                                          ? 'fa-circle-check'
                                          : 'fa-ban'
                                      }`}
                                    style={{
                                      fontSize: '1rem',
                                      color: '#fff', // Keeping icon white for all cases
                                    }}
                                  ></i>
                                  {row.trackingAppRegStatus || '-'}
                                </span>
                              </td>
                              <td className="text-center">{row.modelNumber || '-'}</td>
                              <td className="text-center">{row.imei || '-'}</td>
                              {/* <td className="text-center">{row.isTemporaryDeviceInstalled || '-'}</td> */}
                              <td className="text-center">{row.governmentPortalName || '-'}</td>
                              <td className="text-center">
                                {new Intl.NumberFormat('en-IN', {
                                  style: 'decimal',
                                  maximumFractionDigits: 0,
                                  minimumFractionDigits: 0
                                }).format(Math.round(row.paymentAmount)) || '-'}
                              </td>
                              <td className="text-center">
                      <span className="d-flex align-items-center justify-content-center gap-2 fw-semibold">
                        {row.paymentModeName === 'Credit' && (
                          <>
                            <i className="fa-solid fa-credit-card text-primary fs-5"></i>
                            <span>Credit</span>
                          </>
                        )}
                        {row.paymentModeName === 'Account' && (
                          <>
                            <i className="fa-solid fa-building-columns text-success fs-5"></i>
                            <span>Account</span>
                          </>
                        )}
                        {row.paymentModeName === 'Cash' && (
                          <>
                            <i className="fa-solid fa-money-bill-wave text-warning fs-5"></i>
                            <span>Cash</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* <td className="text-center">{row.paymentStatus || '-'}</td> */}
                    <td className="text-center">
                      <span
                        className={`badge d-flex align-items-center gap-2 px-3 py-2 fw-semibold text-white shadow-sm ${
                          row.paymentStatus === 'Paid' ? 'bg-success' : 'bg-danger'
                        }`}
                        style={{
                          borderRadius: '11px', // Smooth pill-like shape
                          fontSize: '0.85rem',
                          letterSpacing: '0.5px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          minWidth: '100px', // Keeps size uniform
                          justifyContent: 'center'
                        }}
                      >
                        <i
                          className={`fa-solid ${row.paymentStatus === 'Paid' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}
                          style={{
                            fontSize: '1rem',
                            color: 'white',
                            marginRight: '5px'
                          }}
                        ></i>
                        {row.paymentStatus === 'Paid' ? 'Paid' : 'Un-Paid'}
                      </span>
                    </td>
                              <td className="text-center">
                                {row.paymentDate && dayjs(row.paymentDate).isValid() ? dayjs(row.paymentDate).format("DD/MM/YYYY") : "-"}
                              </td>
                              {/* <td className="text-center">{row.paymentVerifiedByEmployeeName || '-'}</td> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                    </div>
                    <div className="d-flex justify-content-end ">
                      {totalCount > pageSize && (
                        <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
                      )}
                    </div>
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
      />
      <RegistrationCompletedModal
        open={showStatusChangeModal}
        onClose={() => setShowStatusChangeModal(false)}
        onConfirm={() => confirmStatusChange(stateChangeStatus, user)} // Pass the required arguments
      />
      <GovPortalDataImportModal
        show={showModal}
        modelRequestData={modelRequestData}
        onHide={() => closeAllModal()}
        userKeyID={user.userKeyID}
        setErrorMessage={setErrorMessage}
        companyKeyID={companyID}
        apiAction={currentApiAction} // Dynamically set the function
      />

      <CompletedTabLoggedInModal
      show={showCompletedTabModal}
      modelRequestData={modelRequestData}
      onHide={() => closeAllModal()}
      userKeyID={user.userKeyID}
      setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

export default TrackinTableViewList;
