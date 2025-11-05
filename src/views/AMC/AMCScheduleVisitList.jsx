


import React, { useState, useEffect, useContext } from 'react';
import Android12Switch from 'component/Android12Switch';
import { ConfigContext } from 'context/ConfigContext';

import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { Tooltip } from '@mui/material';
import { User, Phone } from "lucide-react";
import { ChevronRight, ChevronDown, IndianRupee } from "lucide-react";
import { Calendar, ShieldCheck, Shield } from "lucide-react";
import { motion } from "framer-motion";
import ModelList from 'views/Model/ModelList';
import { GetProductList, ChangeProductStatus } from 'services/Product/ProductApi';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import StatusChangeModal from 'component/StatusChangeModal ';
import { hasPermission } from 'Middleware/permissionUtils';
import AddUpdateAMCModal from '../Annual-Maintenance-Contract/AddUpdateAMCModal';
import { GetAMCList } from 'services/AMCApi/AMCApi';
import AMCUploadPOModal from './AMCUploadPOModal';
import { GetServiceCallList } from 'services/Call Registration/CallRegistrationApi';
import { GetAMCVisitScheduleList } from '../../services/AMCApi/AMCApi';
import EmployeeAssignModal from 'views/Call Registration/EmployeeAssignModal';

const AMCScheduleVisitList = () => {
    const { setLoader, user, permissions } = useContext(ConfigContext);
    const navigate = useNavigate();
    const [showEmployeeAssignModal, setShowEmployeeAssignModal] = useState();

    const [stateChangeStatus, setStateChangeStatus] = useState('');
    const [modelAction, setModelAction] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [pageSize] = useState(30);
    const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showAmcPoUploadModal, setShowAmcPoUploadModal] = useState(false);
    const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
    const [lastActionType, setLastActionType] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [productListData, setProductListData] = useState([]);
    const [openProductModal, setOpenProductModal] = useState(false);
    const [sortingDirection, setSortingDirection] = useState(null);
    const [sortDirectionObj, setSortDirectionObj] = useState({ ProductNameSort: null });
    const [sortType, setSortType] = useState('');
    const [totalCount, setTotalCount] = useState(0);
    const [selectedRows, setSelectedRows] = useState([]); // store selected row IDs

    const [modelRequestData, setModelRequestData] = useState({
        productKeyID: null,
        Action: null, serviceCallID: null
    });

    // Main fetcher
    const GetAMCVisitScheduleListData = async (pageNumber, searchKeywordValue) => {
        setLoader(true);
        try {
            const data = await GetAMCVisitScheduleList({
                pageSize,
                pageNo: pageNumber - 1,
                searchKeyword: searchKeywordValue ?? searchKeyword,
                toDate: null,
                fromDate: null,
                sortingDirection: null,
                sortingColumnName: null,
                userKeyID: user.userKeyID
            });

            if (data?.data?.statusCode === 200) {
                const ProductData = data.data.responseData.data;
                const totalItems = data.data?.totalCount || 0;
                setTotalCount(totalItems);
                setTotalPage(Math.ceil(totalItems / pageSize));
                setProductListData(ProductData);

                // Auto back if empty but data exists
                if (ProductData.length === 0 && totalItems > 0 && pageNumber > 1) {
                    GetServiceCallListData(pageNumber - 1);
                    setCurrentPage(pageNumber - 1);
                } else {
                    setCurrentPage(pageNumber);
                }
            } else {
                console.error(data?.data?.errorMessage);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoader(false);
        }
    };






    // On Add/Update completion
    useEffect(() => {
        if (isAddUpdateActionDone) {

            GetAMCVisitScheduleListData(1, null);

            setIsAddUpdateActionDone(false);
            setSelectedRows([]);

        }
    }, [isAddUpdateActionDone]);

    // Initial fetch
    useEffect(() => {
        GetAMCVisitScheduleListData(1, null);
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value.trimStart();
        const formatted = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        setSearchKeyword(formatted);
        GetAMCVisitScheduleListData(1, formatted);
    };

    const handlePageChange = (pageNumber) => {
        GetAMCVisitScheduleListData(pageNumber);
    };




    // 1. Select All handler (only select rows with "-" status)
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = productListData
                .filter((row) => row.registrationStatusName === "-")
                .map((row) => row.serviceCallID);
            setSelectedRows(allIds);
        } else {
            setSelectedRows([]);
        }
    };

    // 2. All Selected check
    const isAllSelected =
        productListData.length > 0 &&
        productListData
            .filter((row) => row.registrationStatusName === "-")
            .every((row) => selectedRows.includes(row.serviceCallID));

    // 3. Individual row handler (unchanged)
    const handleCheckboxChange = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id)
                ? prev.filter((serviceCallID) => serviceCallID !== id)
                : [...prev, id]
        );
    };



    const closeAllModal = () => {
        setShowSuccessModal(false);
        setShowEmployeeAssignModal(false)

        setShowAmcPoUploadModal(false)
    };

    const addProductBtnClick = () => {
        if (selectedRows.length === 0) {
            alert("Please select at least one service call.");
            return;
        }

        setModelRequestData({
            ...modelRequestData,
            serviceCallIDs:
                selectedRows,

        });

        setShowEmployeeAssignModal(true);
    };

    const previewQuotationBtnClick = (row, isDownloadMode = false) => {


        {
            setModelRequestData({
                ...modelRequestData,
                leadName: row.leadName,
                requirement: row.requirement,
                Action: 'FromPendingForApproval',
                BTNAction: null,
                showDownloadButton: isDownloadMode,
            });
        }


        navigate('/amc-quotation-preview', {
            state: {
                amcKeyID: row.amcKeyID,
                action: 'FromPendingForApproval', BTNAction: 'Hide',
                showDownloadButton: isDownloadMode, // pass true or false
            }
        });
    };
    return (
        <>
            <div className="card w-full max-w-[50vh] mx-auto h-auto">
                <div className="card-body p-2 bg-white shadow-md rounded-lg">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="flex-grow-1">
                            <h5 className="m-0">AMC Visit Schedule</h5>
                        </div>
                        <button onClick={addProductBtnClick} className="btn btn-primary btn-sm d-inline d-sm-none">
                            <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                            <span className="d-inline d-sm-none"> Add</span>
                        </button>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search AMC Visit Schedule"
                            style={{ maxWidth: '350px' }}
                            value={searchKeyword}
                            onChange={handleSearch}
                        />
                        <Tooltip title="Add Product">
                            <button onClick={addProductBtnClick} style={{ background: '#ffaa33' }} className="btn text-white  btn-sm d-none d-sm-inline">
                                <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                                <span className="d-none d-sm-inline"> Assign </span>
                            </button>
                        </Tooltip>


                    </div>

                    <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
                        <table className="table table-bordered table-striped">
                            <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                                <tr>
                                    <th className="text-center">

                                    </th>
                                    <th className="text-center">Sr No</th>
                                    <th className="text-center">Customer/Firm Info</th>
                                    <th className="text-center">Call Status</th>
                                    <th className="text-center">Product Name</th>
                                    <th className="text-center">AMC Info </th>
                                    <th className="text-center">AMC Date Info</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productListData?.map((row, idx) => {
                                    const serviceCallID = idx; // you can replace with row.productKeyID if available
                                    return (
                                        <tr key={serviceCallID}>
                                            <td className="text-center">
                                                <input
                                                    type="checkbox"
                                                    disabled={row.registrationStatusName !== "-"} // disable if not "-"
                                                    checked={selectedRows.includes(row.serviceCallID)}
                                                    onChange={() => handleCheckboxChange(row.serviceCallID)}
                                                />

                                            </td>
                                            <td className="text-center">
                                                {(currentPage - 1) * pageSize + idx + 1}
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex flex-column align-items-start gap-1 p-2">
                                                    {/* Customer/Firm Name */}
                                                    <div className="d-flex align-items-center gap-2">
                                                        <User size={16} className="text-primary" />
                                                        <span className='text-nowrap'>{row.customerFirmName}</span>
                                                    </div>

                                                    {/* Mobile Number */}
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Phone size={16} className="text-success" />
                                                        <span>{row.custMobileNumber}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-center">{row.registrationStatusName}</td>
                                            <td className="text-center">
                                                <div className="d-flex flex-column align-items-center">
                                                    <span className="fw-medium text-dark">
                                                        {row.productName?.length > 25 ? (
                                                            <Tooltip title={row.productName}>{`${row.productName?.substring(0, 30)}...`}</Tooltip>
                                                        ) : (
                                                            <>{row.productName}</>
                                                        )}
                                                    </span>
                                                    <span className="d-flex align-items-center gap-1 text-muted small">
                                                        <i className="fa fa-barcode text-primary me-1 animate__animated animate__pulse animate__infinite"></i>
                                                        {row.serialNumber}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="text-center align-middle">
                                                <motion.div
                                                    className="d-inline-flex flex-column align-items-start gap-1 p-2 bg-light rounded shadow-sm"
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    style={{ minWidth: "150px", fontSize: "13px" }}
                                                >
                                                    {/* AMC In Month + Charges */}
                                                    <div className="d-flex align-items-center justify-content-between w-100">
                                                        <div className="d-flex align-items-center gap-1">
                                                            <Calendar size={14} className="text-primary" />
                                                            <span>{row.amcInMonth}m</span>
                                                        </div>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <IndianRupee size={14} className="text-success" />
                                                            <span>{row.amcCharges}</span>
                                                        </div>
                                                    </div>

                                                    {/* AMC Type */}
                                                    <div>
                                                        {row.amcTypeName === "Comprehensive" ? (
                                                            <span className="badge bg-success d-flex align-items-center gap-1 px-2 py-1">
                                                                <ShieldCheck size={13} />
                                                                Comprehensive
                                                            </span>
                                                        ) : (
                                                            <span className="badge bg-warning text-dark d-flex align-items-center gap-1 px-2 py-1">
                                                                <Shield size={13} />
                                                                Non-Comprehensive
                                                            </span>
                                                        )}
                                                    </div>

                                                </motion.div>
                                            </td>
                                            <td className="text-center align-middle">
                                                <div
                                                    className="d-inline-flex flex-column align-items-start gap-1 p-2 bg-light rounded shadow-sm"
                                                    style={{ fontSize: "13px", minWidth: "160px" }}
                                                >
                                                    {/* AMC Start Date */}
                                                    {row.amcStartDate && (
                                                        <div className="d-flex align-items-center gap-2">
                                                            <Calendar size={14} className="text-primary" />
                                                            <span>
                                                                <strong>Start:</strong> {row.amcStartDate}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Visit Date */}
                                                    {row.visitDate && (
                                                        <div className="d-flex align-items-center gap-2">
                                                            <Calendar size={14} className="text-warning" />
                                                            <span>
                                                                <strong>Visit:</strong> {row.visitDate}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* AMC First Visit Date */}
                                                    {row.amcFirstVisitDate && (
                                                        <div className="d-flex align-items-center gap-2">
                                                            <Calendar size={14} className="text-success" />
                                                            <span>
                                                                <strong>1st Visit:</strong> {row.amcFirstVisitDate}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <Tooltip title="View AMC Quotation">
                                                    <button
                                                        style={{
                                                            padding: "4px 8px",
                                                            fontSize: "12px",
                                                            background: "#ffaa33",
                                                        }}
                                                        onClick={(e) => {

                                                            previewQuotationBtnClick(row, true)
                                                        }}
                                                        type="button"
                                                        className="btn-sm btn text-white text-nowrap"
                                                    >
                                                        View AMC Quotation
                                                    </button>
                                                </Tooltip>
                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {totalCount === 0 && <NoResultFoundModel totalRecords={totalCount} />}
                    </div>

                    <div className="d-flex justify-content-end">
                        {totalCount > pageSize && (
                            <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
                        )}
                    </div>
                </div>
            </div>

            {openProductModal && (
                <AddUpdateAMCModal
                    show={openProductModal}
                    onHide={() => setOpenProductModal(false)}
                    modelRequestData={modelRequestData}
                    setModelRequestData={setModelRequestData}
                    setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                />
            )}


            {showAmcPoUploadModal && (
                <AMCUploadPOModal
                    show={showAmcPoUploadModal}
                    onHide={closeAllModal}
                    modelRequestData={modelRequestData}
                    setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                    modelAction={modelAction}
                />
            )}
            {showSuccessModal && (
                <SuccessPopupModal
                    show={showSuccessModal}
                    onHide={closeAllModal}
                    setShowSuccessModal={setShowSuccessModal}
                    modelAction={modelAction}
                />
            )}


            {showEmployeeAssignModal && (
                <EmployeeAssignModal
                    show={showEmployeeAssignModal}
                    setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                    onHide={() => setShowEmployeeAssignModal(false)}
                    modelRequestData={modelRequestData} // contains selected serviceCallID(s)
                />
            )}
        </>
    );
};

export default AMCScheduleVisitList;
