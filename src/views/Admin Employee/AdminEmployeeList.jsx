
import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router';
import PaginationComponent from 'component/Pagination';
import { ConfigContext } from 'context/ConfigContext';
import { BsPerson, BsEnvelope, BsTelephone } from "react-icons/bs";
import NoResultFoundModel from 'component/NoResultFoundModal';
import ImageModal from 'component/ImageModal';
import Android12Switch from 'component/Android12Switch';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { Tooltip } from '@mui/material';
import { ChangeCustomerStatus } from 'services/CustomerStaff/CustomerStaffApi';
import { hasPermission } from 'Middleware/permissionUtils';
import { Link } from 'react-router-dom';
import InstituteUserAddUpdateModal from 'views/Employee/InstituteUserAddUpdateModal';
import { GetInstituteList } from 'services/Institute/InstituteApi';
import AdminEmployeeAddUpdateModal from './AdminEmployeeAddUpdateModal';
import { GetAppUserList } from 'services/Employee Staff/EmployeeApi';
import { GetAdminUserList } from 'services/Company/CompanyApi';

const AdminEmployeeList = () => {
      const [stateChangeStatus, setStateChangeStatus] = useState('');
      const [openCustomerViewModal, setOpenCustomerViewModal] = useState(false);
      const [showInstituteUserModal, setShowInstituteUserModal
      ] = useState(false);
      const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");
      const fullText = "Search By Name / Ph No. / Mail IDD";
      let index = 0;
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
      const [showVehicleModal, setShowVehicleModal] = useState(false);
      const [show, setShow] = useState(false);
      const handleShow = () => setShow(true);
      const handleClose = () => setShow(false);
      const [visiblePasswordIndex, setVisiblePasswordIndex] = useState(null);
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

      const GetAppUserListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
            // debugger
            setLoader(true);
            try {
                  const data = await GetAdminUserList({
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

      const customerViewModalBtnClick = (row) => {
            setModelRequestData({
                  ...modelRequestData,
                  userKeyIDForUpdate: row.userKeyIDForUpdate,
                  Action: 'View'
            });
            setOpenCustomerViewModal(true);
      };

      const CustomerAddBtnClicked = () => {
            setModelRequestData({
                  ...modelRequestData,
                  userKeyIDForUpdate: null,
                  Action: null
            });
            setShowVehicleModal(true);
      };
      const EditCustomerBtnClick = (row) => {
            setModelRequestData({
                  ...modelRequestData,
                  userKeyIDForUpdate: row.userKeyIDForUpdate,
                  Action: 'Update'
            });
            setShowVehicleModal(true);
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
            setShowSuccessModal(false);
      };

      const confirmStatusChange = async (row, user) => {
            setLoader(true);

            // debugger
            try {
                  const { userKeyIDForUpdate } = row; // Destructure to access only what's needed
                  const response = await ChangeCustomerStatus(userKeyIDForUpdate, user.userKeyID);

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
                  vehicleKeyID: row.vehicleKeyID
            });
            setShowVehicleViewModal(true);
      };

      const newDataMap = [
            { name: 'Kilbil School Satpur', project: 'Primary Teacher Bharti 2025', state: 'MH', Dis: 'Nashik', Taluka: 'Nashik' },
            { name: 'Kilbil School Gangapur Road', project: 'Secondary & Higher Secondary Teacher Bharti 2025', state: 'MH', Dis: 'Pune', Taluka: 'Shivaji Nagar' },
            { name: 'Kilbil School Trimbkeshwar', project: 'Primary Teacher Bharti 2025', state: 'MH', Dis: 'Hingoli', Taluka: 'airoli' },
      ]
      return (
            <>
                  {/* <Sidebar drawerOpen={true} drawerToggle={() => {}} modalOpen={show} /> */}
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
                                    <div className="flex-grow-1">
                                          <h5 className="mb-0">Admin Employee</h5>
                                    </div>
                                    <div className="position-absolute end-0 me-2">
                                          <button onClick={() => CustomerAddBtnClicked()} style={{ background: '#ffaa33', color: 'white' }} className="btn btn-sm d-inline d-sm-none">
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
                                    {/* <div className="d-flex align-items-center ms-2 gap-2 mt-2 mt-sm-0">
              <Tooltip title="Add Admin Employee">
                <button onClick={() => CustomerAddBtnClicked()} className="btn btn-primary btn-sm d-none d-sm-inline">
                  <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i> <span className="d-none d-sm-inline">Add</span>
                </button>
              </Tooltip>
            </div> */}

                                    <div className="d-flex align-items-center ms-2 gap-2 mt-2 mt-sm-0">
                                          <Tooltip title="Add Admin Employee" >
                                                <button onClick={() => CustomerAddBtnClicked()} style={{ background: '#ffaa33', color: 'white' }} className="btn  btn-sm d-none d-sm-inline">
                                                      <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                                                      <span className="d-none d-sm-inline">Add</span>
                                                </button>
                                          </Tooltip>


                                          {/* <Tooltip title="Export">
                <button className="btn btn-warning btn-sm d-none d-sm-inline" style={{ marginRight: '2px' }}>
                  <i className="fa-solid fa-file-export" style={{ fontSize: '11px' }}></i>
                  <span className="d-none d-sm-inline">Export</span>
                </button>
              </Tooltip> */}
                                    </div>
                              </div>

                              {/* Table */}
                              <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
                                    <table className="table table-bordered table-striped">
                                          <thead className="table-gradient-orange" style={{ position: "sticky", top: -1, zIndex: 1, animation: "fadeIn 0.6s ease" }}>
                                                <tr className="text-nowrap">
                                                      <th className="text-center">Sr No.</th>
                                                      <th className="text-center"> Employee Info</th>

                                                      {/* <th className="text-center">Address </th> */}
                                                      <th className="text-center">Role  </th>
                                                      <th className="text-center">Password  </th>
                                                      <th className="text-center actionSticky ">Action</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                {vehicleListData?.map((row, idx) => (
                                                      <tr className='text-nowrap' key={idx}>
                                                            <td className="text-center">
                                                                  <span className="index-badge">
                                                                        {(currentPage - 1) * pageSize + idx + 1}
                                                                  </span>
                                                            </td>

                                                            <td className="text-center">
                                                                  <div className="d-flex flex-column align-items-center">
                                                                        <div className="d-flex align-items-center gap-2 mb-1">
                                                                              <BsPerson className="text-primary" />
                                                                              <span>{row.fullName || "N/A"}</span>
                                                                        </div>

                                                                        <div className="d-flex align-items-center gap-2">
                                                                              <BsTelephone className="text-success" />
                                                                              <span>{row.mobileNo || "N/A"}</span>
                                                                        </div>
                                                                        <div className="d-flex align-items-center gap-2 mb-1">
                                                                              <BsEnvelope className="text-danger" />
                                                                              <span>{row.emailID || "N/A"}</span>
                                                                        </div>
                                                                        <div className="d-flex align-items-center gap-2 mb-1">
                                                                              {row.address?.length > 30 ? (
                                                                                    <Tooltip title={row.address}>
                                                                                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                                                                                <i className="fa-solid fa-location-dot" style={{ color: "#d94e4e" }}></i>
                                                                                                {`${row.address?.substring(0, 30)}...`}
                                                                                          </span>
                                                                                    </Tooltip>
                                                                              ) : (
                                                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                                                                          <i className="fa-solid fa-location-dot" style={{ color: "#d94e4e" }}></i>
                                                                                          {row.address}
                                                                                    </span>
                                                                              )}
                                                                        </div>


                                                                  </div>
                                                            </td>



                                                            <td className="text-center">
                                                                  <span
                                                                        className={`role-badge ${row.roleName === "Admin"
                                                                              ? "role-admin"
                                                                              : row.roleName === "Institute"
                                                                                    ? "role-institute"
                                                                                    : "role-superadmin"
                                                                              }`}
                                                                  >
                                                                        {row.roleName === "Admin" && (
                                                                              <i className="fa-solid fa-user-shield role-icon"></i>
                                                                        )}

                                                                        {row.roleName === "Institute" && (
                                                                              <i className="fa-solid fa-building-columns role-icon"></i>
                                                                        )}

                                                                        {row.roleName === "Super Admin" && (
                                                                              <i className="fa-solid fa-star role-icon"></i>
                                                                        )}

                                                                        {row.roleName}
                                                                  </span>
                                                            </td>

                                                            <td className="text-center" style={{ minWidth: "150px" }}>
                                                                  {row.passWord !== null &&
                                                                        <div className="d-flex justify-content-center align-items-center gap-2">

                                                                              {/* Masked or Full Password */}
                                                                              <span>
                                                                                    {visiblePasswordIndex === idx ? row.passWord : "****"}
                                                                              </span>

                                                                              {/* Eye / Eye Slash */}
                                                                              <i
                                                                                    className={`fa-solid ${visiblePasswordIndex === idx ? "fa-eye-slash" : "fa-eye"
                                                                                          }`}
                                                                                    style={{ cursor: "pointer" }}
                                                                                    onClick={() =>
                                                                                          setVisiblePasswordIndex(
                                                                                                visiblePasswordIndex === idx ? null : idx
                                                                                          )
                                                                                    }
                                                                              ></i>

                                                                        </div>
                                                                  }
                                                            </td>










                                                            {/* <td className="text-center">{row.createdOnDate ? dayjs(row.createdOnDate).format('DD/MM/YYYY') : '-'}</td> */}
                                                            <td className="text-center relative  actionColSticky " style={{ zIndex: 4 }}>


                                                                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                                                        <Tooltip title="Update Admin Employee">
                                                                              <button
                                                                                    style={{
                                                                                          padding: '4px 8px',
                                                                                          fontSize: '12px',
                                                                                          height: '28px',
                                                                                          width: '28px', background: '#ffaa33', color: 'white'
                                                                                    }}
                                                                                    onClick={() => EditCustomerBtnClick(row)}
                                                                                    type="button"
                                                                                    className="btn-sm btn "
                                                                              >
                                                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                                              </button>
                                                                        </Tooltip>





                                                                  </div>
                                                            </td>
                                                      </tr>
                                                ))}
                                          </tbody>
                                    </table>
                                    {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                              </div>

                              {/* Pagination */}
                              <div className="d-flex justify-content-end ">
                                    {totalCount > pageSize && (
                                          <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
                                    )}
                              </div>
                        </div>
                  </div >

                  {showVehicleModal && (
                        <AdminEmployeeAddUpdateModal
                              show={showVehicleModal}
                              onHide={() => {
                                    setShowVehicleModal(false);
                                    handleClose();
                              }}
                              modelRequestData={modelRequestData}
                              setModelRequestData={setModelRequestData}

                              isAddUpdateActionDone={isAddUpdateActionDone}
                              setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                        />
                  )
                  }
                  <StatusChangeModal
                        open={showStatusChangeModal}
                        onClose={() => setShowStatusChangeModal(false)}
                        onConfirm={() => confirmStatusChange(stateChangeStatus, user)} // Pass the required arguments
                  />
                  {
                        showSuccessModal && (
                              <SuccessPopupModal
                                    show={showSuccessModal}
                                    onHide={() => closeAllModal()}
                                    setShowSuccessModal={setShowSuccessModal}
                                    modelAction={modelAction}
                              />
                        )
                  }

                  {
                        showInstituteUserModal && (
                              <InstituteUserAddUpdateModal
                                    show={showInstituteUserModal}
                                    onHide={() => setShowInstituteUserModal(false)}
                                    modelRequestData={modelRequestData}
                              />
                        )
                  }
                  <ImageModal show={imgModalShow} onHide={() => setImgModalShow(false)} imageUrl={selectedImage} title={imgModalTitle} />
            </>
      );
};

export default AdminEmployeeList;
