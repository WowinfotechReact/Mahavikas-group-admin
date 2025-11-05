import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import { Table, Collapse } from 'react-bootstrap';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { ConfigContext } from 'context/ConfigContext';
import './LeadBubble.css'
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-date-picker';
import Android12Switch from 'component/Android12Switch';
import StatusChangeModal from 'component/StatusChangeModal ';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import dayjs from 'dayjs';
import PaginationComponent from 'component/Pagination';
import NoResultFoundModel from 'component/NoResultFoundModal';
import AddUpdateLeadModal from './AddUpdateLead';
import { ChangeLeadStatus, GetLeadDataList } from 'services/LeadAPI/LeadApi';
import AddUpdateTechnicianLeadModal from './AddUpdateTechnicianLeadModal';
import TransferLeadModal from './TransferLeadModal';
import TransferLeadLogsViewModal from './TransferLeadLogsViewModal';
import { hasPermission } from 'Middleware/permissionUtils';
import LeadTransferModal from './LeadTransferModal';

const LeadList = () => {
  const [showTechnicianModal, setShowTechnicianModal] = useState(false);
  const [stateChangeStatus, setStateChangeStatus] = useState('');
  const [showLeadTransferViewModal, setShowLeadTransferViewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [toDate, setToDate] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState(null);
  const [totalCount, setTotalCount] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [leadListData, setLeadListData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(-1);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [pageSize, setPageSize] = useState(30);
  const [showTransferComplaintModal, setShowTransferComplaintModal] = useState(false);
  const [showTransferLeadModal, setShowTransferLeadModal] = useState(false);
  const { user, setLoader, companyID, permissions } = useContext(ConfigContext);
  const [selectedLeadIDs, setSelectedLeadIDs] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [transferLeadIDs, setTransferLeadIDs] = useState([]); // This will be passed to modal
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [modelAction, setModelAction] = useState('');
  const [bubblePos, setBubblePos] = useState({ x: 0, y: 0 });
  const [showBubble, setShowBubble] = useState(false);

  const [expandedRow, setExpandedRow] = useState(null);
  const [ActiveTab, setActiveTab] = useState('PendingTab');
  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };
  const [modelRequestData, setModelRequestData] = useState({
    Action: null,
    leadKeyID: null,
    leadName: null,
    requirement: null

  });

  useEffect(() => {
    LeadDataList(1, null, null, null, null, null, null);
  }, []);
  // state for contact expand/collapse
  const [expandedContact, setExpandedContact] = useState(null);

  useEffect(() => {
    if (isAddUpdateActionDone) {
      LeadDataList(currentPage, null, toDate, fromDate, null, null, null);
      setSearchKeyword('');
      setSelectedLeadIDs([]);
      setSelectAll(false);
    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  const navigate = useNavigate();

  const LeadDataList = async (pageNumber, searchKeywordValue, toDate, fromDate, sortingType, sortValueName, TabName) => {
    setLoader(true);
    // debugger;
    try {
      const response = await GetLeadDataList({
        pageNo: pageNumber - 1,
        pageSize: pageSize,
        sortingDirection: sortingType ? sortingType : null, //or null
        sortingColumnName: sortValueName ? sortValueName : null, //or null
        searchKeyword: searchKeywordValue === undefined || searchKeywordValue === null ? searchKeyword : searchKeywordValue,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        userKeyID: user.userKeyID,
        // companyKeyID: companyID,
        tabName: TabName
      });

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const leadList = response.data.responseData.data;
            const totalCount = response.data.totalCount;

            setTotalCount(totalCount);
            setTotalPages(Math.ceil(totalCount / pageSize));
            setLeadListData(leadList);
            setTotalRecords(leadList?.length);
          }
        } else {
          console.error(response?.data?.errorMessage);
          setLoader(false);
        }
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const LeadAddBtnClicked = () => {
    setModelRequestData((prevObj) => ({
      ...prevObj,
      Action: null,
      leadKeyID: null
    }));
    setShowLeadModal(true);
  };
  const leadTransferModule = () => {
    if (selectedLeadIDs.length === 0) {
      alert("Please select at least one lead to transfer.");
      return;
    }

    setModelRequestData((prevObj) => ({
      ...prevObj,
      Action: null,
      leadID: selectedLeadIDs // send as array
    }));

    setShowTransferLeadModal(true);

    setShowBubble(false)

  };


  const handleStatusChange = (row) => {
    setStateChangeStatus(row); // You can set only relevant data if needed
    setShowStatusChangeModal(true);
  };

  const confirmStatusChange = async (row, user) => {
    setLoader(true);

    try {
      const { leadKeyID } = row;
      const response = await ChangeLeadStatus(leadKeyID, user.userKeyID);

      if (response && response.data.statusCode === 200) {
        setLoader(false);

        // ✅ Correct: refresh the leads list, not employee list
        LeadDataList(currentPage, searchKeyword, toDate, fromDate);

        // ✅ Clean up
        setShowStatusChangeModal(false);
        setStateChangeStatus(null);

        // Show success
        setShowSuccessModal(true);
        setModelAction('Lead status changed successfully.');
      } else {
        setLoader(false);
        console.error(response?.data?.errorMessage);
        setShowSuccessModal(true);
        setModelAction('Failed to change lead status.');
      }
    } catch (error) {
      setLoader(false);
      console.error('Error changing lead status:', error);
      setShowSuccessModal(true);
      setModelAction('An error occurred while changing the lead status.');
    }
  };

  const EditBtnLead = (item) => {
    setModelRequestData((prevObj) => ({
      ...prevObj,
      Action: 'Update',
      leadKeyID: item.leadKeyID
    }));
    setShowLeadModal(true);
  };



  const ClickFollowUpBtnLead = (item) => {

    {
      setModelRequestData({
        ...modelRequestData,
        leadName: item.leadName,
        leadKeyID: item.leadKeyID,


      });
    }
    let updateQuote = {

      leadName: item.leadName,
      leadKeyID: item.leadKeyID,

    };

    navigate('/follow-up', { state: updateQuote });
  };


  const handleSearch = (e) => {
    const inputValue = e.target.value;
    const trimmedValue = inputValue.replace(/^\s+/g, '');
    const capitalizedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1).toLowerCase();
    setSearchKeyword(capitalizedValue);
    setCurrentPage(1);
    LeadDataList(1, capitalizedValue, toDate, fromDate, null, null, null);

  };



  const handleLeadPageChange = (pageNumber) => {
    // debugger;
    setLeadListData([]);
    setTotalRecords(-1);
    setCurrentPage(pageNumber); // Update the current page based on the clicked page
    LeadDataList(pageNumber, null, toDate, fromDate, null, null, null);
  };

  const handleTechnicianBtnClicked = (value) => {
    setModelRequestData((prevObj) => ({
      ...prevObj,
      leadKeyID: value.leadKeyID
    }));
    setShowTechnicianModal(true);
  };

  const [expandedFollowUp, setExpandedFollowUp] = useState(null);



  const [expandedLead, setExpandedLead] = useState(null);
  const toggleExpand = (leadID) => {
    setExpandedLead((prev) => (prev === leadID ? null : leadID));
  };

  const createQuotationBtnClick = (item) => {

    {
      setModelRequestData({
        ...modelRequestData,
        leadName: item.leadName,
        requirement: item.requirement,
        quotationFormatID: item.quotationFormatID

      });
    }
    let adminProfile = {

      leadName: item.leadName,
      requirement: item.requirement,
      address: item.address,
      leadKeyID: item.leadKeyID,
      quotationFormatID: item.quotationFormatID,
      quotationKeyID: item.quotationKeyID,
      BTNAction: 'HideRef&Pre&Rev'
    };

    navigate('/add-update-quotation', { state: adminProfile });
  };
  const updateQuotationBtnClick = (item) => {

    {
      setModelRequestData({
        ...modelRequestData,
        leadName: item.leadName,
        requirement: item.requirement,
        address: item.address,
        leadKeyID: item.leadKeyID,
        quotationFormatID: item.quotationFormatID,
        quotationKeyID: item.quotationKeyID,
        BTNAction: 'HideRef&Pre&Rev'
      });
    }
    let updateQuote = {

      quotationKeyID: item.quotationKeyID,
      leadName: item.leadName,
      requirement: item.requirement,
      address: item.address,
      leadKeyID: item.leadKeyID,
      quotationFormatID: item.quotationFormatID,
      quotationKeyID: item.quotationKeyID,
      BTNAction: 'HideRef&Pre&Rev'

    };

    navigate('/add-update-quotation', { state: updateQuote });
  };

  const handleCheckboxChange = (leadID, e) => {
    let updated;
    if (selectedLeadIDs.includes(leadID)) {
      updated = selectedLeadIDs.filter((id) => id !== leadID);
    } else {
      updated = [...selectedLeadIDs, leadID];
    }
    setSelectedLeadIDs(updated);

    // Position bubble near clicked checkbox
    const rect = e.target.getBoundingClientRect();
    setBubblePos({ x: rect.right + 10, y: rect.top });
    setShowBubble(updated.length > 0);
  };


  const handleSelectAll = () => {
    if (selectedLeadIDs.length === leadListData.length) {
      setSelectedLeadIDs([]);
    } else {
      setSelectedLeadIDs(leadListData.map((item) => item.leadID));
    }
  };


  const handleTabSelect = (key) => {

    setSearchKeyword('');
    setCurrentPage(1);
    setTotalCount(0);

    if (key === 'PendingTab') {
      setActiveTab('PendingTab');
      LeadDataList(currentPage, null, toDate, fromDate, null, null, null);

      // GetNewDeviceImportListData(1, null, null, null);
    } else if (key === 'NotInterestedTab') {
      setActiveTab('NotInterestedTab');
      LeadDataList(currentPage, null, toDate, fromDate, null, null, 'NotInterested');




    }
  };


  const viewLogBtnClick = (item) => {

    let activityLogs = {

      leadKeyID: item.leadKeyID,
      leadName: item.leadName,
      leadID: item.leadID

    };

    navigate('/activity-logs-details', { state: activityLogs });
  };
  return (
    <div className="card w-full max-w-[50vh] md:max-w-[90vw] mx-auto h-auto">
      <div className="card-body p-2 bg-white shadow-md rounded-lg">
        <div className="d-flex justify-content-between items-center flex-wrap gap-2">
          <h5 className="mb-2">Lead Management</h5>
        </div>
        <Row>
          <Col>
            <Tabs activeKey={ActiveTab} id="justify-tab-example" className="whitespace-nowrap" onSelect={handleTabSelect}>
              <Tab
                eventKey="PendingTab"
                title={
                  <Tooltip title="Pending Lead">
                    <span className="text-sm md:text-base">Pending Lead</span>
                  </Tooltip>
                }
                tabClassName="tab-upcoming"
              >




                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2 ">
                  {/* Search Box */}
                  <input
                    type="text"
                    className="form-control mt-2"
                    placeholder="Search Lead"
                    style={{ maxWidth: '350px' }}
                    value={searchKeyword}
                    onChange={handleSearch}
                  />

                  {/* Action Buttons */}
                  <div className="d-flex gap-2 align-items-center">
                    {hasPermission(permissions, 'Lead', 'Can Insert') && (
                      <Tooltip title="Add Lead">
                        <button onClick={LeadAddBtnClicked} style={{ background: '#ffaa33', color: 'white' }} className="btn  btn-sm">
                          <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i>
                          <span className="d-none d-sm-inline">Add</span>
                        </button>
                      </Tooltip>


                    )}
                    <Tooltip title="Lead Transfer">
                      <button onClick={leadTransferModule} disabled={selectedLeadIDs.length === 0} style={{ background: '#ffaa33', color: 'white' }} className="btn  btn-sm">
                        {/* <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i> */}
                        <i class="fa-solid fa-arrow-right-arrow-left"></i> {" "}
                        <span className="d-none d-sm-inline">Transfer</span>
                      </button>
                    </Tooltip>
                  </div>
                </div>

                <div>
                  <div className="table-responsive" style={{ maxHeight: '65vh' }}>
                    <Table striped bordered hover>
                      <thead className="table-light">
                        <tr
                          style={{
                            position: 'sticky',
                            top: -1,
                            backgroundColor: '#fff',
                            zIndex: 10,
                            boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
                          }}
                          className="text-nowrap">
                          <th className="text-center">
                            <input
                              type="checkbox"
                              checked={leadListData.length > 0 && selectedLeadIDs.length === leadListData.length}
                              onChange={handleSelectAll}
                            />
                          </th>

                          <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                            Sr No.
                          </th>
                          <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                            Customer/Firm
                          </th>
                          <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                            Lead Name
                          </th>

                          <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                            Quotation Type
                          </th>
                          <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                            Lead Created By
                          </th>
                          <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                            Follow Up Info
                          </th>
                          <th className="text-center">Contacts</th> {/* NEW COLUMN */}


                          <th className="text-center actionSticky">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leadListData.map((item, idx) => (
                          <React.Fragment key={item.leadID}>
                            <tr className='text-nowrap' key={item.idx}>
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedLeadIDs.includes(item.leadID)}
                                  onChange={(e) => handleCheckboxChange(item.leadID, e)}
                                />
                              </td>
                              <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                {(currentPage - 1) * pageSize + idx + 1}
                              </td>
                              <td className="text-center">
                                {item.customerFirmName?.length > 30 ? (
                                  <Tooltip title={item.customerFirmName}>{`${item.customerFirmName?.substring(0, 30)}...`}</Tooltip>
                                ) : (
                                  <>{item.customerFirmName}</>
                                )}
                              </td>

                              <td
                                style={{ cursor: 'pointer', }}
                                onClick={() => toggleExpand(item.leadID)}
                              >
                                <span style={{ color: "blue" }} >{item.leadName}</span>

                                {/* Expanded details */}
                                {expandedLead === item.leadID && (
                                  <div
                                    style={{
                                      marginTop: '5px',
                                      padding: '6px',
                                      background: '#f8f9fa',
                                      borderRadius: '4px',
                                      fontSize: '14px'
                                    }}
                                  >
                                    <div><strong>Address:</strong> {item.address || 'N/A'}</div>
                                    <div><strong>Requirement:</strong> {item.requirement || 'N/A'}</div>
                                    <div><strong>Priority:</strong> {item.leadPriority || 'N/A'}</div>
                                    <div><strong>Contact:</strong> {item.contactNumber || 'N/A'}</div>
                                    <div><strong>Email:</strong> {item.emailID || 'N/A'}</div>
                                  </div>
                                )}
                              </td>


                              <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                                {item?.quotationFormatName === "Discounted Amount" ? (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      padding: '4px 8px',
                                      borderRadius: '20px',
                                      backgroundColor: '#e6f4ea',
                                      color: '#1e7d34',
                                      fontWeight: '500',
                                      fontSize: '0.85rem',
                                      animation: 'fadeIn 0.3s ease-in-out'
                                    }}
                                  >
                                    <i className="fa-solid fa-tags" style={{ marginRight: '5px' }}></i>
                                    Discounted
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      padding: '4px 8px',
                                      borderRadius: '20px',
                                      backgroundColor: '#e3f2fd',
                                      color: '#1565c0',
                                      fontWeight: '500',
                                      fontSize: '0.85rem',
                                      animation: 'fadeIn 0.3s ease-in-out'
                                    }}
                                  >
                                    <i className="fa-solid fa-file-invoice-dollar" style={{ marginRight: '5px' }}></i>
                                    Regular
                                  </span>
                                )}
                              </td>
                              <td>{item.leadCreatedBy}</td>
                              <td
                                className="text-center"
                                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                                onClick={() => setExpandedFollowUp(prev => prev === item.leadID ? null : item.leadID)}
                              >
                                <span style={{ color: "blue" }} >{item.followUpType}</span>


                                {expandedFollowUp === item.leadID && (
                                  <div
                                    style={{
                                      marginTop: '5px',
                                      padding: '6px',
                                      background: '#f8f9fa',
                                      borderRadius: '4px',
                                      fontSize: '13px'
                                    }}
                                  >
                                    {item.followUpRemark?.length > 0 ? item.followUpRemark : 'No Remark'}
                                  </div>
                                )}
                              </td>

                              <td className="text-center">
                                {item.contactList?.length > 0 ? (
                                  <span
                                    style={{ color: 'blue', cursor: 'pointer' }}
                                    onClick={() =>
                                      setExpandedContact(prev => prev === item.leadID ? null : item.leadID)
                                    }
                                  >
                                    {item.contactList.length} Contact{item.contactList.length > 1 ? 's' : ''}
                                  </span>
                                ) : (
                                  'N/A'
                                )}
                              </td>

                              {/* <td style={{ whiteSpace: 'nowrap' }}>{item?.leadTypeName}</td> */}


                              {/* {/*actionColSticky for Action fixed/*} */}
                              <td className="text-center actionColSticky " style={{ zIndex: 4 }}>
                                <div className="d-flex gap-2">
                                  {hasPermission(permissions, 'Lead', 'Can Update') && (
                                    <Tooltip title="Update Lead">
                                      <button style={{ marginRight: '5px', background: '#ffaa33', color: 'white' }} className="btn-sm btn" onClick={() => EditBtnLead(item)}>
                                        {/* <i class="fas fa-eye"></i> */}
                                        <i className="far fa-edit mb-1"></i>
                                      </button>
                                    </Tooltip>
                                  )}
                                  <Tooltip title="View Log">
                                    <button onClick={() => viewLogBtnClick(item)}
                                      style={{
                                        fontSize: '12px',
                                        marginRight: '5px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center', background: '#ffaa33', color: 'white'
                                      }}
                                      className="btn-sm btn d-flex"
                                    >
                                      <i className="fa-solid fa-eye"></i>
                                    </button>
                                  </Tooltip>
                                  {/* <Tooltip title="Delete Lead">
                          <button
                            style={{
                              fontSize: '12px',
                              marginRight: '5px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center', background: '#ffaa33', color: 'white'
                            }}
                            className="btn-sm btn d-flex"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </Tooltip> */}
                                  {hasPermission(permissions, 'FollowUp', 'Can View') && (
                                    <Tooltip title="Follow Up">
                                      <button style={{ marginRight: '5px', background: '#ffaa33', color: 'white' }} className="btn-sm btn" onClick={() => ClickFollowUpBtnLead(item)}>
                                        <i className="fas fa-comments"></i>
                                      </button>
                                    </Tooltip>
                                  )}

                                  {!item.quotationKeyID &&
                                    hasPermission(permissions, 'Quotation', 'Can Insert') && (
                                      <Tooltip title="Create Quotation">
                                        <button onClick={() => createQuotationBtnClick(item)} style={{ marginRight: '5px', background: '#ffaa33', color: 'white' }} className="btn-sm btn text-nowrap">
                                          <i className="fas fa-file-invoice"></i> {" "}
                                          Create
                                        </button>
                                      </Tooltip>
                                    )}
                                  {item.quotationKeyID &&
                                    hasPermission(permissions, 'Quotation', 'Can Update') && (

                                      <Tooltip title="Update Quotation">
                                        <button onClick={() => updateQuotationBtnClick(item)} style={{ marginRight: '5px', background: '#ffaa33', color: 'white' }} className="btn-sm btn text-nowrap">
                                          <i className="fas fa-file-invoice"></i> {" "}
                                          Update
                                        </button>
                                      </Tooltip>
                                    )}
                                </div>
                              </td>

                            </tr>
                            {expandedContact === item.leadID && item.contactList?.length > 0 && (
                              <tr>
                                <td colSpan="8" style={{ background: '#f8f9fa' }}>
                                  <div
                                    style={{
                                      padding: '10px',
                                      background: '#fff',
                                      borderRadius: '8px',
                                      border: '1px solid #ddd',
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                      animation: 'fadeIn 0.3s ease-in-out',
                                    }}
                                  >
                                    <h6 style={{ marginBottom: '10px', color: '#495057' }}>
                                      📇 Contact Details ({item.contactList.length})
                                    </h6>

                                    <table className="table table-bordered table-sm mb-0">
                                      <thead style={{ background: '#f1f3f5' }}>
                                        <tr>
                                          <th>Name</th>
                                          <th>Designation</th>
                                          <th>Contact Number</th>
                                          <th>Alternate Number</th>
                                          <th>Email</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {item.contactList.map((contact, cIdx) => (
                                          <tr key={cIdx}>
                                            <td>{contact.contactName}</td>
                                            <td>{contact.designation || 'N/A'}</td>
                                            <td>{contact.contactNumber}</td>
                                            <td>{contact.contactAlternateNumber || 'N/A'}</td>
                                            <td>{contact.contactEmailID || 'N/A'}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            )}


                          </React.Fragment>
                        ))}
                      </tbody>
                    </Table>
                    {showBubble && (
                      <div
                        className="transfer-bubble"
                        style={{ top: bubblePos.y, left: bubblePos.x }}
                      >
                        <Tooltip title="Lead Transfer">
                          <button
                            onClick={leadTransferModule}
                            className="battery-btn transfer-btn"
                          >
                            <i className="fa-solid fa-arrow-right-arrow-left"></i>
                            <span className="ms-1">Transfer</span>
                          </button>
                        </Tooltip>
                      </div>
                    )}
                    {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                  </div>
                  {totalCount > pageSize && (
                    <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handleLeadPageChange} />
                  )}
                </div>
              </Tab>
              <Tab
                eventKey="NotInterestedTab"
                title={
                  <Tooltip title="Not Interested">
                    <span className="text-sm md:text-base">Not Interested </span>
                  </Tooltip>
                }
                tabClassName="tab-upcoming"
              >




                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2 ">
                  {/* Search Box */}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Lead"
                    style={{ maxWidth: '350px' }}
                    value={searchKeyword}
                    onChange={handleSearch}
                  />

                  {/* Action Buttons */}
                  <div className="d-flex gap-2 align-items-center">

                    <Tooltip title="Lead Transfer">
                      <button onClick={leadTransferModule} disabled={selectedLeadIDs.length === 0} style={{ background: '#ffaa33', color: 'white' }} className="btn  btn-sm">
                        {/* <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i> */}
                        <i class="fa-solid fa-arrow-right-arrow-left"></i> {" "}
                        <span className="d-none d-sm-inline">Transfer</span>
                      </button>
                    </Tooltip>
                  </div>
                </div>

                <div>
                  <div className="table-responsive" style={{ maxHeight: '65vh' }}>
                    <Table striped bordered hover>
                      <thead className="table-light  ">
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
                          <th className="text-center">
                            <input
                              type="checkbox"
                              checked={leadListData.length > 0 && selectedLeadIDs.length === leadListData.length}
                              onChange={handleSelectAll}
                            />
                          </th>

                          <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                            Sr No.
                          </th>
                          <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                            Customer/Firm
                          </th>
                          <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                            Lead Name
                          </th>

                          <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                            Quotation Type
                          </th>
                          <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                            Follow Up Info
                          </th>
                          <th className="text-center">Contacts</th> {/* NEW COLUMN */}


                          <th className="text-center " style={{ whiteSpace: 'nowrap' }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {leadListData.map((item, idx) => (
                          <React.Fragment key={item.leadID}>
                            <tr className='text-nowrap' key={item.idx}>
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedLeadIDs.includes(item.leadID)}
                                  onChange={() => handleCheckboxChange(item.leadID)}
                                />
                              </td>
                              <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                {(currentPage - 1) * pageSize + idx + 1}
                              </td>
                              <td className="text-center">
                                {item.customerFirmName?.length > 30 ? (
                                  <Tooltip title={item.customerFirmName}>{`${item.customerFirmName?.substring(0, 30)}...`}</Tooltip>
                                ) : (
                                  <>{item.customerFirmName}</>
                                )}
                              </td>

                              <td
                                style={{ cursor: 'pointer', }}
                                onClick={() => toggleExpand(item.leadID)}
                              >
                                <span style={{ color: "blue" }} >{item.leadName}</span>

                                {/* Expanded details */}
                                {expandedLead === item.leadID && (
                                  <div
                                    style={{
                                      marginTop: '5px',
                                      padding: '6px',
                                      background: '#f8f9fa',
                                      borderRadius: '4px',
                                      fontSize: '14px'
                                    }}
                                  >
                                    <div><strong>Address:</strong> {item.address || 'N/A'}</div>
                                    <div><strong>Requirement:</strong> {item.requirement || 'N/A'}</div>
                                    <div><strong>Priority:</strong> {item.leadPriority || 'N/A'}</div>
                                    <div><strong>Contact:</strong> {item.contactNumber || 'N/A'}</div>
                                    <div><strong>Email:</strong> {item.emailID || 'N/A'}</div>
                                  </div>
                                )}
                              </td>


                              <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                                {item?.quotationFormatName === "Discounted Amount" ? (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      padding: '4px 8px',
                                      borderRadius: '20px',
                                      backgroundColor: '#e6f4ea',
                                      color: '#1e7d34',
                                      fontWeight: '500',
                                      fontSize: '0.85rem',
                                      animation: 'fadeIn 0.3s ease-in-out'
                                    }}
                                  >
                                    <i className="fa-solid fa-tags" style={{ marginRight: '5px' }}></i>
                                    Discounted
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      padding: '4px 8px',
                                      borderRadius: '20px',
                                      backgroundColor: '#e3f2fd',
                                      color: '#1565c0',
                                      fontWeight: '500',
                                      fontSize: '0.85rem',
                                      animation: 'fadeIn 0.3s ease-in-out'
                                    }}
                                  >
                                    <i className="fa-solid fa-file-invoice-dollar" style={{ marginRight: '5px' }}></i>
                                    Regular
                                  </span>
                                )}
                              </td>
                              <td
                                className="text-center"
                                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                                onClick={() => setExpandedFollowUp(prev => prev === item.leadID ? null : item.leadID)}
                              >
                                <span style={{ color: "blue" }} >{item.followUpType}</span>


                                {expandedFollowUp === item.leadID && (
                                  <div
                                    style={{
                                      marginTop: '5px',
                                      padding: '6px',
                                      background: '#f8f9fa',
                                      borderRadius: '4px',
                                      fontSize: '13px'
                                    }}
                                  >
                                    {item.followUpRemark?.length > 0 ? item.followUpRemark : 'No Remark'}
                                  </div>
                                )}
                              </td>

                              <td className="text-center">
                                {item.contactList?.length > 0 ? (
                                  <span
                                    style={{ color: 'blue', cursor: 'pointer' }}
                                    onClick={() =>
                                      setExpandedContact(prev => prev === item.leadID ? null : item.leadID)
                                    }
                                  >
                                    {item.contactList.length} Contact{item.contactList.length > 1 ? 's' : ''}
                                  </span>
                                ) : (
                                  'N/A'
                                )}
                              </td>

                              {/* <td style={{ whiteSpace: 'nowrap' }}>{item?.leadTypeName}</td> */}


                              {/* {/*actionColSticky for Action fixed/*} */}
                              <td
                                className="text-center    
                     "
                                style={{ zIndex: 4 }}
                              >
                                <div className="d-flex gap-2">
                                  {hasPermission(permissions, 'Lead', 'Can Update') && (
                                    <Tooltip title="Update Lead">
                                      <button style={{ marginRight: '5px', background: '#ffaa33', color: 'white' }} className="btn-sm btn" onClick={() => EditBtnLead(item)}>
                                        {/* <i class="fas fa-eye"></i> */}
                                        <i className="far fa-edit mb-1"></i>
                                      </button>
                                    </Tooltip>
                                  )}
                                  <Tooltip title="View Log">
                                    <button onClick={() => viewLogBtnClick(item)}
                                      style={{
                                        fontSize: '12px',
                                        marginRight: '5px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center', background: '#ffaa33', color: 'white'
                                      }}
                                      className="btn-sm btn d-flex"
                                    >
                                      <i className="fa-solid fa-eye"></i>
                                    </button>
                                  </Tooltip>
                                  {/* <Tooltip title="Delete Lead">
                          <button
                            style={{
                              fontSize: '12px',
                              marginRight: '5px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center', background: '#ffaa33', color: 'white'
                            }}
                            className="btn-sm btn d-flex"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </Tooltip> */}



                                </div>
                              </td>

                            </tr>
                            {expandedContact === item.leadID && item.contactList?.length > 0 && (
                              <tr>
                                <td colSpan="8" style={{ background: '#f8f9fa' }}>
                                  <div
                                    style={{
                                      padding: '10px',
                                      background: '#fff',
                                      borderRadius: '8px',
                                      border: '1px solid #ddd',
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                      animation: 'fadeIn 0.3s ease-in-out',
                                    }}
                                  >
                                    <h6 style={{ marginBottom: '10px', color: '#495057' }}>
                                      📇 Contact Details ({item.contactList.length})
                                    </h6>

                                    <table className="table table-bordered table-sm mb-0">
                                      <thead style={{ background: '#f1f3f5' }}>
                                        <tr>
                                          <th>Name</th>
                                          <th>Designation</th>
                                          <th>Contact Number</th>
                                          <th>Alternate Number</th>
                                          <th>Email</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {item.contactList.map((contact, cIdx) => (
                                          <tr key={cIdx}>
                                            <td>{contact.contactName}</td>
                                            <td>{contact.designation || 'N/A'}</td>
                                            <td>{contact.contactNumber}</td>
                                            <td>{contact.contactAlternateNumber || 'N/A'}</td>
                                            <td>{contact.contactEmailID || 'N/A'}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            )}


                          </React.Fragment>
                        ))}
                      </tbody>
                    </Table>

                    {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                  </div>
                  {totalCount > pageSize && (
                    <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handleLeadPageChange} />
                  )}
                </div>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </div>




      {showLeadModal && (
        <AddUpdateLeadModal
          show={showLeadModal}
          handleClose={() => setShowLeadModal(false)}
          modelRequestData={modelRequestData}
          isAddUpdateActionDone={isAddUpdateActionDone}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
          setShowSuccessModal={setShowSuccessModal} // ✅ pass this!
          setModelAction={setModelAction}
        />
      )}
      <TransferLeadModal
        show={showTransferComplaintModal}
        handleClose={() => setShowTransferComplaintModal(false)}
        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        selectedLeadIDs={transferLeadIDs} // pass selected leads here
      />
      <LeadTransferModal
        show={showTransferLeadModal}
        handleClose={() => setShowTransferLeadModal(false)}
        modelRequestData={modelRequestData}
        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        selectedLeadIDs={transferLeadIDs} // pass selected leads here
      />
      <StatusChangeModal
        open={showStatusChangeModal}
        onClose={() => ChangeLeadStatus(false)}
        onConfirm={() => confirmStatusChange(stateChangeStatus, user)} // Pass the required arguments
      />
      <TransferLeadLogsViewModal
        show={showLeadTransferViewModal}
        onHide={() => setShowLeadTransferViewModal(false)}
        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        modelRequestData={modelRequestData}
      />
      <AddUpdateTechnicianLeadModal
        show={showTechnicianModal}
        modelRequestData={modelRequestData}
        handleClose={() => setShowTechnicianModal(false)}
        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
      />
      {/* <SuccessPopupModal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        message={modelAction} // optional: pass your dynamic message
      /> */}
    </div>
  );
};

export default LeadList;
