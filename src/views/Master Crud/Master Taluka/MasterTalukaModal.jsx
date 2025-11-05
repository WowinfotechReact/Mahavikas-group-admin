import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { GetStateLookupList } from 'services/Master Crud/MasterStateApi';
import { ConfigContext } from 'context/ConfigContext';
import Select from 'react-select';
import { GetDistrictLookupList } from 'services/Master Crud/MasterDistrictApi';
import { AddUpdateTaluka, GetTalukaModel } from 'services/Master Crud/MasterTalukaApi';
import { ERROR_MESSAGES } from 'component/GlobalMassage';

const AddUpdateMasterTalukaModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [stateOption, setStateOption] = useState([]);
  const [districtOption, setDistrictOption] = useState([]);
  const { setLoader, user } = useContext(ConfigContext);
  const [masterTalukaObj, setMasterTalukaObj] = useState({
    userKeyID: null,
    talukaID: null,
    stateID: null,
    districtID: null,
    talukaName: null
  });

  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.talukaID !== null) {
        GetMasterDistrictModalData(modelRequestData.talukaID);
      }
    }
  }, [modelRequestData?.Action]);

  useEffect(() => {
    if (masterTalukaObj.stateID !== null && masterTalukaObj.stateID !== undefined) {
      GetTalukaLookupListData();
    }
  }, [masterTalukaObj.stateID]);

  // useEffect(() => {
  //   GetStateLookupListData();
  // }, [modelRequestData?.Action]);

  const AddStateBtnClick = () => {
    // debugger;
    let isValid = false;
    if (
      masterTalukaObj.talukaName === null ||
      masterTalukaObj.talukaName === undefined ||
      masterTalukaObj.talukaName === '' ||
      masterTalukaObj.stateID === null ||
      masterTalukaObj.stateID === undefined ||
      masterTalukaObj.stateID === ''
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    const apiParam = {
      userKeyID: user.userKeyID,
      stateID: masterTalukaObj?.stateID,
      districtName: masterTalukaObj?.districtName,
      districtID: masterTalukaObj?.districtID,
      talukaName: masterTalukaObj?.talukaName,
      talukaID: masterTalukaObj.talukaID
    };

    if (!isValid) {
      AddUpdateDistrictData(apiParam);
    }
  };

  const AddUpdateDistrictData = async (apiParam) => {
    setLoader(true)
    try {
      let url = '/AddUpdateTaluka'; // Default URL for Adding Data

      const response = await AddUpdateTaluka(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false)
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Taluka Added Successfully!'
              : 'Taluka Updated Successfully!'
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

  const GetTalukaLookupListData = async () => {
    if (masterTalukaObj.stateID === null) return;

    try {
      let response = await GetDistrictLookupList(masterTalukaObj?.stateID);
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

  const closeAllModal = () => {
    onHide();
    setShowSuccessModal(false);
  };

  const GetMasterDistrictModalData = async (id) => {
    if (id === undefined) {
      return;
    }
    setLoader(true)

    try {
      const data = await GetTalukaModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false)
        const ModelData = data.data.responseData.data; // Assuming data is an array

        setMasterTalukaObj({
          ...masterTalukaObj,
          userKeyID: ModelData.userKeyID,
          stateID: ModelData.stateID,
          stateName: ModelData.stateName,
          districtName: ModelData.districtName,
          districtID: ModelData.districtID,
          talukaName: ModelData.talukaName,
          talukaID: ModelData.talukaID
        });
      } else {
        setLoader(false)
        // Handle non-200 status codes if necessary
        console.error('Error fetching data: ', data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false)
      console.error('Error in GetTalukaModalData: ', error);
    }
  };

  const handleStateChange = (selectedOption) => {
    setMasterTalukaObj((prev) => ({
      ...prev,
      stateID: selectedOption ? selectedOption.value : null,
      // talukaName:''
    }));
  };
  const handleDistrictChange = (selectedOption) => {
    setMasterTalukaObj((prev) => ({
      ...prev,
      districtID: selectedOption ? selectedOption.value : null,
      // talukaName:''
    }));
  };

  return (
    <>
      <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {modelRequestData?.Action !== null ? 'Update Taluka' : modelRequestData?.Action === null ? 'Add ssssTaluka' : ''}
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
                value={stateOption.filter((item) => item.value === masterTalukaObj.stateID)}
                onChange={handleStateChange}
                menuPosition="fixed"
              />
              {error && (masterTalukaObj.stateID === null || masterTalukaObj.stateID === undefined || masterTalukaObj.stateID === '') ? (
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
                value={districtOption.filter((item) => item.value === masterTalukaObj.districtID)}
                onChange={handleDistrictChange}
                menuPosition="fixed"
              />
              {error &&
                (masterTalukaObj.districtID === null || masterTalukaObj.districtID === undefined || masterTalukaObj.districtID === '') ? (
                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
              {/* {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>} */}
            </div>
            <div className="col-12 mb-3">
              <label htmlFor="talukaName" className="form-label">
                Taluka Name
                <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                maxLength={20}
                type="text"
                className="form-control"
                id="talukaName"
                placeholder="Enter Taluka Name"
                value={masterTalukaObj.talukaName}
                onChange={(e) => {
                  setErrorMessage(false);
                  let inputValue = e.target.value;

                  // Prevent only-space input at start
                  if (inputValue.length === 1 && inputValue === ' ') {
                    inputValue = '';
                  }

                  // Remove special characters, allow letters, numbers, spaces
                  const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                  // Capitalize first letter after every space (preserve multiple spaces)
                  const updatedValue = cleanedValue.replace(/\b\w/g, (char) => char.toUpperCase());

                  setMasterTalukaObj((prev) => ({
                    ...prev,
                    talukaName: updatedValue
                  }));
                }}
              />

              {error &&
                (masterTalukaObj.talukaName === null || masterTalukaObj.talukaName === undefined || masterTalukaObj.talukaName === '') ? (
                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
              {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button type="submit" className="btn btn-primary text-center" onClick={() => AddStateBtnClick()}>
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

      {/* <CusModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} vehicleObj={vehicleObj} /> */}
    </>
  );
};

export default AddUpdateMasterTalukaModal;
