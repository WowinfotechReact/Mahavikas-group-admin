

import React, { useState, useEffect, useContext } from 'react';
import Android12Switch from 'component/Android12Switch';
import { ConfigContext } from 'context/ConfigContext';
import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { Tooltip } from '@mui/material';
import { FaFilePdf } from "react-icons/fa6";

import { BiSolidImageAdd } from "react-icons/bi";
import dayjs from 'dayjs';
import { IoImagesOutline } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router';
import StatusChangeModal from 'component/StatusChangeModal ';
import { hasPermission } from 'Middleware/permissionUtils';
import { ChangeProjectStatus, GetProjectList } from 'services/Project/ProjectApi';
import ImgUploadAddUpdateModal from './ImgUploadAddUpdateModal';
import { DeleteProjectDocument, GetProjectDocumentList } from 'services/Project Document/ProjectDocumentApi';
import DeleteModal from 'views/DeleteModal';

const ImgUploadList = () => {
      const { setLoader, user, permissions, companyID } = useContext(ConfigContext);
      const navigate = useNavigate();
      const [showDelete, setShowDelete] = useState(false);

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
      const [selectedMappingID, setSelectedMappingID] = useState(null);
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
      const location = useLocation()
      const GetProjectListData = async (pageNumber, searchKeywordValue) => {
            setLoader(true);
            try {
                  const data = await GetProjectDocumentList({
                        pageSize,
                        pageNo: pageNumber - 1,
                        searchKeyword: searchKeywordValue ?? searchKeyword,
                        toDate: null,
                        fromDate: null,

                        userKeyID: user.userKeyID,
                        projectID: location?.state?.projectID,
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
      const handleDeleteClick = (row) => {
            setSelectedMappingID(row.projectDocumentMappingKeyID); // ✅ Store ID
            setShowDelete(true); // ✅ Open modal
      };
      // On Add/Update completion
      useEffect(() => {
            if (isAddUpdateActionDone) {

                  GetProjectListData(1, null);

            }
            setIsAddUpdateActionDone(false);

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

            setModelRequestData({ Action: null, projectKeyID: location?.state?.projectKeyID });

            setOpenProductModal(true);
      };



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



      const closeAllModal = () => {
            setOpenProductModal(false)
            setShowDelete(false)
            setShowSuccessModal(false);
      };

      const handleConfirmDelete = async () => {
            debugger
            try {
                  if (!selectedMappingID) return;

                  const res = await DeleteProjectDocument(selectedMappingID);


                  // ✅ Check success
                  if (
                        res?.data?.statusCode === 200
                  ) {
                        console.log("✅ Deleted:", res?.responseData?.data);


                        setModelAction('Document Deleted Successfully!')
                        setShowSuccessModal(true)
                        setIsAddUpdateActionDone(true)


                  } else {
                        console.error("❌ Delete failed:", res);
                        // toast.error("Delete failed");
                  }

            } catch (error) {
                  console.error("❌ Delete error:", error);
                  setShowDelete(false);
                  // toast.error("Something went wrong");
            }
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
                                    <div className="d-flex align-items-center flex-grow-1">
                                          <div
                                                className="me-2"
                                                style={{
                                                      width: "36px",
                                                      height: "36px",
                                                      borderRadius: "50%",
                                                      // backgroundColor: "#0d6efd",
                                                      display: "flex",
                                                      justifyContent: "center",
                                                      alignItems: "center",
                                                      color: "white",
                                                      fontSize: "20px",
                                                      animation: "pulse 1.5s infinite"
                                                }}
                                          >📔
                                          </div>
                                          <h5 className="tracking-in-contract">
                                                Project Document :
                                                <span style={{ textDecoration: "underline", marginLeft: "6px" }}>
                                                      {location?.state?.projectName}
                                                </span>
                                          </h5>
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
                                    <Tooltip title="Upload Document">
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
                                                      <th className="text-center">Document URL </th>

                                                      {/* <th className="text-center">Status</th> */}
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
                                                                  <a
                                                                        href={row.documentURL}
                                                                        download
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        style={{
                                                                              display: "inline-flex",
                                                                              alignItems: "center",
                                                                              gap: "8px",
                                                                              textDecoration: "none",
                                                                              color: "#ff7d34",
                                                                              cursor: "pointer",
                                                                              animation: "fadeUp 0.4s ease-out",
                                                                        }}
                                                                  >
                                                                        <FaFilePdf size={26} />   {/* Bigger icon */}
                                                                        <span style={{ fontWeight: 500 }}>View  PDF</span>
                                                                  </a>
                                                            </td>




                                                            {/* <td className="text-center">
                                                                  {row.status === 'Active' ? 'Active' : 'In-Active'}
                                                                  <Android12Switch style={{ padding: '8px' }}
                                                                        onClick={() => handleStatusChange(row)} checked={row.status === 'Active'} />


                                                            </td> */}

                                                            <td className="text-center relative  actionColSticky " style={{ zIndex: 4 }}>

                                                                  <div className="d-flex justify-content-center gap-2">

                                                                        <Tooltip title='Delete Uploaded Documents'>

                                                                              <button
                                                                                    className="btn btn-outline-danger d-flex align-items-center gap-2 btn-sm"
                                                                                    onClick={() => handleDeleteClick(row)}
                                                                              ><i class="fa-solid fa-trash"></i>

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
                        <ImgUploadAddUpdateModal
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
                  <DeleteModal
                        show={showDelete}
                        onClose={() => setShowDelete(false)}
                        onConfirm={handleConfirmDelete}
                        title="Delete Document "
                        message="Do you really want to delete?"
                  />
            </>
      );
};

export default ImgUploadList;

