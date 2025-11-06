import React, { useRef } from "react";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";


// import Logo from '../../../assets/images/alphatechLogo.jpg';
import Logo from '../assets/images/alphatechLogo.jpg';





const TaxInvoiceReport = () => {
      const invoiceRef = useRef();


      const handlePreviewPDF = async () => {
            const element = invoiceRef.current;

            // Capture HTML as canvas
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
            window.open(pdf.output("bloburl"), "_blank");
      };
      // Pad the items array with empty objects to fill the table




      const dummyProducts = [
            { description: "Product A", hsn: "1001", qty: 2, rate: 500, tax: "18%", amount: 1000 },

            { description: "Product I", hsn: "1009", qty: 3, rate: 350, tax: "18%", amount: 1050 },
            { description: "Product J", hsn: "1010", qty: 1, rate: 900, tax: "18%", amount: 900 },
      ];


      const MAX_ROWS = 15; // Total rows to maintain fixed height
      const rowHeight = 30; // px, adjust for PDF spacing

      // Calculate total from dummyProducts
      const totalAmount = dummyProducts.reduce((sum, i) => sum + i.amount, 0);
      return (

            <>


                  <div className="container my-3">
                        <button className="btn text-white mb-1" style={{ background: '#ff7d34' }} onClick={handlePreviewPDF}>
                              Download Report
                        </button>

                        <div ref={invoiceRef}>
                              <div className="container my-3">
                                    {/* small css to tune padding/lines (you can move to your CSS file) */}
                                    <style>{`
        .invoice-table { border:1px solid #000; border-collapse: collapse; width:100%; }
        .invoice-table td { border:1px solid #000; padding:8px; vertical-align: top; }
        .logo-box { width:84px; height:84px; background:#efefef; display:flex; align-items:center; justify-content:center; font-size:12px; }
        .small-label { font-size:12px; font-weight:600; }
        .small-value { font-size:13px; }
        .no-gap { margin:0; padding:0; }
      `}</style>
                                    <table className="invoice-table">
                                          <tbody>
                                                {/* Title Row */}
                                                <tr>
                                                      <td style={{ textAlign: "center", padding: "10px" }}>
                                                            <h4 className="fw-bold m-0">TAX INVOICE</h4>
                                                      </td>
                                                </tr>

                                                {/* IRN / Ack / QR Row */}
                                                <tr>
                                                      <td>
                                                            <div className="d-flex justify-content-between align-items-start">
                                                                  <div>
                                                                        <div className="small-label"> <span className="small-value">IRN No: INV-IRN-9876543210 </span></div>

                                                                        <div className="small-label mt-1">Ack No:<span className="small-value">ACK-123456789</span></div>


                                                                        <div className="small-label mt-1">Ack Date: <span className="small-value">29/09/2025</span></div>

                                                                  </div>

                                                                  {/* QR Code */}
                                                                  <div style={{ width: "100px", height: "100px" }}>
                                                                        <img
                                                                              src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=INV-IRN-9876543210"
                                                                              alt="QR Code"
                                                                              width="100"
                                                                              height="100"
                                                                        />
                                                                  </div>
                                                            </div>
                                                      </td>
                                                </tr>
                                          </tbody>
                                    </table>

                                    <table className="invoice-table">
                                          <tbody>
                                                {/* ROW 1: Company (left) | Invoice No/Date + Buyer Order/Dated (right) */}
                                                <tr>
                                                      {/* left ~66% */}
                                                      <td style={{ width: "66%" }}>
                                                            <div className="d-flex">
                                                                  <div className="logo-box">
                                                                        <img src={Logo} width={96} height={96} />
                                                                  </div>
                                                                  <div className="ms-3">
                                                                        <h5 className="mb-1">ALPHATECH SYSTEMS</h5>
                                                                        <div className="no-gap"> 1. Chaitanya Plaza , Sharanpur Link Road
                                                                              Canada Corner , Nashik - 422002
                                                                              udyam Registration No - MH-23-0003948
                                                                        </div>
                                                                        <div className="no-gap"><strong>GSTIN / UIN:</strong> 27AAHFA2081L1ZD</div>
                                                                        <div className="no-gap"><strong>State Name:</strong> Maharashtra, Code: 26 </div>
                                                                        <div className="no-gap"><strong>Contact:</strong> 0253-2572521 , 9422944770</div>
                                                                        <div className="no-gap"><strong>Email:</strong> accounts@alphatechsystems.co.in</div>
                                                                  </div>
                                                            </div>
                                                      </td>

                                                      {/* right ~34% */}
                                                      <td style={{ width: "34%" }}>
                                                            {/* top: Invoice No | Date */}
                                                            <div className="d-flex" style={{ borderBottom: "1px solid #000" }}>
                                                                  <div style={{ width: "50%", padding: 6, borderRight: "1px solid #000" }}>
                                                                        <div className="small-label">Invoice No.</div>
                                                                        <div className="small-value">INV-001</div>
                                                                  </div>
                                                                  <div style={{ width: "50%", padding: 6 }}>
                                                                        <div className="small-label">Dated</div>
                                                                        <div className="small-value">29/09/2025</div>
                                                                  </div>
                                                            </div>
                                                            <div className="d-flex" style={{ borderBottom: "1px solid #000" }}>
                                                                  <div style={{ width: "50%", padding: 6, borderRight: "1px solid #000" }}>
                                                                        <div className="small-label">Delivery Note.</div>
                                                                        <div className="small-value">INV-001</div>
                                                                  </div>
                                                                  <div style={{ width: "50%", padding: 6 }}>
                                                                        <div className="small-label">Mode of  Payment</div>
                                                                        <div className="small-value">29/09/2025</div>
                                                                  </div>
                                                            </div>

                                                            {/* below: Buyer Order No | Dated */}
                                                            <div className="d-flex">
                                                                  <div style={{ width: "50%", padding: 6, borderRight: "1px solid #000" }}>
                                                                        <div className="small-label">Buyer Order No.</div>
                                                                        <div className="small-value">BO-12345</div>
                                                                  </div>
                                                                  <div style={{ width: "50%", padding: 6 }}>
                                                                        <div className="small-label">Dated</div>
                                                                        <div className="small-value">28/09/2025</div>
                                                                  </div>
                                                            </div>
                                                      </td>
                                                </tr>

                                                {/* ROW 2: Consignee (left) | Dispatched/ Destination + Terms (right) */}
                                                <tr>
                                                      <td>
                                                            <div>
                                                                  <div className="small-label mb-1">Consignee (Ship To)</div>
                                                                  <div className="no-gap">Customer Company Name</div>
                                                                  <div className="no-gap">Street Address, Area</div>
                                                                  <div className="no-gap">City - PIN</div>
                                                                  <div className="no-gap">Contact Person: Mr. Y</div>
                                                            </div>
                                                      </td>

                                                      <td>
                                                            {/* Dispatched through | Destination */}
                                                            <div className="d-flex" style={{ borderBottom: "1px solid #000" }}>
                                                                  <div style={{ width: "50%", padding: 6, borderRight: "1px solid #000" }}>
                                                                        <div className="small-label">Dispatched Through</div>
                                                                        <div className="small-value">Courier / Transport</div>
                                                                  </div>
                                                                  <div style={{ width: "50%", padding: 6 }}>
                                                                        <div className="small-label">Destination</div>
                                                                        <div className="small-value">Ahmedabad</div>
                                                                  </div>
                                                            </div>

                                                            {/* Terms of Delivery (full width of right cell) */}
                                                            <div style={{ padding: 6 }}>
                                                                  <div className="small-label">Terms of Delivery</div>
                                                                  <div className="small-value">Ex: Within 7 days / Ex-Works / CIF etc.</div>
                                                            </div>
                                                      </td>
                                                </tr>

                                                {/* ROW 3: Buyer (left) | Contact / Mobile / Email + Bill Prepared (right) */}
                                                <tr>
                                                      <td>
                                                            <div>
                                                                  <div className="small-label mb-1">Buyer (Bill To)</div>
                                                                  <div className="no-gap">Buyer Company Name</div>
                                                                  <div className="no-gap">Buyer Address Line 1</div>
                                                                  <div className="no-gap">GST No: 29BBBBB1111B2Z6</div>
                                                                  <div className="no-gap">Phone: +91-9999999999</div>
                                                            </div>
                                                      </td>

                                                      <td>
                                                            {/* contact stack */}
                                                            <div style={{ padding: 6, borderBottom: "1px solid #000" }}>
                                                                  <div className="no-gap"><strong>Contact Person:</strong> Mr. Z</div>
                                                                  <div className="no-gap"><strong>Mobile:</strong> +91-8888888888</div>
                                                                  <div className="no-gap"><strong>Email:</strong> buyer@company.com</div>
                                                            </div>

                                                            {/* bill prepared by */}
                                                            <div style={{ padding: 6 }}>
                                                                  <div className="small-label">Bill Prepared By</div>
                                                                  <div className="small-value">Staff Name</div>
                                                            </div>
                                                      </td>
                                                </tr>


                                          </tbody>
                                    </table>


                                    {/* Items Table */}
                                    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", height: MAX_ROWS * rowHeight }}>
                                          <thead>
                                                <tr >
                                                      <th className="text-center" style={{ width: "5%", textAlign: "left", padding: "6px 4px", borderRight: "1px solid #000", borderBottom: "2px solid #000" }}>Sr No</th>
                                                      <th className="text-center" style={{ width: "35%", textAlign: "left", padding: "6px 4px", borderRight: "1px solid #000", borderBottom: "2px solid #000" }}>Description of Goods</th>
                                                      <th className="text-center" style={{ width: "10%", textAlign: "left", padding: "6px 4px", borderRight: "1px solid #000", borderBottom: "2px solid #000" }}>HSN/SAC</th>
                                                      <th className="text-center" style={{ width: "10%", textAlign: "left", padding: "6px 4px", borderRight: "1px solid #000", borderBottom: "2px solid #000" }}>Qty</th>
                                                      <th className="text-center" style={{ width: "10%", textAlign: "left", padding: "6px 4px", borderRight: "1px solid #000", borderBottom: "2px solid #000" }}>Rate</th>
                                                      <th className="text-center" style={{ width: "10%", textAlign: "left", padding: "6px 4px", borderRight: "1px solid #000", borderBottom: "2px solid #000" }}>Tax (%)</th>
                                                      <th className="text-center" style={{ width: "20%", textAlign: "left", padding: "6px 4px", borderBottom: "2px solid #000" }}>Amount</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                {dummyProducts.map((item, idx) => (
                                                      <tr className="text-center" key={idx} style={{ height: rowHeight }}>
                                                            <td style={{ borderRight: "1px solid #000" }}>{idx + 1}</td>
                                                            <td style={{ borderRight: "1px solid #000" }}>{item.description}</td>
                                                            <td style={{ borderRight: "1px solid #000" }}>{item.hsn}</td>
                                                            <td style={{ borderRight: "1px solid #000" }}>{item.qty}</td>
                                                            <td style={{ borderRight: "1px solid #000" }}>{item.rate}</td>
                                                            <td style={{ borderRight: "1px solid #000" }}>{item.tax}</td>
                                                            <td>{item.amount}</td>
                                                      </tr>
                                                ))}

                                                {/* Empty rows to maintain fixed height */}
                                                {Array.from({ length: MAX_ROWS - dummyProducts.length }).map((_, idx) => (
                                                      <tr key={`empty-${idx}`} style={{ height: rowHeight }}>
                                                            <td style={{ borderRight: "1px solid #000" }}></td>
                                                            <td style={{ borderRight: "1px solid #000" }}></td>
                                                            <td style={{ borderRight: "1px solid #000" }}></td>
                                                            <td style={{ borderRight: "1px solid #000" }}></td>
                                                            <td style={{ borderRight: "1px solid #000" }}></td>
                                                            <td style={{ borderRight: "1px solid #000" }}></td>
                                                            <td></td>
                                                      </tr>
                                                ))}

                                                {/* Total row with bottom horizontal line */}
                                                <tr style={{ height: rowHeight, borderTop: "2px solid #000" }}>
                                                      <td colSpan="6" style={{ textAlign: "right", fontWeight: "bold", padding: "6px 4px", borderRight: "1px solid #000" }}>
                                                            Total
                                                      </td>
                                                      <td style={{ fontWeight: "bold", padding: "6px 4px" }}>{totalAmount}</td>
                                                </tr>
                                          </tbody>
                                    </table>


                              </div>
                        </div>
                  </div>





            </>


      );
};

export default TaxInvoiceReport;
