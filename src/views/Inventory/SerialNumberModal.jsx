import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from 'react-toastify';

const SerialNumberModal = ({ show, onHide, product, onSave }) => {
      const [serialInput, setSerialInput] = useState("");
      const [qtyInput, setQtyInput] = useState("");
      const [localSerials, setLocalSerials] = useState([]);
      useEffect(() => {
            if (product) {
                  setLocalSerials(product.serials || []);
            }
      }, [product]);

      const handleAddSerials = (e) => {
            e.preventDefault(); // 🔑 prevent form submission

            const base = serialInput.trim();
            const qty = parseInt(qtyInput, 10);

            if (!base || isNaN(qty) || qty <= 0) return;

            if (localSerials.length + qty > product.quantity) {
                  // alert("");
                  const notify = () => toast.error(`Qty  exceeds Product ${qty}  quantity!`);
                  notify()
                  return;
            }

            const newSerials = Array.from({ length: qty }, (_, i) => `${base}`);
            setLocalSerials([...localSerials, ...newSerials]);

            setSerialInput("");
            setQtyInput("");
      };


      const handleDeleteSerial = (serial) => {
            setLocalSerials(localSerials.filter((s) => s !== serial));
      };

      const handleSave = () => {
            onSave(product.index, localSerials);
            onHide();
      };

      return (
            <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
                  <Modal.Header closeButton>
                        <Modal.Title>Manage Serials for {product?.productName}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                        <Form className="d-flex gap-2 mb-3">
                              <Form.Control
                                    maxLength={7}
                                    placeholder="Enter Base Serial"
                                    value={serialInput}
                                    onChange={(e) => setSerialInput(e.target.value)}
                              />
                              <Form.Control
                                    type="number"
                                    placeholder="Enter Qty"
                                    value={qtyInput}
                                    onChange={(e) => setQtyInput(e.target.value)}
                              />
                              <button className="btn btn-sm text-white" style={{ background: '#ff7d34' }} onClick={handleAddSerials}>Add</button>
                        </Form>

                        {localSerials.length > 0 ? (
                              <div className="d-flex flex-wrap gap-2">
                                    {localSerials.map((s, idx) => (
                                          <div
                                                key={idx}
                                                className="border rounded px-2 py-1 d-flex align-items-center"
                                                style={{ minWidth: "120px", justifyContent: "space-between" }}
                                          >
                                                <span>{s}</span>
                                                <Button
                                                      variant="danger"
                                                      size="sm"
                                                      onClick={() => handleDeleteSerial(s)}
                                                >
                                                      <i className="fa fa-trash"></i>
                                                </Button>
                                          </div>
                                    ))}
                              </div>
                        ) : (
                              <p>No serials added yet</p>
                        )}
                  </Modal.Body>

                  <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>
                              Cancel
                        </Button>
                        <button className="btn  text-white" style={{ background: '#ff7d34' }} onClick={handleSave}>
                              Save
                        </button>
                  </Modal.Footer>
            </Modal>
      );
};

export default SerialNumberModal;
