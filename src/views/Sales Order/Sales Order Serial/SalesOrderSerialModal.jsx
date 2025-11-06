




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
import { AddUpdateInvoice } from 'services/Invoice Module/InvoiceApi';
import InvoiceProductAddUpdateModal from '../Invoice/InvoiceProductAddUpdateModal';
import SalesOrderProductModal from '../SalesOrderProductModal';
import SerialNumberModal from './SerialNumberModal';
import { AddUpdateSalesOrderProduct } from 'services/Sales Order Product/SalesOrderProductApi';
const SalesOrderSerialModal = ({ show,
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

      const [modalProduct, setModalProduct] = useState(null);
      const [showSerialModal, setShowSerialModal] = useState(false);
      const [modalProductIndex, setModalProductIndex] = useState(null);


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
                  if (modelRequestData?.leadKeyID) {
                        GetPOModelData(
                              modelRequestData.leadKeyID,
                              modelRequestData.purchaseOrderKeyID || null
                        );
                  }
            }
      }, [modelRequestData?.Action]);

      useEffect(() => {
            setProductList(quotationProductList || []);
      }, [quotationProductList]);


      const handleOpenSerialModal = (item, index) => {
            const remainingQty = item.remainingQty ?? (item.quantity - (item.invoiceQuantity || 0));
            setModalProduct({ ...item, remainingQty });
            setModalProductIndex(index); // track index
            setShowSerialModal(true);
      };



      const handleSaveSerials = (serials) => {
            setProductList(prev => {
                  const updated = [...prev];
                  updated[modalProductIndex] = {
                        ...updated[modalProductIndex],
                        serials
                  };
                  return updated;
            });
            setShowSerialModal(false);
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











      const GetPOModelData = async (leadKeyID, purchaseOrderKeyID = null) => {

            setLoader(true);

            if (!leadKeyID) return; // LeadKeyID must always exist


            try {
                  const data = await GetPOModel(leadKeyID, purchaseOrderKeyID);
                  if (data?.data?.statusCode === 200) {
                        setLoader(false);
                        const ModelData = data.data.responseData.data; // Assuming data is an array

                        setInvoiceObj({
                              ...invoiceObj,
                              leadKeyID: ModelData.leadKeyID,
                              poProductMapID: ModelData.poProductMapID,
                              salesProductID: ModelData.salesProductID,
                              poGrandTotal: ModelData.poGrandTotal,
                              invoiceNumber: ModelData.invoiceNumber,
                              invoicePDFUpload: ModelData.invoicePDFUpload,
                              invoiceDate: ModelData.invoiceDate,
                              purchaseOrderKeyID: ModelData.purchaseOrderKeyID,
                              poPdfPreview: ModelData.invoicePDFUpload,
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



      const handleCreateSalesOrder = async () => {
            // 🔎 Validation before API call
            for (let product of productList) {
                  const finalQty =
                        product.enteredQty !== undefined
                              ? product.enteredQty
                              : (product.remainingQty !== undefined
                                    ? product.remainingQty
                                    : (product.quantity || 0) - (product.invoiceQuantity || 0));

                  // ✅ Check serials count
                  if (!product.serials || product.serials.length < finalQty) {


                        toast.error(
                              `Please enter ${finalQty} serial number(s) for product: ${product.productName}`
                        );
                        return; // ⛔ Stop execution
                  }

                  // ✅ Check if any serial is blank
                  const hasEmptySerial = product.serials.some(s => !s || s.trim() === "");
                  if (hasEmptySerial) {
                        alert(`Serial numbers cannot be empty for product: ${product.productName}`);
                        return;
                  }
            }

            // --- if validation passes, then continue ---
            const salesOrderAmount = productList.reduce((sum, item) => {
                  const qty =
                        item.enteredQty !== undefined
                              ? item.enteredQty
                              : item.remainingQty ?? (item.quantity - (item.invoiceQuantity || 0));

                  const base = item.discount ?? item.rate;
                  const lineAmount = base * qty;
                  const gstAmount = (lineAmount * item.gstPercentage) / 100;

                  return qty > 0 ? sum + lineAmount + gstAmount : sum;
            }, 0);

            const apiParam = {
                  userKeyID: user.userKeyID,
                  salesProductKeyID: null,
                  leadKeyID: modelRequestData.leadKeyID,
                  salesOrderAmount,
                  salesProduct: productList.map(product => {
                        const finalQty =
                              product.enteredQty !== undefined
                                    ? product.enteredQty
                                    : (product.remainingQty !== undefined
                                          ? product.remainingQty
                                          : (product.quantity || 0) - (product.invoiceQuantity || 0));

                        return {
                              salesProductID: null,
                              poProductMapID: product.poProductMapID,
                              productID: product.productID,
                              manufacturerID: product.manufacturerID,
                              variantID: product.variantID,
                              modelID: product.modelID,
                              unit: product.unit,
                              unit: product.unit,
                              gstPercentage: product.gstPercentage,
                              quantity: finalQty,
                              rate: product.rate,
                              scopeOfSupply: product.scopeOfSupply,
                              warranty: product.warranty,
                              salesProductSerialNo: (product.serials || []).map(serial => ({
                                    salesProductSerID: null,
                                    salesProductID: null,
                                    serialNumber: serial,
                              })),
                        };
                  }),
            };

            AddUpdateStateData(apiParam);
      };





      const AddUpdateStateData = async (apiParam) => {
            setLoader(true);
            try {
                  let url = '/AddUpdateSalesOrderProduct'; // Default URL for Adding Data

                  const response = await AddUpdateSalesOrderProduct(url, apiParam);
                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false);
                              setShowSuccessModal(true);
                              setModelAction(
                                    modelRequestData.Action === null || modelRequestData.Action === undefined
                                          ? 'Sales Order Added Successfully!'
                                          : 'Sales Order Added Successfully!'
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
      return (
            <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
                  <Modal.Header closeButton>
                        <Modal.Title>
                              <h3 className="text-center">
                                    {modelRequestData.Action !== null ? 'Add Serial Number' : 'Add Serial Number'}
                              </h3>
                        </Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
                        <div className="container">
                              <div className="row">


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
                                                                                    <td>{qty}
                                                                                          <p
                                                                                                style={{ cursor: "pointer", color: "#0d6efd", margin: 0 }}
                                                                                                onClick={() => handleOpenSerialModal(item, index)}
                                                                                          >
                                                                                                Add Serial
                                                                                          </p>
                                                                                          {item.serials && item.serials.length > 0 && (
                                                                                                <div className="mt-1">
                                                                                                      <small>Serials: {item.serials.join(", ")}</small>
                                                                                                </div>
                                                                                          )}
                                                                                    </td> {/* ✅ shows updated qty */}
                                                                                    <td>{base.toLocaleString()}</td>
                                                                                    <td>{item.gstPercentage}%</td>
                                                                                    <td>{gstAmount.toLocaleString()}</td>
                                                                                    <td>{totalAmount.toLocaleString()}</td>
                                                                                    <td className="text-nowrap">
                                                                                          <button
                                                                                                onClick={() => handleEditProduct(item, index)}
                                                                                                className="btn btn-sm text-white me-2"
                                                                                                style={{ background: "#ff7d34" }}
                                                                                          >
                                                                                                <i className="fa-solid fa-pencil"></i>
                                                                                          </button>

                                                                                          {/* ✅ now check real productList length, not filtered */}

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
                              onClick={() => handleCreateSalesOrder()}
                        >
                              Submit
                        </button>

                  </Modal.Footer>

                  {showPurchasedOrderProductAddUpdateModal && (
                        <SalesOrderProductModal
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


                  {modalProduct && (
                        <SerialNumberModal
                              show={showSerialModal}
                              onHide={() => setShowSerialModal(false)}
                              product={modalProduct}
                              qty={modalProduct.remainingQty}
                              onSave={handleSaveSerials}
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

export default SalesOrderSerialModal;



