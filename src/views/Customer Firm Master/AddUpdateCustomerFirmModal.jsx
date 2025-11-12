import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';

import 'react-date-picker/dist/DatePicker.css';
import SuccessPopupModal from 'component/SuccessPopupModal';
import {
  AddUpdateCustomer,
  GetCustomerLookupList,
  GetCustomerModel,
} from 'services/CustomerStaff/CustomerStaffApi';
import { ConfigContext } from 'context/ConfigContext';
import { AddUpdateVehicleApi, GetVehicleModel } from 'services/Vehicle/VehicleApi';
import { GetVehicleTypeLookupList } from 'services/Master Crud/MasterVehicleTypeApi';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { AddUpdateInstitute, GetInstituteModel } from 'services/Institute/InstituteApi';
import { GetStateLookupList } from 'services/Master Crud/MasterStateApi';
import { GetDistrictLookupList } from 'services/Master Crud/MasterDistrictApi copy';
import { GetTalukaLookupList } from 'services/Master Crud/MasterTalukaApi copy';
import { GetVillageLookupList } from 'services/Master Crud/MasterVillageApi';

const AddUpdateCustomerFirmModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const [customerOption, setCustomerOption] = useState([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const { user, setLoader, companyID } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [stateOption, setStateOption] = useState([]);
  const [districtOption, setDistrictOption] = useState([]);
  const [talukaOption, setTalukaOption] = useState([]);
  const [villageOption, setVillageOption] = useState([]);

  const [customerObj, setCustomerObj] = useState({
    userKeyID: null,
    instituteKeyID: null,
    instituteName: null,
    projectKeyID: null,
    stateKeyID: null,
    districtKeyID: null,
    talukaKeyID: null,
    villageKeyID: null
  });

  // useEffect(() => {
  //   if (modelRequestData?.Action === 'Update') {
  //     if (modelRequestData?.instituteKeyID !== null) {
  //       GetInstituteModelData(modelRequestData?.instituteKeyID);
  //     }
  //   }
  // }, [modelRequestData?.Action]);

  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setErrors("Only PDF files are allowed.");
        setSelectedFile(null);
      } else {
        setErrors("");
        setSelectedFile(file);
      }
    }
  };


  const projectOptions = () => [
    { value: 1, label: "Secondary & Higher Secondary Teacher Bharti 2025" },
    { value: 2, label: "Primary Teacher Bharti 2025" },
    { value: 3, label: "Shikshak Bharti 2025Secondary & Higher Secondary Teacher Bharti 2025" },

  ]
  const AddVehicleBtnClick = async () => {
    let isValid = false;
    // debugger
    // Start with false, set to true if any error occurs
    let hasError = false;



    // Validation logic
    if (
      (
        customerObj.instituteName === null ||
        customerObj.instituteName === undefined ||
        customerObj.instituteName === '' ||
        customerObj.stateKeyID === null ||
        customerObj.stateKeyID === null ||
        customerObj.stateKeyID === undefined ||
        customerObj.districtKeyID === undefined ||
        customerObj.districtKeyID === undefined ||
        customerObj.districtKeyID === '' ||
        customerObj.talukaKeyID === '' ||
        customerObj.talukaKeyID === '' ||
        customerObj.talukaKeyID === '' ||
        customerObj.villageKeyID === null ||
        customerObj.villageKeyID === undefined ||
        customerObj.villageKeyID === ''
      )) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    // Create JSON object with all fields
    const jsonData = {
      userKeyID: user.userKeyID,
      instituteKeyID: modelRequestData.instituteKeyID,
      instituteName: customerObj.instituteName,
      stateKeyID: customerObj.stateKeyID,
      districtKeyID: customerObj.districtKeyID,
      talukaKeyID: customerObj.talukaKeyID,
      villageKeyID: customerObj.villageKeyID,
      projectKeyID: 'CD69643C-CB99-4174-960F-0D053CC6F3BB'

    };

    // Log the JSON data to the console
    console.log('Submitted Data:', JSON.stringify(jsonData, null, 2));

    // Proceed with API call if valid
    if (!isValid) {
      AddUpdateInstituteData(jsonData);
    }
  };

  const AddUpdateInstituteData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateInstitute'; // Default URL for Adding Data

      const response = await AddUpdateInstitute(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Institute Added Successfully!'
              : 'Institute  Updated Successfully!'
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

  // ✅ 1) Replace your existing useEffect with this:
  useEffect(() => {
    if (show && modelRequestData?.Action === 'Update' && modelRequestData?.instituteKeyID) {
      GetInstituteModelData(modelRequestData?.instituteKeyID);
    }
  }, [show, modelRequestData?.Action, modelRequestData?.instituteKeyID]);

  // ✅ 2) Replace your existing GetInstituteModelData with this:
  const GetInstituteModelData = async (id) => {
    if (!id) {
      setLoader(false);
      return;
    }
    setLoader(true);

    try {
      const data = await GetInstituteModel(id);
      if (data?.data?.statusCode === 200) {
        const ModelData = data.data.responseData.data;

        // ✅ Directly set entire object — no merge with old state!
        setCustomerObj({
          instituteKeyID: modelRequestData.instituteKeyID,
          instituteName: ModelData.instituteName,
          projectKeyID: ModelData.projectKeyID,
          stateKeyID: ModelData.stateKeyID,
          districtKeyID: ModelData.districtKeyID,
          talukaKeyID: ModelData.talukaKeyID,
          villageKeyID: ModelData.villageKeyID,

        });

        setLoader(false);
      } else {
        setLoader(false);
        console.error('Error fetching data: ', data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error in state: ', error);
    }
  };

  const closeAllModal = () => {
    onHide();
    setShowSuccessModal(false);
  };

  useEffect(() => {
    GetStateLookupListData()
  }, [])






  useEffect(() => {
    if (customerObj.talukaKeyID !== null && customerObj.talukaKeyID !== undefined) {
      GetVillageLookupListData();
    }
  }, [customerObj.talukaKeyID]);
  useEffect(() => {
    if (customerObj.districtKeyID !== null && customerObj.districtKeyID !== undefined) {
      GetTalukaLookupListData();
    }
  }, [customerObj.districtKeyID]);

  useEffect(() => {
    if (customerObj.stateKeyID !== null && customerObj.stateKeyID !== undefined) {
      GetDistrictLookupListData();
    }
  }, [customerObj.stateKeyID]);
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

  const GetDistrictLookupListData = async () => {
    if (customerObj.stateKeyID === null) return;

    try {
      let response = await GetDistrictLookupList(customerObj?.stateKeyID);
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
    if (customerObj.districtKeyID === null) return;

    try {
      let response = await GetTalukaLookupList(customerObj?.districtKeyID);
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
    if (customerObj.talukaKeyID === null) return;

    try {
      let response = await GetVillageLookupList(customerObj?.talukaKeyID);
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


  const handleStateChange = (selectedOption) => {
    setCustomerObj((prev) => ({
      ...prev,
      stateKeyID: selectedOption ? selectedOption.value : null,
      districtKeyID: '',
      talukaKeyID: '',
      // villageName:''
    }));
  };
  const handleDistrictChange = (selectedOption) => {
    setCustomerObj((prev) => ({
      ...prev,
      districtKeyID: selectedOption ? selectedOption.value : null,
      talukaKeyID: '',
      // villageName:''
    }));
  };

  const handleTalukaChange = (selectedOption) => {
    setCustomerObj((prev) => ({
      ...prev,
      talukaKeyID: selectedOption ? selectedOption.value : null,
      // villageName:''
    }));
  };
  const handleVillageChange = (selectedOption) => {
    setCustomerObj((prev) => ({
      ...prev,
      villageKeyID: selectedOption ? selectedOption.value : null,
      // villageName:''
    }));
  };
  return (
    <>
      <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">{modelRequestData?.Action !== null ? 'Edit Institute' : 'Add Institute'}</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="customerName" className="form-label">
                  Institute Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={50}
                  type="text"
                  className="form-control"
                  id="customerName"
                  placeholder="Enter Institute Name"
                  value={customerObj.instituteName}
                  onChange={(e) => {
                    let inputVal = e.target.value;

                    // Remove leading spaces
                    inputVal = inputVal.replace(/^\s+/, '');

                    // Allow only letters, spaces, and dot
                    inputVal = inputVal.replace(/[^a-zA-Z.\s]/g, '');

                    // Capitalize the first letter
                    if (inputVal.length > 0) {
                      inputVal = inputVal.charAt(0).toUpperCase() + inputVal.slice(1);
                    }

                    setCustomerObj({ ...customerObj, instituteName: inputVal });
                  }}

                />
                {error && (!customerObj.instituteName || customerObj.instituteName.trim() === '') && (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                )}
              </div>

              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="gstNumber" className="form-label">
                  Description Of Institute
                  {/* <span style={{ color: 'red' }}>*</span> */}
                </label>
                <textarea

                  type="text"
                  className="form-control"
                  id="gstNumber"
                  placeholder="Enter Description Of Institute "
                  value={customerObj.gstNumber}
                  onChange={(e) => {
                    let gst = e.target.value.toUpperCase(); // Ensure uppercase
                    gst = gst.replace(/^\s+/, ''); // Remove leading spaces
                    setCustomerObj({ ...customerObj, gstNumber: gst });
                  }}
                />
                {error && (customerObj.gstNumber === null || customerObj.gstNumber === undefined || customerObj.gstNumber === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="customerAddress" className="form-label">
                  State
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  options={stateOption}
                  value={stateOption.filter((item) => item.value === customerObj.stateKeyID)}
                  onChange={handleStateChange}
                  menuPosition="fixed"
                />
                {error && (customerObj.address === null || customerObj.address === undefined || customerObj.address === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="customerAddress" className="form-label">
                  Select   District
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  options={districtOption}
                  value={districtOption.filter((item) => item.value === customerObj.districtKeyID)}
                  onChange={handleDistrictChange}
                  menuPosition="fixed"
                />                {error && (customerObj.address === null || customerObj.address === undefined || customerObj.address === '') ? (
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
                  value={talukaOption.filter((item) => item.value === customerObj.talukaKeyID)}
                  onChange={handleTalukaChange}
                  menuPosition="fixed"
                />                {error && (customerObj.address === null || customerObj.address === undefined || customerObj.address === '') ? (
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
                  value={villageOption.filter((item) => item.value === customerObj.villageKeyID)}
                  onChange={handleVillageChange}
                  menuPosition="fixed"
                />                {error && (customerObj.address === null || customerObj.address === undefined || customerObj.address === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="customerAddress" className="form-label">
                  Select Project
                  {/* <span style={{ color: 'red' }}>*</span> */}
                </label>
                <Select options={projectOptions()} placeholder='Select  Project' className="user-role-select phone-input-country-code" />
                {error && (customerObj.address === null || customerObj.address === undefined || customerObj.address === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>


            </div>


            <div className="row">
              <div className="mb-3">
                <label htmlFor="pdfUpload" className="form-label fw-bold">
                  Upload PDF
                </label>
                <input
                  type="file"
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  id="pdfUpload"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                {error && <div className="invalid-feedback">{error}</div>}

                {selectedFile && (
                  <div className="mt-2 text-success">
                    ✅ Selected: <strong>{selectedFile.name}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <button type="submit" style={{ backgroundColor: '#ffaa33', color: 'white' }} className="btn text-center" onClick={() => AddVehicleBtnClick()}>
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

export default AddUpdateCustomerFirmModal;