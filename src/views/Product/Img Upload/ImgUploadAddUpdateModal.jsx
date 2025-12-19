





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
import { uploadPdfWithNodeApi } from 'services/UploadImage/UploadImage';

const ImgUploadAddUpdateModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
      const [modelAction, setModelAction] = useState('');
      const [error, setErrors] = useState(null);
      const [isFileChanged, setIsFileChanged] = useState(false); // 🔑 flag
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [errorMessage, setErrorMessage] = useState();
      const { setLoader, user, companyID } = useContext(ConfigContext);
      const [servicesOption, setServicesOption] = useState([])
      const [companyOption, setCompanyOption] = useState([])
      const [zoneOption, setZoneOption] = useState([]);
      const [stateOption, setStateOption] = useState([]);
      const [districtOption, setDistrictOption] = useState([]);
      const [talukaOption, setTalukaOption] = useState([]);


      const [projectImgObj, setProjectImgObj] = useState({
            uploadFile: null,
            previewURL: null,
      });
      const handlePdfChange = (e) => {
            const file = e.target.files[0];

            if (!file) return;

            if (file.type !== "application/pdf") {
                  setErrorMessage("Only PDF files are allowed");
                  return;
            }

            setErrorMessage("");

            setProjectImgObj({
                  uploadFile: file,
                  previewURL: URL.createObjectURL(file),
            });
      };


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
                  projectImgObj.uploadFile === null || projectImgObj.uploadFile === undefined || projectImgObj.uploadFile === ''
            ) {
                  setErrors(true);
                  isValid = true;
            } else {
                  setErrors(false);
                  isValid = false;
            }

            const apiParam = {
                  userKeyID: user.userKeyID,
            };

            if (!isValid) {
                  AddUpdateProjectData(apiParam);
            }
      };
      const handleServiceChange = (selectedOption) => {
            setProjectImgObj((prev) => ({
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

                        const stateIDs = Array.isArray(ModelData.stateIDs)
                              ? ModelData.stateIDs
                              : ModelData.stateIDs ? [ModelData.stateIDs] : [];

                        setProjectImgObj({
                              ...projectImgObj,
                              userKeyID: ModelData.userKeyID,
                              projectKeyID: modelRequestData.projectKeyID,
                              projectName: ModelData.projectName,
                              manPower: ModelData.manPower,
                              startDate: ModelData.startDate,
                              endDate: ModelData.endDate,
                              projectDescription: ModelData.projectDescription,
                              serviceID: ModelData.serviceID,
                              zoneIDs,
                              districtIDs,
                              talukaIDs,
                              projectIDs,
                              stateIDs

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
                                          {modelRequestData?.Action !== null ? 'Update Project' : modelRequestData?.Action === null ? 'Add Project Document' : ' Update Project Document'}
                                    </h3>
                              </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
                              <div className="container">
                                    <div className="row">
                                          {/* Product Name */}
                                          <div className="mb-3">
                                                <label htmlFor="ProductName" className="form-label">
                                                      Document Upload <span style={{ color: 'red' }}>*</span>
                                                </label>


                                                <input
                                                      type="file"
                                                      accept="application/pdf"
                                                      className="form-control"
                                                      onChange={async (e) => {
                                                            const file = e.target.files[0];
                                                            const maxSizeInBytes = 10 * 1024 * 1024;
                                                            setLoader(true);

                                                            if (file) {
                                                                  if (file.type !== "application/pdf") {
                                                                        alert("Only PDF files are allowed.");
                                                                        return;
                                                                  }
                                                                  if (file.size > maxSizeInBytes) {
                                                                        alert("PDF size must be less than or equal to 10 MB.");
                                                                        return;
                                                                  }

                                                                  const fileURL = URL.createObjectURL(file);

                                                                  const uploadParams = {
                                                                        pdfFile: file,
                                                                        moduleName: "PO",
                                                                        projectName: "MYOMNAMO",
                                                                        userId: user.userKeyID,
                                                                  };

                                                                  const res = await uploadPdfWithNodeApi(uploadParams);
                                                                  if (res?.data?.success) {
                                                                        const s3Url = res.data.s3Url;
                                                                        setLoader(false);
                                                                        setProjectImgObj((prev) => ({
                                                                              ...prev,
                                                                              uploadFile: s3Url,
                                                                              previewURL: fileURL
                                                                        }));
                                                                        setIsFileChanged(true); // 🔑 user uploaded new file

                                                                  }
                                                                  setLoader(false);
                                                            }
                                                      }}
                                                />
                                                {error && !projectImgObj.uploadFile && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
                                                {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
                                          </div>


                                          {projectImgObj.previewURL && (
                                                <div className="mt-3">
                                                      <div className="d-flex justify-content-between align-items-center mb-2">
                                                            <strong>Preview:</strong>
                                                            <button
                                                                  className="btn btn-sm btn-danger"
                                                                  onClick={() => {
                                                                        setProjectImgObj((prev) => ({
                                                                              ...prev,
                                                                              uploadFile: null,
                                                                              previewURL: null
                                                                        }));
                                                                  }}
                                                            >
                                                                  Remove PDF
                                                            </button>
                                                      </div>
                                                      <iframe
                                                            src={projectImgObj.previewURL}
                                                            title="PO PDF Preview"
                                                            width="100%"
                                                            height="400px"
                                                            style={{ border: '1px solid #ccc', borderRadius: '4px' }}
                                                      />
                                                </div>
                                          )}
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

export default ImgUploadAddUpdateModal;

