import React, { useState, useEffect, useContext } from 'react';
// import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import PaginationComponent from 'component/Pagination';
import { ConfigContext } from 'context/ConfigContext';
import AddUpdateCustomerModal from './AddUpdateCustomerModal';
import { ChangeCustomerStatus, GetCustomerList } from 'services/CustomerStaff/CustomerStaffApi';
import NoResultFoundModel from 'component/NoResultFoundModal';
import ImageModal from 'component/ImageModal';
import { Tooltip } from '@mui/material';
import Android12Switch from 'component/Android12Switch';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import CustomerViewModal from './CustomerViewModal';

const CustomerView = () => {
  const [imgModalTitle, setImgModalTitle] = useState('');
  const [showCustomerViewModel, setShowCustomerViewModel] = useState(false);
  const [imgModalShow, setImgModalShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [totalRecords, setTotalRecords] = useState(-1);
  const { setLoader, user, companyID } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState();
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalCount, setTotalCount] = useState(null);
  const [pageSize, setPageSize] = useState(30);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);
  const [customerListData, setCustomerListData] = useState([]);
  const [errorMessage, setErrorMessage] = useState();
  const [stateChangeStatus, setStateChangeStatus] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState();
  const navigate=useNavigate()
  const [modelRequestData, setModelRequestData] = useState({
    customerID: null,
    customerKeyID: null,
    companyID: null,
    talukaID: null,
    talukaName: null,
    name: null,
    mobileNo: null,
    address: null,
    adharNumber: null,
    adharFrontImageURL: null,
    adharBackImageURL: null,
    status: null,
    createdOnDate: null
  });

  const handleImageClick = (imageUrl, title) => {
    setSelectedImage(imageUrl);
    setImgModalTitle(title);
    setImgModalShow(true);
  };

  useEffect(() => {
    // debugger
    if (isAddUpdateActionDone) {
      setSearchKeyword('');
      setCurrentPage(1);
      GetCustomerListData(1, null, toDate, fromDate);
    }
    setSearchKeyword('')
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    GetCustomerListData(1, null, toDate, fromDate);
  }, [setIsAddUpdateActionDone]);


  const CustomerViewBtnClicked = (row) => {
    setModelRequestData({
      ...modelRequestData,
      customerKeyID: null,
      
    });
    const customerDetailsObj = {
      customerKeyID: row.customerKeyID,
      
    };

    navigate('/customer-details', { state: customerDetailsObj });
  };


  const GetCustomerListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    // debugger
    setLoader(true);
    try {
      const data = await GetCustomerList({
        pageSize,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        userKeyID: user.userKeyID,
        sortingDirection: null,
        sortingColumnName: null,
        companyKeyID: companyID
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const customerListData = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(customerListData.length);
            setCustomerListData(customerListData);
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
  const confirmStatusChange = async (row, user) => {
    // debugger
    try {
      const { customerKeyID } = row; // Destructure to access only what's needed
      const response = await ChangeCustomerStatus(customerKeyID, user.userKeyID);

      if (response && response.data.statusCode === 200) {
        setShowStatusChangeModal(false);
        setStateChangeStatus(null);
        GetCustomerListData(currentPage, null, toDate, fromDate);
        setShowSuccessModal(true);
        setModelAction('Inverter status changed successfully.');
      } else {
        console.error(response?.data?.errorMessage);
        setShowSuccessModal(true);
        setModelAction('Failed to change customer status.');
      }
    } catch (error) {
      console.error('Error changing customer status:', error);
      setShowSuccessModal(true);
      setModelAction('An error occurred while changing the customer status.');
    }
  };

  const CustomerAddBtnClicked = () => {
    setModelRequestData({
      ...modelRequestData,
      adminID: null,
      machineID: null,
      Action: null
    });
    setShowCustomerModal(true);
  };
  const CustomerEditBtnClicked = (row) => {
    {
      setModelRequestData({
        ...modelRequestData,
        customerID: row.customerID,
        // customerKeyID: row.customerKeyID,
        companyID: row.companyID,
        customerKeyID: row.customerKeyID,
        Action: 'Update'
      });
      setShowCustomerModal(true);
    }
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
    GetCustomerListData(1, capitalizedValue, toDate, fromDate, null, null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetCustomerListData(pageNumber, null, toDate, fromDate);
  };

  const closeAllModal = () => {
    // onHide();
    setShowSuccessModal(false);
  };

  const handleClearDates = () => {
    setCurrentPage(1);
    setToDate(null);
    setFromDate(null);
    GetCustomerListData(1, null, null, null);
  };

  const handleStatusChange = (row) => {
    setStateChangeStatus(row); // You can set only relevant data if needed
    setShowStatusChangeModal(true);
  };

  return (
    <>
      <div className="card w-full max-w-[50vh] mx-auto h-auto">
        <div className="card-body p-2 bg-white shadow-md rounded-lg">
          {/* Top controls */}
          <div className="d-flex justify-content-between align-items-center mb-1">
      <h5 className="m-0">Inverter</h5>
      <button
    onClick={() => CustomerAddBtnClicked()}
    className="btn btn-primary btn-sm d-inline d-sm-none"
  >
    <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
    <span className="d-inline d-sm-none">  Add</span>
  </button>
    </div>


    <div className="d-flex justify-content-between align-items-center mb-1">
      <input
        type="text"
        className="form-control"
        placeholder="Search Inverter"
        style={{ maxWidth: "350px" }}
        value={searchKeyword}
        onChange={(e) => {
          handleSearch(e);
        }}
      />
      <Tooltip title="Add Inverter">
      <button
    onClick={() => CustomerAddBtnClicked()}
    className="btn btn-primary btn-sm d-none d-sm-inline"
  >
    <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
    <span className="d-none d-sm-inline"> Add Inverter</span>
  </button>
      </Tooltip>
    </div> 

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                <tr className="text-nowrap">
                  <th className="text-center">ID</th>
                  <th className="text-center">Inverter Name</th>
                  <th className="text-center">Company Name</th>
                  <th className="text-center">Contact No</th>
                  <th className="text-center">State Name</th>
                  <th className="text-center">District Name</th>
                  <th className="text-center">Taluka Name</th>
                  <th className="text-center">Village Name</th>
                  <th className="text-center">Aadhaar No</th>
                  <th className="text-center">Registration Date </th>
                  <th className="text-center">Status</th>
                  <th className="text-center actionSticky">Action</th>
                </tr>
              </thead>
              <tbody>
                {customerListData?.map((row, idx) => (
                  <tr key={idx} className="align-middle text-nowrap">
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="text-center">{row.name || "-"}</td>
                    <td className="text-center">
                                  {row.companyNames?.length > 30 ? (
                                    <Tooltip title={row.companyNames}>{`${row.companyNames?.substring(0, 30)}...`}</Tooltip>
                                  ) : (
                                    <>{row.companyNames}</>
                                  )}
                                </td>
                    <td className="text-center">{row.mobileNo || "-"}</td>
                    <td className="text-center">{row.stateName || "-"}</td>
                    <td className="text-center">{row.districtName || "-"}</td>
                    <td className="text-center">{row.talukaName || "-"}</td>
                    <td className="text-center">{row.villageName || "-"}</td>
                    <td className="text-center">{row.adharNumber || "-"}</td>                    
                    <td className="text-center text-nowrap">{row.createdOnDate}</td>
                    <td className="text-center text-nowrap">
                      <Tooltip title={row.status === true ? 'Enable' : 'Disable'}>
                        {row.status === true ? 'Enable' : 'Disable'}
                        <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(row)} checked={row.status === true} />
                      </Tooltip>
                    </td>
                    <td className="text-center actionColSticky" style={{zIndex:4}}>
                      <div className="d-inline-flex justify-content-center align-items-center " style={{ gap: '10px' }}>
                        <Tooltip title="Update Inverter">
                          <button
                            style={{
                              padding: '4px 8px',
                              fontSize: '12px',
                              height: '28px',
                              width: '28px'
                            }}
                            onClick={() => CustomerEditBtnClicked(row)}
                            className="btn-sm btn btn-primary"
                          >
                            <i className="fa-regular fa-pen-to-square"></i>
                          </button>
                        </Tooltip>

                        <Tooltip title="Inverter View">
                          <button
                            type="button"
                            style={{
                              padding: '1px',
                              fontSize: '12px',
                              height: '28px',
                              width: '28px'
                            }}
                            onClick={() => CustomerViewBtnClicked(row)}
                            className="btn-sm btn btn-primary"
                          >
                            <i className="fa-solid fa-eye"></i>
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

            {/* Pagination */}
          </div>
        </div>
      </div>

      {/* Modal */}
      {/* <Modal show={showModal} handleClose={handleClose} /> */}
      <StatusChangeModal
        open={showStatusChangeModal}
        onClose={() => setShowStatusChangeModal(false)}
        onConfirm={() => confirmStatusChange(stateChangeStatus, user)} // Pass the required arguments
      />
      {showCustomerModal && (
        <AddUpdateCustomerModal
          show={showCustomerModal}
          onHide={() => setShowCustomerModal(false)}
          modelRequestData={modelRequestData}
          isAddUpdateActionDone={isAddUpdateActionDone}
          setModelRequestData={setModelRequestData}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        />
      )}
      <ImageModal show={imgModalShow} onHide={() => setImgModalShow(false)} imageUrl={selectedImage} title={imgModalTitle} />
      {showSuccessModal && (
        <SuccessPopupModal
          show={showSuccessModal}
          onHide={() => closeAllModal()}
          setShowSuccessModal={setShowSuccessModal}
          modelAction={modelAction}
        />
      )}

      <CustomerViewModal show={showCustomerViewModel} onHide={() => setShowCustomerViewModel(false)} modelRequestData={modelRequestData} />
    </>
  );
};

export default CustomerView;
