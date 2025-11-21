import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { GetStateLookupList, GetStateModel } from 'services/Master Crud/MasterStateApi';
import { ConfigContext } from 'context/ConfigContext';
import Select from 'react-select';
import { AddUpdateDistrict, GetDistrictLookupList, GetDistrictModel } from 'services/Master Crud/MasterDistrictApi';
import { AddUpdateTaluka, GetTalukaLookupList, GetTalukaModel } from 'services/Master Crud/MasterTalukaApi';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { AddUpdateVillage, GetVillageModel } from 'services/Master Crud/MasterVillageApi';

const AddUpdateVillageModal = ({ show, onHide, setIsAddUpdateActionDone, sendToModelData, modelRequestData }) => {
  const [modelAction, setModelAction] = useState('');
  console.log(sendToModelData, 'oihsd98ihw89rhdied98ds');

  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [stateOption, setStateOption] = useState([]);
  const [districtOption, setDistrictOption] = useState([]);
  const { setLoader, user } = useContext(ConfigContext);
  const [masterVillageObj, setMasterVillageObj] = useState({
    userKeyID: null,
    talukaID: null,
    stateID: null,
    districtID: null,
    talukaName: null,
    villageName: null
  });
  const [talukaOption, setTalukaOption] = useState([]);

  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.villageID !== null) {
        GetMasterVillageModalData(modelRequestData.villageID);
      }
    }
  }, [modelRequestData?.Action]);

  useEffect(() => {
    if (sendToModelData?.Action === "openFromCustomerModal") {
      // Set form values
      setMasterVillageObj({
        stateID: sendToModelData?.stateID || null,
        districtID: sendToModelData?.districtID || null,
        talukaID: sendToModelData?.talukaID || null,
        villageID: sendToModelData?.villageID || null,
      });

      // Load dropdown options
      // GetStateLookupListData();
      if (sendToModelData?.stateID) GetDistrictLookupListData(sendToModelData?.stateID);
      if (sendToModelData?.districtID) GetTalukaLookupListData(sendToModelData?.districtID);
    }
  }, [sendToModelData]);

  useEffect(() => {
    if (masterVillageObj.districtID !== null && masterVillageObj.districtID !== undefined) {
      GetTalukaLookupListData();
    }
  }, [masterVillageObj.districtID]);

  useEffect(() => {
    if (masterVillageObj.stateID !== null && masterVillageObj.stateID !== undefined) {
      GetDistrictLookupListData();
    }
  }, [masterVillageObj.stateID]);

  // useEffect(() => {
  //   GetStateLookupListData();
  // }, [modelRequestData?.Action]);

  const AddStateBtnClick = () => {
    // debugger;
    let isValid = false;
    if (
      masterVillageObj.stateID === null ||
      masterVillageObj.stateID === undefined ||
      masterVillageObj.stateID === '' ||
      masterVillageObj.villageName === null ||
      masterVillageObj.villageName === undefined ||
      masterVillageObj.villageName === '' ||
      masterVillageObj.districtID === null ||
      masterVillageObj.districtID === undefined ||
      masterVillageObj.districtID === '' ||
      masterVillageObj.talukaID === null ||
      masterVillageObj.talukaID === undefined ||
      masterVillageObj.talukaID === ''
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    const apiParam = {
      userKeyID: user.userKeyID,
      stateID: masterVillageObj?.stateID,
      districtName: masterVillageObj?.districtName,
      districtID: masterVillageObj?.districtID,
      villageName: masterVillageObj?.villageName,
      talukaID: masterVillageObj.talukaID,
      villageID: masterVillageObj.villageID
    };

    if (!isValid) {
      AddUpdateVillageData(apiParam);
    }
  };

  const AddUpdateVillageData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateVillage'; // Default URL for Adding Data

      const response = await AddUpdateVillage(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Village Added Successfully!'
              : 'Village Updated Successfully!'
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

  const GetStateLookupListData = async () => {
    try {
      const response = await GetStateLookupList(); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const stateLookupList = response?.data?.responseData?.data || [];

        const formattedIvrList = stateLookupList.map((ivrItem) => ({
          value: ivrItem.stateID,
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
    if (masterVillageObj.stateID === null) return;

    try {
      let response = await GetDistrictLookupList(masterVillageObj?.stateID);
      if (response?.data?.statusCode === 200) {
        const cityList = response?.data?.responseData?.data || [];
        const formattedCityList = cityList.map((city) => ({
          value: city.districtID,
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
    if (masterVillageObj.districtID === null) return;

    try {
      let response = await GetTalukaLookupList(masterVillageObj?.districtID);
      if (response?.data?.statusCode === 200) {
        const talukaList = response?.data?.responseData?.data || [];
        const formattedCityList = talukaList.map((taluka) => ({
          value: taluka.talukaID,
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

  const closeAllModal = () => {
    onHide();
    setShowSuccessModal(false);
  };

  const GetMasterVillageModalData = async (id) => {
    if (id === undefined) {
      return;
    }
    setLoader(true);

    try {
      const data = await GetVillageModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = data.data.responseData.data; // Assuming data is an array

        setMasterVillageObj({
          ...masterVillageObj,
          userKeyID: ModelData.userKeyID,
          stateID: ModelData.stateID,
          stateName: ModelData.stateName,
          districtName: ModelData.districtName,
          districtID: ModelData.districtID,
          villageName: ModelData?.villageName,
          talukaID: ModelData.talukaID,
          villageID: ModelData.villageID
        });
      } else {
        // Handle non-200 status codes if necessary
        setLoader(false);
        console.error('Error fetching data: ', data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error in GetVillageModalData: ', error);
    }
  };

  const handleStateChange = (selectedOption) => {
    setMasterVillageObj((prev) => ({
      ...prev,
      stateID: selectedOption ? selectedOption.value : null,
      districtID: '',
      talukaID: '',
      // villageName:''
    }));
  };
  const handleDistrictChange = (selectedOption) => {
    setMasterVillageObj((prev) => ({
      ...prev,
      districtID: selectedOption ? selectedOption.value : null,
      talukaID: '',
      // villageName:''
    }));
  };

  const handleTalukaChange = (selectedOption) => {
    setMasterVillageObj((prev) => ({
      ...prev,
      talukaID: selectedOption ? selectedOption.value : null,
      // villageName:''
    }));
  };

  return (
    <>
      <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {modelRequestData?.Action !== null ? 'Update Village' : modelRequestData?.Action === null ? 'Add Village' : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="col-12 mb-3">
              <label htmlFor="StateName" className="form-label">
                Select State
                <span style={{ color: 'red' }}>*</span>
              </label>
              <Select
                options={stateOption}
                value={stateOption.filter((item) => item.value === masterVillageObj.stateID)}
                onChange={handleStateChange}
                menuPosition="fixed"
              />
              {error && (masterVillageObj.stateID === null || masterVillageObj.stateID === undefined || masterVillageObj.stateID === '') ? (
                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
              {/* {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>} */}
            </div>
            <div className="col-12 mb-3">
              <label htmlFor="StateName" className="form-label">
                Select District
                <span style={{ color: 'red' }}>*</span>
              </label>
              <Select
                options={districtOption}
                value={districtOption.filter((item) => item.value === masterVillageObj.districtID)}
                onChange={handleDistrictChange}
                menuPosition="fixed"
              />
              {error &&
                (masterVillageObj.districtID === null || masterVillageObj.districtID === undefined || masterVillageObj.districtID === '') ? (
                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
              {/* {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>} */}
            </div>
            <div className="col-12 mb-3">
              <label htmlFor="StateName" className="form-label">
                Select Taluka
                <span style={{ color: 'red' }}>*</span>
              </label>
              <Select
                options={talukaOption}
                value={talukaOption.filter((item) => item.value === masterVillageObj.talukaID)}
                onChange={handleTalukaChange}
                menuPosition="fixed"
              />
              {error &&
                (masterVillageObj.talukaID === null || masterVillageObj.talukaID === undefined || masterVillageObj.talukaID === '') ? (
                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
              {/* {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>} */}
            </div>
            <div className="col-12 mb-3">
              <label htmlFor="StateName" className="form-label">
                Village Name
                <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                className="form-control"
                type="text"
                maxLength={22}
                placeholder="Enter Village Name"
                value={masterVillageObj.villageName}
                onChange={(e) => {
                  setErrorMessage(false);
                  let inputValue = e.target.value;

                  // Prevent input if only a space at start
                  if (inputValue.length === 1 && inputValue === ' ') {
                    inputValue = '';
                  }

                  // Allow only letters, numbers, and spaces
                  const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                  // Capitalize first letter of each word
                  const updatedValue = cleanedValue.replace(/\b\w/g, (char) => char.toUpperCase());

                  setMasterVillageObj((prev) => ({
                    ...prev,
                    villageName: updatedValue
                  }));
                }}
              />


              {error &&
                (masterVillageObj.villageName === null ||
                  masterVillageObj.villageName === undefined ||
                  masterVillageObj.villageName === '') ? (
                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
              {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>

          <button
            style={{ background: '#ffaa33' }} className="btn text-white  btn-sm d-none d-sm-inline"

            onClick={() => AddStateBtnClick()}>
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

      {/* <CusModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} vehicleObj={vehicleObj} /> */}
    </>
  );
};

export default AddUpdateVillageModal;
