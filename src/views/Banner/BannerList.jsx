

import React, { useState, useEffect, useContext } from 'react';
import { ConfigContext } from 'context/ConfigContext';
import NoResultFoundModal from 'component/NoResultFoundModal';
import Android12Switch from 'component/Android12Switch';
import PaginationComponent from 'component/Pagination';
import { Tooltip } from '@mui/material';
import SuccessPopupModal from 'component/SuccessPopupModal';
import StatusChangeModal from 'component/StatusChangeModal ';
import { hasPermission } from 'Middleware/permissionUtils';
import BannerAddUpdateModal from './BannerAddUpdateModal';
import { ChangeBannerStatus, GetBannerList } from 'services/Banner/BannerApi';
import ImageModal from 'component/ImageModal';

const BannerList = () => {
      const { setLoader, user, permissions } = useContext(ConfigContext);

      const [bannerList, setManufacturerList] = useState([]);
      const [searchKeyword, setSearchKeyword] = useState('');
      const [currentPage, setCurrentPage] = useState(1);
      const [pageSize] = useState(30);
      const [totalCount, setTotalCount] = useState(0);
      const [totalPages, setTotalPages] = useState(0);

      const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
      const [modelRequestData, setModelRequestData] = useState({});
      const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
      const [showModal, setShowModal] = useState(false);
      const [selectedImage, setSelectedImage] = useState(null);

      const handleImageClick = (imgUrl) => {
            setSelectedImage(imgUrl);
            setShowModal(true);
      };

      const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
      const [statusChangeRow, setStatusChangeRow] = useState(null);
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [modelAction, setModelAction] = useState('');

      const [noResultFound, setNoResultFound] = useState(false);

      useEffect(() => {
            GetBannerListData(currentPage, searchKeyword);
            setIsAddUpdateActionDone(false);
      }, [currentPage, isAddUpdateActionDone]);

      const GetBannerListData = async (pageNumber, keyword) => {
            setLoader(true);
            try {
                  const response = await GetBannerList({
                        userKeyID: user?.userKeyID,
                        pageNo: pageNumber - 1,
                        pageSize: pageSize,
                        sortingDirection: null,
                        sortingColumnName: null,
                        searchKeyword: keyword?.trim() !== '' ? keyword : null
                  });
                  if (response?.data?.statusCode === 200) {
                        const list = response.data.responseData.data;
                        const total = response.data.totalCount || 0;
                        setManufacturerList(list);
                        setTotalCount(total);
                        setTotalPages(Math.ceil(total / pageSize));
                        setNoResultFound(list.length === 0);
                  } else {
                        setManufacturerList([]);
                        setTotalCount(0);
                        setTotalPages(0);
                        setNoResultFound(true);
                  }
            } catch (error) {
                  console.error(error);
                  setManufacturerList([]);
                  setTotalCount(0);
                  setTotalPages(0);
                  setNoResultFound(true);
            } finally {
                  setLoader(false);
            }
      };

      const handleSearch = (e) => {
            const value = e.target.value.trimStart();
            const formatted = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            setSearchKeyword(formatted);
            setCurrentPage(1); // Reset to first page
            GetBannerListData(1, formatted);
      };

      const handlePageChange = (pageNumber) => {
            setCurrentPage(pageNumber);
            GetBannerListData(pageNumber, searchKeyword);
      };

      const handleStatusChangeClick = (row) => {
            setStatusChangeRow(row);
            setShowStatusChangeModal(true);
      };

      const confirmStatusChange = async () => {
            // debugger
            if (!statusChangeRow) return;
            setLoader(true);
            try {
                  const response = await ChangeBannerStatus(statusChangeRow.bannerKeyID, user?.userKeyID);
                  if (response?.data?.statusCode === 200) {
                        setModelAction('Banner status changed successfully.');
                  } else {
                        setModelAction('Failed to change manufacturer status.');
                  }
                  GetBannerListData(currentPage, searchKeyword);
            } catch (error) {
                  console.error(error);
                  setModelAction('An error occurred while changing the status.');
            } finally {
                  setLoader(false);
                  setShowStatusChangeModal(false);
                  setShowSuccessModal(true);
            }
      };

      const openAddModal = () => {
            setModelRequestData({ Action: null, bannerKeyID: null });
            setShowAddUpdateModal(true);
      };

      const openEditModal = (id) => {
            setModelRequestData({ Action: 'Update', bannerKeyID: id });
            setShowAddUpdateModal(true);
      };

      const closeAllModals = () => {
            setShowSuccessModal(false);
      };

      return (
            <>
                  <div className="card w-full max-w-[50vh] mx-auto h-auto">
                        <div className="card-body p-2 bg-white shadow-md rounded-lg">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                    <div className="flex-grow-1 ">
                                          <h4 className="mb-0">Banner </h4>
                                    </div>
                              </div>

                              <div className="d-flex justify-content-between align-items-center mb-2">
                                    <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Search Banner"
                                          style={{ maxWidth: '350px' }}
                                          value={searchKeyword}
                                          onChange={handleSearch}
                                    />

                                    <div className="col-md-8 text-end">
                                          {/* {hasPermission(permissions, 'Banner', 'Can Insert') && ( */}
                                          <Tooltip title='Add Banner'>
                                                <button className="btn text-white btn-sm" style={{ background: '#ffaa33' }} onClick={openAddModal}>
                                                      <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i> Add
                                                </button>
                                          </Tooltip>
                                          {/* )} */}
                                    </div>
                              </div>

                              <div
                                    className="table-responsive"
                                    style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}
                              > <table className="table table-striped table-bordered table-hover" style={{ minWidth: '600px' }}>
                                          <thead className="table-dark" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                                <tr className='text-center'>
                                                      <th className='text-center' >Sr No</th>
                                                      <th className='text-center' >Banner Name</th>
                                                      <th className='text-center' >Banner Image</th>
                                                      <th className='text-center' >Status</th>
                                                      <th className='text-center' >Action</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                {
                                                      bannerList.map((item, index) => (
                                                            <tr key={item.bannerKeyID}>
                                                                  <td className='text-center'  >{(currentPage - 1) * pageSize + index + 1}</td>
                                                                  <td className='text-center' >{item.bannerName}</td>
                                                                  <td>
                                                                        <img
                                                                              src={item.bannerImage}
                                                                              alt="banner"
                                                                              style={{ width: "80px", height: "50px", cursor: "pointer" }}
                                                                              onClick={() => handleImageClick(item.bannerImage)}
                                                                        />
                                                                  </td>
                                                                  <td className='text-center' >
                                                                        <Android12Switch checked={item.status} onClick={() => handleStatusChangeClick(item)} />
                                                                  </td>
                                                                  <td className='text-center' >
                                                                        {/* {hasPermission(permissions, 'Banner', 'Can Update') && ( */}
                                                                        <Tooltip title='Update Banner'>
                                                                              <button style={{ background: '#ffaa33' }} className='text-white btn-sm btn' onClick={() => openEditModal(item.bannerKeyID)}>
                                                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                                              </button>
                                                                        </Tooltip>
                                                                        {/* )} */}
                                                                  </td>
                                                            </tr>
                                                      ))
                                                }
                                          </tbody>
                                    </table>
                                    {noResultFound && <NoResultFoundModal show={noResultFound} onHide={() => setNoResultFound(false)} />}
                              </div>

                              <div className="d-flex justify-content-end">
                                    {totalCount > pageSize && (
                                          <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
                                    )}
                              </div>
                        </div>
                  </div>

                  <BannerAddUpdateModal
                        show={showAddUpdateModal}
                        onHide={() => setShowAddUpdateModal(false)}
                        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                        modelRequestData={modelRequestData}
                  />

                  <StatusChangeModal open={showStatusChangeModal} onClose={() => setShowStatusChangeModal(false)} onConfirm={confirmStatusChange} />
                  <ImageModal
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        imageUrl={selectedImage}
                        title="Banner Preview"
                  />
                  <SuccessPopupModal
                        show={showSuccessModal}
                        onHide={closeAllModals}
                        setShowSuccessModal={setShowSuccessModal}
                        modelAction={modelAction}
                  />


            </>
      );
};

export default BannerList;
