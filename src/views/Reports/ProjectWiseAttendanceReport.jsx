import React from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";

const ProjectWiseAttendanceReport = () => {
      return (
            <div className="container-fluid py-4">
                  {/* ---------- PAGE HEADER ---------- */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold text-primary mb-0">Project-wise Attendance Report</h5>
                        <Button variant="success" size="sm">
                              <i className="bi bi-file-earmark-excel me-1"></i>Export Excel
                        </Button>
                  </div>

                  {/* ---------- FILTER SECTION ---------- */}
                  <div className="border rounded p-3 bg-light mb-4">
                        <Form>
                              <Row className="g-3 align-items-end">
                                    <Col md={4}>
                                          <Form.Group>
                                                <Form.Label className="fw-semibold small mb-1">Project</Form.Label>
                                                <Form.Select size="sm">
                                                      <option>Select Project</option>
                                                      <option>Project Alpha</option>
                                                      <option>Project Beta</option>
                                                      <option>Project Gamma</option>
                                                </Form.Select>
                                          </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                          <Form.Group>
                                                <Form.Label className="fw-semibold small mb-1">From Date</Form.Label>
                                                <Form.Control size="sm" type="date" />
                                          </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                          <Form.Group>
                                                <Form.Label className="fw-semibold small mb-1">To Date</Form.Label>
                                                <Form.Control size="sm" type="date" />
                                          </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                          <Button size="sm" variant="primary" className="w-100">
                                                <i className="bi bi-search me-1"></i>Search
                                          </Button>
                                    </Col>
                              </Row>
                        </Form>
                  </div>

                  {/* ---------- SUMMARY SECTION ---------- */}
                  <div className="border rounded p-3 mb-4">
                        <Row className="text-center small fw-semibold">
                              <Col md={3} sm={6}>
                                    <div>Total Employees: <span className="text-dark fw-bold">25</span></div>
                              </Col>
                              <Col md={3} sm={6}>
                                    <div>Total Present: <span className="text-success fw-bold">22</span></div>
                              </Col>
                              <Col md={3} sm={6}>
                                    <div>Total Absent: <span className="text-danger fw-bold">3</span></div>
                              </Col>
                              <Col md={3} sm={6}>
                                    <div>Attendance %: <span className="text-warning fw-bold">88%</span></div>
                              </Col>
                        </Row>
                  </div>

                  {/* ---------- ATTENDANCE TABLE ---------- */}
                  <div className="border rounded p-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="fw-semibold mb-0">
                                    Project: <span className="text-dark">Project Alpha</span>
                              </h6>
                              <small className="text-muted">06 Nov 2025</small>
                        </div>

                        <div className="table-responsive">
                              <Table bordered hover size="sm" className="align-middle text-center mb-0">
                                    <thead className="table-light">
                                          <tr>
                                                <th>#</th>
                                                <th>Employee Name</th>
                                                <th>Employee ID</th>
                                                <th>Role</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Check In</th>
                                                <th>Check Out</th>
                                                <th>Total Hours</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          <tr>
                                                <td>1</td>
                                                <td>Rahul Sharma</td>
                                                <td>EMP001</td>
                                                <td>Engineer</td>
                                                <td>06/11/2025</td>
                                                <td><span className="badge bg-success">Present</span></td>
                                                <td>09:00 AM</td>
                                                <td>06:15 PM</td>
                                                <td>9h 15m</td>
                                          </tr>
                                          <tr>
                                                <td>2</td>
                                                <td>Anjali Mehta</td>
                                                <td>EMP002</td>
                                                <td>Supervisor</td>
                                                <td>06/11/2025</td>
                                                <td><span className="badge bg-danger">Absent</span></td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                          </tr>
                                          <tr>
                                                <td>3</td>
                                                <td>Rohit Verma</td>
                                                <td>EMP003</td>
                                                <td>Technician</td>
                                                <td>06/11/2025</td>
                                                <td><span className="badge bg-success">Present</span></td>
                                                <td>09:15 AM</td>
                                                <td>05:45 PM</td>
                                                <td>8h 30m</td>
                                          </tr>
                                    </tbody>
                              </Table>
                        </div>
                  </div>
            </div>
      );
};

export default ProjectWiseAttendanceReport;
