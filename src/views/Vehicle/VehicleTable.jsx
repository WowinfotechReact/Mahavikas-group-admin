import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router';
import PaginationComponent from 'component/Pagination';
import { ConfigContext } from 'context/ConfigContext';
import AddUpdateVehicleModal from './AddUpdateVehicleModal';
import { ChangeVehicleStatus, GetVehicleList } from 'services/Vehicle/VehicleApi';
import NoResultFoundModel from 'component/NoResultFoundModal';
import ImageModal from 'component/ImageModal';
import Android12Switch from 'component/Android12Switch';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { Tooltip } from '@mui/material';
import VehicleTableViewModal from './VehicleTableViewModal';

const VehicleTable = () => {
  const [stateChangeStatus, setStateChangeStatus] = useState('');
  const [showVehicleViewModal, setShowVehicleViewModal] = useState(false);
  const [imgModalTitle, setImgModalTitle] = useState('');
  const [imgModalShow, setImgModalShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [totalRecords, setTotalRecords] = useState(-1);
  const { setLoader, user, companyID } = useContext(ConfigContext);
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
      GetVehicleListData(1, null, toDate, fromDate);
      setSearchKeyword('')

    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    GetVehicleListData(1, null, toDate, fromDate);
  }, [setIsAddUpdateActionDone]);

 

  const GetVehicleListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    // debugger
    setLoader(true);
    try {
      const data = await GetVehicleList({
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

 
  const VehicleAddBtnClicked = () => {
    setModelRequestData({
      ...modelRequestData,
      vehicleKeyID: null,
      Action: null
    });
    setShowVehicleModal(true);
  };
  const VehicleEditBtnClicked = (row) => {
    setModelRequestData({
      ...modelRequestData,
      vehicleKeyID: row.vehicleKeyID,
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
    GetVehicleListData(1, capitalizedValue, toDate, fromDate);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetVehicleListData(pageNumber, null, toDate, fromDate);
  };

  const closeAll = () => {
    setShowSuccessModal(false);
  };

  const handleClearDates = () => {
    setCurrentPage(1);
    setToDate(null);
    setFromDate(null);
    GetVehicleListData(1, null, null, null);
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
      const { vehicleKeyID } = row; // Destructure to access only what's needed
      const response = await ChangeVehicleStatus(vehicleKeyID, user.userKeyID);

      if (response && response.data.statusCode === 200) {
        setLoader(false);

        // Successfully changed the status
        setShowStatusChangeModal(false);
        setStateChangeStatus(null);
        GetVehicleListData(currentPage, null, toDate, fromDate);
        // GetMasterDistrictListData(currentPage, null, toDate, fromDate);
        setShowSuccessModal(true);
        setModelAction('Repair status changed successfully.');
      } else {
        setLoader(false);
        console.error(response?.data?.errorMessage);
        setShowSuccessModal(true);
        setModelAction('Failed to change Repair status.');
      }
    } catch (error) {
      setLoader(false);
      console.error('Error changing Repair status:', error);
      setShowSuccessModal(true);
      setModelAction('An error occurred while changing the Repair status.');
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
      sanitizedInput.slice(6, 10) // Repair number (4 digits)
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
  return (
    <>
      {/* <Sidebar drawerOpen={true} drawerToggle={() => {}} modalOpen={show} /> */}
      <div className="card w-full max-w-[50vh] mx-auto h-auto">
        <div className="card-body p-2 bg-white shadow-md rounded-lg">
          {/* Top controls */}
          <div className="d-flex justify-content-between align-items-center mb-1">
      <h5 className="m-0">Repair</h5>
      <button
    onClick={() => VehicleAddBtnClicked()}
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
        placeholder="Search Repair"
        style={{ maxWidth: "350px" }}
        value={searchKeyword}
        onChange={(e) => {
          handleSearch(e);
        }}
      />
      <Tooltip title="Add Repair">
      <button
    onClick={() => VehicleAddBtnClicked()}
    className="btn btn-primary btn-sm d-none d-sm-inline"
  >
    <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
    <span className="d-none d-sm-inline"> Add Repair</span>
  </button>
      </Tooltip>
    </div>

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped">
              <thead style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                <tr className="text-nowrap">
                  <th className="text-center">ID</th>
                  <th className="text-center">Repair No </th>
                  <th className="text-center">Customer Name</th>
                  <th className="text-center">Repair Type</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {vehicleListData?.map((row, idx) => (
                  <tr className="text-nowrap align-middle" key={idx}>
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                    {/* <td className="text-center">{formatVehicleNumber(row.vehicleNumber)}</td> */}
                    <td className="text-center">{row.vehicleNumber}</td>
                    <td className="text-center">{row.customerName}</td>
                    <td className="text-center">{row.vehicleTypeName}</td>
                    <td className="text-center">
                      <Tooltip title={row.status === true ? 'Enable' : 'Disable'}>
                        {row.status === true ? 'Enable' : 'Disable'}
                        <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(row)} checked={row.status === true} />
                      </Tooltip>
                    </td>
                    {/* <td className="text-center">{row.status === true ? 'True' : 'False'}</td> */}

                    <td className="text-center btn-sm">
                      <div className="d-inline-flex justify-content-center align-items-center" style={{ gap: '10px' }}>
                        <Tooltip title="Update Repair">
                          <button
                            style={{
                              padding: '1px',
                              fontSize: '12px',
                              height: '28px',
                              width: '28px'
                              // backgroundColor: '#808080'
                            }}
                            onClick={() => {
                              VehicleEditBtnClicked(row);
                              handleShow();
                            }}
                            type="button"
                            className="btn-sm btn btn-primary"
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                        </Tooltip>
                        <Tooltip title="Customer View">
                          <button
                            type="button"
                            style={{
                              padding: '1px',
                              fontSize: '12px',
                              height: '28px',
                              width: '28px'
                              // backgroundColor: '#808080'
                            }}
                            onClick={() => VehicleViewBtnClicked(row)}
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

          {/* Pagination */}
          <div className="d-flex justify-content-end ">
            {totalCount > pageSize && (
              <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
            )}
          </div>
        </div>
      </div>

      {showVehicleModal && (
        <AddUpdateVehicleModal
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
      <VehicleTableViewModal
        show={showVehicleViewModal}
        onHide={() => setShowVehicleViewModal(false)}
        modelRequestData={modelRequestData}
      />
      <ImageModal show={imgModalShow} onHide={() => setImgModalShow(false)} imageUrl={selectedImage} title={imgModalTitle} />
    </>
  );
};

export default VehicleTable;
