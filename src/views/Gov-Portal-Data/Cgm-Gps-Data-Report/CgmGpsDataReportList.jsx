import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { GetMachineList } from 'services/Gps-Tracking/GpsTrackingApi';
import PaginationComponent from 'component/Pagination';
import { ConfigContext } from 'context/ConfigContext';
import GovPortalDataImportModal from '../GovPortalDataImportModal';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { GetCGMDRList, ImportCGMDataReportCSV } from 'services/Gov Protal Data Import Export/MahakhanijImportApi';
import dayjs from 'dayjs';
import { Tooltip } from '@mui/material';

const CgmGpsDataReport = () => {
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
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [apiParams, setApiParams] = useState(null); // State to store API parameters
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);
  const [showCGMGPSModal, setShowCGMGPSModal] = useState(false);
  const [cgmGpsListData, setCgmGpsListData] = useState([]);

  const [showSuccessModal, setShowSuccessModal] = useState();
  const [modelRequestData, setModelRequestData] = useState({
    Action: null
  });

  useEffect(() => {
    // debugger
    if (isAddUpdateActionDone) {
      GetCGMGpsListData(1, null, toDate, fromDate);
      setSearchKeyword('')
    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

 
  useEffect(() => {
    GetCGMGpsListData(1, null, toDate, fromDate);
  }, [setIsAddUpdateActionDone]);

  const GetCGMGpsListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    setLoader(true);
    try {
      const data = await GetCGMDRList({
        pageSize,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        userKeyID: user.userKeyID,
        moduleID: 3,
        sortingColumnName: null,
        sortingDirection: null,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const cgmGpsList = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(cgmGpsList?.length);
            setCgmGpsListData(cgmGpsList);
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

  // const handleSearch = (e) => {
  //   let searchKeywordValue = e.target.value;
  //   if (searchKeywordValue.length === 1 && searchKeywordValue.startsWith(' ')) {
  //     searchKeywordValue = searchKeywordValue.trimStart();
  //     return;
  //   }
  //   setSearchKeyword(searchKeywordValue);
  //   GetCGMGpsListData(1, searchKeywordValue, toDate, fromDate);
  // };
  const handleSearch = (e) => {
    let searchKeywordValue = e.target.value;
   const trimmedValue = searchKeywordValue.replace(/^\s+/g, '');
   const capitalizedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1).toLowerCase();

   if (searchKeywordValue.length === 1 && searchKeywordValue.startsWith(' ')) {
     searchKeywordValue = searchKeywordValue.trimStart();
     return;
   }
   setSearchKeyword(capitalizedValue);
   GetCGMGpsListData(1, capitalizedValue, toDate, fromDate);
 };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetCGMGpsListData(pageNumber, null, toDate, fromDate);
  };

  

  const closeAllModal = () => {
    setShowSuccessModal(false);
    setShowCGMGPSModal(false);
  };

  const CgmGpsImportData = () => {
    setModelRequestData({
      ...modelRequestData,
      Action: 'CGM GPS Data'
    });
    setCurrentApiAction(() => handleCGMImport); // Pass appropriate function
    setShowCGMGPSModal(true);
  };

  const handleCGMImport = async (file, containsHeader, userKeyID, companyKeyID) => {
    setLoader(true);
    const formData = new FormData();
    formData.append('CSV_File', file);
    try {
      const response = await ImportCGMDataReportCSV(formData, userKeyID, companyKeyID);

      if (response?.data?.statusCode === 0) {
        setLoader(false);
        setModelAction('CGM Gps Data Imported Successfully!');
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
      <h5 className="m-0">CGM GPS Data Report</h5>
      <button
    onClick={() => CgmGpsImportData()}
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
      <Tooltip title=" CGM GPS Import">
      <button
    onClick={() => CgmGpsImportData()}
    className="btn btn-primary btn-sm d-none d-sm-inline"
  >
    <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
    <span className="d-none d-sm-inline">  CGM GPS Import</span>
  </button>
      </Tooltip>
    </div>

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: '61vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                <tr className="text-nowrap">
                  <th className="text-center">ID</th>
                  <th className="text-center">Vehicle Number</th>
                  <th className="text-center">Device ID</th>
                  <th className="text-center">Last Gps String Time</th>
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
                  {/* <th className="text-center">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {cgmGpsListData?.map((row, idx) => (
                  <tr className="text-nowrap" key={idx}>
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="text-center">{(row.vehicleNumber).toUpperCase() }</td>
                    <td className="text-center">{row.deviceID}</td>
                    <td className="text-center">{row.lastCanStringTime ? dayjs(row.lastCanStringTime).format('DD/MM/YYYY') : '-'}</td>
                    {/* <td className="text-center">{row.lastCanStringTime}</td> */}
                    <td className="text-center">{row.gpsdReceived}</td>
                    <td className="text-center">{row.canDataReceived}</td>
                    <td style={{ background: '#aea9fb' }} className="text-center">
                      {row.dataRecived}
                    </td>
                    <td style={{ background: '#a1e8fd' }} className="text-center">
                      {row.GpsPush}
                    </td>
                    <td className="text-center">{row.cmg}</td>
                    <td style={{ background: '#7eff76' }} className="text-center">
                      {row.STG}
                    </td>
                    <td style={{ background: '#f0ff07' }} className="text-center">
                      {row.CGMTrack}
                    </td>
                    <td style={{ background: '#7eff76' }} className="text-center">
                      {row.Tracking}
                    </td>
                    <td style={{ background: '#f0ff07' }} className="text-center">
                      {row.cmgMilitrack}
                    </td>
                    <td style={{ background: '#f8c6ba' }} className="text-center">
                      {row.switch}
                    </td>
                    <td style={{ background: '#baf8f3' }} className="text-center">
                      {row.superComman}
                    </td>
                    <td className="text-center">{row.TransyncLiveTrack}</td>
                    <td className="text-center">{row.TransyncLiveCgm}</td>
                    {/* <td className="text-center">
                      <button onClick={() => VehicleAddBtnClicked()} type="button" className="btn-sm btn btn-primary">
                        <i class="fa-solid fa-eye"></i>
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-end ">
            {/* <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} /> */}
          </div>
        </div>
      </div>

      {/* Modal */}
      <GovPortalDataImportModal
        show={showCGMGPSModal}
        modelRequestData={modelRequestData}
        onHide={() => setShowCGMGPSModal(false)}
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

export default CgmGpsDataReport;
