import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { GetMachineList } from 'services/Gps-Tracking/GpsTrackingApi';
import PaginationComponent from 'component/Pagination';
import { ConfigContext } from 'context/ConfigContext';
import GovPortalDataImportModal from '../GovPortalDataImportModal';
import { GetMahakahnijList, ImportMahakhanijCSV } from 'services/Gov Protal Data Import Export/MahakhanijImportApi';
import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModel from 'component/NoResultFoundModal';
import { Tooltip } from '@mui/material';

const MahakhanijList = () => {
  const [totalRecords, setTotalRecords] = useState(-1);
  const { setLoader, user, companyID } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalCount, setTotalCount] = useState(null);
  const [pageSize, setPageSize] = useState(30);
  const [currentApiAction, setCurrentApiAction] = useState(null);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);
  const [showMahaKhanijModal, setShowMahaKhanijModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [showSuccessModal, setShowSuccessModal] = useState();
  const [mahakhanijListData, setMahakhanijListData] = useState([]);
  const [modelRequestData, setModelRequestData] = useState({
    adminID: null,
    mahaKhanijID: null,
    Action: null
  });

  useEffect(() => {
    // debugger
    if (isAddUpdateActionDone) {
      // GetMahaKhanijListData(1, null, toDate, fromDate);
    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

 
  useEffect(() => {
    GetMahaKhanijListData(1, null, toDate, fromDate);
  }, [setIsAddUpdateActionDone]);

  const handleMahakhanijImport = async (file, containsHeader, userKeyID, companyKeyID) => {
    setLoader(true);
    const formData = new FormData();
    formData.append('CSV_File', file);
    try {
      const response = await ImportMahakhanijCSV(formData, userKeyID, companyKeyID);

      if (response?.data?.statusCode === 0) {
        setLoader(false);
        setModelAction('MahaKhanij Data Imported Successfully!');
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

  const GetMahaKhanijListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    // debugger
    setLoader(true);
    try {
      const data = await GetMahakahnijList({
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
            const mahakhanijList = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(mahakhanijList.length);
            setMahakhanijListData(mahakhanijList);
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

  const handleSearch = (e) => {
     let searchKeywordValue = e.target.value;
    const trimmedValue = searchKeywordValue.replace(/^\s+/g, '');
    const capitalizedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1).toLowerCase();

    if (searchKeywordValue.length === 1 && searchKeywordValue.startsWith(' ')) {
      searchKeywordValue = searchKeywordValue.trimStart();
      return;
    }
    setSearchKeyword(capitalizedValue);
    GetMahaKhanijListData(1, capitalizedValue, toDate, fromDate);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetMahaKhanijListData(pageNumber, null, toDate, fromDate);
  };

  const MahakhanijImportData = () => {
    // debugger
    setModelRequestData({
      ...modelRequestData,
      adminID: null,
      mahaKhanijID: null,
      Action: 'Mahakhanij Portal Data'
    });
    setCurrentApiAction(() => handleMahakhanijImport); // Pass appropriate function
    setShowMahaKhanijModal(true);
  };

  const mahakhanijViewClick = (row) => {
    setModelRequestData({
      ...modelRequestData,
      adminID: null
    });
    const mahaKhanijData = {
      customerName: row.customerName,
      vehicleName: row.vehicleName
    };

    navigate('/maha-khanij-view-data', { state: mahaKhanijData });
  };

  const closeAllModal = () => {
    setShowSuccessModal(false);
    setShowMahaKhanijModal(false);
  };
  return (
    <>
      <div className="card w-full max-w-[50vh] mx-auto h-auto">
      <div className="card-body p-2 bg-white shadow-md rounded-lg">
          {/* Top controls */}
          <div className="d-flex justify-content-between align-items-center mb-1">
      <h5 className="m-0">Recharge </h5>
      <button
    onClick={() => MahakhanijImportData()}
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
        placeholder="Search..."
        style={{ maxWidth: "350px" }}
        value={searchKeyword}
        onChange={(e) => {
          handleSearch(e);
        }}
      />
      <Tooltip title="Add  Mahakhanij Import">
      <button
    onClick={() => MahakhanijImportData()}
    className="btn btn-primary btn-sm d-none d-sm-inline"
  >
    <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
    <span className="d-none d-sm-inline"> Add  Mahakhanij Import</span>
  </button>
      </Tooltip>
    </div>

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: '61vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">Customer Name </th>
                  <th className="text-center">Vehicle Number</th>
                  <th className="text-center">IMEI</th>
                  {/* <th className="text-center">Status</th> */}
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {mahakhanijListData?.map((row, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>

                    <td className="text-center">{row.customerName}</td>
                    <td className="text-center">{row.vehicleName}</td>
                    <td className="text-center">{row.imei}</td>
                    {/* <td className="text-center">{row.status === true ? 'True' : 'False'}</td> */}
                    <td className="text-center">
                      <button onClick={() => mahakhanijViewClick(row)} type="button" className="btn-sm btn btn-primary">
                        <i class="fa-solid fa-eye"></i>
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

      {/* Modal */}
      <GovPortalDataImportModal
        show={showMahaKhanijModal}
        modelRequestData={modelRequestData}
        onHide={() => setShowMahaKhanijModal(false)}
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

export default MahakhanijList;
