import React, { useContext, useEffect, useState } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Select from 'react-select';

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
                  const data = await GetAttendanceReportList({
                        projectID,
                        instituteID,
                        monthDate
                  });

                  if (data?.data?.statusCode === 200) {
                        setLoader(false);

                        const ProductData = data.data.responseData.data;

                        setProductListData(ProductData);


                  } else {
                        setLoader(false);
                        console.error(data?.data?.errorMessage);
                  }
            } catch (error) {
                  setLoader(false);
                  console.error(error);
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


      const downloadBtn = async (row) => {
            debugger
            const apiParam = {
                  empUserID: row.empUserID,
                  projectID: row.projectID,
                  instituteID: row.instituteID,
                  monthDate: monthDateState,
                  uploadURL: row.uploadURL,
                  actionType: 'Download',
                  userKeyID: user.userKeyID
            }

            AddUpdateAppUserData(apiParam)

      }


      const AddUpdateAppUserData = async (apiParam) => {
            setLoader(true);
            try {
                  let url = '/AddUpdateAttendanceSheet ';
                  const response = await AddUpdateAttendanceSheet(url, apiParam);

                  if (response?.data?.statusCode === 200) {
                        setLoader(false);

                        const downloadURL = response.data.responseData.downloadURL;
                        console.log(downloadURL, "PDF URL");

                        // OPEN ONLY IN NEW TAB
                        if (downloadURL) {
                              window.open(downloadURL, '_blank', 'noopener,noreferrer');
                        }

                        setIsAddUpdateActionDone(true);
                  } else {
                        setLoader(false);
                        setErrorMessage(response?.response?.data?.errorMessage);
                  }
            } catch (error) {
                  setLoader(false);
                  console.error(error);
            }
      };

      return (
            <div className="container-fluid py-4">
                  {/* ---------- PAGE HEADER ---------- */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold text-primary mb-0">Institute-wise Attendance Report</h5>

                  </div>

                  {/* ---------- FILTER SECTION ---------- */}
                  <div className="border rounded p-3 bg-light mb-4">
                        <Form>
                              <Row className="g-3 align-items-end">
                                    <Col md={3}>
                                          <Form.Group>
                                                <Select
                                                      options={projectOption}
                                                      value={projectOption.find(item =>
                                                            instituteObj.projectIDs === item.value
                                                      )}
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
                                                      menuPosition="fixed"
                                                />
                                          </Form.Group>
                                    </Col>
                                    <Col md={3}>
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
                                                      menuPosition="fixed"
                                                />
                                          </Form.Group>
                                    </Col>
                                    <Col md={3}>
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
                                                      menuPosition="fixed"
                                                />

                                          </Form.Group>
                                    </Col>
                                    {/* <Col md={2}>
                                          <Button onClick={clearBtn} size="sm" variant="primary" className="w-100">
                                                <i className="bi bi-search me-1"></i>Search
                                          </Button>
                                    </Col> */}
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

                        <div className="table-responsive">
                              <Table bordered hover size="sm" className="align-middle text-center mb-0">
                                    <thead>
                                          <tr className="text-center">
                                                <th>Sr No.</th>
                                                <th>Date</th>
                                                <th>Employee Name</th>
                                                <th>Designation</th>
                                                <th>Working Hours</th>
                                                <th>Action</th>
                                          </tr>
                                    </thead>

                                    <tbody>
                                          {productListData && productListData.length > 0 ? (
                                                productListData.map((row, index) => (
                                                      <tr key={index}>
                                                            <td className="text-center">{index + 1}</td>

                                                            {/* Format date */}
                                                            <td className="text-center">
                                                                  {dayjs(row.attendanceDate).format("DD-MM-YYYY")}
                                                            </td>

                                                            {/* Name */}
                                                            <td>
                                                                  {row.firstName} {row.lastName}
                                                            </td>

                                                            {/* Designation */}
                                                            <td>{row.designationName || "-"}</td>

                                                            {/* Status */}


                                                            {/* Working Hours */}
                                                            <td className="text-center">
                                                                  {row.workingHours || "-"}
                                                            </td>
                                                            <td className="text-center">
                                                                  <Link onClick={() => downloadBtn(row)}>Download</Link>
                                                            </td>
                                                      </tr>
                                                ))
                                          ) : (
                                                <tr>
                                                      <td colSpan="6" className="text-center text-muted">
                                                            No Attendance Found
                                                      </td>
                                                </tr>
                                          )}
                                    </tbody>
                              </Table>
                        </div>
                  </div>
            </div>
      );
};

export default InstituteWiseAttendanceReport;
