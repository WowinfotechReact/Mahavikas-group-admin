







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
import { Navigate, useNavigate } from 'react-router';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { AddUpdatePurchaseOrder, GetPOModel, ValidatePOAndInvoiceNumber } from 'services/Purchase Order/PurchaseOrderApi';
import { AddUpdateAMCPurchaseOrder } from 'services/AMC Purchase Order/AMCPurchaseOrderApi';
import { uploadPdfWithNodeApi } from 'services/UploadImage/UploadImage';
const AMCUploadPOModal = ({ show, onHide, modelRequestData, setIsAddUpdateActionDone }) => {
    const [validationMsg, setValidationMsg] = useState({
        message: '',
        isValid: null, // true = green, false = red
    });
    const [amcPurchaseOrderObj, setAmcPurchaseOrderObj] = useState({
        uploadedPdfUrl: null,
        amcpoNumber: null,

        amcpoUrl: null,
        poPdfPreview: null,
        userKeyID: null,
        amcPurchaseOrderKeyID: null,
        amcKeyID: null,
        amcpoDate: null,


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
            if (modelRequestData?.amcPurchaseOrderKeyID !== null) {
                GetMasterStateModalData(modelRequestData.amcPurchaseOrderKeyID);
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
            amcPurchaseOrderObj.amcpoDate === null || amcPurchaseOrderObj.amcpoDate === '' || amcPurchaseOrderObj.amcpoDate === undefined ||
            amcPurchaseOrderObj.amcpoUrl === null || amcPurchaseOrderObj.amcpoUrl === '' || amcPurchaseOrderObj.amcpoUrl === undefined ||
            amcPurchaseOrderObj.amcpoNumber === null || amcPurchaseOrderObj.amcpoNumber === '' || amcPurchaseOrderObj.amcpoNumber === undefined

        ) {
            setErrors(true);
            isValid = true;
        } else {
            setErrors(false);
            isValid = false;
        }

        const apiParam = {
            userKeyID: user.userKeyID,
            amcKeyID: modelRequestData.amcKeyID,

            amcpoNumber: amcPurchaseOrderObj.amcpoNumber,
            // amcpoUrl: 'https://sample-files.com/downloads/documents/pdf/basic-text.pdf',
            amcpoUrl: amcPurchaseOrderObj.amcpoUrl,
            amcpoDate: amcPurchaseOrderObj.amcpoDate,
        };
        if (!isValid) {
            AddUpdatePurchaseOrderData(apiParam);
        }


    };

    const AddUpdatePurchaseOrderData = async (apiParam) => {
        setLoader(true);
        try {
            let url = '/AddUpdateAMCPurchaseOrder'; // Default URL for Adding Data

            const response = await AddUpdateAMCPurchaseOrder(url, apiParam);
            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    setShowSuccessModal(true);
                    setModelAction(
                        modelRequestData.Action === null || modelRequestData.Action === undefined
                            ? 'AMC PO Added Successfully!'
                            : 'AMC PO Updated Successfully!'
                    ); //Do not change this naming convention

                    setIsAddUpdateActionDone(true);
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

                setAmcPurchaseOrderObj({
                    ...amcPurchaseOrderObj,
                    amcKeyID: ModelData.amcKeyID,
                    amcpoNumber: ModelData.amcpoNumber,
                    amcpoUrl: ModelData.amcpoUrl,
                    amcpoDate: ModelData.amcpoDate,
                    amcPurchaseOrderKeyID: ModelData.amcPurchaseOrderKeyID,
                    poPdfPreview: ModelData.amcpoUrl
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

    const ValidatePOAndInvoiceNumberData = async (type, number) => {
        setLoader(true);

        const apiParam = {
            keyID: null,
            type: type,       // e.g., 'PO'
            number: number    // e.g., user input
        };

        try {
            const response = await ValidatePOAndInvoiceNumber('/ValidatePOAndInvoiceNumber', apiParam);

            if (response?.data?.statusCode === 200) {
                const message = response.data.responseData.data; // Assuming this is a string message
                setValidationMsg({
                    message: message,
                    isValid: message === 'AMC PO Number is valid.'
                });

                setInterval(() => {
                    setValidationMsg({
                        message: '',
                        isValid: message === null
                    });
                }, 3000);
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


    const navigate = useNavigate()
    const closeAllModal = () => {
        onHide()
        // navigate('/quotation-list')
        setShowSuccessModal(false)
    }



    const handleDateChange = (date) => {
        setAmcPurchaseOrderObj((prevState) => ({
            ...prevState,
            amcpoDate: date // Update state with selected date
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

                        AMC  Purchase Order
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                    <>

                        <div className="row">
                            <div className="col-12 mb-3">
                                <label htmlFor="vehicleTypeName" className="form-label">
                                    Enter AMC PO No.
                                    <span style={{ color: 'red' }}>*</span>
                                </label>

                                <input
                                    maxLength={10}
                                    type="text"
                                    className="form-control"
                                    id="vehicleTypeName"
                                    placeholder="Enter AMC  PO No"
                                    value={amcPurchaseOrderObj.amcpoNumber}
                                    onChange={(e) => {
                                        const inputValue = e.target.value;

                                        setAmcPurchaseOrderObj((prev) => ({
                                            ...prev,
                                            amcpoNumber: inputValue
                                        }));

                                        // Clear validation message while typing
                                        setValidationMsg({ message: '', isValid: null });
                                    }}
                                    onBlur={(e) => {
                                        const inputValue = e.target.value;
                                        if (inputValue.trim() !== '') {
                                            ValidatePOAndInvoiceNumberData('AMC_PO', inputValue); // Trigger on blur
                                        } else {
                                            // Handle empty input on blur (optional)
                                            setValidationMsg({
                                                message: 'AMC PO Number is required.',
                                                isValid: false
                                            });
                                        }
                                    }}
                                />
                                {validationMsg.message && (
                                    <span
                                        style={{
                                            color: validationMsg.isValid ? 'green' : 'red',
                                            fontWeight: 100,
                                        }}
                                    >
                                        {validationMsg.message}
                                    </span>
                                )}

                                {error &&
                                    (amcPurchaseOrderObj.amcpoNumber === null ||
                                        amcPurchaseOrderObj.amcpoNumber === undefined ||
                                        amcPurchaseOrderObj.amcpoNumber === '') ? (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                ) : (
                                    ''
                                )}
                            </div>

                            <div className="col-12 mb-3">
                                <div>
                                    <label className="form-label">
                                        AMC Purchase Order Date
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <div>
                                        <DatePicker
                                            value={amcPurchaseOrderObj?.amcpoDate} // Use "selected" instead of "value"
                                            onChange={handleDateChange}
                                            label="From Date"
                                            clearIcon={null}
                                            popperPlacement="bottom-start"
                                        />
                                        {error &&
                                            (amcPurchaseOrderObj.amcpoDate === null ||
                                                amcPurchaseOrderObj.amcpoDate === undefined ||
                                                amcPurchaseOrderObj.amcpoDate === '') ? (
                                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <label className="form-label">
                                    Upload AMC PO PDF
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
                                                moduleName: "AMC",
                                                projectName: "MYOMNAMO",
                                                userId: user.userKeyID,
                                            };

                                            const res = await uploadPdfWithNodeApi(uploadParams);
                                            if (res?.data?.success) {
                                                const s3Url = res.data.s3Url;
                                                setLoader(false);
                                                setAmcPurchaseOrderObj((prev) => ({
                                                    ...prev,
                                                    amcpoUrl: s3Url,
                                                    poPdfPreview: fileURL,
                                                }));

                                            }
                                            setLoader(false);
                                        }
                                    }}
                                />


                                <span>
                                    <small>Note: Max 10MB</small>
                                </span>
                                <br />
                                {error &&
                                    (amcPurchaseOrderObj.amcpoUrl === null ||
                                        amcPurchaseOrderObj.amcpoUrl === undefined ||
                                        amcPurchaseOrderObj.amcpoUrl === '') ? (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                ) : (
                                    ''
                                )}


                                {amcPurchaseOrderObj.poPdfPreview && (
                                    <div className="mt-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <strong>PDF Preview:</strong>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => {
                                                    setAmcPurchaseOrderObj((prev) => ({
                                                        ...prev,
                                                        amcpoUrl: null,
                                                        poPdfPreview: null,
                                                    }));
                                                }}
                                            >
                                                Remove PDF
                                            </button>
                                        </div>

                                        <iframe
                                            src={amcPurchaseOrderObj.poPdfPreview}
                                            title="AMC PO PDF Preview"
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

export default AMCUploadPOModal;
