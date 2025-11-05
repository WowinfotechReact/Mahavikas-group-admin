


import React, { useContext, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Lottie from "lottie-react";
import Approval from '../../assets/images/approval.json';
import Rejected from '../../assets/images/rejected.json';
import { ApproveOrRejectQuotation } from 'services/Quotation Module/AddUpdateQuotationApi';
import { ConfigContext } from 'context/ConfigContext';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { Navigate, useNavigate } from 'react-router';
const ApprovedRejectQuotationModal = ({ show, onHide, modelRequestData, }) => {
  const [remark, setRemark] = useState(''); // Track the remark input
  const [remarkError, setRemarkError] = useState(''); // Track the validation error
  const { setLoader, user } = useContext(ConfigContext);

  const [modelAction, setModelAction] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();


  const validateRemark = () => {
    if (!remark.trim()) {
      setRemarkError('This Field is required.');
      return false;
    }
    setRemarkError('');
    return true;
  };

  const handleClose = () => {
    setRemark('');
    setRemarkError('');
    onHide();
  };

  const handleSubmit = async (isApprove) => {
    if (!validateRemark()) return;


    const apiParam = {
      userKeyID: user.userKeyID,
      leadKeyID: modelRequestData.leadKeyID,
      approveRejectRemark: remark,
      isApprove: isApprove, // true for approve, false for reject
      quotationUrl: null
    };

    ApproveOrRejectQuotationData(apiParam);

  };
  const navigate = useNavigate()
  const closeAllModal = () => {
    onHide()
    navigate('/quotation-list')
    setShowSuccessModal(false)
  }

  const ApproveOrRejectQuotationData = async (apiParam) => {
    debugger
    setLoader(true);
    try {
      let url = '/ApproveOrRejectQuotation'; // Default URL for Adding Data

      const response = await ApproveOrRejectQuotation(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          debugger
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === 'ApprovedQuote'
              ? 'Quotation Approved Successfully!'
              : 'Quotation Rejected Successfully!'
          );


        } else {
          setLoader(false);
          setErrorMessage(response?.response?.data?.errorMessage);
        }
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
    if (e.target.value.trim()) {
      setRemarkError('');
    }
  };
  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          onHide();
          handleClose();
        }}
        backdrop="static"
        keyboard={false}
        centered
        style={{ zIndex: '1300' }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modelRequestData.Action === 'AcceptDeviceConfirm' &&
              (modelRequestData.subAction === 'RejectDevice' ? 'Reject Device' : 'Accept Device')}
            {modelRequestData.Action === 'ApprovedQuote' && 'Approve Quotation'}
            {modelRequestData.Action === 'RejectedQuote' && 'Reject Quotation'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '68vh', }}>
          <>
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100%' }}>
              {modelRequestData.Action === 'ApprovedQuote' && (
                <Lottie animationData={Approval} style={{ width: 180, height: 110 }} />

              )}
              {modelRequestData.Action === 'RejectedQuote' && (
                <Lottie animationData={Rejected} style={{ width: 180, height: 110 }} />

              )}

              <b>
                {modelRequestData.Action === 'RejectedQuote'
                  ? 'Are you sure you want to reject this quotation?'
                  : 'Are you sure you want to approve this quotation?'}
              </b>
            </div>

            <Form.Group controlId="remark" className="mx-auto mt-3" style={{ maxWidth: '400px' }}>
              <Form.Label>Remark *</Form.Label>

              <Form.Control
                as="textarea"
                placeholder="Enter your remark"
                value={remark}
                onChange={handleRemarkChange}
                isInvalid={!!remarkError}
              />

              <span style={{ color: 'red' }}>{remarkError}</span>
            </Form.Group>

          </>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-end">
          {modelRequestData.Action === 'RejectedQuote' && (
            <Button variant="danger" onClick={() => handleSubmit(false)}>
              Reject
            </Button>

          )}
          {modelRequestData.Action === 'ApprovedQuote' && (
            <Button variant="success" onClick={() => handleSubmit(true)}>
              Accept
            </Button>

          )}


        </Modal.Footer>
      </Modal>
      <SuccessPopupModal
        show={showSuccessModal}
        onHide={() => closeAllModal()}
        setShowSuccessModal={setShowSuccessModal}
        modelAction={modelAction}
      />
    </>
  );
};

export default ApprovedRejectQuotationModal;
