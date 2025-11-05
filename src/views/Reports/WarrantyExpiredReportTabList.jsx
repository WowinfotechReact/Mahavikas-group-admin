


import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Tabs, Tab, Button } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import Select from 'react-select';
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
import { GetWarrantyExpiredReportList } from 'services/AMCApi/AMCApi';
import AddUpdateAMCModal from 'views/Annual-Maintenance-Contract/AddUpdateAMCModal';


const WarrantyExpiredReportTabList = () => {
    const [moduleName, setModuleName] = useState('');
    const [showCustomerViewModel, setShowCustomerViewModel] = useState(false);
    const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
    const [showNewDeviceAddUpdateModal, setShowNewDeviceAddUpdateModal] = useState(false);
    const [newDeviceImportListMap, setNewDeviceImportListData] = useState();
    const [error, setErrors] = useState(null);
    const [errorMessage, setErrorMessage] = useState();
    const [confirmImportedMsg, setConfirmImportedMsg] = useState('')
    const [importResponseData, setImportResponseData] = useState(null);

    const [ActiveTab, setActiveTab] = useState('UpcomingTab');
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





    const [searchKeyword, setSearchKeyword] = useState('');
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
            if (ActiveTab === 'UpcomingTab') {

                GetWarrantyExpiredReportListData(1, null, null, null, null, null, 'Upcoming')
            } else if (ActiveTab === 'ExpiredTab') {
                // GetDeviceTransferListData(1, null, null, null);
                GetWarrantyExpiredReportListData(1, null, null, null, null, null, 'Expired')
            }
            setSearchKeyword('')
            // Reset the flag after actions are done
            setIsAddUpdateActionDone(false);
        }
    }, [isAddUpdateActionDone]);

    useEffect(() => {
        ModuleNameFunc();
    }, [ActiveTab]);
































    const handleTransferDevicePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        GetWarrantyExpiredReportListData(pageNumber, null, null, null, null, null, 'Upcoming')

    };

    const handlePageExpiredChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        GetWarrantyExpiredReportListData(pageNumber, null, null, null, null, null, 'Expired')
        // GetAcceptDeviceListListData(pageNumber, null, toDate, fromDate, acceptRejectDeviceObj.employeeKeyID);
    };








    const handleTabSelect = (key) => {
        setConfirmImportedMsg(false)
        setErrors(false);
        setErrorMessage(false);
        setSearchKeyword('');
        setCurrentPage(1);
        setTotalCount(0);

        if (key === 'UpcomingTab') {
            setActiveTab('UpcomingTab');
            //   GetNewDeviceImportListData(1, null, null, null);

            GetWarrantyExpiredReportListData(1, null, null, null, null, null, 'Upcoming')

        } else if (key === 'ExpiredTab') {
            setActiveTab('ExpiredTab');
            GetWarrantyExpiredReportListData(1, null, null, null, null, null, 'Expired')



        }
    };
    useEffect(() => {
        GetWarrantyExpiredReportListData(1, null, null, null, null, null, 'Upcoming')
    }, [])

    const GetWarrantyExpiredReportListData = async (pageNumber, searchKeywordValue, toDate, fromDate, sortingType, sortValueName, tabName) => {
        setLoader(true);
        // debugger;
        try {
            const response = await GetWarrantyExpiredReportList({
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
        if (ActiveTab === 'UpcomingTab') {
        } else if (ActiveTab === 'UpcomingTab') {
            GetWarrantyExpiredReportListData(1, capitalizedValue, null, null, null, null, 'Upcoming')
        } else if (ActiveTab === 'ExpiredTab') {
            GetWarrantyExpiredReportListData(1, capitalizedValue, null, null, null, null, 'Expired')

        }

    };





    const ModuleNameFunc = () => {
        if (ActiveTab === 'UpcomingTab') {
            setModuleName('Warranty Expired Report');
        } else if (ActiveTab === 'ExpiredTab') {
            setModuleName('Warranty Expired Report');
        }
    };

    const handleStatusChange = (item) => {
        setStateChangeStatus(item); // You can set only relevant data if needed
        setShowStatusChangeModal(true);
    };


    const navigate = useNavigate()
    const previewQuotationBtnClick = (item) => {

        setShowPoUploadModal(true)
        {
            setModelRequestData({
                ...modelRequestData,
                quotationID: item.quotationID,
                productID: item.productID,
                amcKeyID: item.amcKeyID,
                quotProductMapID: item.quotProductMapID,
                leadID: item.leadID,

                Action: null
            });
        }


        // navigate('/quotation-preview', {
        //     state: {
        //         quotationKeyID: item.quotationKeyID,
        //         action: 'FromPendingForApproval'
        //     }
        // });
    };


    const revisionBtnQuotation = (item) => {
        {
            setModelRequestData({
                ...modelRequestData,
                leadName: item.leadName,
                requirement: item.requirement,
                Action: 'revisionBtnQuote'
            });
        }


        navigate('/add-update-quotation', {
            state: {
                quotationKeyID: item.quotationKeyID,
                action: 'revisionBtnQuote'
            }
        });
    }
    const uploadPurchaseOrder = (item) => {

        setModelRequestData({
            ...modelRequestData,
            leadKeyID: item.leadKeyID
        })

        setShowPoUploadModal(true)
    }

    return (
        <div className="card w-full max-w-[50vh] md:max-w-[90vw] mx-auto h-auto">
            <div className="card-body p-2 bg-white shadow-md rounded-lg">
                <div className="d-flex justify-content-between items-center flex-wrap gap-2">
                    <h5 className="text-lg md:text-xl">{moduleName}</h5>
                </div>
                <Row>
                    <Col>
                        <Tabs activeKey={ActiveTab} id="justify-tab-example" className="whitespace-nowrap" onSelect={handleTabSelect}>
                            {/* csv export tab */}
                            <Tab
                                eventKey="UpcomingTab"
                                title={
                                    <Tooltip title="Upcoming">
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

                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Sr No.
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Customer/Firm
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Customer Contact No.
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Product Name
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Model Name
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Variant Name
                                                        </th>

                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Manufacturer Name
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Warranty In Month
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Dispatched Date
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Expiry Date
                                                        </th>

                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Quotation Number
                                                        </th>



                                                        <th className="text-center actionSticky" style={{ whiteSpace: 'nowrap' }}>
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {leadListData.map((item, idx) => (
                                                        <tr key={item.idx} className='text-nowrap text-center'>
                                                            <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                                                {(currentPage - 1) * pageSize + idx + 1}
                                                            </td>
                                                            <td style={{ whiteSpace: 'nowrap' }}> {item.customerFirmName}</td>
                                                            <td style={{ whiteSpace: 'nowrap' }}> {item.custMobileNumber}</td>
                                                            <td style={{ whiteSpace: 'nowrap' }}> {item.productName}</td>
                                                            <td style={{ whiteSpace: 'nowrap' }}> {item.modelName}</td>
                                                            <td style={{ whiteSpace: 'nowrap' }}> {item.variantName}</td>
                                                            <td style={{ whiteSpace: 'nowrap' }}> {item.manufacturerName}</td>
                                                            <td style={{ whiteSpace: 'nowrap' }}> {item.warrantyInMonth}</td>
                                                            <td style={{ whiteSpace: 'nowrap' }}> {item.dispatchedDate}</td>
                                                            <td style={{ whiteSpace: 'nowrap' }}> {item.expiryDate}</td>



                                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.quotationNumber}</td>
                                                            {/* <td style={{ whiteSpace: 'nowrap' }}>{item?.leadTypeName}</td> */}


                                                            {/* {/*actionColSticky for Action fixed/*} */}
                                                            <td className="text-center actionColSticky " style={{ zIndex: 4 }}>

                                                                <div className="d-flex gap-2">

                                                                    <Tooltip title="Add AMC Quotation">
                                                                        <button
                                                                            style={{
                                                                                fontSize: '12px'
                                                                                , background: '#ffaa33',
                                                                                marginRight: '5px',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center'
                                                                            }}
                                                                            className="btn-sm d-flex btn text-white  text-nowrap"

                                                                            onClick={() => previewQuotationBtnClick(item)}
                                                                        >
                                                                            Add AMC  Quot.. {' '}
                                                                            {/* <i className="fa-solid fa-eye"></i>  */}
                                                                        </button>
                                                                    </Tooltip>

                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                            {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                                        </div>
                                        <div className="d-flex justify-content-end align-bottom mt-3">
                                            {totalCount > pageSize && (
                                                <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageExpiredChange} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Tab>

                            {/* 2nd table , where select , search , checkbox, submit */}
                            <Tab
                                eventKey="ExpiredTab"
                                title={
                                    <Tooltip title="Expired">
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

                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Sr No.
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Customer/Firm
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Customer Contact No.
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Product Name
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Model Name
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Variant Name
                                                        </th>

                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Manufacturer Name
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Warranty In Month
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Dispatched Date
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Expiry Date
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Warranty In Month
                                                        </th>
                                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            Quotation Number
                                                        </th>



                                                        <th className="text-center " style={{ whiteSpace: 'nowrap' }}>
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {leadListData.map((item, idx) => (
                                                        <tr key={item.idx} className='text-nowrap text-center'>
                                                            <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                                                {(currentPage - 1) * pageSize + idx + 1}
                                                            </td>
                                                            <td style={{ whiteSpace: 'nowrap' }}> {item.customerFirmName}</td>
                                                            <td style={{ whiteSpace: 'nowrap' }}> {item.custMobileNumber}</td>
                                                            <td style={{ whiteSpace: 'nowrap' }}> {item.productName}</td>
                                                            <td style={{ whiteSpace: 'nowrap' }}> {item.modelName}</td>
                                                            <td style={{ whiteSpace: 'nowrap' }}> {item.variantName}</td>
                                                            <td style={{ whiteSpace: 'nowrap' }}> {item.manufacturerName}</td>
                                                            <td style={{ whiteSpace: 'nowrap' }}> {item.warrantyInMonth}</td>
                                                            <td style={{ whiteSpace: 'nowrap' }}> {item.dispatchedDate}</td>
                                                            <td style={{ whiteSpace: 'nowrap' }}> {item.expiryDate}</td>

                                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                                {item.requirement?.length > 25 ? (
                                                                    <Tooltip title={item.requirement} arrow>
                                                                        <span className="cursor-pointer">{item.requirement.substring(0, 25)}...</span>
                                                                    </Tooltip>
                                                                ) : (
                                                                    item.requirement
                                                                )}
                                                            </td>
                                                            {/* <td style={{ whiteSpace: 'nowrap' }}>{item?.quotationType}</td> */}

                                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.quotationNumber}</td>
                                                            {/* <td style={{ whiteSpace: 'nowrap' }}>{item?.leadTypeName}</td> */}


                                                            {/* {/*actionColSticky for Action fixed/*} */}
                                                            <td
                                                                className="text-center   
                     "
                                                                style={{ zIndex: 4 }}
                                                            >
                                                                <div className="d-flex gap-2">

                                                                    <Tooltip title="Add AMC Quotation">
                                                                        <button
                                                                            style={{
                                                                                fontSize: '12px'
                                                                                , background: '#ffaa33',
                                                                                marginRight: '5px',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center'
                                                                            }}
                                                                            className="btn-sm d-flex btn text-white  text-nowrap"

                                                                            onClick={() => previewQuotationBtnClick(item)}
                                                                        >
                                                                            Add AMC  Quote.. {' '}
                                                                            {/* <i className="fa-solid fa-eye"></i>  */}
                                                                        </button>
                                                                    </Tooltip>

                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                            {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                                        </div>
                                        {totalCount > pageSize && (
                                            <PaginationComponent
                                                totalPages={totalPage}
                                                currentPage={currentPage}
                                                onPageChange={handleTransferDevicePageChange}
                                            />
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
                <AddUpdateAMCModal
                    show={showPoUploadModal}
                    onHide={() => closeAllModal()}
                    setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                    modelRequestData={modelRequestData}
                />

            }







        </div>
    );
};

export default WarrantyExpiredReportTabList;
