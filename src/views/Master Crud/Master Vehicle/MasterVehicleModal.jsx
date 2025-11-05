import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import { AddUpdateVehicleTypeApi, GetVehicleTypeModel } from 'services/Master Crud/MasterVehicleTypeApi';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
const MasterVehicleModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user } = useContext(ConfigContext);

  const [masterVehicleTypeObj, setMasterVehicleTypeObj] = useState({
    userKeyID: null,
    vehicleTypeKeyID: null,
    vehicleTypeName: null,
    vehicleAmount: null
  });

  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.vehicleTypeKeyID !== null) {
        GetMasterVehicleTypeModalData(modelRequestData.vehicleTypeKeyID);
      }
    }
  }, [modelRequestData?.Action]);

  const AddMasterVehicleTypeBtnClick = () => {
    // debugger;
    let isValid = false;
    if (
      masterVehicleTypeObj.vehicleTypeName === null ||
      masterVehicleTypeObj.vehicleTypeName === undefined ||
      masterVehicleTypeObj.vehicleTypeName === '' ||
      masterVehicleTypeObj.vehicleAmount === null ||
      masterVehicleTypeObj.vehicleAmount === undefined ||
      masterVehicleTypeObj.vehicleAmount === ''
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    const apiParam = {
      userKeyID: user.userKeyID,
      vehicleTypeName: masterVehicleTypeObj.vehicleTypeName,
      vehicleAmount: masterVehicleTypeObj.vehicleAmount,
      vehicleTypeKeyID: masterVehicleTypeObj.vehicleTypeKeyID
    };

    if (!isValid) {
      AddUpdateMasterVehicleTypeData(apiParam);
    }
  };

  const AddUpdateMasterVehicleTypeData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateVehicleType'; // Default URL for Adding Data

      const response = await AddUpdateVehicleTypeApi(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Vehicle Type Added Successfully!'
              : 'Vehicle Type Updated Successfully!'
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

  const GetMasterVehicleTypeModalData = async (id) => {
    setLoader(false);
    if (id === undefined) {
      return;
    }

    try {
      const data = await GetVehicleTypeModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = data.data.responseData.data; // Assuming data is an array

        setMasterVehicleTypeObj({
          ...masterVehicleTypeObj,
          userKeyID: ModelData.userKeyID,
          vehicleTypeKeyID: ModelData.vehicleTypeKeyID,
          vehicleTypeName: ModelData.vehicleTypeName,
          vehicleAmount: ModelData.vehicleAmount
        });
      } else {
        setLoader(false);
        // Handle non-200 status codes if necessary
        console.error('Error fetching data: ', data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error in GetVehicleModalData: ', error);
    }
  };

  return (
    <>
      <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {modelRequestData?.Action !== null ? 'Update Vehicle type' : modelRequestData?.Action === null ? 'Add Vehicle type' : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="col-12 mb-3">
              <label htmlFor="vehicleTypeName" className="form-label">
                Vehicle Type Name
                <span style={{ color: 'red' }}>*</span>
              </label>
              <input
  maxLength={50}
  type="text"
  className="form-control"
  id="vehicleTypeName"
  placeholder="Enter Vehicle Type Name"
  value={masterVehicleTypeObj.vehicleTypeName}
  onChange={(e) => {
    setErrorMessage(false);
    let inputValue = e.target.value;

    // Prevent input if only a space at start
    if (inputValue.length === 1 && inputValue === ' ') {
      inputValue = '';
    }

    // Remove unwanted characters (allow letters, numbers, and spaces)
    const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

    // Capitalize the first letter of each word
    const updatedValue = cleanedValue.replace(/\b\w/g, (char) => char.toUpperCase());

    setMasterVehicleTypeObj((prev) => ({
      ...prev,
      vehicleTypeName: updatedValue
    }));
  }}
/>

              {error &&
              (masterVehicleTypeObj.vehicleTypeName === null ||
                masterVehicleTypeObj.vehicleTypeName === undefined ||
                masterVehicleTypeObj.vehicleTypeName === '') ? (
                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
              {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
            </div>
            <div className="col-12 mb-3">
              <label htmlFor="vechileAmt" className="form-label">
                Vehicle Amount ⟨₹⟩
                <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                maxLength={7}
                type="text"
                className="form-control"
                id="vechileAmt"
                placeholder="Enter Vehicle Amount ⟨₹⟩"
                aria-describedby="Employee"
                value={masterVehicleTypeObj.vehicleAmount}
                onChange={(e) => {
                  +setErrorMessage(false);
                  let InputValue = e.target.value;
                  // Allow only digits
                  const updatedValue = InputValue.replace(/[^0-9]/g, '');
                  setMasterVehicleTypeObj((prev) => ({
                    ...prev,
                    vehicleAmount: updatedValue
                  }));
                }}
              />
              {error &&
              (masterVehicleTypeObj.vehicleAmount === null ||
                masterVehicleTypeObj.vehicleAmount === undefined ||
                masterVehicleTypeObj.vehicleAmount === '') ? (
                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
              {/* {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>} */}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button type="submit" className="btn btn-primary text-center" onClick={() => AddMasterVehicleTypeBtnClick()}>
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

export default MasterVehicleModal;
