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
import { GetInstituteLookupList } from 'services/Institute/InstituteApi';
import { GetStateLookupList } from 'services/Master Crud/MasterStateApi';
import { GetDistrictLookupList } from 'services/Master Crud/MasterDistrictApi';
import { GetTalukaLookupList } from 'services/Master Crud/MasterTalukaApi';
import { GetVillageLookupList } from 'services/Master Crud/MasterVillageApi';
import { GetProjectLookupList } from 'services/Project/ProjectApi';
import { AddUpdateAppUser, GetAppUserModel } from 'services/Employee Staff/EmployeeApi';
import { GetZoneLookupList } from 'services/Master Crud/MasterZoneApi';

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
    projectKeyList: null,
    userKeyID: null,
    userKeyIDForUpdate: null,
    userDetailsKeyID: null,
    zoneKeyID: [],
    districtKeyID: [],
    talukaKeyID: []

  });
  const [projectOption, setProjectOption] = useState([]);
  const [districtOption, setDistrictOption] = useState([]);
  const [talukaOption, setTalukaOption] = useState([]);
  const [zoneOption, setZoneOption] = useState([]);




  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.userKeyIDForUpdate !== null || modelRequestData?.userDetailsKeyID !== null) {
        GetAdminUserModelData(modelRequestData?.userKeyIDForUpdate, modelRequestData.userDetailsKeyID);
      }
    }
  }, [modelRequestData?.Action]);











  const GetAdminUserModelData = async (id, UserDetailsKeyID) => {
    if (id === undefined) return;

    try {
      setLoader(true);

      const data = await GetAppUserModel(id, UserDetailsKeyID);
      if (data?.data?.statusCode !== 200) {
        console.error('Error fetching user model: ', data?.data?.statusCode);
        setLoader(false);
        return;
      }

      const ModelData = data.data.responseData.data || {};

      // Normalize ID arrays from server (they might be null, single value or array)
      const zoneIDs = Array.isArray(ModelData.zoneKeyList)
        ? ModelData.zoneKeyList
        : ModelData.zoneKeyList
          ? [ModelData.zoneKeyList]
          : [];

      const districtIDs = Array.isArray(ModelData.districtKeyList)
        ? ModelData.districtKeyList
        : ModelData.districtKeyList
          ? [ModelData.districtKeyList]
          : [];

      const talukaIDs = Array.isArray(ModelData.talukaKeyList)
        ? ModelData.talukaKeyList
        : ModelData.talukaKeyList
          ? [ModelData.talukaKeyList]
          : [];

      // 1) Ensure zone options exist (if you have a loader for zones, call it)
      // If you already load zoneOption elsewhere on component mount, you can skip this.
      // await GetZoneLookupListData(); // uncomment if you need to fetch zone options here

      // 2) Fetch districts for the zones (this sets districtOption)
      if (zoneIDs.length > 0) {
        await GetDistrictLookupListData(zoneIDs);
      } else if (districtIDs.length > 0) {
        // If zones are not provided but districts exist, you might still need districtOption.
        // If your API requires zone->district, you can attempt to fetch districts by districtIDs if you have such an API.
        // Otherwise ensure districtOption is available by other means.
        await GetDistrictLookupListData([]); // this will clear; adjust if you have another fetch path
      }

      // 3) Fetch talukas for the districts (this sets talukaOption)
      if (districtIDs.length > 0) {
        await GetTalukaLookupListData(districtIDs);
      } else if (talukaIDs.length > 0) {
        await GetTalukaLookupListData([]); // adjust if your API supports fetching talukas differently
      }

      // 4) Now set employeeObj safely using functional update
      setEmployeeObj(prev => ({
        ...prev,
        userKeyIDForUpdate: ModelData.userKeyIDForUpdate ?? prev.userKeyIDForUpdate ?? null,
        userDetailsKeyID: ModelData.userDetailsKeyID ?? prev.userDetailsKeyID ?? null,
        firstName: ModelData.firstName ?? prev.firstName ?? '',
        lastName: ModelData.lastName ?? prev.lastName ?? '',
        companyKeyID: ModelData.companyKeyID ?? prev.companyKeyID ?? '',
        emailID: ModelData.emailID ?? prev.emailID ?? '',
        mobileNo: ModelData.mobileNo ?? prev.mobileNo ?? '',
        password: ModelData.password ?? prev.password ?? '',
        address: ModelData.address ?? prev.address ?? '',
        // set the arrays your selects expect
        zoneKeyID: zoneIDs,
        districtKeyID: districtIDs,
        talukaKeyID: talukaIDs,
        // keep server names too if you rely on them elsewhere
        zoneKeyList: ModelData.zoneKeyList ?? [],
        districtKeyList: ModelData.districtKeyList ?? [],
        talukaKeyList: ModelData.talukaKeyList ?? [],
        projectKeyList: Array.isArray(ModelData.projectKeyList)
          ? ModelData.projectKeyList
          : ModelData.projectKeyList
            ? [ModelData.projectKeyList]
            : prev.projectKeyList ?? []
      }));
    } catch (error) {
      console.error('Error in GetAdminUserModelData: ', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    // employeeObj.districtKeyID is expected to be an array
    const districtIds = employeeObj.districtKeyID || [];
    // If districtIds is non-empty, fetch; if empty, clear taluka options
    GetTalukaLookupListData(districtIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeObj.districtKeyID]);
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
      userKeyIDForUpdate: employeeObj?.userKeyIDForUpdate,
      userDetailsKeyID: employeeObj?.userDetailsKeyID,
      firstName: employeeObj.firstName,
      lastName: employeeObj.lastName,
      mobileNo: employeeObj.mobileNo,
      emailID: employeeObj.emailID,
      password: employeeObj.password,
      address: employeeObj.address,
      companyKeyID: companyID,
      instituteKeyID: null,
      zoneKeyList: Array.isArray(employeeObj.zoneKeyID) ? employeeObj.zoneKeyID : [],
      districtKeyList: Array.isArray(employeeObj.districtKeyID) ? employeeObj.districtKeyID : [],
      talukaKeyList: Array.isArray(employeeObj.talukaKeyID) ? employeeObj.talukaKeyID : [],

      projectKeyList: employeeObj.projectKeyList
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

  const GetDistrictLookupListData = async (zoneIds = []) => {
    if (!zoneIds || zoneIds.length === 0) {
      setDistrictOption([]);
      return;
    }

    try {
      const zoneKeyIDsParam = zoneIds.join(","); // UUID1,UUID2

      let response = await GetDistrictLookupList(zoneKeyIDsParam);

      if (response?.data?.statusCode === 200) {
        const list = response?.data?.responseData?.data || [];

        const formatted = list.map((d) => ({
          value: d.districtKeyID,
          label: d.districtName
        }));

        setDistrictOption(formatted);
      } else {
        console.error("District fetch failed");
        setDistrictOption([]);
      }
    } catch (err) {
      console.error("Error fetching districts:", err);
      setDistrictOption([]);
    }
  };



  const GetTalukaLookupListData = async (districtIds = []) => {
    // if no districts, clear taluka options
    if (!districtIds || districtIds.length === 0) {
      setTalukaOption([]);
      return;
    }

    try {
      const districtKeyIDsParam = districtIds.join(","); // "id1,id2"
      const response = await GetTalukaLookupList(districtKeyIDsParam); // your helper

      if (response?.data?.statusCode === 200) {
        const talukaList = response?.data?.responseData?.data || [];
        const formatted = talukaList.map((t) => ({
          value: t.talukaKeyID,
          label: t.talukaName
        }));

        setTalukaOption(formatted);
      } else {
        console.error("Bad response fetching talukas", response?.data);
        setTalukaOption([]);
      }
    } catch (err) {
      console.error("Error fetching talukas:", err);
      setTalukaOption([]);
    }
  };

  const handleDistrictChange = (selected) => {
    const districtIDs = selected ? selected.map(s => s.value) : [];

    setEmployeeObj(prev => ({
      ...prev,
      districtKeyID: districtIDs,
      // clear taluka selection because district changed
      talukaKeyID: []
    }));

    // clear taluka options immediately to avoid stale entries
    setTalukaOption([]);

    // fetch talukas for selected districts
    GetTalukaLookupListData(districtIDs);
  };


  useEffect(() => {
    GetZoneLookupListData()
  }, [])
  const GetZoneLookupListData = async () => {

    try {
      let response = await GetZoneLookupList();
      if (response?.data?.statusCode === 200) {
        const villageList = response?.data?.responseData?.data || [];
        const formattedCityList = villageList.map((taluka) => ({
          value: taluka.zoneKeyID,
          label: taluka.zoneName
        }));

        setZoneOption(formattedCityList); // Ensure this is called with correct data
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





  const handleProjectChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];

    setEmployeeObj((prev) => ({
      ...prev,
      projectKeyList: values,
    }));
  };
  const handleTalukaChange = (selected) => {
    const talukaIDs = selected ? selected.map(s => s.value) : [];
    setEmployeeObj(prev => ({ ...prev, talukaKeyID: talukaIDs }));
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
                  <label htmlFor="vehicleNumber" className="form-label">
                    Select Zone
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Select
                    placeholder="Select Zone(s)"
                    options={zoneOption}
                    value={zoneOption.filter(opt =>
                      employeeObj.zoneKeyID.includes(opt.value)
                    )}
                    onChange={(selected) => {
                      const zoneIDs = selected ? selected.map(s => s.value) : [];

                      setEmployeeObj(prev => ({
                        ...prev,
                        zoneKeyID: zoneIDs,
                        districtKeyID: [] // clear district when zones change
                      }));

                      GetDistrictLookupListData(zoneIDs);
                    }}
                    isMulti
                    menuPosition="fixed"
                  />

                  {error &&
                    (employeeObj.zoneKeyID === null || employeeObj.zoneKeyID === undefined || employeeObj.zoneKeyID === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="customerAddress" className="form-label">
                  Select District
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  placeholder="Select District(s)"
                  options={districtOption}
                  value={districtOption.filter(opt => (employeeObj.districtKeyID || []).includes(opt.value))}
                  onChange={handleDistrictChange}
                  isMulti
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
                  Select Taluka
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  placeholder="Select Taluka(s)"
                  options={talukaOption}
                  value={talukaOption.filter(opt => (employeeObj.talukaKeyID || []).includes(opt.value))}
                  onChange={handleTalukaChange}
                  isMulti
                  menuPosition="fixed"
                />            {error && (employeeObj.address === null || employeeObj.address === undefined || employeeObj.address === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>

              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="customerAddress" className="form-label">
                  Select Project
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  options={projectOption}
                  isMulti
                  value={projectOption.filter(item =>
                    employeeObj.projectKeyList?.includes(item.value)
                  )}
                  onChange={handleProjectChange}
                  menuPosition="fixed"
                />           {error && (employeeObj.projectKeyList === null || employeeObj.projectKeyList === undefined || employeeObj.villageKeyID === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>

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
              </div></div>




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
