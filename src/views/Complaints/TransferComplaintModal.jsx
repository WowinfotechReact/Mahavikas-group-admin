 

 

 


 // ModalComponent.js
 import React, { useEffect, useRef } from 'react';
 import { Modal, Button } from 'react-bootstrap';
 import Select from 'react-select';
 import DatePicker from 'react-date-picker';
 import lottie from "lottie-web";
 import 'react-date-picker/dist/DatePicker.css';
 import 'react-calendar/dist/Calendar.css';
 import Lottie from "lottie-react";
import transferComplaint from '../../assets/images/transferComplaint.json'
 const TransferComplaintModal = ({ show, handleClose, selectedComplaintIDs, onConfirmTransfer}) => {
  
  
   const animationContainer = useRef(null);
 
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
     <div className="d-flex justify-content-center">
     
       <Lottie animationData={transferComplaint} style={{ width: 200, height: 150 }} />;
     </div>
 
     {/* Confirmation Message */}
     {/* <h4 className="mt-3">Are you sure you want to transfer complaints?</h4> */}
     Are you sure you want to transfer the following complaint(s)? <br />
        <strong>{selectedComplaintIDs.join(', ')}</strong>
 
     {/* Action Buttons */}
     <div className="mt-4 d-flex justify-content-center gap-3">
       {/* <button className="btn btn-danger" onClick={handleClose}>Cancel</button>
       <button className="btn btn-success" onClick={handleConfirm}>Confirm</button> */}
     </div>
   </div>
       </Modal.Body>
       <Modal.Footer>
         <Button variant="secondary" onClick={handleClose}>
           Close
         </Button>
         <Button variant="primary" onClick={onConfirmTransfer}>
         Yes
         </Button>
       </Modal.Footer>
     </Modal>
   );
 };
 
 export default TransferComplaintModal;
 