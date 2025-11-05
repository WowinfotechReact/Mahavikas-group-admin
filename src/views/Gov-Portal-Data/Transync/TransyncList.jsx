import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { GetMachineList } from 'services/Gps-Tracking/GpsTrackingApi';
import PaginationComponent from 'component/Pagination';
import GpsTrackingModal from 'views/Gps-Tracking/GpsTrackingModal';
import { ConfigContext } from 'context/ConfigContext';
import GovPortalDataImportModal from '../GovPortalDataImportModal';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { GetTransyncList, ImportTransyncCSV } from 'services/Gov Protal Data Import Export/MahakhanijImportApi';
import NoResultFoundModel from 'component/NoResultFoundModal';
import { Tooltip } from '@mui/material';

const TransyncList = () => {
  const [totalRecords, setTotalRecords] = useState(-1);
  const [currentApiAction, setCurrentApiAction] = useState(null);
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user, companyID } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalCount, setTotalCount] = useState(null);
  const [pageSize, setPageSize] = useState(30);
  const [transyncListData, setTransyncListData] = useState([]);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [showMachineModal, setShowMachineModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [apiParams, setApiParams] = useState(null); // State to store API parameters
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);
  const [setShowTransyncModal, setSetShowTransyncModal] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState();
  const [modelRequestData, setModelRequestData] = useState({
    Action: null
  });

  useEffect(() => {
    // debugger
    if (isAddUpdateActionDone) {
      GetTransyncListData(1, null, toDate, fromDate);
      setSearchKeyword('')
    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    GetTransyncListData(1, null, toDate, fromDate);
  }, [setIsAddUpdateActionDone]);

  const GetTransyncListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    // debugger
    setLoader(true);
    try {
      const data = await GetTransyncList({
        pageSize,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        userKeyID: user.userKeyID,
        sortingDirection: null,
        sortingColumnName: null,
        moduleID: 2,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const transyncList = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(transyncList.length);
            setTransyncListData(transyncList);
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

  const closeAllModal = () => {
    setShowSuccessModal(false);
    setSetShowTransyncModal(false);
  };



  const handleSearch = (e) => {
    let searchKeywordValue = e.target.value;
   const trimmedValue = searchKeywordValue.replace(/^\s+/g, '');
   const capitalizedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1).toLowerCase();

   if (searchKeywordValue.length === 1 && searchKeywordValue.startsWith(' ')) {
     searchKeywordValue = searchKeywordValue.trimStart();
     return;
   }
   setSearchKeyword(capitalizedValue);
   GetTransyncListData(1, capitalizedValue, toDate, fromDate);
 };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetTransyncListData(pageNumber, null, toDate, fromDate);
  };

  const TransyncImportData = () => {
    setModelRequestData({
      ...modelRequestData,
      adminID: null,
      mahaKhanijID: null,
      Action: 'Transync Data'
    });
    setCurrentApiAction(() => handleTransyncImport); // Pass appropriate function
    setSetShowTransyncModal(true);
  };

  const handleTransyncImport = async (file, containsHeader, userKeyID, companyKeyID) => {
    setLoader(true);
    const formData = new FormData();
    formData.append('CSV_File', file);
    try {
      const response = await ImportTransyncCSV(formData, userKeyID, companyKeyID);

      if (response?.data?.statusCode === 0) {
        setLoader(false);
        setModelAction('Transync Imported Successfully!');
        setShowSuccessModal(true);
        setIsAddUpdateActionDone(true);
      } else {
        setLoader(false);

        setErrorMessage(response?.data?.errorMessage);
      }
    } catch (error) {
      console.error('Error importing Trackin:', error);
      // alert('Failed to import Trackin data!');
    }
  };

  

  return (
    <>
       <div className="card w-full max-w-[50vh] mx-auto h-auto">
       <div className="card-body p-2 bg-white shadow-md rounded-lg">
          {/* Top controls */}
          <div className="d-flex justify-content-between align-items-center mb-1">
      <h5 className="m-0">Transync Data </h5>
      <button
    onClick={() => TransyncImportData()}
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
        placeholder="Search..."
        style={{ maxWidth: "350px" }}
        value={searchKeyword}
        onChange={(e) => {
          handleSearch(e);
        }}
      />
      <Tooltip title="Transync Import">
      <button
    onClick={() => TransyncImportData()}
    className="btn btn-primary btn-sm d-none d-sm-inline"
  >
    <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
    <span className="d-none d-sm-inline">Transync Import</span>
  </button>
      </Tooltip>
    </div>

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: '61vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">IMEI</th>
                  <th className="text-center">Serial Number </th>
                  <th className="text-center">Vehicle Number</th>
                  {/* <th className="text-center">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {transyncListData?.map((row, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="text-center">{row.imeiNo}</td>
                    <td className="text-center">{row.serialNo}</td>
                    <td className="text-center">{row.vehicleRegNo}</td>
                    {/* <td className="text-center">
                    <button   onClick={() => mahakhanijViewClick()}
                     type="button"  className="btn-sm btn btn-primary">
                                  <i class="fa-solid fa-eye"></i>
                                </button>
                    </td> */}
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

      <GovPortalDataImportModal
        show={setShowTransyncModal}
        modelRequestData={modelRequestData}
        onHide={() => setSetShowTransyncModal(false)}
        userKeyID={user.userKeyID}
        companyKeyID={companyID}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        apiAction={currentApiAction}
      />
      <SuccessPopupModal
        show={showSuccessModal}
        onHide={() => closeAllModal()}
        setShowSuccessModal={setShowSuccessModal}
        modelAction={modelAction}
      />
    </>
  );
};

export default TransyncList;
