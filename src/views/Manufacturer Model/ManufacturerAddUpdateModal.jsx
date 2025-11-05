 


 import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import { AddUpdateManufacturerModelApi,   } from 'services/ManufactureModal/ManufcatureModalApi';
import { useLocation } from 'react-router';
import { ERROR_MESSAGES } from 'component/GlobalMassage';

const ManufacturerAddUpdateModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const { user, setLoader,companyID } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [manufacturerModalObj, setManufacturerModalObj] = useState({
    userKeyID: null,
    manufacturerKeyID: null,
    companyKeyID: null,
    modelNumber: null,
    manufacturerModelKeyID:null    
  });
  const location=useLocation()

  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.manufacturerModelKeyID !== null) {
      }
    }
  }, [modelRequestData?.Action]);

 

  

  const AddManufactureModalBtnClick = async () => {
    let isValid = false;

    if (
      manufacturerModalObj.modelNumber === null ||
      manufacturerModalObj.modelNumber === undefined ||
      manufacturerModalObj.modelNumber === '' 
     
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    const apiParam = {
      userKeyID: user.userKeyID,
      companyKeyID: companyID,
      modelNumber: manufacturerModalObj.modelNumber,
      manufacturerKeyID:location?.state?.manufacturerKeyID,
      manufacturerModelKeyID:manufacturerModalObj.manufacturerModelKeyID   
      
     
    };

    if (!isValid) {
      AddUpdateManufacturerModalData(apiParam);
    }
  };

  const AddUpdateManufacturerModalData = async (apiParam) => {
    setLoader(true)
    try {
      let url = '/AddUpdateManufacturerModel'; // Default URL for Adding Data

      const response = await AddUpdateManufacturerModelApi(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false)
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Manufacturer Model Added Successfully!'
              : 'Manufacturer Model Updated Successfully!'
          ); //Do not change this naming convention

          setIsAddUpdateActionDone(true);
        } else {
          setLoader(false)
          setErrorMessage(response?.response?.data?.errorMessage);
        }
      }
    } catch (error) {
      setLoader(false)
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
              {modelRequestData?.Action !== null ? 'Update Manufacturer Model' : modelRequestData?.Action === null ? 'Add Manufacturer Model' : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            {/* modal and legal  */}
              <div className="row">
                <div>
                  <label htmlFor="modelNumber" className="form-label">
                  Mfg. Model Number
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    maxLength={25}
                    type="text"
                    className="form-control"
                    id="modelNumber"
                    placeholder="Enter Mfg. Model Number"
                    value={manufacturerModalObj.modelNumber}
                    onChange={(e) => {
                      let inputValue = e.target.value;
                      const updatedValue =
                        inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                      setManufacturerModalObj((prev) => ({
                        ...prev,
                        modelNumber: updatedValue
                      }));
                    }}
                  />
                  
                  {error &&
                  (manufacturerModalObj.modelNumber === null || manufacturerModalObj.modelNumber === undefined || manufacturerModalObj.modelNumber === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
               <span style={{color:'red'}}> {errorMessage}</span>
              </div>

             
           

            

            
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button type="submit" className="btn btn-primary text-center" onClick={() => AddManufactureModalBtnClick()}>
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

export default ManufacturerAddUpdateModal;
