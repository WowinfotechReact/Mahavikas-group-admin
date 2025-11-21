import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { GetStateLookupList, GetStateModel } from 'services/Master Crud/MasterStateApi';
import { ConfigContext } from 'context/ConfigContext';
import Select from 'react-select';
import { AddUpdateDistrict, GetDistrictModel } from 'services/Master Crud/MasterDistrictApi';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
const AddUpdateMasterDistrictModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [stateOption, setStateOption] = useState([]);
  const { setLoader, user } = useContext(ConfigContext);
  const [masterDistrictObj, setMasterDistrictObj] = useState({
    userKeyID: null,
    districtID: null,
    stateName: null,
    districtID: null,
    districtName: null
  });

  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.districtID !== null) {
        GetMasterDistrictModalData(modelRequestData.districtID);
      }
    }
  }, [modelRequestData?.Action]);

  // useEffect(() => {
  //   GetStateLookupListData();
  // }, [modelRequestData?.Action]);

  const AddStateBtnClick = () => {
    // debugger;
    let isValid = false;
    if (
      masterDistrictObj.districtName === null ||
      masterDistrictObj.districtName === undefined ||
      masterDistrictObj.districtName === '' ||
      masterDistrictObj.stateID === null ||
      masterDistrictObj.stateID === undefined ||
      masterDistrictObj.stateID === ''
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    const apiParam = {
      userKeyID: user.userKeyID,
      stateID: masterDistrictObj?.stateID,
      districtName: masterDistrictObj?.districtName,
      districtID: modelRequestData?.districtID
    };

    if (!isValid) {
      AddUpdateStateData(apiParam);
    }
  };

  const AddUpdateStateData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateDistrict'; // Default URL for Adding Data

      const response = await AddUpdateDistrict(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'District Added Successfully!'
              : 'District Updated Successfully!'
          ); //Do not change this naming convention

          setIsAddUpdateActionDone(true);
        } else {
          setLoader(false);
          setErrorMessage(response?.response?.data?.errorMessage);
        }
      }
    } catch (error) {
      setLoader(true);
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

  const closeAllModal = () => {
    onHide();
    setShowSuccessModal(false);
  };

  const GetMasterDistrictModalData = async (id) => {
    if (id === undefined) {
      return;
    }

    setLoader(true);
    try {
      const data = await GetDistrictModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = data.data.responseData.data; // Assuming data is an array

        setMasterDistrictObj({
          ...masterDistrictObj,
          adminID: ModelData.adminID,
          userKeyID: ModelData.userKeyID,
          stateID: ModelData.stateID,
          stateName: ModelData.stateName,
          districtName: ModelData.districtName
        });
      } else {
        setLoader(false);
        // Handle non-200 status codes if necessary
        console.error('Error fetching data: ', data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error in district: ', error);
    }
  };

  const handleDistrictChange = (selectedOption) => {
    setMasterDistrictObj((prev) => ({
      ...prev,
      stateID: selectedOption ? selectedOption.value : null,
      // districtName:''
    }));
    setErrorMessage(false)
  };

  return (
    <>
      <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {modelRequestData?.Action !== null ? 'Update District' : modelRequestData?.Action === null ? 'Add District' : ''}
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
                value={stateOption.filter((item) => item.value === masterDistrictObj.stateID)}
                onChange={handleDistrictChange}
                menuPosition="fixed"
              />
              {error &&
                (masterDistrictObj.stateID === null || masterDistrictObj.stateID === undefined || masterDistrictObj.stateID === '') ? (
                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
              {/* {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>} */}
            </div>
            <div className="col-12 mb-3">
              <label htmlFor="StateName" className="form-label">
                District Name
                <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                maxLength={20}
                type="text"
                className="form-control"
                id="StateName"
                placeholder="Enter District Name"
                aria-describedby="Employee"
                value={masterDistrictObj.districtName}
                onChange={(e) => {
                  setErrorMessage(false);
                  let inputValue = e.target.value;

                  // Prevent if only space typed at start
                  if (inputValue.length === 1 && inputValue === ' ') {
                    inputValue = '';
                  }

                  // Remove unwanted characters (allow letters, numbers, spaces)
                  const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                  // Capitalize first letter after every space (preserve multiple spaces)
                  const updatedValue = cleanedValue.replace(/\b\w/g, (char) => char.toUpperCase());

                  setMasterDistrictObj((prev) => ({
                    ...prev,
                    districtName: updatedValue
                  }));
                }}
              />


              {error &&
                (masterDistrictObj.districtName === null ||
                  masterDistrictObj.districtName === undefined ||
                  masterDistrictObj.districtName === '') ? (
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

export default AddUpdateMasterDistrictModal;
