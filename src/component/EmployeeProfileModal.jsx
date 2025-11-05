import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { ConfigContext } from 'context/ConfigContext';
import { EmployeeProfileUpdation, GetEmployeeModel } from 'services/Employee Staff/EmployeeApi';
import { ERROR_MESSAGES } from './GlobalMassage';
const EmployeeProfileModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData, isValid }) => {
  const { setLoader, user, companyID } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [employeeObj, setEmployeeObj] = useState({
    name: null,
    address: null,
    aadharNo: null,
    userKeyID: null,
    employeeKeyID: null,
    companyID: null,
    profileImageURL: null,
    birthDate: null,
    mobileNo: null,
    emailID: null,
    seniorID: null,
    adharNumber: null,
    panNumber: null,
    bankAccountNumber: null,
    ifsc: null,
    higherAuthorityID: null,
    roleTypeID: null,
    userName: '',
    password: null
  });

  // profile  img
  const [passportProfileImage, setPassportProfileImage] = useState(null);
  const [passportProfileImagePreview, setPassportProfileImagePreview] = useState('');
  const [passportProfileSizeError, setPassportProfileSizeError] = useState();

  const [uploadPassportProfileImageObj, setUploadPassportProfileImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: employeeObj.PassportProfileUrl,
    moduleName: 'Customer_Employee'
  });

  const handleDateChange = (date) => {
    setEmployeeObj((prevState) => ({
      ...prevState,
      birthDate: date // Update state with selected date
    }));
  };


  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.employeeKeyID !== null) {
        GetEmployeeModelData(modelRequestData.employeeKeyID);
      }
    }
  }, [modelRequestData?.Action]);

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  function convertDateFormat(date) {
    if (typeof date !== 'string' || !date.includes('/')) {
      // Handle the error if date is not in the expected format
      return null; // or return some default date format, if necessary
    }
    const [day, month, year] = date.split('/'); // Split the input date by '/'
    return `${year}/${month}/${day}`; // Rearrange and return in the desired format
  }
  const AddCustomerBtnClick = async () => {
    let isValid = false;
    let PassportProfileUrl = null;

    if (
      employeeObj.name === null ||
      employeeObj.name === undefined ||
      employeeObj.name === '' ||
      employeeObj.mobileNo === null ||
      employeeObj.mobileNo === undefined ||
      employeeObj.mobileNo === '' ||
      employeeObj.mobileNo?.length < 10 ||
      employeeObj.AadhaarNumber === null ||
      employeeObj.AadhaarNumber === undefined ||
      employeeObj.AadhaarNumber === '' ||
      employeeObj.AadhaarNumber?.length < 12 ||
      employeeObj.emailID === null ||
      employeeObj.emailID === undefined ||
      employeeObj.emailID === '' ||
      !emailRegex.test(employeeObj.emailID) ||
      employeeObj.panNumber === null ||
      employeeObj.panNumber === undefined ||
      employeeObj.panNumber === '' ||
      employeeObj.bankAccountNumber === null ||
      employeeObj.bankAccountNumber === undefined ||
      employeeObj.bankAccountNumber === '' ||
      employeeObj.ifsc === null ||
      employeeObj.ifsc === undefined ||
      employeeObj.ifsc === '' ||
      passportProfileImage === null ||
      passportProfileImage === undefined ||
      passportProfileImage === ''
    ) {
      setErrors(true);
      isValid = true;
    } else if (modelRequestData?.Action === null) {
      if (
        employeeObj.userName === null ||
        employeeObj.userName === undefined ||
        employeeObj.userName === '' ||
        employeeObj.password === null ||
        employeeObj.password === undefined ||
        employeeObj.password === ''
      ) {
        setErrors(true);
        isValid = true;
      } else {
        setErrors(false);
        isValid = false;
      }
    } else {
      setErrors(false);
      isValid = false;
    }

    if (!isValid) {
      if (passportProfileImage && passportProfileImage instanceof File) {
        if (passportProfileImage?.size <= 2 * 1024 * 1024) {
          const updatedPassportProfileImageObj = {
            ...uploadPassportProfileImageObj, // Spread the existing object values
            imageFile: passportProfileImage // Add/Update the excelFile property
          };
          PassportProfileUrl = await UploadExcelNode(updatedPassportProfileImageObj);
        } else {
          setPassportProfileSizeError('Image size should not exceed 2MB');
        }
      }
    }

    const apiParam = {
      name: employeeObj.name,
      mobileNo: employeeObj.mobileNo,
      userKeyID: user.userKeyID,
      employeeKeyID: user.userKeyID,
      profileImageURL: PassportProfileUrl,
      birthDate: employeeObj.birthDate,
      emailID: employeeObj.emailID,
      adharNumber: employeeObj.adharNumber,
      panNumber: employeeObj.panNumber,
      bankAccountNumber: employeeObj.bankAccountNumber,
      ifsc: employeeObj.ifsc,
      companyKeyID: companyID
    };

    if (!isValid) {
      AddUpdateEmployeeData(apiParam);
    }
  };

  const AddUpdateEmployeeData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/EmployeeProfileUpdation'; // Default URL for Adding Data

      const response = await EmployeeProfileUpdation(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Profile Added Successfully!'
              : ' Profile Updated Successfully!'
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

  const GetEmployeeModelData = async (id) => {

    setLoader(true);
    if (id === undefined) {
      return;
    }

    try {
      const data = await GetEmployeeModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);

        const ModelData = data.data.responseData.data; // Assuming data is an array
        let adharNumber = ModelData.adharNumber || ''; // Ensure it doesn't crash if undefined/null
        let formattedAdharNumber = adharNumber.replace(/(\d{4})(?=\d)/g, '$1-'); // Format XXXX-XXXX-XXXX

        setEmployeeObj({
          ...employeeObj,
          address: ModelData.address,
          aadharNo: ModelData.aadharNo,
          userKeyID: ModelData.userKeyID,
          employeeKeyID: ModelData.employeeKeyID,
          companyID: ModelData.companyID,
          name: ModelData.name,
          birthDate: convertDateFormat(ModelData.birthDate),
          mobileNo: ModelData.mobileNo,
          emailID: ModelData.emailID,
          adharNumber, // Store raw number
          adharNumberFormatted: formattedAdharNumber,
          panNumber: ModelData.panNumber,
          bankAccountNumber: ModelData.bankAccountNumber,
          ifsc: ModelData.ifsc,
          profileImageURL: ModelData.profileImageURL,
          roleTypeID: ModelData.roleTypeID,
          userName: ModelData.userName,
          password: ModelData.password,
          seniorID: ModelData.seniorID
        });
        setPassportProfileImage(ModelData?.profileImageURL);
        setPassportProfileImagePreview(ModelData?.profileImageURL);
      } else {
        setLoader(false);
        console.error('Error fetching data: ', data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error in Emp Profile: ', error);
    }
  };
  const closeAllModal = () => {
    onHide();
    setShowSuccessModal(false);
  };

  const handleRemovePassportProfileImage = () => {
    setPassportProfileImagePreview(null);
    setPassportProfileImage(null);
  };

  const handlePassportProfileImageChange = (e) => {
    const file = e.target.files[0]; // Get the file object
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size <= 2 * 1024 * 1024) {
        setPassportProfileSizeError('');
        setPassportProfileImage(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          setPassportProfileImagePreview(event.target.result); // Set the image data URL
        };
        reader.readAsDataURL(file); // Convert file to a data URL
      } else if (file.size > 2 * 1024 * 1024) {
        setPassportProfileSizeError('Size of image should not exceed 2MB');
      } else {
        setPassportProfileImagePreview(null);
        setPassportProfileSizeError('');
      }
    } else {
      setPassportProfileImagePreview(null);
      setPassportProfileImage(null);
    }
  };



  return (
    <>
      <Modal size="lg" style={{ zIndex: 1300 }} show={show} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {modelRequestData?.Action !== null ? 'Update Profile' : modelRequestData?.Action === null ? 'Add Profile' : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="customerName" className="form-label">
                    Enter Employee Name
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    maxLength={50}
                    type="text"
                    className="form-control"
                    id="customerName"
                    placeholder="Enter Employee Name"
                    aria-describedby="Employee"
                    value={employeeObj.name}
                    onChange={(e) => {
                      let inputValue = e.target.value;

                      // Remove leading space
                      if (inputValue.startsWith(' ')) {
                        inputValue = inputValue.trimStart();
                      }

                      // Allow only letters, numbers, and spaces
                      inputValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                      // Capitalize the first letter of each word
                      const capitalized = inputValue
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');

                      setEmployeeObj((prev) => ({
                        ...prev,
                        name: capitalized
                      }));
                    }}
                  />
                  {error && (employeeObj.name === null || employeeObj.name === undefined || employeeObj.name === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label className="form-label">
                    Date Of Birth
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div>
                    <DatePicker
                      value={employeeObj?.birthDate} // Use "selected" instead of "value"
                      onChange={handleDateChange}
                      label="From Date"
                      clearIcon={null}
                      popperPlacement="bottom-start"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="aadharNo" className="form-label">
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
                      {(!employeeObj.emailID || employeeObj.emailID === '') && (
                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                      )}
                      {!(!employeeObj.emailID || employeeObj.emailID === '') && !emailRegex.test(employeeObj.emailID) && (
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
                    disabled
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
                    {error && (employeeObj.mobileNo === null || employeeObj.mobileNo === undefined || employeeObj.mobileNo === '')
                      ? ERROR_MESSAGES
                      : (employeeObj.mobileNo !== null || employeeObj.mobileNo !== undefined) && employeeObj?.mobileNo?.length < 10
                        ? 'Invalid phone Number'
                        : ''}
                  </span>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="adharNumber" className="form-label">
                    Aadhaar Card Number
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    maxLength={14}
                    type="text"
                    className="form-control"
                    id="adharNumber"
                    placeholder="Enter Aadhaar Card Number"
                    value={employeeObj.adharNumberFormatted}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters

                      // Ensure first digit is between 6 and 9
                      if (value.length > 0 && !/^[0-9]/.test(value)) {
                        value = value.substring(1);
                      }

                      value = value.slice(0, 12); // Restrict to 12 digits

                      // Format into XXXX-XXXX-XXXX
                      let formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1-');

                      setEmployeeObj((prev) => ({
                        ...prev,
                        adharNumber: value, // Store only numbers
                        adharNumberFormatted: formattedValue // Store formatted value for UI
                      }));
                    }}
                  />

                  <span style={{ color: 'red' }}>
                    {error && (employeeObj.adharNumber === null || employeeObj.adharNumber === undefined || employeeObj.adharNumber === '')
                      ? ERROR_MESSAGES
                      : (employeeObj.adharNumber !== null || employeeObj.adharNumber !== undefined) && employeeObj?.adharNumber?.length < 12
                        ? 'Invalid Aadhaar Number'
                        : ''}
                  </span>
                </div>
                <div className="mb-2">
                  <div>
                    <label htmlFor="panNumber" className="form-label">
                      PAN Number
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      maxLength={10}
                      type="text"
                      className="form-control"
                      id="panNumber"
                      placeholder="Enter PAN Number"
                      value={employeeObj.panNumber}
                      onChange={(e) => {
                        let InputValue = e.target.value;
                        const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s]/g, '').toUpperCase();
                        setEmployeeObj((prev) => ({
                          ...prev,
                          panNumber: updatedValue
                        }));
                      }}
                    />
                    {error && (employeeObj.panNumber === null || employeeObj.panNumber === undefined || employeeObj.panNumber === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div>
                </div>

                <div className=" mb-2">
                  <div>
                    <label htmlFor="bankAccountNumber" className="form-label">
                      Bank Account Number
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      maxLength={16}
                      type="text"
                      className="form-control"
                      id="bankAccountNumber"
                      placeholder="Enter Bank Account Number"
                      value={employeeObj.bankAccountNumber}
                      onChange={(e) => {
                        let InputValue = e.target.value;
                        const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s]/g, '').toUpperCase();
                        setEmployeeObj((prev) => ({
                          ...prev,
                          bankAccountNumber: updatedValue
                        }));
                      }}
                    />
                    {error &&
                      (employeeObj.bankAccountNumber === null ||
                        employeeObj.bankAccountNumber === undefined ||
                        employeeObj.bankAccountNumber === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="passportProfile" className="form-label">
                    Profile Picture
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div
                    className="d-flex align-items-center justify-content-center position-relative border border-secondary rounded"
                    style={{ width: '100%', height: '12rem' }}
                  >
                    {passportProfileImagePreview ? (
                      <>
                        <button
                          onClick={handleRemovePassportProfileImage}
                          className="btn btn-link position-absolute"
                          style={{
                            top: '5px',
                            right: '5px',
                            padding: '0',
                            fontSize: '20px',
                            color: 'black'
                          }}
                        >
                          <i class="fas fa-times"></i>
                        </button>
                        <img
                          className="w-100 h-100 rounded border"
                          alt="Aadhaar Front Preview"
                          src={passportProfileImagePreview}
                          style={{ objectFit: 'contain' }}
                        />
                      </>
                    ) : (
                      <label
                        htmlFor="passportProfile"
                        style={{ color: '#6c757d' }}
                        className="d-flex flex-column align-items-center justify-content-center text-center cursor-pointer"
                      >
                        <i style={{ fontSize: '2rem', color: '#6c757d' }} class="fa-solid fa-plus"></i>

                        <span className="d-block mt-2">Upload Image</span>
                      </label>
                    )}
                    <input
                      type="file"
                      id="passportProfile"
                      accept="image/jpeg, image/png"
                      style={{ display: 'none' }}
                      onChange={handlePassportProfileImageChange}
                    />
                  </div>
                </div>

                {error && (passportProfileImage === null || passportProfileImage === '' || passportProfileImage === undefined) && (
                  <div style={{ color: 'red' }}>{ERROR_MESSAGES}</div>
                )}

                {passportProfileSizeError ? (
                  <div style={{ color: 'red' }}>{passportProfileSizeError}</div>
                ) : !passportProfileImage ? (
                  <small>Supported:(Max 2MB)</small>
                ) : (
                  ''
                )}
              </div>
            </div>

            <div className="row">
              {/* Bank account number */}
              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="ifsc" className="form-label">
                    IFSC Number
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    maxLength={10}
                    type="text"
                    className="form-control"
                    id="ifsc"
                    placeholder="Enter IFSC Number"
                    aria-describedby="Employee"
                    value={employeeObj.ifsc}
                    onChange={(e) => {
                      let InputValue = e.target.value;
                      const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s]/g, '');
                      setEmployeeObj((prev) => ({
                        ...prev,
                        ifsc: updatedValue
                      }));
                    }}
                  />
                  {error && (employeeObj.ifsc === null || employeeObj.ifsc === undefined || employeeObj.ifsc === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
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
          <Button type="submit" className="btn btn-primary text-center" onClick={() => AddCustomerBtnClick()}>
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

export default EmployeeProfileModal;
