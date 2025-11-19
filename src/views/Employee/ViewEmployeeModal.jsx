





import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { Tooltip } from '@mui/material';


function ViewEmployeeModal({ show, onHide, modelRequestData }) {

      console.log(modelRequestData, '3333333s');




      return (
            <Modal backdrop="static" keyboard={false} style={{ zIndex: 1300 }} show={show} onHide={onHide} centered>

                  <Modal.Header closeButton>
                        <Modal.Title>Employee Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                        <div className="scrollable-table">
                              <div className="container mt-3">
                                    <div className="card shadow-sm">


                                          <div className="card-body">

                                                {/* Row 1 */}
                                                <div className="row mb-3">
                                                      <div className="col-md-4">
                                                            <strong>Full Name:</strong>
                                                            <div>{modelRequestData?.data.fullName || "-"}</div>
                                                      </div>
                                                      <div className="col-md-4">
                                                            <strong>Project Name:</strong>
                                                            <div>{modelRequestData?.data.projectNames || "-"}</div>
                                                      </div>


                                                </div>



                                                {/* Row 2 */}
                                                <div className="row mb-3">
                                                      <div className="col-md-4">
                                                            <strong>Email ID:</strong>
                                                            <div>{modelRequestData?.data.emailID || "-"}</div>
                                                      </div>
                                                      <div className="col-md-4">
                                                            <strong>Mobile No:</strong>
                                                            <div>{modelRequestData?.data.mobileNo || "-"}</div>
                                                      </div>
                                                      <div className="col-md-4">
                                                            <strong>Created On:</strong>
                                                            <div>{modelRequestData?.data.createdOnDate || "-"}</div>
                                                      </div>
                                                </div>

                                                {/* Row 3 */}
                                                <div className="row mb-3">
                                                      <div className="col-md-4">
                                                            <strong>Company Name:</strong>
                                                            <div>{modelRequestData?.data.companyName || "-"}</div>
                                                      </div>
                                                      <div className="col-md-4">
                                                            <strong>Institute Name:</strong>
                                                            <div>{modelRequestData?.data.instituteName || "-"}</div>
                                                      </div>
                                                      <div className="col-md-4">
                                                            <strong>Address:</strong>
                                                            <div>{modelRequestData?.data.address || "-"}</div>
                                                      </div>
                                                </div>

                                                {/* Row 4 */}
                                                <div className="row mb-3">
                                                      <div className="col-md-4">
                                                            <strong>Zone:</strong>
                                                            <div>{modelRequestData?.data.zoneNames || "-"}</div>
                                                      </div>
                                                      <div className="col-md-4">
                                                            <strong>District:</strong>
                                                            <div>{modelRequestData?.data.districtNames || "-"}</div>
                                                      </div>
                                                      <div className="col-md-4">
                                                            <strong>Taluka:</strong>
                                                            <div>{modelRequestData?.data.talukaNames || "-"}</div>
                                                      </div>
                                                </div>

                                                {/* Row 5 */}


                                                {/* Hidden IDs (optional) */}


                                          </div>
                                    </div>
                              </div>

                        </div>
                  </Modal.Body>


                  <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>
                              <b>Close</b>
                        </Button>
                  </Modal.Footer>
            </Modal>
      );
}

export default ViewEmployeeModal;
