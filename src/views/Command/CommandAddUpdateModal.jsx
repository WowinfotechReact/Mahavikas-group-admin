import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import { AddUpdateCommandApi } from 'services/Command/CommandApi';
import { ERROR_MESSAGES } from 'component/GlobalMassage';

const CommandAddUpdateModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const { user, setLoader } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [commandObj, setCommandObj] = useState({
    userKeyID: null,
    vehicleKeyID: null,
    commandKeyID: null,
    manufacturerModelKeyID: null,
    commandName: null,
    commandDescription: null
  });

 

  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.commandKeyID !== null) {
        GetMasterVehicleTypeModalData(modelRequestData?.commandKeyID);
      }
    }
  }, [modelRequestData?.Action]);
  

 
 
  const AddVehicleBtnClick = () => {
    let isValid = false;

    if (
      commandObj.commandName === null ||
      commandObj.commandName === undefined ||
      commandObj.commandName === '' ||
      commandObj.commandDescription === '' ||
      commandObj.commandDescription === '' ||
      commandObj.commandDescription === ''
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    const apiParam = {
      userKeyID: user.userKeyID,
      commandDescription:commandObj.commandDescription,
      commandName:commandObj.commandName
    };

    if (!isValid) {
      AddUpdateCommandData(apiParam);
    }
  };

  const AddUpdateCommandData = async (apiParam) => {
    try {
      let url = '/AddUpdateCommand'; // Default URL for Adding Data

      const response = await AddUpdateCommandApi(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Command Added Successfully!'
              : ' Command Updated Successfully!'
          ); //Do not change this naming convention

          setIsAddUpdateActionDone(true);
        } else {
          setErrorMessage(response?.response?.data?.errorMessage);
        }
      }
    } catch (error) {
      console.error(error);
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
              {modelRequestData?.Action !== null ? 'Edit Command' : modelRequestData?.Action === null ? 'Add Command' : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            {/* <div className="row">
             */}

            <div className="col-12 col-md-12 mb-2">
              <div>
                <label htmlFor="commandName" className="form-label">
                  Command Name
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={50}
                  type="text"
                  className="form-control"
                  id="commandName"
                  placeholder="Enter Command Name"
                  aria-describedby="Employee"
                  value={commandObj.commandName}
                  onChange={(e) => {
                    let InputValue = e.target.value;
                    const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s]/g, '');
                    setCommandObj((prev) => ({
                      ...prev,
                      commandName: updatedValue
                    }));
                  }}
                />
                {error &&
                (commandObj.commandName === null || commandObj.commandName === undefined || commandObj.commandName === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="col-12 col-md-12 mb-2">
              <div>
                <label htmlFor="commandDescription" className="form-label">
                  Command Description
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={50}
                  type="text"
                  className="form-control"
                  id="commandDescription"
                  placeholder="Enter Command Description."
                  aria-describedby="Employee"
                  value={commandObj.commandDescription}
                  onChange={(e) => {
                    let InputValue = e.target.value;
                    const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s]/g, '');
                    setCommandObj((prev) => ({
                      ...prev,
                      commandDescription: updatedValue
                    }));
                  }}
                />
                {error &&
                (commandObj.commandDescription === null || commandObj.commandDescription === undefined || commandObj.commandDescription === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>
            {/* </div> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button type="submit" className="btn btn-primary text-center" onClick={() => AddVehicleBtnClick()}>
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

export default CommandAddUpdateModal;
