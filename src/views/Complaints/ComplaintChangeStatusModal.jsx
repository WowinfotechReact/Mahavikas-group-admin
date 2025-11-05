 


 // ModalComponent.js
import React, { useEffect,useState, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-date-picker';
// import lottie from "lottie-web";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import animationData from '../../assets/images/complaints.json'
import Lottie from "lottie-react";
import { pendingComplaintTabOption } from 'Middleware/Utils';
const ComplaintChangeStatusModal = ({ show, handleClose, modelRequestData,sendApprovalBtnClick }) => {
 
  
  const [selectedStatus, setSelectedStatus] = useState(null);
const [errorMsg,setErrorMsg]=useState(false)
  useEffect(() => {
    if (!show) setSelectedStatus(null);
  }, [show]);

 useEffect(()=>{
  setErrorMsg(false)
 },[selectedStatus])

  const handleChangeStatus = () => {
    
    if (!selectedStatus) {
      setErrorMsg('Please select a status.')
      // alert("");
      return;
    }

    const finalApiParam = {
      ...modelRequestData,
      complaintStatusID: selectedStatus.value, // 🔥 this is the actual input you need
    };

    sendApprovalBtnClick(finalApiParam); // pass back to parent
  };
  return (
    <Modal
      show={show}
      onHide={handleClose}
      style={{ zIndex: 1300 }}
      backdrop="static"
      keyboard={false}
      centered // Adjust the z-index as needed
    >
      <Modal.Header closeButton>
        <Modal.Title> Complaint Change Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="container text-center">
  {/* Animated Icon */}
  <div className="d-flex justify-content-center mb-3">
    <Lottie animationData={animationData} style={{ width: 70, height: 55 }} />
  </div>

  {/* Confirmation Message */}
  <h5 className=" text-muted fw-semibold fs-6">
    Are you sure you want to change the status?
  </h5>

  {/* Status Dropdown */}
  <div className="mt- d-flex flex-column align-items-center gap-2">
    <label className="text-start w-100 fw-semibold small " style={{ maxWidth: "400px" }}>
      Please Select Status
    </label>

    <div style={{ width: "100%", maxWidth: "400px" }}>
      <Select
        options={pendingComplaintTabOption}
        value={selectedStatus}
        onChange={setSelectedStatus}
        placeholder="Select Status"
        className="text-sm"
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          container: (base) => ({ ...base, width: "100%" }),
          control: (base) => ({
            ...base,
            minHeight: '36px',
            fontSize: '0.875rem',
            textAlign: 'left', // important
          }),
          singleValue: (base) => ({
            ...base,
            textAlign: 'left',
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start', // ⬅️ aligns selected text to left
          }),
          placeholder: (base) => ({
            ...base,
            textAlign: 'left',
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start', // ⬅️ aligns placeholder to left
          }),
          option: (base) => ({
            ...base,
            textAlign: 'left', // ⬅️ aligns dropdown options to left
          }),
        }}
      />
    </div>
  </div>
  <span style={{color:'red'}}>{errorMsg}</span>
</div>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleChangeStatus}>
        Change Status
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ComplaintChangeStatusModal;
