import React, { useState, useEffect, useContext } from 'react';
import CommandAddUpdateModal from './CommandAddUpdateModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router';
import PaginationComponent from 'component/Pagination';
import { ConfigContext } from 'context/ConfigContext';
import Sidebar from 'layout/MainLayout/Sidebar';
import NoResultFoundModel from 'component/NoResultFoundModal';
import { GetCommandList } from 'services/Command/CommandApi';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

const CommandViewList = () => {
  dayjs.extend(customParseFormat);

  const [totalRecords, setTotalRecords] = useState(-1);
  const { setLoader, user } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalCount, setTotalCount] = useState(null);
  const [pageSize, setPageSize] = useState(30);
  const [vehicleListData, setMachineListData] = useState();
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [apiParams, setApiParams] = useState(null); // State to store API parameters
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const [showSuccessModal, setShowSuccessModal] = useState();
  const [modelRequestData, setModelRequestData] = useState({
    adminID: null,
    machineID: null,
    machineName: null,
    price: null,
    Action: null
  });

  useEffect(() => {
    if (apiParams) {
      handleApiCall(apiParams); // Trigger API call with the params
    }
  }, [apiParams]);
  useEffect(() => {    
    if (isAddUpdateActionDone) {
      GetCommandListData(1, null, toDate, fromDate);
      setSearchKeyword('')
    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    GetCommandListData(1, null, toDate, fromDate);
  }, [setIsAddUpdateActionDone]);

  const handleApiCall = async (params) => {
    // //setLoader(false)(true);
    const formData = new FormData();
    formData.append('File', params.File); // Attach the PDF file

    try {
      const response = await AddUpdatePDF(
        {
          ModuleID: params.ModuleID,
          ModuleName: params.ModuleName
        },
        formData
      );

      if (response.data.statusCode === 200) {
        // //setLoader(false)(false);
        setShowSuccessModal(true);
        setModelAction('PDF Uploaded Successfully!');
        setIsAddUpdateActionDone(true);
      } else {
        //setLoader(false)(false);
        setErrorMessage(result.errorMessage);
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setErrorMessage('An error occurred while uploading the PDF.');
    }
  };

  const GetCommandListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    setLoader(true);
    try {
      const data = await GetCommandList({
        pageSize,
        userKeyID: user.userKeyID,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null
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
            setMachineListData(vehicleListData);
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

  const VehicleAddBtnClicked = () => {
    setModelRequestData({
      ...modelRequestData,
      vehicleKeyID: null,
      Action: null
    });
    setShowVehicleModal(true);
  };
  const VehicleEditBtnClicked = (row) => {
    setModelRequestData({
      ...modelRequestData,
      vehicleKeyID: row.vehicleKeyID,
      Action: 'Update'
    });
    setShowVehicleModal(true);
  };

  const handleSearch = (e) => {
    let searchKeywordValue = e.target.value;  
    if (searchKeywordValue.length === 1 && searchKeywordValue.startsWith(' ')) {
      searchKeywordValue = searchKeywordValue.trimStart();
      return;
    }
    setSearchKeyword(searchKeywordValue);
    GetCommandListData(1, searchKeywordValue, toDate, fromDate);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetCommandListData(pageNumber, null, toDate, fromDate);
  };

  const closeAll = () => {
    setShowSuccessModal(false);
  };

  const handleClearDates = () => {
    setCurrentPage(1);
    setToDate(null);
    setFromDate(null);
    GetCommandListData(1, null, null, null);
  };

  return (
    <>
      {/* <Sidebar drawerOpen={true} drawerToggle={() => {}} modalOpen={show} /> */}
      <div className="card w-full max-w-[50vh] mx-auto h-auto">
        <div className="card-body p-4 bg-white shadow-md rounded-lg">
          {/* Top controls */}
          <h4>Complaint Table</h4>
          <div className="d-flex justify-content-between align-items-center mb-3">
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
            <button className="btn btn-primary" onClick={() => VehicleAddBtnClicked()}>
            <i class="fa-solid fa-plus"  style={{fontSize:'11px'}}></i> Add Vehicle
            </button>
          </div>

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: '48vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">Command Name </th>
                  <th className="text-center">Command Description</th>
                  <th className="text-center">Status</th>
                  {/* <th className="text-center">Created Date</th> */}
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {vehicleListData?.map((row, idx) => (
                  <tr className="text-nowrap" key={idx}>
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="text-center">{row.commandName}</td>
                    <td className="text-center">{row.commandDescription}</td>
                    {/* <td className="text-center">
                      {row.createdOnDate
                        ? dayjs(row.createdOnDate, 'DD/MM/YYYY').isValid()
                          ? dayjs(row.createdOnDate, 'DD/MM/YYYY').format('DD/MM/YYYY')
                          : 'Invalid Date'
                        : '-'}
                    </td> */}

                    <td className="text-center">{row.status === true ? 'True' : 'False'}</td>

                    <td className="text-center">
                      <button
                        onClick={() => {
                          VehicleEditBtnClicked(row);
                          handleShow();
                        }}
                        type="button"
                        className="btn-sm btn btn-primary"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-end ">
            {totalCount > pageSize && (
              <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
            )}
          </div>
        </div>
      </div>

      {showVehicleModal && (
        <CommandAddUpdateModal
          show={showVehicleModal}
          onHide={() => {
            setShowVehicleModal(false);
            handleClose();
          }}
          modelRequestData={modelRequestData}
          setModelRequestData={setModelRequestData}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        />
      )}
    </>
  );
};

export default CommandViewList;
