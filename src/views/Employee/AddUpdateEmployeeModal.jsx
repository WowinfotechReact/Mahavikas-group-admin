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
    projectIDs: null,
    userKeyID: null,
    userKeyIDForUpdate: null,
    userDetailsKeyID: null,
    zoneID: [],
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
      const zoneIDs = Array.isArray(ModelData.zoneIDs)
        ? ModelData.zoneIDs
        : ModelData.zoneIDs
          ? [ModelData.zoneIDs]
          : [];

      const districtID = Array.isArray(ModelData.districtIDs)
        ? ModelData.districtIDs
        : ModelData.districtIDs
          ? [ModelData.districtIDs]
          : [];

      const talukaIDs = Array.isArray(ModelData.talukaIDs)
        ? ModelData.talukaIDs
        : ModelData.talukaIDs
          ? [ModelData.talukaIDs]
          : [];

      // 1) Ensure zone options exist (if you have a loader for zones, call it)
      // If you already load zoneOption elsewhere on component mount, you can skip this.
      // await GetZoneLookupListData(); // uncomment if you need to fetch zone options here

      // 2) Fetch districts for the zones (this sets districtOption)
      if (zoneIDs.length > 0) {
        await GetDistrictLookupListData(zoneIDs);
      } else if (districtID.length > 0) {
        // If zones are not provided but districts exist, you might still need districtOption.
        // If your API requires zone->district, you can attempt to fetch districts by districtID if you have such an API.
        // Otherwise ensure districtOption is available by other means.
        await GetDistrictLookupListData([]); // this will clear; adjust if you have another fetch path
      }

      // 3) Fetch talukas for the districts (this sets talukaOption)
      if (districtID.length > 0) {
        await GetTalukaLookupListData(districtID);
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
        zoneID: zoneIDs,
        districtKeyID: districtID,
        talukaKeyID: talukaIDs,
        // keep server names too if you rely on them elsewhere
        zoneIDs: ModelData.zoneIDs ?? [],
        districtIDs: ModelData.districtIDs ?? [],
        talukaIDs: ModelData.talukaIDs ?? [],
        projectIDs: Array.isArray(ModelData.projectIDs)
          ? ModelData.projectIDs
          : ModelData.projectIDs
            ? [ModelData.projectIDs]
            : prev.projectIDs ?? []
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
      zoneIDs: Array.isArray(employeeObj.zoneID) ? employeeObj.zoneID : [],
      districtIDs: Array.isArray(employeeObj.districtKeyID) ? employeeObj.districtKeyID : [],
      talukaIDs: Array.isArray(employeeObj.talukaKeyID) ? employeeObj.talukaKeyID : [],

      projectIDs: employeeObj.projectIDs
    };
    if (!isValid) {
      AddUpdateAppUserData(apiParam);
    }
  };
  // selected : when isMulti => array of option objects, when single => option object or null
  const selectedToIdsArray = (selected, isMulti) => {
    if (isMulti) {
      return selected ? selected.map(s => s.value) : [];
    } else {
      return selected ? [selected.value] : [];
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






  const handleZoneChange = (selected) => {
    const selectedZoneIds = selectedToIdsArray(selected, zoneIsMulti);

    // Update state: keep arrays internally
    setEmployeeObj(prev => ({
      ...prev,
      zoneID: selectedZoneIds,
      districtKeyID: [], // clear children when parent changes
      talukaKeyID: []
    }));

    // clear downstream options and fetch districts
    setDistrictOption([]);
    setTalukaOption([]);
    GetDistrictLookupListData(selectedZoneIds);
  };

  // value for react-select: either option object (single) or array (multi)
  const zoneValue = zoneIsMulti
    ? zoneOption.filter(opt => (employeeObj.zoneID || []).includes(opt.value))
    : (zoneOption.find(opt => (employeeObj.zoneID || [])[0] === opt.value) || null);


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
      const ZoneIDsParam = zoneIds.join(","); // UUID1,UUID2

      let response = await GetDistrictLookupList(ZoneIDsParam);

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



  useEffect(() => {
    GetZoneLookupListData()
  }, [])
  const GetZoneLookupListData = async () => {

    try {
      let response = await GetZoneLookupList();
      if (response?.data?.statusCode === 200) {
        const villageList = response?.data?.responseData?.data || [];
        const formattedCityList = villageList.map((taluka) => ({
          value: taluka.zoneID,
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



  const handleDistrictChange = (selected) => {
    const selectedDistrictIds = selectedToIdsArray(selected, districtIsMulti);

    setEmployeeObj(prev => ({
      ...prev,
      districtKeyID: selectedDistrictIds,
      talukaKeyID: [] // clear taluka when district changes
    }));

    setTalukaOption([]);
    GetTalukaLookupListData(selectedDistrictIds);
  };

  const districtValue = districtIsMulti
    ? districtOption.filter(opt => (employeeObj.districtKeyID || []).includes(opt.value))
    : (districtOption.find(opt => (employeeObj.districtKeyID || [])[0] === opt.value) || null);




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
      projectIDs: values,
    }));
  };
  const handleTalukaChange = (selected) => {
    const selectedTalukaIds = selectedToIdsArray(selected, talukaIsMulti);

    setEmployeeObj(prev => ({
      ...prev,
      talukaKeyID: selectedTalukaIds
    }));
  };

  const talukaValue = talukaIsMulti
    ? talukaOption.filter(opt => (employeeObj.talukaKeyID || []).includes(opt.value))
    : (talukaOption.find(opt => (employeeObj.talukaKeyID || [])[0] === opt.value) || null);


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
                    value={zoneValue}
                    onChange={handleZoneChange}
                    isMulti={zoneIsMulti}
                    menuPosition="fixed"
                  />

                  {error &&
                    (employeeObj.zoneID === null || employeeObj.zoneID === undefined || employeeObj.zoneID === '') ? (
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
                  value={districtValue}
                  onChange={handleDistrictChange}
                  isMulti={districtIsMulti}
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
                  value={talukaValue}
                  onChange={handleTalukaChange}
                  isMulti={talukaIsMulti}
                  menuPosition="fixed"
                />          {error && (employeeObj.address === null || employeeObj.address === undefined || employeeObj.address === '') ? (
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
                    employeeObj.projectIDs?.includes(item.value)
                  )}
                  onChange={handleProjectChange}
                  menuPosition="fixed"
                />           {error && (employeeObj.projectIDs === null || employeeObj.projectIDs === undefined || employeeObj.villageKeyID === '') ? (
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
