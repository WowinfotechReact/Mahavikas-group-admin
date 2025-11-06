import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';

import 'react-date-picker/dist/DatePicker.css';
import SuccessPopupModal from 'component/SuccessPopupModal';
import {
  AddUpdateCustomer,
  GetCustomerLookupList,
  GetCustomerModel,
} from 'services/CustomerStaff/CustomerStaffApi';
import { ConfigContext } from 'context/ConfigContext';
import { AddUpdateVehicleApi, GetVehicleModel } from 'services/Vehicle/VehicleApi';
import { GetVehicleTypeLookupList } from 'services/Master Crud/MasterVehicleTypeApi';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';

const AddUpdateCustomerFirmModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const [customerOption, setCustomerOption] = useState([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const { user, setLoader, companyID } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [customerObj, setcustomerObj] = useState({
    customerKeyID: null,
    accountDetails: true,

    customerFirmName: null,
    gstNumber: null,
    vendorCode: null,
    billingAddress: null,
    addressperGST: null,
    shippingAddress: null,
    mobileNumber: null,
    alternateMobileNumber: null,
    emailID: null,
    accountNumber: null,
    ifscCode: null,
    branchName: null,
    pointofContact: true,
    contactPersonName: null,
    contactPersonDesignation: null,
    contactPersonNumber: null,
    contactAlternateNumber: null,
    contactPersonEmail: null,
    userKeyID: null
  });

  // useEffect(() => {
  //   if (modelRequestData?.Action === 'Update') {
  //     if (modelRequestData?.customerKeyID !== null) {
  //       GetCustomerModelData(modelRequestData?.customerKeyID);
  //     }
  //   }
  // }, [modelRequestData?.Action]);

  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setErrors("Only PDF files are allowed.");
        setSelectedFile(null);
      } else {
        setErrors("");
        setSelectedFile(file);
      }
    }
  };
  const AddVehicleBtnClick = async () => {
    let isValid = false;
    // debugger
    // Start with false, set to true if any error occurs
    let hasError = false;

    // Conditionally check account-related fields if accountDetails is true
    if (customerObj.accountDetails === true) {
      if (
        customerObj.accountNumber === null ||
        customerObj.accountNumber === undefined ||
        customerObj.accountNumber === '' ||
        customerObj.ifscCode === null ||
        customerObj.ifscCode === undefined ||
        customerObj.ifscCode === '' ||
        customerObj.branchName === null ||
        customerObj.branchName === undefined ||
        customerObj.branchName === ''
      ) {
        hasError = true;
      }
    }

    // Validation logic
    if (
      (customerObj.accountDetails === true && (
        customerObj.accountNumber === null ||
        customerObj.accountNumber === undefined ||
        customerObj.accountNumber === '' ||
        customerObj.ifscCode === null ||
        customerObj.ifscCode === undefined ||
        customerObj.ifscCode === '' ||
        customerObj.branchName === null ||
        customerObj.branchName === undefined ||
        customerObj.branchName === ''
      )) ||
      (customerObj.pointofContact === true && (
        customerObj.contactPersonEmail === null ||
        customerObj.contactPersonEmail === undefined ||
        customerObj.contactPersonEmail === '' ||
        customerObj.contactPersonNumber === null ||
        customerObj.contactPersonNumber === undefined ||
        customerObj.contactPersonNumber === '' ||
        customerObj.contactPersonName === null ||
        customerObj.contactPersonName === undefined ||
        customerObj.contactPersonName === '' ||
        customerObj.contactPersonDesignation === null ||
        customerObj.contactPersonDesignation === undefined ||
        customerObj.contactPersonDesignation === ''
      )) ||
      customerObj.customerFirmName === null ||
      customerObj.customerFirmName === undefined ||
      customerObj.customerFirmName === '' ||
      customerObj.gstNumber === null ||
      customerObj.gstNumber === undefined ||
      customerObj.gstNumber === '' ||
      customerObj.addressperGST === null ||
      customerObj.addressperGST === undefined ||
      customerObj.addressperGST === '' ||

      customerObj.mobileNumber === null ||
      customerObj.mobileNumber === undefined ||
      customerObj.mobileNumber === '' ||
      customerObj.mobileNumber?.length < 10 ||
      customerObj.emailID === null ||
      customerObj.emailID === undefined ||
      customerObj.emailID === '' ||



      customerObj.pointofContact === null ||
      customerObj.pointofContact === undefined ||
      customerObj.pointofContact === ''
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    // Create JSON object with all fields
    const jsonData = {
      userKeyID: user.userKeyID,
      customerKeyID: modelRequestData.customerKeyID,
      customerFirmName: customerObj.customerFirmName,
      gstNumber: customerObj.gstNumber,
      vendorCode: customerObj.vendorCode,
      billingAddress: customerObj.billingAddress,
      addressperGST: customerObj.addressperGST,
      shippingAddress: customerObj.shippingAddress,
      mobileNumber: customerObj.mobileNumber,
      alternateMobileNumber: customerObj.alternateMobileNumber,
      emailID: customerObj.emailID,
      accountDetails: customerObj.accountDetails,
      accountNumber: customerObj.accountNumber,
      ifscCode: customerObj.ifscCode,
      branchName: customerObj.branchName,
      pointofContact: customerObj.pointofContact,
      contactPersonName: customerObj.contactPersonName,
      contactPersonDesignation: customerObj.contactPersonDesignation,
      contactPersonNumber: customerObj.contactPersonNumber,
      contactAlternateNumber: customerObj.contactAlternateNumber,
      contactPersonEmail: customerObj.contactPersonEmail
    };

    // Log the JSON data to the console
    console.log('Submitted Data:', JSON.stringify(jsonData, null, 2));

    // Proceed with API call if valid
    if (!isValid) {
      addUpdateCustomer(jsonData);
    }
  };

  const addUpdateCustomer = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateCustomer'; // Default URL for Adding Data

      const response = await AddUpdateCustomer(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Customer / Firm Added Successfully!'
              : 'Customer / Firm Updated Successfully!'
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

  // ✅ 1) Replace your existing useEffect with this:
  useEffect(() => {
    if (show && modelRequestData?.Action === 'Update' && modelRequestData?.customerKeyID) {
      GetCustomerModelData(modelRequestData?.customerKeyID);
    }
  }, [show, modelRequestData?.Action, modelRequestData?.customerKeyID]);

  // ✅ 2) Replace your existing GetCustomerModelData with this:
  const GetCustomerModelData = async (id) => {
    if (!id) {
      setLoader(false);
      return;
    }
    setLoader(true);

    try {
      const data = await GetCustomerModel(id);
      if (data?.data?.statusCode === 200) {
        const ModelData = data.data.responseData.data;

        // ✅ Directly set entire object — no merge with old state!
        setcustomerObj({
          customerKeyID: ModelData.customerKeyID ?? null,
          accountDetails: ModelData.accountDetails ?? false,
          customerFirmName: ModelData.customerFirmName ?? '',
          gstNumber: ModelData.gstNumber ?? '',
          vendorCode: ModelData.vendorCode ?? '',
          billingAddress: ModelData.billingAddress ?? '',
          addressperGST: ModelData.addressperGST ?? '',
          shippingAddress: ModelData.shippingAddress ?? '',
          mobileNumber: ModelData.mobileNumber ?? '',
          alternateMobileNumber: ModelData.alternateMobileNumber ?? '',
          emailID: ModelData.emailID ?? '',
          accountNumber: ModelData.accountNumber ?? '',
          ifscCode: ModelData.ifscCode ?? '',
          branchName: ModelData.branchName ?? '',
          pointofContact: ModelData.pointofContact ?? false,
          contactPersonName: ModelData.contactPersonName ?? '',
          contactPersonDesignation: ModelData.contactPersonDesignation ?? '',
          contactPersonNumber: ModelData.contactPersonNumber ?? '',
          contactAlternateNumber: ModelData.contactAlternateNumber ?? '',
          contactPersonEmail: ModelData.contactPersonEmail ?? '',
          userKeyID: ModelData.userKeyID ?? null
        });

        setLoader(false);
      } else {
        setLoader(false);
        console.error('Error fetching data: ', data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error in state: ', error);
    }
  };

  const closeAllModal = () => {
    onHide();
    setShowSuccessModal(false);
  };

  return (
    <>
      <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">{modelRequestData?.Action !== null ? 'Edit Institute' : 'Add Institute'}</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="customerName" className="form-label">
                  Institute Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={50}
                  type="text"
                  className="form-control"
                  id="customerName"
                  placeholder="Enter Institute Name"
                  value={customerObj.customerFirmName}
                  onChange={(e) => {
                    let inputVal = e.target.value;

                    // Remove leading spaces
                    inputVal = inputVal.replace(/^\s+/, '');

                    // Allow only letters, spaces, and dot
                    inputVal = inputVal.replace(/[^a-zA-Z.\s]/g, '');

                    // Capitalize the first letter
                    if (inputVal.length > 0) {
                      inputVal = inputVal.charAt(0).toUpperCase() + inputVal.slice(1);
                    }

                    setcustomerObj({ ...customerObj, customerFirmName: inputVal });
                  }}

                />
                {error && (!customerObj.customerFirmName || customerObj.customerFirmName.trim() === '') && (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                )}
              </div>

              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="gstNumber" className="form-label">
                  Description Of Institute <span style={{ color: 'red' }}>*</span>
                </label>
                <textarea

                  type="text"
                  className="form-control"
                  id="gstNumber"
                  placeholder="Enter Description Of Institute "
                  value={customerObj.gstNumber}
                  onChange={(e) => {
                    let gst = e.target.value.toUpperCase(); // Ensure uppercase
                    gst = gst.replace(/^\s+/, ''); // Remove leading spaces
                    setcustomerObj({ ...customerObj, gstNumber: gst });
                  }}
                />
                {error && (customerObj.gstNumber === null || customerObj.gstNumber === undefined || customerObj.gstNumber === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="customerAddress" className="form-label">
                  State
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select placeholder='Select State' className="user-role-select phone-input-country-code" />
                {error && (customerObj.address === null || customerObj.address === undefined || customerObj.address === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="customerAddress" className="form-label">
                  Select   District
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select placeholder='Select District' className="user-role-select phone-input-country-code" />
                {error && (customerObj.address === null || customerObj.address === undefined || customerObj.address === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="customerAddress" className="form-label">
                  Select   Taluka
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select placeholder='Select  Taluka' className="user-role-select phone-input-country-code" />
                {error && (customerObj.address === null || customerObj.address === undefined || customerObj.address === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>


            </div>


            <div className="row">
              <div className="mb-3">
                <label htmlFor="pdfUpload" className="form-label fw-bold">
                  Upload PDF
                </label>
                <input
                  type="file"
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  id="pdfUpload"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                {error && <div className="invalid-feedback">{error}</div>}

                {selectedFile && (
                  <div className="mt-2 text-success">
                    ✅ Selected: <strong>{selectedFile.name}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <button type="submit" style={{ backgroundColor: '#ffaa33', color: 'white' }} className="btn text-center" onClick={() => AddVehicleBtnClick()}>
            Submit
          </button>
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

export default AddUpdateCustomerFirmModal;