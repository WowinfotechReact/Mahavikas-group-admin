import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import acceptReject from '../../src/assets/images/acceptReject.gif';
const DeviceConfirmationModal = ({ show, onHide, UpdatedStatus, modelRequestData, }) => {
  const [isRejectClicked, setIsRejectClicked] = useState(false); // Track Reject button click
  const [remark, setRemark] = useState(''); // Track the remark input
  const [remarkError, setRemarkError] = useState(''); // Track the validation error

  const validateRemark = () => {
    if (remark.trim() === '' || remark === undefined || remark === null) {
      setRemarkError('This Field is required.');
      return false;
    }
    setRemarkError('');
    return true;
  };

  const handleClose = () => {
    setIsRejectClicked(false);
    setRemark('');
    setRemarkError('');
    onHide();
  };
  // Handle Reject click with remark validation
  const handleReject = async () => {
    if (validateRemark()) {
      const apiParam = {
        employeeKeyID: modelRequestData.employeeKeyID,
        userKeyID: modelRequestData.userKeyID,
        acceptRejectRemark: remark, // Use remark value,
        acceptRejectStatus: false,
        deviceID: modelRequestData.deviceID
      };
      await UpdatedStatus(apiParam); // Call UpdatedStatus with dynamic parameters
      // onHide();
      handleClose();
    }
  };
  const handleApprove = async () => {
    const apiParam = {
      userKeyID: modelRequestData.userKeyID,
      employeeKeyID: modelRequestData.employeeKeyID,
      acceptRejectRemark: remark,
      acceptRejectStatus: true,
      deviceID: modelRequestData.deviceID
    };
    await UpdatedStatus(apiParam); // Call UpdatedStatus with dynamic parameters
    handleClose();
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
            {modelRequestData.Action === 'AcceptDeviceConfirm' && (
              <div>{modelRequestData.subAction === 'RejectDevice' ? 'Reject Device' : 'Accept Device'}</div>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '68vh', overflow: 'scroll' }}>
          <>
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100%' }}>
              {modelRequestData.Action === 'AcceptDeviceConfirm' && (
                <img
                  alt="Logo"
                  src={acceptReject}
                  trigger="loop"
                  colors="primary:#f7b84b,secondary:#f06548"
                  style={{ width: '95px', height: '80px' }}
                />
              )}

              {modelRequestData.subAction === 'RejectDevice' ? (
                <b>Are you sure you want to reject this device?</b>
              ) : (
                <b>Are you sure you want to accept this device? </b>
              )}
            </div>
            {modelRequestData.Action === 'AcceptDeviceConfirm' && (
              modelRequestData.subAction === 'RejectDevice' && (

                <Form.Group controlId="remark" className="mx-auto mt-3" style={{ maxWidth: '400px' }}>
                  <Form.Label>Remark</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your remark"
                    value={remark}
                    onChange={handleRemarkChange}
                    isInvalid={!!remarkError}
                  />
                  <span style={{ color: 'red' }}>{remarkError}</span>
                </Form.Group>
              )
            )}
          </>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-end">
          {modelRequestData.Action === 'AcceptDeviceConfirm' && (
            <div className="mt-3">
              {modelRequestData.subAction === 'RejectDevice' ? (
                <Button className="btn btn-danger me-2" onClick={handleReject}>
                  Reject Device
                </Button>
              ) : (
                <Button className="btn btn-success" onClick={handleApprove}>
                  Accept Device
                </Button>
              )}
            </div>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeviceConfirmationModal;
