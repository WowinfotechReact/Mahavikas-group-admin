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
import { GetDesignationLookupList } from 'services/Master Crud/Designationapi';

const InstituteEmployeeAddUpdateModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData, }) => {

      const { user, setLoader, companyID } = useContext(ConfigContext);
      const [modelAction, setModelAction] = useState('');
      const [error, setErrors] = useState(null);
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [errorMessage, setErrorMessage] = useState();
      const [showPassword, setShowPassword] = useState(false);
      const [designationOption, setDesignationOption] = useState([])
      const [serviceOption, setServiceOption] = useState([])
      const [employeeObj, setEmployeeObj] = useState({
            attendanceTypeID: null,
            designationID: null,
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


      const AttendanceOption = [
            { label: 'Daily', value: 1 },
            { label: 'Hourly', value: 2 }
      ]
      const GetAdminUserModelData = async (id, userDetailsKeyID) => {

            if (id === undefined) {
                  return;
            }

            try {
                  const data = await GetAppUserModel(id, userDetailsKeyID);
                  if (data?.data?.statusCode === 200) {
                        setLoader(false);
                        const ModelData = data.data.responseData.data; // Assuming data is an array

                        // Build fullName for update mode
                        const fName = ModelData.firstName ? ModelData.firstName.trim() : "";
                        const lName = ModelData.lastName ? ModelData.lastName.trim() : "";

                        let fullName = fName;

                        if (lName && lName !== "") {
                              fullName = `${fName} ${lName}`;
                        }
                        setEmployeeObj({
                              ...employeeObj,
                              userKeyIDForUpdate: modelRequestData.userKeyIDForUpdate,
                              firstName: fName,
                              lastName: lName || null,
                              fullName: fullName,
                              roleKeyID: ModelData.roleKeyID,
                              companyKeyID: ModelData.companyKeyID,
                              emailID: ModelData.emailID,
                              mobileNo: ModelData.mobileNo,
                              password: ModelData.password,
                              address: ModelData.address,
                              designationID: ModelData.designationID,
                              attendanceTypeID: ModelData.attendanceTypeID,
                              serviceID: ModelData.serviceID,
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

            let isValid = false;
            const fullName = employeeObj.fullName ? employeeObj.fullName.trim() : "";

            // Split the name
            const parts = fullName.split(" ").filter(Boolean);


            if (
                  fullName === "" ||          // nothing entered
                  parts.length === 0 ||       // no valid word
                  fullName.endsWith(" ") ||
                  employeeObj.mobileNo === null ||
                  employeeObj.mobileNo === undefined ||
                  employeeObj.mobileNo === '' ||
                  employeeObj.mobileNo?.length < 10 ||
                  employeeObj.emailID === undefined ||
                  employeeObj.emailID === '' ||
                  employeeObj.emailID === null ||
                  employeeObj.designationID === null ||
                  employeeObj.designationID === undefined ||
                  employeeObj.designationID === '' ||
                  employeeObj.attendanceTypeID === null ||
                  employeeObj.attendanceTypeID === undefined ||
                  employeeObj.attendanceTypeID === '' ||
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
            let firstName = null;
            let lastName = null;

            if (parts.length === 1) {
                  firstName = parts[0];
                  lastName = null;
            } else if (parts.length === 2) {
                  firstName = parts[0];
                  lastName = parts[1];
            }
            const apiParam = {
                  userKeyID: user.userKeyID,
                  userDetailsKeyID: modelRequestData?.userDetailsKeyID,
                  userKeyIDForUpdate: modelRequestData?.userKeyIDForUpdate,
                  ProjectIDs: [modelRequestData?.projectID],
                  firstName: employeeObj.firstName,
                  lastName: employeeObj.lastName,
                  mobileNo: employeeObj.mobileNo,
                  emailID: employeeObj.emailID,
                  designationID: employeeObj.designationID,
                  attendanceTypeID: employeeObj.attendanceTypeID,
                  // password: employeeObj.password,
                  address: employeeObj.address,
                  roleKeyID: employeeObj.roleKeyID,
                  appUserTypeID: 3,
                  canUpdateAttendance: false,
                  companyID: companyID,
                  instituteIDs: [location.state.instituteKeyID],
                  zoneIDs: [],
                  districtIDs: [],
                  talukaIDs: [],
                  firstName,
                  lastName
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
      useEffect(() => {
            GetDesignationLookupListData()
      }, [])



      const GetDesignationLookupListData = async () => {



            try {

                  let response = await GetDesignationLookupList(modelRequestData?.serviceID);

                  if (response?.data?.statusCode === 200) {
                        const list = response?.data?.responseData?.data || [];

                        const formatted = list.map((d) => ({
                              value: d.designationID,
                              label: d.designationName,
                        }));

                        setDesignationOption(formatted);
                  }
            } catch (err) {
                  console.error("Error fetching districts:", err);
            }
      };

      const handleServiceChange = async (selectedOption) => {
            const serviceID = selectedOption ? selectedOption.value : null;

            // 1️⃣ Update state
            setEmployeeObj(prev => ({
                  ...prev,
                  serviceID: serviceID,
            }));

            // 2️⃣ Call designation API based on new serviceID
            await GetDesignationLookupListData(serviceID);
      };

      const handleDesignationChange = (selectedOption) => {
            setEmployeeObj(prev => ({
                  ...prev,
                  designationID: selectedOption ? selectedOption.value : null,

            }));

      };
      const handleAttendanceTypeChange = (selectedOption) => {
            setEmployeeObj(prev => ({
                  ...prev,
                  attendanceTypeID: selectedOption ? selectedOption.value : null,

            }));

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
                                                            Full Name
                                                            <span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <input
                                                            maxLength={50}
                                                            type="text"
                                                            className="form-control"
                                                            id="fullName"
                                                            placeholder="Enter Full Name"
                                                            value={employeeObj.fullName}
                                                            onChange={(e) => {
                                                                  setErrorMessage(false);
                                                                  let value = e.target.value;

                                                                  // Block leading spaces
                                                                  value = value.replace(/^\s+/, "");

                                                                  // Allow only letters and space
                                                                  value = value.replace(/[^a-zA-Z ]/g, "");

                                                                  // ❌ Prevent more than ONE space — second space will not be accepted
                                                                  const spaceCount = (value.match(/ /g) || []).length;
                                                                  if (spaceCount > 1) {
                                                                        return; // stop typing here
                                                                  }

                                                                  // Auto-capitalize each word
                                                                  value = value
                                                                        .split(" ")
                                                                        .map((word) =>
                                                                              word.length > 0
                                                                                    ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                                                                    : ""
                                                                        )
                                                                        .join(" ");

                                                                  // Update fullName
                                                                  setEmployeeObj((prev) => ({
                                                                        ...prev,
                                                                        fullName: value
                                                                  }));

                                                                  // Split into first & last name
                                                                  const parts = value.trim().split(" ");

                                                                  if (parts.length === 1) {
                                                                        setEmployeeObj((prev) => ({
                                                                              ...prev,
                                                                              firstName: parts[0],
                                                                              lastName: null
                                                                        }));
                                                                  } else if (parts.length === 2) {
                                                                        setEmployeeObj((prev) => ({
                                                                              ...prev,
                                                                              firstName: parts[0],
                                                                              lastName: parts[1]
                                                                        }));
                                                                  }
                                                            }}
                                                      />




                                                      {error &&
                                                            (employeeObj.fullName === "" ||
                                                                  employeeObj.fullName === undefined ||
                                                                  employeeObj.fullName.endsWith(" ")) ? (
                                                            <span style={{ color: 'red' }}>
                                                                  {employeeObj.fullName?.endsWith(" ")
                                                                        ? "Please enter last name"
                                                                        : "First name is required"}
                                                            </span>
                                                      ) : (
                                                            ""
                                                      )}

                                                </div>
                                          </div>

                                          <div className="col-12 col-md-6 mb-2">
                                                <div>
                                                      <label htmlFor="Password" className="form-label">
                                                            Select Designation
                                                            <span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <Select
                                                            placeholder="Select Designation"
                                                            options={designationOption}
                                                            value={designationOption.find(item => item.value === employeeObj?.designationID)}
                                                            onChange={handleDesignationChange}
                                                            menuPosition="fixed"
                                                      />

                                                      {error && !employeeObj.designationID && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}



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
                                                            maxLength={500}
                                                            value={employeeObj.address}
                                                            onChange={(e) => {
                                                                  setErrorMessage(false);
                                                                  let InputValue = e.target.value;
                                                                  // Updated regex to allow common special characters for addresses
                                                                  const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s,.-/#&@#$%^&*><;'"}\|{~()]/g, '');
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
                                                            Select Attendance Type
                                                            <span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <Select
                                                            placeholder="Select Attendance Type"
                                                            options={AttendanceOption}
                                                            value={AttendanceOption.find(item => item.value === employeeObj?.attendanceTypeID)}
                                                            onChange={handleAttendanceTypeChange}
                                                            menuPosition="fixed"
                                                      />
                                                      {error && !employeeObj.attendanceTypeID && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}




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
