import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

import SuccessPopupModal from 'component/SuccessPopupModal';
import { GetCustomerLookupList, } from 'services/CustomerStaff/CustomerStaffApi';
import { ConfigContext } from 'context/ConfigContext';
import { AddUpdateVehicleApi, GetVehicleModel } from 'services/Vehicle/VehicleApi';
import { GetVehicleTypeLookupList } from 'services/Master Crud/MasterVehicleTypeApi';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import AddUpdateCustomerModal from 'views/Customer/AddUpdateCustomerModal';
import { GetBloodGroupLookupList } from 'services/Master Crud/BloodGroupApi';
import { AddUpdateEmployee, GetEmployeeModel } from 'services/Employee Staff/EmployeeApi';
import { GetDesignationLookupList, GetEmployeeTypeLookupList } from 'services/Employee/EmployeeApi';
import { GetRoleTypeLookupList } from 'services/Master Crud/MasterRoleTypeApi';

const AddUpdateEmployeeModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData, }) => {
  const [customerOption, setCustomerOption] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [bloodTypeOption, setBloodTypeOption] = useState([]);

  const { user, setLoader, companyID } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [vehicleTypeOption, setVehicleTypeOption] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const [employeeObj, setEmployeeObj] = useState({
    password: null,
    lastName: null,
    firstName: null,
    designationID: null,
    empCode: null,
    employeeKeyID: null,
    dateOfJoining: null,
    dateOfBirth: null,
    mobileNumber: null,
    alternativeNumber: null,
    emailID: null,
    bloodGroupID: null,
    aadhaarNumber: null,
    panNumber: null,
    employeeTypeID: null,
    password: null,
    address: null
  });

  // Vehicle Number Plate
  const [vehicleNoPlateImage, setVehicleNoPlateImage] = useState(null);
  const [vehicleNoPlateImagePreview, setVehicleNoPlateImagePreview] = useState('');
  const [vehicleNoPlateSizeError, setVehicleNoPlateSizeError] = useState();

  const [uploadVehicleNoPlateImageObj, setUploadVehicleNoPlateImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: employeeObj.vehicleNoPlateUrl,
    moduleName: 'Vehicle-Crud'
  });

  // RC Book Image
  const [rcBookImage, setRcBookImage] = useState(null);
  const [rcBookImagePreview, setRcBookImagePreview] = useState('');
  const [rcBookSizeError, setRcBookSizeError] = useState();

  const [uploadRcBookImageObj, setUploadRcBookImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: employeeObj.rcBookUrl,
    moduleName: 'Vehicle-Crud'
  });

  const [selectedRole, setSelectedRole] = useState(null);
  const [designationOption, setDesignationOption] = useState([]);
  const [employeeTypeOption, setEmployeeTypeOption] = useState([]);

  // Vehicle Front View Image
  const [vehicleFrontViewImage, setVehicleFrontViewImage] = useState(null);
  const [vehicleFrontViewImagePreview, setVehicleFrontViewImagePreview] = useState('');
  const [vehicleFrontSizeError, setVehicleFrontSizeError] = useState();

  const [uploadVehicleFrontViewImageObj, setUploadVehicleFrontViewImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: employeeObj.vehicleFrontViewUrl,
    moduleName: 'Vehicle-Crud'
  });

  // Vehicle Back View Image
  const [vehicleBackViewImage, setVehicleBackViewImage] = useState(null);
  const [vehicleBackViewImagePreview, setVehicleBackViewImagePreview] = useState('');
  const [vehicleBackSizeError, setVehicleBackSizeError] = useState();

  const [uploadVehicleBackViewImageObj, setUploadVehicleBackViewImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: employeeObj.vehicleBackViewUrl,
    moduleName: 'Vehicle-Crud'
  });

  useEffect(() => {
    GetBloodGroupLookupListData();
    GetDesignationLookupListData();
    GetEmployeeTypeLookupListData();
  }, []);

  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.employeeKeyID !== null) {
        GetEmployeeModelData(modelRequestData?.employeeKeyID);
      }
    }
  }, [modelRequestData?.Action]);
  useEffect(() => {
    GetCustomerLookupListData();
  }, [modelRequestData]);

  // useEffect(() => {
  //   GetVehicleTypeLookupListData();
  // }, [modelRequestData?.Action]);

  const GetDesignationLookupListData = async () => {
    try {
      const response = await GetDesignationLookupList();
      if (response?.data?.statusCode === 200) {
        const designationList = response?.data?.responseData?.data || [];
        const formattedDesignationList = designationList.map((designation) => ({
          value: designation.designationID,
          label: designation.designationName
        }));
        setDesignationOption(formattedDesignationList);
      } else {
        console.error('Failed to fetch designation list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching designation list:', error);
    }
  };

  const GetEmployeeTypeLookupListData = async () => {
    try {
      const response = await GetEmployeeTypeLookupList();
      if (response?.data?.statusCode === 200) {
        const employeeTypeList = response?.data?.responseData?.data || [];
        const formattedEmployeeTypeList = employeeTypeList.map((type) => ({
          value: type.employeeTypeID,
          label: type.employeeTypeName
        }));
        setEmployeeTypeOption(formattedEmployeeTypeList);
      } else {
        console.error('Failed to fetch employee type list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching employee type list:', error);
    }
  };



  const GetEmployeeModelData = async (id) => {
    // debugger
    if (id === undefined) {
      return;
    }

    try {
      const data = await GetEmployeeModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = data.data.responseData.data; // Assuming data is an array
        console.log(ModelData.dateOfBirth, 'dsadsadasdas');
        setEmployeeObj({
          ...employeeObj,
          aadhaarNumber: ModelData.aadhaarNumber,
          userKeyID: ModelData?.userKeyID,
          password: ModelData.password,
          lastName: ModelData.lastName,
          firstName: ModelData.firstName,
          designationID: ModelData.designationID,
          empCode: ModelData.empCode,
          employeeKeyID: ModelData.employeeKeyID,
          dateOfJoining: dayjs(ModelData.dateOfJoining, "DD-MM-YYYY").isValid()
            ? dayjs(ModelData.dateOfJoining, "DD-MM-YYYY").format("YYYY-MM-DD")
            : '',
          dateOfBirth: dayjs(ModelData.dateOfBirth, "DD-MM-YYYY").isValid()
            ? dayjs(ModelData.dateOfBirth, "DD-MM-YYYY").format("YYYY-MM-DD")
            : '',
          mobileNumber: ModelData.mobileNumber,
          alternativeNumber: ModelData.alternativeNumber,
          emailID: ModelData.emailID,
          bloodGroupID: ModelData.bloodGroupID,
          panNumber: ModelData.panNumber,
          employeeTypeID: ModelData.employeeTypeID,
          password: ModelData.password,
          address: ModelData.address,
          roleTypeID: ModelData.roleTypeID,

          employeeTypeID: ModelData.employeeTypeID
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
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [selectedEmployeeType, setSelectedEmployeeType] = useState(null);

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const Submit = async () => {
    let isValid = false;

    if (
      employeeObj.firstName === null ||
      employeeObj.firstName === undefined ||
      employeeObj.firstName === '' ||
      employeeObj.lastName === null ||
      employeeObj.lastName === undefined ||
      employeeObj.lastName === '' ||
      employeeObj.designationID === null ||
      employeeObj.designationID === undefined ||
      employeeObj.designationID === '' ||
      // employeeObj.empCode === null ||
      // employeeObj.empCode === undefined ||
      // employeeObj.empCode === '' ||
      employeeObj.dateOfJoining === null ||
      employeeObj.dateOfJoining === undefined ||
      employeeObj.dateOfJoining === '' ||
      employeeObj.dateOfBirth === null ||
      employeeObj.dateOfBirth === undefined ||
      employeeObj.dateOfBirth === '' ||
      employeeObj.mobileNumber === null ||
      employeeObj.mobileNumber === undefined ||
      employeeObj.mobileNumber === '' ||
      employeeObj.mobileNumber?.length < 10 ||
      employeeObj.emailID === undefined ||
      employeeObj.emailID === '' ||
      employeeObj.emailID === null ||
      employeeObj.bloodGroupID === null ||
      employeeObj.bloodGroupID === undefined ||
      employeeObj.bloodGroupID === '' ||
      employeeObj.aadhaarNumber === null ||
      employeeObj.aadhaarNumber === undefined ||
      employeeObj.aadhaarNumber === '' ||
      employeeObj.aadhaarNumber?.length < 12 ||
      employeeObj.panNumber === null ||
      employeeObj.panNumber === undefined ||
      employeeObj.panNumber === '' ||
      employeeObj.employeeTypeID === null ||
      employeeObj.employeeTypeID === undefined ||
      employeeObj.employeeTypeID === '' ||
      employeeObj.roleTypeID === null ||
      employeeObj.roleTypeID === undefined ||
      employeeObj.roleTypeID === '' ||
      employeeObj.password === null ||
      employeeObj.password === undefined ||
      employeeObj.password === '' ||
      employeeObj.password.length < 8 ||
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
      aadhaarNumber: employeeObj.aadhaarNumber,
      employeeKeyID: modelRequestData?.employeeKeyID,
      firstName: employeeObj.firstName,
      lastName: employeeObj.lastName,
      designationID: employeeObj.designationID,
      empCode: employeeObj.empCode,
      dateOfJoining: employeeObj.dateOfJoining,
      dateOfBirth: employeeObj.dateOfBirth,
      mobileNumber: employeeObj.mobileNumber,
      alternativeNumber: employeeObj.alternativeNumber,
      emailID: employeeObj.emailID,
      bloodGroupID: employeeObj.bloodGroupID,
      panNumber: employeeObj.panNumber,
      employeeTypeID: employeeObj.employeeTypeID,
      password: employeeObj.password,
      address: employeeObj.address,
      roleTypeID: employeeObj.roleTypeID,
      designationID: employeeObj.designationID,
    };
    if (!isValid) {
      AddUpdateEmployeeData(apiParam);
    }
  };

  const AddUpdateEmployeeData = async (apiParam) => {
    try {
      let url = '/AddUpdateEmployee'; // Default URL for Adding Data

      const response = await AddUpdateEmployee(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {

          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Employee Added Successfully!'
              : ' Employee Updated Successfully!'
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


  const GetCustomerLookupListData = async () => {
    try {
      const response = await GetCustomerLookupList(companyID); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const customerLookupList = response?.data?.responseData?.data;

        const formattedCustomerList = customerLookupList.map((customerItem) => ({
          value: customerItem.customerID,
          label: customerItem.name,
          customerKeyID: customerItem.customerKeyID
        }));

        setCustomerOption(formattedCustomerList); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch Customer lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching Customer lookup list:', error);
    }
  };

  const handleDateChange = (date) => {
    setEmployeeObj((prevState) => ({
      ...prevState,
      dateOfBirth: dayjs(date).format('YYYY-MM-DD')  // Store as string
    }));
  };
  const handleDateOfJoiningChange = (date) => {
    setEmployeeObj((prevState) => ({
      ...prevState,
      dateOfJoining: dayjs(date).format('YYYY-MM-DD') // Store as string
    }));
  };

  const handleBloodTypeChange = (selectedOption) => {
    setEmployeeObj((prev) => ({
      ...prev,
      bloodGroupID: selectedOption ? selectedOption.value : ''
    }));
  };

  useEffect(() => {
    GetBloodGroupLookupListData();
  }, []);

  function convertDateStringToDate(date) {
    if (typeof date !== 'string' || !date.includes('/')) {
      return null;
    }
    const [day, month, year] = date.split('/');
    // month is 0-based in JS Date
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const GetBloodGroupLookupListData = async () => {
    try {
      const response = await GetBloodGroupLookupList(); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const bloodGrpLookupList = response?.data?.responseData?.data || [];

        const formattedBloodGrpList = bloodGrpLookupList.map((bloodType) => ({
          value: bloodType.bloodGroupID,
          label: bloodType.bloodGroupName
        }));

        setBloodTypeOption(formattedBloodGrpList); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch role Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching role Type lookup list:', error);
    }
  };

  useEffect(() => {
    GetRoleTypeLookupListData()
  }, [])
  const GetRoleTypeLookupListData = async () => {
    setLoader(true);
    try {
      const response = await GetRoleTypeLookupList(); // Ensure this function is imported correctly
      if (response?.data?.statusCode === 200) {
        setLoader(false);
        const roleTypeLookupList = response?.data?.responseData?.data;
        const formattedRoles = roleTypeLookupList.map((roleType) => ({
          value: roleType.roleTypeID,
          label: roleType.roleTypeName
        }));
        setRoleTypes(formattedRoles);
      } else {
        setLoader(false);
        console.error('Failed to fetch role type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      setLoader(false);
      console.error('Error fetching role type lookup list:', error);
    }
  };


  return (
    <>
      <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
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
                    Select Designation Type
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Select
                    placeholder="Select Designation"
                    options={designationOption}
                    value={designationOption.find((option) => option.value === employeeObj.designationID) || null}
                    onChange={(option) => setEmployeeObj((prev) => ({ ...prev, designationID: option ? option.value : '' }))}
                    menuPosition="fixed"
                  />
                  {error &&
                    (employeeObj.designationID === null || employeeObj.designationID === undefined || employeeObj.designationID === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label className="form-label">
                    Date Of Joining
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div>
                    <DatePicker

                      value={employeeObj?.dateOfJoining} // Use "selected" instead of "value"
                      onChange={handleDateOfJoiningChange}
                      label="From Date"
                      format="dd/MM/yyyy"
                      clearIcon={null}
                      popperPlacement="bottom-start"
                    />

                    {error &&
                      (employeeObj.dateOfJoining === null || employeeObj.dateOfJoining === undefined || employeeObj.dateOfJoining === '') ? (
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
                  <label className="form-label">
                    Date Of Birth
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div>
                    <DatePicker
                      maxDate={dayjs().subtract(18, 'year').toDate()}

                      value={employeeObj?.dateOfBirth} // Use "selected" instead of "value"
                      onChange={handleDateChange}
                      label="From Date"
                      format="dd/MM/yyyy"
                      clearIcon={null}
                      popperPlacement="bottom-start"
                      defaultValue={employeeObj.dateOfBirth} // Calendar opens to this
                    />
                    {error &&
                      (employeeObj.dateOfBirth === null || employeeObj.dateOfBirth === undefined || employeeObj.dateOfBirth === '') ? (
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
            </div>
            <div className="row">
              <div className="col-12 col-md-6 mb-2">
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
                      value={employeeObj.empCode}
                      onChange={(e) => {
                        setErrorMessage(false);
                        let InputValue = e.target.value;
                        // Allow letters, numbers, spaces, and special characters like @, &, ., -, _
                        const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s@&.\-_]/g, '');
                        setEmployeeObj((prev) => ({
                          ...prev,
                          empCode: updatedValue
                        }));
                      }}
                    />
                    {error && (employeeObj.empCode === null || employeeObj.empCode === undefined || employeeObj.empCode === '') ? (
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
            </div>
            <div className="row">


              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="adharNumber" className="form-label">
                    Aadhaar Number
                  </label>
                  <input
                    maxLength={14}
                    type="text"
                    className="form-control"
                    id="adharNumber"
                    placeholder="Enter Aadhaar Card Number"
                    value={
                      employeeObj.aadhaarNumber
                        ? employeeObj.aadhaarNumber.replace(/(\d{4})(?=\d)/g, "$1-") // format for display
                        : ""
                    }
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9]/g, ""); // Keep only digits

                      // Only allow 12 digits
                      value = value.slice(0, 12);

                      setEmployeeObj((prev) => ({
                        ...prev,
                        aadhaarNumber: value, // plain value stored
                      }));
                    }}
                  />

                  <span style={{ color: 'red' }}>
                    {error && (employeeObj.aadhaarNumber === null || employeeObj.aadhaarNumber === undefined || employeeObj.aadhaarNumber === '')
                      ? ERROR_MESSAGES
                      : (employeeObj.aadhaarNumber !== null || employeeObj.aadhaarNumber !== undefined) && employeeObj?.aadhaarNumber?.length < 12
                        ? 'Invalid Aadhaar Number'
                        : ''}
                  </span>
                </div>

              </div>
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="panNumber" className="form-label">
                  PAN Number
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
            <div className="row">

              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="mobileNumber" className="form-label">
                    Mobile Number
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    maxLength={10}
                    type="text"
                    className="form-control"
                    id="mobileNumber"
                    placeholder="Enter Contact Number"
                    value={employeeObj.mobileNumber}
                    onChange={(e) => {
                      setErrorMessage('');
                      const value = e.target.value;
                      let FormattedNumber = value.replace(/[^0-9]/g, ''); // Allows only numbers

                      // Apply regex to ensure the first digit is between 6 and 9
                      FormattedNumber = FormattedNumber.replace(/^[0-5]/, '');
                      setEmployeeObj((prev) => ({
                        ...prev,
                        mobileNumber: FormattedNumber
                      }));
                    }}
                  />
                  <span style={{ color: 'red' }}>
                    {error &&
                      (employeeObj.mobileNumber === null || employeeObj.mobileNumber === undefined || employeeObj.mobileNumber === '')
                      ? ERROR_MESSAGES
                      : (employeeObj.mobileNumber !== null || employeeObj.mobileNumber !== undefined) &&
                        employeeObj?.mobileNumber?.length < 10
                        ? 'Invalid phone Number'
                        : ''}
                  </span>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="alternativeNumber" className="form-label">
                    Alternative Mobile Number
                  </label>
                  <input
                    maxLength={10}
                    type="text"
                    className="form-control"
                    id="alternativeNumber"
                    placeholder="Enter Contact Number"
                    value={employeeObj.alternativeNumber}
                    onChange={(e) => {
                      setErrorMessage('');
                      const value = e.target.value;
                      let FormattedNumber = value.replace(/[^0-9]/g, ''); // Allows only numbers

                      // Apply regex to ensure the first digit is between 6 and 9
                      FormattedNumber = FormattedNumber.replace(/^[0-5]/, '');
                      setEmployeeObj((prev) => ({
                        ...prev,
                        alternativeNumber: FormattedNumber
                      }));
                    }}
                  />
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
      <AddUpdateCustomerModal
        modelRequestData={modelRequestData}
        onHide={() => setShowCustomerModal(false)}
        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        show={showCustomerModal}
      />
    </>
  );
};

export default AddUpdateEmployeeModal;
