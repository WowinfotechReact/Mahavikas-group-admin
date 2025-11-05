


import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import { Table } from 'react-bootstrap'
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router';
import PaginationComponent from 'component/Pagination';
import { ConfigContext } from 'context/ConfigContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Icons for eye and eye-slash
import * as XLSX from 'xlsx';
import NoResultFoundModel from 'component/NoResultFoundModal';
import ImageModal from 'component/ImageModal';
import Android12Switch from 'component/Android12Switch';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { Tooltip } from '@mui/material';
import { ChangeEmployeeStatus } from 'services/Employee Staff/EmployeeApi';
import { GetPOList } from 'services/Purchase Order/PurchaseOrderApi';
import PurchaseOrderPdfUploadModal from 'views/Purchased Order/PurchaseOrderPdfUploadModal';
import UploadInvoicePDFModal from './UploadInvoicePDFModal';
import { hasPermission } from 'Middleware/permissionUtils';
import { GetSalesOrderProductList } from 'services/Sales Order Product/SalesOrderProductApi';

const SalesOrderList = () => {
    const [visiblePasswords, setVisiblePasswords] = useState({});

    const [stateChangeStatus, setStateChangeStatus] = useState('');
    const [showVehicleViewModal, setShowVehicleViewModal] = useState(false);
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
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);

    const [showPoUploadModal, setShowPoUploadModal] = useState(false);
    const [showInvoiceUploadModal, setShowInvoiceUploadModal] = useState(false);
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
            GetSalesOrderProductListData(1, null, toDate, fromDate);
            setSearchKeyword('');
        }
        setIsAddUpdateActionDone(false);
    }, [isAddUpdateActionDone]);


    useEffect(() => {
        GetSalesOrderProductListData(1, null, toDate, fromDate);
    }, []);

    const GetSalesOrderProductListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
        // debugger
        setLoader(true);
        try {
            const data = await GetSalesOrderProductList({
                pageSize,
                pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
                searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
                toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
                fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                sortingDirection: null,
                sortingColumnName: null,
                tabName: 'SalesOrder',
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

    const VehicleAddBtnClicked = () => {
        setModelRequestData({
            ...modelRequestData,
            employeeKeyID: null,
            Action: null
        });
        setShowEmployeeModal(true);
    };


    const uploadInvoiceProduct = (value) => {

        {
            setModelRequestData({
                ...modelRequestData,
                leadName: value.leadName,
                requirement: value.requirement,
                address: value.address,
                leadKeyID: value.leadKeyID,
                quotationFormatID: value.quotationFormatID,
                // quotationFormatID: value.quotationFormatID,
                quotationKeyID: value.quotationKeyID,
                salesOrderID: value.salesOrderID
            });
        }
        // setShowInvoiceUploadModal(true)


        navigate('/invoice-list', {
            state: {
                leadKeyID: value.leadKeyID,
                leadName: value.leadName,
                requirement: value.requirement,
                address: value.address,
                quotationAmount: value.quotationAmount,
                salesOrderAmount: value.salesOrderAmount,
                poGrandTotal: value.salesOrderAmount,
                quotationFormatID: value.quotationFormatID,
                quotationKeyID: value.quotationKeyID,
                salesOrderKeyID: value.salesOrderKeyID,
                purchaseOrderKeyID: value.purchaseOrderKeyID,
                salesOrderID: value.salesOrderID

            }
        });
    };
    const downloadPOBtnClick = (value) => {
        const poUrl = value?.poUrl;

        if (poUrl) {
            const link = document.createElement("a");
            link.href = poUrl;
            link.setAttribute("download", "PurchaseOrder.pdf"); // Forces download
            link.setAttribute("target", "_blank"); // Optional: open in new tab if needed
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.warn("No PDF URL found.");
        }
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
        setCurrentPage(1);
        GetSalesOrderProductListData(1, capitalizedValue, toDate, fromDate);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        GetSalesOrderProductListData(pageNumber, null, toDate, fromDate);
    };

    const closeAll = () => {
        setShowSuccessModal(false);
    };

    const handleClearDates = () => {
        setCurrentPage(1);
        setToDate(null);
        setFromDate(null);
        GetSalesOrderProductListData(1, null, null, null);
    };

    const handleStatusChange = (row) => {
        setStateChangeStatus(row); // You can set only relevant data if needed
        setShowStatusChangeModal(true);
    };
    const closeAllModal = () => {
        // onHide();
        setShowInvoiceUploadModal(false)
        setShowPoUploadModal(false)
        setShowSuccessModal(false);
    };
    const uploadPurchaseOrder = (item) => {

        setModelRequestData({
            ...modelRequestData,
            Action: 'Update',
            purchaseOrderKeyID: item.purchaseOrderKeyID,
            leadKeyID: item.leadKeyID,
        })

        setShowPoUploadModal(true)
    }

    const confirmStatusChange = async (row, user) => {
        setLoader(true);

        // debugger
        try {
            const { employeeKeyID } = row; // Destructure to access only what's needed
            const response = await ChangeEmployeeStatus(employeeKeyID, user.userKeyID);

            if (response && response.data.statusCode === 200) {
                setLoader(false);

                // Successfully changed the status
                setShowStatusChangeModal(false);
                setStateChangeStatus(null);
                GetSalesOrderProductListData(currentPage, null, toDate, fromDate);
                // GetMasterDistrictListData(currentPage, null, toDate, fromDate);
                setShowSuccessModal(true);
                setModelAction('Employee status changed successfully.');
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


    const viewLogBtnClick = (value) => {

        let activityLogs = {

            leadKeyID: value.leadKeyID,
            leadID: value.leadID,
            leadName: value.leadName

        };

        navigate('/activity-logs-details', { state: activityLogs });
    };


    const previewQuotationBtnClick = (value, isDownloadMode = false) => {


        {
            setModelRequestData({
                ...modelRequestData,
                leadName: value.leadName,
                requirement: value.requirement,
                Action: 'FromPendingForApproval',
                BTNAction: null,
                showDownloadButton: isDownloadMode,
            });
        }


        navigate('/quotation-preview', {
            state: {
                quotationKeyID: value.quotationKeyID,
                action: 'FromPendingForApproval', BTNAction: 'Hide',
                showDownloadButton: isDownloadMode, // pass true or false
            }
        });
    };



    const TaxInvoiceBtnClick = (value) => {

        {
            setModelRequestData({
                ...modelRequestData,
                salesOrderKeyID: value.salesOrderKeyID,

            });
        }



        navigate('/tax-invoice-report', {
            state: {
                salesOrderKeyID: value.salesOrderKeyID,
                Action: 'SalesOrderReport'

            }
        });
    };

    return (
        <>
            <div className="card w-full max-w-[50vh] mx-auto h-auto">
                <div className="card-body p-2 bg-white shadow-md rounded-lg">
                    {/* Top controls */}
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="flex-grow-1 ">
                            <h5 className="mb-0">Sales  Order</h5>
                        </div>
                        <div className="position-absolute end-0 me-2">
                            <button onClick={() => VehicleAddBtnClicked()} className="btn btn-success btn-sm d-inline d-sm-none">
                                <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                                <span className="d-inline d-sm-none"> Add</span>
                            </button>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search Sales Order"
                            style={{ maxWidth: '350px' }}
                            value={searchKeyword}
                            onChange={(e) => {
                                handleSearch(e);
                            }}
                        />
                        {/* <div className="d-flex align-items-center ms-2 gap-2 mt-2 mt-sm-0">
                            <Tooltip title="Add Purchase Order">
                                <button onClick={() => VehicleAddBtnClicked()} style={{ background: '#ffaa33', color: 'white' }} className="btn  btn-sm d-none d-sm-inline ">
                                    <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>{" "}
                                    <span className="d-none d-sm-inline">Add</span>
                                </button>
                            </Tooltip>
                            <Tooltip title="Export">
                                <button onClick={exportToExcel} className="btn btn-warning btn-sm d-none d-sm-inline" style={{ marginRight: '2px' }}>
                                    <i className="fa-solid fa-file-export" style={{ fontSize: '11px' }}></i>
                                    {" "}  <span className="d-none d-sm-inline">Export</span>
                                </button>
                            </Tooltip>
                        </div> */}
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
                                    <th className="text-center">Lead Name</th>
                                    <th className="text-center">Requirement</th>
                                    <th className="text-center">Po No.</th>
                                    <th className="text-center">PO Date</th>
                                    <th className="text-center">Address</th>
                                    <th className="text-center">Quotation Format </th>
                                    <th className="text-center">Quotation No</th>
                                    <th className="text-center">Sales Order Amt</th>

                                    {/* <th className="text-center">PO Status</th> */}
                                    {/* <th className="text-center">Status</th> */}
                                    <th className="text-center actionSticky">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicleListData?.map((value, idx) => (
                                    <tr className="tableBodyTd text-nowrap" key={idx}>
                                        <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                                        <td>
                                            {value.leadName?.length > 30 ? (
                                                <Tooltip title={value.leadName}>{`${value.leadName?.substring(0, 30)}...`}</Tooltip>
                                            ) : (
                                                <>{value.leadName}</>
                                            )}
                                        </td>
                                        <td>
                                            {value.requirement?.length > 30 ? (
                                                <Tooltip title={value.requirement}>{`${value.requirement?.substring(0, 30)}...`}</Tooltip>
                                            ) : (
                                                <>{value.requirement}</>
                                            )}
                                        </td>
                                        <td className="text-center">{value.poNumber}</td>
                                        <td className="text-center">{value.poDate}</td>
                                        <td className="text-center">
                                            {value.address?.length > 30 ? (
                                                <Tooltip title={value.address}>{`${value.address?.substring(0, 30)}...`}</Tooltip>
                                            ) : (
                                                <>{value.address}</>
                                            )}
                                        </td>
                                        {/* <td className="text-center">{value.quotationFormatName}</td> */}
                                        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                                            {value?.quotationFormatName === "Discounted Amount" ? (
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
                                        <td className="text-center">{value.quotationNumber}</td>

                                        <td className="text-center">
                                            {new Intl.NumberFormat('en-IN', {
                                                style: 'decimal',
                                                maximumFractionDigits: 0,
                                                minimumFractionDigits: 0
                                            }).format(Math.round(value.salesOrderAmount))}
                                        </td>



                                        {/* <td className="text-center">{value.poStatusName}</td> */}





                                        {/* <td className="text-center">
                                            <Tooltip title={value.status === true ? 'Active' : 'Deactive'}>
                                                {value.status === true ? 'Active' : 'Active'}
                                                <Android12Switch style={{ padding: '8px' }}
                                                    onClick={() => handleStatusChange(value)}
                                                    checked={value.status === true} />
                                            </Tooltip>
                                        </td> */}

                                        <td className="text-center actionColSticky " style={{ zIndex: 4 }}>
                                            <div className="d-flex gap-2">
                                                {hasPermission(permissions, 'Sales Order', 'Can View') && (
                                                    <Tooltip title="View Sales Order">
                                                        <button
                                                            style={{
                                                                padding: '4px 8px', // Adjust padding for smaller size
                                                                fontSize: '12px', // Optional: smaller font size
                                                                height: '28px', // Set height
                                                                width: '28px', // Set width,
                                                                background: '#ffaa33', color: 'white'
                                                            }}
                                                            onClick={() => addSerialNoToEachProductQty(value, 'HideBtn')}
                                                            type="button"

                                                            className="btn-sm btn ms-2"
                                                        >
                                                            <i className="fa-solid fa-eye"></i>
                                                        </button>
                                                    </Tooltip>
                                                )}
                                                {hasPermission(permissions, 'Invoice', 'Can View') && (
                                                    <Tooltip title="Add  Invoice">
                                                        <button
                                                            style={{
                                                                padding: '4px 8px', // Adjust padding for smaller size
                                                                fontSize: '12px', // Optional: smaller font size
                                                                // height: '28px', // Set height
                                                                // width: '28px', // Set width,
                                                                background: '#ffaa33', color: 'white'
                                                            }}
                                                            onClick={() => uploadInvoiceProduct(value)}
                                                            type="button"

                                                            className="btn-sm btn ms-2"
                                                        >
                                                            Add Invoices
                                                            {/* <i class="fa-solid fa-cloud-arrow-up"></i> */}
                                                        </button>
                                                    </Tooltip>

                                                )}
                                                <Tooltip title={"Sales Order Report"}>

                                                    <button className='btn text-white btn-sm' style={{ background: '#9aa357' }} onClick={() => TaxInvoiceBtnClick(value)}>Sales Order Report</button>
                                                </Tooltip>
                                                {hasPermission(permissions, 'Invoice', 'Can View') && (
                                                    <Tooltip title="Download PO">
                                                        <button
                                                            style={{
                                                                padding: '4px 8px', // Adjust padding for smaller size
                                                                fontSize: '12px', // Optional: smaller font size
                                                                height: '28px', // Set height
                                                                width: '28px', // Set width,
                                                                background: '#ffaa33', color: 'white'
                                                            }}
                                                            onClick={() => downloadPOBtnClick(value)}
                                                            type="button"

                                                            className="btn-sm btn ms-2"
                                                        >
                                                            <i class="fa-solid fa-download"></i>
                                                        </button>
                                                    </Tooltip>

                                                )}


                                                <Tooltip title="View Log">
                                                    <button onClick={() => viewLogBtnClick(value)}
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
                                                <Tooltip title="View Quotation">

                                                    <button
                                                        className="btn-sm btn d-flex"
                                                        style={{
                                                            fontSize: '12px',
                                                            marginRight: '5px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center', background: '#ffaa33', color: 'white'
                                                        }}
                                                        onClick={() => {
                                                            previewQuotationBtnClick(value, true);
                                                            setOpenRow(null);
                                                        }}
                                                    >
                                                        View Quotation
                                                    </button>

                                                </Tooltip>

                                            </div>

                                        </td>
                                    </tr>
                                ))}

                                {/* Add more static rows as needed */}
                            </tbody>
                        </Table>
                        {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                    </div>

                    {/* Pagination */}
                    <div className="d-flex justify-content-end ">
                        {totalCount > pageSize && (
                            <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
                        )}
                    </div>
                </div>
            </div>


            <StatusChangeModal
                open={showStatusChangeModal}
                onClose={() => setShowStatusChangeModal(false)}
                onConfirm={() => confirmStatusChange(stateChangeStatus, user)} // Pass the required arguments
            />
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
            {showInvoiceUploadModal &&
                <UploadInvoicePDFModal
                    show={showInvoiceUploadModal}
                    onHide={() => closeAllModal()}

                    modelRequestData={modelRequestData}
                />
            }
            <ImageModal show={imgModalShow} onHide={() => setImgModalShow(false)} imageUrl={selectedImage} title={imgModalTitle} />
        </>
    );
};

export default SalesOrderList;
