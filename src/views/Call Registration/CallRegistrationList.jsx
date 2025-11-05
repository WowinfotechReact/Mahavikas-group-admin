

import React, { useState, useEffect, useContext } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { ConfigContext } from 'context/ConfigContext';
import dayjs from 'dayjs';
import './bubble.css'
import { Button, Table } from 'react-bootstrap'

import { ChangeTalukaStatus, } from 'services/Master Crud/MasterTalukaApi';
import PaginationComponent from 'component/Pagination';
import SuccessPopupModal from 'component/SuccessPopupModal';
import StatusChangeModal from 'component/StatusChangeModal ';
import Android12Switch from 'component/Android12Switch';
import NoResultFoundModel from 'component/NoResultFoundModal';
import { Tooltip } from '@mui/material';
import CallRegistrationAddUpdateModal from './CallRegistrationAddUpdateModal';
import { GetServiceCallList } from 'services/Call Registration/CallRegistrationApi';
import EmployeeAssignModal from './EmployeeAssignModal';
import { hasPermission } from 'Middleware/permissionUtils';
import { useNavigate } from 'react-router';

const CallRegistrationList = () => {
    const [talukaChangeStatus, setTalukaChangeStatus] = useState('');
    const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
    const [totalRecords, setTotalRecords] = useState(-1);
    const { setLoader, user, permissions } = useContext(ConfigContext);
    const [modelAction, setModelAction] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState();
    const [totalCount, setTotalCount] = useState(null);
    const [selectedCallIds, setSelectedCallIds] = useState([]);
    const [bubblePos, setBubblePos] = useState({ x: 0, y: 0 });

    const [pageSize, setPageSize] = useState(30);
    const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [fromDate, setFromDate] = useState(null); // Initialize as null
    const [toDate, setToDate] = useState(null);
    const [showBubble, setShowBubble] = useState(false);

    const [callRegListData, setTalukaListdata] = useState([]);
    const [openMasterTalukaModal, setOpenMasterTalukaModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState();
    const [showEmployeeAssignModal, setShowEmployeeAssignModal] = useState();
    const [modelRequestData, setModelRequestData] = useState({
        stateID: null,
        stateName: null,
        Action: null,
        talukaID: null
    });


    useEffect(() => {
        // debugger
        if (isAddUpdateActionDone) {
            setSearchKeyword('')
            setCurrentPage(1)
            GetServiceCallListData(1, null, toDate, fromDate);
        }
        setIsAddUpdateActionDone(false);
    }, [isAddUpdateActionDone]);

    useEffect(() => {
        GetServiceCallListData(1, null, toDate, fromDate);
    }, [setIsAddUpdateActionDone]);



    const GetServiceCallListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
        setLoader(true);
        try {
            const data = await GetServiceCallList({
                pageSize,
                pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
                searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
                toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
                fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                sortingDirection: null,
                userKeyID: user.userKeyID,
                sortingColumnName: null
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
                        setTalukaListdata(MasterStateListData);
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



    const handleSearch = (e) => {
        let searchKeywordValue = e.target.value;
        const trimmedValue = searchKeywordValue.replace(/^\s+/g, '');
        const capitalizedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1).toLowerCase();
        if (searchKeywordValue.length === 1 && searchKeywordValue.startsWith(' ')) {
            searchKeywordValue = searchKeywordValue.trimStart();
            return;
        }
        setSearchKeyword(capitalizedValue);
        GetServiceCallListData(1, capitalizedValue, toDate, fromDate);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        GetServiceCallListData(pageNumber, null, toDate, fromDate);
    };



    const addCallRegistrationBtnClick = () => {
        setModelRequestData({
            ...modelRequestData,
            Action: null,
        });
        setOpenMasterTalukaModal(true);
    };
    const EditMasterTalukaBtnClick = (row) => {
        setModelRequestData({
            ...modelRequestData,
            Action: 'Update',
            serviceCallKeyID: row.serviceCallKeyID
        });
        setOpenMasterTalukaModal(true);
    };
    const navigate = useNavigate()



    const callDetailsBtn = (row) => {
        setModelRequestData({
            ...modelRequestData,
            serviceCallKeyID: null,
            zoneKeyID: null,
            zoneName: null
        });
        const mappingCall = {
            serviceCallKeyID: row.serviceCallKeyID,
            serviceCallID: row.serviceCallID

        };

        navigate('/call-details-journey', { state: mappingCall });
    };
    const assignEmployeeBtnClick = (idsArray) => {
        setShowBubble(false)
        setModelRequestData({
            ...modelRequestData,
            Action: 'Update',
            serviceCallIDs: idsArray,
        });
        setShowEmployeeAssignModal(true);
    };
    const AssignBtn = (row) => {
        setShowBubble(false)
        setModelRequestData({
            ...modelRequestData,
            Action: 'Update',
            serviceCallIDs: [row.serviceCallID],
        });
        setShowEmployeeAssignModal(true);
    };

    const closeAllModal = () => {
        setShowSuccessModal(false);
        setShowEmployeeAssignModal(false)
    };

    const confirmStatusChange = async (row, user) => {
        setLoader(true);
        // debugger
        try {
            const { talukaID } = row; // Destructure to access only what's needed
            const response = await ChangeTalukaStatus(talukaID, user.userKeyID);

            if (response && response.data.statusCode === 200) {
                setLoader(false);
                // Successfully changed the status
                setShowStatusChangeModal(false);
                setTalukaChangeStatus(null);
                GetServiceCallListData(currentPage, null, toDate, fromDate);
                setShowSuccessModal(true);
                setModelAction('Call Registration status changed successfully.');
            } else {
                console.error(response?.data?.errorMessage);
                setShowSuccessModal(true);
                setLoader(false);
                setModelAction('Failed to change employee status.');
            }
        } catch (error) {
            setLoader(false);
            console.error('Error changing employee status:', error);
            setShowSuccessModal(true);
            setModelAction('An error occurred while changing the employee status.');
        }
    };

    const isAllSelected = callRegListData?.length > 0 && selectedCallIds.length === callRegListData.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedCallIds([]);
        } else {
            const allIds = callRegListData.map((row) => row.serviceCallID);
            setSelectedCallIds(allIds);
        }
    };

    const handleSelectRow = (id, e) => {
        let updated;
        if (selectedCallIds.includes(id)) {
            updated = selectedCallIds.filter((sid) => sid !== id);
        } else {
            updated = [...selectedCallIds, id];
        }
        setSelectedCallIds(updated);

        // Capture mouse position where click happened
        const rect = e.target.getBoundingClientRect();
        setBubblePos({ x: rect.right + 10, y: rect.top });
        setShowBubble(updated.length > 0);
    };


    return (
        <>
            <div className="card w-full max-w-[50vh] mx-auto h-auto">
                <div className="card-body p-2 bg-white shadow-md rounded-lg">
                    {/* Top controls */}
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <h5 className="m-0">Call Registration</h5>
                        <button
                            onClick={() => addCallRegistrationBtnClick()}
                            className="btn btn-primary btn-sm d-inline d-sm-none"
                        >
                            <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
                            <span className="d-inline d-sm-none">  Add</span>
                        </button>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-1 flex-wrap gap-2">
                        <input
                            type="text"
                            className="form-control "
                            placeholder="Search Call Registration"
                            style={{ maxWidth: "350px" }}
                            value={searchKeyword}
                            onChange={(e) => {
                                handleSearch(e);
                            }}
                        />

                        <div className="d-flex gap-2">
                            <Tooltip title="Assign Employee">
                                <button
                                    onClick={() => assignEmployeeBtnClick(selectedCallIds)}
                                    style={{ background: '#ffaa33' }}
                                    type="button"
                                    className="btn-sm btn text-white"
                                    disabled={selectedCallIds.length === 0}
                                >
                                    <i className="fa-solid fa-person-harassing"></i>
                                    <span className="ms-1">Assign</span>
                                </button>
                            </Tooltip>
                            {hasPermission(permissions, 'Service Call', 'Can Insert') && (
                                <Tooltip title="Add Call Registration">
                                    <button
                                        style={{ background: '#ffaa33' }}
                                        onClick={() => addCallRegistrationBtnClick()}
                                        className="btn text-white btn-sm d-none d-sm-inline"
                                    >
                                        <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
                                        <span className="d-none d-sm-inline"> Add Call Registration</span>
                                    </button>
                                </Tooltip>
                            )}
                        </div>

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
                                    <th className="text-center">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="text-center">Sr No</th>
                                    <th className="text-center">Customer /Firm Name</th>
                                    <th className="text-center">Call Type </th>
                                    <th className="text-center">Point Of Contact</th>
                                    <th className="text-center">Charges ⟨₹⟩</th>
                                    <th className="text-center">Assigned Employee</th>
                                    <th className="text-center">Fault</th>
                                    <th className="text-center">
                                        Address</th>

                                    {/* <th className="text-center">Created On</th> */}
                                    <th className="text-center actionSticky" style={{ whiteSpace: 'nowrap' }}>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {callRegListData?.map((row, idx) => (
                                    <tr key={idx}>
                                        <td className="text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedCallIds.includes(row.serviceCallID)}
                                                onChange={(e) => handleSelectRow(row.serviceCallID, e)}
                                            />
                                        </td>
                                        <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                                        <td className="text-center">{row.customerFirmName}</td>
                                        <td className="text-center">{row.serviceTypeName}</td>
                                        <td className="text-center">{row.pointOfContact}</td>
                                        <td className="text-center">{row.charges}</td>
                                        <td className="text-center">
                                            {row.assignToEmployeeName && row.assignToEmployeeName.trim() !== "" ? (
                                                row.assignToEmployeeName
                                            ) : (
                                                <span
                                                    className="text-primary fw-bold"
                                                    style={{ cursor: "pointer", textDecoration: "underline" }}
                                                    onClick={() => AssignBtn(row)}
                                                >
                                                    Assign
                                                </span>
                                            )}
                                        </td>

                                        <td className="text-center">{row.fault}</td>


                                        <td className="text-center">
                                            {row.address?.length > 30 ? (
                                                <Tooltip title={row.address}>{`${row.address?.substring(0, 30)}...`}</Tooltip>
                                            ) : (
                                                <>{row.address}</>
                                            )}
                                        </td>

                                        {/* <td className="text-center">{row.status === true ? 'True' : 'false'}</td> */}
                                        {/* <td className="text-center">{row.createdOnDate ? dayjs(row.createdOnDate).format('DD/MM/YYYY') : '-'}</td> */}
                                        <td className="text-center actionColSticky" style={{ zIndex: 4 }}>
                                            <div className="d-flex gap-2">
                                                {/* Edit Button */}
                                                {hasPermission(permissions, 'Service Call', 'Can Update') && (
                                                    <Tooltip title="Update Call Registration">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm text-white"
                                                            style={{ background: '#ffaa33' }}
                                                            onClick={() => EditMasterTalukaBtnClick(row)}
                                                        >
                                                            <i className="fa-solid fa-pen-to-square"></i>
                                                        </button>
                                                    </Tooltip>
                                                )}

                                                {/* FSR PDF */}
                                                {row.fsRpdf && (
                                                    <Tooltip title="FSR PDF">
                                                        <a
                                                            href={row.fsRpdf}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-outline-danger"
                                                        >
                                                            <i className="fa-solid fa-file-pdf"></i>
                                                        </a>
                                                    </Tooltip>
                                                )}

                                                {/* BFR PDF */}
                                                {row.bfRpdf && (
                                                    <Tooltip title="BFR PDF">
                                                        <a
                                                            href={row.bfRpdf}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-outline-danger"
                                                        >
                                                            <i className="fa-solid fa-file-contract"></i>
                                                        </a>
                                                    </Tooltip>
                                                )}

                                                {(row.fsRpdf && row.bfRpdf) &&
                                                    <Tooltip title="Call Details">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm text-white text-nowrap"
                                                            style={{ background: '#ffaa33' }}
                                                            onClick={() => callDetailsBtn(row)}
                                                        >
                                                            Call Details
                                                        </button>
                                                    </Tooltip>
                                                }
                                            </div>
                                        </td>





                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {showBubble && (
                            <div
                                className="assign-bubble"
                                style={{ top: bubblePos.y, left: bubblePos.x }}
                            >
                                <Tooltip title="Assign Employee">
                                    <button
                                        onClick={() => assignEmployeeBtnClick(selectedCallIds)}
                                        className="battery-btn"
                                    >
                                        <i className="fa-solid fa-person-harassing"></i>
                                        <span className="ms-1">Assign</span>
                                    </button>
                                </Tooltip>
                            </div>
                        )}
                        {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                    </div>
                    <div className="d-flex justify-content-end ">
                        {totalCount > pageSize && (
                            <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
                        )}
                    </div>
                </div>

                {openMasterTalukaModal && (
                    <CallRegistrationAddUpdateModal
                        show={openMasterTalukaModal}
                        onHide={() => setOpenMasterTalukaModal(false)}
                        modelRequestData={modelRequestData}
                        setModelRequestData={setModelRequestData}
                        isAddUpdateActionDone={isAddUpdateActionDone}
                        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                    />
                )}

                <StatusChangeModal
                    open={showStatusChangeModal}
                    onClose={() => setShowStatusChangeModal(false)}
                    onConfirm={() => confirmStatusChange(talukaChangeStatus, user)} // Pass the required arguments
                />
                {showSuccessModal && (
                    <SuccessPopupModal
                        show={showSuccessModal}
                        onHide={() => closeAllModal()}
                        setShowSuccessModal={setShowSuccessModal}
                        modelAction={modelAction}
                    />
                )}
                {showEmployeeAssignModal && (
                    <EmployeeAssignModal
                        show={showEmployeeAssignModal}
                        onHide={() => closeAllModal()}
                        modelRequestData={modelRequestData}
                        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                        modelAction={modelAction}
                    />
                )}
            </div>
        </>
    );
};

export default CallRegistrationList;
