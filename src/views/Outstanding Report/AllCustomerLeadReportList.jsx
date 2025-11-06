



import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaBuilding } from "react-icons/fa";
import React, { useState, useEffect, useContext } from 'react';
import { ConfigContext } from 'context/ConfigContext';
import { FaArrowLeft } from "react-icons/fa"; // FontAwesome arrow, or use any arrow SVG

import NoResultFoundModal from 'component/NoResultFoundModal';
import { Collapse, Button, Table } from "react-bootstrap"; // bootstrap components
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import Android12Switch from 'component/Android12Switch';
import PaginationComponent from 'component/Pagination';
import { Tooltip } from '@mui/material';
import SuccessPopupModal from 'component/SuccessPopupModal';
import StatusChangeModal from 'component/StatusChangeModal ';
import { ChangeBannerStatus, GetBannerList } from 'services/Banner/BannerApi';
import { GetAllCustomerLeadsReportApi } from "services/CustomerStaff/CustomerStaffApi";
import { useLocation, useNavigate } from "react-router";

const AllCustomerLeadReport = () => {
      const { setLoader, user } = useContext(ConfigContext);
      const [modelRequestData, setModelRequestData] = useState({


            leadKeyID: null,
            leadName: null,
            requirement: null,
            address: null,
            quotationAmount: null,
            poGrandTotal: null,
            quotationFormatID: null,
            quotationKeyID: null,
            purchaseOrderKeyID: null


      })
      const [outstandingReport, setOutstandingReport] = useState([]);
      const [searchKeyword, setSearchKeyword] = useState('');
      const [currentPage, setCurrentPage] = useState(1);
      const [pageSize] = useState(30);
      const [totalCount, setTotalCount] = useState(0);
      const [totalPages, setTotalPages] = useState(0);
      const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
      const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
      const [statusChangeRow, setStatusChangeRow] = useState(null);
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [modelAction, setModelAction] = useState('');
      const [noResultFound, setNoResultFound] = useState(false);

      useEffect(() => {
            GetAllCustomerLeadsReportApiData(currentPage, searchKeyword);
            setIsAddUpdateActionDone(false);
      }, [currentPage, isAddUpdateActionDone]);
      const location = useLocation()

      const GetAllCustomerLeadsReportApiData = async (pageNumber, searchKeywordValue) => {
            setLoader(true);

            try {
                  const response = await GetAllCustomerLeadsReportApi({
                        pageNo: pageNumber - 1,
                        pageSize: pageSize,
                        sortingDirection: null, //or null
                        sortingColumnName: null, //or null
                        searchKeyword: searchKeywordValue === undefined || searchKeywordValue === null ? searchKeyword : searchKeywordValue,
                        fromDate: null,
                        toDate: null,
                        userKeyID: user.userKeyID,
                        customerKeyID: location.state.customerKeyID


                  });

                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false);
                              if (response?.data?.responseData?.data) {
                                    const leadList = response.data.responseData.data;
                                    const totalCount = response.data.totalCount;

                                    setTotalCount(totalCount);
                                    setTotalPages(Math.ceil(totalCount / pageSize));
                                    setOutstandingReport(leadList);
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

      const [openRow, setOpenRow] = useState(null); // store which row is open

      const toggleRow = (key) => {
            setOpenRow(openRow === key ? null : key);
      };
      const handleSearch = (e) => {
            const value = e.target.value.trimStart();
            const formatted = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            setSearchKeyword(formatted);
            setCurrentPage(1); // Reset to first page
            GetAllCustomerLeadsReportApiData(1, formatted);
      };

      const handlePageChange = (pageNumber) => {
            setCurrentPage(pageNumber);
            GetAllCustomerLeadsReportApiData(pageNumber, searchKeyword);
      };

      const handleStatusChangeClick = (row) => {
            setStatusChangeRow(row);
            setShowStatusChangeModal(true);
      };

      const confirmStatusChange = async () => {
            // debugger
            if (!statusChangeRow) return;
            setLoader(true);
            try {
                  const response = await ChangeBannerStatus(statusChangeRow.bannerKeyID, user?.userKeyID);
                  if (response?.data?.statusCode === 200) {
                        setModelAction('Banner status changed successfully.');
                  } else {
                        setModelAction('Failed to change manufacturer status.');
                  }
                  GetAllCustomerLeadsReportApiData(currentPage, searchKeyword);
            } catch (error) {
                  console.error(error);
                  setModelAction('An error occurred while changing the status.');
            } finally {
                  setLoader(false);
                  setShowStatusChangeModal(false);
                  setShowSuccessModal(true);
            }
      };

      const openAddModal = () => {
            setModelRequestData({ Action: null, bannerKeyID: null });
            setShowAddUpdateModal(true);
      };

      const openEditModal = (id) => {
            setModelRequestData({ Action: 'Update', bannerKeyID: id });
            setShowAddUpdateModal(true);
      };

      const closeAllModals = () => {
            setShowSuccessModal(false);
      };
      const navigate = useNavigate()

      const totalDueAmount = outstandingReport.reduce((acc, item) => acc + (item.leadDueAmount || 0), 0);
      const totalPaidAmount = outstandingReport.reduce((acc, item) => acc + (item.leadPaidAmount || 0), 0);
      const totalLeadAmount = outstandingReport.reduce((acc, item) => acc + (item.leadQuotationAmount || 0), 0);



      const goForPaymentCollection = (item) => {

            {
                  setModelRequestData({
                        ...modelRequestData,
                        leadName: item.leadName,
                        requirement: item.requirement,
                        address: item.address,
                        leadKeyID: item.leadKeyID,
                        quotationFormatID: item.quotationFormatID,
                        // quotationFormatID: item.quotationFormatID,
                        quotationKeyID: item.quotationKeyID
                  });
            }
            // setShowInvoiceUploadModal(true)


            navigate('/invoice-list', {
                  state: {
                        leadKeyID: item.leadKeyID,
                        leadName: item.leadName,
                        requirement: item.requirement,
                        address: item.address,
                        quotationAmount: item.quotationAmount,
                        poGrandTotal: item.poGrandTotal,
                        quotationFormatID: item.quotationFormatID,
                        quotationKeyID: item.quotationKeyID,
                        purchaseOrderKeyID: item.purchaseOrderKeyID

                  }
            });
      };
      return (
            <>
                  <div className="card w-full max-w-[50vh] mx-auto h-auto">
                        <div className="card-body p-2 bg-white shadow-md rounded-lg">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                    <button
                                          className="btn btn-link text-decoration-none d-flex align-items-center"
                                          onClick={() => navigate(-1)}
                                    >
                                          <FaArrowLeft className="me-2" /> Back
                                    </button>
                                    <div className="flex-grow-1 ">
                                          <h4 className="mb-0">All Customer Leads  </h4>
                                    </div>
                              </div>

                              <div className="d-flex justify-content-between align-items-center mb-2">
                                    <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Search All Customer Leads"
                                          style={{ maxWidth: '350px' }}
                                          value={searchKeyword}
                                          onChange={handleSearch}
                                    />


                              </div>

                              <div className="table-responsive" style={{ maxHeight: '65vh' }}>
                                    <Table striped bordered hover>
                                          <thead className="table-light">
                                                <tr
                                                      style={{
                                                            position: 'sticky',
                                                            top: 0,
                                                            backgroundColor: '#fff',
                                                            zIndex: 12, // higher than tbody
                                                            boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
                                                      }}
                                                      className="text-nowrap"
                                                >
                                                      <th>Sr No</th>
                                                      <th>Lead Info</th>
                                                      <th>Due Amt ⟨₹⟩</th>
                                                      <th>Paid Amt ⟨₹⟩</th>
                                                      <th>Total Amt ⟨₹⟩</th>
                                                      <th>Details</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                <tr
                                                      style={{
                                                            position: 'sticky',
                                                            top: 40, // push it just below the header height
                                                            backgroundColor: '#f8f9fa',
                                                            zIndex: 11, // just below header
                                                            boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
                                                      }}
                                                      className="fw-bold text-center"
                                                >
                                                      <td className="text-center" colSpan={2}>Total</td>
                                                      <td className="text-center">
                                                            {new Intl.NumberFormat('en-IN').format(Math.round(totalDueAmount))}
                                                      </td>
                                                      <td className="text-center">
                                                            {new Intl.NumberFormat('en-IN').format(Math.round(totalPaidAmount))}
                                                      </td>
                                                      <td className="text-center" s>
                                                            {new Intl.NumberFormat('en-IN').format(Math.round(totalLeadAmount))}
                                                      </td>
                                                      <td></td>
                                                </tr>
                                                {outstandingReport.map((item, index) => {
                                                      const rowKey = item.customerKeyID;
                                                      return (
                                                            <React.Fragment key={rowKey}>
                                                                  {/* Main Row */}
                                                                  <tr>
                                                                        <td className="text-center">{(currentPage - 1) * pageSize + index + 1}</td>
                                                                        <td className="text-center">
                                                                              {/* Firm Name */}
                                                                              <motion.div
                                                                                    initial={{ opacity: 0, y: -5 }}
                                                                                    animate={{ opacity: 1, y: 0 }}
                                                                                    transition={{ duration: 0.3 }}
                                                                                    className="fw-bold mb-1 d-flex justify-content-center align-items-center"
                                                                              >
                                                                                    <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => goForPaymentCollection(item)}> {item.leadName} </span>
                                                                              </motion.div>

                                                                              {/* Email & Phone Centered */}
                                                                              <motion.div
                                                                                    initial={{ opacity: 0, y: -5 }}
                                                                                    animate={{ opacity: 1, y: 0 }}
                                                                                    transition={{ duration: 0.3, delay: 0.1 }}
                                                                                    className="d-flex justify-content-center align-items-center text-muted small"
                                                                                    style={{ gap: "1rem" }}
                                                                              >
                                                                                    <span>
                                                                                          <FaEnvelope className="me-1 text-danger" />
                                                                                          {item.emailID || "-"}
                                                                                    </span>
                                                                                    <span>
                                                                                          <FaPhoneAlt className="me-1 text-success" />
                                                                                          {item.contactNumber || "-"}
                                                                                    </span>
                                                                              </motion.div>

                                                                              {/* Quotation Number Centered */}
                                                                              <motion.div
                                                                                    initial={{ opacity: 0, y: -5 }}
                                                                                    animate={{ opacity: 1, y: 0 }}
                                                                                    transition={{ duration: 0.3, delay: 0.2 }}
                                                                                    className="d-flex justify-content-center align-items-center text-primary small mt-1"
                                                                              >
                                                                                    <span>
                                                                                          <strong>Quote No:</strong> {item.quotationNumber || "-"}
                                                                                    </span>
                                                                              </motion.div>
                                                                        </td>



                                                                        <td className="text-center">
                                                                              {new Intl.NumberFormat('en-IN', {
                                                                                    style: 'decimal',
                                                                                    maximumFractionDigits: 0,
                                                                                    minimumFractionDigits: 0
                                                                              }).format(Math.round(item.leadDueAmount))}
                                                                        </td>
                                                                        <td className="text-center">
                                                                              {new Intl.NumberFormat('en-IN', {
                                                                                    style: 'decimal',
                                                                                    maximumFractionDigits: 0,
                                                                                    minimumFractionDigits: 0
                                                                              }).format(Math.round(item.leadPaidAmount))}
                                                                        </td>
                                                                        <td className="text-center">
                                                                              {new Intl.NumberFormat('en-IN', {
                                                                                    style: 'decimal',
                                                                                    maximumFractionDigits: 0,
                                                                                    minimumFractionDigits: 0
                                                                              }).format(Math.round(item.leadQuotationAmount))}
                                                                        </td>
                                                                        <td className="text-center">
                                                                              <button
                                                                                    style={{ background: '#ff7d34' }}
                                                                                    className="text-white btn btn-sm"

                                                                                    size="sm"
                                                                                    onClick={() => toggleRow(rowKey)}
                                                                              >
                                                                                    {openRow === rowKey ? (
                                                                                          <>
                                                                                                <FaChevronUp /> Hide
                                                                                          </>
                                                                                    ) : (
                                                                                          <>
                                                                                                <FaChevronDown /> View
                                                                                          </>
                                                                                    )}
                                                                              </button>
                                                                        </td>
                                                                  </tr>

                                                                  {/* Expandable Row */}
                                                                  <tr>
                                                                        <td colSpan={6} style={{ padding: 0, border: "none" }}>
                                                                              <Collapse in={openRow === rowKey}>
                                                                                    <div className="p-3 bg-light">
                                                                                          <div className="row">

                                                                                                <div className="col-md-4 mb-2">
                                                                                                      <strong>Customer / Firm Name:</strong> {item.customerFirmName || "-"}
                                                                                                </div>
                                                                                                <div className="col-md-4 mb-2">
                                                                                                      <strong>Lead ID:</strong> {item.leadID || "-"}
                                                                                                </div>

                                                                                                <div className="col-md-4 mb-2">
                                                                                                      <strong>Requirement:</strong> {item.requirement || '-'}
                                                                                                </div>
                                                                                                <div className="col-md-4 mb-2">
                                                                                                      <strong>Address:</strong> {item.address || '-'}
                                                                                                </div>



                                                                                                <div className="col-md-4 mb-2">
                                                                                                      <strong>Alt Mobile:</strong> {item.alternateNumber || "-"}
                                                                                                </div>



                                                                                                <div className="col-md-4 mb-2">
                                                                                                      <strong>Quotation Format :</strong> {item.quotationFormatName || '-'}
                                                                                                </div>
                                                                                                <div className="col-md-4 mb-2">
                                                                                                      <strong>Quotation Date:</strong> {item.quotationDate || '-'}
                                                                                                </div>

                                                                                                <div className="col-md-4 mb-2">
                                                                                                      <strong> Remark:</strong> {item.approveOrRejectRemark || '-'}
                                                                                                </div>
                                                                                                <div className="col-md-4 mb-2">
                                                                                                      <strong>Lead Created By:</strong> {item.leadCreatedBy || '-'}
                                                                                                </div>
                                                                                                <div className="col-md-4 mb-2">
                                                                                                      <strong>Follow Up Remark:</strong> {item.followUpRemark || '-'}
                                                                                                </div>

                                                                                          </div>
                                                                                    </div>
                                                                              </Collapse>
                                                                        </td>
                                                                  </tr>
                                                            </React.Fragment>
                                                      );
                                                })}
                                          </tbody>
                                          <tfoot style={{ color: '#ff7d34' }} className=" fw-bold text-center">
                                                <tr className="text-center">
                                                      <td colSpan={2}>Total</td>
                                                      <td className="text-center">
                                                            {new Intl.NumberFormat('en-IN').format(Math.round(totalDueAmount))}
                                                      </td>
                                                      <td className="text-center">
                                                            {new Intl.NumberFormat('en-IN').format(Math.round(totalPaidAmount))}
                                                      </td>
                                                      <td className="text-center">
                                                            {new Intl.NumberFormat('en-IN').format(Math.round(totalLeadAmount))}
                                                      </td>
                                                      <td></td>
                                                </tr>
                                          </tfoot>
                                    </Table>
                              </div>

                              <div className="d-flex justify-content-end">
                                    {totalCount > pageSize && (
                                          <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
                                    )}
                              </div>
                        </div>
                  </div>



                  <StatusChangeModal open={showStatusChangeModal} onClose={() => setShowStatusChangeModal(false)} onConfirm={confirmStatusChange} />

                  <SuccessPopupModal
                        show={showSuccessModal}
                        onHide={closeAllModals}
                        setShowSuccessModal={setShowSuccessModal}
                        modelAction={modelAction}
                  />


            </>
      );
};

export default AllCustomerLeadReport;
