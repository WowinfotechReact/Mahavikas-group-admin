




import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { AddUpdateAppUser } from 'services/Employee Staff/EmployeeApi';
import { AddUpdateAdminUser, GetAdminUserModel, GetCompanyLookupList, GetRoleLookupList } from 'services/Company/CompanyApi';

const AdminEmployeeAddUpdateModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData, }) => {
      const [customerOption, setCustomerOption] = useState([]);

      const { user, setLoader, companyID } = useContext(ConfigContext);
      const [modelAction, setModelAction] = useState('');
      const [error, setErrors] = useState(null);
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [errorMessage, setErrorMessage] = useState();
      const [showPassword, setShowPassword] = useState(false);

      const [adminObj, setAdminObj] = useState({
            userKeyID: null,
            userKeyIDForUpdate: null,
            firstName: null,
            lastName: null,
            roleKeyID: null,
            emailID: null,
            mobileNo: null,
            password: null,
            address: null
      });


      const [selectedRole, setSelectedRole] = useState(null);
      const [designationOption, setDesignationOption] = useState([]);
      const [companyOption, setCompanyOption] = useState([]);
      const [roleOption, setRoleOption] = useState([]);
      const [employeeTypeOption, setEmployeeTypeOption] = useState([]);





      useEffect(() => {
            if (modelRequestData?.Action === 'Update') {
                  if (modelRequestData?.userKeyIDForUpdate !== null) {
                        GetAdminUserModelData(modelRequestData?.userKeyIDForUpdate);
                  }
            }
      }, [modelRequestData?.Action]);

      useEffect(() => {
            GetRoleLookupListData()
      }, [])
      const GetRoleLookupListData = async () => {
            try {
                  const response = await GetRoleLookupList();
                  if (response?.data?.statusCode === 200) {
                        const designationList = response?.data?.responseData?.data || [];
                        const formattedDesignationList = designationList.map((comp) => ({
                              value: comp.roleKeyID,
                              label: comp.roleName
                        }));
                        setRoleOption(formattedDesignationList);
                  } else {
                        console.error('Failed to fetch designation list:', response?.data?.statusMessage || 'Unknown error');
                  }
            } catch (error) {
                  console.error('Error fetching designation list:', error);
            }
      };
      useEffect(() => {
            GetCompanyLookupListData();
      }, [show]);

      const GetCompanyLookupListData = async () => {
            try {
                  const response = await GetCompanyLookupList();
                  if (response?.data?.statusCode === 200) {
                        const designationList = response?.data?.responseData?.data || [];
                        const formattedDesignationList = designationList.map((comp) => ({
                              value: comp.roleKeyID,
                              label: comp.companyName
                        }));
                        setCompanyOption(formattedDesignationList);
                  } else {
                        console.error('Failed to fetch designation list:', response?.data?.statusMessage || 'Unknown error');
                  }
            } catch (error) {
                  console.error('Error fetching designation list:', error);
            }
      };







      const GetAdminUserModelData = async (id) => {

            if (id === undefined) {
                  return;
            }

            try {
                  const data = await GetAdminUserModel(id);
                  if (data?.data?.statusCode === 200) {
                        setLoader(false);
                        const ModelData = data.data.responseData.data; // Assuming data is an array
                        console.log(ModelData.dateOfBirth, 'dsadsadasdas');
                        setAdminObj({
                              ...adminObj,
                              userKeyIDForUpdate: modelRequestData.userKeyIDForUpdate,
                              firstName: ModelData.firstName,
                              lastName: ModelData.lastName,
                              roleKeyID: ModelData.roleKeyID,
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
                  adminObj.firstName === null ||
                  adminObj.firstName === undefined ||
                  adminObj.firstName === '' ||
                  adminObj.lastName === null ||
                  adminObj.lastName === undefined ||
                  adminObj.lastName === '' ||


                  adminObj.mobileNo === null ||
                  adminObj.mobileNo === undefined ||
                  adminObj.mobileNo === '' ||
                  adminObj.mobileNo?.length < 10 ||
                  adminObj.emailID === undefined ||
                  adminObj.emailID === '' ||
                  adminObj.emailID === null ||

                  adminObj.password === null ||
                  adminObj.password === undefined ||
                  adminObj.password === '' ||
                  adminObj.password.length < 8 ||
                  adminObj.address === null ||
                  adminObj.address === undefined ||
                  adminObj.address === ''
            ) {
                  setErrors(true);
                  isValid = true;
            } else {
                  setErrors(false);
                  isValid = false;
            }

            const apiParam = {
                  userKeyID: user.userKeyID,
                  userKeyIDForUpdate: modelRequestData?.userKeyIDForUpdate,
                  firstName: adminObj.firstName,
                  lastName: adminObj.lastName,
                  mobileNo: adminObj.mobileNo,
                  emailID: adminObj.emailID,
                  password: adminObj.password,
                  address: adminObj.address,
                  roleKeyID: adminObj.roleKeyID,
                  instituteKeyID: modelRequestData.instituteKeyID,
            };
            if (!isValid) {
                  AddUpdateAppUserData(apiParam);
            }
      };

      const AddUpdateAppUserData = async (apiParam) => {
            try {
                  let url = '/AddUpdateAdminUser'; // Default URL for Adding Data

                  const response = await AddUpdateAdminUser(url, apiParam);
                  if (response) {
                        if (response?.data?.statusCode === 200) {

                              setShowSuccessModal(true);
                              setModelAction(
                                    modelRequestData.Action === null || modelRequestData.Action === undefined
                                          ? 'Admin Employee Added Successfully!'
                                          : ' Admin Employee Updated Successfully!'
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







      function convertDateStringToDate(date) {
            if (typeof date !== 'string' || !date.includes('/')) {
                  return null;
            }
            const [day, month, year] = date.split('/');
            // month is 0-based in JS Date
            return new Date(Number(year), Number(month) - 1, Number(day));
      }






      return (
            <>
                  <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
                        <Modal.Header closeButton>
                              <Modal.Title>
                                    <h3 className="text-center">
                                          {modelRequestData?.Action !== null ? 'Update Admin Employee ' : modelRequestData?.Action === null ? 'Add Admin Employee ' : ''}
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
                                                            value={adminObj.firstName}
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

                                                                  setAdminObj((prev) => ({
                                                                        ...prev,
                                                                        firstName: inputValue
                                                                  }));
                                                            }}
                                                      />
                                                      {error && (adminObj.firstName === null || adminObj.firstName === undefined || adminObj.firstName === '') ? (
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
                                                            value={adminObj.lastName}
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

                                                                  setAdminObj((prev) => ({
                                                                        ...prev,
                                                                        lastName: inputValue
                                                                  }));
                                                            }}
                                                      />
                                                      {error && (adminObj.lastName === null || adminObj.lastName === undefined || adminObj.lastName === '') ? (
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
                                                      <label className="form-label">
                                                            Select Role
                                                            <span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <div>
                                                            <Select
                                                                  value={roleOption.find((option) => option.value === adminObj.roleKeyID) || null}
                                                                  onChange={(option) => setAdminObj((prev) => ({ ...prev, roleKeyID: option ? option.value : '' }))}

                                                                  options={roleOption} placeholder='Select Role' />
                                                            {error &&
                                                                  (adminObj.roleKeyID === null || adminObj.roleKeyID === undefined || adminObj.roleKeyID === '') ? (
                                                                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                            ) : (
                                                                  ''
                                                            )}
                                                      </div>
                                                </div>
                                          </div>
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
                                                            value={adminObj.address}
                                                            onChange={(e) => {
                                                                  setErrorMessage(false);
                                                                  let InputValue = e.target.value;
                                                                  // Updated regex to allow common special characters for addresses
                                                                  const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s,.-/#&()]/g, '');
                                                                  setAdminObj((prev) => ({
                                                                        ...prev,
                                                                        address: updatedValue
                                                                  }));
                                                            }}
                                                      />
                                                      {error && (adminObj.address === null || adminObj.address === undefined || adminObj.address === '') ? (
                                                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                      ) : (
                                                            ''
                                                      )}
                                                </div>
                                          </div>


                                    </div>

                                    <div className="row">
                                          {/* <div className="col-12 col-md-6 mb-2">
                                                <div>
                                                      <label className="form-label">
                                                            Employee Code
                                                      </label>
                                                      <div>
                                                            <input
                                                                  maxLength={50}
                                                                  type="text"
                                                                  className="form-control"
                                                                  id="customerLName"
                                                                  placeholder="Enter Employee Code"
                                                                  aria-describedby="Employee"
                                                                  value={adminObj.empCode}
                                                                  onChange={(e) => {
                                                                        setErrorMessage(false);
                                                                        let InputValue = e.target.value;
                                                                        // Allow letters, numbers, spaces, and special characters like @, &, ., -, _
                                                                        const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s@&.\-_]/g, '');
                                                                        setAdminObj((prev) => ({
                                                                              ...prev,
                                                                              empCode: updatedValue
                                                                        }));
                                                                  }}
                                                            />
                                                            {error && (adminObj.empCode === null || adminObj.empCode === undefined || adminObj.empCode === '') ? (
                                                                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                            ) : (
                                                                  ''
                                                            )}
                                                      </div>
                                                </div>
                                          </div> */}

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
                                                            value={adminObj.emailID}
                                                            onChange={(e) => {
                                                                  const inputValue = e.target.value;
                                                                  const trimmedValue = inputValue.replace(/\s+/g, '').replace(/\.{2,}/g, '.'); // Remove consecutive dots
                                                                  setAdminObj((prev) => ({
                                                                        ...prev,
                                                                        emailID: trimmedValue // Use `trimmedValue`
                                                                  }));
                                                            }}
                                                      />

                                                      {error && (
                                                            <>
                                                                  {(!adminObj.emailID || adminObj.emailID.trim() === '') && (
                                                                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                                  )}
                                                                  {!(!adminObj.emailID || adminObj.emailID.trim() === '') && !emailRegex.test(adminObj.emailID) && (
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
                                                            Contact Number
                                                            <span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <input
                                                            maxLength={10}
                                                            type="text"
                                                            className="form-control"
                                                            id="mobileNo"
                                                            placeholder="Enter Contact No."
                                                            value={adminObj.mobileNo}
                                                            onChange={(e) => {
                                                                  setErrorMessage('');
                                                                  const value = e.target.value;
                                                                  let FormattedNumber = value.replace(/[^0-9]/g, ''); // Allows only numbers

                                                                  // Apply regex to ensure the first digit is between 6 and 9
                                                                  FormattedNumber = FormattedNumber.replace(/^[0-5]/, '');
                                                                  setAdminObj((prev) => ({
                                                                        ...prev,
                                                                        mobileNo: FormattedNumber
                                                                  }));
                                                            }}
                                                      />
                                                      <span style={{ color: 'red' }}>
                                                            {error &&
                                                                  (adminObj.mobileNo === null || adminObj.mobileNo === undefined || adminObj.mobileNo === '')
                                                                  ? ERROR_MESSAGES
                                                                  : (adminObj.mobileNo !== null || adminObj.mobileNo !== undefined) &&
                                                                        adminObj?.mobileNo?.length < 10
                                                                        ? 'Invalid phone Number'
                                                                        : ''}
                                                      </span>
                                                </div>
                                          </div>
                                    </div>

                                    <div className="row">




                                    </div>

                                    <div className="row">





                                          <div className="col-12 col-md-6 mb-2">
                                                <div>
                                                      <label htmlFor="Password" className="form-label">
                                                            Password
                                                            <span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <div className="input-group">
                                                            <input
                                                                  maxLength={15}
                                                                  type={showPassword ? 'text' : 'Password'} // Toggle input type
                                                                  className="form-control"
                                                                  placeholder="Enter Password"
                                                                  value={adminObj.password}
                                                                  onChange={(e) => {
                                                                        let InputValue = e.target.value;
                                                                        // Allow alphanumeric characters and special characters like @, #, $, %, &, *, !
                                                                        const updatedValue = InputValue.replace(/[^a-zA-Z0-9@#$%&*!]/g, '');
                                                                        setAdminObj((prev) => ({
                                                                              ...prev,
                                                                              password: updatedValue
                                                                        }));
                                                                  }}
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
                                                                  adminObj.password === null ||
                                                                  adminObj.password === undefined ||
                                                                  adminObj.password === '' ||
                                                                  adminObj.password.length < 8
                                                            ) ? (
                                                            <span style={{ color: 'red' }}>
                                                                  {adminObj.password && adminObj.password.length < 8
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

export default AdminEmployeeAddUpdateModal;
