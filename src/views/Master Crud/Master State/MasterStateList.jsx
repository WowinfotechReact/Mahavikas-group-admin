import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Android12Switch from 'component/Android12Switch';
import { ConfigContext } from 'context/ConfigContext';
import { ChangeStateStatus, GetStateList } from 'services/Master Crud/MasterStateApi';
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
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);
  const [stateListData, setStateListData] = useState([]);
  const [openMasterStateModal, setOpenMasterStateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState();
  const [sortingDirection, setSortingDirection] = useState(null);
  const [tableRow, setTableRow] = useState([])
  const [sortDirectionObj, setSortDirectionObj] = useState({
    ServiceNameSort: null
  });
  const [modelRequestData, setModelRequestData] = useState({
    stateID: null,
    stateKeyID: null,
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


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetStateListData(pageNumber, null, null, null)
  };

  useEffect(() => {
    GetStateListData(1, null, null, null)
  }, [isAddUpdateActionDone, appliedFilter])




  const GetStateListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    // debugger
    setLoader(true);
    try {
      const data = await GetStateList({
        pageSize,
        // userKeyID: user.userKeyID,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        toDate: null,
        fromDate: null,

      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const vehicleListData = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(vehicleListData.length);
            setTableRow(vehicleListData);
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

  const addMasterStateBtnClick = () => {
    setModelRequestData({
      stateID: null,
      stateName: null,
      Action: null
    });
    setOpenMasterStateModal(true);
  }




  const handleSearch = (e) => {
    let searchKeywordValue = e.target.value;
    const trimmedValue = searchKeywordValue.replace(/^\s+/g, '');
    const capitalizedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1).toLowerCase();
    if (searchKeywordValue.length === 1 && searchKeywordValue.startsWith(' ')) {
      searchKeywordValue = searchKeywordValue.trimStart();
      return;
    }
    setSearchKeyword(capitalizedValue);
    setCurrentPage(1);
    GetStateListData(1, capitalizedValue, toDate, fromDate);
  };

  const confirmStatusChange = () => {
    setShowStatusChangeModal(true)
  }

  const handleStatusChange = async () => {
    try {
      let res = null;
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

  const closeAllModal = () => {
    setShowSuccessModal(false);
  }
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");

  const fullText = "Search By State Namee";
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
              className="form-control"
              placeholder={animatedPlaceholder}
              style={{ maxWidth: '350px' }}
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
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1, backgroundColor: 'white' }}>
                <tr>
                  <th className="text-center">Sr No</th>
                  <th className="text-center">
                    State Name

                  </th>
                  <th className="text-center">Status</th>
                  {/* <th className="text-center">Created On</th> */}
                  <th className="text-center">Action </th>
                </tr>
              </thead>
              <tbody>
                {tableRow.length > 0 &&
                  tableRow.map((obj, index) => (
                    <tr className='text-nowrap' key={obj.id}>

                      <td className="text-center">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>

                      <td className="text-center">
                        {obj.stateName}
                      </td>

                      <td className="text-center">
                        <Tooltip title={obj.status === "Active" ? 'Inactive' : 'Active'} >
                          {obj.status === "Active" ? 'Active' : 'Inactive'}
                          <Android12Switch style={{ padding: '8px' }} onClick={() => { confirmStatusChange(); setStateChangeStatusKey(obj.stateKeyID); setModelAction("Status Updated Successfully!") }} checked={obj.status === "Active"} />
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
                              border: '#ffaa33'
                            }}
                            onClick={() => {
                              setModelRequestData({
                                Action: "Update",
                                stateKeyID: obj.stateKeyID

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
