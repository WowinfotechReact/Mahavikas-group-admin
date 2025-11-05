import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Tabs, Tab, Button } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import { Table } from 'react-bootstrap';
import Select from 'react-select';

import SuccessPopupModal from 'component/SuccessPopupModal';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { ImportDeviceCSV } from 'services/DeviceTabCsv/DeviceCSVApi';
import { ConfigContext } from 'context/ConfigContext';
import { ChangeDeviceStatus } from 'services/DeviceTabCsv/AddNewDeviceApi';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { AddUpdateDeviceAcceptance, } from 'services/DeviceTabCsv/AcceptDeviceApi';
import DeviceConfirmationModal from 'component/DeviceConfirmationModal';
import Android12Switch from 'component/Android12Switch';
import StatusChangeModal from 'component/StatusChangeModal ';
import { GetAMCListByCustomerID, GetCustomerComplaintListByID, GetCustomerInstalledDeviceList, GetCustomerViewDetails, GetRechargeListByCustomerID } from 'services/CustomerStaff/CustomerStaffApi';
import { useLocation } from 'react-router';

const CustomerDetailsTab = () => {
  const [moduleName, setModuleName] = useState('');
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [error, setErrors] = useState(null);
  const [errorMessage, setErrorMessage] = useState();
  const [confirmImportedMsg, setConfirmImportedMsg] = useState('')
  const [importResponseData, setImportResponseData] = useState(null);
  const rechargeOption = [
    { label: "Active", value: 1 },
    { label: "Pending", value: 2 },
    { label: "Expired", value: 3 },
  ]
  const [ActiveTab, setActiveTab] = useState('importNewDevice');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState();
  const [currentApiAction, setCurrentApiAction] = useState(null); // Store the function dynamically
  const [modelRequestData, setModelRequestData] = useState({
    Action: null,
    customerKeyID: null
  });
  const [stateChangeStatus, setStateChangeStatus] = useState('');


  const [customerViewData, setCustomerViewData] = useState({
    customerID: null,
    customerKeyID: null,
    companyKeyID: null,
    companyID: null,
    companyName: null,
    name: null,
    address: null,
    stateID: null,
    stateName: null,
    districtID: null,
    districtName: null,
    talukaID: null,
    talukaName: null,
    villageID: null,
    villageName: null,
    mobileNo: null,
    adharNumber: null,
    adharFrontImageURL: null,
    adharBackImageURL: null,
    status: null,
    createdOnDate: null
  });
  const location = useLocation();

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
  const [rechargeCusObj, setRechargeCusObj] = useState({
    employeeName: null,
    vehicleNumber: null,
    installationDate: null,
    installationTypeName: null,
    deviceID: null,
    sim1Validity: null,
    sim1RechargeAmt: null,
    sim1PaymentStatus: null,
    sim2Validity: null,
    sim2RechargeAmt: null,
    sim2PaymentStatus: null
  })
  const [amcCusObj, setAmcCusObj] = useState({
    employeeName: null,
    vehicleNumber: null,
    installationDate: null,
    installationTypeName: null,
    sim1Validity: null,
    sim1RechargeAmt: null,
    sim1PaymentStatus: null,
    sim2Validity: null,
    sim2RechargeAmt: null,
    sim2PaymentStatus: null,
    amcStartDate: null,
    amcValidityInMonth: null,
    paymentStatus: null
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

  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(rechargeOption[0]);
  const [customerListData, setCustomerListData] = useState([])
  const [customerComplaintListData, setCustomerComplaintListData] = useState([])
  const [customerRechargeListData, setCustomerRechargeListData] = useState([])

  useEffect(() => {
    if (isAddUpdateActionDone) {
      if (ActiveTab === 'importNewDevice') {
      } else if (ActiveTab === 'AcceptDevice') {
        // GetAcceptDeviceListListData(1, null, null, null, acceptRejectDeviceObj.employeeKeyID);
      } else if (ActiveTab === 'TransferDevice') {
        // GetDeviceTransferListData(1, null, null, null);
      }

      // Reset the flag after actions are done
      setIsAddUpdateActionDone(false);
    }
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    ModuleNameFunc();
  }, [ActiveTab]);








  const GetCustomerInstalledDeviceListData = async (pageNumber, toDate, fromDate) => {

    setLoader(true);
    try {
      const data = await GetCustomerInstalledDeviceList({
        pageSize,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        userKeyID: user.userKeyID,
        sortingDirection: null,
        sortingColumnName: null,
        customerKeyID: location.state.customerKeyID,
        companyKeyID: companyID
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const customerListData = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(customerListData.length);
            setCustomerListData(customerListData);
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




  const GetCustomerComplaintListByIDData = async (pageNumber, toDate, fromDate) => {

    setLoader(true);
    try {
      const data = await GetCustomerComplaintListByID({
        pageSize,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        userKeyID: user.userKeyID,
        sortingDirection: null,
        sortingColumnName: null,
        customerKeyID: location.state.customerKeyID,
        companyKeyID: companyID
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const customerListData = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(customerListData.length);
            setCustomerComplaintListData(customerListData);
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



  const handleStatusChange = (option) => {
    setSelectedStatus(option);

    const customerID = location.state.customerKeyID;

    if (ActiveTab === 'cusRechargeTab') {
      GetRechargeListByCustomerIDData(customerID, option.value);
    } else if (ActiveTab === 'amcTab') {
      GetAMCListByCustomerIDData(customerID, option.value);
    }
  };



  useEffect(() => {
    if (location.state.customerKeyID !== null && location.state.customerKeyID !== undefined) {
      GetCustomerDetailsData(location.state.customerKeyID);
    }
  }, [location.state]);

  const GetCustomerDetailsData = async (id) => {
    try {
      const response = await GetCustomerViewDetails(id);

      if (response?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = response.data.responseData?.data || {}; // Use empty object as default

        setCustomerViewData({
          companyName: ModelData.companyName,
          name: ModelData.name,
          address: ModelData.address,
          stateName: ModelData.stateName,
          districtName: ModelData.districtName,
          talukaName: ModelData.talukaName,
          villageName: ModelData.villageName,
          mobileNo: ModelData.mobileNo,
          adharNumber: ModelData.adharNumber,
          adharFrontImageURL: ModelData.adharFrontImageURL,
          adharBackImageURL: ModelData.adharBackImageURL,
          status: ModelData.status,
          createdOnDate: ModelData.createdOnDate
        });
      } else {
        console.error('Error fetching data: ', response?.data?.statusCode);
      }
    } catch (error) {
      console.error('Error in GetCustomerDetailsData: ', error);
    }
  };
  const GetRechargeListByCustomerIDData = async (id, status) => {
    try {
      const response = await GetRechargeListByCustomerID(id, status);

      if (response?.data?.statusCode === 200) {

        setLoader(false)
        const ModelData = response.data.responseData?.data || {}; // Use empty object as default

        setRechargeCusObj({
          ...rechargeCusObj,
          employeeName: ModelData.employeeName,
          vehicleNumber: ModelData.vehicleNumber,
          installationDate: ModelData.installationDate,
          installationTypeName: ModelData.installationTypeName,
          deviceID: ModelData.deviceID,
          sim1Validity: ModelData.sim1Validity,
          sim1RechargeAmt: ModelData.sim1RechargeAmt,
          sim1PaymentStatus: ModelData.sim1PaymentStatus,
          sim2Validity: ModelData.sim2Validity,
          sim2RechargeAmt: ModelData.sim2RechargeAmt,
          sim2PaymentStatus: ModelData.sim2PaymentStatus
        });
      } else {
        setLoader(false)
        console.error('Error fetching data: ', response?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false)
      console.error('Error in GetCustomerDetailsData: ', error);
    } finally {
      setLoader(false); // always stop loader
    }

  };
  const GetAMCListByCustomerIDData = async (id, status) => {
    try {
      const response = await GetAMCListByCustomerID(id, status);

      if (response?.data?.statusCode === 200) {
        setLoader(false)
        const ModelData = response.data.responseData?.data || {}; // Use empty object as default

        setAmcCusObj({
          ...amcCusObj,
          employeeName: ModelData.employeeName,
          vehicleNumber: ModelData.vehicleNumber,
          installationDate: ModelData.installationDate,
          installationTypeName: ModelData.installationTypeName,
          sim1Validity: ModelData.sim1Validity,
          sim1RechargeAmt: ModelData.sim1RechargeAmt,
          sim1PaymentStatus: ModelData.sim1PaymentStatus,
          sim2Validity: ModelData.sim2Validity,
          sim2RechargeAmt: ModelData.sim2RechargeAmt,
          sim2PaymentStatus: ModelData.sim2PaymentStatus,
          amcStartDate: ModelData.amcStartDate,
          amcValidityInMonth: ModelData.amcValidityInMonth,
          paymentStatus: ModelData.paymentStatus
        });
      } else {
        setLoader(false); // always stop loader

        console.error('Error fetching data: ', response?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false); // always stop loader

      console.error('Error in GetCustomerDetailsData: ', error);
    } finally {
      setLoader(false); // always stop loader
    }
  };







  const handleTransferDevicePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // GetDeviceTransferListData(pageNumber, null, null, null);
  };

  const handleAcceptRejectDevicePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  const [selectedOption, setSelectedOption] = useState({
    value: 'transferDevice',
    label: 'Transfer Device'
  });








  const handleTabSelect = (key) => {
    // debugger

    setCurrentPage(1);
    setTotalCount(0);
    // setActiveTab(key);


    const customerID = location?.state?.customerKeyID;


    if (key === 'importNewDevice') {
      setActiveTab('importNewDevice');
      GetCustomerDetailsData(customerID);

    } else if (key === 'TransferDevice') {
      setActiveTab('TransferDevice');

      GetCustomerInstalledDeviceListData(1, null, null)

    } else if (key === 'AcceptDevice') {
      setActiveTab('AcceptDevice');
      GetCustomerComplaintListByIDData(1, null, null)

      // setInitialData();
    }
    else if (key === 'cusRechargeTab') {

      setActiveTab('cusRechargeTab');

      GetRechargeListByCustomerIDData(customerID, selectedStatus?.value || null)
    }
    else if (key === 'amcTab') {

      setActiveTab('amcTab');
      GetAMCListByCustomerIDData(customerID, selectedStatus?.value || null)
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
    if (ActiveTab === 'importNewDevice') {
      // GetAcceptDeviceListListData(1, capitalizedValue, toDate, fromDate, acceptRejectDeviceObj.employeeKeyID);
    } else if (ActiveTab === 'TransferDevice') {
      GetCustomerInstalledDeviceListData(1, capitalizedValue, null, null)

      // GetDeviceTransferListData(1, capitalizedValue, null, null);
    }
    if (selectedOption.value === 'AcceptDevice') {
      GetDeviceTransferredListData(1, capitalizedValue, toDate, fromDate, acceptRejectDeviceObj.employeeKeyID);
    }
  };





  const ModuleNameFunc = () => {
    if (ActiveTab === 'importNewDevice') {
      setModuleName('Customer Details');
    } else if (ActiveTab === 'TransferDevice') {
      setModuleName('Installed Device ');
    } else if (ActiveTab === 'AcceptDevice') {
      setModuleName('Complaints');
    } else if (ActiveTab === 'cusRechargeTab') {

      setModuleName('Recharge');
    } else if (ActiveTab === 'amcTab') {

      setModuleName('AMC');
    }
  };





  return (
    <div className="card w-full max-w-[50vh] md:max-w-[90vw] mx-auto h-auto">
      <div className="card-body p-2 bg-white shadow-md rounded-lg">
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
          <h5 className="mb-0">{moduleName}</h5>
          {(ActiveTab === 'cusRechargeTab' || ActiveTab === 'amcTab') && (
            <div style={{ width: '150px' }}>
              <Select
                options={rechargeOption}
                value={selectedStatus}
                onChange={handleStatusChange}
                menuPosition="fixed"
                placeholder="Select Status"
                classNamePrefix="react-select"
              />
            </div>
          )}

        </div>
        <Row>
          <Col>

            <Tabs activeKey={ActiveTab} id="justify-tab-example" className="whitespace-nowrap" onSelect={handleTabSelect}>
              {/* csv export tab */}
              <Tab
                eventKey="importNewDevice"
                title={
                  <Tooltip title="Customer Details">
                    <span className="text-sm md:text-base">Customer Details</span>
                  </Tooltip>
                }
                tabClassName="tab-upcoming"
              >


                <div className="container d-flex justify-content-center align-items-center vh-80">
                  <div className="p-1 col-12 col-md-8" style={{ width: '100%' }}>
                    <div className="card p-4 shadow rounded">
                      <div className="row">
                        <div className="col-12 col-md-6 mb-3">
                          <strong>Company Name:</strong> {customerViewData.companyName}
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                          <strong>Customer Name:</strong> {customerViewData.name}
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                          <strong>Contact No.:</strong>{customerViewData.mobileNo}
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                          <strong>Address:</strong> {customerViewData.address}
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                          <strong>State Name:</strong> {customerViewData.stateName}
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                          <strong>District Name:</strong> {customerViewData.districtName}
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                          <strong>Taluka Name:</strong> {customerViewData.talukaName}
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                          <strong>Village Name:</strong> {customerViewData.villageName}
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                          <strong>Aadhaar Number:</strong> {customerViewData.adharNumber}
                        </div>
                        <div className="col-12 mb-3">
                          <div className="row justify-content-between">
                            <div className="col-12 col-md-6">
                              <strong>Aadhaar Front Image:</strong><br />
                              <img
                                src={customerViewData.adharFrontImageURL}
                                alt="Aadhaar Front"
                                className="img-fluid rounded border"
                                style={{ maxHeight: '200px' }}
                              />
                            </div>
                            <div className="col-12 col-md-6 ">
                              <strong>Aadhaar Back Image:</strong><br />
                              <img
                                src={customerViewData.adharBackImageURL}
                                alt="Aadhaar Back"
                                className="img-fluid rounded border"
                                style={{ maxHeight: '200px' }}
                              />
                            </div>
                          </div>
                        </div>


                      </div>
                    </div>
                  </div>
                </div>


              </Tab>

              {/* 2nd table , where select , search , checkbox, submit */}
              <Tab
                eventKey="TransferDevice"
                title={
                  <Tooltip title="Installed Device">
                    <span className="text-sm md:text-base">Installed Device</span>
                  </Tooltip>
                }
                tabClassName="tab-completed"
              >

                <div className="container d-flex flex-column align-items-center vh-80">
                  <div style={{ width: '100%' }}>
                    <div className="d-flex flex-column mb-2 w-100">
                      <div
                        className="d-flex mb-2 align-items-center justify-content-between flex-column flex-md-row w-100"
                        style={{ gap: '10px' }}
                      >
                        {/* <div className="w-100" style={{ maxWidth: '400px' }}>
                            <input
                              type="text"
                              style={{ maxWidth: '400px' }}
                              value={searchKeyword}
                              onChange={handleSearch}
                              className="form-control mt-1 w-100"
                              placeholder="Search.."
                            />
                          </div> */}

                      </div>


                    </div>

                    <div className="tab-content-scroll-Device">
                      <Table striped bordered hover style={{ minWidth: '800px' }}>
                        <thead>
                          <tr className='text-nowrap' style={{ position: 'sticky', top: -1, backgroundColor: '#fff' }}>

                            <th>Company Name</th>
                            <th>Employee Name</th>
                            <th>Customer Name</th>
                            <th>Vehicle Number</th>
                            <th>RC Image</th>
                            <th>Number Plate Image</th>
                            <th>Vehicle Front Image</th>
                            <th>Vehicle Back Image</th>
                            <th>VehicleLeftImage</th>
                            <th>VehicleRightImage</th>
                            <th>Insurance Image</th>
                            <th>Installation Date</th>
                            <th>Payment Amount</th>
                            <th>Payment Receipt</th>
                            <th>Transaction ID</th>
                            <th>Payment Status</th>
                            <th>Payment Date</th>
                            <th>Sim 1 Validity</th>
                            <th>Sim 1 Recharge Amt</th>
                            <th>Sim 1 Payment Status</th>
                            <th>Sim 2 Validity</th>
                            <th>Sim 2 Recharge Amt</th>
                            <th>Sim 2 Payment Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerListData?.map((item, idx) => (
                            <tr key={idx}>

                              <td>{item.companyName || '-'}</td>
                              <td>{item.employeeName || '-'}</td>
                              <td>{item.customerName || '-'}</td>
                              <td>{item.vehicleNumber || '-'}</td>
                              <td>
                                <img src={item.rcImageURL || '-'} alt="" />
                              </td>
                              <td>
                                <img src={item.numberPlateImageURL || '-'} alt="" />

                              </td>
                              <td>
                                <img src={item.vehicleFrontImageURL || '-'} alt="" />

                              </td>
                              <td>
                                <img src={item.vehicleBackImageURL || '-'} alt="" />



                              </td>
                              <td>
                                <img src={item.vehicleLeftImageURL || '-'} alt="" />


                              </td>
                              <td>
                                <img src={item.vehicleRightImageURL || '-'} alt="" />


                              </td>
                              <td>
                                <img src={item.insuranceImageURL || '-'} alt="" />


                              </td>
                              <td>{item.installationDate || '-'}</td>
                              <td>{item.paymentAmount || '-'}</td>
                              <td>{item.paymentReceiptURL || '-'}</td>
                              <td>{item.transactionID || '-'}</td>
                              <td>{item.paymentStatus || '-'}</td>
                              <td>{item.paymentDate || '-'}</td>
                              <td>{item.sim1Validity || '-'}</td>
                              <td>{item.sim1RechargeAmt || '-'}</td>
                              <td>{item.sim1PaymentStatus || '-'}</td>
                              <td>{item.sim2Validity || '-'}</td>
                              <td>{item.sim2RechargeAmt || '-'}</td>
                              <td>{item.sim2PaymentStatus || '-'}</td>
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


                </div>



              </Tab>

              {/* 3rd table start */}
              <Tab
                eventKey="AcceptDevice"
                title={
                  <Tooltip title="Complaints">
                    <span className="text-sm md:text-base">Complaints </span>
                  </Tooltip>
                }
                tabClassName="tab-cancelled"
              >
                <div className="container d-flex flex-column align-items-center vh-80">
                  <div style={{ width: '100%' }}>
                    <div className="d-flex flex-column mb-2 w-100">


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

                            <th>Customer Name</th>
                            <th>Contact Us</th>
                            <th>Complaint Type</th>
                            <th>Imei</th>
                            <th>Complaint Date</th>
                            <th>Remark</th>
                            <th>Complaint Status Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerComplaintListData?.map((item) => (
                            <tr key={item.id}>

                              <td>{item.customerName}</td>
                              <td>{item?.mobileNo}</td>
                              <td>{item?.complaintType}</td>
                              <td>{item?.imei}</td>
                              <td>{item?.complaintDate}</td>
                              <td>{item?.remark}</td>
                              <td>{item?.complaintStatusName}</td>
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

                </div>
              </Tab>
              {/* 3rd table end  */}
              {/* 4th start */}
              <Tab
                eventKey="cusRechargeTab"
                title={
                  <Tooltip title="Recharge">
                    <span className="text-sm md:text-base">Recharge </span>
                  </Tooltip>
                }
                tabClassName="tab-cancelled"
              >
                <div className="container d-flex flex-column align-items-center vh-80">
                  <div style={{ width: '100%' }}>
                    <div className="d-flex flex-column mb-2 w-100">


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

                            <th>Employee Name</th>
                            <th>Vehicle Number</th>
                            <th>Installation Date</th>
                            <th>Sim 1 Validity</th>
                            <th>Sim1 Recharge Amt</th>
                            <th>Sim1 Payment Status</th>
                            <th>Sim 2 Validity</th>
                            <th>Sim 2 Recharge Amt</th>
                            <th>Sim 2 Payment Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerRechargeListData?.map((item) => (
                            <tr key={item.id}>

                              <td>{item.employeeName}</td>
                              <td>{item?.vehicleNumber}</td>
                              <td>{item?.installationDate}</td>
                              <td>{item?.sim1Validity}</td>
                              <td>{item?.sim1RechargeAmt}</td>
                              <td>{item?.sim1PaymentStatus === 'True' ? "Paid" : "Un-Paid"}</td>
                              <td>{item?.sim2Validity}</td>
                              <td>{item?.sim2RechargeAmt}</td>
                              <td>{item?.sim2PaymentStatus}</td>
                              {/* <td>{item?.acceptRejectStatus}</td>
                              <td>{item?.acceptRejectRemark}</td> */}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      {/* {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />} */}
                    </div>

                    {/* {totalCount > pageSize && (
                      <PaginationComponent
                        totalPages={totalPage}
                        currentPage={currentPage}
                        onPageChange={handleAcceptRejectDevicePageChange}
                      />
                    )} */}
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

                </div>
              </Tab>
              {/* 4th end */}

              {/* 5th tab start */}
              <Tab
                eventKey="amcTab"
                title={
                  <Tooltip title="AMC">
                    <span className="text-sm md:text-base">AMC </span>
                  </Tooltip>
                }
                tabClassName="tab-cancelled"
              >
                <div className="container d-flex flex-column align-items-center vh-80">
                  <div style={{ width: '100%' }}>
                    <div className="d-flex flex-column mb-2 w-100">


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

                            <th>Customer Name</th>
                            <th>Contact Us</th>
                            <th>Complaint Type</th>
                            <th>Imei</th>
                            <th>Complaint Date</th>
                            <th>Remark</th>
                            <th>Complaint Status Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerComplaintListData?.map((item) => (
                            <tr key={item.id}>

                              <td>{item.customerName}</td>
                              <td>{item?.mobileNo}</td>
                              <td>{item?.complaintType}</td>
                              <td>{item?.imei}</td>
                              <td>{item?.complaintDate}</td>
                              <td>{item?.remark}</td>
                              <td>{item?.complaintStatusName}</td>
                              {/* <td>{item?.acceptRejectStatus}</td>
                              <td>{item?.acceptRejectRemark}</td> */}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      {/* {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />} */}
                    </div>

                    {/* {totalCount > pageSize && (
                      <PaginationComponent
                        totalPages={totalPage}
                        currentPage={currentPage}
                        onPageChange={handleAcceptRejectDevicePageChange}
                      />
                    )} */}
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

                </div>
              </Tab>
              {/* 5th tab end */}
            </Tabs>
          </Col>
        </Row>
      </div>







    </div>
  );
};

export default CustomerDetailsTab;


