





import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import Text_Editor from 'component/Text_Editor';
import { GetProductLookupList } from 'services/Product/ProductApi';
import { GetManufacturerLookupList, GetModelLookupList } from 'services/Model/ModelListAPI';
import { GetVariantLookupList } from 'services/Master Crud/VariantAPI';
const InvoiceProductAddUpdateModal = ({ show, onHide, modelRequestData,
      quotationProductList,
      onSave,
      productData,
      editIndex, }) => {


      console.log(modelRequestData, 'dosauhdusaoidsa');
      // console.log(quotationProductList, 'dosauhdusaoidsa');
      const [rateError, setRateError] = useState("");
      const [discountError, setDiscountError] = useState('');

      const [modelAction, setModelAction] = useState('');
      const [error, setErrors] = useState(null);

      const [productTypeOption, setProductTypeOption] = useState([]);
      const [manufactureOption, setManufactureOption] = useState([]);
      const [variantOption, setVariantOption] = useState([]);
      const [modelOption, setModelOption] = useState([]);
      const { setLoader, user, companyID } = useContext(ConfigContext);

      const [quotationProductObj, setQuotationProductObj] = useState({
            quotProductMapID: null,
            productID: null,
            manufacturerID: null,
            variantID: null,
            modelID: null,
            unit: null,
            quantity: null,
            rate: null,
            discount: null,
            scopeOfSupply: null,
            warranty: null
      });





      // Individual change handlers
      const handleModelChange = (selectedOption) => {
            setQuotationProductObj((prev) => ({
                  ...prev,
                  modelID: selectedOption?.value || null,
                  modelName: selectedOption?.label,
                  rate: selectedOption.rate,
                  scopeOfSupply: selectedOption.scopeOfSupply,
                  warranty: selectedOption.warranty,
                  modelDescription: selectedOption.modelDescription,
            }));

      };

      const handleRatingChange = async (selectedOption) => {
            const selectedVariantID = selectedOption?.value || null;

            setQuotationProductObj((prev) => {
                  const updatedObj = {
                        ...prev,
                        variantID: selectedVariantID,
                        variantName: selectedOption?.label || '',
                        description: selectedOption?.description || '',
                        modelDescription: selectedOption?.modelDescription || '',
                  };

                  return updatedObj;
            });

            // Only fetch model list if all required IDs are present
            const { productID, manufacturerID } = quotationProductObj;

            if (productID && manufacturerID && selectedVariantID) {
                  await GetModelLookupListData(manufacturerID, productID, selectedVariantID);
            } else {
                  setModelOption([]); // Clear model options if dependencies are not satisfied
            }
      };


      const handleManufacturerChange = (selectedOption) => {
            const selectedManufacturerID = selectedOption?.value || null;

            setQuotationProductObj((prev) => {
                  const updatedObj = {
                        ...prev,
                        manufacturerID: selectedManufacturerID,
                        manufacturerName: selectedOption?.label || '',
                  };

                  // Fetch variants only if productID is already selected
                  if (prev.productID && selectedManufacturerID) {
                        GetVariantLookupListData(selectedManufacturerID, prev.productID);
                  }

                  return updatedObj;
            });
      };

      useEffect(() => {
            const { productID, manufacturerID } = quotationProductObj;
            GetVariantLookupListData(manufacturerID, productID);
      }, [show]);
      const handleProductChange = async (selectedOption) => {
            const selectedProductID = selectedOption?.value || null;

            setQuotationProductObj((prev) => {
                  const updatedObj = {
                        ...prev,
                        productID: selectedProductID,
                        productName: selectedOption?.label || '',
                        hsn: selectedOption?.hsn || '',
                        gstPercentage: selectedOption?.gstPercentage || '',
                        manufacturerID: null,
                        manufacturerName: '',
                  };

                  // Clear variant list
                  setVariantOption([]);

                  return updatedObj;
            });

            await GetManufacturerLookupListData(selectedProductID);
      };



      useEffect(() => {
            GetProductLookupListData();

      }, [show]);

      // Reset form whenever modal opens
      useEffect(() => {
            if (show) {
                  if (editIndex !== null && modelRequestData) {
                        const updatedObj = { ...modelRequestData };

                        // 👇 If Format 2, populate discount = rate
                        if (
                              updatedObj.quotationFormatID === 2 &&
                              updatedObj.rate &&
                              (!updatedObj.discount || updatedObj.discount === '')
                        ) {
                              updatedObj.discount = updatedObj.rate;
                        }

                        setQuotationProductObj(updatedObj);
                  } else {
                        setRateError(false);
                        setQuotationProductObj({
                              quotationFormatID: modelRequestData?.quotationFormatID || null,
                              productID: null,
                              productName: null,
                              discount: null,
                              manufacturerID: null,
                              variantID: null,
                              modelID: null,
                              unit: '',
                              quantity: '',
                              rate: '',
                              discount: '',
                              scopeOfSupply: '',
                              warranty: '',
                        });
                  }
            }
      }, [show, modelRequestData, editIndex]);

      const GetProductLookupListData = async () => {
            try {
                  const response = await GetProductLookupList(); // Ensure this function is imported correctly

                  if (response?.data?.statusCode === 200) {
                        const productTypeLookupList = response?.data?.responseData?.data || [];

                        const formattedProductList = productTypeLookupList.map((roleType) => ({
                              value: roleType.productID,
                              label: roleType.productName,
                              hsn: roleType.hsn,
                              gstPercentage: roleType.gstPercentage,

                        }));

                        setProductTypeOption(formattedProductList); // Make sure you have a state setter function for IVR list
                  } else {
                        console.error('Failed to fetch role Type lookup list:', response?.data?.statusMessage || 'Unknown error');
                  }
            } catch (error) {
                  console.error('Error fetching role Type lookup list:', error);
            }
      };
      useEffect(() => {
            GetManufacturerLookupListData();
      }, [show]);
      const GetManufacturerLookupListData = async (productID) => {


            try {
                  const response = await GetManufacturerLookupList(productID); // Ensure this function is imported correctly

                  if (response?.data?.statusCode === 200) {
                        const manufactureTypeLookupList = response?.data?.responseData?.data || [];

                        const formattedManufactureList = manufactureTypeLookupList.map((roleType) => ({
                              value: roleType.manufacturerID,
                              label: roleType.manufacturerName
                        }));

                        setManufactureOption(formattedManufactureList); // Make sure you have a state setter function for IVR list
                  } else {
                        console.error('Failed to fetch role Type lookup list:', response?.data?.statusMessage || 'Unknown error');
                  }
            } catch (error) {
                  console.error('Error fetching role Type lookup list:', error);
            }
      };
      useEffect(() => {
            GetVariantLookupListData();
      }, [show]);
      const GetVariantLookupListData = async (manufacturerID, productID) => {


            try {
                  const response = await GetVariantLookupList(manufacturerID, productID); // Ensure this function is imported correctly

                  if (response?.data?.statusCode === 200) {
                        const variantTypeLookupList = response?.data?.responseData?.data || [];

                        const formattedManufactureList = variantTypeLookupList.map((roleType) => ({
                              value: roleType.variantID,
                              label: roleType.variantName,
                              description: roleType.description,
                        }));

                        setVariantOption(formattedManufactureList); // Make sure you have a state setter function for IVR list
                  } else {
                        console.error('Failed to fetch role Type lookup list:', response?.data?.statusMessage || 'Unknown error');
                  }
            } catch (error) {
                  console.error('Error fetching role Type lookup list:', error);
            }
      };
      useEffect(() => {
            GetModelLookupListData();
      }, [show]);
      const GetModelLookupListData = async (manufacturerID, productID, variantID) => {
            try {
                  const response = await GetModelLookupList(manufacturerID, productID, variantID); // Ensure this function is imported correctly

                  if (response?.data?.statusCode === 200) {
                        const variantTypeLookupList = response?.data?.responseData?.data || [];

                        const formattedManufactureList = variantTypeLookupList.map((roleType) => ({
                              value: roleType.modelID,
                              label: roleType.modelName,
                              scopeOfSupply: roleType.scopeOfSupply,
                              warranty: roleType.warranty,
                              rate: roleType.rate,
                              modelDescription: roleType.modelDescription,
                        }));

                        setModelOption(formattedManufactureList); // Make sure you have a state setter function for IVR list
                  } else {
                        console.error('Failed to fetch role Type lookup list:', response?.data?.statusMessage || 'Unknown error');
                  }
            } catch (error) {
                  console.error('Error fetching role Type lookup list:', error);
            }
      };



      const AddProductBtnClick = (e) => {
            // debugger
            e?.preventDefault?.(); // optional safety
            let isValid = false;

            const isFormatTwo = modelRequestData?.quotationFormatID === 1;
            // const isFormatTwo = 1;

            setRateError(""); // Clear previous error
            if (discountError) {
                  setErrors(true);
                  return; // ⛔ STOP submission
            }


            if (editIndex === null) {
                  const duplicate = quotationProductList?.some(
                        (item) =>
                              item.productID === quotationProductObj.productID &&
                              item.rate === quotationProductObj.rate
                  );

                  if (duplicate) {
                        setRateError("This product with the same rate is already added.");
                        return;
                  }
            }

            if (
                  quotationProductObj.productID === null || quotationProductObj.productID === undefined || quotationProductObj.productID === '' ||
                  quotationProductObj.manufacturerID === null || quotationProductObj.manufacturerID === undefined || quotationProductObj.manufacturerID === '' ||
                  quotationProductObj.variantID === null || quotationProductObj.variantID === undefined || quotationProductObj.variantID === '' ||
                  quotationProductObj.modelID === null || quotationProductObj.modelID === undefined || quotationProductObj.modelID === '' ||
                  quotationProductObj.unit === null || quotationProductObj.unit === undefined || quotationProductObj.unit === '' ||
                  quotationProductObj.quantity === null || quotationProductObj.quantity === undefined || quotationProductObj.quantity === '' ||
                  (isFormatTwo && (quotationProductObj.rate === null || quotationProductObj.rate === undefined || quotationProductObj.rate === '')) || // 🔁 skip if format is 2
                  (!isFormatTwo && (quotationProductObj.discount === null || quotationProductObj.discount === undefined || quotationProductObj.discount === ''))   // 🔁 skip if format is 2
                  // quotationProductObj.scopeOfSupply === null || quotationProductObj.scopeOfSupply === undefined || quotationProductObj.scopeOfSupply === '' ||
                  // quotationProductObj.warranty === null || quotationProductObj.warranty === undefined || quotationProductObj.warranty === ''
            ) {
                  setErrors(true);
                  isValid = true;
            } else {
                  setErrors(false);
                  isValid = false;
            }



            if (!isValid) {

                  const cleanedProductObj = {
                        ...quotationProductObj,
                        discount: String(quotationProductObj?.discount)?.trim() === '' ? null : quotationProductObj?.discount,
                        rate: String(quotationProductObj?.rate)?.trim() === '' ? null : quotationProductObj?.rate,
                        hsn: String(quotationProductObj?.hsn)?.trim() === '' ? null : quotationProductObj?.hsn,
                        gstPercentage: String(quotationProductObj?.gstPercentage)?.trim() === '' ? null : quotationProductObj?.gstPercentage,
                        quotProductMapID: quotationProductObj?.quotProductMapID ?? null, // Set to null if undefined
                        invoiceTotalAmount: calculateInvoiceTotal(quotationProductObj),
                        // ✅ add this
                        remainingQty: quotationProductObj?.quantity,   // 🟢 user’s new qty saved as remainingQty


                  };


                  const { quotationFormatID, ...finalProductObj } = cleanedProductObj;

                  onSave(finalProductObj, editIndex);

                  onHide(); // close modal
            }
      }
      console.log(modelRequestData, 'duysagoduygsoduasdas');


      const calculateInvoiceTotal = (obj) => {
            const base = obj.discount !== null && obj.discount !== undefined && obj.discount !== ''
                  ? parseFloat(obj.discount) || 0
                  : parseFloat(obj.rate) || 0;

            const qty = parseFloat(obj.quantity) || 0;
            const lineAmount = base * qty;

            const gstPercent = parseFloat(obj.gstPercentage) || 0;
            const gstAmount = (lineAmount * gstPercent) / 100;

            return lineAmount + gstAmount;
      };


      // 👇 Add this useEffect in your component
      useEffect(() => {
            const qty = parseFloat(quotationProductObj.quantity) || 0;
            const rate = parseFloat(quotationProductObj.rate) || 0;
            const discount =
                  quotationProductObj.discount === null || quotationProductObj.discount === ""
                        ? null
                        : parseFloat(quotationProductObj.discount);
            const gst = parseFloat(quotationProductObj.gstPercentage) || 0;

            let baseAmount = 0;

            // ✅ Use discount if valid, otherwise fallback to rate
            if (discount !== null && !isNaN(discount) && discount > 0 && discount <= rate) {
                  baseAmount = qty * discount;
            } else {
                  baseAmount = qty * rate;
            }

            // ✅ Apply GST
            const gstAmount = (baseAmount * gst) / 100;
            const finalAmount = baseAmount + gstAmount;

            setQuotationProductObj((prev) => ({
                  ...prev,
                  invoiceTotalAmount: finalAmount.toFixed(2), // show 2 decimals
            }));
      }, [
            quotationProductObj.quantity,
            quotationProductObj.rate,
            quotationProductObj.discount,
            quotationProductObj.gstPercentage,
      ]);




      return (
            <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
                  <Modal.Header closeButton>
                        <Modal.Title>
                              <h3 className="text-center">
                                    {editIndex !== null ? 'Update Invoice Product' : 'Add Invoice Product'}
                              </h3>

                        </Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
                        <div className="container">
                              <div className="row">
                                    <div className="col-12 col-md-6 mb-2">
                                          <div>
                                                <label htmlFor="productName" className="form-label">
                                                      Product Name
                                                      <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <Select
                                                      isDisabled
                                                      placeholder="Select Product Name"
                                                      options={productTypeOption}
                                                      value={productTypeOption.find((item) => item.value === quotationProductObj.productID) || null}
                                                      onChange={handleProductChange}
                                                      menuPosition="fixed"
                                                />
                                                {error &&
                                                      (quotationProductObj.productID === null ||
                                                            quotationProductObj.productID === undefined ||
                                                            quotationProductObj.productID === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </div>
                                    </div>
                                    <div className="col-12 col-md-6 mb-2">
                                          <div>
                                                <label htmlFor="customerAddress" className="form-label">
                                                      Select Manufacture
                                                      <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <Select
                                                      isDisabled
                                                      placeholder="Select Manufacture"
                                                      options={manufactureOption}
                                                      value={manufactureOption.find((item) => item.value === quotationProductObj.manufacturerID) || null}
                                                      onChange={handleManufacturerChange}
                                                      menuPosition="fixed"
                                                />

                                                {error &&
                                                      (quotationProductObj.manufacturerID === null ||
                                                            quotationProductObj.manufacturerID === undefined ||
                                                            quotationProductObj.manufacturerID === '') ? (
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
                                                <label htmlFor="customerAddress" className="form-label">
                                                      Select Rating
                                                      <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <Select
                                                      isDisabled
                                                      placeholder="Select Rating"
                                                      options={variantOption}
                                                      value={variantOption.find((item) => item.value === quotationProductObj.variantID) || null}
                                                      onChange={handleRatingChange}
                                                      menuPosition="fixed"
                                                />

                                                {error &&
                                                      (quotationProductObj.variantID === null ||
                                                            quotationProductObj.variantID === undefined ||
                                                            quotationProductObj.variantID === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </div>
                                    </div>
                                    <div className="col-12 col-md-6 mb-2">
                                          <div>
                                                <label htmlFor="customerAddress" className="form-label">
                                                      Select Model
                                                      <span style={{ color: 'red' }}>*</span>
                                                </label>

                                                <Select
                                                      isDisabled
                                                      placeholder="Select Model Name"
                                                      options={modelOption}
                                                      value={modelOption.find((item) => item.value === quotationProductObj.modelID) || null}
                                                      onChange={handleModelChange}
                                                      menuPosition="fixed"
                                                />

                                                {error &&
                                                      (quotationProductObj.modelID === null ||
                                                            quotationProductObj.modelID === undefined ||
                                                            quotationProductObj.modelID === '') ? (
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
                                                <label htmlFor="price" className="form-label">
                                                      Price
                                                      <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <input

                                                      maxLength={7}
                                                      type="text"
                                                      className="form-control"
                                                      id="price"
                                                      disabled
                                                      placeholder="Enter Price"
                                                      value={quotationProductObj.rate}
                                                      onChange={(e) => {
                                                            const inputValue = e.target.value;

                                                            // Allow only numbers and at most one dot
                                                            const validValue = inputValue.replace(/[^0-9.]/g, '');

                                                            // Prevent more than one dot
                                                            const normalizedValue = validValue.split('.').length > 2
                                                                  ? validValue.substring(0, validValue.lastIndexOf('.'))
                                                                  : validValue;

                                                            setQuotationProductObj((prev) => ({
                                                                  ...prev,
                                                                  rate: normalizedValue
                                                            }));
                                                      }}
                                                />
                                                {rateError && (
                                                      <span style={{ color: 'red' }}>
                                                            {rateError}
                                                      </span>
                                                )}

                                                {error && (
                                                      <>
                                                            {(!quotationProductObj?.rate || quotationProductObj?.rate === '' || quotationProductObj?.rate === undefined) && (
                                                                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                            )}
                                                      </>
                                                )}
                                          </div>
                                    </div>
                                    {modelRequestData?.quotationFormatID === 2 &&
                                          <div className="col-12 col-md-6 mb-2">
                                                <div>
                                                      <label htmlFor="discount" className="form-label">
                                                            Discounted Price
                                                            <span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <input
                                                            maxLength={5}
                                                            type="text"
                                                            disabled
                                                            className="form-control"
                                                            id="discount"
                                                            placeholder="Enter Discounted Price "
                                                            value={quotationProductObj.discount || null}
                                                            onChange={(e) => {
                                                                  const inputValue = e.target.value;
                                                                  const cleanedValue = inputValue
                                                                        .replace(/\s+/g, '') // Remove spaces
                                                                        .replace(/[^0-9.]/g, '') // Allow only numbers and dot
                                                                        .replace(/\.{2,}/g, '.'); // Prevent multiple dots

                                                                  const discount = parseFloat(cleanedValue);
                                                                  const rate = parseFloat(quotationProductObj.rate) || null;

                                                                  if (!isNaN(discount) && discount > rate) {
                                                                        setDiscountError('Discount cannot be greater than Rate');
                                                                  } else {
                                                                        setDiscountError('');
                                                                  }

                                                                  setQuotationProductObj((prev) => ({
                                                                        ...prev,
                                                                        discount: cleanedValue
                                                                  }));
                                                            }}
                                                      />
                                                      {discountError && (
                                                            <span style={{ color: 'red', fontSize: '13px' }}>{discountError}</span>
                                                      )}

                                                      {error && (
                                                            <>
                                                                  {(!quotationProductObj.discount || quotationProductObj.discount.trim() === '') && (
                                                                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                                  )}
                                                            </>
                                                      )}
                                                </div>
                                          </div>
                                    }

                              </div>
                              <div className="row">
                                    <div className="col-12 col-md-6 mb-2">
                                          <div>
                                                <label htmlFor="mobileNo" className="form-label">
                                                      Quantity
                                                      <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <input
                                                      maxLength={3}
                                                      type="text"
                                                      className="form-control"
                                                      id="mobileNo"
                                                      placeholder="Enter Quantity"
                                                      aria-describedby="Employee"
                                                      value={quotationProductObj.quantity}
                                                      onChange={(e) => {
                                                            const inputValue = e.target.value;

                                                            // Allow only numbers
                                                            let validValue = inputValue.replace(/[^0-9]/g, '');

                                                            // Convert to number
                                                            let numValue = parseInt(validValue || 0, 10);

                                                            // Get original max qty from product data
                                                            const maxQty = modelRequestData?.remainingQty ?? modelRequestData?.quantity ?? 0;

                                                            // Restrict qty not greater than max
                                                            if (numValue > maxQty) {
                                                                  numValue = maxQty;
                                                            }

                                                            const updated = { ...quotationProductObj, quantity: numValue };
                                                            updated.invoiceTotalAmount = calculateInvoiceTotal(updated);

                                                            setQuotationProductObj(updated);
                                                      }}
                                                />


                                                {error && (
                                                      <>
                                                            {(!quotationProductObj?.quantity) && (
                                                                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                            )}
                                                      </>
                                                )}
                                          </div>
                                    </div>
                                    <div className="col-12 col-md-6 mb-2">
                                          <div>
                                                <label htmlFor="mobileNo" className="form-label">
                                                      Unit
                                                      <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <input
                                                      disabled
                                                      maxLength={6}
                                                      type="text"
                                                      className="form-control"
                                                      id="mobileNo"
                                                      placeholder="Enter Unit"
                                                      aria-describedby="Employee"
                                                      value={quotationProductObj.unit}
                                                      onChange={(e) => {
                                                            const inputValue = e.target.value;

                                                            // Keep only alphabets and optional spaces (if you want)
                                                            const onlyLetters = inputValue.replace(/[^a-zA-Z ]/g, '');

                                                            setQuotationProductObj((prev) => ({
                                                                  ...prev,
                                                                  unit: onlyLetters
                                                            }));
                                                      }}
                                                />

                                                {error && (
                                                      <>
                                                            {(!quotationProductObj.unit || quotationProductObj.unit.trim() === '') && (
                                                                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                            )}
                                                      </>
                                                )}
                                          </div>
                                    </div>


                                    <div className="col-12 col-md-6 mb-2">
                                          <div>
                                                <label htmlFor="invoiceTotalAmount" className="form-label">
                                                      Invoice Total Amount <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <input
                                                      type="text"
                                                      className="form-control"
                                                      id="invoiceTotalAmount"
                                                      value={quotationProductObj.invoiceTotalAmount || 0}
                                                      disabled
                                                />
                                          </div>
                                    </div>
                              </div>
                              {/* <div className="row">
                                    <div className="col-12 mb-2">
                                          <div>
                                                <label className="form-label">
                                                      Scope Of Supply
                                                      <span style={{ color: 'red' }}>*</span>
                                                </label>

                                                <Text_Editor editorState={quotationProductObj.scopeOfSupply} handleContentChange={handleProductScopeOfSupplyChange} />

                                                {error && (
                                                      <>
                                                            {(!quotationProductObj.scopeOfSupply || quotationProductObj.scopeOfSupply.trim() === '') && (
                                                                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                            )}
                                                      </>
                                                )}
                                          </div>
                                    </div>
                              </div>
                              <div className="row">
                                    <div className="col-12 mb-2 ">
                                          <div>
                                                <label className="form-label">
                                                      Warranty
                                                      <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <Text_Editor editorState={quotationProductObj.warranty} handleContentChange={handleProductWarrantyChange} />

                                                {error && (
                                                      <>
                                                            {(!quotationProductObj.warranty || quotationProductObj.warranty.trim() === '') && (
                                                                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                            )}
                                                      </>
                                                )}
                                          </div>
                                    </div>
                              </div> */}
                              {/* Company and State  */}
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
      );
};

export default InvoiceProductAddUpdateModal;



