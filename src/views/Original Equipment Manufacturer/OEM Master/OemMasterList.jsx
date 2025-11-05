

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
import OemMasterAddUpdateModal from './OemMasterAddUpdateModal';
import { ChangeOEMStatus, GetOEMList } from 'services/Original Equipment Manufacturer/OriginalEquipmentManufacturerApi';

const OemMasterList = () => {
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
      const GetProductListData = async (pageNumber, searchKeywordValue, toDateParam, fromDateParam, sortValue, ProductSortType) => {
            setLoader(true);
            try {
                  const data = await GetOEMList({
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
                              GetProductListData(pageNumber - 1);
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
                        GetProductListData(1);
                  } else {
                        GetProductListData(currentPage);
                  }
                  setIsAddUpdateActionDone(false);
                  setLastActionType(null);
            }
      }, [isAddUpdateActionDone]);

      // Initial fetch
      useEffect(() => {
            GetProductListData(1);
      }, []);

      const handleSearch = (e) => {
            const value = e.target.value.trimStart();
            const formatted = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            setSearchKeyword(formatted);
            GetProductListData(1, formatted);
      };

      const handlePageChange = (pageNumber) => {
            GetProductListData(pageNumber);
      };

      const addProductBtnClick = () => {
            setModelRequestData({ Action: null, oemKeyID: null });
            setLastActionType('Add');
            setOpenProductModal(true);
      };

      const editProductBtnClick = (row) => {
            setModelRequestData({ Action: 'Update', oemKeyID: row.oemKeyID });
            setLastActionType('Update');
            setOpenProductModal(true);
      };

      const handleStatusChange = (row) => {
            setStateChangeStatus(row);
            setShowStatusChangeModal(true);
      };

      const confirmStatusChange = async () => {
            try {
                  const { oemKeyID } = stateChangeStatus;
                  const response = await ChangeOEMStatus(oemKeyID, user.userKeyID);

                  if (response?.data?.statusCode === 200) {
                        setShowStatusChangeModal(false);
                        GetProductListData(currentPage);
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

      const handleSort = (currentSortDirection, ProductSortType) => {
            const newSortValue = currentSortDirection === 'asc' ? 'desc' : 'asc';
            if (ProductSortType === 'productName') {
                  setSortingDirection(newSortValue);
                  setSortDirectionObj({ ...sortDirectionObj, ProductNameSort: newSortValue });
                  GetProductListData(1, searchKeyword, toDate, fromDate, newSortValue, ProductSortType);
            }
      };

      const openModelList = (row) => {
            navigate('/model-list', {
                  state: {
                        productKeyID: row.productKeyID,
                        productName: row.productName,
                        hsn: row.hsn,
                        gstPercentage: row.gstPercentage
                  }
            });
      };

      const closeAllModal = () => {
            setShowSuccessModal(false);
      };

      return (
            <>
                  <div className="card w-full max-w-[50vh] mx-auto h-auto">
                        <div className="card-body p-2 bg-white shadow-md rounded-lg">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                    <div className="flex-grow-1 ">
                                          <h5 className="m-0">OEM Master</h5>
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
                                    <Tooltip title="Add OEM">
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

                                                      <th className="text-center">Manufacturer Info</th>
                                                      <th className="text-center">Status</th>
                                                      <th className="text-center">Action</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                {productListData?.map((row, idx) => (
                                                      <tr key={idx}>
                                                            <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                                                            <td className="text-center">{row.oemName}</td>
                                                            <td className="text-center">
                                                                  <motion.div
                                                                        whileHover={{ scale: 1.02, y: -2 }}
                                                                        transition={{ duration: 0.2 }}
                                                                        className="p-2 rounded bg-light text-start shadow-sm"
                                                                        style={{ fontSize: "13px", minWidth: "200px" }}
                                                                  >
                                                                        <div className="d-flex align-items-center gap-2 mb-1">
                                                                              <Mail size={14} className="text-primary" />
                                                                              <span>{row.oemEmailID}</span>
                                                                        </div>
                                                                        <div className="d-flex align-items-center gap-2 mb-1">
                                                                              <Phone size={14} className="text-success" />
                                                                              <span>{row.oemMobileNo}</span>
                                                                        </div>
                                                                        <div className="d-flex align-items-center gap-2">
                                                                              <MapPin size={14} className="text-danger" />
                                                                              <span>
                                                                                    {/* {row.oemAddress} */}
                                                                                    {row.oemAddress?.length > 30 ? (
                                                                                          <Tooltip title={row.oemAddress}>{`${row.oemAddress?.substring(0, 30)}...`}</Tooltip>
                                                                                    ) : (
                                                                                          <>{row.oemAddress}</>
                                                                                    )}

                                                                              </span>
                                                                        </div>
                                                                  </motion.div>
                                                            </td>

                                                            <td className="text-center">
                                                                  <Tooltip title={row.status ? 'Active' : 'Deactive'}>
                                                                        {row.status ? 'Active' : 'Deactive'}
                                                                        <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(row)} checked={row.status === true} />
                                                                  </Tooltip>
                                                            </td>
                                                            <td className="text-center">
                                                                  <div className="d-flex justify-content-center gap-2">
                                                                        <Tooltip title="Update OEM">
                                                                              <button
                                                                                    style={{ padding: '4px 8px', fontSize: '12px', height: '28px', width: '28px', background: "#ffaa33" }}
                                                                                    onClick={() => editProductBtnClick(row)}
                                                                                    type="button"
                                                                                    className="btn-sm btn text-white"
                                                                              >
                                                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                                              </button>
                                                                        </Tooltip>

                                                                  </div>
                                                            </td>
                                                      </tr>
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

                  {openProductModal && (
                        <OemMasterAddUpdateModal
                              show={openProductModal}
                              onHide={() => setOpenProductModal(false)}
                              modelRequestData={modelRequestData}
                              setModelRequestData={setModelRequestData}
                              setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                        />
                  )}

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

export default OemMasterList;
