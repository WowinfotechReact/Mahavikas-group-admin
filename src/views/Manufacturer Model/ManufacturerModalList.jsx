import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation, useNavigate } from 'react-router';
import PaginationComponent from 'component/Pagination';
import { ConfigContext } from 'context/ConfigContext';
import NoResultFoundModel from 'component/NoResultFoundModal';
import ManufacturerAddUpdateModal from './ManufacturerAddUpdateModal';
import { GetManufacturerModelList } from 'services/ManufactureModal/ManufcatureModalApi';
import { Tooltip } from '@mui/material';

const ManufacturerModalList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [totalRecords, setTotalRecords] = useState(-1);
  const { setLoader, user } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalCount, setTotalCount] = useState(null);
  const [pageSize, setPageSize] = useState(30);
  const [manufacturerListData, setManufacturerListData] = useState();
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null);
  const [showManufacturerModal, setShowManufacturerModal] = useState(false);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  useEffect(() => {
    setModelAction(location?.state?.Action === undefined || location?.state?.Action === null ? 'Add' : 'Update'); //Do not change this naming convention
  }, [location.state]);

  const [showSuccessModal, setShowSuccessModal] = useState();
  const [modelRequestData, setModelRequestData] = useState({
    adminID: null,
    machineID: null,
    machineName: null,
    price: null,
    Action: null
  });

  useEffect(() => {
    // debugger
    if (isAddUpdateActionDone) {
      GetManufacturerModalListData(1, null, toDate, fromDate);
      setSearchKeyword('')
    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    GetManufacturerModalListData(1, null, toDate, fromDate);
   
  }, [setIsAddUpdateActionDone]);

  const GetManufacturerModalListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
    // debugger
    setLoader(true);
    try {
      const data = await GetManufacturerModelList({
        pageSize,
        userKeyID: user.userKeyID,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        manufacturerKeyID: location?.state?.manufacturerKeyID
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const manufacturerListData = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(manufacturerListData.length);
            setManufacturerListData(manufacturerListData);
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

  const ManufacturerModalAddBtnClicked = () => {
    setModelRequestData({
      ...modelRequestData,

      manufacturerKeyID: location?.state?.manufacturerKeyID,
      Action: null
    });
    setShowManufacturerModal(true);
  };

  const ManufactureEditBtnClicked = (row) => {
    setModelRequestData({
      ...modelRequestData,
      manufacturerModelKeyID: row.manufacturerModelKeyID,
      Action: 'Update'
    });
    setShowManufacturerModal(true);
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
    GetManufacturerModalListData(1, capitalizedValue, toDate, fromDate);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetManufacturerModalListData(pageNumber, null, toDate, fromDate);
  };

  const closeAll = () => {
    setShowSuccessModal(false);
  };

  const handleClearDates = () => {
    setCurrentPage(1);
    setToDate(null);
    setFromDate(null);
    GetManufacturerModalListData(1, null, null, null);
  };

  return (
    <>
       <div className="card w-full max-w-[50vh] mx-auto h-auto">
       <div className="card-body p-2 bg-white shadow-md rounded-lg">
          {/* Top controls */}
          <div className="d-flex align-items-center gap-2 mb-1">
          <i  onClick={()=>navigate('/manufacturer-view')} 
          className="fa-solid fa-arrow-left mb-2" 
          style={{ color:'#3366ff',cursor:'pointer',fontSize: "20px", width: "20px", height: "20px" }}></i>    
            
  {/* <h5>Manufacturer : <span>{location?.state?.modalName}</span></h5>  */}
  <h5>
  Manufacturer : <span className='text-primary' style={{ fontWeight: "bold", color: "#333" }}>{location?.state?.modalName}</span>
</h5>


      <button
    onClick={() => ManufacturerModalAddBtnClicked()}
    className="btn btn-primary btn-sm d-inline d-sm-none"
  >
    <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
    <span className="d-inline d-sm-none">  Add</span>
  </button>
    </div>
    <div className="d-flex justify-content-between align-items-center mb-1">
      <input
        type="text"
        className="form-control "
        placeholder="Search Manufacture "
        style={{ maxWidth: "350px" }}
        value={searchKeyword}
        onChange={(e) => {
          handleSearch(e);
        }}
      />
      <Tooltip title=" Add Manufacturer Model">
      <button
    onClick={() => ManufacturerModalAddBtnClicked()}
    className="btn btn-primary btn-sm d-none d-sm-inline"
  >
    <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
    <span className="d-none d-sm-inline">  Add Manufacturer Model</span>
  </button>
      </Tooltip>
    </div>

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
          <table className="table table-bordered table-striped">
              <thead className="table-light " style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                <tr className="text-nowrap ">
                  <th className="text-center">ID</th>
                  <th className="text-center">Model Number</th>

                  {/* <th className="text-center">Created Date</th> */}
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {manufacturerListData?.map((row, idx) => (
                  <tr className="text-nowrap" key={idx}>
                    <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="text-center">{row.modelNumber}</td>
                    {/* <td className="text-center">{row.createdOnDate}</td> */}

                    <td className="text-center">
                    <Tooltip title='Update Manufacturer Model'>
                      <button
                        onClick={() => {
                          ManufactureEditBtnClicked(row);
                          handleShow();
                        }}
                        type="button"
                        className="btn-sm btn btn-primary ms-2 me-2"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-end ">
            {totalCount > pageSize && (
              <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
            )}
          </div>
        </div>
      </div>

      {showManufacturerModal && (
        <ManufacturerAddUpdateModal
          show={showManufacturerModal}
          onHide={() => {
            setShowManufacturerModal(false);
            handleClose();
          }}
          modelRequestData={modelRequestData}
          setModelRequestData={setModelRequestData}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        />
      )}
    </>
  );
};

export default ManufacturerModalList;
