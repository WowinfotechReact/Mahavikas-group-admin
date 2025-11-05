 


  

 

 


 // ModalComponent.js
 import React, { useContext, useEffect, useRef, useState } from 'react';
 import { Modal, Button } from 'react-bootstrap';
 import Select from 'react-select';
 import DatePicker from 'react-date-picker';
 import lottie from "lottie-web";
 import 'react-date-picker/dist/DatePicker.css';
 import 'react-calendar/dist/Calendar.css';
 import Lottie from "lottie-react";
import transferComplaint from '../../assets/images/transferComplaint.json'
import AmcGif from '../../assets/images/amcGif.json'
import { AMCAppprovedRejectedByAdmin } from 'services/AMCApi/AMCApi';
import { ConfigContext } from 'context/ConfigContext';
import SuccessPopupModal from 'component/SuccessPopupModal';
 const AmcApprovedRejectModal = ({ show, handleClose,modelRequestData, setIsAddUpdateActionDone, onConfirmTransfer}) => {
    const { user, setLoader,companyID } = useContext(ConfigContext);
  
   const animationContainer = useRef(null);
   const [showSuccessModal, setShowSuccessModal] = useState(false);
const [modelAction,setModelAction]=useState(false)

const closeAllModal=()=>{
    // debugger
    // onHide();
    handleClose()
    setShowSuccessModal(false)
}
   const AMCAppprovedRejectedByAdminData = async (status) => {
    const params = {
      userKeyID: user.userKeyID,
      amcid: modelRequestData.amcid,
  isApprovedRejected: status    //Approved 1 or reject 0

    };

    setLoader(true);

    try {
      const response = await AMCAppprovedRejectedByAdmin(params); //Call this api

      if (response?.data.statusCode === 200) {
        setLoader(false);
        setIsAddUpdateActionDone(true);
        setShowSuccessModal(true);
        console.log(params,'dsajduhgsa877iud');
        

        setModelAction(params.isApprovedRejected===1?"Amc Approved Successfully":'Amc Rejected Successfully');
        setShowSuccessModal(true);
        setShowTransferComplaintModal(false);
      } else {
        setLoader(false);
        setErrorMessage(response.data.errorMessage);
        // setErrors(true);
        console.error('Bad request');
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
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
         <Modal.Title> AMC Approved / Reject</Modal.Title>
       </Modal.Header>
       <Modal.Body>
       <div className="container text-center">
     {/* Animated Icon */}
     <div className="d-flex justify-content-center">
     
       <Lottie animationData={AmcGif} style={{ width: 200, height: 150 }} />;
     </div>
 
     {/* Confirmation Message */}
     {/* <h4 className="mt-3">Are you sure you want to transfer complaints?</h4> */}
     Are you sure you want to approved or reject amc's?
       
 
     {/* Action Buttons */}
     <div className="mt-4 d-flex justify-content-center gap-3">
       {/* <button className="btn btn-danger" onClick={handleClose}>Cancel</button>
       <button className="btn btn-success" onClick={handleConfirm}>Confirm</button> */}
     </div>
     <SuccessPopupModal
        show={showSuccessModal}
        onHide={() => closeAllModal()}
        setShowSuccessModal={setShowSuccessModal}
        modelAction={modelAction}
      />
   </div>
       </Modal.Body>
       <Modal.Footer>
         <Button variant="secondary" onClick={()=>AMCAppprovedRejectedByAdminData(0)} >
         Reject
         </Button>
         <Button variant="primary" onClick={()=>AMCAppprovedRejectedByAdminData(1)} >
         
         Approve
         </Button>
       </Modal.Footer>
     </Modal>
   );
 };
 
 export default AmcApprovedRejectModal;
 