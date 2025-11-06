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

        {/* Animated Icon (Compact Size) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 360"
          width="320"
          height="180"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Government Development Project</title>
          <desc id="desc">Icon combining a government building, growth chart and gear representing development projects.</desc>

          <rect x="8" y="8" width="624" height="344" rx="18" ry="18" fill="#f6f8fb" />

          <g transform="translate(40,48)">
            <rect x="0" y="140" width="200" height="18" rx="3" fill="#e6eef9" />
            <rect x="10" y="122" width="180" height="10" fill="#eef5ff" />
            <rect x="20" y="108" width="160" height="10" fill="#f5f8ff" />
            <rect x="20" y="16" width="18" height="110" rx="3" fill="#ffffff" stroke="#cbdff8" strokeWidth="2" />
            <rect x="48" y="16" width="18" height="110" rx="3" fill="#ffffff" stroke="#cbdff8" strokeWidth="2" />
            <rect x="76" y="16" width="18" height="110" rx="3" fill="#ffffff" stroke="#cbdff8" strokeWidth="2" />
            <rect x="104" y="16" width="18" height="110" rx="3" fill="#ffffff" stroke="#cbdff8" strokeWidth="2" />
            <rect x="132" y="16" width="18" height="110" rx="3" fill="#ffffff" stroke="#cbdff8" strokeWidth="2" />

            <path d="M0 16 L100 0 L200 16 L200 34 L0 34 Z" fill="#dfefff" stroke="#c6dbff" strokeWidth="2" />
            <rect x="86" y="84" width="28" height="42" rx="3" fill="#d0e6ff" />
            <circle cx="110" cy="104" r="2" fill="#7c98d9" />
          </g>

          <g transform="translate(270,60)">
            <rect x="0" y="0" width="270" height="200" rx="10" fill="#ffffff" stroke="#e6eef9" strokeWidth="1" />
            <line x1="18" y1="170" x2="240" y2="170" stroke="#cbd6ea" strokeWidth="3" strokeLinecap="round" />
            <line x1="18" y1="170" x2="18" y2="20" stroke="#cbd6ea" strokeWidth="3" strokeLinecap="round" />
            <rect x="40" y="110" width="30" height="60" rx="4" fill="#6ea8fe" />
            <rect x="86" y="70" width="30" height="100" rx="4" fill="#4b8ef6" />
            <rect x="132" y="40" width="30" height="130" rx="4" fill="#2f73e6" />
            <polyline
              points="40,125 56,98 86,85 101,65 132,48 147,36 190,28"
              fill="none"
              stroke="#ffb74d"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="190" cy="28" r="6" fill="#ffb74d" stroke="#f7a21a" strokeWidth="2" />
            <text x="18" y="188" fontFamily="Segoe UI, Roboto, sans-serif" fontSize="12" fill="#9aaed3">
              Jan
            </text>
            <text x="86" y="188" fontFamily="Segoe UI, Roboto, sans-serif" fontSize="12" fill="#9aaed3">
              Feb
            </text>
            <text x="132" y="188" fontFamily="Segoe UI, Roboto, sans-serif" fontSize="12" fill="#9aaed3">
              Mar
            </text>
          </g>

          <g transform="translate(520,210) scale(0.9)">
            <circle cx="40" cy="40" r="20" fill="#fff8e6" stroke="#ffd98a" strokeWidth="2" />
            <g fill="#ffd98a" stroke="#f4b84a" strokeWidth="1">
              <rect x="38" y="-2" width="4" height="10" rx="1" transform="rotate(0 40 40)" />
              <rect x="72" y="38" width="10" height="4" rx="1" transform="rotate(90 40 40)" />
              <rect x="38" y="70" width="4" height="10" rx="1" transform="rotate(180 40 40)" />
              <rect x="-2" y="38" width="10" height="4" rx="1" transform="rotate(270 40 40)" />
              <rect x="68" y="10" width="6" height="6" rx="1" transform="rotate(45 40 40)" />
              <rect x="68" y="68" width="6" height="6" rx="1" transform="rotate(135 40 40)" />
              <rect x="-4" y="68" width="6" height="6" rx="1" transform="rotate(225 40 40)" />
              <rect x="-4" y="10" width="6" height="6" rx="1" transform="rotate(315 40 40)" />
            </g>
            <circle cx="40" cy="40" r="12" fill="#fff1d6" stroke="#f7c986" strokeWidth="1.5" />
            <circle cx="40" cy="40" r="5" fill="#f7b84a" />
          </g>

          <text x="40" y="32" fontFamily="Segoe UI, Roboto, sans-serif" fontSize="18" fill="#234a7a" fontWeight="700">
            Government Development Project
          </text>
          <text x="40" y="52" fontFamily="Segoe UI, Roboto, sans-serif" fontSize="12" fill="#5b6f8f">
            Infrastructure • Growth • Public Services
          </text>
        </svg>



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
              background: '#ff7d34',
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