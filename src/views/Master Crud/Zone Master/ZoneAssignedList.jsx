
// ZoneManager.jsx
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import ZoneCreateModal from "./ZoneCreateModal";
import AssignDistrictsModal from "./AssignDistrictsModal";
import ViewZoneModal from "./ViewZoneModal";
import Android12Switch from "component/Android12Switch";

export const SAMPLE_LOCATION_DATA = {
      "Uttar Pradesh": {
            Lucknow: ["Alambagh", "Aminabad"],
            Varanasi: ["Cantt", "Lanka"],
            Agra: ["Sikandra", "Tajganj"]
      },
      "Maharashtra": {
            Mumbai: ["Andheri", "Bandra"],
            Pune: ["Kothrud", "Hinjewadi"],
            Nagpur: ["Itwari"]
      },
      "Karnataka": {
            Bengaluru: ["MG Road", "Whitefield"],
            Mysore: ["Gokulam"]
      }
};

export default function ZoneAssignedList() {
      const [zones, setZones] = useState([]);
      const [showCreate, setShowCreate] = useState(false);
      const [showAssign, setShowAssign] = useState(false);
      const [showView, setShowView] = useState(false);

      const [assignZoneId, setAssignZoneId] = useState(null);
      const [viewZone, setViewZone] = useState(null);

      const handleCreate = (name) => {
            setZones((s) => [...s, { id: Date.now(), name, locations: [] }]);
            setShowCreate(false);
      };

      const openAssign = (zoneId) => {
            setAssignZoneId(zoneId);
            setShowAssign(true);
      };

      // receives { state, districts: [] }
      const handleUpdateDistricts = ({ state, districts }) => {
            setZones((prev) =>
                  prev.map((z) => {
                        if (z.id !== assignZoneId) return z;
                        // remove all existing entries for this state, then add back selected districts
                        const others = z.locations.filter((l) => l.state !== state);
                        const newLocs = districts.map((d) => ({ state, district: d }));
                        return { ...z, locations: [...others, ...newLocs] };
                  })
            );
            setShowAssign(false);
      };

      const openView = (zone) => {
            setViewZone(zone);
            setShowView(true);
      };

      const handleRemoveLocation = (zoneId, idx) => {
            setZones((prev) =>
                  prev.map((z) => (z.id === zoneId ? { ...z, locations: z.locations.filter((_, i) => i !== idx) } : z))
            );
      };

      const handleDeleteZone = (zoneId) => {
            if (!window.confirm("Delete this zone?")) return;
            setZones((s) => s.filter((z) => z.id !== zoneId));
      };

      return (
            <div className="card w-full max-w-[50vh] mx-auto h-auto">
                  <div className="card-body p-2 bg-white shadow-md rounded-lg">

                        <div className="d-flex justify-content-between align-items-center mb-3">
                              <h3>Zone Master2</h3>
                              <div>
                                    <button
                                          onClick={() => setShowCreate(true)}
                                          style={{ background: '#ffaa33' }} className="btn text-white  btn-sm d-none d-sm-inline"


                                    >
                                          <i className="fa-solid fa-plus" style={{ fontSize: "11px" }}></i>
                                          <span className="d-none d-sm-inline"> Ceate Zone</span>
                                    </button>
                                    {/* <Button variant="outline-secondary" onClick={() => {
                                    if (zones.length) return alert("Demo already loaded");
                                    setZones([
                                          { id: 1, name: "North Zone", locations: [{ state: "Uttar Pradesh", district: "Lucknow" }] },
                                          { id: 2, name: "South Zone", locations: [{ state: "Maharashtra", district: "Pune" }] },
                                    ]);
                              }}>Load Demo</Button> */}
                              </div>
                        </div>

                        {/* list */}
                        <div className="table-responsive">
                              <table className="table table-bordered">
                                    <thead className="table-light"><tr><th>#</th><th>Zone</th><th>Locations</th>
                                          <th>Status</th>
                                          <th>Actions</th>

                                    </tr></thead>
                                    <tbody>
                                          {zones.length === 0 && <tr><td colSpan={5} className="text-center text-muted">No zones</td></tr>}
                                          {zones.map((z, idx) => (
                                                <tr key={z.id}>
                                                      <td>{idx + 1}</td>
                                                      <td>{z.name}</td>
                                                      <td>
                                                            {z.locations.length === 0 && <small className="text-muted">No districts</small>}
                                                            {z.locations.map((loc, i) => (
                                                                  <div key={i} className=" rounded p-2 mb-2 d-flex justify-content-between align-items-start">
                                                                        <div><strong>{loc.state}</strong> — {loc.district}</div>
                                                                  </div>
                                                            ))}
                                                      </td>
                                                      <td>
                                                            <Android12Switch style={{ padding: '8px' }} />

                                                      </td>
                                                      <td>
                                                            <Button variant="success" size="sm" onClick={() => openAssign(z.id)} className="me-2">+ Assign Districts</Button>
                                                            <Button variant="info" size="sm" onClick={() => openView(z)} className="me-2">View</Button>
                                                            {/* <Button variant="danger" size="sm" onClick={() => handleDeleteZone(z.id)}>Delete</Button> */}
                                                      </td>
                                                </tr>
                                          ))}
                                    </tbody>
                              </table>
                        </div>
                  </div>

                  <ZoneCreateModal show={showCreate} onHide={() => setShowCreate(false)} onCreate={handleCreate} />
                  <AssignDistrictsModal
                        show={showAssign}
                        onHide={() => setShowAssign(false)}
                        onUpdate={handleUpdateDistricts}
                        locationData={SAMPLE_LOCATION_DATA}
                        getZone={() => zones.find((z) => z.id === assignZoneId) || null}
                  />
                  <ViewZoneModal show={showView} onHide={() => setShowView(false)} zone={viewZone} />
            </div>
      );
}
