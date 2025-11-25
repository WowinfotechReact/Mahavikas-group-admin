import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import DatePicker from 'react-date-picker';
import Select from 'react-select';

import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { GetServiceLookupList } from 'services/Services/ServicesApi';
import { AddUpdateProject, GetProjectModel } from 'services/Project/ProjectApi';
import dayjs from 'dayjs';
import { GetTalukaLookupList } from 'services/Master Crud/MasterTalukaApi';
import { GetDistrictLookupList } from 'services/Master Crud/MasterDistrictApi';
import { GetZoneLookupList } from 'services/Master Crud/MasterZoneApi';
import { GetStateLookupList } from 'services/Master Crud/MasterStateApi';

const AddUpdateProductModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user, companyID } = useContext(ConfigContext);
  const [servicesOption, setServicesOption] = useState([])
  const [companyOption, setCompanyOption] = useState([])
  const [zoneOption, setZoneOption] = useState([]);
  const [stateOption, setStateOption] = useState([]);
  const [districtOption, setDistrictOption] = useState([]);
  const [talukaOption, setTalukaOption] = useState([]);


  const [productObj, setProductObj] = useState({
    userKeyID: null,
    projectKeyID: null,
    stateIDs: [],
    projectName: null,
    projectDescription: null,
    serviceID: null,
    startDate: null,
    endDate: null,
    companyKeyID: null,
    zoneIDs: [],
    districtIDs: [],
    talukaIDs: [],
    instituteIDs: []
  });

  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.projectKeyID !== null) {
        GetProjectModelData(modelRequestData.projectKeyID);
      }
    }
  }, [modelRequestData?.Action]);

  useEffect(() => {
    GetServiceLookupListData()
  }, [])
  const GetServiceLookupListData = async () => {
    try {
      const response = await GetServiceLookupList(); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const serviceList = response?.data?.responseData?.data || [];

        const formattedIvrList = serviceList.map((ivrItem) => ({
          value: ivrItem.serviceID,
          label: ivrItem.serviceName
        }));

        setServicesOption(formattedIvrList); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch IVR lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching IVR lookup list:', error);
    }
  };






  const AddProductBtnClick = () => {
    let isValid = false;

    if (
      productObj.projectName === null || productObj.projectName === undefined || productObj.projectName === '' ||
      productObj.zoneIDs.length === 0 ||
      productObj.zoneIDs === null ||
      productObj.zoneIDs === undefined ||
      productObj.districtIDs.length === 0 ||
      productObj.districtIDs.length === 0 ||
      productObj.districtIDs === null ||
      productObj.talukaIDs === null ||
      productObj.talukaIDs === undefined ||
      productObj.talukaIDs === undefined ||
      productObj.startDate === null || productObj.startDate === undefined || productObj.startDate === '' ||
      productObj.endDate === null || productObj.endDate === undefined || productObj.endDate === '' ||
      productObj.serviceID === null || productObj.serviceID === undefined || productObj.serviceID === '' ||
      productObj.projectDescription === null || productObj.projectDescription === undefined || productObj.projectDescription === ''
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    const apiParam = {
      userKeyID: user.userKeyID,
      projectName: productObj?.projectName,
      projectKeyID: modelRequestData?.projectKeyID,
      projectDescription: productObj?.projectDescription,
      serviceID: productObj?.serviceID,
      companyID: companyID,
      startDate: productObj?.startDate,
      endDate: productObj?.endDate,
      stateIDs: Array.isArray(productObj.stateIDs) ? productObj.stateIDs : [],
      zoneIDs: Array.isArray(productObj.zoneIDs) ? productObj.zoneIDs : [],
      districtIDs: Array.isArray(productObj.districtIDs) ? productObj.districtIDs : [],
      talukaIDs: Array.isArray(productObj.talukaIDs) ? productObj.talukaIDs : [],
    };

    if (!isValid) {
      AddUpdateProjectData(apiParam);
    }
  };
  const handleServiceChange = (selectedOption) => {
    setProductObj((prev) => ({
      ...prev,
      serviceID: selectedOption ? selectedOption.value : null,

    }));
  };
  const AddUpdateProjectData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateProject';


      const response = await AddUpdateProject(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null
              ? 'Project Added Successfully!'
              : 'Project Updated Successfully!'
          );

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

  const closeAllModal = () => {
    onHide();
    setShowSuccessModal(false);
  };

  const GetProjectModelData = async (id) => {
    if (id === undefined) {
      return;
    }
    setLoader(true);

    try {
      const data = await GetProjectModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = data.data.responseData.data;

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

        setProductObj({
          ...productObj,
          userKeyID: ModelData.userKeyID,
          projectKeyID: modelRequestData.projectKeyID,
          projectName: ModelData.projectName,
          startDate: ModelData.startDate,
          endDate: ModelData.endDate,
          projectDescription: ModelData.projectDescription,
          serviceID: ModelData.serviceID,
          zoneIDs,
          districtIDs,
          talukaIDs,
          projectIDs,

        });

        await GetDistrictLookupListData(zoneIDs);
        await GetTalukaLookupListData(districtIDs);
        await GetServiceLookupListData();
      } else {
        setLoader(false);
        console.error('Error fetching data: ', data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error in product: ', error);
    }
  };
  const handleTalukaChange = (selectedOptions) => {
    setProductObj((prev) => ({
      ...prev,
      talukaIDs: selectedOptions ? selectedOptions.map(item => item.value) : []
    }));
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



  const GetDistrictLookupListData = async (zoneIds = []) => {
    if (!zoneIds || zoneIds.length === 0) {
      setDistrictOption([]);
      return;
    }

    try {
      const ZoneIDsParam = zoneIds.join(",");

      let response = await GetDistrictLookupList(ZoneIDsParam, companyID);

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

      const response = await GetTalukaLookupList(idsParam, companyID);

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








  const projectStateDateChange = (date) => {
    setProductObj((prevState) => ({
      ...prevState,
      startDate: dayjs(date).format('YYYY-MM-DD')  // Store as string
    }));
  };
  const projectEndDateChange = (date) => {
    setProductObj((prevState) => ({
      ...prevState,
      endDate: dayjs(date).format('YYYY-MM-DD')  // Store as string
    }));
  };





  const handleDistrictChange = (selectedOptions) => {
    const districtIds = selectedOptions ? selectedOptions.map(o => o.value) : [];

    setProductObj(prev => ({
      ...prev,
      districtIDs: districtIds,
      talukaIDs: []
    }));

    // Fetch TALUKAS based on district
    GetTalukaLookupListData(districtIds);
  };




  const handleZoneChange = (selectedOptions) => {
    const zoneIds = selectedOptions ? selectedOptions.map((item) => item.value) : [];

    setProductObj(prev => ({
      ...prev,
      zoneIDs: zoneIds,
      stateIDs: [],
      districtIDs: [],
      talukaIDs: []
    }));

    // Fetch STATES based on zone
    GetStateLookupListData(zoneIds);
  };
  const handleStateChange = (selectedOptions) => {
    const stateIds = selectedOptions ? selectedOptions.map((item) => item.value) : [];

    setProductObj(prev => ({
      ...prev,
      stateIDs: stateIds,
      districtIDs: [],
      talukaIDs: []
    }));

    // Fetch DISTRICTS based on state
    GetDistrictLookupListData(stateIds);
  };



  // const GetDistrictLookupListData = async (zoneIds = []) => {
  //   if (!zoneIds || zoneIds.length === 0) {
  //     setDistrictOption([]);
  //     return;
  //   }

  //   try {
  //     const ZoneIDsParam = zoneIds.join(",");

  //     let response = await GetDistrictLookupList(ZoneIDsParam, companyID);
  const GetStateLookupListData = async (stateIDs = []) => {

    if (!stateIDs || stateIDs.length === 0) {
      setStateOption([]);
      return
    }

    try {
      const stateIDsParam = stateIDs.join(",")

      let response = await GetStateLookupList(stateIDsParam);

      if (response?.data?.statusCode === 200) {
        const list = response?.data?.responseData?.data || [];

        const formatted = list.map((s) => ({
          value: s.stateID,
          label: s.stateName,
        }));

        setStateOption(formatted);
      }
    } catch (err) {
      console.error("Error fetching districts:", err);
    }
  };
  return (
    <>
      <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {modelRequestData?.Action !== null ? 'Update Project' : modelRequestData?.Action === null ? 'Add Project' : ' Update Project'}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="row">
              {/* Product Name */}
              <div className="mb-3">
                <label htmlFor="ProductName" className="form-label">
                  Project Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={80}
                  type="text"
                  className="form-control"
                  id="ProductName"
                  placeholder="Enter Project Name"
                  aria-describedby="Product"
                  value={productObj.projectName}
                  onChange={(e) => {
                    setErrorMessage(false);
                    let inputValue = e.target.value;

                    if (inputValue.length === 0 || (inputValue.length === 1 && inputValue === ' ')) {
                      inputValue = '';
                    }

                    const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');
                    const trimmedValue = cleanedValue.trimStart();
                    const updatedValue = trimmedValue
                      .split(' ')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');

                    setProductObj((prev) => ({
                      ...prev,
                      projectName: updatedValue
                    }));
                  }}
                />
                {error && !productObj.projectName && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
                {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
              </div>

              {/* HSN */}
              <div className="mb-3">
                <label htmlFor="HSN" className="form-label">
                  Project Description
                  <span style={{ color: 'red' }}>*</span>

                </label>
                <textarea
                  maxLength={700}
                  type="text"
                  className="form-control"
                  id="HSN"
                  placeholder="Enter Project Description"
                  value={productObj.projectDescription}
                  onChange={(e) => {
                    setProductObj((prev) => ({
                      ...prev,
                      projectDescription: e.target.value
                    }));
                  }}
                />
                {error && !productObj.projectDescription && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}

              </div>



              <div className="row">

                <div className="col-md-6 mb-3">                  <div>
                  <label htmlFor="vehicleNumber" className="form-label">
                    Select Zone
                    <span style={{ color: 'red' }}>*</span>
                  </label>


                  <Select
                    placeholder="Select Zone(s)"
                    options={zoneOption}
                    isMulti
                    value={zoneOption.filter((item) => productObj.zoneIDs.includes(item.value))}
                    onChange={handleZoneChange}
                    menuPosition="fixed"
                  />

                  {error &&
                    (productObj.zoneIDs === null ||
                      productObj.zoneIDs === undefined ||
                      productObj.zoneIDs.length === 0) ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
                </div>
                <div className="col-md-6 mb-3">                  <div>
                  <label htmlFor="vehicleNumber" className="form-label">
                    Select State
                    <span style={{ color: 'red' }}>*</span>
                  </label>


                  <Select
                    placeholder="Select Zone(s)"
                    options={stateOption}
                    isMulti
                    value={stateOption.filter((item) => productObj.stateIDs.includes(item.value))}
                    onChange={handleStateChange}
                    menuPosition="fixed"
                  />

                  {error &&
                    (productObj.zoneIDs === null ||
                      productObj.zoneIDs === undefined ||
                      productObj.zoneIDs.length === 0) ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
                </div>

                <div className="col-md-6 mb-3">                  <label htmlFor="customerAddress" className="form-label">
                  Select District
                  <span style={{ color: 'red' }}>*</span>
                </label>

                  <Select
                    placeholder="Select District(s)"
                    options={districtOption}
                    isMulti
                    value={districtOption.filter((item) =>
                      productObj.districtIDs.includes(item.value)
                    )}
                    onChange={handleDistrictChange}
                    menuPosition="fixed"
                  />
                  {error &&
                    (productObj.districtIDs === null ||
                      productObj.districtIDs === undefined ||
                      productObj.districtIDs.length === 0) ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}

                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="customerAddress" className="form-label">
                    Select Taluka
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Select
                    placeholder="Select Taluka(s)"
                    options={talukaOption}
                    isMulti
                    value={talukaOption.filter((item) =>
                      productObj.talukaIDs.includes(item.value)
                    )}
                    onChange={handleTalukaChange}
                    menuPosition="fixed"
                  />
                  {error &&
                    (productObj.talukaIDs === null ||
                      productObj.talukaIDs === undefined ||
                      productObj.talukaIDs.length === 0) ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}

                </div>


                <div className="col-md-6 mb-3">
                  <label htmlFor="ProductName" className="form-label">
                    Select Services<span style={{ color: 'red' }}>*</span>
                  </label>
                  <Select
                    options={servicesOption}
                    value={
                      servicesOption.find(
                        (item) => item.value === Number(productObj.serviceID)
                      ) || null
                    }
                    onChange={(selected) => {
                      setProductObj(prev => ({
                        ...prev,
                        serviceID: Number(selected.value)
                      }));
                    }}
                    menuPosition="fixed"
                  />

                  {error && !productObj.serviceID && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
                  {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
                </div>
              </div>
              {/* GST Percentage */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="startDate" className="form-label">
                    Start Date
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <DatePicker
                    value={productObj?.startDate} // Use "selected" instead of "value"
                    onChange={projectStateDateChange}
                    id="startDate"
                    label="From Date"
                    format="dd/MM/yyyy"

                    clearIcon={null}
                    popperPlacement="bottom-start"
                  />
                  {error && !productObj.startDate && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}

                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="endDate" className="form-label">
                    End Date
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <DatePicker
                    value={productObj?.endDate} // Use "selected" instead of "value"
                    onChange={projectEndDateChange}
                    id="endDate"
                    label="To Date"
                    format="dd/MM/yyyy"
                    clearIcon={null}
                    popperPlacement="bottom-start"
                  />
                  {error && !productObj.endDate && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}

                </div>
              </div>


            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <button type="submit" className="btn  text-center text-white" style={{ background: '#ffaa33' }} onClick={() => AddProductBtnClick()}>
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

export default AddUpdateProductModal;
