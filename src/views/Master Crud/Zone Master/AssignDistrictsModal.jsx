// AssignDistrictsModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, Form, Badge } from "react-bootstrap";

/*
 Props:
  - show, onHide
  - onUpdate({ state, districts })
  - locationData
  - getZone(): returns current zone object for preselecting
*/

function DistrictsPickerModal({ show, onHide, stateName, districtsList = [], initialSelected = [], onConfirm }) {
      const [checked, setChecked] = useState(new Set(initialSelected || []));

      useEffect(() => {
            if (show) setChecked(new Set(initialSelected || []));
      }, [show, initialSelected]);

      const toggle = (d) => {
            setChecked((s) => {
                  const copy = new Set(s);
                  if (copy.has(d)) copy.delete(d);
                  else copy.add(d);
                  return copy;
            });
      };

      return (
            <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
                  <Modal.Header closeButton>
                        <Modal.Title>{stateName ? `Select districts in ${stateName}` : "Select districts"}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                        <div style={{ maxHeight: 300, overflowY: "auto" }}>
                              {districtsList.length === 0 && <div className="text-muted">No districts available</div>}
                              {districtsList.map((d) => (
                                    <Form.Check
                                          key={d}
                                          type="checkbox"
                                          id={`picker_${d}`}
                                          label={d}
                                          checked={checked.has(d)}
                                          onChange={() => toggle(d)}
                                          className="mb-1"
                                    />
                              ))}
                        </div>
                  </Modal.Body>
                  <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>Cancel</Button>
                        <Button variant="primary" onClick={() => onConfirm(Array.from(checked))}>Confirm</Button>
                  </Modal.Footer>
            </Modal>
      );
}

export default function AssignDistrictsModal({ show, onHide, onUpdate, locationData, getZone }) {
      const [stateSel, setStateSel] = useState("");
      const [selectedDistricts, setSelectedDistricts] = useState([]); // array of district names
      const [showPicker, setShowPicker] = useState(false);

      // show only first two states as per your earlier request (change if needed)
      const states = useMemo(() => Object.keys(locationData || {}).slice(0, 2), [locationData]);
      const districtsList = useMemo(() => (stateSel ? Object.keys(locationData[stateSel] || {}) : []), [locationData, stateSel]);

      // when modal opens or stateSel changes, prefill selectedDistricts from the zone
      useEffect(() => {
            if (!show) {
                  setStateSel("");
                  setSelectedDistricts([]);
                  return;
            }
            // if stateSel already set, prefill with zone data for that state
            if (stateSel) {
                  const zone = getZone ? getZone() : null;
                  const existing = zone ? zone.locations.filter(l => l.state === stateSel).map(l => l.district) : [];
                  setSelectedDistricts(existing);
            } else {
                  setSelectedDistricts([]);
                  // auto-select first state so user immediately sees districts (optional)
                  if (states.length) setStateSel(states[0]);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [show, stateSel, states]);

      // open picker with current selectedDistricts as initial
      const openPicker = () => {
            if (!stateSel) return alert("Select a state first");
            setShowPicker(true);
      };

      // on picker confirm -> update selectedDistricts in this modal
      const handlePickerConfirm = (districtsArray) => {
            setSelectedDistricts(districtsArray || []);
            setShowPicker(false);
      };

      const handleSubmit = () => {
            if (!stateSel) return alert("Please select a state");
            // send { state, districts } back to parent
            onUpdate({ state: stateSel, districts: selectedDistricts });
      };

      return (
            <>
                  <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>

                        <Modal.Header closeButton><Modal.Title>Assign / Update Districts</Modal.Title></Modal.Header>
                        <Modal.Body>
                              <div className="row g-3">
                                    <div className="col-md-6">
                                          <Form.Label>State </Form.Label>
                                          <Form.Select value={stateSel} onChange={(e) => setStateSel(e.target.value)}>
                                                <option value="">-- Select State --</option>
                                                {states.map(s => <option key={s} value={s}>{s}</option>)}
                                          </Form.Select>
                                    </div>

                                    <div className="col-md-6 d-flex flex-column">
                                          <Form.Label>Selected Districts</Form.Label>
                                          <div className="mb-2">
                                                {selectedDistricts.length === 0 ? (
                                                      <div className="text-muted">No districts selected</div>
                                                ) : (
                                                      selectedDistricts.map(d => <Badge bg="secondary" className="me-1" key={d}>{d}</Badge>)
                                                )}
                                          </div>
                                          <div>
                                                <Button variant="outline-primary" size="sm" onClick={openPicker}>Add  / Update Districts</Button>
                                          </div>
                                    </div>
                              </div>
                        </Modal.Body>

                        <Modal.Footer>
                              <Button variant="secondary" onClick={onHide}>Cancel</Button>
                              <Button variant="primary" onClick={handleSubmit}>Save Districts</Button>
                        </Modal.Footer>
                  </Modal>

                  <DistrictsPickerModal
                        show={showPicker}
                        onHide={() => setShowPicker(false)}
                        stateName={stateSel}
                        districtsList={districtsList}
                        initialSelected={selectedDistricts}
                        onConfirm={handlePickerConfirm}
                  />
            </>
      );
}
