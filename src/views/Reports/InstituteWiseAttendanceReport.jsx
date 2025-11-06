import React from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";

const InstituteWiseAttendanceReport = () => {
      return (
            <div className="container-fluid py-4">
                  {/* ---------- PAGE HEADER ---------- */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold text-primary mb-0">Institute-wise Attendance Report</h5>
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
                                                <Form.Label className="fw-semibold small mb-1">Institute Name</Form.Label>
                                                <Form.Select size="sm">
                                                      <option>Select Institute</option>
                                                      <option>Techno Institute</option>
                                                      <option>SkillUp Academy</option>
                                                      <option>Global Engineering College</option>
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
                                    <div>Total Employee: <span className="text-dark fw-bold">150</span></div>
                              </Col>
                              <Col md={3} sm={6}>
                                    <div>Total Present: <span className="text-success fw-bold">132</span></div>
                              </Col>
                              <Col md={3} sm={6}>
                                    <div>Total Absent: <span className="text-danger fw-bold">18</span></div>
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
                                    Institute: <span className="text-dark">Techno Institute</span>
                              </h6>
                              <small className="text-muted">06 Nov 2025</small>
                        </div>

                        <div className="table-responsive">
                              <Table bordered hover size="sm" className="align-middle text-center mb-0">
                                    <thead className="table-light">
                                          <tr>
                                                <th>#</th>
                                                <th>Student Name</th>
                                                <th>Roll No</th>
                                                <th>Department</th>
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
                                                <td>Ravi Patel</td>
                                                <td>STU101</td>
                                                <td>Computer Science</td>
                                                <td>06/11/2025</td>
                                                <td><span className="badge bg-success">Present</span></td>
                                                <td>09:05 AM</td>
                                                <td>04:55 PM</td>
                                                <td>7h 50m</td>
                                          </tr>
                                          <tr>
                                                <td>2</td>
                                                <td>Pooja Singh</td>
                                                <td>STU102</td>
                                                <td>Electrical</td>
                                                <td>06/11/2025</td>
                                                <td><span className="badge bg-danger">Absent</span></td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                          </tr>
                                          <tr>
                                                <td>3</td>
                                                <td>Arjun Mehta</td>
                                                <td>STU103</td>
                                                <td>Mechanical</td>
                                                <td>06/11/2025</td>
                                                <td><span className="badge bg-success">Present</span></td>
                                                <td>09:10 AM</td>
                                                <td>05:10 PM</td>
                                                <td>8h 00m</td>
                                          </tr>
                                    </tbody>
                              </Table>
                        </div>
                  </div>
            </div>
      );
};

export default InstituteWiseAttendanceReport;
