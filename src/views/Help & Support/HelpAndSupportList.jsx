
import React, { useState } from "react";
// import ReplyModal from "./ReplyModal";
import HelpAndSupportModal from "./HelpAndSupportModal";
import { Link } from "react-router-dom";

const HelpAndSupportList = () => {
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
      const [showModal, setShowModal] = useState(false);
      const [selectedQuery, setSelectedQuery] = useState(null);

      const openReplyModal = (query) => {
            setSelectedQuery(query);
            setShowModal(true);
      };
      const handleReplyClick = (query) => {
            setSelectedQuery(query);
            setShowModal(true);
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
            setShowModal(false);
            setSelectedQuery(null);
      }


      return (
            <div className="card w-full max-w-[50vh] mx-auto h-auto">
                  <div className="card-body p-2 bg-white shadow-md rounded-lg">
                        <div className="container mt-4">
                              <h5 className="mb-3">Employee Queries</h5>

                              <table className="table table-bordered table-hover">
                                    <thead className="table-light">
                                          <tr>
                                                <th>Ticket No</th>
                                                <th>Employee Name</th>
                                                <th>Query</th>
                                                <th>Query Date</th>
                                                <th>Query Answered</th>
                                          </tr>
                                    </thead>

                                    <tbody>
                                          {queries.map((item) => (
                                                <tr key={item.id}>
                                                      <td>{item.ticketNo}</td>
                                                      <td>{item.employeeName}</td>

                                                      {/* QUERY + REPLY DISPLAY */}
                                                      <td>
                                                            <div className="fw-semibold">{item.query}</div>

                                                            {item.reply && (
                                                                  <div className="mt-2 p-2 border rounded bg-light">
                                                                        <div className="text-success fw-semibold">
                                                                              Admin Reply:
                                                                        </div>
                                                                        <div>{item.reply}</div>
                                                                        <div className="text-muted small">
                                                                              Replied on: {item.replyDate}
                                                                        </div>
                                                                  </div>
                                                            )}
                                                      </td>

                                                      <td>{item.queryDate}</td>

                                                      <td>
                                                            {item.reply ? (
                                                                  <span className="badge bg-success">Replied</span>
                                                            ) : (
                                                                  <Link
                                                                        // className="btn btn-sm btn-outline-primary"
                                                                        onClick={() => openReplyModal(item)}
                                                                  >
                                                                        No Reply Yet
                                                                  </Link>
                                                            )}
                                                      </td>
                                                </tr>
                                          ))}
                                    </tbody>
                              </table>

                              <HelpAndSupportModal
                                    show={showModal}
                                    onHide={() => setShowModal(false)}
                                    // query={selectedQuery}
                                    selectedQuery={selectedQuery}
                                    onSubmit={submitReply}
                              />
                        </div>
                  </div>
            </div>
      );
};

export default HelpAndSupportList;

