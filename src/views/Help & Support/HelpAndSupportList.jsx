
import React, { useContext, useEffect, useState } from "react";
// import ReplyModal from "./ReplyModal";
import Select from 'react-select';

import DatePicker from 'react-date-picker';
import HelpAndSupportModal from "./HelpAndSupportModal";
import { Link, useNavigate } from "react-router-dom";
import { GetCustomerSupportList } from "services/Customer Support/CustomerSupportApi";
import { ConfigContext } from "context/ConfigContext";
import { Tooltip } from "@mui/material";
import NoResultFoundModel from "component/NoResultFoundModal";
import dayjs from "dayjs";
import { Col, Form, Row } from "react-bootstrap";

const HelpAndSupportList = () => {

      const [totalRecords, setTotalRecords] = useState(-1);
      const { setLoader, user, companyID, permissions } = useContext(ConfigContext);
      const [totalPage, setTotalPage] = useState();
      const [totalCount, setTotalCount] = useState(null);
      const [pageSize, setPageSize] = useState(30);
      const [vehicleListData, setMachineListData] = useState();
      const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
      const [searchKeyword, setSearchKeyword] = useState('');
      const [fromDate, setFromDate] = useState(null); // Initialize as null
      const [toDate, setToDate] = useState(null);


      const [modelRequestData, setModelRequestData] = useState({
            adminID: null,
            machineID: null,
            machineName: null,
            price: null,
            Action: null,
            supportKeyID: null,
            quetion: null,
      });
      const [queries, setQueries] = useState([
            {
                  id: 1,
                  ticketNo: "TCK-101",
                  employeeName: "Rahul Patil",
                  query: "Unable to login to the system",
                  queryDate: "10-Dec-2025",
                  reply: "",
                  replyDate: "",
            },
            {
                  id: 2,
                  ticketNo: "TCK-102",
                  employeeName: "Sneha Shirsath",
                  query: "Attendance not updating",
                  queryDate: "11-Dec-2025",
                  reply: "",
                  replyDate: "",
            },
            {
                  id: 3,
                  ticketNo: "TCK-103",
                  employeeName: "Amit Deshmukh",
                  query: "Project not assigned",
                  queryDate: "12-Dec-2025",
                  reply: "",
                  replyDate: "",
            },
      ]);
      const [showQueryModal, setShowQueryModal] = useState(false);
      const [selectedQuery, setSelectedQuery] = useState(null);

      const openReplyModal = (item) => {
            setModelRequestData({
                  ...modelRequestData,
                  supportKeyID: item.supportKeyID,
                  quetion: item.quetion,
                  supportID: item.supportID,
                  Action: null
            })

            // setSelectedQuery(query);
            setShowQueryModal(true);
      };
      const editReplyModal = (item) => {

            setModelRequestData({
                  ...modelRequestData,
                  supportKeyID: item.supportKeyID,
                  supportKeyID: item.supportKeyID,
                  quetion: item.quetion,
                  supportID: item.supportID,

                  Action: 'Update'
            })


            setShowQueryModal(true);
      };


      const submitReply = (replyText) => {
            const today = new Date().toLocaleDateString("en-GB");

            setQueries((prev) =>
                  prev.map((q) =>
                        q.id === selectedQuery.id
                              ? { ...q, reply: replyText, replyDate: today }
                              : q
                  )
            );
            setShowQueryModal(false);
            setSelectedQuery(null);
      }
      const handleToDateChange = (newValue) => {
            if (newValue && dayjs(newValue).isValid()) {
                  const newToDate = dayjs(newValue);
                  setToDate(newToDate);

                  if (fromDate && newToDate.isBefore(fromDate)) {
                        setFromDate(newToDate.subtract(1, 'day'));
                  }
                  GetCustomerSupportListData(1, null, fromDate, newToDate);

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
                  GetCustomerSupportListData(1, null, newFromDate, toDate);

            } else {
                  setFromDate(null);
            }
      };
      useEffect(() => {
            GetCustomerSupportListData(1, null, toDate, fromDate)
      }, [])
      useEffect(() => {
            if (isAddUpdateActionDone) {

                  GetCustomerSupportListData(1, null, toDate, fromDate)
            }
            setIsAddUpdateActionDone(false);
      }, [isAddUpdateActionDone])

      const [selectedOption, setSelectedOption] = useState("");

      const GetCustomerSupportListData = async (pageNumber, searchKeywordValue, toDate, fromDate) => {
            // debugger
            setLoader(true);
            try {
                  const data = await GetCustomerSupportList({
                        pageSize,
                        userKeyID: user.userKeyID,
                        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
                        searchKeyword: searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
                        toDate: toDate ? dayjs(toDate)?.format('YYYY-MM-DD') : null,
                        fromDate: fromDate ? dayjs(fromDate)?.format('YYYY-MM-DD') : null,
                        instituteID: location?.state?.instituteKeyID,
                        companyID: Number(companyID),
                        // user

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
                                    setMachineListData(vehicleListData);
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
      const updateBtnClick = (item) => {
            setModelRequestData({
                  ...modelRequestData,
                  supportKeyID: item.supportKeyID,
                  quetion: item.quetion,
                  quetionDate: item.quetionDate,
                  answer: item.answer,
                  answerDate: item.answerDate,
                  Action: "Update",
            });
            setShowQueryModal(true);
      };
      const clearDate = () => {
            setToDate(null)
            setFromDate(null)
            GetCustomerSupportListData(1, null, null, null);
      }

      return (
            <div className="card">
                  <div className="card-body">

                        <div className="container-fluid py-4">
                              <h5 className="tracking-in-contract mb-1">Help & Support</h5>

                              <div className="border rounded p-3 bg-light mb-2">
                                    <>
                                          <Row className="g-3 align-items-end">
                                                <Col md={3}>
                                                      <Form.Group>
                                                            <Form.Label className="fw-semibold small mb-1">Select User Role</Form.Label>

                                                            <input type="text" className="form-control" placeholder="Search " />
                                                      </Form.Group>
                                                </Col>
                                                <Col md={3}>
                                                      <Form.Group>
                                                            <Form.Label className="fw-semibold small mb-1">Select User Role</Form.Label>

                                                            <Select placeholder='Select ' />
                                                      </Form.Group>
                                                </Col>
                                                <Col md={2}>
                                                      <Form.Group>
                                                            <Form.Label className="fw-semibold small mb-1">From Date</Form.Label>
                                                            <DatePicker
                                                                  value={fromDate ? fromDate.toDate() : null}
                                                                  onChange={(date) => {
                                                                        handleFromDateChange(dayjs(date));
                                                                  }}
                                                                  format="dd/MM/y"
                                                                  clearIcon={null}
                                                                  className='text-nowrap'
                                                            />


                                                      </Form.Group>
                                                </Col>
                                                <Col md={2}>
                                                      <Form.Group>
                                                            <Form.Label className="fw-semibold small mb-1">To Date</Form.Label>

                                                            <DatePicker
                                                                  value={toDate ? toDate.toDate() : null}
                                                                  onChange={(date) => {
                                                                        handleToDateChange(dayjs(date));
                                                                  }}
                                                                  clearIcon={null}
                                                                  className='text-nowrap'

                                                                  format="dd/MM/y"
                                                            />


                                                      </Form.Group>
                                                </Col>
                                                <Col md={2}>
                                                      <button onClick={() => clearDate()} style={{ background: '#ffaa33', color: 'white' }} className="btn   d-none d-sm-inline">
                                                            Clear
                                                      </button>

                                                </Col>
                                          </Row>
                                    </>
                              </div>

                              <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto', position: 'relative' }}>
                                    <table className="table table-bordered table-striped">
                                          <thead className="table-gradient-orange" style={{ position: 'sticky', top: 0, zIndex: 10, color: '#fff', }}>
                                                <tr>
                                                      <th>Ticket No</th>
                                                      <th>Employee Name</th>
                                                      <th>Query</th>
                                                      <th>Query Date</th>
                                                      <th>Query Answered</th>
                                                </tr>
                                          </thead>

                                          <tbody>
                                                {vehicleListData?.map((item) => (
                                                      <tr key={item.id}>
                                                            <td>#{item.supportID || "-"}</td>
                                                            <td>{item?.empName || "-"}</td>

                                                            {/* QUERY + REPLY DISPLAY */}
                                                            <td>
                                                                  <div className="fw-semibold">{item.quetion}</div>

                                                                  {item.answer && (
                                                                        <div className="mt-2 p-2 border rounded bg-light">
                                                                              <div className="text-success fw-semibold">
                                                                                    Admin Reply:
                                                                              </div>
                                                                              <div>{item.answer}</div>
                                                                              <div className="text-muted small">
                                                                                    Replied on:  <span onClick={() => updateBtnClick(item)}></span> {item.quetionDate}
                                                                              </div>
                                                                        </div>
                                                                  )}
                                                            </td>

                                                            <td>{item.quetionDate}</td>

                                                            <td>
                                                                  {item.answer ? (
                                                                        <Tooltip title='Edit your Answer'>

                                                                              <span style={{ cursor: 'pointer' }} onClick={() => editReplyModal(item)} className="badge bg-success">Replied</span>
                                                                        </Tooltip>
                                                                  ) : (
                                                                        <Tooltip title='Add Answer'>

                                                                              <span
                                                                                    style={{ color: 'blue', cursor: 'pointer' }}
                                                                                    // className="btn btn-sm btn-outline-primary"
                                                                                    onClick={() => openReplyModal(item)}
                                                                              >
                                                                                    No Reply Yet
                                                                              </span>
                                                                        </Tooltip>
                                                                  )}
                                                            </td>
                                                      </tr>
                                                ))}
                                          </tbody>
                                    </table>
                              </div>
                              {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}

                              {showQueryModal &&
                                    <HelpAndSupportModal
                                          show={showQueryModal}
                                          onHide={() => setShowQueryModal(false)}
                                          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                                          selectedQuery={selectedQuery}
                                          modelRequestData={modelRequestData}
                                          onSubmit={submitReply}
                                    />
                              }
                        </div>
                  </div>
            </div>
      );
};

export default HelpAndSupportList;

