
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Tabs, Tab, Button } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import Select from 'react-select';
import * as XLSX from 'xlsx';

import 'react-calendar/dist/Calendar.css';
// import 'react-date-picker/dist/DatePicker.css';
import DatePicker from 'react-date-picker';
import { toast } from 'react-toastify';

import { Table } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { ImportDeviceCSV } from 'services/DeviceTabCsv/DeviceCSVApi';
import { ConfigContext } from 'context/ConfigContext';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import Android12Switch from 'component/Android12Switch';
import StatusChangeModal from 'component/StatusChangeModal ';
import { GetLeadDataList } from 'services/LeadAPI/LeadApi';
import { useNavigate } from 'react-router';
import PurchaseOrderPdfUploadModal from 'views/Purchased Order/PurchaseOrderPdfUploadModal';
import { hasPermission } from 'Middleware/permissionUtils';
import { GetOEMInstallationReportList } from 'services/Original Equipment Manufacturer/OriginalEquipmentManufacturerApi';


const OEMWarrantyList = () => {
    const [moduleName, setModuleName] = useState('');
    const [buttonName, setButtonName] = useState('');
    const [showCustomerViewModel, setShowCustomerViewModel] = useState(false);
    const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
    const [showNewDeviceAddUpdateModal, setShowNewDeviceAddUpdateModal] = useState(false);
    const [newDeviceImportListMap, setNewDeviceImportListData] = useState();
    const [error, setErrors] = useState(null);
    const [errorMessage, setErrorMessage] = useState();
    const [confirmImportedMsg, setConfirmImportedMsg] = useState('')
    const [importResponseData, setImportResponseData] = useState(null);

    const [ActiveTab, setActiveTab] = useState('underWarrantyTab');
    const [showModal, setShowModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState();
    const [currentApiAction, setCurrentApiAction] = useState(null); // Store the function dynamically
    const [modelRequestData, setModelRequestData] = useState({
        Action: null,
        subAction: null,
        employeeKeyID: null,
        userKeyID: null,
        deviceID: null
    });
    const [stateChangeStatus, setStateChangeStatus] = useState('');





    const [searchKeyword, setSearchKeyword] = useState(null);
    const [totalRecords, setTotalRecords] = useState(-1);
    const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
    const { setLoader, user, permissions } = useContext(ConfigContext);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showPoUploadModal, setShowPoUploadModal] = useState(false);
    const [showApprovedRejectQuoteModal, setShowApprovedRejectQuoteModal] = useState(false);
    const [modelAction, setModelAction] = useState('');
    const [pageSize, setPageSize] = useState(30);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState();
    const [totalCount, setTotalCount] = useState(null);
    const [transferListData, setTransferListData] = useState([]);
    const [acceptListData, setAcceptListData] = useState([]);
    const [transferredListData, setTransferredListData] = useState([]);
    const [fromDate, setFromDate] = useState(null); // Initialize as null
    const [toDate, setToDate] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [leadListData, setLeadListData] = useState([]);

    useEffect(() => {
        if (isAddUpdateActionDone) {
            if (ActiveTab === 'AcceptDevice') {
                // GetAcceptDeviceListListData(1, null, null, null, acceptRejectDeviceObj.employeeKeyID);
            } else if (ActiveTab === 'ExpiredOEMTab') {
                // GetDeviceTransferListData(1, null, null, null);
                GetOEMInstallationReportListData(1, null, null, null, null, null, 'Expired')
            }
            setSearchKeyword('')
            // Reset the flag after actions are done
            setIsAddUpdateActionDone(false);
        }
    }, [isAddUpdateActionDone]);

    useEffect(() => {
        ModuleNameFunc();
    }, [ActiveTab]);





    const [expandedRow, setExpandedRow] = useState(null);
    const toggleRow = (idx) => {
        setExpandedRow(expandedRow === idx ? null : idx);
    };








    const handleUnderWarrantyProductPageChange = (pageNumber) => {
        // debugger;
        setLeadListData([]);
        setTotalRecords(-1);
        setCurrentPage(pageNumber); // Update the current page based on the clicked page

        GetOEMInstallationReportListData(pageNumber, null, null, null, null, null, 'Under Warranty')
    };
    const handleUpcomingRecordsPageChange = (pageNumber) => {
        // debugger;
        setLeadListData([]);
        setTotalRecords(-1);
        setCurrentPage(pageNumber); // Update the current page based on the clicked page

        GetOEMInstallationReportListData(pageNumber, null, null, null, null, null, 'Upcoming')
    };
    const handleExpiredRecordsPageChange = (pageNumber) => {
        // debugger;
        setLeadListData([]);
        setTotalRecords(-1);
        setCurrentPage(pageNumber); // Update the current page based on the clicked page

        GetOEMInstallationReportListData(pageNumber, null, null, null, null, null, 'Expired')
    };






    const handleTabSelect = (key) => {
        setConfirmImportedMsg(false)
        setErrors(false);
        setErrorMessage(false);
        setSearchKeyword('');
        setCurrentPage(1);
        setTotalCount(0);

        if (key === 'UpcomingOEMTab') {
            setActiveTab('UpcomingOEMTab');
            //   GetNewDeviceImportListData(1, null, null, null);

            GetOEMInstallationReportListData(1, null, null, null, null, null, 'Upcoming')

        } else if (key === 'ExpiredOEMTab') {
            setActiveTab('ExpiredOEMTab');
            GetOEMInstallationReportListData(1, null, null, null, null, null, 'Expired')



        }
        else if (key === 'underWarrantyTab') {
            setActiveTab('underWarrantyTab');
            GetOEMInstallationReportListData(1, null, null, null, null, null, 'Under Warranty')



        }
    };
    useEffect(() => {
        GetOEMInstallationReportListData(1, null, null, null, null, null, 'Under Warranty')
    }, [])

    const GetOEMInstallationReportListData = async (pageNumber, searchKeywordValue, toDate, fromDate, sortingType, sortValueName, tabName) => {
        setLoader(true);
        // debugger;
        try {
            const response = await GetOEMInstallationReportList({
                pageNo: pageNumber - 1,
                pageSize: pageSize,
                sortingDirection: sortingType ? sortingType : null, //or null
                sortingColumnName: sortValueName ? sortValueName : null, //or null
                searchKeyword: searchKeywordValue === undefined || searchKeywordValue === null ? searchKeyword : searchKeywordValue,
                fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
                userKeyID: user.userKeyID,
                tabName: tabName
            });

            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const leadList = response.data.responseData.data;
                        const totalCount = response.data.totalCount;

                        setTotalCount(totalCount);
                        setTotalPages(Math.ceil(totalCount / pageSize));
                        setLeadListData(leadList);
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


    const closeAllModal = () => {
        setShowPoUploadModal(false)
        setShowSuccessModal(false);
        setShowApprovedRejectQuoteModal(false)
        setShowNewDeviceAddUpdateModal(false);
        setShowModal(false);

        setImportResponseData(null);
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
        if (ActiveTab === 'UpcomingOEMTab') {
            GetOEMInstallationReportListData(1, capitalizedValue, toDate, fromDate, null, null, 'Upcoming');
        } else if (ActiveTab === 'ExpiredOEMTab') {
            GetOEMInstallationReportListData(1, capitalizedValue, toDate, fromDate, null, null, 'Expired');
        } else if (ActiveTab === 'underWarrantyTab') {
            GetOEMInstallationReportListData(1, capitalizedValue, toDate, fromDate, null, null, 'Under Warranty');
        }

    };


    const handleToDateChange = (newValue) => {
        debugger
        if (newValue && dayjs(newValue).isValid()) {
            const newToDate = dayjs(newValue);
            setToDate(newToDate);

            if (fromDate && newToDate.isBefore(fromDate)) {
                setFromDate(newToDate.subtract(1, 'day'));
            }

            // 🔄 Reload data with new date range
            GetOEMInstallationReportListData(
                1,
                searchKeyword,
                newToDate,
                fromDate,
                null,
                null,


            );
        } else {
            setToDate(null);
            GetOEMInstallationReportListData(
                1,
                searchKeyword,
                null,
                fromDate,
                null,
                null,

            );
        }
    };

    const handleFromDateChange = (newValue) => {
        if (newValue && dayjs(newValue).isValid()) {
            const newFromDate = dayjs(newValue);
            setFromDate(newFromDate);

            if (toDate && newFromDate.isAfter(toDate)) {
                setToDate(newFromDate.add(1, 'day'));
            }

            // 🔄 Reload data with new date range


            if (ActiveTab === 'UpcomingOEMTab') {
                GetOEMInstallationReportListData(1, searchKeyword, toDate, newFromDate, null, null, 'Upcoming');
            } else if (ActiveTab === 'ExpiredOEMTab') {
                GetOEMInstallationReportListData(1, searchKeyword, toDate, newFromDate, null, null, 'Expired');
            } else if (ActiveTab === 'underWarrantyTab') {
                GetOEMInstallationReportListData(1, searchKeyword, toDate, newFromDate, null, null, 'Under Warranty');
            }
        } else {
            setFromDate(null);
            if (ActiveTab === 'UpcomingOEMTab') {
                GetOEMInstallationReportListData(1, searchKeyword, toDate, null, null, null, 'Upcoming');
            } else if (ActiveTab === 'ExpiredOEMTab') {
                GetOEMInstallationReportListData(1, searchKeyword, toDate, null, null, null, 'Expired');
            } else if (ActiveTab === 'underWarrantyTab') {
                GetOEMInstallationReportListData(1, searchKeyword, toDate, null, null, null, 'Under Warranty');
            }


        }
    };


    const handleClearDates = () => {
        setFromDate(null);
        setToDate(null);
        if (ActiveTab === 'UpcomingOEMTab') {
            GetOEMInstallationReportListData(1, null, null, null, null, null, 'Upcoming');
        } else if (ActiveTab === 'ExpiredOEMTab') {
            GetOEMInstallationReportListData(1, null, null, null, null, null, 'Expired');
        } else if (ActiveTab === 'underWarrantyTab') {
            GetOEMInstallationReportListData(1, null, null, null, null, null, 'Under Warranty');
        }

    };



    const ModuleNameFunc = () => {
        if (ActiveTab === 'UpcomingOEMTab') {
            setModuleName('OEM Warranty Report');
            setButtonName('Export Upcoming Records');
        } else if (ActiveTab === 'ExpiredOEMTab') {
            setModuleName('OEM Warranty Report');
            setButtonName('Export Expired Records');
        } else if (ActiveTab === 'underWarrantyTab') {
            setModuleName('OEM Warranty Report');
            setButtonName('Export Under Warranty Records');
        }
    };

    const handleExport = async () => {
        try {
            setLoader(true);

            const response = await GetOEMInstallationReportList({
                pageNo: 0,
                pageSize: 40, // large number to get all data
                sortingDirection: null,
                sortingColumnName: null,
                searchKeyword: searchKeyword || null,
                fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
                userKeyID: user.userKeyID,
                tabName:
                    ActiveTab === 'UpcomingOEMTab'
                        ? 'Upcoming'
                        : ActiveTab === 'ExpiredOEMTab'
                            ? 'Expired'
                            : ActiveTab === 'underWarrantyTab'
                                ? 'Under Warranty'
                                : null,
            });

            setLoader(false);

            if (response?.data?.statusCode === 200 && response?.data?.responseData?.data) {
                const data = response.data.responseData.data;

                if (!data || data.length === 0) {
                    toast.warning('No data available for export.');
                    return;
                }

                // 🧩 Filter and rename keys
                const filteredData = data.map((item, index) => ({
                    'Sr No': index + 1,
                    'Installation Date': item.installationDate || '',
                    'Installed By': item.installationByName || '',
                    'OEM Name': item.oemName || '',
                    'Product Name': item.productName || '',
                    'Model Name': item.modelName || '',
                    'Variant Name': item.variantName || '',
                    'Manufacturer': item.manufacturerName || '',
                    'Warranty (Months)': item.warrantyInMonth || '',
                    'Expiry Date': item.expiryDate || '',
                    'Created On': item.createdOnDate || '',
                }));

                // 🧾 Convert JSON → Excel
                const worksheet = XLSX.utils.json_to_sheet(filteredData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'OEM Installation Report');
                XLSX.writeFile(
                    workbook,
                    `OEM_Report_${dayjs().format('YYYY-MM-DD_HH-mm')}.xlsx`
                );

                toast.success('Export successful!');
            } else {
                toast.error('Export failed or no data found.');
            }
        } catch (error) {
            console.error(error);
            setLoader(false);
            toast.error('Something went wrong during export.');
        }
    };




    return (
        <div className="card w-full max-w-[50vh] md:max-w-[90vw] mx-auto h-auto">
            <div className="card-body p-2 bg-white shadow-md rounded-lg">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                    <h5 className="text-lg md:text-xl">{moduleName}</h5>
                </div>

                <div className="d-flex flex-wrap align-items-end justify-content-between gap-2 mb-3">
                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            // flexWrap: 'wrap',

                        }}
                    >
                        <DatePicker
                            className="date-picker-input text-nowrap  "
                            label="From Date"
                            value={fromDate ? fromDate.toDate() : null}
                            onChange={handleFromDateChange}
                            clearIcon={null}
                            maxDate={toDate ? dayjs(toDate).toDate() : null}
                        />
                        {/* DatePicker - To */}
                        <DatePicker
                            minDate={fromDate ? dayjs(fromDate).toDate() : null}
                            className="date-picker-input text-nowrap"
                            label="To Date"
                            value={toDate ? toDate.toDate() : null}
                            onChange={handleToDateChange}
                            clearIcon={null}
                        />
                        <button style={{ background: '#ffaa33', color: 'white' }}
                            className="btn btn-sm" onClick={handleClearDates}>
                            Clear
                        </button>
                    </div>

                    <Tooltip title="Export">
                        <button
                            style={{ background: '#ffaa33', color: 'white' }}
                            className="btn btn-sm"
                            onClick={handleExport}
                        >
                            <i className="fa-solid fa-download me-1" style={{ fontSize: '11px' }}></i>
                            <span className="d-none d-sm-inline">{buttonName}</span>
                        </button>
                    </Tooltip>
                </div>
                <Row>
                    <Col>
                        <Tabs activeKey={ActiveTab} id="justify-tab-example" className="whitespace-nowrap" onSelect={handleTabSelect}>
                            {/* csv export tab */}

                            <Tab
                                eventKey="underWarrantyTab"
                                title={
                                    <Tooltip title="Under Warranty">
                                        <span className="text-sm md:text-base">Under Warranty</span>
                                    </Tooltip>
                                }
                                tabClassName="tab-completed"
                            >

                                <div className="container d-flex justify-content-center align-items-center vh-80">
                                    <div style={{ width: '100%' }}>
                                        <div className="d-flex flex-column mb-2 w-100">
                                            <div
                                                className="d-flex mb-2 align-items-center justify-content-between flex-column flex-md-row w-100"
                                                style={{ gap: '10px' }}
                                            >
                                                <div className="w-100" style={{ maxWidth: '400px' }}>
                                                    <input
                                                        type="text"
                                                        style={{ maxWidth: '400px' }}
                                                        value={searchKeyword}
                                                        onChange={handleSearch}
                                                        className="form-control mt-1 w-100"
                                                        placeholder="Search.."
                                                    />
                                                </div>

                                            </div>

                                            <div
                                                className="d-flex flex-column flex-md-row justify-content-between align-items-start w-100"
                                                style={{ gap: '10px' }}
                                            >


                                            </div>
                                        </div>

                                        <div className="tab-content-scroll-New-Device">
                                            <Table striped bordered hover>
                                                <thead className="table-light  ">
                                                    <tr
                                                        style={{
                                                            position: 'sticky',
                                                            top: -1,
                                                            backgroundColor: '#fff',
                                                            zIndex: 10,
                                                            boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
                                                        }}
                                                        className="text-nowrap"
                                                    >

                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Sr No.
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Installation Date
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Installation By
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Customer/Firm  info
                                                        </th>

                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Product Info
                                                        </th>

                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Expiry Date
                                                        </th>




                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {leadListData.map((item, idx) => (
                                                        <tr key={item.idx} className='text-nowrap'>
                                                            <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                                                {(currentPage - 1) * pageSize + idx + 1}
                                                            </td>
                                                            <td style={{ whiteSpace: 'nowrap' }}> {item.installationDate}</td>


                                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.installationByName}</td>
                                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                                {item?.customerFirmName}{" "}
                                                                <span style={{ fontSize: '12px', color: '#555' }}>
                                                                    ({item?.custMobileNumber})
                                                                </span>
                                                            </td>

                                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                                <a
                                                                    href="#"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        toggleRow(idx);
                                                                    }}
                                                                >
                                                                    {item.productName}
                                                                </a>
                                                                {expandedRow === idx && (
                                                                    <div style={{ marginTop: '8px' }}>
                                                                        <div><strong>Model:</strong> {item.modelName}</div>
                                                                        <div><strong>Variant:</strong> {item.variantName}</div>
                                                                        <div><strong>Manufacturer:</strong> {item.manufacturerName}</div>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.expiryDate}</td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>

                                            {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                                        </div>
                                        {totalCount > pageSize && (

                                            <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handleUnderWarrantyProductPageChange} />

                                        )}
                                    </div>


                                </div>




                            </Tab>
                            <Tab
                                eventKey="UpcomingOEMTab"
                                title={
                                    <Tooltip title="Upcoming OEM">
                                        <span className="text-sm md:text-base">Upcoming</span>
                                    </Tooltip>
                                }
                                tabClassName="tab-upcoming"
                            >
                                <div className="container d-flex justify-content-center align-items-center vh-80">
                                    <div className="p-1 col-12 col-md-8" style={{ width: '100%' }}>
                                        <div className="d-flex align-items-center justify-content-between flex-column flex-md-row" style={{ gap: '10px' }}>
                                            <input
                                                type="text"
                                                style={{ maxWidth: '300px', flex: 1 }}
                                                value={searchKeyword}
                                                onChange={(e) => {
                                                    handleSearch(e);
                                                }}
                                                className="form-control "
                                                placeholder="Search.."
                                            />

                                        </div>

                                        <div className="tab-content-scroll-New-Device">
                                            <Table striped bordered hover>
                                                <thead className="table-light  ">
                                                    <tr
                                                        style={{
                                                            position: 'sticky',
                                                            top: -1,
                                                            backgroundColor: '#fff',
                                                            zIndex: 10,
                                                            boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
                                                        }}
                                                        className="text-nowrap"
                                                    >

                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Sr No.
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Installation Date
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Installation By
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Customer/Firm Info
                                                        </th>

                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Product Info
                                                        </th>

                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Expiry Date
                                                        </th>




                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {leadListData.map((item, idx) => (
                                                        <tr key={item.idx} className='text-nowrap'>
                                                            <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                                                {(currentPage - 1) * pageSize + idx + 1}
                                                            </td>
                                                            <td style={{ whiteSpace: 'nowrap' }}> {item.installationDate || "dsa"}</td>


                                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.installationByName || "dsa"}</td>
                                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                                {item?.customerFirmName}{" "}
                                                                <span style={{ fontSize: '12px', color: '#555' }}>
                                                                    ({item?.custMobileNumber})
                                                                </span>
                                                            </td>
                                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                                <a
                                                                    href="#"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        toggleRow(idx);
                                                                    }}
                                                                >
                                                                    {item.productName}
                                                                </a>
                                                                {expandedRow === idx && (
                                                                    <div style={{ marginTop: '8px' }}>
                                                                        <div><strong>Model:</strong> {item.modelName}</div>
                                                                        <div><strong>Variant:</strong> {item.variantName}</div>
                                                                        <div><strong>Manufacturer:</strong> {item.manufacturerName}</div>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.expiryDate || "dsa"}</td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                            {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                                        </div>
                                        <div className="d-flex justify-content-end align-bottom mt-3">
                                            {totalCount > pageSize && (

                                                <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handleUpcomingRecordsPageChange} />

                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Tab>

                            {/* 2nd table , where select , search , checkbox, submit */}
                            <Tab
                                eventKey="ExpiredOEMTab"
                                title={
                                    <Tooltip title="Expired OEM">
                                        <span className="text-sm md:text-base">Expired</span>
                                    </Tooltip>
                                }
                                tabClassName="tab-completed"
                            >

                                <div className="container d-flex justify-content-center align-items-center vh-80">
                                    <div style={{ width: '100%' }}>
                                        <div className="d-flex flex-column mb-2 w-100">
                                            <div
                                                className="d-flex mb-2 align-items-center justify-content-between flex-column flex-md-row w-100"
                                                style={{ gap: '10px' }}
                                            >
                                                <div className="w-100" style={{ maxWidth: '400px' }}>
                                                    <input
                                                        type="text"
                                                        style={{ maxWidth: '400px' }}
                                                        value={searchKeyword}
                                                        onChange={handleSearch}
                                                        className="form-control mt-1 w-100"
                                                        placeholder="Search.."
                                                    />
                                                </div>

                                            </div>

                                            <div
                                                className="d-flex flex-column flex-md-row justify-content-between align-items-start w-100"
                                                style={{ gap: '10px' }}
                                            >


                                            </div>
                                        </div>

                                        <div className="tab-content-scroll-New-Device">
                                            <Table striped bordered hover>
                                                <thead className="table-light  ">
                                                    <tr
                                                        style={{
                                                            position: 'sticky',
                                                            top: -1,
                                                            backgroundColor: '#fff',
                                                            zIndex: 10,
                                                            boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
                                                        }}
                                                        className="text-nowrap"
                                                    >

                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Sr No.
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Installation Date
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Installation By
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Customer/Firm  info
                                                        </th>

                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Product Info
                                                        </th>

                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Expiry Date
                                                        </th>




                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {leadListData.map((item, idx) => (
                                                        <tr key={item.idx} className='text-nowrap'>
                                                            <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                                                {(currentPage - 1) * pageSize + idx + 1}
                                                            </td>
                                                            <td style={{ whiteSpace: 'nowrap' }}> {item.installationDate}</td>


                                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.installationByName}</td>
                                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                                {item?.customerFirmName}{" "}
                                                                <span style={{ fontSize: '12px', color: '#555' }}>
                                                                    ({item?.custMobileNumber})
                                                                </span>
                                                            </td>

                                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                                <a
                                                                    href="#"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        toggleRow(idx);
                                                                    }}
                                                                >
                                                                    {item.productName}
                                                                </a>
                                                                {expandedRow === idx && (
                                                                    <div style={{ marginTop: '8px' }}>
                                                                        <div><strong>Model:</strong> {item.modelName}</div>
                                                                        <div><strong>Variant:</strong> {item.variantName}</div>
                                                                        <div><strong>Manufacturer:</strong> {item.manufacturerName}</div>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.expiryDate}</td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>

                                            {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                                        </div>
                                        {totalCount > pageSize && (

                                            <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handleExpiredRecordsPageChange} />

                                        )}
                                    </div>


                                </div>




                            </Tab>




                        </Tabs>
                    </Col>
                </Row>
            </div>
            <SuccessPopupModal
                show={showSuccessModal}
                onHide={() => closeAllModal()}

                modelAction={modelAction}
                confirmImportedMsg={confirmImportedMsg}
                responseData={importResponseData} // ✅ send it here
            />
            {showPoUploadModal &&
                <PurchaseOrderPdfUploadModal
                    show={showPoUploadModal}
                    onHide={() => closeAllModal()}
                    setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                    modelRequestData={modelRequestData}
                />

            }







        </div>
    );
};

export default OEMWarrantyList;
