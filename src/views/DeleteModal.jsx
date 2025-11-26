import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import "./DeleteModal.css"; // ✅ Add this

const DeleteModal = ({ show, onClose, onConfirm, title, message }) => {
      return (
            <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onClose} backdrop="static" keyboard={false} centered>

                  <Modal.Body className="text-center py-4">

                        {/* ✅ Animated Delete Icon */}
                        <div className="delete-icon-container mb-3">
                              <FaTrashAlt className="delete-icon" />
                        </div>

                        {/* ✅ Title */}
                        <h5 className="fw-bold">
                              {title || "Delete Confirmation"}
                        </h5>

                        {/* ✅ Message */}
                        <p className="text-muted mt-2 mb-4">
                              {message || "Are you sure you want to delete this item? This action cannot be undone."}
                        </p>

                        {/* ✅ Buttons */}
                        <div className="d-flex justify-content-center gap-2">
                              <Button variant="secondary" onClick={onClose}>
                                    Cancel
                              </Button>
                              <Button variant="danger" onClick={onConfirm}>
                                    Delete
                              </Button>
                        </div>
                  </Modal.Body>
            </Modal>
      );
};

export default DeleteModal;
