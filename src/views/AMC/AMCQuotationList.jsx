

import React, { useState, useEffect, useContext } from 'react';
import Android12Switch from 'component/Android12Switch';
import { ConfigContext } from 'context/ConfigContext';
import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModel from 'component/NoResultFoundModal';
import { User, Phone } from "lucide-react";
import PaginationComponent from 'component/Pagination';
import { ChevronRight, ChevronDown, IndianRupee } from "lucide-react";
import { Calendar, ShieldCheck, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import AddUpdateAMCModal from '../Annual-Maintenance-Contract/AddUpdateAMCModal';
import { GetAMCList } from 'services/AMCApi/AMCApi';
import AMCUploadPOModal from './AMCUploadPOModal';
import { useNavigate } from 'react-router';

const AMCQuotationList = () => {
    const { setLoader, user, permissions } = useContext(ConfigContext);
    const [stateChangeStatus, setStateChangeStatus] = useState('');
    const [modelAction, setModelAction] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [pageSize] = useState(30);
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

    const [modelRequestData, setModelRequestData] = useState({
        productKeyID: null,
        Action: null
    });

    // Main fetcher
    const GetProductListData = async (pageNumber, searchKeywordValue, toDateParam, fromDateParam, sortValue, ProductSortType) => {
        setLoader(true);
        try {
            const data = await GetAMCList({
                pageSize,
                pageNo: pageNumber - 1,
                searchKeyword: searchKeywordValue ?? searchKeyword,
                toDate: toDateParam ? dayjs(toDateParam).format('YYYY-MM-DD') : null,
                fromDate: fromDateParam ? dayjs(fromDateParam).format('YYYY-MM-DD') : null,
                sortingDirection: sortValue ?? sortingDirection,
                sortingColumnName: sortType || ProductSortType || null,
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
                    GetProductListData(pageNumber - 1);
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
            if (lastActionType === 'Add') {
                GetProductListData(1);
            } else {
                GetProductListData(currentPage);
            }
            setIsAddUpdateActionDone(false);
            setLastActionType(null);
        }
    }, [isAddUpdateActionDone]);

    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRow = (idx) => {
        setExpandedRow(expandedRow === idx ? null : idx);
    };

    // Initial fetch
    useEffect(() => {
        GetProductListData(1);
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value.trimStart();
        const formatted = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        setSearchKeyword(formatted);
        GetProductListData(1, formatted);
    };

    const handlePageChange = (pageNumber) => {
        GetProductListData(pageNumber);
    };

    const addProductBtnClick = () => {
        setModelRequestData({ Action: null, productKeyID: null });
        setLastActionType('Add');
        setOpenProductModal(true);
    };

    const editProductBtnClick = (row) => {
        setModelRequestData({
            Action: 'Update',
            amcKeyID: row.amcKeyID,
            leadID: row.leadID,
        });
        setLastActionType('Update');
        setOpenProductModal(true);
    };







    const openModelList = (row) => {
        setModelRequestData({
            ...modelRequestData,
            amcKeyID: row.amcKeyID
        })
        setShowAmcPoUploadModal(true)
    };

    const closeAllModal = () => {
        setShowSuccessModal(false);
        setShowAmcPoUploadModal(false)
    };
    const navigate = useNavigate()
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
                        <div className="flex-grow-1 ">
                            <h5 className="m-0">AMC Quotation</h5>
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
                            placeholder="Search AMC Quotation"
                            style={{ maxWidth: '350px' }}
                            value={searchKeyword}
                            onChange={handleSearch}
                        />

                    </div>

                    <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
                        <table className="table table-bordered table-striped">
                            <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                                <tr className='text-nowrap'>
                                    <th className="text-center">Sr No</th>
                                    <th className="text-center">Customer/Firm Info</th>
                                    <th className="text-center">Product Info</th>

                                    <th className="text-center">AMC Info</th>
                                    {/* <th className="text-center">AMC Charges ⟨₹⟩</th> */}
                                    <th className="text-center">AMC Date Info</th>

                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productListData?.map((row, idx) => {
                                    const isExpanded = expandedRow === idx;

                                    return (
                                        <React.Fragment key={idx}>
                                            {/* Main Row */}
                                            <tr>
                                                <td
                                                    className="text-center"
                                                    style={{ cursor: "pointer" }}

                                                >

                                                    <div style={{ fontSize: "12px" }}>
                                                        {(currentPage - 1) * pageSize + idx + 1}
                                                    </div>
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
                                                <td className="text-center text-nowrap" onClick={() => toggleRow(idx)}>

                                                    <span
                                                        className="ms-1 text-primary text-decoration-underline"
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {row.productName}
                                                        {isExpanded ? (
                                                            <ChevronDown size={18} />
                                                        ) : (
                                                            <ChevronRight size={18} />
                                                        )}
                                                    </span>
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
                                                                <span>{row.amcInMonth}Months</span>
                                                            </div>
                                                            <div className="d-flex align-items-center gap-1">
                                                                <IndianRupee size={14} className="text-success" />
                                                                <span>



                                                                    {new Intl.NumberFormat('en-IN', {
                                                                        style: 'decimal',
                                                                        maximumFractionDigits: 0,
                                                                        minimumFractionDigits: 0
                                                                    }).format(Math.round(row.amcCharges))}
                                                                </span>
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
                                                    <div className="d-inline-flex flex-column align-items-start gap-1 p-2 bg-light rounded shadow-sm" style={{ fontSize: "13px", minWidth: "160px" }}>
                                                        {/* AMC Start Date */}
                                                        <div className="d-flex align-items-center gap-2">
                                                            <Calendar size={14} className="text-primary" />
                                                            <span><strong>Start:</strong> {row.amcStartDate}</span>
                                                        </div>

                                                        {/* AMC First Visit Date */}
                                                        <div className="d-flex align-items-center gap-2">
                                                            <Calendar size={14} className="text-success" />
                                                            <span><strong>1st Visit:</strong> {row.amcFirstVisitDate}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <Tooltip title="Update AMC">
                                                            <button
                                                                style={{
                                                                    padding: "4px 8px",
                                                                    fontSize: "12px",
                                                                    background: "#ffaa33",
                                                                }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    editProductBtnClick(row);
                                                                }}
                                                                type="button"
                                                                className="btn-sm btn text-white text-nowrap"
                                                            >
                                                                Update Amc
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip title="Add PO">
                                                            <button
                                                                style={{
                                                                    padding: "4px 8px",
                                                                    fontSize: "12px",
                                                                    background: "#ffaa33",
                                                                }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    openModelList(row);
                                                                }}
                                                                type="button"
                                                                className="btn-sm btn text-white text-nowrap"
                                                            >
                                                                Add PO
                                                            </button>
                                                        </Tooltip>
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
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Expandable Row */}
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan={10}>
                                                        <div className="p-3 bg-light rounded shadow-sm">
                                                            <table className="table table-sm table-bordered mb-0">
                                                                <thead className="table-secondary">
                                                                    <tr>
                                                                        <th className="text-center">Model Name</th>
                                                                        <th className="text-center">Variant Name</th>
                                                                        <th className="text-center">Manufacturer Name</th>
                                                                        <th className="text-center">Warranty In Month</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="text-center">{row.modelName}</td>
                                                                        <td className="text-center">{row.variantName}</td>
                                                                        <td className="text-center">{row.manufacturerName}</td>
                                                                        <td className="text-center">{row.warrantyInMonth}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
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
        </>
    );
};

export default AMCQuotationList;
