

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
import { AddUpdatePurchaseOrder, GetPOModel } from 'services/Purchase Order/PurchaseOrderApi';
import { AddUpdateInvoice } from 'services/Invoice Module/InvoiceApi';
import { AddUpdateAMCInvoice, GetAMCInvoiceModel } from 'services/AMC Invoice/AMCInvoiceApi';
import { uploadPdfWithNodeApi } from 'services/UploadImage/UploadImage';
const AMCAddUpdateInvoiceModal = ({ show, onHide, modelRequestData, setIsAddUpdateActionDone }) => {

    const [amcInvoiceObj, setAmcInvoiceObj] = useState({
        amcInvoiceAmount: null,
        amcInvoiceNumber: null,
        amcInvoicePDFUpload: null,
        poPdfPreview: null,
        userKeyID: null,
        amcInvoiceKeyID: null,
        amcKeyID: null,
        amcInvoiceDate: null,
    })

    const [error, setErrors] = useState(null);
    const [isFileChanged, setIsFileChanged] = useState(false); // 🔑 flag
    const [remark, setRemark] = useState(''); // Track the remark input
    const [remarkError, setRemarkError] = useState(''); // Track the validation error
    const { setLoader, user } = useContext(ConfigContext);

    const [modelAction, setModelAction] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const location = useLocation()

    useEffect(() => {
        if (modelRequestData?.Action === 'Update') {
            if (modelRequestData?.amcInvoiceKeyID !== null) {
                GetAMCInvoiceModelData(modelRequestData.amcInvoiceKeyID);
            }
        }
    }, [modelRequestData?.Action]);

    const handleClose = () => {
        setRemark('');
        setRemarkError('');
        onHide();
    };
    console.log(location?.state?.amcKeyID, 'ffffffffffff');


    const handleSubmit = async () => {

        let isValid = false
        if (
            amcInvoiceObj.amcInvoiceDate === null || amcInvoiceObj.amcInvoiceDate === '' || amcInvoiceObj.amcInvoiceDate === undefined ||
            amcInvoiceObj.amcInvoicePDFUpload === null || amcInvoiceObj.amcInvoicePDFUpload === '' || amcInvoiceObj.amcInvoicePDFUpload === undefined ||
            amcInvoiceObj.amcInvoiceNumber === null || amcInvoiceObj.amcInvoiceNumber === '' || amcInvoiceObj.amcInvoiceNumber === undefined ||
            amcInvoiceObj.amcInvoiceAmount === null || amcInvoiceObj.amcInvoiceAmount === '' || amcInvoiceObj.amcInvoiceAmount === undefined

        ) {
            setErrors(true);
            isValid = true;
        } else {
            setErrors(false);
            isValid = false;
        }

        const apiParam = {
            userKeyID: user.userKeyID,
            amcKeyID: location?.state?.amcKeyID,

            amcInvoiceKeyID: amcInvoiceObj.amcInvoiceKeyID,
            amcInvoiceNumber: amcInvoiceObj.amcInvoiceNumber,
            amcInvoiceAmount: amcInvoiceObj.amcInvoiceAmount,
            amcInvoicePDFUpload: isFileChanged ? amcInvoiceObj.amcInvoicePDFUpload : null,
            // amcInvoicePDFUpload: 'https://sample-files.com/downloads/documents/pdf/basic-text.pdf',

            amcInvoiceDate: amcInvoiceObj.amcInvoiceDate,
        };
        if (!isValid) {
            AddUpdateAMCInvoiceData(apiParam);
        }


    };

    const GetAMCInvoiceModelData = async (id) => {
        if (id === undefined) {
            return;
        }

        setLoader(true);
        try {
            const data = await GetAMCInvoiceModel(id);
            if (data?.data?.statusCode === 200) {
                setLoader(false);
                const ModelData = data.data.responseData.data; // Assuming data is an array

                setAmcInvoiceObj({
                    ...amcInvoiceObj,
                    amcKeyID: ModelData.amcKeyID,
                    amcInvoiceNumber: ModelData.amcInvoiceNumber,
                    amcInvoiceAmount: ModelData.amcInvoiceAmount,
                    amcInvoicePDFUpload: ModelData.amcInvoicePDFUpload,
                    amcInvoiceDate: ModelData.amcInvoiceDate,
                    purchaseOrderKeyID: ModelData.purchaseOrderKeyID,
                    amcInvoiceKeyID: ModelData.amcInvoiceKeyID,
                    poPdfPreview: ModelData.amcInvoicePDFUpload
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

    const AddUpdateAMCInvoiceData = async (apiParam) => {
        // debugger
        setLoader(true);
        try {
            let url = '/AddUpdateAMCInvoice'; // Default URL for Adding Data

            const response = await AddUpdateAMCInvoice(url, apiParam);
            if (response) {
                if (response?.data?.statusCode === 200) {
                    // debugger
                    setLoader(false);
                    setShowSuccessModal(true);
                    setModelAction(
                        'AMC Invoice uploaded successfully!'
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
        setAmcInvoiceObj((prevState) => ({
            ...prevState,
            amcInvoiceDate: date // Update state with selected date
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
                                    Enter AMC Invoice No.
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    maxLength={13}
                                    type="text"
                                    className="form-control"
                                    id="vehicleTypeName"
                                    placeholder="Enter AMC Invoice No."
                                    value={amcInvoiceObj.amcInvoiceNumber}
                                    onChange={(e) => {
                                        setErrorMessage(false);
                                        let inputValue = e.target.value;

                                        // No need to clean the value — accept all characters
                                        setAmcInvoiceObj((prev) => ({
                                            ...prev,
                                            amcInvoiceNumber: inputValue
                                        }));
                                    }}
                                />

                                {error &&
                                    (amcInvoiceObj.amcInvoiceNumber === null ||
                                        amcInvoiceObj.amcInvoiceNumber === undefined ||
                                        amcInvoiceObj.amcInvoiceNumber === '') ? (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                ) : (
                                    ''
                                )}
                            </div>
                            <div className="col-12 mb-3">
                                <div>
                                    <label className="form-label">
                                        AMC  Invoice Date
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <div>
                                        <DatePicker
                                            value={amcInvoiceObj?.amcInvoiceDate} // Use "selected" instead of "value"
                                            onChange={handleDateChange}
                                            label="From Date"
                                            clearIcon={null}
                                            popperPlacement="bottom-start"
                                        />
                                        {error &&
                                            (amcInvoiceObj.amcInvoiceDate === null ||
                                                amcInvoiceObj.amcInvoiceDate === undefined ||
                                                amcInvoiceObj.amcInvoiceDate === '') ? (
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
                                        AMC Invoice Amt ⟨₹⟩
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <div>
                                        <input
                                            maxLength={10}
                                            type="text"
                                            className="form-control"
                                            id="vehicleTypeName"
                                            placeholder="Enter Amt"
                                            value={amcInvoiceObj.amcInvoiceAmount}
                                            onChange={(e) => {
                                                setErrorMessage(false);
                                                let inputValue = e.target.value;

                                                // Remove everything that is not a digit (0-9)
                                                const cleanedValue = inputValue.replace(/[^0-9]/g, '');

                                                setAmcInvoiceObj((prev) => ({
                                                    ...prev,
                                                    amcInvoiceAmount: cleanedValue
                                                }));
                                            }}
                                        />

                                        {error &&
                                            (amcInvoiceObj.amcInvoiceAmount === null ||
                                                amcInvoiceObj.amcInvoiceAmount === undefined ||
                                                amcInvoiceObj.amcInvoiceAmount === '') ? (
                                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>
                            </div>
                            <span style={{ color: 'red' }}>{errorMessage}</span>

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
                                                moduleName: "AMCInvoice",
                                                projectName: "MYOMNAMO",
                                                userId: user.userKeyID,
                                            };

                                            const res = await uploadPdfWithNodeApi(uploadParams);
                                            if (res?.data?.success) {
                                                const s3Url = res.data.s3Url;
                                                setLoader(false);
                                                setAmcInvoiceObj((prev) => ({
                                                    ...prev,
                                                    amcInvoicePDFUpload: s3Url,
                                                    poPdfPreview: fileURL
                                                }));
                                                setIsFileChanged(true);

                                            }
                                            setLoader(false);
                                        }
                                    }}
                                />

                                {error &&
                                    (amcInvoiceObj.amcInvoicePDFUpload === null ||
                                        amcInvoiceObj.amcInvoicePDFUpload === undefined ||
                                        amcInvoiceObj.amcInvoicePDFUpload === '') ? (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                ) : (
                                    ''
                                )}
                                <span>
                                    <small>Note: Max 10MB</small>
                                </span>
                                {amcInvoiceObj.poPdfPreview && (
                                    <div className="mt-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <strong>Preview:</strong>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => {
                                                    setAmcInvoiceObj((prev) => ({
                                                        ...prev,
                                                        amcInvoicePDFUpload: null,
                                                        poPdfPreview: null
                                                    }));
                                                }}
                                            >
                                                Remove PDF
                                            </button>
                                        </div>
                                        <iframe
                                            src={amcInvoiceObj.poPdfPreview}
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

export default AMCAddUpdateInvoiceModal;
