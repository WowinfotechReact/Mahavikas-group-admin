import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { GetCustomerLookupList, } from 'services/CustomerStaff/CustomerStaffApi';
import { ConfigContext } from 'context/ConfigContext';
import { AddUpdateVehicleApi, GetVehicleModel } from 'services/Vehicle/VehicleApi';
import { GetVehicleTypeLookupList } from 'services/Master Crud/MasterVehicleTypeApi';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import AddUpdateCustomerModal from 'views/Customer/AddUpdateCustomerModal';

const AddUpdateVehicleModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const [customerOption, setCustomerOption] = useState([]);

  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const { user, setLoader, companyID } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [vehicleTypeOption, setVehicleTypeOption] = useState([]);

  const [vehicleObj, setVehicleObj] = useState({
    userKeyID: null,
    vehicleKeyID: null,
    customerID: null,
    vehicleNumber: null,
    vehicleTypeID: null,
    rcBookFileImageURL: null,
    vehicleNumberPlateImageURL: null,
    vehicleFrontViewImageURL: null,
    vehicleSideViewImageURL: null
  });

  // Vehicle Number Plate
  const [vehicleNoPlateImage, setVehicleNoPlateImage] = useState(null);
  const [vehicleNoPlateImagePreview, setVehicleNoPlateImagePreview] = useState('');
  const [vehicleNoPlateSizeError, setVehicleNoPlateSizeError] = useState();

  const [uploadVehicleNoPlateImageObj, setUploadVehicleNoPlateImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: vehicleObj.vehicleNoPlateUrl,
    moduleName: 'Vehicle-Crud'
  });

  // RC Book Image
  const [rcBookImage, setRcBookImage] = useState(null);
  const [rcBookImagePreview, setRcBookImagePreview] = useState('');
  const [rcBookSizeError, setRcBookSizeError] = useState();

  const [uploadRcBookImageObj, setUploadRcBookImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: vehicleObj.rcBookUrl,
    moduleName: 'Vehicle-Crud'
  });

  // Vehicle Front View Image
  const [vehicleFrontViewImage, setVehicleFrontViewImage] = useState(null);
  const [vehicleFrontViewImagePreview, setVehicleFrontViewImagePreview] = useState('');
  const [vehicleFrontSizeError, setVehicleFrontSizeError] = useState();

  const [uploadVehicleFrontViewImageObj, setUploadVehicleFrontViewImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: vehicleObj.vehicleFrontViewUrl,
    moduleName: 'Vehicle-Crud'
  });

  // Vehicle Back View Image
  const [vehicleBackViewImage, setVehicleBackViewImage] = useState(null);
  const [vehicleBackViewImagePreview, setVehicleBackViewImagePreview] = useState('');
  const [vehicleBackSizeError, setVehicleBackSizeError] = useState();

  const [uploadVehicleBackViewImageObj, setUploadVehicleBackViewImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: vehicleObj.vehicleBackViewUrl,
    moduleName: 'Vehicle-Crud'
  });

  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.vehicleKeyID !== null) {
        GetMasterVehicleTypeModalData(modelRequestData?.vehicleKeyID);
      }
    }
  }, [modelRequestData?.Action]);
  useEffect(() => {
    GetCustomerLookupListData();
  }, [modelRequestData]);


  useEffect(() => {
    GetVehicleTypeLookupListData();
  }, [modelRequestData?.Action]);

  const GetVehicleTypeLookupListData = async () => {
    try {
      const response = await GetVehicleTypeLookupList(); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const vehicleTypeLookupList = response?.data?.responseData?.data || [];

        const formattedIvrList = vehicleTypeLookupList.map((vehicleTypeItem) => ({
          value: vehicleTypeItem.vehicleTypeID,
          label: vehicleTypeItem.vehicleTypeName
        }));

        setVehicleTypeOption(formattedIvrList); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch vehicle Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching vehicle Type lookup list:', error);
    }
  };

  const GetMasterVehicleTypeModalData = async (id) => {
    if (id === undefined) {
      return;
    }

    try {
      const data = await GetVehicleModel(id);
      if (data?.data?.statusCode === 200) {
        const ModelData = data.data.responseData.data; // Assuming data is an array

        setVehicleObj({
          ...vehicleObj,

          userKeyID: ModelData?.userKeyID,
          vehicleKeyID: ModelData?.vehicleKeyID,

          customerID: ModelData?.customerID,
          vehicleNumber: ModelData?.vehicleNumber,
          vehicleTypeID: ModelData?.vehicleTypeID,
          rcBookFileImageURL: ModelData?.rcBookFileImageURL,
          vehicleNumberPlateImageURL: ModelData?.vehicleNumberPlateImageURL,
          vehicleFrontViewImageURL: ModelData?.vehicleFrontViewImageURL,
          vehicleSideViewImageURL: ModelData?.vehicleSideViewImageURL
        });
        // rc book
        setRcBookImagePreview(ModelData?.rcBookFileImageURL);
        setRcBookImage(ModelData?.rcBookFileImageURL);
        // back or side view
        setVehicleBackViewImage(ModelData?.vehicleSideViewImageURL);
        setVehicleBackViewImagePreview(ModelData?.vehicleSideViewImageURL);

        setVehicleFrontViewImage(ModelData?.vehicleFrontViewImageURL);
        setVehicleFrontViewImagePreview(ModelData?.vehicleFrontViewImageURL);

        setVehicleNoPlateImage(ModelData?.vehicleNumberPlateImageURL);
        setVehicleNoPlateImagePreview(ModelData?.vehicleNumberPlateImageURL);
      } else {
        // Handle non-200 status codes if necessary
        console.error('Error fetching data: ', data?.data?.statusCode);
      }
    } catch (error) {
      console.error('Error in GetVehicleTypeModalData: ', error);
    }
  };

  const AddVehicleBtnClick = async () => {
    let isValid = false;
    let vehicleNoPlateUrl = null;
    let rcBookUrl = null;
    let vehicleFrontViewUrl = null;
    let vehicleBackViewUrl = null;

    if (
      vehicleObj.vehicleNumber === null ||
      vehicleObj.vehicleNumber === undefined ||
      vehicleObj.vehicleNumber === '' ||
      vehicleObj.customerID === null ||
      vehicleObj.customerID === undefined ||
      vehicleObj.customerID === '' ||
      vehicleNoPlateImage === '' ||
      vehicleNoPlateImage === null ||
      vehicleNoPlateImage === undefined ||
      rcBookImage === '' ||
      rcBookImage === null ||
      rcBookImage === undefined ||
      vehicleFrontViewImage === '' ||
      vehicleFrontViewImage === null ||
      vehicleFrontViewImage === undefined ||
      vehicleBackViewImage === '' ||
      vehicleBackViewImage === null ||
      vehicleBackViewImage === undefined ||
      vehicleObj.vehicleTypeID === undefined ||
      vehicleObj.vehicleTypeID === '' ||
      vehicleObj.vehicleTypeID === null
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }






    const apiParam = {
      userKeyID: user.userKeyID,
      vehicleKeyID: modelRequestData?.vehicleKeyID,
      vehicleNumber: vehicleObj.vehicleNumber,
      customerID: vehicleObj.customerID,
      vehicleTypeID: vehicleObj.vehicleTypeID,
      rcBookFileImageURL: rcBookUrl, //correct
      vehicleNumberPlateImageURL: vehicleNoPlateUrl, //correct

      vehicleFrontViewImageURL: vehicleFrontViewUrl, //correct
      vehicleSideViewImageURL: vehicleBackViewUrl, //correct
      companyKeyID: companyID
    };



    if (!isValid) {
      AddUpdateVehicleData(apiParam);
    }
  };

  const AddUpdateVehicleData = async (apiParam) => {
    try {
      let url = '/AddUpdateVehicle'; // Default URL for Adding Data

      const response = await AddUpdateVehicleApi(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Vehicle Added Successfully!'
              : ' Vehicle Updated Successfully!'
          ); //Do not change this naming convention

          setIsAddUpdateActionDone(true);
        } else {
          setErrorMessage(response?.response?.data?.errorMessage);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeAllModal = () => {
    onHide();
    setShowSuccessModal(false);
  };

  const GetCustomerLookupListData = async () => {
    try {
      const response = await GetCustomerLookupList(companyID); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const customerLookupList = response?.data?.responseData?.data;

        const formattedCustomerList = customerLookupList.map((customerItem) => ({
          value: customerItem.customerID,
          label: customerItem.name,
          customerKeyID: customerItem.customerKeyID
        }));

        setCustomerOption(formattedCustomerList); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch Customer lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching Customer lookup list:', error);
    }
  };

  // vehicle No Plate
  const handleVehicleNoPlateImageChange = (e) => {
    // debugger;
    const file = e.target.files[0]; // Get the file object
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size <= 2 * 1024 * 1024) {
        setVehicleNoPlateSizeError('');
        setVehicleNoPlateImage(file);

        const reader = new FileReader();
        reader.onload = (event) => {
          setVehicleNoPlateImagePreview(event.target.result); // Set the image data URL
        };
        reader.readAsDataURL(file); // Convert file to a data URL
      } else if (file.size > 2 * 1024 * 1024) {
        setVehicleNoPlateSizeError('Size of image should not exceed 2MB');
      } else {
        setVehicleNoPlateImagePreview(null);
        setVehicleNoPlateSizeError('');
      }
    } else {
      setVehicleNoPlateImagePreview(null); // Clear if no file is selected
      setVehicleNoPlateImage(null);
    }
  };

  // Rc Book Image

  const handleRcBookImageChange = (e) => {
    const file = e.target.files[0]; // Get the file object
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size <= 2 * 1024 * 1024) {
        setRcBookSizeError('');
        setRcBookImage(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          setRcBookImagePreview(event.target.result); // Set the image data URL
        };
        reader.readAsDataURL(file); // Convert file to a data URL
      } else if (file.size > 2 * 1024 * 1024) {
        setRcBookSizeError('Size of image should not exceed 2MB');
      } else {
        setRcBookImagePreview(null);
        setRcBookSizeError('');
      }
    } else {
      setRcBookImagePreview(null); // Clear if no file is selected
      setRcBookImage(null);
    }
  };
  // vehicle Front View

  const handleVehicleFrontViewImageChange = (e) => {
    const file = e.target.files[0]; // Get the file object
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size <= 2 * 1024 * 1024) {
        setVehicleFrontSizeError('');
        setVehicleFrontViewImage(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          setVehicleFrontViewImagePreview(event.target.result); // Set the image data URL
        };
        reader.readAsDataURL(file); // Convert file to a data URL
      } else if (file.size > 2 * 1024 * 1024) {
        setVehicleFrontSizeError('Size of image should not exceed 2MB');
      } else {
        setVehicleFrontViewImagePreview(null);
        setVehicleFrontSizeError('');
      }
    } else {
      setVehicleFrontViewImagePreview(null); // Clear if no file is selected
      setVehicleFrontViewImage(null);
    }
  };

  // vehicle Back View

  const handleVehicleBackViewImageChange = (e) => {
    const file = e.target.files[0]; // Get the file object
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size <= 2 * 1024 * 1024) {
        setVehicleBackSizeError('');
        setVehicleBackViewImage(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          setVehicleBackViewImagePreview(event.target.result); // Set the image data URL
        };
        reader.readAsDataURL(file); // Convert file to a data URL
      } else if (file.size > 2 * 1024 * 1024) {
        setVehicleBackSizeError('Size of image should not exceed 2MB');
      } else {
        setVehicleBackViewImagePreview(null);
        setVehicleBackSizeError('');
      }
    } else {
      setVehicleBackViewImagePreview(null); // Clear if no file is selected
      setVehicleBackViewImage(null);
    }
  };

  const handleRemoveVehicleNoPlateImage = () => {
    setVehicleNoPlateImagePreview(null);
    setVehicleNoPlateImage(null);
    setVehicleNoPlateSizeError('');
  };
  const handleRemoveRcBookImage = () => {
    setRcBookImagePreview(null);
    setRcBookImage(null);
    setRcBookSizeError('');
  };
  const handleRemoveVehicleFrontViewImage = () => {
    setVehicleFrontViewImagePreview(null);
    setVehicleFrontViewImage(null);
    setVehicleFrontSizeError(null);
  };

  const handleRemoveVehicleBackViewImage = () => {
    setVehicleBackViewImagePreview(null);
    setVehicleBackViewImage(null);
    setVehicleBackSizeError(null);
  };

  const handleVehicleTypeChange = (selectedOption) => {
    setVehicleObj((prev) => ({
      ...prev,
      vehicleTypeID: selectedOption ? selectedOption.value : ''
    }));
  };
  const AddCustomerForInstallation = () => [
    setShowCustomerModal(true)
  ]

  return (
    <>
      <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {modelRequestData?.Action !== null ? 'Edit Vehicle' : modelRequestData?.Action === null ? 'Add Vehicle' : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <div>
                  <div className="d-flex justify-content-between align-items-center">

                    <label htmlFor="customerId" className="form-label">
                      Select Customer
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    {/* <Tooltip title="Add Customer">
                      <Link onClick={AddCustomerForInstallation} style={{ whiteSpace: 'nowrap' }}>
                        + Add Customer
                      </Link>
                    </Tooltip> */}
                  </div>
                  <Select
                    menuPosition="fixed"
                    menuPlacement="auto"
                    options={customerOption}
                    value={customerOption.find((option) => option.value === vehicleObj.customerID)} // Find the selected option
                    onChange={(selectedOption) =>
                      setVehicleObj((prev) => ({
                        ...prev,
                        customerID: selectedOption ? selectedOption.value : null
                      }))
                    }
                    placeholder="Select a Customer"
                  />
                  {error && (vehicleObj.customerID === null || vehicleObj.customerID === undefined || vehicleObj.customerID === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              </div>

              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="vehicleNumber" className="form-label">
                    Vehicle No.
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    maxLength={10}
                    type="text"
                    className="form-control"
                    id="vehicleNumber"
                    placeholder="Enter Vehicle No."
                    aria-describedby="Employee"
                    value={vehicleObj.vehicleNumber}
                    onChange={(e) => {
                      let InputValue = e.target.value.toUpperCase(); // Convert to uppercase
                      const updatedValue = InputValue.replace(/[^a-zA-Z0-9]/g, ''); // Removes everything except alphanumeric characters

                      // Auto-format the input
                      let formattedValue = '';
                      if (updatedValue.length > 0) {
                        formattedValue += updatedValue.substring(0, 2); // First two characters (state code)
                      }
                      if (updatedValue.length > 2) {
                        formattedValue += updatedValue.substring(2, 4); // Next two digits (district code)
                      }
                      if (updatedValue.length > 4) {
                        formattedValue += updatedValue.substring(4, 6); // Next two characters (series)
                      }
                      if (updatedValue.length > 6) {
                        formattedValue += updatedValue.substring(6, 10); // Last four digits (unique number)
                      }

                      // Validate the format
                      const isValid = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/.test(formattedValue);

                      setVehicleObj((prev) => ({
                        ...prev,
                        vehicleNumber: formattedValue,
                        isVehicleNumberValid: isValid // You can add this field to your state to track validity
                      }));
                    }}
                  />

                  {error &&
                    (vehicleObj.vehicleNumber === null || vehicleObj.vehicleNumber === undefined || vehicleObj.vehicleNumber === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="vehicleNumber" className="form-label">
                    Select Vehicle Type
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Select
                    placeholder="Select Vehicle Type"
                    options={vehicleTypeOption}
                    value={vehicleTypeOption.filter((item) => item.value === vehicleObj.vehicleTypeID)}
                    onChange={handleVehicleTypeChange}
                    menuPosition="fixed"
                  />
                  {error &&
                    (vehicleObj.vehicleTypeID === null || vehicleObj.vehicleTypeID === undefined || vehicleObj.vehicleTypeID === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="aadharFrontImg" className="form-label">
                    Vehicle Number Plate
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div
                    className="d-flex align-items-center justify-content-center position-relative border border-secondary rounded"
                    style={{ width: '100%', height: '12rem' }}
                  >
                    {vehicleNoPlateImagePreview ? (
                      <>
                        <button
                          onClick={handleRemoveVehicleNoPlateImage}
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
                        <img
                          className="w-100 h-100 rounded  border"
                          style={{ objectFit: 'contain' }}
                          alt="Aadhaar Front Preview"
                          src={vehicleNoPlateImagePreview}
                        />
                      </>
                    ) : (
                      <label
                        htmlFor="aadharFrontImg"
                        style={{ color: '#6c757d' }}
                        className="d-flex flex-column align-items-center justify-content-center text-center cursor-pointer"
                      >
                        <i style={{ fontSize: '2rem', color: '#6c757d' }} class="fa-solid fa-plus"></i>

                        <span className="d-block mt-2">Upload Image</span>
                      </label>
                    )}
                    <input
                      type="file"
                      id="aadharFrontImg"
                      accept="image/jpeg, image/png"
                      style={{ display: 'none' }}
                      onChange={handleVehicleNoPlateImageChange}
                    />
                  </div>
                </div>

                {error && (vehicleNoPlateImage === null || vehicleNoPlateImage === '' || vehicleNoPlateImage === undefined) && (
                  <div style={{ color: 'red' }}>{ERROR_MESSAGES}</div>
                )}

                {vehicleNoPlateSizeError ? (
                  <div style={{ color: 'red' }}>{vehicleNoPlateSizeError}</div>
                ) : !vehicleNoPlateImage ? (
                  <small>Supported:  (Max 2MB)</small>
                ) : (
                  ''
                )}
              </div>

              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="aadharFrontImg" className="form-label">
                    Rc Book
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div
                    className="d-flex align-items-center justify-content-center position-relative border border-secondary rounded"
                    style={{ width: '100%', height: '12rem' }}
                  >
                    {rcBookImagePreview ? (
                      <>
                        <button
                          onClick={handleRemoveRcBookImage}
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
                        <img
                          className="w-100 h-100 rounded  border"
                          style={{ objectFit: 'contain' }}
                          alt="Aadhaar Front Preview"
                          src={rcBookImagePreview}
                        />
                      </>
                    ) : (
                      <label
                        htmlFor="RcBookImg"
                        style={{ color: '#6c757d' }}
                        className="d-flex flex-column align-items-center justify-content-center text-center cursor-pointer"
                      >
                        <i style={{ fontSize: '2rem', color: '#6c757d' }} class="fa-solid fa-plus"></i>

                        <span className="d-block mt-2">Upload Image</span>
                      </label>
                    )}
                    <input
                      type="file"
                      id="RcBookImg"
                      accept="image/jpeg, image/png"
                      style={{ display: 'none' }}
                      onChange={handleRcBookImageChange}
                    />
                  </div>
                </div>

                {error && (rcBookImage === null || rcBookImage === '' || rcBookImage === undefined) && (
                  <div style={{ color: 'red' }}>{ERROR_MESSAGES}</div>
                )}

                {rcBookSizeError ? <div style={{ color: 'red' }}>{rcBookSizeError}</div> : !rcBookImage ? <small>Supported:  (Max 2MB)</small> : ''}
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="vehicleFrontView" className="form-label">
                    Vehicle Front View Image
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div
                    className="d-flex align-items-center justify-content-center position-relative border border-secondary rounded"
                    style={{ width: '100%', height: '12rem' }}
                  >
                    {vehicleFrontViewImagePreview ? (
                      <>
                        <button
                          onClick={handleRemoveVehicleFrontViewImage}
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
                        <img
                          className="w-100 h-100 rounded  border"
                          style={{ objectFit: 'contain' }}
                          alt="Aadhaar Front Preview"
                          // src={rcBookImagePreview}
                          src={vehicleFrontViewImagePreview}
                        />
                      </>
                    ) : (
                      <label
                        htmlFor="vehicleFrontView"
                        style={{ color: '#6c757d' }}
                        className="d-flex flex-column align-items-center justify-content-center text-center cursor-pointer"
                      >
                        <i style={{ fontSize: '2rem', color: '#6c757d' }} class="fa-solid fa-plus"></i>

                        <span className="d-block mt-2">Upload Image</span>
                      </label>
                    )}
                    <input
                      type="file"
                      id="vehicleFrontView"
                      accept="image/jpeg, image/png"
                      style={{ display: 'none' }}
                      onChange={handleVehicleFrontViewImageChange}
                    />
                  </div>
                </div>

                {error && (vehicleFrontViewImage === null || vehicleFrontViewImage === '' || vehicleFrontViewImage === undefined) && (
                  <div style={{ color: 'red' }}>{ERROR_MESSAGES}</div>
                )}

                {vehicleFrontSizeError ? (
                  <div style={{ color: 'red' }}>{vehicleFrontSizeError}</div>
                ) : !vehicleFrontViewImage ? (
                  <small>Supported:  (Max 2MB)</small>
                ) : (
                  ''
                )}
              </div>
              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="vehicleBackView" className="form-label">
                    Vehicle Back View Image
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div
                    className="d-flex align-items-center justify-content-center position-relative border border-secondary rounded"
                    style={{ width: '100%', height: '12rem' }}
                  >
                    {vehicleBackViewImagePreview ? (
                      <>
                        <button
                          onClick={handleRemoveVehicleBackViewImage}
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
                        <img
                          className="w-100 h-100 rounded  border"
                          style={{ objectFit: 'contain' }}
                          alt="Aadhaar Front Preview"
                          src={vehicleBackViewImagePreview}
                        />
                      </>
                    ) : (
                      <label
                        htmlFor="vehicleBackView"
                        style={{ color: '#6c757d' }}
                        className="d-flex flex-column align-items-center justify-content-center text-center cursor-pointer"
                      >
                        <i style={{ fontSize: '2rem', color: '#6c757d' }} class="fa-solid fa-plus"></i>

                        <span className="d-block mt-2">Upload Image</span>
                      </label>
                    )}
                    <input
                      type="file"
                      id="vehicleBackView"
                      accept="image/jpeg, image/png"
                      style={{ display: 'none' }}
                      onChange={handleVehicleBackViewImageChange}
                    />
                  </div>
                </div>

                {error && (vehicleBackViewImage === null || vehicleBackViewImage === '' || vehicleBackViewImage === undefined) && (
                  <div style={{ color: 'red' }}>{ERROR_MESSAGES}</div>
                )}

                {vehicleBackSizeError ? (
                  <div style={{ color: 'red' }}>{vehicleBackSizeError}</div>
                ) : !vehicleBackViewImage ? (
                  <small>Supported:  (Max 2MB)</small>
                ) : (
                  ''
                )}
              </div>
            </div>
            <span style={{ color: 'red' }}>{errorMessage}</span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button type="submit" className="btn btn-primary text-center" onClick={() => AddVehicleBtnClick()}>
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
      <AddUpdateCustomerModal

        modelRequestData={modelRequestData}
        onHide={() => setShowCustomerModal(false)}
        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        show={showCustomerModal}

      />
    </>
  );
};

export default AddUpdateVehicleModal;
