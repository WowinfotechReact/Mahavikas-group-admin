




import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import { Button, Table } from 'react-bootstrap'
import 'react-datepicker/dist/react-datepicker.css';
import { FileText, Tag } from "lucide-react";
import { Clock } from "lucide-react";
import { User, Phone } from "lucide-react";
import { ChevronRight, ChevronDown, IndianRupee } from "lucide-react";
import { Calendar, ShieldCheck, Shield } from "lucide-react";
import { useNavigate } from 'react-router';
import PaginationComponent from 'component/Pagination';
import { ConfigContext } from 'context/ConfigContext';
import { Package, Layers, Cpu, Factory } from "lucide-react";
import { motion } from "framer-motion";

import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Icons for eye and eye-slash
import * as XLSX from 'xlsx';
import { ChangeVehicleStatus, GetVehicleList } from 'services/Vehicle/VehicleApi';
import NoResultFoundModel from 'component/NoResultFoundModal';
import ImageModal from 'component/ImageModal';
import Android12Switch from 'component/Android12Switch';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { Tooltip } from '@mui/material';
import { ChangeEmployeeStatus } from 'services/Employee Staff/EmployeeApi';
import { GetPOList } from 'services/Purchase Order/PurchaseOrderApi';
import PurchaseOrderPdfUploadModal from 'views/Purchased Order/PurchaseOrderPdfUploadModal';
import { hasPermission } from 'Middleware/permissionUtils';
import { GetAMCPurchaseOrderList } from 'services/AMC Purchase Order/AMCPurchaseOrderApi';

const AmcPOList = () => {
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
            GetAMCPurchaseOrderListData(1, null, toDate, fromDate);
            setSearchKeyword('');
        }
        setIsAddUpdateActionDone(false);
    }, [isAddUpdateActionDone]);

    useEffect(() => {
        GetAMCPurchaseOrderListData(1, null, toDate, fromDate);
    }, [setIsAddUpdateActionDone]);
    useEffect(() => {
        GetAMCPurchaseOrderListData(1, null, toDate, fromDate);
    }, []);

    const GetAMCPurchaseOrderListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
        // debugger
        setLoader(true);
        try {
            const data = await GetAMCPurchaseOrderList({
                pageSize,
                pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
                searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
                toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
                fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                sortingDirection: null,
                sortingColumnName: null,
                // tabName: 'SalesOrder',
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
                amcKeyID: value?.amcKeyID,
                amcCharges: value.amcCharges,
                // quotationFormatID: value.quotationFormatID,
                quotationKeyID: value.quotationKeyID
            });
        }
        // setShowInvoiceUploadModal(true)


        navigate('/amc-add-invoice-list', {
            state: {
                amcKeyID: value.amcKeyID,
                amcCharges: value.amcCharges,
                customerFirmName: value.customerFirmName,
                amcpoNumber: value.amcpoNumber,
                // amcInvoiceNumber: value.amcInvoiceNumber,

            }
        });
    };


    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRow = (idx) => {
        setExpandedRow(expandedRow === idx ? null : idx);
    };

    const downloadPOBtnClick = (value) => {
        const amcpoUrl = value?.amcpoUrl;

        if (amcpoUrl) {
            const link = document.createElement("a");
            link.href = amcpoUrl;
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
        GetAMCPurchaseOrderListData(1, capitalizedValue, toDate, fromDate);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        GetAMCPurchaseOrderListData(pageNumber, null, toDate, fromDate);
    };

    const closeAll = () => {
        setShowSuccessModal(false);
    };

    const handleClearDates = () => {
        setCurrentPage(1);
        setToDate(null);
        setFromDate(null);
        GetAMCPurchaseOrderListData(1, null, null, null);
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
                GetAMCPurchaseOrderListData(currentPage, null, toDate, fromDate);
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


        navigate('/amc-quotation-preview', {
            state: {
                amcKeyID: value.amcKeyID,
                action: 'FromPendingForApproval', BTNAction: 'Hide',
                showDownloadButton: isDownloadMode, // pass true or false
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
                            <h5 className="mb-0">Amc Purchase Order</h5>
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
                            placeholder="Search Amc PO"
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
                                    <th className="text-center">Customer Firm Info</th>
                                    <th className="text-center">Product Name</th>
                                    <th className="text-center">AMC Charges ⟨र⟩</th>
                                    <th className="text-center">AMC Date Info</th>

                                    <th className="text-center">AMC Po Info</th>


                                    <th className="text-center actionSticky">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicleListData?.map((value, idx) => {
                                    const isExpanded = expandedRow === idx;

                                    return (
                                        <>
                                            <tr className="tableBodyTd text-nowrap" key={idx}>
                                                <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>

                                                {/* Product Name clickable */}

                                                <td className="text-center">
                                                    <div className="d-flex flex-column align-items-start gap-1 p-2">
                                                        {/* Customer/Firm Name */}
                                                        <div className="d-flex align-items-center gap-2">
                                                            <User size={16} className="text-primary" />
                                                            <span className='text-nowrap'>{value.customerFirmName}</span>
                                                        </div>

                                                        {/* Mobile Number */}
                                                        <div className="d-flex align-items-center gap-2">
                                                            <Phone size={16} className="text-success" />
                                                            <span>{value.custMobileNumber}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td
                                                    className="text-center text-primary"
                                                    style={{ cursor: "pointer", textDecoration: "underline" }}
                                                    onClick={() => toggleRow(idx)}
                                                >
                                                    {value.productName}
                                                    {isExpanded ? <ChevronDown size={16} className="me-1" /> : <ChevronRight size={16} className="me-1" />}
                                                </td>
                                                <td className="text-center " >
                                                    {new Intl.NumberFormat('en-IN', {
                                                        style: 'decimal',
                                                        maximumFractionDigits: 0,
                                                        minimumFractionDigits: 0
                                                    }).format(Math.round(value.amcCharges))}
                                                </td>
                                                <td className="text-center align-middle">
                                                    <div
                                                        className="d-inline-flex flex-column align-items-start gap-1 p-2 bg-light rounded shadow-sm"
                                                        style={{ fontSize: "13px", minWidth: "180px" }}
                                                    >
                                                        {/* Warranty */}
                                                        <div className="d-flex align-items-center gap-2">
                                                            <ShieldCheck size={14} className="text-primary" />
                                                            <span><strong>Warranty:</strong> {value.warrantyInMonth || 0}m</span>
                                                        </div>

                                                        {/* Dispatched Date */}
                                                        <div className="d-flex align-items-center gap-2">
                                                            <Calendar size={14} className="text-success" />
                                                            <span><strong>Dispatch:</strong> {value.dispatchedDate || "-"}</span>
                                                        </div>

                                                        {/* Expiry Date */}
                                                        <div className="d-flex align-items-center gap-2">
                                                            <Clock size={14} className="text-danger" />
                                                            <span><strong>Expiry:</strong> {value.expiryDate || "-"}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center align-middle">
                                                    <div
                                                        className="d-inline-flex flex-column align-items-start gap-1 p-2 bg-light rounded shadow-sm"
                                                        style={{ fontSize: "13px", minWidth: "180px" }}
                                                    >
                                                        {/* PO Number */}
                                                        <div className="d-flex align-items-center gap-2">
                                                            <FileText size={14} className="text-primary" />
                                                            <span><strong>No:</strong> {value.amcpoNumber || "-"}</span>
                                                        </div>

                                                        {/* PO Date */}
                                                        <div className="d-flex align-items-center gap-2">
                                                            <Calendar size={14} className="text-success" />
                                                            <span><strong>Date:</strong> {value.amcpoDate || "-"}</span>
                                                        </div>

                                                        {/* PO Status */}
                                                        <div className="d-flex align-items-center gap-2">
                                                            <Tag size={14} className="text-warning" />
                                                            {value.poStatusName?.length > 30 ? (
                                                                <Tooltip title={value.poStatusName}>
                                                                    <span>{`${value.poStatusName?.substring(0, 25)}...`}</span>
                                                                </Tooltip>
                                                            ) : (
                                                                <span>{value.poStatusName || "-"}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="text-center actionColSticky" style={{ zIndex: 4 }}>


                                                    {hasPermission(permissions, 'Invoice', 'Can Insert') && (
                                                        <Tooltip title="Add Invoice">
                                                            <button
                                                                style={{
                                                                    padding: '4px 8px', // Adjust padding for smaller size
                                                                    fontSize: '12px', // Optional: smaller font size

                                                                    background: '#ffaa33', color: 'white'
                                                                }}
                                                                onClick={() => uploadInvoiceProduct(value)}
                                                                type="button"

                                                                className="btn-sm btn ms-2"
                                                            >
                                                                Add Invoice
                                                            </button>
                                                        </Tooltip>

                                                    )}
                                                    {/* {hasPermission(permissions, 'Invoice', 'Can View') && ( */}
                                                    <Tooltip title="Download PO">
                                                        <button
                                                            style={{
                                                                padding: '4px 8px', // Adjust padding for smaller size
                                                                fontSize: '12px', // Optional: smaller font size
                                                                // height: '28px', // Set height
                                                                // width: '28px', // Set width,
                                                                background: '#ffaa33', color: 'white'
                                                            }}
                                                            onClick={() => downloadPOBtnClick(value)}
                                                            type="button"

                                                            className="btn-sm btn ms-2"
                                                        >
                                                            <i class="fa-solid fa-arrow-down"></i> Download PO
                                                        </button>
                                                    </Tooltip>

                                                    <Tooltip title="View AMC Quotation">
                                                        <button
                                                            style={{
                                                                padding: '4px 8px', // Adjust padding for smaller size
                                                                fontSize: '12px', // Optional: smaller font size
                                                                // height: '28px', // Set height
                                                                // width: '28px', // Set width,
                                                                background: '#ffaa33', color: 'white'
                                                            }}

                                                            onClick={(e) => {

                                                                previewQuotationBtnClick(value, true)
                                                            }}
                                                            type="button"
                                                            className="btn-sm btn text-white text-nowrap ms-2"
                                                        >
                                                            View AMC Quotation
                                                        </button>
                                                    </Tooltip>

                                                    {/* )} */}


                                                </td>
                                            </tr>

                                            {/* Expanded Row */}
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan="13" className="bg-light">
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="d-flex flex-wrap gap-4 p-3"
                                                        >
                                                            {/* Product Name */}
                                                            <div className="d-flex align-items-center gap-2">
                                                                <Package size={16} className="text-primary" />
                                                                <span><strong>Product:</strong> {value.productName}</span>
                                                            </div>

                                                            {/* Model */}
                                                            <div className="d-flex align-items-center gap-2">
                                                                <Layers size={16} className="text-success" />
                                                                <span><strong>Model:</strong> {value.modelName}</span>
                                                            </div>

                                                            {/* Variant */}
                                                            <div className="d-flex align-items-center gap-2">
                                                                <Cpu size={16} className="text-warning" />
                                                                <span><strong>Variant:</strong> {value.variantName}</span>
                                                            </div>

                                                            {/* Manufacturer */}
                                                            <div className="d-flex align-items-center gap-2">
                                                                <Factory size={16} className="text-danger" />
                                                                <span><strong>Manufacturer:</strong> {value.manufacturerName}</span>
                                                            </div>
                                                        </motion.div>
                                                    </td>

                                                </tr>
                                            )}
                                        </>
                                    );
                                })}
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

            <ImageModal show={imgModalShow} onHide={() => setImgModalShow(false)} imageUrl={selectedImage} title={imgModalTitle} />
        </>
    );
};

export default AmcPOList;
