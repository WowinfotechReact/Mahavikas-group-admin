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
import { GetDistrictLookupList } from 'services/Master Crud/MasterDistrictApi';
import { GetTalukaLookupList } from 'services/Master Crud/MasterTalukaApi';
import { GetZoneLookupList } from 'services/Master Crud/MasterZoneApi';
const AddUpdateCustomerFirmModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const { user, setLoader, companyID } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [stateOption, setStateOption] = useState([]);
  const [districtOption, setDistrictOption] = useState([]);
  const [talukaOption, setTalukaOption] = useState([]);
  const [villageOption, setVillageOption] = useState([]);
  const [zoneOption, setZoneOption] = useState([]);

  const [instituteObj, setInstituteObj] = useState({
    userKeyID: null,
    instituteKeyID: null,
    instituteName: null,


    institutDescription: null,
    projectID: null,
    companyID: null,
    zoneID: null,
    districtID: null,
    talukaID: null,
    institutePDF: null
  });



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

  const handleZoneChange = (selectedOption) => {
    setInstituteObj(prev => ({
      ...prev,
      zoneID: selectedOption ? selectedOption.value : null,
      districtID: null,
      talukaID: null
    }));

    GetDistrictLookupListData(selectedOption ? [selectedOption.value] : []);
  };

  const AddVehicleBtnClick = async () => {
    let isValid = false;
    // debugger
    // Start with false, set to true if any error occurs
    let hasError = false;



    // Validation logic
    if (
      (
        instituteObj.instituteName === null ||
        instituteObj.instituteName === undefined ||
        instituteObj.instituteName === '' ||
        instituteObj.zoneID === null ||
        instituteObj.zoneID === '' ||
        instituteObj.zoneID === undefined ||
        instituteObj.districtID === undefined ||
        instituteObj.districtID === undefined ||
        instituteObj.districtID === '' ||
        instituteObj.talukaID === null ||
        instituteObj.talukaID === undefined ||
        instituteObj.talukaID === '' ||
        instituteObj.institutDescription === null ||
        instituteObj.institutDescription === undefined ||
        instituteObj.institutDescription === ''

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
      instituteName: instituteObj.instituteName,
      zoneID: instituteObj.zoneID,
      districtID: instituteObj.districtID,
      talukaID: instituteObj.talukaID,
      villageKeyID: instituteObj.villageKeyID,
      projectID: modelRequestData.projectID,
      institutDescription: instituteObj.institutDescription,
      institutePDF: null,
      companyID: companyID,

    };

    // Log the JSON data to the console
    console.log('Submitted Data:', JSON.stringify(jsonData, null, 2));

    // Proceed with API call if valid
    if (!isValid) {
      AddUpdateInstituteData(jsonData);
    }
  };
  const handleTalukaChange = (selectedOption) => {
    setInstituteObj(prev => ({
      ...prev,
      talukaID: selectedOption ? selectedOption.value : null
    }));
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

        const zoneID = ModelData.zoneID ?? null;
        const districtID = ModelData.districtID ?? null;
        const talukaID = ModelData.talukaID ?? null;

        setInstituteObj({
          instituteKeyID: modelRequestData.instituteKeyID,
          instituteName: ModelData.instituteName,
          institutDescription: ModelData.institutDescription,
          zoneID,
          districtID,
          talukaID
        });

        await GetDistrictLookupListData(zoneID ? [zoneID] : []);
        await GetTalukaLookupListData(districtID ? [districtID] : []);

        setLoader(false);
      } else {
        setLoader(false);
        console.error("Error:", data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);
      console.error("Error fetching:", error);
    }
  };

  const handleDistrictChange = (selectedOption) => {
    setInstituteObj(prev => ({
      ...prev,
      districtID: selectedOption ? selectedOption.value : null,
      talukaID: null
    }));

    GetTalukaLookupListData(selectedOption ? [selectedOption.value] : []);
  };


  const closeAllModal = () => {
    onHide();
    setShowSuccessModal(false);
  };








  useEffect(() => {
    if (instituteObj.districtKeyID !== null && instituteObj.districtKeyID !== undefined) {
      GetTalukaLookupListData();
    }
  }, [instituteObj.districtKeyID]);

  useEffect(() => {
    if (instituteObj.stateKeyID !== null && instituteObj.stateKeyID !== undefined) {
      GetDistrictLookupListData();
    }
  }, [instituteObj.stateKeyID]);










  useEffect(() => {
    GetZoneLookupListData()
  }, [])
  const GetZoneLookupListData = async () => {

    try {
      let response = await GetZoneLookupList(companyID, modelRequestData?.projectID);
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


  const GetDistrictLookupListData = async (zoneIds = []) => {
    if (!zoneIds || zoneIds.length === 0) {
      setDistrictOption([]);
      return;
    }

    try {
      const ZoneIDsParam = zoneIds.join(",");

      let response = await GetDistrictLookupList(ZoneIDsParam, companyID, modelRequestData?.projectID);

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

      const response = await GetTalukaLookupList(idsParam, companyID, modelRequestData?.projectID);

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
  return (
    <>
      <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">{modelRequestData?.Action !== null ? 'Update Institute' : 'Add Institute'}</h3>
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
                  value={instituteObj.instituteName}
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

                    setInstituteObj({ ...instituteObj, instituteName: inputVal });
                  }}

                />
                {error && (!instituteObj.instituteName || instituteObj.instituteName.trim() === '') && (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                )}
              </div>

              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="institutDescription" className="form-label">
                  Description Of Institute
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <textarea

                  type="text"
                  className="form-control"
                  id="institutDescription"
                  placeholder="Enter Description Of Institute "
                  value={instituteObj.institutDescription}
                  onChange={(e) => {
                    let gst = e.target.value; // Ensure uppercase
                    gst = gst.replace(/^\s+/, ''); // Remove leading spaces
                    setInstituteObj({ ...instituteObj, institutDescription: gst });
                  }}
                />
                {error && (instituteObj.institutDescription === null || instituteObj.institutDescription === undefined || instituteObj.institutDescription === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>

            <div className="row">

              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="customerAddress" className="form-label">
                  Select Zone
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  placeholder="Select Zone"
                  options={zoneOption}
                  value={zoneOption.find(item => item.value === instituteObj?.zoneID)}
                  onChange={handleZoneChange}
                  menuPosition="fixed"
                />


                {error && (instituteObj.zoneID === null || instituteObj.zoneID === undefined || instituteObj.zoneID === '') ? (
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
                  placeholder="Select District"
                  options={districtOption}
                  value={districtOption.find(item => item.value === instituteObj?.districtID)}
                  onChange={handleDistrictChange}
                  menuPosition="fixed"
                />
                {error && (instituteObj.districtID === null || instituteObj.districtID === undefined || instituteObj.districtID === '') ? (
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
                  placeholder="Select Taluka"
                  options={talukaOption}
                  value={talukaOption.find(item => item.value === instituteObj?.talukaID)}
                  onChange={handleTalukaChange}
                  menuPosition="fixed"
                />
                {error && (instituteObj.talukaID === null || instituteObj.talukaID === undefined || instituteObj.talukaID === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>




            </div>


            <div className="row">
              {/* <div className="mb-3">
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
              </div> */}
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