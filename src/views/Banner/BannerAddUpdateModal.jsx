


import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { AddUpdateManufacturerModelApi, GetManufacturerModel } from 'services/ManufactureModal/ManufcatureModalApi';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { uploadPdfWithNodeApi } from 'services/UploadImage/UploadImage';
import { AddUpdateBanner, GetBannerModel } from 'services/Banner/BannerApi';

const BannerAddUpdateModal = ({
      show,
      onHide,
      setIsAddUpdateActionDone,
      modelRequestData
}) => {
      const [modelAction, setModelAction] = useState('');
      const [error, setErrors] = useState(null);
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [errorMessage, setErrorMessage] = useState();
      const { setLoader, user } = useContext(ConfigContext);
      const [isFileChanged, setIsFileChanged] = useState(false); // 🔑 flag
      const [bannerObj, setBannerObj] = useState({
            userKeyID: null,
            bannerKeyID: null,
            bannerName: null,
            bannerImage: null,
            poPdfPreview: null,


      });

      useEffect(() => {
            if (show) {
                  if (modelRequestData?.Action === 'Update' && modelRequestData?.bannerKeyID) {
                        GetBannerModelData(modelRequestData.bannerKeyID);
                  } else {
                        // Always reset when modal opens for Add
                        setBannerObj({
                              userKeyID: null,
                              bannerKeyID: null,
                              bannerName: ''
                        });
                  }
                  // Also reset errors and messages
                  setErrors(false);
                  setErrorMessage('');
            }
      }, [show, modelRequestData?.Action, modelRequestData?.bannerKeyID]);

      const AddManufacturerBtnClick = () => {
            let isValid = false;
            if (
                  bannerObj.bannerName === null ||
                  bannerObj.bannerName === undefined ||
                  bannerObj.bannerName === '' ||
                  bannerObj.bannerImage === null || bannerObj.bannerImage === '' || bannerObj.bannerImage === undefined

            ) {
                  setErrors(true);
                  isValid = true;
            } else {
                  setErrors(false);
                  isValid = false;
            }

            const apiParam = {
                  userKeyID: user.userKeyID,
                  bannerName: bannerObj?.bannerName,
                  bannerKeyID: modelRequestData?.bannerKeyID,
                  bannerImage: isFileChanged ? bannerObj.bannerImage : null, // 🔑 key change

            };

            if (!isValid) {
                  AddUpdateManufacturerData(apiParam);
            }
      };

      const AddUpdateManufacturerData = async (apiParam) => {
            setLoader(true);
            try {
                  const url = '/AddUpdateBanner';

                  const response = await AddUpdateBanner(url, apiParam);
                  if (response?.data?.statusCode === 200) {
                        setLoader(false);
                        setShowSuccessModal(true);
                        setModelAction(
                              modelRequestData.Action === null || modelRequestData.Action === undefined
                                    ? 'Banner Added Successfully!'
                                    : 'Banner Updated Successfully!'
                        );

                        setIsAddUpdateActionDone(true);
                  } else {
                        setLoader(false);
                        setErrorMessage(response?.response?.data?.errorMessage);
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

      const GetBannerModelData = async (id) => {
            if (!id) return;

            setLoader(true);
            try {
                  const data = await GetBannerModel(id);
                  if (data?.data?.statusCode === 200) {
                        setLoader(false);
                        const ModelData = data.data.responseData.data;

                        setBannerObj({
                              ...bannerObj,
                              userKeyID: ModelData.userKeyID,
                              bannerKeyID: modelRequestData.bannerKeyID,
                              bannerImage: ModelData.bannerImage,
                              bannerName: ModelData.bannerName,
                              poPdfPreview: ModelData.bannerImage
                        });
                        setIsFileChanged(false); // reset, since nothing uploaded yet
                  } else {
                        setLoader(false);
                        console.error('Error fetching data: ', data?.data?.statusCode);
                  }
            } catch (error) {
                  setLoader(false);
                  console.error('Error in manufacturer: ', error);
            }
      };

      return (
            <>
                  <Modal
                        size="md"
                        show={show}
                        style={{ zIndex: 1300 }}
                        onHide={onHide}
                        backdrop="static"
                        keyboard={false}
                        centered
                  >
                        <Modal.Header closeButton>
                              <Modal.Title>
                                    <h3 className="text-center">
                                          {modelRequestData?.Action !== null
                                                ? 'Update Banner'
                                                : modelRequestData?.Action === null
                                                      ? 'Add Banner'
                                                      : ''}
                                    </h3>
                              </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
                              <div className="container">
                                    <div className="row">
                                          <div>
                                                <label htmlFor="ManufacturerName" className="form-label">
                                                      Banner Name
                                                      <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <input
                                                      maxLength={30}
                                                      type="text"
                                                      className="form-control"
                                                      id="ManufacturerName"
                                                      placeholder="Enter Banner Name"
                                                      value={bannerObj.bannerName || ''}
                                                      onChange={(e) => {
                                                            setErrorMessage(false);
                                                            let inputValue = e.target.value;

                                                            if (inputValue.length === 0 || (inputValue.length === 1 && inputValue === ' ')) {
                                                                  inputValue = '';
                                                            }

                                                            // allow letters, numbers, space, and - . , & ()
                                                            const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s\[\].,&()_-]/g, '');
                                                            const trimmedValue = cleanedValue.trimStart();
                                                            const updatedValue = trimmedValue
                                                                  .split(' ')
                                                                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                                                  .join(' ');

                                                            setBannerObj((prev) => ({
                                                                  ...prev,
                                                                  bannerName: updatedValue
                                                            }));
                                                      }}

                                                />

                                                {error &&
                                                      (!bannerObj.bannerName ||
                                                            bannerObj.bannerName === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                                {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
                                          </div>



                                          <div className="col-12 mb-3">
                                                <label className="form-label">
                                                      Upload Banner
                                                      <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <input
                                                      type="file"
                                                      accept="image/*"
                                                      className="form-control"
                                                      onChange={async (e) => {
                                                            const file = e.target.files[0];
                                                            const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB
                                                            setLoader(true);

                                                            if (file) {
                                                                  if (!file.type.startsWith("image/")) {
                                                                        alert("Only image files are allowed.");
                                                                        setLoader(false);
                                                                        return;
                                                                  }
                                                                  if (file.size > maxSizeInBytes) {
                                                                        alert("Image size must be less than or equal to 10 MB.");
                                                                        setLoader(false);
                                                                        return;
                                                                  }

                                                                  const fileURL = URL.createObjectURL(file);

                                                                  const uploadParams = {
                                                                        pdfFile: file, // keep same payload key for API
                                                                        moduleName: "PO",
                                                                        projectName: "MYOMNAMO",
                                                                        userId: user.userKeyID,
                                                                  };

                                                                  const res = await uploadPdfWithNodeApi(uploadParams);
                                                                  if (res?.data?.success) {
                                                                        const s3Url = res.data.s3Url;
                                                                        setBannerObj((prev) => ({
                                                                              ...prev,
                                                                              bannerImage: s3Url,
                                                                              poPdfPreview: fileURL, // now this will preview the image
                                                                        }));
                                                                        setIsFileChanged(true);
                                                                  }
                                                                  setLoader(false);
                                                            }
                                                      }}
                                                />
                                                <span>
                                                      <small>Note: Max 10MB</small>
                                                </span>
                                                <br />
                                                {error &&
                                                      (!bannerObj.bannerImage ||
                                                            bannerObj.bannerImage === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}


                                                {bannerObj.poPdfPreview && (
                                                      <div className="mt-3">
                                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                                  <strong>Preview:</strong>
                                                                  <button
                                                                        className="btn btn-sm btn-danger"
                                                                        onClick={() => {
                                                                              setBannerObj((prev) => ({
                                                                                    ...prev,
                                                                                    bannerImage: null,
                                                                                    poPdfPreview: null,
                                                                              }));
                                                                        }}
                                                                  >
                                                                        Remove Image
                                                                  </button>
                                                            </div>
                                                            <img
                                                                  src={bannerObj.poPdfPreview}
                                                                  alt="Preview"
                                                                  style={{
                                                                        width: "100%",
                                                                        maxHeight: "200px",
                                                                        objectFit: "contain",
                                                                        border: "1px solid #ccc",
                                                                        borderRadius: "4px",
                                                                  }}
                                                            />
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
                              <button
                                    type="submit"
                                    style={{ background: '#ffaa33' }}
                                    className="btn text-white text-center"
                                    onClick={AddManufacturerBtnClick}
                              >
                                    Submit
                              </button>
                        </Modal.Footer>
                  </Modal>

                  {showSuccessModal && (
                        <SuccessPopupModal
                              show={showSuccessModal}
                              onHide={closeAllModal}
                              setShowSuccessModal={setShowSuccessModal}
                              modelAction={modelAction}
                        />
                  )}
            </>
      );
};

export default BannerAddUpdateModal;
