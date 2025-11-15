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
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
// import AddUpdateCustomerModal from 'views/Customer/AddUpdateCustomerModal';
import { AddUpdateAdminUser, GetAdminUserModel, GetCompanyLookupList, GetRoleLookupList } from 'services/Company/CompanyApi';
import { GetInstituteLookupList } from 'services/Institute/InstituteApi';

import { GetStateLookupList } from 'services/Master Crud/MasterStateApi';
import { GetDistrictLookupList } from 'services/Master Crud/MasterDistrictApi';
import { GetTalukaLookupList } from 'services/Master Crud/MasterTalukaApi';
import { GetVillageLookupList } from 'services/Master Crud/MasterVillageApi';
import { GetProjectLookupList } from 'services/Project/ProjectApi';

const AddUpdateEmployeeModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData, }) => {
  const [customerOption, setCustomerOption] = useState([]);

  const { user, setLoader, companyID } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const [employeeObj, setEmployeeObj] = useState({

    firstName: null,
    lastName: null,
    companyKeyID: null,
    instituteKeyID: null,
    emailID: null,
    mobileNo: null,
    password: null,
    address: null,
    zoneKeyList: null,
    districtKeyList: null,
    talukaKeyList: null,
    projectKeyList: null,
    userKeyID: null,
    userKeyIDForUpdate: null,
    userDetailsKeyID: null,
  });


  const [selectedRole, setSelectedRole] = useState(null);
  const [stateOption, setStateOption] = useState([]);
  const [projectOption, setProjectOption] = useState([]);
  const [districtOption, setDistrictOption] = useState([]);
  const [talukaOption, setTalukaOption] = useState([]);
  const [villageOption, setVillageOption] = useState([]);
  const [designationOption, setDesignationOption] = useState([]);
  const [companyOption, setCompanyOption] = useState([]);
  const [instituteOption, setInstituteOption] = useState([]);
  const [zoneOption, setZoneOption] = useState([]);
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
    GetCompanyLookupListData();
  }, [show]);

  const GetCompanyLookupListData = async () => {
    try {
      const response = await GetCompanyLookupList();
      if (response?.data?.statusCode === 200) {
        const designationList = response?.data?.responseData?.data || [];
        const formattedDesignationList = designationList.map((comp) => ({
          value: comp.companyKeyID,
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
  useEffect(() => {
    GetInstituteLookupListData()
  }, [])
  const GetInstituteLookupListData = async () => {
    try {
      const response = await GetInstituteLookupList();
      if (response?.data?.statusCode === 200) {
        const designationList = response?.data?.responseData?.data || [];
        const formattedDesignationList = designationList.map((comp) => ({
          value: comp.instituteKeyID,
          label: comp.instituteName
        }));
        setInstituteOption(formattedDesignationList);
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
        setEmployeeObj({
          ...employeeObj,
          userKeyIDForUpdate: modelRequestData.userKeyIDForUpdate,
          firstName: ModelData.firstName,
          lastName: ModelData.lastName,
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
      userKeyIDForUpdate: modelRequestData?.userKeyIDForUpdate,
      firstName: employeeObj.firstName,
      lastName: employeeObj.lastName,
      mobileNo: employeeObj.mobileNo,
      emailID: employeeObj.emailID,
      password: employeeObj.password,
      address: employeeObj.address,
      companyKeyID: employeeObj.companyKeyID,
    };
    if (!isValid) {
      AddUpdateEmployeeData(apiParam);
    }
  };

  const AddUpdateEmployeeData = async (apiParam) => {
    try {
      let url = '/AddUpdateAdminUser'; // Default URL for Adding Data

      const response = await AddUpdateAdminUser(url, apiParam);
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
  useEffect(() => {
    GetStateLookupListData()
  }, [])






  useEffect(() => {
    if (employeeObj.talukaKeyID !== null && employeeObj.talukaKeyID !== undefined) {
      GetVillageLookupListData();
    }
  }, [employeeObj.talukaKeyID]);
  useEffect(() => {
    if (employeeObj.districtKeyID !== null && employeeObj.districtKeyID !== undefined) {
      GetTalukaLookupListData();
    }
  }, [employeeObj.districtKeyID]);

  useEffect(() => {
    if (employeeObj.stateKeyID !== null && employeeObj.stateKeyID !== undefined) {
      GetDistrictLookupListData();
    }
  }, [employeeObj.stateKeyID]);
  const GetStateLookupListData = async () => {
    try {
      const response = await GetStateLookupList(); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const stateLookupList = response?.data?.responseData?.data || [];

        const formattedIvrList = stateLookupList.map((ivrItem) => ({
          value: ivrItem.stateKeyID,
          label: ivrItem.stateName
        }));

        setStateOption(formattedIvrList); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch IVR lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching IVR lookup list:', error);
    }
  };

  useEffect(() => {
    GetProjectLookupListData()
  }, [])
  const GetProjectLookupListData = async () => {
    try {
      const response = await GetProjectLookupList(); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const stateLookupList = response?.data?.responseData?.data || [];

        const formattedIvrList = stateLookupList.map((ivrItem) => ({
          value: ivrItem.projectKeyID,
          label: ivrItem.projectName
        }));

        setProjectOption(formattedIvrList); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch IVR lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching IVR lookup list:', error);
    }
  };

  const GetDistrictLookupListData = async () => {
    if (employeeObj.stateKeyID === null) return;

    try {
      let response = await GetDistrictLookupList(employeeObj?.stateKeyID);
      if (response?.data?.statusCode === 200) {
        const cityList = response?.data?.responseData?.data || [];
        const formattedCityList = cityList.map((city) => ({
          value: city.districtKeyID,
          label: city.districtName
        }));

        setDistrictOption(formattedCityList); // Ensure this is called with correct data
      } else {
        console.error('Bad request');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const GetTalukaLookupListData = async () => {
    if (employeeObj.districtKeyID === null) return;

    try {
      let response = await GetTalukaLookupList(employeeObj?.districtKeyID);
      if (response?.data?.statusCode === 200) {
        const talukaList = response?.data?.responseData?.data || [];
        const formattedCityList = talukaList.map((taluka) => ({
          value: taluka.talukaKeyID,
          label: taluka.talukaName
        }));

        setTalukaOption(formattedCityList); // Ensure this is called with correct data
      } else {
        console.error('Bad request');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const GetVillageLookupListData = async () => {
    if (employeeObj.talukaKeyID === null) return;

    try {
      let response = await GetVillageLookupList(employeeObj?.talukaKeyID);
      if (response?.data?.statusCode === 200) {
        const villageList = response?.data?.responseData?.data || [];
        const formattedCityList = villageList.map((taluka) => ({
          value: taluka.villageKeyID,
          label: taluka.villageName
        }));

        setVillageOption(formattedCityList); // Ensure this is called with correct data
      } else {
        console.error('Bad request');
      }
    } catch (error) {
      console.log(error);
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



  const handleStateChange = (selectedOption) => {
    setEmployeeObj((prev) => ({
      ...prev,
      stateKeyID: selectedOption ? selectedOption.value : null,
      districtKeyID: '',
      talukaKeyID: '',
      // villageName:''
    }));
  };
  const handleDistrictChange = (selectedOption) => {
    setEmployeeObj((prev) => ({
      ...prev,
      districtKeyID: selectedOption ? selectedOption.value : null,
      talukaKeyID: '',
      // villageName:''
    }));
  };

  const handleTalukaChange = (selectedOption) => {
    setEmployeeObj((prev) => ({
      ...prev,
      talukaKeyID: selectedOption ? selectedOption.value : null,
      // villageName:''
    }));
  };
  const handleVillageChange = (selectedOption) => {
    setEmployeeObj((prev) => ({
      ...prev,
      villageKeyID: selectedOption ? selectedOption.value : null,
      // villageName:''
    }));
  };
  const handleProjectChange = (selectedOption) => {
    setEmployeeObj((prev) => ({
      ...prev,
      projectKeyList: selectedOption ? selectedOption.value : null,

    }));
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
              </div> */}
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
                  <label className="form-label">
                    Select Company
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div>
                    <Select
                      value={companyOption.find((option) => option.value === employeeObj.companyKeyID) || null}
                      onChange={(option) => setEmployeeObj((prev) => ({ ...prev, companyKeyID: option ? option.value : '' }))}

                      options={companyOption} placeholder='Select Company' />
                    {error &&
                      (employeeObj.companyKeyID === null || employeeObj.companyKeyID === undefined || employeeObj.companyKeyID === '') ? (
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
                    Select Zone
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Select
                    placeholder="Select Zone"
                    // options={instituteOption}
                    value={instituteOption.find((option) => option.value === employeeObj.instituteKeyID) || null}
                    onChange={(option) => setEmployeeObj((prev) => ({ ...prev, instituteKeyID: option ? option.value : '' }))}
                    menuPosition="fixed"
                  />
                  {error &&
                    (employeeObj.instituteKeyID === null || employeeObj.instituteKeyID === undefined || employeeObj.instituteKeyID === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="customerAddress" className="form-label">
                  State
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  options={stateOption}
                  value={stateOption.filter((item) => item.value === employeeObj.stateKeyID)}
                  onChange={handleStateChange}
                  menuPosition="fixed"
                />
                {error && (employeeObj.address === null || employeeObj.address === undefined || employeeObj.address === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>

            </div>
            <div className="row">

              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="customerAddress" className="form-label">
                  Select   District
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  options={districtOption}
                  value={districtOption.filter((item) => item.value === employeeObj.districtKeyID)}
                  onChange={handleDistrictChange}
                  menuPosition="fixed"
                />                {error && (employeeObj.address === null || employeeObj.address === undefined || employeeObj.address === '') ? (
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
                <Select
                  options={talukaOption}
                  value={talukaOption.filter((item) => item.value === employeeObj.talukaKeyID)}
                  onChange={handleTalukaChange}
                  menuPosition="fixed"
                />                {error && (employeeObj.address === null || employeeObj.address === undefined || employeeObj.address === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="customerAddress" className="form-label">
                  Select   Village
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  options={villageOption}
                  value={villageOption.filter((item) => item.value === employeeObj.villageKeyID)}
                  onChange={handleVillageChange}
                  menuPosition="fixed"
                />                {error && (employeeObj.villageKeyID === null || employeeObj.villageKeyID === undefined || employeeObj.villageKeyID === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="customerAddress" className="form-label">
                  Select   Project
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  options={projectOption}
                  value={projectOption.filter((item) => item.value === employeeObj.projectKeyList)}
                  onChange={handleProjectChange}
                  menuPosition="fixed"
                />                {error && (employeeObj.projectKeyList === null || employeeObj.projectKeyList === undefined || employeeObj.villageKeyID === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
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

export default AddUpdateEmployeeModal;
