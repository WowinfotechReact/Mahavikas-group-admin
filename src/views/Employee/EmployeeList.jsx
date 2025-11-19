import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router';
import { BsPerson, BsEnvelope, BsTelephone } from "react-icons/bs";

import PaginationComponent from 'component/Pagination';
import { ConfigContext } from 'context/ConfigContext';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import NoResultFoundModel from 'component/NoResultFoundModal';
import ImageModal from 'component/ImageModal';
import Android12Switch from 'component/Android12Switch';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { Tooltip } from '@mui/material';
// import VehicleTableViewModal from './VehicleTableViewModal';
import AddUpdateEmployeeModal from './AddUpdateEmployeeModal';
import { ChangeEmployeeStatus, GetAppUserList, ResetEmployeeMACAddress } from 'services/Employee Staff/EmployeeApi';
import ResetIMEIModal from 'component/Staff/ResetIMEIModal';
import { Link } from 'react-router-dom';
import { hasPermission } from 'Middleware/permissionUtils';
import { FaUserShield, FaUsersCog, FaStore, FaCalculator, FaTools, FaUserTie } from "react-icons/fa";
import EmployeeInstituteModal from './EmployeeInstituteModal';
import ViewEmployeeModal from './ViewEmployeeModal';
import { GetAdminUserList } from 'services/Company/CompanyApi';





const EmployeeList = () => {
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [showResetIMEIModal, setShowResetIMEIModal] = useState();
  const [stateChangeStatus, setStateChangeStatus] = useState('');
  const [showVehicleViewModal, setShowVehicleViewModal] = useState(false);
  const [imgModalTitle, setImgModalTitle] = useState('');
  const [imgModalShow, setImgModalShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [totalRecords, setTotalRecords] = useState(-1);
  const { setLoader, user, companyID, permissions } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState();

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalCount, setTotalCount] = useState(null);
  const [pageSize, setPageSize] = useState(30);
  const [vehicleListData, setMachineListData] = useState();
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [apiParams, setApiParams] = useState(null); // State to store API parameters
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [showEmployeeInstituteModal, setShowEmployeeInstituteModal] = useState(false)
  const [showEmployeeViewModal, setShowEmployeeViewModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState();
  const [modelRequestData, setModelRequestData] = useState({
    adminID: null,
    machineID: null,
    machineName: null,
    data: null,
    price: null,
    Action: null
  });




  useEffect(() => {
    // debugger
    if (isAddUpdateActionDone) {
      GetAppUserListData(1, null, toDate, fromDate);
      setSearchKeyword('');
    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    GetAppUserListData(1, null, toDate, fromDate);
  }, [setIsAddUpdateActionDone]);



  const GetAppUserListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    setLoader(true);

    try {
      const data = await GetAppUserList({
        pageSize,
        userKeyID: user.userKeyID,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        companyID: companyID
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const vehicleListData = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(vehicleListData.length);
            setMachineListData(vehicleListData);
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

  const VehicleAddBtnClicked = () => {
    setModelRequestData({
      ...modelRequestData,
      userKeyIDForUpdate: null,
      userDetailsKeyID: null,
      Action: null
    });
    setShowEmployeeModal(true);
  };
  const editEmp = (value) => {

    setModelRequestData({
      ...modelRequestData,
      userKeyIDForUpdate: value.userKeyIDForUpdate,
      userDetailsKeyID: value.userDetailsKeyID,
      Action: 'Update'
    });
    setShowEmployeeModal(true);
  };
  const VehicleEditBtnClicked = (value) => {
    setModelRequestData({
      ...modelRequestData,
      userKeyIDForUpdate: value.userKeyIDForUpdate,
      Action: 'Update'
    });
    setShowEmployeeModal(true);
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
    setCurrentPage(1);
    GetAppUserListData(1, capitalizedValue, toDate, fromDate);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetAppUserListData(pageNumber, null, toDate, fromDate);
  };

  const closeAll = () => {
    setShowSuccessModal(false);
  };

  const handleClearDates = () => {
    setCurrentPage(1);
    setToDate(null);
    setFromDate(null);
    GetAppUserListData(1, null, null, null);
  };

  const handleStatusChange = (row) => {
    setStateChangeStatus(row); // You can set only relevant data if needed
    setShowStatusChangeModal(true);
  };
  const closeAllModal = () => {
    // onHide();
    setShowResetIMEIModal(false)
    setShowSuccessModal(false);

  };
  const viewEmpDetails = (value) => {
    setModelRequestData({
      ...modelRequestData,
      data: value,
      Action: 'Update'
    })

    setShowEmployeeViewModal(true)
  }
  const confirmStatusChange = async (row, user) => {
    setLoader(true);

    // debugger
    try {
      const { userKeyIDForUpdate } = row; // Destructure to access only what's needed
      const response = await ChangeEmployeeStatus(userKeyIDForUpdate, user.userKeyID);

      if (response && response.data.statusCode === 200) {
        setLoader(false);

        // Successfully changed the status
        setShowStatusChangeModal(false);
        setStateChangeStatus(null);
        GetAppUserListData(currentPage, null, toDate, fromDate);
        // GetMasterDistrictListData(currentPage, null, toDate, fromDate);
        setShowSuccessModal(true);
        setModelAction('Employee status changed successfully.');
      } else {
        setLoader(false);
        console.error(response?.data?.errorMessage);
        setShowSuccessModal(true);
        setModelAction('Failed to change Employee status.');
      }
    } catch (error) {
      setLoader(false);
      console.error('Error changing Employee status:', error);
      setShowSuccessModal(true);
      setModelAction('An error occurred while changing the Employee status.');
    }
  };

  // Utility function to format the vehicle number
  const formatVehicleNumber = (vehicleNumber) => {
    if (!vehicleNumber) return ''; // Handle empty or undefined values

    // Remove invalid characters and ensure uppercase
    const sanitizedInput = vehicleNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Split into parts and format
    const parts = [
      sanitizedInput.slice(0, 2), // State code (2 letters)
      sanitizedInput.slice(2, 4), // RTO code (2 digits)
      sanitizedInput.slice(4, 6), // Series code (2 letters)
      sanitizedInput.slice(6, 10) // Employee number (4 digits)
    ];

    // Join parts with spaces
    return parts.filter((part) => part).join(' ');
  };

  const VehicleViewBtnClicked = async (row) => {
    setModelRequestData({
      ...modelRequestData,
      userKeyIDForUpdate: row.userKeyIDForUpdate
    });
    setShowVehicleViewModal(true);
  };

  const [showPassword, setShowPassword] = useState({});

  const togglePassword = (index) => {
    setShowPassword((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  const exportToExcel = () => {
    if (!vehicleListData || vehicleListData.length === 0) {
      alert('No data to export');
      return;
    }

    // 1. Define key-to-label mapping
    const labelMapping = {
      firstName: 'First Name',
      lastName: 'Last Name',
      designation: 'Designation',
      empCode: 'Employee Code',
      dateOfJoining: 'Date of Joining',
      dateOfBirth: 'Date of Birth',
      mobileNumber: 'Mobile Number',
      alternativeNumber: 'Alternative Number',
      emailID: 'Email ID',
      bloodGroup: 'Blood Group',
      aadhaarNumber: 'Aadhaar Number',
      panNumber: 'PAN Number',
      employeeType: 'Employee Type',
      password: 'Password',
      address: 'Address'
    };

    // 2. Transform data: remove unwanted keys & rename headers
    const transformedData = vehicleListData.map((item) => {
      const newItem = {};
      Object.keys(labelMapping).forEach((key) => {
        newItem[labelMapping[key]] = item[key]; // Set new label as key
      });
      return newItem;
    });

    // 3. Convert to worksheet
    const worksheet = XLSX.utils.json_to_sheet(transformedData);

    // 4. Auto column width
    const columnWidths = Object.values(labelMapping).map((label) => {
      const maxWidth = Math.max(
        label.length,
        ...transformedData.map((row) => (row[label] ? row[label].toString().length : 0))
      );
      return { wch: maxWidth + 2 }; // +2 padding
    });
    worksheet['!cols'] = columnWidths;

    // 5. Create workbook & export
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee List');
    XLSX.writeFile(workbook, 'EmployeeList.xlsx');
  };


  const togglePasswordVisibility = (idx) => {
    setVisiblePasswords((prevState) => ({
      ...prevState,
      [idx]: !prevState[idx] // Toggle the visibility for this specific idx
    }));
  };
  const ResetIMEIBtnClick = (value) => {
    setModelRequestData((prev) => ({
      ...prev,
      userKeyIDForUpdate: value.userKeyIDForUpdate,
      resetType: 'MACAddress',
      userKeyID: user.userKeyID
    }));
    const apiParam = {
      userKeyIDForUpdate: value.userKeyIDForUpdate,
      resetType: 'MACAddress',
      userKeyID: user.userKeyID
    }

    setShowResetIMEIModal(true); // Show modal after setting state
  };



  const addInstitute = (row) => {
    navigate('/', { state: { instituteKeyID: row.instituteKeyID, instituteName: row.instituteName } })
  }




  const [expandedLead, setExpandedLead] = useState(null);
  const toggleExpand = (userKeyIDForUpdate) => {
    setExpandedLead((prev) => (prev === userKeyIDForUpdate ? null : userKeyIDForUpdate));
  };



  const AssignedInstituteBtn = () => {

    setShowEmployeeInstituteModal(true)
  }
  return (
    <>
      <div className="card w-full max-w-[50vh] mx-auto h-auto">
        <div className="card-body p-2 bg-white shadow-md rounded-lg">
          {/* Top controls */}
          <div className="d-flex justify-content-between align-items-center mb-1">
            <div className="flex-grow-1 ">
              <h5 className="mb-0">Employee Master</h5>
            </div>
            <div className="position-absolute end-0 me-2">
              <button onClick={() => VehicleAddBtnClicked()} className="btn btn-success btn-sm d-inline d-sm-none">
                <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                <span className="d-inline d-sm-none"> Add</span>
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search Employee"
              style={{ maxWidth: '350px' }}
              value={searchKeyword}
              onChange={(e) => {
                handleSearch(e);
              }}
            />
            <div className="d-flex align-items-center ms-2 gap-2 mt-2 mt-sm-0">
              <Tooltip title="Export">
                <button onClick={exportToExcel} className="btn btn-warning btn-sm d-none d-sm-inline" style={{ marginRight: '2px' }}>
                  <i className="fa-solid fa-file-export" style={{ fontSize: '11px' }}></i>
                  {" "}  <span className="d-none d-sm-inline">Export</span>
                </button>
              </Tooltip>
              <Tooltip title="Add Employee">
                <button onClick={() => VehicleAddBtnClicked()} style={{ background: '#ffaa33', color: 'white' }} className="btn  btn-sm d-none d-sm-inline ">
                  <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>{" "}
                  <span className="d-none d-sm-inline">Add</span>
                </button>
              </Tooltip>


            </div>
          </div>

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped table-hover">
              <thead style={{ position: 'sticky', top: -1, zIndex: 1, backgroundColor: '#ff7d34', color: '#fff' }}>
                <tr className="text-nowrap">
                  <th className="text-center">Sr.No.</th>
                  <th className="text-center">Employee Info</th>







                  <th className="text-center">Address</th>
                  <th className="text-center">Company Name</th>
                  <th className="text-center actionSticky">Action</th>
                </tr>
              </thead>
              <tbody>
                {vehicleListData?.map((value, idx) => (
                  <tr className="tableBodyTd text-nowrap" key={idx}>
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>












                    <td className="text-center">
                      <div className="d-flex flex-column align-items-center">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <BsPerson className="text-primary" />
                          <span>{value.fullName || "N/A"}</span>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          <BsTelephone className="text-success" />
                          <span>{value.mobileNo || "N/A"}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <BsEnvelope className="text-danger" />
                          <span>{value.emailID || "N/A"}</span>
                        </div>
                      </div>
                    </td>
                    <td className='text-center'>
                      {value.address?.length > 30 ? (
                        <Tooltip title={value.address}>{`${value.address?.substring(0, 30)}...`}</Tooltip>
                      ) : (
                        <>{value.address}</>
                      )}

                    </td>

                    <td className='text-center'>
                      {value.companyName}
                    </td>




                    <td className="text-center relative  actionColSticky " style={{ zIndex: 4 }}>


                      <div className="">

                        <Tooltip title="Under Development">

                          {/* <Tooltip title=" Assigned Institute"> */}
                          {/* <button
                            style={{
                              padding: '4px 8px', // Adjust padding for smaller size
                              fontSize: '12px', // Optional: smaller font size
                              // height: '28px', // Set height
                              // width: '28px', // Set width,
                              background: '#ffaa33', color: 'white'
                            }}
                            // onClick={() => AssignedInstituteBtn()}
                            type="button"

                            className="btn-sm btn me-2"
                          >
                            Assigned Institute

                          </button> */}
                        </Tooltip>


                        <Tooltip title="Update Employee">
                          {/* <Tooltip title="Under Development"> */}
                          <button
                            style={{
                              padding: '4px 8px', // Adjust padding for smaller size
                              fontSize: '12px', // Optional: smaller font size
                              height: '28px', // Set height
                              width: '28px', // Set width,
                              background: '#ffaa33', color: 'white'
                            }}
                            onClick={() => editEmp(value)}
                            type="button"

                            className="btn-sm btn me-2"
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                        </Tooltip>

                        {/* <Tooltip title="View Employee"> */}
                        <Tooltip title="Under Dev">
                          <button
                            style={{
                              padding: '4px 8px', // Adjust padding for smaller size
                              fontSize: '12px', // Optional: smaller font size
                              height: '28px', // Set height
                              width: '48px', // Set width,
                              background: '#ffaa33', color: 'white'
                            }}
                            onClick={() => viewEmpDetails(value)}
                            type="button"

                            className="btn-sm btn me-2"
                          >
                            View                            </button>
                        </Tooltip>


                      </div>



                    </td>
                  </tr>
                ))}

                {/* Add more static rows as needed */}
              </tbody>
            </table>
            {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-end ">

          </div>
        </div>
      </div>


      {showEmployeeModal && (
        <AddUpdateEmployeeModal
          show={showEmployeeModal}
          onHide={() => {
            setShowEmployeeModal(false);
            // handleClose();
          }}
          modelRequestData={modelRequestData}
          setModelRequestData={setModelRequestData}
          isAddUpdateActionDone={isAddUpdateActionDone}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}



        />
      )}
      <StatusChangeModal
        open={showStatusChangeModal}
        onClose={() => setShowStatusChangeModal(false)}
        onConfirm={() => confirmStatusChange(stateChangeStatus, user)} // Pass the required arguments
      />
      {showSuccessModal && (
        <SuccessPopupModal
          show={showSuccessModal}
          onHide={() => closeAllModal()}
          setShowSuccessModal={setShowSuccessModal}
          modelAction={modelAction}
        />
      )}

      {showEmployeeInstituteModal && (
        <EmployeeInstituteModal
          show={showEmployeeInstituteModal}
          onHide={() => setShowEmployeeInstituteModal(false)}
          modelRequestData={modelRequestData}
          setModelRequestData={setModelRequestData}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        />
      )}
      {showEmployeeViewModal && (
        <ViewEmployeeModal
          show={showEmployeeViewModal}
          onHide={() => setShowEmployeeViewModal(false)}
          modelRequestData={modelRequestData}
          setModelRequestData={setModelRequestData}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        />
      )}
      <ImageModal show={imgModalShow} onHide={() => setImgModalShow(false)} imageUrl={selectedImage} title={imgModalTitle} />
    </>
  );
};

export default EmployeeList;
