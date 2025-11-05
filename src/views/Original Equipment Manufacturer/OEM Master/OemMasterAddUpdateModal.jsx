


import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { AddUpdateProductApi, GetProductModel } from 'services/Product/ProductApi';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { AddUpdateOEM, GetOEMModel } from 'services/Original Equipment Manufacturer/OriginalEquipmentManufacturerApi';

const OemMasterAddUpdateModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
      const [modelAction, setModelAction] = useState('');
      const [error, setErrors] = useState(null);
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [errorMessage, setErrorMessage] = useState();
      const { setLoader, user } = useContext(ConfigContext);
      const [oemMasterObj, setOemMasterObj] = useState({
            userKeyID: null,
            oemKeyID: null,
            oemName: null,
            oemMobileNo: null,
            oemEmailID: null,
            oemAddress: null
      });

      useEffect(() => {
            if (modelRequestData?.Action === 'Update') {
                  if (modelRequestData?.oemKeyID !== null) {
                        GetProductModelData(modelRequestData.oemKeyID);
                  }
            }
      }, [modelRequestData?.Action]);

      const AddProductBtnClick = () => {
            let isValid = false;
            if (oemMasterObj.oemName === null || oemMasterObj.oemName === undefined || oemMasterObj.oemName.trim() === '') {
                  setErrors(true);
                  isValid = true;
            } else {
                  setErrors(false);
                  isValid = false;
            }

            const apiParam = {
                  userKeyID: user.userKeyID,
                  oemName: oemMasterObj?.oemName,
                  oemKeyID: oemMasterObj?.oemKeyID,
                  oemEmailID: oemMasterObj?.oemEmailID,
                  oemMobileNo: oemMasterObj?.oemMobileNo,
                  oemAddress: oemMasterObj?.oemAddress,

            };

            if (!isValid) {
                  AddUpdateOEMData(apiParam);
            }
      };

      const AddUpdateOEMData = async (apiParam) => {
            setLoader(true);
            try {
                  let url = '/AddUpdateOEM';

                  const response = await AddUpdateOEM(url, apiParam);
                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false);
                              setShowSuccessModal(true);
                              setModelAction(
                                    modelRequestData.Action === null
                                          ? 'OEM details has been added successfully!'
                                          : 'OEM details has been update successfully!'
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

      const GetProductModelData = async (id) => {
            if (id === undefined) {
                  return;
            }
            setLoader(true);

            try {
                  const data = await GetOEMModel(id);
                  if (data?.data?.statusCode === 200) {
                        setLoader(false);
                        const ModelData = data.data.responseData.data;

                        setOemMasterObj({
                              ...oemMasterObj,
                              userKeyID: ModelData.userKeyID,
                              oemKeyID: ModelData.oemKeyID,
                              oemName: ModelData.oemName,
                              oemEmailID: ModelData.oemEmailID,
                              oemAddress: ModelData.oemAddress,
                              oemMobileNo: ModelData.oemMobileNo
                        });
                  } else {
                        setLoader(false);
                        console.error('Error fetching data: ', data?.data?.statusCode);
                  }
            } catch (error) {
                  setLoader(false);
                  console.error('Error in product: ', error);
            }
      };

      return (
            <>
                  <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
                        <Modal.Header closeButton>
                              <Modal.Title>
                                    <h3 className="text-center">
                                          {modelRequestData?.Action !== null ? 'Update OEM' : modelRequestData?.Action === null ? 'Add OEM' : ''}
                                    </h3>
                              </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
                              <div className="container">
                                    <div className="row">
                                          {/* Product Name */}
                                          <div className="mb-3">
                                                <label htmlFor="ProductName" className="form-label">
                                                      OEM Name <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <input
                                                      maxLength={80}
                                                      type="text"
                                                      className="form-control"
                                                      id="ProductName"
                                                      placeholder="Enter OEM Name"
                                                      aria-describedby="Product"
                                                      value={oemMasterObj.oemName}
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

                                                            setOemMasterObj((prev) => ({
                                                                  ...prev,
                                                                  oemName: updatedValue
                                                            }));
                                                      }}
                                                />
                                                {error && !oemMasterObj.oemName && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
                                                {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
                                          </div>

                                          {/* HSN */}
                                          <div className="mb-3">
                                                <label htmlFor="oemEmailID" className="form-label">
                                                      Email
                                                </label>
                                                <input
                                                      maxLength={60}
                                                      type="text"
                                                      className="form-control"
                                                      id="oemEmailID"
                                                      placeholder="Enter Email "
                                                      value={oemMasterObj.oemEmailID}
                                                      onChange={(e) => {
                                                            const value = e.target.value;
                                                            setOemMasterObj((prev) => ({ ...prev, oemEmailID: value }));
                                                      }}
                                                      onBlur={(e) => {
                                                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                                            if (e.target.value && !emailRegex.test(e.target.value)) {
                                                                  alert("Please enter a valid oemEmailID oemAddress");
                                                            }
                                                      }}

                                                />
                                          </div>

                                          {/* GST Percentage */}
                                          <div className="mb-3">
                                                <label htmlFor="GstPercentage" className="form-label">
                                                      Contact No.
                                                </label>
                                                <input
                                                      type="tel"
                                                      className="form-control"
                                                      id="contactNumber"
                                                      placeholder="Enter Contact No"
                                                      value={oemMasterObj.oemMobileNo}
                                                      onChange={(e) => {
                                                            let value = e.target.value;

                                                            // ✅ Allow only digits
                                                            if (/^\d*$/.test(value)) {
                                                                  // ✅ If first digit is present, must be 6-9
                                                                  if (value === "" || /^[6-9]/.test(value)) {
                                                                        // ✅ Limit to 10 digits max
                                                                        if (value.length <= 10) {
                                                                              setOemMasterObj((prev) => ({ ...prev, oemMobileNo: value }));
                                                                        }
                                                                  }
                                                            }
                                                      }}
                                                />

                                          </div>
                                          <div className="mb-3">
                                                <label htmlFor="GstPercentage" className="form-label">
                                                      Address
                                                </label>
                                                <textarea
                                                      type="number"
                                                      className="form-control"
                                                      id="GstPercentage"
                                                      placeholder="Enter Address"
                                                      value={oemMasterObj.oemAddress}
                                                      onChange={(e) => {
                                                            let value = e.target.value;
                                                            setOemMasterObj((prev) => ({ ...prev, oemAddress: value }));
                                                      }}
                                                />
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

export default OemMasterAddUpdateModal;
