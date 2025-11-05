import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useNavigate } from 'react-router';
import PaginationComponent from 'component/Pagination';
import { ConfigContext } from 'context/ConfigContext';
import GovPortalDataImportModal from '../GovPortalDataImportModal';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { GetTransyncDRList, ImportTransyncDataReportCSV } from 'services/Gov Protal Data Import Export/MahakhanijImportApi';
import dayjs from 'dayjs';
import NoResultFoundModel from 'component/NoResultFoundModal';
import { Tooltip } from '@mui/material';

const TransGpsDataReportList = () => {
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
  const [transyncGpsListData, setTransyncGpsListData] = useState();
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [showMachineModal, setShowMachineModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [apiParams, setApiParams] = useState(null); // State to store API parameters
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);
  const [showTransyncGpsModal, setShowTransyncGpsModal] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState();
  const [modelRequestData, setModelRequestData] = useState({
    adminID: null,
    mahaKhanijID: null,
    Action: null
  });

  useEffect(() => {
    // debugger
    if (isAddUpdateActionDone) {
      GetTransyncDRListData(1, null, toDate, fromDate);
      setSearchKeyword('')
    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    GetTransyncDRListData(1, null, toDate, fromDate);
  }, [setIsAddUpdateActionDone]);

  const closeAllModal = () => {
    setShowSuccessModal(false);
    setShowTransyncGpsModal(false);
  };

  const GetTransyncDRListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    // debugger
    setLoader(true);
    try {
      const data = await GetTransyncDRList({
        pageSize,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        userKeyID: user.userKeyID,
        sortingDirection: null,
        sortingColumnName: null,
        moduleID: 4,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const transyncGpsList = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(transyncGpsList.length);
            setTransyncGpsListData(transyncGpsList);
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
   GetTransyncDRListData(1, capitalizedValue, toDate, fromDate);
 };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetTransyncDRListData(pageNumber, null, toDate, fromDate);
  };

  const TransyncGPSImportData = () => {
    setModelRequestData({
      ...modelRequestData,
      Action: 'Transync Gps data report'
    });
    setCurrentApiAction(() => handleTransyncGpsData); // Pass appropriate function
    setShowTransyncGpsModal(true);
  };

  const handleTransyncGpsData = async (file, containsHeader, userKeyID, companyKeyID) => {
    setLoader(true);
    const formData = new FormData();
    formData.append('CSV_File', file);
    try {
      const response = await ImportTransyncDataReportCSV(formData, userKeyID, companyKeyID);

      if (response?.data?.statusCode === 0) {
        setLoader(false);
        setModelAction('Transync Gps Report Imported Successfully!');
        setShowSuccessModal(true);
        setIsAddUpdateActionDone(true);
      } else {
        setLoader(false);

        setErrorMessage(response?.data?.errorMessage);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error importing Trackin:', error);
    }
  };


  return (
    <>
      <div className="card w-full max-w-[50vh] mx-auto h-auto">
      <div className="card-body p-2 bg-white shadow-md rounded-lg">
          {/* Top controls */}
          <div className="d-flex justify-content-between align-items-center mb-1">
      <h5 className="m-0">Transync Gps Report Data</h5>
      <button
    onClick={() => TransyncGPSImportData()}
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
        placeholder="Search Transync"
        style={{ maxWidth: "350px" }}
        value={searchKeyword}
        onChange={(e) => {
          handleSearch(e);
        }}
      />
      <Tooltip title=" Transync Gps Import">
      <button
    onClick={() => TransyncGPSImportData()}
    className="btn btn-primary btn-sm d-none d-sm-inline"
  >
    <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
    <span className="d-none d-sm-inline"> Transync Gps Import</span>
  </button>
      </Tooltip>
    </div>

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: '61vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                <tr className="text-nowrap">
                  <th className="text-center">Sr No.</th>
                  <th className="text-center">Vehicle Number</th>
                  <th className="text-center">Device Id</th>
                  <th className="text-center">GPS Device Recieved</th>
                  <th className="text-center">Can Data Received</th>
                  <th style={{ background: '#aea9fb' }} className="text-center">
                    GPS Data Push SET:VN
                  </th>
                  <th style={{ background: '#a1e8fd' }} className="text-center">
                    CGM
                  </th>
                  <th className="text-center">STG</th>
                  <th style={{ background: '#7eff76' }} className="text-center">
                    CGM and Trackin
                  </th>
                  <th style={{ background: '#f0ff07' }} className="text-center">
                    Trackin
                  </th>
                  <th style={{ background: '#7eff76' }} className="text-center">
                    CGM and Militrack
                  </th>
                  <th style={{ background: '#f0ff07' }} className="text-center">
                    Militrack
                  </th>
                  <th style={{ background: '#f8c6ba' }} className="text-center">
                    Switch command
                  </th>
                  <th style={{ background: '#baf8f3' }} className="text-center">
                    Super Command{' '}
                  </th>
                  <th className="text-center">TRANSYNC live on CGM</th>
                  <th className="text-center">TRANSYNC Live on Trakin</th>
                </tr>
              </thead>
              <tbody>
                {transyncGpsListData?.map((row, idx) => (
                  <tr className="text-nowrap" key={idx}>
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="text-center">{(row.vehicleNumber).toUpperCase() }</td>
                    <td className="text-center">{row.deviceID}</td>
                    <td className="text-center">{row.lastCanStringTime ? dayjs(row.lastCanStringTime).format('DD/MM/YYYY') : '-'}</td>
                    <td className="text-center">{row.gpsdReceived}</td>
                    <td style={{ background: '#aea9fb' }} className="text-center">
                      {row.canDataReceived}
                    </td>
                    <td style={{ background: '#a1e8fd' }} className="text-center">
                      {row.CGM}
                    </td>
                    <td className="text-center">{row.STG}</td>
                    <td style={{ background: '#7eff76' }} className="text-center">
                      {row.CGMandTrackin}
                    </td>
                    <td style={{ background: '#f0ff07' }} className="text-center">
                      {row.Trackin}
                    </td>
                    <td style={{ background: '#7eff76' }} className="text-center">
                      {row.CGMandMilitrack}
                    </td>
                    <td style={{ background: '#f0ff07' }} className="text-center">
                      {row.Militrack}
                    </td>
                    <td style={{ background: '#f8c6ba' }} className="text-center">
                      {row.SwitchCommand}
                    </td>
                    <td style={{ background: '#baf8f3' }} className="text-center">
                      {row.SuperCommand}
                    </td>
                    <td className="text-center">{row.TRANSYNCliveonCGM}</td>
                    <td className="text-center">{row.TRANSYNCliveonTrakin}</td>
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
        show={showTransyncGpsModal}
        modelRequestData={modelRequestData}
        onHide={() => setShowTransyncGpsModal(false)}
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

export default TransGpsDataReportList;
