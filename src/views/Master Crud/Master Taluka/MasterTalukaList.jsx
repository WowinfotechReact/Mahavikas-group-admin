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
  const [changeStatusKey, setChangeStatusKey] = useState('');
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(-1);
  const { setLoader, user } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [tableRow,setTableRow]=useState([])
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
    talukaKeyID: null
  });

  const [appliedFilter, setAppliedFilter] = useState({
            pageSize: pageSize,
            pageNo: 0,
            searchKeyword: null,
            fromDate: null,
            toDate: null
        })
        
   useEffect(()=>{

      GetTalukaListData()
    
    },[isAddUpdateActionDone,appliedFilter]) 
        
    const GetTalukaListData = async () => {
      
              try {
                  
                  let response = null;
                      response = await GetTalukaList({
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

  const handleStatusChange = async()=>{
            try {
              let res=null;
                        res = await ChangeTalukaStatus(changeStatusKey);
                        if (res?.data?.statusCode === 200) {
                          setShowStatusChangeModal(false)
                          setIsAddUpdateActionDone(!isAddUpdateActionDone)
                          setShowSuccessModal(true)
                        }
                    } catch (error) {
                        console.log("error ==>>", error)
                    }
          }

    
  const handleSearch=(searchValue) => {
    setAppliedFilter({ ...appliedFilter, searchKeyword: searchValue })
  }
          
  const addMasterTalukaBtnClick = () => {

    setOpenMasterTalukaModal(true)
  }
  const closeAllModal=()=>{
    setShowSuccessModal(false);
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
              // value={searchKeyword}
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
            />
            <Tooltip title="Add Taluka">
              <button
                onClick={() =>{
                  setModelRequestData({
                    Action:'Add'
                  })
                  addMasterTalukaBtnClick()}}
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
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1, background:'white'}}>
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
                {tableRow?.map((row, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="text-center">{row.talukaName}</td>
                    <td className="text-center">{row.districtName}</td>
                    <td className="text-center">{row.stateName}</td>
                    <td className="text-center">
                      <Tooltip title={row.status === 'Active' ? 'Inactive' : 'Active'}>
                        {row.status === 'Active' ? 'Active' : 'Inactive'}
                        <Android12Switch style={{ padding: '8px' }} onClick={() =>{setShowStatusChangeModal(true); setChangeStatusKey(row.talukaKeyID); setModelAction("Status Updated Successfully!")}} checked={row.status === 'Active'} />
                      </Tooltip>{' '}
                    </td>
                    {/* <td className="text-center">{row.status === true ? 'True' : 'false'}</td> */}
                    {/* <td className="text-center">{row.createdOnDate ? dayjs(row.createdOnDate).format('DD/MM/YYYY') : '-'}</td> */}
                    <td className="text-center">
                      <Tooltip title="Update Taluka">
                        <button  onClick={() =>{
                          setModelRequestData({
                            Action:'Update',
                            talukaKeyID:row.talukaKeyID
                          })  
                          addMasterTalukaBtnClick(row)}} type="button" className="btn-sm btn btn-primary" style={{background:'#ffaa33',border:'#ffaa33'}}>
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
            setShowSuccessModal={setShowSuccessModal}
            setModelAction={setModelAction}
            isAddUpdateActionDone={isAddUpdateActionDone}
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
      </div>
    </>
  );
};

export default MasterTalukaList;
