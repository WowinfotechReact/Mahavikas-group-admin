




import React from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

const SiteEngineerReport = () => {


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
      const attendanceData = [
            {
                  "#": 1,
                  "Employee Name": "Rahul Sharma",
                  "Mobile No": "9876543210",
                  "Punch In Time": "09:10 AM",
                  "Punch Out Time": "06:25 PM",
                  "Punch In Location": "Site A - Noida",
                  "Punch Out Location": "Site A - Noida",
                  Remarks: "On Time",
            },
            {
                  "#": 2,
                  "Employee Name": "Rohini",
                  "Mobile No": "9876501122",
                  "Punch In Time": "09:45 AM",
                  "Punch Out Time": "06:10 PM",
                  "Punch In Location": "Site B - Gurugram",
                  "Punch Out Location": "Site B - Gurugram",
                  Remarks: "Late Arrival",
            },
            {
                  "#": 3,
                  "Employee Name": "Ravi Kumar",
                  "Mobile No": "9812312121",
                  "Punch In Time": "08:55 AM",
                  "Punch Out Time": "06:30 PM",
                  "Punch In Location": "Site C - Delhi",
                  "Punch Out Location": "Site C - Delhi",
                  Remarks: "Excellent",
            },
      ];

      return (
            <div className="container-fluid py-4">
                  {/* ---------- PAGE HEADER ---------- */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold text-primary mb-0">Site Engineer Attendance Report</h5>
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
                                                <Form.Label className="fw-semibold small mb-1">Duration</Form.Label>
                                                <Form.Select size="sm">
                                                      <option>Select Report Duration</option>
                                                      <option>Daily</option>
                                                      <option>Weekly</option>
                                                      <option>Monthly</option>
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


                        <div className="table-responsive">
                              <Table bordered hover size="sm" className="align-middle text-center mb-0">
                                    <thead className="table-light">
                                          <tr className="text-center">
                                                <th>#</th>
                                                <th>Employee Name</th>
                                                <th>Mobile No</th>
                                                <th>Punch In Time</th>
                                                <th>Punch Out Time</th>
                                                <th>Punch In Location</th>
                                                <th>Punch Out Location</th>
                                                <th>Remarks</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          <tr>
                                                <td>1</td>
                                                <td>Rahul Sharma</td>
                                                <td>9876543210</td>
                                                <td>09:10 AM</td>
                                                <td>06:25 PM</td>
                                                <td>Site A - Noida</td>
                                                <td>Site A - Noida</td>
                                                <td>On Time</td>
                                          </tr>
                                          <tr>
                                                <td>2</td>
                                                <td>Rohini</td>
                                                <td>9876501122</td>
                                                <td>09:45 AM</td>
                                                <td>06:10 PM</td>
                                                <td>Site B - Gurugram</td>
                                                <td>Site B - Gurugram</td>
                                                <td>Late Arrival</td>
                                          </tr>
                                          <tr>
                                                <td>3</td>
                                                <td>Ravi Kumar</td>
                                                <td>9812312121</td>
                                                <td>08:55 AM</td>
                                                <td>06:30 PM</td>
                                                <td>Site C - Delhi</td>
                                                <td>Site C - Delhi</td>
                                                <td>Excellent</td>
                                          </tr>
                                    </tbody>
                              </Table>
                        </div>
                  </div>
            </div>
      );
};

export default SiteEngineerReport;
