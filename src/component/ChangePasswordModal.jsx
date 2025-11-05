import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { ResetEmployeePassword } from 'services/Employee Staff/EmployeeApi';

const ChangePasswordModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const [modelAction, setModelAction] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user } = useContext(ConfigContext);
  const [changePasswordObj, setChangePasswordObj] = useState({
    userKeyID: null,
    employeeKeyID: null,
    currentPassword: null,
    newPassword: null,
    confirmPassword: null
  });
useEffect(() => {
 
  setInitialData()
}, [modelRequestData]);
  const setPasswordBtnClick = () => {
    let isValid = false;
    if (
      changePasswordObj.currentPassword === null ||
      changePasswordObj.currentPassword === undefined ||
      changePasswordObj.currentPassword === '' ||
      changePasswordObj.confirmPassword === null ||
      changePasswordObj.confirmPassword === undefined ||
      changePasswordObj.confirmPassword === '' ||
      changePasswordObj.newPassword === null ||
      changePasswordObj.newPassword === undefined ||
      changePasswordObj.newPassword === ''
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    const apiParam = {
      userKeyID: user.userKeyID,
      currentPassword: changePasswordObj?.currentPassword,
      confirmPassword: changePasswordObj?.confirmPassword,
      newPassword: changePasswordObj?.newPassword,
      employeeKeyID: modelRequestData?.employeeKeyID
    };

    if (!isValid) {
      ResettingPasswordData(apiParam);
    }
  };


const setInitialData=()=>{
  setChangePasswordObj({
    ...changePasswordObj,
    userKeyID: null,
    employeeKeyID: null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

}

  const ResettingPasswordData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/ResetEmployeePassword'; // Default URL for Adding Data

      const response = await ResetEmployeePassword(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Password Change Successfully!'
              : 'Password Change Successfully!'
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
    setInitialData()
  };

  return (
    <>
      <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {modelRequestData?.Action !== null ? 'Reset Password' : modelRequestData?.Action === null ? 'Reset Password' : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="col-12 mb-3">
              <label htmlFor="StateName" className="form-label">
                Current Password
                <span style={{ color: 'red' }}>*</span>
              </label>
              <div className="password-input-wrapper" style={{ position: 'relative' }}>
                <input
                  className="form-control"
                  type={showPassword ? 'text' : 'password'}
                  maxLength={22}
                  placeholder=" Current Password"
                  value={changePasswordObj.currentPassword}
                  onChange={(e) => {
                    setErrorMessage(false);
                    let inputValue = e.target.value;

                    // If the input is empty or starts with a space, prevent the space
                    if (inputValue.length === 0 || (inputValue.length === 1 && inputValue === ' ')) {
                      inputValue = '';
                    }

                    // Remove unwanted characters (keeping spaces that aren't at the start)
                    // const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                    // Trim leading spaces while keeping internal spaces
                    const trimmedValue = inputValue.trimStart();

                    // Capitalize the first letter and keep the rest as is
                    // const updatedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1);

                    setChangePasswordObj((prev) => ({
                      ...prev,
                      currentPassword: trimmedValue
                    }));
                  }}
                  style={{ paddingRight: '35px' }} // Add padding to prevent text under icon
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </button>
              </div>

              {error &&
              (changePasswordObj.currentPassword === null ||
                changePasswordObj.currentPassword === undefined ||
                changePasswordObj.currentPassword === '') ? (
                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
            </div>
            <div className="col-12 mb-3">
              <label htmlFor="StateName" className="form-label">
                New Password
                <span style={{ color: 'red' }}>*</span>
              </label>
              <div className="password-input-wrapper" style={{ position: 'relative' }}>
                <input
                  className="form-control"
                  type={showNewPassword ? 'text' : 'password'}
                  maxLength={22}
                  placeholder=" New Password"
                  value={changePasswordObj.newPassword}
                  onChange={(e) => {
                    setErrorMessage(false);
                    let inputValue = e.target.value;

                    // If the input is empty or starts with a space, prevent the space
                    if (inputValue.length === 0 || (inputValue.length === 1 && inputValue === ' ')) {
                      inputValue = '';
                    }

                    // Remove unwanted characters (keeping spaces that aren't at the start)
                    // const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                    // Trim leading spaces while keeping internal spaces
                    const trimmedValue = inputValue.trimStart();

                    // Capitalize the first letter and keep the rest as is
                    // const updatedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1);

                    setChangePasswordObj((prev) => ({
                      ...prev,
                      newPassword: trimmedValue
                    }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0'
                  }}
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </button>
              </div>
              {error &&
              (changePasswordObj.newPassword === null ||
                changePasswordObj.newPassword === undefined ||
                changePasswordObj.newPassword === '') ? (
                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
            </div>
            <div className="col-12 mb-3">
              <label htmlFor="StateName" className="form-label">
                Confirm New Password
                <span style={{ color: 'red' }}>*</span>
              </label>
              <div className="password-input-wrapper" style={{ position: 'relative' }}>
                <input
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  className="form-control"
                  maxLength={22}
                  placeholder=" Confirm New Password"
                  value={changePasswordObj.confirmPassword}
                  onChange={(e) => {
                    setErrorMessage(false);
                    let inputValue = e.target.value;

                    // If the input is empty or starts with a space, prevent the space
                    if (inputValue.length === 0 || (inputValue.length === 1 && inputValue === ' ')) {
                      inputValue = '';
                    }

                    // Remove unwanted characters (keeping spaces that aren't at the start)
                    // const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                    // Trim leading spaces while keeping internal spaces
                    const trimmedValue = inputValue.trimStart();

                    // Capitalize the first letter and keep the rest as is
                    // const updatedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1);

                    setChangePasswordObj((prev) => ({
                      ...prev,
                      confirmPassword: trimmedValue
                    }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0'
                  }}
                  aria-label={showConfirmNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmNewPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </button>
              </div>

              {error &&
              (changePasswordObj.confirmPassword === null ||
                changePasswordObj.confirmPassword === undefined ||
                changePasswordObj.confirmPassword === '') ? (
                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
              {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button type="submit" className="btn btn-primary text-center" onClick={() => setPasswordBtnClick()}>
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

export default ChangePasswordModal;
