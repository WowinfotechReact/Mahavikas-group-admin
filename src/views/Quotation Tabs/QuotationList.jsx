import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Tabs, Tab, Button } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import Select from 'react-select';
import { Table } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { ImportDeviceCSV } from 'services/DeviceTabCsv/DeviceCSVApi';
import { ConfigContext } from 'context/ConfigContext';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import Android12Switch from 'component/Android12Switch';
import StatusChangeModal from 'component/StatusChangeModal ';
import { GetLeadDataList } from 'services/LeadAPI/LeadApi';
import { useNavigate } from 'react-router';
import PurchaseOrderPdfUploadModal from 'views/Purchased Order/PurchaseOrderPdfUploadModal';
import { hasPermission } from 'Middleware/permissionUtils';
import PurchasedOrderProductDetailsModal from 'views/Purchased Order/PurchasedOrderProductDetailsModal';


const QuotationList = () => {
  const [moduleName, setModuleName] = useState('');
  const [showCustomerViewModel, setShowCustomerViewModel] = useState(false);
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [showNewDeviceAddUpdateModal, setShowNewDeviceAddUpdateModal] = useState(false);
  const [newDeviceImportListMap, setNewDeviceImportListData] = useState();
  const [error, setErrors] = useState(null);
  const [errorMessage, setErrorMessage] = useState();
  const [confirmImportedMsg, setConfirmImportedMsg] = useState('')
  const [importResponseData, setImportResponseData] = useState(null);

  const [ActiveTab, setActiveTab] = useState('pendingQuotation');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState();
  const [currentApiAction, setCurrentApiAction] = useState(null); // Store the function dynamically
  const [modelRequestData, setModelRequestData] = useState({
    Action: null,
    subAction: null,
    employeeKeyID: null,
    userKeyID: null,
    deviceID: null
  });
  const [stateChangeStatus, setStateChangeStatus] = useState('');





  const [searchKeyword, setSearchKeyword] = useState('');
  const [totalRecords, setTotalRecords] = useState(-1);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const { setLoader, user, permissions } = useContext(ConfigContext);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPoUploadModal, setShowPoUploadModal] = useState(false);
  const [showApprovedRejectQuoteModal, setShowApprovedRejectQuoteModal] = useState(false);
  const [modelAction, setModelAction] = useState('');
  const [pageSize, setPageSize] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalCount, setTotalCount] = useState(null);
  const [transferListData, setTransferListData] = useState([]);
  const [acceptListData, setAcceptListData] = useState([]);
  const [transferredListData, setTransferredListData] = useState([]);
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [leadListData, setLeadListData] = useState([]);

  useEffect(() => {
    if (isAddUpdateActionDone) {
      if (ActiveTab === 'AcceptDevice') {
        // GetAcceptDeviceListListData(1, null, null, null, acceptRejectDeviceObj.employeeKeyID);
      } else if (ActiveTab === 'TransferDevice') {
        // GetDeviceTransferListData(1, null, null, null);
        LeadDataList(1, null, null, null, null, null, 'Approved')
      }
      setSearchKeyword('')
      // Reset the flag after actions are done
      setIsAddUpdateActionDone(false);
    }
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    ModuleNameFunc();
  }, [ActiveTab]);
































  const handleTransferDevicePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleTransferredDevicePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleAcceptRejectDevicePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // GetAcceptDeviceListListData(pageNumber, null, toDate, fromDate, acceptRejectDeviceObj.employeeKeyID);
  };



  const [selectedOption, setSelectedOption] = useState({
    value: 'transferDevice',
    label: 'Transfer Device'
  });






  const handleTabSelect = (key) => {
    setConfirmImportedMsg(false)
    setErrors(false);
    setErrorMessage(false);
    setSearchKeyword('');
    setCurrentPage(1);
    setTotalCount(0);

    if (key === 'pendingQuotation') {
      setActiveTab('pendingQuotation');
      //   GetNewDeviceImportListData(1, null, null, null);

      LeadDataList(1, null, null, null, null, null, 'ApprovalPending')

    } else if (key === 'TransferDevice') {
      setActiveTab('TransferDevice');
      LeadDataList(1, null, null, null, null, null, 'Approved')



    } else if (key === 'AcceptDevice') {
      setActiveTab('AcceptDevice');

      LeadDataList(1, null, null, null, null, null, 'Rejected')


    }
  };
  useEffect(() => {
    LeadDataList(1, null, null, null, null, null, 'ApprovalPending')
  }, [])

  const LeadDataList = async (pageNumber, searchKeywordValue, toDate, fromDate, sortingType, sortValueName, tabName) => {
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
        tabName: tabName
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


  const closeAllModal = () => {
    setShowPoUploadModal(false)
    setShowSuccessModal(false);
    setShowApprovedRejectQuoteModal(false)
    setShowNewDeviceAddUpdateModal(false);
    setShowModal(false);

    setImportResponseData(null);
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
    if (ActiveTab === 'pendingQuotation') {
    } else if (ActiveTab === 'AcceptDevice') {
      // GetAcceptDeviceListListData(1, capitalizedValue, toDate, fromDate, acceptRejectDeviceObj.employeeKeyID);
    } else if (ActiveTab === 'TransferDevice') {
      // GetDeviceTransferListData(1, capitalizedValue, null, null);
    }

  };





  const ModuleNameFunc = () => {
    if (ActiveTab === 'pendingQuotation') {
      setModuleName('Quotation');
    } else if (ActiveTab === 'TransferDevice') {
      setModuleName('Quotation');
    } else if (ActiveTab === 'AcceptDevice') {
      setModuleName('Quotation');
    }
  };

  const handleStatusChange = (item) => {
    setStateChangeStatus(item); // You can set only relevant data if needed
    setShowStatusChangeModal(true);
  };


  const navigate = useNavigate()
  const previewQuotationBtnClick = (item, isDownloadMode = false) => {


    {
      setModelRequestData({
        ...modelRequestData,
        leadName: item.leadName,
        requirement: item.requirement,
        Action: 'FromPendingForApproval',
        BTNAction: null,
        showDownloadButton: isDownloadMode,
      });
    }


    navigate('/quotation-preview', {
      state: {
        quotationKeyID: item.quotationKeyID,
        action: 'FromPendingForApproval', BTNAction: 'Hide',
        showDownloadButton: isDownloadMode, // pass true or false
      }
    });
  };
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleExpand = (idx) => {
    setExpandedRow(prev => (prev === idx ? null : idx));
  };
  const revisionBtnQuotation = (item) => {
    {
      setModelRequestData({
        ...modelRequestData,
        leadName: item.leadName,
        requirement: item.requirement,
        quotationNumber: item.quotationNumber,
        Action: 'revisionBtnQuote',
        BTNAction: null
      });
    }


    navigate('/add-update-quotation', {
      state: {
        quotationKeyID: item.quotationKeyID,
        quotationNumber: item.quotationNumber,
        BTNAction: null,
        action: 'revisionBtnQuote'
      }
    });
  }
  const uploadPurchaseOrder = (item) => {

    setModelRequestData({
      ...modelRequestData,
      leadKeyID: item.leadKeyID,
      quotationFormatID: item.quotationFormatID,
      purchaseOrderKeyID: item.purchaseOrderKeyID || null,
      Action: null,
      subAction: 'POADD'
    })

    setShowPoUploadModal(true)
  }
  const btnClickForQuotationLogs = (item) => {

    setModelRequestData({
      ...modelRequestData,

      quotationFormatID: item.quotationFormatID,
      purchaseOrderKeyID: item.purchaseOrderKeyID || null,
      Action: null,
      subAction: 'POADD'
    })
    const qouObj = {
      leadKeyID: item.leadKeyID,
    }

    navigate('/quotation-logs', { state: qouObj })
  }

  const updateQuotationBtnClick = (item) => {

    {
      setModelRequestData({
        ...modelRequestData,
        leadName: item.leadName,
        requirement: item.requirement,
        address: item.address,
        leadKeyID: item.leadKeyID,
        quotationFormatID: item.quotationFormatID,
        quotationKeyID: item.quotationKeyID
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
      BTNAction: null

    };

    navigate('/add-update-quotation', { state: updateQuote });
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
          <h5 className="text-lg md:text-xl">{moduleName}</h5>
        </div>
        <Row>
          <Col>
            <Tabs activeKey={ActiveTab} id="justify-tab-example" className="whitespace-nowrap" onSelect={handleTabSelect}>
              {/* csv export tab */}
              <Tab
                eventKey="pendingQuotation"
                title={
                  <Tooltip title="Pending Approval">
                    <span className="text-sm md:text-base">Pending Approval</span>
                  </Tooltip>
                }
                tabClassName="tab-upcoming"
              >
                <div className="container d-flex justify-content-center align-items-center vh-80">
                  <div className="p-1 col-12 col-md-8" style={{ width: '100%' }}>
                    <div className="d-flex align-items-center justify-content-between flex-column flex-md-row" style={{ gap: '10px' }}>
                      <input
                        type="text"
                        style={{ maxWidth: '300px', flex: 1 }}
                        value={searchKeyword}
                        onChange={(e) => {
                          handleSearch(e);
                        }}
                        className="form-control "
                        placeholder="Search.."
                      />

                    </div>

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
                              Quotation Format
                            </th>
                            <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                              Quotation No.
                            </th>
                            <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                              Remark
                            </th>


                            <th className="text-center actionSticky">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leadListData.map((item, idx) => (
                            <>
                              <tr key={item.idx} className="text-nowrap">
                                <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                                <td>{item.customerFirmName}</td>

                                <td style={{ cursor: 'pointer', color: 'blue' }} onClick={() => toggleExpand(idx)}>
                                  {item.leadName || (
                                    <Tooltip title="Assign Lead">
                                      <span onClick={() => handleTechnicianBtnClicked(item)}>Assign Lead</span>
                                    </Tooltip>
                                  )}
                                </td>





                                <td>{item.quotationFormatName}</td>

                                <td>{item.quotationNumber}</td>
                                <td>{item.approveOrRejectRemark}</td>

                                <td className="text-center actionColSticky " style={{ zIndex: 4 }}>
                                  <div className="d-flex gap-2">
                                    {hasPermission(permissions, 'Quotation', 'Can View') && (
                                      <Tooltip title="Preview Quotation">
                                        <button
                                          className="btn-sm btn text-white"
                                          style={{ fontSize: '12px', background: '#ffaa33' }}
                                          onClick={() => previewQuotationBtnClick(item, false)}
                                        >
                                          Preview Quotation
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


                                    {hasPermission(permissions, 'Quotation', 'Can View') && (
                                      <Tooltip title="Quotation Logs">
                                        <button
                                          className="btn-sm btn text-white"
                                          style={{ background: '#ffaa33' }}
                                          onClick={() => btnClickForQuotationLogs(item)}
                                        >
                                          Quotation Logs
                                        </button>
                                      </Tooltip>
                                    )}
                                  </div>
                                </td>
                              </tr>

                              {/* Expanded row */}
                              {expandedRow === idx && (
                                <tr key={`expand-${item.idx}`}>
                                  <td colSpan="9" style={{ backgroundColor: '#f9f9f9' }}>
                                    <strong>Lead Info:</strong>
                                    <div><strong>Lead Priority:</strong> {item.leadPriority}</div>
                                    <div><strong>Contact Number:</strong> {item.contactNumber}</div>
                                    <div><strong>Requirement:</strong> {item.requirement}</div>
                                    <div><strong>Address:</strong> {item.address}</div>
                                  </td>
                                </tr>
                              )}
                            </>
                          ))}
                        </tbody>
                      </Table>
                      {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                    </div>
                    <div className="d-flex justify-content-end align-bottom mt-3">
                      {totalCount > pageSize && (
                        <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
                      )}
                    </div>
                  </div>
                </div>
              </Tab>

              {/* 2nd table , where select , search , checkbox, submit */}
              <Tab
                eventKey="TransferDevice"
                title={
                  <Tooltip title="Approved Quotation">
                    <span className="text-sm md:text-base">Approved Quotation</span>
                  </Tooltip>
                }
                tabClassName="tab-completed"
              >

                <div className="container d-flex justify-content-center align-items-center vh-80">
                  <div style={{ width: '100%' }}>
                    <div className="d-flex flex-column mb-2 w-100">
                      <div
                        className="d-flex mb-2 align-items-center justify-content-between flex-column flex-md-row w-100"
                        style={{ gap: '10px' }}
                      >
                        <div className="w-100" style={{ maxWidth: '400px' }}>
                          <input
                            type="text"
                            style={{ maxWidth: '400px' }}
                            value={searchKeyword}
                            onChange={handleSearch}
                            className="form-control mt-1 w-100"
                            placeholder="Search.."
                          />
                        </div>

                      </div>

                      <div
                        className="d-flex flex-column flex-md-row justify-content-between align-items-start w-100"
                        style={{ gap: '10px' }}
                      >


                      </div>
                    </div>

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
                            <th className="text-center">Sr No.</th>
                            <th className="text-center">Customer/Firm</th>
                            <th className="text-center">Lead Name</th>

                            <th className="text-center">Quotation No</th>

                            <th className="text-center">Remark</th>
                            <th className="text-center">Quotation Format</th>
                            <th className="text-center">Quotation Amt</th>
                            <th className="text-center actionSticky">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leadListData.map((item, idx) => (
                            <>
                              <tr key={item.idx} className="text-nowrap">
                                <td className="text-center">
                                  {(currentPage - 1) * pageSize + idx + 1}
                                </td>
                                <td>{item.customerFirmName}</td>

                                <td
                                  style={{ cursor: 'pointer', color: 'blue' }}
                                  onClick={() => toggleExpand(idx)}
                                >
                                  {item.leadName || (
                                    <Tooltip title="Assign Lead">
                                      <span onClick={() => handleTechnicianBtnClicked(item)}>Assign Lead</span>
                                    </Tooltip>
                                  )}
                                </td>




                                <td>{item.quotationNumber}</td>



                                <td>
                                  {item.approveOrRejectRemark?.length > 25 ? (
                                    <Tooltip title={item.approveOrRejectRemark} arrow>
                                      <span>{item.approveOrRejectRemark.substring(0, 25)}...</span>
                                    </Tooltip>
                                  ) : item.approveOrRejectRemark}
                                </td>

                                <td>{item.quotationFormatName}</td>
                                <td>{item.quotationAmount}</td>

                                <td className="text-center actionColSticky " style={{ zIndex: 4 }}>
                                  <div className="d-flex gap-2">
                                    {hasPermission(permissions, 'Quotation', 'Can Update') && (
                                      <Tooltip title="Revision Quotation">
                                        <button
                                          className="btn-sm btn text-white"
                                          style={{ background: '#ffaa33' }}
                                          onClick={() => revisionBtnQuotation(item)}
                                        >
                                          Revision Quotation
                                        </button>
                                      </Tooltip>
                                    )}
                                    {hasPermission(permissions, 'Quotation', 'Can View') && (
                                      <Tooltip title="View / Download Quotation">
                                        <button
                                          className="btn-sm btn text-white"
                                          style={{ background: '#ffaa33' }}
                                          onClick={() => previewQuotationBtnClick(item, true)}
                                        >
                                          <i className="fa-solid fa-eye"></i>
                                          {" "} View
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

                                    {hasPermission(permissions, 'Purchase Order', 'Can Insert') && (
                                      <Tooltip title="Upload Purchase Order">
                                        <button
                                          className="btn-sm btn text-white"
                                          style={{ background: '#ffaa33' }}
                                          onClick={() => uploadPurchaseOrder(item)}
                                        >
                                          Upload PO
                                        </button>
                                      </Tooltip>
                                    )}
                                    {hasPermission(permissions, 'Quotation', 'Can View') && (
                                      <Tooltip title="Quotation Logs">
                                        <button
                                          className="btn-sm btn text-white"
                                          style={{ background: '#ffaa33' }}
                                          onClick={() => btnClickForQuotationLogs(item)}
                                        >
                                          Quotation Logs
                                        </button>
                                      </Tooltip>
                                    )}
                                  </div>
                                </td>
                              </tr>

                              {expandedRow === idx && (
                                <tr key={`expand-${item.idx}`}>
                                  <td colSpan="11" style={{ background: '#f9f9f9' }}>
                                    <strong>Lead Info:</strong>
                                    <div><strong>Lead Priority:</strong> {item.leadPriority}</div>
                                    <div><strong>Contact Number:</strong> {item.contactNumber}</div>
                                    <div><strong>Requirement:</strong> {item.requirement}</div>
                                    <div><strong>Address:</strong> {item.address}</div>

                                  </td>
                                </tr>
                              )}
                            </>
                          ))}
                        </tbody>
                      </Table>
                      {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                    </div>
                    {totalCount > pageSize && (
                      <PaginationComponent
                        totalPages={totalPage}
                        currentPage={currentPage}
                        onPageChange={handleTransferDevicePageChange}
                      />
                    )}
                  </div>


                </div>




              </Tab>

              {/* 3rd table start */}
              <Tab
                eventKey="AcceptDevice"
                title={
                  <Tooltip title="Rejected Quotation">
                    <span className="text-sm md:text-base">Rejected Quotation</span>
                  </Tooltip>
                }
                tabClassName="tab-cancelled"
              >
                <div className="container d-flex flex-column align-items-center vh-80">
                  <div style={{ width: '100%' }}>
                    <div className="d-flex flex-column mb-2 w-100">
                      <div
                        className="d-flex mb-2 align-items-center justify-content-between flex-column flex-md-row w-100"
                        style={{ gap: '10px' }}
                      >
                        <input
                          type="text"
                          style={{ maxWidth: '400px' }} // Set a consistent max width
                          value={searchKeyword}
                          onChange={(e) => {
                            handleSearch(e);
                          }}
                          className="form-control mt-1 w-100"
                          placeholder="Search.."
                        />
                        {/* <input type="text" className="form-control mt-1 " placeholder="Search.." /> */}
                      </div>

                    </div>

                    {/* Table */}
                    <div className="tab-content-scroll-New-Device">
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
                            className="text-nowrap"
                          >
                            <th className="text-center">Sr No.</th>
                            <th className="text-center">Customer/Firm</th>
                            <th className="text-center">Lead Name</th>

                            <th className="text-center">Remark</th>
                            <th className="text-center">Quotation No</th>
                            <th className="text-center">Quotation Format</th>
                            <th className="text-center">Quotation Amt</th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leadListData.map((item, idx) => (
                            <>
                              <tr key={item.idx} className="text-nowrap">
                                <td className="text-center">
                                  {(currentPage - 1) * pageSize + idx + 1}
                                </td>
                                <td>{item.customerFirmName}</td>

                                <td
                                  style={{ cursor: 'pointer', color: 'blue' }}
                                  onClick={() => toggleExpand(idx)}
                                >
                                  {item.leadName || (
                                    <Tooltip title="Assign Lead">
                                      <span onClick={() => handleTechnicianBtnClicked(item)}>Assign Lead</span>
                                    </Tooltip>
                                  )}
                                </td>





                                <td>
                                  {item.approveOrRejectRemark?.length > 25 ? (
                                    <Tooltip title={item.approveOrRejectRemark} arrow>
                                      <span>{item.approveOrRejectRemark.substring(0, 25)}...</span>
                                    </Tooltip>
                                  ) : item.approveOrRejectRemark}
                                </td>

                                <td>{item.quotationNumber}</td>
                                <td>{item.quotationFormatName}</td>
                                <td>{item.quotationAmount}</td>

                                <td className="text-center">
                                  <div className="d-flex gap-2">
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

                                    {hasPermission(permissions, 'Quotation', 'Can View') && (
                                      <Tooltip title="Quotation Logs">
                                        <button
                                          className="btn-sm btn text-white"
                                          style={{ background: '#ffaa33' }}
                                          onClick={() => btnClickForQuotationLogs(item)}
                                        >
                                          Quotation Logs
                                        </button>
                                      </Tooltip>
                                    )}

                                  </div>
                                </td>
                              </tr>

                              {expandedRow === idx && (
                                <tr key={`expand-${item.idx}`}>
                                  <td colSpan="11" style={{ background: '#f9f9f9' }}>
                                    <strong>Lead Info:</strong>
                                    <div><strong>Lead Priority:</strong> {item.leadPriority}</div>
                                    <div><strong>Contact Number:</strong> {item.contactNumber}</div>
                                    <div><strong>Requirement:</strong> {item.requirement}</div>
                                    <div><strong>Address:</strong> {item.address}</div>
                                    <div><strong>Remark:</strong> {item.approveOrRejectRemark}</div>
                                    <div><strong>Quotation Number:</strong> {item.quotationNumber}</div>
                                  </td>
                                </tr>
                              )}
                            </>
                          ))}
                        </tbody>
                      </Table>
                      {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                    </div>

                    {totalCount > pageSize && (
                      <PaginationComponent
                        totalPages={totalPage}
                        currentPage={currentPage}
                        onPageChange={handleAcceptRejectDevicePageChange}
                      />
                    )}
                  </div>

                  {errorMessage && <div className="text-danger text-center mb-3">{errorMessage}</div>}

                </div>
              </Tab>

            </Tabs>
          </Col>
        </Row>
      </div>
      <SuccessPopupModal
        show={showSuccessModal}
        onHide={() => closeAllModal()}

        modelAction={modelAction}
        confirmImportedMsg={confirmImportedMsg}
        responseData={importResponseData} // ✅ send it here
      />
      {showPoUploadModal &&
        <PurchaseOrderPdfUploadModal
          show={showPoUploadModal}
          onHide={() => closeAllModal()}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
          modelRequestData={modelRequestData}
        />

      }
      {showPoUploadModal &&
        <PurchasedOrderProductDetailsModal
          show={showPoUploadModal}
          onHide={() => closeAllModal()}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
          modelRequestData={modelRequestData}
        />

      }







    </div>
  );
};

export default QuotationList;
