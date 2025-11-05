import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router';

import { ConfigContext } from 'context/ConfigContext';
import dayjs from 'dayjs';
import PaginationComponent from 'component/Pagination';
import SuccessPopupModal from 'component/SuccessPopupModal';
import StatusChangeModal from 'component/StatusChangeModal ';
import Android12Switch from 'component/Android12Switch';
import NoResultFoundModel from 'component/NoResultFoundModal';
import AddUpdateVillageModal from './AddUpdateVillageModal';
import { ChangeVillageStatus, GetVillageList } from 'services/Master Crud/MasterVillageApi';
import { Tooltip } from '@mui/material';

const MasterVillageList = () => {
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
  const [villageListData, setVillageListData] = useState([]);
  const [openMasterVillageModal, setOpenMasterVillageModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState();
  const [modelRequestData, setModelRequestData] = useState({
    stateID: null,
    stateName: null,
    Action: null,
    talukaID: null
  });

 
  useEffect(() => {
    // debugger
    if (isAddUpdateActionDone) {
      setSearchKeyword('')
      setCurrentPage(1)
      GetMasterVillageListData(1, null, toDate, fromDate);
    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    GetMasterVillageListData(1, null, toDate, fromDate);
  }, [setIsAddUpdateActionDone]);

 

  const GetMasterVillageListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    setLoader(true);
    try {
      const data = await GetVillageList({
        pageSize,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        sortingDirection: null,
        userKeyID: user.userKeyID,
        sortingColumnName: null
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const MasterVillageListData = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(MasterVillageListData.length);
            setVillageListData(MasterVillageListData);
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
    GetMasterVillageListData(1, capitalizedValue, toDate, fromDate);
  };


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetMasterVillageListData(pageNumber, null, toDate, fromDate);
  };

  const closeAll = () => {
    setShowSuccessModal(false);
  };

  const handleClearDates = () => {
    setCurrentPage(1);
    setToDate(null);
    setFromDate(null);
    GetMasterVillageListData(1, null, null, null);
  };

  const addMasterVillageBtnClick = () => {
    setModelRequestData({
      ...modelRequestData,
      Action: null,
      stateID: null,
      userKeyID: null,
      districtID: null
    });
    setOpenMasterVillageModal(true);
  };
  const EditMasterVillageBtnClick = (row) => {
    setModelRequestData({
      ...modelRequestData,
      Action: 'Update',
      villageID: row.villageID
    });
    setOpenMasterVillageModal(true);
  };
  const closeAllModal = () => {
    // onHide();
    setShowSuccessModal(false);
  };

  const confirmStatusChange = async (row, user) => {
    setLoader(true)
    // debugger
    try {
      const { villageID } = row; // Destructure to access only what's needed
      const response = await ChangeVillageStatus(villageID, user.userKeyID);

      if (response && response.data.statusCode === 200) {
        setLoader(false)
        // Successfully changed the status
        setShowStatusChangeModal(false);
        setStateChangeStatus(null);
        GetMasterVillageListData(currentPage, null, toDate, fromDate);
        setShowSuccessModal(true);
        setModelAction('Village status changed successfully.');
      } else {
        setLoader(false)
        console.error(response?.data?.errorMessage);
        setShowSuccessModal(true);
        setModelAction('Failed to change Village status.');
      }
    } catch (error) {
      setLoader(false)
      console.error('Error changing Village status:', error);
      setShowSuccessModal(true);
      setModelAction('An error occurred while changing the Village status.');
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
      <h5 className="m-0">Village</h5>
      <button
    onClick={() => addMasterVillageBtnClick()}
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
        placeholder="Search Vilalge"
        style={{ maxWidth: "350px" }}
        value={searchKeyword}
        onChange={(e) => {
          handleSearch(e);
        }}
      />
      <Tooltip title="Add Village">
      <button
    onClick={() => addMasterVillageBtnClick()}
    className="btn btn-primary btn-sm d-none d-sm-inline"
  >
    <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
    <span className="d-none d-sm-inline"> Add Village</span>
  </button>
      </Tooltip>
    </div>

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: '60vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                <tr>
                  <th className="text-center">Sr No</th>
                  <th className="text-center">Village Name</th>
                  <th className="text-center">Taluka Name</th>
                  <th className="text-center">District Name</th>
                  <th className="text-center">State Name</th>
                  <th className="text-center">Status</th>
                  {/* <th className="text-center">Created On</th> */}
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {villageListData?.map((row, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="text-center">{row.villageName}</td>
                    <td className="text-center">{row.talukaName}</td>
                    <td className="text-center">{row.districtName}</td>
                    <td className="text-center">{row.stateName}</td>
                    <td className="text-center">
                      <Tooltip title={row.status === true ? 'Enable' : 'Disable'}>
                      {row.status === true ? 'Enable' : 'Disable'}  
                      <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(row)} checked={row.status === true} />
                      </Tooltip></td>
                    <td className="text-center">
                      <Tooltip title='Update Village'>
                      <button onClick={() => EditMasterVillageBtnClick(row)} type="button" className="btn-sm btn btn-primary">
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

        {openMasterVillageModal && (
          <AddUpdateVillageModal
            show={openMasterVillageModal}
            onHide={() => setOpenMasterVillageModal(false)}
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

export default MasterVillageList;
