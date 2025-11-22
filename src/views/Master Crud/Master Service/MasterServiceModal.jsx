

import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { AddUpdateDesignation, GetDesignationModel } from 'services/Master Crud/Designationapi';
import { AddUpdateService, GetServiceModel } from 'services/Services/ServicesApi';

const MasterServiceModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
      const [modelAction, setModelAction] = useState('');
      const [error, setErrors] = useState(null);
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [errorMessage, setErrorMessage] = useState();
      const { setLoader, user } = useContext(ConfigContext);
      const [serviceObj, setServiceObj] = useState({
            userKeyID: null,
            designationKeyID: null,
            serviceName: null
      });

      useEffect(() => {
            if (modelRequestData?.Action === 'Update') {
                  if (modelRequestData?.serviceKeyID !== null) {
                        GetServiceModelData(modelRequestData.serviceKeyID);
                  }
            }
      }, [modelRequestData?.Action]);

      const AddStateBtnClick = () => {
            let isValid = false;
            if (serviceObj.serviceName === null || serviceObj.serviceName === undefined || serviceObj.serviceName.trim() === '') {
                  setErrors(true);
                  isValid = true;
            } else {
                  setErrors(false);
                  isValid = false;
            }

            const apiParam = {
                  userKeyID: user.userKeyID,
                  serviceName: serviceObj.serviceName,
                  serviceKeyID: modelRequestData?.serviceKeyID
            };

            console.log(JSON.stringify(apiParam, null, 2));
            if (!isValid) {
                  AddUpdateServiceData(apiParam);
            }
      };

      const AddUpdateServiceData = async (apiParam) => {
            setLoader(true);
            try {
                  // let url = '/AddUpdateZone'; // Default URL for Adding Data

                  const response = await AddUpdateService(apiParam);
                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false);
                              setShowSuccessModal(true);
                              setModelAction(
                                    modelRequestData.Action === 'Add' ? 'Service Added Successfully!' : 'Service Updated Successfully!'); //Do not change this naming convention

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

      const GetServiceModelData = async (id) => {

            if (id === undefined) {
                  return;
            }
            setLoader(true);

            try {
                  const data = await GetServiceModel(id);
                  if (data?.data?.statusCode === 200) {
                        setLoader(false);
                        const ModelData = data.data.responseData.data; // Assuming data is an array

                        setServiceObj({
                              ...serviceObj,
                              userKeyID: ModelData.userKeyID,
                              serviceKeyID: ModelData.serviceKeyID,
                              serviceName: ModelData.serviceName
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
                                          {modelRequestData?.Action !== null ? 'Update Service' : modelRequestData?.Action === null ? 'Add Service' : ''}
                                    </h3>
                              </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
                              <div className="container">
                                    <div className="row">
                                          <div>
                                                <label htmlFor="StateName" className="form-label">
                                                      Service Name
                                                      <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <input
                                                      maxLength={20}
                                                      type="text"
                                                      className="form-control"
                                                      id="StateName"
                                                      placeholder="Enter Service Name"
                                                      aria-describedby="Employee"
                                                      value={serviceObj.serviceName}
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

                                                            setServiceObj((prev) => ({
                                                                  ...prev,
                                                                  serviceName: updatedValue
                                                            }));
                                                      }}
                                                />

                                                {error &&
                                                      (serviceObj.serviceName === null || serviceObj.serviceName === undefined || serviceObj.serviceName === '') ? (
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

export default MasterServiceModal;
