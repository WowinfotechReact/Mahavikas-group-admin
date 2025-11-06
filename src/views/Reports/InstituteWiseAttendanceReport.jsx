import React from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
const InstituteWiseAttendanceReport = () => {

      const exportAttendanceJournal = (month = 0, year = 2025) => {
            // month: 0 for January, 1 for February, etc.

            const startDate = dayjs(`${year}-${month + 1}-01`);
            const endDate = startDate.endOf("month");

            const days = [];
            for (let d = startDate; d.isBefore(endDate) || d.isSame(endDate, "day"); d = d.add(1, "day")) {
                  const dayName = d.format("dddd");
                  let status = "";

                  if (dayName === "Sunday") {
                        status = "Week Off";
                  } else {
                        // Example random data (you can replace this with your real attendance logic)
                        status = Math.random() > 0.2 ? "P" : "A";
                  }

                  days.push({
                        Date: d.format("DD-MM-YYYY"),
                        Day: dayName,
                        Status: status,
                  });
            }

            // Create worksheet
            const worksheet = XLSX.utils.json_to_sheet(days);

            // Set column widths
            const wscols = [{ wch: 12 }, { wch: 12 }, { wch: 15 }];
            worksheet["!cols"] = wscols;

            // Create workbook and append sheet
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, `${startDate.format("MMMM")}`);

            // Export Excel file
            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
            saveAs(blob, `Attendance_Journal_${startDate.format("MMMM_YYYY")}.xlsx`);
      };
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
                                          <tr className="text-center">
                                                <th className="text-center">#</th>
                                                <th className="text-center">Employee Name</th>
                                                <th className="text-center">Employee ID</th>
                                                <th className="text-center">Role</th>

                                                <th className="text-center">Present</th>
                                                <th className="text-center">Absent</th>
                                                <th className="text-center">Weekly Off</th>
                                                <th className="text-center">Action</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          <tr className="text-center">
                                                <td className="text-center">1</td>
                                                <td className="text-center">Omkar Sharma</td>
                                                <td className="text-center">EMP001</td>
                                                <td className="text-center">PT Professor</td>
                                                <td className="text-center">26</td>
                                                <td className="text-center">0</td>
                                                <td className="text-center">4</td>
                                                <td className="text-center" style={{ cursor: 'pointer', color: 'blue' }} onClick={() => exportAttendanceJournal(0, 2025)}>Download</td>

                                          </tr>
                                          <tr className="text-center">
                                                <td className="text-center">2</td>
                                                <td className="text-center">Shubham Shewale</td>
                                                <td className="text-center">EMP002</td>
                                                <td className="text-center">Dot Net</td>
                                                <td className="text-center">19</td>
                                                <td className="text-center">8</td>
                                                <td className="text-center">4</td>
                                                <td className="text-center" style={{ cursor: 'pointer', color: 'blue' }} onClick={() => exportAttendanceJournal(0, 2025)}>Download</td>

                                          </tr>

                                    </tbody>
                              </Table>
                        </div>
                  </div>
            </div>
      );
};

export default InstituteWiseAttendanceReport;
