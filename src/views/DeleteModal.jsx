import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteModal = ({ show, onClose, onConfirm, title, message }) => {
      return (
            <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onClose} backdrop="static" keyboard={false} centered>

                  {/* <Modal show={show} onHide={onClose} centered> */}
                  <Modal.Header closeButton>
                        <Modal.Title>{title || "Delete Confirmation"}</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                        <p>{message || "Are you sure you want to delete this item?"}</p>
                  </Modal.Body>

                  <Modal.Footer>

                        <Button variant="danger" onClick={onConfirm}>
                              Delete
                        </Button>
                  </Modal.Footer>
            </Modal>
      );
};

export default DeleteModal;
