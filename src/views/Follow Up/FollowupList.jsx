import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GetFollowUpList } from 'services/LeadAPI/FollowUpAPI';
import { ConfigContext } from 'context/ConfigContext';
import AddUpdateFollowUpModal from './AddUpdateFollowUpModal';
import PaginationComponent from 'component/Pagination';
import NoResultFoundModal from 'component/NoResultFoundModal';
import { Tooltip } from '@mui/material';
import FollowUpStageModal from './FollowUpStageModal';
import { hasPermission } from 'Middleware/permissionUtils';

const FollowUpList = () => {
  const { setLoader, permissions } = useContext(ConfigContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false)


  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(30);
  const [totalPage, setTotalPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [followUpList, setFollowUpList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
  const [modalRequestData, setModalRequestData] = useState({});
  const [isAddUpdateDone, setIsAddUpdateDone] = useState(false);



  useEffect(() => {
    if (isAddUpdateActionDone) {
      fetchFollowUpList()
    }
    setIsAddUpdateActionDone(false)
  }, [isAddUpdateActionDone])

  const fetchFollowUpList = async (pageNo = 1, searchValue = null) => {
    if (!location.state.leadKeyID) return;
    setLoader(true);
    try {
      const payload = {
        pageNo: pageNo - 1,
        pageSize,
        sortingDirection: null,
        leadKeyID: location.state.leadKeyID,
        sortingColumnName: null,
        searchKeyword: searchValue,
        fromDate: null,
        toDate: null
      };

      const res = await GetFollowUpList(payload, location.state.leadKeyID);
      if (res?.data?.statusCode === 200) {
        const data = res.data.responseData.data || [];
        setFollowUpList(data);
        const count = res.data.totalCount || data.length;
        setTotalCount(count);
        setTotalPage(Math.ceil(count / pageSize));
      } else {
        setFollowUpList([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (location.state.leadKeyID) {
      fetchFollowUpList(currentPage, searchKeyword);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state.leadKeyID, isAddUpdateDone]);

  const handleSearch = (e) => {
    const value = e.target.value.trimStart();
    setSearchKeyword(value);
    setCurrentPage(1);
    fetchFollowUpList(1, value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchFollowUpList(page, searchKeyword);
  };
  console.log(location.state.leadKeyID, 'oiudhsapiodasda');

  const openAddFollowUp = () => {
    setModalRequestData({ Action: 'Add', leadKeyID: location.state.leadKeyID, followUpKeyID: null });
    setModalShow(true);
  };

  const openUpdateFollowUp = (row) => {
    setModalRequestData({
      Action: 'Update',
      followUpKeyID: row.followUpKeyID,
      // leadKeyID
    });
    setModalShow(true);
  };
  const changeStatusForFollowUp = (row) => {

    setModalRequestData({
      followUpKeyID: row.followUpKeyID,

    });
    setShowChangeStatusModal(true);
  };

  return (
    <>
      <div className="card w-full max-w-[90%] mx-auto h-auto">
        <div className="card-body p-2 bg-white shadow-md rounded-lg">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <h5 className="mb-2">
              <span
                style={{
                  color: '#0d6efd',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
                onClick={() => navigate('/lead')}
              >
                Lead
              </span>
              {' > '}
              <span>
                Follow Up                 </span>
            </h5>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search Follow Up"
              style={{ maxWidth: '350px' }}
              value={searchKeyword}
              onChange={handleSearch}
            />
            {hasPermission(permissions, 'FollowUp', 'Can Insert') && (
              <Tooltip title="Add Follow Up">
                <button onClick={openAddFollowUp} className="btn  text-white btn-sm" style={{ background: '#9aa357' }}>
                  <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i>
                  <span>Add</span>
                </button>
              </Tooltip>
            )}
          </div>

          <div
            className="table-responsive"
            style={{
              maxHeight: '65vh',
              overflowY: 'auto',
              position: 'relative'
            }}
          >
            <table className="table table-bordered table-striped">
              <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                <tr>
                  <th className="text-center">Sr No</th>
                  <th className="text-center">Follow Up Type</th>
                  <th className="text-center">Customer / Firm Name</th>
                  <th className="text-center">Follow Up Date</th>
                  <th className="text-center">Follow Up Time</th>
                  <th className="text-center">Remark</th>
                  <th className="text-center">Reg Date</th>
                  {/* <th className="text-center">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {followUpList.map((row, idx) => (
                  <tr key={row.followUpKeyID}>
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="text-center">{row.followUpType}</td>
                    <td className="text-center">{row.customerFirmName}</td>
                    <td className="text-center">{row.followUpDate ? new Date(row.followUpDate).toISOString().split('T')[0] : ''}</td>
                    <td className="text-center">{row.followUpTime}</td>
                    <td className="text-center">{row.remark}</td>
                    <td className="text-center">{row.regDate}</td>

                  </tr>
                ))}
              </tbody>
            </table>

            {followUpList.length === 0 && <NoResultFoundModal totalRecords={followUpList.length} />}
          </div>

          <div className="d-flex justify-content-end">
            {totalCount > pageSize && (
              <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
            )}
          </div>
        </div>
      </div>

      {modalShow && (
        <AddUpdateFollowUpModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          modalRequestData={modalRequestData}
          setIsAddUpdateActionDone={(actionType) => {
            if (actionType === 'Add') {
              setCurrentPage(1);
              fetchFollowUpList(1, searchKeyword);
            } else {

              fetchFollowUpList(currentPage, searchKeyword);
            }
          }}
        />
      )}


    </>
  );
};

export default FollowUpList;
