




import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { ConfigContext } from 'context/ConfigContext';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { Navigate, useNavigate } from 'react-router';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { uploadPdfWithNodeApi } from 'services/UploadImage/UploadImage';

import { AddUpdatePurchaseOrder, GetPOModel, ValidatePOAndInvoiceNumber } from 'services/Purchase Order/PurchaseOrderApi';
const PurchaseOrderPdfUploadModal = ({ show, onHide, modelRequestData, setIsAddUpdateActionDone }) => {
    const [purchaseOrderObj, setPurchaseOrderObj] = useState({
        uploadedPdfUrl: null,
        poNumber: null,
        poNumber: null,
        poUrl: null,
        poPdfPreview: null,
        userKeyID: null,
        purchaseOrderKeyID: null,
        leadKeyID: null,
        poDate: null,


    })

    const [error, setErrors] = useState(null);

    const [remark, setRemark] = useState(''); // Track the remark input
    const [remarkError, setRemarkError] = useState(''); // Track the validation error
    const { setLoader, user } = useContext(ConfigContext);
    const [isFileChanged, setIsFileChanged] = useState(false); // 🔑 flag
    const [modelAction, setModelAction] = useState(false);
    const [validationMsg, setValidationMsg] = useState({
        message: '',
        isValid: null, // true = green, false = red
    });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState();


    useEffect(() => {
        if (modelRequestData?.Action === 'Update') {
            if (modelRequestData?.purchaseOrderKeyID !== null) {
                GetMasterStateModalData(modelRequestData.purchaseOrderKeyID);
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
            purchaseOrderObj.poDate === null || purchaseOrderObj.poDate === '' || purchaseOrderObj.poDate === undefined ||
            purchaseOrderObj.poUrl === null || purchaseOrderObj.poUrl === '' || purchaseOrderObj.poUrl === undefined ||
            purchaseOrderObj.poNumber === null || purchaseOrderObj.poNumber === '' || purchaseOrderObj.poNumber === undefined

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
            purchaseOrderKeyID: purchaseOrderObj.purchaseOrderKeyID,
            poNumber: purchaseOrderObj.poNumber,
            // poUrl: 'https://sample-files.com/downloads/documents/pdf/basic-text.pdf',
            poUrl: isFileChanged ? purchaseOrderObj.poUrl : null, // 🔑 key change

            poDate: purchaseOrderObj.poDate,
        };
        if (!isValid) {
            AddUpdatePurchaseOrderData(apiParam);
        }


    };
    const ValidatePOAndInvoiceNumberData = async (type, number) => {
        setLoader(true);

        const apiParam = {
            keyID: purchaseOrderObj.purchaseOrderKeyID,
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
                        message: '',

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


    const GetMasterStateModalData = async (id) => {
        if (id === undefined) {
            return;
        }

        setLoader(true);
        try {
            const data = await GetPOModel(id);
            if (data?.data?.statusCode === 200) {
                setLoader(false);
                const ModelData = data.data.responseData.data; // Assuming data is an array

                setPurchaseOrderObj({
                    ...purchaseOrderObj,
                    leadKeyID: ModelData.leadKeyID,
                    poNumber: ModelData.poNumber,
                    poUrl: ModelData.poUrl,
                    poDate: ModelData.poDate,
                    purchaseOrderKeyID: ModelData.purchaseOrderKeyID,
                    poPdfPreview: ModelData.poUrl
                });
                setIsFileChanged(false); // reset, since nothing uploaded yet

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
            let url = '/AddUpdatePurchaseOrder'; // Default URL for Adding Data

            const response = await AddUpdatePurchaseOrder(url, apiParam);
            if (response) {
                if (response?.data?.statusCode === 200) {

                    setLoader(false);
                    setShowSuccessModal(true);
                    setModelAction(
                        'Po uploaded successfully!'
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
        // navigate('/quotation-list')
        setShowSuccessModal(false)
    }



    const handleDateChange = (date) => {
        setPurchaseOrderObj((prevState) => ({
            ...prevState,
            poDate: date // Update state with selected date
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

                        Purchase Order
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                    <>

                        <div className="row">
                            <div className="col-12 mb-3">
                                <label htmlFor="vehicleTypeName" className="form-label">
                                    Enter Purchase Order No.
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    maxLength={10}
                                    type="text"
                                    className="form-control"
                                    id="vehicleTypeName"
                                    placeholder="Enter PO No"
                                    value={purchaseOrderObj.poNumber}
                                    onChange={(e) => {
                                        const inputValue = e.target.value;

                                        setPurchaseOrderObj((prev) => ({
                                            ...prev,
                                            poNumber: inputValue
                                        }));

                                        // Clear validation message while typing
                                        setValidationMsg({ message: '', isValid: null });
                                    }}
                                    onBlur={(e) => {
                                        const inputValue = e.target.value;
                                        if (inputValue.trim() !== '') {
                                            ValidatePOAndInvoiceNumberData('PO', inputValue); // Trigger on blur
                                        } else {
                                            // Handle empty input on blur (optional)
                                            setValidationMsg({
                                                message: ' PO Number is required.',
                                                isValid: false
                                            });
                                        }
                                    }}
                                />

                                {error &&
                                    (purchaseOrderObj.poNumber === null ||
                                        purchaseOrderObj.poNumber === undefined ||
                                        purchaseOrderObj.poNumber === '') ? (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                ) : (
                                    ''
                                )}
                                {validationMsg.message && (
                                    <span
                                        style={{
                                            color: validationMsg.isValid ? ' green' : 'red',
                                            fontWeight: 100,
                                        }}
                                    >
                                        {validationMsg.message}
                                    </span>
                                )}
                            </div>

                            <div className="col-12 mb-3">
                                <div>
                                    <label className="form-label">
                                        Purchase Order Date
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <div>
                                        <DatePicker
                                            value={purchaseOrderObj?.poDate} // Use "selected" instead of "value"
                                            onChange={handleDateChange}
                                            label="From Date"
                                            clearIcon={null}
                                            popperPlacement="bottom-start"
                                        />
                                        {error &&
                                            (purchaseOrderObj.poDate === null ||
                                                purchaseOrderObj.poDate === undefined ||
                                                purchaseOrderObj.poDate === '') ? (
                                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                        ) : (
                                            ''
                                        )}
                                    </div>

                                    <span style={{ color: 'red' }}>
                                        {errorMessage}
                                    </span>
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <label className="form-label">
                                    Upload PO PDF
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
                                                setPurchaseOrderObj((prev) => ({
                                                    ...prev,
                                                    poUrl: s3Url,
                                                    poPdfPreview: fileURL
                                                }));
                                                setIsFileChanged(true); // 🔑 user uploaded new file

                                            }
                                            setLoader(false);
                                        }
                                    }}
                                />

                                {error &&
                                    (purchaseOrderObj.poUrl === null ||
                                        purchaseOrderObj.poUrl === undefined ||
                                        purchaseOrderObj.poUrl === '') ? (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                ) : (
                                    ''
                                )}

                                <span>
                                    <small>Note: Max 10MB</small>
                                </span>
                                {purchaseOrderObj.poPdfPreview && (
                                    <div className="mt-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <strong>Preview:</strong>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => {
                                                    setPurchaseOrderObj((prev) => ({
                                                        ...prev,
                                                        poUrl: null,
                                                        poPdfPreview: null
                                                    }));
                                                }}
                                            >
                                                Remove PDF
                                            </button>
                                        </div>
                                        <iframe
                                            src={purchaseOrderObj.poPdfPreview}
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

export default PurchaseOrderPdfUploadModal;
