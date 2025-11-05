import React, { useState, useEffect, useContext } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import { ConfigContext } from 'context/ConfigContext';
import ManufacturerAddUpdateModal from './ManufacturerAddUpdateModal';
import NoResultFoundModal from 'component/NoResultFoundModal';
import Android12Switch from 'component/Android12Switch';
import PaginationComponent from 'component/Pagination';
import { Tooltip } from '@mui/material';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ChangeManufacturerStatus, GetManufacturerModelList } from 'services/ManufactureModal/ManufcatureModalApi';
import StatusChangeModal from 'component/StatusChangeModal ';
import { hasPermission } from 'Middleware/permissionUtils';

const ManufacturerList = () => {
  const { setLoader, user, permissions } = useContext(ConfigContext);

  const [manufacturerList, setManufacturerList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(30);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [modelRequestData, setModelRequestData] = useState({});
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);

  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [statusChangeRow, setStatusChangeRow] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modelAction, setModelAction] = useState('');

  const [noResultFound, setNoResultFound] = useState(false);

  useEffect(() => {
    getManufacturerList(currentPage, searchKeyword);
    setIsAddUpdateActionDone(false);
  }, [currentPage, isAddUpdateActionDone]);

  const getManufacturerList = async (pageNumber, keyword) => {
    setLoader(true);
    try {
      const response = await GetManufacturerModelList({
        userKeyID: user?.userKeyID,
        pageNo: pageNumber - 1,
        pageSize: pageSize,
        sortingDirection: 'ASC',
        sortingColumnName: 'manufacturerName',
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
    getManufacturerList(1, formatted);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    getManufacturerList(pageNumber, searchKeyword);
  };

  const handleStatusChangeClick = (row) => {
    setStatusChangeRow(row);
    setShowStatusChangeModal(true);
  };

  const confirmStatusChange = async () => {
    if (!statusChangeRow) return;
    setLoader(true);
    try {
      const response = await ChangeManufacturerStatus(statusChangeRow.manufacturerkeyID, user?.userKeyID);
      if (response?.data?.statusCode === 200) {
        setModelAction('Manufacturer status changed successfully.');
      } else {
        setModelAction('Failed to change manufacturer status.');
      }
      getManufacturerList(currentPage, searchKeyword);
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
    setModelRequestData({ Action: null, manufacturerKeyID: null });
    setShowAddUpdateModal(true);
  };

  const openEditModal = (id) => {
    setModelRequestData({ Action: 'Update', manufacturerKeyID: id });
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
            <div className="flex-grow-1 text-center">
              <h4 className="mb-0">Manufacturer List</h4>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search Employee Type"
              style={{ maxWidth: '350px' }}
              value={searchKeyword}
              onChange={handleSearch}
            />

            <div className="col-md-8 text-end">
              {hasPermission(permissions, 'Manufacturer', 'Can Insert') && (
                <Tooltip title='Add Manufacture'>
                  <button className="btn text-white btn-sm" style={{ background: '#ffaa33' }} onClick={openAddModal}>
                    <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i> Add
                  </button>
                </Tooltip>
              )}
            </div>
          </div>

          <div
            className="table-responsive"
            style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}
          > <table className="table table-striped table-bordered table-hover" style={{ minWidth: '600px' }}>
              <thead className="table-dark" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr>
                  <th>Sr No</th>
                  <th>Manufacturer Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  manufacturerList.map((item, index) => (
                    <tr key={item.manufacturerkeyID}>
                      <td>{(currentPage - 1) * pageSize + index + 1}</td>
                      <td>{item.manufacturerName}</td>
                      <td>
                        <Android12Switch checked={item.status} onClick={() => handleStatusChangeClick(item)} />
                      </td>
                      <td>
                        {hasPermission(permissions, 'Manufacturer', 'Can Update') && (
                          <Tooltip title='Update Manufacture'>
                            <button style={{ background: '#ffaa33' }} className='text-white btn-sm btn' onClick={() => openEditModal(item.manufacturerkeyID)}>
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                          </Tooltip>
                        )}
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

      <ManufacturerAddUpdateModal
        show={showAddUpdateModal}
        onHide={() => setShowAddUpdateModal(false)}
        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        modelRequestData={modelRequestData}
      />

      <StatusChangeModal open={showStatusChangeModal} onClose={() => setShowStatusChangeModal(false)} onConfirm={confirmStatusChange} />

      <SuccessPopupModal
        show={showSuccessModal}
        onHide={closeAllModals}
        setShowSuccessModal={setShowSuccessModal}
        modelAction={modelAction}
      />


    </>
  );
};

export default ManufacturerList;
