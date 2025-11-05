



import React, { useContext, useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import { Tooltip } from '@mui/material';
import 'react-date-picker/dist/DatePicker.css';
import { GetQutationNumberFormatLookupList } from 'services/Quotation/QuotationApi';
import { useLocation, useNavigate } from 'react-router';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { GetQuotationModel } from 'services/Quotation Module/AddUpdateQuotationApi';
import { ConfigContext } from 'context/ConfigContext';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { AddUpdateSalesOrderProduct, GetSalesOrderProductList, } from 'services/Sales Order Product/SalesOrderProductApi';
import InventoryAddUpdateProductModal from './InventoryAddUpdateProductModal';
import UploadChallanListModal from './UploadChallanListModal';
import { GetModelStockList } from 'services/Stock Assign/StockAssignApi';
import dayjs from 'dayjs';
const InventoryAddUpdateList = () => {
      const [modelRequestData, setModelRequestData] = useState({});
      const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
      const [editIndex, setEditIndex] = useState(null); // null for add
      const [productTypeOption, setProductTypeOption] = useState([]);
      const [manufactureOption, setManufactureOption] = useState([]);
      const [salesOrderProductListData, setSalesOrderProductListData] = useState([])
      const [showSerialErrors, setShowSerialErrors] = useState(false)
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [variantOption, setVariantOption] = useState([]);
      const [modelOption, setModelOption] = useState([]);
      const [quotationNoFormatOption, setQuotationNoFormatOption] = useState([]);
      const [reviewEmpOption, setReviewEmpOption] = useState([]);
      const [leadOption, setLeadOption] = useState([]);
      const [error, setErrors] = useState(null);
      const [currentPage, setCurrentPage] = useState(1);
      const [totalPage, setTotalPage] = useState();
      const [totalCount, setTotalCount] = useState(null);
      const [pageSize, setPageSize] = useState(30);
      const [stateListData, setStateListData] = useState([])
      const [totalRecords, setTotalRecords] = useState(-1);
      const [quotationFormatOption, setQuotationFormatOption] = useState([]);
      const [termsConditionOption, setTermsConditionOption] = useState([]);
      const [errorMessage, setErrorMessage] = useState(false);
      const [searchKeyword, setSearchKeyword] = useState('');

      const [showAddUpdateProductQuotationModal, setShowAddUpdateProductQuotationModal] = useState(false);
      const [showChallanListModal, setShowChallanListModal] = useState(false);
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
      const [selectedProductIndex, setSelectedProductIndex] = useState(null);

      useEffect(() => {
            if (location.state?.quotationKeyID !== undefined) {
                  if (location.state?.quotationKeyID !== null) {
                        GetQuotationModelData(location.state?.quotationKeyID);
                  }
            }
      }, [location]);
      console.log(location.state, 's33333333333333ssssssss');

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
      // location.state
      console.log(location.state, 'dsad32dsa');

      const [expandedRows, setExpandedRows] = useState([]);

      const toggleRow = (stockKeyID) => {
            setExpandedRows((prev) =>
                  prev.includes(stockKeyID)
                        ? prev.filter((id) => id !== stockKeyID)
                        : [...prev, stockKeyID]
            );
      };
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
                              // quotationFormatID: 2,

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
            // debugger
            setModelRequestData({
                  // subAction: 'UploadChallan',
                  // quotationFormatID: location.state.quotationFormatID,
                  productID: null,
                  Action: null,
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


            setEditIndex(null);
            // setShowAddUpdateProductQuotationModal(true);
            setShowChallanListModal(true);

      };

      const navigate = useNavigate();








      const handleAddOrUpdateProduct = (updatedProduct, editIndex) => {
            const updatedProducts = [...quotationObj.quotationProductMapping];

            if (editIndex !== null) {
                  updatedProducts[editIndex] = {
                        ...updatedProducts[editIndex],
                        ...updatedProduct
                  };
            } else {
                  updatedProducts.push({
                        ...updatedProduct,
                        salesProductSerNoList: [] // default empty
                  });
            }

            setQuotationObj((prev) => ({
                  ...prev,
                  quotationProductMapping: updatedProducts
            }));
      };






      const closeAllModal = () => {
            setShowSuccessModal(false);
            navigate('/sales-order-management');
      };

      useEffect(() => {
            GetModelStockListData(1, null, null, null)
      }, [])

      useEffect(() => {
            if (isAddUpdateActionDone) {
                  GetModelStockListData(1, null, null, null)

            }
            setIsAddUpdateActionDone(true)
      }, [isAddUpdateActionDone])

      const GetModelStockListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {

            setLoader(true);
            try {
                  const data = await GetModelStockList({
                        pageSize,
                        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
                        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
                        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
                        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                        sortingDirection: null,
                        sortingColumnName: null,
                        userKeyID: user.userKeyID
                  });

                  if (data) {
                        if (data?.data?.statusCode === 200) {
                              setLoader(false);
                              if (data?.data?.responseData?.data) {
                                    const MasterStateListData = data.data.responseData.data;
                                    const totalItems = data.data?.totalCount; // const totalItems = 44;
                                    setTotalCount(totalItems);
                                    const totalPages = Math.ceil(totalItems / pageSize);
                                    setTotalPage(totalPages);
                                    setTotalRecords(MasterStateListData.length);
                                    setStateListData(MasterStateListData);
                              }
                        } else {
                              setErrorMessage(data?.data?.errorMessage);
                              setLoader(false);
                        }
                  }
            } catch (error) {
                  console.log(error);
                  setLoader(false);
            }
      };
      console.log(salesOrderProductListData, '20932sd89cfhsncfhsd8ifos');
      const handleCreateSalesOrder = async () => {
            const salesProducts = quotationObj.quotationProductMapping;

            // ✅ 1. Validate: All products must have at least one serial number, and all serials must be filled
            for (let i = 0; i < salesProducts.length; i++) {
                  const product = salesProducts[i];
                  const serialList = product.salesProductSerNoList || [];

                  // ❌ Case 1: No serials at all
                  if (serialList.length === 0) {
                        setShowSerialErrors(`Please enter serial number for product ${product.productName || i + 1}`);
                        return;
                  }

                  // ❌ Case 2: Some serials are empty
                  const emptySerials = serialList.filter(s => !s.serialNumber || String(s.serialNumber).trim() === '');
                  if (emptySerials.length > 0) {
                        setShowSerialErrors(`Please fill all serial numbers for product ${product.productName || i + 1}`);
                        return;
                  }
            }


            const apiParam = {
                  userKeyID: user.userKeyID,
                  salesProductKeyID: null,
                  leadKeyID: location.state.leadKeyID,
                  salesProduct: quotationObj.quotationProductMapping.map(product => ({
                        salesProductID: null,
                        productID: product.productID,
                        manufacturerID: product.manufacturerID,
                        variantID: product.variantID,
                        modelID: product.modelID,
                        unit: product.unit,
                        quantity: product.quantity,
                        rate: product.rate,
                        scopeOfSupply: product.scopeOfSupply,
                        warranty: product.warranty,
                        salesProductSerialNo: product.salesProductSerNoList?.map(serial => ({
                              salesProductSerID: null,
                              salesProductID: null,
                              serialNumber: serial.serialNumber
                        })) || []
                  }))
            };

            AddUpdateStateData(apiParam)
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
                                          : 'Sales Order Updated Successfully!'
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



      const updateBtnClick = (stock) => {
            setModelRequestData({
                  ...modelRequestData,
                  Action: 'Update',
                  stockKeyID: stock.stockKeyID
            });
            setShowChallanListModal(true);
      };
      const uploadChallan = (stock) => {
            setModelRequestData({
                  ...modelRequestData,
                  Action: 'Update',
                  subAction: 'UploadChallan',
                  stockKeyID: stock.stockKeyID
            });
            setShowChallanListModal(true);
      };


      const handleSearch = (e) => {
            let searchKeywordValue = e.target.value;
            const trimmedValue = searchKeywordValue.replace(/^\s+/g, '');
            const capitalizedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1).toLowerCase();
            if (searchKeywordValue.length === 1 && searchKeywordValue.startsWith(' ')) {
                  searchKeywordValue = searchKeywordValue.trimStart();
                  return;
            }
            setSearchKeyword(capitalizedValue);
            GetModelStockListData(1, capitalizedValue, null, null);
      };

      console.log(stateListData, '32dsdsa');


      return (
            <>
                  <div className="card w-full max-w-[50vh] mx-auto h-auto">
                        <div className="card-body p-2 bg-white shadow-md rounded-lg">
                              <div className="d-flex justify-content-between align-items-center mb-3 mt-3 position-relative">
                                    {/* Back Button */}
                                    <div>
                                          <button
                                                onClick={() => navigate(-1)}
                                                className="btn btn-sm btn-outline-secondary"
                                          >
                                                ←
                                          </button>
                                    </div>
                                    <h5 className="mb-0 text-center flex-grow-1">Inventory</h5>
                                    <div className="d-flex align-items-center">
                                          <input
                                                type="text"
                                                className="form-control me-2"
                                                placeholder="Search.."
                                                style={{ maxWidth: "250px" }}
                                                value={searchKeyword}
                                                onChange={(e) => handleSearch(e)}
                                          />


                                    </div>
                                    {/* Add Product Button */}
                                    <Tooltip title="Currently Disable , please use at CRM / Store  Panel">

                                          <button
                                                onClick={addUpdateProductModal}
                                                className="btn text-white btn-sm ms-2"
                                                style={{ background: '#ffaa33' }}
                                          >
                                                <i class="fa-solid fa-circle-plus"></i> Add Inventory
                                          </button>
                                    </Tooltip>

                              </div>




                              <div className="table-responsive">
                                    <table className="table table-bordered table-hover align-middle">
                                          <thead className="table-light">
                                                <tr>
                                                      <th>Sr No</th>
                                                      <th>Stock Receive Date</th>
                                                      <th>Challan</th>
                                                      <th>Products</th>

                                                      {/* <th>Action</th> */}
                                                </tr>
                                          </thead>

                                          <tbody>
                                                {stateListData?.length > 0 ? (
                                                      stateListData.map((stock, index) => {
                                                            const isExpanded = expandedRows.includes(stock.stockKeyID);
                                                            return (
                                                                  <React.Fragment key={stock.stockKeyID}>
                                                                        {/* Parent Row */}
                                                                        {/* Parent Row */}
                                                                        <tr>
                                                                              <td>{index + 1}</td>
                                                                              <td>{stock.stockReceiveDate}</td>
                                                                              <td>
                                                                                    {stock.challanURL ? (
                                                                                          <a href={stock.challanURL} target="_blank" rel="noopener noreferrer">
                                                                                                Download
                                                                                          </a>
                                                                                    ) : (

                                                                                          <Tooltip title='Not Available For Admin'>

                                                                                                <a style={{ color: 'blue', cursor: 'pointer' }}
                                                                                                // onClick={() => uploadChallan(stock)}
                                                                                                >
                                                                                                      Upload Challan
                                                                                                </a>
                                                                                          </Tooltip>


                                                                                    )}
                                                                              </td>
                                                                              <td>
                                                                                    <button
                                                                                          className="btn btn-link p-0"
                                                                                          onClick={() => toggleRow(stock.stockKeyID)}
                                                                                    >
                                                                                          {isExpanded ? "▼ Hide Products" : "▶ Show Products"}
                                                                                    </button>
                                                                              </td>
                                                                              {/* <td>
                                                                                    {!isExpanded && (
                                                                                          <Tooltip title="Update Stock">
                                                                                                <button
                                                                                                      style={{ background: "#9aa357" }}
                                                                                                      onClick={() => updateBtnClick(stock)}
                                                                                                      className="btn text-white btn-sm me-2"
                                                                                                >
                                                                                                      <i className="fa-solid fa-pencil"></i>
                                                                                                </button>
                                                                                          </Tooltip>
                                                                                    )}
                                                                              </td> */}
                                                                        </tr>

                                                                        {/* Child Row for Products */}
                                                                        {isExpanded && (
                                                                              <tr className="expanded-row">
                                                                                    <td colSpan={5} className="p-0">
                                                                                          <div
                                                                                                style={{
                                                                                                      background: "#f9f9f9",
                                                                                                      border: "2px solid #9aa357",
                                                                                                      borderRadius: "6px",
                                                                                                      margin: "10px",
                                                                                                      padding: "10px",
                                                                                                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                                                                                                }}
                                                                                          >
                                                                                                <table className="table mb-0 table-sm">
                                                                                                      <thead className="table-secondary">
                                                                                                            <tr>
                                                                                                                  <th>Product Name</th>
                                                                                                                  <th>Manufacturer</th>
                                                                                                                  <th>Variant</th>
                                                                                                                  <th>Model</th>
                                                                                                                  <th>Quantity</th>
                                                                                                                  <th>Serial Number</th>
                                                                                                                  {/* <th>Action</th> New column for edit button */}
                                                                                                            </tr>
                                                                                                      </thead>
                                                                                                      <tbody>
                                                                                                            {stock.modelStockMapping?.map((m, i) => (
                                                                                                                  <tr key={m.modelStockID || i}>
                                                                                                                        <td>{m.productName}</td>
                                                                                                                        <td>{m.manufacturerName}</td>
                                                                                                                        <td>{m.variantName}</td>
                                                                                                                        <td>{m.modelName}</td>
                                                                                                                        <td>{m.quantity}</td>
                                                                                                                        <td>
                                                                                                                              {m?.inventoryProductSerialNo?.length > 0
                                                                                                                                    ? m.inventoryProductSerialNo.map(s => s.invProdSerialNumber).join(", ")
                                                                                                                                    : "N/A"}
                                                                                                                        </td>
                                                                                                                        {/* <td>
                                                                                                                              <Tooltip title="Update Stock">
                                                                                                                                    <button
                                                                                                                                          style={{ background: "#9aa357" }}
                                                                                                                                          onClick={() => updateBtnClick(stock)}
                                                                                                                                          className="btn text-white btn-sm"
                                                                                                                                    >
                                                                                                                                          <i className="fa-solid fa-pencil"></i>
                                                                                                                                    </button>
                                                                                                                              </Tooltip>
                                                                                                                        </td> */}
                                                                                                                  </tr>
                                                                                                            ))}
                                                                                                      </tbody>
                                                                                                </table>
                                                                                          </div>
                                                                                    </td>
                                                                              </tr>
                                                                        )}


                                                                  </React.Fragment>
                                                            );
                                                      })
                                                ) : (
                                                      <tr>
                                                            <td colSpan={5} className="text-center">
                                                                  No data found
                                                            </td>
                                                      </tr>
                                                )}
                                          </tbody>
                                    </table>


                                    {/* ✅ Buttons at bottom with spacing */}

                              </div>







                              {showChallanListModal &&

                                    <UploadChallanListModal
                                          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                                          show={showChallanListModal}
                                          onHide={() => setShowChallanListModal(false)}
                                          modelRequestData={modelRequestData}
                                          onSave={handleAddOrUpdateProduct}
                                          editIndex={editIndex}
                                          productTypeOption={productTypeOption}
                                          manufactureOption={manufactureOption}
                                          variantOption={variantOption}
                                          modelOption={modelOption}
                                          quotationProductList={quotationObj.quotationProductMapping} // 👈 add this
                                    />
                              }
                              <InventoryAddUpdateProductModal
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
                  </div >
            </>
      );
};

export default InventoryAddUpdateList;
