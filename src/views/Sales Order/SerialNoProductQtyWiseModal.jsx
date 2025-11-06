

import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';

const SerialNoProductQtyWiseModal = ({ show, onHide, setIsAddUpdateActionDone, onSave, modelRequestData,
}) => {

    const totalQty = modelRequestData?.quantity || 0;

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

    const handleAddSerial = () => {
        const qtyNum = Number(inputQty);

        if (!inputSerial.trim() || !qtyNum || qtyNum <= 0) return;

        if (serialNumbers.length + qtyNum > totalQty) {
            setError(`Cannot exceed total quantity. Remaining: ${totalQty - serialNumbers.length}`);
            return;
        }

        const newSerials = Array(qtyNum).fill(inputSerial.trim());
        setSerialNumbers(prev => [...prev, ...newSerials]);
        setInputSerial('');
        setInputQty('');
        setError('');
    };

    const handleDelete = (indexToRemove) => {
        const newList = serialNumbers.filter((_, idx) => idx !== indexToRemove);
        setSerialNumbers(newList);
        setError('');
    };

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
        setError();
    }


    return (
        <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={closeModal} backdrop="static" keyboard={false} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <h3 className="text-center">
                        Add Serial To Product
                    </h3>

                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <div className="container">

                    {/* Product Info */}
                    <div className="mb-3 p-3 bg-light rounded border">
                        <div className="row">
                            {/* Left Column */}
                            <div className="col-md-4 mb-2">
                                <p className="mb-1"><strong>Product:</strong> {modelRequestData.productName}</p>
                                <p className="mb-1"><strong>Manufacturer:</strong> {modelRequestData.manufacturerName}</p>
                            </div>

                            {/* Center Column */}
                            <div className="col-md-4 mb-2">
                                <p className="mb-1"><strong>Variant:</strong> {modelRequestData.variantName}</p>
                                <p className="mb-1"><strong>Model:</strong> {modelRequestData.modelName}</p>
                            </div>

                            {/* Right Column */}
                            <div className="col-md-4 mb-2">
                                <p className="mb-1"><strong>Quantity:</strong> {modelRequestData.quantity} {modelRequestData.unit}</p>
                                <p className="mb-1"><strong>Rate:</strong> ₹{modelRequestData.rate}</p>
                            </div>
                        </div>
                        <span className='text-center d-flex justify-content-center' style={{ color: 'red' }}> {errors}</span>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Serial Number</label>
                            <input
                                type="text"
                                maxLength={8}
                                className="form-control"
                                value={inputSerial}
                                placeholder="Enter Serial Number"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d*$/.test(val)) setInputSerial(val);
                                }}
                                disabled={remainingQty <= 0}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Qty</label>
                            <input
                                type="number"
                                className="form-control"
                                value={inputQty}
                                placeholder="Enter Quantity"
                                onChange={(e) => setInputQty(e.target.value)}
                                disabled={remainingQty <= 0}
                            />
                        </div>

                        <div className="col-md-2 d-flex align-items-end">
                            <button className='btn text-white' style={{ background: '#ff7d34' }} onClick={handleAddSerial} disabled={remainingQty <= 0}>
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Preview Serial List with Delete */}
                    <div className="row">
                        {serialNumbers.map((serial, idx) => (
                            <div className="col-md-3 mb-2" key={idx}>
                                <div className="border p-2 rounded bg-light d-flex justify-content-between align-items-center">
                                    <div><strong>No:</strong> {idx + 1}</div>
                                    <div><strong>Serial:</strong> {serial}</div>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-danger ms-2"
                                        onClick={() => handleDelete(idx)}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Close
                </Button>
                <button type="submit" className="btn  text-center text-white" style={{ background: '#ffaa33' }} onClick={() => handleSave()}>
                    Submit
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default SerialNoProductQtyWiseModal;
