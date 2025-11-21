


import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Android12Switch from 'component/Android12Switch';
import { useNavigate } from 'react-router';

import { ConfigContext } from 'context/ConfigContext';
import { ChangeStateStatus } from 'services/Master Crud/MasterStateApi';

import dayjs from 'dayjs';
// import AddUpdateMasterStateModal from './MasterStateModal';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { Tooltip } from '@mui/material';
import MasterZoneModal from './MasterZoneModal';

import CabinIcon from '@mui/icons-material/Cabin';
import { ChangeZoneStatus, GetZoneList } from 'services/Master Crud/MasterZoneApi';
import AssignedDistrictModal from './AssignedDistrictModal';
import ViewMappedDistrictModal from './ViewMappedDistrictModal';

const MasterZoneList = () => {
  const [stateChangeStatus, setStateChangeStatus] = useState('');
  const [totalRecords, setTotalRecords] = useState(-1);
  const { setLoader, user, companyID } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState();
  const navigate = useNavigate();
  const [showDistrictModal, setShowDistrictModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalCount, setTotalCount] = useState(null);
  const [pageSize, setPageSize] = useState(30);
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [apiParams, setApiParams] = useState(null); // State to store API parameters
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);
  const [stateListData, setStateListData] = useState([]);
  const [openMasterStateModal, setOpenMasterStateModal] = useState(false);
  const [openSetDistrictModal, setOpenSetDistrictModal] = useState(false);
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
    if (apiParams) {
      handleApiCall(apiParams); // Trigger API call with the params
    }
  }, [apiParams]);
  useEffect(() => {
    // debugger
    if (isAddUpdateActionDone) {
      GetMasterZoneListData(1, null, toDate, fromDate);
      setSortingDirection(null);
      setSearchKeyword('')

    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    GetMasterZoneListData(1, null, toDate, fromDate);
  }, [setIsAddUpdateActionDone]);

  const handleApiCall = async (params) => {
    // //setLoader(false)(true);
    const formData = new FormData();
    formData.append('File', params.File); // Attach the PDF file

    try {
      const response = await AddUpdatePDF(
        {
          ModuleID: params.ModuleID,
          ModuleName: params.ModuleName
        },
        formData
      );

      if (response.data.statusCode === 200) {
        // //setLoader(false)(false);
        setShowSuccessModal(true);
        setModelAction('PDF Uploaded Successfully!');
        setIsAddUpdateActionDone(true);
      } else {
        //setLoader(false)(false);
        setErrorMessage(result.errorMessage);
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      //setLoader(false)(false);
      setErrorMessage('An error occurred while uploading the PDF.');
    }
  };

  const mapDistrictZoneBtn = (row) => {

    navigate('/mapped-city', { state: { Value: row } })
  }


  const GetMasterZoneListData = async (pageNumber, searchKeywordValue, toDate, fromDate, sortValue, StateSortType) => {
    // debugger
    setLoader(true);
    try {
      const data = await GetZoneList({
        pageSize,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        sortingDirection: sortValue === undefined ? sortingDirection : sortValue,

        sortingColumnName: sortType == '' ? StateSortType : sortType || null,

        userKeyID: user.userKeyID,
        // userKeyID: null,
        companyID: Number(companyID)
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
    // onHide();
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
    GetMasterZoneListData(1, capitalizedValue, toDate, fromDate);
  };


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetMasterZoneListData(pageNumber, null, toDate, fromDate);
  };


  const addMasterZoneBtnClick = () => {
    setModelRequestData({
      ...modelRequestData,
      Action: null,
      zoneKeyID: null
    });
    setOpenMasterStateModal(true);
  };


  const handleStatusChange = (row) => {
    setStateChangeStatus(row); // You can set only relevant data if needed
    setShowStatusChangeModal(true);
  };

  const confirmStatusChange = async (row, user) => {
    // debugger
    try {
      const { zoneKeyID } = row; // Destructure to access only what's needed
      const response = await ChangeZoneStatus(zoneKeyID, user.userKeyID);

      if (response && response.data.statusCode === 200) {
        // Successfully changed the status
        setShowStatusChangeModal(false);
        setStateChangeStatus(null);
        GetMasterZoneListData(currentPage, null, toDate, fromDate);
        setShowSuccessModal(true);
        setModelAction('Zone status changed successfully.');
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



  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");

  const fullText = "Search By Zone Namee";
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
  return (
    <>
      <div className="card w-full max-w-[50vh] mx-auto h-auto">
        <div className="card-body p-2 bg-white shadow-md rounded-lg">
          {/* Top controls */}
          <div className="d-flex justify-content-between align-items-center mb-1">
            <h5 className="m-0">Zone Manager</h5>
            <button
              onClick={() => addMasterZoneBtnClick()}
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
              placeholder={animatedPlaceholder}
              style={{ maxWidth: "350px" }}
              value={searchKeyword}
              onChange={(e) => {
                handleSearch(e);
              }}
            />
            <Tooltip title="Add Zone">
              <button
                // disabled
                 onClick={() => addMasterZoneBtnClick()}
                className="btn btn-primary btn-sm d-none d-sm-inline"
              >
                <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
                <span className="d-none d-sm-inline"> Add Zone</span>
              </button>
            </Tooltip>
          </div>

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-gradient-orange" style={{ position: 'sticky', top: 0, zIndex: 10, color: '#fff' }}>

                <tr>
                  <th className="text-center">Sr No</th>
                  <th className="text-center">
                    Zone Name

                  </th>
                  <th className="text-center">Status</th>
                  {/* <th className="text-center">Created On</th> */}
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {stateListData?.map((row, idx) => (
                  <tr key={idx}>
                    <td className="text-center">
                      <span className="index-badge">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </span>
                    </td>

                    <td className="text-center">
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          animation: "fadeUp 0.4s ease-out"
                        }}
                      >
                        <i
                          className="fa-solid fa-location-crosshairs"
                          style={{
                            color: "#ff7d34",               // matches your orange theme
                            animation: "floatIcon 1.5s ease-in-out infinite"
                          }}
                        ></i>
                        {row.zoneName}
                      </span>
                    </td>
                    <td className="text-center">
                      <Tooltip title={row.status === true ? 'Inactive' : 'Active'}>
                        {row.status === true ? 'Active' : 'Inactive'}
                        <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(row)} checked={row.status === 'Active'} />
                      </Tooltip>
                    </td>
                    {/* <td className="text-center">{row.createdOnDate ? dayjs(row.createdOnDate).format('DD/MM/YYYY') : '-'}</td> */}
                    <td className="text-center">
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>

                        <Tooltip title="Map District">
                          <button
                            style={{
                              padding: '4px 8px',
                              fontSize: '12px',
                              height: '32px',
                              width: '44px', background: '#ffaa33', color: 'white'
                            }}
                            onClick={() => mapDistrictZoneBtn(row)}
                            type="button"
                            className="btn-sm btn "
                          >
                            <CabinIcon fontSize="small" />
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
          <div className="d-flex justify-content-end ">
            {totalCount > pageSize && (
              <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
            )}
          </div>
        </div>
      </div>

      {openMasterStateModal && (
        <MasterZoneModal
          show={openMasterStateModal}
          onHide={() => setOpenMasterStateModal(false)}
          modelRequestData={modelRequestData}
          setModelRequestData={setModelRequestData}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        />
      )}
      {openSetDistrictModal && (
        <AssignedDistrictModal
          show={openSetDistrictModal}
          onHide={() => setOpenSetDistrictModal(false)}
          modelRequestData={modelRequestData}
          setModelRequestData={setModelRequestData}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        />
      )}
      {showDistrictModal && (
        <ViewMappedDistrictModal
          show={showDistrictModal}
          onHide={() => setShowDistrictModal(false)}
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
    </>
  );
};

export default MasterZoneList;
