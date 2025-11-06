

import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import { FaUser, FaPhone } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";

import { motion } from "framer-motion";


import 'react-datepicker/dist/react-datepicker.css';
import Android12Switch from 'component/Android12Switch';
import { ConfigContext } from 'context/ConfigContext';
import { ChangeStateStatus, MasterStatGetStateList } from 'services/Master Crud/MasterStateApi';
import dayjs from 'dayjs';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { Tooltip } from '@mui/material';
import { GetWarrantyVisitScheduleList } from '../../services/AMCApi/AMCApi';

const WarrantyVisitSchedule = () => {
      const [stateChangeStatus, setStateChangeStatus] = useState('');
      const [totalRecords, setTotalRecords] = useState(-1);
      const { setLoader, user } = useContext(ConfigContext);
      const [modelAction, setModelAction] = useState();
      const [currentPage, setCurrentPage] = useState(1);
      const [totalPage, setTotalPage] = useState();
      const [totalCount, setTotalCount] = useState(null);
      const [pageSize, setPageSize] = useState(30);
      const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
      const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
      const [searchKeyword, setSearchKeyword] = useState('');
      const [fromDate, setFromDate] = useState(null); // Initialize as null
      const [toDate, setToDate] = useState(null);
      const [stateListData, setStateListData] = useState([]);
      const [openMasterStateModal, setOpenMasterStateModal] = useState(false);
      const [showSuccessModal, setShowSuccessModal] = useState();
      const [sortingDirection, setSortingDirection] = useState(null);
      const [sortDirectionObj, setSortDirectionObj] = useState({
            ServiceNameSort: null
      });
      const [sortType, setSortType] = useState('');

      const [modelRequestData, setModelRequestData] = useState({
            stateID: null,
            stateName: null,
            Action: null
      });


      useEffect(() => {
            // debugger
            if (isAddUpdateActionDone) {
                  GetWarrantyVisitScheduleListData(1, null, toDate, fromDate);
                  setSearchKeyword('')
                  setSortingDirection(null);
            }
            setIsAddUpdateActionDone(false);
      }, [isAddUpdateActionDone]);

      useEffect(() => {
            GetWarrantyVisitScheduleListData(1, null, toDate, fromDate);
      }, [setIsAddUpdateActionDone]);



      const GetWarrantyVisitScheduleListData = async (pageNumber, searchKeywordValue, toDate, fromDate, sortValue, StateSortType) => {
            // debugger
            setLoader(true);
            try {
                  const data = await GetWarrantyVisitScheduleList({
                        pageSize,
                        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
                        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
                        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
                        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                        sortingDirection: sortValue === undefined ? sortingDirection : sortValue,
                        sortingColumnName: sortType == '' ? StateSortType : sortType || null,
                        userKeyID: user.userKeyID
                  });

                  if (data) {
                        if (data?.data?.statusCode === 200) {
                              setLoader(false);
                              if (data?.data?.responseData?.data) {
                                    const MasterStateListData = data.data.responseData.data;
                                    const totalItems = data.data?.totalCount; // const totalItems = 44;
                                    setTotalCount(totalItems);
                                    const totalPages = Math.ceil(totalItems / pageSize);
                                    setTotalPage(totalPages);
                                    setTotalRecords(MasterStateListData.length);
                                    setStateListData(MasterStateListData);
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

      const closeAllModal = () => {
            setShowSuccessModal(false);
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
            GetWarrantyVisitScheduleListData(1, capitalizedValue, toDate, fromDate);
      };

      const handlePageChange = (pageNumber) => {
            setCurrentPage(pageNumber);
            GetWarrantyVisitScheduleListData(pageNumber, null, toDate, fromDate);
      };

      const addMasterStateBtnClick = () => {
            setModelRequestData({
                  ...modelRequestData,
                  Action: null,
                  stateID: null,
                  userKeyID: null
            });
            setOpenMasterStateModal(true);
      };
      const EditMasterStateBtnClick = (row) => {
            setModelRequestData({
                  ...modelRequestData,
                  Action: 'Update',
                  stateID: row.stateID
            });
            setOpenMasterStateModal(true);
      };

      const handleStatusChange = (row) => {
            setStateChangeStatus(row); // You can set only relevant data if needed
            setShowStatusChangeModal(true);
      };

      const confirmStatusChange = async (row, user) => {
            try {
                  const { stateID } = row; // Destructure to access only what's needed
                  const response = await ChangeStateStatus(stateID, user.userKeyID);

                  if (response && response.data.statusCode === 200) {
                        setShowStatusChangeModal(false);
                        setStateChangeStatus(null);
                        GetWarrantyVisitScheduleListData(currentPage, null, toDate, fromDate);
                        setShowSuccessModal(true);
                        setModelAction('Installation status changed successfully.');
                  } else {
                        console.error(response?.data?.errorMessage);
                        setShowSuccessModal(true);
                        setModelAction('Failed to change employee status.');
                  }
            } catch (error) {
                  console.error('Error changing employee status:', error);
                  setShowSuccessModal(true);
                  setModelAction('An error occurred while changing the employee status.');
            }
      };

      const handleSort = (currentSortDirection, StateSortType) => {
            const newSortValue = currentSortDirection === 'asc' ? 'desc' : 'asc';

            if (StateSortType === 'stateName') {
                  setSortingDirection(newSortValue);
                  setSortDirectionObj({
                        ...sortDirectionObj,
                        ServiceNameSort: newSortValue
                  });
                  setCurrentPage(1);
                  GetWarrantyVisitScheduleListData(1, searchKeyword, toDate, fromDate, newSortValue, StateSortType);
            } else if (StateSortType === 'ProfessionType') {
                  setSortingDirection(newSortValue);
                  setSortDirectionObj({
                        ...sortDirectionObj,
                        ProfessionTypeSort: newSortValue
                  });
                  setCurrentPage(1);
                  GetWarrantyVisitScheduleListData(1, searchKeyword, toDate, fromDate, newSortValue, StateSortType);
            }
      };

      return (
            <>
                  <div className="card w-full max-w-[50vh] mx-auto h-auto">
                        <div className="card-body p-2 bg-white shadow-md rounded-lg">
                              {/* Top controls */}
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                    <h5 className="m-0">Warranty Visit Schedule</h5>

                              </div>
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                    <input
                                          type="text"
                                          className="form-control "
                                          placeholder="Search Warranty Visit Schedule"
                                          style={{ maxWidth: "350px" }}
                                          value={searchKeyword}
                                          onChange={(e) => {
                                                handleSearch(e);
                                          }}
                                    />

                              </div>

                              {/* Table */}
                              <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
                                    <table className="table table-bordered table-striped">
                                          <thead
                                                className="table-light"
                                                style={{ position: "sticky", top: -1, zIndex: 1 }}
                                          >
                                                <tr>
                                                      <th className="text-center">Sr No</th>
                                                      <th className="text-center">Customer Info</th>
                                                      <th className="text-center">Product Name</th>
                                                      <th className="text-center">Model Name</th>
                                                      <th className="text-center">Manufacturer</th>
                                                      <th className="text-center">Warranty Expiry Date</th>
                                                      <th className="text-center">Warranty In Month</th>
                                                      <th className="text-center">Visit Dates</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                {stateListData?.map((row, idx) => (
                                                      <tr key={idx}>
                                                            <td className="text-center">
                                                                  {(currentPage - 1) * pageSize + idx + 1}
                                                            </td>
                                                            <td className="text-start">
                                                                  <motion.div
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ duration: 0.3 }}
                                                                        className="d-flex flex-column"
                                                                  >
                                                                        <div className="d-flex align-items-center gap-2">
                                                                              <FaUser size={14} className="text-primary" />
                                                                              <span>{row.customerFirmName}</span>
                                                                        </div>
                                                                        <div className="d-flex align-items-center gap-2 mt-1">
                                                                              <FaPhone size={12} className="text-success" />
                                                                              <span>{row.custMobileNumber}</span>
                                                                        </div>
                                                                  </motion.div>
                                                            </td>
                                                            <td className="text-center">{row.productName}</td>



                                                            <td className="text-center">
                                                                  <motion.div
                                                                        initial={{ opacity: 0, y: -5 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ duration: 0.3 }}
                                                                        className="d-flex flex-column align-items-center gap-2"
                                                                  >
                                                                        <div className="d-flex flex-column">
                                                                              <span >{row.modelName || "N/A"}</span>
                                                                        </div>

                                                                        {row.variantName && (
                                                                              <div className="d-flex flex-column">
                                                                                    <span className="fw-semibold text-muted small">Variant</span>
                                                                                    <span className="badge bg-success">{row.variantName}</span>
                                                                              </div>
                                                                        )}
                                                                  </motion.div>
                                                            </td>

                                                            <td className="text-center">{row.manufacturerName}</td>
                                                            <td className="text-center">
                                                                  {row.expiryDate}
                                                            </td>
                                                            <td className="text-center">
                                                                  {row.warrantyInMonth}
                                                            </td>
                                                            <td className="text-center" style={{ minWidth: "200px" }}>
                                                                  {row.productVisitDateMappingList?.length > 0 ? (
                                                                        <div
                                                                              style={{
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                    gap: "10px",
                                                                                    overflowX: "auto",
                                                                                    padding: "5px 0",
                                                                              }}
                                                                        >
                                                                              {row.productVisitDateMappingList.map((visit, i) => (
                                                                                    <motion.div
                                                                                          key={i}
                                                                                          initial={{ opacity: 0, y: -5 }}
                                                                                          animate={{ opacity: 1, y: 0 }}
                                                                                          transition={{ duration: 0.3, delay: i * 0.1 }}
                                                                                          style={{
                                                                                                position: "relative",
                                                                                                display: "flex",
                                                                                                flexDirection: "column",
                                                                                                alignItems: "center",
                                                                                                whiteSpace: "nowrap",
                                                                                          }}
                                                                                    >
                                                                                          {/* Dot */}
                                                                                          <div
                                                                                                style={{
                                                                                                      width: "10px",
                                                                                                      height: "10px",
                                                                                                      borderRadius: "50%",
                                                                                                      backgroundColor: "#ff7d34",
                                                                                                      zIndex: 1,
                                                                                                }}
                                                                                          />
                                                                                          {/* Connecting line */}
                                                                                          {i !== row.productVisitDateMappingList.length - 1 && (
                                                                                                <div
                                                                                                      style={{
                                                                                                            position: "absolute",
                                                                                                            top: "5px",
                                                                                                            left: "50%",
                                                                                                            width: "100%",
                                                                                                            height: "2px",
                                                                                                            backgroundColor: "#ff7d34",
                                                                                                            zIndex: 0,
                                                                                                      }}
                                                                                                />
                                                                                          )}
                                                                                          {/* Date label */}
                                                                                          <span style={{ fontSize: "12px", marginTop: "5px" }}>
                                                                                                {dayjs(visit.visitDate).format("DD MMM")}
                                                                                          </span>
                                                                                    </motion.div>
                                                                              ))}
                                                                        </div>
                                                                  ) : (
                                                                        "-"
                                                                  )}
                                                            </td>


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

                  {/* {openMasterStateModal && (
                        <AddUpdateMasterStateModal
                              show={openMasterStateModal}
                              onHide={() => setOpenMasterStateModal(false)}
                              modelRequestData={modelRequestData}
                              setModelRequestData={setModelRequestData}
                              setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                        />
                  )} */}

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
            </>
      );
};

export default WarrantyVisitSchedule;
