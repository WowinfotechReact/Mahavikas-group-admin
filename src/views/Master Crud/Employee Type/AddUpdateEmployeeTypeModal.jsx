import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { AddUpdateStateApi, GetStateModel } from 'services/Master Crud/MasterStateApi';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { AddUpdateEmployeeType, GetEmployeeTypeModel } from 'services/Employee Type List/EmployeeTypeListApi';

const AddUpdateEmployeeTypeModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user } = useContext(ConfigContext);
  const [masterStateObj, setMasterStateObj] = useState({
    userKeyID: null,
    employeeTypeKeyID: null,
    employeeTypeName: null
  });

  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.employeeTypeKeyID !== null) {
        GetEmployeeTypeModelData(modelRequestData.employeeTypeKeyID);
      }
    }
  }, [modelRequestData?.Action]);

  const AddStateBtnClick = () => {
    let isValid = false;
    if (masterStateObj.employeeTypeName === null || masterStateObj.employeeTypeName === undefined || masterStateObj.employeeTypeName.trim() === '') {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    const apiParam = {
      userKeyID: user.userKeyID,
      employeeTypeName: masterStateObj?.employeeTypeName,
      employeeTypeKeyID: modelRequestData?.employeeTypeKeyID
    };


    if (!isValid) {
      AddUpdateEmployeeTypeData(apiParam);
    }
  };

  const AddUpdateEmployeeTypeData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateEmployeeType'; // Default URL for Adding Data

      const response = await AddUpdateEmployeeType(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Employee Type Added Successfully!'
              : 'Employee Type Updated Successfully!'
          );

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

  const GetEmployeeTypeModelData = async (id) => {
    // debugger
    if (id === undefined) {
      return;
    }
    setLoader(true);

    try {
      const data = await GetEmployeeTypeModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = data.data.responseData.data;

        setMasterStateObj({
          ...masterStateObj,
          userKeyID: ModelData.userKeyID,
          employeeTypeKeyID: modelRequestData.employeeTypeKeyID,
          employeeTypeName: ModelData.employeeTypeName
        });
      } else {
        setLoader(false);
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
              {modelRequestData?.Action !== null ? 'Update Employee Type' : modelRequestData?.Action === null ? 'Add Employee Type' : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="row">
              <div>
                <label htmlFor="StateName" className="form-label">
                  Employee Type Name
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={20}
                  type="text"
                  className="form-control"
                  id="StateName"
                  placeholder="Enter Employee Type Name"
                  aria-describedby="Employee"
                  value={masterStateObj.employeeTypeName}
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

                    setMasterStateObj((prev) => ({
                      ...prev,
                      employeeTypeName: updatedValue
                    }));
                  }}
                />

                {error &&
                  (masterStateObj.employeeTypeName === null || masterStateObj.employeeTypeName === undefined || masterStateObj.employeeTypeName === '') ? (
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
    </>
  );
};

export default AddUpdateEmployeeTypeModal;
