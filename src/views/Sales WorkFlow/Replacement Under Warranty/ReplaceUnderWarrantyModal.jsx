



import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import AddSerialNoToReplaceDevice from './AddSerialNoToReplaceDevice';
import { Link } from "react-router-dom";

const ReplaceUnderWarrantyModal = ({ show, onHide, setIsAddUpdateActionDone, onSave, modelRequestData,
}) => {


      const totalQty = modelRequestData?.quantity || 0;
      const [showSerialModal, setShowSerialModal] = useState(false)
      const [serialNumbers, setSerialNumbers] = useState([]);
      const [inputSerial, setInputSerial] = useState('');
      const [inputQty, setInputQty] = useState('');
      const [errors, setError] = useState('');

      // Load existing serials if present
      useEffect(() => {
            if (modelRequestData?.serialNumbers?.length) {
                  setSerialNumbers(modelRequestData.serialNumbers);
            } else {
                  setSerialNumbers([]);
            }

            setInputSerial('');
            setInputQty('');
            setError('');
      }, [modelRequestData]);

      useEffect(() => {
            if (modelRequestData?.wholeData?.invoiceProductMappingList) {
                  setProductListData(modelRequestData.wholeData.invoiceProductMappingList);
            }
      }, [modelRequestData]);
      const [productListData, setProductListData] = useState(
            modelRequestData?.wholeData?.invoiceProductMappingList || []
      );

      // const productListData = modelRequestData?.wholeData?.invoiceProductMappingList;

      const [replaceRequestData, setReplaceRequestData] = useState(null); // new state



      const handleSave = () => {
            // debugger
            if (serialNumbers.length !== Number(totalQty)) {
                  setError(`Total quantity must be exactly ${totalQty}.`);
                  return;
            }

            onSave(serialNumbers);
      };

      const remainingQty = totalQty - serialNumbers.length;


      const closeModal = () => {
            onHide();
            setIsAddUpdateActionDone(true)
            setError();
      }

      const btnClickReplace = (item, serial) => {
            setReplaceRequestData({
                  productId: item.poProductMapID,
                  productID: item.productID,
                  salesProductSerID: serial.salesProductSerID,
                  // salesProductSerID:
                  oldSerialNumber: serial.serialNumber,
                  invoiceID: modelRequestData.invoiceID
            });
            setShowSerialModal(true);
      };

      const closeAllModal = () => {
            setShowSerialModal(false);
            setReplaceRequestData(null);
      };
      return (
            <Modal size="lg" show={show} style={{ zIndex: 1300 }} backdrop="static" keyboard={false} centered>
                  <Modal.Header >
                        <Modal.Title>
                              <h3 className="text-center">
                                    Replacement Under Warranty
                              </h3>

                        </Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                        <div className="container">
                              {/* Product Info Table */}
                              <table className="table table-bordered table-hover align-middle">
                                    <thead className="table-light">
                                          <tr>
                                                <th>#</th>
                                                <th>Product</th>
                                                <th>Serial Numbers</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {productListData?.length > 0 ? (
                                                productListData.map((item, index) => (
                                                      <tr key={item.poProductMapID}>
                                                            <td>{index + 1}</td>
                                                            <td>{item.productName}</td>

                                                            {/* Serial Numbers + Replace inside same cell */}
                                                            <td>
                                                                  {item.soSerialMappingList?.length > 0 ? (
                                                                        <ul className="mb-0 ps-0" style={{ listStyle: "none" }}>
                                                                              {item.soSerialMappingList.map((serial) => (
                                                                                    <li
                                                                                          key={serial.salesProductSerID}
                                                                                          className="d-flex justify-content-between align-items-center"
                                                                                          style={{
                                                                                                padding: "6px 8px",
                                                                                                borderBottom: "1px solid #f0f0f0",
                                                                                          }}
                                                                                    >
                                                                                          {/* Show serial & replaced info */}
                                                                                          <span>
                                                                                                <strong>{serial.serialNumber}</strong>
                                                                                                {serial.replaceOrderSerialNo && (
                                                                                                      <>
                                                                                                            {" "}➝{" "}
                                                                                                            <span style={{ color: "#28a745", fontWeight: 500 }}>
                                                                                                                  {serial.replaceOrderSerialNo}
                                                                                                            </span>
                                                                                                      </>
                                                                                                )}
                                                                                          </span>

                                                                                          {/* Replace button only if not replaced */}
                                                                                          {!serial.replaceOrderSerialNo && (
                                                                                                <a
                                                                                                      href="#"
                                                                                                      onClick={(e) => {
                                                                                                            e.preventDefault();
                                                                                                            btnClickReplace(item, serial);
                                                                                                      }}
                                                                                                      style={{
                                                                                                            color: "#9aa357",
                                                                                                            fontSize: "0.85rem",
                                                                                                            fontWeight: 500,
                                                                                                            marginLeft: "12px",
                                                                                                            whiteSpace: "nowrap",
                                                                                                      }}
                                                                                                >
                                                                                                      Replace
                                                                                                </a>
                                                                                          )}
                                                                                    </li>
                                                                              ))}
                                                                        </ul>
                                                                  ) : (
                                                                        <span className="text-muted">No Serials</span>
                                                                  )}
                                                            </td>


                                                      </tr>
                                                ))
                                          ) : (
                                                <tr>
                                                      <td colSpan="3" className="text-center text-muted">
                                                            No product records available
                                                      </td>
                                                </tr>
                                          )}
                                    </tbody>
                              </table>



                        </div>
                  </Modal.Body>


                  <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                              Close
                        </Button>

                  </Modal.Footer>

                  <AddSerialNoToReplaceDevice
                        show={showSerialModal}
                        onHide={closeAllModal}
                        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                        replaceRequestData={replaceRequestData} // pass target info
                        onSerialUpdate={(newSerial) => {
                              setProductListData((prev) =>
                                    prev.map((prod) =>
                                          prod.poProductMapID === replaceRequestData.productId
                                                ? {
                                                      ...prod,
                                                      soSerialMappingList: prod.soSerialMappingList.map((s) =>
                                                            s.salesProductSerID === replaceRequestData.salesProductSerID
                                                                  ? {
                                                                        ...s,
                                                                        oldSerialNumber: s.serialNumber, // keep old
                                                                        serialNumber: newSerial,         // update with new
                                                                        replaceOrderSerialNo: newSerial, // ✅ add this to reflect replacement immediately
                                                                  }
                                                                  : s
                                                      ),
                                                }
                                                : prod
                                    )
                              );

                              closeAllModal();
                        }}
                  />

            </Modal>
      );
};

export default ReplaceUnderWarrantyModal;
