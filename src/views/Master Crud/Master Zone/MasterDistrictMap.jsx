import { ConfigContext } from 'context/ConfigContext';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  AddDeleteZoneDistrictMapping,
  GetZoneDistrictLookup,
  GetZoneMappingDistrictLookup
} from 'services/Master Crud/ZoneMappingDistrict/ZoneMappingDistrictApi';

const MasterDistrictMap = () => {
  const [availableStates, setAvailableStates] = useState([]);
  const [assignedStates, setAssignedStates] = useState([]);
  const { setLoader, user } = useContext(ConfigContext);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const location = useLocation();
  const [districtSearchTerm, setDistrictSearchTerm] = useState('');

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
    if (!location?.state?.zoneKeyID) return;
    setLoader(true);
    try {
      let response = await GetZoneMappingDistrictLookup(location?.state?.zoneKeyID);

      if (response?.data?.statusCode === 200) {
        setLoader(false);
        const mapStateList = response?.data?.responseData?.zoneMappingStateList || []; // Correct API path

        const formattedStateList = mapStateList.map((state) => ({
          value: state.districtID,
          label: state.districtName, // Keep all states as valid
          zoneDistrictMapKeyID: state.zoneDistrictMapKeyID,
          zoneDistrictMapID: state.zoneDistrictMapKeyID
        }));

        setAvailableStates(formattedStateList);
      } else {
        console.error('Bad request');
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const GetZoneStateLookupListData = async () => {
    setLoader(true);
    if (!location?.state?.zoneKeyID) return; // Prevent calling with an invalid key

    try {
      let response = await GetZoneDistrictLookup(location.state.zoneKeyID);
      console.log(response, 'API Response');

      if (response?.data?.statusCode === 200) {
        setLoader(false);
        // ✅ Fix response path: Use 'zoneStateList' instead of 'zoneAssignStateList'
        const zoneStateList = response?.data?.responseData?.zoneStateList || [];

        // ✅ Map correct fields
        const formattedStateList = zoneStateList.map((zone) => ({
          value: zone.districtID, // Use correct ID field
          label: zone.districtName, // Combine names for clarity
          zoneDistrictMapID: zone.zoneDistrictMapKeyID,
          zoneDistrictMapKeyID: zone.zoneDistrictMapKeyID
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
      zoneDistrictMapKeyID: AssignedStateMap?.zoneDistrictMapID,
      zoneKeyID: location?.state?.zoneKeyID,
      districtID: AssignedStateMap?.value
    };
    AddUpdateDistrictData(apiParam);
  };

  const AddUpdateDistrictData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddDeleteZoneDistrictMapping'; // Default URL for Adding Data

      const response = await AddDeleteZoneDistrictMapping(url, apiParam);
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
  const navigate = useNavigate()

  return (
    <div className="card w-full max-w-[50vh] mx-auto h-auto p-1 shadow-lg rounded-lg">
      <div className="card-body bg-white">
        <div className="container mt-1">
          <div className="d-flex align-items-center gap-2">
            <i
              onClick={() => navigate('/master-zone')}
              className="fa-solid fa-arrow-left"
              style={{ color: '#3366ff', cursor: 'pointer', fontSize: "20px", width: "20px", height: "20px" }}>
            </i>
            <h4 className="mb-0">District Mapping</h4>
          </div>
          <h4 className="text-center text-primary mb-1">{location?.state?.zoneName} Mapping</h4>

          <div className="row d-flex gap-4 justify-content-center">
            {/* Available States Table */}

            <div className="col-md-5 p-1 border rounded shadow-sm bg-light">
              <h5 className="text-center text-dark">Available District</h5>
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search district..."
                  value={districtSearchTerm}
                  onChange={(e) => setDistrictSearchTerm(e.target.value)}
                />
              </div>
              <div className="table-responsive" style={{ maxHeight: '63vh', overflowY: 'auto' }}>

                <table className="table table-striped table-hover table-bordered">
                  <thead>
                    <tr>
                      <th>District Name</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedStates.filter(d =>
                      d.label.toLowerCase().includes(districtSearchTerm.toLowerCase())
                    ).length > 0 ? (
                      assignedStates
                        .filter(d =>
                          d.label.toLowerCase().includes(districtSearchTerm.toLowerCase())
                        )
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
                          No district found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Assigned States Table */}
            <div className="col-md-5  border rounded shadow-sm bg-light">
              <h5 className="text-center text-dark">Assigned District</h5>
              <div className="table-responsive" style={{ maxHeight: '63vh', overflowY: 'auto' }}>
                <table className="table table-striped table-hover table-bordered">
                  <thead>
                    <tr>
                      <th>District Name</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableStates.length > 0 ? (
                      availableStates.map((AssignedStateMap) => (
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
                          No district assigned
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

export default MasterDistrictMap;
