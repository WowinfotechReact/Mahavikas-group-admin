import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { GetStateLookupList } from 'services/Master Crud/MasterStateApi';
import { ConfigContext } from 'context/ConfigContext';
import { AddUpdateCompanyApi, GetCompanyModel } from 'services/Master Crud/MasterCompany';
import Select from 'react-select';
import { GetDistrictLookupList } from 'services/Master Crud/MasterDistrictApi';
import { GetTalukaLookupList } from 'services/Master Crud/MasterTalukaApi';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { GetVillageLookupList } from 'services/Master Crud/MasterVillageApi';
import Text_Editor from 'component/Text_Editor';

const MasterCompanyModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const [stateOption, setStateOption] = useState([]);
  const [districtOption, setDistrictOption] = useState([]);
  const [talukaOption, setTalukaOption] = useState([]);
  const [villageOption, setVillageOption] = useState([]);
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user } = useContext(ConfigContext);
  const [masterCompanyObj, setMasterCompanyObj] = useState({
    userKeyID: null,
    companyKeyID: null,
    companyName: null,
    companyLogoURL: null,
    gstNo: null,
    stateID: null,
    districtID: null,
    talukaID: null,
    address: null,
    contactNumber: null,
    email: null,
    website: null,
    aboutUs: null,
    privacyPolicy: null,
    villageID: null
  });

  // companyLogo img
  const [companyLogoImage, setCompanyLogoImage] = useState(null);
  const [companyLogoImagePreview, setCompanyLogoImagePreview] = useState('');
  const [companyLogoSizeError, setCompanyLogoSizeError] = useState();

  const [uploadCompanyLogoImageObj, setUploadCompanyLogoImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: masterCompanyObj.CompanyLogoLink,
    moduleName: 'Company'
  });

  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.companyKeyID !== null) {
        GetMasterCompanyModalData(modelRequestData.companyKeyID);
      }
    }
  }, [modelRequestData?.Action]);

  // useEffect(() => {
  //   GetStateLookupListData();
  // }, [modelRequestData?.Action]);

  useEffect(() => {
    if (masterCompanyObj.stateID !== null && masterCompanyObj.stateID !== undefined) {
      GetDistrictLookupListData();
    }
  }, [masterCompanyObj.stateID]);

  useEffect(() => {
    if (masterCompanyObj.talukaID !== null && masterCompanyObj.talukaID !== undefined) {
      GetVillageLookupListData();
    }
  }, [masterCompanyObj.talukaID]);

  useEffect(() => {
    if (masterCompanyObj.districtID !== null && masterCompanyObj.districtID !== undefined) {
      GetTalukaLookupListData();
    }
  }, [masterCompanyObj.districtID]);



  const AddStateBtnClick = async () => {
    let isValid = false;
    let CompanyLogoLink = null;
    if (
      masterCompanyObj.companyName === null ||
      masterCompanyObj.companyName === undefined ||
      masterCompanyObj.companyName === '' ||
      masterCompanyObj.gstNo === null ||
      masterCompanyObj.gstNo === undefined ||
      masterCompanyObj.gstNo === '' ||
      masterCompanyObj.gstNo?.length < 15 ||
      masterCompanyObj.stateID === null ||
      masterCompanyObj.stateID === undefined ||
      masterCompanyObj.stateID === '' ||
      masterCompanyObj.districtID === null ||
      masterCompanyObj.districtID === undefined ||
      masterCompanyObj.districtID === '' ||
      masterCompanyObj.talukaID === null ||
      masterCompanyObj.talukaID === undefined ||
      masterCompanyObj.talukaID === '' ||
      masterCompanyObj.villageID === null ||
      masterCompanyObj.villageID === undefined ||
      masterCompanyObj.villageID === '' ||
      masterCompanyObj.address === '' ||
      masterCompanyObj.address === null ||
      masterCompanyObj.address === undefined ||
      masterCompanyObj.aboutUs === '' ||
      masterCompanyObj.aboutUs === null ||
      masterCompanyObj.aboutUs === undefined ||
      masterCompanyObj.privacyPolicy === '' ||
      masterCompanyObj.privacyPolicy === null ||
      masterCompanyObj.privacyPolicy === undefined ||
      masterCompanyObj.contactNumber === '' ||
      masterCompanyObj.contactNumber === null ||
      masterCompanyObj.contactNumber === undefined ||
      masterCompanyObj.email === '' ||
      masterCompanyObj.email === null ||
      masterCompanyObj.email === undefined ||
      companyLogoImage === null ||
      companyLogoImage === undefined ||
      companyLogoImage === ''
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }


    const apiParam = {
      userKeyID: user.userKeyID,
      companyName: masterCompanyObj.companyName,
      companyLogoURL: CompanyLogoLink,
      gstNo: masterCompanyObj.gstNo,
      stateID: masterCompanyObj.stateID,
      districtID: masterCompanyObj.districtID,
      talukaID: masterCompanyObj.talukaID,
      contactNumber: masterCompanyObj.contactNumber,
      address: masterCompanyObj.address,
      email: masterCompanyObj.email,
      website: masterCompanyObj.website,
      aboutUs: masterCompanyObj.aboutUs,
      privacyPolicy: masterCompanyObj.privacyPolicy,
      companyKeyID: masterCompanyObj.companyKeyID,
      villageID: masterCompanyObj.villageID
    };



    if (!isValid) {
      AddUpdateCompanyData(apiParam);
    }
  };

  const AddUpdateCompanyData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateCompany'; // Default URL for Adding Data

      const response = await AddUpdateCompanyApi(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Company Added Successfully!'
              : 'Company Updated Successfully!'
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

  const GetDistrictLookupListData = async () => {
    if (masterCompanyObj.stateID === null) return;

    try {
      let response = await GetDistrictLookupList(masterCompanyObj?.stateID);
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

  const GetTalukaLookupListData = async () => {
    if (masterCompanyObj.districtID === null) return;

    try {
      let response = await GetTalukaLookupList(masterCompanyObj?.districtID);
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
    window.location.reload();
  };

  const GetMasterCompanyModalData = async (id) => {
    if (id === undefined) {
      return;
    }
    setLoader(true);

    try {
      const data = await GetCompanyModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = data.data.responseData.data; // Assuming data is an array

        setMasterCompanyObj({
          ...masterCompanyObj,
          userKeyID: ModelData.userKeyID,
          stateID: ModelData.stateID,
          stateName: ModelData.stateName,
          companyKeyID: ModelData.companyKeyID,
          companyName: ModelData.companyName,
          companyLogoURL: ModelData.companyLogoURL,
          gstNo: ModelData.gstNo,
          districtID: ModelData.districtID,
          talukaID: ModelData.talukaID,
          address: ModelData.address,
          contactNumber: ModelData.contactNumber,
          email: ModelData.email,
          website: ModelData.website,
          aboutUs: ModelData.aboutUs,
          privacyPolicy: ModelData.privacyPolicy,
          villageID: ModelData.villageID
        });
        setCompanyLogoImage(ModelData.companyLogoURL);
        setCompanyLogoImagePreview(ModelData.companyLogoURL);
        // setAadhaarBackImage(ModelData.adharBackImageURL)
        // setAadhaarBackImagePreview(ModelData.adharBackImageURL)
      } else {
        // Handle non-200 status codes if necessary
        setLoader(false);
        console.error('Error fetching data: ', data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error in company: ', error);
    }
  };

  const handleRemoveCompanyLogoImage = () => {
    setCompanyLogoImage(null);
    setCompanyLogoImagePreview(null);
  };

  const handleCompanyLogoImageChange = (e) => {
    const file = e.target.files[0]; // Get the file object
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size <= 2 * 1024 * 1024) {
        setCompanyLogoSizeError('');
        setCompanyLogoImage(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          setCompanyLogoImagePreview(event.target.result); // Set the image data URL
        };
        reader.readAsDataURL(file); // Convert file to a data URL
      } else if (file.size > 2 * 1024 * 1024) {
        setCompanyLogoSizeError('Size of image should not exceed 2MB');
      } else {
        setCompanyLogoImagePreview(null); // Clear any previously set image
        setCompanyLogoSizeError('');
      }
    } else {
      setCompanyLogoImagePreview(null); // Clear if no file is selected
      setCompanyLogoImage(null);
    }
  };

  const handleStateChange = (selectedOption) => {
    setMasterCompanyObj((prev) => ({
      ...prev,
      stateID: selectedOption ? selectedOption.value : '',

      districtID: '',
      talukaID: '',
      villageID: ''
    }));
  };

  const handleDistrictChange = (selectedOption) => {
    setMasterCompanyObj((prev) => ({
      ...prev,
      districtID: selectedOption ? selectedOption.value : '',
      villageID: ''
    }));
  };

  const handleTalukaChange = (selectedOption) => {
    setMasterCompanyObj((prev) => ({
      ...prev,
      talukaID: selectedOption ? selectedOption.value : ''
    }));
  };

  const GetVillageLookupListData = async () => {
    if (masterCompanyObj.talukaID === null) return;

    try {
      let response = await GetVillageLookupList(masterCompanyObj?.talukaID);
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

  const handleVillageChange = (selectedOption) => {
    setMasterCompanyObj((prev) => ({
      ...prev,
      villageID: selectedOption ? selectedOption.value : ''
    }));
  };

  const handleDescriptionChange = (htmlContent) => {
    setMasterCompanyObj((obj) => ({
      ...obj,
      aboutUs: htmlContent
    }));
  };
  const handlePrivacyPolicyChange = (htmlContent) => {
    // setErrors(false);
    setMasterCompanyObj((obj) => ({
      ...obj,
      privacyPolicy: htmlContent
    }));
  };
  return (
    <>
      <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>{modelRequestData?.Action !== null ? 'Update Company' : modelRequestData?.Action === null ? 'Add Company' : ''}</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 ">
                <div className="mb-2">
                  <label htmlFor="companyName" className="form-label">
                    Company Name
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    maxLength={40}
                    type="text"
                    className="form-control"
                    id="companyName"
                    placeholder="Enter Company Name"
                    value={masterCompanyObj.companyName}
                    onChange={(e) => {
                      setErrorMessage(false);
                      let inputValue = e.target.value;

                      // Remove leading space
                      if (inputValue.startsWith(' ')) {
                        inputValue = inputValue.trimStart();
                      }

                      // Allow only specific characters
                      inputValue = inputValue.replace(/[^a-zA-Z0-9\s@&.\-_]/g, '');

                      // Capitalize first letter of each word
                      const capitalized = inputValue
                        .split(' ')
                        .map(word =>
                          word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(' ');

                      setMasterCompanyObj((prev) => ({
                        ...prev,
                        companyName: capitalized
                      }));
                    }}
                  />

                  {error &&
                    (masterCompanyObj.companyName === null ||
                      masterCompanyObj.companyName === undefined ||
                      masterCompanyObj.companyName === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>

                <div className="mb-2">
                  <div>
                    <label htmlFor="companyName" className="form-label">
                      GST Number
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      maxLength={15}
                      type="text"
                      className="form-control"
                      id="companyName"
                      placeholder="Enter GST No."
                      aria-describedby="Employee"
                      value={masterCompanyObj.gstNo}
                      onChange={(e) => {
                        setErrorMessage(false);
                        let inputValue = e.target.value.toUpperCase(); // Convert to uppercase

                        // Allow only alphanumeric characters, remove spaces and special characters
                        const updatedValue = inputValue.replace(/[^A-Z0-9]/g, '');

                        setMasterCompanyObj((prev) => ({
                          ...prev,
                          gstNo: updatedValue
                        }));
                      }}
                    />

                    <span style={{ color: 'red' }}>
                      {error && (masterCompanyObj.gstNo === null || masterCompanyObj.gstNo === undefined || masterCompanyObj.gstNo === '')
                        ? ERROR_MESSAGES
                        : (masterCompanyObj.gstNo !== null || masterCompanyObj.gstNo !== undefined) && masterCompanyObj.gstNo?.length < 15
                          ? 'Invalid GST Number'
                          : ''}
                    </span>
                  </div>
                </div>

                <div className=" mb-2">
                  <label htmlFor="Contact No" className="form-label">
                    Contact No.
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    placeholder="Enter Contact No."
                    maxLength={10}
                    className="form-control"
                    value={masterCompanyObj.contactNumber}
                    onChange={(e) => {
                      // setErrorMessage('');
                      const value = e.target.value;
                      let FormattedNumber = value.replace(/[^0-9]/g, ''); // Allows only numbers

                      // Apply regex to ensure the first digit is between 6 and 9
                      FormattedNumber = FormattedNumber.replace(/^[0-5]/, '');
                      setMasterCompanyObj((prev) => ({
                        ...prev,
                        contactNumber: FormattedNumber
                      }));
                    }}
                  />

                  <span style={{ color: 'red' }}>
                    {error &&
                      (masterCompanyObj.contactNumber === null ||
                        masterCompanyObj.contactNumber === undefined ||
                        masterCompanyObj.contactNumber === '')
                      ? ERROR_MESSAGES
                      : (masterCompanyObj.contactNumber !== null || masterCompanyObj.contactNumber !== undefined) &&
                        masterCompanyObj.contactNumber?.length < 10
                        ? 'Invalid phone Number'
                        : ''}
                  </span>
                </div>
              </div>

              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="companyLogo" className="form-label">
                    Company Logo
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div
                    className="d-flex align-items-center justify-content-center position-relative border border-secondary rounded"
                    style={{ width: '100%', height: '12rem' }}
                  >
                    {companyLogoImagePreview ? (
                      <>
                        <button
                          onClick={handleRemoveCompanyLogoImage}
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
                          style={{ objectFit: 'contain' }}
                          alt="Aadhaar Front Preview"
                          src={companyLogoImagePreview}
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
                      onChange={handleCompanyLogoImageChange}
                    />
                  </div>
                </div>

                {error && (companyLogoImage === null || companyLogoImage === '' || companyLogoImage === undefined) && (
                  <div style={{ color: 'red' }}>{ERROR_MESSAGES}</div>
                )}

                {companyLogoSizeError ? (
                  <div style={{ color: 'red' }}>{companyLogoSizeError}</div>
                ) : !companyLogoImage ? (
                  <small>Supported:  (Max 2MB)</small>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="StateName" className="form-label">
                  Select State
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  options={stateOption}
                  placeholder="Select State"
                  value={stateOption.filter((item) => item.value === masterCompanyObj.stateID)}
                  onChange={handleStateChange}
                  menuPosition="fixed"
                />
                {error &&
                  (masterCompanyObj.stateID === null || masterCompanyObj.stateID === undefined || masterCompanyObj.stateID === '') ? (
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
                    placeholder="Select District "
                    value={districtOption.filter((item) => item.value === masterCompanyObj.districtID)}
                    onChange={handleDistrictChange}
                    menuPosition="fixed"
                  />
                  {error &&
                    (masterCompanyObj.districtID === null ||
                      masterCompanyObj.districtID === undefined ||
                      masterCompanyObj.districtID === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}{' '}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="StateName" className="form-label">
                  Select Taluka
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  placeholder="Select Taluka"
                  options={talukaOption}
                  value={talukaOption.filter((item) => item.value === masterCompanyObj.talukaID)}
                  onChange={handleTalukaChange}
                  menuPosition="fixed"
                />
                {error &&
                  (masterCompanyObj.talukaID === null || masterCompanyObj.talukaID === undefined || masterCompanyObj.talukaID === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="StateName" className="form-label">
                  Select Village
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  placeholder="Select Village"
                  options={villageOption}
                  value={villageOption.filter((item) => item.value === masterCompanyObj.villageID)}
                  onChange={handleVillageChange}
                  menuPosition="fixed"
                />
                {error &&
                  (masterCompanyObj.villageID === null || masterCompanyObj.villageID === undefined || masterCompanyObj.villageID === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="StateName" className="form-label">
                  Website
                  {/* <span style={{ color: 'red' }}>*</span> */}
                </label>
                <input
                  className="form-control"
                  placeholder="Enter Website"
                  value={masterCompanyObj.website}
                  type="text"
                  maxLength={35}
                  onChange={(e) => {
                    setErrorMessage(false);
                    let InputValue = e.target.value;
                    // Updated regex to allow all valid characters for company names and websites
                    const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s@&.\-_/?:#=%+]/g, '');
                    setMasterCompanyObj((prev) => ({
                      ...prev,
                      website: updatedValue
                    }));
                  }}
                />

                {/* {error &&
                (masterCompanyObj.website === null || masterCompanyObj.website === undefined || masterCompanyObj.website === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )} */}
              </div>
              <div className="col-12 col-md-6 mb-2">
                <div>
                  <label htmlFor="address" className="form-label">
                    Email
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    className="form-control"
                    placeholder="Enter Email"
                    maxLength={40}
                    type="email"
                    value={masterCompanyObj.email}
                    onChange={(e) => {
                      setErrorMessage(false);
                      const InputValue = e.target.value;
                      setMasterCompanyObj((prev) => ({
                        ...prev,
                        email: InputValue
                      }));
                    }}
                  />
                  {error && (masterCompanyObj.email === null || masterCompanyObj.email === undefined || masterCompanyObj.email === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12  mb-2">
                <div>
                  <label htmlFor="address" className="form-label">
                    Adderss
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <textarea
                    className="form-control"
                    placeholder="Enter Address"
                    maxLength={250}
                    value={masterCompanyObj.address}
                    onChange={(e) => {
                      setErrorMessage(false);
                      let inputValue = e.target.value;

                      // Remove leading spaces
                      if (inputValue.startsWith(' ')) {
                        inputValue = inputValue.trimStart();
                      }

                      // Allow only valid characters
                      inputValue = inputValue.replace(/[^a-zA-Z0-9\s,.\-\/#&()]/g, '');

                      // Capitalize first letter of each word
                      const capitalized = inputValue
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');

                      setMasterCompanyObj((prev) => ({
                        ...prev,
                        address: capitalized
                      }));
                    }}
                  />

                  {error &&
                    (masterCompanyObj.address === null || masterCompanyObj.address === undefined || masterCompanyObj.address === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-12 mb-4 ">
                  <div>
                    <label htmlFor="aboutUs" className="form-label">
                      About Us
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Text_Editor editorState={masterCompanyObj?.aboutUs} handleContentChange={handleDescriptionChange} />
                    {error &&
                      (masterCompanyObj.aboutUs === null || masterCompanyObj.aboutUs === undefined || masterCompanyObj.aboutUs === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <div className="col-12 mb-4">
                  <label htmlFor="privacyPolicy" className="form-label">
                    Privacy Policy
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Text_Editor editorState={masterCompanyObj?.privacyPolicy} handleContentChange={handlePrivacyPolicyChange} />
                  {error &&
                    (masterCompanyObj.privacyPolicy === null ||
                      masterCompanyObj.privacyPolicy === undefined ||
                      masterCompanyObj.privacyPolicy === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
            <span style={{ color: 'red' }}> {errorMessage}</span>
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
    </>
  );
};

export default MasterCompanyModal;
