



import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaBuilding } from "react-icons/fa";
import React, { useState, useEffect, useContext } from 'react';
import { ConfigContext } from 'context/ConfigContext';
import NoResultFoundModal from 'component/NoResultFoundModal';
import { Collapse, Button, Table } from "react-bootstrap"; // bootstrap components
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import Android12Switch from 'component/Android12Switch';
import PaginationComponent from 'component/Pagination';
import { Tooltip } from '@mui/material';
import SuccessPopupModal from 'component/SuccessPopupModal';
import StatusChangeModal from 'component/StatusChangeModal ';
import { ChangeBannerStatus, GetBannerList } from 'services/Banner/BannerApi';
import { GetAllCustomerReport } from '../../services/CustomerStaff/CustomerStaffApi';
import { useNavigate } from "react-router";

const OutStandingReport = () => {
      const { setLoader, user } = useContext(ConfigContext);

      const [outstandingReport, setManufacturerList] = useState([]);
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
      const navigate = useNavigate()

      useEffect(() => {
            GetAllCustomerReportData(currentPage, searchKeyword);
            setIsAddUpdateActionDone(false);
      }, [currentPage, isAddUpdateActionDone]);

      const GetAllCustomerReportData = async (pageNumber, keyword) => {
            setLoader(true);
            try {
                  const response = await GetAllCustomerReport({
                        userKeyID: user?.userKeyID,
                        pageNo: pageNumber - 1,
                        pageSize: pageSize,
                        sortingDirection: null,
                        sortingColumnName: null,
                        searchKeyword: keyword?.trim() !== '' ? keyword : null,

                  });
                  if (response?.data?.statusCode === 200) {
                        const list = response.data.responseData.data;
                        const total = response.data.totalCount || 0;
                        setManufacturerList(list);
                        setTotalCount(total);
                        setTotalPages(Math.ceil(total / pageSize));
                        setNoResultFound(list.length === 0);
                  } else {
                        setManufacturerList([]);
                        setTotalCount(0);
                        setTotalPages(0);
                        setNoResultFound(true);
                  }
            } catch (error) {
                  console.error(error);
                  setManufacturerList([]);
                  setTotalCount(0);
                  setTotalPages(0);
                  setNoResultFound(true);
            } finally {
                  setLoader(false);
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
            GetAllCustomerReportData(1, formatted);
      };

      const handlePageChange = (pageNumber) => {
            setCurrentPage(pageNumber);
            GetAllCustomerReportData(pageNumber, searchKeyword);
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
                  GetAllCustomerReportData(currentPage, searchKeyword);
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
      const navigateToReport = (item) => {
            navigate('/all-customer-lead-report', { state: { customerKeyID: item.customerKeyID } })
      }



      const totalDueAmount = outstandingReport.reduce((acc, item) => acc + (item.customerDueAmount || 0), 0);
      const totalPaidAmount = outstandingReport.reduce((acc, item) => acc + (item.customerPaidTotalAmt || 0), 0);
      const totalLeadAmount = outstandingReport.reduce((acc, item) => acc + (item.customerLeadTotalAmt || 0), 0);


      return (
            <>
                  <div className="card w-full max-w-[50vh] mx-auto h-auto">
                        <div className="card-body p-2 bg-white shadow-md rounded-lg">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                    <div className="flex-grow-1 ">
                                          <h4 className="mb-0">Outstanding  </h4>
                                    </div>
                              </div>

                              <div className="d-flex justify-content-between align-items-center mb-2">
                                    <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Search Outstanding  "
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
                                                      <th className="text-center">Sr No</th>
                                                      <th className="text-center">Customer Name</th>
                                                      <th className="text-center">Total Amt ⟨₹⟩</th>
                                                      <th className="text-center">Paid Amt ⟨₹⟩</th>
                                                      <th className="text-center">Due Amt ⟨₹⟩</th>
                                                      <th className="text-center">Details</th>
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
                                                      <td className="text-center" s>
                                                            {new Intl.NumberFormat('en-IN').format(Math.round(totalLeadAmount))}
                                                      </td>

                                                      <td className="text-center">
                                                            {new Intl.NumberFormat('en-IN').format(Math.round(totalPaidAmount))}
                                                      </td>
                                                      <td className="text-center">
                                                            {new Intl.NumberFormat('en-IN').format(Math.round(totalDueAmount))}
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
                                                                                    <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => navigateToReport(item)}>     {item.customerFirmName}</span>

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
                                                                                          {item.mobileNumber || "-"}
                                                                                    </span>
                                                                              </motion.div>
                                                                        </td>


                                                                        <td className="text-center">
                                                                              {new Intl.NumberFormat('en-IN', {
                                                                                    style: 'decimal',
                                                                                    maximumFractionDigits: 0,
                                                                                    minimumFractionDigits: 0
                                                                              }).format(Math.round(item.customerDueAmount))}
                                                                        </td>
                                                                        <td className="text-center">
                                                                              {new Intl.NumberFormat('en-IN', {
                                                                                    style: 'decimal',
                                                                                    maximumFractionDigits: 0,
                                                                                    minimumFractionDigits: 0
                                                                              }).format(Math.round(item.customerPaidTotalAmt))}
                                                                        </td>
                                                                        <td className="text-center">
                                                                              {new Intl.NumberFormat('en-IN', {
                                                                                    style: 'decimal',
                                                                                    maximumFractionDigits: 0,
                                                                                    minimumFractionDigits: 0
                                                                              }).format(Math.round(item.customerLeadTotalAmt))}
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
                                                                                                      <strong>GST Number:</strong> {item.gstNumber || "-"}
                                                                                                </div>
                                                                                                <div className="col-md-4 mb-2">
                                                                                                      <strong>Vendor Code:</strong> {item.vendorCode || "-"}
                                                                                                </div>

                                                                                                <div className="col-md-4 mb-2">
                                                                                                      <strong>Billing Address:</strong> {item.billingAddress}
                                                                                                </div>
                                                                                                <div className="col-md-4 mb-2">
                                                                                                      <strong>Address per GST:</strong> {item.addressperGST}
                                                                                                </div>
                                                                                                <div className="col-md-4 mb-2">
                                                                                                      <strong>Shipping Address:</strong> {item.shippingAddress}
                                                                                                </div>

                                                                                                <div className="col-md-4 mb-2">
                                                                                                      <strong>Mobile:</strong> {item.mobileNumber}
                                                                                                </div>
                                                                                                <div className="col-md-4 mb-2">
                                                                                                      <strong>Alt Mobile:</strong> {item.alternateMobileNumber || "-"}
                                                                                                </div>
                                                                                                <div className="col-md-4 mb-2">
                                                                                                      <strong>Email:</strong> {item.emailID}
                                                                                                </div>

                                                                                                <div className="col-md-4 mb-2">
                                                                                                      <strong>Contact Name:</strong> {item.contactName}
                                                                                                </div>
                                                                                                <div className="col-md-4 mb-2">
                                                                                                      <strong>Designation:</strong> {item.designation}
                                                                                                </div>
                                                                                                <div className="col-md-4 mb-2">
                                                                                                      <strong>Contact No:</strong> {item.contactNumber}
                                                                                                </div>

                                                                                                <div className="col-md-4 mb-2">
                                                                                                      <strong>Contact Email:</strong> {item.contactPersonEmailID}
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
                                                <tr>
                                                      <td colSpan={2}>Total</td>
                                                      <td>
                                                            {new Intl.NumberFormat('en-IN').format(Math.round(totalDueAmount))}
                                                      </td>
                                                      <td>
                                                            {new Intl.NumberFormat('en-IN').format(Math.round(totalPaidAmount))}
                                                      </td>
                                                      <td>
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

export default OutStandingReport;
