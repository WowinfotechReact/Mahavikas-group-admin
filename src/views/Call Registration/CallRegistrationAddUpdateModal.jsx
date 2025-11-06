

import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { GetStateLookupList } from 'services/Master Crud/MasterStateApi';
import { ConfigContext } from 'context/ConfigContext';
import Select from 'react-select';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { GetCustomerLookupList } from 'services/CustomerStaff/CustomerStaffApi';
import { AddUpdateServiceCall, GetServiceCallModel } from 'services/Call Registration/CallRegistrationApi';
import { App_GetCallTypeLookupList } from 'services/Call Type/CallTypeApi';
import { GetEmployeeLookupList } from 'services/Employee Staff/EmployeeApi';
import dayjs from 'dayjs';
import { GetCustomerLeadLookupList } from 'services/LeadAPI/LeadApi';
import AddUpdateCustomerFirmModal from 'views/Customer Firm Master/AddUpdateCustomerFirmModal';

const CallRegistrationAddUpdateModal = ({ show, onHide, isAddUpdateActionDone, setIsAddUpdateActionDone, modelRequestData }) => {
    const [modelAction, setModelAction] = useState('');
    const [error, setErrors] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [stateOption, setStateOption] = useState([]);
    const [callTypeOption, setCallTypeOption] = useState([]);

    const [employeeOption, setEmployeeOption] = useState([]);
    const [assignEmployeeOption, setAssignEmployeeOption] = useState([]);
    const { setLoader, user } = useContext(ConfigContext);
    const [showCustomerModal, setShowCustomerModal] = useState(false)
    const [customerLookupList, setCustomerLookupList] = useState([]);
    const [customerLeadLookupList, setCustomerLeadLookupList] = useState([]);
    const [callRegistrationObj, setCallRegistrationObj] = useState({
        visitDate: null,
        serviceCallKeyID: null,
        customerID: null,
        leadID: null,
        callTypeID: null,
        pointOfContact: null,
        charges: null,
        assignToEmployeeID: null,
        fault: null,
        address: null
    });

    const changeTypeOption = [
        { value: 1, label: 'AMC' },
        { value: 2, label: 'Warranty' },
        { value: 3, label: 'Post-Warranty' },
    ]

    useEffect(() => {
        if (modelRequestData?.Action === 'Update') {
            if (modelRequestData?.serviceCallKeyID !== null) {
                GetMasterDistrictModalData(modelRequestData.serviceCallKeyID);
            }
        }
    }, [modelRequestData?.Action]);



    // useEffect(() => {
    //   GetStateLookupListData();
    // }, [modelRequestData?.Action]);

    useEffect(() => {
        GetCustomerLookUpListData()
    }, [])

    useEffect(() => {
        if (isAddUpdateActionDone) {

            GetCustomerLookUpListData()
        }
        setIsAddUpdateActionDone(false);
    }, [isAddUpdateActionDone])

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



    const GetCustomerLeadLookupListData = async (customerID) => {
        if (!customerID) return; // avoid calling if nothing is selected

        setLoader(true);
        try {
            // Pass customerID to API (if your API supports filtering)
            let response = await GetCustomerLeadLookupList(customerID);
            if (response?.data?.statusCode === 200) {
                const customerOptions = response?.data?.responseData?.data || [];
                const FormattedRollOptions = customerOptions.map((val) => ({
                    value: val.leadID,
                    leadKeyID: val.leadKeyID,
                    label: val.leadName,
                    address: val.address,
                    contactNumber: val.contactNumber
                }));
                setCustomerLeadLookupList(FormattedRollOptions);
            } else {
                console.error('Bad request');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoader(false);
        }
    };


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

    const AddStateBtnClick = () => {
        // debugger;
        let isValid = false;
        if (
            callRegistrationObj.customerID === null ||
            callRegistrationObj.customerID === undefined ||
            callRegistrationObj.customerID === '' ||
            callRegistrationObj.fault === null ||
            callRegistrationObj.fault === undefined ||
            callRegistrationObj.fault === '' ||
            callRegistrationObj.leadID === null ||
            callRegistrationObj.leadID === undefined ||
            callRegistrationObj.leadID === '' ||
            // callRegistrationObj.callTypeID === null ||
            // callRegistrationObj.callTypeID === undefined ||
            // callRegistrationObj.callTypeID === '' ||

            callRegistrationObj.pointOfContact === null ||
            callRegistrationObj.pointOfContact === undefined ||
            callRegistrationObj.pointOfContact === '' ||
            callRegistrationObj.serviceTypeID === null ||
            callRegistrationObj.serviceTypeID === undefined ||
            callRegistrationObj.serviceTypeID === '' ||

            callRegistrationObj.address === null ||
            callRegistrationObj.address === undefined ||
            callRegistrationObj.address === ''
        ) {
            setErrors(true);
            isValid = true;
        } else {
            setErrors(false);
            isValid = false;
        }

        const apiParam = {
            userKeyID: user.userKeyID,
            serviceCallKeyID: modelRequestData?.serviceCallKeyID,
            customerID: callRegistrationObj?.customerID,
            serviceTypeID: callRegistrationObj?.serviceTypeID,
            // callTypeID: callRegistrationObj?.callTypeID,
            pointOfContact: callRegistrationObj?.pointOfContact,
            charges: callRegistrationObj?.charges || null,
            fault: callRegistrationObj.fault,
            leadID: callRegistrationObj.leadID,
            assignToEmployeeID: callRegistrationObj.assignToEmployeeID,
            visitDate: callRegistrationObj.visitDate,
            address: callRegistrationObj.address
        };

        if (!isValid) {
            AddUpdateServiceCallData(apiParam);
        }
    };

    const AddUpdateServiceCallData = async (apiParam) => {
        setLoader(true)
        try {
            let url = '/AddUpdateServiceCall'; // Default URL for Adding Data

            const response = await AddUpdateServiceCall(url, apiParam);
            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false)
                    setShowSuccessModal(true);
                    setModelAction(
                        modelRequestData.Action === null || modelRequestData.Action === undefined
                            ? 'Call Registration Added Successfully!'
                            : 'Call Registration Updated Successfully!'
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


    useEffect(() => {
        App_GetCallTypeLookupListData()
    }, [])
    const App_GetCallTypeLookupListData = async () => {
        try {
            const response = await App_GetCallTypeLookupList(); // Ensure this function is imported correctly

            if (response?.data?.statusCode === 200) {
                const stateLookupList = response?.data?.responseData?.data || [];

                const formattedIvrList = stateLookupList.map((ivrItem) => ({
                    value: ivrItem.callTypeID,
                    label: ivrItem.callTypeName
                }));

                setCallTypeOption(formattedIvrList); // Make sure you have a state setter function for IVR list
            } else {
                console.error('Failed to fetch IVR lookup list:', response?.data?.statusMessage || 'Unknown error');
            }
        } catch (error) {
            console.error('Error fetching IVR lookup list:', error);
        }
    };



    const closeAllModal = () => {
        onHide();
        setShowSuccessModal(false);
    };


    const handleDateChange = (date) => {
        setCallRegistrationObj((prevState) => ({
            ...prevState,
            visitDate: dayjs(date).format('YYYY-MM-DD')  // Store as string
        }));
    };

    const GetMasterDistrictModalData = async (id) => {
        if (id === undefined) {
            return;
        }

        setLoader(true)
        try {
            const data = await GetServiceCallModel(id);
            if (data?.data?.statusCode === 200) {
                setLoader(false)
                const ModelData = data.data.responseData.data; // Assuming data is an array

                setCallRegistrationObj({
                    ...callRegistrationObj,
                    userKeyID: ModelData.userKeyID,
                    serviceCallKeyID: ModelData.serviceCallKeyID,
                    customerID: ModelData.customerID,
                    serviceTypeID: ModelData.serviceTypeID,
                    leadID: ModelData.leadID,
                    callTypeID: ModelData.callTypeID,
                    pointOfContact: ModelData.pointOfContact,
                    charges: ModelData.charges,
                    visitDate: ModelData.visitDate,
                    assignToEmployeeID: ModelData.assignToEmployeeID,
                    leadID: ModelData.leadID,
                    fault: ModelData.fault,
                    address: ModelData.address
                });
                if (ModelData.customerID) {
                    await GetCustomerLeadLookupListData(ModelData.customerID);
                }
            } else {
                setLoader(false)
                // Handle non-200 status codes if necessary
                console.error('Error fetching data: ', data?.data?.statusCode);
            }
        } catch (error) {
            setLoader(false)
            console.error('Error in GetTalukaModalData: ', error);
        }
    };

    const handleStateChange = (selectedOption) => {
        setCallRegistrationObj((prev) => ({
            ...prev,
            stateID: selectedOption ? selectedOption.value : null,
            // talukaName:''
        }));
    };
    const handleLeadChange = (selectedOption) => {
        setCallRegistrationObj((prev) => ({
            ...prev,
            leadID: selectedOption ? selectedOption.value : null,
            address: selectedOption?.address || ''
        }));
    };

    const handleCustomerChange = async (selectedOption) => {
        const customerID = selectedOption?.value || null;

        // Step 1: Update customer ID + address
        setCallRegistrationObj((prev) => ({
            ...prev,
            customerID,
            address: selectedOption?.address || null
        }));

        // Step 2: Fetch latest lead list for this customer
        await GetCustomerLeadLookupListData(customerID);
    };



    const handleAssignEmployeeChange = (selectedOption) => {
        setCallRegistrationObj((prev) => ({
            ...prev,
            assignToEmployeeID: selectedOption.value
        }));
    };
    const handleServiceChargeTypeChange = (selectedOption) => {
        setCallRegistrationObj((prev) => ({
            ...prev,
            serviceTypeID: selectedOption.value
        }));
    };

    const customerAddBtnClick = () => {
        setShowCustomerModal(true)
    }

    return (
        <>
            <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h3 className="text-center">
                            {modelRequestData?.Action !== null ? ' Update Call Registration' : modelRequestData?.Action === null ? 'Add Call Registration' : ''}
                        </h3>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
                    <div className="container">
                        <div className="col-12 mb-3">
                            <div className="d-flex justify-content-between align-items-center">

                                <label htmlFor="StateName" className="form-label">
                                    Select Customer
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <span
                                    onClick={customerAddBtnClick}

                                    style={{ fontSize: '14px', textDecoration: 'underline', color: '#0d6efd', cursor: 'pointer' }}
                                >
                                    Add Customer
                                </span>
                            </div>
                            <Select
                                menuPosition="fixed"
                                options={customerLookupList}
                                value={customerLookupList.find((item) => item.value === callRegistrationObj.customerID) || null} // Correctly maps the selected value
                                onChange={handleCustomerChange}
                                placeholder="Select Customer"
                            />
                            {error && (callRegistrationObj.customerID === null || callRegistrationObj.customerID === undefined || callRegistrationObj.customerID === '') ? (
                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                            ) : (
                                ''
                            )}
                            {/* {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>} */}
                        </div>
                        <div className="col-12 mb-3">
                            <label htmlFor="StateName" className="form-label">
                                Select Lead
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <Select
                                menuPosition="fixed"
                                options={customerLeadLookupList}
                                value={customerLeadLookupList.find((item) => item.value === callRegistrationObj.leadID) || null} // Correctly maps the selected value
                                onChange={handleLeadChange}
                                placeholder="Select Lead"
                            />
                            {error && (callRegistrationObj.customerID === null || callRegistrationObj.customerID === undefined || callRegistrationObj.customerID === '') ? (
                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                            ) : (
                                ''
                            )}
                            {/* {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>} */}
                        </div>

                        {/* <div className="col-12 mb-3">
                            <label htmlFor="StateName" className="form-label">
                                Select Call Type
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <Select
                                options={callTypeOption}
                                value={callTypeOption.filter((item) => item.value === callRegistrationObj.callTypeID)}
                                onChange={handleCallTypeChange}
                                menuPosition="fixed"
                            />
                            {error &&
                                (callRegistrationObj.callTypeID === null || callRegistrationObj.callTypeID === undefined || callRegistrationObj.callTypeID === '') ? (
                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                            ) : (
                                ''
                            )}
                        </div> */}
                        <div className="col-12 mb-3">
                            <label htmlFor="StateName" className="form-label">
                                Select Service Type
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <Select
                                options={changeTypeOption}
                                value={changeTypeOption.filter((item) => item.value === callRegistrationObj.serviceTypeID)}
                                onChange={handleServiceChargeTypeChange}
                                menuPosition="fixed"
                            />
                            {error &&
                                (callRegistrationObj.serviceTypeID === null || callRegistrationObj.serviceTypeID === undefined || callRegistrationObj.serviceTypeID === '') ? (
                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                            ) : (
                                ''
                            )}
                            {/* {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>} */}
                        </div>
                        <div className="col-12 mb-3">
                            <label htmlFor="StateName" className="form-label">
                                Assign Employee
                                {/* <span style={{ color: 'red' }}>*</span> */}
                            </label>
                            <Select
                                options={employeeOption}
                                value={employeeOption.filter((item) => item.value === callRegistrationObj.assignToEmployeeID)}
                                onChange={handleAssignEmployeeChange}
                                menuPosition="fixed"
                            />
                            {/* {error &&
                                (callRegistrationObj.assignToEmployeeID === null || callRegistrationObj.assignToEmployeeID === undefined || callRegistrationObj.assignToEmployeeID === '') ? (
                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                            ) : (
                                ''
                            )} */}
                            {/* {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>} */}
                        </div>
                        {callRegistrationObj.assignToEmployeeID && (
                            <>
                                <div className="col-12 mb-3">
                                    <label htmlFor="StateName" className="form-label">
                                        Visit Date
                                        {/* <span style={{ color: 'red' }}>*</span> */}
                                    </label>
                                    <DatePicker
                                        onChange={handleDateChange}
                                        label="From Date"
                                        format="dd/MM/yyyy"
                                        clearIcon={null}
                                        popperPlacement="bottom-start"
                                        value={callRegistrationObj?.visitDate} // Calendar opens to this

                                    />


                                    {/* {error &&
                                (callRegistrationObj.assignToEmployeeID === null || callRegistrationObj.assignToEmployeeID === undefined || callRegistrationObj.assignToEmployeeID === '') ? (
                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                            ) : (
                                ''
                            )} */}
                                    {/* {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>} */}
                                </div>
                            </>
                        )}

                        <div className="col-12 mb-3">
                            <label htmlFor="talukaName" className="form-label">
                                Charges ⟨₹⟩
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                maxLength={8}
                                type="text"
                                className="form-control"
                                id="talukaName"
                                placeholder="Enter Charges"
                                value={callRegistrationObj.charges}
                                onChange={(e) => {
                                    setErrorMessage(false);
                                    let inputValue = e.target.value;

                                    // Allow only digits
                                    const digitsOnly = inputValue.replace(/\D/g, '');

                                    setCallRegistrationObj((prev) => ({
                                        ...prev,
                                        charges: digitsOnly
                                    }));
                                }}

                            />

                            {error &&
                                (callRegistrationObj.charges === null || callRegistrationObj.charges === undefined || callRegistrationObj.charges === '') ? (
                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                            ) : (
                                ''
                            )}
                        </div>
                        <div className="col-12 mb-3">
                            <label htmlFor="Address" className="form-label">
                                Point OF Contact
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <textarea
                                maxLength={220}
                                type="text"
                                className="form-control"
                                id="Address"
                                placeholder="Enter Point of Contact"
                                value={callRegistrationObj.pointOfContact}
                                onChange={(e) => {
                                    setErrorMessage(false);
                                    let inputValue = e.target.value;

                                    // Prevent only-space input at start
                                    if (inputValue.length === 1 && inputValue === ' ') {
                                        inputValue = '';
                                    }

                                    // Remove special characters, allow letters, numbers, spaces
                                    const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                                    // Capitalize first letter after every space (preserve multiple spaces)
                                    const updatedValue = cleanedValue.replace(/\b\w/g, (char) => char.toUpperCase());

                                    setCallRegistrationObj((prev) => ({
                                        ...prev,
                                        pointOfContact: updatedValue
                                    }));
                                }}
                            />

                            {error &&
                                (callRegistrationObj.pointOfContact === null || callRegistrationObj.pointOfContact === undefined || callRegistrationObj.pointOfContact === '') ? (
                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                            ) : (
                                ''
                            )}
                        </div>
                        <div className="col-12 mb-3">
                            <label htmlFor="talukaName" className="form-label">
                                Fault
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                maxLength={220}
                                type="text"
                                className="form-control"
                                id="talukaName"
                                placeholder="Enter Fault"
                                value={callRegistrationObj.fault}
                                onChange={(e) => {
                                    setErrorMessage(false);
                                    let inputValue = e.target.value;

                                    // Prevent only-space input at start
                                    if (inputValue.length === 1 && inputValue === ' ') {
                                        inputValue = '';
                                    }

                                    // Remove special characters, allow letters, numbers, spaces
                                    const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                                    // Capitalize first letter after every space (preserve multiple spaces)
                                    const updatedValue = cleanedValue.replace(/\b\w/g, (char) => char.toUpperCase());

                                    setCallRegistrationObj((prev) => ({
                                        ...prev,
                                        fault: updatedValue
                                    }));
                                }}
                            />

                            {error &&
                                (callRegistrationObj.fault === null || callRegistrationObj.fault === undefined || callRegistrationObj.fault === '') ? (
                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                            ) : (
                                ''
                            )}
                        </div>
                        <div className="col-12 mb-3">
                            <label htmlFor="Address" className="form-label">
                                Address
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <textarea
                                maxLength={220}
                                type="text"
                                className="form-control"
                                id="Address"
                                placeholder="Enter Address"
                                value={callRegistrationObj.address}
                                onChange={(e) => {
                                    setErrorMessage(false);
                                    let inputValue = e.target.value;

                                    // Prevent only-space input at start
                                    if (inputValue.length === 1 && inputValue === ' ') {
                                        inputValue = '';
                                    }

                                    // Remove special characters, allow letters, numbers, spaces
                                    const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                                    // Capitalize first letter after every space (preserve multiple spaces)
                                    const updatedValue = cleanedValue.replace(/\b\w/g, (char) => char.toUpperCase());

                                    setCallRegistrationObj((prev) => ({
                                        ...prev,
                                        address: updatedValue
                                    }));
                                }}
                            />

                            {error &&
                                (callRegistrationObj.address === null || callRegistrationObj.address === undefined || callRegistrationObj.address === '') ? (
                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                            ) : (
                                ''
                            )}
                            {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                    <button style={{ background: '#ff7d34' }} className="btn text-white text-center" onClick={() => AddStateBtnClick()}>
                        Submit
                    </button>
                </Modal.Footer>
            </Modal>
            {showSuccessModal && (
                <SuccessPopupModal
                    show={showSuccessModal}
                    onHide={() => closeAllModal()}
                    setShowSuccessModal={setShowSuccessModal}
                    modelAction={modelAction}
                />
            )}
            {showCustomerModal && (
                <AddUpdateCustomerFirmModal
                    show={showCustomerModal}
                    onHide={() => {
                        setShowCustomerModal(false)

                    }}
                    modelRequestData={modelRequestData}
                    isAddUpdateActionDone={isAddUpdateActionDone}
                    setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                />
            )}
            {/* <CusModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} vehicleObj={vehicleObj} /> */}
        </>
    );
};

export default CallRegistrationAddUpdateModal;
