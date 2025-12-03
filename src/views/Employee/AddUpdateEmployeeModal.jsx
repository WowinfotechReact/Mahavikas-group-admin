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
import { GetDistrictLookupList } from 'services/Master Crud/MasterDistrictApi';
import { GetTalukaLookupList } from 'services/Master Crud/MasterTalukaApi';
import { GetProjectLookupList } from 'services/Project/ProjectApi';
import { GetZoneLookupList } from 'services/Master Crud/MasterZoneApi';
import { AddUpdateAppUser, GetAppUserModel } from 'services/Employee Staff/EmployeeApi';

const AddUpdateEmployeeModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData, }) => {
  const [customerOption, setCustomerOption] = useState([]);

  const { user, setLoader, companyID } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [employeeObj, setEmployeeObj] = useState({
    zoneIDs: [],
    districtIDs: [],
    talukaIDs: [],
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


  });
  const [projectOption, setProjectOption] = useState([]);
  const [districtOption, setDistrictOption] = useState([]);
  const [talukaOption, setTalukaOption] = useState([]);
  const [zoneOption, setZoneOption] = useState([]);




  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.userKeyIDForUpdate !== null || modelRequestData?.userDetailsKeyID !== null) {
        GetAppUserModelData(modelRequestData?.userKeyIDForUpdate, modelRequestData.userDetailsKeyID);
      }
    }
  }, [modelRequestData?.Action]);











  const GetAppUserModelData = async (id, UserDetailsKeyID) => {
    if (id === undefined) return;

    try {
      setLoader(true);

      const data = await GetAppUserModel(id, UserDetailsKeyID);

      if (data?.data?.statusCode !== 200) {
        console.error("Error fetching user model");
        setLoader(false);
        return;
      }

      const ModelData = data.data.responseData.data || {};

      // Normalize multiple-select arrays
      const zoneIDs = Array.isArray(ModelData.zoneIDs)
        ? ModelData.zoneIDs
        : ModelData.zoneIDs ? [ModelData.zoneIDs] : [];

      const districtIDs = Array.isArray(ModelData.districtIDs)
        ? ModelData.districtIDs
        : ModelData.districtIDs ? [ModelData.districtIDs] : [];

      const talukaIDs = Array.isArray(ModelData.talukaIDs)
        ? ModelData.talukaIDs
        : ModelData.talukaIDs ? [ModelData.talukaIDs] : [];

      const projectIDs = Array.isArray(ModelData.projectIDs)
        ? ModelData.projectIDs
        : ModelData.projectIDs ? [ModelData.projectIDs] : [];

      // STEP 1: Set employee object
      setEmployeeObj((prev) => ({
        ...prev,
        userKeyIDForUpdate: ModelData.userKeyIDForUpdate ?? null,
        userDetailsKeyID: ModelData.userDetailsKeyID ?? null,
        canUpdateAttendance: ModelData.canUpdateAttendance ?? null,


        firstName: ModelData.firstName ?? "",
        lastName: ModelData.lastName ?? "",
        companyKeyID: ModelData.companyKeyID ?? "",
        emailID: ModelData.emailID ?? "",
        mobileNo: ModelData.mobileNo ?? "",
        password: ModelData.password ?? "",
        address: ModelData.address ?? "",

        zoneIDs,
        districtIDs,
        talukaIDs,
        projectIDs,
      }));

      // STEP 2: Load dependent dropdowns
      await GetDistrictLookupListData(zoneIDs);
      await GetTalukaLookupListData(districtIDs);

    } catch (error) {
      console.error("Error in GetAppUserModelData:", error);
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
    debugger
    if (
      employeeObj.firstName === null ||
      employeeObj.firstName === undefined ||
      employeeObj.firstName === '' ||
      employeeObj.lastName === null ||
      employeeObj.lastName === undefined ||
      employeeObj.lastName === '' ||

      employeeObj.canUpdateAttendance === null ||
      employeeObj.canUpdateAttendance === undefined ||
      employeeObj.canUpdateAttendance === '' ||




      employeeObj.mobileNo === null ||
      employeeObj.mobileNo === undefined ||
      employeeObj.mobileNo === '' ||
      employeeObj.mobileNo?.length < 10 ||
      employeeObj.emailID === undefined ||
      employeeObj.emailID === '' ||
      employeeObj.emailID === null ||



      employeeObj.zoneIDs === null ||
      employeeObj.zoneIDs === undefined ||
      employeeObj.zoneIDs.length === 0 ||
      employeeObj.districtIDs.length === 0 ||
      employeeObj.districtIDs === null ||
      employeeObj.districtIDs === undefined ||
      employeeObj.talukaIDs === undefined ||
      employeeObj.talukaIDs === null ||
      employeeObj.talukaIDs.length === 0 ||
      employeeObj.projectIDs.length === 0 ||
      employeeObj.projectIDs === null ||
      employeeObj.projectIDs === undefined ||

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
      companyID: companyID,
      appUserTypeID: 1,
      canUpdateAttendance: employeeObj.canUpdateAttendance,
      instituteIDs: [],
      zoneIDs: Array.isArray(employeeObj.zoneIDs) ? employeeObj.zoneIDs : [],
      districtIDs: Array.isArray(employeeObj.districtIDs) ? employeeObj.districtIDs : [],
      talukaIDs: Array.isArray(employeeObj.talukaIDs) ? employeeObj.talukaIDs : [],

      projectIDs: employeeObj.projectIDs
    };
    if (!isValid) {
      AddUpdateAppUserData(apiParam);
    }
  };
  // selected : when isMulti => array of option objects, when single => option object or null


  const AddUpdateAppUserData = async (apiParam) => {
    setLoader(true)
    try {
      let url = '/AddUpdateAppUser'; // Default URL for Adding Data

      const response = await AddUpdateAppUser(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false)

          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Employee Added Successfully!'
              : ' Employee Updated Successfully!'
          ); //Do not change this naming convention

          setIsAddUpdateActionDone(true);
        } else {
          setLoader(false)

          setErrorMessage(response?.response?.data?.errorMessage);
        }
      }
    } catch (error) {
      setLoader(false)

      console.error(error);
    }
  };


  const handleDistrictChange = (selectedOptions) => {
    const ids = selectedOptions ? selectedOptions.map(o => o.value) : [];

    setEmployeeObj(prev => ({
      ...prev,
      districtIDs: ids,
      talukaIDs: [] // clear talukas when district changes
    }));

    GetTalukaLookupListData(ids);
  };




  const handleZoneChange = (selectedOptions) => {
    const selectedZoneIds = selectedOptions
      ? selectedOptions.map((item) => item.value)
      : [];

    setEmployeeObj((prev) => ({
      ...prev,
      zoneIDs: selectedZoneIds,
      districtIDs: [] // RESET district when zone changes
    }));

    // Fetch district list for selected zones
    GetDistrictLookupListData(selectedZoneIds);
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

  const handleTalukaChange = (selectedOptions) => {
    setEmployeeObj((prev) => ({
      ...prev,
      talukaIDs: selectedOptions ? selectedOptions.map(item => item.value) : []
    }));
  };



  const GetDistrictLookupListData = async (zoneIds = []) => {
    if (!zoneIds || zoneIds.length === 0) {
      setDistrictOption([]);
      return;
    }

    try {
      const ZoneIDsParam = zoneIds.join(",");

      let response = await GetDistrictLookupList(ZoneIDsParam);

      if (response?.data?.statusCode === 200) {
        const list = response?.data?.responseData?.data || [];

        const formatted = list.map((d) => ({
          value: d.districtID,
          label: d.districtName,
        }));

        setDistrictOption(formatted);
      } else {
        setDistrictOption([]);
      }
    } catch (err) {
      console.error("Error fetching districts:", err);
      setDistrictOption([]);
    }
  };




  const GetTalukaLookupListData = async (districtIds = []) => {
    if (!districtIds || districtIds.length === 0) {
      setTalukaOption([]);
      return;
    }

    try {
      const idsParam = districtIds.join(",");

      const response = await GetTalukaLookupList(idsParam);

      if (response?.data?.statusCode === 200) {
        const talukaList = response?.data?.responseData?.data || [];

        const formatted = talukaList.map((t) => ({
          value: t.talukaID,
          label: t.talukaName
        }));

        setTalukaOption(formatted);
      } else {
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
      let response = await GetZoneLookupList(companyID);
      if (response?.data?.statusCode === 200) {
        const zoneList = response?.data?.responseData?.data || [];
        const formattedCityList = zoneList.map((zone) => ({
          value: zone.zoneID,
          label: zone.zoneName
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












  const handleProjectChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];

    setEmployeeObj((prev) => ({
      ...prev,
      projectIDs: values,
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
                  <label htmlFor="mobileNo" className="form-label">
                    Contact Number
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
                    isMulti
                    value={zoneOption.filter((item) => employeeObj.zoneIDs.includes(item.value))}
                    onChange={handleZoneChange}
                    menuPosition="fixed"
                  />


                  {error &&
                    (employeeObj.zoneIDs === null ||
                      employeeObj.zoneIDs === undefined ||
                      employeeObj.zoneIDs.length === 0) ? (
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
                  isMulti
                  value={districtOption.filter((item) =>
                    employeeObj.districtIDs.includes(item.value)
                  )}
                  onChange={handleDistrictChange}
                  menuPosition="fixed"
                />
                {error &&
                  (employeeObj.districtIDs === null ||
                    employeeObj.districtIDs === undefined ||
                    employeeObj.districtIDs.length === 0) ? (
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
                  isMulti
                  value={talukaOption.filter((item) =>
                    employeeObj.talukaIDs.includes(item.value)
                  )}
                  onChange={handleTalukaChange}
                  menuPosition="fixed"
                />
                {error &&
                  (employeeObj.talukaIDs === null ||
                    employeeObj.talukaIDs === undefined ||
                    employeeObj.talukaIDs.length === 0) ? (
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
                  <span style={{ color: 'red' }}>*</span>

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


                  {error &&
                    (
                      employeeObj.canUpdateAttendance === undefined ||
                      employeeObj.canUpdateAttendance === null ||
                      employeeObj.canUpdateAttendance === ''
                    )
                    && (
                      <span style={{ color: "red" }}>{ERROR_MESSAGES}</span>
                    )
                  }

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
