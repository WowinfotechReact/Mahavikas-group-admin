import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { GetStateModel } from 'services/Master Crud/MasterStateApi';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { AddUpdateSimOperator, GetSimOperatorModel } from 'services/Operator/OperatorApi';

const MasterOperatorModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {

  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user } = useContext(ConfigContext);
  const [masterOperatorObj, setMasterOperatorObj] = useState({
    userKeyID: null,
    simOperatorID: null,
    simOperatorName: null
  });

  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.simOperatorID !== null) {
        GetMasterStateModalData(modelRequestData.simOperatorID);
      }
    }
  }, [modelRequestData?.Action]);

  const AddStateBtnClick = () => {
    let isValid = false;
    if (masterOperatorObj.simOperatorName === null || masterOperatorObj.simOperatorName === undefined || masterOperatorObj.simOperatorName.trim() === '') {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    const apiParam = {
      userKeyID: user.userKeyID,
      simOperatorName: masterOperatorObj.simOperatorName,
      simOperatorID: masterOperatorObj.simOperatorID
    };

    if (!isValid) {
      AddUpdateStateData(apiParam);
    }
  };

  const AddUpdateStateData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateSimOperator'; // Default URL for Adding Data

      const response = await AddUpdateSimOperator(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Operator Added Successfully!'
              : 'Operator Updated Successfully!'
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
      const data = await GetSimOperatorModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = data.data.responseData.data; // Assuming data is an array

        setMasterOperatorObj({
          ...masterOperatorObj,
          simOperatorID: ModelData.simOperatorID,
          userKeyID: ModelData.userKeyID,
          simOperatorName: ModelData.simOperatorName,
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
              {modelRequestData?.Action !== null ? 'Update Operator' : modelRequestData?.Action === null ? 'Add Operator' : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="row">
              <div>
                <label htmlFor="StateName" className="form-label">
                  Operator Name
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={20}
                  type="text"
                  className="form-control"
                  id="StateName"
                  placeholder="Enter Operator Name"
                  aria-describedby="Employee"
                  value={masterOperatorObj.simOperatorName}
                  onChange={(e) => {
                    setErrorMessage(false);
                    let inputValue = e.target.value;

                    // Prevent input if empty or a single leading space
                    if (inputValue.length === 0 || (inputValue.length === 1 && inputValue === ' ')) {
                      inputValue = '';
                    }

                    // Allow only letters, numbers, and spaces
                    const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                    // Trim leading spaces only (optional, if you want to prevent leading spaces)
                    const trimmedValue = cleanedValue.trimStart();

                    // Capitalize first letter of every word
                    const updatedValue = trimmedValue
                      .split(' ')
                      .map(word => {
                        if (word.length === 0) return ''; // keep multiple spaces intact if any
                        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                      })
                      .join(' ');

                    setMasterOperatorObj((prev) => ({
                      ...prev,
                      simOperatorName: updatedValue
                    }));
                  }}
                />


                {error &&
                  (masterOperatorObj.simOperatorName === null || masterOperatorObj.simOperatorName === undefined || masterOperatorObj.simOperatorName === '') ? (
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
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button type="submit" className="btn btn-primary text-center" onClick={() => AddStateBtnClick()}>
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

      {/* <CusModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} vehicleObj={vehicleObj} /> */}
    </>
  );
};

export default MasterOperatorModal;
