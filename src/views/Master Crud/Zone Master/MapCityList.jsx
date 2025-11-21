



import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Android12Switch from 'component/Android12Switch';
import { useLocation, useNavigate } from 'react-router';

import { ConfigContext } from 'context/ConfigContext';
import { ChangeStateStatus } from 'services/Master Crud/MasterStateApi';

import dayjs from 'dayjs';
// import AddUpdateMasterStateModal from './MasterStateModal';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { Tooltip } from '@mui/material';
// import MasterZoneModal from './MasterZoneModal';

import CabinIcon from '@mui/icons-material/Cabin';
import { ChangeZoneStatus, GetAssignedZoneDistrictList, GetZoneList } from 'services/Master Crud/MasterZoneApi';
import MasterZoneModal from '../Master Zone/MasterZoneModal';
import AssignedDistrictModal from '../Master Zone/AssignedDistrictModal';
// import AssignedDistrictModal from './AssignedDistrictModal';
// import ViewMappedDistrictModal from './ViewMappedDistrictModal';

const MapCityList = () => {
      const [stateChangeStatus, setStateChangeStatus] = useState('');
      const [totalRecords, setTotalRecords] = useState(-1);
      const [openSetDistrictModal, setOpenSetDistrictModal] = useState(false);

      const { setLoader, user, companyID } = useContext(ConfigContext);
      const [modelAction, setModelAction] = useState();
      const navigate = useNavigate();
      const [showDistrictModal, setShowDistrictModal] = useState(false)
      const [currentPage, setCurrentPage] = useState(1);
      const [totalPage, setTotalPage] = useState();
      const [totalCount, setTotalCount] = useState(null);
      const [pageSize, setPageSize] = useState(30);
      const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
      const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
      const [searchKeyword, setSearchKeyword] = useState('');
      const [apiParams, setApiParams] = useState(null); // State to store API parameters
      const [fromDate, setFromDate] = useState(null); // Initialize as null
      const [toDate, setToDate] = useState(null);
      const [stateListData, setStateListData] = useState([]);
      const [openMasterStateModal, setOpenMasterStateModal] = useState(false);

      const [showSuccessModal, setShowSuccessModal] = useState();
      const [sortingDirection, setSortingDirection] = useState(null);
      const [sortDirectionObj, setSortDirectionObj] = useState({
            ServiceNameSort: null
      });
      const [sortType, setSortType] = useState('');

      const [modelRequestData, setModelRequestData] = useState({
            stateID: null,
            stateName: null,
            Action: null
      });











      const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");

      const fullText = "Search By Zone Namee";
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

      const location = useLocation()

      const [distList, setDistList] = useState([])
      useEffect(() => {
            if (location.state.Value?.zoneIDs) {
                  GetAssignedZoneDistrictListData();
            }
      }, [location]);



      useEffect(() => {
            if (isAddUpdateActionDone) {
                  GetAssignedZoneDistrictListData();

            }
            setIsAddUpdateActionDone(false)
      }, [isAddUpdateActionDone])




      const GetAssignedZoneDistrictListData = async () => {
            try {
                  let response = await GetAssignedZoneDistrictList(
                        location.state.Value.zoneIDs
                  );

                  if (response?.data?.statusCode === 200) {
                        const result = response?.data?.responseData?.data?.[0] || null;
                        setDistList(result);
                  }
            } catch (error) {
                  console.log(error);
            }
      };
      const addMasterZoneBtnClick = () => {
            setModelRequestData({
                  ...modelRequestData,
                  Action: null,
                  zoneKeyID: location?.state?.Value?.zoneKeyID
            });
            setOpenSetDistrictModal(true);
      };
      return (
            <>
                  <div className="card w-full max-w-[50vh] mx-auto h-auto">
                        <div className="card-body p-2 bg-white shadow-md rounded-lg">
                              {/* Top controls */}
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                    <h5 className="m-0">Zone  :-  {distList?.zoneName || "N/A"}</h5>
                                    <button
                                          onClick={() => addMasterZoneBtnClick()}
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
                                          placeholder={animatedPlaceholder}
                                          style={{ maxWidth: "350px" }}
                                          value={searchKeyword}
                                          onChange={(e) => {
                                                handleSearch(e);
                                          }}
                                    />
                                    <Tooltip title="Add City">
                                          <button
                                                style={{ background: '#ffaa33', color: 'white' }}
                                                className="btn btn-sm d-none d-sm-inline"
                                                onClick={addMasterZoneBtnClick}
                                          >
                                                <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
                                                <span className="d-none d-sm-inline"> Add City</span>
                                          </button>

                                    </Tooltip>
                              </div>

                              {/* Table */}
                              <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
                                    <table className="table table-bordered table-striped">
                                          <thead className="table-gradient-orange" style={{ position: 'sticky', top: 0, zIndex: 10, color: '#fff' }}>

                                                <tr>
                                                      <th className="text-center">Sr No.</th>
                                                      <th className="text-center">District Name</th>
                                                      <th className="text-center">State Name</th>
                                                </tr>
                                          </thead>

                                          <tbody>
                                                {distList?.districtList?.map((item, index) => (
                                                      <tr key={index}>
                                                            <td className="text-center">{index + 1}</td>
                                                            <td className="text-center">{item.districtName}</td>
                                                            <td className="text-center">{item.stateName}</td>
                                                      </tr>
                                                ))}
                                          </tbody>
                                    </table>

                              </div>
                              <div className="d-flex justify-content-end ">

                              </div>
                        </div>
                  </div>

                  {/* {openMasterStateModal && (
                        <MasterZoneModal
                              show={openMasterStateModal}
                              onHide={() => setOpenMasterStateModal(false)}
                              modelRequestData={modelRequestData}
                              setModelRequestData={setModelRequestData}
                              setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                        />
                  )} */}
                  {/* {openSetDistrictModal && (
                        <AssignedDistrictModal
                              show={openSetDistrictModal}
                              onHide={() => setOpenSetDistrictModal(false)}
                              modelRequestData={modelRequestData}
                              setModelRequestData={setModelRequestData}
                              setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                        />
                  )} */}
                  {/* {showDistrictModal && (
                        <ViewMappedDistrictModal
                              show={showDistrictModal}
                              onHide={() => setShowDistrictModal(false)}
                              modelRequestData={modelRequestData}
                              setModelRequestData={setModelRequestData}
                              setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                        />
                  )} */}

                  {openSetDistrictModal && (
                        <AssignedDistrictModal
                              show={openSetDistrictModal}
                              onHide={() => setOpenSetDistrictModal(false)}
                              modelRequestData={modelRequestData}
                              setModelRequestData={setModelRequestData}
                              setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                        />
                  )}

                  <StatusChangeModal
                        open={showStatusChangeModal}
                        onClose={() => setShowStatusChangeModal(false)}
                  />

                  {showSuccessModal && (
                        <SuccessPopupModal
                              show={showSuccessModal}
                              onHide={() => closeAllModal()}
                              setShowSuccessModal={setShowSuccessModal}
                              modelAction={modelAction}
                        />
                  )}
            </>
      );
};

export default MapCityList;

