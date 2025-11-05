import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GetMachineList } from 'services/Gps-Tracking/GpsTrackingApi';
import PaginationComponent from 'component/Pagination';
import GpsTrackingModal from './GpsTrackingModal';
import { ConfigContext } from 'context/ConfigContext';

const TableWithPagination = () => {
  const [totalRecords, setTotalRecords] = useState(-1);
  const { setLoader, user } = useContext(ConfigContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalCount, setTotalCount] = useState(null);
  const [pageSize, setPageSize] = useState(30);
  const [machineListData, setMachineListData] = useState();
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [showMachineModal, setShowMachineModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState();
  const [modelRequestData, setModelRequestData] = useState({
    adminID: null,
    machineID: null,
    machineName: null,
    price: null,
    Action: null
  });

  useEffect(() => {
    // debugger
    if (isAddUpdateActionDone) {
      GetMachineListData(1, null, toDate, fromDate);
      setSearchKeyword('')
    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    GetMachineListData(1, null, toDate, fromDate);
  }, [setIsAddUpdateActionDone]);

  const GetMachineListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    // debugger
    setLoader(true);
    try {
      const data = await GetMachineList({
        pageSize,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        userKeyID: user.userKeyID,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const trackingListData = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(trackingListData.length);
            setMachineListData(trackingListData);
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

  const MachineAddBtnClicked = () => {
    setModelRequestData({
      ...modelRequestData,
      adminID: null,
      machineID: null,
      Action: null
    });
    setShowMachineModal(true);
  };
  const MachineEditBtnClicked = (row) => {
    {
      setModelRequestData({
        ...modelRequestData,
        machineID: row.machineID,
        Action: 'Update'
      });
      setShowMachineModal(true);
    }
  };

  const handleSearch = (e) => {
    let searchKeywordValue = e.target.value;
    if (searchKeywordValue.length === 1 && searchKeywordValue.startsWith(' ')) {
      searchKeywordValue = searchKeywordValue.trimStart();
      return;
    }
    setSearchKeyword(searchKeywordValue);
    GetMachineListData(1, searchKeywordValue, toDate, fromDate);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetMachineListData(pageNumber, null, toDate, fromDate);
  };

  const closeAll = () => {
    setShowSuccessModal(false);
  };

  const handleClearDates = () => {
    setCurrentPage(1);
    setToDate(null);
    setFromDate(null);
    GetMachineListData(1, null, null, null);
  };

  return (
    <>
      <div className="card w-full max-w-[50vh] mx-auto h-auto">
      <div className="card-body p-2 bg-white shadow-md rounded-lg">
          {/* Top controls */}
          <h4>Installation</h4>
          <div className="d-flex justify-content-between align-items-center mb-1">
            {/* <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              className="form-control"
              placeholderText="Select Date"
            /> */}
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              style={{ maxWidth: '300px' }}
              value={searchKeyword}
              onChange={(e) => {
                handleSearch(e);
              }}
            />
            <button className="btn btn-primary" onClick={() => MachineAddBtnClicked()}>
              Add
            </button>
          </div>

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: '61vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                <tr>
                  {/* <th>ID</th> */}
                  <th>Machine Name</th>
                  <th>Available Quantity</th>
                  <th>Price (₹)</th>
                  <th>Gst (%)</th>
                  <th>Labour Charge (₹)</th>
                  <th>Unit</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {machineListData?.map((row) => (
                  <tr key={row.id}>
                    <td>{row.machineName}</td>
                    <td>{row.totalStock}</td>
                    <td>{row.price}</td>
                    <td>{row.gstPercentage}</td>
                    <td>{row.labourCharges}</td>
                    <td>{row.unitName}</td>
                    <td>
                      <button onClick={() => MachineEditBtnClicked(row)} type="button" className="me-2 button-btn btn-primary">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-end ">
            <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
          </div>
        </div>
      </div>

      {showMachineModal && (
        <GpsTrackingModal
          show={showMachineModal}
          onHide={() => setShowMachineModal(false)}
          modelRequestData={modelRequestData}
          setModelRequestData={setModelRequestData}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        />
      )}
    </>
  );
};

export default TableWithPagination;
