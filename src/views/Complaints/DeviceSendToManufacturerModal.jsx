// ModalComponent.js
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import 'react-date-picker/dist/DatePicker.css';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import Lottie from 'lottie-react';
import transferComplaint from '../../assets/images/transferComplaint.json';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { DeviceSendToManufacturer } from 'services/ComplaintsApi/ComplaintApi';
const DeviceSendToManufacturerModal = ({ show, handleClose, selectedComplaintIDs  ,setIsAddUpdateActionDone}) => {
  const [error, setErrors] = useState(null);
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user, companyID } = useContext(ConfigContext);
  const [modelAction,setModelAction]=useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deviceSendToMfgObj, setDeviceSendToMfgObj] = useState({
    userKeyID: null,
    employeeKeyID: null,
    deviceSendToManufacturerDate: null,
    complaintID: null
  });

 


 



  const AddLeadBtnClick = () => { 
    let isValid = false;
    if ( 
        deviceSendToMfgObj.deviceSendToManufacturerDate === undefined ||
      deviceSendToMfgObj.deviceSendToManufacturerDate === '' ||
      deviceSendToMfgObj.deviceSendToManufacturerDate === null 
     
    ) {
      setErrors(true);
      isValid = true;
    }

    const apiParamObj = {
        userKeyID:user.userKeyID,
        employeeKeyID:user.userKeyID,
        complaintID:selectedComplaintIDs,
        deviceSendToManufacturerDate:deviceSendToMfgObj.deviceSendToManufacturerDate
    };
    if (!isValid) {
      AddUpdateLeadData(apiParamObj);
    }
  };

  const AddUpdateLeadData = async (apiParams) => {
    // debugger
    setLoader(true);

    try {
      const response = await DeviceSendToManufacturer(apiParams); //Call this api

      if (response?.data.statusCode === 200) {
        setLoader(false);
        setIsAddUpdateActionDone(true);
        setModelAction('Device Send to Manufacturer Successfully ');
       
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

  const handleDateChange = (date) => {
    setDeviceSendToMfgObj((prevState) => ({
      ...prevState,
      deviceSendToManufacturerDate: date // Update state with selected date
    }));
  };

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
        <Modal.Title> Device Send to Mfg.</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container text-center">
          {/* Animated Icon */}
          <div className="d-flex justify-content-center">
            <Lottie animationData={transferComplaint} style={{ width: 150, height: 100 }} />;
          </div>
          Are you sure you want to send selected device to manufacturer ? <br />
          
        </div>
        <div className="mt-4 d-flex flex-column align-items-start gap-2">
          <label htmlFor="">Select Send Date</label>
  <DatePicker
    value={deviceSendToMfgObj?.deviceSendToManufacturerDate}
    onChange={handleDateChange}
    clearIcon={null}
    popperPlacement="bottom-start"
  />
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

export default DeviceSendToManufacturerModal;
 
