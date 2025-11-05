import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { AddUpdateManufacturerModelApi, GetManufacturerModel } from 'services/ManufactureModal/ManufcatureModalApi';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';

const ManufacturerAddUpdateModal = ({
  show,
  onHide,
  setIsAddUpdateActionDone,
  modelRequestData
}) => {
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user } = useContext(ConfigContext);

  const [manufacturerObj, setManufacturerObj] = useState({
    userKeyID: null,
    manufacturerKeyID: null,
    manufacturerName: null
  });

  useEffect(() => {
    if (show) {
      if (modelRequestData?.Action === 'Update' && modelRequestData?.manufacturerKeyID) {
        GetManufacturerModelData(modelRequestData.manufacturerKeyID);
      } else {
        // Always reset when modal opens for Add
        setManufacturerObj({
          userKeyID: null,
          manufacturerKeyID: null,
          manufacturerName: ''
        });
      }
      // Also reset errors and messages
      setErrors(false);
      setErrorMessage('');
    }
  }, [show, modelRequestData?.Action, modelRequestData?.manufacturerKeyID]);

  const AddManufacturerBtnClick = () => {
    let isValid = false;
    if (
      manufacturerObj.manufacturerName === null ||
      manufacturerObj.manufacturerName === undefined ||
      manufacturerObj.manufacturerName.trim() === ''
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    const apiParam = {
      userKeyID: user.userKeyID,
      manufacturerName: manufacturerObj?.manufacturerName,
      manufacturerKeyID: modelRequestData?.manufacturerKeyID
    };

    if (!isValid) {
      AddUpdateManufacturerData(apiParam);
    }
  };

  const AddUpdateManufacturerData = async (apiParam) => {
    setLoader(true);
    try {
      const url = '/AddUpdateManufacturer';

      const response = await AddUpdateManufacturerModelApi(url, apiParam);
      if (response?.data?.statusCode === 200) {
        setLoader(false);
        setShowSuccessModal(true);
        setModelAction(
          modelRequestData.Action === null || modelRequestData.Action === undefined
            ? 'Manufacturer Added Successfully!'
            : 'Manufacturer Updated Successfully!'
        );

        setIsAddUpdateActionDone(true);
      } else {
        setLoader(false);
        setErrorMessage(response?.response?.data?.errorMessage);
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

  const GetManufacturerModelData = async (id) => {
    if (!id) return;

    setLoader(true);
    try {
      const data = await GetManufacturerModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = data.data.responseData.data;

        setManufacturerObj({
          ...manufacturerObj,
          userKeyID: ModelData.userKeyID,
          manufacturerKeyID: modelRequestData.manufacturerKeyID,
          manufacturerName: ModelData.manufacturerName
        });
      } else {
        setLoader(false);
        console.error('Error fetching data: ', data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error in manufacturer: ', error);
    }
  };

  return (
    <>
      <Modal
        size="md"
        show={show}
        style={{ zIndex: 1300 }}
        onHide={onHide}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {modelRequestData?.Action !== null
                ? 'Update Manufacturer'
                : modelRequestData?.Action === null
                  ? 'Add Manufacturer'
                  : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="row">
              <div>
                <label htmlFor="ManufacturerName" className="form-label">
                  Manufacturer Name
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={50}
                  type="text"
                  className="form-control"
                  id="ManufacturerName"
                  placeholder="Enter Manufacturer Name"
                  value={manufacturerObj.manufacturerName || ''}
                  onChange={(e) => {
                    setErrorMessage(false);
                    let inputValue = e.target.value;

                    if (inputValue.length === 0 || (inputValue.length === 1 && inputValue === ' ')) {
                      inputValue = '';
                    }

                    // allow letters, numbers, space, and - . , & ()
                    const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s\[\].,&()_-]/g, '');
                    const trimmedValue = cleanedValue.trimStart();
                    const updatedValue = trimmedValue
                      .split(' ')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');

                    setManufacturerObj((prev) => ({
                      ...prev,
                      manufacturerName: updatedValue
                    }));
                  }}

                />

                {error &&
                  (!manufacturerObj.manufacturerName ||
                    manufacturerObj.manufacturerName === '') ? (
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
          <button
            type="submit"
            style={{ background: '#ffaa33' }}
            className="btn text-white text-center"
            onClick={AddManufacturerBtnClick}
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>

      {showSuccessModal && (
        <SuccessPopupModal
          show={showSuccessModal}
          onHide={closeAllModal}
          setShowSuccessModal={setShowSuccessModal}
          modelAction={modelAction}
        />
      )}
    </>
  );
};

export default ManufacturerAddUpdateModal;
