import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import SuccessPopupModal from 'component/SuccessPopupModal';

const ImportCSVModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData, isValid }) => {
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
            <h4 className="text-center">{modelRequestData?.model === 'Recharge Import' ? 'Import Recharge Data' : 'Import Data'}</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container d-flex justify-content-center align-items-center ">
            <div className=" p-1 col-12 col-md-8" style={{ width: '100%' }}>
              <div class="card-header text-start">
                {modelRequestData?.Action === 'Recharge Import' ? <h4 class=" mb-2">Import Recharge Data From CSV File</h4> : ''}

              

                <button className="btn btn-primary" onClick={generateDeviceCSV}>
  <i className="fa fa-download d-inline d-sm-none" aria-hidden="true"></i> {/* Icon only on mobile */}
  <span className="d-none d-sm-inline">Download Sample Data</span> {/* Text only on desktop */}
</button>
              </div>
              <div class="">
                {/* <!-- File input --> */}
                <div className="d-flex justify-content-center align-items-center">
                  <div className="mb-3 mt-3 col-md-8 justify-center ">
                    {' '}
                    <label htmlFor="csvInput" className=" form-label">
                      Choose CSV file to import
                    </label>{' '}
                    <input
                      type="file"
                      id="fileInput"
                      accept=".xls, .xlsx" // Allow Excel files
                      className="form-control"
                      // onChange={handleFileChange} // Save file to state
                    />
                  </div>
                </div>

                {/* <!-- Checkbox --> */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                  <input type="checkbox" class="form-check-input" id="headerRow" style={{ border: '1px solid black' }} />
                  <label for="headerRow" class="form-check-label">
                    File contains header row?
                  </label>
                </div>

                {/* <!-- Parse CSV Button --> */}
                <div class="text-center">
                  {/* <button
                            type="button"
                            // onClick={handleApiCall} // Call API on button click
                            class="btn btn-primary"
                          >
                            Parse CSV
                          </button> */}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button
            type="submit"
            className="btn btn-primary text-center"
            // onClick={() => handleApiCall()}
          >
            Parse CSV
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

export default ImportCSVModal;
