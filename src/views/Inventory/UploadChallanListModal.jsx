import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { Link } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { uploadPdfWithNodeApi } from 'services/UploadImage/UploadImage';
import InventoryAddUpdateProductModal from './InventoryAddUpdateProductModal';
import { AddUpdateModelStock, GetModelStockModel } from 'services/Stock Assign/StockAssignApi';
import SuccessPopupModal from 'component/SuccessPopupModal';
import dayjs from 'dayjs';
import SerialNumberModal from './SerialNumberModal';
const UploadChallanListModal = ({ show,
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



      const [rateError, setRateError] = useState("");
      const [discountError, setDiscountError] = useState('');
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [modelAction, setModelAction] = useState('');
      const [error, setErrors] = useState(null);


      const { setLoader, user, companyID } = useContext(ConfigContext);
      const [showAddUpdateProductQuotationModal, setShowAddUpdateProductQuotationModal] = useState(false);
      const [modelProductData, setModelProductData] = useState({});
      const [editProductIndex, setEditProductIndex] = useState(null);
      const [productList, setProductList] = useState(quotationProductList || []);

      const [isFileChanged, setIsFileChanged] = useState(false); // 🔑 flag

      const [stockModalObj, setStockModalObj] = useState({
            userKeyID: null,
            stockKeyID: null,
            challanURL: null,
            stockReceiveDate: null,
            modelStockMapping: [],
            poPdfPreview: null
      });




      const [showModal, setShowModal] = useState(false);
      const [selectedProduct, setSelectedProduct] = useState(null);
      const [serials, setSerials] = useState({});

      const handleOpenModal = (item, index) => {
            setSelectedProduct({ ...item, index });
            setShowModal(true);
      };
      const handleSaveSerials = (index, serials) => {
            const updated = [...productList];
            updated[index].serials = serials;
            setProductList(updated);
      };

      useEffect(() => {
            if (modelRequestData) {
                  setStockModalObj(modelRequestData);
            }
      }, [modelRequestData]);

      useEffect(() => {
            if (modelRequestData?.Action === 'Update') {
                  if (modelRequestData?.stockKeyID !== null) {
                        GetModelStockModelData(modelRequestData.stockKeyID);
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

                  quantity: '',

            });
            setEditProductIndex(null);
            setShowAddUpdateProductQuotationModal(true);
      };


      const handleEditProduct = (item, index) => {
            setModelProductData(item);
            setEditProductIndex(index);
            setShowAddUpdateProductQuotationModal(true);
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
            setShowAddUpdateProductQuotationModal(false);
      };

      const handleDateChange = (date) => {
            setStockModalObj((prevState) => ({
                  ...prevState,
                  stockReceiveDate: dayjs(date).format("YYYY-MM-DD") // store only date string
            }));
      };
      const handleSubmit = async () => {

            // Validation
            // if (!stockModalObj.challanURL) {
            //       alert("Please upload Challan PDF");
            //       return;
            // }
            if (!stockModalObj.stockReceiveDate) {
                  alert("Please select Stock Receive Date");
                  return;
            }
            if (productList.length === 0) {
                  alert("Please add at least one product");
                  return;
            }

            // Build modelStockMapping array from productList
            // Build modelStockMapping array from productList
            const modelStockMapping = productList.map((p) => ({
                  modelStockID: null, // for new entries
                  modelID: p.modelID,
                  quantity: Number(p.quantity),
                  inventoryProductSerialNo: (p.serials || []).map((s) => ({
                        invProdSerNoID: null,
                        modelStockID: null,
                        invProdSerialNumber: Number(s)
                  }))
            }));

            // Final API payload
            const apiParam = {
                  userKeyID: user.userKeyID,
                  stockKeyID: stockModalObj.stockKeyID || null,
                  challanURL: isFileChanged ? stockModalObj.challanURL : null, // 🔑 key change

                  stockReceiveDate: stockModalObj.stockReceiveDate,
                  modelStockMapping
            };


            // Call your API here
            setLoader(true);
            try {
                  let url = '/AddUpdateModelStock';
                  const response = await AddUpdateModelStock(url, apiParam);
                  if (response?.data?.statusCode === 200) {


                        setShowSuccessModal(true)
                        setModelAction(
                              modelRequestData.Action === null || modelRequestData.Action === undefined
                                    ? 'Challan  Added Successfully!'
                                    : 'Challan Updated Successfully!'
                        );
                        // setModelAction('Challan added successfully.');
                        // onHide();
                        setIsAddUpdateActionDone(false); // refresh parent list if needed
                  }
            } catch (err) {
                  console.error("Error saving challan", err);
            } finally {
                  setLoader(false);
            }
      };


      const GetModelStockModelData = async (id) => {
            if (id === undefined) {
                  return;
            }

            setLoader(true);
            try {
                  const data = await GetModelStockModel(id);
                  if (data?.data?.statusCode === 200) {
                        setLoader(false);
                        const ModelData = data.data.responseData.data; // Assuming data is an array

                        setStockModalObj({
                              ...stockModalObj,
                              stockKeyID: ModelData.stockKeyID,
                              userKeyID: ModelData.userKeyID,
                              stockReceiveDate: ModelData.stockReceiveDate,
                              // modelStockMapping: ModelData.modelStockMapping || [],
                              challanURL: ModelData.challanURL,
                              poPdfPreview: ModelData.challanURL
                        });
                        // Set productList for table
                        setProductList(ModelData.modelStockMapping || []);
                        setIsFileChanged(false);
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




      return (
            <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
                  <Modal.Header closeButton>
                        <Modal.Title>
                              <h3 className="text-center">
                                    {modelRequestData.Action !== null ? 'Update Challan' : 'Add Challan'}
                              </h3>
                        </Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
                        <div className="container">
                              <div className="row">
                                    <div className="col-12 mb-3">
                                          <label htmlFor='challanUploadPDF' className="form-label">
                                                Upload Challan
                                                {/* <span style={{ color: 'red' }}>*</span> */}
                                          </label>
                                          <input
                                                id='challanUploadPDF'
                                                name='challanUploadPDF'
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
                                                                  setStockModalObj((prev) => ({
                                                                        ...prev,
                                                                        challanURL: s3Url,
                                                                        poPdfPreview: fileURL
                                                                  }));
                                                                  setIsFileChanged(true); // 🔑 user uploaded new file
                                                            }
                                                            setLoader(false);
                                                      }
                                                }}
                                          />

                                          {/* {error &&
                                                (stockModalObj.challanURL === null ||
                                                      stockModalObj.challanURL === undefined ||
                                                      stockModalObj.challanURL === '') ? (
                                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                          ) : (
                                                ''
                                          )} */}

                                          <span>
                                                <small>Note: Max 10MB</small>
                                          </span>
                                          {stockModalObj.poPdfPreview && (
                                                <div className="mt-3">
                                                      <div className="d-flex justify-content-between align-items-center mb-2">
                                                            <strong>Preview:</strong>
                                                            <button
                                                                  className="btn btn-sm btn-danger"
                                                                  onClick={() => {
                                                                        setStockModalObj((prev) => ({
                                                                              ...prev,
                                                                              challanURL: null,
                                                                              poPdfPreview: null
                                                                        }));
                                                                  }}
                                                            >
                                                                  Remove PDF
                                                            </button>
                                                      </div>
                                                      <iframe
                                                            src={stockModalObj.poPdfPreview}
                                                            title="PO PDF Preview"
                                                            width="100%"
                                                            height="200px"
                                                            style={{
                                                                  border: '1px solid #ccc',
                                                                  borderRadius: '4px',
                                                                  overflow: 'auto'
                                                            }}
                                                      // style={{ border: '1px solid #ccc', borderRadius: '4px' }}
                                                      />
                                                </div>
                                          )}
                                    </div>
                                    <div className="col-12  mb-2">
                                          <div>
                                                <label htmlFor='challanStockRecDate' className="form-label">
                                                      Stock Receive Date
                                                      <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <DatePicker
                                                      id='challanStockRecDate'
                                                      name='challanStockRecDate'
                                                      disabled={modelRequestData.subAction === 'UploadChallan'}
                                                      value={stockModalObj?.stockReceiveDate ? new Date(stockModalObj.stockReceiveDate) : null}
                                                      onChange={handleDateChange}
                                                      clearIcon={null}
                                                      popperPlacement="bottom-start"
                                                />
                                                {error &&
                                                      (stockModalObj.stockReceiveDate === null ||
                                                            stockModalObj.stockReceiveDate === undefined ||
                                                            stockModalObj.stockReceiveDate === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </div>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                          <h5>Products</h5>
                                          {
                                                modelRequestData.subAction !== 'UploadChallan' &&

                                                <button
                                                      onClick={addUpdateProductModal}
                                                      id="submitBtn"                       // 🟢 optional, stable for automation
                                                      data-testid="submit-button"
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
                                                            <th>Serial Numbers</th>
                                                            {/* <th>Rate</th> */}
                                                            {modelRequestData.subAction !== 'UploadChallan' &&
                                                                  <th>Actions</th>
                                                            }           {/* <th>Discount</th> */}
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
                                                                        {/* <td>{item.quantity} </td> */}
                                                                        <td className='text-center'


                                                                        >
                                                                              {item.quantity}
                                                                              <br />

                                                                              <span onClick={() => handleOpenModal(item, index)} className="text-primary fw-bold"
                                                                                    style={{ cursor: "pointer" }}>Manage Serial No.</span>
                                                                        </td>
                                                                        <td style={{ whiteSpace: "normal", wordBreak: "break-word", maxWidth: "350px" }}>
                                                                              {item.serials?.length > 0 ? (
                                                                                    <span className="badge bg-success p-2" style={{ display: "inline-block", whiteSpace: "pre-wrap" }}>
                                                                                          {item.serials.map((s, i) =>
                                                                                                (i + 1) % 5 === 0 ? `${s},\n` : `${s}, `
                                                                                          )}
                                                                                    </span>
                                                                              ) : (
                                                                                    <span className="text-muted">No serials</span>
                                                                              )}
                                                                        </td>

                                                                        {/* <td>{item.rate}</td> */}
                                                                        {/* <td>{item.discount || ''}</td> */}
                                                                        {modelRequestData.subAction !== 'UploadChallan' &&
                                                                              <td className='text-nowrap'>
                                                                                    <button
                                                                                          onClick={() => handleEditProduct(item, index)}
                                                                                          className="btn btn-sm text-white me-2"
                                                                                          style={{ background: '#ff7d34' }}
                                                                                    >
                                                                                          <i className="fa-solid fa-pencil"></i>
                                                                                    </button>
                                                                                    <button
                                                                                          onClick={() => handleDeleteProduct(index)}
                                                                                          className="btn btn-sm text-white"
                                                                                          style={{ background: '#ff7d34' }}
                                                                                    >
                                                                                          <i className="fa-solid fa-trash"></i>
                                                                                    </button>
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
                              style={{ background: '#ffaa33' }}
                              onClick={() => handleSubmit()}
                        >
                              Submit
                        </button>

                  </Modal.Footer>
                  {showAddUpdateProductQuotationModal && (
                        <InventoryAddUpdateProductModal
                              show={showAddUpdateProductQuotationModal}
                              onHide={() => setShowAddUpdateProductQuotationModal(false)}
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
                  <SerialNumberModal
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        product={selectedProduct}
                        onSave={handleSaveSerials}
                  />
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

export default UploadChallanListModal;