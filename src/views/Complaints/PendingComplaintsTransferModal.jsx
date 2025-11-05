// ModalComponent.js
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import Lottie from 'lottie-react';
import transferComplaint from '../../assets/images/transferComplaint.json';
import { GetRoleTypeLookupList } from 'services/Master Crud/MasterRoleTypeApi';
import { GetEmployeeLookupList } from 'services/Employee Staff/EmployeeApi';
import { ConfigContext } from 'context/ConfigContext';
import { MultipleLeadAssignToSalesman } from 'services/LeadAPI/LeadApi';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { MultipleComplaintAssignToSalesman } from 'services/ComplaintsApi/ComplaintApi';
const TransferLeadModal = ({ show, handleClose, selectedComplaintIDs  ,setIsAddUpdateActionDone}) => {
  const [roleTypeOption, setRoleTypeOption] = useState([]);
  const [error, setErrors] = useState(null);
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user, companyID } = useContext(ConfigContext);
  const [employeeOption, setEmployeeOption] = useState([]);
  const [modelAction,setModelAction]=useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transferLeadObj, setTransferLeadObj] = useState({
    userKeyID: null,
    complaintID: null,
    employeeKeyID: null,
    roleTypeID: null
  });

  const GetRoleTypeLookupListData = async () => {
    try {
      const response = await GetRoleTypeLookupList(user.userKeyID); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const roleTypeLookupList = response?.data?.responseData?.data || [];

        const formattedIvrList = roleTypeLookupList.map((roleType) => ({
          value: roleType.roleTypeID,
          label: roleType.roleTypeName
        }));

        setRoleTypeOption(formattedIvrList); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch role Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching role Type lookup list:', error);
    }
  };

  const GetEmployeeLookupListData = async (roleTypeID, companyID) => {
    try {
      let response = await GetEmployeeLookupList(roleTypeID, companyID); // Call to get employee list based on roleTypeID
      if (response?.data?.statusCode === 200) {
        const employeeList = response?.data?.responseData?.data || [];

        const filteredEmployees = employeeList.map((emp) => ({
          value: emp.employeeKeyID,
          label: emp.name
        }));
        setEmployeeOption(filteredEmployees); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Bad request');
      }
    } catch (error) {
      console.error('Error fetching employee list:', error);
    }
  };

  useEffect(() => {
    GetEmployeeLookupListData(transferLeadObj.roleTypeID, companyID);
  }, [transferLeadObj.roleTypeID]);
  useEffect(() => {
    GetRoleTypeLookupListData();
  }, []);

  const handleRoleTypeChange = (selectedOption) => {
    setTransferLeadObj((prev) => ({
      ...prev,
      roleTypeID: selectedOption ? selectedOption.value : '',
      employeeKeyID: null
    }));
  };

  const handleTransferDeviceEmployeeChange = (selectedOption) => {
    setTransferLeadObj((prev) => ({
      ...prev,
      employeeKeyID: selectedOption ? selectedOption.value : null
    }));
  };

  const AddLeadBtnClick = () => { 
    let isValid = false;
    if ( 
      transferLeadObj.employeeKeyID === undefined ||
      transferLeadObj.employeeKeyID === '' ||
      transferLeadObj.employeeKeyID === null 
     
    ) {
      setErrors(true);
      isValid = true;
    }

    const apiParamObj = {
        userKeyID:user.userKeyID,
        complaintID:selectedComplaintIDs,
        employeeKeyID:transferLeadObj.employeeKeyID
    };
    if (!isValid) {
      AddUpdateLeadData(apiParamObj);
    }
  };

  const AddUpdateLeadData = async (apiParams) => {
    // debugger
    setLoader(true);

    try {
      const response = await MultipleComplaintAssignToSalesman(apiParams); //Call this api

      if (response?.data.statusCode === 200) {
        setLoader(false);
        setIsAddUpdateActionDone(true);
        setModelAction('Complaint Transfer Successfully ');
       
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

  const closeAllModal=()=>{
    handleClose()
    setShowSuccessModal(false)
    setTransferLeadObj({ roleTypeID: '', employeeKeyID: '' }); // reset selects
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
        <Modal.Title> Complaint Transfer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container text-center">
          {/* Animated Icon */}
          <div className="d-flex justify-content-center">
            <Lottie animationData={transferComplaint} style={{ width: 150, height: 100 }} />;
          </div>
          Are you sure you want to transfer the following complaints? <br />
          {/* <strong>{selectedComplaintIDs.join(', ')}</strong> */}
          {/* Action Buttons */}
          <div className="mt-4 d-flex justify-content-center gap-3">
            {/* <button className="btn btn-danger" onClick={handleClose}>Cancel</button>
       <button className="btn btn-success" onClick={handleConfirm}>Confirm</button> */}
          </div>
        </div>
        <div className=" mt-1">
          <label htmlFor="">Select Role Type</label>
          <Select
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999 // Ensures dropdown appears above everything
              })
            }}
            options={roleTypeOption}
            value={roleTypeOption.filter((item) => item.value === transferLeadObj.roleTypeID)}
            onChange={handleRoleTypeChange}
            menuPosition="fixed"
          />
          {error &&
          (transferLeadObj.roleTypeID === null || transferLeadObj.roleTypeID === undefined || transferLeadObj.roleTypeID === '') ? (
            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
          ) : (
            ''
          )}
          </div>
          <div>
          <label htmlFor=""> Select Employee</label>
          <Select
            options={employeeOption}
            placeholder="Select an Employee"
            value={employeeOption?.find((option) => option.value === transferLeadObj.employeeKeyID) || null}
            onChange={handleTransferDeviceEmployeeChange}
            className="w-100"
            isDisabled={!transferLeadObj.roleTypeID}
          />
          {error && !transferLeadObj.employeeKeyID && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={AddLeadBtnClick}>
          Yes
        </Button>
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

export default TransferLeadModal;
 