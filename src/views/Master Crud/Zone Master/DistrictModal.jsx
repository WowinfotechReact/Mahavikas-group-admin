// DistrictModal.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function DistrictModal({ show, onHide, stateName, districtName, cities = [], onConfirm }) {
      return (
            <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>

                  <Modal.Header closeButton>
                        <Modal.Title>{districtName ? `Cities in ${districtName}` : "Cities"}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                        <div className="mb-2">
                              <small className="text-muted">State: {stateName}</small>
                        </div>
                        <div style={{ maxHeight: 300, overflowY: "auto" }}>
                              {cities && cities.length ? (
                                    <ul className="list-group">
                                          {cities.map((c) => (
                                                <li key={c} className="list-group-item">
                                                      {c}
                                                </li>
                                          ))}
                                    </ul>
                              ) : (
                                    <div className="text-muted">No cities available</div>
                              )}
                        </div>
                  </Modal.Body>
                  <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>
                              Cancel
                        </Button>
                        <Button
                              variant="primary"
                              onClick={() => {
                                    onConfirm(districtName);
                              }}
                        >
                              Select District
                        </Button>
                  </Modal.Footer>
            </Modal>
      );
}
