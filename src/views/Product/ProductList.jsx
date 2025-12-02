import React, { useState, useEffect, useContext } from 'react';
import Android12Switch from 'component/Android12Switch';
import { ConfigContext } from 'context/ConfigContext';
import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { Tooltip } from '@mui/material';
import ProductAddUpdateModal from './ProductAddUpdateModal';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import StatusChangeModal from 'component/StatusChangeModal ';
import { hasPermission } from 'Middleware/permissionUtils';
import { ChangeProjectStatus, GetProjectList } from 'services/Project/ProjectApi';

const ProductList = () => {
  const { setLoader, user, permissions, companyID } = useContext(ConfigContext);
  const navigate = useNavigate();
  const [productListData, setProductListData] = useState([])
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

  const [openProductModal, setOpenProductModal] = useState(false);
  const [sortingDirection, setSortingDirection] = useState(null);
  const [sortType, setSortType] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const [modelRequestData, setModelRequestData] = useState({
    projectKeyID: null,
    Action: null
  });

  // Main fetcher

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetProjectListData(pageNumber, null, null, null);
  };
  const GetProjectListData = async (pageNumber, searchKeywordValue, toDateParam, fromDateParam, sortValue, ProductSortType) => {
    setLoader(true);
    try {
      const data = await GetProjectList({
        pageSize,
        pageNo: pageNumber - 1,
        searchKeyword: searchKeywordValue ?? searchKeyword,
        toDate: toDateParam ? dayjs(toDateParam).format('YYYY-MM-DD') : null,
        fromDate: fromDateParam ? dayjs(fromDateParam).format('YYYY-MM-DD') : null,
        sortingDirection: sortValue ?? sortingDirection,
        sortingColumnName: sortType || ProductSortType || null,
        // userKeyID: user.userKeyID,  told by shubha
        companyID: Number(companyID)

      });

      if (data?.data?.statusCode === 200) {
        setLoader(false);

        const ProductData = data.data.responseData.data;
        const totalItems = data.data?.totalCount || 0;
        setTotalCount(totalItems);
        setTotalPage(Math.ceil(totalItems / pageSize));
        setProductListData(ProductData);

        // Auto back if empty but data exists
        if (ProductData.length === 0 && totalItems > 0 && pageNumber > 1) {
          GetProjectListData(pageNumber - 1);
          setCurrentPage(pageNumber - 1);
        } else {
          setLoader(false);

          setCurrentPage(pageNumber);
        }
      } else {
        setLoader(false);

        console.error(data?.data?.errorMessage);
      }
    } catch (error) {
      setLoader(false);

      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  // On Add/Update completion
  useEffect(() => {
    if (isAddUpdateActionDone) {
      if (lastActionType === 'Add') {
        GetProjectListData(1);
      } else {
        GetProjectListData(currentPage);
      }
      setIsAddUpdateActionDone(false);
      setLastActionType(null);
    }
  }, [isAddUpdateActionDone]);

  // Initial fetch
  useEffect(() => {
    GetProjectListData(1);
  }, []);
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");

  const fullText = "Search By Project Name / Desc / Service Namee";
  let index = 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedPlaceholder(fullText.slice(0, index));
      index++;

      if (index > fullText.length) {
        index = 0;
        setAnimatedPlaceholder(""); // Restart effect
      }
    }, 180);

    return () => clearInterval(interval);
  }, []);


  const handleSearch = (e) => {
    const value = e.target.value.trimStart();
    const formatted = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setSearchKeyword(formatted);
    GetProjectListData(1, formatted);
  };



  const addProductBtnClick = () => {
    setModelRequestData({ Action: null, projectKeyID: null });
    setLastActionType('Add');
    setOpenProductModal(true);
  };

  const editProductBtnClick = (row) => {
    setModelRequestData({ Action: 'Update', projectKeyID: row.projectKeyID });
    setLastActionType('Update');
    setOpenProductModal(true);
  };

  const handleStatusChange = (row) => {
    setStateChangeStatus(row);
    setShowStatusChangeModal(true);
  };
  const addInstitute = (row) => {
    navigate('/institute-master', { state: { projectID: row.projectID, projectName: row.projectName } })
  }

  const confirmStatusChange = async () => {
    try {
      const { projectKeyID } = stateChangeStatus;
      const response = await ChangeProjectStatus(projectKeyID);

      if (response?.data?.statusCode === 200) {
        setShowStatusChangeModal(false);
        GetProjectListData(currentPage);
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
  const instituteUserBtnClick = (row) => {
    navigate('/Dashboard', { state: { userKeyIDForUpdate: row.userKeyIDForUpdate, instituteName: row.instituteName } })
  }


  const closeAllModal = () => {
    setShowSuccessModal(false);
  };


  return (
    <>
      <div className="card w-full max-w-[50vh] mx-auto h-auto">
        <div className="card-body p-2 bg-white shadow-md rounded-lg">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <button
              // className="btn btn-light p-1 me-2"
              className="btn btn-outline-secondary btn-sm me-2"

              // style={{ borderRadius: "50%", width: "36px", height: "36px" }}
              onClick={() => navigate(-1)}
            >
              <i className="fa-solid fa-arrow-left"></i>

            </button>
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
              placeholder={animatedPlaceholder}
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
              <thead className="table-gradient-orange" style={{ position: 'sticky', top: 0, zIndex: 10, color: '#fff' }}>

                {/* <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}> */}
                <tr>
                  <th className="text-center">Sr No</th>
                  <th className="text-center">Project Name</th>
                  <th className="text-center">Project Description </th>
                  <th className="text-center">Service Name</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {productListData?.map((row, idx) => (
                  <tr key={idx}>
                    <td className="text-center">
                      <span className="index-badge">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </span>
                    </td>

                    <td className="text-center">
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          animation: "fadeUp 0.4s ease-out"
                        }}
                      >
                        <i
                          className="fa-solid fa-folder"
                          style={{
                            color: "#ff7d34",
                            animation: "floatIcon 1.5s ease-in-out infinite"
                          }}
                        ></i>
                        {row.projectName}
                      </span>
                    </td>

                    <td className="text-center">
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          animation: "fadeUp 0.4s ease-out"
                        }}
                      >
                        <i
                          className="fa-solid fa-circle-info"
                          style={{
                            color: "#3a57e8",
                            animation: "floatIcon 1.5s ease-in-out infinite"
                          }}
                        ></i>

                        {row.projectDescription?.length > 30 ? (
                          <Tooltip title={row.projectDescription}>
                            {`${row.projectDescription.substring(0, 30)}...`}
                          </Tooltip>
                        ) : (
                          row.projectDescription
                        )}
                      </span>
                    </td>

                    <td className="text-center">
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          animation: "fadeUp 0.4s ease-out"
                        }}
                      >
                        <i
                          className="fa-solid fa-tags"
                          style={{
                            color: "#20c997",
                            animation: "pulseIcon 1.6s ease-in-out infinite"
                          }}
                        ></i>
                        {row.serviceName}
                      </span>
                    </td>

                    <td className="text-center">
                      {row.status === 'Active' ? 'Active' : 'In-Active'}
                      <Android12Switch style={{ padding: '8px' }}
                        onClick={() => handleStatusChange(row)} checked={row.status === 'Active'} />


                    </td>
                    <td className="text-center relative  actionColSticky " style={{ zIndex: 4 }}>

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
                        {/* <Tooltip title="View Details">
                          <button
                            style={{ background: "#ffaa33" }}
                            onClick={() => projectDetailsBtn()}
                            type="button"
                            className="btn-sm btn text-white"
                          >
                            More Info
                          </button>
                        </Tooltip> */}

                        <Tooltip title="Add Institute">
                          <button
                            style={{ background: "#ffaa33" }}
                            onClick={() => addInstitute(row)}
                            type="button"
                            className="btn-sm btn text-white text-nowrap"
                          >
                            Add Institute
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
