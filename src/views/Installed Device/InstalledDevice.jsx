import React, { useState, useEffect, useContext } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { ConfigContext } from 'context/ConfigContext';
import dayjs from 'dayjs';
import PaginationComponent from 'component/Pagination';
import SuccessPopupModal from 'component/SuccessPopupModal';
import StatusChangeModal from 'component/StatusChangeModal ';
import NoResultFoundModel from 'component/NoResultFoundModal';
import { Tooltip , Badge } from '@mui/material';
import AddUpdateInstalledDeviceModal from './AddUpdateInstalledDeviceModal';
import {
  GetInstallationList,
  ChangeRegistrationStatus
} from 'services/Installation Device/InstallationDeviceapi';
import InstallationViewModal from './InstallationViewModal';
import Android12Switch from 'component/Android12Switch';

const InstalledDevice = () => {
  const [showVehicleViewModal, setShowVehicleViewModal] = useState(false);
  const [stateChangeStatus, setStateChangeStatus] = useState('');
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(-1);
  const { setLoader, user, companyID } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalCount, setTotalCount] = useState(null);
  const [pageSize, setPageSize] = useState(30);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);
  const [trackingListData, setTrackingListData] = useState([]);
  const [openInstalledDeviceFormModal, setOpenInstalledDeviceFormModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState();
  const [modelRequestData, setModelRequestData] = useState({
    stateID: null,
    stateName: null,
    Action: null,
    talukaID: null
  });

  useEffect(() => {
    if (isAddUpdateActionDone) {
      GetInstallationListData(1, null, toDate, fromDate);
      setSearchKeyword('')
    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    GetInstallationListData(1, null, toDate, fromDate);
  }, [setIsAddUpdateActionDone]);

  const GetInstallationListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    setLoader(true);
    try {
      const data = await GetInstallationList({
        pageSize,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        sortingDirection: null,
        userKeyID: user.userKeyID,
        companyKeyID: companyID,
        sortingColumnName: null
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const MasterVillageListData = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(MasterVillageListData.length);
            setTrackingListData(MasterVillageListData);
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
    GetInstallationListData(1, capitalizedValue, toDate, fromDate);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetInstallationListData(pageNumber, null, toDate, fromDate);
  };

  const handleClearDates = () => {
    setCurrentPage(1);
    setToDate(null);
    setFromDate(null);
    GetInstallationListData(1, null, null, null);
  };

  const addInstallClick = () => {
    setModelRequestData({
      ...modelRequestData,
      Action: null,
      installationKeyID: null
    });
    setOpenInstalledDeviceFormModal(true);
  };
  const EditMasterInstallationBtnClick = (row) => {
    setModelRequestData({
      ...modelRequestData,
      Action: 'Update',
      installationKeyID: row?.installationKeyID
    });
    setOpenInstalledDeviceFormModal(true);
  };
  const closeAllModal = () => {
    setShowSuccessModal(false);
  };

  const confirmStatusChange = async  ({ row, statusKey }, user) => {
    setLoader(true);
    // debugger
    try {
      const { installationKeyID } = row; // Destructure to access only what's needed
      const currentStatus = row[statusKey];
    const newStatus = currentStatus === "Pending" ? "Complete" : "Pending";

      const response = await ChangeRegistrationStatus(installationKeyID, companyID, statusKey);

      if (response && response.data.statusCode === 200) {
        setLoader(false);
        // Successfully changed the status
        setShowStatusChangeModal(false);
        setStateChangeStatus(null);
        GetInstallationListData(currentPage, null, toDate, fromDate);
        setShowSuccessModal(true);
        setModelAction('Installation status changed successfully.');
      } else {
        setLoader(false);
        setShowSuccessModal(true);
        setModelAction('Failed to change Installation status.');
      }
    } catch (error) {
      setLoader(false);
      setShowSuccessModal(true);
      setModelAction('An error occurred while changing the Installation status.');
    }
  };
  const handleStatusChange = (row,statusKey) => {
    setStateChangeStatus({ row, statusKey });
    setShowStatusChangeModal(true);
  };

  const VehicleViewBtnClicked = async (row) => {
    setModelRequestData({
      ...modelRequestData,
      installationKeyID: row.installationKeyID
    });
    setShowVehicleViewModal(true);
  };

  return (
    <>
      <div className="card w-full max-w-[50vh] mx-auto h-auto">
        <div className="card-body p-2 bg-white shadow-md rounded-lg">
          {/* Top controls */}
          <div className="d-flex justify-content-between align-items-center mb-1">
            <h5 className="m-0">Installation</h5>
            <button onClick={() => addInstallClick()} className="btn btn-primary btn-sm d-inline d-sm-none">
              <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
              <span className="d-inline d-sm-none"> Add</span>
            </button>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <input
              type="text"
              className="form-control "
              placeholder="Search Installation"
              style={{ maxWidth: '350px' }}
              value={searchKeyword}
              onChange={(e) => {
                handleSearch(e);
              }}
            />
            <Tooltip title="Add Installation">
              <button onClick={() => addInstallClick()} className="btn btn-primary btn-sm d-none d-sm-inline">
                <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                <span className="d-none d-sm-inline"> Add Installation</span>
              </button>
            </Tooltip>
          </div>

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: '60vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr
                  style={{
                    position: 'sticky',
                    top: -1,
                    backgroundColor: '#fff',
                    zIndex: 10,
                    boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
                  }}
                  className="text-nowrap"
                >
                  <th className="text-center">Sr No</th>
                  <th className="text-center">Employee Name</th>
                  <th className="text-center">Customer Name</th>
                  <th className="text-center">Vehicle Number</th>
                  <th className="text-center">Vehicle Type Name</th>
                  <th className="text-center">Installation Date</th>
                  {/* <th className="text-center">Model Name</th> */}
                  <th className="text-center">Government Portal Name</th>
                  <th className="text-center">Gov Portal Reg. Status</th>
                  <th className="text-center">Trackin Application Reg. Status</th>
                  <th className="text-center">Trackin App Name</th>
                  <th className="text-center">Modal Number</th>
                  <th className="text-center">IMEI</th>
                  {/* <th className="text-center">Temporary Device Installed</th> */}
                  <th className="text-center">Payment Amt ⟨₹⟩</th>
                  <th className="text-center">Payment Mode Name</th>
                  <th className="text-center">Payment Status</th>
                  <th className="text-center">Payment Date</th>
                  {/* <th className="text-center">Payment Verified By Employee Name</th> */}

                  {/* <th className="text-center">Status</th> */}
                  <th className="text-center actionSticky">Action</th>
                </tr>
              </thead>
              <tbody>
                {trackingListData?.map((row, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                    {/* <td className="text-center">{row.companyName || '-'}</td> */}
                    <td className="text-center">{row.employeeName || '-'}</td>
                    <td className="text-center">{row.customerName || '-'}</td>
                    <td className="text-center">{row.vehicleNumber.toUpperCase() || '-'}</td>

                    <td className="text-center">{row.vehicleTypeName || '-'}</td>
                    <td className="text-center">
                     
                        {row.installationDate}
                    </td>
                    {/* <td className="text-center">{row.modalName || '-'}</td> */}
                    <td className="text-center">{row.governmentPortalName || '-'}</td>


                    <td className="text-center">
  {row.govtPortalRegStatus === "Pending" ? (
    <Tooltip title="Change Status">
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        Pending
        <Android12Switch
          style={{ padding: '8px' }}
          onClick={() => handleStatusChange(row, 'govtPortalRegStatus')}
          checked={false} // or your logic here
        />
      </div>
    </Tooltip>
  ) : (
    <span
      className="d-inline-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm text-white"
      style={{
        backgroundColor: '#137c3b', // green for success
        borderRadius: '20px',
        fontSize: '0.9rem',
        letterSpacing: '0.2px',
        minWidth: '150px',
        justifyContent: 'center',
        display: 'inline-flex',
      }}
    >
      <i className="fa-solid fa-circle-check" style={{ fontSize: '1rem', color: '#fff' }}></i>
      Complete
    </span>
  )}
</td>

                    <td className="text-center">
  {row.trackingAppRegStatus === "Pending" ? (
    <Tooltip title="Change Status">
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        Pending
        <Android12Switch
          style={{ padding: '8px' }}
          onClick={() => handleStatusChange(row, 'trackingAppRegStatus')}
          checked={false} // or your checked logic here
        />
      </div>
    </Tooltip>
  ) : (
    <span
      className="d-inline-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm text-white"
      style={{
        backgroundColor: '#137c3b', // green for success
        borderRadius: '20px',
        fontSize: '0.9rem',
        letterSpacing: '0.2px',
        minWidth: '150px',
        justifyContent: 'center',
        display: 'inline-flex',
      }}
    >
      <i className="fa-solid fa-circle-check" style={{ fontSize: '1rem', color: '#fff' }}></i>
      Complete
    </span>
  )}
</td>


                    <td className="text-center">{row.trackingAppName || '-'}</td>
                    <td className="text-center">{row.modelNumber || '-'}</td>
                    <td className="text-center">{row.imei || '-'}</td>
                    {/* <td className="text-center">{row.isTemporaryDeviceInstalled || '-'}</td> */}
                    <td className="text-center">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'decimal',
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0
                      }).format(Math.round(row.paymentAmount)) || '-'}
                    </td>
                    <td className="text-center">
                      <span className="d-flex align-items-center justify-content-center gap-2 fw-semibold">
                        {row.paymentModeName === 'Credit' && (
                          <>
                            <i className="fa-solid fa-credit-card text-primary fs-5"></i>
                            <span>Credit</span>
                          </>
                        )}
                        {row.paymentModeName === 'Account' && (
                          <>
                            <i className="fa-solid fa-building-columns text-success fs-5"></i>
                            <span>Account</span>
                          </>
                        )}
                        {row.paymentModeName === 'Cash' && (
                          <>
                            <i className="fa-solid fa-money-bill-wave text-warning fs-5"></i>
                            <span>Cash</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* <td className="text-center">{row.paymentStatus || '-'}</td> */}
                    <td className="text-center">
                      <span
                        className={`badge d-flex align-items-center gap-2 px-3 py-2 fw-semibold text-white shadow-sm ${
                          row.paymentStatus === 'Paid' ? 'bg-success' : 'bg-danger'
                        }`}
                        style={{
                          borderRadius: '11px', // Smooth pill-like shape
                          fontSize: '0.85rem',
                          letterSpacing: '0.5px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          minWidth: '100px', // Keeps size uniform
                          justifyContent: 'center'
                        }}
                      >
                        <i
                          className={`fa-solid ${row.paymentStatus === 'Paid' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}
                          style={{
                            fontSize: '1rem',
                            color: 'white',
                            marginRight: '5px'
                          }}
                        ></i>
                        {row.paymentStatus === 'Paid' ? 'Paid' : 'Un-Paid'}
                      </span>
                    </td>

                    <td className="text-center">
                      {row.paymentDate && dayjs(row.paymentDate).isValid() ? dayjs(row.paymentDate).format('DD/MM/YYYY') : '-'}
                    </td>
                    {/* <td className="text-center">{row.paymentVerifiedByEmployeeName || '-'}</td> */}
                    {/* <td className="text-center text-nowrap " >
                      <Tooltip title={row.status === true ? 'Enable' : 'Disable'}>
                        {row.status === true ? 'Enable' : 'Disable'}
                        <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(row)} checked={row.status === true} />
                      </Tooltip>
                    </td> */}
                    <td className="text-center actionColSticky" style={{ zIndex: 4 }}>
                      <div className="d-flex gap-2">
                        <Tooltip title="Update Installation">
                          <button onClick={() => EditMasterInstallationBtnClick(row)} type="button" className="btn-sm btn btn-primary">
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                        </Tooltip>

                        <Tooltip title="View Installation">
                          <button onClick={() => VehicleViewBtnClicked(row)} type="button" className="btn-sm btn btn-primary">
                            <i className="fa-solid fa-eye"></i>
                          </button>
                        </Tooltip>
                      </div>
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

        {openInstalledDeviceFormModal && (
          <AddUpdateInstalledDeviceModal
            show={openInstalledDeviceFormModal}
            onHide={() => setOpenInstalledDeviceFormModal(false)}
            modelRequestData={modelRequestData}
            setModelRequestData={setModelRequestData}
            isAddUpdateActionDone={isAddUpdateActionDone}
            setIsAddUpdateActionDone={setIsAddUpdateActionDone}
          />
        )}

        <StatusChangeModal
          open={showStatusChangeModal}
          onClose={() => setShowStatusChangeModal(false)}
          onConfirm={() => confirmStatusChange(stateChangeStatus, user)} // Pass the required arguments
        />
        {showSuccessModal && (
          <SuccessPopupModal
            show={showSuccessModal}
            onHide={() => closeAllModal()}
            setShowSuccessModal={setShowSuccessModal}
            modelAction={modelAction}
          />
        )}
        <InstallationViewModal
          show={showVehicleViewModal}
          onHide={() => setShowVehicleViewModal(false)}
          modelRequestData={modelRequestData}
        />
      </div>
    </>
  );
};

export default InstalledDevice;
