import React, { useState, useEffect, useContext } from 'react';
import Android12Switch from 'component/Android12Switch';
import { ConfigContext } from 'context/ConfigContext';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';

import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModal from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { Tooltip } from '@mui/material';
import StatusChangeModal from 'component/StatusChangeModal ';
import { ChangeModelStatus, GetModelList } from 'services/Model/ModelListAPI';
import AddUpdateModelModal from './ModelAddUpdateModal';
import { hasPermission } from 'Middleware/permissionUtils';

const ModelList = ({ selectedProduct, onClose }) => {
  const { setLoader, user, permissions } = useContext(ConfigContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(30);
  const [totalPage, setTotalPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [modelListData, setModelListData] = useState([]);
  const [modelRequestData, setModelRequestData] = useState({});
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [statusChangeRow, setStatusChangeRow] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modelAction, setModelAction] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const [productInfo, setProductInfo] = useState({
    productKeyID: location.state?.productKeyID || '',
    productName: location.state?.productName || 'Selected Product'
  });

  console.log('productKeyID from state:', productInfo.productKeyID);

  const fetchModelList = async (pageNumber = 1, searchValue = '') => {
    setLoader(true);
    try {
      const res = await GetModelList(
        {
          pageNo: pageNumber - 1,
          pageSize,
          searchKeyword: searchValue,
          userKeyID: user.userKeyID,
          sortingDirection: 'ASC',
          sortingColumnName: 'modelName'
        },
        productInfo.productKeyID
      );
      if (res?.data?.statusCode === 200) {
        const data = res.data.responseData.data || [];
        setModelListData(data);
        const count = res.data.totalCount || data.length;
        setTotalCount(count);
        setTotalPage(Math.ceil(count / pageSize));
      } else {
        setModelListData([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (productInfo.productKeyID) {
      fetchModelList(1, '');
    }
  }, [productInfo.productKeyID]);

  useEffect(() => {
    if (selectedProduct) {
      setProductInfo({
        productKeyID: selectedProduct.productKeyID || '',
        productName: selectedProduct.productName || 'Selected Product'
      });
    }
  }, [selectedProduct]);

  const handleSearch = (e) => {
    const value = e.target.value.trimStart();
    setSearchKeyword(value);
    fetchModelList(1, value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchModelList(page, searchKeyword);
  };

  const handleAdd = () => {
    setModelRequestData({
      ...modelRequestData,
      productKeyID: productInfo.productKeyID,
      Action: 'Add'
    });
    setShowAddUpdateModal(true);
  };

  const handleEdit = (row) => {
    setModelRequestData({
      ...row,
      productKeyID: productInfo.productKeyID,
      Action: 'Update'
    });
    setShowAddUpdateModal(true);
  };
  const handleStockAssign = (row) => {
    setModelRequestData({
      ...row,
      productKeyID: productInfo.productKeyID,
      Action: 'Update'
    });

    navigate('/stock-assign-list', {
      state: {
        modelName: row.modelName,

      }
    });
  };

  const handleStatusClick = (row) => {
    setStatusChangeRow(row);
    setShowStatusChangeModal(true);
  };

  const confirmStatusChange = async () => {
    try {
      const res = await ChangeModelStatus(statusChangeRow.modelKeyID, user.userKeyID);
      if (res?.data?.statusCode === 200) {
        setModelAction('Status changed successfully.');
      } else {
        setModelAction('Failed to change status.');
      }
      fetchModelList(currentPage, searchKeyword);
    } catch (err) {
      setModelAction('Error changing status.');
    } finally {
      setShowStatusChangeModal(false);
      setShowSuccessModal(true);
    }
  };

  const closeAllModals = () => {
    setShowSuccessModal(false);
  };

  return (
    <>
      <div className="card w-full max-w-[90%] mx-auto h-auto">
        <div className="card-body p-2 bg-white shadow-md rounded-lg">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <h5 className="mb-2">
              <span style={{ color: '#ffaa33', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/product')}>
                Product
              </span>
              {' > '}
              <span className="mb-0">
                <b>{productInfo.productName}</b>
              </span>
            </h5>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search Model"
              style={{ maxWidth: '350px' }}
              value={searchKeyword}
              onChange={handleSearch}
            />

            {hasPermission(permissions, 'Model Stock', 'Can Insert') && (
              <Tooltip title="Add Model">
                <button onClick={handleAdd} style={{ background: "#ffaa33" }} className="btn text-white btn-sm">
                  <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px', }}></i>
                  <span>Add</span>
                </button>
              </Tooltip>
            )}
          </div>

          <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                <tr>
                  <th className="text-center">Sr No</th>
                  <th className="text-center">Model Name</th>
                  <th className="text-center">Rating</th>
                  <th className="text-center">Manufacturer </th>
                  <th className="text-center">Scope Of Supply </th>
                  <th className="text-center">Warranty In Month </th>
                  <th className="text-center">Description</th>
                  <th className="text-center">Rate ⟨₹⟩ </th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {modelListData.map((row, idx) => (
                  <tr key={row.modelKeyID}>
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="text-center">{row.modelName}</td>
                    <td className="text-center">{row.variantName}</td>
                    <td className="text-center">{row.manufacturerName}</td>
                    <td className="text-center">{row.scopeOfSupply}</td>
                    <td className="text-center">{row.warrantyInMonth}</td>
                    <td className="text-center" dangerouslySetInnerHTML={{ __html: row.modelDescription }}></td>
                    <td className="text-center">{row.rate}</td>
                    <td className="text-center">
                      <Tooltip title={row.status ? 'Active' : 'Inactive'}>
                        {row.status ? 'Active' : 'Inactive'}
                        <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusClick(row)} checked={row.status} />
                      </Tooltip>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Tooltip title="Edit Model">
                          <button
                            onClick={() => handleEdit(row)}
                            className="btn btn-sm text-white"
                            style={{
                              padding: '4px 8px',
                              fontSize: '12px',
                              height: '28px',
                              width: '28px',
                              background: '#ffaa33'
                            }}
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                        </Tooltip>
                        {/* {hasPermission(permissions, 'Model Stock', 'Can Update') && (
                          <Tooltip title="Stock Assign">
                            <button
                              onClick={() => handleStockAssign(row)} // change handler if needed
                              className="btn btn-sm text-white"
                              style={{
                                padding: '4px 8px',
                                fontSize: '12px',
                                height: '28px',
                                width: '28px',
                                background: '#ffaa33'
                              }}
                            >
                              <i class="fa-solid fa-boxes-stacked"></i>                          </button>
                          </Tooltip>
                        )} */}
                      </div>
                    </td>


                  </tr>
                ))}
              </tbody>
            </table>
            {modelListData.length === 0 && <NoResultFoundModal totalRecords={modelListData.length} />}
          </div>

          <div className="d-flex justify-content-end">
            {totalCount > pageSize && (
              <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
            )}
          </div>
        </div>
      </div>

      {showAddUpdateModal && (
        <AddUpdateModelModal
          show={showAddUpdateModal}
          onHide={() => setShowAddUpdateModal(false)}
          modelRequestData={modelRequestData}
          setIsAddUpdateActionDone={() => {
            fetchModelList(currentPage, searchKeyword);
            setShowAddUpdateModal(false); // ✅ closes modal immediately
            setModelAction('Model added successfully.');
            setShowSuccessModal(true); // ✅ show success popup after closing
          }}
        />
      )}

      <StatusChangeModal open={showStatusChangeModal} onClose={() => setShowStatusChangeModal(false)} onConfirm={confirmStatusChange} />

      {showSuccessModal && <SuccessPopupModal show={showSuccessModal} onHide={closeAllModals} modelAction={modelAction} />}
    </>
  );
};

export default ModelList;
