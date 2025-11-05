import React, { useState, useEffect, useContext } from 'react';
import Android12Switch from 'component/Android12Switch';
import { ConfigContext } from 'context/ConfigContext';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import NoResultFoundModal from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import SuccessPopupModal from 'component/SuccessPopupModal';

import AddUpdateQuotationNumberFormatModal from './QuotationNumFormatAddUpdateModel';
import { ChangeQuotationNumberFormatStatus, GetQuotationNumFormatList } from 'services/Quotation-Number-Format/QuotationNumberFormatAPI';
import StatusChangeModal from 'component/StatusChangeModal ';

const QuotationNumberFormatList = () => {
  const { setLoader, user } = useContext(ConfigContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(30);
  const [totalPage, setTotalPage] = useState(1);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [quotationList, setQuotationList] = useState([]);
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [quotationRequestData, setQuotationRequestData] = useState({});
  const [statusChangeRow, setStatusChangeRow] = useState(null);
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [quotationAction, setQuotationAction] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    // debugger
    if (isAddUpdateActionDone) {

      fetchQuotationList(1, null)
    }
    setIsAddUpdateActionDone(false)
  }, [isAddUpdateActionDone])

  const fetchQuotationList = async (page = 1, keyword = '') => {
    setLoader(true);
    try {
      const res = await GetQuotationNumFormatList({
        userKeyID: user.userKeyID,
        pageNo: page - 1,
        pageSize,
        sortingDirection: 'DESC',
        sortingColumnName: 'QuotationNumberFormatID',
        searchKeyword: keyword || null,
        fromDate: null,
        toDate: null
      });
      if (res?.data?.statusCode === 200) {
        const data = res.data.responseData.data || [];
        setQuotationList(data);
        const count = res.data.totalCount || data.length;
        setTotalCount(count);
        setTotalPage(Math.ceil(count / pageSize));
      } else {
        setQuotationList([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchQuotationList(1, '');
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.trimStart();
    setSearchKeyword(value);
    fetchQuotationList(1, value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchQuotationList(page, searchKeyword);
  };

  const handleAdd = () => {
    setQuotationRequestData({
      Action: 'Add'
    });
    setShowAddUpdateModal(true);
  };

  const handleEdit = (row) => {
    setQuotationRequestData({
      ...row,
      Action: 'Update'
    });
    setShowAddUpdateModal(true);
  };

  const handleStatusClick = (row) => {
    setStatusChangeRow(row);
    setShowStatusChangeModal(true);
  };

  const confirmStatusChange = async () => {
    try {
      const res = await ChangeQuotationNumberFormatStatus(statusChangeRow.quotationNumberFormatKeyID, user.userKeyID);
      if (res?.data?.statusCode === 200) {
        setQuotationAction('Status changed successfully.');
      } else {
        setQuotationAction('Failed to change status.');
      }
      fetchQuotationList(currentPage, searchKeyword);
    } catch (err) {
      setQuotationAction('Error changing status.');
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
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-2">Quotation Number Format</h5>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search Format"
              style={{ maxWidth: '350px' }}
              value={searchKeyword}
              onChange={handleSearch}
            />
            <Tooltip title="Add Quotation Format">
              <button onClick={handleAdd} className="btn text-white btn-sm" style={{ background: '#ffaa33' }}>
                <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i>
                <span>Add</span>
              </button>
            </Tooltip>
          </div>

          <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                <tr>
                  <th className="text-center">Sr No</th>
                  <th className="text-center">Quotation Format</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {quotationList.map((row, idx) => (
                  <tr key={row.quotationNumberFormatKeyID}>
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="text-center">{row.quotationNumberFormat}</td>
                    <td className="text-center">
                      <Tooltip title={row.status ? 'Active' : 'Inactive'}>
                        {row.status ? 'Active' : 'Inactive'}
                        <Android12Switch
                          style={{ padding: '8px' }}
                          onClick={() => handleStatusClick(row)}
                          checked={row.status}
                        />
                      </Tooltip>
                    </td>
                    <td className="text-center">
                      <Tooltip title="Edit Quotation Format">
                        <button
                          onClick={() => handleEdit(row)}
                          className="btn text-white btn-sm"
                          style={{ padding: '4px 8px', background: '#ffaa33', fontSize: '12px', height: '28px', width: '28px' }}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {quotationList.length === 0 && <NoResultFoundModal totalRecords={quotationList.length} />}
          </div>

          <div className="d-flex justify-content-end">
            {totalCount > pageSize && (
              <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
            )}
          </div>
        </div>
      </div>

      {showAddUpdateModal && (
        <AddUpdateQuotationNumberFormatModal
          show={showAddUpdateModal}
          onHide={() => setShowAddUpdateModal(false)}
          quotationRequestData={quotationRequestData}

          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        />
      )}

      <StatusChangeModal open={showStatusChangeModal} onClose={() => setShowStatusChangeModal(false)} onConfirm={confirmStatusChange} />
      {showSuccessModal && <SuccessPopupModal show={showSuccessModal} onHide={closeAllModals} modelAction={quotationAction} />}
    </>
  );
};

export default QuotationNumberFormatList;
