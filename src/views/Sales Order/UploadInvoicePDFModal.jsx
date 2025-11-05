import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Lottie from "lottie-react";
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import Approval from '../../assets/images/approval.json';
import Rejected from '../../assets/images/rejected.json';
import { ApproveOrRejectQuotation } from 'services/Quotation Module/AddUpdateQuotationApi';
import { ConfigContext } from 'context/ConfigContext';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { AddUpdatePurchaseOrder, GetPOModel, ValidatePOAndInvoiceNumber } from 'services/Purchase Order/PurchaseOrderApi';
import { AddUpdateInvoice, GetInvoiceModel } from 'services/Invoice Module/InvoiceApi';
import { uploadPdfWithNodeApi } from 'services/UploadImage/UploadImage';
const UploadInvoicePDFModal = ({ show, onHide, modelRequestData, setIsAddUpdateActionDone }) => {
    const [validationMsg, setValidationMsg] = useState({
        message: '',
        isValid: null, // true = green, false = red
    });
    const [invoiceObj, setInvoiceObj] = useState({
        invoiceAmount: null,
        invoiceNumber: null,
        invoicePDFUpload: null,
        poPdfPreview: null,
        userKeyID: null,
        invoiceKeyID: null,
        leadKeyID: null,
        invoiceDate: null,
    })
    const [isFileChanged, setIsFileChanged] = useState(false); // 🔑 flag

    const [error, setErrors] = useState(null);

    const [remark, setRemark] = useState(''); // Track the remark input
    const [remarkError, setRemarkError] = useState(''); // Track the validation error
    const { setLoader, user } = useContext(ConfigContext);

    const [modelAction, setModelAction] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState();


    useEffect(() => {
        if (modelRequestData?.Action === 'Update') {
            if (modelRequestData?.invoiceKeyID !== null) {
                GetInvoiceModelData(modelRequestData.invoiceKeyID);
            }
        }
    }, [modelRequestData?.Action]);

    const handleClose = () => {
        setRemark('');
        setRemarkError('');
        onHide();
    };


    const handleSubmit = async () => {

        let isValid = false
        if (
            invoiceObj.invoiceDate === null || invoiceObj.invoiceDate === '' || invoiceObj.invoiceDate === undefined ||
            invoiceObj.invoicePDFUpload === null || invoiceObj.invoicePDFUpload === '' || invoiceObj.invoicePDFUpload === undefined ||
            invoiceObj.invoiceNumber === null || invoiceObj.invoiceNumber === '' || invoiceObj.invoiceNumber === undefined ||
            invoiceObj.invoiceAmount === null || invoiceObj.invoiceAmount === '' || invoiceObj.invoiceAmount === undefined

        ) {
            setErrors(true);
            isValid = true;
        } else {
            setErrors(false);
            isValid = false;
        }

        const apiParam = {
            userKeyID: user.userKeyID,
            leadKeyID: modelRequestData.leadKeyID,

            invoiceKeyID: invoiceObj.invoiceKeyID,
            invoiceNumber: invoiceObj.invoiceNumber,
            invoiceAmount: invoiceObj.invoiceAmount,
            // invoicePDFUpload: 'https://sample-files.com/downloads/documents/pdf/basic-text.pdf',
            // invoicePDFUpload: invoiceObj.invoicePDFUpload,
            invoicePDFUpload: isFileChanged ? invoiceObj.invoicePDFUpload : null, // 🔑 key change

            invoiceDate: invoiceObj.invoiceDate,

        };
        if (!isValid) {
            AddUpdatePurchaseOrderData(apiParam);
        }


    };


    const ValidatePOAndInvoiceNumberData = async (type, number) => {
        setLoader(true);

        const apiParam = {
            keyID: invoiceObj.invoiceKeyID,
            type: type,       // e.g., 'PO'
            number: number    // e.g., user input
        };

        try {
            const response = await ValidatePOAndInvoiceNumber('/ValidatePOAndInvoiceNumber', apiParam);

            if (response?.data?.statusCode === 200) {
                const message = response.data.responseData.data; // Assuming this is a string message
                setValidationMsg({
                    message: message,
                    isValid: message === 'PO Number is valid.'
                });

                setInterval(() => {
                    setValidationMsg({
                        message: null,
                        // isValid: message === 'PO Number is valid.'
                    });
                }, 3000)
            } else {
                const errorMessage = response?.data?.errorMessage || 'Validation failed.';
                setValidationMsg({
                    message: errorMessage,
                    isValid: false
                });
            }
        } catch (error) {
            console.error(error);
            setValidationMsg({
                message: 'Something went wrong.',
                isValid: false
            });
        } finally {
            setLoader(false);
        }
    };

    const GetInvoiceModelData = async (id) => {
        if (id === undefined) {
            return;
        }
        setLoader(true);

        try {
            const data = await GetInvoiceModel(id);
            if (data?.data?.statusCode === 200) {
                setLoader(false);
                const ModelData = data.data.responseData.data; // Assuming data is an array

                setInvoiceObj({
                    ...invoiceObj,
                    leadKeyID: ModelData.leadKeyID,
                    invoiceNumber: ModelData.invoiceNumber,
                    invoicePDFUpload: ModelData.invoicePDFUpload,
                    invoiceKeyID: ModelData.invoiceKeyID,
                    invoiceDate: ModelData.invoiceDate,
                    invoiceAmount: ModelData.invoiceAmount,
                    purchaseOrderKeyID: ModelData.purchaseOrderKeyID,
                    poPdfPreview: ModelData.invoicePDFUpload
                    // poPdfPreview: ModelData.invoicePDFUpload
                });
                setIsFileChanged(false);
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
            let url = '/AddUpdateInvoice'; // Default URL for Adding Data

            const response = await AddUpdateInvoice(url, apiParam);
            if (response) {
                if (response?.data?.statusCode === 200) {
                    // debugger
                    setLoader(false);
                    setShowSuccessModal(true);
                    setModelAction(
                        'Invoice uploaded successfully!'
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
        // navigate('/sales-order-management')
        setShowSuccessModal(false)
    }



    const handleDateChange = (date) => {
        setErrorMessage(false)
        setInvoiceObj((prevState) => ({
            ...prevState,
            invoiceDate: date // Update state with selected date
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

                        Invoice Upload
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                    <>

                        <div className="row">
                            <div className="col-12 mb-3">
                                <label htmlFor="vehicleTypeName" className="form-label">
                                    Enter Invoice No.
                                    <span style={{ color: 'red' }}>*</span>
                                </label>


                                <input
                                    maxLength={10}
                                    type="text"
                                    className="form-control"
                                    id="vehicleTypeName"
                                    placeholder="Enter Invoice No."
                                    value={invoiceObj.invoiceNumber}
                                    onChange={(e) => {
                                        setErrorMessage(false)
                                        const inputValue = e.target.value;

                                        setInvoiceObj((prev) => ({
                                            ...prev,
                                            invoiceNumber: inputValue
                                        }));

                                        // Clear validation message while typing
                                        setValidationMsg({ message: '', isValid: null });
                                    }}
                                    onBlur={(e) => {
                                        const inputValue = e.target.value;
                                        if (inputValue.trim() !== '') {
                                            ValidatePOAndInvoiceNumberData('Invoice', inputValue); // Trigger on blur
                                        } else {
                                            // Handle empty input on blur (optional)
                                            setValidationMsg({
                                                message: 'Invoice Number is required.',
                                                isValid: false
                                            });
                                        }
                                    }}
                                />

                                {validationMsg.message && (
                                    <span
                                        style={{
                                            color: validationMsg.isValid ? 'red' : 'green',
                                            fontWeight: 3000,
                                        }}
                                    >
                                        {validationMsg.message}
                                    </span>
                                )}
                                {error &&
                                    (invoiceObj.invoiceNumber === null ||
                                        invoiceObj.invoiceNumber === undefined ||
                                        invoiceObj.invoiceNumber === '') ? (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                ) : (
                                    ''
                                )}
                            </div>

                            <div className="col-12 mb-3">
                                <div>
                                    <label className="form-label">
                                        Invoice Date
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <div>
                                        <DatePicker
                                            value={invoiceObj?.invoiceDate} // Use "selected" instead of "value"
                                            onChange={handleDateChange}
                                            label="From Date"
                                            clearIcon={null}
                                            popperPlacement="bottom-start"
                                        />
                                        {error &&
                                            (invoiceObj.invoiceDate === null ||
                                                invoiceObj.invoiceDate === undefined ||
                                                invoiceObj.invoiceDate === '') ? (
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
                                        Amount ⟨₹⟩
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <div>
                                        <input
                                            maxLength={10}
                                            type="text"
                                            className="form-control"
                                            id="vehicleTypeName"
                                            placeholder="Enter Amt"
                                            value={invoiceObj.invoiceAmount}
                                            onChange={(e) => {
                                                setErrorMessage(false);
                                                let inputValue = e.target.value;

                                                // Remove everything that is not a digit (0-9)
                                                const cleanedValue = inputValue.replace(/[^0-9]/g, '');

                                                setInvoiceObj((prev) => ({
                                                    ...prev,
                                                    invoiceAmount: cleanedValue
                                                }));
                                            }}
                                        />

                                        {error &&
                                            (invoiceObj.invoiceAmount === null ||
                                                invoiceObj.invoiceAmount === undefined ||
                                                invoiceObj.invoiceAmount === '') ? (
                                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <label className="form-label">
                                    Upload Invoice
                                    <span style={{ color: 'red' }}>*</span>
                                </label>


                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="form-control"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        const maxSizeInBytes = 10 * 1024 * 1024;
                                        setLoader(true);

                                        if (file) {
                                            if (file.type !== "application/pdf") {
                                                alert("Only PDF files are allowed.");
                                                return;
                                            }
                                            if (file.size > maxSizeInBytes) {
                                                alert("PDF size must be less than or equal to 10 MB.");
                                                return;
                                            }

                                            const fileURL = URL.createObjectURL(file);

                                            const uploadParams = {
                                                pdfFile: file,
                                                moduleName: "PO",
                                                projectName: "MYOMNAMO",
                                                userId: user.userKeyID,
                                            };

                                            const res = await uploadPdfWithNodeApi(uploadParams);
                                            if (res?.data?.success) {
                                                const s3Url = res.data.s3Url;
                                                setLoader(false);
                                                setInvoiceObj((prev) => ({
                                                    ...prev,
                                                    invoicePDFUpload: s3Url,
                                                    poPdfPreview: fileURL
                                                }));
                                                setIsFileChanged(true); // 🔑 user uploaded new file


                                            }
                                            setLoader(false);
                                        }
                                    }}
                                />

                                {error &&
                                    (invoiceObj.invoicePDFUpload === null ||
                                        invoiceObj.invoicePDFUpload === undefined ||
                                        invoiceObj.invoicePDFUpload === '') ? (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                ) : (
                                    ''
                                )}

                                <span>
                                    <small>Note: Max 10MB</small>
                                </span>
                                <br />
                                <span style={{ color: 'red' }}>{errorMessage} </span>
                                {invoiceObj.poPdfPreview && (
                                    <div className="mt-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <strong>Preview:</strong>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => {
                                                    setInvoiceObj((prev) => ({
                                                        ...prev,
                                                        invoicePDFUpload: null,
                                                        poPdfPreview: null
                                                    }));
                                                }}
                                            >
                                                Remove PDF
                                            </button>
                                        </div>
                                        <iframe
                                            src={invoiceObj.poPdfPreview}
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

export default UploadInvoicePDFModal;
