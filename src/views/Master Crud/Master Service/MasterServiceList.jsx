




import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Android12Switch from 'component/Android12Switch';
import { ConfigContext } from 'context/ConfigContext';
import dayjs from 'dayjs';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { Tooltip } from '@mui/material';
import { useNavigate } from 'react-router';
import { ChenageDesignationStatus, GetDesignationList } from 'services/Master Crud/Designationapi';
import { hasPermission } from 'Middleware/permissionUtils';
import MasterServiceModal from './MasterServiceModal';
import { ChangeServiceStatus, GetServiceList } from 'services/Services/ServicesApi';

const MasterServiceList = () => {
      const [stateChangeStatus, setStateChangeStatus] = useState('');
      const [totalRecords, setTotalRecords] = useState(-1);
      const { setLoader, user, permissions } = useContext(ConfigContext);
      const [modelAction, setModelAction] = useState();
      const [currentPage, setCurrentPage] = useState(1);
      const [totalPage, setTotalPage] = useState();
      const navigate = useNavigate();
      const [totalCount, setTotalCount] = useState(null);
      const [pageSize, setPageSize] = useState(30);
      const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
      const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
      const [searchKeyword, setSearchKeyword] = useState('');
      const [fromDate, setFromDate] = useState(null); // Initialize as null
      const [toDate, setToDate] = useState(null);
      const [designationListData, setDesignationListData] = useState([]);
      const [openMasterDesignationModal, setOpenMasterDesignationModal] = useState(false);
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
                  GetServiceListData(1, null, toDate, fromDate);
                  setSearchKeyword('');
                  setSortingDirection(null);
            }
            setIsAddUpdateActionDone(false);
      }, [isAddUpdateActionDone]);

      useEffect(() => {
            GetServiceListData(1, null, toDate, fromDate);
      }, [setIsAddUpdateActionDone]);

      const GetServiceListData = async (pageNumber, searchKeywordValue, toDate, fromDate, sortValue, StateSortType) => {
            // debugger
            setLoader(true);
            try {
                  const data = await GetServiceList({
                        pageSize,
                        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
                        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
                        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
                        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                        sortingDirection: sortValue === undefined ? sortingDirection : sortValue,
                        sortingColumnName: sortType == '' ? StateSortType : sortType || null,
                        userKeyID: null
                        // userKeyID: user.userKeyID
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
                                    setDesignationListData(MasterStateListData);
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
            GetServiceListData(1, capitalizedValue, toDate, fromDate);
      };

      const handlePageChange = (pageNumber) => {
            setCurrentPage(pageNumber);
            GetServiceListData(pageNumber, null, toDate, fromDate);
      };

      const addMasterStateBtnClick = () => {
            setModelRequestData({
                  ...modelRequestData,
                  Action: null,
                  serviceKeyID: null,
                  userKeyID: null
            });
            setOpenMasterDesignationModal(true);
      };
      const EditMasterStateBtnClick = (row) => {
            setModelRequestData({
                  ...modelRequestData,
                  Action: 'Update',
                  serviceKeyID: row.serviceKeyID
            });
            setOpenMasterDesignationModal(true);
      };

      const handleStatusChange = (row) => {
            setStateChangeStatus(row); // You can set only relevant data if needed
            setShowStatusChangeModal(true);
      };

      const confirmStatusChange = async (row) => {
            try {
                  const { serviceKeyID } = row; // Destructure to access only what's needed
                  const response = await ChangeServiceStatus(serviceKeyID);

                  if (response && response.data.statusCode === 200) {
                        setShowStatusChangeModal(false);
                        setStateChangeStatus(null);
                        GetServiceListData(currentPage, null, toDate, fromDate);
                        setShowSuccessModal(true);
                        setModelAction('Service status changed successfully.');
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
                  GetServiceListData(1, searchKeyword, toDate, fromDate, newSortValue, StateSortType);
            } else if (StateSortType === 'ProfessionType') {
                  setSortingDirection(newSortValue);
                  setSortDirectionObj({
                        ...sortDirectionObj,
                        ProfessionTypeSort: newSortValue
                  });
                  setCurrentPage(1);
                  GetServiceListData(1, searchKeyword, toDate, fromDate, newSortValue, StateSortType);
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
                                          <h5 className="mb-0">Service</h5>
                                    </div>
                                    <div className="position-absolute end-0 me-2">

                                          <button onClick={() => addMasterStateBtnClick()} style={{ background: '#ffaa33' }} className="btn text-white btn-sm d-inline d-sm-none">
                                                <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                                                <span className="d-inline d-sm-none"> Add</span>
                                          </button>

                                    </div>
                              </div>

                              <div className="d-flex justify-content-between align-items-center mb-2">
                                    <input
                                          type="text"
                                          className="form-control "
                                          placeholder="Search Service"
                                          style={{ maxWidth: '350px' }}
                                          value={searchKeyword}
                                          onChange={(e) => {
                                                handleSearch(e);
                                          }}
                                    />
                                    <Tooltip title="Add Service">
                                          <button onClick={() => addMasterStateBtnClick()} style={{ background: '#ffaa33' }} className="btn text-white btn-sm d-none d-sm-inline">
                                                <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                                                <span className="d-none d-sm-inline"> Add</span>
                                          </button>
                                    </Tooltip>
                              </div>

                              {/* Table */}
                              <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
                                    <table className="table table-bordered table-striped table-hover">
                                          <thead className="table-gradient-orange" style={{ position: 'sticky', top: 0, zIndex: 10, color: '#fff' }}>
                                                <tr>
                                                      <th className="text-center">Sr No</th>
                                                      <th className="text-center">
                                                            Service Name
                                                            {/* {sortDirectionObj.ServiceNameSort === "desc" ? (
    <i
      onClick={() => handleSort("desc", "stateName")}
      style={{ cursor: "pointer" }}
      className="fas fa-sort-alpha-up ml-1"
    ></i>
  ) : (
    <i
      onClick={() => handleSort("asc", "stateName")}
      style={{ cursor: "pointer" }}
      className="fas fa-sort-alpha-down ml-1"
    ></i>
  )} */}
                                                      </th>
                                                      <th className="text-center">Status</th>
                                                      {/* <th className="text-center">Created On</th> */}
                                                      <th className="text-center">Action</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                {designationListData?.map((row, idx) => (
                                                      <tr key={idx}>
                                                            <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                                                            <td className="text-center">{row.serviceName}</td>
                                                            <td className="text-center">
                                                                  <Tooltip title={row.status === true ? 'Active' : 'In Active'}>
                                                                        {row.status === 'Active' ? 'Active' : 'In Active'}
                                                                        <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(row)} checked={row.status === "Active"} />
                                                                  </Tooltip>
                                                            </td>
                                                            {/* <td className="text-center">{row.createdOnDate ? dayjs(row.createdOnDate).format('DD/MM/YYYY') : '-'}</td> */}
                                                            <td className="text-center">
                                                                  <Tooltip title="Update Service">
                                                                        <button
                                                                              style={{
                                                                                    padding: '4px 8px', // Adjust padding for smaller size
                                                                                    fontSize: '12px', // Optional: smaller font size
                                                                                    height: '28px', // Set height
                                                                                    width: '28px', // Set width
                                                                                    background: '#ffaa33'
                                                                              }}
                                                                              onClick={() => EditMasterStateBtnClick(row)}
                                                                              type="button"
                                                                              className="btn-sm btn text-white"
                                                                        >
                                                                              <i className="fa-solid fa-pen-to-square"></i>
                                                                        </button>
                                                                  </Tooltip>

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

                  {openMasterDesignationModal && (
                        <MasterServiceModal
                              show={openMasterDesignationModal}
                              onHide={() => setOpenMasterDesignationModal(false)}
                              modelRequestData={modelRequestData}
                              setModelRequestData={setModelRequestData}
                              setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                        />
                  )}

                  <StatusChangeModal
                        open={showStatusChangeModal}
                        onClose={() => setShowStatusChangeModal(false)}
                        onConfirm={() => confirmStatusChange(stateChangeStatus)} // Pass the required arguments
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

export default MasterServiceList;
