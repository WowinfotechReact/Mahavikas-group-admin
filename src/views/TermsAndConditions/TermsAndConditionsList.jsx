import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { ConfigContext } from 'context/ConfigContext';
import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModal from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import AddUpdateTermsAndConditionsModal from './AddUpdateTermsAndConditionsModal';
import { GetTermsAndCondtionsList } from 'services/Terms&Conditions/Terms&CondtionsAPI';
import { hasPermission } from 'Middleware/permissionUtils';

const TermsAndConditionsList = () => {
  const { setLoader, user, permissions } = useContext(ConfigContext);
  const location = useLocation();
  const [termsList, setTermsList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(30);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(1);

  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [termsData, setTermsData] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const fetchTermsList = async (pageNumber = 1, searchValue = '') => {
    setLoader(true);
    try {
      const response = await GetTermsAndCondtionsList({
        userKeyID: user.userKeyID,
        pageNo: pageNumber - 1,
        pageSize,
        sortingDirection: 'DESC',
        sortingColumnName: 'termsAndConditionsID',
        searchKeyword: searchValue || null,
        fromDate: null,
        toDate: null
      });

      if (response?.data?.statusCode === 200) {
        const data = response.data.responseData.data || [];
        setTermsList(data);
        const count = response.data.totalCount || data.length;
        setTotalCount(count);
        setTotalPage(Math.ceil(count / pageSize));
      } else {
        setTermsList([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('List fetch failed:', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (isAddUpdateActionDone) {

      fetchTermsList(1, null);
    }
    setIsAddUpdateActionDone(false)
  }, [isAddUpdateActionDone]);
  useEffect(() => {
    fetchTermsList();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.trimStart();
    setSearchKeyword(value);
    fetchTermsList(1, value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchTermsList(page, searchKeyword);
  };

  const handleAdd = () => {
    setTermsData({ Action: 'Add' });
    setShowAddUpdateModal(true);
  };

  const handleEdit = (row) => {
    setTermsData({
      ...row,
      Action: 'Update'
    });
    setShowAddUpdateModal(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
  };

  return (
    <>
      <div className="card w-full max-w-[90%] mx-auto h-auto">
        <div className="card-body p-2 bg-white shadow-md rounded-lg">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-2">Terms and Conditions</h5>
            {hasPermission(permissions, 'Terms And Conditions', 'Can Insert') && (
              <Tooltip title="Add Terms and Conditions">
                <button onClick={handleAdd} style={{ background: '#ffaa33' }} className="btn text-white btn-sm">
                  <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i>
                  Add
                </button>
              </Tooltip>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search Terms & Condition"
              style={{ maxWidth: '350px' }}
              value={searchKeyword}
              onChange={handleSearch}
            />
          </div>

          <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                <tr>
                  <th className="text-center">Sr No</th>
                  <th className="text-center">Title</th>
                  {/* <th className="text-center">Terms & Conditions</th> */}
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {termsList.map((row, idx) => (
                  <tr key={row.termsAndConditionsKeyID}>
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="text-center">{row.title}</td>
                    {/* <td>{row.termsAndConditions?.replace(/<[^>]+>/g, '').substring(0, 70)}...</td> */}
                    <td className="text-center">
                      {hasPermission(permissions, 'Terms And Conditions', 'Can Update') && (
                        <Tooltip title="Update Terms and Conditions">
                          <button
                            onClick={() => handleEdit(row)}
                            className="btn text-white btn-sm"
                            style={{ padding: '4px 8px', fontSize: '12px', background: '#ffaa33', height: '28px', width: '28px' }}
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
            {termsList.length === 0 && <NoResultFoundModal totalRecords={termsList.length} />}
          </div>

          <div className="d-flex justify-content-end">
            {totalCount > pageSize && (
              <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
            )}
          </div>
        </div>
      </div>

      {showAddUpdateModal && (
        <AddUpdateTermsAndConditionsModal
          show={showAddUpdateModal}
          onHide={() => setShowAddUpdateModal(false)}
          modelRequestData={termsData}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        />
      )}

      <SuccessPopupModal show={showSuccessModal} onHide={handleCloseSuccess} modelAction={actionMessage} />
    </>
  );
};

export default TermsAndConditionsList;
