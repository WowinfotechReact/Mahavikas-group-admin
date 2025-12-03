



import React, { useState, useEffect, useContext } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation, useNavigate } from 'react-router';
import { ConfigContext } from 'context/ConfigContext';
import StatusChangeModal from 'component/StatusChangeModal ';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { Tooltip } from '@mui/material';
import { DeleteMappedZoneDistrict, GetAssignedZoneDistrictList } from 'services/Master Crud/MasterZoneApi';
import AssignedDistrictModal from '../Master Zone/AssignedDistrictModal';
import DeleteModal from 'views/DeleteModal';

const MapCityList = () => {
      const [openSetDistrictModal, setOpenSetDistrictModal] = useState(false);

      const { setLoader } = useContext(ConfigContext);
      const [modelAction, setModelAction] = useState();
      const navigate = useNavigate();

      const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
      const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
      const [searchKeyword, setSearchKeyword] = useState('');
      const [showSuccessModal, setShowSuccessModal] = useState();
      const [showDelete, setShowDelete] = useState(false);
      const [modelRequestData, setModelRequestData] = useState({
            stateID: null,
            stateName: null,
            Action: null
      });
      const [selectedMappingID, setSelectedMappingID] = useState(null);
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
            setLoader(true);
            try {
                  let response = await GetAssignedZoneDistrictList(
                        location.state.Value.zoneIDs
                  );

                  if (response?.data?.statusCode === 200) {
                        setLoader(false);
                        const result = response?.data?.responseData?.data?.[0] || null;
                        setDistList(result);
                  }
            } catch (error) {
                  setLoader(false);
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
      const handleDeleteClick = (item) => {
            setSelectedMappingID(item.zoneDistrictMappingID); // ✅ Store ID
            setShowDelete(true); // ✅ Open modal
      };

      const handleConfirmDelete = async () => {
            try {
                  if (!selectedMappingID) return;

                  const res = await DeleteMappedZoneDistrict(selectedMappingID);


                  console.log(res?.data, '333333ssssssss');

                  // ✅ Check success
                  if (
                        res?.data?.statusCode === 200
                  ) {
                        console.log("✅ Deleted:", res?.responseData?.data);


                        setModelAction('Mapped Zone Deleted')
                        setShowSuccessModal(true)
                        setIsAddUpdateActionDone(true)

                        // ✅ Optional: Toast
                        // toast.success("Deleted Successfully");
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

      const closeAllModal = () => {
            setShowDelete(false);
            setShowSuccessModal(false);
            setOpenSetDistrictModal(false);
      }

      return (
            <>
                  <div className="card w-full max-w-[50vh] mx-auto h-auto">
                        <div className="card-body p-2 bg-white shadow-md rounded-lg">
                              {/* Top controls */}
                              <div className="d-flex justify-content-between align-items-center mb-1">

                                    {/* Back Button */}
                                    <button
                                          className="btn btn-outline-secondary btn-sm me-2"
                                          onClick={() => navigate(-1)}
                                    >
                                          <i className="fa-solid fa-arrow-left"></i>
                                    </button>

                                    <h5 className="m-0 flex-grow-1">
                                          Zone :- {distList?.zoneName || "N/A"}
                                    </h5>

                                    <button
                                          onClick={() => addMasterZoneBtnClick()}
                                          className="btn btn-primary btn-sm d-inline d-sm-none"
                                    >
                                          <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
                                          <span className="d-inline d-sm-none"> Add</span>
                                    </button>
                              </div>
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                    <input
                                          type="text"

                                          className="form-control "
                                          placeholder={animatedPlaceholder}
                                          style={{ maxWidth: "350px", visibility: 'hidden' }}
                                          value={searchKeyword}
                                          onChange={(e) => {
                                                handleSearch(e);
                                          }}
                                    />
                                    <Tooltip title="Add District">
                                          <button
                                                style={{ background: '#ffaa33', color: 'white' }}
                                                className="btn btn-sm d-none d-sm-inline"
                                                onClick={addMasterZoneBtnClick}
                                          >
                                                <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
                                                <span className="d-none d-sm-inline"> Add District</span>
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
                                                      <th className="text-center">Action</th>
                                                </tr>
                                          </thead>

                                          <tbody>
                                                {distList?.districtList?.map((item, index) => (
                                                      <tr className="text-center" key={index}>
                                                            <td className="text-center">{index + 1}</td>
                                                            <td className="text-center">{item.districtName}</td>
                                                            <td className="text-center">{item.stateName}</td>

                                                            <td className="text-center">
                                                                  <div className="d-flex justify-content-center">
                                                                        <button
                                                                              className="btn btn-outline-danger d-flex align-items-center gap-2 btn-sm"
                                                                              onClick={() => handleDeleteClick(item)}
                                                                        >
                                                                              <i className="bi bi-trash-fill"></i>
                                                                              Delete
                                                                        </button>
                                                                  </div>
                                                            </td>

                                                      </tr>
                                                ))}
                                          </tbody>
                                    </table>

                              </div>
                              <div className="d-flex justify-content-end ">

                              </div>
                        </div>
                  </div>



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

                  <DeleteModal
                        show={showDelete}
                        onClose={() => setShowDelete(false)}
                        onConfirm={handleConfirmDelete}
                        title="Delete Zone Mapped"
                        message="Do you really want to delete?"
                  />
            </>
      );
};

export default MapCityList;

