


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
import { GetInvoiceList } from 'services/Invoice Module/InvoiceApi';
import { useLocation, useNavigate } from 'react-router';
import { hasPermission } from 'Middleware/permissionUtils';
import { GetAMCInvoiceList } from 'services/AMC Invoice/AMCInvoiceApi';
import AMCAddUpdateInvoiceModal from './AMCAddUpdateInvoiceModal';
import PaymentCollectionModal from './PaymentCollectionModal';

const AMCAddInvoiceList = () => {
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
    const [showPaymentCollectionModal, setShowPaymentCollectionModal] = useState();
    const [fromDate, setFromDate] = useState(null); // Initialize as null
    const [toDate, setToDate] = useState(null);
    const [stateListData, setStateListData] = useState([]);
    const [openMasterStateModal, setOpenMasterStateModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState();
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
            const data = await GetAMCInvoiceList({
                pageSize,
                pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
                searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
                toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
                fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                sortingDirection: sortValue === undefined ? sortingDirection : sortValue,
                sortingColumnName: sortType == '' ? StateSortType : sortType || null,
                userKeyID: user.userKeyID,
                amcKeyID: location.state.amcKeyID
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


    const paymentCollection = (row) => {

        console.log(row, 'dsadsa3');

        setModelRequestData({
            ...modelRequestData,
            amcInvoiceKeyID: row.amcInvoiceKeyID,
            amcInvoiceAmount: row.amcInvoiceAmount

        })

        // navigate('/payment-collection')


        setShowPaymentCollectionModal(true)

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
    console.log(location.state, 'ffffffffffffff');
    const addMasterStateBtnClick = () => {
        setModelRequestData({
            ...modelRequestData,
            Action: null,
            stateID: null,
            userKeyID: null,
            amcKeyID: location?.state?.amcKeyID
        });
        setOpenMasterStateModal(true);
    };
    const EditMasterStateBtnClick = (row) => {
        setModelRequestData({
            ...modelRequestData,
            Action: 'Update',
            amcInvoiceKeyID: row.amcInvoiceKeyID
        });
        setOpenMasterStateModal(true);
    };
    const downloadPOBtnClick = (value) => {
        const amcInvoicePDFUpload = value?.amcInvoicePDFUpload;

        if (amcInvoicePDFUpload) {
            const link = document.createElement("a");
            link.href = amcInvoicePDFUpload;
            link.setAttribute("download", "PurchaseOrder.pdf"); // Forces download
            link.setAttribute("target", "_blank"); // Optional: open in new tab if needed
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.warn("No PDF URL found.");
        }
    };

    // put these helpers near the top of your component (inside the function)
    const toNumber = (v) => {
        if (v === undefined || v === null || v === '') return 0;
        // remove commas, then parse
        return parseFloat(String(v).replace(/,/g, '')) || 0;
    };
    const fmt = (v) => (Number(v) || 0).toFixed(2);

    // totals computed once (safe if stateListData is undefined)
    const totalInvoiceAmount = (stateListData?.reduce((acc, row) => acc + toNumber(row.amcInvoiceAmount), 0)) ?? 0;
    const totalPaidAmount = (stateListData?.reduce((acc, row) => acc + toNumber(row.amcPaidAmount), 0)) ?? 0;
    const totalRemainingAmt = (stateListData?.reduce((acc, row) => acc + toNumber(row.amcRemainingAmount), 0)) ?? 0;

    const navigate = useNavigate()

    const viewInvoice = (row) => {
        navigate('/pre-amc-invoice-preview', {
            state: { invoiceData: row }   // 👈 pass whatever you need
        });
    };


    return (
        <>
            <div className="card w-full max-w-[50vh] mx-auto h-auto">
                <div className="card-body p-2 bg-white shadow-md rounded-lg">
                    {/* Top controls */}
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <h5 className="m-0">AMC Invoice</h5>
                        <button
                            onClick={() => addMasterStateBtnClick()}
                            className="btn btn-primary btn-sm d-inline d-sm-none"
                        >
                            <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
                            <span className="d-inline d-sm-none">  Add</span>
                        </button>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <input
                            type="text"
                            className="form-control "
                            placeholder="Search AMC Invoice"
                            style={{ maxWidth: "350px" }}
                            value={searchKeyword}
                            onChange={(e) => {
                                handleSearch(e);
                            }}
                        />
                        {totalInvoiceAmount !== location.state.amcCharges &&
                            <Tooltip title="Add AMC Invoice">
                                <button
                                    onClick={() => addMasterStateBtnClick()}
                                    style={{ background: '#ffaa33', color: 'white' }} className="btn  btn-sm d-none d-sm-inline "
                                >
                                    <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
                                    <span className="d-none d-sm-inline"> Add AMC Invoice</span>
                                </button>
                            </Tooltip>
                        }

                    </div>
                    {/* 4 Details Section */}
                    <div className="mb-2 p-2 bg-gray-50 rounded">
                        {/* Row 1: 2 left + 2 right */}
                        <div className="d-flex justify-content-between mb-2">
                            <div className="d-flex gap-2">
                                <div><strong>AMC Amount ⟨र⟩-

                                    <strong style={{ color: 'green', }}>   {location.state.amcCharges}</strong>
                                </strong>
                                </div>

                            </div>
                            <div className="d-flex gap-2">

                                <div>
                                    <strong>Customer Name:</strong>
                                    <strong>
                                        {location.state.customerFirmName}
                                    </strong></div>
                            </div>

                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <div className="d-flex gap-2">
                                <div><strong>AMC PO No.</strong>   <strong > {location.state.amcpoNumber}</strong></div>

                            </div>
                            <div className="d-flex gap-2">
                                <div><strong>Total Invoice Amount:</strong> <strong style={{ color: 'green', }}> {fmt(totalInvoiceAmount)} </strong>  </div>

                            </div>
                            {/* <div className="d-flex gap-2">

                                <div><strong>AMC Invoice No.</strong> {location.state.amcInvoiceNumber}</div>
                            </div> */}
                        </div>

                    </div>

                    {/* Table */}
                    <div className="table-responsive" style={{ maxHeight: "65vh", overflowY: "auto", position: "relative" }}>
                        <table className="table table-bordered table-striped">
                            {/* Table content */}
                        </table>
                    </div>

                    {/* Table */}
                    <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
                        <table className="table table-bordered table-striped">
                            <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                                <tr className='text-nowrap'>
                                    <th className="text-center">Sr No</th>
                                    {/* moved up */}
                                    <th className="text-center">AMC Invoice Number</th>
                                    <th className="text-center">AMC Invoice Date</th>
                                    <th className="text-center">Invoice Amt (₹)	</th>

                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>


                            <tbody>
                                {stateListData?.map((row, idx) => {
                                    const invoiceAmt = toNumber(row.amcInvoiceAmount);
                                    const paidAmtForRow = toNumber(row.amcPaidAmount);
                                    const remainingAmtForRow = toNumber(row.amcRemainingAmount);
                                    const rowIndex = (currentPage - 1) * pageSize + idx + 1;

                                    return (
                                        <tr className='text-nowrap' key={idx}>
                                            <td className="text-center">{rowIndex}</td>
                                            <td className="text-center">{row.amcInvoiceNumber}</td>
                                            <td className="text-center">{row.amcInvoiceDate}</td>
                                            <td className="text-center">{fmt(invoiceAmt)}</td>

                                            <td className="text-center">
                                                <div className=" text-center">
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


                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                            <tfoot>
                                <tr className='text-nowrap'>
                                    <td colSpan="3" className="text-end fw-bold">Total ⟨₹⟩:</td>
                                    <td className="text-center fw-bold">{fmt(totalInvoiceAmount)}</td>

                                    <td colSpan="1"></td>
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

            {openMasterStateModal && (
                <AMCAddUpdateInvoiceModal
                    show={openMasterStateModal}
                    onHide={() => setOpenMasterStateModal(false)}
                    modelRequestData={modelRequestData}
                    setModelRequestData={setModelRequestData}
                    setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                />
            )}

            {showPaymentCollectionModal && (
                <PaymentCollectionModal
                    show={showPaymentCollectionModal}
                    setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                    onHide={() => closeAllModal()}
                    modelRequestData={modelRequestData}
                    modelAction={modelAction}
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

export default AMCAddInvoiceList;
