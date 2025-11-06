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

  const vilalgeData = [
    { villageName: 'nashik', stateName: 'MH', districtName: "Nashik", talukaName: 'Nashik' },
    { villageName: 'nashik', stateName: 'MH', districtName: "Pune", talukaName: 'Shivaji Nagar' }
  ]

  const addMasterVillageBtnClick = () => {
    setOpenMasterVillageModal(true)
  }
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
              placeholder="Search Village"
              style={{ maxWidth: "350px" }}
              value={searchKeyword}
              onChange={(e) => {
                handleSearch(e);
              }}
            />
            <Tooltip title="Add Village">

              <button
                onClick={() => addMasterVillageBtnClick()}
                style={{ background: '#ffaa33' }} className="btn text-white  btn-sm d-none d-sm-inline"


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
                {vilalgeData?.map((row, idx) => (
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
                        <button disabled onClick={() => EditMasterVillageBtnClick(row)} type="button" className="btn-sm btn btn-primary">
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

        {openMasterVillageModal && (
          <AddUpdateVillageModal
            show={openMasterVillageModal}
            onHide={() => setOpenMasterVillageModal(false)}
            modelRequestData={modelRequestData}
            setModelRequestData={setModelRequestData}
            setIsAddUpdateActionDone={setIsAddUpdateActionDone}
          />
        )}

      </div>
    </>
  );
};

export default MasterVillageList;
