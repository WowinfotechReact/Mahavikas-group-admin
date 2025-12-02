

import React, { useState, useContext } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Android12Switch from 'component/Android12Switch';

import { useNavigate } from 'react-router';
import { ConfigContext } from 'context/ConfigContext';
import { ChangeStateStatus } from 'services/Master Crud/MasterStateApi';

import dayjs from 'dayjs';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import PaginationComponent from 'component/Pagination';
import { Tooltip } from '@mui/material';
import GrantPermissionModal from 'GrantPermissionModal';

const PermissionList = () => {
    const [stateChangeStatus, setStateChangeStatus] = useState('');

    const [modelRequestData, setModelRequestData] = useState({
        Action: null
    })
    //   const [totalRecords, setTotalRecords] = useState(-1);
    const { user } = useContext(ConfigContext);
    const [showGrantPermissionModal, setShowGrantPermissionModal] = useState();
    const [modelAction, setModelAction] = useState();
    const navigate = useNavigate()
    const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState();







    const closeAllModal = () => {
        // onHide();
        setShowSuccessModal(false);
    };


    const confirmStatusChange = async (row, user) => {
        // debugger
        try {
            const { stateID } = row; // Destructure to access only what's needed
            const response = await ChangeStateStatus(stateID, user.userKeyID);

            if (response && response.data.statusCode === 200) {
                // Successfully changed the status
                setShowStatusChangeModal(false);
                setStateChangeStatus(null);
                setShowSuccessModal(true);
                setModelAction('State status changed successfully.');
            } else {
                console.error(response?.data?.errorMessage);
                setShowSuccessModal(true);
                setModelAction('Failed to change employee status.');
            }
        } catch (error) {
            console.error('Error changing employee status:', error);
            setShowSuccessModal(true);
            setModelAction('An error occurred while changing the employee status.');
        }
    };

    const GrantPermission = () => {
        setShowGrantPermissionModal(true);
    };

    return (
        <>
            <div className="card w-full max-w-[50vh] mx-auto h-auto">
                <div className="card-body p-2 bg-white shadow-md rounded-lg">
                    {/* Top controls */}
                    <div className="d-flex justify-content-between align-items-center mb-1">
                     <button
                              // className="btn btn-light p-1 me-2"
                              className="btn btn-outline-secondary btn-sm me-2"

                              // style={{ borderRadius: "50%", width: "36px", height: "36px" }}
                              onClick={() => navigate(-1)}
                              >
                              <i className="fa-solid fa-arrow-left"></i>

                        </button>
                        <div className="flex-grow-1">
                        <h5 className="mb-0">Permission</h5>
                        </div>
                        <button
                            onClick={() => GrantPermission()}
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
                            placeholder="Search..."
                            disabled
                            style={{ maxWidth: "350px" }}
                        // value={searchKeyword}
                        // onChange={(e) => {
                        //   handleSearch(e);
                        // }}
                        />
                        <Tooltip title="Set Permission">
                            <button
                                style={{ background: '#ff7d34' }}
                                onClick={() => GrantPermission()}
                                className="btn text-white btn-sm d-none d-sm-inline"
                            >
                                <i className="fa-solid fa-plus" style={{ fontSize: "11px", }}></i> {" "}
                                <span className="d-none d-sm-inline">Set Permission</span>
                            </button>
                        </Tooltip>
                    </div>

                    {/* Table */}
                    <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
                        <table class="table table-bordered table-striped">
                            <thead className='text-center' >
                                <tr>
                                    <th>Sr No</th>
                                    <th>Role Type</th>
                                    {/* <th>Name</th> */}
                                    <th>Status</th>
                                    {/* <th>                        Action
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                <tr >
                                    <td>1</td>
                                    <td>MTS</td>
                                    {/* <td>John Doe</td> */}
                                    <td>Disable<Android12Switch
                                        disabled
                                        style={{ padding: '8px' }}
                                        // onClick={() => handleStatusChange(employee)}
                                        checked={false}

                                    /></td>
                                    {/* <td><button class="btn btn-primary btn-sm" disabled>                          <i class="fa-solid fa-pen-to-square"></i>
                                    </button></td> */}
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td> Nursing</td>
                                    {/* <td>Jane Smith</td> */}
                                    <td>Enable<Android12Switch
                                        disabled
                                        style={{ padding: '8px' }}
                                        // onClick={() => handleStatusChange(employee)}
                                        checked={true}

                                    /></td>
                                    {/* <td><button class="btn btn-primary btn-sm" disabled>                          <i class="fa-solid fa-pen-to-square"></i>
                                    </button></td> */}
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Teaching</td>
                                    {/* <td>Jane Smith</td> */}
                                    <td>Enable<Android12Switch
                                        disabled
                                        style={{ padding: '8px' }}
                                        // onClick={() => handleStatusChange(employee)}
                                        checked={true}

                                    /></td>
                                    {/* <td><button class="btn btn-primary btn-sm" disabled>                          <i class="fa-solid fa-pen-to-square"></i>
                                    </button></td> */}
                                </tr>

                            </tbody>
                        </table>
                        {/* {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />} */}
                    </div>
                    <div className="d-flex justify-content-end ">

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

            {showGrantPermissionModal && (
                <GrantPermissionModal modelRequestData={modelRequestData} show={showGrantPermissionModal} onHide={() => setShowGrantPermissionModal(false)} />
            )}
        </>
    );
};

export default PermissionList;
