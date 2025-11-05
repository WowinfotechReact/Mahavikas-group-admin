import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router';
import { ConfigContext } from 'context/ConfigContext';
import dayjs from 'dayjs';
import PaginationComponent from 'component/Pagination';
import MasterComplaintTypeModal from './MasterComplaintTypeModal';
import { ChangeComplaintTypeStatus, GetComplaintTypeList } from 'services/Master Crud/MasterComplaintTypeApi';
import Android12Switch from 'component/Android12Switch';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModel from 'component/NoResultFoundModal';
import { Tooltip } from '@mui/material';

const MasterComplaintTypeList = () => {
  const [stateChangeStatus, setStateChangeStatus] = useState('');
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(-1);
  const { setLoader, user } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalCount, setTotalCount] = useState(null);
  const [pageSize, setPageSize] = useState(30);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);
  const [complaintTypeListData, setComplaintTypeListData] = useState([]);
  const [openMasterDistrictModal, setOpenMasterDistrictModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState();
  const [modelRequestData, setModelRequestData] = useState({    
    Action: null,    
  });

 
  useEffect(() => {
    if (isAddUpdateActionDone) {
      GetMasterComplaintTypeListData(1, null, toDate, fromDate);
      setSearchKeyword('')
    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    GetMasterComplaintTypeListData(1, null, toDate, fromDate);
  }, [setIsAddUpdateActionDone]);

 

  const GetMasterComplaintTypeListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    setLoader(true);
    try {
      const data = await GetComplaintTypeList({
        pageSize,
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
            setComplaintTypeListData(MasterVehicleTypeListData);
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
    GetMasterComplaintTypeListData(1, capitalizedValue, toDate, fromDate);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetMasterComplaintTypeListData(pageNumber, null, toDate, fromDate);
  };

  const closeAll = () => {
    setShowSuccessModal(false);
  };

  const handleClearDates = () => {
    setCurrentPage(1);
    setToDate(null);
    setFromDate(null);
    GetMasterComplaintTypeListData(1, null, null, null);
  };

  const addMasterComplaintTypeBtnClick = () => {
    setModelRequestData({
      ...modelRequestData,
      Action: null,
      complaintTypeKeyID: null,
      userKeyID: null
    });
    setOpenMasterDistrictModal(true);
  };
  const EditMasterComplaintTypeBtnClick = (row) => {
    setModelRequestData({
      ...modelRequestData,
      Action: 'Update',
      complaintTypeKeyID: row.complaintTypeKeyID
    });
    setOpenMasterDistrictModal(true);
  };
  const closeAllModal = () => {
    setShowSuccessModal(false);
  };

  const confirmStatusChange = async (row, user) => {
    try {
      const { complaintTypeKeyID } = row; // Destructure to access only what's needed
      const response = await ChangeComplaintTypeStatus(complaintTypeKeyID, user.userKeyID);

      if (response && response.data.statusCode === 200) {
        setShowStatusChangeModal(false);
        setStateChangeStatus(null);
        GetMasterComplaintTypeListData(currentPage, null, toDate, fromDate);
        setShowSuccessModal(true);
        setModelAction('Complaint Type status changed successfully.');
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
      <h5 className="m-0">Complaint Type</h5>
      <button
    onClick={() => addMasterComplaintTypeBtnClick()}
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
        placeholder="Search Complaint"
        style={{ maxWidth: "350px" }}
        value={searchKeyword}
        onChange={(e) => {
          handleSearch(e);
        }}
      />
      <Tooltip title="Add Complaint Type">
      <button
    onClick={() => addMasterComplaintTypeBtnClick()}
    className="btn btn-primary btn-sm d-none d-sm-inline"
  >
    <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
    <span className="d-none d-sm-inline"> Add Complaint Type</span>
  </button>
      </Tooltip>
    </div>

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: '60vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 ,  backgroundColor: 'red'}}>
                <tr>
                  <th className="text-center">Sr No</th>
                  <th className="text-center">Complaint Type</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {complaintTypeListData?.map((row, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="text-center">{row.complaintType}</td>
                    <td className="text-center">
                      <Tooltip title= {row.status === true ? 'Enable' : 'Disable'}>
                      {row.status === true ? 'Enable' : 'Disable'}
                      <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(row)} checked={row.status === true} />
                      </Tooltip>    </td>
                    <td className="text-center">
                      <Tooltip title='Update Complaint Type'>
                      <button onClick={() => EditMasterComplaintTypeBtnClick(row)} type="button" className="btn-sm btn btn-primary">
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
          <MasterComplaintTypeModal
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

export default MasterComplaintTypeList;
