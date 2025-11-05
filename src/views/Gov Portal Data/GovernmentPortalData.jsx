import Select from 'react-select';
import { GovernmentPortalDataOption } from 'Middleware/Utils';
import React, { useState, useEffect, useContext } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router';
import PaginationComponent from 'component/Pagination';
import { ConfigContext } from 'context/ConfigContext';
import { Row, Col, Tabs, Tab, Button } from 'react-bootstrap';

import GovPortalDataImportModal from 'views/Gov-Portal-Data/GovPortalDataImportModal';
import { ImportMahakhanijCSV } from 'services/Gov Protal Data Import Export/MahakhanijImportApi';
import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModel from 'component/NoResultFoundModal';
import { Tooltip } from '@mui/material';
import { GetCGMList, ImportCGMCSV } from 'services/Gov Protal Data Import Export/MahakhanijImportApi';
import { ImportCGMDataReportCSV } from 'services/Gov Protal Data Import Export/MahakhanijImportApi';
import dayjs from 'dayjs';
import { GetTransyncList, ImportTransyncCSV } from 'services/Gov Protal Data Import Export/MahakhanijImportApi';
import { ChangeRegistrationStatus, GetInstallationList } from 'services/Installation Device/InstallationDeviceapi';
import StatusChangeModal from 'component/StatusChangeModal ';
import Android12Switch from 'component/Android12Switch';
import RegistrationCompletedModal from 'component/RegistrationCompletedModal';
import { GetGovtPortalLookupList } from 'services/Master Crud/MasterGovPortalApi';

const GovernmentPortalData = ({ }) => {
  const { setLoader, user, companyID } = useContext(ConfigContext);
  const [finalListOfInstallation, setFinalListOfInstallation] = useState([]);
  const [modelAction, setModelAction] = useState();
  const [showSuccessModal, setShowSuccessModal] = useState();
  const [govPortalOptions, setGovPortalOptions] = useState([]); // Dropdown options
  const [selectedPortal, setSelectedPortal] = useState(''); // Selected option from dropdown
  const [activeTab, setActiveTab] = useState('pending'); // Always show pending tab by default
  const [tableData, setTableData] = useState([]); // Table data
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(30);
  const [totalCount, setTotalCount] = useState(0);
  const [stateChangeStatus, setStateChangeStatus] = useState('');
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);


  const GetGovtPortalLookupListData = async () => {
    try {
      const response = await GetGovtPortalLookupList();
      if (response?.data?.statusCode === 200) {
        const govPortalLookupList = response?.data?.responseData?.data || [];
        const formattedOptions = govPortalLookupList.map((item) => ({
          value: item.governmentPortalID,
          label: item.governmentPortalName
        }));
        setGovPortalOptions(formattedOptions);

        // Set default selection & fetch data
        if (formattedOptions.length > 0) {
          setSelectedPortal(formattedOptions[0]);
          fetchInstallationList(formattedOptions[0].value, 0);
        }
      } else {
        console.error('Failed to fetch lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching lookup list:', error);
    }
  };

  // Fetch installation list
  const fetchInstallationList = async (portalId, status) => {
    setLoader(true);
    try {
      const response = await GetInstallationList({
        pageSize,
        pageNo: currentPage - 1, // API expects 0-based index
        searchKeyword: null,
        toDate: null,
        fromDate: null,
        sortingDirection: null,
        userKeyID: user.userKeyID,
        companyKeyID: companyID,
        sortingColumnName: null,
        govtPortalID: portalId,
        govtPortalRegStatus: status
      });

      if (response?.data?.statusCode === 200) {
        setFinalListOfInstallation(response.data.responseData.data || []);
      } else {
        setFinalListOfInstallation([]); // Empty if no data found
      }
    } catch (error) {
      console.error('Error fetching list:', error);
    }
    setLoader(false);
  };

  // Handle dropdown change
  const handleSelectChange = (selectedOption) => {
    setSelectedPortal(selectedOption);
    setActiveTab('pending'); // Always reset to "Pending"
    fetchInstallationList(selectedOption.value, 0);
  };
  // Handle tab change
  const handleTabSelect = (key) => {
    setActiveTab(key);
    const status = key === 'pending' ? 0 : 1; // 0 for Pending, 1 for Completed
    if (selectedPortal) fetchInstallationList(selectedPortal.value, status);
  };

  // Fetch portal options on mount
  useEffect(() => {
    async function fetchOptions() {
      const response = await GetGovtPortalLookupListData();
      if (response && response.length > 0) {
        setGovPortalOptions(response);
        setSelectedPortal(response[0].value); // Select first option by default
        fetchData(response[0].value, 'pending'); // Fetch pending data by default
      }
    }
    fetchOptions();
  }, []);

  const handleStatusChange = (row) => {
    setStateChangeStatus(row);
    setShowStatusChangeModal(true);
  };

  // Function to confirm status change
  const confirmStatusChange = async () => {
    if (!stateChangeStatus) return;
    setLoader(true);

    try {
      const { installationKeyID } = stateChangeStatus;
      const response = await ChangeRegistrationStatus(installationKeyID, companyID, 'GovtPortalRegStatus');

      if (response && response.data.statusCode === 200) {
        setLoader(false);
        setShowStatusChangeModal(false);
        setStateChangeStatus(null);
        setShowSuccessModal(true);
        setModelAction('Installation status changed successfully.');

        // Refresh data if on Pending tab

        fetchInstallationList(selectedPortal.value, 0);
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

  const closeAllModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div>
      {/* Dropdown to select portal */}
      <Select
        placeholder="Select Different GOV"
        options={govPortalOptions}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={{
          container: (base) => ({ ...base, width: '100%', maxWidth: '350px' }),
          menuPortal: (base) => ({ ...base, zIndex: 9999 })
        }}
        className="user-role-select phone-input-country-code"
        value={selectedPortal} // Selected value
        onChange={handleSelectChange} // On change event
      />

      {/* Tabs for Pending & Completed */}
      <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="mt-3">
        <Tab eventKey="pending" title="Pending">
          <TableComponent data={finalListOfInstallation} handleStatusChange={handleStatusChange} />
        </Tab>
        <Tab eventKey="completed" title="Completed">
          <TableComponent data={finalListOfInstallation} />
        </Tab>
      </Tabs>
      <RegistrationCompletedModal
        open={showStatusChangeModal}
        onClose={() => setShowStatusChangeModal(false)}
        onConfirm={confirmStatusChange} // Call function without parameters
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
  );
};

const TableComponent = ({ data, activeKey, handleStatusChange }) => (
  <div className="table-responsive" style={{ maxHeight: '60vh', overflowY: 'auto', position: 'relative' }}>
    {console.log(activeKey, '333333333ddd')}

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
          <th className="text-center">Model Name</th>
          <th className="text-center">Gov Portal Reg. Status</th>
          <th className="text-center">Tracking Application Reg. Status</th>
          <th className="text-center">Modal Number</th>
          <th className="text-center">IMEI</th>
          {/* <th className="text-center">Temporary Device Installed</th> */}
          <th className="text-center">Government Portal Name</th>
          <th className="text-center">Payment Amt ⟨₹⟩</th>
          <th className="text-center">Payment Mode </th>
          <th className="text-center">Payment Status</th>
          <th className="text-center">Payment Date</th>
          {/* <th className="text-center">Payment Verified By Employee Name</th> */}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, idx) => (
            <tr key={idx}>
              <td className="text-center">{idx + 1}</td>
              <td className="text-center">{row.employeeName || '-'}</td>
              <td className="text-center">{row.customerName || '-'}</td>
              <td className="text-center">{row.vehicleNumber.toUpperCase() || '-'}</td>

              <td className="text-center">{row.vehicleTypeName || '-'}</td>
              <td className="text-center">
                {row.installationDate
                  ? (() => {
                    const parts = row.installationDate.split('/');
                    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
                    return dayjs(formattedDate).isValid() ? dayjs(formattedDate).format('DD/MM/YYYY') : '-';
                  })()
                  : '-'}
              </td>
              <td className="text-center">{row.modelNumber || '-'}</td>
              <td className="text-center text-nowrap">
                {row.govtPortalRegStatus === 'Pending' ? ( // Show button only if status is "Pending"
                  <Tooltip title={row.status ? 'Enable' : 'Disable'}>
                    <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(row)} checked={row.status === true} />
                  </Tooltip>
                ) : (
                  <span
                    className="d-inline-flex align-items-center px-3 py-1 rounded-pill text-white"
                    style={{ backgroundColor: '#137c3b', fontWeight: 'bold' }}
                  >
                    <i className="fa fa-check-circle me-2" style={{ fontSize: '14px' }}></i>
                    Completed
                  </span>
                  // <span className="text-success fw-bold">Completed</span> // Show text if "Completed"
                )}
              </td>

              <td className="text-center">
                <span
                  className="d-inline-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm text-white"
                  style={{
                    backgroundColor:
                      row.trackingAppRegStatus === 'Pending'
                        ? '#ffc107' // Bootstrap warning yellow
                        : row.trackingAppRegStatus === 'Completed'
                          ? '#137c3b' // Same green as your previous request
                          : '#6c757d', // Bootstrap secondary gray
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    letterSpacing: '0.2px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    minWidth: '150px',
                    justifyContent: 'center'
                  }}
                >
                  <i
                    className={`fa-solid ${row.trackingAppRegStatus === 'Pending'
                        ? 'fa-clock'
                        : row.trackingAppRegStatus === 'Completed'
                          ? 'fa-circle-check'
                          : 'fa-ban'
                      }`}
                    style={{
                      fontSize: '1rem',
                      color: '#fff' // Keeping icon white for all cases
                    }}
                  ></i>
                  {row.trackingAppRegStatus || '-'}
                </span>
              </td>

              <td className="text-center">{row.modelNumber || '-'}</td>
              <td className="text-center">{row.imei || '-'}</td>
              {/* <td className="text-center">{row.isTemporaryDeviceInstalled || '-'}</td> */}
              <td className="text-center">{row.governmentPortalName || '-'}</td>
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
              <td className="text-center">
                <span
                  className={`badge d-flex align-items-center gap-2 px-3 py-2 fw-semibold text-white shadow-sm ${row.paymentStatus === 'Paid' ? 'bg-success' : 'bg-danger'
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
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center">
              <h5 className='mt-4'>No Data Found</h5>
            </td>
          </tr>
        )}
      </tbody>
    </table>
    {/* {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />} */}

  </div>
);

export default GovernmentPortalData;
