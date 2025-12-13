
import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const HelpAndSupportModal = ({ show, onHide, selectedQuery, onSubmit }) => {
      const [replyText, setReplyText] = useState("");

      useEffect(() => {
            if (show) {
                  setReplyText("");
            }
      }, [show]);

      if (!selectedQuery) return null;

      const handleSubmit = () => {
            onSubmit(replyText);
      };
      return (

            <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>

                  <Modal.Header closeButton>
                        <Modal.Title>Reply to Query</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                        <div className="mb-2">
                              <strong>Ticket No:</strong> {selectedQuery.ticketNo}
                        </div>

                        <div className="mb-3">
                              <strong>Query:</strong> {selectedQuery.query}
                        </div>

                        <textarea
                              className="form-control"
                              rows={4}
                              placeholder="Enter reply here..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                        />
                  </Modal.Body>

                  <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>
                              Cancel
                        </Button>
                        <Button
                              variant="primary"
                              // disabled={!answer.trim()}
                              onClick={handleSubmit}
                        >
                              Submit
                        </Button>
                  </Modal.Footer>
            </Modal>
      );
};

export default HelpAndSupportModal;

