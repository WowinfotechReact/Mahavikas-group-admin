import { ConfigContext } from 'context/ConfigContext';
import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import {
  AddDeleteZoneStateMapping,
  GetZoneMappingStateLookup,
  GetZoneStateLookup
} from 'services/Master Crud/ZoneMappingState/ZoneMappingStateApi';

const MasterStateMap = () => {
  const [availableStates, setAvailableStates] = useState([]);
  const [assignedStates, setAssignedStates] = useState([]);
  const { setLoader, user } = useContext(ConfigContext);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [assignedSearchTerm, setAssignedSearchTerm] = useState('');

  useEffect(() => {
    GetZoneMapStateLookupListData();
  }, [location?.state]);

  useEffect(() => {
    if (location?.state?.zoneKeyID !== null) {
      GetZoneStateLookupListData();
    }
  }, []);

  useEffect(() => {
    if (isAddUpdateActionDone) GetZoneMapStateLookupListData();
    GetZoneStateLookupListData();
    // setSearchKeyword('')


    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  const GetZoneMapStateLookupListData = async () => {
    setLoader(true);
    if (!location?.state?.zoneKeyID) return;
    try {
      let response = await GetZoneMappingStateLookup(location.state.zoneKeyID);

      if (response?.data?.statusCode === 200) {
        setLoader(false);
        const mapStateList = response?.data?.responseData?.zoneMappingStateList || []; // Correct API path

        // Format data properly (no filtering)
        const formattedStateList = mapStateList.map((state) => ({
          value: state.stateID,
          label: state.stateName, // Keep all states as valid
          zoneStateMapID: state.zoneStateMapID,
          zoneStateMapKeyID: state.zoneStateMapKeyID
        }));

        setAvailableStates(formattedStateList);
      } else {
        setLoader(false);
        console.error('Bad request');
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const GetZoneStateLookupListData = async () => {
    if (!location?.state?.zoneKeyID) return; // Prevent calling with an invalid key
    setLoader(true);

    try {
      let response = await GetZoneStateLookup(location.state.zoneKeyID);

      if (response?.data?.statusCode === 200) {
        setLoader(false);
        // ✅ Fix response path: Use 'zoneStateList' instead of 'zoneAssignStateList'
        const zoneStateList = response?.data?.responseData?.zoneStateList || [];

        const formattedStateList = zoneStateList.map((zone) => ({
          value: zone.stateID, // Use correct ID field
          label: zone.stateName, // Combine names for clarity
          zoneStateMapKeyID: zone.zoneStateMapKeyID,
          zoneStateMapID: zone.zoneStateMapID
        }));

        setAssignedStates(formattedStateList); // Set the updated state list
        console.log(formattedStateList, 'Updated Assigned States');
      } else {
        setLoader(false);
        console.error('Bad request');
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const addAssignState = (AssignedStateMap) => {
    const apiParam = {
      userKeyID: user.userKeyID,
      zoneKeyID: location?.state?.zoneKeyID,

      // zoneStateMapKeyID: AssignedStateMap?.zoneStateMapID,
      stateID: AssignedStateMap.value,
      zoneStateMapKeyID: AssignedStateMap.zoneStateMapKeyID
    };
    AddUpdateStateData(apiParam);
  };

  const AddUpdateStateData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddDeleteZoneStateMapping'; // Default URL for Adding Data

      const response = await AddDeleteZoneStateMapping(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);

          setIsAddUpdateActionDone(true);
        } else {
          setLoader(false);
          setErrorMessage(response?.response?.data?.errorMessage);
        }
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };
  const navigate = useNavigate();
  return (
    <div className="card w-full max-w-[50vh] mx-auto h-auto p-1 shadow-lg rounded-lg">
      <div className="card-body bg-white">
        <div className="container mt-1">
          <div className="d-flex align-items-center gap-2">
            <i
              onClick={() => navigate('/master-zone')}
              className="fa-solid fa-arrow-left"
              style={{ color: '#3366ff', cursor: 'pointer', fontSize: '20px', width: '20px', height: '20px' }}
            ></i>
            <h4 className="mb-0">State Mapping</h4>
          </div>

          <h4 className="text-center text-primary mb-1">{location?.state?.zoneName} Mapping</h4>

          <div className="row d-flex gap-4 justify-content-center">
            {/* Available States Table */}
            <div className="col-md-5  border rounded shadow-sm bg-light">
              <h5 className="text-center text-dark">Available States</h5>
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search states..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="table-responsive" style={{ maxHeight: '63vh', overflowY: 'auto' }}>
                <table className="table table-striped table-bordered">
                  <thead style={{ color: 'red' }}>
                    <tr>
                      <th>State Name</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedStates.filter(state =>
                      state.label.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length > 0 ? (
                      assignedStates
                        .filter(state => state.label.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((AssignedStateMap) => (
                          <tr key={AssignedStateMap.value}>
                            <td>{AssignedStateMap.label}</td>
                            <td className="text-center">
                              <button className="btn btn-success btn-sm" onClick={() => addAssignState(AssignedStateMap)}>
                                <i className="fa-solid fa-plus"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center text-muted">
                          No states found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Assigned States Table */}
            <div className="col-md-5  border rounded shadow-sm bg-light">
              <h5 className="text-center text-dark">Assigned States</h5>
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search assigned states..."
                  value={assignedSearchTerm}
                  onChange={(e) => setAssignedSearchTerm(e.target.value)}
                />
              </div>

              <div className="table-responsive" style={{ maxHeight: '63vh', overflowY: 'auto' }}>
                <table className="table table-striped table-bordered">
                  <thead style={{ color: '#ff474a' }}>
                    <tr>
                      <th>State Name</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableStates.filter(state =>
                      state.label.toLowerCase().includes(assignedSearchTerm.toLowerCase())
                    ).length > 0 ? (
                      availableStates
                        .filter(state =>
                          state.label.toLowerCase().includes(assignedSearchTerm.toLowerCase())
                        )
                        .map((AssignedStateMap) => (
                          <tr key={AssignedStateMap.value}>
                            <td>{AssignedStateMap.label}</td>
                            <td className="text-center">
                              <button className="btn btn-danger btn-sm" onClick={() => addAssignState(AssignedStateMap)}>
                                <i className="fa-solid fa-minus"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center text-muted">
                          No states found
                        </td>
                      </tr>
                    )}

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterStateMap;
