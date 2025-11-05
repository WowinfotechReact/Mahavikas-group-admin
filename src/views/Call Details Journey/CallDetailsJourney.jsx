
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaCheck, FaPlay, FaSuitcase, FaClipboardCheck, FaTimes } from "react-icons/fa";
import './style.css'

import jsPDF from "jspdf";
import html2canvas from "html2canvas"
import { useReactToPrint } from "react-to-print";
import Select from 'react-select';
import { GetServiceCallDetailsList } from 'services/Call Registration/CallRegistrationApi';
import { ConfigContext } from 'context/ConfigContext';
import { useLocation } from 'react-router';

const CallDetailsJourney = () => {
      const location = useLocation()
      const { setLoader, user } = useContext(ConfigContext);

      const componentRef = useRef();

      const handleDownload = async () => {
            const element = componentRef.current;

            // Take screenshot of the div
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");

            // Create PDF
            const pdf = new jsPDF("p", "mm", "a4");

            // Get page width/height
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Add image and scale to fit one page
            pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

            // Download as file
            pdf.save("Call_Report.pdf");
      };

      const [callServiceObj, setCallServiceObj] = useState({
            serviceCallID: null,
            serviceCallKeyID: null,
            leadID: null,
            serviceTypeID: null,
            serviceTypeName: null,
            pointOfContact: null,
            charges: null,
            assignToEmployeeID: null,
            assignToEmployeeName: null,
            assignDate: null,
            acceptRejectedOn: null,
            rejectReason: null,
            completedOndate: null,
            completedByEmployeeName: null,
            fault: null,
            address: null,
            visitDate: null,
            fsRpdf: null,
            bfRpdf: null,
            productName: null,
            manufacturerName: null,
            modelNumber: null,
            productRating: null,
            productSerialNumber: null,
            createdOnDate: null,
            status: null

      })

      console.log(location.state, 'dsauhd08saupd');

      useEffect(() => {
            if (location.state.serviceCallKeyID !== null) {
                  GetServiceCallDetailsListData(location.state.serviceCallKeyID)
            }

      }, [])

      const GetServiceCallDetailsListData = async (id) => {
            if (id === undefined) {
                  return;
            }

            setLoader(true)
            try {
                  const data = await GetServiceCallDetailsList(id);
                  if (data?.data?.statusCode === 200) {
                        setLoader(false)
                        const ModelData = data.data.responseData.data; // Assuming data is an array

                        setCallServiceObj({
                              ...callServiceObj,

                              serviceCallID: ModelData.serviceCallID,
                              serviceCallKeyID: ModelData.serviceCallKeyID,
                              leadID: ModelData.leadID,
                              serviceTypeID: ModelData.serviceTypeID,
                              serviceTypeName: ModelData.serviceTypeName,
                              pointOfContact: ModelData.pointOfContact,
                              charges: ModelData.charges,
                              assignToEmployeeID: ModelData.assignToEmployeeID,
                              assignToEmployeeName: ModelData.assignToEmployeeName,
                              assignDate: ModelData.assignDate,
                              acceptRejectedOn: ModelData.acceptRejectedOn,
                              rejectReason: ModelData.rejectReason,
                              completedOndate: ModelData.completedOndate,
                              completedByEmployeeName: ModelData.completedByEmployeeName,
                              fault: ModelData.fault,
                              address: ModelData.address,
                              visitDate: ModelData.visitDate,
                              fsRpdf: ModelData.fsRpdf,
                              bfRpdf: ModelData.bfRpdf,
                              productName: ModelData.productName,
                              manufacturerName: ModelData.manufacturerName,
                              modelNumber: ModelData.modelNumber,
                              productRating: ModelData.productRating,
                              productSerialNumbe: ModelData.productSerialNumbe,
                              createdOnDate: ModelData.createdOnDate,
                              status: ModelData.status,
                              observation: ModelData.observation,
                              recommendation: ModelData.recommendation,
                              workDone: ModelData.workDone,
                              customerSignaturePath: ModelData.customerSignaturePath,
                              startDate: ModelData.startDate,
                              endDate: ModelData.endDate,
                              warrantyStatus: ModelData.warrantyStatus,
                              customerFirmName: ModelData.customerFirmName,
                              contactName: ModelData.contactName,
                              customerMobileNumber: ModelData.customerMobileNumber,
                              emailID: ModelData.emailID,
                              callTypeName: ModelData.callTypeName,
                              distance: ModelData.distance,
                              callStatus: ModelData.callStatus
                        })


                  } else {
                        setLoader(false)
                        // Handle non-200 status codes if necessary
                        console.error('Error fetching data: ', data?.data?.statusCode);
                  }
            } catch (error) {
                  setLoader(false)
                  console.error('Error in GetTalukaModalData: ', error);
            }
      };
      const callStatusOption = [
            { value: 1, label: 'Completed' },
            { value: 2, label: 'Partially Completed' },
            { value: 3, label: ' Further Action Needed' },
            { value: 4, label: 'Pending' },
            { value: 5, label: 'Closed' },
      ]

      return (
            <div class="container ">
                  <div ref={componentRef}>
                        <div class="card shadow-sm">
                              <div class="card-body">

                                    <h3 class="text-center mb-4"> Call Details
                                    </h3>
                                    <div className="position-relative mb-5">
                                          {/* Thin Line */}
                                          <div
                                                style={{
                                                      height: "3px",
                                                      backgroundColor: "#e0e0e0",
                                                      position: "absolute",
                                                      top: "20px",
                                                      left: 0,
                                                      right: 0,
                                                      zIndex: 1,
                                                }}
                                          ></div>

                                          {/* Active Line (static half width) */}
                                          <div
                                                style={{
                                                      height: "3px",
                                                      backgroundColor: "green",
                                                      position: "absolute",
                                                      top: "20px",
                                                      left: 0,
                                                      width: "100%",
                                                      zIndex: 2,
                                                }}
                                          ></div>

                                          {/* Steps */}
                                          <div className="d-flex justify-content-between position-relative" style={{ zIndex: 3 }}>
                                                <div className="text-center">
                                                      <div className="rounded-circle bg-success text-white p-2">
                                                            <FaPlay size={14} />
                                                      </div>
                                                      <small className="d-block mt-1">Logged
                                                            <br />
                                                            {callServiceObj.createdOnDate}
                                                      </small>
                                                </div>

                                                <div className="text-center">
                                                      <div className="rounded-circle bg-success text-white p-2">
                                                            <FaCheck size={14} />
                                                      </div>
                                                      <small className="d-block mt-1">Accepted
                                                            <br />
                                                            {callServiceObj.acceptRejectedOn}
                                                      </small>
                                                </div>

                                                <div className="text-center">
                                                      <div className="rounded-circle  bg-success text-white p-2">
                                                            <FaSuitcase size={14} />
                                                      </div>
                                                      <small className="d-block mt-1">Working
                                                            <br />
                                                            {callServiceObj.createdOnDate}
                                                      </small>
                                                </div>

                                                <div className="text-center">
                                                      <div className="rounded-circle bg-success text-white p-2">
                                                            <FaClipboardCheck size={14} />
                                                      </div>
                                                      <small className="d-block mt-1">Completed
                                                            <br />
                                                            {callServiceObj.completedOndate}
                                                      </small>
                                                </div>

                                                <div className="text-center">
                                                      <div className="rounded-circle bg-success text-white p-2">
                                                            <FaTimes size={14} />
                                                      </div>
                                                      <small className="d-block mt-1">Closed
                                                            <br />
                                                            {callServiceObj.createdOnDate}
                                                      </small>
                                                </div>
                                          </div>
                                    </div>
                                    <div className="mb-4">
                                          <h5 className="fw-bold">
                                                Call ID: <span className="text-muted">{location.state.serviceCallID}</span>
                                          </h5>
                                    </div>

                                    <div className="row mb-4 pb-3 border-bottom">
                                          <div className="col-md-4">
                                                <h6 className="fw-bold mb-3">Call Details</h6>
                                                {/* <p><strong>Call ID:</strong> C0825-PUNDP-855598</p> */}
                                                <p className="d-flex align-items-center">
                                                      <strong className="me-2">Call Status:</strong>
                                                      <Select
                                                            placeholder="Select."
                                                            options={callStatusOption} // pass your options array here
                                                            menuPosition="fixed"
                                                            className="flex-grow-1"
                                                      />
                                                </p>
                                                <p className="d-flex"><strong style={{ minWidth: '140px' }}>Call Type:</strong> {callServiceObj.callTypeName}</p>
                                                <p><strong>Distance:</strong> {callServiceObj.distance}</p>
                                                <p><strong>Call Log Date:</strong> {callServiceObj.createdOnDate}</p>
                                                <p><strong>Accepted Date:</strong> {callServiceObj.acceptRejectedOn}</p>
                                                <p><strong>Attended Date:</strong> {callServiceObj.startDate}</p>
                                                <p><strong> Completed Date:</strong> {callServiceObj.endDate}</p>
                                                <p><strong>TAT (HH:MM):</strong> {"-"}</p>
                                                <p><strong>Response Time:</strong> {"-"}</p>
                                                <p><strong>Reassigned:</strong> {"-"}</p>
                                                <p><strong>Equipment Face Time:</strong> {"-"}</p>
                                          </div>

                                          <div className="col-md-4">
                                                <h6 className="fw-bold mb-3">Customer Site</h6>
                                                <p className="d-flex">
                                                      <span className="fw-bold me-2" style={{ minWidth: '140px' }}> Customer Name:</span>
                                                      <span>{callServiceObj.customerFirmName}</span>
                                                </p>
                                                <p><strong style={{ minWidth: '140px' }}>Contact Person:</strong> {callServiceObj.contactName}</p>
                                                <p><strong>Contact:</strong> {callServiceObj.customerMobileNumber}</p>
                                                <p className="d-flex">
                                                      <span className="fw-bold me-2" style={{ minWidth: '140px' }}>Email:</span>
                                                      <span>{callServiceObj.emailID}</span>
                                                </p>
                                          </div>

                                          <div className="col-md-4">
                                                <h6 className="fw-bold mb-3">Contract Details</h6>
                                                <p><strong>Warranty Status:</strong> {callServiceObj.warrantyStatus}</p>
                                                <p><strong>Start Date:</strong> {callServiceObj.startDate} </p>
                                                <p><strong>End Date:</strong> {callServiceObj.endDate}</p>
                                          </div>
                                    </div>


                                    <div class="mb-4 pb-3 border-bottom">
                                          <h6 class="fw-bold mb-3">Product Details</h6>
                                          <div class="row">
                                                <div class="col-md-6"><p><strong>Product Name

                                                      :</strong>{callServiceObj.productName}</p></div>
                                                <div class="col-md-6"><p><strong>Make:</strong> {callServiceObj.manufacturerName}</p></div>
                                                <div class="col-md-6"><p><strong>Model:</strong> {callServiceObj.modelNumber}</p></div>
                                                <div class="col-md-6"><p><strong>Rating:</strong>  {callServiceObj.productRating}</p></div>
                                                <div class="col-md-6"><p><strong>Serial No:</strong>  {callServiceObj.productSerialNumber || "-"}</p></div>
                                                <div class="col-md-6"><p><strong>Engineer:</strong>  {callServiceObj.assignToEmployeeName}</p></div>
                                          </div>
                                    </div>

                                    <div>
                                          <h6 class="fw-bold mb-3">Summary</h6>
                                          <p><strong>Engineer Observation:</strong>{callServiceObj.observation}</p>
                                          <p><strong>Work Done:</strong> {callServiceObj.workDone}</p>
                                          <p><strong>Recommendation:</strong> {callServiceObj.recommendation}</p>
                                    </div>
                                    <div className="d-flex justify-content-end mt-4">
                                          <button
                                                className="btn btn-outline-primary me-2"
                                                disabled={!callServiceObj?.fsRpdf}
                                                onClick={() => {
                                                      if (callServiceObj?.fsRpdf) {
                                                            window.open(callServiceObj.fsRpdf, "_blank");
                                                      }
                                                }}
                                          >
                                                FSR Report
                                          </button>

                                          <button
                                                className="btn btn-outline-secondary"
                                                disabled={!callServiceObj?.bfRpdf}
                                                onClick={() => {
                                                      if (callServiceObj?.bfRpdf) {
                                                            window.open(callServiceObj.bfRpdf, "_blank");
                                                      }
                                                }}
                                          >
                                                BFR Report
                                          </button>

                                    </div>

                              </div>
                        </div>
                  </div>
                  <div className="d-flex justify-content-end mt-4">
                        <button onClick={handleDownload} className="btn text-white" style={{ background: '#9aa357' }}>
                              Download & Print
                        </button>
                  </div>

            </div>




      );
};

export default CallDetailsJourney;