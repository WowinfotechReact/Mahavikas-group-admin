import React, { useState, useEffect, useContext } from 'react';
import Android12Switch from 'component/Android12Switch';
import { ConfigContext } from 'context/ConfigContext';
import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { Tooltip } from '@mui/material';
import AddUpdateEmployeeTypeModal from './AddUpdateEmployeeTypeModal';
import {
  ChenageEmployeeTypeStatus,
  GetEmployeeTypeList
} from 'services/Employee Type List/EmployeeTypeListApi';
import StatusChangeModal from 'component/StatusChangeModal ';
import { hasPermission } from 'Middleware/permissionUtils';

const EmployeeTypeList = () => {

  const [stateChangeStatus, setStateChangeStatus] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const { setLoader, user, permissions } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [pageSize] = useState(30);
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPageRecords, setCurrentPageRecords] = useState([]);
  const [openMasterStateModal, setOpenMasterStateModal] = useState(false);

  const [modelRequestData, setModelRequestData] = useState({
    employeeTypeKeyID: null,
    Action: null
  });

  // ✅ Initial fetch
  useEffect(() => {
    GetMasterEmployeeTypeListData(1);
  }, []);

  // ✅ After add/update — refetch same page
  useEffect(() => {
    if (isAddUpdateActionDone) {
      GetMasterEmployeeTypeListData(currentPage);
      setIsAddUpdateActionDone(false);
    }
  }, [isAddUpdateActionDone]);

  // ✅ Main fetch function — robust
  const GetMasterEmployeeTypeListData = async (pageNumber, searchKeywordValue) => {
    setLoader(true);
    try {
      const data = await GetEmployeeTypeList({
        pageSize,
        pageNo: pageNumber - 1,
        searchKeyword: searchKeywordValue ?? searchKeyword,
        userKeyID: user.userKeyID
      });

      if (data?.data?.statusCode === 200) {
        const list = data.data.responseData.data;
        const totalItems = data.data?.totalCount || 0;

        setTotalRecords(totalItems); // ✅ True total
        setTotalPage(Math.ceil(totalItems / pageSize));
        setCurrentPageRecords(list);

        // ✅ If pageNumber now has no data but there is still total, go back one page
        if (list.length === 0 && totalItems > 0 && pageNumber > 1) {
          setCurrentPage(pageNumber - 1);
          GetMasterEmployeeTypeListData(pageNumber - 1);
        } else {
          setCurrentPage(pageNumber); // sync page number
        }
      } else {
        console.error(data?.data?.errorMessage);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoader(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.trimStart();
    const formatted = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setSearchKeyword(formatted);
    GetMasterEmployeeTypeListData(1, formatted);
  };

  const handlePageChange = (pageNumber) => {
    GetMasterEmployeeTypeListData(pageNumber);
  };

  const addMasterStateBtnClick = () => {
    setModelRequestData({
      employeeTypeKeyID: null,
      Action: 'Add'
    });
    setOpenMasterStateModal(true);
  };

  const EditMasterStateBtnClick = (row) => {
    setModelRequestData({
      employeeTypeKeyID: row.employeeTypeKeyID,
      Action: 'Update'
    });
    setOpenMasterStateModal(true);
  };

  const handleStatusChange = (row) => {
    setStateChangeStatus(row);
    setShowStatusChangeModal(true);
  };

  const confirmStatusChange = async () => {
    try {
      const response = await ChenageEmployeeTypeStatus(
        stateChangeStatus.employeeTypeKeyID,
        user.userKeyID
      );
      if (response?.data?.statusCode === 200) {
        setShowStatusChangeModal(false);
        GetMasterEmployeeTypeListData(currentPage);
        setShowSuccessModal(true);
        setModelAction('Employee Type status changed successfully.');
      } else {
        console.error(response?.data?.errorMessage);
        setShowSuccessModal(true);
        setModelAction('Failed to change Employee Type status.');
      }
    } catch (err) {
      console.error(err);
      setShowSuccessModal(true);
      setModelAction('An error occurred while changing status.');
    }
  };

  const closeAllModal = () => {
    setShowSuccessModal(false);
  };


  return (
    <>
      <div className="card w-full max-w-[50vh] mx-auto h-auto">
        <div className="card-body p-2 bg-white shadow-md rounded-lg">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <div className="flex-grow-1 text-center">



              <h5 className="mb-0">Employee Type List</h5>

            </div>
            <div className="position-absolute end-0 me-2">
              {hasPermission(permissions, 'Employee Type', 'Can Insert') && (
                <button
                  onClick={addMasterStateBtnClick}
                  className="btn btn-primary btn-sm d-inline d-sm-none"
                >
                  <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                  <span className="d-inline d-sm-none"> Add</span>
                </button>
              )}
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
            <Tooltip title="Add Employee Type">
              <button
                onClick={addMasterStateBtnClick}
                style={{ background: '#ffaa33' }}
                className="btn text-white btn-sm d-none d-sm-inline"
              >
                <i className="fa-solid fa-plus" style={{ fontSize: '11px', }}></i>
                <span className="d-none d-sm-inline">Add</span>
              </button>
            </Tooltip>
          </div>

          <div
            className="table-responsive"
            style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}
          >
            <table className="table table-bordered table-striped">
              <thead
                className="table-light"
                style={{ position: 'sticky', top: -1, zIndex: 1 }}
              >
                <tr>
                  <th className="text-center">Sr No</th>
                  <th className="text-center">Employee Type Name</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentPageRecords?.map((row, idx) => (
                  <tr key={idx}>
                    <td className="text-center">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="text-center">{row.employeeTypeName}</td>
                    <td className="text-center">
                      <Tooltip title={row.status ? 'Active' : 'Deactive'}>
                        {row.status ? 'Active' : 'Deactive'}
                        <Android12Switch
                          style={{ padding: '8px' }}
                          onClick={() => handleStatusChange(row)}
                          checked={row.status === true}
                        />
                      </Tooltip>
                    </td>
                    <td className="text-center">
                      {hasPermission(permissions, 'Employee Type', 'Can Update') && (
                        <Tooltip title="Update Employee Type">
                          <button
                            style={{
                              padding: '4px 8px',
                              fontSize: '12px',
                              height: '28px',
                              width: '28px', background: '#ffaa33'
                            }}
                            onClick={() => EditMasterStateBtnClick(row)}
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
            {totalRecords === 0 && (
              <NoResultFoundModel totalRecords={totalRecords} />
            )}
          </div>

          <div className="d-flex justify-content-end">
            {totalRecords > pageSize && (
              <PaginationComponent
                totalPages={totalPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      {openMasterStateModal && (
        <AddUpdateEmployeeTypeModal
          show={openMasterStateModal}
          onHide={() => setOpenMasterStateModal(false)}
          modelRequestData={modelRequestData}
          setModelRequestData={setModelRequestData}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        />
      )}

      <StatusChangeModal
        open={showStatusChangeModal}
        onClose={() => setShowStatusChangeModal(false)}
        onConfirm={confirmStatusChange}
      />

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

export default EmployeeTypeList;
