


import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import { Table } from 'react-bootstrap'
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router';
import { motion } from "framer-motion";
import { Hash, Calendar, ClipboardList, Tag, CheckCircle2 } from "lucide-react";
import { FileText, IndianRupee } from "lucide-react";
import { User, MapPin, Phone, Mail } from "lucide-react";

import PaginationComponent from 'component/Pagination';
import { ConfigContext } from 'context/ConfigContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Icons for eye and eye-slash
import * as XLSX from 'xlsx';
import { ChangeVehicleStatus, GetVehicleList } from 'services/Vehicle/VehicleApi';
import NoResultFoundModel from 'component/NoResultFoundModal';
import ImageModal from 'component/ImageModal';
import Android12Switch from 'component/Android12Switch';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { Tooltip } from '@mui/material';

import { GetInvoiceProductList, SendToDispatched } from 'services/Purchase Order/PurchaseOrderApi';
import PurchaseOrderPdfUploadModal from 'views/Purchased Order/PurchaseOrderPdfUploadModal';
import { hasPermission } from 'Middleware/permissionUtils';
import { Link } from 'react-router-dom';
import DispatchedLogisticsModal from 'views/Dispatched Logistics/DispatchedLogisticsModal';

const ReadyForDispatchList = () => {

      const [stateChangeStatus, setStateChangeStatus] = useState('');
      const [imgModalTitle, setImgModalTitle] = useState('');
      const [imgModalShow, setImgModalShow] = useState(false);
      const [selectedImage, setSelectedImage] = useState('');
      const [totalRecords, setTotalRecords] = useState(-1);
      const { setLoader, user, permissions } = useContext(ConfigContext);
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

      const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);

      const [showPoUploadModal, setShowPoUploadModal] = useState(false);
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

                  GetPOListData(1, null, toDate, fromDate, 'Ready For Dispatch');

                  setSearchKeyword('');
            }
            setIsAddUpdateActionDone(false);
      }, [isAddUpdateActionDone]);



      useEffect(() => {
            GetPOListData(1, null, toDate, fromDate, 'Ready For Dispatch');
      }, []);

      const GetPOListData = async (pageNumber, searchKeywordValue, toDate, fromDate, tabName) => {
            // debugger
            setLoader(true);
            try {
                  const data = await GetInvoiceProductList({
                        pageSize,
                        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
                        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
                        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
                        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                        tabName: tabName,
                        sortingDirection: null,
                        sortingColumnName: null,
                        userKeyID: user.userKeyID,

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







      const handleSearch = (e) => {
            // debugger
            let searchKeywordValue = e.target.value;
            const trimmedValue = searchKeywordValue.replace(/^\s+/g, '');
            const capitalizedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1).toLowerCase();
            if (searchKeywordValue.length === 1 && searchKeywordValue.startsWith(' ')) {
                  searchKeywordValue = searchKeywordValue.trimStart();
                  return;
            }
            setSearchKeyword(capitalizedValue);

            GetPOListData(1, capitalizedValue, toDate, fromDate, "Ready For Dispatch");



      };


      const handleReadyForDispatchPageChange = (pageNumber) => {
            setCurrentPage(pageNumber);
            GetPOListData(pageNumber, null, toDate, fromDate, 'Ready For Dispatch');
      };






      const handleStatusChange = (value) => {
            setStateChangeStatus(value); // You can set only relevant data if needed
            setModelRequestData({
                  ...modelRequestData,
                  soSerialMappingList: value.soSerialMappingList,
                  invoiceProductMappingList: value.invoiceProductMappingList,
                  Action: null,
                  leadKeyID: value.leadKeyID, address: value.address,
                  invoiceKeyID: value.invoiceKeyID


            })
            setShowStatusChangeModal(true);

      };
      const closeAllModal = () => {
            // onHide();
            navigate('/purchase-order-management')
            setShowPoUploadModal(false)
            setShowSuccessModal(false);
      };
      const [expandedRow, setExpandedRow] = useState(null);

      const toggleExpand = (invoiceID) => {
            setExpandedRow((prev) => (prev === invoiceID ? null : invoiceID));
      };

      const confirmStatusChange = async (row, user) => {
            setLoader(true);

            // debugger
            try {
                  const { purchaseOrderKeyID } = row; // Destructure to access only what's needed
                  const response = await SendToDispatched(user.userKeyID, purchaseOrderKeyID);

                  if (response && response.data.statusCode === 200) {
                        setLoader(false);

                        // Successfully changed the status
                        setShowStatusChangeModal(false);
                        setStateChangeStatus(null);
                        GetPOListData(currentPage, null, toDate, fromDate, 'Ready For Dispatch');
                        // GetMasterDistrictListData(currentPage, null, toDate, fromDate);
                        setShowSuccessModal(true);
                        setModelAction('Send to dispatched successfully.');
                  } else {
                        setLoader(false);
                        console.error(response?.data?.errorMessage);
                        setShowSuccessModal(true);
                        setModelAction('Failed to change Employee status.');
                  }
            } catch (error) {
                  setLoader(false);
                  console.error('Error changing Employee status:', error);
                  setShowSuccessModal(true);
                  setModelAction('An error occurred while changing the Employee status.');
            }
      };

      // Utility function to format the vehicle number




      const addSerialNoToEachProductQty = (value, actionType) => {

            let updateQuote = {
                  leadKeyID: value.leadKeyID,
                  quotationFormatID: value.quotationFormatID,
                  Action: actionType === 'HideBtn' ? 'HideForReadyForDispatch' : null
            };

            navigate('/add-product-sales-order', { state: updateQuote, });
      };

      const TaxInvoiceBtnClick = (value) => {
            {
                  setModelRequestData({
                        ...modelRequestData,
                        salesOrderKeyID: value.salesOrderKeyID,
                        Action: 'SalesOrderReport'
                  });
            }
            navigate('/tax-invoice-report', {
                  state: {
                        salesOrderKeyID: value.salesOrderKeyID,
                        Action: 'SalesOrderReport'
                  }
            });
      };
      const viewLogBtnClick = (value) => {


            let activityLogs = {

                  leadKeyID: value.leadKeyID,
                  leadID: value.leadID,
                  leadName: value.leadName

            };

            navigate('/activity-logs-details', { state: activityLogs });
      };



      return (
            <>
                  <div className="card w-full max-w-[50vh] mx-auto h-auto">
                        <div className="card-body p-2 bg-white shadow-md rounded-lg">
                              {/* Top controls */}



                              <div className="d-flex justify-content-between align-items-center mb-1">
                                    <div className="flex-grow-1 ">
                                          <h5 className="mb-0">Ready For Dispatch </h5>
                                    </div>


                              </div>


                              <div className="d-flex justify-content-between align-items-center mb-2">
                                    <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Search Ready For Dispatched Order"
                                          style={{ maxWidth: '350px' }}
                                          value={searchKeyword}
                                          onChange={(e) => {
                                                handleSearch(e);
                                          }}
                                    />

                              </div>

                              {/* Table */}
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
                                                      <th className="text-center">Sr.No.</th>
                                                      <th className="text-center">Invoice No.</th>
                                                      <th className="text-center">Lead Info</th>
                                                      <th className="text-center">Product Info</th>
                                                      <th className="text-center">Invoice Info</th>

                                                      <th className="text-center">Po Info.</th>
                                                      <th className="text-center">Quotation Info</th>

                                                      {/* <th className="text-center">Status</th> */}
                                                      <th className="text-center actionSticky">Action</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                {vehicleListData?.map((value, idx) => (
                                                      <React.Fragment key={value.invoiceID}>
                                                            {/* Main Row */}
                                                            <tr className="tableBodyTd text-nowrap">
                                                                  <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                                                                  <td className="text-center">
                                                                        <span className="d-flex align-items-center justify-content-center gap-2">
                                                                              <i className="fas fa-file-invoice text-primary"></i>
                                                                              <strong>{value.invoiceNumber}</strong>
                                                                        </span>
                                                                  </td>

                                                                  <td className="text-start align-middle">
                                                                        <motion.div
                                                                              initial={{ opacity: 0, y: -5 }}
                                                                              animate={{ opacity: 1, y: 0 }}
                                                                              transition={{ duration: 0.3 }}
                                                                              className="d-flex flex-column gap-1"
                                                                              style={{ fontSize: "13px", lineHeight: "1.4" }} // keeps height tight
                                                                        >
                                                                              {/* Lead Name */}
                                                                              <div className="d-flex align-items-center gap-2">
                                                                                    <User size={14} className="text-primary" />


                                                                                    {value.leadName?.length > 30 ? (
                                                                                          <Tooltip title={value.leadName}>{`${value.leadName?.substring(0, 30)}...`}</Tooltip>
                                                                                    ) : (
                                                                                          <span className="fw-semibold">{value.leadName}</span>
                                                                                    )}
                                                                              </div>

                                                                              {/* Address */}
                                                                              <div className="d-flex align-items-center gap-2 text-truncate" style={{ maxWidth: "200px" }}>
                                                                                    <MapPin size={14} className="text-danger" />
                                                                                    {value.address?.length > 30 ? (
                                                                                          <Tooltip title={value.address}>{`${value.address?.substring(0, 30)}...`}</Tooltip>
                                                                                    ) : (
                                                                                          <span  >{value.address}</span>
                                                                                    )}

                                                                              </div>

                                                                              {/* Contact Number */}
                                                                              <div className="d-flex align-items-center gap-2">
                                                                                    <Phone size={14} className="text-success" />
                                                                                    <span>{value.contactNumber}</span>
                                                                              </div>

                                                                              {/* Email */}
                                                                              <div className="d-flex align-items-center gap-2 text-truncate" style={{ maxWidth: "200px" }}>
                                                                                    <Mail size={14} className="text-warning" />
                                                                                    <span title={value.emailID}>{value.emailID}</span>
                                                                              </div>
                                                                        </motion.div>
                                                                  </td>
                                                                  <td>
                                                                        <a
                                                                              href="#"
                                                                              onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    toggleExpand(value.invoiceID);
                                                                              }}
                                                                              style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}
                                                                        >
                                                                              {value.products?.length === 1 ? (
                                                                                    // ✅ Single product → show product name
                                                                                    <>{value.products[0].productName}</>
                                                                              ) : (
                                                                                    // ✅ Multiple products → just say "Multiple Products"
                                                                                    <> Products Details</>
                                                                              )}

                                                                              <i
                                                                                    className={`ms-2 fa-solid ${expandedRow === value.invoiceID ? "fa-chevron-up" : "fa-chevron-down"
                                                                                          }`}
                                                                              ></i>
                                                                        </a>
                                                                  </td>





                                                                  <td className="text-start">
                                                                        <motion.div
                                                                              initial={{ opacity: 0, y: -5 }}
                                                                              animate={{ opacity: 1, y: 0 }}
                                                                              transition={{ duration: 0.3 }}
                                                                              className="d-flex flex-column gap-1"
                                                                        >
                                                                              {/* Invoice Number */}
                                                                              <div className="d-flex align-items-center gap-2">
                                                                                    <FileText size={16} className="text-primary" />
                                                                                    <span>{value.invoiceNumber}</span>
                                                                              </div>

                                                                              {/* Invoice Date */}
                                                                              <div className="d-flex align-items-center gap-2">
                                                                                    <Calendar size={16} className="text-success" />
                                                                                    <span>{value.invoiceDate}</span>
                                                                              </div>

                                                                              {/* Invoice Amount */}
                                                                              <motion.div
                                                                                    initial={{ scale: 0.9 }}
                                                                                    animate={{ scale: 1 }}
                                                                                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                                                                                    className="d-flex align-items-center gap-2"
                                                                              >
                                                                                    <IndianRupee size={16} className="text-danger" />
                                                                                    <strong>{value.invoiceAmount}</strong>
                                                                              </motion.div>
                                                                        </motion.div>
                                                                  </td>


                                                                  <td className="text-start align-middle">
                                                                        <motion.div
                                                                              initial={{ opacity: 0, y: -5 }}
                                                                              animate={{ opacity: 1, y: 0 }}
                                                                              transition={{ duration: 0.3 }}
                                                                              className="d-flex flex-column gap-1"
                                                                              style={{ fontSize: "13px", lineHeight: "1.4" }} // keeps it compact
                                                                        >
                                                                              {/* PO Status */}
                                                                              <div className="d-flex align-items-center gap-2">
                                                                                    <ClipboardList size={14} className="text-primary" />
                                                                                    <span className="fw-semibold">{value.poStatusName}</span>
                                                                              </div>

                                                                              {/* PO Number */}
                                                                              <div className="d-flex align-items-center gap-2">
                                                                                    <Hash size={14} className="text-success" />
                                                                                    <span>{value.poNumber}</span>
                                                                              </div>

                                                                              {/* PO Date */}
                                                                              <div className="d-flex align-items-center gap-2">
                                                                                    <Calendar size={14} className="text-danger" />
                                                                                    <span>{value.poDate}</span>
                                                                              </div>
                                                                        </motion.div>
                                                                  </td>

                                                                  <td className="text-center">
                                                                        <motion.div
                                                                              initial={{ opacity: 0, y: 10 }}
                                                                              animate={{ opacity: 1, y: 0 }}
                                                                              transition={{ duration: 0.3 }}
                                                                              className="d-flex flex-column align-items-center gap-2"
                                                                        >
                                                                              <div className="d-flex align-items-center gap-2">
                                                                                    {value.quotationFormatName === "Regular" ? (
                                                                                          <CheckCircle2 size={16} className="text-primary" />
                                                                                    ) : (
                                                                                          <Tag size={16} className="text-warning" />
                                                                                    )}
                                                                                    <span className="fw-semibold">
                                                                                          {value.quotationFormatName}
                                                                                    </span>
                                                                              </div>

                                                                              <div className="d-flex align-items-center gap-2">
                                                                                    <Hash size={16} className="text-success" />
                                                                                    <span>{value.quotationNumber}</span>
                                                                              </div>
                                                                        </motion.div>
                                                                  </td>


                                                                  <td className="text-center actionColSticky " style={{ zIndex: 4 }}>
                                                                        <div className="d-flex gap-2">
                                                                              {hasPermission(permissions, "Ready for dispatch", "Can Insert") && (
                                                                                    <Tooltip title={"Ready For Dispatch "}>

                                                                                          <button className='btn text-white btn-sm' style={{ background: '#ff7d34' }} onClick={() => handleStatusChange(value)}>Dispatch</button>
                                                                                    </Tooltip>
                                                                              )}
                                                                              {/* {hasPermission(permissions, "Ready for dispatch", "Can View") && ( */}
                                                                              <Tooltip title={"Sales Order Report"}>

                                                                                    <button className='btn text-white btn-sm' style={{ background: '#ff7d34' }} onClick={() => TaxInvoiceBtnClick(value)}>Sales Order Report</button>
                                                                              </Tooltip>
                                                                              {/* )} */}

                                                                              {hasPermission(permissions, "Sales Order", "Can View") && (
                                                                                    <Tooltip title="View Sales Order">
                                                                                          <button
                                                                                                style={{
                                                                                                      padding: "4px 8px",
                                                                                                      fontSize: "12px",
                                                                                                      height: "28px",
                                                                                                      width: "28px",
                                                                                                      background: "#ffaa33",
                                                                                                      color: "white",
                                                                                                }}
                                                                                                onClick={() => addSerialNoToEachProductQty(value, "HideBtn")}
                                                                                                type="button"
                                                                                                className="btn-sm btn ms-2"
                                                                                          >
                                                                                                <i className="fa-solid fa-eye"></i>
                                                                                          </button>
                                                                                    </Tooltip>
                                                                              )}
                                                                              <Tooltip title="View Log">
                                                                                    <button
                                                                                          onClick={() => viewLogBtnClick(value)}
                                                                                          style={{
                                                                                                padding: "4px 8px",
                                                                                                fontSize: "12px",
                                                                                                height: "28px",
                                                                                                width: "28px",
                                                                                                background: "#ffaa33",
                                                                                                color: "white",
                                                                                          }}
                                                                                          className="btn-sm btn ms-2"
                                                                                    >
                                                                                          <i className="fa-solid fa-eye"></i>
                                                                                    </button>
                                                                              </Tooltip>
                                                                        </div>
                                                                  </td>
                                                            </tr>

                                                            {/* Expanded Products Row */}
                                                            {expandedRow === value.invoiceID && (
                                                                  <tr>
                                                                        <td colSpan="16">
                                                                              <table className="table table-sm table-bordered mb-0">
                                                                                    <thead className="table-secondary">
                                                                                          <tr>
                                                                                                <th>Product</th>
                                                                                                <th>Manufacturer</th>
                                                                                                <th>Variant</th>
                                                                                                <th>Model</th>
                                                                                                <th>Unit</th>
                                                                                                <th>Qty</th>
                                                                                                <th>Rate</th>
                                                                                                <th>GST%</th>
                                                                                                <th>Invoice Amount</th>
                                                                                          </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                          {value.invoiceProductMappingList?.map((p) => (
                                                                                                <tr key={p.poProductMapID}>
                                                                                                      <td>{p.productName}</td>
                                                                                                      <td>{p.manufacturerName}</td>
                                                                                                      <td>{p.variantName}</td>
                                                                                                      <td>{p.modelName}</td>
                                                                                                      <td>{p.unit}</td>
                                                                                                      <td>{p.quantity}</td>
                                                                                                      <td>{p.rate}</td>
                                                                                                      <td>{p.gstPercentage}</td>
                                                                                                      <td>{p.invoiceTotalAmount}</td>
                                                                                                </tr>
                                                                                          ))}
                                                                                    </tbody>
                                                                              </table>
                                                                        </td>
                                                                  </tr>
                                                            )}
                                                      </React.Fragment>
                                                ))}
                                          </tbody>

                                    </Table>
                                    {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                              </div>

                              {/* Pagination */}
                              <div className="d-flex justify-content-end ">
                                    {totalCount > pageSize && (
                                          <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handleReadyForDispatchPageChange} />
                                    )}
                              </div>



                        </div>
                  </div>

                  {showStatusChangeModal &&
                        <DispatchedLogisticsModal
                              open={showStatusChangeModal}
                              onClose={() => setShowStatusChangeModal(false)}
                              modelRequestData={modelRequestData}
                              onConfirm={() => confirmStatusChange(stateChangeStatus, user)} // Pass the required arguments
                        />
                  }
                  {showSuccessModal && (
                        <SuccessPopupModal
                              show={showSuccessModal}
                              onHide={() => closeAllModal()}
                              setShowSuccessModal={setShowSuccessModal}
                              modelAction={modelAction}
                        />
                  )}
                  {showPoUploadModal &&
                        <PurchaseOrderPdfUploadModal
                              show={showPoUploadModal}
                              onHide={() => closeAllModal()}
                              setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                              modelRequestData={modelRequestData}
                        />

                  }
                  <ImageModal show={imgModalShow} onHide={() => setImgModalShow(false)} imageUrl={selectedImage} title={imgModalTitle} />
            </>
      );
};

export default ReadyForDispatchList;
