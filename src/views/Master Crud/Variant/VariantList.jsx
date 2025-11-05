import React, { useState, useEffect, useContext } from 'react';
import { Tooltip } from '@mui/material';
import Android12Switch from 'component/Android12Switch';
import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModal from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { ConfigContext } from 'context/ConfigContext';
import { GetVariantList, ChangeVariantStatus } from 'services/Master Crud/VariantAPI';
import AddUpdateVariantModel from './AddUpdateVariantModel';
import StatusChangeModal from 'component/StatusChangeModal ';
import { hasPermission } from 'Middleware/permissionUtils';

const VariantList = () => {
  const [variantList, setVariantList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(30);
  const [totalRecords, setTotalRecords] = useState(-1);
  const [totalCount, setTotalCount] = useState(null);
  const [totalPage, setTotalPage] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [addUpdateObj, setAddUpdateObj] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);

  const [modelAction, setModelAction] = useState('');
  const [statusChangeRow, setStatusChangeRow] = useState(null);
  const { setLoader, user, permissions } = useContext(ConfigContext);

  useEffect(() => {
    GetVariantListData(1, null, null, null);
  }, []);

  useEffect(() => {
    if (isAddUpdateActionDone) {
      GetVariantListData(1, null, null, null); // ✅ Fetch the current page instead of always page 1
      setIsAddUpdateActionDone(false);
    }
  }, [isAddUpdateActionDone]); // ✅ Depend on both




  const GetVariantListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    // debugger
    setLoader(true);
    try {
      const data = await GetVariantList({
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
            setVariantList(MasterStateListData);
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


  const handleSearch = (e) => {

    let searchKeywordValue = e.target.value;
    const trimmedValue = searchKeywordValue.replace(/^\s+/g, '');
    const capitalizedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1).toLowerCase();
    if (searchKeywordValue.length === 1 && searchKeywordValue.startsWith(' ')) {
      searchKeywordValue = searchKeywordValue.trimStart();
      return;
    }
    setSearchKeyword(capitalizedValue);
    GetVariantListData(1, capitalizedValue, null, null);
  };




  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetMasterStateListData(pageNumber, null, toDate, fromDate);
  };
  const handleAddVariant = () => {
    setAddUpdateObj({ Action: 'Add' });
    setShowAddUpdateModal(true);
  };

  const handleEditVariant = (row) => {
    setAddUpdateObj({ Action: 'Update', ...row });
    setShowAddUpdateModal(true);
  };

  const handleStatusChange = (row) => {
    setStatusChangeRow(row);
    setShowStatusChangeModal(true);
  };

  const confirmStatusChange = async () => {
    if (!statusChangeRow) return;
    try {
      const res = await ChangeVariantStatus(statusChangeRow.variantKeyID, user?.userKeyID);
      if (res?.data?.statusCode === 200) {
        setModelAction('Rating status changed successfully.');
      } else {
        setModelAction('Failed to change status.');
      }
      GetVariantListData(currentPage, null, toDate, fromDate);
    } catch (err) {
      setModelAction('Error changing status.');
    } finally {
      setShowStatusChangeModal(false);
      setShowSuccessModal(true);
    }
  };

  const closeAllModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <>
      <div className="card w-full max-w-[50vh] mx-auto h-auto">
        <div className="card-body p-2 bg-white shadow-md rounded-lg">
          {/* Top header */}
          <div className="d-flex justify-content-between align-items-center mb-1">
            <div className="flex-grow-1 text-center">
              <h5 className="mb-0">Rating List</h5>
            </div>
            <div className="position-absolute end-0 me-2">
              {hasPermission(permissions, 'Rating', 'Can Insert') && (
                <button onClick={handleAddVariant} className="btn btn-primary btn-sm d-inline d-sm-none">
                  <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                  <span className="d-inline d-sm-none"> Add</span>
                </button>
              )}
            </div>
          </div>

          {/* Search + Add */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search Rating"
              style={{ maxWidth: '350px' }}
              value={searchKeyword}
              onChange={handleSearch}
            />
            <Tooltip title="Add Rating">
              <button onClick={handleAddVariant} style={{ background: '#ffaa33' }} className="btn text-white btn-sm d-none d-sm-inline">
                <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                <span className="d-none d-sm-inline">Add</span>
              </button>
            </Tooltip>
          </div>

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                <tr>
                  <th className="text-center">Sr No</th>
                  <th className="text-center">Rating Name</th>
                  <th className="text-center">Description</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {variantList?.map((row, idx) => (
                  <tr className='text-nowrap' key={idx}>
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="text-center">{row.variantName}

                    </td>
                    <td className="text-center">
                      {row.description?.length > 30 ? (
                        <Tooltip title={row.description}>{`${row.description?.substring(0, 30)}...`}</Tooltip>
                      ) : (
                        <>{row.description}</>
                      )}</td>
                    <td className="text-center">
                      <Tooltip title={row.status === true ? 'Active' : 'Deactive'}>
                        {row.status === true ? 'Active' : 'Deactive'}
                        <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(row)} checked={row.status === true} />
                      </Tooltip>
                    </td>
                    <td className="text-center">
                      {hasPermission(permissions, 'Rating', 'Can Update') && (
                        <Tooltip title="Update Rating">
                          <button
                            style={{
                              padding: '4px 8px',
                              fontSize: '12px',
                              height: '28px',
                              width: '28px', background: '#ffaa33'
                            }}
                            onClick={() => handleEditVariant(row)}
                            type="button"

                            className="btn-sm btn text-white"
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                        </Tooltip>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalRecords <= 0 && <NoResultFoundModal totalRecords={totalRecords} />}
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-end">
            {totalCount > pageSize && (
              <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
            )}
          </div>
        </div>
      </div>

      {/* Add/Update Modal */}
      {showAddUpdateModal && (
        <AddUpdateVariantModel
          show={showAddUpdateModal}
          onHide={() => setShowAddUpdateModal(false)}
          modelRequestData={addUpdateObj}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        />
      )}

      <StatusChangeModal open={showStatusChangeModal} onClose={() => setShowStatusChangeModal(false)} onConfirm={confirmStatusChange} />

      {/* Success Popup */}
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

export default VariantList;
