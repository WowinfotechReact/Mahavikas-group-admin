import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import Select from 'react-select';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { GetRoleTypeLookupList } from 'services/Master Crud/MasterRoleTypeApi';
import { GetEmployeeLookupList } from 'services/Employee Staff/EmployeeApi';
import { GetCustomerLookupList } from 'services/CustomerStaff/CustomerStaffApi';
import { GetVehicleTypeLookupList } from 'services/Master Crud/MasterVehicleTypeApi';
import { InstallationTypeID, PaymentMode, PaymentStatus, TrackingId, installationMiliTrackDevice } from 'Middleware/Utils';
import { AddUpdateInstallationApi, GetDeviceLookupList, GetEmployeeInstallationTypeMapping, GetInstallationModel } from 'services/Installation Device/InstallationDeviceapi';
import DatePicker from 'react-date-picker';
import { Link } from 'react-router-dom';
import UserRegistrationModal from 'component/UserRegistrationModal';
import { Tooltip } from '@mui/material';
import { GetGovtPortalLookupList } from 'services/Master Crud/MasterGovPortalApi';
import AddUpdateCustomerModal from 'views/Customer/AddUpdateCustomerModal';
import { GetRechargeValidityPlanLookupList } from 'services/Recharge/RechargeApi';
import { GetSimOperatorLookupList } from 'services/Master Crud/MasterSimOperatorLookUpListApi';

const AddUpdateInstalledDeviceModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData, isAddUpdateActionDone }) => {
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [vehicleTypeOption, setVehicleTypeOption] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [employeeInstallationTypeMapping, setEmployeeInstallationTypeMapping] = useState([])
  const [customerOption, setCustomerOption] = useState([]);
  const [showUserRegistrationModal, setShowUserRegistrationModal] = useState();
  const { setLoader, user, companyID } = useContext(ConfigContext);
  const [govPortalOption, setGovPortalOption] = useState([]);
  const [roleTypeOption, setRoleTypeOption] = useState([]);

  const [deviceOption, setDeviceOption] = useState([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [employeeOption, setEmployeeOption] = useState([]);
  const [rechargeTypeOption1, setRechargeTypeOption1] = useState([]);
  const [rechargeTypeOption2, setRechargeTypeOption2] = useState([]);

  const [installationObj, setInstallationObj] = useState({
    userKeyID: null,
    installationKeyID: null,
    companyKeyID: null,
    employeeKeyID: null,
    employeeID: null,
    customerID: null,
    vehicleNumber: null,
    rcImageURL: null,
    numberPlateImageURL: null,
    vehicleFrontImageURL: null,
    vehicleBackImageURL: null,
    vehicleLeftImageURL: null,
    vehicleRightImageURL: null,
    insuranceImageURL: null,
    vehicleTypeID: null,
    installationDate: null,
    installationTypeID: null, //1.GPS / 2.GPS RTO
    mModelID: null,
    MilitrackTypeID: null,
    deviceID: null,
    isTemporaryDeviceInstalled: null,
    governmentPortalID: null,
    trackingApplicationSelectionID: null,
    paymentAmount: null,
    paymentModeID: null,
    paymentStatus: null,
    paymentDate: null,
    trackingAppID: null,
    paymentReceiptURL: null,
    transactionID: null,
    sim1OperatorID: null,
    sim1Validity: null,
    sim1RechargeAmt: null,
    sim1PaymentStatus: null,
    sim2OperatorID: null,
    sim2Validity: null,
    sim2RechargeAmt: null,
    sim2PaymentStatus: null

  });

  // rcImageURL  img
  const [rcImage, setRcImage] = useState(null);
  const [rcImagePreview, setRcImagePreview] = useState('');
  const [rcImageSizeError, setRcImageSizeError] = useState();

  const [uploadPassportProfileImageObj, setUploadPassportProfileImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: installationObj.RCImageUrl,
    moduleName: 'Installation'
  });

  // Number Plate Image URL  img
  const [numberPlateImage, setNumberPlateImage] = useState(null);
  const [numberPlateImagePreview, setNumberPlateImagePreview] = useState('');
  const [numberPlateImageSizeError, setNumberPlateImageSizeError] = useState();

  const [uploadNumberPlateImageObj, setUploadNumberImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: installationObj.NumberPlateUrl,
    moduleName: 'Installation'
  });


  // vehicle Front Image
  const [vehicleFrontImage, setVehicleFrontImage] = useState(null);
  const [vehicleFrontImagePreview, setVehicleFrontImagePreview] = useState('');
  const [vehicleFrontImageSizeError, setVehicleFrontImageSizeError] = useState();

  const [uploadVehicleFrontImageObj, setUploadVehicleFrontImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: installationObj.VehicleFrontImageUrl,
    moduleName: 'Installation'
  });

  // vehicle Back Image
  const [vehicleBackImage, setVehicleBackImage] = useState(null);
  const [vehicleBackImagePreview, setVehicleBackImagePreview] = useState('');
  const [vehicleBackImageSizeError, setVehicleBackImageSizeError] = useState();

  const [uploadVehicleBackImageObj, setUploadVehicleBackImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: installationObj.VehicleBackImageUrl,
    moduleName: 'Installation'
  });
  // vehicle Left Image
  const [vehicleLeftImage, setVehicleLeftImage] = useState(null);
  const [vehicleLeftImagePreview, setVehicleLeftImagePreview] = useState('');
  const [vehicleLeftImageSizeError, setVehicleLeftImageSizeError] = useState();

  const [uploadVehicleLeftImageObj, setUploadVehicleLeftImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: installationObj.VehicleLeftImageUrl,
    moduleName: 'Installation'
  });
  // vehicle Right Image
  const [vehicleRightImage, setVehicleRightImage] = useState(null);
  const [vehicleRightImagePreview, setVehicleRightImagePreview] = useState('');
  const [vehicleRightImageSizeError, setVehicleRightImageSizeError] = useState();
  const [simOperatorOption1, setSimOperatorOption1] = useState();
  const [simOperatorOption2, setSimOperatorOption2] = useState();
  const [uploadVehicleRightImageObj, setUploadVehicleRightImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: installationObj.VehicleRightImageUrl,
    moduleName: 'Installation'
  });
  // vehicle Insurance Image
  const [vehicleInsuranceImage, setVehicleInsuranceImage] = useState(null);
  const [vehicleInsuranceImagePreview, setVehicleInsuranceImagePreview] = useState('');
  const [vehicleInsuranceImageSizeError, setVehicleInsuranceImageSizeError] = useState();

  const [uploadVehicleInsuranceImageObj, setUploadVehicleInsuranceImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: installationObj.VehicleInsuranceImageUrl,
    moduleName: 'Installation'
  });

  // Payment Receipt Image
  const [paymentReceiptImage, setPaymentReceiptImage] = useState(null);
  const [paymentReceiptImagePreview, setPaymentReceiptImagePreview] = useState('');
  const [paymentReceiptImageSizeError, setPaymentReceiptImageSizeError] = useState();

  const [uploadPaymentReceiptImageObj, setUploadPaymentReceiptImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: installationObj.paymentReceiptImageURL,
    moduleName: 'Installation'
  });



  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.installationKeyID !== null) {
        GetInstallationModalData(modelRequestData?.installationKeyID);
      }
    }
  }, [modelRequestData?.Action]);

  useEffect(() => {
    if (installationObj.districtID !== null && installationObj.districtID !== undefined) {
      GetTalukaLookupListData();
    }
  }, [installationObj.districtID]);

  useEffect(() => {
    GetRoleTypeLookupListData();

  }, [modelRequestData?.Action]);



  const GetRoleTypeLookupListData = async () => {
    try {
      const response = await GetRoleTypeLookupList(user.userKeyID); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const roleTypeLookupList = response?.data?.responseData?.data || [];
        const formattedIvrList = roleTypeLookupList.map((roleType) => ({
          value: roleType.roleTypeID,
          label: roleType.roleTypeName
        }));
        setRoleTypeOption(formattedIvrList); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch role Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching role Type lookup list:', error);
    }
  };

  useEffect(() => {
    GetDeviceLookupListData();
  }, [installationObj.employeeKeyID]);

  const GetDeviceLookupListData = async () => {
    try {
      const response = await GetDeviceLookupList(installationObj?.employeeKeyID); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const roleTypeLookupList = response?.data?.responseData?.data || [];
        const formattedIvrList = roleTypeLookupList.map((roleType) => ({
          value: roleType.deviceID,
          label: roleType.imei
        }));
        setDeviceOption(formattedIvrList); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch role Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching role Type lookup list:', error);
    }
  };
  useEffect(() => {
    GetEmployeeInstallationTypeMappingListData()
  }, [installationObj?.employeeKeyID])

  const GetEmployeeInstallationTypeMappingListData = async () => {
    try {
      const response = await GetEmployeeInstallationTypeMapping(installationObj?.employeeKeyID); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const roleTypeLookupList = response?.data?.responseData?.data || [];
        const formattedInstallationList = roleTypeLookupList.map((installationType) => ({
          value: installationType.employeeInstallationTypeMapID,
          label: installationType.installationTypeName
        }));
        setEmployeeInstallationTypeMapping(formattedInstallationList); // Make sure you have a state setter function for IVR list
        // setDeviceOption(formattedInstallationList); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch installation type mapping:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching installation type mapping:', error);
    }
  };

  useEffect(() => {
    if (installationObj.roleTypeID) {
      GetEmployeeLookupListData(installationObj.roleTypeID, companyID);
    }
  }, [installationObj.roleTypeID]);
  useEffect(() => {
    if (isAddUpdateActionDone) {
      GetEmployeeLookupListData(installationObj.roleTypeID, companyID);
    }
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    GetCustomerLookupListData();
  }, [isAddUpdateActionDone]);
  useEffect(() => {
    GetSimOperatorLookupListData()
  }, [])
  const GetEmployeeLookupListData = async (roleTypeID, companyID) => {
    try {
      let response = await GetEmployeeLookupList(roleTypeID, companyID); // Call to get employee list based on roleTypeID
      if (response?.data?.statusCode === 200) {
        const employeeList = response?.data?.responseData?.data || [];

        const filteredEmployees = employeeList.map((emp) => ({
          value: emp.employeeKeyID,
          label: emp.name
        }));
        setEmployeeOption(filteredEmployees); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Bad request');
      }
    } catch (error) {
      console.error('Error fetching employee list:', error);
    }
  };

  const AddStateBtnClick = async () => {
    // debugger;
    let isValid = false;
    // Rc Image
    let RCImageUrl = null;
    //number Plate img
    let NumberPlateUrl = null;
    // Vehicle Front Image
    let VehicleFrontImageUrl = null;
    // Vehicle Back Image
    let VehicleBackImageUrl = null;
    // Vehicle Left Image
    let VehicleLeftImageUrl = null;
    // Vehicle Right Image
    let VehicleRightImageUrl = null;
    // Vehicle Right Image
    let VehicleInsuranceImageUrl = null;

    // receipt payment Image
    let paymentReceiptImageURL = null;
    // debugger
    // Rc Image

    if (
      installationObj.roleTypeID === null ||
      installationObj.roleTypeID === undefined ||
      installationObj.roleTypeID === '' ||
      installationObj.customerID === null ||
      installationObj.customerID === undefined ||
      installationObj.customerID === '' ||
      installationObj.employeeKeyID === null ||
      installationObj.employeeKeyID === undefined ||
      installationObj.employeeKeyID === '' ||
      // installationObj.employeeID === null ||
      // installationObj.employeeID === undefined ||
      // installationObj.employeeID === '' ||
      installationObj.vehicleNumber === null ||
      installationObj.vehicleNumber === undefined ||
      installationObj.vehicleNumber === '' ||
      rcImage === '' ||
      rcImage === null ||
      rcImage === undefined ||
      numberPlateImage === '' ||
      numberPlateImage === null ||
      numberPlateImage === undefined ||
      vehicleFrontImage === '' ||
      vehicleFrontImage === null ||
      vehicleFrontImage === undefined ||
      vehicleBackImage === '' ||
      vehicleBackImage === null ||
      vehicleBackImage === undefined ||
      vehicleLeftImage === '' ||
      vehicleLeftImage === null ||
      vehicleLeftImage === undefined ||
      vehicleRightImage === '' ||
      vehicleRightImage === null ||
      vehicleRightImage === undefined ||
      vehicleInsuranceImage === '' ||
      vehicleInsuranceImage === null ||
      vehicleInsuranceImage === undefined ||
      installationObj.installationDate === null ||
      installationObj.installationDate === '' ||
      installationObj.installationDate === undefined ||
      installationObj.vehicleTypeID === null ||
      installationObj.vehicleTypeID === '' ||
      installationObj.vehicleTypeID === undefined ||
      installationObj.installationTypeID === undefined ||
      installationObj.installationTypeID === '' ||
      installationObj.installationTypeID === null ||
      installationObj.paymentAmount === undefined ||
      installationObj.paymentAmount === '' ||
      installationObj.paymentAmount === null ||
      installationObj.paymentModeID === undefined ||
      installationObj.paymentModeID === '' ||
      installationObj.paymentModeID === null ||
      installationObj.paymentStatus === undefined ||
      installationObj.paymentStatus === '' ||
      installationObj.paymentStatus === null ||
      installationObj.paymentDate === undefined ||
      installationObj.paymentDate === '' ||
      installationObj.paymentDate === null ||
      installationObj.trackingAppID === undefined ||
      installationObj.trackingAppID === '' ||
      installationObj.trackingAppID === null ||
      installationObj.governmentPortalID === undefined ||
      installationObj.governmentPortalID === '' ||
      installationObj.governmentPortalID === null
    ) {
      setErrors(true);
      isValid = true;
    } else if (
      installationObj.paymentModeID !== null &&
      installationObj.paymentModeID !== '' &&
      installationObj.paymentModeID !== undefined &&
      installationObj.paymentModeID === 3 &&
      (paymentReceiptImage === null ||
        paymentReceiptImage === undefined ||
        paymentReceiptImage === '' ||
        installationObj.transactionID === null ||
        installationObj.transactionID === undefined ||
        installationObj.transactionID === '')
    ) {
      setErrors(true);
      isValid = true;
    } else if (
      installationObj.trackingAppID !== null &&
      installationObj.trackingAppID !== '' &&
      installationObj.trackingAppID !== undefined &&
      installationObj.trackingAppID === 2 &&
      (installationObj.militrackTypeID === null || installationObj.militrackTypeID === '' || installationObj.militrackTypeID === undefined)
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }








    const apiParam = {
      userKeyID: user.userKeyID,
      customerID: installationObj?.customerID,
      employeeKeyID: installationObj?.employeeKeyID,
      employeeID: installationObj?.employeeID,
      roleTypeID: installationObj?.roleTypeID,
      vehicleNumber: installationObj?.vehicleNumber,
      installationKeyID: modelRequestData.installationKeyID,
      rcImageURL: RCImageUrl,
      numberPlateImageURL: NumberPlateUrl,
      vehicleFrontImageURL: VehicleFrontImageUrl,
      vehicleBackImageURL: VehicleBackImageUrl,
      vehicleLeftImageURL: VehicleLeftImageUrl,
      vehicleRightImageURL: VehicleRightImageUrl,
      insuranceImageURL: VehicleInsuranceImageUrl,
      installationDate: installationObj.installationDate,
      vehicleTypeID: installationObj.vehicleTypeID,
      installationTypeID: installationObj.installationTypeID,
      mModelID: installationObj.mModelID,
      paymentAmount: installationObj.paymentAmount,
      paymentModeID: installationObj.paymentModeID,
      paymentStatus: installationObj.paymentStatus,
      paymentDate: installationObj.paymentDate,
      trackingAppID: installationObj.trackingAppID,
      companyKeyID: companyID,
      governmentPortalID: installationObj.governmentPortalID,
      militrackTypeID: installationObj.militrackTypeID,
      paymentReceiptURL: paymentReceiptImageURL,
      deviceID: installationObj.deviceID,
      // transactionID: Number(installationObj.transactionID)
      transactionID: installationObj.transactionID,
      sim1OperatorID: installationObj.sim1OperatorID,
      sim1Validity: installationObj.sim1Validity,
      sim1RechargeAmt: installationObj.sim1RechargeAmt,
      sim1PaymentStatus: installationObj.sim1PaymentStatus,
      sim2OperatorID: installationObj.sim2OperatorID,
      sim2Validity: installationObj.sim2Validity,
      sim2RechargeAmt: installationObj.sim2RechargeAmt,
      sim2PaymentStatus: installationObj.sim2PaymentStatus
    };

    if (!isValid) {
      AddUpdateInstallationData(apiParam);
    }
  };

  const AddUpdateInstallationData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateInstallation'; // Default URL for Adding Data

      const response = await AddUpdateInstallationApi(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Installation Added Successfully!'
              : 'Installation Updated Successfully!'
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

  const GetInstallationModalData = async (id) => {
    if (id === undefined) {
      return;
    }

    setLoader(true);
    try {
      const data = await GetInstallationModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);


        const ModelData = data.data.responseData.data; // Assuming data is an array

        const sim1ID = ModelData.sim1OperatorID;
        const sim2ID = ModelData.sim2OperatorID;

        setInstallationObj({
          ...installationObj,
          installationKeyID: ModelData.installationKeyID,
          companyKeyID: ModelData.companyKeyID,
          employeeKeyID: ModelData.employeeKeyID,
          employeeID: ModelData.employeeID,
          trackingAppID: ModelData.trackingAppID,
          customerID: ModelData.customerID,
          vehicleNumber: ModelData.vehicleNumber,
          rcImageURL: ModelData.rcImageURL,
          roleTypeID: ModelData?.roleTypeID,
          vehicleTypeID: ModelData.vehicleTypeID,
          installationDate: ModelData.installationDate,
          installationTypeID: ModelData.installationTypeID, //1.GPS / 2.GPS RTO
          mModelID: ModelData.mModelID,
          deviceID: ModelData.deviceID,
          isTemporaryDeviceInstalled: ModelData.isTemporaryDeviceInstalled,
          governmentPortalID: ModelData.governmentPortalID,
          trackingApplicationSelectionID: ModelData.trackingApplicationSelectionID,
          paymentAmount: ModelData.paymentAmount,
          paymentModeID: ModelData.paymentModeID,
          paymentStatus: ModelData.paymentStatus,
          // paymentDate: convertDateFormat(ModelData.paymentDate),
          paymentDate: ModelData.paymentDate,
          paymentVerifiedByEmployeeID: ModelData.paymentVerifiedByEmployeeID,
          numberPlateImageURL: ModelData.numberPlateImageURL,
          militrackTypeID: ModelData.militrackTypeID,

          vehicleFrontImageURL: ModelData.vehicleFrontImageURL,
          vehicleBackImageURL: ModelData.vehicleBackImageURL,
          vehicleLeftImageURL: ModelData.vehicleLeftImageURL,
          vehicleRightImageURL: ModelData.vehicleRightImageURL,
          insuranceImageURL: ModelData.insuranceImageURL,
          transactionID: ModelData.transactionID,
          sim1OperatorID: ModelData.sim1OperatorID,
          sim1Validity: sim1ID,
          sim1RechargeAmt: ModelData.sim1RechargeAmt,
          sim1PaymentStatus: ModelData.sim1PaymentStatus,
          sim2OperatorID: sim2ID,
          sim2Validity: ModelData.sim2Validity,
          sim2RechargeAmt: ModelData.sim2RechargeAmt,
          sim2PaymentStatus: ModelData.sim2PaymentStatus
        });


        // Fetch recharge plans after state update
        GetRechargeValidityPlanLookupListData(sim1ID, 'sim1');
        GetRechargeValidityPlanLookupListData(sim2ID, 'sim2');
        setPaymentReceiptImage(ModelData.paymentReceiptURL);
        setPaymentReceiptImagePreview(ModelData.paymentReceiptURL);

        setRcImage(ModelData.rcImageURL);
        setRcImagePreview(ModelData.rcImageURL);

        setNumberPlateImage(ModelData.numberPlateImageURL);
        setNumberPlateImagePreview(ModelData.numberPlateImageURL);

        setVehicleFrontImage(ModelData.vehicleFrontImageURL);
        setVehicleFrontImagePreview(ModelData.vehicleFrontImageURL);

        setVehicleBackImage(ModelData.vehicleBackImageURL);
        setVehicleBackImagePreview(ModelData.vehicleBackImageURL);

        setVehicleLeftImage(ModelData.vehicleLeftImageURL);
        setVehicleLeftImagePreview(ModelData.vehicleLeftImageURL);

        setVehicleRightImage(ModelData.vehicleRightImageURL);
        setVehicleRightImagePreview(ModelData.vehicleRightImageURL);

        setVehicleInsuranceImage(ModelData.insuranceImageURL);
        setVehicleInsuranceImagePreview(ModelData.insuranceImageURL);
      } else {
        // Handle non-200 status codes if necessary
        setLoader(false);
        console.error('Error fetching data: ', data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error in vehicle: ', error);
    }
  };

  const handleRoleTypeChange = (selectedOption) => {
    setInstallationObj((prev) => ({
      ...prev,
      roleTypeID: selectedOption ? selectedOption.value : null
    }));
  };
  const handleEmployeeChange = (selectedOption) => {
    setInstallationObj((prev) => ({
      ...prev,
      employeeKeyID: selectedOption ? selectedOption.value : null
    }));
  };
  const handleDeviceChange = (selectedOption) => {
    setInstallationObj((prev) => ({
      ...prev,
      deviceID: selectedOption ? selectedOption.value : null
    }));
  };

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
  useEffect(() => {
    GetGovtPortalLookupListData();
  }, []);
  const GetGovtPortalLookupListData = async () => {
    try {
      const response = await GetGovtPortalLookupList(); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const govPortalLookupList = response?.data?.responseData?.data || [];

        const formattedGOVList = govPortalLookupList.map((govPortalItem) => ({
          value: govPortalItem.governmentPortalID,
          label: govPortalItem.governmentPortalName
        }));

        setGovPortalOption(formattedGOVList); /// Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch vehicle Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching vehicle Type lookup list:', error);
    }
  };

  useEffect(() => {
    GetCustomerLookupListData();
  }, [modelRequestData.Action]);


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

  const handleVehicleTypeChange = (selectedOption) => {
    setInstallationObj((prev) => ({
      ...prev,
      vehicleTypeID: selectedOption ? selectedOption.value : null
    }));
  };
  const handleInstallationTypeChange = (selectedOption) => {
    setInstallationObj((prev) => ({
      ...prev,
      installationTypeID: selectedOption ? selectedOption.value : null
    }));
  };
  const handleTrackingIDChange = (selectedOption) => {
    setInstallationObj((prev) => ({
      ...prev,
      trackingAppID: selectedOption ? selectedOption.value : null
    }));
  };
  const handleGovPortalIDChange = (selectedOption) => {
    setInstallationObj((prev) => ({
      ...prev,
      governmentPortalID: selectedOption ? selectedOption.value : null
    }));
  };

  const handlePaymentModeChange = (selectedOption) => {
    setInstallationObj((prev) => ({
      ...prev,
      paymentModeID: selectedOption ? selectedOption.value : null
    }));
  };
  const handleSim1ValidityChange = (selectedOption) => {
    setInstallationObj((prev) => ({
      ...prev,
      sim1Validity: selectedOption ? selectedOption.value : null,
      sim1RechargeAmt: selectedOption ? selectedOption.rechargeAmount : '' // set amount here

    }));
  };
  const handleSim2ValidityChange = (selectedOption) => {
    setInstallationObj((prev) => ({
      ...prev,
      sim2Validity: selectedOption ? selectedOption.value : null,
      sim2RechargeAmt: selectedOption ? selectedOption.rechargeAmount : ''

    }));
  };
  const handleSim1OperatorChange = (selectedOption) => {
    setInstallationObj((prev) => ({
      ...prev,
      sim1OperatorID: selectedOption ? selectedOption.value : null

    }));
    GetRechargeValidityPlanLookupListData(selectedOption.value, 'sim1')

  };
  const handleSim2OperatorChange = (selectedOption) => {
    setInstallationObj((prev) => ({
      ...prev,
      sim2OperatorID: selectedOption ? selectedOption.value : null
    }));
    GetRechargeValidityPlanLookupListData(selectedOption.value, 'sim2')
  };
  const handlePaymentStatusChange = (e) => {
    setInstallationObj((prev) => ({
      ...prev,
      paymentStatus: e.target.value === 'true' // Convert string to boolean
    }));
  };
  const handleSim1PaymentStatusChange = (e) => {
    setInstallationObj((prev) => ({
      ...prev,
      sim1PaymentStatus: e.target.value === 'true' // Convert string to boolean
    }));
  };
  const handleSim2PaymentStatusChange = (e) => {
    setInstallationObj((prev) => ({
      ...prev,
      sim2PaymentStatus: e.target.value === 'true' // Convert string to boolean
    }));
  };

  const handleRemoveRCImage = () => {
    setRcImagePreview(null);
    setRcImage(null);
  };
  const handleRemoveNumberPlateImage = () => {
    setNumberPlateImagePreview(null);
    setNumberPlateImage(null);
  };
  const handleRemoveVehicleFrontImage = () => {
    setVehicleFrontImagePreview(null);
    setVehicleFrontImage(null);
  };
  const handleRemoveVehicleBackImage = () => {
    setVehicleBackImagePreview(null);
    setVehicleBackImage(null);
  };
  // left img remove
  const handleRemoveVehicleLeftImage = () => {
    setVehicleLeftImagePreview(null);
    setVehicleLeftImage(null);
  };
  // Right img remove
  const handleRemoveVehicleRightImage = () => {
    setVehicleRightImagePreview(null);
    setVehicleRightImage(null);
  };
  // Insurance img remove
  const handleRemoveVehicleInsuranceImage = () => {
    setVehicleInsuranceImagePreview(null);
    setVehicleInsuranceImage(null);
  };
  // rc img change
  const handleRCImageChange = (e) => {
    const file = e.target.files[0]; // Get the file object
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size <= 2 * 1024 * 1024) {
        setRcImageSizeError('');
        setRcImage(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          setRcImagePreview(event.target.result);
        };
        reader.readAsDataURL(file); // Convert file to a data URL
      } else if (file.size > 2 * 1024 * 1024) {
        setRcImageSizeError('Size of image should not exceed 2MB');
      } else {
        setRcImagePreview(null);
        setRcImageSizeError('');
      }
    } else {
      setRcImagePreview(null);
      setRcImage(null);
    }
  };

  // number plate
  const handleNumberPlateChange = (e) => {
    const file = e.target.files[0]; // Get the file object
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size <= 2 * 1024 * 1024) {
        setNumberPlateImage(file);
        setNumberPlateImageSizeError('');
        const reader = new FileReader();
        reader.onload = (event) => {
          setNumberPlateImagePreview(event.target.result);
        };
        reader.readAsDataURL(file); // Convert file to a data URL
      } else if (file.size > 2 * 1024 * 1024) {
        setNumberPlateImageSizeError('Size of image should not exceed 2MB');
      } else {
        setNumberPlateImage(null);
        setNumberPlateImageSizeError('');
      }
    } else {
      setNumberPlateImagePreview(null);
      setNumberPlateImage(null);
    }
  };
  // vehicle Front Image
  const handleVehicleFrontImageChange = (e) => {
    const file = e.target.files[0]; // Get the file object
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size <= 2 * 1024 * 1024) {
        setVehicleFrontImage(file);
        setVehicleFrontImageSizeError('');
        const reader = new FileReader();
        reader.onload = (event) => {
          setVehicleFrontImagePreview(event.target.result);
        };
        reader.readAsDataURL(file); // Convert file to a data URL
      } else if (file.size > 2 * 1024 * 1024) {
        setVehicleFrontImageSizeError('Size of image should not exceed 2MB');
      } else {
        setVehicleFrontImage(null);
        setVehicleFrontImageSizeError('');
      }
    } else {
      setVehicleFrontImagePreview(null);
      setVehicleFrontImage(null);
    }
  };
  // vehicle Back Image
  const handleVehicleBackImageChange = (e) => {
    const file = e.target.files[0]; // Get the file object
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size <= 2 * 1024 * 1024) {
        setVehicleBackImage(file);
        setVehicleBackImageSizeError('');
        const reader = new FileReader();
        reader.onload = (event) => {
          setVehicleBackImagePreview(event.target.result);
        };
        reader.readAsDataURL(file); // Convert file to a data URL
      } else if (file.size > 2 * 1024 * 1024) {
        setVehicleBackImageSizeError('Size of image should not exceed 2MB');
      } else {
        setVehicleBackImage(null);
        setVehicleBackImageSizeError('');
      }
    } else {
      setVehicleBackImagePreview(null);
      setVehicleBackImage(null);
    }
  };
  // vehicle Left Image
  const handleVehicleLeftImageChange = (e) => {
    const file = e.target.files[0]; // Get the file object
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size <= 2 * 1024 * 1024) {
        setVehicleLeftImage(file);
        setVehicleLeftImageSizeError('');
        const reader = new FileReader();
        reader.onload = (event) => {
          setVehicleLeftImagePreview(event.target.result);
        };
        reader.readAsDataURL(file); // Convert file to a data URL
      } else if (file.size > 2 * 1024 * 1024) {
        setVehicleLeftImageSizeError('Size of image should not exceed 2MB');
      } else {
        setVehicleLeftImage(null);
        setVehicleLeftImageSizeError('');
      }
    } else {
      setVehicleLeftImagePreview(null);
      setVehicleLeftImage(null);
    }
  };
  // vehicle Right Image
  const handleVehicleRightImageChange = (e) => {
    const file = e.target.files[0]; // Get the file object
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size <= 2 * 1024 * 1024) {
        setVehicleRightImage(file);
        setVehicleRightImageSizeError('');
        const reader = new FileReader();
        reader.onload = (event) => {
          setVehicleRightImagePreview(event.target.result);
        };
        reader.readAsDataURL(file); // Convert file to a data URL
      } else if (file.size > 2 * 1024 * 1024) {
        setVehicleRightImageSizeError('Size of image should not exceed 2MB');
      } else {
        setVehicleRightImage(null);
        setVehicleRightImageSizeError('');
      }
    } else {
      setVehicleRightImagePreview(null);
      setVehicleRightImage(null);
    }
  };
  // vehicle Insurance Image
  const handleVehicleInsuranceImageChange = (e) => {
    const file = e.target.files[0]; // Get the file object
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size <= 2 * 1024 * 1024) {
        setVehicleInsuranceImage(file);
        setVehicleInsuranceImageSizeError('');
        const reader = new FileReader();
        reader.onload = (event) => {
          setVehicleInsuranceImagePreview(event.target.result);
        };
        reader.readAsDataURL(file); // Convert file to a data URL
      } else if (file.size > 2 * 1024 * 1024) {
        setVehicleInsuranceImageSizeError('Size of image should not exceed 2MB');
      } else {
        setVehicleInsuranceImage(null);
        setVehicleInsuranceImageSizeError('');
      }
    } else {
      setVehicleInsuranceImagePreview(null);
      setVehicleInsuranceImage(null);
    }
  };

  const handleInstallationDateChange = (date) => {
    setInstallationObj((prevState) => ({
      ...prevState,
      installationDate: date // Update state with selected date
      // installationDate: dayjs(date).format("DD/MM/YYYY"), // Store in proper format if needed
    }));
  };
  const handlePaymentPayDateChange = (date) => {
    setInstallationObj((prevState) => ({
      ...prevState,
      paymentDate: date // Update state with selected date
      // paymentDate: dayjs(date).format("DD/MM/YYYY"), // Store in proper format if needed
    }));
  };

  const AddEmployeeForInstallation = () => {
    setShowUserRegistrationModal(true);
  };

  const AddCustomerForInstallation = () => {
    setShowCustomerModal(true);
  }

  const handleRemovePaymentReceiptImage = () => {
    setPaymentReceiptImagePreview(null);
    setPaymentReceiptImage(null);
  };


  const GetSimOperatorLookupListData = async () => {
    try {
      const response = await GetSimOperatorLookupList(); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const simOperatorLookupList = response?.data?.responseData?.data || [];

        const formattedSimTypeList = simOperatorLookupList.map((simName) => ({
          value: simName.simOperatorID,
          label: simName.simOperatorName
        }));

        setSimOperatorOption1(formattedSimTypeList);
        setSimOperatorOption2(formattedSimTypeList);
      } else {
        console.error('Failed to fetch sim Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching sim Type lookup list:', error);
    }
  };



  const GetRechargeValidityPlanLookupListData = async (SimOperatorID, simType) => {
    try {
      const response = await GetRechargeValidityPlanLookupList(SimOperatorID); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const roleTypeLookupList = response?.data?.responseData?.data || [];

        const formatRecharge = roleTypeLookupList.map((roleType) => ({
          value: roleType.validityInDays, // unique key
          label: `${roleType.validityInDays} Days - ₹${roleType.rechargeAmount}`,
          validityInDays: roleType.validityInDays,
          rechargeAmount: roleType.rechargeAmount
        }));

        if (simType === 'sim1') {
          setRechargeTypeOption1(formatRecharge);
        } else {
          setRechargeTypeOption2(formatRecharge);
        } // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch role Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching role Type lookup list:', error);
    }
  };


  // vehicle Insurance Image
  const handlePaymentReceiptImageChange = (e) => {
    const file = e.target.files[0]; // Get the file object
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size <= 2 * 1024 * 1024) {
        setPaymentReceiptImage(file);
        setPaymentReceiptImageSizeError('');
        const reader = new FileReader();
        reader.onload = (event) => {
          setPaymentReceiptImagePreview(event.target.result);
        };
        reader.readAsDataURL(file); // Convert file to a data URL
      } else if (file.size > 2 * 1024 * 1024) {
        setPaymentReceiptImageSizeError('Size of image should not exceed 2MB');
      } else {
        setPaymentReceiptImage(null);
        setPaymentReceiptImageSizeError('');
      }
    } else {
      setPaymentReceiptImagePreview(null);
      setPaymentReceiptImage(null);
    }
  };

  const handleMilitrackTypeChange = (selectedOption) => {
    setInstallationObj((prev) => ({
      ...prev,
      militrackTypeID: selectedOption ? selectedOption.value : null
    }));
  };

  return (
    <>
      <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {modelRequestData?.Action !== null ? 'Update Installation' : modelRequestData?.Action === null ? 'Add Installation' : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="roleTypeName" className="form-label">
                  Select Role Type
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  placeholder="Select Role Type"
                  options={roleTypeOption}
                  value={roleTypeOption.filter((item) => item.value === installationObj.roleTypeID)}
                  onChange={handleRoleTypeChange}
                  menuPosition="fixed"
                />
                {error &&
                  (installationObj.roleTypeID === null || installationObj.roleTypeID === undefined || installationObj.roleTypeID === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
                {/* {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>} */}
              </div>
              <div className="col-12 col-md-6 mb-2">
                <div className="d-flex justify-content-between align-items-center">
                  <label htmlFor="StateName" className="form-label">
                    Select Employee <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Tooltip title="Add Employee">
                    <Link onClick={AddEmployeeForInstallation} style={{ whiteSpace: 'nowrap' }}>
                      + Add Employee
                    </Link>
                  </Tooltip>
                </div>
                <Select
                  menuPlacement="auto"
                  menuPosition="fixed"
                  options={employeeOption}
                  placeholder="Select an Employee"
                  value={employeeOption.find((item) => item.value === installationObj.employeeKeyID) || null}
                  onChange={handleEmployeeChange}
                  isDisabled={!installationObj.roleTypeID} // Disable dropdown if no role type is selected
                />
                {error &&
                  (installationObj.employeeKeyID === null ||
                    installationObj.employeeKeyID === undefined ||
                    installationObj.employeeKeyID === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
                {/* {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>} */}
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <div>

                  <div className="d-flex justify-content-between align-items-center">
                    <label htmlFor="StateName" className="form-label">
                      Select Customer <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Tooltip title="Add Customer">
                      <Link onClick={AddCustomerForInstallation} style={{ whiteSpace: 'nowrap' }}>
                        + Add Customer
                      </Link>
                    </Tooltip>
                  </div>

                  <Select
                    menuPosition="fixed"
                    menuPlacement="auto"
                    options={customerOption}
                    value={customerOption.find((option) => option.value === installationObj.customerID)} // Find the selected option
                    onChange={(selectedOption) =>
                      setInstallationObj((prev) => ({
                        ...prev,
                        customerID: selectedOption ? selectedOption.value : null
                      }))
                    }
                    placeholder="Select Customer"
                  />
                  {error &&
                    (installationObj.customerID === null || installationObj.customerID === undefined || installationObj.customerID === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="vehicleNumber" className="form-label">
                  Enter Vehicle Number
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={12}
                  type="text"
                  className="form-control"
                  id="vehicleNumber"
                  placeholder="Enter Vehicle Number"
                  value={installationObj.vehicleNumber}
                  onChange={(e) => {
                    setErrorMessage(false);
                    let inputValue = e.target.value;

                    // If the input is empty or starts with a space, prevent the space
                    if (inputValue.length === 0 || (inputValue.length === 1 && inputValue === ' ')) {
                      inputValue = '';
                    }

                    // Remove unwanted characters (keeping spaces that aren't at the start)
                    const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                    // Trim leading spaces while keeping internal spaces
                    const trimmedValue = cleanedValue.trimStart();

                    // Convert the entire input to uppercase
                    const updatedValue = trimmedValue.toUpperCase();

                    setInstallationObj((prev) => ({
                      ...prev,
                      vehicleNumber: updatedValue
                    }));
                  }}
                />

                {error &&
                  (installationObj.vehicleNumber === null ||
                    installationObj.vehicleNumber === undefined ||
                    installationObj.vehicleNumber === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
                {/* {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>} */}
              </div>

              <div className="row">
                <div className="col-12 col-md-6 mb-2">
                  <div>
                    <label htmlFor="numberPlate" className="form-label">
                      Vehicle Number Plate
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div
                      className="d-flex align-items-center justify-content-center position-relative border border-secondary rounded"
                      style={{ width: '100%', height: '12rem' }}
                    >
                      {numberPlateImagePreview ? (
                        <>
                          <button
                            onClick={handleRemoveNumberPlateImage}
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
                            alt="Number Plate Preview"
                            style={{ objectFit: 'contain' }}
                            src={numberPlateImagePreview}
                          />
                        </>
                      ) : (
                        <label
                          htmlFor="numberPlate"
                          style={{ color: '#6c757d' }}
                          className="d-flex flex-column align-items-center justify-content-center text-center cursor-pointer"
                        >
                          <i style={{ fontSize: '2rem', color: '#6c757d' }} class="fa-solid fa-plus"></i>

                          <span className="d-block mt-2">Upload Image</span>
                        </label>
                      )}
                      <input
                        type="file"
                        id="numberPlate"
                        accept="image/jpeg, image/png"
                        style={{ display: 'none' }}
                        onChange={handleNumberPlateChange}
                      />
                    </div>
                  </div>

                  {error && (numberPlateImage === null || numberPlateImage === '' || numberPlateImage === undefined) && (
                    <div style={{ color: 'red' }}>{ERROR_MESSAGES}</div>
                  )}

                  {numberPlateImageSizeError ? (
                    <div style={{ color: 'red' }}>{numberPlateImageSizeError}</div>
                  ) : !numberPlateImage ? (
                    <small>Supported:  (Max 2MB)</small>
                  ) : (
                    ''
                  )}
                </div>
                <div className="col-12 col-md-6 mb-2">
                  <div>
                    <label htmlFor="vehicleFrontImg" className="form-label">
                      Vehicle Front Image
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div
                      className="d-flex align-items-center justify-content-center position-relative border border-secondary rounded"
                      style={{ width: '100%', height: '12rem' }}
                    >
                      {vehicleFrontImagePreview ? (
                        <>
                          <button
                            onClick={handleRemoveVehicleFrontImage}
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
                            alt="Number Plate Preview"
                            style={{ objectFit: 'contain' }}
                            src={vehicleFrontImagePreview}
                          />
                        </>
                      ) : (
                        <label
                          htmlFor="vehicleFrontImg"
                          style={{ color: '#6c757d' }}
                          className="d-flex flex-column align-items-center justify-content-center text-center cursor-pointer"
                        >
                          <i style={{ fontSize: '2rem', color: '#6c757d' }} class="fa-solid fa-plus"></i>

                          <span className="d-block mt-2">Upload Image</span>
                        </label>
                      )}
                      <input
                        type="file"
                        id="vehicleFrontImg"
                        accept="image/jpeg, image/png"
                        style={{ display: 'none' }}
                        onChange={handleVehicleFrontImageChange}
                      />
                    </div>
                  </div>

                  {error && (vehicleFrontImage === null || vehicleFrontImage === '' || vehicleFrontImage === undefined) && (
                    <div style={{ color: 'red' }}>{ERROR_MESSAGES}</div>
                  )}

                  {vehicleFrontImageSizeError ? (
                    <div style={{ color: 'red' }}>{vehicleFrontImageSizeError}</div>
                  ) : !vehicleFrontImage ? (
                    <small>Supported:  (Max 2MB)</small>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              {/* vehicle  back and left img  */}
              <div className="row">
                <div className="col-12 col-md-6 mb-2">
                  <div>
                    <label htmlFor="vehicleBackImg" className="form-label">
                      Vehicle Back Image
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div
                      className="d-flex align-items-center justify-content-center position-relative border border-secondary rounded"
                      style={{ width: '100%', height: '12rem' }}
                    >
                      {vehicleBackImagePreview ? (
                        <>
                          <button
                            onClick={handleRemoveVehicleBackImage}
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
                            alt="Number Plate Preview"
                            src={vehicleBackImagePreview}
                          />
                        </>
                      ) : (
                        <label
                          htmlFor="vehicleBackImg"
                          style={{ color: '#6c757d' }}
                          className="d-flex flex-column align-items-center justify-content-center text-center cursor-pointer"
                        >
                          <i style={{ fontSize: '2rem', color: '#6c757d' }} class="fa-solid fa-plus"></i>

                          <span className="d-block mt-2">Upload Image</span>
                        </label>
                      )}
                      <input
                        type="file"
                        id="vehicleBackImg"
                        accept="image/jpeg, image/png"
                        style={{ display: 'none' }}
                        onChange={handleVehicleBackImageChange}
                      />
                    </div>
                  </div>

                  {error && (vehicleBackImage === null || vehicleBackImage === '' || vehicleBackImage === undefined) && (
                    <div style={{ color: 'red' }}>{ERROR_MESSAGES}</div>
                  )}

                  {vehicleBackImageSizeError ? (
                    <div style={{ color: 'red' }}>{vehicleBackImageSizeError}</div>
                  ) : !vehicleBackImage ? (
                    <small>Supported:  (Max 2MB)</small>
                  ) : (
                    ''
                  )}
                </div>
                <div className="col-12 col-md-6 mb-2">
                  <div>
                    <label htmlFor="vehicleLeftImg" className="form-label">
                      Vehicle Left Image
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div
                      className="d-flex align-items-center justify-content-center position-relative border border-secondary rounded"
                      style={{ width: '100%', height: '12rem' }}
                    >
                      {vehicleLeftImagePreview ? (
                        <>
                          <button
                            onClick={handleRemoveVehicleLeftImage}
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
                            alt="Number Plate Preview"
                            src={vehicleLeftImagePreview}
                          />
                        </>
                      ) : (
                        <label
                          htmlFor="vehicleLeftImg"
                          style={{ color: '#6c757d' }}
                          className="d-flex flex-column align-items-center justify-content-center text-center cursor-pointer"
                        >
                          <i style={{ fontSize: '2rem', color: '#6c757d' }} class="fa-solid fa-plus"></i>

                          <span className="d-block mt-2">Upload Image</span>
                        </label>
                      )}
                      <input
                        type="file"
                        id="vehicleLeftImg"
                        accept="image/jpeg, image/png"
                        style={{ display: 'none' }}
                        onChange={handleVehicleLeftImageChange}
                      />
                    </div>
                  </div>

                  {error && (vehicleLeftImage === null || vehicleLeftImage === '' || vehicleLeftImage === undefined) && (
                    <div style={{ color: 'red' }}>{ERROR_MESSAGES}</div>
                  )}

                  {vehicleLeftImageSizeError ? (
                    <div style={{ color: 'red' }}>{vehicleLeftImageSizeError}</div>
                  ) : !vehicleLeftImage ? (
                    <small>Supported:  (Max 2MB)</small>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              {/* vehicle  Right  and insurance img  */}
              <div className="row">
                <div className="col-12 col-md-6 mb-2">
                  <div>
                    <label htmlFor="vehicleRightImg" className="form-label">
                      Vehicle Right Image
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div
                      className="d-flex align-items-center justify-content-center position-relative border border-secondary rounded"
                      style={{ width: '100%', height: '12rem' }}
                    >
                      {vehicleRightImagePreview ? (
                        <>
                          <button
                            onClick={handleRemoveVehicleRightImage}
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
                            alt="Number Plate Preview"
                            src={vehicleRightImagePreview}
                          />
                        </>
                      ) : (
                        <label
                          htmlFor="vehicleRightImg"
                          style={{ color: '#6c757d' }}
                          className="d-flex flex-column align-items-center justify-content-center text-center cursor-pointer"
                        >
                          <i style={{ fontSize: '2rem', color: '#6c757d' }} class="fa-solid fa-plus"></i>

                          <span className="d-block mt-2">Upload Image</span>
                        </label>
                      )}
                      <input
                        type="file"
                        id="vehicleRightImg"
                        accept="image/jpeg, image/png"
                        style={{ display: 'none' }}
                        onChange={handleVehicleRightImageChange}
                      />
                    </div>
                  </div>

                  {error && (vehicleRightImage === null || vehicleRightImage === '' || vehicleRightImage === undefined) && (
                    <div style={{ color: 'red' }}>{ERROR_MESSAGES}</div>
                  )}

                  {vehicleRightImageSizeError ? (
                    <div style={{ color: 'red' }}>{vehicleRightImageSizeError}</div>
                  ) : !vehicleRightImage ? (
                    <small>Supported:  (Max 2MB)</small>
                  ) : (
                    ''
                  )}
                </div>
                <div className="col-12 col-md-6 mb-2">
                  <div>
                    <label htmlFor="InsuranceImg" className="form-label">
                      Insurance Image
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div
                      className="d-flex align-items-center justify-content-center position-relative border border-secondary rounded"
                      style={{ width: '100%', height: '12rem' }}
                    >
                      {vehicleInsuranceImagePreview ? (
                        <>
                          <button
                            onClick={handleRemoveVehicleInsuranceImage}
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
                            alt="Number Plate Preview"
                            src={vehicleInsuranceImagePreview}
                          />
                        </>
                      ) : (
                        <label
                          htmlFor="InsuranceImg"
                          style={{ color: '#6c757d' }}
                          className="d-flex flex-column align-items-center justify-content-center text-center cursor-pointer"
                        >
                          <i style={{ fontSize: '2rem', color: '#6c757d' }} class="fa-solid fa-plus"></i>

                          <span className="d-block mt-2">Upload Image</span>
                        </label>
                      )}
                      <input
                        type="file"
                        id="InsuranceImg"
                        accept="image/jpeg, image/png"
                        style={{ display: 'none' }}
                        onChange={handleVehicleInsuranceImageChange}
                      />
                    </div>
                  </div>

                  {error && (vehicleInsuranceImage === null || vehicleInsuranceImage === '' || vehicleInsuranceImage === undefined) && (
                    <div style={{ color: 'red' }}>{ERROR_MESSAGES}</div>
                  )}

                  {vehicleInsuranceImageSizeError ? (
                    <div style={{ color: 'red' }}>{vehicleInsuranceImageSizeError}</div>
                  ) : !vehicleInsuranceImage ? (
                    <small>Supported:  (Max 2MB)</small>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6 mb-2">
                  <div>
                    <label htmlFor="RCImage" className="form-label">
                      RC Book Image
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div
                      className="d-flex align-items-center justify-content-center position-relative border border-secondary rounded"
                      style={{ width: '100%', height: '12rem' }}
                    >
                      {rcImagePreview ? (
                        <>
                          <button
                            onClick={handleRemoveRCImage}
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
                            src={rcImagePreview}
                          />
                        </>
                      ) : (
                        <label
                          htmlFor="RCImage"
                          style={{ color: '#6c757d' }}
                          className="d-flex flex-column align-items-center justify-content-center text-center cursor-pointer"
                        >
                          <i style={{ fontSize: '2rem', color: '#6c757d' }} class="fa-solid fa-plus"></i>

                          <span className="d-block mt-2">Upload Image</span>
                        </label>
                      )}
                      <input
                        type="file"
                        id="RCImage"
                        accept="image/jpeg, image/png"
                        style={{ display: 'none' }}
                        onChange={handleRCImageChange}
                      />
                    </div>
                  </div>

                  {error && (rcImage === null || rcImage === '' || rcImage === undefined) && (
                    <div style={{ color: 'red' }}>{ERROR_MESSAGES}</div>
                  )}

                  {rcImageSizeError ? (
                    <div style={{ color: 'red' }}>{rcImageSizeError}</div>
                  ) : !rcImage ? (
                    <small>Supported:  (Max 2MB)</small>
                  ) : (
                    ''
                  )}
                </div>
                <div className="col-12 col-md-6 mb-2">
                  <div className="mb-2">
                    <div>
                      <label className="form-label">
                        Installation Date
                        <span style={{ color: 'red' }}>*</span>
                      </label>

                      <DatePicker

                        value={installationObj?.installationDate} // Use "selected" instead of "value"
                        onChange={handleInstallationDateChange}
                        label="From Date"
                        clearIcon={null}
                        popperPlacement="bottom-start"
                      />

                      {error &&
                        (installationObj.installationDate === null ||
                          installationObj.installationDate === undefined ||
                          installationObj.installationDate === '') ? (
                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className=" mb-2">
                    <div>
                      <label htmlFor="vehicleNumber" className="form-label">
                        Installation Type
                        <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        placeholder="Select Installation Type"
                        options={employeeInstallationTypeMapping}
                        value={employeeInstallationTypeMapping.filter((item) => item.value === installationObj.installationTypeID)}
                        onChange={handleInstallationTypeChange}
                        menuPosition="fixed"
                      />
                      {error &&
                        (installationObj.installationTypeID === null ||
                          installationObj.installationTypeID === undefined ||
                          installationObj.installationTypeID === '') ? (
                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>

                  {/* please selct device  */}
                  <div className=" mb-2">
                    <div>
                      <label className="form-label">
                        Select Device
                        <span style={{ color: 'red' }}>*</span>
                      </label>
                      {/* deviceID */}
                      <Select
                        placeholder="Select Device"
                        options={deviceOption}
                        menuPlacement='auto'
                        menuPosition='fixed'
                        value={deviceOption.filter((item) => item.value === installationObj.deviceID)}
                        onChange={handleDeviceChange}
                      />
                    </div>
                  </div>

                  {/* paster here */}
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6 mb-2">
                  <label htmlFor="vehicleNumber" className="form-label">
                    Select Vehicle Type
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Select
                    placeholder="Select Vehicle Type"
                    options={vehicleTypeOption}
                    value={vehicleTypeOption.filter((item) => item.value === installationObj.vehicleTypeID)}
                    onChange={handleVehicleTypeChange}
                    menuPosition="fixed"
                  />
                  {error &&
                    (installationObj.vehicleTypeID === null ||
                      installationObj.vehicleTypeID === undefined ||
                      installationObj.vehicleTypeID === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>

                <div className="col-12 col-md-6 mb-2">
                  <div>
                    <label className="form-label">
                      Select Government Portal
                      <span style={{ color: 'red' }}>*</span>
                    </label>

                    <Select
                      placeholder="Select Government Portal"
                      options={govPortalOption}
                      value={govPortalOption.filter((item) => item.value === installationObj.governmentPortalID)}
                      onChange={handleGovPortalIDChange}
                      menuPosition="fixed"
                    />
                    {error &&
                      (installationObj.governmentPortalID === null ||
                        installationObj.governmentPortalID === undefined ||
                        installationObj.governmentPortalID === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div>
                </div>

                {/* installationDate */}
              </div>
              {/* installation type and mModal */}
              <div className="row">{/* installationDate */}</div>
              {/* manufacture modal and device ID */}
              <div className="row">{/* installationDate */}</div>

              {/* recharge and governmentPortalID */}
              <div className="row">
                <div className="col-12 col-md-6 mb-2">
                  <div>
                    <label className="form-label">
                      Select Trackin Application
                      <span style={{ color: 'red' }}>*</span>
                    </label>

                    <Select
                      placeholder="Select Trackin Application"
                      options={TrackingId}
                      value={TrackingId.filter((item) => item.value === installationObj.trackingAppID)}
                      onChange={handleTrackingIDChange}
                      menuPosition="fixed"
                    />
                    {error &&
                      (installationObj.trackingAppID === null ||
                        installationObj.trackingAppID === undefined ||
                        installationObj.trackingAppID === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div>
                </div>

                {installationObj.trackingAppID === 2 && (
                  <div className="col-12 col-md-6 mb-2">
                    <label className="form-label">
                      Select Militrack Application <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      placeholder="Select Option"
                      options={installationMiliTrackDevice}
                      value={installationMiliTrackDevice.find((item) => item.value === installationObj.militrackTypeID)}
                      onChange={handleMilitrackTypeChange}
                      menuPosition="fixed"
                    />

                    {error &&
                      (installationObj.militrackTypeID === null ||
                        installationObj.militrackTypeID === undefined ||
                        installationObj.militrackTypeID === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div>
                )}
                {/* governmentPortalID */}
              </div>
              {/* trackingApplicationSelectionID and paymentAmount */}
              <div className="position-relative border-top border-bottom border-start mt-2 border-end border-2 p-3">
                <span
                  className="position-absolute top-0 translate-middle-y px-3 fw-bold bg-light"
                  style={{ left: '10px', paddingTop: '5px', paddingBottom: '5px' }} // Adjusts top & bottom spacing
                >
                  Payment Details
                </span>
                <div className="row">
                  {/* recharge */}

                  {/* governmentPortalID */}
                  <div className="col-12 col-md-6 mb-2">
                    <div>
                      <label className="form-label">
                        Enter Payment Amount ⟨₹⟩
                        <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        maxLength={7}
                        type="text"
                        className="form-control"
                        id="paymentAmount"
                        placeholder="Enter Payment Amount"
                        value={installationObj.paymentAmount}
                        onChange={(e) => {
                          setErrorMessage(false);
                          let inputValue = e.target.value;

                          // If the input is empty or starts with a space, prevent the space
                          if (inputValue.length === 0 || (inputValue.length === 1 && inputValue === ' ')) {
                            inputValue = '';
                          }

                          // Remove unwanted characters (keeping spaces that aren't at the start)
                          const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                          // Trim leading spaces while keeping internal spaces
                          const trimmedValue = cleanedValue.trimStart();

                          // Capitalize the first letter and keep the rest as is
                          const updatedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1);

                          setInstallationObj((prev) => ({
                            ...prev,
                            paymentAmount: updatedValue
                          }));
                        }}
                      />

                      {error &&
                        (installationObj.paymentAmount === null ||
                          installationObj.paymentAmount === undefined ||
                          installationObj.paymentAmount === '') ? (
                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  {/* paymentStatus */}
                  <div className="col-12 col-md-6 mb-2">
                    <div>
                      <label className="form-label">
                        Payment Status
                        <span style={{ color: 'red' }}>*</span>
                      </label>

                      <div>
                        {PaymentStatus.map((item) => (
                          <label key={item.value} style={{ marginRight: '10px', display: 'inline-flex', alignItems: 'center' }}>
                            <input
                              type="radio"
                              name="paymentStatus"
                              value={item.value}
                              checked={installationObj.paymentStatus === item.value}
                              onChange={handlePaymentStatusChange}
                              style={{ marginRight: '5px' }}
                            />
                            {item.label}
                          </label>
                        ))}
                      </div>

                      {error &&
                        (installationObj.paymentStatus === null ||
                          installationObj.paymentStatus === undefined ||
                          installationObj.paymentStatus === '') ? (
                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* paymentModeID and paymentStatus */}
                <div className="row">
                  <div className="col-12 col-md-6 mb-2">
                    <div>
                      <label className="form-label">
                        Select Payment Mode
                        <span style={{ color: 'red' }}>*</span>
                      </label>

                      <Select
                        options={PaymentMode}
                        value={PaymentMode.filter((item) => item.value === installationObj.paymentModeID)}
                        onChange={handlePaymentModeChange}
                        menuPosition="fixed"
                      />
                      {error &&
                        (installationObj.paymentModeID === null ||
                          installationObj.paymentModeID === undefined ||
                          installationObj.paymentModeID === '') ? (
                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-2">
                    <div>
                      <label className="form-label">
                        Payment Date
                        <span style={{ color: 'red' }}>*</span>
                      </label>

                      <DatePicker
                        value={installationObj?.paymentDate} // Use "selected" instead of "value"
                        label="From Date"
                        clearIcon={null}
                        popperPlacement="bottom-start"
                        onChange={handlePaymentPayDateChange}
                      />
                      {error &&
                        (installationObj.paymentDate === null ||
                          installationObj.paymentDate === undefined ||
                          installationObj.paymentDate === '') ? (
                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>

                {installationObj.paymentModeID === 3 && (
                  <div className="row">
                    <div className="col-12 col-md-6 mb-2">
                      <div>
                        <label htmlFor="receiptImg" className="form-label">
                          Payment Receipt
                          <span style={{ color: 'red' }}>*</span>
                        </label>
                        <div
                          className="d-flex align-items-center justify-content-center position-relative border border-secondary rounded"
                          style={{ width: '100%', height: '12rem' }}
                        >
                          {paymentReceiptImagePreview ? (
                            <>
                              <button
                                onClick={handleRemovePaymentReceiptImage}
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
                                alt="Payment Receipt Preview"
                                src={paymentReceiptImagePreview}
                              />
                            </>
                          ) : (
                            <label
                              htmlFor="receiptImg"
                              style={{ color: '#6c757d' }}
                              className="d-flex flex-column align-items-center justify-content-center text-center cursor-pointer"
                            >
                              <i style={{ fontSize: '2rem', color: '#6c757d' }} class="fa-solid fa-plus"></i>

                              <span className="d-block mt-2">Upload Image</span>
                            </label>
                          )}
                          <input
                            type="file"
                            id="receiptImg"
                            accept="image/jpeg, image/png"
                            style={{ display: 'none' }}
                            onChange={handlePaymentReceiptImageChange}
                          />
                        </div>
                      </div>

                      {error && (paymentReceiptImage === null || paymentReceiptImage === '' || paymentReceiptImage === undefined) && (
                        <div style={{ color: 'red' }}>{ERROR_MESSAGES}</div>
                      )}

                      {paymentReceiptImageSizeError ? (
                        <div style={{ color: 'red' }}>{vehicleRightImageSizeError}</div>
                      ) : !paymentReceiptImage ? (
                        <small>Supported:  (Max 2MB)</small>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="col-12 col-md-6 mb-2">
                      <label className="form-label">Transaction ID</label>
                      <span style={{ color: 'red' }}>*</span>
                      <input
                        maxLength={12}
                        type="text"
                        className="form-control"
                        id="vehicleNumber"
                        placeholder="Enter Transaction ID"
                        value={installationObj.transactionID}
                        onChange={(e) => {
                          setErrorMessage(false);
                          let inputValue = e.target.value;

                          // Allow only alphanumeric characters (letters and numbers)
                          const alphanumericValue = inputValue.replace(/[^a-zA-Z0-9]/g, '');

                          setInstallationObj((prev) => ({
                            ...prev,
                            transactionID: alphanumericValue
                          }));
                        }}
                      />


                      {error &&
                        (installationObj.transactionID === null ||
                          installationObj.transactionID === undefined ||
                          installationObj.transactionID === '') ? (
                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* <div className="position-relative border-top border-bottom border-start mt-2 border-end border-2 p-3"> */}
              {/* <span
                  className="position-absolute top-0 translate-middle-y px-3 fw-bold bg-light"
                  style={{ left: '10px', paddingTop: '5px', paddingBottom: '5px' }} // Adjusts top & bottom spacing
                >
                  Recharge
                </span> */}
              {/* <div className="row"> */}
              {/* recharge */}

              {/* governmentPortalID */}
              {/* <div className="col-12 col-md-6 mb-2">
                    <div>
                      <label className="form-label">
                        Select Sim 1 Operator

                      </label>
                      <Select
                        options={simOperatorOption1}
                        value={simOperatorOption1?.filter((item) => item.value === installationObj.sim1OperatorID)}
                        onChange={handleSim1OperatorChange}
                        menuPosition="fixed"
                      />
                      {error &&
                        (installationObj.sim1OperatorID === null ||
                          installationObj.sim1OperatorID === undefined ||
                          installationObj.sim1OperatorID === '') ? (
                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-2">
                    <div>
                      <label className="form-label">
                        Select Sim 2 Operator
                      </label>
                      <Select
                     options={simOperatorOption2}
                     value={simOperatorOption2?.filter((item) => item.value === installationObj.sim2OperatorID)}
                     onChange={handleSim2OperatorChange}
                     menuPosition="fixed"
                      />

                      {error &&
                        (installationObj.sim2OperatorID === null ||
                          installationObj.sim2OperatorID === undefined ||
                          installationObj.sim2OperatorID === '') ? (
                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                      ) : (
                        ''
                      )}
                    </div>
                  </div> */}
              {/* paymentStatus */}

              {/* </div> */}

              {/* paymentModeID and paymentStatus */}
              {/* <div className="row">
                  <div className="col-12 col-md-6 mb-2">
                    <div>
                      <label className="form-label">
                        Select Sim 1 Validity
                      </label>

                      <Select
                        options={rechargeTypeOption1}
                        value={rechargeTypeOption1.filter((item) => item.value === installationObj.sim1Validity)}
                        onChange={handleSim1ValidityChange}
                        menuPosition="fixed"
                      />
                      {error &&
                        (installationObj.sim1Validity === null ||
                          installationObj.sim1Validity === undefined ||
                          installationObj.sim1Validity === '') ? (
                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-2">
                    <div>
                      <label className="form-label">
                        Select Sim 2 Validity
                      </label>

                      <Select
                        options={rechargeTypeOption2}
                        value={rechargeTypeOption2?.filter((item) => item.value === installationObj.sim2Validity)}
                        onChange={handleSim2ValidityChange}
                        menuPosition="fixed"
                      />
                      {error &&
                        (installationObj.sim2Validity === null ||
                          installationObj.sim2Validity === undefined ||
                          installationObj.sim2Validity === '') ? (
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
                      <label className="form-label">
                        Sim 1 Recharge Amt
                      </label>

                      <input type="text"
                        readOnly className='form-control'
                        value={installationObj.sim1RechargeAmt}
                        placeholder='Sim 1 Recharge Amount' />

                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-2">
                    <div>
                      <label className="form-label">
                        Sim 2 Recharge Amt
                      </label>

                      <input type="text" readOnly
                        className='form-control'
                        value={installationObj.sim2RechargeAmt}
                        placeholder='Sim 2 Recharge Amount' />

                    </div>
                  </div>

                </div> */}
              {/* <div className="row">
                  <div className="col-12 col-md-6 mb-2">
                    <div>
                      <label className="form-label">
                        Sim 1 Payment Status
                      </label>

                      <div>
                        {PaymentStatus.map((item) => (
                          <label key={item.value} style={{ marginRight: '10px', display: 'inline-flex', alignItems: 'center' }}>
                            <input
                              type="radio"
                              name="sim1paymentStatus"
                              value={item.value}
                              checked={installationObj.sim1PaymentStatus === item.value}
                              onChange={handleSim1PaymentStatusChange}
                              style={{ marginRight: '5px' }}
                            />
                            {item.label}
                          </label>
                        ))}
                      </div>

                      {error &&
                        (installationObj.sim1PaymentStatus === null ||
                          installationObj.sim1PaymentStatus === undefined ||
                          installationObj.sim1PaymentStatus === '') ? (
                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-2">
                    <div>
                      <label className="form-label">
                        Sim 2 Payment Status
                      </label>

                      <div>
                        {PaymentStatus.map((item) => (
                          <label key={item.value} style={{ marginRight: '10px', display: 'inline-flex', alignItems: 'center' }}>
                            <input
                              type="radio"
                              name="sim2PaymentStatus"
                              value={item.value}
                              checked={installationObj.sim2PaymentStatus === item.value}
                              onChange={handleSim2PaymentStatusChange}
                              style={{ marginRight: '5px' }}
                            />
                            {item.label}
                          </label>
                        ))}
                      </div>

                      {error &&
                        (installationObj.sim2PaymentStatus === null ||
                          installationObj.sim2PaymentStatus === undefined ||
                          installationObj.sim2PaymentStatus === '') ? (
                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                      ) : null}
                    </div>
                  </div>

                </div> */}


              {/* </div> */}
            </div>
            <span style={{ color: 'red' }}>{errorMessage}</span>
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
      {showUserRegistrationModal && (
        <UserRegistrationModal
          show={showUserRegistrationModal}
          modelRequestData={modelRequestData}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
          onHide={() => setShowUserRegistrationModal(false)}
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

export default AddUpdateInstalledDeviceModal;
