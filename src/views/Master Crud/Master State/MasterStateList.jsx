import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Android12Switch from 'component/Android12Switch';
import { ConfigContext } from 'context/ConfigContext';
import { ChangeStateStatus, MasterStatGetStateList } from 'services/Master Crud/MasterStateApi';
import dayjs from 'dayjs';
import AddUpdateMasterStateModal from './MasterStateModal';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { Tooltip } from '@mui/material';

const MasterStateList = () => {
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
  const addMasterStateBtnClick = () => {
    setModelRequestData({
      stateID: null,
      stateName: null,
      Action: null
    });
    setOpenMasterStateModal(true);
  }

  const empData = [
    { stateName: 'MH' },
    { stateName: 'Himchal Pradesh' },
  ]
  return (
    <>
      <div className="card w-full max-w-[50vh] mx-auto h-auto">
        <div className="card-body p-2 bg-white shadow-md rounded-lg">
          {/* Top controls */}
          <div className="d-flex justify-content-between align-items-center mb-1">
            <h5 className="m-0">State</h5>

            <button
              onClick={() => addMasterStateBtnClick()}
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
              placeholder="Search State"
              style={{ maxWidth: "350px" }}
              value={searchKeyword}
              onChange={(e) => {
                handleSearch(e);
              }}
            />
            <Tooltip title="Add State">
              <button
                onClick={() => addMasterStateBtnClick()}
                style={{ background: '#ffaa33' }} className="btn text-white  btn-sm d-none d-sm-inline"

              >
                <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
                <span className="d-none d-sm-inline"> Add State</span>
              </button>
            </Tooltip>
          </div>

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                <tr>
                  <th className="text-center">Sr No</th>
                  <th className="text-center">
                    State Name
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
                {empData?.map((row, idx) => (
                  <tr className='text-nowrap' key={idx}>
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="text-center">{row.stateName}</td>
                    <td className="text-center">
                      <Tooltip title={row.status === true ? 'Enable' : 'Disable'}>
                        {row.status === true ? 'Enable' : 'Disable'}
                        <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(row)} checked={row.status === true} />
                      </Tooltip>
                    </td>
                    {/* <td className="text-center">{row.createdOnDate ? dayjs(row.createdOnDate).format('DD/MM/YYYY') : '-'}</td> */}
                    <td className="text-center">
                      <Tooltip title="Update State">
                        <button
                          disabled
                          style={{
                            padding: '4px 8px', // Adjust padding for smaller size
                            fontSize: '12px', // Optional: smaller font size
                            height: '28px', // Set height
                            width: '28px' // Set width
                          }}
                          onClick={() => EditMasterStateBtnClick(row)}
                          type="button"
                          className="btn-sm btn btn-primary"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-end ">

          </div>
        </div>
      </div>

      {openMasterStateModal && (
        <AddUpdateMasterStateModal
          show={openMasterStateModal}
          onHide={() => setOpenMasterStateModal(false)}
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

export default MasterStateList;
