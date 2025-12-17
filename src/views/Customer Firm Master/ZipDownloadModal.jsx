






// ModalComponent.js
import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-date-picker';
import { motion, AnimatePresence } from "framer-motion";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import SuccessPopupModal from 'component/SuccessPopupModal';
// import { PaymentStatusList } from 'middleware/Utils';
import dayjs from 'dayjs';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { ExportInstituteAttendanceZip } from 'services/Institute/InstituteApi';
import { ConfigContext } from 'context/ConfigContext';

const ZipDownloadModal = ({ show, onHide, modelRequestData, setIsAddUpdateActionDone }) => {

      const { setLoader, user, companyID, permissions } = useContext(ConfigContext);


      const submitPDFZip = () => {


            const payload = {
                  companyID: Number(companyID),
                  month, // number
                  year,
                  projectID: modelRequestData.projectID
            }
            ExportInstituteAttendanceZipData(payload)
      }
      const ExportInstituteAttendanceZipData = async (apiParam) => {
            setLoader(true);

            try {
                  const response = await ExportInstituteAttendanceZip(
                        "/ExportInstituteAttendanceZip",
                        apiParam
                  );

                  const blob = new Blob([response.data], {
                        type: "application/zip"
                  });

                  const url = window.URL.createObjectURL(blob);

                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "Institute_Attendance_Report.zip";
                  document.body.appendChild(a);
                  a.click();

                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                  onHide();

                  setLoader(false);
            } catch (error) {
                  console.error(error);
                  setLoader(false);
            }
      };

      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      const [month, setMonth] = useState(currentMonth);
      const [year, setYear] = useState(currentYear);




      const months = [
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
      const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

      // const [monthYear, setMonthYear] = useState(
      //       formatMonthYear(currentMonth, currentYear)
      // );
      return (
            <Modal
                  size="md"
                  show={show}
                  onHide={() => {
                        onHide();
                        setInitialData();
                  }}
                  style={{ zIndex: 1300 }}
                  backdrop="static"
                  keyboard={false}
                  centered // Adjust the z-index as needed
            >
                  <Modal.Header closeButton>
                        <Modal.Title>{modelRequestData?.Action != null ? 'Update AMC Quotation' : 'Zip Download'}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                        <div className="container-fluid">
                              <div className="row g-3">

                                    {/* Month */}
                                    <div className="col-12">
                                          <label className="form-label fw-semibold">Select Month</label>
                                          <select
                                                className="form-select"
                                                value={month}
                                                onChange={(e) => setMonth(Number(e.target.value))}
                                          >
                                                {months
                                                      .filter(m =>
                                                            year === currentYear ? m.value <= currentMonth : true
                                                      )
                                                      .map(m => (
                                                            <option key={m.value} value={m.value}>
                                                                  {m.label}
                                                            </option>
                                                      ))}
                                          </select>
                                    </div>

                                    {/* Year */}
                                    <div className="col-12">
                                          <label className="form-label fw-semibold">Select Year</label>
                                          <select
                                                className="form-select"
                                                value={year}
                                                onChange={(e) => setYear(Number(e.target.value))}
                                          >
                                                {years.map(yr => (
                                                      <option key={yr} value={yr}>
                                                            {yr}
                                                      </option>
                                                ))}
                                          </select>
                                    </div>
                                    {/* <div className="col-12 text-center text-muted small">
                                          Selected: <strong>{monthYear}</strong>
                                    </div> */}
                                    {/* Download Button */}


                              </div>
                        </div>
                  </Modal.Body>
                  <Modal.Footer>
                        <Button
                              variant="secondary"
                              onClick={() => {
                                    onHide();
                                    setInitialData();
                              }}
                        >
                              Close
                        </Button>
                        <button style={{

                              background: '#ffaa33',

                        }}
                              className=" d-flex btn text-white  text-nowrap" onClick={submitPDFZip}>
                              Submit
                        </button>
                  </Modal.Footer>
                  {/* <SuccessPopupModal
                        show={showSuccessModel}
                        onHide={() => closeAll()}
                        setShowSuccessModal={setShowSuccessModal}
                        modelAction={actionMassage}
                  /> */}
            </Modal >
      );
};

export default ZipDownloadModal;

