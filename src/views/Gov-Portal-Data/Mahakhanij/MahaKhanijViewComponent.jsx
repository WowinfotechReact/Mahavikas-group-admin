import React from 'react';
import { useLocation, useNavigate } from 'react-router';

const MahaKhanijViewComponent = () => {
  const location = useLocation(); // Call useLocation as a function to get the location object

  console.log(location?.state, 'wwwwwwwww');
  const navigate = useNavigate();

  // Utility function to format the vehicle number
  const formatVehicleNumber = (vehicleNumber) => {
    if (!vehicleNumber) return ''; // Handle empty or undefined values

    // Remove invalid characters and ensure uppercase
    const sanitizedInput = vehicleNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Split into parts and format
    const parts = [
      sanitizedInput.slice(0, 2), // State code (2 letters)
      sanitizedInput.slice(2, 4), // RTO code (2 digits)
      sanitizedInput.slice(4, 6), // Series code (2 letters)
      sanitizedInput.slice(6, 10) // Vehicle number (4 digits)
    ];

    // Join parts with spaces
    return parts.filter((part) => part).join(' ');
  };
  return (
    <>
      <div className="container">
        <div className="card">
          {/* Card Header */}
          <div
            className="card-header d-flex justify-content-between align-items-center"
            style={{ backgroundColor: '#f0f4f8', color: '#000' }}
          >
            <h5>Mahakhanij Details</h5>
            <button onClick={() => navigate('/mahakhanij-data-list')} className="btn btn-primary btn-sm">
              Back
            </button>
          </div>

          {/* Card Body */}
          <div className="card-body">
            {/* Employee Info */}
            <div className="mb-4">
              <h6 className="fw-bold p-1 bg-secondary">Employee Info:</h6>
              <div className="d-flex flex-wrap" style={{ marginBottom: '10px' }}>
                <div
                  style={{
                    flex: 1,
                    minWidth: '250px',
                    padding: '5px 10px'
                  }}
                >
                  <strong>Name:</strong> {location?.state?.customerName}
                </div>
                <div
                  style={{
                    flex: 1,
                    minWidth: '250px',
                    padding: '5px 10px'
                  }}
                >
                  <strong>Vehicle No.:</strong> {formatVehicleNumber(location?.state?.vehicleName)}
                </div>
                <div
                  style={{
                    flex: 1,
                    minWidth: '250px',
                    padding: '5px 10px'
                  }}
                >
                  <strong>Employee ID:</strong> E12345
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mb-4">
              <h6 className="fw-bold p-1 bg-secondary">Contact Info:</h6>
              <div className="d-flex flex-wrap" style={{ marginBottom: '10px' }}>
                <div
                  style={{
                    flex: 1,
                    minWidth: '250px',
                    padding: '5px 10px'
                  }}
                >
                  <strong>Email:</strong> rahul@example.com
                </div>
                <div
                  style={{
                    flex: 1,
                    minWidth: '250px',
                    padding: '5px 10px'
                  }}
                >
                  <strong>Phone:</strong> +91-9876543210
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div className="mb-4">
              <h6 className="fw-bold p-1 bg-secondary">Employment Details:</h6>
              <div className="d-flex flex-wrap" style={{ marginBottom: '10px' }}>
                <div
                  style={{
                    flex: 1,
                    minWidth: '250px',
                    padding: '5px 10px'
                  }}
                >
                  <strong>Department:</strong> IT
                </div>
                <div
                  style={{
                    flex: 1,
                    minWidth: '250px',
                    padding: '5px 10px'
                  }}
                >
                  <strong>Designation:</strong> Software Developer
                </div>
                <div
                  style={{
                    flex: 1,
                    minWidth: '250px',
                    padding: '5px 10px'
                  }}
                >
                  <strong>Date of Joining:</strong> Jan 15, 2020
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mb-4">
              <h6 className="fw-bold p-1 bg-secondary">Address:</h6>
              <div className="d-flex flex-wrap" style={{ marginBottom: '10px' }}>
                <div
                  style={{
                    flex: 1,
                    minWidth: '250px',
                    padding: '5px 10px'
                  }}
                >
                  123 Street Name, City, State, PIN
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card mt-4">
          {/* Card Header */}
          <div
            className="card-header d-flex justify-content-between align-items-center"
            style={{ backgroundColor: '#f0f4f8', color: '#000' }}
          >
            <h5>Activity Logs</h5>
          </div>

          {/* Card Body */}
          <div className="card-body">
            <div>
              <h6 className="fw-bold mb-3">Activity Timeline:</h6>
              <div className="timeline" style={{ position: 'relative' }}>
                {[
                  {
                    timeAgo: '1 year ago',
                    message: 'Device 869630058097894 IS active From 12-12-2023 Status Updated By Rahul',
                    timestamp: '2023-12-12 19:41:15'
                  },
                  {
                    timeAgo: '1 year ago',
                    message: 'Device 869630058097894 IS active From 12-12-2023 Status Updated By Rahul',
                    timestamp: '2023-12-12 19:37:08'
                  },
                  {
                    timeAgo: '1 year ago',
                    message: 'Device 869630058097894 IS active From 12-12-2023 Status Updated By Rahul',
                    timestamp: '2023-12-12 19:37:00'
                  }
                ].map((activity, index, arr) => (
                  <div key={index} className="d-flex align-items-start mb-4" style={{ position: 'relative' }}>
                    {/* Dot */}
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: '#007bff',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '10px',
                        left: '0'
                      }}
                    ></div>

                    {/* Connecting Line */}
                    {index !== arr.length - 1 && (
                      <div
                        style={{
                          width: '2px',
                          height: '100%',
                          backgroundColor: '#007bff',
                          position: 'absolute',
                          top: '10px',
                          left: '4px',
                          zIndex: '-1'
                        }}
                      ></div>
                    )}

                    {/* Activity Content */}
                    <div
                      style={{
                        marginLeft: '20px',
                        backgroundColor: '#f8f9fa',
                        padding: '15px',
                        borderRadius: '8px',
                        flex: 1
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: 'bold', color: '#6c757d' }}>{activity.timeAgo}</p>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: 'bold',
                          color: '#0d6efd'
                        }}
                      >
                        {activity.message}
                      </p>
                      <p style={{ margin: 0, color: '#6c757d' }}>{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MahaKhanijViewComponent;
