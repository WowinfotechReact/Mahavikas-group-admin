


import React, { useState, useEffect, useContext } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation, useNavigate } from 'react-router';
import { ConfigContext } from 'context/ConfigContext';
import dayjs from 'dayjs';
import { ChangeCompanyStatus, GetCompanyList } from 'services/Master Crud/MasterCompany';
import { Tooltip } from '@mui/material';
import PaginationComponent from 'component/Pagination';
import NoResultFoundModel from 'component/NoResultFoundModal';
import { GetAllQuotationLogList } from 'services/Quotation Module/AddUpdateQuotationApi';



const QuotationLogsList = () => {
      const [imgModalTitle, setImgModalTitle] = useState('');
      const [imgModalShow, setImgModalShow] = useState(false);
      const [selectedImage, setSelectedImage] = useState('');
      const [stateChangeStatus, setStateChangeStatus] = useState('');
      const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
      const { user } = useContext(ConfigContext);
      const [totalRecords, setTotalRecords] = useState(-1);
      const { setLoader } = useContext(ConfigContext);
      const [modelAction, setModelAction] = useState();
      const [currentPage, setCurrentPage] = useState(1);
      const [totalPage, setTotalPage] = useState();
      const [totalCount, setTotalCount] = useState(null);
      const [pageSize, setPageSize] = useState(30);
      const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
      const [searchKeyword, setSearchKeyword] = useState('');
      const [fromDate, setFromDate] = useState(null); // Initialize as null
      const [toDate, setToDate] = useState(null);
      const [stateListData, setStateListData] = useState([]);
      const [openMasterCompanyModal, setOpenMasterCompanyModal] = useState(false);
      const [showSuccessModal, setShowSuccessModal] = useState();
      const [showCustomerViewModel, setShowCustomerViewModel] = useState(false);
      const [modelRequestData, setModelRequestData] = useState({
            companyID: null,
            companyKeyID: null,
            Action: null
      });
      const navigate = useNavigate()
      useEffect(() => {
            // debugger
            if (isAddUpdateActionDone) {
                  GetMasterCompanyListData(1, null, toDate, fromDate);
                  setSearchKeyword('')
            }
            setIsAddUpdateActionDone(false);
      }, [isAddUpdateActionDone]);
      const location = useLocation()

      console.log(location.state, '333ss');

      useEffect(() => {
            GetMasterCompanyListData(1, null, toDate, fromDate);
      }, [setIsAddUpdateActionDone]);

      const GetMasterCompanyListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
            // debugger
            setLoader(true);
            try {
                  const data = await GetAllQuotationLogList({
                        pageSize,
                        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
                        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
                        userKeyID: user.userKeyID,
                        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
                        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                        sortingDirection: null,
                        sortingColumnName: null,
                        leadKeyID: location.state.leadKeyID
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

      const CompanyViewBtnClicked = async (row) => {
            setModelRequestData({
                  ...modelRequestData,
                  companyKeyID: row.companyKeyID
            });
            setShowCustomerViewModel(true);
      };

      const closeAllModal = () => {
            // onHide();
            setShowSuccessModal(false);
      };

      const confirmStatusChange = async (row, user) => {
            setLoader(true);
            // debugger
            try {
                  const { companyKeyID } = row; // Destructure to access only what's needed
                  const response = await ChangeCompanyStatus(companyKeyID, user.userKeyID);

                  if (response && response.data.statusCode === 200) {
                        setLoader(false);
                        // Successfully changed the status
                        setShowStatusChangeModal(false);
                        setStateChangeStatus(null);
                        GetMasterCompanyListData(currentPage, null, toDate, fromDate);
                        setShowSuccessModal(true);
                        setModelAction('Company status changed successfully.');
                  } else {
                        console.error(response?.data?.errorMessage);
                        setShowSuccessModal(true);
                        setLoader(false);
                        setModelAction('Failed to change employee status.');
                  }
            } catch (error) {
                  setLoader(false);
                  console.error('Error changing employee status:', error);
                  setShowSuccessModal(true);
                  setModelAction('An error occurred while changing the employee status.');
            }
      };

      const handleSearch = (e) => {
            let searchKeywordValue = e.target.value;
            const trimmedValue = searchKeywordValue.replace(/^\s+/g, '');
            const capitalizedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1).toLowerCase();
            setSearchKeyword(capitalizedValue);
            setCurrentPage(1);
            GetMasterCompanyListData(1, capitalizedValue, toDate, fromDate);
      };

      const handlePageChange = (pageNumber) => {
            setCurrentPage(pageNumber);
            GetMasterCompanyListData(pageNumber, null, toDate, fromDate);
      };

      const closeAll = () => {
            setShowSuccessModal(false);
      };

      const handleClearDates = () => {
            setCurrentPage(1);
            setToDate(null);
            setFromDate(null);
            GetMasterCompanyListData(1, null, null, null);
      };

      const addMasterCompanyBtnClick = () => {
            setModelRequestData({
                  ...modelRequestData,
                  Action: null,
                  stateID: null,
                  userKeyID: null
            });
            setOpenMasterCompanyModal(true);
      };
      const EditMasterCompanyBtnClick = (row) => {
            setModelRequestData({
                  ...modelRequestData,
                  Action: 'Update',
                  companyKeyID: row.companyKeyID
            });
            setOpenMasterCompanyModal(true);
      };

      const handleStatusChange = (row) => {
            setStateChangeStatus(row); // You can set only relevant data if needed
            setShowStatusChangeModal(true);
      };

      const handleImageClick = (imageUrl, title) => {
            setSelectedImage(imageUrl);
            setImgModalTitle(title);
            setImgModalShow(true);
      };


      const previewQuotationBtnClick = (row, isDownloadMode = false) => {


            {
                  setModelRequestData({
                        ...modelRequestData,
                        leadName: row.leadName,
                        requirement: row.requirement,
                        Action: 'FromPendingForApproval',
                        BTNAction: null,
                        showDownloadButton: isDownloadMode,
                  });
            }


            navigate('/quotation-preview', {
                  state: {
                        quotationKeyID: row.quotationKeyID,
                        action: 'FromPendingForApproval', BTNAction: 'Hide',
                        showDownloadButton: isDownloadMode, // pass true or false
                  }
            });
      };

      return (
            <>
                  <div className="card w-full max-w-[50vh] mx-auto h-auto">
                        <div className="card-body p-2 bg-white shadow-md rounded-lg">
                              {/* Top controls */}

                              <div className="d-flex justify-content-between align-items-center mb-1">
                                    <h5 className="m-0">Quotation Log</h5>
                                    <button
                                          onClick={() => addMasterCompanyBtnClick()}
                                          className="btn btn-primary btn-sm d-inline d-sm-none"
                                    >
                                          <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
                                          <span className="d-inline d-sm-none">  Add</span>
                                    </button>
                              </div>
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                    <input
                                          type="text"
                                          className="form-control "
                                          placeholder="Search Quotation "
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
                                          <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                                                <tr className="text-nowrap">
                                                      <th className="text-center">Sr No.</th>
                                                      <th className="text-center">Lead Name</th>
                                                      <th className="text-center">Requirement</th>
                                                      <th className="text-center">Address</th>
                                                      <th className="text-center">Quotation No Format</th>
                                                      <th className="text-center">Reviewed  By</th>
                                                      <th className="text-center">Quotation Date</th>

                                                      <th className="text-center actionSticky">Action</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                {stateListData?.map((row, idx) => (
                                                      <tr key={idx}>
                                                            <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                                                            <td className="text-center">{row.leadName || '-'}</td>

                                                            <td className="text-center">{row.requirement || '-'}</td>
                                                            <td className="text-center">{row.address || '-'}</td>
                                                            <td className="text-center">{row.quotationNumberFormat || '-'}</td>
                                                            <td className="text-center">{row.reviewedEmployeeBy || '-'}</td>
                                                            <td className="text-center">{row.quotationDate || '-'}</td>




                                                            <td className="text-center actionColSticky" style={{ zIndex: 4 }}>
                                                                  <div className="d-inline-flex justify-content-center align-items-center" style={{ gap: '10px' }}>

                                                                        <Tooltip title="Download / View Quotation ">
                                                                              <button
                                                                                    className="btn-sm btn text-white"
                                                                                    style={{ background: '#ffaa33' }}
                                                                                    onClick={() => previewQuotationBtnClick(row, true)}
                                                                              >
                                                                                    <i className="fa-solid fa-eye"></i>
                                                                                    {" "} View
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
                              <div className="d-flex justify-content-end align-bottom mt-3">
                                    {totalCount > pageSize && (
                                          <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
                                    )}
                              </div>
                        </div>
                  </div>




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

export default QuotationLogsList;
