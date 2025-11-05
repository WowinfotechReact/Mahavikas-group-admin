import React, { useState, useEffect, useContext } from "react";
import "./invoicePreview.css";
import { GetInvoiceModel } from "services/Invoice Module/InvoiceApi";
import { useLocation } from "react-router";
import { ConfigContext } from "context/ConfigContext";
import dayjs from "dayjs";
import { GetAMCInvoicePaymentCollectionModel } from "services/AMC Payment Collection/AMCPaymentCollectionApi";
import { GetAMCInvoiceModel } from "services/AMC Invoice/AMCInvoiceApi";
const PreInvoicePreview = ({ modelRequestData }) => {
      const { setLoader, user, permissions } = useContext(ConfigContext);

      const [invoiceObj, setInvoiceObj] = useState({
            leadKeyID: null,
            invoiceNumber: null,
            invoicePDFUpload: null,
            invoiceKeyID: null,
            invoiceDate: null,
            invoiceAmount: null,
            purchaseOrderKeyID: null,
            poPdfPreview: null
      })

      const location = useLocation()

      // console.log(, 'sssssss33333');
      let InvoiceKeyIID = location?.state?.invoiceData?.amcInvoiceKeyID

      useEffect(() => {

            if (InvoiceKeyIID) {
                  GetAMCInvoiceModelData(InvoiceKeyIID);
            }

      }, [location]);

      const products = invoiceObj?.invoiceProductMapping || [];
      const totalAmount = invoiceObj?.invoiceAmount || 0;

      console.log(invoiceObj, '438o5ryh98sdufdsf');

      const GetAMCInvoiceModelData = async (id) => {
            // debugger
            if (id === undefined) {
                  return;
            }
            setLoader(true);

            try {
                  const data = await GetAMCInvoiceModel(id);
                  if (data?.data?.statusCode === 200) {
                        setLoader(false);
                        const ModelData = data.data.responseData.data; // Assuming data is an array

                        setInvoiceObj({
                              ...invoiceObj,
                              leadKeyID: ModelData.leadKeyID,
                              invoiceNumber: ModelData.invoiceNumber,
                              invoicePDFUpload: ModelData.invoicePDFUpload,
                              invoiceKeyID: ModelData.invoiceKeyID,
                              invoiceDate: ModelData.invoiceDate,
                              invoiceAmount: ModelData.invoiceAmount,
                              purchaseOrderKeyID: ModelData.purchaseOrderKeyID,
                              poPdfPreview: ModelData.invoicePDFUpload,
                              invoiceProductMapping: ModelData.invoiceProductMapping
                        });
                        setIsFileChanged(false);
                  } else {
                        setLoader(false);

                        // Handle non-200 status codes if necessary
                        console.error('Error fetching data: ', data?.data?.statusCode);
                  }
            } catch (error) {
                  setLoader(false);

                  console.error('Error in state: ', error);
            }
      };

      return (
            <div className="invoice-container bg-white p-4">
                  {/* Company Header */}
                  <div className="row mb-4">
                        <div className="col-8">
                              <h2 className="fw-bold text-primary mb-1">AlphaTech System</h2>
                              <p className="mb-0">1, Chaitanya Plaxa, Sharanpur Link Road,Canada Corner,Nashik - 422002</p>
                              <p className="mb-0">ats@alphatechsystems.co.in</p>
                        </div>
                        <div className="col-4 text-end">
                              <p className="mb-1">
                                    <strong>Invoice No:</strong> {invoiceObj.invoiceNumber}
                              </p>
                              <p className="mb-1">
                                    <strong>Date:</strong>{" "}
                                    {dayjs(invoiceObj.invoiceDate).format("DD/MM/YYYY")}
                              </p>
                        </div>
                  </div>

                  {/* Product Table */}
                  <div className="table-responsive">
                        <table className="table table-bordered align-middle">
                              <thead className="table-light text-center">
                                    <tr>
                                          <th>Sr. No.</th>
                                          <th>Description</th>
                                          <th>UOM</th>
                                          <th>Qty</th>
                                          <th>Rate (₹)</th>
                                          <th>GST (%)</th>
                                          <th>GST Amt (₹)</th>
                                          <th>Invoice Amt (₹)</th>
                                    </tr>
                              </thead>
                              <tbody>
                                    {products.length === 0 ? (
                                          <tr>
                                                <td colSpan="8" className="text-center">
                                                      No products added
                                                </td>
                                          </tr>
                                    ) : (
                                          products.map((item, index) => {
                                                const lineAmount = item.rate * item.quantity;
                                                const gstAmount = (lineAmount * item.gstPercentage) / 100;
                                                const invoiceAmount = lineAmount + gstAmount;

                                                return (
                                                      <tr key={index}>
                                                            <td className="text-center">{index + 1}</td>
                                                            <td>
                                                                  <strong>{item.productName}</strong>
                                                                  <br />
                                                                  <small className="text-muted">
                                                                        {item.manufacturerName} | {item.variantName} |{" "}
                                                                        {item.modelName}
                                                                  </small>
                                                            </td>
                                                            <td className="text-center">{item.unit}</td>
                                                            <td className="text-center">{item.quantity}</td>
                                                            <td className="text-end">{item.rate.toLocaleString()}</td>
                                                            <td className="text-center">{item.gstPercentage}%</td>
                                                            <td className="text-end">{gstAmount.toLocaleString()}</td>
                                                            <td className="text-end">{invoiceAmount.toLocaleString()}</td>
                                                      </tr>
                                                );
                                          })
                                    )}
                              </tbody>
                              <tfoot>
                                    <tr>
                                          <td colSpan="7" className="text-end fw-bold">
                                                Total (₹)
                                          </td>
                                          <td className="text-end fw-bold">
                                                {totalAmount.toLocaleString()}
                                          </td>
                                    </tr>
                              </tfoot>
                        </table>
                  </div>

                  {/* Footer Notes */}
                  <div className="row mt-5">
                        <div className="col-6">
                              <h6 className="fw-bold">Note:</h6>
                              <p className="mb-0">Thank you for your business!</p>
                        </div>
                        <div className="col-6 text-end">
                              <h6 className="fw-bold">Terms & Conditions:</h6>
                              <p className="mb-0">Payment due within 30 days from invoice date.</p>
                        </div>
                  </div>


            </div>

      );
};

export default PreInvoicePreview;
