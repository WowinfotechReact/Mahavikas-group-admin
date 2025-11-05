import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import { AddUpdateComplaintTypeApi, GetComplaintTypeModel } from 'services/Master Crud/MasterComplaintTypeApi';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
const MasterComplaintTypeModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user } = useContext(ConfigContext);

  const [masterComplaintTypeObj, setMasterComplaintTypeObj] = useState({
    userKeyID: null,
    complaintType: null,
    complaintTypeKeyID: null
  });

  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.complaintTypeKeyID !== null) {
        GetMasterComplaintTypeModalData(modelRequestData.complaintTypeKeyID);
      }
    }
  }, [modelRequestData?.Action]);

  const AddMasterComplaintTypeBtnClick = () => {
    // debugger;
    let isValid = false;
    if (
      masterComplaintTypeObj.complaintType === null ||
      masterComplaintTypeObj.complaintType === undefined ||
      masterComplaintTypeObj.complaintType === ''
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    const apiParam = {
      userKeyID: user.userKeyID,
      complaintTypeKeyID: masterComplaintTypeObj.complaintTypeKeyID,
      complaintType: masterComplaintTypeObj.complaintType
    };

    if (!isValid) {
      AddUpdateMasterComplaintTypeData(apiParam);
    }
  };

  const AddUpdateMasterComplaintTypeData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateComplaintType'; // Default URL for Adding Data

      const response = await AddUpdateComplaintTypeApi(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Complaint Type Added Successfully!'
              : 'Complaint Type Updated Successfully!'
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

  const GetMasterComplaintTypeModalData = async (id) => {
    if (id === undefined) {
      return;
    }
    setLoader(true);

    try {
      const data = await GetComplaintTypeModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = data.data.responseData.data; // Assuming data is an array

        setMasterComplaintTypeObj({
          ...masterComplaintTypeObj,
          userKeyID: ModelData.userKeyID,
          complaintType: ModelData.complaintType,
          complaintTypeKeyID: ModelData.complaintTypeKeyID
        });
      } else {
        setLoader(false);
        // Handle non-200 status codes if necessary
        console.error('Error fetching data: ', data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error in complaint: ', error);
    }
  };

  return (
    <>
      <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {modelRequestData?.Action !== null ? 'Update Complaint Type' : modelRequestData?.Action === null ? 'Add Complaint Type' : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="row">
              <div>
                <label htmlFor="ComplaintType" className="form-label">
                  Complaint Type Name
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={25}
                  type="text"
                  className="form-control"
                  id="ComplaintType"
                  placeholder="Enter Complaint Type"
                  aria-describedby="Employee"
                  value={masterComplaintTypeObj.complaintType}
                  onChange={(e) => {
                    setErrorMessage(false);
                    let inputValue = e.target.value;

                    // Prevent input if only a space at the beginning
                    if (inputValue.length === 1 && inputValue === ' ') {
                      inputValue = '';
                    }

                    // Remove unwanted characters (allow letters, numbers, and spaces)
                    const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                    // Capitalize the first letter of each word
                    const updatedValue = cleanedValue.replace(/\b\w/g, (char) => char.toUpperCase());

                    setMasterComplaintTypeObj((prev) => ({
                      ...prev,
                      complaintType: updatedValue
                    }));
                  }}
                />

                {error &&
                  (masterComplaintTypeObj.complaintType === null ||
                    masterComplaintTypeObj.complaintType === undefined ||
                    masterComplaintTypeObj.complaintType === '') ? (
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
          <Button type="submit" className="btn btn-primary text-center" onClick={() => AddMasterComplaintTypeBtnClick()}>
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

export default MasterComplaintTypeModal;
