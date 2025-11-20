







import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import { AssignWebAppUserAndSetPassword } from 'services/Employee Staff/EmployeeApi';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { ConfigContext } from 'context/ConfigContext';
import SuccessPopupModal from 'component/SuccessPopupModal';

function SetPasswordModal({ show, onHide, modelRequestData }) {
      const [error, setErrors] = useState(null);
      const [errorMessage, setErrorMessage] = useState();
      const [showPassword, setShowPassword] = useState(false);
      const { user, setLoader, companyID } = useContext(ConfigContext);
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [modelAction, setModelAction] = useState('');

      const [appUserObj, setAppUserObj] = useState({
            userDetailsKeyID: null, password: null
      })
      const Submit = async () => {

            let isValid = false;

            if (
                  appUserObj.password === null ||
                  appUserObj.password === undefined ||
                  appUserObj.password === '' ||
                  appUserObj.password.length < 8

            ) {
                  setErrors(true);
                  isValid = true;
            } else {
                  setErrors(false);
                  isValid = false;
            }

            const apiParam = {
                  password: appUserObj.password,
                  userDetailsKeyID: modelRequestData.userDetailsKeyID,

            };
            if (!isValid) {
                  AddUpdateAppUserData(apiParam);
            }
      };
      const AddUpdateAppUserData = async (apiParam) => {

            setLoader(true)
            try {
                  let url = '/AssignWebAppUserAndSetPassword'; // Default URL for Adding Data

                  const response = await AssignWebAppUserAndSetPassword(url, apiParam);
                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false)

                              setShowSuccessModal(true);
                              setModelAction(
                                    modelRequestData.Action === null || modelRequestData.Action === undefined
                                          ? 'Password Set Successfully!'
                                          : ' Password Set  Successfully!'
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
      }
      return (
            <Modal backdrop="static" keyboard={false} style={{ zIndex: 1300 }} show={show} onHide={onHide} centered>
                  <Modal.Header closeButton>
                        <Modal.Title>
                              <b>Set User Password</b>
                        </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                        <div className="scrollable-table">
                              <div>
                                    <label htmlFor="Password" className="form-label">
                                          Password
                                          <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <div className="input-group">
                                          <input
                                                maxLength={15}
                                                type={showPassword ? 'text' : 'Password'} // Toggle input type
                                                className="form-control"
                                                placeholder="Enter Password"
                                                value={appUserObj.password}
                                                onChange={(e) => {
                                                      let InputValue = e.target.value;
                                                      // Allow alphanumeric characters and special characters like @, #, $, %, &, *, !
                                                      const updatedValue = InputValue.replace(/[^a-zA-Z0-9@#$%&*!]/g, '');
                                                      setAppUserObj((prev) => ({
                                                            ...prev,
                                                            password: updatedValue
                                                      }));
                                                }}
                                          />
                                          <button
                                                type="button"
                                                className="btn btn-outline-secondary"

                                                onClick={() => setShowPassword((prev) => !prev)} // Toggle Password visibility
                                          >
                                                {showPassword ? <i class="fa-regular fa-eye-slash"></i> : <i class="fa fa-eye" aria-hidden="true"></i>}
                                          </button>
                                    </div>
                                    {error &&
                                          (
                                                appUserObj.password === null ||
                                                appUserObj.password === undefined ||
                                                appUserObj.password === '' ||
                                                appUserObj.password.length < 8
                                          ) ? (
                                          <span style={{ color: 'red' }}>
                                                {appUserObj.password && appUserObj.password.length < 8
                                                      ? 'Password must be at least 8 characters long'
                                                      : ERROR_MESSAGES}
                                          </span>
                                    ) : (
                                          ''
                                    )}

                              </div>
                              {showSuccessModal && (
                                    <SuccessPopupModal
                                          show={showSuccessModal}
                                          onHide={() => closeAllModal()}
                                          setShowSuccessModal={setShowSuccessModal}
                                          modelAction={modelAction}
                                    />
                              )}
                        </div>
                  </Modal.Body>
                  <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>
                              <b>Close</b>
                        </Button>
                        <Button variant="primary" onClick={Submit}>
                              <b>Close</b>
                        </Button>
                  </Modal.Footer>
            </Modal>
      );
}

export default SetPasswordModal;

