// ZoneCreateModal.jsx
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function ZoneCreateModal({ show, onHide, onCreate }) {
      const [name, setName] = useState("");

      const handleCreate = () => {
            const t = name.trim();
            if (!t) return alert("Zone name required");
            onCreate(t);
            setName("");
      };

      return (
            <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
                  <Modal.Header closeButton><Modal.Title>Add Zone</Modal.Title></Modal.Header>
                  <Modal.Body>
                        <Form.Group>
                              <Form.Label>Zone Name</Form.Label>
                              <Form.Control value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter zone name" />
                        </Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>Cancel</Button>
                        <Button variant="primary" onClick={handleCreate}>Create</Button>
                  </Modal.Footer>
            </Modal>
      );
}
