// AssignCitiesModal.jsx
import React, { useState, useMemo } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import DistrictModal from "./DistrictModal";

export default function AssignCitiesModal({ show, onHide, onAdd, locationData }) {
      const [stateSel, setStateSel] = useState("");
      const [districtSel, setDistrictSel] = useState("");
      const [showDistrictModal, setShowDistrictModal] = useState(false);
      const [citiesPreview, setCitiesPreview] = useState([]);

      const states = useMemo(() => Object.keys(locationData || {}), [locationData]);
      const districts = useMemo(() => (stateSel ? Object.keys(locationData[stateSel] || {}) : []), [locationData, stateSel]);

      const openDistrictPreview = (d) => {
            if (!stateSel) return alert("Please select a state first");
            if (!d) return alert("Pick a district");
            setDistrictSel(d);
            setCitiesPreview(locationData[stateSel][d] || []);
            setShowDistrictModal(true);
      };

      const handleDistrictConfirm = (confirmedDistrict) => {
            // Only state and district are used going forward
            setDistrictSel(confirmedDistrict);
            setShowDistrictModal(false);
      };

      const handleAdd = () => {
            if (!stateSel || !districtSel) return alert("Please select state and district");
            onAdd({ state: stateSel, district: districtSel });
            // reset
            setStateSel("");
            setDistrictSel("");
            setCitiesPreview([]);
      };

      return (
            <>
                  <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>


                        <Modal.Header closeButton>
                              <Modal.Title>Assign District</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <div className="row g-3">
                                    <div className="col-md-6">
                                          <Form.Label>State</Form.Label>
                                          <Form.Select
                                                value={stateSel}
                                                onChange={(e) => {
                                                      setStateSel(e.target.value);
                                                      setDistrictSel("");
                                                      setCitiesPreview([]);
                                                }}
                                          >
                                                <option value="">-- Select State --</option>
                                                {states.map((s) => (
                                                      <option key={s} value={s}>
                                                            {s}
                                                      </option>
                                                ))}
                                          </Form.Select>
                                    </div>

                                    <div className="col-md-6">
                                          <Form.Label>District</Form.Label>
                                          <div className="d-flex">
                                                <Form.Select value={districtSel} onChange={(e) => openDistrictPreview(e.target.value)} disabled={!stateSel}>
                                                      <option value="">-- Select District --</option>
                                                      {districts.map((d) => (
                                                            <option key={d} value={d}>
                                                                  {d}
                                                            </option>
                                                      ))}
                                                </Form.Select>
                                                <Button
                                                      variant="outline-secondary"
                                                      className="ms-2"
                                                      onClick={() => {
                                                            if (!districtSel) return alert("Pick a district first");
                                                            openDistrictPreview(districtSel);
                                                      }}
                                                >
                                                      Preview
                                                </Button>
                                          </div>
                                    </div>
                              </div>

                              <hr />

                              <div>
                                    <Form.Label>Selected District (read-only)</Form.Label>
                                    <Form.Control readOnly value={districtSel ? `${stateSel} — ${districtSel}` : ""} placeholder="No district selected" />
                                    <div className="form-text">Preview cities in district before confirming.</div>
                              </div>
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="secondary" onClick={onHide}>
                                    Cancel
                              </Button>
                              <Button variant="primary" onClick={handleAdd}>
                                    Add District
                              </Button>
                        </Modal.Footer>
                  </Modal>

                  <DistrictModal
                        show={showDistrictModal}
                        onHide={() => setShowDistrictModal(false)}
                        stateName={stateSel}
                        districtName={districtSel}
                        cities={citiesPreview}
                        onConfirm={handleDistrictConfirm}
                  />
            </>
      );
}
