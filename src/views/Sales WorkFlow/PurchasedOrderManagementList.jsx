
import React, { useState, useEffect, useContext, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router';
import { Table } from 'react-bootstrap';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import PaginationComponent from 'component/Pagination';
import { ConfigContext } from 'context/ConfigContext';
import { Collapse, } from "react-bootstrap";
import NoResultFoundModel from 'component/NoResultFoundModal';
import ImageModal from 'component/ImageModal';
import Android12Switch from 'component/Android12Switch';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { Tooltip } from '@mui/material';

import { GetPOList, SendToDispatched } from 'services/Purchase Order/PurchaseOrderApi';
import PurchaseOrderPdfUploadModal from 'views/Purchased Order/PurchaseOrderPdfUploadModal';
import { hasPermission } from 'Middleware/permissionUtils';
import { Link } from 'react-router-dom';
import POEditApprovedRejectModal from 'views/PO Edit Modal/POEditApprovedRejectModal';

const PurchasedOrderManagementList = () => {
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [ActiveTab, setActiveTab] = useState('PoOrderTab');
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
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);

    const [showPoUploadModal, setShowPoUploadModal] = useState(false);
    const [showEditReqApprovedModal, setShowEditReqApprovedModal] = useState(false);
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
            if (ActiveTab === 'Purchase Order') {

                GetPOListData(1, null, toDate, fromDate, 'PO');
            } else if (ActiveTab === 'EditReq') {
                GetPOListData(1, null, toDate, fromDate, 'Edit PO');

            }
            setSearchKeyword('');
        }
        setIsAddUpdateActionDone(false);
    }, [isAddUpdateActionDone]);



    useEffect(() => {
        GetPOListData(1, null, toDate, fromDate, "PO");
    }, []);

    const GetPOListData = async (pageNumber, searchKeywordValue, toDate, fromDate, tabName) => {
        // debugger
        setLoader(true);
        try {
            const data = await GetPOList({
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


    const handleTabSelect = (key) => {

        setSearchKeyword('');
        setCurrentPage(1);
        setTotalCount(0);

        if (key === 'PoOrderTab') {
            setActiveTab('PoOrderTab');
            GetPOListData(1, null, toDate, fromDate, "PO");



        } else if (key === 'EditReq') {
            setActiveTab('EditReq');
            GetPOListData(1, null, toDate, fromDate, "Edit PO");




        }
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
        // debugger
        let searchKeywordValue = e.target.value;
        const trimmedValue = searchKeywordValue.replace(/^\s+/g, '');
        const capitalizedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1).toLowerCase();
        if (searchKeywordValue.length === 1 && searchKeywordValue.startsWith(' ')) {
            searchKeywordValue = searchKeywordValue.trimStart();
            return;
        }
        setSearchKeyword(capitalizedValue);
        if (ActiveTab === 'PoOrderTab') {
            GetPOListData(1, capitalizedValue, toDate, fromDate, "PO");
        } else if (ActiveTab === 'EditReq') {
            GetPOListData(1, capitalizedValue, toDate, fromDate, "Edit PO");


        }

    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        GetPOListData(pageNumber, null, toDate, fromDate, 'PO');
    };
    const handleReadyForDispatchPageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        GetPOListData(pageNumber, null, toDate, fromDate, 'Ready For Dispatch');
    };
    const handleDispatchPageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        GetPOListData(pageNumber, null, toDate, fromDate, 'Dispatched');
    };

    const closeAll = () => {
        setShowSuccessModal(false);
    };

    // at top of your component
    const [openRow, setOpenRow] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenRow(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClearDates = () => {
        setCurrentPage(1);
        setToDate(null);
        setFromDate(null);
        GetPOListData(1, null, null, null);
    };

    const handleStatusChange = (row) => {
        setStateChangeStatus(row); // You can set only relevant data if needed
        setShowStatusChangeModal(true);
    };
    const closeAllModal = () => {
        // onHide();
        setShowEditReqApprovedModal(false)
        navigate('/purchase-order-management')
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


    const [openLead, setOpenLead] = useState(null);
    const [openPO, setOpenPO] = useState(null);
    const [openQuotation, setOpenQuotation] = useState(null);
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
    const formatVehicleNumber = (vehicleNumber) => {
        if (!vehicleNumber) return ''; // Handle empty or undefined values

        // Remove invalid characters and ensure uppercase
        const sanitizedInput = vehicleNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');

        // Split into parts and format
        const parts = [
            sanitizedInput.slice(0, 2), // State code (2 letters)
            sanitizedInput.slice(2, 4), // RTO code (2 digits)
            sanitizedInput.slice(4, 6), // Series code (2 letters)
            sanitizedInput.slice(6, 10) // Employee number (4 digits)
        ];

        // Join parts with spaces
        return parts.filter((part) => part).join(' ');
    };



    const addSerialNoToEachProductQty = (value, actionType) => {
        console.log(value.poProductMappingList[0].quantity, '3sdada');

        let updateQuote = {
            leadKeyID: value.leadKeyID,
            isSalesProductAdded: value.isSalesProductAdded,
            purchaseOrderKeyID: value.purchaseOrderKeyID,
            quotationFormatID: value.quotationFormatID,
            Action: actionType === 'HideBtn' ? 'HideForReadyForDispatch' : null,
            hideTheCreateSalesBtn: value.poProductMappingList[0].quantity
        };

        navigate('/add-product-sales-order', { state: updateQuote, });
    };



    const viewLogBtnClick = (value) => {

        let activityLogs = {

            leadKeyID: value.leadKeyID,
            leadName: value.leadName,
            leadID: value.leadID

        };

        navigate('/activity-logs-details', { state: activityLogs });
    };



    const [bubble, setBubble] = useState({ visible: false, text: "", x: 0, y: 0 });

    const [selectedLeads, setSelectedLeads] = useState([]);

    const handleCheck = (leadID, e) => {
        const isChecked = selectedLeads.includes(leadID);
        const updatedSelected = isChecked
            ? selectedLeads.filter((id) => id !== leadID)
            : [...selectedLeads, leadID];

        setSelectedLeads(updatedSelected);

        // Show bubble at mouse cursor
        setBubble({
            visible: true,
            text: isChecked ? "Unchecked" : "Checked",
            x: e.clientX + 15, // offset from cursor
            y: e.clientY + 15,
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allLeadIDs = vehicleListData?.map((v) => v.leadID) || [];
            setSelectedLeads(allLeadIDs);
            setBubble({ visible: true, text: "All Selected", x: e.clientX + 15, y: e.clientY + 15 });
        } else {
            setSelectedLeads([]);
            setBubble({ visible: true, text: "All Deselected", x: e.clientX + 15, y: e.clientY + 15 });
        }
    };

    const approveRejectBtnClick = () => {
        debugger
        setModelRequestData({
            ...modelRequestData,
            leadID: selectedLeads

        })
        setShowEditReqApprovedModal(true)
    }
    return (
        <>
            <div className="card w-full max-w-[50vh] md:max-w-[90vw] mx-auto h-auto">
                <div className="card-body p-2 bg-white shadow-md rounded-lg">
                    {/* Top controls */}





                    <div className="d-flex justify-content-between items-center flex-wrap gap-2">

                        <h5 className="mb-0">Purchase Order</h5>
                    </div>


                    <Row >
                        <Col>
                            <Tabs activeKey={ActiveTab} id="justify-tab-example" className="whitespace-nowrap" onSelect={handleTabSelect}>

                                <Tab
                                    eventKey="PoOrderTab"
                                    title={
                                        <Tooltip title="Purchase Order">
                                            <span className="text-sm md:text-base">Purchase Order</span>
                                        </Tooltip>
                                    }
                                    tabClassName="tab-upcoming"
                                >

                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search Purchase Order"
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
                                                    {/* Group 1: Lead Info */}
                                                    <th className="text-center">Lead Info</th>

                                                    {/* Group 2: PO Info */}
                                                    <th className="text-center">PO Info</th>

                                                    {/* Group 3: Quotation Info */}
                                                    <th className="text-center">Quotation Info</th>

                                                    <th className="text-center">PO Grand Total</th>
                                                    <th className="text-center">PO Status</th>
                                                    <th className="text-center actionSticky">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {vehicleListData?.map((value, idx) => (
                                                    <tr className="tableBodyTd text-nowrap" key={idx}>
                                                        <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                                                        <td className="text-left">
                                                            <a
                                                                href="#!"
                                                                style={{ color: '#3366ff', textDecoration: 'underline', cursor: 'pointer' }}
                                                                onClick={() => setOpenLead(openLead === idx ? null : idx)}
                                                            >
                                                                {value.leadName?.substring(0, 20)}{value.leadName?.length > 20 && "..."}
                                                            </a>
                                                            <Collapse in={openLead === idx}>
                                                                <div className="mt-1 small bg-light p-2 border">
                                                                    <div>
                                                                        <b>Lead:</b>{" "}
                                                                        <Tooltip title={value.leadName}>
                                                                            <span>{value.leadName}</span>
                                                                        </Tooltip>
                                                                    </div>
                                                                    <div>
                                                                        <b>Requirement:</b>{" "}
                                                                        <Tooltip title={value.requirement}>
                                                                            <span>{value.requirement}</span>
                                                                        </Tooltip>
                                                                    </div>
                                                                    <div>
                                                                        <b>Address:</b>{" "}
                                                                        <Tooltip title={value.address}>
                                                                            <span>{value.address}</span>
                                                                        </Tooltip>
                                                                    </div>
                                                                </div>
                                                            </Collapse>
                                                        </td>

                                                        {/* PO Info */}
                                                        <td className="text-left">
                                                            <a
                                                                href="#!"
                                                                style={{ color: '#3366ff', textDecoration: 'underline', cursor: 'pointer' }}
                                                                onClick={() => setOpenPO(openPO === idx ? null : idx)}
                                                            >
                                                                {value.poNumber}
                                                            </a>
                                                            <Collapse in={openPO === idx}>
                                                                <div className="mt-1 small bg-light p-2 border">
                                                                    <div>
                                                                        <b>PO Number:</b> {value.poNumber}
                                                                    </div>
                                                                    <div>
                                                                        <b>Date:</b> {value.poDate}
                                                                    </div>
                                                                </div>
                                                            </Collapse>
                                                        </td>

                                                        {/* Quotation Info */}
                                                        <td className="text-left">
                                                            <a
                                                                href="#!"
                                                                style={{ color: '#3366ff', textDecoration: 'underline', cursor: 'pointer' }}
                                                                onClick={() => setOpenQuotation(openQuotation === idx ? null : idx)}
                                                            >
                                                                {value.quotationNumber}
                                                            </a>
                                                            <Collapse in={openQuotation === idx}>
                                                                <div className="mt-1 small bg-light p-2 border">
                                                                    <div>
                                                                        <b>Format:</b> {value.quotationFormatName}
                                                                    </div>

                                                                </div>
                                                            </Collapse>
                                                        </td>
                                                        <td className="text-center">
                                                            {new Intl.NumberFormat('en-IN', {
                                                                style: 'decimal',
                                                                maximumFractionDigits: 0,
                                                                minimumFractionDigits: 0
                                                            }).format(Math.round(value.poGrandTotal))}
                                                        </td>

                                                        <td className="text-center">{value.poStatusName}</td>







                                                        <td className="text-center relative  actionColSticky " style={{ zIndex: 4 }}>

                                                            <div className="d-flex gap-2">



                                                                {hasPermission(permissions, 'Sales Order', 'Can Insert') && (
                                                                    <Tooltip title="Create Sales Order">
                                                                        <button
                                                                            style={{
                                                                                padding: '4px 8px', // Adjust padding for smaller size
                                                                                fontSize: '12px', // Optional: smaller font size
                                                                                height: '28px', // Set height
                                                                                width: '28px', // Set width,
                                                                                background: '#ffaa33', color: 'white'
                                                                            }}
                                                                            onClick={() => addSerialNoToEachProductQty(value)}
                                                                            type="button"

                                                                            className="btn-sm btn ms-2"
                                                                        >
                                                                            <i class="fa-solid fa-circle-plus"></i>

                                                                        </button>
                                                                    </Tooltip>
                                                                )}
                                                                {hasPermission(permissions, 'Purchase Order', 'Can View') && (
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
                                                                            <i class="fa-solid fa-arrow-down"></i>
                                                                        </button>
                                                                    </Tooltip>
                                                                )}




                                                                <Tooltip title="View Log">
                                                                    <button
                                                                        className="btn-sm btn ms-2"
                                                                        onClick={() => {
                                                                            viewLogBtnClick(value);
                                                                            setOpenRow(null);
                                                                        }}
                                                                        style={{
                                                                            padding: '4px 8px', // Adjust padding for smaller size
                                                                            fontSize: '12px', // Optional: smaller font size
                                                                            height: '28px', // Set height
                                                                            width: '28px', // Set width,
                                                                            background: '#ffaa33', color: 'white'
                                                                        }}
                                                                    >
                                                                        📜
                                                                    </button>
                                                                </Tooltip>
                                                                <Tooltip title="PO Edit History">
                                                                    <button
                                                                        style={{
                                                                            padding: '4px 8px', // Adjust padding for smaller size
                                                                            fontSize: '12px', // Optional: smaller font size
                                                                            height: '28px', // Set height
                                                                            width: '28px', // Set width,
                                                                            background: '#ffaa33', color: 'white'
                                                                        }}
                                                                        className="btn-sm btn ms-2" onClick={() => {
                                                                            POEditRequestLogListModalBTN(value);
                                                                            setOpenRow(null);
                                                                        }}
                                                                    >
                                                                        📝
                                                                    </button>
                                                                </Tooltip>
                                                                <Tooltip title="View Quotation">
                                                                    <button
                                                                        style={{
                                                                            padding: '4px 8px', // Adjust padding for smaller size
                                                                            fontSize: '12px', // Optional: smaller font size
                                                                            height: '28px', // Set height
                                                                            width: '28px', // Set width,
                                                                            background: '#ffaa33', color: 'white'
                                                                        }}
                                                                        className="btn-sm btn ms-2" onClick={() => {
                                                                            previewQuotationBtnClick(value, true);
                                                                            setOpenRow(null);
                                                                        }}
                                                                    >
                                                                        🧾
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
                                </Tab>

                                <Tab
                                    eventKey="EditReq"
                                    title={
                                        <Tooltip title="Edit Request">
                                            <span className="text-sm md:text-base">Edit Request</span>
                                        </Tooltip>
                                    }
                                    tabClassName="tab-upcoming"
                                >

                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search Purchase Order"
                                            style={{ maxWidth: '350px' }}
                                            value={searchKeyword}
                                            onChange={(e) => {
                                                handleSearch(e);
                                            }}
                                        />

                                        <div className="d-flex gap-2 align-items-center">

                                            <Tooltip title="Edit Request">
                                                <button onClick={approveRejectBtnClick} style={{ background: '#ffaa33', color: 'white' }} className="btn  btn-sm">
                                                    <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i>
                                                    <span className="d-none d-sm-inline">Edit Request</span>
                                                </button>
                                            </Tooltip>

                                        </div>
                                    </div>

                                    {/* Table */}
                                    <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
                                        <table className="table table-bordered table-striped table-hover">
                                            <thead style={{ position: 'sticky', top: -1, zIndex: 1, backgroundColor: '#4CAF50', color: '#fff' }}>
                                                <tr className="text-nowrap">
                                                    <th className="text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedLeads.length === vehicleListData?.length && vehicleListData?.length > 0}
                                                            onChange={handleSelectAll}
                                                        />
                                                    </th>
                                                    <th className="text-center">Sr.No.</th>
                                                    <th className="text-center">Lead Name</th>
                                                    <th className="text-center">Requirement</th>
                                                    <th className="text-center">PO Edit Request Remark</th>
                                                    <th className="text-center">Po No.</th>
                                                    <th className="text-center">PO Date</th>
                                                    <th className="text-center">Address</th>
                                                    <th className="text-center">Quotation Format Name</th>
                                                    <th className="text-center">Quotation Number</th>

                                                    <th className="text-center">PO Status</th>
                                                    {/* <th className="text-center">Status</th> */}
                                                    <th className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {vehicleListData?.map((value, idx) => (
                                                    <tr className="tableBodyTd text-nowrap" key={idx}>
                                                        <td className="tableBodyTd  text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedLeads.includes(value.leadID)}
                                                                onChange={(e) => handleCheck(value.leadID, e)}
                                                            />
                                                        </td>
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
                                                        <td >
                                                            {value.poEditRequestRemark?.length > 30 ? (
                                                                <Tooltip title={value.poEditRequestRemark}>{`${value.poEditRequestRemark?.substring(0, 30)}...`}</Tooltip>
                                                            ) : (
                                                                <>{value.poEditRequestRemark}</>
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
                                                        <td className="text-center">{value.quotationFormatName}</td>
                                                        <td className="text-center">{value.quotationNumber}</td>

                                                        <td className="text-center">{value.poStatusName}</td>







                                                        <td className="text-center ">

                                                            <div className="d-flex gap-2">

                                                                {hasPermission(permissions, 'Purchase Order', 'Can View') && (
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
                                                                            <i class="fa-solid fa-arrow-down"></i>
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
                                                            </div>





                                                        </td>
                                                    </tr>
                                                ))}

                                                {/* Add more static rows as needed */}
                                            </tbody>

                                        </table>

                                        {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                                    </div>

                                    {/* Pagination */}
                                    <div className="d-flex justify-content-end ">
                                        {totalCount > pageSize && (
                                            <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
                                        )}
                                    </div>
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>

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
            {showEditReqApprovedModal &&
                <POEditApprovedRejectModal
                    show={showEditReqApprovedModal}
                    onHide={() => closeAllModal()}
                    setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                    modelRequestData={modelRequestData}
                />

            }
            <ImageModal show={imgModalShow} onHide={() => setImgModalShow(false)} imageUrl={selectedImage} title={imgModalTitle} />
        </>
    );
};

export default PurchasedOrderManagementList;
