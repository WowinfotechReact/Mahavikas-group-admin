import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ImageModal = ({ show, onHide, imageUrl, title }) => {
  return (
    <Modal style={{ zIndex: 1300 }} show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Image Preview"}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <img
          src={imageUrl}
          alt="Preview"
          style={{ maxWidth: '100%', height: '45vh', borderRadius: '5px', zIndex: '1300' }}
        />
      </Modal.Body>

    </Modal>
  );
};

export default ImageModal;
