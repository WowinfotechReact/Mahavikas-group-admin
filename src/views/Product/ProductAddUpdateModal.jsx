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

const AddUpdateProductModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user } = useContext(ConfigContext);
  const [servicesOption, setServicesOption] = useState([])
  const [productObj, setProductObj] = useState({
    userKeyID: null,
    projectKeyID: null,
    projectName: null,
    projectDescription: null,
    serviceKeyID: null
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
        const stateLookupList = response?.data?.responseData?.data || [];

        const formattedIvrList = stateLookupList.map((ivrItem) => ({
          value: ivrItem.serviceKeyID,
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
      serviceKeyID: productObj?.serviceKeyID,
    };

    if (!isValid) {
      AddUpdateProjectData(apiParam);
    }
  };
  const handleServiceChange = (selectedOption) => {
    setProductObj((prev) => ({
      ...prev,
      serviceKeyID: selectedOption ? selectedOption.value : null,

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
              ? 'Product Added Successfully!'
              : 'Product Updated Successfully!'
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

        setProductObj({
          ...productObj,
          userKeyID: ModelData.userKeyID,
          projectKeyID: modelRequestData.projectKeyID,
          projectName: ModelData.projectName,
          projectDescription: ModelData.projectDescription,
          serviceKeyID: ModelData.serviceKeyID
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
  const serviceOption = [
    { value: '1', label: 'MTS' },
    { value: '2', label: 'Teaching' },
    { value: '3', label: 'Nursing' },
  ]
  return (
    <>
      <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {modelRequestData?.Action !== null ? 'Update Product' : modelRequestData?.Action === null ? 'Add Project' : ' Update Project'}
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

              <div className="mb-3">
                <label htmlFor="ProductName" className="form-label">
                  Select Services<span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  options={servicesOption}
                  value={servicesOption.filter((item) => item.value === productObj.serviceKeyID)}
                  onChange={handleServiceChange}
                  menuPosition="fixed"
                />
                {error && !productObj.serviceKeyID && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
                {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
              </div>

              {/* GST Percentage */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="startDate" className="form-label">
                    Start Date
                  </label>
                  <DatePicker
                    id="startDate"
                    label="From Date"
                    format="dd/MM/yyyy"
                    clearIcon={null}
                    popperPlacement="bottom-start"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="endDate" className="form-label">
                    End Date
                  </label>
                  <DatePicker
                    id="endDate"
                    label="To Date"
                    format="dd/MM/yyyy"
                    clearIcon={null}
                    popperPlacement="bottom-start"
                  />
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
