import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
const GovPortalDataImportModal = ({
  show,
  onHide,
  modelRequestData,
  userKeyID, // User ID passed from parent
  companyKeyID,
  apiAction,
  errorMessage,
  setErrorMessage
}) => {
  const [modelAction, setModelAction] = useState('');
  const { setLoader } = useContext(ConfigContext);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // Local state to handle the file
  const [govErrorMsg, setGovErrorMsg] = useState(false);
  const [containsHeader, setContainsHeader] = useState(false); // Checkbox state for header row

  const generateDeviceCSV = () => {
    setLoader(true);
    // Define headers for device information
    let headers = [];

    if (modelRequestData.Action === 'Mahakhanij Portal Data') {
      headers = [
        'c_name',
        'c_mobile_no',
        'c_address',
        'c_present_address',
        'd_mobile',
        'vehicle_no',
        'vehicle_type',
        'vehicle_status',
        'vehicle_category',
        'vehicle_class',
        'chassis_number',
        'engine_number',
        'maker_model',
        'body_type_desc',
        'fuel_desc',
        'rc_color',
        'norms_desc',
        'gross_vehicle_weight',
        'unladen_vehicle_weight',
        'insurance_policy',
        'registration_date',
        'fit_it_up',
        'tax_up_to',
        'insurance_upto',
        'maker_description',
        'rfc_name',
        'device_sim_no1',
        'telecom_provider_sim1',
        'telecom_provider_sim2',
        'original_deviceid',
        'device_sim_no2'
      ];
    } else if (modelRequestData.Action === 'Device-New-Tab') {
      headers = ['Model', 'IMEI', 'sim1', 'sim1 type', 'Sim 2', 'Sim 2 Type', 'Issued Date', 'Serial No'];
    } else if (modelRequestData.Action === 'CGM Portal Data') {
      headers = [
        'agency_name',
        'sub_agency_name',
        'district',
        'transporter',
        'bat_id_no',
        'vehicle_reg_no',
        'vehicle_type',
        'vehicle_status',
        'vehicle_category',
        'imei_no',
        'serial_no',
        'install_date',
        'sim_no',
        'service_type1',
        'vehicle_type',
        'maker_name',
        'dealer_name',
        'fuel_type',
        'vehicle_capacity',
        'loaded_weight',
        'unloaded_weight',
        'vehicle_description',
        'engine_no',
        'chassis_no'
      ];
    } else if (modelRequestData.Action === 'CGM GPS Data') {
      headers = [
        'agency',
        'sub_agency',
        'vehicle_number',
        'device_id',
        'gps_d_received',
        'last_gps_string_time',
        'last_gps_string',
        'can_data_received',
        'last_can_string_time',
        'last_can_string'
      ];
    } else if (modelRequestData.Action === 'Transync Data') {
      headers = [
        'agency_name',
        'sub_agency_name',
        'district',
        'transporter',
        'bat_id_no',
        'vehicle_reg_no',
        'imei_no',
        'serial_no',
        'install_date',
        'warrenty_end_date',
        'sim_no',
        'service_type1',
        'vehicle_type',
        'maker_name',
        'dealer_name',
        'fuel_type',
        'vehicle_capacity',
        'loaded_weight',
        'unloaded_weight',
        'vehicle_description',
        'engine_no',
        'chassis_no'
      ];
    } else if (modelRequestData.Action === 'Transync Gps data report') {
      headers = [
        'agency',
        'sub_agency',
        'vehicle_number',
        'device_id',
        'gps_d_received',
        'last_gps_string_time',
        'last_gps_string',
        'can_data_received',
        'last_can_string_time',
        'last_can_string'
      ];
    } else if (
      modelRequestData.Action === 'svts-export' ||
      modelRequestData.Action === 'svts2-export' ||
      modelRequestData.Action === 'vihana-import'
    ) {
      headers = [
        'vehicle_number',
        'imei_number',
        'vts_number',
        'device_model',
        'creation_date',
        'expiry_date',
        'category',
        'status',
        'last_update'
      ];
    } else if (modelRequestData.Action === 'Trackin-Export') {
      headers = [
        'j_code_and_desc',
        'asset_code',
        'asset_desc',
        'registraton',
        'bike_user_name',
        'status',
        'last_update',
        'speed',
        'overspeed_limit',
        'halt_time',
        'odometer',
        'maintainance',
        'distance',
        'location',
        'imei',
        'sim',
        'device_comm_date'
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
    setLoader(false);
    link.setAttribute('download', `${modelRequestData.Action.replace(/ /g, '_')}.csv`); // Dynamic filename
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the URL object
  };

  useEffect(() => {
    if (!show) {
      setSelectedFile(null);
      setGovErrorMsg(false);
      setErrorMessage(false);
    }
  }, [show, setErrorMessage]);

  const handleFileChange = (e) => {
    setErrorMessage(false);
    setGovErrorMsg(false);
    setSelectedFile(e.target.files[0]); // Save the file when input changes
  };

  const handleImport = () => {
    if (!selectedFile) {
      setGovErrorMsg('Please select csv file before importing!');
      return;
    }
    apiAction(selectedFile, containsHeader, userKeyID, companyKeyID); // Pass the file and header row info to parent
  };
  return (
    <>
      <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {modelRequestData?.Action === 'Mahakhanij Portal Data' ? 'Mahakhanij Portal Data' : ''}
              {modelRequestData?.Action === 'CGM Portal Data' ? 'CGM Portal Data' : ''}
              {modelRequestData?.Action === 'CGM GPS Data' ? <h4 class=" mb-2">CGM GPS Data</h4> : ''}
              {modelRequestData?.Action === 'Transync Data' ? <h4 class=" mb-2">Transync Data</h4> : ''}
              {modelRequestData?.Action === 'Transync Gps data report' ? <h4 class=" mb-2">Transync Gps Data</h4> : ''}
              {modelRequestData?.Action === 'svts2-export' ? <h4 class=" mb-2">Militrack SVTS2 Data</h4> : ''}
              {modelRequestData?.Action === 'vihana-import' ? <h4 class=" mb-2">Militrack Vihana Data</h4> : ''}
              {modelRequestData?.Action === 'Trackin-Export' ? <h4 class=" mb-2">Trackin Data</h4> : ''}
              {modelRequestData?.Action === 'svts-export' ? <h4 class=" mb-2">Militrack SVTS Data</h4> : ''}
              {modelRequestData?.Action === 'Device-New-Tab' ? <h4 class=" mb-2">Import New Device</h4> : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container d-flex justify-content-center align-items-center ">
            <div className=" p-1 col-12 col-md-8" style={{ width: '100%' }}>
              <div className="card-header text-start d-flex justify-content-between align-items-center">
                {modelRequestData?.Action === 'Mahakhanij Portal Data' ? <h4 class=" mb-2">Import Mahakhanij Data From CSV File</h4> : ''}
                {modelRequestData?.Action === 'CGM Portal Data' ? <h4 class=" mb-2">Import CGM Device Data From CSV File</h4> : ''}
                {modelRequestData?.Action === 'CGM GPS Data' ? <h4 class=" mb-2">Import CGM Gps Device Data From CSV File</h4> : ''}
                {modelRequestData?.Action === 'Transync Data' ? <h4 class=" mb-2">Import Transync Data From CSV File</h4> : ''}
                {modelRequestData?.Action === 'svts-export' ? <h4 class=" mb-2">Import Militrack SVTS Device Data From CSV File</h4> : ''}
                {modelRequestData?.Action === 'Device-New-Tab' ? <h4 class=" mb-2">Import New Device CSV File</h4> : ''}
                {modelRequestData?.Action === 'svts2-export' ? (
                  <h4 class=" mb-2">Import Militrack SVTS 2 Device Data From CSV File</h4>
                ) : (
                  ''
                )}
                {modelRequestData?.Action === 'vihana-import' ? (
                  <h4 class=" mb-2">Import Militrack Viahana Device Data From CSV File</h4>
                ) : (
                  ''
                )}
                {modelRequestData?.Action === 'Transync Gps data report' ? (
                  <h4 class=" mb-2">Import Transync Gps Data From CSV File</h4>
                ) : (
                  ''
                )}
                {modelRequestData?.Action === 'Trackin-Export' ? <h4 class=" mb-2">Import Trakin Device Data From CSV File</h4> : ''}
                {/* <span className="d-none d-sm-inline"> */}
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
                      accept=".csv" // Allow Excel files
                      className="form-control"
                      onChange={handleFileChange} // Save file to state
                    />
                  </div>
                </div>
                <span className="text-center" style={{ color: 'red' }}>
                  {govErrorMsg}
                </span>
              </div>
            </div>
          </div>
          <span className="d-flex text-center" style={{ color: 'red' }}>
            {errorMessage}
          </span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button type="submit" className="btn btn-primary text-center" onClick={handleImport}>
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

export default GovPortalDataImportModal;
