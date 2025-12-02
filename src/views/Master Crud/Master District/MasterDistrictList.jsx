import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Android12Switch from 'component/Android12Switch';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { ConfigContext } from 'context/ConfigContext';
import dayjs from 'dayjs';
import AddUpdateMasterDistrictModal from './MasterDistrictModal';
import { ChangeDistrictStatus, GetDistrictList } from 'services/Master Crud/MasterDistrictApi';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { Toolbar, Tooltip } from '@mui/material';

const MasterDistrictList = () => {
  const [stateChangeStatus, setStateChangeStatus] = useState('');
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);

  const [totalRecords, setTotalRecords] = useState(-1);
  const { setLoader, user } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalCount, setTotalCount] = useState(null);
  const [pageSize, setPageSize] = useState(30);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [showMachineModal, setShowMachineModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [changeStatusKey, setChangeStatusKey] = useState('');
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);
  const [tableRow,setTableRow]=useState([])
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [stateListData, setStateListData] = useState([]);
  const [openMasterDistrictModal, setOpenMasterDistrictModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState();
  const [modelRequestData, setModelRequestData] = useState({
    districtKeyID: null,
    districtName: null,
    stateID: null,
    Action: null
  });

  const [appliedFilter, setAppliedFilter] = useState({
          pageSize: pageSize,
          pageNo: 0,
          searchKeyword: null,
          fromDate: null,
          toDate: null
      })

  const addMasterDistrictBtnClick = () => {
    setOpenMasterDistrictModal(true)
  }

   useEffect(()=>{
    GetDistrictListData()
    },[isAddUpdateActionDone,appliedFilter])
  
    
      const GetDistrictListData = async () => {
  
          try {
              
              let response = null;
                  response = await GetDistrictList({
                      ...appliedFilter,
                  });
                    
                  if (response?.data?.statusCode === 200) {
                    console.log("enter")  
                    const { data, totalRecords } = response.data.responseData;
  
                      setTableRow(data || []);
                      setTotalRecords(totalRecords || data?.length || 0);
                    
                      
                      
                  } else {
                      console.warn("Unexpected API response", response);
                      setTableRow([]);
                  }
                  } catch (error) {
              console.error("Error fetching category list:", error);
          } finally {
              
          }
            
      };

       const confirmStatusChange=()=>{
    setShowStatusChangeModal(true)
  }

      const handleStatusChange = async()=>{
          try {
            let res=null;
                      res = await ChangeDistrictStatus(changeStatusKey);
                      if (res?.data?.statusCode === 200) {
                        setShowStatusChangeModal(false)
                        setIsAddUpdateActionDone(!isAddUpdateActionDone)
                        setShowSuccessModal(true)
                      }
                  } catch (error) {
                      console.log("error ==>>", error)
                  }
        }
        const closeAllModal=()=>{
    setShowSuccessModal(false);
  }

  const handleSearch=(searchValue) => {
    setAppliedFilter({ ...appliedFilter, searchKeyword: searchValue })
  }

  // const empData = [
  //   { stateName: 'MH', districtName: 'Nashik' },
  //   { stateName: 'Himchal Pradesh', districtName: 'Gharwal' },
  // ]

  return (
    <>
      <div className="card w-full max-w-[50vh] mx-auto h-auto">
        <div className="card-body p-2 bg-white shadow-md rounded-lg">
          {/* Top controls */}
          <div className="d-flex justify-content-between align-items-center mb-1">

            <button
                              // className="btn btn-light p-1 me-2"
                              className="btn btn-outline-secondary btn-sm me-2"

                              // style={{ borderRadius: "50%", width: "36px", height: "36px" }}
                              onClick={() => navigate(-1)}
                              >
                              <i className="fa-solid fa-arrow-left"></i>

                        </button>
                        <div className='flex-grow-1'>
            <h5 className="m-0">District</h5>
            </div>
            <button
              onClick={() => addMasterDistrictBtnClick()}
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
              placeholder="Search District"
              style={{ maxWidth: "350px" }}
              // value={searchKeyword}
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
            />
            <Tooltip title="Add District">
              <button
                onClick={() =>{
                  setModelRequestData({
                    Action:"Add",
                    districtKeyID:null
                  })
                  addMasterDistrictBtnClick()}}
                style={{ background: '#ffaa33' }} className="btn text-white  btn-sm d-none d-sm-inline"


              >
                <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
                <span className="d-none d-sm-inline"> Add District</span>
              </button>
            </Tooltip>
          </div>

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: '61vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1, backgroundColor:'white'}}>
                <tr>
                  <th className="text-center">Sr No</th>
                  <th className="text-center">District Name</th>
                  <th className="text-center">State Name</th>
                  <th className="text-center">Status</th>
                  {/* <th className="text-center">Created On</th> */}
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {tableRow.length > 0 &&
                   tableRow.map((row,index) => (
                  <tr key={row.id}>
                    <td className="text-center">{(currentPage - 1) * pageSize + index + 1}</td>
                    <td className="text-center">{row.districtName}</td>
                    <td className="text-center">{row.stateName}</td>
                    <td className="text-center">
                      <Tooltip title={row.status === 'Active' ? 'Inactive' : 'Active'}>
                        {row.status === 'Active' ? 'Active' : 'Inactive'}
                        <Android12Switch style={{ padding: '8px' }} onClick={() =>{ confirmStatusChange(); setChangeStatusKey(row.districtKeyID); setModelAction("Status Updated Successfully!")}}  checked={row.status === 'Active'} />
                      </Tooltip>{' '}
                    </td>
                    {/* <td className="text-center">{row.status===true?'True':'false'}</td> */}
                    {/* <td className="text-center">{row.createdOnDate ? dayjs(row.createdOnDate).format('DD/MM/YYYY') : '-'}</td> */}
                    <td className="text-center">
                      <Tooltip title="Update District">
                        <button style={{ background: '#ffaa33',border:'#ffaa33'}}  onClick={() =>{ 
                          setModelRequestData({
                            Action:"Update",
                            districtKeyID:row.districtKeyID
                          })  
                          addMasterDistrictBtnClick(row)}} type="button" className="btn-sm btn btn-primary">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            { tableRow.length === 0 &&(
                          <NoResultFoundModel
                           />) }
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-end ">

          </div>
        </div>
      </div>

      {openMasterDistrictModal && (
        <AddUpdateMasterDistrictModal
          show={openMasterDistrictModal}
          onHide={() => setOpenMasterDistrictModal(false)}
          modelRequestData={modelRequestData}
          setModelRequestData={setModelRequestData}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
          setShowSuccessModal={setShowSuccessModal}
          isAddUpdateActionDone={isAddUpdateActionDone}
          setModelAction={setModelAction}
        />
      )}
      <StatusChangeModal
        open={showStatusChangeModal}
        onClose={() => setShowStatusChangeModal(false)}
        onConfirm={() => handleStatusChange()} // Pass the required arguments
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

export default MasterDistrictList;
