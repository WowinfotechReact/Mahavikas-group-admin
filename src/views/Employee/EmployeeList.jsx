import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router';
import { BsPerson, BsEnvelope, BsTelephone } from "react-icons/bs";
import { FaMapMarkerAlt, FaCity, FaRoute } from "react-icons/fa";
import { FaProjectDiagram } from "react-icons/fa"
import PaginationComponent from 'component/Pagination';
import { ConfigContext } from 'context/ConfigContext';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import NoResultFoundModel from 'component/NoResultFoundModal';
import ImageModal from 'component/ImageModal';
import Android12Switch from 'component/Android12Switch';
import { FaEye, FaEyeSlash } from "react-icons/fa";

import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { Tooltip } from '@mui/material';
// import VehicleTableViewModal from './VehicleTableViewModal';
import AddUpdateEmployeeModal from './AddUpdateEmployeeModal';
import { ChangeEmployeeStatus, GetAppUserList, } from 'services/Employee Staff/EmployeeApi';
import ResetIMEIModal from 'component/Staff/ResetIMEIModal';
import { Link } from 'react-router-dom';
import { hasPermission } from 'Middleware/permissionUtils';
import { FaUserShield, FaUsersCog, FaStore, FaCalculator, FaTools, FaUserTie } from "react-icons/fa";
import EmployeeInstituteModal from './EmployeeInstituteModal';
import ViewEmployeeModal from './ViewEmployeeModal';
import { GetAdminUserList } from 'services/Company/CompanyApi';
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import ProjectPermissionModal from './ProjectPermissionModal';





const EmployeeList = () => {
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");
  const fullText = "Search By Name / Ph No. / Mail ID ";
  let index = 0;
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
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [showEmployeeInstituteModal, setShowEmployeeInstituteModal] = useState(false)
  const [showEmployeeViewModal, setShowEmployeeViewModal] = useState(false)
  const [showProjectPermissionModal, setShowProjectPermissionModal] = useState(false)
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
    const interval = setInterval(() => {
      setAnimatedPlaceholder(fullText.slice(0, index));
      index++;

      if (index > fullText.length) {
        index = 0;
        setAnimatedPlaceholder(""); // Restart effect
      }
    }, 180);

    return () => clearInterval(interval);
  }, []);



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

  const handleStatusChange = (value) => {
    setStateChangeStatus(value);
    setShowStatusChangeModal(true);
  };

  const GetAppUserListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    setLoader(true);

    try {
      const data = await GetAppUserList({
        pageSize,
        // userKeyID: user.userKeyID,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        companyID: Number(companyID),
        appUserTypeID: 1
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
  const assignProjectBtnClick = (value) => {

    setModelRequestData({
      ...modelRequestData,
      userKeyIDForUpdate: value.userKeyIDForUpdate,
      userDetailsKeyID: value.userDetailsKeyID,
      Action: 'Update'
    });
    setShowProjectPermissionModal(true);
  };

  const [visibleIndex, setVisibleIndex] = useState(null);


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
  const confirmStatusChange = async (value, user) => {
    setLoader(true);

    // debugger
    try {
      const { userKeyIDForUpdate } = value; // Destructure to access only what's needed
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


  return (
    <>
      <div className="card w-full max-w-[50vh] mx-auto h-auto">
        <div className="card-body p-2 bg-white shadow-md rounded-lg">
          {/* Top controls */}
          <div className="d-flex justify-content-between align-items-center mb-1">
            <button
              // className="btn btn-light p-1 me-2"
              className="btn btn-outline-secondary btn-sm me-2"

              // style={{ borderRadius: "50%", width: "36px", height: "36px" }}
              onClick={() => navigate(-1)}
            >
              <i className="fa-solid fa-arrow-left"></i>

            </button>
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
              placeholder={animatedPlaceholder}

              style={{ maxWidth: '350px' }}
              value={searchKeyword}
              onChange={(e) => {
                handleSearch(e);
              }}
            />
            <div className="d-flex align-items-center ms-2 gap-2 mt-2 mt-sm-0">
              {/* <Tooltip title="Export">
                <button onClick={exportToExcel} className="btn btn-warning btn-sm d-none d-sm-inline" style={{ marginRight: '2px' }}>
                  <i className="fa-solid fa-file-export" style={{ fontSize: '11px' }}></i>
                  {" "}  <span className="d-none d-sm-inline">Export</span>
                </button>
              </Tooltip> */}
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
              <thead className="table-gradient-orange" style={{ position: 'sticky', top: 0, zIndex: 10, color: '#fff' }}>

                {/* <thead style={{ position: 'sticky', top: -1, zIndex: 1, backgroundColor: '#ff7d34',  }}> */}
                <tr className="text-nowrap">
                  <th className="text-center">Sr.No.</th>
                  <th className="text-center">Employee Info</th>







                  <th className="text-center">Address</th>
                  <th className="text-center">Geo Info</th>
                  <th className="text-center">Project</th>
                  {/* <th className="text-center">Attendance Authority</th> */}
                  <th className="text-center">Password</th>
                  <th className="text-center">Status</th>
                  <th className="text-center actionSticky  " >Action</th>
                </tr>
              </thead>
              <tbody>
                {vehicleListData?.map((value, idx) => (
                  <tr className="tableBodyTd text-nowrap" key={idx}>
                    <td className="text-center">
                      <span className="index-badge">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </span>
                    </td>













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
                    <td className="text-center">
                      {value.address?.length > 30 ? (
                        <Tooltip title={value.address}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <i className="fa-solid fa-location-dot" style={{ color: "#d94e4e" }}></i>
                            {`${value.address?.substring(0, 30)}...`}
                          </span>
                        </Tooltip>
                      ) : (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <i className="fa-solid fa-location-dot" style={{ color: "#d94e4e" }}></i>
                          {value.address}
                        </span>
                      )}
                    </td>
                    <td style={{ minWidth: "180px" }}>
                      <div className="d-flex flex-column gap-1">

                        {/* Zone */}
                        <div className="d-flex align-items-center fade-in">
                          <FaMapMarkerAlt className="me-2 text-primary" />
                          <div>
                            <small className="text-muted d-block">Zone</small>
                            <span>{value.zoneNames || "-"}</span>
                          </div>
                        </div>

                        {/* District */}
                        <div className="d-flex align-items-center fade-in delay-1">
                          <FaCity className="me-2 text-success" />
                          <div>
                            <small className="text-muted d-block">District</small>
                            <span>

                              {value.districtNames
                                ?.split(",")
                                .map((proj, i) => {
                                  const name = proj.trim();

                                  return (
                                    <div key={i} className="d-flex align-items-center project-row fade-in">
                                      {/* <FaProjectDiagram className="me-2 text-primary icon-pop" /> */}

                                      {name.length > 25 ? (
                                        <Tooltip title={name}>
                                          {name.substring(0, 25)}...
                                        </Tooltip>
                                      ) : (
                                        name
                                      )}
                                    </div>
                                  );
                                })}
                            </span>
                          </div>
                        </div>

                        {/* Taluka */}
                        <div className="d-flex align-items-center fade-in delay-2">
                          <FaRoute className="me-2 text-warning" />
                          <div>
                            <small className="text-muted d-block">Taluka</small>
                            <span>

                              {value.talukaNames
                                ?.split(",")
                                .map((proj, i) => {
                                  const name = proj.trim();

                                  return (
                                    <div key={i} className="d-flex align-items-center project-row fade-in">
                                      {/* <FaProjectDiagram className="me-2 text-primary icon-pop" /> */}

                                      {name.length > 25 ? (
                                        <Tooltip title={name}>
                                          {name.substring(0, 25)}...
                                        </Tooltip>
                                      ) : (
                                        name
                                      )}
                                    </div>
                                  );
                                })}
                            </span>


                          </div>
                        </div>

                      </div>
                    </td>

                    <td className="text-start">
                      {value.projectNames
                        ?.split(",")
                        .map((proj, i) => {
                          const name = proj.trim();

                          return (
                            <div key={i} className="d-flex align-items-center project-row fade-in">
                              <FaProjectDiagram className="me-2 text-primary icon-pop" />

                              {name.length > 25 ? (
                                <Tooltip title={name}>
                                  {name.substring(0, 25)}...
                                </Tooltip>
                              ) : (
                                name
                              )}
                            </div>
                          );
                        })}
                    </td>
                    {/* <td className="text-center">
                      {value.canUpdateAttendance ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "3px 8px",
                            borderRadius: "12px",
                            backgroundColor: "#e6f4ea",
                            color: "#1e7d34",
                            fontWeight: "500",
                            fontSize: "0.85rem"
                          }}
                        >
                          <FaCheckCircle size={14} className="me-1" />
                          Yes
                        </span>
                      ) : (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "3px 8px",
                            borderRadius: "12px",
                            backgroundColor: "#fdecea",
                            color: "#c62828",
                            fontWeight: "500",
                            fontSize: "0.85rem"
                          }}
                        >
                          <FaTimesCircle size={14} className="me-1" />
                          No
                        </span>
                      )}
                    </td> */}

                    <td>
                      <div className="d-flex align-items-center">
                        {/* Password text */}
                        <span className="me-2">
                          {visibleIndex === idx ? value.password : "••••••"}
                        </span>
                        {/* Eye Toggle Icon */}
                        <span
                          role="button"
                          onClick={() =>
                            setVisibleIndex(visibleIndex === idx ? null : idx)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          {visibleIndex === idx ? (
                            <FaEyeSlash size={16} />
                          ) : (
                            <FaEye size={16} />
                          )}
                        </span>

                      </div>
                    </td>


                    <td className="text-center">
                      {value.status === 'Active' ? 'Active' : 'In-Active'}
                      <Android12Switch style={{ padding: '8px' }}
                        onClick={() => handleStatusChange(value)} checked={value.status === 'Active'} />


                    </td>





                    <td className="text-center relative  actionColSticky  " style={{ zIndex: 4 }}>


                      <div className="">




                        <Tooltip title="Assign Project">
                          {/* <Tooltip title="Under Development"> */}
                          <button
                            style={{
                              padding: '4px 8px', // Adjust padding for smaller size
                              fontSize: '12px', // Optional: smaller font size
                              height: '28px', // Set height
                              // width: '28px', // Set width,
                              background: '#ffaa33', color: 'white'
                            }}
                            onClick={() => assignProjectBtnClick(value)}
                            type="button"

                            className="btn-sm btn me-2"
                          >
                            Assign Project
                          </button>
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
                        <Tooltip title="View Employee Details">
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
      {showProjectPermissionModal && (
        <ProjectPermissionModal
          show={showProjectPermissionModal}
          onHide={() => setShowProjectPermissionModal(false)}
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
