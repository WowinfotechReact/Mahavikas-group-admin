



import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import SuccessPopupModal from 'component/SuccessPopupModal';
import Select from 'react-select';

const InstituteUserAddUpdateModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData, isValid }) => {
      const ERROR_MESSAGES = 'This field is required.';
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [selectedFile, setSelectedFile] = useState(null); // Store the file here
      const common = useSelector((state) => state.Storage);
      const [unitList, setUnitList] = useState([]);
      const [modelAction, setModelAction] = useState('');
      const [error, setErrors] = useState(null);
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [errorMessage, setErrorMessage] = useState();
      const [secondModalOpen, setSecondModalOpen] = useState();
      const [errorImg, setErrorImg] = useState({ front: false, back: false });

      //   const [vehicleObj, setVehicleObj] = useState({
      //     name: null,
      //     address: null,
      //     mobileNo: null,
      //     aadharNo: null,
      //     aadharFrontImg: null,
      //     aadharBackImg: null,
      //     vehicleNo: null,
      //     customerId: null,
      //     vehicleType: null,
      //     rcBookFile: null,
      //     vehicleNoPlace: null,
      //     vehicleFrontImg: null,
      //     vehicleSideImg: null
      //   });

      const generateDeviceCSV = () => {
            // Define headers for device information
            let headers = [];

            if (modelRequestData.model === 'Recharge Import') {
                  headers = [
                        'Tracking App',
                        'Model',
                        'Vehicle',
                        'Customer',
                        'Mobile',
                        'Reminder',
                        'Remark',
                        'Acc Dept',
                        'Mfg Message',
                        'Mfg Paid Date',
                        'Process Status',
                        'Recharge Status'
                  ];
            }

            // Validate headers to ensure they are set
            if (headers.length === 0) {
                  console.error('No headers available for the selected action.');
                  return; // Stop execution if no headers are defined
            }

            // Create empty rows (3 empty rows as an example)
            const emptyRows = [
                  Array(headers.length).fill(''), // Ensure empty rows match header length
                  Array(headers.length).fill(''),
                  Array(headers.length).fill('')
            ];

            // Combine headers and rows
            const csvContent = [headers.join(','), ...emptyRows.map((row) => row.join(','))].join('\n');

            // Create blob and download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `${modelRequestData.model.replace(/ /g, '_')}.csv`); // Dynamic filename
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url); // Clean up the URL object
      };

      const handleFileChange = (e) => {
            setSelectedFile(e.target.files[0]); // Save the file when input changes
      };

      return (
            <>
                  <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
                        <Modal.Header closeButton>
                              <Modal.Title>
                                    <h4 className="text-center">{modelRequestData?.model === 'Recharge Import' ? 'Add User To Institute' : 'Add User To Institute'}</h4>
                              </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
                              <div >
                                    <div className="container">
                                          <div className="row">
                                                <div className="container">
                                                      <div className="row">
                                                            <div className="col-12 col-md-6 mb-2">
                                                                  <label htmlFor="customerName" className="form-label">
                                                                        User Name <span style={{ color: 'red' }}>*</span>
                                                                  </label>
                                                                  <input
                                                                        maxLength={50}
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="customerName"
                                                                        placeholder="Enter User Name"


                                                                  />

                                                            </div>

                                                            <div className="col-12 col-md-6 mb-2">
                                                                  <label htmlFor="gstNumber" className="form-label">
                                                                        Department Name <span style={{ color: 'red' }}>*</span>
                                                                  </label>
                                                                  <input

                                                                        type="text"
                                                                        className="form-control"
                                                                        id="gstNumber"
                                                                        placeholder="Enter Department Name "

                                                                  />

                                                            </div>
                                                      </div>
                                                      <div className="row">
                                                            <div className="col-12 col-md-6 mb-2">
                                                                  <label htmlFor="customerName" className="form-label">
                                                                        Role  <span style={{ color: 'red' }}>*</span>
                                                                  </label>
                                                                  <Select

                                                                        placeholder="Select Role"


                                                                  />

                                                            </div>

                                                            <div className="col-12 col-md-6 mb-2">
                                                                  <label htmlFor="gstNumber" className="form-label">
                                                                        Addmission Year <span style={{ color: 'red' }}>*</span>
                                                                  </label>
                                                                  <input

                                                                        type="text"
                                                                        className="form-control"
                                                                        id="gstNumber"
                                                                        placeholder="Enter Addmission Year"

                                                                  />

                                                            </div>
                                                      </div>
                                                      <div className="row">
                                                            <div className="mb-3">
                                                                  <label htmlFor="photoUpload" className="form-label">
                                                                        Upload Photo
                                                                  </label>
                                                                  <input
                                                                        type="file"
                                                                        className="form-control"
                                                                        id="photoUpload"
                                                                        accept="image/*"
                                                                  />
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </Modal.Body>
                        <Modal.Footer>

                              <Button
                                    type="submit"
                                    className="btn btn-primary text-center"
                              // onClick={() => handleApiCall()}
                              >
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

export default InstituteUserAddUpdateModal;
