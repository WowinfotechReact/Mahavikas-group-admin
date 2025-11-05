






import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router';
import PaginationComponent from 'component/Pagination';
import { ConfigContext } from 'context/ConfigContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Icons for eye and eye-slash
import * as XLSX from 'xlsx';
import { ChangeVehicleStatus, GetVehicleList } from 'services/Vehicle/VehicleApi';
import NoResultFoundModel from 'component/NoResultFoundModal';
import ImageModal from 'component/ImageModal';
import Android12Switch from 'component/Android12Switch';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { Tooltip } from '@mui/material';
import { ChangeEmployeeStatus, GetEmployeeList } from 'services/Employee Staff/EmployeeApi';
import { GetPOList } from 'services/Purchase Order/PurchaseOrderApi';
import PurchaseOrderPdfUploadModal from 'views/Purchased Order/PurchaseOrderPdfUploadModal';
import { hasPermission } from 'Middleware/permissionUtils';
import { GetOEMInstallationList } from 'services/Original Equipment Manufacturer/OriginalEquipmentManufacturerApi';

const OEMInstallationList = () => {
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
            GetOEMInstallationListData(1, null, toDate, fromDate);
            setSearchKeyword('');
        }
        setIsAddUpdateActionDone(false);
    }, [isAddUpdateActionDone]);

    useEffect(() => {
        GetOEMInstallationListData(1, null, toDate, fromDate);
    }, [setIsAddUpdateActionDone]);
    useEffect(() => {
        GetOEMInstallationListData(1, null, toDate, fromDate);
    }, []);

    const GetOEMInstallationListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
        // debugger
        setLoader(true);
        try {
            const data = await GetOEMInstallationList({
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



    const VehicleAddBtnClicked = (item) => {
        debugger
        // {
        //     setModelRequestData({
        //         ...modelRequestData,
        //         leadName: item.leadName,
        //         requirement: item.requirement,
        //         quotationFormatID: item.quotationFormatID

        //     });
        // }
        // let adminProfile = {

        //     leadName: item.leadName,
        //     requirement: item.requirement,
        //     address: item.address,
        //     leadKeyID: item.leadKeyID,
        //     quotationFormatID: item.quotationFormatID,
        //     oemInstallationKeyID: item.oemInstallationKeyID
        // };

        // navigate('/original-equipment-manufacturer-product-add-update', { state: adminProfile });
        navigate('/original-equipment-manufacturer-product-add-update');
    };

    const uploadInvoiceProduct = (value) => {


        setModelRequestData((prev) => ({
            ...prev,
            oemInstallationKeyID: value.oemInstallationKeyID
        }));

        navigate('/original-equipment-manufacturer-product-add-update', {
            state: {
                oemInstallationKeyID: value.oemInstallationKeyID
            }
        });
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
        GetOEMInstallationListData(1, capitalizedValue, toDate, fromDate);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        GetOEMInstallationListData(pageNumber, null, toDate, fromDate);
    };

    const closeAll = () => {
        setShowSuccessModal(false);
    };

    const handleClearDates = () => {
        setCurrentPage(1);
        setToDate(null);
        setFromDate(null);
        GetOEMInstallationListData(1, null, null, null);
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
                GetOEMInstallationListData(currentPage, null, toDate, fromDate);
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





    return (
        <>
            <div className="card w-full max-w-[50vh] mx-auto h-auto">
                <div className="card-body p-2 bg-white shadow-md rounded-lg">
                    {/* Top controls */}
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="flex-grow-1 ">
                            <h5 className="mb-0">OEM Installation</h5>
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
                            placeholder="Search OEM Installation"
                            style={{ maxWidth: '350px' }}
                            value={searchKeyword}
                            onChange={(e) => {
                                handleSearch(e);
                            }}
                        />
                        <div className="d-flex align-items-center ms-2 gap-2 mt-2 mt-sm-0">
                            <Tooltip title="Add OEM">
                                <button onClick={() => VehicleAddBtnClicked()} style={{ background: '#ffaa33', color: 'white' }} className="btn  btn-sm d-none d-sm-inline ">
                                    <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>{" "}
                                    <span className="d-none d-sm-inline">Add</span>
                                </button>
                            </Tooltip>

                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
                        <table className="table table-bordered table-striped table-hover">
                            <thead style={{ position: 'sticky', top: -1, zIndex: 1, backgroundColor: '#4CAF50', color: '#fff' }}>
                                <tr className="text-nowrap">
                                    <th className="text-center">Sr.No.</th>

                                    <th className="text-center">Installed By Name</th>
                                    <th className="text-center">OEM Customer Name</th>
                                    <th className="text-center">Installation Date
                                    </th>

                                    {/* <th className="text-center">Status</th> */}
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicleListData?.map((value, idx) => (
                                    <tr className="tableBodyTd text-nowrap" key={idx}>
                                        <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>

                                        <td className="text-center">
                                            {value.installationByName?.length > 30 ? (
                                                <Tooltip title={value.installationByName}>{`${value.installationByName?.substring(0, 30)}...`}</Tooltip>
                                            ) : (
                                                <>{value.installationByName}</>
                                            )}
                                        </td>
                                        <td className="text-center">{value.oemName}</td>
                                        <td className="text-center">{value.installationDate}</td>






                                        {/* <td className="text-center">
                                            <Tooltip title={value.status === true ? 'Active' : 'Deactive'}>
                                                {value.status === true ? 'Active' : 'Active'}
                                                <Android12Switch style={{ padding: '8px' }}
                                                    onClick={() => handleStatusChange(value)}
                                                    checked={value.status === true} />
                                            </Tooltip>
                                        </td> */}

                                        <td className="text-center ">
                                            {/* <Tooltip title="Update State">
                                                <button
                                                    style={{
                                                        padding: '4px 8px', // Adjust padding for smaller size
                                                        fontSize: '12px', // Optional: smaller font size
                                                        height: '28px', // Set height
                                                        width: '28px', // Set width,
                                                        background: '#ffaa33', color: 'white'
                                                    }}
                                                    onClick={() => uploadPurchaseOrder(value)}
                                                    type="button"

                                                    className="btn-sm btn me-2"
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                            </Tooltip> */}
                                            {/* {hasPermission(permissions, 'Invoice', 'Can Insert') && ( */}
                                            <Tooltip title="Update OEM  ">
                                                <button
                                                    style={{
                                                        padding: '4px 8px', // Adjust padding for smaller size
                                                        fontSize: '12px', // Optional: smaller font size
                                                        height: '28px', // Set height
                                                        width: '28px', // Set width,
                                                        background: '#ffaa33', color: 'white'
                                                    }}
                                                    onClick={() => uploadInvoiceProduct(value)}
                                                    type="button"

                                                    className="btn-sm btn ms-2"
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i>


                                                </button>
                                            </Tooltip>

                                            {/* )} */}



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

export default OEMInstallationList;
