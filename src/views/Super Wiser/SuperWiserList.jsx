


import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router';
import { BsPerson, BsEnvelope, BsTelephone } from "react-icons/bs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { OverlayTrigger } from "react-bootstrap";
import { FaBuilding, FaSchool, FaFolderTree } from "react-icons/fa6";

import { ConfigContext } from 'context/ConfigContext';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import NoResultFoundModel from 'component/NoResultFoundModal';
import ImageModal from 'component/ImageModal';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { Tooltip } from '@mui/material';
import { ChangeEmployeeStatus, GetAppUserList, } from 'services/Employee Staff/EmployeeApi';
import ResetIMEIModal from 'component/Staff/ResetIMEIModal';
import { Link } from 'react-router-dom';
import SuperWiserAddUpdateModal from './SuperWiserAddUpdateModal';
import dayjs from 'dayjs';





const SuperWiserList = () => {
      const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");
      const fullText = "Search By Name / Ph No. / Mail ID / Company Namee";
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
      const [fromDate, setFromDate] = useState(null); // Initialize as null
      const [toDate, setToDate] = useState(null);
      const [showEmployeeModal, setShowEmployeeModal] = useState(false);
      const [show, setShow] = useState(false);
      const handleShow = () => setShow(true);
      const handleClose = () => setShow(false);
      const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
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

      const [visibleIndex, setVisibleIndex] = useState(null);


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
                        // userKeyID: user.userKeyID,
                        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
                        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
                        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
                        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                        companyID: Number(companyID),
                        appUserTypeID: 2
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




      const [showPassword, setShowPassword] = useState({});









      const [expandedLead, setExpandedLead] = useState(null);
      const toggleExpand = (userKeyIDForUpdate) => {
            setExpandedLead((prev) => (prev === userKeyIDForUpdate ? null : userKeyIDForUpdate));
      };

      const exportAppUserExcel = async () => {
            // debugger
            try {
                  let allRows = [];
                  let page = 1;
                  let totalPages = 1;

                  while (page <= totalPages) {
                        const response = await GetAppUserList({
                              pageSize,
                              pageNo: page - 1,
                              searchKeyword: searchKeyword,
                              toDate: toDate ? dayjs(toDate).format("YYYY-MM-DD") : null,
                              fromDate: fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : null,
                              companyID: Number(companyID),
                              appUserTypeID: 2,
                        });

                        if (response?.data?.statusCode === 200) {
                              const list = response.data.responseData?.data || [];
                              const count = response.data.totalCount || 0;

                              totalPages = Math.ceil(count / pageSize);
                              allRows = [...allRows, ...list];
                        }

                        page++;
                  }

                  if (!allRows.length) {
                        alert("No records found!");
                        return;
                  }

                  // ---------------------------------------------------------
                  // ✔ Remove unwanted API keys here
                  // ---------------------------------------------------------
                  let keys = Object.keys(allRows[0]).filter(
                        (k) => !["userKeyIDForUpdate", "userDetailsKeyID", "userID", "canUpdateAttendance"].includes(k)
                  );


                  // You can remove more keys like this:
                  // .filter(k => !["id","guid","xxx"].includes(k))

                  // ---------------------------------------------------------
                  // ✔ Convert camelCase → Title Case with spaces
                  // ---------------------------------------------------------
                  const formatHeader = (str) =>
                        str
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (m) => m.toUpperCase())
                              .trim();

                  // ---------------------------------------------------------
                  // ✔ Title + Date Range
                  // ---------------------------------------------------------
                  const title = "Attendance Authority Report";

                  const dateLine = `
      <div style="margin-bottom:10px; font-size:14px;">
        ${fromDate ? `From: <b>${dayjs(fromDate).format("DD-MM-YYYY")}</b>` : ""}
        ${fromDate && toDate ? "&nbsp;&nbsp;|" : ""}
        ${toDate ? `To: <b>${dayjs(toDate).format("DD-MM-YYYY")}</b>` : ""}
      </div>
    `;

                  // ---------------------------------------------------------
                  // ✔ Build Excel Table
                  // ---------------------------------------------------------
                  let table = `
      <h2 style="text-align:center; margin-bottom:5px;">${title}</h2>
      ${dateLine}

      <table border="1" style="border-collapse: collapse; font-size: 14px; width:100%;">
        <thead>
          <tr>
            <th style="border:1px solid #000; padding:5px;">Sr No</th>
    `;

                  keys.forEach((key) => {
                        table += `
        <th style="border:1px solid #000; padding:5px;">
          ${formatHeader(key)}
        </th>
      `;
                  });

                  table += `
          </tr>
        </thead>
        <tbody>
    `;

                  allRows.forEach((row, index) => {
                        table += `
        <tr>
          <td style="border:1px solid #000; padding:5px;">${index + 1}</td>
      `;

                        keys.forEach((key) => {
                              table += `
          <td style="border:1px solid #000; padding:5px;">
            ${row[key] ?? ""}
          </td>
        `;
                        });

                        table += `</tr>`;
                  });

                  table += `
        </tbody>
      </table>
    `;

                  // ---------------------------------------------------------
                  // ✔ Download Excel
                  // ---------------------------------------------------------
                  const blob = new Blob([table], {
                        type: "application/vnd.ms-excel;charset=utf-8;",
                  });

                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.download = `Attendance_Authority_Report_${dayjs().format("DDMMYYYY_HHmm")}.xls`;
                  link.click();
            } catch (error) {
                  console.log("Export error:", error);
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
                                          <h5 className="mb-0">Attendance Authority</h5>
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
              </Tooltip> */}  <Tooltip title="Export Attendance Authority Report">
                                                <button onClick={() => exportAppUserExcel()} style={{ background: '#ffaa33', color: 'white' }} className="btn  btn-sm d-none d-sm-inline ">
                                                      <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>{" "}
                                                      <span className="d-none d-sm-inline">Export</span>
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
                                          <thead className="table-gradient-orange" style={{ position: 'sticky', top: 0, zIndex: 10, color: '#fff' }}>

                                                {/* <thead style={{ position: 'sticky', top: -1, zIndex: 1, backgroundColor: '#ff7d34',  }}> */}
                                                <tr className="text-nowrap">
                                                      <th className="text-center">Sr.No.</th>
                                                      <th className="text-center">Employee Info</th>







                                                      <th className="text-center">Address</th>
                                                      <th className="text-center">Organization Details</th>

                                                      {/* <th className="text-center">Can Update Att.</th> */}
                                                      <th className="text-center">Password</th>
                                                      <th className="text-center actionSticky">Action</th>
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
                                                            <td>
                                                                  <div className="d-flex flex-column gap-1">

                                                                        {/* Company Name */}
                                                                        <span

                                                                              placement="top"
                                                                        >
                                                                              <span className="d-flex align-items-center text-dark small">
                                                                                    <FaBuilding className="me-2 text-primary" size={14} />
                                                                                    {value.companyName?.length > 35
                                                                                          ? value.companyName.substring(0, 35) + "..."
                                                                                          : value.companyName || "-"}
                                                                              </span>
                                                                        </span>

                                                                        {/* Institute Name */}
                                                                        <span

                                                                              placement="top"
                                                                        >
                                                                              <span className="d-flex align-items-center text-dark small">
                                                                                    <FaSchool className="me-2 text-success" size={14} />


                                                                                    {value.instituteName?.length > 30 ? (
                                                                                          <Tooltip title={value.instituteName}>{`${value.instituteName?.substring(0, 30)}...`}</Tooltip>
                                                                                    ) : (
                                                                                          <>{value.instituteName}</>
                                                                                    )}
                                                                              </span>
                                                                        </span>

                                                                        {/* Project Names */}
                                                                        <span

                                                                              placement="top"
                                                                        >
                                                                              <span className="d-flex align-items-center text-dark small">
                                                                                    <FaFolderTree className="me-2 text-warning" size={14} />



                                                                                    {value.projectNames?.length > 30 ? (
                                                                                          <Tooltip title={value.projectNames}>{`${value.projectNames?.substring(0, 30)}...`}</Tooltip>
                                                                                    ) : (
                                                                                          <>{value.projectNames}</>
                                                                                    )}
                                                                              </span>
                                                                        </span>

                                                                  </div>
                                                            </td>
                                                            {/* <td className='text-center'>{value.canUpdateAttendance === true ? "Yes" : 'No'}</td> */}
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
                                                            <td className="text-center relative  actionColSticky " style={{ zIndex: 4 }}>
                                                                  <div className="">
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
                                                                        </Tooltip>         </div>



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
                                    {totalCount > pageSize && (
                                          <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
                                    )}
                              </div>
                        </div>
                  </div>


                  {showEmployeeModal && (
                        < SuperWiserAddUpdateModal
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



                  <ImageModal show={imgModalShow} onHide={() => setImgModalShow(false)} imageUrl={selectedImage} title={imgModalTitle} />
            </>
      );
};

export default SuperWiserList;

