import React, { useState, useEffect } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { toast } from "react-toastify";
const SerialNumberModal = ({ show, onHide, product, qty, onSave }) => {
      const [batchSerials, setBatchSerials] = useState([]); // [{serial, qty}]
      const [serialInput, setSerialInput] = useState("");
      const [qtyInput, setQtyInput] = useState(1);

      // Initialize with existing serials if any
      useEffect(() => {
            if (product?.serials?.length > 0) {
                  // Convert flat serials to batch form
                  const existingBatch = [];
                  const counts = {};
                  product.serials.forEach((sn) => {
                        counts[sn] = (counts[sn] || 0) + 1;
                  });
                  for (let sn in counts) {
                        existingBatch.push({ serial: sn, qty: counts[sn] });
                  }
                  setBatchSerials(existingBatch);
            } else {
                  setBatchSerials([]);
            }
            setSerialInput("");
            setQtyInput(1);
      }, [product]);

      // Add serial batch
      const handleAddBatch = () => {
            if (!serialInput || qtyInput <= 0) return;

            // Check total qty doesn't exceed product qty
            const currentTotal = batchSerials.reduce((sum, b) => sum + b.qty, 0);
            if (currentTotal + qtyInput > qty) {
                  toast.error(`You must add exactly ${qty} serial numbers before saving.`);

                  return;
            }

            setBatchSerials([...batchSerials, { serial: serialInput, qty: qtyInput }]);
            setSerialInput("");
            setQtyInput(1);
      };

      // Remove batch
      const handleRemoveBatch = (index) => {
            const updated = [...batchSerials];
            updated.splice(index, 1);
            setBatchSerials(updated);
      };

      // Final save
      const handleSave = () => {
            const total = batchSerials.reduce((sum, b) => sum + b.qty, 0);

            if (total !== qty) {
                  toast.error(`You must add exactly ${qty} serial numbers before saving.`);


                  return;
            }

            const flatSerials = [];
            batchSerials.forEach((b) => {
                  for (let i = 0; i < b.qty; i++) flatSerials.push(b.serial);
            });

            onSave(flatSerials);
            onHide();
      };


      return (
            <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
                  <Modal.Header >
                        <Modal.Title>Add Serial Numbers</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                        <div className="d-flex mb-3 gap-2">
                              <input
                                    type="text"
                                    maxLength={25}
                                    className="form-control"
                                    placeholder="Serial Number"
                                    value={serialInput}
                                    onChange={(e) => setSerialInput(e.target.value)}
                              />
                              <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Qty"
                                    min={1}
                                    max={qty}
                                    value={qtyInput}
                                    onChange={(e) => setQtyInput(Number(e.target.value))}
                              />
                              <button style={{ background: "#9aa357" }}
                                    className="text-white btn" onClick={handleAddBatch}>
                                    Add
                              </button>
                        </div>

                        {batchSerials.length > 0 && (
                              <Table bordered hover size="sm">
                                    <thead>
                                          <tr>
                                                <th>Serial Number</th>
                                                <th>Qty</th>
                                                <th>Action</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {batchSerials.map((b, idx) => (
                                                <tr key={idx}>
                                                      <td>{b.serial}</td>
                                                      <td>{b.qty}</td>
                                                      <td>
                                                            <button
                                                                  style={{ background: "#dc3545" }}
                                                                  className="text-white btn"

                                                                  onClick={() => handleRemoveBatch(idx)}
                                                            >
                                                                  Remove
                                                            </button>
                                                      </td>
                                                </tr>
                                          ))}
                                    </tbody>
                              </Table>
                        )}

                        <div>
                              <small>
                                    Total serials: {batchSerials.reduce((sum, b) => sum + b.qty, 0)} / {qty}
                              </small>
                        </div>
                  </Modal.Body>
                  <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>
                              Cancel
                        </Button>
                        <button style={{ background: "#9aa357" }}
                              className="text-white btn" onClick={handleSave}>
                              OK
                        </button>
                  </Modal.Footer>
            </Modal>
      );
};

export default SerialNumberModal;
