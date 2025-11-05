

import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { GetStateLookupList } from 'services/Master Crud/MasterStateApi';
import { ConfigContext } from 'context/ConfigContext';
import Select from 'react-select';
import { GetDistrictLookupList } from 'services/Master Crud/MasterDistrictApi';
import { AddUpdateTaluka, GetTalukaModel } from 'services/Master Crud/MasterTalukaApi';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { GetCustomerLookupList } from 'services/CustomerStaff/CustomerStaffApi';
import { AddUpdateServiceCall, AssignServiceCallToSiteEng, GetServiceCallModel } from 'services/Call Registration/CallRegistrationApi';
import { App_GetCallTypeLookupList } from 'services/Call Type/CallTypeApi';
import { GetEmployeeTypeLookupList } from 'services/Employee/EmployeeApi';
import { GetEmployeeLookupList } from 'services/Employee Staff/EmployeeApi';
import lottie from "lottie-web";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import Lottie from "lottie-react";
import transferComplaint from '../../assets/images/transferComplaint.json'
const EmployeeAssignModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
    const [modelAction, setModelAction] = useState('');

    console.log(modelRequestData.serviceCallID, '3444444ddddddddd');

    const [error, setErrors] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [stateOption, setStateOption] = useState([]);
    const [callTypeOption, setCallTypeOption] = useState([]);
    const [employeeOption, setEmployeeOption] = useState([]);
    const [assignEmployeeOption, setAssignEmployeeOption] = useState([]);
    const { setLoader, user } = useContext(ConfigContext);
    const [customerLookupList, setCustomerLookupList] = useState([]);
    const [assignServiceCallToSiteEngObj, setAssignServiceCallToSiteEngObj] = useState({


        userKeyID: null,
        serviceCallID: null,
        employeeID: null
    });









    useEffect(() => {
        GetCustomerLookUpListData()
    }, [])

    const GetCustomerLookUpListData = async () => {
        setLoader(true);
        try {
            let response = await GetCustomerLookupList();
            if (response?.data?.statusCode === 200) {
                setLoader(false);

                const customerOptions = response?.data?.responseData?.data || [];
                const FormattedRollOptions = customerOptions.map((val) => ({
                    value: val.customerID,
                    label: val.customerFirmName
                }));
                setCustomerLookupList(FormattedRollOptions);
            } else {
                setLoader(false);
                console.error('Bad request');
            }
        } catch (error) {
            setLoader(false);
            console.log(error);
        }
    };

    useEffect(() => {
        GetEmployeeLookupListData(1)
    }, [])


    const AddStateBtnClick = () => {
        // debugger;
        let isValid = false;
        if (


            assignServiceCallToSiteEngObj.employeeID === null ||
            assignServiceCallToSiteEngObj.employeeID === undefined ||
            assignServiceCallToSiteEngObj.employeeID === ''
        ) {
            setErrors(true);
            isValid = true;
        } else {
            setErrors(false);
            isValid = false;
        }

        const apiParam = {
            userKeyID: user.userKeyID,
            serviceCallID: modelRequestData.serviceCallIDs,
            employeeID: assignServiceCallToSiteEngObj?.employeeID,

        };

        if (!isValid) {
            AssignServiceCallToSiteEngData(apiParam);
        }
    };

    const AssignServiceCallToSiteEngData = async (apiParam) => {
        setLoader(true)
        try {
            let url = '/AssignServiceCallToSiteEng'; // Default URL for Adding Data

            const response = await AssignServiceCallToSiteEng(url, apiParam);
            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false)
                    setShowSuccessModal(true);
                    setModelAction(
                        modelRequestData.Action === null || modelRequestData.Action === undefined
                            ? 'Assign Service Call    Successfully!'
                            : 'Assign Service Call    Successfully!'
                    ); //Do not change this naming convention

                    setIsAddUpdateActionDone(true);
                } else {
                    setLoader(false)
                    setErrorMessage(response?.response?.data?.errorMessage);
                }
            }
        } catch (error) {
            setLoader(false)
            console.error(error);
        }
    };






    const closeAllModal = () => {
        onHide();
        setShowSuccessModal(false);
    };


    const handleClose = () => {

    }


    useEffect(() => {
        GetEmployeeLookupListData(1)
    }, [])
    const GetEmployeeLookupListData = async () => {
        try {
            const payload = {
                employeeTypeID: null,
                roleTypeID: 6
            };

            const response = await GetEmployeeLookupList(payload);

            if (response?.data?.statusCode === 200) {
                const employeeList = response?.data?.responseData?.data || [];

                const filteredEmployees = employeeList.map((emp) => ({
                    value: emp.employeeID,
                    label: emp.employeeName
                }));

                setEmployeeOption(filteredEmployees); // Assuming this is a useState setter
            } else {
                console.error('Bad request');
            }
        } catch (error) {
            console.error('Error fetching employee list:', error);
        }
    };



    const handleAssignEmployeeChange = (selectedOption) => {
        setAssignServiceCallToSiteEngObj((prev) => ({
            ...prev,
            employeeID: selectedOption.value
        }));
    };
    console.log(modelRequestData, 'dsaouihyd89sauodas');

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                style={{ zIndex: 1300 }}
                backdrop="static"
                keyboard={false}
                centered // Adjust the z-index as needed
            >
                <Modal.Header closeButton>
                    <Modal.Title>Assign Call</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container ">
                        {/* Animated Icon */}
                        <div className="d-flex justify-content-center">

                            <Lottie animationData={transferComplaint} style={{ width: 200, height: 150 }} />;
                        </div>


                        <label className="form-label">
                            Select Employee
                            <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Select
                            options={employeeOption}
                            value={employeeOption.filter((item) => item.value === assignServiceCallToSiteEngObj.employeeID)}
                            onChange={handleAssignEmployeeChange}
                            menuPosition="fixed"
                        />
                        {error &&
                            (assignServiceCallToSiteEngObj.employeeID === null || assignServiceCallToSiteEngObj.employeeID === undefined || assignServiceCallToSiteEngObj.employeeID === '') ? (
                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                        ) : (
                            ''
                        )}
                        <div className="mt-4 d-flex justify-content-center gap-3">
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>


                    <button className='btn btn-sm text-white'
                        onClick={AddStateBtnClick}
                        style={{ background: '#ffaa33' }}
                    >
                        Assign
                    </button>
                </Modal.Footer>
            </Modal>
            <SuccessPopupModal
                show={showSuccessModal}
                onHide={closeAllModal}
                modelAction={modelAction}

            />
        </>
    );
};

export default EmployeeAssignModal;
