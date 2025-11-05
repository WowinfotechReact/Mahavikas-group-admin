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
            <h3 className="text-center">{modelRequestData?.Action !== null ? 'Edit Customer/Firm Master' : 'Add Customer/Firm Master'}</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="customerName" className="form-label">
                  Customer Name / Firm Name<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={50}
                  type="text"
                  className="form-control"
                  id="customerName"
                  placeholder="Enter Name / Firm Name"
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
                  GST Number<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={15}
                  type="text"
                  className="form-control"
                  id="gstNumber"
                  placeholder="Enter GST Number"
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
                <label htmlFor="vendorCode" className="form-label">
                  Vendor Code<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={50}
                  type="text"
                  className="form-control"
                  id="vendorCode"
                  placeholder="Enter Vendor Code"
                  value={customerObj.vendorCode}
                  onChange={(e) => setcustomerObj({ ...customerObj, vendorCode: e.target.value })}
                />
                {error && (customerObj.vendorCode === null || customerObj.vendorCode === undefined || customerObj.vendorCode === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>

              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="AddressPerGST" className="form-label">
                  Address per GST Number <span style={{ color: 'red' }}>*</span>
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  id="AddressPerGST"
                  placeholder="Enter Address per GST Number"
                  value={customerObj.addressperGST}
                  onChange={(e) => {
                    let gst = e.target.value.toUpperCase(); // Ensure uppercase
                    gst = gst.replace(/^\s+/, ''); // Remove leading spaces
                    setcustomerObj({ ...customerObj, addressperGST: gst });
                  }}
                />
                {error &&
                  (customerObj.addressperGST === null || customerObj.addressperGST === undefined || customerObj.addressperGST === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="billingAddress" className="form-label">
                  Billing Address
                </label>
                <textarea
                  className="form-control"
                  placeholder="Enter Billing Address"
                  maxLength={250}
                  value={customerObj.billingAddress}
                  onChange={(e) => setcustomerObj({ ...customerObj, billingAddress: e.target.value })}
                />
                {/* {error &&
                (customerObj.billingAddress === null || customerObj.billingAddress === undefined || customerObj.billingAddress === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )} */}
              </div>
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="shippingAddress" className="form-label">
                  Shipping Address
                </label>
                <textarea
                  className="form-control"
                  placeholder="Enter Shipping Address"
                  maxLength={250}
                  value={customerObj.shippingAddress}
                  onChange={(e) => setcustomerObj({ ...customerObj, shippingAddress: e.target.value })}
                />
                {/* {error &&
                (customerObj.shippingAddress === null ||
                  customerObj.shippingAddress === undefined ||
                  customerObj.shippingAddress === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )} */}
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="mobileNumber" className="form-label">
                  Mobile Number<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={10}
                  type="text"
                  className="form-control"
                  id="mobileNumber"
                  placeholder="Enter Mobile Number"
                  value={customerObj.mobileNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    let FormattedNumber = value.replace(/[^0-9]/g, ''); setcustomerObj({ ...customerObj, mobileNumber: FormattedNumber })
                  }}
                />
                {error &&
                  (customerObj.mobileNumber === null || customerObj.mobileNumber === undefined || customerObj.mobileNumber === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="alternativeNumber" className="form-label">
                  Alternative Number
                </label>
                <input
                  maxLength={10}
                  type="text"
                  className="form-control"
                  id="alternativeNumber"
                  placeholder="Enter Alternative Number"
                  value={customerObj.alternateMobileNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    let FormattedNumber = value.replace(/[^0-9]/g, ''); setcustomerObj({ ...customerObj, alternateMobileNumber: FormattedNumber })
                  }}
                />


              </div>

              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="emailID" className="form-label">
                  Email ID<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={50}
                  type="email"
                  className="form-control"
                  id="emailID"
                  placeholder="Enter Email ID"
                  value={customerObj.emailID}
                  onChange={(e) => setcustomerObj({ ...customerObj, emailID: e.target.value })}
                />
                {error && (customerObj.emailID === null || customerObj.emailID === undefined || customerObj.emailID === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="position-relative border-top border-bottom border-start mt-2 border-end border-2 p-3">
              <span
                className="position-absolute top-0 translate-middle-y px-3 fw-bold bg-light"
                style={{ left: "10px", paddingTop: "5px", paddingBottom: "5px" }} // Adjusts top & bottom spacing
              >
                Bank Details
              </span>
              <div className="row">
                <div className="col-12 col-md-6 mb-2">
                  <label className="form-label">
                    Account Details (Yes/No)<span style={{ color: 'red' }}>*</span>
                  </label>
                  <div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="accountDetails"
                        id="accountYes"
                        value="yes"
                        checked={customerObj.accountDetails === true}
                        onChange={() => setcustomerObj({ ...customerObj, accountDetails: true })}
                      />
                      <label className="form-check-label" htmlFor="accountYes">
                        Yes
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="accountDetails"
                        id="accountNo"
                        value="no"
                        checked={customerObj.accountDetails === false}
                        onChange={() => setcustomerObj({ ...customerObj, accountDetails: false })}
                      />
                      <label className="form-check-label" htmlFor="accountNo">
                        No
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-2"></div>
              </div>
              {customerObj.accountDetails === true && (
                <div className="row">
                  <div className="col-12 col-md-6 mb-2">
                    <label htmlFor="accountNumber" className="form-label">
                      Account Number<span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      maxLength={14}
                      type="text"
                      className="form-control"
                      id="accountNumber"
                      placeholder="Enter Account Number"
                      value={customerObj.accountNumber}
                      onChange={(e) => setcustomerObj({ ...customerObj, accountNumber: e.target.value })}
                    />
                    {error &&
                      (customerObj.accountNumber === null || customerObj.accountNumber === undefined || customerObj.accountNumber === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className="col-12 col-md-6 mb-2">
                    <label htmlFor="ifscCode" className="form-label">
                      IFSC Code<span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      maxLength={11}
                      type="text"
                      className="form-control"
                      id="ifscCode"
                      placeholder="Enter IFSC Code"
                      value={customerObj.ifscCode}
                      onChange={(e) => setcustomerObj({ ...customerObj, ifscCode: e.target.value })}
                    />
                    {error && (customerObj.ifscCode === null || customerObj.ifscCode === undefined || customerObj.ifscCode === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div>

                  <div className="col-12 col-md-6 mb-2">
                    <label htmlFor="branchName" className="form-label">
                      Branch Name<span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      maxLength={50}
                      type="text"
                      className="form-control"
                      id="branchName"
                      placeholder="Enter Branch Name"
                      value={customerObj.branchName}
                      onChange={(e) => setcustomerObj({ ...customerObj, branchName: e.target.value })}
                    />
                    {error && (customerObj.branchName === null || customerObj.branchName === undefined || customerObj.branchName === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="position-relative border-top border-bottom border-start mt-2 border-end border-2 p-3">
              <span
                className="position-absolute top-0 translate-middle-y px-3 fw-bold bg-light"
                style={{ left: "10px", paddingTop: "5px", paddingBottom: "5px" }} // Adjusts top & bottom spacing
              >
                Contact Person Details
              </span>
              <div className="row">

                <div className="col-12 col-md-6 mb-2">
                  <label className="form-label">
                    Point of Contact (Yes/No)<span style={{ color: 'red' }}>*</span>
                  </label>
                  <div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="pointOfContact"
                        id="pointYes"
                        checked={customerObj.pointofContact === true}
                        onChange={() => setcustomerObj({ ...customerObj, pointofContact: true })}
                      />
                      <label className="form-check-label" htmlFor="pointYes">
                        Yes
                      </label>
                    </div>

                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="pointOfContact"
                        id="pointNo"
                        checked={customerObj.pointofContact === false}
                        onChange={() => setcustomerObj({ ...customerObj, pointofContact: false })}
                      />
                      <label className="form-check-label" htmlFor="pointNo">
                        No
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-2"></div>
              </div>

              {customerObj.pointofContact === true && (
                <div className="row">
                  <div className="col-12 col-md-6 mb-2">
                    <label htmlFor="contactPersonName" className="form-label">
                      Full Name<span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      maxLength={50}
                      type="text"
                      className="form-control"
                      id="contactPersonName"
                      placeholder="Enter Full Name"
                      value={customerObj.contactPersonName}
                      onChange={(e) => setcustomerObj({ ...customerObj, contactPersonName: e.target.value })}
                    />
                    {error &&
                      (customerObj.contactPersonName === null ||
                        customerObj.contactPersonName === undefined ||
                        customerObj.contactPersonName === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className="col-12 col-md-6 mb-2">
                    <label htmlFor="contactPersonDesignation" className="form-label">
                      Contact Person Designation<span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      maxLength={50}
                      type="text"
                      className="form-control"
                      id="contactPersonDesignation"
                      placeholder="Enter Designation"
                      value={customerObj.contactPersonDesignation}
                      onChange={(e) => setcustomerObj({ ...customerObj, contactPersonDesignation: e.target.value })}
                    />
                    {error &&
                      (customerObj.contactPersonDesignation === null ||
                        customerObj.contactPersonDesignation === undefined ||
                        customerObj.contactPersonDesignation === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div>

                  <div className="col-12 col-md-6 mb-2">
                    <label htmlFor="contactPersonNumber" className="form-label">
                      Contact Mobile Number<span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      maxLength={10}
                      type="text"
                      className="form-control"
                      id="contactPersonNumber"
                      placeholder="Enter Contact Mobile Number"
                      value={customerObj.contactPersonNumber}
                      onChange={(e) => {
                        const value = e.target.value;
                        let FormattedNumber = value.replace(/[^0-9]/g, ''); setcustomerObj({ ...customerObj, contactPersonNumber: FormattedNumber })
                      }}
                    />
                    {error &&
                      (customerObj.contactPersonNumber === null ||
                        customerObj.contactPersonNumber === undefined ||
                        customerObj.contactPersonNumber === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div>

                  <div className="col-12 col-md-6 mb-2">
                    <label htmlFor="contactAlternativeNumber" className="form-label">
                      Contact Alternative Number
                    </label>
                    <input
                      maxLength={10}
                      type="text"
                      className="form-control"
                      id="contactAlternativeNumber"
                      placeholder="Enter Contact Alternative Number"
                      value={customerObj.contactAlternateNumber}
                      onChange={(e) => {
                        const value = e.target.value;
                        let FormattedNumber = value.replace(/[^0-9]/g, ''); setcustomerObj({ ...customerObj, contactAlternateNumber: FormattedNumber })
                      }}
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-2">
                    <label htmlFor="contactPersonEmail" className="form-label">
                      Contact Email ID<span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      maxLength={50}
                      type="email"
                      className="form-control"
                      id="contactPersonEmail"
                      placeholder="Enter Contact Email ID"
                      value={customerObj.contactPersonEmail}
                      onChange={(e) => setcustomerObj({ ...customerObj, contactPersonEmail: e.target.value })}
                    />
                    {error &&
                      (customerObj.contactPersonEmail === null ||
                        customerObj.contactPersonEmail === undefined ||
                        customerObj.contactPersonEmail === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              )}

              <span style={{ color: 'red' }}>{errorMessage}</span>
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