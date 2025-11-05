 


 import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { ResetEmployeePassword } from 'services/Employee Staff/EmployeeApi';
import { GetCustomerUserNamePassword } from 'services/CustomerStaff/CustomerStaffApi';

const CompletedTabLoggedInModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const [modelAction, setModelAction] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(prev => !prev);

  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user } = useContext(ConfigContext);
  const [completedTabLoggedObj, setChangePasswordObj] = useState({
    userKeyID: null,
    employeeKeyID: null,
    userName: null,
    password: null,
   
  });

const [customerViewData, setCustomerViewData] = useState({
  mobileNo:null,
  password:null
}); 


 

 

  const closeAllModal = () => {
    onHide();
    setShowSuccessModal(false);

  };

  const [isCopied, setIsCopied] = useState(false);
  const password = "mySecurePass123"; // Replace with dynamic password
  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setIsCopied(true);
  };


useEffect(() => {
  if (modelRequestData?.customerKeyID !== null && modelRequestData?.customerKeyID !== undefined) {
    GetMachineBookingModelData(modelRequestData.customerKeyID);
  }
}, [modelRequestData]);
  const GetMachineBookingModelData = async (id) => {
    // debugger
    try {
      const response = await GetCustomerUserNamePassword(id);

      if (response?.data?.statusCode === 200) {
        const ModelData = response.data.responseData?.data || {}; // Use empty object as default

        setCustomerViewData({
          ...customerViewData,
          password: ModelData.password,
          mobileNo: ModelData.mobileNo,
         
        });
      } else {
        console.error('Error fetching data: ', response?.data?.statusCode);
      }
    } catch (error) {
      console.error('Error in GetMachineBookingModelData: ', error);
    }
  };
  return (
    <>
      <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">

              {modelRequestData?.openFromModule === 'TrackingTab' && 'Trackin App Login'}
              {modelRequestData?.openFromModule === 'MiliTrackTab' && 'Militrack App Login'}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
      <div className="container d-flex justify-content-center">
        <div
          className="card p-4 shadow-lg text-center"
          style={{
            width: '100%',
            maxWidth: '400px',
            borderRadius: '10px',
            background: '#f8f9fa',
          }}
        >
          <div className="mb-3">
            <i className="bi bi-person-circle text-primary" style={{ fontSize: '3rem' }}></i>
          </div>

          {modelRequestData?.openFromModule === 'TrackingTab' && (
            <h5>Trackin App Login Details</h5>
          )}
          {modelRequestData?.openFromModule === 'MiliTrackTab' && (
            <h5>Militrack App Login Details</h5>
          )}

          {/* Username Display */}
          <div className="bg-white p-3 rounded shadow-sm mb-2 d-flex align-items-center" style={{ gap: '8px' }}>
            <span className="fw-bold text-secondary">Username :</span>
            <span className="text-dark">{customerViewData.mobileNo}</span>
          </div>

           {/* Password Display with Font Awesome Eye Icon */}
           <div
            className="bg-white p-3 rounded shadow-sm mb-2 d-flex align-items-center justify-content-between"
            style={{ gap: '8px' }}
          >
            <div className="d-flex align-items-center" style={{ gap: '8px' }}>
              <span className="fw-bold text-secondary">Password :</span>
              <span className="text-dark">
                {showPassword ? customerViewData.password : '••••••••'}
              </span>
            </div>
            <i
              className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-primary`}
              style={{ cursor: 'pointer' }}
              onClick={togglePassword}
              title={showPassword ? 'Hide password' : 'Show password'}
            ></i>
          </div>
        </div>
      </div>
    </Modal.Body>
       
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

export default CompletedTabLoggedInModal;
