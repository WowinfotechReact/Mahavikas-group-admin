import React, { useContext, useEffect, useState } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { saveAs } from "file-saver";
import Select from 'react-select';
import * as XLSX from "xlsx";

import dayjs from "dayjs";
import { GetInstituteLookupList } from "services/Institute/InstituteApi";
import { GetProjectLookupList } from "services/Project/ProjectApi";
import { ConfigContext } from "context/ConfigContext";
import { AddUpdateAttendanceSheet, GetAttendanceReportList } from "services/Attendance/AttendanceApi";
import { Link } from "react-router-dom";
const InstituteWiseAttendanceReport = () => {
      const [projectOption, setProjectOption] = useState([]);
      const { setLoader, companyID, user } = useContext(ConfigContext);
      const [instituteOption, setInstituteOption] = useState([]);
      const [productListData, setProductListData] = useState([])
      const [productListSummaryData, setProductListSummaryData] = useState([])
      console.log(productListData, '32dddddddddd');



      const [instituteObj, setInstituteObj] = useState({
            projectIDs: null,
            instituteID: null,
            year: null,
            month: null,
      })
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

      const [monthDateState, setMonthDateState] = useState(null);

      const monthOptions = [
            { value: 1, label: "January" },
            { value: 2, label: "February" },
            { value: 3, label: "March" },
            { value: 4, label: "April" },
            { value: 5, label: "May" },
            { value: 6, label: "June" },
            { value: 7, label: "July" },
            { value: 8, label: "August" },
            { value: 9, label: "September" },
            { value: 10, label: "October" },
            { value: 11, label: "November" },
            { value: 12, label: "December" }
      ];


      useEffect(() => {
            GetInstituteLookupListData()
      }, [])



      useEffect(() => {
            const { projectIDs, instituteID, year, month } = instituteObj;
            const monthDate = buildMonthDate(year, month);

            setMonthDateState(monthDate); // store globally

            if (projectIDs && instituteID && year && month) {
                  GetAttendanceReportListData({
                        projectID: projectIDs,
                        instituteID,
                        monthDate
                  });
            }
      }, [instituteObj]);

      const exportAttendanceExcel = (productListData, monthDate) => {
            debugger
            if (!productListData || productListData.length === 0) {
                  alert("No data to export");
                  return;
            }

            const daysInMonth = dayjs(monthDate).daysInMonth();

            // ✅ Build Headers
            const headers = [
                  "Sr No.",
                  "Employee Name",
                  "Designation",
                  "Download URL",
                  ...Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`),
                  "Total P",
                  "Total A",
                  "Total W"
            ];

            // ✅ Build Rows
            const rows = productListData.map((row, index) => [
                  index + 1,
                  row.name,
                  row.designation,
                  ...row.days,
                  row.totalP,
                  row.totalA,
                  row.totalW
            ]);

            // ✅ Create Excel Sheet
            const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

            // ✅ File name: Attendance_MMM_YYYY.xlsx
            const fileName = `Attendance_${dayjs(monthDate).format("MMM_YYYY")}.xlsx`;

            XLSX.writeFile(workbook, fileName);
      };
      useEffect(() => {
            GetProjectLookupListData(companyID)
      }, [])
      const yearOptions = Array.from({ length: 11 }, (_, i) => {
            const year = 2020 + i;
            return { value: year, label: year.toString() };
      });

      const GetProjectLookupListData = async (companyID) => {

            try {
                  const response = await GetProjectLookupList(null, companyID);

                  if (response?.data?.statusCode === 200) {
                        const list = response?.data?.responseData?.data || [];

                        // 🔥 Remove duplicate projectID
                        const unique = [
                              ...new Map(list.map(item => [item.projectID, item])).values()
                        ];

                        const formatted = unique.map((p) => ({
                              value: p.projectID,
                              label: p.projectName
                        }));

                        setProjectOption(formatted);
                  } else {
                        console.error("Failed to fetch project list");
                  }
            } catch (error) {
                  console.error("Error fetching project lookup list:", error);
            }
      };
      const GetInstituteLookupListData = async (projectID) => {
            setLoader(true);

            try {
                  let url = '/GetInstituteLookupList';

                  const response = await GetInstituteLookupList(url, {
                        projectID: projectID
                  });

                  if (response?.data?.statusCode === 200) {
                        setLoader(false);

                        const list = response.data.responseData.data;

                        const formatted = list.map(item => ({
                              value: item.instituteID,
                              label: item.instituteName
                        }));

                        setInstituteOption(formatted);

                  } else {
                        setLoader(false);
                        setErrorMessage(response?.response?.data?.errorMessage);
                  }
            } catch (error) {
                  setLoader(false);
                  console.error(error);
            }
      };



      const handleProjectChange = (selectedOption) => {
            const projectID = selectedOption ? selectedOption.value : "";

            setInstituteObj((prev) => ({
                  ...prev,
                  projectIDs: projectID,
            }));

            // Call API here if needed
            if (projectID) {
                  GetInstituteLookupListData(projectID);
            }
      };



      const GetAttendanceReportListData = async ({ projectID, instituteID, monthDate }) => {
            setLoader(true);

            try {
                  const data = await GetAttendanceReportList({ projectID, instituteID, monthDate });

                  if (data?.data?.statusCode === 200) {
                        setLoader(false);

                        const ProductData = data.data.responseData.data;
                        const ProductSummaryData = data.data.responseData.summary;

                        const transformed = transformAttendanceData(
                              ProductSummaryData,
                              ProductData,
                              monthDate
                        );

                        setProductListData(transformed); // ✅ One row per employee
                  } else {
                        setLoader(false);
                  }
            } catch (error) {
                  setLoader(false);
            }
      };



      const buildMonthDate = (year, month) => {
            if (!year || !month) return null;

            const mm = month.toString().padStart(2, "0");
            return `${year}-${mm}-01`;
      };


      useEffect(() => {
            const { projectIDs, instituteID, year, month } = instituteObj;

            // If all values selected
            if (projectIDs && instituteID && year && month) {
                  const monthDate = buildMonthDate(year, month);

                  GetAttendanceReportListData({
                        projectID: projectIDs,
                        instituteID: instituteID,
                        monthDate: monthDate
                  });
            }
      }, [instituteObj.projectIDs, instituteObj.instituteID, instituteObj.year, instituteObj.month]);

      const clearBtn = () => {
            // Clear dropdown values
            setInstituteObj({
                  projectIDs: null,
                  instituteID: null,
                  year: null,
                  month: null,
            });

            // Clear dropdown options
            setProjectOption([]);
            setInstituteOption([]);

            // Clear table data
            setProductListData([]);
            setTotalCount(0);
            setTotalPage(0);

            console.log("All filters cleared!");
      };






      const transformAttendanceData = (summaryList, attendanceList, monthDate) => {
            const daysInMonth = dayjs(monthDate).daysInMonth();
            const grouped = {};

            // STEP 1: Initialize each employee from SUMMARY
            summaryList.forEach((emp) => {
                  grouped[emp.empUserID] = {
                        empUserID: emp.empUserID,
                        name: `${emp.firstName} ${emp.lastName}`,
                        designation: emp.designationName,
                        days: Array(daysInMonth).fill("-"),
                        downloadURL: emp.downloadURL || null,

                        // ✅ Init totals
                        totalP: 0,
                        totalA: 0,
                        totalW: 0
                  };
            });

            // STEP 2: Fill day-wise values using attendanceList
            attendanceList.forEach((item) => {
                  const empID = item.empUserID;
                  const day = dayjs(item.attendanceDate).date();

                  if (grouped[empID]) {
                        let status = "-";

                        if (item.attendanceStatusID === 1) status = "P"; // Present
                        if (item.attendanceStatusID === 2) status = "A"; // Absent
                        if (item.attendanceStatusID === 3) status = "W"; // Weekly Off

                        grouped[empID].days[day - 1] = status;
                  }
            });

            // ✅ STEP 3: Calculate totals
            Object.values(grouped).forEach((emp) => {
                  emp.totalP = emp.days.filter(d => d === "P").length;
                  emp.totalA = emp.days.filter(d => d === "A").length;
                  emp.totalW = emp.days.filter(d => d === "W").length;
            });

            return Object.values(grouped);
      };



      return (
            <div className="container-fluid py-4">
                  {/* ---------- PAGE HEADER ---------- */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold text-primary mb-0">Institute-wise Attendance Report</h5>

                  </div>


                  {/* ---------- FILTER SECTION ---------- */}
                  <div className="border rounded p-2 bg-light mb-4">

                        <Form>
                              <Row className="g-1 align-items-end">
                                    <Col md={3}>
                                          <Form.Group>
                                                <Select
                                                      options={projectOption}
                                                      value={projectOption.find(item =>
                                                            instituteObj.projectIDs === item.value
                                                      )}
                                                      styles={{
                                                            menuPortal: base => ({ ...base, zIndex: 9999 }), // ensures it appears on top
                                                      }}
                                                      placeholder="Select Project"
                                                      onChange={handleProjectChange}
                                                      menuPosition="fixed"
                                                />

                                          </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                          <Form.Group>
                                                <Select
                                                      options={instituteOption}
                                                      value={instituteOption.find(
                                                            (x) => x.value === instituteObj.instituteID
                                                      )}
                                                      placeholder="Select Institute"
                                                      onChange={(selected) =>
                                                            setInstituteObj(prev => ({
                                                                  ...prev,
                                                                  instituteID: selected ? selected.value : ""
                                                            }))
                                                      }
                                                      styles={{
                                                            menuPortal: base => ({ ...base, zIndex: 9999 }), // ensures it appears on top
                                                      }}
                                                      menuPosition="fixed"
                                                />
                                          </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                          <Form.Group>
                                                <Form.Label className="fw-semibold small mb-1">Select Year</Form.Label>
                                                <Select
                                                      options={yearOptions}
                                                      value={yearOptions.find(item => item.value === instituteObj.year)}
                                                      placeholder="Select Year"
                                                      onChange={(selected) =>
                                                            setInstituteObj(prev => ({
                                                                  ...prev,
                                                                  year: selected ? selected.value : null
                                                            }))
                                                      }
                                                      styles={{
                                                            menuPortal: base => ({ ...base, zIndex: 9999 }), // ensures it appears on top
                                                      }}
                                                      menuPosition="fixed"
                                                />
                                          </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                          <Form.Group>
                                                <Form.Label className="fw-semibold small mb-1">Select Month</Form.Label>
                                                <Select
                                                      options={monthOptions}
                                                      value={monthOptions.find(item => item.value === instituteObj.month)}
                                                      placeholder="Select Month"
                                                      onChange={(selected) =>
                                                            setInstituteObj(prev => ({
                                                                  ...prev,
                                                                  month: selected ? selected.value : null
                                                            }))
                                                      }
                                                      styles={{
                                                            menuPortal: base => ({ ...base, zIndex: 9999 }), // ensures it appears on top
                                                      }}
                                                      menuPosition="fixed"
                                                />

                                          </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                          <Button onClick={() => exportAttendanceExcel(productListData, monthDateState)}
                                                size="sm" variant="primary" className="w-100">
                                                <i className="bi bi-download me-1"></i>Export
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
                                    {/* Institute: <span className="text-dark"></span> */}
                              </h6>
                              {/* <small className="text-muted">06 Nov 2025</small> */}
                        </div>
                        <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
                              <table className="table table-bordered table-striped">
                                    <thead className="table-gradient-orange" style={{ position: 'sticky', top: 0, zIndex: 10, color: '#fff', }}>


                                          <tr>
                                                <th>Sr No.</th>
                                                <th>Employee Name</th>
                                                <th>Designation</th>


                                                {/* ✅ Dynamic Date Columns */}
                                                {productListData?.length > 0 &&
                                                      productListData[0].days.map((_, i) => (
                                                            <th key={i}>{i + 1}</th>
                                                      ))}

                                                {/* ✅ Totals at END with colors */}
                                                <th className="text-center" style={{ backgroundColor: "#28a745", color: "white" }}>Total (P)</th>
                                                <th className="text-center" style={{ backgroundColor: "#dc3545", color: "white" }}>Total (A)</th>
                                                <th className="text-center" style={{ backgroundColor: "#ffc107", color: "white" }}>Total (W)</th>
                                                <th>Action</th>
                                          </tr>
                                    </thead>

                                    <tbody>
                                          {productListData && productListData.length > 0 ? (
                                                productListData.map((row, index) => (
                                                      <tr key={row.empUserID}>
                                                            <td>{index + 1}</td>
                                                            <td>{row.name}</td>
                                                            <td>{row.designation}</td>

                                                            {/* Action */}


                                                            {/* ✅ Day-wise Attendance */}
                                                            {row.days.map((status, i) => {
                                                                  let bg = "";
                                                                  if (status === "P") bg = "#023020";    // light green
                                                                  if (status === "A") bg = "#cc3333";    // light red
                                                                  if (status === "W") bg = "#422afb";    // light yellow

                                                                  return (
                                                                        <td key={i} style={{ color: bg }}>
                                                                              {status}
                                                                        </td>
                                                                  );
                                                            })}

                                                            {/* ✅ Totals at END */}

                                                            <td>{row.totalP}</td>
                                                            <td>{row.totalA}</td>
                                                            <td>{row.totalW}</td>
                                                            <td>
                                                                  {row.downloadURL ? (
                                                                        <a href={row.downloadURL} target="_blank" rel="noopener noreferrer">
                                                                              Download
                                                                        </a>
                                                                  ) : "-"}
                                                            </td>
                                                      </tr>
                                                ))
                                          ) : (
                                                <tr>
                                                      <td colSpan="40" className="text-center text-muted">
                                                            No Attendance Found
                                                      </td>
                                                </tr>
                                          )}
                                    </tbody>
                              </table>



                        </div>
                  </div>
            </div>
      );
};

export default InstituteWiseAttendanceReport;
