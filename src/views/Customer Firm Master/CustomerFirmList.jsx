import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation, useNavigate } from 'react-router';
import PaginationComponent from 'component/Pagination';
import { ConfigContext } from 'context/ConfigContext';
import JSZip from "jszip";
import { saveAs } from "file-saver";

import NoResultFoundModel from 'component/NoResultFoundModal';
import ImageModal from 'component/ImageModal';
import Android12Switch from 'component/Android12Switch';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { Tooltip } from '@mui/material';
import AddUpdateCustomerFirmModal from './AddUpdateCustomerFirmModal';
import CustomerFirmViewModal from './CustomerFirmViewModal';
import InstituteUserAddUpdateModal from 'views/Employee/InstituteUserAddUpdateModal';
import { ChangeInstituteStatus, ExportInstituteAttendanceZip, GetInstituteList } from 'services/Institute/InstituteApi';
import axios from 'axios';
import { FaCity, FaMapMarkerAlt, FaRoute } from 'react-icons/fa';
import ZipDownloadModal from './ZipDownloadModal';
import { Badge } from 'react-bootstrap';

const CustomerFirmList = () => {
  const [stateChangeStatus, setStateChangeStatus] = useState('');
  const [openCustomerViewModal, setOpenCustomerViewModal] = useState(false);
  const [showZipModal, setShowZipModal] = useState(false);
  const [showInstituteUserModal, setShowInstituteUserModal
  ] = useState(false);
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

  const GetInstituteListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    // debugger
    setLoader(true);
    try {
      const data = await GetInstituteList({
        pageSize: 40,
        // userKeyID: user.userKeyID,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        companyID: companyID,
        projectID: location?.state?.projectID,
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



  const location = useLocation()


  const CustomerAddBtnClicked = () => {
    setModelRequestData({
      ...modelRequestData,
      instituteKeyID: null,
      projectID: location.state.projectID,
      Action: null
    });
    setShowVehicleModal(true);
  };
  const EditCustomerBtnClick = (row) => {
    setModelRequestData({
      ...modelRequestData,
      instituteKeyID: row.instituteKeyID,
      projectID: location.state.projectID,
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

  const instituteUserBtnClick = (row) => {
    navigate('/institute-employee', { state: { instituteKeyID: row.instituteID, instituteName: row.instituteName, serviceID: row?.serviceID, projectID: row?.projectID } })
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetInstituteListData(pageNumber, null, toDate, fromDate);
  };


  const closeAllModal = () => {
    // onHide();
    setShowSuccessModal(false);
  };

  const confirmStatusChange = async (row, user) => {
    setLoader(true);

    // debugger
    try {
      const { instituteKeyID } = row; // Destructure to access only what's needed
      const response = await ChangeInstituteStatus(instituteKeyID, companyID);

      if (response && response.data.statusCode === 200) {
        setLoader(false);

        // Successfully changed the status
        setShowStatusChangeModal(false);
        setStateChangeStatus(null);
        GetInstituteListData(currentPage, null, toDate, fromDate);
        // GetMasterDistrictListData(currentPage, null, toDate, fromDate);
        setShowSuccessModal(true);
        setModelAction('Institute status changed successfully.');
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


  const handleStatusChange = (row) => {
    setStateChangeStatus(row);
    setShowStatusChangeModal(true);
  };

  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");

  const fullText = "Search By Institute / Project / Zone / Distractt";
  let index = 0;
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

  console.log(vehicleListData, '3sssssssssss');



  const submitPDFZip = () => {

    setModelRequestData({
      ...modelRequestData,
      projectID: location.state.projectID
    })

    setShowZipModal(true)

  }
  // console.log(vehicleListData, '333sssssssss');
  const totalCount1 = vehicleListData?.length;

  const receivedCount = vehicleListData?.filter(
    item => item?.uploadURL && item?.uploadURL?.trim() !== ""
  )?.length;

  const pendingCount = totalCount1 - receivedCount;


  return (
    <>
      {/* <Sidebar drawerOpen={true} drawerToggle={() => {}} modalOpen={show} /> */}
      <div className="card w-full max-w-[50vh] mx-auto h-auto">
        <div className="card-body p-2 bg-white shadow-md rounded-lg">
          {/* Top controls */}

          <div className="d-flex justify-content-between align-items-center mb-2">
            <button
              // className="btn btn-light p-1 me-2"
              className="btn btn-outline-secondary btn-sm me-2"

              // style={{ borderRadius: "50%", width: "36px", height: "36px" }}
              onClick={() => navigate(-1)}
            >
              <i className="fa-solid fa-arrow-left"></i>

            </button>
            <div className="d-flex align-items-center flex-grow-1">

              <div
                className="me-2"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  // backgroundColor: "#0d6efd",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontSize: "20px",
                  animation: "pulse 1.5s infinite"
                }}
              >
                🎓
              </div>

              <h5 className="tracking-in-contract">
                Institute :
                <span style={{ textDecoration: "underline", marginLeft: "6px" }}>
                  {location?.state?.projectName}
                </span>
              </h5>
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
              <Tooltip title="Add Customer / Firm">
                <button onClick={() => CustomerAddBtnClicked()} className="btn btn-primary btn-sm d-none d-sm-inline">
                  <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i> <span className="d-none d-sm-inline">Add</span>
                </button>
              </Tooltip>
            </div> */}

            <div className="d-flex align-items-center ms-2 gap-2 mt-2 mt-sm-0">
              <div className="d-flex gap-3">
                <Badge bg="primary" className="px-3 py-2">
                  Total: {totalCount}
                </Badge>

                <Badge bg="success" className="px-3 py-2">
                  Received: {receivedCount}
                </Badge>

                <Badge bg="danger" className="px-3 py-2">
                  Pending: {pendingCount}
                </Badge>
              </div>


              <Tooltip title="Add Institute" >
                <button onClick={() => CustomerAddBtnClicked()} style={{ background: '#ffaa33', color: 'white' }} className="btn  btn-sm d-none d-sm-inline">
                  <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                  <span className="d-none d-sm-inline">Add</span>
                </button>
              </Tooltip>
              <Tooltip title=" Download All Report" >
                <button onClick={() => submitPDFZip()} style={{ background: '#ffaa33', color: 'white' }} className="btn  btn-sm d-none d-sm-inline">

                  <span className="d-none d-sm-inline">
                    <i className="bi bi-file-earmark-zip"></i>

                    Download All Report</span>
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
              <thead className="table-gradient-orange" style={{ position: 'sticky', top: 0, zIndex: 10, color: '#fff' }}>

                {/* <thead style={{ position: 'sticky', top: -1, zIndex: 1 }}> */}
                <tr className="text-nowrap">
                  <th className="text-center">Sr No</th>
                  <th className="text-center"> Institute Name</th>

                  <th className="text-center">Project Name</th>
                  <th className="text-center">Geo Info</th>
                  <th className="text-center ">Last Month Attendance</th>
                  <th className="text-center ">Status</th>
                  <th className="text-center actionSticky">Action</th>
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

                    <td style={{ minWidth: "250px", textAlign: "center", lineHeight: "1.2" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "6px",
                          animation: "fadeSlide 0.7s ease"
                        }}
                      >
                        <span style={{ fontSize: "18px" }}>🎓</span>
                        <span style={{ fontWeight: 600, fontSize: "14px", color: "#222" }}>

                          {row.instituteName?.length > 30 ? (
                            <Tooltip title={row.instituteName}>{`${row.instituteName?.substring(0, 30)}...`}</Tooltip>
                          ) : (
                            <>{row.instituteName}</>
                          )}
                        </span>
                      </div>
                    </td>



                    <td className="text-center" style={{ minWidth: "150px" }}>
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", animation: "fadeSlide 0.7s ease" }}>
                        <span style={{ fontSize: "18px" }}>🏗️</span>
                        <span>
                          {row?.projectName?.length > 30 ? (
                            <Tooltip title={row?.projectName}>{`${row?.projectName?.substring(0, 30)}...`}</Tooltip>
                          ) : (
                            <>{row?.projectName}</>
                          )}
                        </span>
                      </div>
                    </td>






                    <td style={{ minWidth: "180px" }}>
                      <div className="d-flex flex-column gap-1">

                        {/* Zone */}
                        <div className="d-flex align-items-center fade-in">
                          <FaMapMarkerAlt className="me-2 text-primary" />
                          <div>
                            <small className="text-muted d-block">Zone</small>
                            <span>{row.zoneName || "-"}</span>
                          </div>
                        </div>

                        {/* District */}
                        <div className="d-flex align-items-center fade-in delay-1">
                          <FaCity className="me-2 text-success" />
                          <div>
                            <small className="text-muted d-block">District</small>
                            <span>

                              {row.districtName
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

                              {row.talukaName
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

                    <td className="text-center">
                      {row.uploadURL ? (
                        <a
                          href={row.uploadURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="btn btn-sm download-btn d-inline-flex align-items-center gap-2"
                        >
                          <i className="fa-solid fa-file-arrow-down"></i>
                          <span>Download</span>
                        </a>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>



                    <td className="text-center">
                      {row.status === 'Active' ? 'Active' : 'In-Active'}
                      <Android12Switch style={{ padding: '8px' }}
                        onClick={() => handleStatusChange(row)} checked={row.status === 'Active'} />


                    </td>

                    {/* <td className="text-center">{row.createdOnDate ? dayjs(row.createdOnDate).format('DD/MM/YYYY') : '-'}</td> */}
                    <td className="text-center relative  actionColSticky " style={{ zIndex: 4 }}>

                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <Tooltip title="Update Institute     ">
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

                        <Tooltip title={`Add Employee `}>
                          <button
                            style={{
                              padding: '4px 8px',
                              fontSize: '12px',
                              height: '28px',
                              width: '100px', background: '#ffaa33', color: 'white'
                            }}
                            onClick={() => instituteUserBtnClick(row)}
                            type="button"
                            className="btn-sm btn "
                          >
                            Add Employee
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
        <AddUpdateCustomerFirmModal
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
        openCustomerViewModal && (
          <CustomerFirmViewModal
            show={openCustomerViewModal}
            onHide={() => setOpenCustomerViewModal(false)}
            modelRequestData={modelRequestData}
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
      {
        showZipModal && (
          <ZipDownloadModal
            show={showZipModal}
            onHide={() => setShowZipModal(false)}
            modelRequestData={modelRequestData}
          />
        )
      }
      <ImageModal show={imgModalShow} onHide={() => setImgModalShow(false)} imageUrl={selectedImage} title={imgModalTitle} />
    </>
  );
};

export default CustomerFirmList;
