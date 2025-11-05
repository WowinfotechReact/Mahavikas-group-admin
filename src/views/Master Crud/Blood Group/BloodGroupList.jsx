import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Android12Switch from 'component/Android12Switch';
import { ConfigContext } from 'context/ConfigContext';
import { ChangeStateStatus, MasterStatGetStateList } from 'services/Master Crud/MasterStateApi';
import dayjs from 'dayjs';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { Tooltip } from '@mui/material';
import AddUpdateBloodGroup from './AddUpdateBloodGroup';

const BloodGroupList = () => {








  const employeeTable = [
    { id: 1, bloodGrpName: 'A+', status: true },
    { id: 2, bloodGrpName: 'A-', status: true },
    { id: 3, bloodGrpName: 'B+', status: true },
    { id: 4, bloodGrpName: 'B-', status: true },
    { id: 5, bloodGrpName: 'AB+', status: true },
    { id: 6, bloodGrpName: 'AB-', status: true },
    { id: 7, bloodGrpName: 'O+', status: true },
    { id: 8, bloodGrpName: 'O-', status: true },
  ];





  return (
    <>
      <div className="card w-full max-w-[50vh] mx-auto h-auto">
        <div className="card-body p-2 bg-white shadow-md rounded-lg">
          {/* Top controls */}

          <div className="d-flex justify-content-between align-items-center mb-1">
            <div className="flex-grow-1 text-center">
              <h5 className="mb-0">Blood Group</h5>
            </div>
            <div className="position-absolute end-0 me-2">

            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-2">

            {/* <Tooltip title="Add Blood Group">
              <button onClick={() => addMasterStateBtnClick()} className="btn btn-primary btn-sm d-none d-sm-inline">
                <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                <span className="d-none d-sm-inline">Add</span>
              </button>
            </Tooltip> */}
          </div>

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                <tr>
                  <th className="text-center">Sr No</th>
                  <th className="text-center">
                    Blood Group Name

                  </th>

                </tr>
              </thead>
              <tbody>
                {employeeTable?.map((row, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{idx + 1}</td>
                    <td className="text-center">{row.bloodGrpName}</td>


                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-end ">

          </div>
        </div>
      </div>





    </>
  );
};

export default BloodGroupList;
