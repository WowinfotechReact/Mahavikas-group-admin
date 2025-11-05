import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { GetStateModel, AddUpdateStateApi } from 'services/Master Crud/MasterGovPortalApi';

const MasterGovPortalDataModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {

  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user } = useContext(ConfigContext);
  const [masterGovPortalObj, setMasterGovPortalObj] = useState({
    userKeyID: null,
    governmentPortalName: null,
    govtPortalCategoryID: null,
    govtPortalCategoryID: null
  });

  useEffect(() => {
    if (modelRequestData?.Action === 'Update' || modelRequestData?.govtPortalCategoryID !== null) {
      if (modelRequestData?.govtPortalCategoryID !== null) {
        GetMasterGovPortalModalData(modelRequestData.govtPortalCategoryID);
      }
    }
  }, [modelRequestData?.Action]);

  const AddGovPortalBtnClick = () => {
    let isValid = false;
    if (masterGovPortalObj.governmentPortalName === null || masterGovPortalObj.governmentPortalName === undefined || masterGovPortalObj.governmentPortalName.trim() === '') {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    const apiParam = {
      userKeyID: user.userKeyID,
      governmentPortalName: masterGovPortalObj.governmentPortalName,
      governmentPortalKeyID: modelRequestData?.govtPortalCategoryID
    };

    if (!isValid) {
      AddUpdateStateData(apiParam);
    }
  };

  const AddUpdateStateData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateGovtPortal'; // Default URL for Adding Data

      const response = await AddUpdateStateApi(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Government Portal Data Added Successfully!'
              : 'Government Portal Data Updated Successfully!'
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

  const GetMasterGovPortalModalData = async (id) => {
    if (id === undefined) {
      return;
    }

    setLoader(true);
    try {
      const data = await GetStateModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = data.data.responseData.data; // Assuming data is an array

        setMasterGovPortalObj({
          ...masterGovPortalObj,
          adminID: ModelData.adminID,
          userKeyID: ModelData.userKeyID,
          governmentPortalKeyID: ModelData.governmentPortalKeyID,
          governmentPortalName: ModelData.governmentPortalName
        });
      } else {
        setLoader(false);

        // Handle non-200 status codes if necessary
        console.error('Error fetching data: ', data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);

      console.error('Error in gov portal ModalData: ', error);
    }
  };

  return (
    <>
      <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {modelRequestData?.Action !== null ? 'Update Portal' : modelRequestData?.Action === null ? 'Add Portal' : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="row">
              <div>
                <label htmlFor="governmentPortalName" className="form-label">
                  Government Portal Name
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={20}
                  type="text"
                  className="form-control"
                  id="governmentPortalName"
                  placeholder="Enter Government Portal"
                  aria-describedby="Employee"
                  value={masterGovPortalObj.governmentPortalName}
                  onChange={(e) => {
                    setErrorMessage(false);
                    let inputValue = e.target.value;

                    // Prevent input if it starts with only space
                    if (inputValue.length === 1 && inputValue === ' ') {
                      inputValue = '';
                    }

                    // Remove unwanted characters (allow letters, numbers, and spaces)
                    const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                    // Capitalize the first letter of each word
                    const updatedValue = cleanedValue.replace(/\b\w/g, (char) => char.toUpperCase());

                    setMasterGovPortalObj((prev) => ({
                      ...prev,
                      governmentPortalName: updatedValue
                    }));
                  }}
                />

                {error &&
                  (masterGovPortalObj.governmentPortalName === null || masterGovPortalObj.governmentPortalName === undefined || masterGovPortalObj.governmentPortalName === '') ? (
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
          <Button type="submit" className="btn btn-primary text-center" onClick={() => AddGovPortalBtnClick()}>
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

export default MasterGovPortalDataModal;
