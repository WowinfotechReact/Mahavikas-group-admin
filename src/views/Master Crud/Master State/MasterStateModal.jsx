import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { AddUpdateStateApi, GetStateModel } from 'services/Master Crud/MasterStateApi';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';

const AddUpdateMasterStateModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {

  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user } = useContext(ConfigContext);
  const [masterStateObj, setMasterStateObj] = useState({
    userKeyID: null,
    stateID: null,
    stateName: null
  });

  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.stateID !== null) {
        GetMasterStateModalData(modelRequestData.stateID);
      }
    }
  }, [modelRequestData?.Action]);

  const AddStateBtnClick = () => {
    let isValid = false;
    if (masterStateObj.stateName === null || masterStateObj.stateName === undefined || masterStateObj.stateName.trim() === '') {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    const apiParam = {
      userKeyID: user.userKeyID,
      stateName: masterStateObj.stateName,
      stateID: modelRequestData?.stateID
    };

    if (!isValid) {
      AddUpdateStateData(apiParam);
    }
  };

  const AddUpdateStateData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateState'; // Default URL for Adding Data

      const response = await AddUpdateStateApi(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'State Added Successfully!'
              : 'State Updated Successfully!'
          ); //Do not change this naming convention

          setIsAddUpdateActionDone(true);
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

  const closeAllModal = () => {
    onHide();
    setShowSuccessModal(false);
  };

  const GetMasterStateModalData = async (id) => {
    if (id === undefined) {
      return;
    }
    setLoader(true);

    try {
      const data = await GetStateModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = data.data.responseData.data; // Assuming data is an array

        setMasterStateObj({
          ...masterStateObj,
          adminID: ModelData.adminID,
          userKeyID: ModelData.userKeyID,
          stateID: ModelData.stateID,
          stateName: ModelData.stateName
        });
      } else {
        setLoader(false);

        // Handle non-200 status codes if necessary
        console.error('Error fetching data: ', data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);

      console.error('Error in state: ', error);
    }
  };

  return (
    <>
      <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {modelRequestData?.Action !== null ? 'Update State' : modelRequestData?.Action === null ? 'Add State' : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="row">
              <div>
                <label htmlFor="StateName" className="form-label">
                  State Name
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={20}
                  type="text"
                  className="form-control"
                  id="StateName"
                  placeholder="Enter State Name"
                  aria-describedby="Employee"
                  value={masterStateObj.stateName}
                  onChange={(e) => {
                    setErrorMessage(false);
                    let inputValue = e.target.value;

                    // Prevent input if empty or only a leading space
                    if (inputValue.length === 0 || (inputValue.length === 1 && inputValue === ' ')) {
                      inputValue = '';
                    }

                    // Remove unwanted characters (allow letters, numbers, spaces)
                    const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                    // Trim only leading spaces
                    const trimmedValue = cleanedValue.trimStart();

                    // Capitalize first letter of every word
                    const updatedValue = trimmedValue
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');

                    setMasterStateObj(prev => ({
                      ...prev,
                      stateName: updatedValue
                    }));
                  }}
                />

                {error &&
                  (masterStateObj.stateName === null || masterStateObj.stateName === undefined || masterStateObj.stateName === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
                {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>

          <button
            style={{ background: '#ffaa33' }} className="btn text-white  btn-sm d-none d-sm-inline"

            type="submit" onClick={() => AddStateBtnClick()}>
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

      {/* <CusModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} vehicleObj={vehicleObj} /> */}
    </>
  );
};

export default AddUpdateMasterStateModal;
