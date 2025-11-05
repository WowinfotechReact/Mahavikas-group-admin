import React, { useState, useEffect, useContext, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import SuccessPopupModal from 'component/SuccessPopupModal';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { ConfigContext } from 'context/ConfigContext';
import { GetRoleTypeLookupList } from 'services/Master Crud/MasterRoleTypeApi';
import { AddUpdateEmployee, GetEmployeeLookupList, GetEmployeeModel } from 'services/Employee Staff/EmployeeApi';
import { ERROR_MESSAGES } from './GlobalMassage';
import { InstallationTypeOption } from 'Middleware/Utils';
import { GetZoneLookupList } from 'services/Master Crud/MasterZoneApi';
import { GetCompanyLookupList } from 'services/Master Crud/MasterCompany';
import dayjs from 'dayjs';
const UserRegistrationModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData, isValid }) => {
  const [zoneOption, setZoneOption] = useState([]);
  const { setLoader, user, companyID } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [roleTypeOption, setRoleTypeOption] = useState([]);
  const [employeeOption, setEmployeeOption] = useState([]);


  const [employeeObj, setEmployeeObj] = useState({
    name: null,
    companyIDs: null,
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
    password: null,
    zoneIDs: null,
    installationTypeIDs: null
  });

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [companyOption, setCompanyOption] = useState([]); // State to toggle password visibility

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
  const eighteenYearsAgo = dayjs().subtract(18, 'year').toDate();

  const handleDateChange = (date) => {
    setEmployeeObj((prevState) => ({
      ...prevState,
      birthDate: date // Update state with selected date
    }));
  };




  useEffect(() => {
    if (employeeObj.roleTypeID) {
      GetEmployeeLookupListData(employeeObj.roleTypeID, companyID);
    }
  }, [employeeObj.roleTypeID]);

  const GetEmployeeLookupListData = async (roleTypeID, companyID) => {
    try {
      let response = await GetEmployeeLookupList(roleTypeID, companyID); // Call to get employee list based on roleTypeID
      if (response?.data?.statusCode === 200) {
        const employeeList = response?.data?.responseData?.data || [];

        const filteredEmployees = employeeList.map((emp) => ({
          value: emp.employeeID,
          label: emp.name
        }));
        setEmployeeOption(filteredEmployees); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Bad request');
      }
    } catch (error) {
      console.error('Error fetching employee list:', error);
    }
  };

  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.employeeKeyID !== null) {
        GetEmployeeModelData(modelRequestData.employeeKeyID);
      }
    }
  }, [modelRequestData?.Action]);

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  useEffect(() => {
    GetRoleTypeLookupListData();
    GetCompanyLookupListData()
  }, [modelRequestData?.Action]);

  function convertDateFormat(date) {
    if (typeof date !== 'string' || !date.includes('/')) {
      // Handle the error if date is not in the expected format
      return null; // or return some default date format, if necessary
    }
    const [day, month, year] = date.split('/'); // Split the input date by '/'
    return `${year}/${month}/${day}`; // Rearrange and return in the desired format
  }

  // useEffect(() => {
  //   GetStateLookupListData();
  // }, []);
  const GetStateLookupListData = async () => {
    try {
      const response = await GetZoneLookupList(); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const zoneLookupList = response?.data?.responseData?.data || [];

        const formattedZoneList = zoneLookupList.map((zoneItem) => ({
          value: zoneItem.zoneID,
          label: zoneItem.zoneName
        }));

        setZoneOption(formattedZoneList); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch Zone lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching Zone lookup list:', error);
    }
  };
  console.log(employeeObj.roleTypeID, 'iugdsa8yfd087satd96823yueduwysdsuayhdx');

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
      employeeObj.adharNumber === null ||
      employeeObj.adharNumber === undefined ||
      employeeObj.adharNumber === '' ||
      employeeObj.adharNumber?.length < 12 ||
      employeeObj.emailID === null ||
      employeeObj.emailID === undefined ||
      employeeObj.emailID === '' ||
      !emailRegex.test(employeeObj.emailID) ||
      employeeObj.panNumber === null ||
      employeeObj.panNumber === undefined ||
      employeeObj.panNumber === '' ||
      employeeObj.panNumber?.length < 10 ||
      employeeObj.bankAccountNumber === null ||
      employeeObj.bankAccountNumber === undefined ||
      employeeObj.bankAccountNumber === '' ||
      employeeObj.companyIDs === null ||
      employeeObj.companyIDs === undefined ||
      employeeObj.companyIDs === '' ||
      employeeObj.roleTypeID === null ||
      employeeObj.ifsc === null ||
      employeeObj.ifsc === undefined ||
      employeeObj.ifsc === '' ||
      employeeObj.roleTypeID === null ||
      employeeObj.roleTypeID === undefined ||
      employeeObj.roleTypeID === '' ||
      employeeObj.zoneIDs === null ||
      employeeObj.zoneIDs === undefined ||
      employeeObj.zoneIDs === '' ||
      employeeObj.installationTypeIDs === null ||
      employeeObj.installationTypeIDs === undefined ||
      employeeObj.installationTypeIDs === '' ||
      passportProfileImage === null ||
      passportProfileImage === undefined ||
      passportProfileImage === ''
    ) {
      setErrors(true);
      isValid = true;
    } else if (modelRequestData?.Action === null) {
      const isRoleTypeExempt = employeeObj.roleTypeID === 4 || employeeObj.roleTypeID === 5;

      const isUserNameInvalid =
        employeeObj.userName === null ||
        employeeObj.userName === undefined ||
        employeeObj.userName === '';

      const isPasswordInvalid =
        employeeObj.password === null ||
        employeeObj.password === undefined ||
        employeeObj.password === '';

      if (
        isUserNameInvalid ||
        (!isRoleTypeExempt && isPasswordInvalid)
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




    const apiParam = {
      name: employeeObj.name,
      mobileNo: employeeObj.mobileNo,
      aadharNo: employeeObj.aadharNo,
      userKeyID: user.userKeyID,
      companyID: user.companyID,
      profileImageURL: PassportProfileUrl,
      employeeKeyID: employeeObj.employeeKeyID,
      birthDate: employeeObj.birthDate,
      emailID: employeeObj.emailID,
      adharNumber: employeeObj.adharNumber,
      panNumber: employeeObj.panNumber,
      bankAccountNumber: employeeObj.bankAccountNumber,
      ifsc: employeeObj.ifsc,
      seniorID: employeeObj.seniorID,
      roleTypeID: employeeObj.roleTypeID,
      userName: employeeObj.userName,
      password: employeeObj.password,
      companyKeyID: companyID,
      zoneIDs: employeeObj.zoneIDs,
      installationTypeIDs: employeeObj.installationTypeIDs,
      companyIDs: employeeObj.companyIDs,
    };

    if (!isValid) {
      AddUpdateEmployeeData(apiParam);
    }
  };

  const AddUpdateEmployeeData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateEmployee'; // Default URL for Adding Data

      const response = await AddUpdateEmployee(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Employee Added Successfully!'
              : ' Employee Updated Successfully!'
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

  const GetRoleTypeLookupListData = async () => {
    try {
      const response = await GetRoleTypeLookupList(user.userKeyID); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const roleTypeLookupList = response?.data?.responseData?.data || [];

        const formattedIvrList = roleTypeLookupList.map((roleType) => ({
          value: roleType.roleTypeID,
          label: roleType.roleTypeName
        }));

        setRoleTypeOption(formattedIvrList); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch role Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching role Type lookup list:', error);
    }
  };
  const GetEmployeeModelData = async (id) => {
    if (id === undefined) {
      return;
    }
    setLoader(true);

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
          companyIDs: ModelData.companyIDs,
          profileImageURL: ModelData.profileImageURL,
          roleTypeID: ModelData.roleTypeID,
          userName: ModelData.userName,
          password: ModelData.password,
          seniorID: ModelData.seniorID,
          installationTypeIDs: ModelData.installationTypeIDs,
          zoneIDs: ModelData.zoneIDs,
        });
        setPassportProfileImage(ModelData?.profileImageURL);
        setPassportProfileImagePreview(ModelData?.profileImageURL);
      } else {
        setLoader(false);
        // Handle non-200 status codes if necessary
        console.error('Error fetching data: ', data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error in Employee: ', error);
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

  const handleRoleTypeChange = (selectedOption) => {
    setEmployeeObj((prev) => ({
      ...prev,
      roleTypeID: selectedOption ? selectedOption.value : '',
      seniorID: null
    }));
  };
  const handleEmployeeChange = (selectedOption) => {
    setEmployeeObj((prev) => ({
      ...prev,
      seniorID: selectedOption ? selectedOption.value : null
    }));
  };
  const handleZoneChange = (selectedOptions) => {
    setEmployeeObj((prev) => ({
      ...prev,
      zoneIDs: selectedOptions ? selectedOptions.map((option) => option.value) : []
    }));
  };
  const handleInstallationTypeChange = (selectedOption) => {
    setEmployeeObj((prev) => ({
      ...prev,
      installationTypeIDs: selectedOption ? selectedOption.map((option) => option.value) : []
    }));
  };
  const handleCompanyChange = (selectedOption) => {
    setEmployeeObj((prev) => ({
      ...prev,
      companyIDs: selectedOption ? selectedOption.map((option) => option.value) : []
    }));
  };



  const GetCompanyLookupListData = async () => {
    try {
      const response = await GetCompanyLookupList(user.userKeyID);

      if (response?.data?.statusCode === 200) {
        const companyLookupList = response?.data?.responseData?.data || [];
        const formattedCompanyList = companyLookupList?.map((company) => ({
          value: company?.companyID,
          label: company?.companyName,
          companyKeyID: company?.companyKeyID
        }));

        setCompanyOption(formattedCompanyList);

        if (!companyID && formattedCompanyList?.length > 0) {
          changeCompany(formattedCompanyList[0]?.value);
        } else if (companyID) {
          const companyExists = formattedCompanyList?.some((company) => company.value == companyID);
          if (!companyExists && formattedCompanyList?.length > 0) {
            changeCompany(formattedCompanyList[0]?.value);
          } else {
            changeCompany(companyID);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching company list:', error);
    }
  };

  return (
    <>
      <Modal size="lg" style={{ zIndex: 1300 }} show={show} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {modelRequestData?.Action !== null ? 'Update Employee' : modelRequestData?.Action === null ? 'Add Employee' : ''}
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
                      maxDate={dayjs().subtract(18, 'year').toDate()}
                      clearIcon={null}
                      popperPlacement="bottom-start"
                      defaultValue={employeeObj.birthDate || eighteenYearsAgo} // Calendar opens to this

                    />
                    {error && (employeeObj.birthDate === null || employeeObj.birthDate === undefined || employeeObj.birthDate === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
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
                    Contact Number
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    maxLength={10}
                    type="text"
                    className="form-control"
                    id="mobileNo"
                    // disabled={modelRequestData.Action === 'Update'}
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
                        mobileNo: FormattedNumber,
                      }));
                      setEmployeeObj((prev) => ({
                        ...prev,
                        userName: FormattedNumber
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

                    <span style={{ color: 'red' }}>
                      {error && (employeeObj.panNumber === null || employeeObj.panNumber === undefined || employeeObj.panNumber === '')
                        ? ERROR_MESSAGES
                        : (employeeObj.panNumber !== null || employeeObj.panNumber !== undefined) && employeeObj?.panNumber?.length < 10
                          ? 'Invalid Pan Number'
                          : ''}
                    </span>
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
                  <small>Supported: (Max 2MB)</small>
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
                    maxLength={11}
                    type="text"
                    className="form-control"
                    id="ifsc"
                    placeholder="Enter IFSC Number"
                    aria-describedby="Employee"
                    value={employeeObj.ifsc}

                    onChange={(e) => {
                      let InputValue = e.target.value;
                      const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s]/g, '').toUpperCase();
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

              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="customerAddress" className="form-label">
                    User Type
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Select
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999 // Ensures dropdown appears above everything
                      })
                    }}

                    options={roleTypeOption}
                    value={roleTypeOption.filter((item) => item.value === employeeObj.roleTypeID)}
                    onChange={handleRoleTypeChange}
                    menuPosition="fixed"
                  />
                  {error && (employeeObj.roleTypeID === null || employeeObj.roleTypeID === undefined || employeeObj.roleTypeID === '') ? (
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
                  <label htmlFor="higherAuthority" className="form-label">
                    Higher Authority
                  </label>
                  <Select
                    options={employeeOption}
                    placeholder="Select an Employee"
                    value={employeeOption.find((item) => item.value === employeeObj.seniorID) || null}
                    onChange={handleEmployeeChange}
                    isDisabled={!employeeObj.roleTypeID} // Disable dropdown if no role type is selected
                  />

                </div>
              </div>
              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="higherAuthority" className="form-label">
                    Employee Assign Zone
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Select
                    menuPortalTarget={document.body}
                    isMulti
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999 // Ensures dropdown appears above everything
                      })
                    }}
                    options={zoneOption}
                    placeholder="Assign Zone To Employee"
                    value={zoneOption.filter((item) => employeeObj.zoneIDs?.includes(item.value)) || []}
                    onChange={handleZoneChange}
                  />
                  {error && (employeeObj.zoneIDs === null || employeeObj.zoneIDs === undefined || employeeObj.zoneIDs === '') ? (
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
                  <label htmlFor="higherAuthority" className="form-label">
                    Installation Type
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Select
                    isMulti
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999 // Ensures dropdown appears above everything
                      })
                    }}
                    options={InstallationTypeOption}
                    placeholder="Select a Installation Type"
                    value={InstallationTypeOption.filter((item) => employeeObj.installationTypeIDs?.includes(item.value)) || []}
                    onChange={handleInstallationTypeChange}
                  />
                  {error &&
                    (employeeObj.installationTypeIDs === null ||
                      employeeObj.installationTypeIDs === undefined ||
                      employeeObj.installationTypeIDs === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="higherAuthority" className="form-label">
                    Select Company
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Select
                    isMulti
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999 // Ensures dropdown appears above everything
                      })
                    }}
                    options={companyOption}
                    placeholder="Select Company"
                    // value={InstallationTypeOption.filter((item) => employeeObj.installationTypeIDs?.includes(item.value)) || []}

                    value={companyOption.filter((item) => employeeObj.companyIDs?.includes(item.value)) || []}
                    onChange={handleCompanyChange}
                  />
                  {error &&
                    (employeeObj.companyIDs === null ||
                      employeeObj.companyIDs === undefined ||
                      employeeObj.companyIDs === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>

            {modelRequestData?.Action === null && (
              <div className="position-relative border-top border-bottom border-start mt-2 border-end border-2 p-3">
                <span
                  className="position-absolute top-0 translate-middle-y px-3 fw-bold bg-light"
                  style={{ left: "10px", paddingTop: "5px", paddingBottom: "5px" }} // Adjusts top & bottom spacing
                >
                  Login Credentials
                </span>

                <div className="row mt-1">
                  <div className="col-12 col-md-6 mb-1">
                    <div>
                      <label htmlFor="usernameEmp" className="form-label">
                        User Name (Contact No)
                        <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        id="usernameEmp"
                        maxLength={50}
                        type="text"
                        disabled
                        className="form-control"
                        placeholder="Login Credentials"
                        value={employeeObj.userName}
                        onChange={(e) => {
                          let InputValue = e.target.value;
                          const updatedValue = InputValue.replace(/\s/g, ''); // Remove spaces only
                          setEmployeeObj((prev) => ({
                            ...prev,
                            userName: updatedValue
                          }));
                        }}
                        autoComplete="off" // Disable autofill
                      />
                      {error && (employeeObj.userName === null || employeeObj.userName === undefined || employeeObj.userName === '') ? (
                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  {!(employeeObj.roleTypeID === 4 || employeeObj.roleTypeID === 5) && (
                    <div className="col-12 col-md-6 mb-2">
                      <div>
                        <label htmlFor="password" className="form-label">
                          Password
                          <span style={{ color: 'red' }}>*</span>
                        </label>
                        <div className="input-group">
                          <input
                            maxLength={15}
                            type={showPassword ? 'text' : 'password'} // Toggle input type
                            className="form-control"
                            placeholder="Enter Password"
                            value={employeeObj.password}
                            onChange={(e) => {
                              let InputValue = e.target.value;
                              // Allow alphanumeric characters and special characters like @, #, $, %, &, *, !
                              const updatedValue = InputValue.replace(/[^a-zA-Z0-9@#$%&*!]/g, '');
                              setEmployeeObj((prev) => ({
                                ...prev,
                                password: updatedValue
                              }));
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPassword((prev) => !prev)} // Toggle password visibility
                          >
                            {showPassword ? <i class="fa-regular fa-eye-slash"></i> : <i class="fa fa-eye" aria-hidden="true"></i>}
                          </button>
                        </div>
                        {error && (employeeObj.password === null || employeeObj.password === undefined || employeeObj.password === '') ? (
                          <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

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

export default UserRegistrationModal;
