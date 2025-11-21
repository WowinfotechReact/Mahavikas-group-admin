import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { GetStateModel } from 'services/Master Crud/MasterStateApi';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { AddUpdateDesignation, GetDesignationModel } from 'services/Master Crud/Designationapi';

const AddUpdateDesignationModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user } = useContext(ConfigContext);
  const [masterDesignationObj, setMasterDesignationObj] = useState({
    userKeyID: null,
    designationKeyID: null,
    designationName: null
  });

  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.designationKeyID !== null) {
        GetMasterDesignationModalData(modelRequestData.designationKeyID);
      }
    }
  }, [modelRequestData?.Action]);

  const AddStateBtnClick = () => {
    let isValid = false;
    if (masterDesignationObj.designationName === null || masterDesignationObj.designationName === undefined || masterDesignationObj.designationName.trim() === '') {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    const apiParam = {
      userKeyID: user.userKeyID,
      designationName: masterDesignationObj.designationName,
      designationKeyID: modelRequestData?.designationKeyID
    };

    console.log(JSON.stringify(apiParam, null, 2));
    if (!isValid) {
      AddUpdateDesignationData(apiParam);
    }
  };

  const AddUpdateDesignationData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateDesignation'; // Default URL for Adding Data

      const response = await AddUpdateDesignation(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Designation Added Successfully!'
              : 'Designation Updated Successfully!'
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

  const GetMasterDesignationModalData = async (id) => {
    if (id === undefined) {
      return;
    }
    setLoader(true);

    try {
      const data = await GetDesignationModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = data.data.responseData.data; // Assuming data is an array

        setMasterDesignationObj({
          ...masterDesignationObj,
          userKeyID: ModelData.userKeyID,
          designationKeyID: ModelData.designationKeyID,
          designationName: ModelData.designationName
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
              {modelRequestData?.Action !== null ? 'Update Designation' : modelRequestData?.Action === null ? 'Add Designation' : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="row">
              <div>
                <label htmlFor="StateName" className="form-label">
                  Designation Name
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={20}
                  type="text"
                  className="form-control"
                  id="StateName"
                  placeholder="Enter Designation Name"
                  aria-describedby="Employee"
                  value={masterDesignationObj.designationName}
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
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');

                    setMasterDesignationObj((prev) => ({
                      ...prev,
                      designationName: updatedValue
                    }));
                  }}
                />

                {error &&
                  (masterDesignationObj.designationName === null || masterDesignationObj.designationName === undefined || masterDesignationObj.designationName === '') ? (
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
          <button type="submit" className="btn text-white text-center" style={{ background: '#ffaa33' }} onClick={() => AddStateBtnClick()}>
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

export default AddUpdateDesignationModal;
