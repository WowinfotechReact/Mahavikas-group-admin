import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { ConfigContext } from 'context/ConfigContext';
import Select from 'react-select';
import { Tooltip } from '@mui/material';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PaginationComponent from 'component/Pagination';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { RechargeDropDown } from 'Middleware/Utils';
import ImportCSVModal from 'component/ImportCSVModal';
import { GetRechargeValidityPlanList } from 'services/Recharge/RechargeApi';
import RechargeAddUpdateModal from './RechargeAddUpdateModal';
import NoResultFoundModel from 'component/NoResultFoundModal';

const Recharge = () => {
  const [totalRecords, setTotalRecords] = useState(-1);
  const [modelAction, setModelAction] = useState();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalCount, setTotalCount] = useState(null);
  const [pageSize, setPageSize] = useState(30);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [apiParams, setApiParams] = useState(null); // State to store API parameters
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);
  const [fromDay, setFromDay] = useState(null); // Initialize as null
  const [toDay, setToDay] = useState(null);
  const [customerListData, setCustomerListData] = useState([]);
  const [errorMessage, setErrorMessage] = useState();
  const [rechargeID, setRechargeID] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [rechargeListData, setRechargeListData] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const { user, setLoader } = useContext(ConfigContext);
  const [showRechargeModal, setShowRechargeModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState();
  const [modelRequestData, setModelRequestData] = useState({
    adminID: null,
    RechargeKeyID: null,
    Action: null,
    model: null
  });

  useEffect(() => {
    RechargeDataList(pageSize, 1, null, null, null, null, null, null, null, null);
  }, []);

  useEffect(() => {
    // debugger
    if (isAddUpdateActionDone) {
      RechargeDataList(pageSize, currentPage, null, toDate, fromDate, null, null, null, null, null);
      setSearchKeyword('')

    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);



  const RechargeDataList = async (
    pSize,
    pagenumber,
    searchKeywordValue,
    toDate,
    fromDate,
    sortingType,
    sortValueName,
    fromDay,
    toDay,
    Type
  ) => {
    setLoader(true);
    // debugger;
    try {
      const response = await GetRechargeValidityPlanList({
        pageNo: pagenumber - 1,
        pageSize: pSize,
        sortingDirection: sortingType ? sortingType : null, //or null
        sortingColumnName: sortValueName ? sortValueName : null, //or null
        searchKeyword: searchKeywordValue === undefined || searchKeywordValue === null ? searchKeyword : searchKeywordValue,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        // fromDate: fromDate === undefined || fromDate === null ? null : fromDate,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        // toDate: toDate === undefined || toDate === null ? null : toDate
        userKeyID: user.userKeyID,
        fromDay: fromDay,
        toDay: toDay
      });

      if (Type === 'Excel') {
        setLoader(false);
        return response;
      }

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const RechargeList = response.data.responseData.data;
            const totalCount = response.data.totalCount;

            setTotalCount(totalCount);
            setTotalPages(Math.ceil(totalCount / pageSize));
            setRechargeListData(RechargeList);
            setTotalRecords(RechargeList.length);
          }
        } else {
          console.error(response?.data?.errorMessage);
          setLoader(false);
        }
      }

      // console.log('response', response);
    } catch (error) {
      // setLoader(false);
      console.log(error);
    }
  };


  const rechargeEditBtnClick = (item) => {
    {
      setModelRequestData({
        ...modelRequestData,
        rechargeValidityPlanKeyID: item.rechargeValidityPlanKeyID,
        Action: 'Update'
      });
      setShowRechargeModal(true);
    }
  };

  const handleSearch = (e) => {
    let searchKeywordValue = e.target.value;
    setSearchKeyword(searchKeywordValue);
    RechargeDataList(pageSize, 1, searchKeywordValue, null, null, null, null, null, null, null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // GetCustomerListData(pageNumber, null, toDate, fromDate);
  };

  const closeAll = () => {
    setShowSuccessModal(false);
  };




  const addMasterRechargeBtnClick = () => {
    {
      setModelRequestData({
        ...modelRequestData,
        rechargeValidityPlanKeyID: null,
        Action: null
      });
      setShowRechargeModal(true);
    }




  }

  const handleRechargePageChange = (pagenumber) => {
    setRechargeListData([]);
    setTotalRecords(-1);
    setCurrentPage(pagenumber); // Update the current page based on the clicked page
    RechargeDataList(pageSize, pagenumber, null, toDate, fromDate, null, null, fromDay, toDay, null);
  };







  return (
    <>
      <div className="card w-full h-auto mx-auto">
        <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
          {/* Top controls */}
          {/* <h4>Recharge Followup</h4> */}
          <h4>Recharge </h4>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
            {/* Common Class for Uniform Width on Mobile */}
            <div className="w-100 w-md-auto" style={{ maxWidth: '300px' }}>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => handleSearch(e)}
                className="bg-white border border-black-600 text-gray-700 text-sm rounded-md focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-sky-600 block w-100 pl-4 py-1.5"
                placeholder="Search Recharge"
                style={{ padding: '8px 6px', borderRadius: '5px', outline: 'none' }}
              />
            </div>


            <Tooltip title="Add Recharge">
              <button
                onClick={() => addMasterRechargeBtnClick()}
                className="btn btn-primary btn-sm d-none d-sm-inline"
              >
                <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
                <span className="d-none d-sm-inline"> Add Recharge</span>
              </button>
            </Tooltip>
          </div>

          {/* Table */}
          <div className="table-responsive table_wrapper" style={{ overflowX: 'auto' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-light" style={{ position: 'sticky', top: -1 }}>
                <tr>
                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    Sr No
                  </th>
                  <th className="text-center" style={{ whiteSpace: 'nowrap', width: '10%' }}>
                    Operator Name
                  </th>
                  <th className="text-center" style={{ whiteSpace: 'nowrap', width: '10%' }}>
                    Validity In Days
                  </th>
                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    Recharge Amount
                  </th>
                  {/* <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    Status 
                  </th> */}
                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    Action
                  </th>


                </tr>
              </thead>
              <tbody>
                {rechargeListData?.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="text-center">{item.simOperatorName || '-'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}> {item?.validityInDays}</td>

                    <td className="text-center">{item.rechargeAmount || '-'}</td>
                    {/* <td className="text-center">{item.TrackingApp || '-'}</td> */}


                    <td className="text-center actionColSticky" style={{ zIndex: 4 }}>


                      <Tooltip title="Update Recharge">
                        <button
                          style={{
                            padding: '4px 8px', // Adjust padding for smaller size
                            fontSize: '12px', // Optional: smaller font size
                            height: '28px', // Set height
                            width: '28px' // Set width
                          }}
                          onClick={() => rechargeEditBtnClick(item)}
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
          {/* Pagination */}
          {totalCount > pageSize && (
            <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handleRechargePageChange} />
          )}
        </div>


        <ImportCSVModal show={showImportModal} modelRequestData={modelRequestData} onHide={() => setShowImportModal(false)} />
        {showRechargeModal && (
          <RechargeAddUpdateModal
            show={showRechargeModal}
            onHide={() => setShowRechargeModal(false)}
            modelRequestData={modelRequestData}
            setModelRequestData={setModelRequestData}
            setIsAddUpdateActionDone={setIsAddUpdateActionDone}
          />
        )}
      </div>
    </>
  );
};

export default Recharge;
