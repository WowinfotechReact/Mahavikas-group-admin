import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import dayjs from 'dayjs';
import Select from 'react-select';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { useLocation } from 'react-router-dom';
import { AddUpdateAppUser, GetAppUserModel } from 'services/Employee Staff/EmployeeApi';

const InstituteEmployeeAddUpdateModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData, }) => {

      const { user, setLoader, companyID } = useContext(ConfigContext);
      const [modelAction, setModelAction] = useState('');
      const [error, setErrors] = useState(null);
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [errorMessage, setErrorMessage] = useState();
      const [showPassword, setShowPassword] = useState(false);

      const [employeeObj, setEmployeeObj] = useState({
            password: null,
            lastName: null,
            roleKeyID: null,
            firstName: null,
            designationID: null,
            companyKeyID: null,
            empCode: null,
            employeeKeyID: null,
            dateOfJoining: null,
            dateOfBirth: null,
            mobileNo: null,
            alternativeNumber: null,
            emailID: null,
            bloodGroupID: null,
            aadhaarNumber: null,
            panNumber: null,
            employeeTypeID: null,
            password: null,
            address: null
      });

      const location = useLocation()

      useEffect(() => {
            if (modelRequestData?.Action === 'Update') {
                  if (modelRequestData?.userKeyIDForUpdate !== null && modelRequestData.userDetailsKeyID !== null) {
                        GetAdminUserModelData(modelRequestData?.userKeyIDForUpdate, modelRequestData.userDetailsKeyID);
                  }
            }
      }, [modelRequestData?.Action]);



      const GetAdminUserModelData = async (id, userDetailsKeyID) => {

            if (id === undefined) {
                  return;
            }

            try {
                  const data = await GetAppUserModel(id, userDetailsKeyID);
                  if (data?.data?.statusCode === 200) {
                        setLoader(false);
                        const ModelData = data.data.responseData.data; // Assuming data is an array
                        setEmployeeObj({
                              ...employeeObj,
                              userKeyIDForUpdate: modelRequestData.userKeyIDForUpdate,
                              firstName: ModelData.firstName,
                              lastName: ModelData.lastName,
                              roleKeyID: ModelData.roleKeyID,
                              companyKeyID: ModelData.companyKeyID,
                              emailID: ModelData.emailID,
                              mobileNo: ModelData.mobileNo,
                              password: ModelData.password,
                              address: ModelData.address,
                        });
                        // rc book
                  } else {
                        // Handle non-200 status codes if necessary
                        console.error('Error fetching data: ', data?.data?.statusCode);
                  }
            } catch (error) {
                  console.error('Error in GetVehicleTypeModalData: ', error);
            }
      };


      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

      const Submit = async () => {
            debugger
            let isValid = false;

            if (
                  employeeObj.firstName === null ||
                  employeeObj.firstName === undefined ||
                  employeeObj.firstName === '' ||
                  employeeObj.lastName === null ||
                  employeeObj.lastName === undefined ||
                  employeeObj.lastName === '' ||


                  employeeObj.mobileNo === null ||
                  employeeObj.mobileNo === undefined ||
                  employeeObj.mobileNo === '' ||
                  employeeObj.mobileNo?.length < 10 ||
                  employeeObj.emailID === undefined ||
                  employeeObj.emailID === '' ||
                  employeeObj.emailID === null ||

                  // employeeObj.password === null ||
                  // employeeObj.password === undefined ||
                  // employeeObj.password === '' ||
                  // employeeObj.password.length < 8 ||
                  employeeObj.address === null ||
                  employeeObj.address === undefined ||
                  employeeObj.address === ''
            ) {
                  setErrors(true);
                  isValid = true;
            } else {
                  setErrors(false);
                  isValid = false;
            }

            const apiParam = {
                  userKeyID: user.userKeyID,

                  userDetailsKeyID: modelRequestData?.userDetailsKeyID,
                  userKeyIDForUpdate: modelRequestData?.userKeyIDForUpdate,
                  firstName: employeeObj.firstName,
                  lastName: employeeObj.lastName,
                  mobileNo: employeeObj.mobileNo,
                  emailID: employeeObj.emailID,
                  // password: employeeObj.password,
                  address: employeeObj.address,
                  roleKeyID: employeeObj.roleKeyID,
                  companyID: companyID,
                  instituteID: location.state.instituteKeyID,
                  zoneIDs: [],
                  districtIDs: [],
                  talukaIDs: [],
                  projectIDs: []
            };
            if (!isValid) {
                  AddUpdateAppUserData(apiParam);
            }
      };

      const AddUpdateAppUserData = async (apiParam) => {
            try {
                  let url = '/AddUpdateAppUser'; // Default URL for Adding Data

                  const response = await AddUpdateAppUser(url, apiParam);
                  if (response) {
                        if (response?.data?.statusCode === 200) {

                              setShowSuccessModal(true);
                              setModelAction(
                                    modelRequestData.Action === null || modelRequestData.Action === undefined
                                          ? 'Institute Employee Added Successfully!'
                                          : 'Institute Employee Updated Successfully!'
                              ); //Do not change this naming convention

                              setIsAddUpdateActionDone(true);
                        } else {
                              setErrorMessage(response?.response?.data?.errorMessage);
                        }
                  }
            } catch (error) {
                  console.error(error);
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
                                    <h3 className="text-center">
                                          {modelRequestData?.Action !== null ? 'Update Employee Of Institute' : modelRequestData?.Action === null ? 'Add Employee For Institute' : ''}
                                    </h3>
                              </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
                              <div className="container">
                                    <div className="row">
                                          <div className="col-12 col-md-6 mb-2">
                                                <div>
                                                      <label htmlFor="customerName" className="form-label">
                                                            First Name
                                                            <span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <input
                                                            maxLength={50}
                                                            type="text"
                                                            className="form-control"
                                                            id="customerName"
                                                            placeholder="Enter First Name"
                                                            aria-describedby="Employee"
                                                            value={employeeObj.firstName}
                                                            onChange={(e) => {
                                                                  setErrorMessage(false);
                                                                  let inputValue = e.target.value;

                                                                  // Remove leading spaces
                                                                  inputValue = inputValue.replace(/^\s+/, '');

                                                                  // Allow only letters and spaces
                                                                  inputValue = inputValue.replace(/[^a-zA-Z\s]/g, '');

                                                                  // Auto-capitalize the first letter
                                                                  if (inputValue.length > 0) {
                                                                        inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                                                                  }

                                                                  setEmployeeObj((prev) => ({
                                                                        ...prev,
                                                                        firstName: inputValue
                                                                  }));
                                                            }}
                                                      />
                                                      {error && (employeeObj.firstName === null || employeeObj.firstName === undefined || employeeObj.firstName === '') ? (
                                                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                      ) : (
                                                            ''
                                                      )}
                                                </div>
                                          </div>

                                          <div className="col-12 col-md-6 mb-2">
                                                <div>
                                                      <label htmlFor="customerLName" className="form-label">
                                                            Last Name
                                                            <span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <input
                                                            maxLength={50}
                                                            type="text"
                                                            className="form-control"
                                                            id="customerLName"
                                                            placeholder="Enter Last Name"
                                                            aria-describedby="Employee"
                                                            value={employeeObj.lastName}
                                                            onChange={(e) => {
                                                                  setErrorMessage(false);
                                                                  let inputValue = e.target.value;

                                                                  // Remove leading spaces
                                                                  inputValue = inputValue.replace(/^\s+/, '');

                                                                  // Allow only letters and spaces
                                                                  inputValue = inputValue.replace(/[^a-zA-Z\s]/g, '');

                                                                  // Auto-capitalize the first letter
                                                                  if (inputValue.length > 0) {
                                                                        inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                                                                  }

                                                                  setEmployeeObj((prev) => ({
                                                                        ...prev,
                                                                        lastName: inputValue
                                                                  }));
                                                            }}
                                                      />
                                                      {error && (employeeObj.lastName === null || employeeObj.lastName === undefined || employeeObj.lastName === '') ? (
                                                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                      ) : (
                                                            ''
                                                      )}
                                                </div>
                                          </div>
                                    </div>
                                    <div className="row">


                                          <div className="col-12 col-md-6 mb-2">
                                                <div>
                                                      <label htmlFor="vehicleNumber" className="form-label">
                                                            Email
                                                            <span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <input
                                                            maxLength={50}
                                                            type="text"
                                                            className="form-control"
                                                            id="customerAddress"
                                                            placeholder="Enter Email"
                                                            aria-describedby="Employee"
                                                            value={employeeObj.emailID}
                                                            onChange={(e) => {
                                                                  const inputValue = e.target.value;
                                                                  const trimmedValue = inputValue.replace(/\s+/g, '').replace(/\.{2,}/g, '.'); // Remove consecutive dots
                                                                  setEmployeeObj((prev) => ({
                                                                        ...prev,
                                                                        emailID: trimmedValue // Use `trimmedValue`
                                                                  }));
                                                            }}
                                                      />

                                                      {error && (
                                                            <>
                                                                  {(!employeeObj.emailID || employeeObj.emailID.trim() === '') && (
                                                                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                                  )}
                                                                  {!(!employeeObj.emailID || employeeObj.emailID.trim() === '') && !emailRegex.test(employeeObj.emailID) && (
                                                                        <label className="validation" style={{ color: 'red' }}>
                                                                              Enter a valid email.
                                                                        </label>
                                                                  )}
                                                            </>
                                                      )}
                                                </div>
                                          </div>
                                          <div className="col-12 col-md-6 mb-2">
                                                <div>
                                                      <label htmlFor="mobileNo" className="form-label">
                                                            Mobile Number
                                                            <span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <input
                                                            maxLength={10}
                                                            type="text"
                                                            className="form-control"
                                                            id="mobileNo"
                                                            placeholder="Enter Contact Number"
                                                            value={employeeObj.mobileNo}
                                                            onChange={(e) => {
                                                                  setErrorMessage('');
                                                                  const value = e.target.value;
                                                                  let FormattedNumber = value.replace(/[^0-9]/g, ''); // Allows only numbers

                                                                  // Apply regex to ensure the first digit is between 6 and 9
                                                                  FormattedNumber = FormattedNumber.replace(/^[0-5]/, '');
                                                                  setEmployeeObj((prev) => ({
                                                                        ...prev,
                                                                        mobileNo: FormattedNumber
                                                                  }));
                                                            }}
                                                      />
                                                      <span style={{ color: 'red' }}>
                                                            {error &&
                                                                  (employeeObj.mobileNo === null || employeeObj.mobileNo === undefined || employeeObj.mobileNo === '')
                                                                  ? ERROR_MESSAGES
                                                                  : (employeeObj.mobileNo !== null || employeeObj.mobileNo !== undefined) &&
                                                                        employeeObj?.mobileNo?.length < 10
                                                                        ? 'Invalid phone Number'
                                                                        : ''}
                                                      </span>
                                                </div>
                                          </div>
                                    </div>
                                    <div className="row">


                                          <div className="col-12 col-md-6 mb-2">
                                                <div>
                                                      <label htmlFor="vehicleNumber" className="form-label">
                                                            Address
                                                            <span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <textarea
                                                            className="form-control"
                                                            placeholder="Enter Address"
                                                            maxLength={250}
                                                            value={employeeObj.address}
                                                            onChange={(e) => {
                                                                  setErrorMessage(false);
                                                                  let InputValue = e.target.value;
                                                                  // Updated regex to allow common special characters for addresses
                                                                  const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s,.-/#&()]/g, '');
                                                                  setEmployeeObj((prev) => ({
                                                                        ...prev,
                                                                        address: updatedValue
                                                                  }));
                                                            }}
                                                      />
                                                      {error && (employeeObj.address === null || employeeObj.address === undefined || employeeObj.address === '') ? (
                                                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                      ) : (
                                                            ''
                                                      )}
                                                </div>
                                          </div>
                                          <div className="col-12 col-md-6 mb-2">
                                                <div>
                                                      <label htmlFor="Password" className="form-label">
                                                            Select Designation
                                                            <span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <div className="input-group">
                                                            <Select
                                                                  placeholder="Select Designation"
                                                                  // options={zoneOption}
                                                                  // value={zoneOption.find(item => item.value === instituteObj?.zoneID)}
                                                                  // onChange={handleZoneChange}
                                                                  menuPosition="fixed"
                                                            />
                                                            <button
                                                                  type="button"
                                                                  className="btn btn-outline-secondary"

                                                                  onClick={() => setShowPassword((prev) => !prev)} // Toggle Password visibility
                                                            >
                                                                  {showPassword ? <i class="fa-regular fa-eye-slash"></i> : <i class="fa fa-eye" aria-hidden="true"></i>}
                                                            </button>
                                                      </div>
                                                      {error &&
                                                            (
                                                                  employeeObj.password === null ||
                                                                  employeeObj.password === undefined ||
                                                                  employeeObj.password === '' ||
                                                                  employeeObj.password.length < 8
                                                            ) ? (
                                                            <span style={{ color: 'red' }}>
                                                                  {employeeObj.password && employeeObj.password.length < 8
                                                                        ? 'Password must be at least 8 characters long'
                                                                        : ERROR_MESSAGES}
                                                            </span>
                                                      ) : (
                                                            ''
                                                      )}

                                                </div>
                                          </div>



                                    </div>
                                    <span style={{ color: 'red' }}>{errorMessage}</span>
                              </div>
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="secondary" onClick={onHide}>
                                    Close
                              </Button>
                              <button className="btn text-center" style={{ background: '#ffaa33', color: 'white' }} onClick={() => Submit()}>
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

export default InstituteEmployeeAddUpdateModal;
