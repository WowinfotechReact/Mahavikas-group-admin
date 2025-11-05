import Text_Editor from 'component/Text_Editor';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import { Tooltip } from '@mui/material';
import 'react-date-picker/dist/DatePicker.css';
import ProductQuotationAddUpdateModal from './ProductQuotationAddUpdateModal';
import { GetQutationNumberFormatLookupList } from 'services/Quotation/QuotationApi';
import { GetEmployeeLookupList } from 'services/Employee Staff/EmployeeApi';
import { GetLeadLookupList, GetquotationFormatLookupList } from 'services/LeadAPI/LeadApi';
import { GetTermsAndConditionsLookupList } from 'services/Terms And Condition/TermsConditionApi';
import { useLocation, useNavigate } from 'react-router';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { AddUpdateQuotation, GetQuotationModel } from 'services/Quotation Module/AddUpdateQuotationApi';
import { ConfigContext } from 'context/ConfigContext';
import SuccessPopupModal from 'component/SuccessPopupModal';
import dayjs from 'dayjs';
const QuotationFormatWithProduct = () => {
  const [modelRequestData, setModelRequestData] = useState({});
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [productList, setProductList] = useState([]);
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [editingProductIndex, setEditingProductIndex] = useState(null); // null = add mode
  const [editIndex, setEditIndex] = useState(null); // null for add
  const [productTypeOption, setProductTypeOption] = useState([]);
  const [manufactureOption, setManufactureOption] = useState([]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [variantOption, setVariantOption] = useState([]);
  const [modelOption, setModelOption] = useState([]);
  const [quotationNoFormatOption, setQuotationNoFormatOption] = useState([]);
  const [reviewEmpOption, setReviewEmpOption] = useState([]);
  const [leadOption, setLeadOption] = useState([]);
  const [error, setErrors] = useState(null);
  const [quotationFormatOption, setQuotationFormatOption] = useState([]);
  const [termsConditionOption, setTermsConditionOption] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [showAddUpdateProductQuotationModal, setShowAddUpdateProductQuotationModal] = useState(false);
  const { setLoader, user } = useContext(ConfigContext);
  const location = useLocation();
  const [modelAction, setModelAction] = useState(false);
  const [quotationObj, setQuotationObj] = useState({
    userKeyID: null,
    requirement: null,
    reviewedEmployeeBy: null,
    quotationFormatID: null,
    address: null,
    quotationKeyID: null,
    leadName: null,
    validFor: null,
    isSendForApproval: null,
    quotationDate: null,
    quotMatters: null,
    reviewedEmpID: null,
    termsAndConditionsID: null,
    quotationNumberFormatID: null,
    termsAndConditions: null,
    quotationNumberFormat: null,
    quotationProductMapping: []
  });

  useEffect(() => {
    if (location.state?.quotationKeyID !== undefined) {
      if (location.state?.quotationKeyID !== null) {
        GetQuotationModelData(location.state?.quotationKeyID);
      }
    }
  }, [location]);
  useEffect(() => {
    GetQuotationNumberFormatLookupListData();
  }, []);
  useEffect(() => {
    const incoming = location.state?.quotationObj || {};
    setQuotationObj((prev) => ({
      ...prev,
      ...incoming,
      leadName: location.state?.leadName || prev.leadName,
      requirement: location.state?.requirement || prev.requirement,
      address: location.state?.address || prev.address,
      quotationFormatID: location.state?.quotationFormatID || prev.quotationFormatID
    }));
  }, [location]);

  const GetQuotationNumberFormatLookupListData = async () => {
    try {
      const response = await GetQutationNumberFormatLookupList(); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const quotationNoFormat = response?.data?.responseData?.data || [];

        const formattedQuotationNoFormatList = quotationNoFormat.map((roleType) => ({
          value: roleType.quotationNumberFormatID,
          label: roleType.quotationNumberFormat
        }));

        setQuotationNoFormatOption(formattedQuotationNoFormatList); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch role Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching role Type lookup list:', error);
    }
  };
  useEffect(() => {
    GetEmployeeLookupListData();
  }, []);


  const GetEmployeeLookupListData = async () => {
    try {
      const payload = {
        employeeTypeID: null,
        roleTypeID: 2
      };

      const response = await GetEmployeeLookupList(payload);

      if (response?.data?.statusCode === 200) {
        const employeeList = response?.data?.responseData?.data || [];

        const filteredEmployees = employeeList.map((emp) => ({
          value: emp.employeeID,
          label: emp.employeeName
        }));

        setReviewEmpOption(filteredEmployees); // Assuming this is a useState setter
      } else {
        console.error('Bad request');
      }
    } catch (error) {
      console.error('Error fetching employee list:', error);
    }
  };

  useEffect(() => {
    GetLeadLookupListData();
  }, []);
  const GetLeadLookupListData = async () => {
    try {
      const response = await GetLeadLookupList(); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const leadFormat = response?.data?.responseData?.data || [];

        const formattedLeadList = leadFormat.map((roleType) => ({
          value: roleType.leadName,
          label: roleType.leadName
        }));

        setLeadOption(formattedLeadList); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch role Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching role Type lookup list:', error);
    }
  };
  useEffect(() => {
    // Load all required data on mount or when ID is available
    if (location.state.quotationID) {
      GetQuotationModelData(location.state.quotationID); // 1. Get model data
    }

    GetQuotationNumberFormatLookupListData(); // 2. Lookup for number format
    GetEmployeeLookupListData(); // 3. Lookup for employee
  }, []);

  useEffect(() => {
    if (
      quotationObj?.quotationNumberFormatID &&
      quotationNoFormatOption.length > 0 &&
      !quotationObj?.quotationNumberFormat
    ) {
      const matchedFormat = quotationNoFormatOption.find(
        (item) => item.value === quotationObj.quotationNumberFormatID
      );

      if (matchedFormat) {
        setQuotationObj((prev) => ({
          ...prev,
          quotationNumberFormat: matchedFormat.label,
        }));
      }
    }

    if (
      quotationObj?.reviewedEmpID &&
      reviewEmpOption.length > 0 &&
      !quotationObj?.reviewedEmployeeBy
    ) {
      const matchedEmp = reviewEmpOption.find(
        (item) => item.value === quotationObj.reviewedEmpID
      );

      if (matchedEmp) {
        setQuotationObj((prev) => ({
          ...prev,
          reviewedEmployeeBy: matchedEmp.label,
        }));
      }
    }
  }, [quotationObj?.quotationNumberFormatID, quotationObj?.reviewedEmpID, quotationNoFormatOption, reviewEmpOption]);


  const { state } = useLocation();
  useEffect(() => {
    GetQuotationFormatLookupListData();
  }, []);
  const GetQuotationFormatLookupListData = async () => {
    try {
      const response = await GetquotationFormatLookupList(); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const quotationFormat = response?.data?.responseData?.data || [];

        const formattedQuotationList = quotationFormat.map((roleType) => ({
          value: roleType.quotationFormatID,
          label: roleType.quotationFormatName
        }));

        setQuotationFormatOption(formattedQuotationList); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch role Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching role Type lookup list:', error);
    }
  };
  useEffect(() => {
    GetTermsAndConditionsLookupListData();
  }, []);
  const GetTermsAndConditionsLookupListData = async () => {
    try {
      const response = await GetTermsAndConditionsLookupList(); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const quotationFormat = response?.data?.responseData?.data || [];

        const formattedQuotationList = quotationFormat.map((roleType) => ({
          value: roleType.termsAndConditionsID,
          label: roleType.title,
          termsAndConditions: roleType.termsAndConditions
        }));

        setTermsConditionOption(formattedQuotationList); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch role Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching role Type lookup list:', error);
    }
  };
  const handleQuotationNoFormat = (selectedOption) => {
    setQuotationObj((prev) => ({
      ...prev,
      quotationNumberFormatID: selectedOption?.value || null,
      quotationNumberFormat: selectedOption?.label || null
    }));
  };
  useEffect(() => {
    handleQuotationNoFormat()
  }, [])
  const handleReviewedEmp = (selectedOption) => {
    setQuotationObj((prev) => ({
      ...prev,
      reviewedEmpID: selectedOption?.value || null,
      reviewedEmployeeBy: selectedOption?.label || null
    }));
  };
  const handleQouteFormat = (selectedOption) => {

    setQuotationObj((prev) => ({
      ...prev,
      quotationFormatID: selectedOption?.value || null
    }));
  };

  const handleTermsAndConditions = (selectedOption) => {
    setQuotationObj((prev) => ({
      ...prev,
      termsAndConditionsID: selectedOption?.value || null,
      termsAndConditions: selectedOption?.termsAndConditions || '' // ✅ set label content into editor
    }));
  };

  const handleQuotationMatterChange = (htmlContent) => {
    setQuotationObj((obj) => ({
      ...obj,
      quotMatters: htmlContent
    }));
  };
  const handleTermsAndConditionsChange = (htmlContent) => {
    setQuotationObj((obj) => ({
      ...obj,
      termsAndConditions: htmlContent
    }));
  };

  const handleDateChange = (date) => {
    setQuotationObj((prevState) => ({
      ...prevState,
      quotationDate: date // Update state with selected date
    }));
  };

  useEffect(() => {
    if (state?.quotationObj) {
      console.log('Before debugger');
      // debugger;
      console.log('After debugger');
      setQuotationObj((prev) => ({
        ...prev,
        ...state.quotationObj
      }));
    }
  }, [state]);

  const GetQuotationModelData = async (id) => {
    if (id === undefined) {
      return;
    }
    setLoader(true);

    try {
      const data = await GetQuotationModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = data.data.responseData.data; // Assuming data is an array

        setQuotationObj({
          ...quotationObj,
          quotationID: ModelData.quotationID,
          quotationKeyID: ModelData.quotationKeyID,
          leadKeyID: ModelData.leadKeyID,
          validFor: ModelData.validFor,
          isSendForApproval: ModelData.isSendForApproval,
          quotationDate: ModelData.quotationDate,
          quotMatters: ModelData.quotMatters,
          reviewedEmpID: ModelData.reviewedEmpID,
          termsAndConditionsID: ModelData.termsAndConditionsID,
          quotationNumberFormatID: ModelData.quotationNumberFormatID,
          termsAndConditions: ModelData.termsAndConditions,
          leadName: ModelData.leadName,
          requirement: ModelData.requirement,
          address: ModelData.address,
          quotationFormatID: ModelData.quotationFormatID,
          quotationProductMapping: ModelData.quotationProductMapping
        });
      } else {
        setLoader(false);

        // Handle non-200 status codes if necessary
        console.error('Error fetching data: ', data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);

      console.error('Error in state: ', error);
    }
  };

  const addUpdateProductModal = () => {
    let isValid = false;
    // debugger

    if (
      quotationObj.address === null ||
      quotationObj.address === undefined ||
      quotationObj.address === '' ||
      quotationObj.leadName === null ||
      quotationObj.leadName === undefined ||
      quotationObj.leadName === '' ||
      quotationObj.quotationDate === null ||
      quotationObj.quotationDate === undefined ||
      quotationObj.quotationDate === '' ||
      quotationObj.quotMatters === null ||
      quotationObj.quotMatters === undefined ||
      quotationObj.quotMatters === '' ||
      quotationObj.reviewedEmpID === null ||
      quotationObj.reviewedEmpID === undefined ||
      quotationObj.reviewedEmpID === '' ||
      quotationObj.termsAndConditionsID === null ||
      quotationObj.termsAndConditionsID === undefined ||
      quotationObj.termsAndConditionsID === '' ||
      quotationObj.termsAndConditions === null ||
      quotationObj.termsAndConditions === undefined ||
      quotationObj.termsAndConditions === ''
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    setModelRequestData({
      quotationFormatID: quotationObj.quotationFormatID,
      productID: null,
      manufacturerName: null,
      modelName: null,
      variantName: null,
      manufacturerID: null,
      variantID: null,
      modelID: null,
      unit: '',
      quantity: '',
      rate: '',
      discount: '',
      scopeOfSupply: '',
      warranty: ''
    });
    setEditIndex(null);

    if (!isValid) {
      setEditIndex(null);
      setShowAddUpdateProductQuotationModal(true);
    }
  };

  const navigate = useNavigate();

  const handlePreview = () => {
    debugger
    console.log(quotationObj, 'uhdsa087dh43w43');




    let isValid = false;


    if (
      quotationObj.address === null ||
      quotationObj.address === undefined ||
      quotationObj.address === '' ||
      quotationObj.quotationFormatID === null ||
      quotationObj.quotationFormatID === undefined ||
      quotationObj.quotationFormatID === '' ||
      quotationObj.quotationProductMapping === null ||
      quotationObj.quotationProductMapping === undefined ||
      !Array.isArray(quotationObj.quotationProductMapping) ||
      quotationObj.quotationProductMapping.length === 0 ||
      quotationObj.quotationNumberFormatID === null ||
      quotationObj.quotationNumberFormatID === undefined ||
      quotationObj.quotationNumberFormatID === '' ||
      quotationObj.requirement === null ||
      quotationObj.requirement === undefined ||
      quotationObj.requirement === '' ||
      quotationObj.leadName === null ||
      quotationObj.leadName === undefined ||
      quotationObj.leadName === '' ||
      quotationObj.quotationDate === null ||
      quotationObj.quotationDate === undefined ||
      quotationObj.quotationDate === '' ||
      quotationObj.quotMatters === null ||
      quotationObj.quotMatters === undefined ||
      quotationObj.quotMatters === '' ||
      quotationObj.reviewedEmpID === null ||
      quotationObj.reviewedEmpID === undefined ||
      quotationObj.reviewedEmpID === '' ||
      quotationObj.termsAndConditionsID === null ||
      quotationObj.termsAndConditionsID === undefined ||
      quotationObj.termsAndConditionsID === '' ||
      quotationObj.termsAndConditions === null ||
      quotationObj.termsAndConditions === undefined ||
      quotationObj.termsAndConditions === ''
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }


    const fullQuotationObj = {
      ...quotationObj,
      quotationKeyID: location?.state?.quotationKeyID || quotationObj?.quotationKeyID,
      leadKeyID: location?.state?.leadKeyID || quotationObj?.leadKeyID,
      quotationDate: quotationObj?.quotationDate
        ? dayjs(quotationObj.quotationDate).format("DD/MM/YYYY")
        : null,
      validTillDate: quotationObj?.validTillDate
        ? dayjs(quotationObj.validTillDate).format("DD/MM/YYYY")
        : null,
    };

    if (!isValid) {
      navigate('/quotation-preview', {
        state: {
          quotationObj: fullQuotationObj,
          action: 'FromQuotationFormatWithProduct', // optional, for tracking back
        },
      });
    }


  };


  const handleEdit = (item, index) => {
    setModelRequestData({
      ...item,
      quotationFormatID: quotationObj.quotationFormatID || null
    });

    setEditIndex(index);
    setShowAddUpdateProductQuotationModal(true);
  };

  const handleDelete = (index) => {
    setQuotationObj((prev) => {
      const updatedList = [...prev.quotationProductMapping];
      updatedList.splice(index, 1);
      return {
        ...prev,
        quotationProductMapping: updatedList
      };
    });
  };

  const handleAddOrUpdateProduct = (product, index) => {
    const updatedList = [...(quotationObj.quotationProductMapping || [])];

    if (index !== null && index !== undefined) {
      // Update existing
      updatedList[index] = product;
    } else {
      // Check duplicate: same productID + rate
      const duplicate = updatedList.find((item) => item.productID === product.productID && item.rate === product.rate);
      if (duplicate) {
        toast.error('This product with the same rate already exists!');
        return;
      }

      updatedList.push(product); // Add new
    }

    setQuotationObj((prev) => ({
      ...prev,
      quotationProductMapping: updatedList
    }));

    setEditIndex(null);
  };

  console.log(location.state, 'grrrrrrrrtttttttttte3333333333');
  // console.log(state,'grrrrrrrrtttttttttte3333333333');
  const saveAsDraftBtn = () => {

    let isValid = false;

    if (
      quotationObj.address === null ||
      quotationObj.address === undefined ||
      quotationObj.address === '' ||
      quotationObj.quotationFormatID === null ||
      quotationObj.quotationFormatID === undefined ||
      quotationObj.quotationFormatID === '' ||
      quotationObj.quotationProductMapping === null ||
      quotationObj.quotationProductMapping === undefined ||
      !Array.isArray(quotationObj.quotationProductMapping) ||
      quotationObj.quotationProductMapping.length === 0 ||
      quotationObj.quotationNumberFormatID === null ||
      quotationObj.quotationNumberFormatID === undefined ||
      quotationObj.quotationNumberFormatID === '' ||
      quotationObj.requirement === null ||
      quotationObj.requirement === undefined ||
      quotationObj.requirement === '' ||
      quotationObj.leadName === null ||
      quotationObj.leadName === undefined ||
      quotationObj.leadName === '' ||
      quotationObj.quotationDate === null ||
      quotationObj.quotationDate === undefined ||
      quotationObj.quotationDate === '' ||
      quotationObj.quotMatters === null ||
      quotationObj.quotMatters === undefined ||
      quotationObj.quotMatters === '' ||
      quotationObj.reviewedEmpID === null ||
      quotationObj.reviewedEmpID === undefined ||
      quotationObj.reviewedEmpID === '' ||
      quotationObj.termsAndConditionsID === null ||
      quotationObj.termsAndConditionsID === undefined ||
      quotationObj.termsAndConditionsID === '' ||
      quotationObj.termsAndConditions === null ||
      quotationObj.termsAndConditions === undefined ||
      quotationObj.termsAndConditions === ''
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }
    const apiParam = {
      userKeyID: user.userKeyID,
      isSendForApproval: false,
      address: quotationObj.address,
      quotationFormatID: quotationObj.quotationFormatID,
      quotationProductMapping: quotationObj.quotationProductMapping,
      requirement: quotationObj.requirement,
      quotationDate: quotationObj.quotationDate,
      leadName: quotationObj.leadName,
      quotationNumberFormatID: quotationObj.quotationNumberFormatID,
      reviewedEmpID: quotationObj.reviewedEmpID,
      termsAndConditionsID: quotationObj.termsAndConditionsID,
      termsAndConditions: quotationObj.termsAndConditions,
      quotMatters: quotationObj.quotMatters,
      leadKeyID: location.state?.leadKeyID || quotationObj.leadKeyID,
      quotationKeyID: location.state?.quotationKeyID || quotationObj.quotationKeyID,
      validFor: null,

    };

    if (!isValid) {
      AddUpdateQuotationData(apiParam);
    }
  };

  const AddUpdateQuotationData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateQuotation'; // Default URL for Adding Data

      const response = await AddUpdateQuotation(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(apiParam.isSendForApproval === true ? 'Quotation Send For Approval!' : 'Quotation Save As Draft Successfully!');

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
    setShowSuccessModal(false);
    navigate('/lead');
  };

  const handle_Submit_Send_For_Approval = () => {
    let isValid = false;

    if (
      quotationObj.address === null ||
      quotationObj.address === undefined ||
      quotationObj.address === '' ||
      quotationObj.quotationFormatID === null ||
      quotationObj.quotationFormatID === undefined ||
      quotationObj.quotationFormatID === '' ||
      quotationObj.quotationProductMapping === null ||
      quotationObj.quotationProductMapping === undefined ||
      !Array.isArray(quotationObj.quotationProductMapping) ||
      quotationObj.quotationProductMapping.length === 0 ||
      quotationObj.quotationNumberFormatID === null ||
      quotationObj.quotationNumberFormatID === undefined ||
      quotationObj.quotationNumberFormatID === '' ||
      quotationObj.requirement === null ||
      quotationObj.requirement === undefined ||
      quotationObj.requirement === '' ||
      quotationObj.leadName === null ||
      quotationObj.leadName === undefined ||
      quotationObj.leadName === '' ||
      quotationObj.quotationDate === null ||
      quotationObj.quotationDate === undefined ||
      quotationObj.quotationDate === '' ||
      quotationObj.quotMatters === null ||
      quotationObj.quotMatters === undefined ||
      quotationObj.quotMatters === '' ||
      quotationObj.reviewedEmpID === null ||
      quotationObj.reviewedEmpID === undefined ||
      quotationObj.reviewedEmpID === '' ||
      quotationObj.termsAndConditionsID === null ||
      quotationObj.termsAndConditionsID === undefined ||
      quotationObj.termsAndConditionsID === '' ||
      quotationObj.termsAndConditions === null ||
      quotationObj.termsAndConditions === undefined ||
      quotationObj.termsAndConditions === ''
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    const apiParam = {
      userKeyID: user.userKeyID,
      quotationKeyID: location.state?.quotationKeyID || quotationObj.quotationKeyID,

      leadKeyID: location.state.leadKeyID || quotationObj.leadKeyID,


      isSendForApproval: true,
      validFor: null,
      address: quotationObj.address,
      quotationFormatID: quotationObj.quotationFormatID,
      quotationProductMapping: quotationObj.quotationProductMapping,
      requirement: quotationObj.requirement,
      quotationDate: quotationObj.quotationDate,
      leadName: quotationObj.leadName,
      quotationNumberFormatID: quotationObj.quotationNumberFormatID,
      reviewedEmpID: quotationObj.reviewedEmpID,
      termsAndConditionsID: quotationObj.termsAndConditionsID,
      termsAndConditions: quotationObj.termsAndConditions,
      quotMatters: quotationObj.quotMatters,
    };

    if (!isValid) {
      AddUpdateQuotationData(apiParam);
    }
  };

  return (
    <>
      <div className="card ">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <div className="mb-3">
                <label htmlFor="leadName" className="form-label">
                  Quotation No Format <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  placeholder="Select Quotation No Format"
                  options={quotationNoFormatOption}
                  value={quotationNoFormatOption.find((item) => item.value === quotationObj.quotationNumberFormatID)}
                  onChange={handleQuotationNoFormat}
                  menuPosition="fixed"
                />

                {error &&
                  (quotationObj.quotationNumberFormatID === null ||
                    quotationObj.quotationNumberFormatID === undefined ||
                    quotationObj.quotationNumberFormatID === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <label htmlFor="leadName" className="form-label">
                  Reviewed By<span style={{ color: 'red' }}>*</span>
                </label>

                <Select
                  placeholder="Select Reviewer"
                  options={reviewEmpOption}
                  value={reviewEmpOption.find((item) => item.value == quotationObj.reviewedEmpID)}
                  onChange={handleReviewedEmp}
                  menuPosition="fixed"
                />
                {error &&
                  (quotationObj.reviewedEmpID === null || quotationObj.reviewedEmpID === undefined || quotationObj.reviewedEmpID === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <label htmlFor="leadName" className="form-label">
                  Quotation Format<span style={{ color: 'red' }}>*</span>
                </label>

                <Select
                  placeholder="Select Quotation Format"
                  options={quotationFormatOption}
                  value={quotationFormatOption.find((item) => item.value === quotationObj.quotationFormatID)}
                  onChange={handleQouteFormat}
                  menuPosition="fixed"
                />

                {error &&
                  (quotationObj.quotationFormatID === null ||
                    quotationObj.quotationFormatID === undefined ||
                    quotationObj.quotationFormatID === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>

            <div className="col-md-3">
              <div className="mb-3">
                <label htmlFor="leadName" className="form-label">
                  Quotation Date<span style={{ color: 'red' }}>*</span>
                </label>
                <DatePicker
                  value={quotationObj?.quotationDate} // Use "selected" instead of "value"
                  onChange={handleDateChange}
                  label="From Date"
                  clearIcon={null}
                  popperPlacement="bottom-start"
                />

                {error &&
                  (quotationObj.quotationDate === null || quotationObj.quotationDate === undefined || quotationObj.quotationDate === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-3">
              <div className="mb-3">
                <label htmlFor="leadName" className="form-label">
                  Lead Name<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={quotationObj.leadName}
                  placeholder="Enter Lead Name"
                  onChange={(e) => {
                    setErrorMessage(false);
                    let inputValue = e.target.value;

                    // Prevent input if empty or only a leading space
                    if (inputValue.length === 0 || (inputValue.length === 1 && inputValue === ' ')) {
                      inputValue = '';
                    }

                    // Remove unwanted characters (allow letters, numbers, spaces)
                    const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                    // Trim only leading spaces
                    const trimmedValue = cleanedValue.trimStart();

                    // Capitalize first letter of every word
                    const updatedValue = trimmedValue
                      .split(' ')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');

                    setQuotationObj((prev) => ({
                      ...prev,
                      leadName: updatedValue
                    }));
                  }}
                />
                {error && (quotationObj.leadName === null || quotationObj.leadName === undefined || quotationObj.leadName === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <label htmlFor="leadName" className="form-label">
                  Lead Address<span style={{ color: 'red' }}>*</span>
                </label>
                <textarea
                  value={quotationObj.address}
                  className="form-control"
                  placeholder="Lead Address"
                  onChange={(e) => {
                    setErrorMessage(false);
                    let inputValue = e.target.value;

                    // Prevent input if empty or only a leading space
                    if (inputValue.length === 0 || (inputValue.length === 1 && inputValue === ' ')) {
                      inputValue = '';
                    }

                    // Remove unwanted characters (allow letters, numbers, spaces)
                    const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                    // Trim only leading spaces
                    const trimmedValue = cleanedValue.trimStart();

                    // Capitalize first letter of every word
                    const updatedValue = trimmedValue
                      .split(' ')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');

                    setQuotationObj((prev) => ({
                      ...prev,
                      address: updatedValue
                    }));
                  }}
                ></textarea>

                {error && (quotationObj.address === null || quotationObj.address === undefined || quotationObj.address === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="col-md-3">
              {' '}
              <div className="mb-3">
                <label htmlFor="leadName" className="form-label">
                  Lead Description<span style={{ color: 'red' }}>*</span>
                </label>
                <textarea
                  value={quotationObj.requirement}
                  className="form-control"
                  placeholder="Lead Description"
                  onChange={(e) => {
                    setErrorMessage(false);
                    let inputValue = e.target.value;

                    // Prevent input if empty or only a leading space
                    if (inputValue.length === 0 || (inputValue.length === 1 && inputValue === ' ')) {
                      inputValue = '';
                    }

                    // Remove unwanted characters (allow letters, numbers, spaces)
                    const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                    // Trim only leading spaces
                    const trimmedValue = cleanedValue.trimStart();

                    // Capitalize first letter of every word
                    const updatedValue = trimmedValue
                      .split(' ')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');

                    setQuotationObj((prev) => ({
                      ...prev,
                      requirement: updatedValue
                    }));
                  }}
                ></textarea>

                {error &&
                  (quotationObj.requirement === null || quotationObj.requirement === undefined || quotationObj.requirement === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>

            <div className="col-md-3">
              <div className="mb-3">
                <label htmlFor="leadName" className="form-label">
                  Select Terms & Condition<span style={{ color: 'red' }}>*</span>
                </label>

                <Select
                  placeholder="Select Terms & Condition"
                  options={termsConditionOption}
                  value={termsConditionOption?.find((item) => item.value === quotationObj?.termsAndConditionsID)}
                  onChange={handleTermsAndConditions}
                  menuPosition="fixed"
                />
                {error &&
                  (quotationObj.termsAndConditionsID === null ||
                    quotationObj.termsAndConditionsID === undefined ||
                    quotationObj.termsAndConditionsID === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="leadName" className="form-label">
                  Quotation Matter<span style={{ color: 'red' }}>*</span>
                </label>
                <Text_Editor editorState={quotationObj.quotMatters} handleContentChange={handleQuotationMatterChange} />

                {error &&
                  (quotationObj.quotMatters === null || quotationObj.quotMatters === undefined || quotationObj.quotMatters === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="leadName" className="form-label">
                  Terms & Condition<span style={{ color: 'red' }}>*</span>
                </label>
                <Text_Editor editorState={quotationObj.termsAndConditions} handleContentChange={handleTermsAndConditionsChange} />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end mb-2">
            <button onClick={addUpdateProductModal} className="btn text-white" style={{ background: '#ffaa33' }}>
              + Add Product
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>Manufacturer Name</th>
                  <th>Rating</th>
                  <th>Model Name</th>
                  <th>Quantity</th>
                  <th>Rate  (₹)</th>
                  {quotationObj.quotationFormatID === 2 && <th>Discount  (₹)</th>}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>

                {quotationObj?.quotationProductMapping?.length > 0 ? (
                  quotationObj.quotationProductMapping.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.productName}</td>
                      <td>{item.manufacturerName}</td>
                      <td>{item.variantName}</td>
                      <td>{item.modelName}</td>
                      <td>{item.quantity}{" "}{item.unit}</td>
                      <td>{item.rate} </td>
                      {quotationObj.quotationFormatID === 2 && (
                        <td>
                          {item.discount
                            ? `${item.discount} `
                            : `
                 ${item.rate}`}
                        </td>
                      )}

                      <td>
                        <Tooltip title="Update Product">
                          <button onClick={() => handleEdit(item, index)} className="btn btn-warning btn-sm me-2">
                            <i class="fa-solid fa-pencil"></i>
                          </button>
                        </Tooltip>
                        <Tooltip title="Delete Product">
                          <button onClick={() => handleDelete(index)} className="btn btn-danger btn-sm">
                            <i class="fa-solid fa-trash"></i>{' '}
                          </button>
                        </Tooltip>
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <td colSpan="9" className="text-center">


                        No products added yet.
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="9" className="text-center">
                        {error && (!Array.isArray(quotationObj?.quotationProductMapping) || quotationObj?.quotationProductMapping.length === 0) && (
                          <span style={{ color: 'red' }}>Please add at least one product</span>
                        )}

                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
            {/* ✅ Buttons at bottom with spacing */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                padding: '16px',
                justifyContent: 'center', // ✅ center the buttons
                flexWrap: 'wrap',
                backgroundColor: '#f9f9f9',
                borderTop: '1px solid #ddd',
                position: 'sticky',
                bottom: 0,
                zIndex: 5
              }}
            >
              {state.action !== 'revisionBtnQuote' &&

                <button className="btn text-white" style={{ background: '#ffaa33' }} onClick={saveAsDraftBtn}>
                  Save As Draft
                </button>
              }

              <button className="btn  text-white" style={{ background: '#ffaa33' }} onClick={handle_Submit_Send_For_Approval}>
                Submit & Send For Approval
              </button>
              <button style={{ background: '#ffaa33' }} className="btn text-white" onClick={handlePreview}>
                Preview Quotation
              </button>
            </div>
          </div>

          <ProductQuotationAddUpdateModal
            show={showAddUpdateProductQuotationModal}
            onHide={() => setShowAddUpdateProductQuotationModal(false)}
            modelRequestData={modelRequestData}
            onSave={handleAddOrUpdateProduct}
            editIndex={editIndex}
            productTypeOption={productTypeOption}
            manufactureOption={manufactureOption}
            variantOption={variantOption}
            modelOption={modelOption}
            quotationProductList={quotationObj.quotationProductMapping} // 👈 add this
          />
        </div>
        {showSuccessModal && (
          <SuccessPopupModal
            show={showSuccessModal}
            onHide={() => closeAllModal()}
            setShowSuccessModal={setShowSuccessModal}
            modelAction={modelAction}
          />
        )}
      </div>
    </>
  );
};

export default QuotationFormatWithProduct;
