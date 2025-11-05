

import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Android12Switch from 'component/Android12Switch';
import { ConfigContext } from 'context/ConfigContext';
import { ChangeStateStatus, MasterStatGetStateList } from 'services/Master Crud/MasterStateApi';
import dayjs from 'dayjs';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { Tooltip } from '@mui/material';
import UploadInvoicePDFModal from 'views/Sales Order/UploadInvoicePDFModal';
import { GetInvoiceList } from 'services/Invoice Module/InvoiceApi';
import { useLocation, useNavigate } from 'react-router';
import { hasPermission } from 'Middleware/permissionUtils';
import InvoiceProductDetailsModal from 'views/Sales Order/Invoice/InvoiceProductDetailsModal';

const InvoiceList = () => {
    const [stateChangeStatus, setStateChangeStatus] = useState('');
    const [totalRecords, setTotalRecords] = useState(-1);
    const { setLoader, user, permissions } = useContext(ConfigContext);
    const [modelAction, setModelAction] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState();
    const [totalCount, setTotalCount] = useState(null);
    const [pageSize, setPageSize] = useState(30);
    const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
    const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [fromDate, setFromDate] = useState(null); // Initialize as null
    const [toDate, setToDate] = useState(null);
    const [stateListData, setStateListData] = useState([]);
    const [openMasterStateModal, setOpenMasterStateModal] = useState(false);
    const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState();
    const [showPaymentCollectionModal, setShowPaymentCollectionModal] = useState();
    const [sortingDirection, setSortingDirection] = useState(null);
    const [sortDirectionObj, setSortDirectionObj] = useState({
        ServiceNameSort: null
    });
    const [sortType, setSortType] = useState('');

    const [modelRequestData, setModelRequestData] = useState({
        stateID: null,
        stateName: null,
        Action: null
    });


    useEffect(() => {
        // debugger
        if (isAddUpdateActionDone) {
            GetInvoiceListData(1, null, toDate, fromDate);
            setSearchKeyword('')
            setSortingDirection(null);
        }
        setIsAddUpdateActionDone(false);
    }, [isAddUpdateActionDone]);

    useEffect(() => {
        GetInvoiceListData(1, null, toDate, fromDate);
    }, [setIsAddUpdateActionDone]);

    const location = useLocation()

    const GetInvoiceListData = async (pageNumber, searchKeywordValue, toDate, fromDate, sortValue, StateSortType) => {
        // debugger
        setLoader(true);
        try {
            const data = await GetInvoiceList({
                pageSize,
                pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
                searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
                toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
                fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                sortingDirection: sortValue === undefined ? sortingDirection : sortValue,
                sortingColumnName: sortType == '' ? StateSortType : sortType || null,
                userKeyID: user.userKeyID,
                leadKeyID: location.state.leadKeyID
            });

            if (data) {
                if (data?.data?.statusCode === 200) {
                    setLoader(false);
                    if (data?.data?.responseData?.data) {
                        const MasterStateListData = data.data.responseData.data;
                        const totalItems = data.data?.totalCount; // const totalItems = 44;
                        setTotalCount(totalItems);
                        const totalPages = Math.ceil(totalItems / pageSize);
                        setTotalPage(totalPages);
                        setTotalRecords(MasterStateListData.length);
                        setStateListData(MasterStateListData);
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

    const closeAllModal = () => {
        setShowSuccessModal(false);
        setShowPaymentCollectionModal(false)
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
        GetInvoiceListData(1, capitalizedValue, toDate, fromDate);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        GetInvoiceListData(pageNumber, null, toDate, fromDate);
    };

    const addMasterStateBtnClick = () => {
        setModelRequestData({
            ...modelRequestData,
            Action: null,
            stateID: null,
            userKeyID: null,
            leadKeyID: location.state.leadKeyID
        });
        setOpenMasterStateModal(true);
    };
    console.log(location.state, '22222222222ss');



    const invoiceBtnClick = () => {

        setModelRequestData({
            ...modelRequestData,
            quotationFormatID: location?.state?.quotationFormatID,
            leadKeyID: location?.state?.leadKeyID,
            purchaseOrderKeyID: location?.state?.purchaseOrderKeyID,
            poGrandTotal: location?.state?.poGrandTotal,
            salesOrderKeyID: location.state.salesOrderKeyID,
            salesOrderID: location.state.salesOrderID,
            Action: "Update"
        })

        setOpenInvoiceModal(true);
    };










    const downloadPOBtnClick = (value) => {
        const invoicePDFUpload = value?.invoicePDFUpload;

        if (invoicePDFUpload) {
            const link = document.createElement("a");
            link.href = invoicePDFUpload;
            link.setAttribute("download", "PurchaseOrder.pdf"); // Forces download
            link.setAttribute("target", "_blank"); // Optional: open in new tab if needed
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.warn("No PDF URL found.");
        }
    };
    const navigate = useNavigate()

    const totalInvoiceAmount = Math.round(
        stateListData?.reduce((acc, row) => {
            const amount = parseFloat(row.invoiceAmount) || 0;
            return acc + amount;
        }, 0)
    );

    const roundedQuotationAmount = Math.round(location?.state?.salesOrderAmount);

    const isInvoiceComplete = totalInvoiceAmount === roundedQuotationAmount;
    const handleBackClick = () => {
        navigate(-1); // Go back to previous page
    };

    return (
        <>
            <div className="card w-full max-w-[50vh] mx-auto h-auto">
                <div className="card-body p-2 bg-white shadow-md rounded-lg">
                    {/* Top controls */}
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="d-flex align-items-center gap-2">
                            <button
                                onClick={handleBackClick}
                                className="btn btn-outline-secondary btn-sm"
                            >
                                <i className="fa-solid fa-arrow-left me-1" style={{ fontSize: "11px" }}></i>
                                Back
                            </button>
                            <h5 className="m-0">Invoice</h5>
                            <button
                                onClick={() => addMasterStateBtnClick()}
                                className="btn btn-primary btn-sm d-inline d-sm-none"
                            >
                                <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
                                <span className="d-inline d-sm-none">  Add</span>
                            </button>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <input
                            type="text"
                            className="form-control "
                            placeholder="Search Invoice"
                            style={{ maxWidth: "350px" }}
                            value={searchKeyword}
                            onChange={(e) => {
                                handleSearch(e);
                            }}
                        />
                        {/* {hasPermission(permissions, 'Invoice', 'Can Insert') && (
                            <Tooltip title="Add Invoice">
                                <button
                                    onClick={() => addMasterStateBtnClick()}
                                    style={{ background: '#ffaa33', color: 'white' }} className="btn  btn-sm d-none d-sm-inline "
                                >
                                    <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
                                    <span className="d-none d-sm-inline"> Add Invoice</span>
                                </button>
                            </Tooltip>
                        )} */}
                        {hasPermission(permissions, 'Invoice', 'Can Insert') && !isInvoiceComplete && (
                            <Tooltip title="Add Invoice">
                                <button
                                    onClick={() => invoiceBtnClick()}
                                    style={{ background: '#ffaa33', color: 'white' }}
                                    className="btn btn-sm d-none d-sm-inline"
                                >
                                    <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
                                    <span className="d-none d-sm-inline"> Add Invoice</span>
                                </button>
                            </Tooltip>
                        )}
                    </div>


                    <div className="mb-3 p-2 bg-white shadow-md rounded-lg">
                        {/* Row 1: Quotation Amount (start) & Total Invoice Amount (end) */}
                        <div className="d-flex justify-content-between mb-1">
                            <div>
                                <strong>Quotation Amt  ⟨₹⟩:</strong>{' '}
                                <span style={{ fontWeight: '700', fontSize: '1rem', color: '#000' }}>
                                    {new Intl.NumberFormat('en-IN', {
                                        style: 'decimal',
                                        maximumFractionDigits: 0,
                                        minimumFractionDigits: 0
                                    }).format(Math.round(location?.state?.quotationAmount))}
                                </span>
                            </div>

                            <div>
                                <strong>Total Invoice Amt  ⟨₹⟩:</strong>
                                <span style={{ fontWeight: '700', fontSize: '1rem', color: '#000' }}>
                                    {
                                        new Intl.NumberFormat('en-IN', {
                                            style: 'decimal',
                                            maximumFractionDigits: 0,
                                            minimumFractionDigits: 0
                                        }).format(
                                            Math.round(
                                                stateListData?.reduce((acc, row) => {
                                                    const amount = parseFloat(row.invoiceAmount) || 0;
                                                    return acc + amount;
                                                }, 0)
                                            )
                                        )
                                    }
                                </span>

                            </div>
                        </div>

                        {/* Row 2: PO Amount (start) & Customer Name (end) */}
                        <div className="d-flex justify-content-between">
                            <div>
                                <strong>Sales Order  Amt  ⟨₹⟩:</strong>
                                <span style={{ fontWeight: '700', fontSize: '1rem', color: '#000' }}>
                                    {new Intl.NumberFormat('en-IN', {
                                        style: 'decimal',
                                        maximumFractionDigits: 0,
                                        minimumFractionDigits: 0
                                    }).format(Math.round(location?.state?.salesOrderAmount))}
                                </span>
                            </div>
                            <div>
                                <strong>Customer Name:</strong>
                                <span style={{ fontWeight: '700', fontSize: '1rem', color: '#000' }}>
                                    {location.state.leadName}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
                        <table className="table table-bordered table-striped">
                            <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                                <tr className='text-nowrap'>
                                    <th className="text-center">Sr No</th>

                                    <th className="text-center">Invoice Number</th>
                                    <th className="text-center">Invoice Amt (₹)</th> {/* moved up */}
                                    {/* <th className="text-center">Received Amt(₹)</th> moved up */}
                                    {/* <th className="text-center">Pending Amt (₹)</th> moved up */}
                                    <th className="text-center">Invoice Date</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {stateListData?.map((row, idx) => (
                                    <tr className='text-nowrap' key={idx}>
                                        <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                                        <td className="text-center">{row.invoiceNumber}</td>
                                        <td className="text-center">
                                            {new Intl.NumberFormat('en-IN', {
                                                style: 'decimal',
                                                maximumFractionDigits: 0,
                                                minimumFractionDigits: 0
                                            }).format(Math.round(row.invoiceAmount))}</td> {/* moved up */}
                                        {/* <td className="text-center">
                                            {new Intl.NumberFormat('en-IN', {
                                                style: 'decimal',
                                                maximumFractionDigits: 0,
                                                minimumFractionDigits: 0
                                            }).format(Math.round(row.paidAmount))}</td>  */}
                                        {/* <td className="text-center">
                                            {new Intl.NumberFormat('en-IN', {
                                                style: 'decimal',
                                                maximumFractionDigits: 0,
                                                minimumFractionDigits: 0
                                            }).format(Math.round(row.remainingAmount))}</td> */}
                                        <td className="text-center">{row.invoiceDate}</td>
                                        <td className="text-center">
                                            <div className="d-flex gap-2">





                                                <Tooltip title="View Invoice">
                                                    <button
                                                        style={{
                                                            padding: '4px 8px',
                                                            fontSize: '12px',
                                                            height: '28px',
                                                            width: '28px',
                                                            background: '#ffaa33',
                                                            color: 'white'
                                                        }}
                                                        className="btn btn-sm d-none d-sm-inline"
                                                        onClick={() => downloadPOBtnClick(row)}
                                                        type="button"
                                                    >
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>
                                                </Tooltip>
                                                {/* {row.remainingAmount !== 0 ? (
                                                    <Tooltip title="Payment Collection">
                                                        <button
                                                            style={{
                                                                background: '#ffaa33',
                                                                color: 'white'
                                                            }}
                                                            className="btn btn-sm d-none d-sm-inline"
                                                            onClick={() => paymentCollection(row)}
                                                            type="button"
                                                        >
                                                            Payment Collection
                                                        </button>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="View  Payment Collection Invoice">
                                                        <button
                                                            style={{
                                                                background: '#9aa357', // blue shade for view button
                                                                color: 'white'
                                                            }}
                                                            className="btn btn-sm d-none d-sm-inline"
                                                            onClick={() => viewInvoice(row)}
                                                            type="button"
                                                        >
                                                            View Invoice
                                                        </button>
                                                    </Tooltip>
                                                )} */}


                                            </div>
                                            {/* )} */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                            <tfoot>
                                <tr className="fw-bold text-nowrap">
                                    <td colSpan="0" className="text-end">Total (₹)</td>
                                    {/* <td colSpan="1" className="text-end">Total (₹)</td> */}

                                    {/* Invoice Amount Total */}

                                    <td></td>

                                    <td className="text-center">
                                        {
                                            new Intl.NumberFormat('en-IN', {
                                                style: 'decimal',
                                                maximumFractionDigits: 0,
                                            }).format(
                                                Math.round(
                                                    stateListData?.reduce((acc, row) => {
                                                        const amount = parseFloat(row.invoiceAmount) || 0;
                                                        return acc + amount;
                                                    }, 0)
                                                )
                                            )
                                        }

                                    </td>

                                    {/* Empty cells for other columns */}
                                    <td colSpan="3"></td>
                                </tr>
                            </tfoot>



                        </table>
                        {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                    </div>
                    <div className="d-flex justify-content-end ">
                        {totalCount > pageSize && (
                            <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
                        )}
                    </div>
                </div>
            </div>

            {openInvoiceModal && (
                <InvoiceProductDetailsModal
                    show={openInvoiceModal}
                    onHide={() => setOpenInvoiceModal(false)}
                    modelRequestData={modelRequestData}
                    setModelRequestData={setModelRequestData}
                    setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                />
            )}
            {openMasterStateModal && (
                <UploadInvoicePDFModal
                    show={openMasterStateModal}
                    onHide={() => setOpenMasterStateModal(false)}
                    modelRequestData={modelRequestData}
                    setModelRequestData={setModelRequestData}
                    setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                />
            )}



            {showSuccessModal && (
                <SuccessPopupModal
                    show={showSuccessModal}
                    onHide={() => closeAllModal()}
                    setShowSuccessModal={setShowSuccessModal}
                    modelAction={modelAction}
                />
            )}

        </>
    );
};

export default InvoiceList;
