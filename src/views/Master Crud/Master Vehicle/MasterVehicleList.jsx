import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ConfigContext } from 'context/ConfigContext';
import dayjs from 'dayjs';
import PaginationComponent from 'component/Pagination';
import MasterVehicleModal from './MasterVehicleModal';
import { ChangeVehicleTypeStatus, GetVehicleTypeList } from 'services/Master Crud/MasterVehicleTypeApi';
import NoResultFoundModel from 'component/NoResultFoundModal';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import Android12Switch from 'component/Android12Switch';
import { Tooltip } from '@mui/material';

const MasterVehicleList = () => {
  const [totalRecords, setTotalRecords] = useState(-1);
  const { setLoader, user } = useContext(ConfigContext);
  const [stateChangeStatus, setStateChangeStatus] = useState('');
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [modelAction, setModelAction] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalCount, setTotalCount] = useState(null);
  const [pageSize, setPageSize] = useState(30);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);
  const [vehicleTypeListData, setVehicleTypeListData] = useState([]);
  const [openMasterDistrictModal, setOpenMasterDistrictModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState();
  const [modelRequestData, setModelRequestData] = useState({
    stateID: null,
    stateName: null,
    Action: null,
    talukaID: null
  });


  useEffect(() => {
    if (isAddUpdateActionDone) {
      GetMasterVehicleTypeListData(1, null, toDate, fromDate);
      setSearchKeyword('')

    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    GetMasterVehicleTypeListData(1, null, toDate, fromDate);
  }, [setIsAddUpdateActionDone]);

  

  const GetMasterVehicleTypeListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    setLoader(true);
    try {
      const data = await GetVehicleTypeList({
        pageSize,
        userKeyID: user.userKeyID,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        sortingDirection: null,
        sortingColumnName: null
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const MasterVehicleTypeListData = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(MasterVehicleTypeListData.length);
            setVehicleTypeListData(MasterVehicleTypeListData);
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


  const handleSearch = (e) => {
    let searchKeywordValue = e.target.value;
    const trimmedValue = searchKeywordValue.replace(/^\s+/g, '');
    const capitalizedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1).toLowerCase();
    if (searchKeywordValue.length === 1 && searchKeywordValue.startsWith(' ')) {
      searchKeywordValue = searchKeywordValue.trimStart();
      return;
    }
    setSearchKeyword(capitalizedValue);
    GetMasterVehicleTypeListData(1, capitalizedValue, toDate, fromDate);
  };


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetMasterVehicleTypeListData(pageNumber, null, toDate, fromDate);
  };

  const closeAll = () => {
    setShowSuccessModal(false);
  };

  const handleClearDates = () => {
    setCurrentPage(1);
    setToDate(null);
    setFromDate(null);
    GetMasterVehicleTypeListData(1, null, null, null);
  };

  const addMasterVehicleTypeBtnClick = () => {
    setModelRequestData({
      ...modelRequestData,
      Action: null,
      stateID: null,
      userKeyID: null,
      districtID: null
    });
    setOpenMasterDistrictModal(true);
  };
  const EditMasterVehicleTypeBtnClick = (row) => {
    setModelRequestData({
      ...modelRequestData,
      Action: 'Update',
      vehicleTypeKeyID: row.vehicleTypeKeyID
    });
    setOpenMasterDistrictModal(true);
  };
  const closeAllModal = () => {
    setShowSuccessModal(false);
  };
  const handleStatusChange = (row) => {
    setStateChangeStatus(row); // You can set only relevant data if needed
    setShowStatusChangeModal(true);
  };

  const confirmStatusChange = async (row, user) => {
    setLoader(true)
    try {
      const { vehicleTypeKeyID } = row; // Destructure to access only what's needed
      const response = await ChangeVehicleTypeStatus(vehicleTypeKeyID, user.userKeyID);

      if (response && response.data.statusCode === 200) {
        setLoader(false)
        setShowStatusChangeModal(false);
        setStateChangeStatus(null);
        GetMasterVehicleTypeListData(currentPage, null, null, null);
        setShowSuccessModal(true);
        setModelAction('Vehicle Type status changed successfully.');
      } else {
        setLoader(false)
        console.error(response?.data?.errorMessage);
        setShowSuccessModal(true);
        setModelAction('Failed to change Vehicle Type status.');
      }
    } catch (error) {
      setLoader(false)
      console.error('Error changing Vehicle Type status:', error);
      setShowSuccessModal(true);
      setModelAction('An error occurred while changing the Vehicle Type status.');
    }
  };

  return (
    <>
      <div className="card w-full max-w-[50vh] mx-auto h-auto">
        <div className="card-body p-2 bg-white shadow-md rounded-lg">
        <div className="d-flex justify-content-between align-items-center mb-1">
      <h5 className="m-0">Vehicle Type</h5>
      <button
    onClick={() => addMasterVehicleTypeBtnClick()}
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
        placeholder="Search Vehicle Type"
        style={{ maxWidth: "350px" }}
        value={searchKeyword}
        onChange={(e) => {
          handleSearch(e);
        }}
      />
      <Tooltip title="Add Vehicle Type">
      <button
    onClick={() => addMasterVehicleTypeBtnClick()}
    className="btn btn-primary btn-sm d-none d-sm-inline"
  >
    <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
    <span className="d-none d-sm-inline"> Add Vehicle Type</span>
  </button>
      </Tooltip>
    </div>

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: '52vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                <tr>
                  <th className="text-center">Sr No</th>
                  <th className="text-center">Vehicle Type Name</th>
                  <th className="text-center">Vehicle Amt ⟨₹⟩</th>
                  <th className="text-center">Status</th>
                  {/* <th className="text-center">Created On</th> */}
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {vehicleTypeListData?.map((row, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="text-center">{row.vehicleTypeName}</td>
                    {/* <td className="text-center">{row.vehicleAmount}</td> */}
                    <td className="text-center">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'decimal',
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0
                      }).format(Math.round(row.vehicleAmount))}
                    </td>
                    <td className="text-center">
                      {' '}
                      <Tooltip title={row.status === true ? 'Enable' : 'Disable'}>
                      {row.status === true ? 'Enable' : 'Disable'}
                      <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(row)} checked={row.status === true} />
                      </Tooltip> </td>
                    {/* <td className="text-center">{row.createdOnDate ? dayjs(row.createdOnDate).format('DD/MM/YYYY') : '-'}</td> */}
                    <td className="text-center">
                      <Tooltip title='Update Vehicle Type'>
                      <button onClick={() => EditMasterVehicleTypeBtnClick(row)} type="button" className="btn-sm btn btn-primary">
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

        {openMasterDistrictModal && (
          <MasterVehicleModal
            show={openMasterDistrictModal}
            onHide={() => setOpenMasterDistrictModal(false)}
            modelRequestData={modelRequestData}
            setModelRequestData={setModelRequestData}
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
      </div>
    </>
  );
};

export default MasterVehicleList;
