import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import SuccessPopupModal from 'component/SuccessPopupModal';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { ConfigContext } from 'context/ConfigContext';
import GovPortalDataImportModal from 'views/Gov-Portal-Data/GovPortalDataImportModal';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ChangeRegistrationStatus, GetInstallationList } from 'services/Installation Device/InstallationDeviceapi';
import RegistrationCompletedModal from 'component/RegistrationCompletedModal';
import Android12Switch from 'component/Android12Switch';
import CompletedTabLoggedInModal from 'component/Completed Tab Login Modal/CompletedTabLoggedInModal';
import { Link } from 'react-router-dom';
const MiliTrackTabs = () => {
  let moduleName = 'MiliTrack';
  dayjs.extend(customParseFormat);
  const [showCompletedTabModal, setShowCompletedTabModal] = useState(false)
  const [stateChangeStatus, setStateChangeStatus] = useState('');
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, companyID } = useContext(ConfigContext);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modelAction, setModelAction] = useState('');
  const [showSVTSModal, setShowSVTSModal] = useState(false);
  const [militrackTypeID, setMiliTrackTypeID] = useState(1);
  const [ActiveTab, setActiveTab] = useState('SVTS');
  const [nestedTab, setNestedTab] = useState('pendingSVTS1');
  const [showModal, setShowModal] = useState(false);
  const [currentApiAction, setCurrentApiAction] = useState(null); // Store the function dynamically
  const [modelRequestData, setModelRequestData] = useState({
    adminID: null,
    svts: null,
    svts2: null,
    viaahana: null,
    Action: null
  });

  // --------------------4th  tab old device ---new device

  const [oldDeviceSelectedRows, setOldDeviceSelectedRows] = useState([]); // Selected rows for Old Devices
  const [newDeviceSelectedRows, setNewDeviceSelectedRows] = useState([]);

  const [totalRecords, setTotalRecords] = useState(-1);
  const { user } = useContext(ConfigContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalCount, setTotalCount] = useState(null);
  const [pageSize, setPageSize] = useState(30);
  const [registrationStatus, setRegistrationStatus] = useState('pending');
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const [finalListOfInstallation, setFinalListOfInstallation] = useState([]);
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);
  const [data, setData] = useState([]);
  useEffect(() => {
    setNestedTab('pendingSVTS1'); // Reset to Pending when parent tab changes
  }, []);

  const handleTabSelect = (key) => {
    setCurrentPage(1);

    // Define the mapping of main tabs to their default nested tab
    const defaultNestedTabs = {
      SVTS: 'pendingSVTS1',
      SVTS2: 'pendingSVTS2',
      Vihaana: 'pendingVihaana'
    };

    if (defaultNestedTabs[key]) {
      setNestedTab(defaultNestedTabs[key]); // Set nested tab to "Pending" of the selected main tab
    }

    if (key === 'SVTS') {
      setActiveTab('SVTS');
      setMiliTrackTypeID(1);
      GetInstallationListData(1, null, toDate, fromDate, 1, 0);
      setInitialData();
    } else if (key === 'SVTS2') {
      setActiveTab('SVTS2');
      setMiliTrackTypeID(2);
      GetInstallationListData(1, null, toDate, fromDate, 2, 0);
      setInitialData();
    } else if (key === 'Vihaana') {
      setActiveTab('Vihaana');
      setMiliTrackTypeID(3);
      GetInstallationListData(1, null, toDate, fromDate, 3, 0);
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
    GetInstallationListData(1, null, toDate, fromDate, null, registrationStatus);
  };

  useEffect(() => {
    if (isAddUpdateActionDone) {
      GetInstallationListData(1, null, toDate, fromDate, null, registrationStatus);
      setSearchKeyword('')

    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  const setInitialData = () => {
    setNewDeviceSelectedRows('');
    setOldDeviceSelectedRows('');
    setData([]);
  };
  const closeAllModal = () => {
    setShowSuccessModal(false);
    setShowSVTSModal(false);
    setShowModal(false);
    setData([]);
    setShowCompletedTabModal(false)
  };

  useEffect(() => {
    GetInstallationListData(1, null, toDate, fromDate, 1, 0);
  }, [setIsAddUpdateActionDone]);

  const tabConfig = {
    pendingSVTS1: { miliTrackTypeID: 1, isCompleted: 0 },
    completedSVTS1: { miliTrackTypeID: 1, isCompleted: 1 },
    pendingSVTS2: { miliTrackTypeID: 2, isCompleted: 0 },
    completedSVTS2: { miliTrackTypeID: 2, isCompleted: 1 },
    pendingVihaana: { miliTrackTypeID: 3, isCompleted: 0 },
    completedVihaana: { miliTrackTypeID: 3, isCompleted: 1 }
  };
  const fetchInstallationData = () => {
    const config = tabConfig[nestedTab];
    if (config) {
      GetInstallationListData(1, null, toDate, fromDate, config.miliTrackTypeID, config.isCompleted);
    }
  };

  const GetInstallationListData = async (pageNumber, searchKeywordValue, toDate, fromDate, miliTrackTypeID, trackingAppRegStatus) => {
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
        miliTrackTypeID: miliTrackTypeID,
        govtPortalRegStatus: 1,
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

  const handleNestedTabSelect = (key) => {
    setNestedTab(key);

    // Determine miliTrackTypeID and boolean flag based on the selected nested tab
    const tabConfig = {
      pendingSVTS1: { miliTrackTypeID: 1, isCompleted: 0 },
      completedSVTS1: { miliTrackTypeID: 1, isCompleted: 1 },
      pendingSVTS2: { miliTrackTypeID: 2, isCompleted: 0 },
      completedSVTS2: { miliTrackTypeID: 2, isCompleted: 1 },
      pendingVihaana: { miliTrackTypeID: 3, isCompleted: 0 },
      completedVihaana: { miliTrackTypeID: 3, isCompleted: 1 }
    };

    const config = tabConfig[key];

    if (config) {
      GetInstallationListData(1, null, toDate, fromDate, config.miliTrackTypeID, config.isCompleted);
    }
  };


  const handleStatusChange = (row) => {
    // debugger
    setStateChangeStatus(row); // You can set only relevant data if needed
    setShowStatusChangeModal(true);
  };
  const confirmStatusChange = async (row, user) => {
    // debugger
    setLoader(true);
    try {
      const { installationKeyID } = row;
      const response = await ChangeRegistrationStatus(installationKeyID, companyID, 'TrackingAppRegStatus');

      if (response && response.data.statusCode === 200) {
        setLoader(false);
        setShowStatusChangeModal(false);

        fetchInstallationData();
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

  const MilitrackCompletedTabBtnClicked = (row) => {

    setModelRequestData({
      ...modelRequestData,
      openFromModule: 'MiliTrackTab',
      customerKeyID: row.customerKeyID
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
            <Tabs activeKey={ActiveTab} id="justify-tab-example" onSelect={handleTabSelect}>
              {/*  svts tab */}
              <Tab
                eventKey="SVTS"
                title={
                  <Tooltip title="Smart Vehicle Tracking System">
                    <span>SVTS</span>
                  </Tooltip>
                }
                tabClassName="tab-upcoming"
              >
                <Tabs activeKey={nestedTab} id="nested-tabs" onSelect={handleNestedTabSelect}>
                  <Tab eventKey="pendingSVTS1" title="Pending">
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
                              placeholder="Search..."
                              style={{ maxWidth: '350px' }}
                              value={searchKeyword}
                              onChange={(e) => {
                                handleSearch(e);
                              }}
                            />
                          </div>
                          <div className="d-flex gap-">
                          
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
                                  <td className="text-center">{row.vehicleNumber.toUpperCase() || '-'}</td>

                                  <td className="text-center">{row.vehicleTypeName || '-'}</td>
                                  <td className="text-center">
                                    {row.installationDate
                                      ? (() => {
                                        const parts = row.installationDate.split('/');
                                        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
                                        return dayjs(formattedDate).isValid() ? dayjs(formattedDate).format('DD/MM/YYYY') : '-';
                                      })()
                                      : '-'}
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
                                  <td className="text-center">
                                    <span
                                      className={`badge d-flex align-items-center gap-2 px-3 py-2 fw-semibold text-white shadow-sm ${row.paymentStatus === 'Paid' ? 'bg-success' : 'bg-danger'
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
                                    {row.paymentDate && dayjs(row.paymentDate).isValid()
                                      ? dayjs(row.paymentDate).format('DD/MM/YYYY')
                                      : '-'}
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
                            <PaginationComponent
                              totalPages={totalPage}
                              currentPage={currentPage}
                            // onPageChange={handlePageChange}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="completedSVTS1" title="Completed ">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                      <div
                        className="d-flex mb-2 align-items-center justify-content-between flex-column flex-md-row w-100"
                        style={{ gap: '10px' }}
                      >
                        <input
                          type="text"
                          className="form-control "
                          placeholder="Search..."
                          style={{ maxWidth: '350px' }}
                          value={searchKeyword}
                          onChange={(e) => {
                            handleSearch(e);
                          }}
                        />
                      </div>
                      <div className="d-flex gap-">
                        
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
                            <th className="text-center">
                              Vehicle Type Name</th>
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
                            <th className="text-center">Payment Verified By Employee Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {finalListOfInstallation?.map((row, idx) => (
                            <tr key={idx}>
                              <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                              {/* <td className="text-center">{row.companyName || '-'}</td> */}
                              <td className="text-center">{row.employeeName || '-'}</td>
                              {/* <td className="text-center">{row.customerName || '-'}</td> */}
                              <td className="text-center">
                                <Link onClick={() => MilitrackCompletedTabBtnClicked(row)}>
                                  {row.customerName || '-'}
                                </Link>
                              </td>
                              <td className="text-center">{row.vehicleNumber.toUpperCase() || '-'}</td>

                              <td className="text-center">{row.vehicleTypeName || '-'}</td>
                              <td className="text-center">
                                {row.installationDate
                                  ? (() => {
                                    const parts = row.installationDate.split('/');
                                    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
                                    return dayjs(formattedDate).isValid() ? dayjs(formattedDate).format('DD/MM/YYYY') : '-';
                                  })()
                                  : '-'}
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
                                  className={`badge d-flex align-items-center gap-2 px-3 py-2 fw-semibold text-white shadow-sm ${row.paymentStatus === 'Paid' ? 'bg-success' : 'bg-danger'
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
                                {row.paymentDate && dayjs(row.paymentDate).isValid() ? dayjs(row.paymentDate).format('DD/MM/YYYY') : '-'}
                              </td>
                              <td className="text-center">{row.paymentVerifiedByEmployeeName || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                    </div>
                    <div className="d-flex justify-content-end ">
                      {totalCount > pageSize && (
                        <PaginationComponent
                          totalPages={totalPage}
                          currentPage={currentPage}
                        // onPageChange={handlePageChange}
                        />
                      )}
                    </div>
                  </Tab>
                </Tabs>
              </Tab>

              {/* 2nd table , svts 2 */}
              <Tab
                eventKey="SVTS2"
                title={
                  <Tooltip title="Smart Vehicle Tracking System 2">
                    <span>SVTS2</span>
                  </Tooltip>
                }
                tabClassName="tab-completed"
              >
                <Tabs activeKey={nestedTab} id="nested-tabs" onSelect={handleNestedTabSelect}>
                  <Tab eventKey="pendingSVTS2" title="Pending ">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                      <div
                        className="d-flex mb-2 align-items-center justify-content-between flex-column flex-md-row w-100"
                        style={{ gap: '10px' }}
                      >
                        <input
                          type="text"
                          className="form-control "
                          placeholder="Search..."
                          style={{ maxWidth: '350px' }}
                          value={searchKeyword}
                          onChange={(e) => {
                            handleSearch(e);
                          }}
                        />
                      </div>
                      <div className="d-flex gap-">
                        {/* <button
                          className="btn btn-primary btn-sm text-nowrap"
                        //  onClick={TrackingExportBtnClicked}
                        >
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
                              <td className="text-center">{row.customerName || '-'}</td>
                              <td className="text-center">{row.vehicleNumber.toUpperCase() || '-'}</td>

                              <td className="text-center">{row.vehicleTypeName || '-'}</td>
                              <td className="text-center">
                                {row.installationDate
                                  ? (() => {
                                    const parts = row.installationDate.split('/');
                                    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
                                    return dayjs(formattedDate).isValid() ? dayjs(formattedDate).format('DD/MM/YYYY') : '-';
                                  })()
                                  : '-'}
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
                              {/* <td className="text-center">{row.govtPortalRegStatus}</td>
                              <td className="text-center text-nowrap " >
                      <Tooltip title={row.trackingAppRegStatus === "Pending" ? 'Pending' : 'Complete'}>
                        {row.trackingAppRegStatus === "Pending" ? 'Pending' : 'Complete'}
                        <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(row)} checked={row.trackingAppRegStatus === true} />
                      </Tooltip>
                    </td> */}
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
                                  className={`badge d-flex align-items-center gap-2 px-3 py-2 fw-semibold text-white shadow-sm ${row.paymentStatus === 'Paid' ? 'bg-success' : 'bg-danger'
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
                                {row.paymentDate && dayjs(row.paymentDate).isValid() ? dayjs(row.paymentDate).format('DD/MM/YYYY') : '-'}
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
                        <PaginationComponent
                          totalPages={totalPage}
                          currentPage={currentPage}
                        // onPageChange={handlePageChange}
                        />
                      )}
                    </div>
                  </Tab>
                  <Tab eventKey="completedSVTS2" title="Completed ">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                      <div
                        className="d-flex mb-2 align-items-center justify-content-between flex-column flex-md-row w-100"
                        style={{ gap: '10px' }}
                      >
                        <input
                          type="text"
                          className="form-control "
                          placeholder="Search..."
                          style={{ maxWidth: '350px' }}
                          value={searchKeyword}
                          onChange={(e) => {
                            handleSearch(e);
                          }}
                        />
                      </div>
                      <div className="d-flex gap-">
                        {/* <button
                          className="btn btn-primary btn-sm text-nowrap"
                        //  onClick={TrackingExportBtnClicked}
                        >
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
                              {/* <td className="text-center">{row.customerName || '-'}</td> */}
                              <td className="text-center">
                                <Link onClick={() => MilitrackCompletedTabBtnClicked(row)}>
                                  {row.customerName || '-'}
                                </Link>
                              </td>
                              <td className="text-center">{row.vehicleNumber.toUpperCase() || '-'}</td>

                              <td className="text-center">{row.vehicleTypeName || '-'}</td>
                              <td className="text-center">
                                {row.installationDate
                                  ? (() => {
                                    const parts = row.installationDate.split('/');
                                    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
                                    return dayjs(formattedDate).isValid() ? dayjs(formattedDate).format('DD/MM/YYYY') : '-';
                                  })()
                                  : '-'}
                              </td>
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
                              {/* <td className="text-center text-nowrap " >
                      <Tooltip title={row.trackingAppRegStatus === "Pending" ? 'Pending' : 'Complete'}>
                        {row.trackingAppRegStatus === "Pending" ? 'Pending' : 'Complete'}
                        <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(row)} checked={row.trackingAppRegStatus === true} />
                      </Tooltip>
                    </td> */}
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
                                  className={`badge d-flex align-items-center gap-2 px-3 py-2 fw-semibold text-white shadow-sm ${row.paymentStatus === 'Paid' ? 'bg-success' : 'bg-danger'
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
                                {row.paymentDate && dayjs(row.paymentDate).isValid() ? dayjs(row.paymentDate).format('DD/MM/YYYY') : '-'}
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
                        <PaginationComponent
                          totalPages={totalPage}
                          currentPage={currentPage}
                        // onPageChange={handlePageChange}
                        />
                      )}
                    </div>
                  </Tab>
                </Tabs>
              </Tab>

              {/* Vihaana tab */}
              <Tab
                eventKey="Vihaana"
                title={
                  <Tooltip title="Vihaana">
                    <span>Vihaana</span>
                  </Tooltip>
                }
                tabClassName="tab-cancelled"
              >
                <Tabs activeKey={nestedTab} id="nested-tabs" onSelect={handleNestedTabSelect}>
                  <Tab eventKey="pendingVihaana" title="Pending ">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                      <div
                        className="d-flex mb-2 align-items-center justify-content-between flex-column flex-md-row w-100"
                        style={{ gap: '10px' }}
                      >
                        <input
                          type="text"
                          className="form-control "
                          placeholder="Search..."
                          style={{ maxWidth: '350px' }}
                          value={searchKeyword}
                          onChange={(e) => {
                            handleSearch(e);
                          }}
                        />
                      </div>
                      <div className="d-flex gap-">
                        {/* <button
                          className="btn btn-primary btn-sm text-nowrap"
                        //  onClick={TrackingExportBtnClicked}
                        >
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
                              <td className="text-center">{row.customerName || '-'}</td>
                              <td className="text-center">{row.vehicleNumber.toUpperCase() || '-'}</td>

                              <td className="text-center">{row.vehicleTypeName || '-'}</td>
                              <td className="text-center">
                                {row.installationDate
                                  ? (() => {
                                    const parts = row.installationDate.split('/');
                                    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
                                    return dayjs(formattedDate).isValid() ? dayjs(formattedDate).format('DD/MM/YYYY') : '-';
                                  })()
                                  : '-'}
                              </td>
                              <td className="text-center">{row.modalName || '-'}</td>
                              {/* <td className="text-center">{row.govtPortalRegStatus}</td> */}
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
                                  className={`badge d-flex align-items-center gap-2 px-3 py-2 fw-semibold text-white shadow-sm ${row.paymentStatus === 'Paid' ? 'bg-success' : 'bg-danger'
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
                                {row.paymentDate && dayjs(row.paymentDate).isValid() ? dayjs(row.paymentDate).format('DD/MM/YYYY') : '-'}
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
                        <PaginationComponent
                          totalPages={totalPage}
                          currentPage={currentPage}
                        // onPageChange={handlePageChange}
                        />
                      )}
                    </div>
                  </Tab>
                  <Tab eventKey="completedVihaana" title="Completed ">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                      <div
                        className="d-flex mb-2 align-items-center justify-content-between flex-column flex-md-row w-100"
                        style={{ gap: '10px' }}
                      >
                        <input
                          type="text"
                          className="form-control "
                          placeholder="Search..."
                          style={{ maxWidth: '350px' }}
                          value={searchKeyword}
                          onChange={(e) => {
                            handleSearch(e);
                          }}
                        />
                      </div>
                      <div className="d-flex gap-">
                        {/* <button
                          className="btn btn-primary btn-sm text-nowrap"
                        //  onClick={TrackingExportBtnClicked}
                        >
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
                              {/* <td className="text-center">{row.customerName || '-'}</td> */}

                              <td className="text-center">
                                <Link onClick={() => MilitrackCompletedTabBtnClicked(row)}>
                                  {row.customerName || '-'}
                                </Link>
                              </td>
                              <td className="text-center">{row.vehicleNumber.toUpperCase() || '-'}</td>

                              <td className="text-center">{row.vehicleTypeName || '-'}</td>

                              <td className="text-center">
                                {row.installationDate
                                  ? (() => {
                                    const parts = row.installationDate.split('/');
                                    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
                                    return dayjs(formattedDate).isValid() ? dayjs(formattedDate).format('DD/MM/YYYY') : '-';
                                  })()
                                  : '-'}
                              </td>
                              <td className="text-center">{row.modalName || '-'}</td>
                              {/* <td className="text-center">{row.govtPortalRegStatus}</td> */}
                              {/* <td className="text-center">{row.trackingAppRegStatus}</td> */}


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
                              {/* <td className="text-center text-nowrap " >
                      <Tooltip title={row.trackingAppRegStatus === "Pending" ? 'Pending' : 'Complete'}>
                        {row.trackingAppRegStatus === "Pending" ? 'Pending' : 'Complete'}
                        <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(row)} checked={row.trackingAppRegStatus === true} />
                      </Tooltip>
                    </td> */}
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
                                  className={`badge d-flex align-items-center gap-2 px-3 py-2 fw-semibold text-white shadow-sm ${row.paymentStatus === 'Paid' ? 'bg-success' : 'bg-danger'
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
                                {row.paymentDate && dayjs(row.paymentDate).isValid() ? dayjs(row.paymentDate).format('DD/MM/YYYY') : '-'}
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
                        <PaginationComponent
                          totalPages={totalPage}
                          currentPage={currentPage}
                        // onPageChange={handlePageChange}
                        />
                      )}
                    </div>
                  </Tab>
                </Tabs>
              </Tab>
              {/* 3rd table end  */}
            </Tabs>
          </Col>
        </Row>
      </div>
      <RegistrationCompletedModal
        open={showStatusChangeModal}
        onClose={() => setShowStatusChangeModal(false)}
        onConfirm={() => confirmStatusChange(stateChangeStatus, user)} // Pass the required arguments
      />
      <SuccessPopupModal
        show={showSuccessModal}
        onHide={() => closeAllModal()}
        setShowSuccessModal={setShowSuccessModal}
        modelAction={modelAction}
      />
      <GovPortalDataImportModal
        show={showModal}
        modelRequestData={modelRequestData}
        onHide={() => closeAllModal()}
        setErrorMessage={setErrorMessage}
        userKeyID={user.userKeyID}
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

export default MiliTrackTabs;
