





import React, { useContext, useEffect, useState } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import DatePicker from 'react-date-picker';
import Select from 'react-select';

import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { GetMvgEmployeeReportList } from "services/MVG Employee/MVGEmployeeApi";
import { ConfigContext } from "context/ConfigContext";
import { useNavigate } from "react-router";
import PaginationComponent from "component/Pagination";
import NoResultFoundModel from "component/NoResultFoundModal";

const MvgEmployeeReportList = () => {
      const [searchKeyword, setSearchKeyword] = useState('');

      const { setLoader, user, companyID, permissions } = useContext(ConfigContext);
      const [mvgEmployeeData, setMvgEmployeeData] = useState([])
      const [fromDate, setFromDate] = useState(null);
      const [toDate, setToDate] = useState(null);
      const [totalRecords, setTotalRecords] = useState(-1);
      const [checkInLocation, setCheckInLocation] = useState("Loading...");
      const [checkOutLocation, setCheckOutLocation] = useState("Loading...");
      const [modelAction, setModelAction] = useState();
      const navigate = useNavigate();
      const [checkInLocations, setCheckInLocations] = useState([]);
      const [checkOutLocations, setCheckOutLocations] = useState([]);
      const [currentPage, setCurrentPage] = useState(1);
      const [totalPage, setTotalPage] = useState();
      const [totalCount, setTotalCount] = useState(null);
      const [pageSize, setPageSize] = useState(30);
      const [mvg, setMvg] = useState({
            fromDate: null,
            toDate: null,
            duration: null
      });

      const handleToDateChange = (newValue) => {
            if (newValue && dayjs(newValue).isValid()) {
                  const newToDate = dayjs(newValue);
                  setToDate(newToDate);

                  if (fromDate && newToDate.isBefore(fromDate)) {
                        setFromDate(newToDate.subtract(1, 'day'));
                  }
                  GetMvgEmployeeReportListData(1, null, fromDate, newToDate);

            } else {
                  setToDate(null);
            }
      };

      const handleFromDateChange = (newValue) => {
            debugger
            if (newValue && dayjs(newValue).isValid()) {
                  const newFromDate = dayjs(newValue);
                  setFromDate(newFromDate);

                  if (toDate && newFromDate.isAfter(toDate)) {
                        setToDate(newFromDate.add(1, 'day'));
                  } // Fixed: Pass fromDate first, then toDate to DashboardCountData
                  // DashboardCountData();
                  GetMvgEmployeeReportListData(1, null, newFromDate, toDate);

            } else {
                  setFromDate(null);
            }
      };
      const handlePageChange = (pageNumber) => {
            setCurrentPage(pageNumber);
            GetMvgEmployeeReportListData(pageNumber, null, toDate, fromDate);
      };
      useEffect(() => {
            GetMvgEmployeeReportListData(1, null, toDate, fromDate);
      }, []);
      const GetMvgEmployeeReportListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
            // debugger
            setLoader(true);
            try {
                  const data = await GetMvgEmployeeReportList({
                        pageSize,
                        // userKeyID: user.userKeyID,
                        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
                        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
                        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
                        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                        companyID: companyID
                  });

                  if (data) {
                        if (data?.data?.statusCode === 200) {
                              setLoader(false);
                              if (data?.data?.responseData?.data) {
                                    const vehicleListData = data.data.responseData.data;
                                    const totalItems = data.data?.totalCount; // const totalItems = 44;
                                    setTotalCount(totalItems);
                                    const totalPages = Math.ceil(totalItems / pageSize);
                                    setTotalPage(totalPages);
                                    setTotalRecords(vehicleListData.length);
                                    setMvgEmployeeData(vehicleListData);
                              }
                        } else {
                              setErrorMessage(data?.data?.errorMessage);
                              setLoader(false);
                        }
                  }
            } catch (error) {
                  console.log(error);
                  setLoader(false);
            }
      };


      const getLocationName = async (lat, lng) => {
            try {
                  if (!lat || !lng) return "No Location";

                  const res = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyA5rVW7DkyryqQM-cDhsSrHb4soE2iXIJ8`
                  );


                  const data = await res.json();

                  if (data.status === "OK") {
                        return data.results[0].formatted_address;
                  }

                  return "Unknown Place";
            } catch (err) {
                  console.error("Geo Error:", err);
                  return "Unknown Place";
            }
      };

      useEffect(() => {
            const fetchLocations = async () => {
                  const checkInArray = [];
                  const checkOutArray = [];

                  for (let i = 0; i < mvgEmployeeData.length; i++) {
                        const row = mvgEmployeeData[i];

                        const inLoc = await getLocationName(row.latitude, row.longitude);
                        const outLoc = await getLocationName(row.checkOutLatitude, row.checkOutLongitude);

                        checkInArray.push(inLoc);
                        checkOutArray.push(outLoc);
                  }

                  setCheckInLocations(checkInArray);
                  setCheckOutLocations(checkOutArray);
            };

            fetchLocations();
      }, []);

      const splitDateTime = (raw) => {
            if (!raw) return { date: "-", time: "-" };

            let str = raw.trim();

            // remove double spaces
            str = str.replace(/\s+/g, " ");

            // add space before AM/PM if missing
            str = str.replace(/(AM|PM)$/i, " $1");

            const [date, time] = str.split(" ");

            return { date, time };
      };

      const clearDate = () => {
            setToDate(null)
            setFromDate(null)
            GetMvgEmployeeReportListData(1, null, null, null);

      }


      const handleSearch = (e) => {
            let searchKeywordValue = e.target.value;
            const trimmedValue = searchKeywordValue.replace(/^\s+/g, '');
            const capitalizedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1).toLowerCase();
            if (searchKeywordValue.length === 1 && searchKeywordValue.startsWith(' ')) {
                  searchKeywordValue = searchKeywordValue.trimStart();
                  return;
            }
            setSearchKeyword(capitalizedValue);
            setCurrentPage(1);
            GetMvgEmployeeReportListData(1, capitalizedValue, null, null);


      };


      const exportToExcel = () => {
            if (!mvgEmployeeData || mvgEmployeeData.length === 0) {
                  alert("No data to export");
                  return;
            }

            // Create Excel sheet rows
            const exportData = mvgEmployeeData.map((row, index) => ({
                  SrNo: index + 1,
                  FullName: row.fullName,
                  Mobile: row.mobileNo,
                  CheckInDate: row.checkInDateTime ? row.checkInDateTime.split(" ")[0] : "",
                  CheckInTime: row.checkInDateTime ? row.checkInDateTime.split(" ")[1] : "",
                  CheckOutDate: row.checkOutDateTime ? row.checkOutDateTime.split(" ")[0] : "",
                  CheckOutTime: row.checkOutDateTime ? row.checkOutDateTime.split(" ")[1] : "",
                  CheckInLocation: row.latitude + "," + row.longitude,
                  CheckOutLocation: row.checkOutLatitude + "," + row.checkOutLongitude,
                  Remarks: row.remarks
            }));

            // Create worksheet
            const worksheet = XLSX.utils.json_to_sheet(exportData);

            // Create workbook
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "MVG Report");

            // Convert to binary Excel
            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

            // Save Excel file
            const fileName = `MVG_Employee_Report_${new Date().getTime()}.xlsx`;
            saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
      };


      return (
            <div className="container-fluid py-4">
                  {/* ---------- PAGE HEADER ---------- */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold text-primary mb-0">Employee Attendance Report</h5>
                        <Button onClick={() => exportToExcel()} variant="success" size="sm">
                              <i className="bi bi-file-earmark-excel me-1"></i>Export
                        </Button>
                  </div>

                  {/* ---------- FILTER SECTION ---------- */}
                  <div className="border rounded p-3 bg-light mb-4">
                        <Form>
                              <Row className="g-3 align-items-end">
                                    <Col md={4}>
                                          <Form.Group>
                                                <Form.Label className="fw-semibold small mb-1">Search</Form.Label>

                                                <input
                                                      type="text"
                                                      className="form-control"
                                                      placeholder='Search'
                                                      style={{ maxWidth: '350px' }}
                                                      value={searchKeyword}
                                                      onChange={(e) => {
                                                            handleSearch(e);
                                                      }}
                                                />
                                          </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                          <Form.Group>
                                                <Form.Label className="fw-semibold small mb-1">From Date</Form.Label>
                                                <DatePicker
                                                      value={fromDate ? fromDate.toDate() : null}
                                                      onChange={(date) => {
                                                            handleFromDateChange(dayjs(date));
                                                      }}
                                                      format="dd/MM/y"
                                                      clearIcon={null}
                                                />


                                          </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                          <Form.Group>
                                                <Form.Label className="fw-semibold small mb-1">To Date</Form.Label>

                                                <DatePicker
                                                      value={toDate ? toDate.toDate() : null}
                                                      onChange={(date) => {
                                                            handleToDateChange(dayjs(date));
                                                      }}
                                                      clearIcon={null}

                                                      format="dd/MM/y"
                                                />


                                          </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                          <Button onClick={() => { clearDate() }}>Clear </Button>
                                    </Col>
                              </Row>
                        </Form>
                  </div>

                  {/* ---------- SUMMARY SECTION ---------- */}


                  {/* ---------- ATTENDANCE TABLE ---------- */}
                  <div className="border rounded p-3">


                        <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
                              <table className="table table-bordered table-striped">
                                    <thead className="table-gradient-orange" style={{ position: 'sticky', top: 0, zIndex: 10, color: '#fff', }}>
                                          <tr className="text-center">
                                                <th>#</th>
                                                <th>Employee Name</th>
                                                <th>Mobile No</th>
                                                <th>Punch In Time</th>
                                                <th>Punch In Date</th>
                                                <th>Punch Out Time</th>
                                                <th>Punch Out Date</th>
                                                <th>Punch In Location</th>
                                                <th>Punch Out Location</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {mvgEmployeeData.map((row, idx) => {
                                                const checkIn = splitDateTime(row.checkInDateTime);
                                                const checkOut = splitDateTime(row.checkOutDateTime);

                                                try {
                                                      return (
                                                            <tr key={idx} className="text-center">
                                                                  <td>

                                                                        {(currentPage - 1) * pageSize + idx + 1}
                                                                  </td>

                                                                  <td>{row.fullName}</td>
                                                                  <td>{row.mobileNo}</td>
                                                                  <td>{checkIn.time}</td>
                                                                  <td>{checkIn.date}</td>
                                                                  <td>{checkOut.time}</td>
                                                                  <td>{checkOut.date}</td>



                                                                  <td>{checkInLocations[idx] || "Loading..."}</td>

                                                                  <td>{checkOutLocations[idx] || "Loading..."}</td>

                                                            </tr>
                                                      );
                                                } catch (error) {
                                                      console.error("Error rendering row:", error);
                                                      return null; // or handle the error in a different way
                                                }
                                          })}
                                    </tbody>
                              </table>
                              {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}

                        </div>
                        <div className="d-flex justify-content-end ">
                              {totalCount > pageSize && (
                                    <PaginationComponent totalPages={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
                              )}
                        </div>
                  </div>
            </div>
      );
};

export default MvgEmployeeReportList;

