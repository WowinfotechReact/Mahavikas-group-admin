import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import Lottie from 'react-lottie';
import PropTypes from 'prop-types';
import { useAuth } from 'context/ConfigContext';
// import logoutAnimation from './animations/logout-animation.json'; // Get from LottieFiles
// import { ReactComponent as GpsIcon } from './assets/gps-pin.svg';

const LogoutModal = ({ show, onConfirm, onCancel }) => {
  const { logout } = useAuth();
  // Lottie animation options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    // animationData: logoutAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      backdrop="static"
      keyboard={false}
      className="logout-confirmation-modal"
      style={{ zIndex: 1300 }}
    >
      <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
        <Modal.Title id="logout-modal-title" className="w-100 text-center">
          {/* <GpsIcon 
            style={{ 
              width: '60px', 
              height: '60px', 
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }} 
          /> */}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center p-4">

        {/* Animated Icon */}
        <div className="gps-pin-animation mb-3">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="pulse-icon text-danger"
            width="50"
            height="50"
          >
            <path d="M16 4h-1V2h-6v2H8C6.9 4 6 4.9 
                 6 6v14c0 1.1.9 2 2 
                 2h8c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 
                 16H8V6h8v14z"/>
          </svg>
        </div>

        {/* Title */}
        <h4 className="mb-2" style={{ color: '#2c3e50', fontWeight: '600' }}>
          Confirm Logout
        </h4>
        <p className="text-muted mb-4">
          Are you sure you want to log out from the system?
        </p>

        {/* Action Buttons */}

      </Modal.Body>

      <Modal.Footer style={{ border: 'none', paddingTop: 0 }}>
        <div className="w-100 d-flex justify-content-center gap-3">
          <Button
            variant="outline-secondary"
            onClick={onCancel}
            style={{
              width: '120px',
              padding: '8px',
              fontWeight: 600,
              borderRadius: '20px'
            }}
          >
            Cancel
          </Button>


          <button
            className='btn text-white'
            onClick={logout}
            style={{
              background: '#9aa357',
              width: '120px',
              padding: '8px',
              fontWeight: 600,
              borderRadius: '20px',
              boxShadow: '0 2px 6px rgba(219, 222, 231, 0.3)'
            }}
          >
            Logout
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

// PropTypes for type checking
LogoutModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default LogoutModal;