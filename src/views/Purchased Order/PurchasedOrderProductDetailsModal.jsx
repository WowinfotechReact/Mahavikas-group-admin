


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
import PurchasedOrderProductAddUpdateModal from './PurchasedOrderProductAddUpdateModal';
import SuccessPopupModal from 'component/SuccessPopupModal';
import dayjs from 'dayjs';
import { AddUpdatePurchaseOrder, GetPOModel, ValidatePOAndInvoiceNumber } from 'services/Purchase Order/PurchaseOrderApi';
const PurchasedOrderProductDetailsModal = ({ show,
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

      const [purchaseOrderObj, setPurchaseOrderObj] = useState({
            uploadedPdfUrl: null,
            poNumber: null,
            poNumber: null,
            poUrl: null,
            poPdfPreview: null,
            userKeyID: null,
            purchaseOrderKeyID: null,
            leadKeyID: null,
            poDate: null,
            quotationFormatID: null


      })








      useEffect(() => {

            if (modelRequestData?.leadKeyID) {
                  GetPOModelData(
                        modelRequestData.leadKeyID,
                        modelRequestData.purchaseOrderKeyID || null
                  );
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
            setModelProductData({
                  ...item,
                  quotationFormatID: modelRequestData.quotationFormatID
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
      const [isFileChanged, setIsFileChanged] = useState(false); // 🔑 flag

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


      const handleSubmit = async () => {

            let isValid = false
            if (
                  purchaseOrderObj.poDate === null || purchaseOrderObj.poDate === '' || purchaseOrderObj.poDate === undefined ||
                  purchaseOrderObj.poUrl === null || purchaseOrderObj.poUrl === '' || purchaseOrderObj.poUrl === undefined ||
                  purchaseOrderObj.poNumber === null || purchaseOrderObj.poNumber === '' || purchaseOrderObj.poNumber === undefined

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
            // 🔑 Build product mapping array safely
            const poProductMapping = productList.map((item) => ({
                  poProductMapID: item.poProductMapID ?? null,
                  productID: item.productID,
                  manufacturerID: item.manufacturerID,
                  variantID: item.variantID,
                  modelID: item.modelID,
                  unit: item.unit ?? null,
                  quantity: Number(item.quantity) || null,
                  rate: Number(item.rate) || null,
                  discount: Number(item.discount) || null,
                  gstPercentage: Number(item.gstPercentage) || null,
                  scopeOfSupply: item.scopeOfSupply ?? null,
                  warranty: item.warranty ?? null,
            }));

            const apiParam = {
                  userKeyID: user.userKeyID,
                  leadKeyID: modelRequestData.leadKeyID,
                  purchaseOrderKeyID: purchaseOrderObj.purchaseOrderKeyID,
                  poNumber: purchaseOrderObj.poNumber,
                  poUrl: isFileChanged ? purchaseOrderObj.poUrl : null, // 🔑 key change
                  poDate: purchaseOrderObj.poDate,
                  poProductMapping
            };
            if (!isValid) {
                  AddUpdatePurchaseOrderData(apiParam);
            }


      };
      const ValidatePOAndInvoiceNumberData = async (type, number) => {
            setLoader(true);

            const apiParam = {
                  keyID: purchaseOrderObj.purchaseOrderKeyID,
                  type: type,       // e.g., 'PO'
                  number: number    // e.g., user input
            };

            try {
                  const response = await ValidatePOAndInvoiceNumber('/ValidatePOAndInvoiceNumber', apiParam);

                  if (response?.data?.statusCode === 200) {
                        const message = response.data.responseData.data; // Assuming this is a string message
                        setValidationMsg({
                              message: message,
                              isValid: message === 'PO Number is valid.'
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
            setPurchaseOrderObj((prevState) => ({
                  ...prevState,
                  poDate: dayjs(date).format('YYYY-MM-DD')  // Store as string
            }));
      };

      const GetPOModelData = async (leadKeyID, purchaseOrderKeyID = null) => {

            setLoader(true);

            if (!leadKeyID) return; // LeadKeyID must always exist


            try {
                  const data = await GetPOModel(leadKeyID, purchaseOrderKeyID);
                  if (data?.data?.statusCode === 200) {
                        setLoader(false);
                        const ModelData = data.data.responseData.data; // Assuming data is an array

                        setPurchaseOrderObj({
                              ...purchaseOrderObj,
                              leadKeyID: ModelData.leadKeyID,
                              poNumber: ModelData.poNumber,
                              poUrl: ModelData.poUrl,
                              poDate: ModelData.poDate,
                              purchaseOrderKeyID: ModelData.purchaseOrderKeyID,
                              poPdfPreview: ModelData.poUrl,
                              // poProductMapping: ModelData.poProductMapping
                        });

                        // 🟢 Sync product list for table rendering
                        setProductList(ModelData.poProductMapping || []);
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
            // debugger
            setLoader(true);
            try {
                  let url = '/AddUpdatePurchaseOrder'; // Default URL for Adding Data

                  const response = await AddUpdatePurchaseOrder(url, apiParam);
                  if (response) {
                        if (response?.data?.statusCode === 200) {

                              setLoader(false);
                              setShowSuccessModal(true);
                              setModelAction(
                                    'Po uploaded successfully!'
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



      return (
            <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
                  <Modal.Header closeButton>
                        <Modal.Title>
                              <h3 className="text-center">
                                    {modelRequestData.Action !== null ? 'Update Purchase Order' : 'Add Purchase Order'}
                              </h3>
                        </Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
                        <div className="container">
                              <div className="row">
                                    <div className="row">
                                          <div className="col-md-6 mb-3">
                                                <label htmlFor="pONumber" className="form-label">
                                                      Enter Purchase Order No.
                                                      <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <input
                                                      id='pONumber'
                                                      name='pONumber'
                                                      maxLength={30}
                                                      type="text"
                                                      className="form-control"
                                                      placeholder="Enter PO No"
                                                      value={purchaseOrderObj.poNumber}
                                                      onChange={(e) => {
                                                            const inputValue = e.target.value;

                                                            setPurchaseOrderObj((prev) => ({
                                                                  ...prev,
                                                                  poNumber: inputValue
                                                            }));

                                                            // Clear validation message while typing
                                                            setValidationMsg({ message: '', isValid: null });
                                                      }}
                                                      onBlur={(e) => {
                                                            const inputValue = e.target.value;
                                                            if (inputValue.trim() !== '') {
                                                                  ValidatePOAndInvoiceNumberData('PO', inputValue); // Trigger on blur
                                                            } else {
                                                                  // Handle empty input on blur (optional)
                                                                  setValidationMsg({
                                                                        message: ' PO Number is required.',
                                                                        isValid: false
                                                                  });
                                                            }
                                                      }}
                                                />

                                                {error &&
                                                      (purchaseOrderObj.poNumber === null ||
                                                            purchaseOrderObj.poNumber === undefined ||
                                                            purchaseOrderObj.poNumber === '') ? (
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
                                                      <label htmlFor='pODate' className="form-label">
                                                            Purchase Order Date
                                                            <span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                      <div>
                                                            <DatePicker
                                                                  id='pODate'
                                                                  name='pODate'
                                                                  value={purchaseOrderObj?.poDate ? new Date(purchaseOrderObj.poDate) : null}
                                                                  onChange={handleDateChange}
                                                                  label="From Date"
                                                                  clearIcon={null}
                                                                  popperPlacement="bottom-start"
                                                            />
                                                            {error &&
                                                                  (purchaseOrderObj.poDate === null ||
                                                                        purchaseOrderObj.poDate === undefined ||
                                                                        purchaseOrderObj.poDate === '') ? (
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
                                                <label className="form-label" htmlFor='pOUploadPoPdf'>
                                                      Upload PO PDF
                                                      <span style={{ color: 'red' }}>*</span>
                                                </label>


                                                <input
                                                      id='pOUploadPoPdf'
                                                      name='pOUploadPoPdf'
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
                                                                        setLoader(false);
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
                                                                        setPurchaseOrderObj((prev) => ({
                                                                              ...prev,
                                                                              poUrl: s3Url,
                                                                              poPdfPreview: fileURL
                                                                        }));
                                                                        setIsFileChanged(true);

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
                                                      (purchaseOrderObj.poUrl === null ||
                                                            purchaseOrderObj.poUrl === undefined ||
                                                            purchaseOrderObj.poUrl === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}

                                          </div>

                                          <div className="col-md-6 mb-3">
                                                {purchaseOrderObj.poPdfPreview && (
                                                      <div >

                                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                                  <strong>Preview:</strong>
                                                                  <div>
                                                                        <a
                                                                              href={purchaseOrderObj.poPdfPreview}
                                                                              target="_blank"
                                                                              rel="noopener noreferrer"
                                                                              className="btn btn-sm text-white me-2"
                                                                              title="View  PDF"
                                                                              style={{ background: '#9aa357' }}
                                                                        >
                                                                              <i className="fa-solid fa-eye"></i>
                                                                        </a>
                                                                        <button
                                                                              className="btn btn-sm btn-danger"
                                                                              onClick={() => {
                                                                                    setPurchaseOrderObj((prev) => ({
                                                                                          ...prev,
                                                                                          poUrl: null,
                                                                                          poPdfPreview: null,
                                                                                    }));
                                                                              }}
                                                                              title="Remove PDF"
                                                                        >
                                                                              <i className="fa-solid fa-trash"></i>
                                                                        </button>
                                                                  </div>
                                                            </div>
                                                            <iframe
                                                                  src={purchaseOrderObj.poPdfPreview}
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
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                          <h5>Products</h5>
                                          {modelRequestData.Action !== null &&
                                                <button
                                                      onClick={addUpdateProductModal}
                                                      className="btn text-white btn-sm"
                                                      style={{ background: '#ffaa33' }}
                                                >
                                                      + Add Product
                                                </button>
                                          }
                                    </div>
                                    <div className="table-responsive">
                                          <table className="table table-bordered table-hover align-middle">
                                                <thead className="table-light">
                                                      <tr>
                                                            <th>Sr No</th>
                                                            <th>Product Name</th>
                                                            <th>Manufacturer Name</th>
                                                            <th>Rating</th>
                                                            <th>Model Name</th>
                                                            <th>Quantity</th>

                                                            {modelRequestData.Action !== null && <th>Actions</th>}
                                                      </tr>
                                                </thead>
                                                <tbody>
                                                      {productList.length > 0 ? (
                                                            productList.map((item, index) => (
                                                                  <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{item.productName}</td>
                                                                        <td>{item.manufacturerName}</td>
                                                                        <td>{item.variantName}</td>
                                                                        <td>{item.modelName}</td>
                                                                        <td>{item.quantity} </td>
                                                                        {/* <td>{item.rate}</td>
                                                                        <td>{item.discount || ''}</td> */}
                                                                        {modelRequestData.Action !== null &&
                                                                              <td className='text-nowrap'>
                                                                                    <button
                                                                                          onClick={() => handleEditProduct(item, index)}
                                                                                          className="btn btn-sm text-white me-2"
                                                                                          style={{ background: '#9aa357' }}
                                                                                    >
                                                                                          <i className="fa-solid fa-pencil"></i>
                                                                                    </button>
                                                                                    {(!item.invoiceQuantity || item.invoiceQuantity <= 0) && (
                                                                                          <button
                                                                                                onClick={() => handleDeleteProduct(index)}
                                                                                                className="btn btn-sm text-white"
                                                                                                style={{ background: '#9aa357' }}
                                                                                          >
                                                                                                <i className="fa-solid fa-trash"></i>
                                                                                          </button>
                                                                                    )}
                                                                              </td>
                                                                        }
                                                                  </tr>
                                                            ))
                                                      ) : (
                                                            <tr>
                                                                  <td colSpan="9" className="text-center">No products added</td>
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
                              id="submitBtn"                       // 🟢 optional, stable for automation
                              data-testid="submit-button"
                              style={{ background: '#ffaa33' }}
                              onClick={() => handleSubmit()}
                        >
                              Submit
                        </button>

                  </Modal.Footer>
                  {showPurchasedOrderProductAddUpdateModal && (
                        <PurchasedOrderProductAddUpdateModal
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

export default PurchasedOrderProductDetailsModal;
