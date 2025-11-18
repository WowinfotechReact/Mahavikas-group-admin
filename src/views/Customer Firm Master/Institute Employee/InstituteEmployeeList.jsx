
import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation, useNavigate } from 'react-router';
import PaginationComponent from 'component/Pagination';
import { ConfigContext } from 'context/ConfigContext';
import { BsPerson, BsEnvelope, BsTelephone } from "react-icons/bs";
import NoResultFoundModel from 'component/NoResultFoundModal';
import ImageModal from 'component/ImageModal';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { Tooltip } from '@mui/material';
import { ChangeCustomerStatus, GetCustomerList } from 'services/CustomerStaff/CustomerStaffApi';
import InstituteUserAddUpdateModal from 'views/Employee/InstituteUserAddUpdateModal';
import InstituteEmployeeAddUpdateModal from './InstituteEmployeeAddUpdateModal';
import { GetInstituteList } from 'services/Institute/InstituteApi';
import { GetAppUserList } from 'services/Employee Staff/EmployeeApi';

const InstituteEmployeeList = () => {
      const [stateChangeStatus, setStateChangeStatus] = useState('');
      const [showInstituteUserModal, setShowInstituteUserModal
      ] = useState(false);
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
            // debugger
            if (isAddUpdateActionDone) {
                  GetInstituteListData(1, null, toDate, fromDate);
                  setSearchKeyword('');
            }
            setIsAddUpdateActionDone(false);
      }, [isAddUpdateActionDone]);

      useEffect(() => {
            GetInstituteListData(1, null, toDate, fromDate);
      }, [setIsAddUpdateActionDone]);
      const location = useLocation()
      const GetInstituteListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
            // debugger
            setLoader(true);
            try {
                  const data = await GetAppUserList({
                        pageSize,
                        userKeyID: user.userKeyID,
                        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
                        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
                        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
                        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                        instituteKeyID: location.state.instituteKeyID,
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



      const CustomerAddBtnClicked = () => {
            setModelRequestData({
                  ...modelRequestData,
                  instituteKeyID: location?.state?.instituteKeyID,
                  Action: null
            });
            setShowVehicleModal(true);
      };
      const EditCustomerBtnClick = (row) => {
            setModelRequestData({
                  ...modelRequestData,
                  customerKeyID: row.customerKeyID,
                  instituteKeyID: location?.state?.instituteKeyID,
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
            GetInstituteListData(1, capitalizedValue, toDate, fromDate);
      };


      const closeAllModal = () => {
            // onHide();
            setShowSuccessModal(false);
      };

      const confirmStatusChange = async (row, user) => {
            setLoader(true);

            // debugger
            try {
                  const { customerKeyID } = row; // Destructure to access only what's needed
                  const response = await ChangeCustomerStatus(customerKeyID, user.userKeyID);

                  if (response && response.data.statusCode === 200) {
                        setLoader(false);

                        // Successfully changed the status
                        setShowStatusChangeModal(false);
                        setStateChangeStatus(null);
                        GetInstituteListData(currentPage, null, toDate, fromDate);
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
                  {/* <Sidebar drawerOpen={true} drawerToggle={() => {}} modalOpen={show} /> */}
                  <div className="card w-full max-w-[50vh] mx-auto h-auto">
                        <div className="card-body p-2 bg-white shadow-md rounded-lg">
                              {/* Top controls */}

                              <div className="d-flex justify-content-between align-items-center mb-1">
                                    <div className="flex-grow-1">
                                          <h5 className="mb-0">Employee Institute : {location.state.instituteName} </h5>
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
                                          placeholder="Search Institute"
                                          style={{ maxWidth: '350px' }}
                                          value={searchKeyword}
                                          onChange={(e) => {
                                                handleSearch(e);
                                          }}
                                    />
                                    {/* <div className="d-flex align-items-center ms-2 gap-2 mt-2 mt-sm-0">
              <Tooltip title="Add Customer / Firm">
                <button onClick={() => CustomerAddBtnClicked()} className="btn btn-primary btn-sm d-none d-sm-inline">
                  <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i> <span className="d-none d-sm-inline">Add</span>
                </button>
              </Tooltip>
            </div> */}

                                    <div className="d-flex align-items-center ms-2 gap-2 mt-2 mt-sm-0">
                                          <Tooltip title="Add Customer / Firm" >
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
                                          <thead style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                                                <tr className="text-nowrap">
                                                      <th className="text-center">Sr No.</th>
                                                      <th className="text-center"> Employee Name</th>

                                                      <th className="text-center">Address</th>
                                                      <th className="text-center">Role</th>
                                                      <th className="text-center">Company</th>
                                                      <th className="text-center">Action</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                {vehicleListData?.map((row, idx) => (
                                                      <tr className='text-nowrap' key={idx}>
                                                            <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
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
                                                                  </div>
                                                            </td>



                                                            <td className="text-center" style={{ minWidth: "150px" }}>
                                                                  <div >
                                                                        <>{row.address}</>
                                                                  </div>
                                                            </td>
                                                            <td className="text-center" style={{ minWidth: "150px" }}>
                                                                  <div >
                                                                        <>{row.roleName}</>
                                                                  </div>
                                                            </td>

                                                            <td className="text-center" style={{ minWidth: "150px" }}>
                                                                  <div >
                                                                        <>{row.companyName}</>
                                                                  </div>
                                                            </td>



                                                            {/* <td className="text-center">{row.createdOnDate ? dayjs(row.createdOnDate).format('DD/MM/YYYY') : '-'}</td> */}
                                                            <td className="text-center">
                                                                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                                                        <Tooltip title="Update Institute">
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
                                    {/* {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />} */}
                              </div>

                              {/* Pagination */}
                              <div className="d-flex justify-content-end ">
                                    {/* {totalCount > pageSize && (
              <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
            )} */}
                              </div>
                        </div>
                  </div>

                  {showVehicleModal && (
                        <InstituteEmployeeAddUpdateModal
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

                  {showInstituteUserModal && (
                        <InstituteUserAddUpdateModal
                              show={showInstituteUserModal}
                              onHide={() => setShowInstituteUserModal(false)}
                              modelRequestData={modelRequestData}
                        />
                  )}
                  <ImageModal show={imgModalShow} onHide={() => setImgModalShow(false)} imageUrl={selectedImage} title={imgModalTitle} />
            </>
      );
};

export default InstituteEmployeeList;
