







import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { AddUpdateStateApi, GetStateModel } from 'services/Master Crud/MasterStateApi';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { AddUpdateZone, GetZoneModel } from 'services/Master Crud/MasterZoneApi';

const AssignedDistrictModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {

      const [modelAction, setModelAction] = useState('');
      const [error, setErrors] = useState(null);
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [errorMessage, setErrorMessage] = useState();
      const { setLoader, user } = useContext(ConfigContext);
      const [masterZoneObj, setMasterZoneObj] = useState({
            userKeyID: null,
            zoneKeyID: null,
            zoneName: null
      });



      const AddZoneBtnClick = () => {
            let isValid = false;
            if (masterZoneObj.zoneName === null || masterZoneObj.zoneName === undefined || masterZoneObj.zoneName.trim() === '') {
                  setErrors(true);
                  isValid = true;
            } else {
                  setErrors(false);
                  isValid = false;
            }

            const apiParam = {
                  userKeyID: user.userKeyID,
                  zoneName: masterZoneObj.zoneName,
                  zoneKeyID: modelRequestData?.zoneKeyID
            };

            if (!isValid) {
                  AddUpdateStateData(apiParam);
            }
      };

      const AddUpdateStateData = async (apiParam) => {
            setLoader(true);
            try {
                  let url = '/AddUpdateZone'; // Default URL for Adding Data

                  const response = await AddUpdateZone(url, apiParam);
                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false);
                              setShowSuccessModal(true);
                              setModelAction(
                                    modelRequestData.Action === null || modelRequestData.Action === undefined
                                          ? 'Zone Added Successfully!'
                                          : 'Zone Updated Successfully!'
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

      return (
            <>
                  <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
                        <Modal.Header closeButton>
                              <Modal.Title>
                                    <h3 className="text-center">
                                          {modelRequestData?.Action !== null ? 'Update Zone' : modelRequestData?.Action === null ? 'Map Zone District' : ''}
                                    </h3>
                              </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
                              <div className="container">
                                    <div className="row">
                                          <div>
                                                <label htmlFor="StateName" className="form-label">
                                                      Zone Name
                                                      <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <input
                                                      maxLength={20}
                                                      type="text"
                                                      className="form-control"
                                                      id="StateName"
                                                      placeholder="Enter Zone Name"
                                                      value={masterZoneObj.zoneName}
                                                      onChange={(e) => {
                                                            setErrorMessage(false);
                                                            let inputValue = e.target.value;

                                                            // Prevent input if empty or only space at start
                                                            if (inputValue.length === 1 && inputValue === ' ') {
                                                                  inputValue = '';
                                                            }

                                                            // Allow only letters, numbers, and spaces
                                                            const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                                                            // Capitalize first letter of each word (preserves multiple spaces)
                                                            const updatedValue = cleanedValue.replace(/\b\w/g, (char) => char.toUpperCase());

                                                            setMasterZoneObj((prev) => ({
                                                                  ...prev,
                                                                  zoneName: updatedValue
                                                            }));
                                                      }}
                                                />

                                                {error &&
                                                      (masterZoneObj.zoneName === null || masterZoneObj.zoneName === undefined || masterZoneObj.zoneName === '') ? (
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
                              <Button type="submit" className="btn btn-primary text-center" onClick={() => AddZoneBtnClick()}>
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

export default AssignedDistrictModal;

