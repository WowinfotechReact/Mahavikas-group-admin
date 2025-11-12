// ViewZoneModal.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function ViewZoneModal({ show, onHide, zone }) {
      return (
            <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
                  <Modal.Header closeButton><Modal.Title>View Zone</Modal.Title></Modal.Header>
                  <Modal.Body>
                        {!zone ? (
                              <div className="text-muted">No zone selected</div>
                        ) : (
                              <div>
                                    <h5>{zone.name}</h5>
                                    <hr />
                                    {zone.locations.length === 0 && <div className="text-muted">No districts assigned.</div>}
                                    {zone.locations.map((loc, idx) => (
                                          <div key={idx} className="mb-2">
                                                <div className="fw-bold">{loc.state} — {loc.district}</div>
                                          </div>
                                    ))}
                              </div>
                        )}
                  </Modal.Body>
                  <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>Close</Button>
                        <Button variant="outline-primary" onClick={() => { navigator.clipboard?.writeText(JSON.stringify(zone, null, 2)); alert("Copied zone JSON"); }}>
                              Copy JSON
                        </Button>
                  </Modal.Footer>
            </Modal>
      );
}
