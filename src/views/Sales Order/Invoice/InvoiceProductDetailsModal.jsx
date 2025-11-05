




import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import { toast } from "react-toastify";
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { Link } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { uploadPdfWithNodeApi } from 'services/UploadImage/UploadImage';

import SuccessPopupModal from 'component/SuccessPopupModal';
import dayjs from 'dayjs';
import { AddUpdatePurchaseOrder, GetPOModel, ValidatePOAndInvoiceNumber } from 'services/Purchase Order/PurchaseOrderApi';
import InvoiceProductAddUpdateModal from './InvoiceProductAddUpdateModal';
import { AddUpdateInvoice } from 'services/Invoice Module/InvoiceApi';
import { GetSalesOrderProductModel } from 'services/Sales Order Product/SalesOrderProductApi';
const InvoiceProductDetailsModal = ({ show,
      onHide,
      setIsAddUpdateActionDone,
      isAddUpdateActionDone,
      modelRequestData,
      quotationProductList,
      onSave,
      productData,
      editIndex,
      productTypeOption,
      manufactureOption,
      variantOption,
      modelOption }) => {

      const [isFileChanged, setIsFileChanged] = useState(false); // 🔑 flag

      const [errorMessage, setErrorMessage] = useState();
      const [rateError, setRateError] = useState("");
      const [discountError, setDiscountError] = useState('');
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [modelAction, setModelAction] = useState('');
      const [error, setErrors] = useState(null);


      const { setLoader, user } = useContext(ConfigContext);
      const [showPurchasedOrderProductAddUpdateModal, setShowPurchasedOrderProductAddUpdateModal] = useState(false);
      const [modelProductData, setModelProductData] = useState({});
      const [editProductIndex, setEditProductIndex] = useState(null);
      const [productList, setProductList] = useState(quotationProductList || []);




      const [validationMsg, setValidationMsg] = useState({
            message: '',
            isValid: null, // true = green, false = red
      });


      const [invoiceObj, setInvoiceObj] = useState({
            invoiceAmount: null,
            invoiceNumber: null,
            invoicePDFUpload: null,
            poPdfPreview: null,
            userKeyID: null,
            invoiceKeyID: null,
            leadKeyID: null,
            invoiceDate: null,
      })










      useEffect(() => {
            if (modelRequestData?.Action === "Update") {
                  if (modelRequestData?.salesOrderKeyID) {
                        GetSalesOrderProductModelData(
                              modelRequestData.salesOrderKeyID,
                        );
                  }
            }
      }, [modelRequestData?.Action]);



      const addUpdateProductModal = () => {
            setModelProductData({
                  productID: null,
                  manufacturerName: null,
                  modelName: null,
                  variantName: null,
                  manufacturerID: null,
                  variantID: null,
                  modelID: null,
                  quotationFormatID: modelRequestData.quotationFormatID,
                  quantity: '',

            });
            setEditProductIndex(null);
            setShowPurchasedOrderProductAddUpdateModal(true);
      };


      const handleEditProduct = (item, index) => {
            const remainingQty = (item.remainingQty !== undefined)
                  ? item.remainingQty
                  : (item.quantity || 0) - (item.invoiceQuantity || 0);

            setModelProductData({
                  ...item,
                  quantity: remainingQty,   // 🟢 modal works on remainingQty
                  remainingQty,
                  quotationFormatID: modelRequestData.quotationFormatID,
            });

            setEditProductIndex(index);
            setShowPurchasedOrderProductAddUpdateModal(true);
      };



      const handleDeleteProduct = (index) => {
            setProductList((prev) => {
                  const updated = [...prev];
                  updated.splice(index, 1);
                  return updated;
            });
      };
      const handleSaveProduct = (data, index) => {
            if (index !== null) {
                  // Update existing product
                  setProductList((prev) => {
                        const updated = [...prev];
                        updated[index] = data;
                        return updated;
                  });
            } else {
                  // Add new product
                  setProductList((prev) => [...prev, data]);
            }
            setShowPurchasedOrderProductAddUpdateModal(false);
      };

      console.log(modelRequestData.salesOrderKeyID, '4353rffsd');

      const handleSubmit = async () => {

            let isValid = false
            if (
                  invoiceObj.invoiceDate === null || invoiceObj.invoiceDate === '' || invoiceObj.invoiceDate === undefined ||
                  invoiceObj.invoicePDFUpload === null || invoiceObj.invoicePDFUpload === '' || invoiceObj.invoicePDFUpload === undefined ||
                  invoiceObj.invoiceNumber === null || invoiceObj.invoiceNumber === '' || invoiceObj.invoiceNumber === undefined

            ) {
                  setErrors(true);
                  isValid = true;
                  // toast.error("Please fill all required Purchase Order fields.");
            } else {
                  setErrors(false);
                  isValid = false;
            }

            // 🔎 Validate product list (must have at least one product)
            if (!productList || productList.length === 0) {
                  setErrors(true);
                  isValid = true;
                  toast.error("Please add at least one product before submitting.");
                  return;
            }

            const incAmtFinal = productList.reduce((sum, item) => {
                  const qty = item.remainingQty ?? (item.quantity - (item.invoiceQuantity || 0));
                  const base = item.discount ?? item.rate;
                  const lineAmount = base * qty;
                  const gstAmount = (lineAmount * item.gstPercentage) / 100;
                  return qty > 0 ? sum + lineAmount + gstAmount : sum;
            }, 0)


            // 🔑 Build product mapping array safely
            const invoiceProductMapping = productList
                  .map((item) => {
                        // pick user-updated qty if available
                        const remainingQty = item.remainingQty ?? ((item.quantity || 0) - (item.invoiceQuantity || 0));

                        if (remainingQty <= 0) return null; // ❌ skip if no qty left
                        // ✅ calculate totalAmount per product
                        const base = item.discount ?? item.rate;
                        const lineAmount = base * remainingQty;
                        const gstAmount = (lineAmount * item.gstPercentage) / 100;
                        const totalAmount = lineAmount + gstAmount;
                        return {
                              invoiceProductMapID: null,
                              poProductMapID: item.poProductMapID ?? null,
                              productID: item.productID,
                              manufacturerID: item.manufacturerID,
                              variantID: item.variantID,
                              modelID: item.modelID,
                              unit: item.unit ?? null,
                              quantity: Number(remainingQty) || null, // 🟢 use updated qty
                              rate: Number(item.rate) || null,
                              discount: Number(item.discount) || null,
                              gstPercentage: Number(item.gstPercentage) || null,
                              invoiceTotalAmount: totalAmount
                        };
                  })
                  .filter(Boolean); // remove nulls

            const apiParam = {
                  invoiceKeyID: null,
                  userKeyID: user.userKeyID,
                  leadKeyID: modelRequestData.leadKeyID,
                  salesOrderID: modelRequestData.salesOrderID,
                  // salesOrderKeyID: modelRequestData.salesOrderKeyID,
                  // purchaseOrderKeyID: invoiceObj.purchaseOrderKeyID,
                  invoiceNumber: invoiceObj.invoiceNumber,
                  invoiceAmount: incAmtFinal,
                  // invoicePDFUpload: invoiceObj.invoicePDFUpload,
                  invoicePDFUpload: isFileChanged ? invoiceObj.invoicePDFUpload : null, // 🔑 key change

                  invoiceDate: invoiceObj.invoiceDate,
                  invoiceProductMapping
            };
            if (!isValid) {
                  AddUpdatePurchaseOrderData(apiParam);
            }


      };
      const ValidatePOAndInvoiceNumberData = async (type, number) => {
            setLoader(true);

            const apiParam = {
                  keyID: invoiceObj.purchaseOrderKeyID,
                  type: type,       // e.g., 'PO'
                  number: number    // e.g., user input
            };

            try {
                  const response = await ValidatePOAndInvoiceNumber('/ValidatePOAndInvoiceNumber', apiParam);

                  if (response?.data?.statusCode === 200) {
                        const message = response.data.responseData.data; // Assuming this is a string message
                        setValidationMsg({
                              message: message,
                              isValid: message === 'Invoice Number is valid.'
                        });
                        setInterval(() => {
                              setValidationMsg({
                                    message: '',

                              });
                        }, 3000)
                  } else {
                        const errorMessage = response?.data?.errorMessage || 'Validation failed.';
                        setValidationMsg({
                              message: errorMessage,
                              isValid: false
                        });
                  }
            } catch (error) {
                  console.error(error);
                  setValidationMsg({
                        message: 'Something went wrong.',
                        isValid: false
                  });
            } finally {
                  setLoader(false);
            }
      };


      const handleDateChange = (date) => {
            setInvoiceObj((prevState) => ({
                  ...prevState,
                  invoiceDate: dayjs(date).format('YYYY-MM-DD')  // Store as string
            }));
      };




      const GetSalesOrderProductModelData = async (salesOrderKeyID) => {

            setLoader(true);

            if (!salesOrderKeyID) return; // LeadKeyID must always exist


            try {
                  const data = await GetSalesOrderProductModel(salesOrderKeyID);
                  if (data?.data?.statusCode === 200) {
                        setLoader(false);
                        const ModelData = data.data.responseData.data; // Assuming data is an array

                        setInvoiceObj({
                              ...invoiceObj,
                              leadKeyID: ModelData.leadKeyID,
                              poGrandTotal: ModelData.poGrandTotal,
                              invoiceNumber: ModelData.invoiceNumber,
                              invoicePDFUpload: ModelData.invoicePDFUpload,
                              invoiceDate: ModelData.invoiceDate,
                              purchaseOrderKeyID: ModelData.purchaseOrderKeyID,
                              poPdfPreview: ModelData.invoicePDFUpload,
                        });

                        // 🟢 Sync product list for table rendering
                        setProductList(ModelData.salesProductList || []);
                        setIsFileChanged(false); // reset, since nothing uploaded yet

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

      const AddUpdatePurchaseOrderData = async (apiParam) => {
            setLoader(true);
            try {
                  let url = '/AddUpdateInvoice'; // Default URL for Adding Data

                  const response = await AddUpdateInvoice(url, apiParam);
                  if (response) {
                        if (response?.data?.statusCode === 200) {

                              setLoader(false);
                              setShowSuccessModal(true);
                              setModelAction(
                                    'Invoice added successfully!'
                              );
                              setIsAddUpdateActionDone(true)

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
            setShowSuccessModal(false)
            onHide()
      }


      // 🔹 Calculate invoice total whenever productList changes
      useEffect(() => {
            if (productList && productList.length > 0) {
                  const total = productList.reduce((sum, item) => {
                        const base = item.discount ?? item.rate; // if discount available, use that, else rate
                        const lineAmount = base * item.quantity;
                        const gstAmount = (lineAmount * item.gstPercentage) / 100;
                        return sum + lineAmount + gstAmount;
                  }, 0);

                  // Update invoiceAmount in state
                  setInvoiceObj((prev) => ({
                        ...prev,
                        invoiceAmount: total.toFixed(2), // keep 2 decimals
                  }));
            }
      }, [productList]);
      return (
            <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
                  <Modal.Header closeButton>
                        <Modal.Title>
                              <h3 className="text-center">
                                    {modelRequestData.Action !== null ? 'Add Invoice' : 'Add Invoice'}
                              </h3>
                        </Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
                        <div className="container">
                              <div className="row">
                                    <div className="row">
                                          <div className="col-md-6 mb-3">
                                                <label htmlFor="vehicleTypeName" className="form-label">
                                                      Enter Invoice No.
                                                      <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <input
                                                      maxLength={15}
                                                      type="text"
                                                      className="form-control"
                                                      id="vehicleTypeName"
                                                      placeholder="Enter Invoice No"
                                                      value={invoiceObj.invoiceNumber}
                                                      onChange={(e) => {
                                                            const inputValue = e.target.value;

                                                            setInvoiceObj((prev) => ({
                                                                  ...prev,
                                                                  invoiceNumber: inputValue
                                                            }));

                                                            // Clear validation message while typing
                                                            setValidationMsg({ message: '', isValid: null });
                                                      }}
                                                      onBlur={(e) => {
                                                            const inputValue = e.target.value;
                                                            if (inputValue.trim() !== '') {
                                                                  ValidatePOAndInvoiceNumberData('Invoice', inputValue); // Trigger on blur
                                                            } else {
                                                                  // Handle empty input on blur (optional)
                                                                  setValidationMsg({
                                                                        message: 'Invoice Number is required.',
                                                                        isValid: false
                                                                  });
                                                            }
                                                      }}
                                                />

                                                {error &&
                                                      (invoiceObj.invoiceNumber === null ||
                                                            invoiceObj.invoiceNumber === undefined ||
                                                            invoiceObj.invoiceNumber === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                                {validationMsg.message && (
                                                      <span
                                                            style={{
                                                                  color: validationMsg.isValid ? ' green' : 'red',
                                                                  fontWeight: 100,
                                                            }}
                                                      >
                                                            {validationMsg.message}
                                                      </span>
                                                )}
                                          </div>

                                          <div className="col-md-6 mb-3">
                                                <div>
                                                      <label className="form-label">
                                                            Invoice Date
                                                            <span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <div>
                                                            <DatePicker
                                                                  value={invoiceObj?.invoiceDate ? new Date(invoiceObj?.invoiceDate) : null}

                                                                  onChange={handleDateChange}
                                                                  label="From Date"
                                                                  clearIcon={null}
                                                                  popperPlacement="bottom-start"
                                                            />
                                                            {error &&
                                                                  (invoiceObj.invoiceDate === null ||
                                                                        invoiceObj.invoiceDate === undefined ||
                                                                        invoiceObj.invoiceDate === '') ? (
                                                                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                            ) : (
                                                                  ''
                                                            )}
                                                      </div>

                                                      <span style={{ color: 'red' }}>
                                                            {errorMessage}
                                                      </span>
                                                </div>
                                          </div>

                                          <div className="col-md-6 mb-3">
                                                <div>
                                                      <label className="form-label">
                                                            Invoice Amt ⟨₹⟩
                                                            <span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <div>
                                                            <input
                                                                  type="text"
                                                                  className="form-control"
                                                                  value={productList.reduce((sum, item) => {
                                                                        const qty = item.remainingQty ?? (item.quantity - (item.invoiceQuantity || 0));
                                                                        const base = item.discount ?? item.rate;
                                                                        const lineAmount = base * qty;
                                                                        const gstAmount = (lineAmount * item.gstPercentage) / 100;
                                                                        return qty > 0 ? sum + lineAmount + gstAmount : sum;
                                                                  }, 0).toLocaleString()}
                                                                  disabled // ✅ makes sure user can’t change it manually
                                                            />

                                                            {error &&
                                                                  (invoiceObj.invoiceAmount === null ||
                                                                        invoiceObj.invoiceAmount === undefined ||
                                                                        invoiceObj.invoiceAmount === '') ? (
                                                                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                            ) : (
                                                                  ''
                                                            )}
                                                      </div>
                                                </div>
                                          </div>
                                          {/* <div className="col-md-6 mb-3">
                                                <div>
                                                      <label className="form-label">
                                                            PO Amt ⟨₹⟩
                                                            <span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <div>
                                                            <input
                                                                  maxLength={10}
                                                                  type="text"
                                                                  disabled
                                                                  className="form-control"
                                                                  id="vehicleTypeName"
                                                                  placeholder="Enter Amt"
                                                                  value={invoiceObj.poGrandTotal}
                                                                  onChange={(e) => {
                                                                        setErrorMessage(false);
                                                                        let inputValue = e.target.value;

                                                                        // Remove everything that is not a digit (0-9)
                                                                        const cleanedValue = inputValue.replace(/[^0-9]/g, '');

                                                                        setInvoiceObj((prev) => ({
                                                                              ...prev,
                                                                              invoiceAmount: cleanedValue
                                                                        }));
                                                                  }}
                                                            />

                                                            {error &&
                                                                  (invoiceObj.invoiceAmount === null ||
                                                                        invoiceObj.invoiceAmount === undefined ||
                                                                        invoiceObj.invoiceAmount === '') ? (
                                                                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                            ) : (
                                                                  ''
                                                            )}
                                                      </div>
                                                </div>
                                          </div> */}

                                          <div className="col-md-6 mb-3">
                                                <label className="form-label">
                                                      Upload Invoice
                                                      <span style={{ color: 'red' }}>*</span>
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
                                                                        setLoader(false)
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
                                                                        setInvoiceObj((prev) => ({
                                                                              ...prev,
                                                                              invoicePDFUpload: s3Url,
                                                                              poPdfPreview: fileURL
                                                                        }));
                                                                        setIsFileChanged(true); // 🔑 user uploaded new file


                                                                  }
                                                                  setLoader(false);
                                                            }
                                                      }}
                                                />
                                                <span>
                                                      <small>Note: Max 10MB</small>
                                                </span>
                                                <br />
                                                {error &&
                                                      (invoiceObj.invoicePDFUpload === null ||
                                                            invoiceObj.invoicePDFUpload === undefined ||
                                                            invoiceObj.invoicePDFUpload === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}


                                          </div>


                                          <div className="col-md-6 mb-3">
                                                {invoiceObj.poPdfPreview && (
                                                      <div >

                                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                                  <strong>Preview:</strong>
                                                                  <button
                                                                        className="btn btn-sm btn-danger"
                                                                        onClick={() => {
                                                                              setInvoiceObj((prev) => ({
                                                                                    ...prev,
                                                                                    invoicePDFUpload: null,
                                                                                    poPdfPreview: null
                                                                              }));
                                                                        }}
                                                                  >
                                                                        Remove PDF
                                                                  </button>
                                                            </div>
                                                            <iframe
                                                                  src={invoiceObj.poPdfPreview}
                                                                  title="PO PDF Preview"
                                                                  width="100%"
                                                                  height="100px"
                                                                  style={{ border: '1px solid #ccc', borderRadius: '4px' }}

                                                            />
                                                      </div>
                                                )}

                                          </div>

                                    </div>
                                    <hr />
                                    {/* <div className="d-flex justify-content-between align-items-center mb-2">
                                          <h5>Products</h5>
                                          <button
                                                onClick={addUpdateProductModal}
                                                className="btn text-white btn-sm"
                                                style={{ background: '#ffaa33' }}
                                          >
                                                + Add Product
                                          </button>
                                    </div> */}
                                    <div className="table-responsive">

                                          <table className="table table-bordered table-hover align-middle">
                                                <thead className="table-light">
                                                      <tr>
                                                            <th>Sr No</th>
                                                            <th>Product Name</th>
                                                            <th>Mfg. Name</th>
                                                            <th>Rating</th>
                                                            <th>Model Name</th>
                                                            <th>Qty</th>
                                                            <th>Rate</th>
                                                            <th>GST %</th>
                                                            <th>GST Amt</th>
                                                            <th>Total Amt</th>
                                                            <th>Actions</th>
                                                      </tr>
                                                </thead>
                                                <tbody>
                                                      {productList.length > 0 ? (
                                                            <>
                                                                  {productList.map((item, index) => {
                                                                        // calculate qty
                                                                        const qty = item.remainingQty ?? (item.quantity - (item.invoiceQuantity || 0));

                                                                        // ❌ don't render if qty <= 0
                                                                        if (qty <= 0) return null;

                                                                        const base = item.discount ?? item.rate;
                                                                        const lineAmount = base * qty;
                                                                        const gstAmount = (lineAmount * item.gstPercentage) / 100;
                                                                        const totalAmount = lineAmount + gstAmount;

                                                                        return (
                                                                              <tr key={index}>
                                                                                    <td>{index + 1}</td>
                                                                                    <td>{item.productName}</td>
                                                                                    <td>{item.manufacturerName}</td>
                                                                                    <td>{item.variantName}</td>
                                                                                    <td>{item.modelName}</td>
                                                                                    <td>{qty}</td> {/* ✅ shows updated qty */}
                                                                                    <td>{base.toLocaleString()}</td>
                                                                                    <td>{item.gstPercentage}%</td>
                                                                                    <td>{gstAmount.toLocaleString()}</td>
                                                                                    <td>{totalAmount.toLocaleString()}</td>
                                                                                    <td className="text-nowrap">
                                                                                          <button
                                                                                                onClick={() => handleEditProduct(item, index)}
                                                                                                className="btn btn-sm text-white me-2"
                                                                                                style={{ background: "#9aa357" }}
                                                                                          >
                                                                                                <i className="fa-solid fa-pencil"></i>
                                                                                          </button>

                                                                                          {/* ✅ now check real productList length, not filtered */}
                                                                                          {productList.length > 1 && (
                                                                                                <button
                                                                                                      onClick={() => handleDeleteProduct(index)}
                                                                                                      className="btn btn-sm text-white"
                                                                                                      style={{ background: "#9aa357" }}
                                                                                                >
                                                                                                      <i className="fa-solid fa-trash"></i>
                                                                                                </button>
                                                                                          )}
                                                                                    </td>
                                                                              </tr>
                                                                        );
                                                                  })}

                                                                  {/* Totals Row */}
                                                                  {productList.some((item) => {
                                                                        const qty = item.remainingQty ?? (item.quantity - (item.invoiceQuantity || 0));
                                                                        return qty > 0;
                                                                  }) && (
                                                                              <tr className="fw-bold table-light">
                                                                                    <td colSpan="5" className="text-end">Total</td>
                                                                                    <td>
                                                                                          {productList.reduce((sum, item) => {
                                                                                                const qty = item.remainingQty ?? (item.quantity - (item.invoiceQuantity || 0));
                                                                                                return qty > 0 ? sum + qty : sum;
                                                                                          }, 0)}
                                                                                    </td>
                                                                                    <td>
                                                                                          {productList.reduce((sum, item) => {
                                                                                                const qty = item.remainingQty ?? (item.quantity - (item.invoiceQuantity || 0));
                                                                                                return qty > 0 ? sum + (item.discount ?? item.rate) * qty : sum;
                                                                                          }, 0).toLocaleString()}
                                                                                    </td>
                                                                                    <td></td>
                                                                                    <td>
                                                                                          {productList.reduce((sum, item) => {
                                                                                                const qty = item.remainingQty ?? (item.quantity - (item.invoiceQuantity || 0));
                                                                                                const base = item.discount ?? item.rate;
                                                                                                const lineAmount = base * qty;
                                                                                                return qty > 0 ? sum + (lineAmount * item.gstPercentage) / 100 : sum;
                                                                                          }, 0).toLocaleString()}
                                                                                    </td>
                                                                                    <td>
                                                                                          {productList.reduce((sum, item) => {
                                                                                                const qty = item.remainingQty ?? (item.quantity - (item.invoiceQuantity || 0));
                                                                                                const base = item.discount ?? item.rate;
                                                                                                const lineAmount = base * qty;
                                                                                                const gstAmount = (lineAmount * item.gstPercentage) / 100;
                                                                                                return qty > 0 ? sum + lineAmount + gstAmount : sum;
                                                                                          }, 0).toLocaleString()}
                                                                                    </td>
                                                                                    <td></td>
                                                                              </tr>
                                                                        )}
                                                            </>
                                                      ) : (
                                                            <tr>
                                                                  <td colSpan="11" className="text-center">No products added</td>
                                                            </tr>
                                                      )}
                                                </tbody>


                                          </table>

                                    </div>
                              </div>


                        </div>
                  </Modal.Body>
                  <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>
                              Close
                        </Button>
                        <button
                              type="submit"
                              className="btn text-white"
                              style={{ background: '#ffaa33' }}
                              onClick={() => handleSubmit()}
                        >
                              Submit
                        </button>

                  </Modal.Footer>
                  {showPurchasedOrderProductAddUpdateModal && (
                        <InvoiceProductAddUpdateModal
                              show={showPurchasedOrderProductAddUpdateModal}
                              onHide={() => setShowPurchasedOrderProductAddUpdateModal(false)}
                              modelRequestData={modelProductData}
                              onSave={handleSaveProduct}
                              editIndex={editProductIndex}
                              productTypeOption={productTypeOption}
                              manufactureOption={manufactureOption}
                              variantOption={variantOption}
                              modelOption={modelOption}
                              quotationProductList={productList}
                        />
                  )}


                  {showSuccessModal && (
                        <SuccessPopupModal
                              show={showSuccessModal}
                              onHide={() => closeAllModal()}
                              setShowSuccessModal={setShowSuccessModal}
                              modelAction={modelAction}
                        />
                  )}
            </Modal>
      );
};

export default InvoiceProductDetailsModal;
