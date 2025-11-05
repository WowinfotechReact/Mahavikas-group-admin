import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import { GetMachineModel } from 'services/Gps-Tracking/GpsTrackingApi';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import { GetStateLookupList } from 'services/Master Crud/MasterStateApi';
import { GetTalukaLookupList } from 'services/Master Crud/MasterTalukaApi';
import { GetDistrictLookupList } from 'services/Master Crud/MasterDistrictApi';
import { GetCompanyLookupList } from 'services/Master Crud/MasterCompany';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { GetVillageLookupList } from 'services/Master Crud/MasterVillageApi';
import AddUpdateVillageModal from 'views/Master Crud/Master Village/AddUpdateVillageModal';
import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { AddUpdateCustomer, GetCustomerModel } from 'services/CustomerStaff/CustomerStaffApi';

const AddUpdateCustomerModal = ({ show, onHide, setIsAddUpdateActionDone, isAddUpdateActionDone, modelRequestData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user, companyID } = useContext(ConfigContext);
  console.log(user.roleTypeID, 'doushadiusabdiusa');
  const [sendToModelData, setSendToModelData] = useState({
    Action: null,
    stateID: null,
    villageID: null,
    talukaID: null,
    districtID: null
  });
  const [stateOption, setStateOption] = useState([]);
  const [companyOption, setCompanyOption] = useState([]);
  const [districtOption, setDistrictOption] = useState([]);
  const [talukaOption, setTalukaOption] = useState([]);
  const [villageOption, setVillageOption] = useState([]);
  const [showVillageModal, setShowVillageModal] = useState(false);

  const [customerObj, setCustomerObj] = useState({
    name: null,
    address: null,
    emailID: null,
    mobileNo: null,
    aadharNo: null,
    adharFrontImageURL: null,
    adharBackImageURL: null,
    userKeyID: null,
    customerKeyID: null,
    talukaID: null,
    adharNumber: null,
    stateID: null,
    companyID: null,
    districtID: null,
    villageID: null
  });

  // front addhar img
  const [aadhaarFrontImage, setAadhaarFrontImage] = useState(null);
  const [aadhaarFrontImagePreview, setAadhaarFrontImagePreview] = useState('');
  const [aadhaarFrontSizeError, setAadhaarFrontSizeError] = useState();

  const [uploadAadhaarFrontImageObj, setUploadAadhaarFrontImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: customerObj.AadhaarFrontUrl,
    moduleName: 'Customer_Staff'
  });
  console.log(customerObj.AadhaarFrontUrl, 'dsadsujahdsad9823iods');

  // back aadhar img
  const [aadhaarBackImage, setAadhaarBackImage] = useState(null);
  const [aadhaarBackImagePreview, setAadhaarBackImagePreview] = useState('');
  const [aadhaarBackSizeError, setAadhaarBackSizeError] = useState();

  const [uploadAadhaarBackImageObj, setUploadAadhaarBackImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: customerObj.AadhaarBackUrl,
    moduleName: 'Customer_Staff'
  });

  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.customerKeyID !== null) {
        GetCustomerModalData(modelRequestData.customerKeyID);
      }
    }
  }, [modelRequestData?.Action]);

  // useEffect(() => {
  //   GetStateLookupListData();
  // }, [modelRequestData?.Action]);
  // useEffect(() => {
  //   GetCompanyLookupListData();
  // }, [modelRequestData?.Action]);

  useEffect(() => {
    if (customerObj.stateID !== null && customerObj.stateID !== undefined) {
      GetDistrictLookupListData();
    }
  }, [customerObj.stateID]);

  useEffect(() => {
    if (customerObj.districtID !== null && customerObj.districtID !== undefined) {
      GetTalukaLookupListData();
    }
  }, [customerObj.districtID]);
  useEffect(() => {
    if (customerObj.talukaID !== null && customerObj.talukaID !== undefined) {
      GetVillageLookupListData();
    }
  }, [customerObj.talukaID, isAddUpdateActionDone]);


  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const AddCustomerBtnClick = async () => {
    let isValid = false;
    let AadhaarFrontUrl = null;
    let AadhaarBackUrl = null;

    if (
      // machine  name
      customerObj.name === null ||
      customerObj.name === undefined ||
      customerObj.name === '' ||
      // machine price
      customerObj.address === null ||
      customerObj.address === undefined ||
      customerObj.address === '' ||
      customerObj.emailID === null ||
      customerObj.emailID === undefined ||
      customerObj.emailID === '' ||
      !emailRegex.test(customerObj.emailID) ||
      customerObj.mobileNo === null ||
      customerObj.mobileNo === undefined ||
      customerObj.mobileNo === '' ||
      customerObj.mobileNo?.length < 10 ||
      customerObj.adharNumber === null ||
      customerObj.adharNumber === undefined ||
      customerObj.adharNumber === '' ||
      customerObj.adharNumber?.length < 12 ||
      aadhaarFrontImage === undefined ||
      aadhaarFrontImage === null ||
      aadhaarFrontImage === '' ||
      aadhaarBackImage === undefined ||
      aadhaarBackImage === null ||
      aadhaarBackImage === '' ||
      // customerObj.companyID === undefined ||
      // customerObj.companyID === '' ||
      // customerObj.companyID === null ||
      customerObj.talukaID === undefined ||
      customerObj.talukaID === null ||
      customerObj.talukaID === '' ||
      customerObj.stateID === '' ||
      customerObj.stateID === '' ||
      customerObj.stateID === '' ||
      customerObj.districtID === '' ||
      customerObj.districtID === '' ||
      customerObj.districtID === '' ||
      customerObj.villageID === '' ||
      customerObj.villageID === '' ||
      customerObj.villageID === ''
    ) {
      setErrors(true);
      isValid = true;
    } else if (aadhaarFrontImage?.size > 2 * 1024 * 1024) {
      setErrors(true);
      isValid = true;
    } else if (aadhaarBackImage?.size > 2 * 1024 * 1024) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    console.log(AadhaarFrontUrl, 'dsadsad43333ds');
    console.log(aadhaarBackImage, 'dsadsad43333ds');

    const apiParam = {
      userKeyID: user.userKeyID,
      customerKeyID: customerObj.customerKeyID,
      name: customerObj.name,
      address: customerObj.address,
      mobileNo: customerObj.mobileNo,
      adharFrontImageURL: AadhaarFrontUrl,
      adharBackImageURL: AadhaarBackUrl,
      districtID: customerObj.districtID,
      stateID: customerObj.stateID,
      villageID: customerObj.villageID,
      talukaID: customerObj.talukaID,
      companyKeyID: companyID,
      adharNumber: customerObj.adharNumber
    };
    if (!isValid) {
      AddUpdateCustomerData(apiParam);
    }
  };

  const AddUpdateCustomerData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateCustomer'; // Default URL for Adding Data

      const response = await AddUpdateCustomer(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Customer Added Successfully!'
              : ' Customer Updated Successfully!'
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

  const GetCustomerModalData = async (id) => {
    if (id === undefined) {
      return;
    }

    setLoader(true);
    try {
      const data = await GetCustomerModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = data.data.responseData.data; // Assuming data is an array
        let adharNumber = ModelData.adharNumber || ''; // Ensure it doesn't crash if undefined/null
        let formattedAdharNumber = adharNumber.replace(/(\d{4})(?=\d)/g, '$1-');
        setCustomerObj({
          ...customerObj,
          name: ModelData.name,
          address: ModelData.address,
          mobileNo: ModelData.mobileNo,
          aadharNo: ModelData.aadharNo,
          companyID: ModelData.companyID,
          emailID: ModelData.emailID,
          adharNumber, // Store raw number
          adharNumberFormatted: formattedAdharNumber,
          // adharNumberFormatted: ModelData.adharNumber,
          stateID: ModelData.stateID,
          districtID: ModelData.districtID,
          villageID: ModelData.villageID,
          customerKeyID: ModelData.customerKeyID,
          adharFrontImageURL: ModelData.adharFrontImageURL,
          adharBackImageURL: ModelData.adharBackImageURL
        });
        setAadhaarBackImage(ModelData.adharBackImageURL);
        setAadhaarBackImagePreview(ModelData.adharBackImageURL);
        setAadhaarFrontImage(ModelData.adharFrontImageURL);
        setAadhaarFrontImagePreview(ModelData.adharFrontImageURL);
      } else {
        setLoader(false);
        // Handle non-200 status codes if necessary
        console.error('Error fetching data: ', data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error in Customer : ', error);
    }
  };
  const closeAllModal = () => {
    onHide();
    setShowSuccessModal(false);
  };

  const handleAadhaarFrontImageChange = (e) => {
    // debugger;
    const file = e.target.files[0]; // Get the file object
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 2 * 1024 * 1024) {
        setAadhaarFrontSizeError('');
        setAadhaarFrontImage(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          setAadhaarFrontImagePreview(event.target.result); // Set the image data URL
        };
        reader.readAsDataURL(file); // Convert file to a data URL
      } else if (file.size > 2 * 1024 * 1024) {
        setAadhaarFrontSizeError('Size of image should not exceed 2MB');
      } else {
        setAadhaarFrontImagePreview(null); // Clear any previously set image
        setAadhaarFrontSizeError('');
      }
    } else {
      setAadhaarFrontImagePreview(null); // Clear if no file is selected
      setAadhaarFrontImage(null);
    }
  };
  const handleAadhaarBackImageChange = (e) => {
    // debugger;
    const file = e.target.files[0]; // Get the file object
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size <= 2 * 1024 * 1024) {
        setAadhaarBackSizeError('');
        setAadhaarBackImage(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          setAadhaarBackImagePreview(event.target.result); // Set the image data URL
        };
        reader.readAsDataURL(file); // Convert file to a data URL
      } else if (file.size > 2 * 1024 * 1024) {
        setAadhaarBackSizeError('Size of image should not exceed 2MB');
      } else {
        setAadhaarBackImagePreview(null); // Clear any previously set image
        setAadhaarBackSizeError('');
      }
    } else {
      setAadhaarBackImagePreview(null); // Clear if no file is selected
      setAadhaarBackImage(null);
    }
  };

  const handleRemoveAadhaarFrontImage = () => {
    setAadhaarFrontImagePreview(null);
    setAadhaarFrontImage(null);
  };
  const handleRemoveAadhaarBackImage = () => {
    setAadhaarBackImagePreview(null);
    setAadhaarBackImage(null);
  };

  const GetDistrictLookupListData = async () => {
    if (customerObj.stateID === null) return;

    try {
      let response = await GetDistrictLookupList(customerObj?.stateID);
      if (response?.data?.statusCode === 200) {
        const districtList = response?.data?.responseData?.data || [];
        const formattedCityList = districtList.map((district) => ({
          value: district.districtID,
          label: district.districtName
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
    if (customerObj.districtID === null) return;

    try {
      let response = await GetTalukaLookupList(customerObj?.districtID);
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
  const GetVillageLookupListData = async () => {
    if (customerObj.talukaID === null) return;

    try {
      let response = await GetVillageLookupList(customerObj?.talukaID);
      if (response?.data?.statusCode === 200) {
        const villageList = response?.data?.responseData?.data || [];
        const formattedCityList = villageList.map((village) => ({
          value: village.villageID,
          label: village.villageName
        }));

        setVillageOption(formattedCityList); // Ensure this is called with correct data
      } else {
        console.error('Bad request');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const GetStateLookupListData = async () => {
    try {
      const response = await GetStateLookupList(); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const stateLookupList = response?.data?.responseData?.data || [];

        const formattedIvrList = stateLookupList.map((stateItem) => ({
          value: stateItem.stateID,
          label: stateItem.stateName
        }));

        setStateOption(formattedIvrList); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch State lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching State lookup list:', error);
    }
  };
  const GetCompanyLookupListData = async () => {
    try {
      const response = await GetCompanyLookupList(user.userKeyID); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const companyLookupList = response?.data?.responseData?.data || [];

        const formattedCompanyList = companyLookupList.map((companyList) => ({
          value: companyList.companyID,
          label: companyList.companyName,
          companyKeyID: companyList.companyKeyID
        }));

        setCompanyOption(formattedCompanyList); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch State lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching State lookup list:', error);
    }
  };

  const handleStateChange = (selectedOption) => {
    setCustomerObj((prev) => ({
      ...prev,
      stateID: selectedOption ? selectedOption.value : '',
      districtID: '',
      talukaID: '',
      villageID: ''
    }));
  };

  const handleDistrictChange = (selectedOption) => {
    setCustomerObj((prev) => ({
      ...prev,
      districtID: selectedOption ? selectedOption.value : ''
    }));
  };

  const handleTalukaChange = (selectedOption) => {
    setCustomerObj((prev) => ({
      ...prev,
      talukaID: selectedOption ? selectedOption.value : ''
    }));
  };
  const handleVillageChange = (selectedOption) => {
    setCustomerObj((prev) => ({
      ...prev,
      villageID: selectedOption ? selectedOption.value : ''
    }));
  };
  const AddCustomerForVillage = () => {
    setSendToModelData({
      ...sendToModelData,
      Action: 'openFromCustomerModal',
      stateID: customerObj.stateID,
      talukaID: customerObj.talukaID,
      districtID: customerObj.districtID
    });

    setShowVillageModal(true);
  };
  return (
    <>
      <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {modelRequestData?.Action !== null
                ? 'Update Customer Master'
                : modelRequestData?.Action === null
                  ? 'Add Customer Master'
                  : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="customerName" className="form-label">
                    Customer Name
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    maxLength={50}
                    type="text"
                    className="form-control"
                    id="customerName"
                    placeholder="Enter Customer Name"
                    aria-describedby="Employee"
                    value={customerObj.name}
                    onChange={(e) => {
                      let inputValue = e.target.value;

                      // Remove invalid characters (non-alphanumeric except spaces)
                      inputValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                      // Capitalize the first letter of each word
                      const capitalized = inputValue
                        .split(' ')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ');

                      setCustomerObj((prev) => ({
                        ...prev,
                        name: capitalized
                      }));
                    }}
                  />
                  {error && (customerObj.name === null || customerObj.name === undefined || customerObj.name === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="customerAddress" className="form-label">
                    Customer Address
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <textarea
                    maxLength={250}
                    type="text"
                    className="form-control"
                    id="customerAddress"
                    placeholder="Enter Customer Address"
                    aria-describedby="Employee"
                    value={customerObj.address}
                    onChange={(e) => {
                      let inputValue = e.target.value;

                      // Allow only specific characters
                      inputValue = inputValue.replace(/[^a-zA-Z0-9\s.,-_@#&]/g, '');

                      // Capitalize the first letter of each word
                      const capitalized = inputValue
                        .split(' ')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');

                      setCustomerObj((prev) => ({
                        ...prev,
                        address: capitalized
                      }));
                    }}
                  />

                  {error && (customerObj.address === null || customerObj.address === undefined || customerObj.address === '') ? (
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
                  <label htmlFor="mobileNo" className="form-label">
                    Contact No
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    maxLength={10}
                    type="text"
                    className="form-control"
                    id="mobileNo"
                    placeholder="Enter Contact No"
                    aria-describedby="Employee"
                    value={customerObj.mobileNo}
                    onChange={(e) => {
                      // setErrorMessage('');
                      const value = e.target.value;
                      let FormattedNumber = value.replace(/[^0-9]/g, ''); // Allows only numbers

                      // Apply regex to ensure the first digit is between 6 and 9
                      FormattedNumber = FormattedNumber.replace(/^[0-5]/, '');
                      setCustomerObj((prev) => ({
                        ...prev,
                        mobileNo: FormattedNumber
                      }));
                    }}
                  />

                  <span style={{ color: 'red' }}>
                    {error && (customerObj.mobileNo === null || customerObj.mobileNo === undefined || customerObj.mobileNo === '')
                      ? ERROR_MESSAGES
                      : (customerObj.mobileNo !== null || customerObj.mobileNo !== undefined) && customerObj.mobileNo?.length < 10
                        ? 'Invalid phone Number'
                        : ''}
                  </span>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="aadharNo" className="form-label">
                    Aadhaar Card Number
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    maxLength={14}
                    type="text"
                    className="form-control"
                    id="aadharNo"
                    placeholder="Enter Aadhaar Card Number"
                    aria-describedby="Employee"
                    value={customerObj.adharNumberFormatted || ''} // Show formatted value
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters

                      // Ensure first digit is between 6 and 9
                      if (value.length > 0 && !/^[0-9]/.test(value)) {
                        value = value.substring(1);
                      }

                      value = value.slice(0, 12); // Restrict to 12 digits

                      // Format into XXXX-XXXX-XXXX
                      let formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1-');

                      setCustomerObj((prev) => ({
                        ...prev,
                        adharNumber: value, // Store only numbers
                        adharNumberFormatted: formattedValue // Store formatted value for UI
                      }));
                    }}
                  />

                  <span style={{ color: 'red' }}>
                    {error && (customerObj.adharNumber === null || customerObj.adharNumber === undefined || customerObj.adharNumber === '')
                      ? ERROR_MESSAGES
                      : (customerObj.adharNumber !== null || customerObj.adharNumber !== undefined) && customerObj.adharNumber?.length < 12
                        ? 'Invalid Aadhaar Number'
                        : ''}
                  </span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="mobileNo" className="form-label">
                    Email ID
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    maxLength={70}
                    type="text"
                    className="form-control"
                    id="mobileNo"
                    placeholder="Enter Email ID"
                    aria-describedby="Employee"
                    value={customerObj.emailID}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const trimmedValue = inputValue.replace(/\s+/g, '').replace(/\.{2,}/g, '.'); // Remove consecutive dots
                      setCustomerObj((prev) => ({
                        ...prev,
                        emailID: trimmedValue // Use `trimmedValue`
                      }));
                    }}
                  />

                  {error && (
                    <>
                      {(!customerObj.emailID || customerObj.emailID.trim() === '') && (
                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                      )}
                      {!(!customerObj.emailID || customerObj.emailID.trim() === '') && !emailRegex.test(customerObj.emailID) && (
                        <label className="validation" style={{ color: 'red' }}>
                          Enter a valid email.
                        </label>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* Company and State  */}
            <div className="row">
              {/* <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="StateName" className="form-label">
                    Select Company
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Select
                    options={companyOption}
                    value={companyOption.filter((item) => item.value === customerObj.companyID)}
                    onChange={handleCompanyChange}
                    menuPosition="fixed"
                  />
                  {error && (customerObj.companyID === null || customerObj.companyID === undefined || customerObj.companyID === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}{' '}
                </div>
              </div> */}
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="StateName" className="form-label">
                  Select State
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  options={stateOption}
                  value={stateOption.filter((item) => item.value === customerObj.stateID)}
                  onChange={handleStateChange}
                  menuPosition="fixed"
                />
                {error && (customerObj.stateID === null || customerObj.stateID === undefined || customerObj.stateID === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>

              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="StateName" className="form-label">
                    Select District
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Select
                    options={districtOption}
                    value={districtOption.filter((item) => item.value === customerObj.districtID)}
                    onChange={handleDistrictChange}
                    menuPosition="fixed"
                  />
                  {error && (customerObj.districtID === null || customerObj.districtID === undefined || customerObj.districtID === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}{' '}
                </div>
              </div>
            </div>
            {/* District and Taluka */}
            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="StateName" className="form-label">
                  Select Taluka
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  options={talukaOption}
                  value={talukaOption.filter((item) => item.value === customerObj.talukaID)}
                  onChange={handleTalukaChange}
                  menuPosition="fixed"
                />
                {error && (customerObj.talukaID === null || customerObj.talukaID === undefined || customerObj.talukaID === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
              <div className="col-12 col-md-6 mb-2">
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <label htmlFor="StateName" className="form-label">
                      Select Village
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Tooltip title="Add Village">
                      <Link onClick={AddCustomerForVillage} style={{ whiteSpace: 'nowrap' }}>
                        + Add Village
                      </Link>
                    </Tooltip>
                  </div>
                  <Select
                    options={villageOption}
                    value={villageOption.filter((item) => item.value === customerObj.villageID)}
                    onChange={handleVillageChange}
                    menuPosition="fixed"
                  />
                  {error && (customerObj.villageID === null || customerObj.villageID === undefined || customerObj.villageID === '') ? (
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
                    Aadhaar Front Image
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div
                    className="d-flex align-items-center justify-content-center position-relative border border-secondary rounded"
                    style={{ width: '100%', height: '12rem' }}
                  >
                    {aadhaarFrontImagePreview ? (
                      <>
                        <button
                          onClick={handleRemoveAadhaarFrontImage}
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
                          className="w-100 h-100 rounded border"
                          alt="Aadhaar Front Preview"
                          style={{ objectFit: 'contain' }}
                          src={aadhaarFrontImagePreview}
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
                      onChange={handleAadhaarFrontImageChange}
                    />
                  </div>
                </div>

                {error && (aadhaarFrontImage === null || aadhaarFrontImage === '' || aadhaarFrontImage === undefined) && (
                  <div style={{ color: 'red' }}>{ERROR_MESSAGES}</div>
                )}

                {aadhaarFrontSizeError ? (
                  <div style={{ color: 'red' }}>{aadhaarFrontSizeError}</div>
                ) : !aadhaarFrontImage ? (
                  <small>Supported: (Max 2MB)</small>
                ) : (
                  ''
                )}
              </div>

              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="aadharBackImg" className="form-label">
                    Aadhaar Back Image
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div
                    className="d-flex align-items-center justify-content-center position-relative border border-secondary rounded"
                    style={{ width: '100%', height: '12rem' }}
                  >
                    {aadhaarBackImagePreview ? (
                      <>
                        <button
                          onClick={handleRemoveAadhaarBackImage}
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
                          style={{ objectFit: 'contain' }}
                          src={aadhaarBackImagePreview}
                          className="w-100 h-100 rounded  border"
                          alt="Aadhaar Back Preview"
                        />
                      </>
                    ) : (
                      <label
                        htmlFor="aadharBackImg"
                        style={{ color: '#6c757d' }}
                        className="d-flex flex-column align-items-center justify-content-center text-center cursor-pointer"
                      >
                        <i style={{ fontSize: '2rem', color: '#6c757d' }} class="fa-solid fa-plus"></i>

                        <span className="d-block mt-2">Upload Image</span>
                      </label>
                    )}
                    <input
                      type="file"
                      id="aadharBackImg"
                      accept="image/jpeg, image/png"
                      style={{ display: 'none' }}
                      onChange={handleAadhaarBackImageChange}
                    />
                  </div>
                </div>

                {error && (aadhaarBackImage === null || aadhaarBackImage === '' || aadhaarBackImage === undefined) && (
                  <div style={{ color: 'red' }}>{ERROR_MESSAGES}</div>
                )}

                {aadhaarBackSizeError ? (
                  <div style={{ color: 'red' }}>{aadhaarBackSizeError}</div>
                ) : !aadhaarBackImage ? (
                  <small>Supported: (Max 2MB)</small>
                ) : (
                  ''
                )}
              </div>
              <span style={{ color: 'red' }}>{errorMessage}</span>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button type="submit" className="btn btn-primary text-center" onClick={() => AddCustomerBtnClick()}>
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

      <AddUpdateVillageModal
        modelRequestData={modelRequestData}
        onHide={() => setShowVillageModal(false)}
        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        show={showVillageModal}
        sendToModelData={sendToModelData}
        isAddUpdateActionDone={isAddUpdateActionDone}
        setSendToModelData={setSendToModelData}
      />
    </>
  );
};

export default AddUpdateCustomerModal;
