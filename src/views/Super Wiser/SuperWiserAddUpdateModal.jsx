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
import { GetProjectLookupList } from 'services/Project/ProjectApi';
import { GetInstituteLookupList } from 'services/Institute/InstituteApi';
import { GetDesignationLookupList } from 'services/Master Crud/Designationapi';

const SuperWiserAddUpdateModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData, }) => {

      const { user, setLoader, companyID } = useContext(ConfigContext);
      const [modelAction, setModelAction] = useState('');
      const [error, setErrors] = useState(null);
      const [projectOption, setProjectOption] = useState([]);
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [errorMessage, setErrorMessage] = useState();
      const [instituteOption, setInstituteOption] = useState([])
      const [employeeObj, setEmployeeObj] = useState({
            canUpdateAttendance: null,
            attendanceTypeID: null,
            designationID: null,
            instituteIDs: [],
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
                              attendanceTypeID: ModelData.attendanceTypeID,
                              canUpdateAttendance: ModelData.canUpdateAttendance,
                              // projectIDs: ModelData.projectIDs,
                              instituteIDs: Array.isArray(ModelData.instituteIDs)
                                    ? ModelData.instituteIDs
                                    : ModelData.instituteIDs ? [ModelData.instituteIDs] : [],
                              projectIDs: Array.isArray(ModelData.projectIDs)
                                    ? ModelData.projectIDs
                                    : ModelData.projectIDs ? [ModelData.projectIDs] : [],

                        });
                        await GetInstituteLookupListData(ModelData.projectIDs)
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
                  employeeObj.password === null ||
                  employeeObj.password === undefined ||
                  employeeObj.password === '' ||
                  employeeObj.mobileNo === null ||
                  employeeObj.mobileNo === undefined ||
                  employeeObj.mobileNo === '' ||
                  employeeObj.mobileNo?.length < 10 ||
                  employeeObj.emailID === undefined ||
                  employeeObj.emailID === '' ||
                  employeeObj.emailID === null ||
                  employeeObj.instituteIDs === null ||
                  employeeObj.instituteIDs === undefined ||
                  employeeObj.instituteIDs === '' ||

                  employeeObj.canUpdateAttendance === null ||
                  employeeObj.canUpdateAttendance === undefined ||
                  employeeObj.canUpdateAttendance === '' ||
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
                  ProjectIDs: employeeObj?.projectIDs,
                  firstName: employeeObj.firstName,
                  lastName: employeeObj.lastName,
                  mobileNo: employeeObj.mobileNo,
                  emailID: employeeObj.emailID,
                  designationID: employeeObj.designationID,
                  attendanceTypeID: employeeObj.attendanceTypeID,
                  password: employeeObj.password,
                  address: employeeObj.address,
                  appUserTypeID: 2,

                  canUpdateAttendance: employeeObj.canUpdateAttendance,
                  roleKeyID: employeeObj.roleKeyID,
                  companyID: Number(companyID),
                  instituteIDs: employeeObj.instituteIDs,
                  zoneIDs: [],
                  districtIDs: [],
                  talukaIDs: [],
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
      useEffect(() => {
            GetProjectLookupListData(companyID)
      }, [])

      const GetProjectLookupListData = async (companyID) => {

            try {
                  const response = await GetProjectLookupList(null, companyID);

                  if (response?.data?.statusCode === 200) {
                        const list = response?.data?.responseData?.data || [];

                        // 🔥 Remove duplicate projectID
                        const unique = [
                              ...new Map(list.map(item => [item.projectID, item])).values()
                        ];

                        const formatted = unique.map((p) => ({
                              value: p.projectID,
                              label: p.projectName
                        }));

                        setProjectOption(formatted);
                  } else {
                        console.error("Failed to fetch project list");
                  }
            } catch (error) {
                  console.error("Error fetching project lookup list:", error);
            }
      };





      const closeAllModal = () => {
            onHide();
            setShowSuccessModal(false);
      };





      const handleProjectChange = (selectedOptions) => {
            const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];

            setEmployeeObj((prev) => ({
                  ...prev,
                  projectIDs: values,
            }));

            // 🔥 Trigger institute lookup immediately
            GetInstituteLookupListData(values);
      };



      const GetInstituteLookupListData = async (projectIDs) => {
            setLoader(true);

            try {
                  const response = await GetInstituteLookupList('/GetInstituteLookupList', {
                        projectIDs: projectIDs   // 🔥 Sending array
                  });

                  if (response?.data?.statusCode === 200) {
                        setLoader(false);

                        const list = response.data.responseData.data || [];

                        const formatted = list.map(item => ({
                              value: item.instituteID,
                              label: item.instituteName
                        }));

                        setInstituteOption(formatted);
                  } else {
                        setLoader(false);
                        setErrorMessage(response?.response?.data?.errorMessage);
                  }
            } catch (err) {
                  setLoader(false);
                  console.error(err);
            }
      };



      return (
            <>
                  <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
                        <Modal.Header closeButton>
                              <Modal.Title>
                                    <h3 className="text-center">
                                          {modelRequestData?.Action !== null ? 'Update Supervisor' : modelRequestData?.Action === null ? 'Add Supervisor ' : ''}
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
                                                                  inputValue = inputValue.replace(/[^a-zA-Z]/g, '');

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
                                                                  inputValue = inputValue.replace(/[^a-zA-Z]/g, '');

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
                                                      <label htmlFor="customerLName" className="form-label">
                                                            Password
                                                            <span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <input
                                                            maxLength={50}
                                                            type="text"
                                                            className="form-control"
                                                            id="Password"
                                                            placeholder="Enter Password"
                                                            aria-describedby="Employee"
                                                            value={employeeObj.password}
                                                            onChange={(e) => {
                                                                  setErrorMessage(false);
                                                                  let inputValue = e.target.value;

                                                                  // Remove leading spaces
                                                                  inputValue = inputValue.replace(/^\s+/, '');



                                                                  // Auto-capitalize the first letter
                                                                  if (inputValue.length > 0) {
                                                                        inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                                                                  }

                                                                  setEmployeeObj((prev) => ({
                                                                        ...prev,
                                                                        password: inputValue
                                                                  }));
                                                            }}
                                                      />
                                                      {error && (employeeObj.password === null || employeeObj.password === undefined || employeeObj.password === '') ? (
                                                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                      ) : (
                                                            ''
                                                      )}
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

                                    </div>
                                    <div className="row">
                                          <div className="col-12 col-md-6 mb-2">
                                                <div>
                                                      <label htmlFor="Password" className="form-label">
                                                            Select Project
                                                            <span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <Select
                                                            options={projectOption}
                                                            isMulti
                                                            value={projectOption.filter(item =>
                                                                  employeeObj.projectIDs?.includes(item.value)
                                                            )}
                                                            placeholder="Select Project(s)"
                                                            onChange={handleProjectChange}
                                                            menuPosition="fixed"
                                                      />
                                                      {error &&
                                                            (employeeObj.projectIDs === null ||
                                                                  employeeObj.projectIDs === undefined ||
                                                                  employeeObj.projectIDs.length === 0) ? (
                                                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                      ) : (
                                                            ''
                                                      )}


                                                </div>
                                          </div>
                                          <div className="col-12 col-md-6 mb-2">
                                                <div>
                                                      <label htmlFor="Password" className="form-label">
                                                            Select Institute
                                                            <span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <Select
                                                            isMulti
                                                            options={instituteOption}
                                                            value={
                                                                  instituteOption.filter(opt =>
                                                                        Array.isArray(employeeObj.instituteIDs)
                                                                              ? employeeObj.instituteIDs.includes(opt.value)
                                                                              : employeeObj.instituteIDs === opt.value
                                                                  )
                                                            }
                                                            placeholder="Select Institute(s)"
                                                            onChange={(selected) =>
                                                                  setEmployeeObj(prev => ({
                                                                        ...prev,
                                                                        instituteIDs: selected ? selected.map(x => x.value) : []
                                                                  }))
                                                            }
                                                            styles={{
                                                                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                            }}
                                                            menuPosition="fixed"
                                                      />


                                                      {error && !employeeObj.instituteIDs && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}



                                                </div>
                                          </div>


                                          <div className="row">
                                                <div className="col-12 col-md-6 mb-2">
                                                      <style>
                                                            {`
.custom-radio-group {
  display: flex;
  gap: 12px;
}

.custom-radio {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 25px;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: 0.3s;
  font-weight: 00;
  user-select: none;
}

.custom-radio input {
  display: none;
}

.custom-radio.active {
  background-color: #ff7d34;
  border-color: #ff7d34;
  color: #fff;
}

.custom-radio:hover {
  border-color: #ff7d34;
}
`}
                                                      </style>

                                                      <div className="mb-3">
                                                            <label className="mb-1">Can Update Attendance?</label>

                                                            <div className="custom-radio-group">

                                                                  {/* YES OPTION */}
                                                                  <label
                                                                        className={`custom-radio ${employeeObj.canUpdateAttendance === true ? "active" : ""}`}
                                                                  >
                                                                        <input
                                                                              type="radio"
                                                                              name="canUpdateAttendance"
                                                                              checked={employeeObj.canUpdateAttendance === true}
                                                                              onChange={() =>
                                                                                    setEmployeeObj(prev => ({ ...prev, canUpdateAttendance: true }))
                                                                              }
                                                                        />
                                                                        Yes
                                                                  </label>

                                                                  {/* NO OPTION */}
                                                                  <label
                                                                        className={`custom-radio ${employeeObj.canUpdateAttendance === false ? "active" : ""}`}
                                                                  >
                                                                        <input
                                                                              type="radio"
                                                                              name="canUpdateAttendance"
                                                                              checked={employeeObj.canUpdateAttendance === false}
                                                                              onChange={() =>
                                                                                    setEmployeeObj(prev => ({ ...prev, canUpdateAttendance: false }))
                                                                              }
                                                                        />
                                                                        No
                                                                  </label>

                                                            </div>

                                                            {(error && employeeObj.canUpdateAttendance === undefined || employeeObj.canUpdateAttendance === null || employeeObj.canUpdateAttendance === ''

                                                            ) && (
                                                                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                                  )}

                                                      </div>

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

export default SuperWiserAddUpdateModal;

