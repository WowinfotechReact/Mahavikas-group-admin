import React, { useState, useEffect, useContext } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { ConfigContext } from 'context/ConfigContext';
import dayjs from 'dayjs';
import AddUpdateMasterTalukaModal from './MasterTalukaModal';
import { ChangeTalukaStatus, GetTalukaList } from 'services/Master Crud/MasterTalukaApi';
import { useNavigate } from 'react-router';
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
  const navigate = useNavigate();
  const [tableRow, setTableRow] = useState([])
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

  useEffect(() => {

    GetTalukaListData(1, null, null, null)

  }, [isAddUpdateActionDone, appliedFilter])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetTalukaListData(pageNumber, null, null, null)
  };


  const handleStatusChange = async () => {
    try {
      let res = null;
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

  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");

  const fullText = "Search By Taluka Name / District  Namee";

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


  const addMasterTalukaBtnClick = () => {

    setOpenMasterTalukaModal(true)
  }
  const closeAllModal = () => {
    setShowSuccessModal(false);
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
    GetTalukaListData(1, capitalizedValue, toDate, fromDate);
  };


  const GetTalukaListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    // debugger
    setLoader(true);
    try {
      const data = await GetTalukaList({
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
              <h5 className="tracking-in-contract">Taluka</h5>
            </div>
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
              className="form-control"
              placeholder={animatedPlaceholder}
              style={{ maxWidth: '350px' }}
              value={searchKeyword}
              onChange={(e) => {
                handleSearch(e);
              }}
            />
            <Tooltip title="Add Taluka">
              <button
                onClick={() => {
                  setModelRequestData({
                    Action: 'Add'
                  })
                  addMasterTalukaBtnClick()
                }}
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
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1, background: 'white' }}>
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
                        <Android12Switch style={{ padding: '8px' }} onClick={() => { setShowStatusChangeModal(true); setChangeStatusKey(row.talukaKeyID); setModelAction("Status Updated Successfully!") }} checked={row.status === 'Active'} />
                      </Tooltip>{' '}
                    </td>
                    {/* <td className="text-center">{row.status === true ? 'True' : 'false'}</td> */}
                    {/* <td className="text-center">{row.createdOnDate ? dayjs(row.createdOnDate).format('DD/MM/YYYY') : '-'}</td> */}
                    <td className="text-center">
                      <Tooltip title="Update Taluka">
                        <button onClick={() => {
                          setModelRequestData({
                            Action: 'Update',
                            talukaKeyID: row.talukaKeyID
                          })
                          addMasterTalukaBtnClick(row)
                        }} type="button" className="btn-sm btn btn-primary" style={{ background: '#ffaa33', border: '#ffaa33' }}>
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
