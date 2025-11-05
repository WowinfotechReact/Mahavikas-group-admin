



import Text_Editor from 'component/Text_Editor';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import { Tooltip } from '@mui/material';
import 'react-date-picker/dist/DatePicker.css';
import { GetEmployeeLookupList } from 'services/Employee Staff/EmployeeApi';
import { GetLeadLookupList, GetquotationFormatLookupList } from 'services/LeadAPI/LeadApi';
import { GetTermsAndConditionsLookupList } from 'services/Terms And Condition/TermsConditionApi';
import { useLocation, useNavigate } from 'react-router';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { ConfigContext } from 'context/ConfigContext';
import SuccessPopupModal from 'component/SuccessPopupModal';
import OemProductAddUpdateModal from './OemProductAddUpdateModal';
import { GetOEMLookupList } from 'services/Original Equipment Manufacturer/OriginalEquipmentManufacturerApi';
import { AddUpdateOEMPurchaseOrder, GetOEMPurchaseOrderModel } from 'services/Original Equipment Manufacturer/OEMPurchaseOrderApi';
import OemMasterAddUpdateModal from '../OEM Master/OemMasterAddUpdateModal';
const OemProductDetails = () => {
      const [modelRequestData, setModelRequestData] = useState({});
      const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
      const [editIndex, setEditIndex] = useState(null); // null for add
      const [productTypeOption, setProductTypeOption] = useState([]);
      const [manufactureOption, setManufactureOption] = useState([]);
      const [termsConditionOption, setTermsConditionOption] = useState([]);

      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [variantOption, setVariantOption] = useState([]);
      const [modelOption, setModelOption] = useState([]);
      const [oemOption, setOemOption] = useState([]);
      const [reviewEmpOption, setReviewEmpOption] = useState([]);
      const [leadOption, setLeadOption] = useState([]);
      const [error, setErrors] = useState(null);
      const [quotationFormatOption, setQuotationFormatOption] = useState([]);
      const [openProductModal, setOpenProductModal] = useState(false);

      const [errorMessage, setErrorMessage] = useState(false);
      const [showAddUpdateProductQuotationModal, setShowAddUpdateProductQuotationModal] = useState(false);
      const { setLoader, user } = useContext(ConfigContext);
      const location = useLocation();
      const [modelAction, setModelAction] = useState(false);
      const [oemQuotationObj, setOemQuotationObj] = useState({
            userKeyID: null,
            oemPurchaseOrderKeyID: null,
            oemid: null,
            validInDays: null,
            purchaseOrderDate: null,
            termsAndConditionsID: null,
            termsAndConditions: null,
            oempoProductMappingList: []
      });

      useEffect(() => {
            if (location.state?.quotationKeyID !== undefined) {
                  if (location.state?.quotationKeyID !== null) {
                        GetOEMPurchaseOrderModelData(location.state?.quotationKeyID);
                  }
            }
      }, [location]);
      useEffect(() => {
            GetQuotationNumberFormatLookupListData();
      }, []);
      useEffect(() => {
            if (isAddUpdateActionDone) {

                  GetQuotationNumberFormatLookupListData();
            }
            setIsAddUpdateActionDone(false)
      }, [isAddUpdateActionDone]);
      useEffect(() => {
            const incoming = location.state?.oemQuotationObj || {};
            setOemQuotationObj((prev) => ({
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
                  const response = await GetOEMLookupList(); // Ensure this function is imported correctly

                  if (response?.data?.statusCode === 200) {
                        const quotationNoFormat = response?.data?.responseData?.data || [];

                        const formattedQuotationNoFormatList = quotationNoFormat.map((roleType) => ({
                              value: roleType.oemid,
                              label: roleType.oemName
                        }));

                        setOemOption(formattedQuotationNoFormatList); // Make sure you have a state setter function for IVR list
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
            if (location?.state?.oemPurchaseOrderKeyID) {

                  GetOEMPurchaseOrderModelData(location?.state?.oemPurchaseOrderKeyID); // 1. Get model data
            }

            GetQuotationNumberFormatLookupListData(); // 2. Lookup for number format
            GetEmployeeLookupListData(); // 3. Lookup for employee
      }, []);

      useEffect(() => {
            if (
                  oemQuotationObj?.oemid &&
                  oemOption.length > 0 &&
                  !oemQuotationObj?.oemName
            ) {
                  const matchedFormat = oemOption.find(
                        (item) => item.value === oemQuotationObj.oemid
                  );

                  if (matchedFormat) {
                        setOemQuotationObj((prev) => ({
                              ...prev,
                              oemName: matchedFormat.label,
                        }));
                  }
            }

            if (
                  oemQuotationObj?.reviewedEmpID &&
                  reviewEmpOption.length > 0 &&
                  !oemQuotationObj?.reviewedEmployeeBy
            ) {
                  const matchedEmp = reviewEmpOption.find(
                        (item) => item.value === oemQuotationObj.reviewedEmpID
                  );

                  if (matchedEmp) {
                        setOemQuotationObj((prev) => ({
                              ...prev,
                              reviewedEmployeeBy: matchedEmp.label,
                        }));
                  }
            }
      }, [oemQuotationObj?.oemid, oemQuotationObj?.reviewedEmpID, oemOption, reviewEmpOption]);


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

      const handleQuotationNoFormat = (selectedOption) => {
            setOemQuotationObj((prev) => ({
                  ...prev,
                  oemid: selectedOption?.value || null,
                  oemName: selectedOption?.label || null
            }));
      };
      useEffect(() => {
            handleQuotationNoFormat()
            GetTermsAndConditionsLookupListData()
      }, [])





      const handleTermsAndConditionsChange = (htmlContent) => {
            setOemQuotationObj((obj) => ({
                  ...obj,
                  termsAndConditions: htmlContent
            }));
      };

      const handleDateChange = (date) => {
            setOemQuotationObj((prevState) => ({
                  ...prevState,
                  purchaseOrderDate: date // Update state with selected date
            }));
      };

      useEffect(() => {
            if (state?.oemQuotationObj) {
                  console.log('Before debugger');
                  // debugger;
                  console.log('After debugger');
                  setOemQuotationObj((prev) => ({
                        ...prev,
                        ...state.oemQuotationObj
                  }));
            }
      }, [state]);

      const GetOEMPurchaseOrderModelData = async (id) => {

            if (id === undefined) {
                  return;
            }
            setLoader(true);

            try {
                  const data = await GetOEMPurchaseOrderModel(id);
                  if (data?.data?.statusCode === 200) {
                        setLoader(false);
                        const ModelData = data.data.responseData.data; // Assuming data is an array
                        console.log(ModelData, '333rrrttt');

                        setOemQuotationObj({
                              ...oemQuotationObj,
                              oemPurchaseOrderKeyID: ModelData.oemPurchaseOrderKeyID,

                              validInDays: ModelData.validInDays,
                              termsAndConditionsID: ModelData.termsAndConditionsID,

                              purchaseOrderDate: ModelData.purchaseOrderDate,

                              oemid: ModelData.oemid,
                              termsAndConditions: ModelData.termsAndConditions,

                              oempoProductMappingList: ModelData.oempoProductMappingList
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
      const addUpdateProductModal = () => {
            let isValid = false;
            // debugger 

            if (

                  oemQuotationObj.purchaseOrderDate === null ||
                  oemQuotationObj.purchaseOrderDate === undefined ||
                  oemQuotationObj.purchaseOrderDate === '' ||


                  oemQuotationObj.termsAndConditionsID === null ||
                  oemQuotationObj.termsAndConditionsID === undefined ||
                  oemQuotationObj.termsAndConditionsID === '',
                  oemQuotationObj.validInDays === null ||
                  oemQuotationObj.validInDays === undefined ||
                  oemQuotationObj.validInDays === '',

                  oemQuotationObj.termsAndConditions === null ||
                  oemQuotationObj.termsAndConditions === undefined ||
                  oemQuotationObj.termsAndConditions === ''
            ) {
                  setErrors(true);
                  isValid = true;
            } else {
                  setErrors(false);
                  isValid = false;
            }

            setModelRequestData({
                  quotationFormatID: oemQuotationObj.quotationFormatID,
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




      const handleEdit = (item, index) => {
            setModelRequestData({
                  ...item,
                  quotationFormatID: oemQuotationObj.quotationFormatID || null
            });

            setEditIndex(index);
            setShowAddUpdateProductQuotationModal(true);
      };


      const handleTermsAndConditions = (selectedOption) => {
            setOemQuotationObj((prev) => ({
                  ...prev,
                  termsAndConditionsID: selectedOption?.value || null,
                  termsAndConditions: selectedOption?.termsAndConditions || '' // ✅ set label content into editor
            }));
      };
      const handleDelete = (index) => {
            setOemQuotationObj((prev) => {
                  const updatedList = [...prev.oempoProductMappingList];
                  updatedList.splice(index, 1);
                  return {
                        ...prev,
                        oempoProductMappingList: updatedList
                  };
            });
      };

      const handleAddOrUpdateProduct = (product, index) => {
            const updatedList = [...(oemQuotationObj.oempoProductMappingList || [])];

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

            setOemQuotationObj((prev) => ({
                  ...prev,
                  oempoProductMappingList: updatedList
            }));

            setEditIndex(null);
      };

      const oemMasterCustomerBtnClick = () => {
            setModelRequestData({ Action: null, oemKeyID: null });
            setOpenProductModal(true);

      }

      const AddUpdateQuotationData = async (apiParam) => {
            setLoader(true);
            try {
                  let url = '/AddUpdateOEMPurchaseOrder'; // Default URL for Adding Data

                  const response = await AddUpdateOEMPurchaseOrder(url, apiParam);
                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false);
                              setShowSuccessModal(true);
                              setModelAction(location.state.Action === null ? 'OEM purchased order has been added successfully' : 'OEM purchased order has been updated successfully');

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
            navigate('/original-equipment-manufacturer-Purchased-order-list');
      };

      const handle_Submit_Send_For_Approval = () => {
            let isValid = false;

            if (
                  oemQuotationObj.oempoProductMappingList === null ||
                  oemQuotationObj.oempoProductMappingList === undefined ||
                  !Array.isArray(oemQuotationObj.oempoProductMappingList) ||
                  oemQuotationObj.oempoProductMappingList.length === 0 ||
                  oemQuotationObj.oemid === null ||
                  oemQuotationObj.oemid === undefined ||
                  oemQuotationObj.oemid === '' ||
                  oemQuotationObj.purchaseOrderDate === null ||
                  oemQuotationObj.purchaseOrderDate === undefined ||
                  oemQuotationObj.purchaseOrderDate === '' ||
                  oemQuotationObj.validInDays === null ||
                  oemQuotationObj.validInDays === undefined ||
                  oemQuotationObj.validInDays === '' ||
                  oemQuotationObj.termsAndConditionsID === null ||
                  oemQuotationObj.termsAndConditionsID === undefined ||
                  oemQuotationObj.termsAndConditionsID === '' ||

                  oemQuotationObj.termsAndConditions === null ||
                  oemQuotationObj.termsAndConditions === undefined ||
                  oemQuotationObj.termsAndConditions === ''
            ) {
                  setErrors(true);
                  isValid = true;
            } else {
                  setErrors(false);
                  isValid = false;
            }

            const apiParam = {
                  userKeyID: user.userKeyID,

                  validInDays: oemQuotationObj.validInDays,
                  termsAndConditionsID: oemQuotationObj.termsAndConditionsID,

                  oempoProductMappingList: oemQuotationObj.oempoProductMappingList,

                  oemPurchaseOrderKeyID: oemQuotationObj.oemPurchaseOrderKeyID,
                  purchaseOrderDate: oemQuotationObj.purchaseOrderDate,
                  oemid: oemQuotationObj.oemid,
                  termsAndConditions: oemQuotationObj.termsAndConditions,
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
                                    <div className="col-md-6">
                                          <div className="row">
                                                {/* OEM Select */}
                                                <div className="col-md-12 mb-3">
                                                      <div className="d-flex justify-content-between align-items-center">
                                                            <label htmlFor="leadName" className="form-label mb-0">
                                                                  Select OEM <span style={{ color: 'red' }}>*</span>
                                                            </label>
                                                            <span

                                                                  onClick={
                                                                        oemMasterCustomerBtnClick
                                                                  }
                                                                  style={{ fontSize: '14px', textDecoration: 'underline', color: '#0d6efd', cursor: 'pointer' }}
                                                            >
                                                                  Add OEM Customer
                                                            </span>
                                                      </div>

                                                      <Select
                                                            placeholder="Select OEM"
                                                            options={oemOption}
                                                            value={oemOption.find((item) => item.value === oemQuotationObj.oemid)}
                                                            onChange={handleQuotationNoFormat}
                                                            menuPosition="fixed"
                                                      />

                                                      {error &&
                                                            (oemQuotationObj.oemid === null ||
                                                                  oemQuotationObj.oemid === undefined ||
                                                                  oemQuotationObj.oemid === '') ? (
                                                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                      ) : (
                                                            ''
                                                      )}
                                                </div>




                                                <div className="col-md-6 mb-3">

                                                      <label htmlFor="leadName" className="form-label">
                                                            PO Date<span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <DatePicker
                                                            value={oemQuotationObj?.purchaseOrderDate} // Use "selected" instead of "value"
                                                            onChange={handleDateChange}
                                                            label="From Date"
                                                            clearIcon={null}
                                                            popperPlacement="bottom-start"
                                                      />

                                                      {error &&
                                                            (oemQuotationObj.purchaseOrderDate === null || oemQuotationObj.purchaseOrderDate === undefined || oemQuotationObj.purchaseOrderDate === '') ? (
                                                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                      ) : (
                                                            ''
                                                      )}
                                                </div>



                                                <div className="col-md-6 mb-3">
                                                      {' '}

                                                      <label htmlFor="leadName" className="form-label">
                                                            Valid For (In Days)<span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <input
                                                            value={oemQuotationObj.validInDays}
                                                            className="form-control"
                                                            placeholder="Enter Days"
                                                            onChange={(e) => {
                                                                  setErrorMessage(false);
                                                                  let inputValue = e.target.value;

                                                                  // Remove all non-digit characters
                                                                  const cleanedValue = inputValue.replace(/\D/g, '');

                                                                  setOemQuotationObj((prev) => ({
                                                                        ...prev,
                                                                        validInDays: cleanedValue
                                                                  }));
                                                            }}
                                                      />

                                                      {error && (oemQuotationObj.validInDays === null || oemQuotationObj.validInDays === undefined || oemQuotationObj.validInDays === '') ? (
                                                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                      ) : (
                                                            ''
                                                      )}
                                                </div>
                                          </div>
                                    </div>
                                    <div className="col-md-6">
                                          <div className="mb-3">
                                                <label htmlFor="leadName" className="form-label">
                                                      Select   Terms & Condition<span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <Select
                                                      placeholder="Select Terms & Condition"
                                                      options={termsConditionOption}
                                                      value={termsConditionOption?.find((item) => item.value === oemQuotationObj.termsAndConditionsID)}
                                                      onChange={handleTermsAndConditions}
                                                      menuPosition="fixed"
                                                />
                                                {error && (oemQuotationObj.termsAndConditionsID === null || oemQuotationObj.termsAndConditionsID === undefined || oemQuotationObj.termsAndConditionsID === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </div>
                                          <div className="mb-3">
                                                <label htmlFor="leadName" className="form-label">
                                                      Terms & Condition<span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <Text_Editor editorState={oemQuotationObj.termsAndConditions} handleContentChange={handleTermsAndConditionsChange} />
                                                {error && (oemQuotationObj.termsAndConditions === null || oemQuotationObj.termsAndConditions === undefined || oemQuotationObj.termsAndConditions === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
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
                                                      {oemQuotationObj.quotationFormatID === 2 && <th>Discount  (₹)</th>}
                                                      <th>Action</th>
                                                </tr>
                                          </thead>
                                          <tbody>

                                                {oemQuotationObj?.oempoProductMappingList?.length > 0 ? (
                                                      oemQuotationObj.oempoProductMappingList.map((item, index) => (
                                                            <tr key={index}>
                                                                  <td>{index + 1}</td>
                                                                  <td>{item.productName}</td>
                                                                  <td>{item.manufacturerName}</td>
                                                                  <td>{item.variantName}</td>
                                                                  <td>{item.modelName}</td>
                                                                  <td>{item.quantity}{" "}{item.unit}</td>
                                                                  <td>
                                                                        {new Intl.NumberFormat('en-IN', {
                                                                              style: 'decimal',
                                                                              maximumFractionDigits: 0,
                                                                              minimumFractionDigits: 0
                                                                        }).format(Math.round(item.rate))}
                                                                  </td>
                                                                  {oemQuotationObj.quotationFormatID === 2 && (
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
                                                                        {error && (!Array.isArray(oemQuotationObj?.oempoProductMappingList) || oemQuotationObj?.oempoProductMappingList.length === 0) && (
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


                                          <button className="btn  text-white" style={{ background: '#ffaa33' }} onClick={handle_Submit_Send_For_Approval}>


                                                {location?.state?.Action === null ? "Add Purchased Order" : "Update Purchased Order"}
                                          </button>

                                    </div>
                              </div>

                              <OemProductAddUpdateModal
                                    show={showAddUpdateProductQuotationModal}
                                    onHide={() => setShowAddUpdateProductQuotationModal(false)}
                                    modelRequestData={modelRequestData}
                                    onSave={handleAddOrUpdateProduct}
                                    editIndex={editIndex}
                                    productTypeOption={productTypeOption}
                                    manufactureOption={manufactureOption}
                                    variantOption={variantOption}
                                    modelOption={modelOption}
                                    quotationProductList={oemQuotationObj.oempoProductMappingList} // 👈 add this
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

                        {openProductModal && (
                              <OemMasterAddUpdateModal
                                    show={openProductModal}
                                    onHide={() => setOpenProductModal(false)}
                                    modelRequestData={modelRequestData}
                                    setModelRequestData={setModelRequestData}
                                    setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                              />
                        )}
                  </div>
            </>
      );
};

export default OemProductDetails;
