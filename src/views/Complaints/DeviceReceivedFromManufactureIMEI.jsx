 


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
import { DeviceReceiveFromManufacturer, DeviceSendToManufacturer } from 'services/ComplaintsApi/ComplaintApi';
const DeviceReceivedFromManufactureIMEI = ({ show, handleClose, selectedComplaintIDs  ,setIsAddUpdateActionDone,modelRequestData}) => {
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user, companyID } = useContext(ConfigContext);
  const [modelAction,setModelAction]=useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deviceReceiveFromMfgObj, setDeviceReceiveFromMfgObj] = useState({
    userKeyID: null,
    employeeKeyID: null,
    deviceReceiveFromManufacturerDate: null,
    imeInumber: null,
    complaintID: null
  });
  const [errors, setErrors] = useState(false);

 


 



  const AddLeadBtnClick = () => {
    let isValid = false;
  
    // Basic validations
    if (
      !deviceReceiveFromMfgObj.deviceReceiveFromManufacturerDate ||
      !deviceReceiveFromMfgObj.isDeviceNew ||
      (deviceReceiveFromMfgObj.isDeviceNew === 'no' && !deviceReceiveFromMfgObj.imeInumber)
    ) {
      setErrors(true);
      isValid = true;
    }
  
    const apiParamObj = {
      userKeyID: user.userKeyID,
      employeeKeyID: user.userKeyID,
      complaintID: modelRequestData?.complaintID,
      deviceReceiveFromManufacturerDate: deviceReceiveFromMfgObj.deviceReceiveFromManufacturerDate,
      imeInumber: deviceReceiveFromMfgObj.isDeviceNew === 'no' ? deviceReceiveFromMfgObj.imeInumber : null
    };
  
    if (!isValid) {
      setErrors(false);
      AddUpdateLeadData(apiParamObj);
    }
  };
  
  const AddUpdateLeadData = async (apiParams) => {
    // debugger
    setLoader(true);

    try {
      const response = await DeviceReceiveFromManufacturer(apiParams); //Call this api

      if (response?.data.statusCode === 200) {
        setLoader(false);
        setIsAddUpdateActionDone(true);
        setModelAction('Device Received From Manufacturer Successfully. ');
       
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
    
  setDeviceReceiveFromMfgObj({
    userKeyID: null,
    employeeKeyID: null,
    deviceReceiveFromManufacturerDate: null,
    imeInumber: '',
    isDeviceNew: null,
    complaintID: null,
  });

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
        <Modal.Title> Device Received from Mfg.</Modal.Title>
      </Modal.Header>
      <Modal.Body>
  <div className="mt-4 d-flex flex-column gap-3">

    {/* Date Picker */}
    <div className="d-flex flex-column align-items-start gap-2">
      <label>Select Received Date</label>
      <DatePicker
        value={deviceReceiveFromMfgObj?.deviceReceiveFromManufacturerDate}
        onChange={(date) =>
          setDeviceReceiveFromMfgObj((prev) => ({
            ...prev,
            deviceReceiveFromManufacturerDate: date,
          }))
        }
        clearIcon={null}
        popperPlacement="bottom-start"
      />
      {errors && !deviceReceiveFromMfgObj.deviceReceiveFromManufacturerDate && (
        <span className="text-danger">Please select a date</span>
      )}
    </div>

    {/* Radio Button */}
    <div className="d-flex flex-column align-items-start gap-2">
      <label>Is Device New?</label>
      <div>
        <input
          type="radio"
          id="deviceNewYes"
          name="isDeviceNew"
          value="yes"
          checked={deviceReceiveFromMfgObj.isDeviceNew === 'yes'}
          onChange={(e) =>
            setDeviceReceiveFromMfgObj((prev) => ({
              ...prev,
              isDeviceNew: e.target.value,
              imeInumber: '',
            }))
          }
        />
        <label htmlFor="deviceNewYes" className="ms-1 me-3">Yes</label>

        <input
          type="radio"
          id="deviceNewNo"
          name="isDeviceNew"
          value="no"
          checked={deviceReceiveFromMfgObj.isDeviceNew === 'no'}
          onChange={(e) =>
            setDeviceReceiveFromMfgObj((prev) => ({
              ...prev,
              isDeviceNew: e.target.value,
            }))
          }
        />
        <label htmlFor="deviceNewNo" className="ms-1">No</label>
      </div>
      {errors && !deviceReceiveFromMfgObj.isDeviceNew && (
        <span className="text-danger">Please select if the device is new</span>
      )}
    </div>

    {/* IMEI Input (Conditional) */}
    {deviceReceiveFromMfgObj.isDeviceNew === 'no' && (
      <div className="d-flex flex-column align-items-start gap-2">
        <label>Enter IMEI Number</label>
        <input
          type="text"
          placeholder='Enter IMEI Number'
          className="form-control"
          maxLength={10}
          value={deviceReceiveFromMfgObj.imeInumber}
          onChange={(e) =>
            setDeviceReceiveFromMfgObj((prev) => ({
              ...prev,
              imeInumber: e.target.value,
            }))
          }
        />
        {errors && deviceReceiveFromMfgObj.isDeviceNew === 'no' && !deviceReceiveFromMfgObj.imeInumber && (
          <span className="text-danger">IMEI number is required</span>
        )}
      </div>
    )}
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

export default DeviceReceivedFromManufactureIMEI;
 
