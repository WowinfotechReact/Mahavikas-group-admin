
import React, { useContext, useEffect, useRef, useState } from 'react';
//  import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-date-picker';
import lottie from "lottie-web";
import 'react-date-picker/dist/DatePicker.css';
import { Modal, Button, Form } from 'react-bootstrap';

import 'react-calendar/dist/Calendar.css';
import Lottie from "lottie-react";
import transferComplaint from '../../assets/images/transferComplaint.json'
import approval_Rejection_Gif from '../../assets/images/approval&Rejection.json'
import AmcGif from '../../assets/images/amcGif.json'
import { AMCAppprovedRejectedByAdmin } from 'services/AMCApi/AMCApi';
import { ConfigContext } from 'context/ConfigContext';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { SendSalesReturnApprovalRequest } from 'services/ComplaintsApi/ComplaintApi';
const ApproveRejectComplaint = ({ show,
  handleClose,
  selectedComplaintIDs,
  setIsAddUpdateActionDone,
}) => {
  const { user, setLoader, companyID } = useContext(ConfigContext);
  const [adminApprovalRemark, setAdminApprovalRemark] = useState('');
  const [remarkError, setRemarkError] = useState('');
  const animationContainer = useRef(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modelAction, setModelAction] = useState(false)

  const closeAllModal = () => {
    // debugger
    // onHide();
    handleClose()
    setShowSuccessModal(false)
    setAdminApprovalRemark('');
  }
  const AMCAppprovedRejectedByAdminData = async (status) => {


    if (status === 0 && adminApprovalRemark.trim() === '') {
      setRemarkError('Remark is required when rejecting.');
      return;
    }

    setRemarkError(''); // clear error if valid

    const payload = {
      userKeyID: user.userKeyID,
      employeeKeyID: user.userKeyID,
      complaintID: selectedComplaintIDs, // array of selected complaints
      adminApprovalStatus: status, // 1 = Approved, 0 = Rejected
      adminApprovalRemark: adminApprovalRemark || null,
    };

    setLoader(true);

    try {
      const response = await SendSalesReturnApprovalRequest(payload); //Call this api

      if (response?.data.statusCode === 200) {
        // debugger
        setLoader(false);
        setIsAddUpdateActionDone(true);
        setModelAction(status === 1 ? "Complaint Approved Successfully" : "Complaint Rejected Successfully");
        setShowSuccessModal(true);


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
        <Modal.Title> Sale  Request Approved / Reject</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <div className="d-flex justify-content-center mb-3">
          <Lottie animationData={approval_Rejection_Gif} style={{ width: 200, height: 150 }} />
        </div>
        <h5 className="mt-3">Are you sure you want to approve or reject the selected sale return request</h5>

        <Form.Group controlId="remarkTextarea" className="mt-4">

          <Form.Control

            placeholder="Enter your remark here"
            value={adminApprovalRemark}
            onChange={(e) => {
              setAdminApprovalRemark(e.target.value);
              if (e.target.value.trim() !== '') setRemarkError('');
            }}
            isInvalid={remarkError !== ''}
          />
          {remarkError && <Form.Text className="text-danger">{remarkError}</Form.Text>}

        </Form.Group>


        <SuccessPopupModal
          show={showSuccessModal}
          onHide={closeAllModal}
          setShowSuccessModal={setShowSuccessModal}
          modelAction={modelAction}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => AMCAppprovedRejectedByAdminData(0)}>
          Reject
        </Button>
        <Button variant="success" onClick={() => AMCAppprovedRejectedByAdminData(1)}>
          Approve
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ApproveRejectComplaint;

