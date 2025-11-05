import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
const MachineModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const common = useSelector((state) => state.Storage);
  const [unitList, setUnitList] = useState([]);
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
const [secondModalOpen,setSecondModalOpen]=useState()
  const [machineObj, setMachineObj] = useState({
    adminID: null,
    machineID: null,
    machineName: null,
    price: null,
    gstPercentage: null,
    labourCharges: null,
    unitID: null
  });

 
  const AddMachineBtnClick = () => {
    alert('ok')
  };

 
  const closeAllModal = () => {
    setSecondModalOpen(false)
    setShowSuccessModal(false);
  };

 


  

  return (
    <>
      <Modal size='md' show={show} style={{zIndex:1300}} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {modelRequestData?.Action !== null ? 'Machine Type' : modelRequestData?.Action === null ? 'Machine Type' : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{maxHeight:'55vh',overflow:'overlay'}}>
          <div className="container">
            <div className="col-12 mb-3">
              <div>
                <label htmlFor="machineName" className="form-label">
                  Machine Name
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={50}
                  type="text"
                  className="form-control"
                  id="machineName"
                  placeholder="Enter Machine Name"
                  aria-describedby="Employee"
                  value={machineObj.machineName}
                  onChange={(e) => {
                    let InputValue = e.target.value;
                    const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s]/g, '');
                    setMachineObj((prev) => ({
                      ...prev,
                      machineName: updatedValue
                    }));
                  }}
                />
                {error && (machineObj.machineName === null || machineObj.machineName === undefined || machineObj.machineName === '') ? (
                  <span style={{color:'red'}}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>

            <div className="col-12 mb-3">
              <div>
                <label htmlFor="machinePrice" className="form-label">
                  Machine Price (₹)
                  <span style={{ color: 'red' }}>*</span>
                </label>

                <input
                  type="text"
                  id="machinePrice"
                  className="form-control"
                  value={
                    machineObj.price
                      ? machineObj.price
                          .toString()
                          .split('.')
                          .map((part, index) => (index === 0 ? part.replace(/(\d)(?=(\d\d)+\d$)/g, '$1,') : part))
                          .join('.')
                      : ''
                  }
                  onChange={(e) => {
                    setErrorMessage('');
                    let inputValue = e.target.value;

                    // Remove any non-digit characters except the decimal point
                    const sanitizedInput = inputValue
                      .replace(/[^0-9.]/g, '') // Allow only numeric and dot characters
                      .slice(0, 16); // Limit to 16 characters

                    // Split the input into integer and decimal parts
                    const [integerPart, decimalPart] = sanitizedInput.split('.');

                    // Combine integer and decimal parts with appropriate precision
                    let formattedInput =
                      decimalPart !== undefined ? `${integerPart.slice(0, 8)}.${decimalPart.slice(0, 2)}` : integerPart.slice(0, 8);

                    setMachineObj({
                      ...machineObj,
                      price: formattedInput
                    });
                  }}
                  placeholder="Enter Machine Price"
                />

                {error && (machineObj.price === null || machineObj.price === undefined || machineObj.price === '') ? (
                  <span style={{color:'red'}} >{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>
           
              
            
            <span className="text-center errorMassage">{errorMessage}</span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button type="submit" className="btn btn-primary text-center" onClick={() => AddMachineBtnClick()}>
            Submit
          </Button>
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

export default MachineModal;
