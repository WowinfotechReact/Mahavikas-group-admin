import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import SuccessPopupModal from 'component/SuccessPopupModal';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
const AssignLocationModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData, isValid }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [customerObj, setCustomerObj] = useState({
    name: null,
    address: null,
    mobileNo: null,
    aadharNo: null,
    aadharFrontImg: null,
    aadharBackImg: null
  });


  const AddCustomerBtnClick = () => {
    let isValid = false;
    if (
      customerObj.name === null ||
      customerObj.name === undefined ||
      customerObj.name === '' ||
      customerObj.address === null ||
      customerObj.address === undefined ||
      customerObj.address === '' ||
      customerObj.mobileNo === null ||
      customerObj.mobileNo === undefined ||
      customerObj.mobileNo === '' ||
      customerObj.aadharNo === null ||
      customerObj.aadharNo === undefined ||
      customerObj.aadharNo === '' ||
      customerObj.aadharFrontImg === null ||
      customerObj.aadharFrontImg === undefined ||
      customerObj.aadharFrontImg === '' ||
      customerObj.aadharBackImg === null ||
      customerObj.aadharBackImg === undefined ||
      customerObj.aadharBackImg === ''
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    const apiParam = {
      name: customerObj.name,
      address: customerObj.address,
      mobileNo: customerObj.mobileNo,
      aadharNo: customerObj.aadharNo,
      aadharFrontImg: customerObj.aadharFrontImg,
      aadharBackImg: customerObj.aadharBackImg
    };

    if (!isValid) {
      setIsModalOpen(true);
    }
  };


  const closeAllModal = () => {
    onHide();
    setShowSuccessModal(false);
  };


  return (
    <>
      <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {/* {modelRequestData?.Action !== null ? 'Edit Customer' : modelRequestData?.Action === null ? 'Add Customer' : ''} */}
              {modelRequestData?.Action !== null ? 'Assign Location ' : modelRequestData?.Action === null ? 'Add Customer' : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="col-12 mb-3">
              <div>
                <label htmlFor="customerAddress" className="form-label">
                  State
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select className="user-role-select phone-input-country-code" />
                {error && (customerObj.address === null || customerObj.address === undefined || customerObj.address === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>

            <div className="col-12 mb-3">
              <div>
                <label htmlFor="customerAddress" className="form-label">
                  city
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select className="user-role-select phone-input-country-code" />
                {error && (customerObj.address === null || customerObj.address === undefined || customerObj.address === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>

          </div>
        </Modal.Body>
        <Modal.Footer>
          <button variant="secondary" onClick={onHide}>
            Close
          </button>
          <button type="submit" className="btn btn-primary text-center" onClick={() => AddCustomerBtnClick()}>
            Submit
          </button>
        </Modal.Footer>
      </Modal>
      {showSuccessModal && (
        <SuccessPopupModal
          show={showSuccessModal}
          onHide={() => closeAllModal()}
          setShowSuccessModal={setShowSuccessModal}
          modelAction={modelAction}
        />
      )}
    </>
  );
};

export default AssignLocationModal;
