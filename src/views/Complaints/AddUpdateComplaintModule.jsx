// ModalComponent.js
import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { AddUpdateComplaintApi, GetComplaintModel } from 'services/ComplaintsApi/ComplaintApi';
import { GetDeviceIMEILookupList } from 'services/DeviceAPI/DeviceAPI';
import { GetCustomerLookupList } from 'services/CustomerStaff/CustomerStaffApi';
import { GetComplaintTypeLookupList } from 'services/ComplaintsApi/ComplaintApi';

const AddUpdateComplaintModal = ({ show, handleClose, modelRequestData, setIsAddUpdateActionDone }) => {
  const [error, setErrors] = useState(null);
  const { companyID } = useContext(ConfigContext);

  const [customerLookupList, setCustomerLookupList] = useState([]);
  const [deviceIMEILookupList, setDeviceIMEILookupList] = useState([]);
  const [complaintTypeLookupList, setComplaintTypeLookupList] = useState([]);
  const [showSuccessModel, setShowSuccessModal] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [sizeError, setSizeError] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [actionMassage, setActionMassage] = useState(null);
  const [modelAction, setModelAction] = useState(null);
  const { user, setLoader } = useContext(ConfigContext);
  const [complaintObj, setComplaintObj] = useState({
    customerID: null,
    deviceIMEI: null,
    complaintTypeID: null,
    remark: null,
    complaintImgURL: null,
    installationID: null
  });

  useEffect(() => {
    if (
      modelRequestData.Action === 'Update' // Don't change this naming convention
    ) {
      GetComplaintModalData(modelRequestData?.complaintKeyID);
    } else {
      setInitialData()
    }
  }, [modelRequestData.Action]);

  console.log('companyKeyID', user.companyKeyID);

  const [uploadImageObj, setUploadImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: complaintObj.complaintImgURL,
    moduleName: 'Complaint'
  });



  const setInitialData = () => {
    setErrors(false);
    setImagePreview(null);
    setComplaintObj({
      ...complaintObj,
      customerID: null,
      deviceIMEI: null,
      complaintID: null,
      remark: null,
      paymentImgURL: null,
      complaintID: null
    });
  };

  const handlAddComplaintBtnClick = async () => {
    // debugger
    let isValid = false;
    let Url = null;

    if (
      image === null ||
      image === undefined ||
      image === '' ||
      complaintObj.complaintID === null ||
      complaintObj.complaintID === undefined ||
      complaintObj.complaintID === '' ||
      complaintObj.remark === null ||
      complaintObj.remark === undefined ||
      complaintObj.remark === '' ||
      complaintObj.customerID === null ||
      complaintObj.customerID === undefined ||
      complaintObj.customerID === '' ||
      complaintObj.deviceIMEI === null ||
      complaintObj.deviceIMEI === undefined ||
      complaintObj.deviceIMEI === ''
    ) {
      setErrors(true);
      isValid = true;
    }



    const apiParamObj = {
      customerID: complaintObj.customerID,
      imageURL: Url,
      complaintTypeID: complaintObj.complaintID,
      remark: complaintObj.remark,
      deviceID: complaintObj?.deviceIMEI,
      companyKeyID: companyID,
      userKeyID: user.userKeyID,
      installationID: complaintObj.installationID,
    };

    if (!isValid) {
      AddUpdateAMCData(apiParamObj);
    }
  };



  const AddUpdateAMCData = async (apiParams) => {
    setLoader(true);

    try {

      const response = await AddUpdateComplaintApi(apiParams); //Call this api

      if (response?.data.statusCode === 200) {
        setLoader(false);
        setIsAddUpdateActionDone(true);
        setShowSuccessModal(true);
        if (modelRequestData?.Action === null || modelRequestData?.Action === undefined) {
          setModelAction('Complaint Added Successfully ');
        } else {
          setModelAction('Complaint Updated Successfully ');
        }
        setShowSuccessModal(true);
        setInitialData()
      } else {
        setLoader(false);
        setErrorMessage(response.data.errorMessage);
        console.error('Bad request');
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const GetDeviceIMEILookUpListData = async (id) => {
    setLoader(true);
    try {
      let response = await GetDeviceIMEILookupList(id, companyID);
      if (response?.data?.statusCode === 200) {
        setLoader(false);
        const DeviceIMEIOptions = response?.data?.responseData?.data || [];
        const FormattedRollOptions = DeviceIMEIOptions.map((val) => ({
          value: val.deviceID,
          label: val.imei,
          installationID: val.installationID,
          imei: val.imei // Add this to help match
        }));
        setDeviceIMEILookupList(FormattedRollOptions);

        // Match current deviceIMEI and set installationID accordingly
        const matchedDevice = FormattedRollOptions.find(
          (opt) => opt.imei === complaintObj.deviceIMEI
        );

        if (matchedDevice) {
          setComplaintObj((prev) => ({
            ...prev,
            installationID: matchedDevice.installationID,
          }));
        }

      } else {
        setLoader(false);
        console.error('Bad request');
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  const GetCustomerLookUpListData = async () => {
    setLoader(true);
    try {
      let response = await GetCustomerLookupList(companyID);
      if (response?.data?.statusCode === 200) {
        setLoader(false);

        const customerOptions = response?.data?.responseData?.data || [];
        const FormattedRollOptions = customerOptions.map((val) => ({
          value: val.customerID,
          label: val.name
        }));
        setCustomerLookupList(FormattedRollOptions);
      } else {
        setLoader(false);
        console.error('Bad request');
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const GetComplaintTypeLookUpListData = async () => {
    setLoader(true);
    try {
      let response = await GetComplaintTypeLookupList();
      if (response?.data?.statusCode === 200) {
        setLoader(false);

        const ComplaintTypeOptions = response?.data?.responseData?.data || [];
        const FormattedRollOptions = ComplaintTypeOptions.map((val) => ({
          value: val.complaintTypeID,
          label: val.complaintType
        }));
        setComplaintTypeLookupList(FormattedRollOptions);
      } else {
        setLoader(false);
        console.error('Bad request');
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  //Get Complaint Modal
  const GetComplaintModalData = async (id) => {
    setLoader(true);
    try {
      const response = await GetComplaintModel(id);
      if (response?.data?.statusCode === 200) {
        setLoader(false);

        const ModelData = response.data.responseData?.data || []; // Assuming the data is an array and we need the first item
        setComplaintObj({
          ...complaintObj,
          customerID: ModelData.customerID,
          deviceIMEI: ModelData.deviceID,
          complaintID: ModelData.complaintTypeID,
          remark: ModelData.remark,
          complaintImgURL: ModelData.imageURL
        });
        setImage(ModelData.imageURL);
        setImagePreview(ModelData.imageURL);
      } else {
        setLoader(false);
        console.error('Error fetching data: ', response?.data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);

      console.error('Error', error);
    }
  };

  const handleCustomerChange = (selectedOption) => {
    setComplaintObj((prev) => ({
      ...prev,
      customerID: selectedOption.value
    }));
  };

  const handleRemoveImage = (type) => {
    setImagePreview(null);
    setImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the file object
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size <= 2 * 1024 * 1024) {
        setSizeError('');
        setImage(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(event.target.result); // Set the image data URL
        };
        reader.readAsDataURL(file); // Convert file to a data URL
      } else if (file.size > 2 * 1024 * 1024) {
        setSizeError('Size of image should not exceed 2MB');
      } else {
        setImagePreview(null); // Clear any previously set image
        setSizeError('');
      }
    } else {
      setImagePreview(null); // Clear if no file is selected
      setImage(null);
    }
  };


  useEffect(() => {
    GetComplaintTypeLookUpListData();
  }, []);

  useEffect(() => {
    GetDeviceIMEILookUpListData(complaintObj?.customerID);
    console.log('Device IMEI List:', deviceIMEILookupList);
  }, [complaintObj?.customerID]);

  useEffect(() => {
    GetCustomerLookUpListData(user.companyKeyID);
  }, []);

  const closeAll = () => {
    setInitialData();
    setShowSuccessModal(false);
    handleClose();
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={() => {
        handleClose();
      }}
      style={{ zIndex: 1300 }}
      backdrop="static"
      keyboard={false}
      centered // Adjust the z-index as needed
    >
      <Modal.Header closeButton>
        <Modal.Title>{modelRequestData.Action != null ? 'Update Complaint' : 'Add Complaint '}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-12 col-md-6 mb-2">
            <div>
              <label htmlFor="customerName" className="form-label">
                Select Customer
                <span style={{ color: 'red' }}>*</span>
              </label>
              <div>
                <Select
                  options={customerLookupList}
                  value={customerLookupList.find((item) => item.value === complaintObj.customerID) || null} // Correctly maps the selected value
                  onChange={handleCustomerChange}
                  placeholder="Select Customer"
                />
              </div>
              {error & (complaintObj.customerID === null || complaintObj.customerID === undefined || complaintObj.customerID === '') ? (
                <span className="errorMassage">{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className="col-12 col-md-6 mb-2">
            <div>
              <label htmlFor="customerName" className="form-label">
                Select Device IMEI No
                <span style={{ color: 'red' }}>*</span>
              </label>
              <div>
                <Select
                  options={deviceIMEILookupList}
                  placeholder="Select Device IMEI No"
                  value={deviceIMEILookupList.find((option) => option.value === complaintObj.deviceIMEI) || null} // Find the selected option
                  onChange={(selectedOption) =>
                    setComplaintObj((prev) => ({
                      ...prev,
                      deviceIMEI: selectedOption ? selectedOption.value : null,
                      installationID: selectedOption ? selectedOption.installationID : null,
                    }))
                  }
                />
              </div>
              {error & (complaintObj.deviceIMEI === null || complaintObj.deviceIMEI === undefined || complaintObj.deviceIMEI === '') ? (
                <span className="errorMassage">{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className="col-12 col-md-6 mb-2">
            <div>
              <label htmlFor="customerName" className="form-label">
                Select Complaint Type
                <span style={{ color: 'red' }}>*</span>
              </label>
              <div>
                <Select
                  options={complaintTypeLookupList}
                  value={complaintTypeLookupList.find((option) => option.value === complaintObj.complaintID) || null || ''} // Find the selected option
                  onChange={(selectedOption) =>
                    setComplaintObj((prev) => ({
                      ...prev,
                      complaintID: selectedOption ? selectedOption.value : null
                    }))
                  }
                  placeholder="Select Complaint Type"
                />
              </div>
              {error & (complaintObj.complaintID === null || complaintObj.complaintID === undefined || complaintObj.complaintID === '') ? (
                <span className="errorMassage">{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className="col-12 col-md-6 mb-2">
            <label for="remark" className="form-label">
              Remark
              <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Remark"
              className="form-control"
              maxLength={150}
              id="Remark"
              value={complaintObj.remark || ''}
              onChange={(e) => {
                let inputValue = e.target.value;

                // Remove leading space
                if (inputValue.startsWith(' ')) {
                  inputValue = inputValue.trimStart();
                }

                // Optionally, remove invalid characters (only if needed)
                // inputValue = inputValue.replace(/[^a-zA-Z0-9\s.,-_@#&]/g, '');

                // Capitalize first letter of each word
                const capitalized = inputValue
                  .split(' ')
                  .map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                  )
                  .join(' ');

                setComplaintObj((prev) => ({
                  ...prev,
                  remark: capitalized
                }));
              }}
            />

            {error & (complaintObj.remark === null || complaintObj.remark === undefined || complaintObj.remark === '') ? (
              <span className="errorMassage">{ERROR_MESSAGES}</span>
            ) : (
              ''
            )}
          </div>
          <div className="col-12 col-md-6 mb-2">
            <label htmlFor="paymentImg" className="form-label">
              Upload Image
              <span style={{ color: 'red' }}>*</span>
            </label>
            <div
              className="d-flex align-items-center justify-content-center position-relative border border-secondary rounded"
              style={{ width: '100%', height: '12rem' }}
            >
              {/* Add button with icon */}
              {imagePreview ? (
                <>
                  {/* Remove Button */}
                  <button
                    onClick={handleRemoveImage}
                    className="btn btn-link position-absolute"
                    style={{
                      top: '5px',
                      right: '5px',
                      padding: '0',
                      fontSize: '20px',
                      color: 'black'
                    }}
                  >
                    <i class="fas fa-times"></i>
                  </button>
                  {/* Image Preview */}
                  <img
                    src={imagePreview}
                    alt="Payment Screenshot Preview"
                    style={{
                      maxWidth: '100%', // Ensures the image does not exceed container width
                      maxHeight: '100%', // Ensures the image does not exceed container height
                      objectFit: 'contain', // Ensures the entire image is visible without cropping
                      borderRadius: '8px' // Matches rounded styling
                    }}
                    className="rounded"
                  />
                </>
              ) : (
                /* Upload Button with Icon */
                <label
                  htmlFor="paymentImg"
                  style={{ color: '#6c757d' }}
                  className="d-flex flex-column align-items-center justify-content-center text-center cursor-pointer"
                >
                  <i style={{ fontSize: '2rem', color: '#6c757d' }} class="fa-solid fa-plus"></i>

                  <span className="d-block mt-2">Upload Image</span>
                </label>
              )}
              <input type="file" accept="image/jpeg, image/png" id="paymentImg" style={{ display: 'none' }} onChange={handleImageChange} />
            </div>

            {sizeError ? (
              <span>{sizeError}</span>
            ) : !image ? (
              <span style={{ display: 'block' }}>Supported file types are .jpg, .jpeg, .png up to a file size of 2MB.</span>
            ) : (
              ''
            )}

            {error && (image === null || image === '' || image === undefined) && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            handleClose();
            setInitialData();
          }}
        >
          Close
        </Button>
        <Button variant="primary" onClick={handlAddComplaintBtnClick}>
          Submit
        </Button>
      </Modal.Footer>
      <SuccessPopupModal
        show={showSuccessModel}
        onHide={() => closeAll()}
        setShowSuccessModal={setShowSuccessModal}
        actionMassage={actionMassage}
        modelAction={modelAction}
      />
    </Modal>
  );
};

export default AddUpdateComplaintModal;
