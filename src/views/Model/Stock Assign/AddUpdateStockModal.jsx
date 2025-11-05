








import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Lottie from "lottie-react";
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { ApproveOrRejectQuotation } from 'services/Quotation Module/AddUpdateQuotationApi';
import { ConfigContext } from 'context/ConfigContext';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { Navigate, useNavigate } from 'react-router';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { AddUpdatePurchaseOrder, GetPOModel } from 'services/Purchase Order/PurchaseOrderApi';
import { AddUpdateModelStock, GetModelStockModel } from 'services/Stock Assign/StockAssignApi';
const AddUpdateStockModal = ({ show, onHide, modelRequestData, setIsAddUpdateActionDone }) => {

    const [stockAssignObj, setStockAssignObj] = useState({

        poPdfPreview: null,
        userKeyID: null,
        modelID: null,
        quantity: null,
        modelStockKeyID: null,
        stockReceiveDate: null,
        challanURL: null,
        serialNumber: null,





    })

    const [error, setErrors] = useState(null);

    const [remark, setRemark] = useState(''); // Track the remark input
    const [remarkError, setRemarkError] = useState(''); // Track the validation error
    const { setLoader, user } = useContext(ConfigContext);

    const [modelAction, setModelAction] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState();


    useEffect(() => {
        if (modelRequestData?.Action === 'Update') {
            if (modelRequestData?.modelStockKeyID !== null) {
                GetModelStockModelData(modelRequestData.modelStockKeyID);
            }
        }
    }, [modelRequestData?.Action]);

    const handleClose = () => {
        setRemark('');
        setRemarkError('');
        onHide();
    };

    const handleSubmit = async () => {
        debugger
        let isValid = false
        if (
            stockAssignObj.quantity === null || stockAssignObj.quantity === '' || stockAssignObj.quantity === undefined ||
            stockAssignObj.challanURL === null || stockAssignObj.challanURL === '' || stockAssignObj.challanURL === undefined ||
            stockAssignObj.stockReceiveDate === null || stockAssignObj.stockReceiveDate === '' || stockAssignObj.stockReceiveDate === undefined ||
            stockAssignObj.serialNumber === null || stockAssignObj.serialNumber === '' || stockAssignObj.serialNumber === undefined

        ) {
            setErrors(true);
            isValid = true;
        } else {
            setErrors(false);
            isValid = false;
        }

        const apiParam = {
            userKeyID: user.userKeyID,

            quantity: stockAssignObj.quantity,
            modelID: stockAssignObj.modelID,
            modelStockKeyID: stockAssignObj.modelStockKeyID,
            stockReceiveDate: stockAssignObj.stockReceiveDate,
            // challanURL: 'https://sample-files.com/downloads/documents/pdf/basic-text.pdf',
            challanURL: stockAssignObj.challanURL,
            serialNumber: stockAssignObj.serialNumber,
        };
        if (!isValid) {
            AddUpdatePurchaseOrderData(apiParam);
        }


    };

    const GetModelStockModelData = async (id) => {
        if (id === undefined) {
            return;
        }
        setLoader(true);

        try {
            const data = await GetModelStockModel(id);
            if (data?.data?.statusCode === 200) {
                setLoader(false);
                const ModelData = data.data.responseData.data; // Assuming data is an array

                setStockAssignObj({
                    ...stockAssignObj,


                    quantity: ModelData.quantity,
                    modelID: ModelData.modelID,
                    modelStockKeyID: ModelData.modelStockKeyID,
                    stockReceiveDate: ModelData.stockReceiveDate,
                    // challanURL: 'https://sample-files.com/downloads/documents/pdf/basic-text.pdf',
                    challanURL: ModelData.challanURL,
                    serialNumber: ModelData.serialNumber,
                });
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

    const AddUpdatePurchaseOrderData = async (apiParam) => {
        // debugger
        setLoader(true);
        try {
            let url = '/AddUpdateModelStock'; // Default URL for Adding Data

            const response = await AddUpdateModelStock(url, apiParam);
            if (response) {
                if (response?.data?.statusCode === 200) {
                    debugger
                    setLoader(false);
                    setShowSuccessModal(true);
                    setModelAction(
                        'Stock Assigned successfully!'
                    );
                    setIsAddUpdateActionDone(true)
                } else {
                    setLoader(false);
                    setErrorMessage(response?.response?.data?.errorMessage);
                }
            }
        } catch (error) {
            setLoader(false);
            console.error(error);
        }
    };


    const navigate = useNavigate()
    const closeAllModal = () => {
        onHide()
        setShowSuccessModal(false)
    }



    const handleDateChange = (date) => {
        setStockAssignObj((prevState) => ({
            ...prevState,
            stockReceiveDate: date // Update state with selected date
        }));
    };


    return (
        <>
            <Modal
                show={show}
                onHide={() => {
                    onHide();
                    handleClose();
                }}
                backdrop="static"
                keyboard={false}
                centered
                style={{ zIndex: '1300', }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modelRequestData.Action === 'Update' ? ' Update Stock ' : 'Add Stock'}

                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                    <>

                        <div className="row">
                            <div className="col-12 mb-3">
                                <label htmlFor="vehicleTypeName" className="form-label">
                                    Enter Quantity.
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    maxLength={3}
                                    type="text"
                                    className="form-control"
                                    id="vehicleTypeName"
                                    placeholder="Enter Quantity"
                                    value={stockAssignObj.quantity}
                                    onChange={(e) => {
                                        setErrorMessage(false);
                                        let inputValue = e.target.value;

                                        // Remove everything that is not a digit (0-9)
                                        const cleanedValue = inputValue.replace(/[^0-9]/g, '');

                                        setStockAssignObj((prev) => ({
                                            ...prev,
                                            quantity: cleanedValue
                                        }));
                                    }}
                                />

                                {error &&
                                    (stockAssignObj.quantity === null ||
                                        stockAssignObj.quantity === undefined ||
                                        stockAssignObj.quantity === '') ? (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                ) : (
                                    ''
                                )}
                            </div>
                            <div className="col-12 mb-3">
                                <div>
                                    <label className="form-label">
                                        Enter Serial No
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <div>
                                        <input
                                            maxLength={10}
                                            type="text"
                                            className="form-control"
                                            id="vehicleTypeName"
                                            placeholder="Enter Serial No"
                                            value={stockAssignObj.serialNumber}
                                            onChange={(e) => {
                                                setErrorMessage(false);
                                                let inputValue = e.target.value;

                                                // Remove everything that is not a digit (0-9)
                                                const cleanedValue = inputValue.replace(/[^0-9]/g, '');

                                                setStockAssignObj((prev) => ({
                                                    ...prev,
                                                    serialNumber: cleanedValue
                                                }));
                                            }}
                                        />

                                        {error &&
                                            (stockAssignObj.serialNumber === null ||
                                                stockAssignObj.serialNumber === undefined ||
                                                stockAssignObj.serialNumber === '') ? (
                                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 mb-3">
                                <div>
                                    <label className="form-label">

                                        Received Date
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <div>
                                        <DatePicker
                                            value={stockAssignObj?.stockReceiveDate} // Use "selected" instead of "value"
                                            onChange={handleDateChange}
                                            label="From Date"
                                            clearIcon={null}
                                            popperPlacement="bottom-start"
                                        />
                                        {error &&
                                            (stockAssignObj.stockReceiveDate === null ||
                                                stockAssignObj.stockReceiveDate === undefined ||
                                                stockAssignObj.stockReceiveDate === '') ? (
                                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label">
                                    Upload Challan
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="form-control"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file && file.type === 'application/pdf') {
                                            const fileURL = URL.createObjectURL(file);
                                            setStockAssignObj((prev) => ({
                                                ...prev,
                                                challanURL: file,
                                                poPdfPreview: fileURL
                                            }));
                                        }
                                    }}
                                />
                                {error &&
                                    (stockAssignObj.challanURL === null ||
                                        stockAssignObj.challanURL === undefined ||
                                        stockAssignObj.challanURL === '') ? (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                ) : (
                                    ''
                                )}
                                {stockAssignObj.poPdfPreview && (
                                    <div className="mt-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <strong>Preview:</strong>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => {
                                                    setStockAssignObj((prev) => ({
                                                        ...prev,
                                                        challanURL: null,
                                                        poPdfPreview: null
                                                    }));
                                                }}
                                            >
                                                Remove PDF
                                            </button>
                                        </div>
                                        <iframe
                                            src={stockAssignObj.poPdfPreview}
                                            title="PO PDF Preview"
                                            width="100%"
                                            height="400px"
                                            style={{ border: '1px solid #ccc', borderRadius: '4px' }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>


                    </>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-end">

                    <button style={{ background: '#ffaa33' }} onClick={handleSubmit} className='btn text-white' >
                        Submit
                    </button>




                </Modal.Footer>
            </Modal>
            <SuccessPopupModal
                show={showSuccessModal}
                onHide={() => closeAllModal()}
                setShowSuccessModal={setShowSuccessModal}
                modelAction={modelAction}
            />
        </>
    );
};

export default AddUpdateStockModal;

