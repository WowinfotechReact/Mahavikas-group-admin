


import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import resetImg from '../../assets/images/OIP (1).jpg'
function ResetIMEIModal({ show, onHide, modelRequestData, resetBtnClick }) {

  return (
    <Modal backdrop="static" keyboard={false} style={{ zIndex: 1300 }} show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <b>Reset IMEI</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column align-items-center text-center">
          {/* Animated Image */}
          <img
            src={resetImg}
            alt="Reset Confirmation"
            className="animated-img "
            width={100} // Adjust size as needed
          />
          {/* Message */}
          <h5>Are you sure you want to reset the IMEI/MAC address ?</h5>

        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          <b>Close</b>
        </Button>
        <button onClick={resetBtnClick} className='btn text-white' style={{ background: '#ff7d34' }} >
          <b>Yes, Reset</b>
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ResetIMEIModal;
