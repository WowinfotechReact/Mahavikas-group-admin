import React, { useState, useEffect, useContext } from 'react';
import Android12Switch from 'component/Android12Switch';
import { ConfigContext } from 'context/ConfigContext';
import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { Tooltip } from '@mui/material';
import ProductAddUpdateModal from './ProductAddUpdateModal';
import ModelList from 'views/Model/ModelList';
import { GetProductList, ChangeProductStatus } from 'services/Product/ProductApi';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import StatusChangeModal from 'component/StatusChangeModal ';
import { hasPermission } from 'Middleware/permissionUtils';

const ProductList = () => {
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
      const data = await GetProductList({
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
    setModelRequestData({ Action: null, productKeyID: null });
    setLastActionType('Add');
    setOpenProductModal(true);
  };

  const editProductBtnClick = (row) => {
    setModelRequestData({ Action: 'Update', productKeyID: row.productKeyID });
    setLastActionType('Update');
    setOpenProductModal(true);
  };

  const handleStatusChange = (row) => {
    setStateChangeStatus(row);
    setShowStatusChangeModal(true);
  };

  const confirmStatusChange = async () => {
    try {
      const { productKeyID } = stateChangeStatus;
      const response = await ChangeProductStatus(productKeyID, user.userKeyID);

      if (response?.data?.statusCode === 200) {
        setShowStatusChangeModal(false);
        GetProductListData(currentPage);
        setShowSuccessModal(true);
        setModelAction('Project status changed successfully.');
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


  const dataMap = [
    { projectName: 'Shikshak Bharti 2025', startDate: "10 Jan 2024", endData: '25 feb 2025', status: 'ongoing' },
    { projectName: 'Primary Teacher Bharti 2025', startDate: "10 Jan 2024", endData: '25 feb 2025', status: 'ongoing' },
    { projectName: 'Secondary & Higher Secondary Teacher Bharti 2025', startDate: "10 Jan 2024", endData: '25 feb 2025', status: 'Near Completion' },
    { projectName: 'Primary Teacher Bharti 2025', startDate: "10 Jan 2024", endData: '25 feb 2025', status: 'ongoing' },


  ]

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

  const projectDetailsBtn = () => {

    navigate('/project-details-view')
  }

  return (
    <>
      <div className="card w-full max-w-[50vh] mx-auto h-auto">
        <div className="card-body p-2 bg-white shadow-md rounded-lg">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <div className="flex-grow-1">
              <h5 className="m-0">Project List</h5>
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
              placeholder="Search Project"
              style={{ maxWidth: '350px' }}
              value={searchKeyword}
              onChange={handleSearch}
            />
            <Tooltip title="Add Project">
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
                  <th className="text-center">Project Name</th>
                  <th className="text-center">Start Date </th>
                  <th className="text-center">End Date</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {dataMap?.map((row, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="text-center">{row.projectName}</td>
                    <td className="text-center">{'22-05-2025'}</td>
                    <td className="text-center">{'27-06-2026'}</td>

                    <td className="text-center">
                      <Tooltip title={row.status}>
                        {row.status}
                      </Tooltip>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Tooltip title="Update Project">
                          <button
                            style={{ padding: '4px 8px', fontSize: '12px', height: '28px', width: '28px', background: "#ffaa33" }}
                            onClick={() => editProductBtnClick(row)}
                            type="button"
                            className="btn-sm btn text-white"
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                        </Tooltip>
                        {hasPermission(permissions, 'Model Stock', 'Can View') && (
                          <Tooltip title="Add Model">
                            <button
                              style={{ background: "#ffaa33" }}
                              onClick={() => projectDetailsBtn()}
                              type="button"
                              className="btn-sm btn text-white"
                            >
                              More Info
                            </button>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalCount === 0 && <NoResultFoundModel totalRecords={totalCount} />}
          </div>

          <div className="d-flex justify-content-end">
            {/* {totalCount > pageSize && (
              <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
            )} */}
          </div>
        </div>
      </div>

      {openProductModal && (
        <ProductAddUpdateModal
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

export default ProductList;
