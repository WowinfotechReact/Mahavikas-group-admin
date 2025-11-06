import React, { useState, useEffect, useContext } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { ConfigContext } from 'context/ConfigContext';
import dayjs from 'dayjs';
import AddUpdateMasterTalukaModal from './MasterTalukaModal';
import { ChangeTalukaStatus, GetTalukaList } from 'services/Master Crud/MasterTalukaApi';
import PaginationComponent from 'component/Pagination';
import SuccessPopupModal from 'component/SuccessPopupModal';
import StatusChangeModal from 'component/StatusChangeModal ';
import Android12Switch from 'component/Android12Switch';
import NoResultFoundModel from 'component/NoResultFoundModal';
import { Tooltip } from '@mui/material';

const MasterTalukaList = () => {
  const [talukaChangeStatus, setTalukaChangeStatus] = useState('');
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
  const [talukaListdata, setTalukaListdata] = useState([]);
  const [openMasterTalukaModal, setOpenMasterTalukaModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState();
  const [modelRequestData, setModelRequestData] = useState({
    stateID: null,
    stateName: null,
    Action: null,
    talukaID: null
  });

  const empData = [
    { stateName: 'MH', districtName: 'Pune', talukaName: 'Shivaji Nagar' },
    { stateName: 'MH', districtName: 'Nashik', talukaName: 'Nashik' },
  ]
  const addMasterTalukaBtnClick = () => {

    setOpenMasterTalukaModal(true)
  }

  return (
    <>
      <div className="card w-full max-w-[50vh] mx-auto h-auto">
        <div className="card-body p-2 bg-white shadow-md rounded-lg">
          {/* Top controls */}
          <div className="d-flex justify-content-between align-items-center mb-1">
            <h5 className="m-0">Taluka</h5>
            <button
              onClick={() => addMasterTalukaBtnClick()}
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
              placeholder="Search Taluka"
              style={{ maxWidth: "350px" }}
              value={searchKeyword}
              onChange={(e) => {
                handleSearch(e);
              }}
            />
            <Tooltip title="Add Taluka">
              <button
                onClick={() => addMasterTalukaBtnClick()}
                style={{ background: '#ffaa33' }} className="btn text-white  btn-sm d-none d-sm-inline"


              >
                <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
                <span className="d-none d-sm-inline"> Add Taluka</span>
              </button>
            </Tooltip>
          </div>

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: '60vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                <tr>
                  <th className="text-center">Sr No</th>
                  <th className="text-center">Taluka Name</th>
                  <th className="text-center">District Name</th>
                  <th className="text-center">State Name</th>
                  <th className="text-center">Status</th>
                  {/* <th className="text-center">Created On</th> */}
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {empData?.map((row, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="text-center">{row.talukaName}</td>
                    <td className="text-center">{row.districtName}</td>
                    <td className="text-center">{row.stateName}</td>
                    <td className="text-center">
                      <Tooltip title={row.status === true ? 'Enable' : 'Disable'}>
                        {row.status === true ? 'Enable' : 'Disable'}
                        <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(row)} checked={row.status === true} />
                      </Tooltip>{' '}
                    </td>
                    {/* <td className="text-center">{row.status === true ? 'True' : 'false'}</td> */}
                    {/* <td className="text-center">{row.createdOnDate ? dayjs(row.createdOnDate).format('DD/MM/YYYY') : '-'}</td> */}
                    <td className="text-center">
                      <Tooltip title="Update Taluka">
                        <button disabled onClick={() => EditMasterTalukaBtnClick(row)} type="button" className="btn-sm btn btn-primary">
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

        {openMasterTalukaModal && (
          <AddUpdateMasterTalukaModal
            show={openMasterTalukaModal}
            onHide={() => setOpenMasterTalukaModal(false)}
            modelRequestData={modelRequestData}
            setModelRequestData={setModelRequestData}
            setIsAddUpdateActionDone={setIsAddUpdateActionDone}
          />
        )}

        <StatusChangeModal
          open={showStatusChangeModal}
          onClose={() => setShowStatusChangeModal(false)}
          onConfirm={() => confirmStatusChange(talukaChangeStatus, user)} // Pass the required arguments
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

export default MasterTalukaList;
