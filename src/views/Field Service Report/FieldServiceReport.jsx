import React from 'react'
import './fsr.css'



export default function FieldServiceReport() {
      return (
            <table className="fsr-table">
                  <tbody>
                        {/* Top Row */}
                        <tr>
                              <td colSpan={1} rowSpan={2} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Vertiv_logo.svg/512px-Vertiv_logo.svg.png" alt="Vertiv Logo" height={40} />
                              </td>
                              <td colSpan={2} rowSpan={2} style={{ textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold' }}>
                                    ALPHATECH SYSTEMS<br /><span style={{ fontWeight: 'normal' }}>Authorized Business Partner</span>
                              </td>
                              <td colSpan={6} className="title">FIELD SERVICE REPORT</td>
                        </tr>
                        <tr></tr>

                        {/* FSR Info */}
                        <tr>
                              <td colSpan={2}>FSR No.: <strong>15201</strong></td>
                              <td colSpan={2}>Date:</td>
                              <td colSpan={4}>
                                    <span className="checkbox"></span> AMC
                                    <span className="checkbox ml-10"></span> WARRANTY
                                    <span className="checkbox ml-10"></span> POST WARRANTY
                              </td>
                        </tr>

                        {/* Customer Name */}
                        <tr>
                              <td colSpan={2}>Customer Name &amp; Address</td>
                              <td colSpan={6}><div className="field-box"></div></td>
                        </tr>

                        {/* Engineer */}
                        <tr>
                              <td colSpan={2}>Engineer's Name</td>
                              <td colSpan={6}></td>
                        </tr>

                        {/* Equipment */}
                        <tr>
                              <td colSpan={2}>Sr. No. of Equipment</td>
                              <td colSpan={2}></td>
                              <td colSpan={2}>Call Type (Tick)</td>
                              <td colSpan={2}>
                                    <span className="checkbox"></span> I &amp; C<br />
                                    <span className="checkbox"></span> PM
                              </td>
                        </tr>

                        {/* Complaint */}
                        <tr>
                              <td colSpan={2}>Date &amp; Time of Complaint</td>
                              <td colSpan={2}></td>
                              <td colSpan={2}>
                                    <span className="checkbox"></span> Breakdown<br />
                                    <span className="checkbox"></span> Tech
                              </td>
                              <td colSpan={2}>
                                    <span className="checkbox"></span> Monitoring<br />
                                    <span className="checkbox"></span> Others
                              </td>
                        </tr>

                        {/* Complaint ID */}
                        <tr>
                              <td colSpan={2}>Complaint ID</td>
                              <td colSpan={6}></td>
                        </tr>

                        {/* Model */}
                        <tr>
                              <td colSpan={2}>Model / KVA Rating</td>
                              <td colSpan={6}></td>
                        </tr>

                        {/* Installed On */}
                        <tr>
                              <td colSpan={2}>Installed on</td>
                              <td colSpan={6}></td>
                        </tr>

                        {/* Call Reporting */}
                        <tr>
                              <td colSpan={2}>Call Reporting date &amp; time</td>
                              <td colSpan={2}></td>
                              <td colSpan={2}>Call Closed date &amp; time</td>
                              <td colSpan={2}></td>
                        </tr>

                        {/* Person Name */}
                        <tr>
                              <td colSpan={2}>Name of Person</td>
                              <td colSpan={2}></td>
                              <td colSpan={2}>DG Available</td>
                              <td colSpan={2}>
                                    <span className="checkbox"></span> Yes <span className="checkbox"></span> No
                              </td>
                        </tr>

                        {/* Contact */}
                        <tr>
                              <td colSpan={2}>Contact No.</td>
                              <td colSpan={2}></td>
                              <td colSpan={2}>Type of Load</td>
                              <td colSpan={2}>
                                    <span className="checkbox"></span> IT
                                    <span className="checkbox"></span> Industrial
                                    <span className="checkbox"></span> Others
                              </td>
                        </tr>

                        {/* Email */}
                        <tr>
                              <td colSpan={2}>E-mail ID</td>
                              <td colSpan={2}></td>
                              <td colSpan={2}>Configuration of UPS</td>
                              <td colSpan={2}>
                                    <span className="checkbox"></span> Standalone
                                    <span className="checkbox"></span> Parallel
                                    <span className="checkbox"></span> Hot stand by
                              </td>
                        </tr>

                        {/* Temp */}
                        <tr>
                              <td colSpan={2}>Temperature</td>
                              <td colSpan={2}>UPS Room: <span className="temp-field"></span> Deg.</td>
                              <td colSpan={4}>Batt Room: <span className="temp-field"></span> Deg.</td>
                        </tr>

                        {/* Engineer Observation */}
                        <tr>
                              <td colSpan={8} className="section-title">Engineer Observation</td>
                        </tr>
                        <tr style={{ height: 60 }}>
                              <td colSpan={8}></td>
                        </tr>

                        {/* Full Report */}
                        <tr>
                              <td colSpan={8} className="section-title">Full Report : Power Parameters</td>
                        </tr>
                        <tr><td colSpan={2}>I/P Voltage</td><td colSpan={6}></td></tr>
                        <tr><td colSpan={2}>O/P Voltage</td><td colSpan={6}></td></tr>
                        <tr><td colSpan={2}>I/P Current</td><td colSpan={6}></td></tr>
                        <tr><td colSpan={2}>O/P Current</td><td colSpan={6}></td></tr>
                        <tr><td colSpan={2}>I/P Frequency</td><td colSpan={6}></td></tr>
                        <tr><td colSpan={2}>N-E-voltage</td><td colSpan={6}></td></tr>
                        <tr><td colSpan={2}>Batt-Float Voltage</td><td colSpan={6}></td></tr>
                        <tr><td colSpan={2}>Batt Charging Current</td><td colSpan={6}></td></tr>
                        <tr><td colSpan={2}>No. of Batt &amp; Make</td><td colSpan={6}></td></tr>
                        <tr><td colSpan={2}>Batt AH Capacity</td><td colSpan={6}></td></tr>

                        {/* Engineer Work Done */}
                        <tr>
                              <td colSpan={8} className="section-title">Engineer Work done</td>
                        </tr>
                        <tr style={{ height: 80 }}>
                              <td colSpan={8}></td>
                        </tr>

                        {/* Recommendation */}
                        <tr>
                              <td colSpan={8} className="section-title">Engineer's Recommendation</td>
                        </tr>
                        <tr style={{ height: 60 }}>
                              <td colSpan={8}></td>
                        </tr>

                        {/* Spare Table */}
                        <tr>
                              <td colSpan={6} className="section-title">Spare Consumption Details</td>
                              <td colSpan={2}>
                                    Spares to be billed (Tick):
                                    <span className="checkbox"></span> YES
                                    <span className="checkbox"></span> NO
                              </td>
                        </tr>
                        <tr>
                              <td>S. No</td>
                              <td colSpan={3}>Part Code</td>
                              <td>Description</td>
                              <td>Quantity</td>
                              <td colSpan={2}>Price</td>
                        </tr>
                        <tr><td>1</td><td colSpan={3}></td><td></td><td></td><td colSpan={2}></td></tr>
                        <tr><td>2</td><td colSpan={3}></td><td></td><td></td><td colSpan={2}></td></tr>
                        <tr><td>3</td><td colSpan={3}></td><td></td><td></td><td colSpan={2}></td></tr>

                        {/* Footer */}
                        <tr>
                              <td colSpan={8}>
                                    The above job was carried out and completed to satisfaction. I agree to pay the charges as applicable.
                              </td>
                        </tr>
                        <tr>
                              <td colSpan={2}>Customer Remark</td>
                              <td colSpan={2}>Engineers Remark</td>
                              <td colSpan={2}>Service Managers Remark</td>
                              <td colSpan={2}>Signature of Service Manager</td>
                        </tr>
                        <tr>
                              <td colSpan={6}>Name &amp; Sign. Of the Engineer<br />ALPHATECH SYSTEMS</td>
                              <td colSpan={2}>Date: <br />Customer's Signature &amp; Seal</td>
                        </tr>
                        <tr>
                              <td colSpan={8} style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                    Vertiv Customer Care No.: 1800-209-6070 | Mail ID: customer.care@vertiv.com
                              </td>
                        </tr>
                  </tbody>
            </table>


      );
}



// export default FieldServiceReport