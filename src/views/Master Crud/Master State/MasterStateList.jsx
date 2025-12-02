import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Android12Switch from 'component/Android12Switch';
import { ConfigContext } from 'context/ConfigContext';
import { ChangeStateStatus, GetStateList} from 'services/Master Crud/MasterStateApi';
import dayjs from 'dayjs';
import AddUpdateMasterStateModal from './MasterStateModal';
import { useNavigate } from 'react-router';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { Tooltip } from '@mui/material';

const MasterStateList = () => {
  const [stateChangeStatusKey, setStateChangeStatusKey] = useState('');
  const [totalRecords, setTotalRecords] = useState(-1);
  const { setLoader, user } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const navigate = useNavigate();
  const [totalCount, setTotalCount] = useState(null);
  const [pageSize, setPageSize] = useState(30);
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  // const [searchKeyword, setSearchKeyword] = useState('');
  // const [fromDate, setFromDate] = useState(null); // Initialize as null
  // const [toDate, setToDate] = useState(null);
  const [stateListData, setStateListData] = useState([]);
  const [openMasterStateModal, setOpenMasterStateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState();
  const [sortingDirection, setSortingDirection] = useState(null);
  const [tableRow,setTableRow]=useState([])
  const [sortDirectionObj, setSortDirectionObj] = useState({
    ServiceNameSort: null
  });
   const [modelRequestData, setModelRequestData] = useState({
    stateID: null,
    stateKeyID:null,
    stateName: "",
    Action: ""
  });
  const [sortType, setSortType] = useState('');
   const [appliedFilter, setAppliedFilter] = useState({
        pageSize: pageSize,
        pageNo: 0,
        searchKeyword: null,
        fromDate: null,
        toDate: null
    })



 
  useEffect(()=>{
  GetStateListData()
  },[isAddUpdateActionDone,appliedFilter])

  
    const GetStateListData = async () => {

        try {
            
            let response = null;
                response = await GetStateList({
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
console.log(tableRow)
 
  const addMasterStateBtnClick = () => {
    setModelRequestData({
      stateID: null,
      stateName: null,
      Action: null
    });
    setOpenMasterStateModal(true);
  }

  const handleSearch=(searchValue) => {
    setAppliedFilter({ ...appliedFilter, searchKeyword: searchValue })
  }

  const confirmStatusChange=()=>{
    setShowStatusChangeModal(true)
  }
  
  const handleStatusChange = async()=>{
    try {
      let res=null;
                res = await ChangeStateStatus(stateChangeStatusKey);
                if (res?.data?.statusCode === 200) {
                  console.log("enter")
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
                        <div className="flex-grow-1 ">
            <h5 className="m-0">State</h5>
              </div>
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
              // value={searchKeyword}
               onChange={(e) => handleSearch(e.target.value)}
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
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1, backgroundColor:'white' }}>
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
                  <th className="text-center">Action </th>
                </tr>
              </thead>
              <tbody>
                 {tableRow.length > 0 &&
                   tableRow.map((obj,index) => ( 
                  <tr className='text-nowrap'  key={obj.id}>
              
                    <td className="text-center">
                       {(currentPage - 1) * pageSize + index + 1}   
                      </td>
                    
                    <td className="text-center">
                       {obj.stateName}  
                      </td>
                    
                    <td className="text-center">
                      <Tooltip  title={obj.status === "Active" ? 'Inactive' : 'Active'} >
                         { obj.status === "Active" ? 'Active' : 'Inactive' } 
                        <Android12Switch style={{ padding: '8px' }}  onClick={() =>  {confirmStatusChange(); setStateChangeStatusKey(obj.stateKeyID); setModelAction("Status Updated Successfully!")}} checked={obj.status === "Active"}  />
                      </Tooltip>
                    </td>
                     {/* <td className="text-center">{obj.createdOnDate ? dayjs(obj.createdOnDate).format('DD/MM/YYYY') : '-'}</td>  */}
                    <td className="text-center">
                      <Tooltip title="Update State">
                        <button
                          
                          style={{
                            padding: '4px 8px', // Adjust padding for smaller size
                            fontSize: '12px', // Optional: smaller font size
                            height: '28px', // Set height
                            width: '28px', // Set width
                            background: '#ffaa33',
                            border:'#ffaa33'
                          }}
                          onClick={() => {
                            setModelRequestData({
                              Action:"Update",
                              stateKeyID:obj.stateKeyID

                            })
                            setOpenMasterStateModal(true)
                          }}
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
             { tableRow.length === 0 &&(
              <NoResultFoundModel
               />) }
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
    </>
  );
};

export default MasterStateList;
