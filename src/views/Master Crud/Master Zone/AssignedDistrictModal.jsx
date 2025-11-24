



import Select from 'react-select';




import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { AddUpdateZoneDistrictMapping } from 'services/Master Crud/MasterZoneApi';
import { GetStateLookupList } from 'services/Master Crud/MasterStateApi';
import { GetDistrictLookupList } from 'services/Master Crud/MasterDistrictApi';

const AssignedDistrictModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {

      const [modelAction, setModelAction] = useState('');
      const [error, setErrors] = useState(null);
      const [stateOption, setStateOption] = useState([])
      const [districtOption, setDistrictOption] = useState([])
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [errorMessage, setErrorMessage] = useState();
      const { setLoader, user } = useContext(ConfigContext);
      const [masterZoneObj, setMasterZoneObj] = useState({
            userKeyID: null,
            zoneKeyID: null,
            zoneName: null,
            districtID: null,
            stateID: null,
      });

      console.log(modelRequestData.zoneKeyID, '333333ssssssss');


      const AddZoneBtnClick = () => {
            debugger
            let isValid = false;
            if (masterZoneObj.districtID === null || masterZoneObj.districtID === undefined || masterZoneObj.districtID === '') {
                  setErrors(true);
                  isValid = true;
            } else {
                  setErrors(false);
                  isValid = false;
            }

            const apiParam = {
                  // userKeyID: user.userKeyID,
                  districtKeyList: masterZoneObj.districtID,
                  zoneKeyID: modelRequestData?.zoneKeyID
            };

            if (!isValid) {
                  AddUpdateZoneDistrictMappingData(apiParam);
            }
      };

      const AddUpdateZoneDistrictMappingData = async (apiParam) => {
            setLoader(true);
            try {
                  let url = '/AddUpdateZoneDistrictMapping'; // Default URL for Adding Data

                  const response = await AddUpdateZoneDistrictMapping(url, apiParam);
                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false);
                              setShowSuccessModal(true);
                              setModelAction(
                                    modelRequestData.Action === null || modelRequestData.Action === undefined
                                          ? 'District Assigned Successfully!'
                                          : 'Zone Updated Successfully!'
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

      const closeAllModal = () => {
            onHide();
            setShowSuccessModal(false);
      };

      useEffect(() => {
            GetStateLookupListData()
      }, [])
      const GetStateLookupListData = async () => {
            try {
                  const response = await GetStateLookupList(); // Ensure this function is imported correctly

                  if (response?.data?.statusCode === 200) {
                        const roleTypeLookupList = response?.data?.responseData?.data || [];

                        const formattedIvrList = roleTypeLookupList.map((roleType) => ({
                              value: roleType.stateID,
                              label: roleType.stateName
                        }));

                        setStateOption(formattedIvrList); // Make sure you have a state setter function for IVR list
                  } else {
                        console.error('Failed to fetch role Type lookup list:', response?.data?.statusMessage || 'Unknown error');
                  }
            } catch (error) {
                  console.error('Error fetching role Type lookup list:', error);
            }
      };


      const handleRoleTypeChange = (selectedOption) => {
            const stateID = selectedOption ? selectedOption.value : '';

            setMasterZoneObj((prev) => ({
                  ...prev,
                  stateID: stateID,
            }));

            if (stateID) {
                  GetDistrictLookupListData([], stateID);
            } else {
                  setDistrictOption([]);
            }
      };



      const GetDistrictLookupListData = async (zoneIds = [], stateID) => {
            try {
                  const ZoneIDsParam = zoneIds.join(",");

                  let response = await GetDistrictLookupList(null, null, null, null, stateID);

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


      return (
            <>
                  <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
                        <Modal.Header closeButton>
                              <Modal.Title>
                                    <h3 className="text-center">
                                          {modelRequestData?.Action !== null ? 'Update Zone' : modelRequestData?.Action === null ? 'Map Zone District' : ''}
                                    </h3>
                              </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
                              <div className="container">
                                    <div className="row">
                                          <div>
                                                <label htmlFor="StateName" className="form-label">
                                                      Select State
                                                      <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <Select
                                                      menuPortalTarget={document.body}
                                                      styles={{
                                                            menuPortal: (base) => ({
                                                                  ...base,
                                                                  zIndex: 9999 // Ensures dropdown appears above everything
                                                            })
                                                      }}

                                                      options={stateOption}
                                                      value={stateOption.filter((item) => item.value === masterZoneObj.stateID)}
                                                      onChange={handleRoleTypeChange}
                                                      menuPosition="fixed"
                                                />

                                                {error &&
                                                      (masterZoneObj.stateID === null || masterZoneObj.stateID === undefined || masterZoneObj.stateID === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                                {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
                                          </div>
                                          <div>
                                                <label htmlFor="StateName" className="form-label">
                                                      Select District
                                                      <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <Select
                                                      isMulti
                                                      menuPortalTarget={document.body}
                                                      styles={{
                                                            menuPortal: (base) => ({
                                                                  ...base,
                                                                  zIndex: 9999
                                                            })
                                                      }}
                                                      options={districtOption}
                                                      value={districtOption.filter((item) =>
                                                            masterZoneObj.districtID?.includes(item.value)
                                                      )}
                                                      onChange={(selectedOptions) =>
                                                            setMasterZoneObj((prev) => ({
                                                                  ...prev,
                                                                  districtID: selectedOptions ? selectedOptions.map(s => s.value) : []
                                                            }))
                                                      }
                                                      menuPosition="fixed"
                                                />



                                                {error &&
                                                      (masterZoneObj.districtID === null || masterZoneObj.districtID === undefined || masterZoneObj.districtID === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                                {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
                                          </div>
                                    </div>
                              </div>
                        </Modal.Body>
                        <Modal.Footer>

                              <button
                                    style={{ background: '#ffaa33', color: 'white' }}
                                    className="btn btn-sm d-none d-sm-inline"
                                    onClick={AddZoneBtnClick}
                              >

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

export default AssignedDistrictModal;

