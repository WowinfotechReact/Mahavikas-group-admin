
// ModalComponent.js
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import Lottie from 'lottie-react';
import transferComplaint from '../../assets/images/transferComplaint.json';
import { GetRoleTypeLookupList } from 'services/Master Crud/MasterRoleTypeApi';
import { ConfigContext } from 'context/ConfigContext';
import { LeadAssignToSales, MultipleLeadAssignToSalesman } from 'services/LeadAPI/LeadApi';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { GetEmployeeLookupList } from 'services/Employee Staff/EmployeeApi';
const LeadTransferModal = ({ show, handleClose, modelRequestData, selectedLeadIDs, setIsAddUpdateActionDone }) => {
    const [roleTypeOption, setRoleTypeOption] = useState([]);
    const [error, setErrors] = useState(null);
    const [errorMessage, setErrorMessage] = useState();
    const { setLoader, user } = useContext(ConfigContext);
    const [employeeOption, setEmployeeOption] = useState([]);
    const [modelAction, setModelAction] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [transferLeadObj, setTransferLeadObj] = useState({
        userKeyID: null,
        leadID: null,
        employeeID: null,
        roleTypeID: null
    });
    useEffect(() => {
        GetEmployeeLookupListData()
    }, [show])
    console.log(modelRequestData, 'doiuhoisad');

    const GetEmployeeLookupListData = async () => {
        try {
            const payload = {
                employeeTypeID: null,
                roleTypeID: 3
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






    const handleTransferDeviceEmployeeChange = (selectedOption) => {
        setTransferLeadObj((prev) => ({
            ...prev,
            employeeID: selectedOption ? selectedOption.value : null
        }));
    };

    const AddLeadBtnClick = () => {
        let isValid = false;
        if (
            transferLeadObj.employeeID === undefined ||
            transferLeadObj.employeeID === '' ||
            transferLeadObj.employeeID === null
        ) {
            setErrors(true);
            isValid = true;
        }

        const apiParamObj = {
            userKeyID: user.userKeyID,
            leadID: modelRequestData.leadID,
            employeeID: transferLeadObj.employeeID
        };
        if (!isValid) {
            LeadAssignToSalesData(apiParamObj);
        }
    };

    const LeadAssignToSalesData = async (apiParams) => {
        debugger
        setLoader(true);

        try {
            const response = await LeadAssignToSales(apiParams); //Call this api

            if (response?.data.statusCode === 200) {
                setLoader(false);
                setIsAddUpdateActionDone(true);
                setModelAction('Lead Transfer Successfully');
                setShowSuccessModal(true);
            } else {
                setLoader(false);
                setErrorMessage(response.response.data.errorMessage);
                console.error('Bad request');
            }
        } catch (error) {
            setLoader(false);
            setErrorMessage(response.response.data.errorMessage);
            console.log(error);
        }
    };

    const closeAllModal = () => {
        handleClose()
        setShowSuccessModal(false)
        setTransferLeadObj({ roleTypeID: '', employeeID: '' }); // reset selects
        setErrors(false)
    }

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                style={{ zIndex: 1300 }}
                backdrop="static"
                keyboard={false}
                centered // Adjust the z-index as needed
            >
                <Modal.Header closeButton>
                    <Modal.Title> Lead Transfer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container text-center">
                        <div className="d-flex justify-content-center">
                            <Lottie animationData={transferComplaint} style={{ width: 150, height: 100 }} />;
                        </div>
                        Are you sure you want to transfer the following lead? <br />

                    </div>

                    <div className='mt-2'>
                        <label htmlFor=""> Select Employee</label>
                        <Select
                            options={employeeOption}
                            placeholder="Select an Employee"
                            value={employeeOption?.find((option) => option.value === transferLeadObj.employeeID) || null}
                            onChange={handleTransferDeviceEmployeeChange}
                            className="w-100"
                        />
                        {error && !transferLeadObj.employeeID && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <button style={{ background: '#ff7d34' }} className='btn text-white' onClick={AddLeadBtnClick}>
                        Yes!
                    </button>
                </Modal.Footer>
            </Modal>
            <SuccessPopupModal
                show={showSuccessModal}
                onHide={() => closeAllModal()}
                setShowSuccessModal={setShowSuccessModal}
                modelAction={modelAction}// ✅ send it here
            />
        </>
    );
};

export default LeadTransferModal;
