import React, { useContext, useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import UserRegistrationModal from 'component/UserRegistrationModal';
import AssignLocationModal from 'AssignLocationModal';
import GrantPermissionModal from 'GrantPermissionModal';
import Tooltip from '@mui/material/Tooltip';
import { ChangeEmployeeStatus, GetEmployeeCountList, GetEmployeeList, ResetEmployeeIMEINumber } from 'services/Employee Staff/EmployeeApi';
import { ConfigContext } from 'context/ConfigContext';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import Android12Switch from 'component/Android12Switch';
import SuccessPopupModal from 'component/SuccessPopupModal';
import StatusChangeModal from 'component/StatusChangeModal ';
import EmployeeViewModal from './EmployeeViewModal';
import ChangePasswordModal from 'component/ChangePasswordModal';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Icons for eye and eye-slash
import ResetIMEIModal from './ResetIMEIModal';
import { Link } from 'react-router-dom';
import ViewIMEILogsModal from './ViewIMEILogsModal';

const ViewStaffList = () => {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showAssignLocationModal, setShowAssignLocationModal] = useState();
  const [showUserRegistrationModal, setShowUserRegistrationModal] = useState();
  const [showGrantPermissionModal, setShowGrantPermissionModal] = useState();
  const [stateChangeStatus, setStateChangeStatus] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [showIMEILogsModal, setShowIMEILogsModal] = useState(false)
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(-1);
  const { setLoader, user, companyID } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalCount, setTotalCount] = useState(null);
  const [pageSize, setPageSize] = useState(30);
  const [employeeListData, setEmployeeListData] = useState();
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);
  const [showCustomerViewModel, setShowCustomerViewModel] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [showSuccessModal, setShowSuccessModal] = useState();
  const [showResetIMEIModal, setShowResetIMEIModal] = useState();
  const [employeeCount, setEmployeeCount] = useState([]);
  const [modelRequestData, setModelRequestData] = useState({
    Action: null,
    employeeKeyID: null
  });

  useEffect(() => {
    if (isAddUpdateActionDone) {
      GetEmployeeListData(1, null, toDate, fromDate);
      EmployeeCountData(null, null);
      setSearchKeyword('')
    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    GetEmployeeListData(1, null, toDate, fromDate);
    EmployeeCountData(null, null);
  }, [setIsAddUpdateActionDone]);


  const GetEmployeeListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    setLoader(true);
    try {
      const data = await GetEmployeeList({
        pageSize,
        userKeyID: user.userKeyID,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        companyKeyID: companyID
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const employeeListData = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(employeeListData.length);
            setEmployeeListData(employeeListData);
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

  const AddUserRegistration = () => {
    setModelRequestData({
      ...modelRequestData,
      Action: null,
      employeeKeyID: null
    });

    setShowUserRegistrationModal(true);
  };
  const AssignLocation = () => {
    setShowAssignLocationModal(true);
  };
  const GrantPermission = () => {
    setModelRequestData({
      setModelRequestData,
      Action: 'FromEmployeeList'
    })
    setShowGrantPermissionModal(true);
  };

  const EmployeeUpdateEditBtnClick = (employee) => {
    setModelRequestData({
      ...modelRequestData,
      Action: 'Update',
      employeeKeyID: employee.employeeKeyID
    });
    setShowUserRegistrationModal(true);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetEmployeeListData(pageNumber, null, toDate, fromDate);
  };
  const handleStatusChange = (row) => {
    setStateChangeStatus(row); // You can set only relevant data if needed
    setShowStatusChangeModal(true);
  };

  const confirmStatusChange = async (employee, user) => {
    try {
      const { employeeKeyID } = employee; // Destructure to access only what's needed
      const response = await ChangeEmployeeStatus(employeeKeyID, user.userKeyID);

      if (response && response.data.statusCode === 200) {
        setShowStatusChangeModal(false);
        setStateChangeStatus(null);
        GetEmployeeListData(currentPage, null, toDate, fromDate);

        setShowSuccessModal(true);
        setModelAction('Employee status changed successfully.');
      } else {
        console.error(response?.data?.errorMessage);
        setShowSuccessModal(true);
        setModelAction('Failed to change Employee status.');
      }
    } catch (error) {
      console.error('Error changing Employee status:', error);
      setShowSuccessModal(true);
      setModelAction('An error occurred while changing the Employee status.');
    }
  };

  const closeAllModal = () => {
    setShowSuccessModal(false);
    setShowChangePasswordModal(false);
    setShowResetIMEIModal(false);
  };

  const EmployeeCountData = async (startDate, endDate, i) => {
    setLoader(true);
    setEmployeeCount([]);
    if (startDate !== undefined && endDate !== undefined) {
    }
    try {
      const StartDate = startDate === null ? null : startDate.format('YYYY-MM-DD');
      const EndDate = endDate === null ? null : endDate.format('YYYY-MM-DD');
      const response = await GetEmployeeCountList({
        pageNo: 0,
        pageSize: 30,
        fromDate: StartDate,
        toDate: EndDate,
        userKeyID: user.userKeyID,
        companyKeyID: companyID
      });

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (startDate !== undefined && endDate !== undefined) {
          }
          if (response?.data?.responseData?.data) {
            const EmployeeNumb = response?.data?.responseData?.data;
            setEmployeeCount(EmployeeNumb);
          }
        } else {
          setLoader(false);
          if (startDate !== undefined && endDate !== undefined) {
          }
          setErrorMessage(response?.data?.errorMessage);
          setLoader(false);
        }

        return response;
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
      if (startDate !== undefined && endDate !== undefined) {
        setLoader(false);
      }
    }
  };

  const ResetIMEIBtnClick = (employee) => {
    setModelRequestData((prev) => ({
      ...prev,
      employeeKeyID: employee.employeeKeyID
    }));

    setShowResetIMEIModal(true); // Show modal after setting state
  };

  const ResetIMEI = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/ResetEmployeeIMEINumber'; // Default URL for Adding Data

      const response = await ResetEmployeeIMEINumber(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'IMEI Reset Successfully!'
              : 'IMEI Reset Successfully!'
          ); //Do not change this naming convention

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

  const CustomerViewBtnClicked = async (employee) => {
    setModelRequestData({
      ...modelRequestData,
      employeeKeyID: employee.employeeKeyID,
      Action: 'staffView'
    });
    setShowCustomerViewModel(true);
  };
  const employeePasswordChange = async (employee) => {
    setModelRequestData({
      ...modelRequestData,
      employeeKeyID: employee.employeeKeyID
    });
    setShowChangePasswordModal(true);
  };

  const openIMEILogsView = (employee) => {
    setModelRequestData({
      ...modelRequestData,
      employeeKeyID: employee.employeeKeyID,
      Action: 'IEMI'
    });
    setShowIMEILogsModal(true)
  }

  const togglePasswordVisibility = (idx) => {
    setVisiblePasswords((prevState) => ({
      ...prevState,
      [idx]: !prevState[idx] // Toggle the visibility for this specific idx
    }));
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
    GetEmployeeListData(1, capitalizedValue, toDate, fromDate);
  };



  return (
    <div className="card w-full max-w-[50vh] mx-auto h-auto">
      <div className="card-body p-2 bg-white shadow-md rounded-lg">
        <h5>AMC</h5>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <div className="d-flex flex-wrap gap-2 bg-light p-1 rounded shadow-sm align-items-center">
            <div className=" text-white rounded p-1 d-flex align-items-center">
              <input
                type="text"
                className="form-control"
                placeholder="Search Employee"
                style={{ maxWidth: '300px' }}
                value={searchKeyword}
                onChange={(e) => {
                  handleSearch(e);
                }}
              />
            </div>
            <div className="badge-container bg-primary bg-gradient text-white rounded p-1 d-flex align-items-center">
              <h6 className="mb-0 me-1">Total</h6>
              <span className="badge bg-white text-primary rounded-circle px-1 py-1 shadow-sm">{employeeCount?.totalAllEmployee}</span>
            </div>
            <div className="badge-container bg-success bg-gradient text-white rounded p-1 d-flex align-items-center">
              <h6 className="mb-0 me-1">Sales Agent</h6>
              <span className="badge bg-white text-success rounded-circle px-1 py-1 shadow-sm">{employeeCount?.sales}</span>
            </div>
            <div className="badge-container bg-secondary bg-gradient  text-white rounded p-1 d-flex align-items-center">
              <h6 className="mb-0 me-1">Technician</h6>
              <span className="badge bg-white text-info rounded-circle px-1 py-1 shadow-sm">{employeeCount?.technician}</span>
            </div>
            {/* <div className="badge-container bg-secondary bg-gradient text-white rounded p-1 d-flex align-items-center">
              <h6 className="mb-0 me-1">Sub Tech..</h6>
              <span className="badge bg-white text-info rounded-circle px-1 py-1 shadow-sm">{employeeCount?.technician}</span>
            </div> */}

            <div className="badge-container bg-warning bg-gradient text-white rounded p-1 d-flex align-items-center">
              <h6 className="mb-0 me-1">Admins</h6>
              <span className="badge bg-white text-warning rounded-circle px-1 py-1 shadow-sm">{employeeCount?.admin}</span>
            </div>
          </div>
          <Tooltip title="Add Employee">
            <button type="button" className="btn btn-primary btn-sm" onClick={AddUserRegistration}>
              <i class="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>

              <span className="d-none d-sm-inline"> Add Employee</span>
              <span className="d-inline d-sm-none"> Add</span>

            </button>
          </Tooltip>
        </div>

        {/* Table */}
        <div className="table-responsive" style={{ maxHeight: '61vh' }}>
          <Table striped bordered hover>
            <thead className="text-nowrap ">
              <tr
                style={{
                  position: 'sticky',
                  top: -1,
                  backgroundColor: '#fff',
                  zIndex: 10,
                  boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
                }}
              >
                <th className="text-center" scope="col">
                  {' '}
                  ID
                </th>
                <th className="text-center" scope="col">
                  {' '}
                  Employee Name
                </th>
                <th className="text-center" scope="col">
                  {' '}
                  Company Name
                </th>
                <th className="text-center" scope="col">
                  Contact No.
                </th>
                {/* <th className="text-center" scope="col">
                  {' '}
                  Company Name
                </th> */}
                {/* <th className="text-center" scope="col">
                  {' '}
                  Birth Date
                </th> */}
                <th className="text-center" scope="col">
                  {' '}
                  Email ID
                </th>
                <th className="text-center" scope="col">
                  {' '}
                  Aadhaar Number
                </th>
                <th className="text-center" scope="col">
                  {' '}
                  Pan Number
                </th>

                <th className="text-center" scope="col">
                  {' '}
                  Role Name
                </th>
                <th className="text-center" scope="col">
                  {' '}
                  User Name
                </th>
                <th className="text-center" scope="col">
                  {' '}
                  Password
                </th>

                <th className="text-center" scope="col" style={{ width: '150px' }}>
                  Reset IMEI
                </th>
                <th className="text-center" scope="col" style={{ width: '150px' }}>
                  Status
                </th>
                <th className="text-center actionSticky" >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {employeeListData?.map((employee, idx) => (
                <tr key={employee.id}>
                  <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>

                  <td >{employee.name}</td>
                  <td >{employee.companyName}</td>
                  <td className="text-center">{employee.mobileNo}</td>
                  <td className="text-center">{employee.emailID}</td>
                  <td className="text-center">{employee.adharNumber}</td>
                  <td className="text-center">{employee.panNumber}</td>
                  <td className="text-center text-nowrap">{employee.roleTypeName}</td>
                  <td className="text-center">{employee.userName}</td>
                  {/* <td className="text-center">{employee.password}</td> */}

                  <td className="text-center">
                    {/* Show password or asterisks based on the visibility state for this row */}
                    {visiblePasswords[idx] ? employee.password : '****'}

                    {/* Eye icon to toggle visibility */}
                    <span onClick={() => togglePasswordVisibility(idx)} style={{ cursor: 'pointer', marginLeft: '10px' }}>
                      {visiblePasswords[idx] ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </td>
                  <td>
                    <Tooltip title="Reset IMEI">
                      <Link onClick={() => ResetIMEIBtnClick(employee)}>{employee.imeiNumber}</Link>
                    </Tooltip>
                  </td>
                  <td className="text-center text-nowrap">
                    <Tooltip title={employee.status === true ? 'Enable' : 'Disable'}>
                      {employee.status === true ? 'Enable' : 'Disable'}
                      <Android12Switch
                        style={{ padding: '8px' }}
                        onClick={() => handleStatusChange(employee)}
                        checked={employee.status === true}
                      />
                    </Tooltip>
                  </td>

                  <td className="text-center actionColSticky" style={{ zIndex: 4 }}>
                    <div className="d-flex gap-2">
                      {/* <Tooltip title="Assign Location">
                        <button className=" btn bg-warning bg-gradient btn-sm text-white" onClick={AssignLocation}>
                          Location
                        </button>
                      </Tooltip> */}
                      {/* <Tooltip title="Grant Permission">
                        <button
                          onClick={GrantPermission}
                          className="btn btn-danger btn-sm">
                          Permission
                        </button>
                      </Tooltip> */}
                      <Tooltip title="Update Employee">
                        {' '}
                        <button onClick={() => EmployeeUpdateEditBtnClick(employee)} className="btn btn-primary btn-sm">
                          <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                      </Tooltip>
                      {/* <Tooltip title="Block">
                        {' '}
                        <button className="btn btn-secondary btn-sm">
                          <i class="fa-solid fa-ban"></i>
                        </button>
                      </Tooltip> */}
                      <Tooltip title="View Employee">
                        {' '}
                        <button onClick={() => CustomerViewBtnClicked(employee)} className="btn-sm btn btn-primary">
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </Tooltip>
                      <Tooltip title="Reset Password">
                        {' '}
                        <button onClick={() => employeePasswordChange(employee)} className="btn-sm btn btn-primary">
                          <i class="fa-solid fa-key"></i>
                        </button>
                      </Tooltip>

                      <Tooltip title="IMEI Logs View">
                        {' '}
                        <button onClick={() => openIMEILogsView(employee)} className="btn-sm btn btn-primary">

                          <i class="fa-solid fa-barcode"></i>
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
        <div className="d-flex justify-content-end ">
          {totalCount > pageSize && (
            <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
          )}
        </div>
        {showUserRegistrationModal && (
          <UserRegistrationModal
            show={showUserRegistrationModal}
            modelRequestData={modelRequestData}
            setIsAddUpdateActionDone={setIsAddUpdateActionDone}
            onHide={() => setShowUserRegistrationModal(false)}
          />
        )}
        {showAssignLocationModal && <AssignLocationModal show={showAssignLocationModal} onHide={() => setShowAssignLocationModal(false)} />}
        {showGrantPermissionModal && (
          <GrantPermissionModal show={showGrantPermissionModal} modelRequestData={modelRequestData} onHide={() => setShowGrantPermissionModal(false)} />
        )}

        <StatusChangeModal
          open={showStatusChangeModal}
          onClose={() => setShowStatusChangeModal(false)}
          onConfirm={() => confirmStatusChange(stateChangeStatus, user)} // Pass the required arguments
        />
        <EmployeeViewModal
          show={showCustomerViewModel}
          onHide={() => setShowCustomerViewModel(false)}
          modelRequestData={modelRequestData}
        />
        {showSuccessModal && (
          <SuccessPopupModal
            show={showSuccessModal}
            onHide={() => closeAllModal()}
            setShowSuccessModal={setShowSuccessModal}
            modelAction={modelAction}
          />
        )}
        <ChangePasswordModal
          show={showChangePasswordModal}
          onHide={() => closeAllModal()}
          setShowChangePasswordModal={setShowChangePasswordModal}
          modelRequestData={modelRequestData}
        />
        <ResetIMEIModal
          show={showResetIMEIModal}
          onHide={() => setShowResetIMEIModal(false)}
          modelRequestData={modelRequestData}
          resetBtnClick={() => ResetIMEI({
            userKeyID: user.userKeyID, employeeKeyID: modelRequestData.employeeKeyID // Use latest state value
          })
          }
        />
        {showIMEILogsModal && <ViewIMEILogsModal show={showIMEILogsModal}
          onHide={() => setShowIMEILogsModal(false)}
          modelRequestData={modelRequestData}
        />}


      </div>
    </div>
  );
};

export default ViewStaffList;
