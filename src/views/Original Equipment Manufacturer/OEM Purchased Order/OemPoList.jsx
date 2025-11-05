
import React, { useState, useEffect, useContext } from 'react';
import Android12Switch from 'component/Android12Switch';
import { ConfigContext } from 'context/ConfigContext';
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react"; // ✅ Lucide icons

import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { Tooltip } from '@mui/material';
import ModelList from 'views/Model/ModelList';
import { GetProductList, ChangeProductStatus } from 'services/Product/ProductApi';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import StatusChangeModal from 'component/StatusChangeModal ';
import { hasPermission } from 'Middleware/permissionUtils';
import { ChangeOEMStatus, GetOEMList } from 'services/Original Equipment Manufacturer/OriginalEquipmentManufacturerApi';
import { GetOEMPurchaseOrderList } from 'services/Original Equipment Manufacturer/OEMPurchaseOrderApi';

const OemPoList = () => {
      const { setLoader, user, permissions } = useContext(ConfigContext);
      const navigate = useNavigate();

      const [stateChangeStatus, setStateChangeStatus] = useState('');
      const [modelAction, setModelAction] = useState();
      const [currentPage, setCurrentPage] = useState(1);
      const [totalPage, setTotalPage] = useState(0);
      const [pageSize] = useState(30);
      const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
      const [lastActionType, setLastActionType] = useState(null);
      const [searchKeyword, setSearchKeyword] = useState('');
      const [fromDate, setFromDate] = useState(null);
      const [toDate, setToDate] = useState(null);
      const [productListData, setProductListData] = useState([]);
      const [openProductModal, setOpenProductModal] = useState(false);
      const [sortingDirection, setSortingDirection] = useState(null);
      const [sortDirectionObj, setSortDirectionObj] = useState({ ProductNameSort: null });
      const [sortType, setSortType] = useState('');
      const [totalCount, setTotalCount] = useState(0);

      const [modelRequestData, setModelRequestData] = useState({
            productKeyID: null,
            Action: null
      });

      // Main fetcher
      const GetOEMPurchaseOrderListData = async (pageNumber, searchKeywordValue, toDateParam, fromDateParam, sortValue, ProductSortType) => {
            setLoader(true);
            try {
                  const data = await GetOEMPurchaseOrderList({
                        pageSize,
                        pageNo: pageNumber - 1,
                        searchKeyword: searchKeywordValue ?? searchKeyword,
                        toDate: toDateParam ? dayjs(toDateParam).format('YYYY-MM-DD') : null,
                        fromDate: fromDateParam ? dayjs(fromDateParam).format('YYYY-MM-DD') : null,
                        sortingDirection: sortValue ?? sortingDirection,
                        sortingColumnName: sortType || ProductSortType || null,
                        userKeyID: user.userKeyID
                  });

                  if (data?.data?.statusCode === 200) {
                        const ProductData = data.data.responseData.data;
                        const totalItems = data.data?.totalCount || 0;
                        setTotalCount(totalItems);
                        setTotalPage(Math.ceil(totalItems / pageSize));
                        setProductListData(ProductData);

                        // Auto back if empty but data exists
                        if (ProductData.length === 0 && totalItems > 0 && pageNumber > 1) {
                              GetOEMPurchaseOrderListData(pageNumber - 1);
                              setCurrentPage(pageNumber - 1);
                        } else {
                              setCurrentPage(pageNumber);
                        }
                  } else {
                        console.error(data?.data?.errorMessage);
                  }
            } catch (error) {
                  console.error(error);
            } finally {
                  setLoader(false);
            }
      };

      // On Add/Update completion
      useEffect(() => {
            if (isAddUpdateActionDone) {
                  if (lastActionType === 'Add') {
                        GetOEMPurchaseOrderListData(1);
                  } else {
                        GetOEMPurchaseOrderListData(currentPage);
                  }
                  setIsAddUpdateActionDone(false);
                  setLastActionType(null);
            }
      }, [isAddUpdateActionDone]);

      // Initial fetch
      useEffect(() => {
            GetOEMPurchaseOrderListData(1);
      }, []);

      const handleSearch = (e) => {
            const value = e.target.value.trimStart();
            const formatted = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            setSearchKeyword(formatted);
            GetOEMPurchaseOrderListData(1, formatted);
      };

      const handlePageChange = (pageNumber) => {
            GetOEMPurchaseOrderListData(pageNumber);
      };

      const addProductBtnClick = () => {

            let updateQuote = {
                  Action: null,
                  oemPurchaseOrderKeyID: null,


            };

            navigate('/original-equipment-manufacturer-purchased-order', { state: updateQuote });

      };

      const editProductBtnClick = (row) => {



            let updateQuote = {
                  Action: "Update",
                  oemPurchaseOrderKeyID: row.oemPurchaseOrderKeyID,


            };

            navigate('/original-equipment-manufacturer-purchased-order', { state: updateQuote });

      };



      const confirmStatusChange = async () => {
            try {
                  const { oemKeyID } = stateChangeStatus;
                  const response = await ChangeOEMStatus(oemKeyID, user.userKeyID);

                  if (response?.data?.statusCode === 200) {
                        setShowStatusChangeModal(false);
                        GetOEMPurchaseOrderListData(currentPage);
                        setShowSuccessModal(true);
                        setModelAction('OEM status changed successfully.');
                  } else {
                        console.error(response?.data?.errorMessage);
                        setShowSuccessModal(true);
                        setModelAction('Failed to change product status.');
                  }
            } catch (error) {
                  console.error(error);
                  setShowSuccessModal(true);
                  setModelAction('An error occurred while changing the product status.');
            }
      };





      const closeAllModal = () => {
            setShowSuccessModal(false);
      };
      const [expandedRow, setExpandedRow] = useState(null);

      const toggleExpand = (id) => {
            setExpandedRow(expandedRow === id ? null : id);
      };

      console.log(productListData, '987ydsa897uhdas');



      const oemPreviewQuotation = (row, isDownloadMode = false) => {




            navigate('/oem-quotation-preview', {
                  state: {
                        row,
                        action: 'FromPendingForApproval', BTNAction: 'Hide',
                        showDownloadButton: isDownloadMode, // pass true or false
                  }
            });
      };

      return (
            <>
                  <div className="card w-full max-w-[50vh] mx-auto h-auto">
                        <div className="card-body p-2 bg-white shadow-md rounded-lg">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                    <div className="flex-grow-1 ">
                                          <h5 className="m-0">OEM PO</h5>
                                    </div>
                                    <button onClick={addProductBtnClick} className="btn btn-primary btn-sm d-inline d-sm-none">
                                          <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                                          <span className="d-inline d-sm-none"> Add</span>
                                    </button>
                              </div>

                              <div className="d-flex justify-content-between align-items-center mb-1">
                                    <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Search OEM"
                                          style={{ maxWidth: '350px' }}
                                          value={searchKeyword}
                                          onChange={handleSearch}
                                    />
                                    <Tooltip title="Add OEM PO">
                                          <button onClick={addProductBtnClick} style={{ background: '#ffaa33' }} className="btn text-white  btn-sm d-none d-sm-inline">
                                                <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                                                <span className="d-none d-sm-inline"> Add </span>
                                          </button>
                                    </Tooltip>
                              </div>

                              <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
                                    <table className="table table-bordered table-striped">
                                          <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                                                <tr>
                                                      <th className="text-center">Sr No</th>
                                                      <th className="text-center">OEM Name</th>
                                                      <th className="text-center">OEM Product Info</th>

                                                      <th className="text-center"> OEM PO Date</th>
                                                      <th className="text-center">Action</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                {productListData?.map((row, idx) => (
                                                      <React.Fragment key={row.oemPurchaseOrderID}>
                                                            {/* Main Row */}
                                                            <tr>
                                                                  <td className="text-center">
                                                                        {(currentPage - 1) * pageSize + idx + 1}
                                                                  </td>

                                                                  <td className="text-center">{row.oemName}</td>

                                                                  {/* Expand toggle */}
                                                                  <td
                                                                        className="text-center"
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={() => toggleExpand(row.oemPurchaseOrderID)}
                                                                  >
                                                                        {row.oempoProductMappingList?.length === 1
                                                                              ? row.oempoProductMappingList[0].productName
                                                                              : "Multiple Products"}
                                                                        <i
                                                                              className={`ms-2 fa-solid ${expandedRow === row.oemPurchaseOrderID
                                                                                    ? "fa-chevron-up "
                                                                                    : "fa-chevron-down text-bold"
                                                                                    }`}
                                                                        ></i>
                                                                  </td>

                                                                  <td className="text-center">{row.purchaseOrderDate}</td>

                                                                  {/* Edit button stays in main row */}
                                                                  <td className="text-center">
                                                                        <Tooltip title="Update OEM PO">
                                                                              <button
                                                                                    style={{
                                                                                          padding: "4px 8px",
                                                                                          fontSize: "12px",
                                                                                          height: "28px",
                                                                                          width: "28px",
                                                                                          background: "#ffaa33",
                                                                                    }}
                                                                                    onClick={() => editProductBtnClick(row)}
                                                                                    type="button"
                                                                                    className="btn-sm btn text-white me-2"
                                                                              >
                                                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                                              </button>
                                                                        </Tooltip>
                                                                        <Tooltip title="OEM Quotation View / Download">
                                                                              <button
                                                                                    style={{
                                                                                          padding: "4px 8px",
                                                                                          fontSize: "12px",
                                                                                          height: "28px",
                                                                                          width: "28px",
                                                                                          background: "#ffaa33",
                                                                                    }}
                                                                                    onClick={() => oemPreviewQuotation(row, true)}
                                                                                    type="button"
                                                                                    className="btn-sm btn text-white me-2"
                                                                              >
                                                                                    <i className="fa-solid fa-download"></i>
                                                                              </button>
                                                                        </Tooltip>
                                                                  </td>
                                                            </tr>

                                                            {/* Expanded Row */}
                                                            {expandedRow === row.oemPurchaseOrderID && (
                                                                  <tr>
                                                                        <td colSpan="5">
                                                                              <table className="table table-sm table-bordered mb-2">
                                                                                    <thead className="table-secondary">
                                                                                          <tr>
                                                                                                <th>Product</th>
                                                                                                <th>Manufacturer</th>
                                                                                                <th>Variant</th>
                                                                                                <th>Model</th>
                                                                                                <th>Unit</th>
                                                                                                <th>Qty</th>
                                                                                                <th>Rate ⟨₹⟩ </th>
                                                                                                <th>GST%</th>
                                                                                          </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                          {row.oempoProductMappingList?.map((p) => (
                                                                                                <tr key={p.oempoProductMapID}>
                                                                                                      <td>{p.productName}</td>
                                                                                                      <td>{p.manufacturerName}</td>
                                                                                                      <td>{p.variantName}</td>
                                                                                                      <td>{p.modelName}</td>
                                                                                                      <td>{p.unit}</td>
                                                                                                      <td>{p.quantity}</td>
                                                                                                      <td>
                                                                                                            {new Intl.NumberFormat('en-IN', {
                                                                                                                  style: 'decimal',
                                                                                                                  maximumFractionDigits: 0,
                                                                                                                  minimumFractionDigits: 0
                                                                                                            }).format(Math.round(p.rate))}
                                                                                                      </td>
                                                                                                      <td>{p.gstPercentage}</td>
                                                                                                </tr>
                                                                                          ))}
                                                                                    </tbody>
                                                                              </table>


                                                                        </td>
                                                                  </tr>
                                                            )}
                                                      </React.Fragment>
                                                ))}
                                          </tbody>

                                    </table>
                                    {totalCount === 0 && <NoResultFoundModel totalRecords={totalCount} />}
                              </div>

                              <div className="d-flex justify-content-end">
                                    {totalCount > pageSize && (
                                          <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
                                    )}
                              </div>
                        </div>
                  </div>



                  <StatusChangeModal open={showStatusChangeModal} onClose={() => setShowStatusChangeModal(false)} onConfirm={confirmStatusChange} />

                  {showSuccessModal && (
                        <SuccessPopupModal
                              show={showSuccessModal}
                              onHide={closeAllModal}
                              setShowSuccessModal={setShowSuccessModal}
                              modelAction={modelAction}
                        />
                  )}
            </>
      );
};

export default OemPoList;
