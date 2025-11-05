

import React, { useContext, useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import { Tooltip } from '@mui/material';
import 'react-date-picker/dist/DatePicker.css';
import { GetQutationNumberFormatLookupList } from 'services/Quotation/QuotationApi';
import { useLocation, useNavigate } from 'react-router';
import { GetQuotationModel } from 'services/Quotation Module/AddUpdateQuotationApi';
import { ConfigContext } from 'context/ConfigContext';
import SuccessPopupModal from 'component/SuccessPopupModal';
import SerialNoProductQtyWiseModal from './SerialNoProductQtyWiseModal';
import { GetLeadSalesOrderProductList, } from 'services/Sales Order Product/SalesOrderProductApi';
import SalesOrderProductAddUpdateModal from './SalesOrderProductAddUpdateModal';
import SalesOrderSerialModal from './Sales Order Serial/SalesOrderSerialModal';
const SalesOrderProductSerialNo = () => {
    const [modelRequestData, setModelRequestData] = useState({});
    const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
    const [editIndex, setEditIndex] = useState(null); // null for add
    const [productTypeOption, setProductTypeOption] = useState([]);
    const [manufactureOption, setManufactureOption] = useState([]);
    const [salesOrderProductListData, setSalesOrderProductListData] = useState([])
    const [showSerialErrors, setShowSerialErrors] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [variantOption, setVariantOption] = useState([]);
    const [modelOption, setModelOption] = useState([]);
    const [quotationNoFormatOption, setQuotationNoFormatOption] = useState([]);
    const [reviewEmpOption, setReviewEmpOption] = useState([]);
    const [leadOption, setLeadOption] = useState([]);
    const [error, setErrors] = useState(null);
    const [quotationFormatOption, setQuotationFormatOption] = useState([]);
    const [termsConditionOption, setTermsConditionOption] = useState([]);
    const [errorMessage, setErrorMessage] = useState(false);
    const [showAddUpdateProductQuotationModal, setShowAddUpdateProductQuotationModal] = useState(false);
    const [showSerialNumberModal, setShowSerialNumberModal] = useState(false);
    const [showAddUpdateQtySerialNumberModal, setShowAddUpdateQtySerialNumberModal] = useState(false);
    const { setLoader, user } = useContext(ConfigContext);
    const location = useLocation();
    const [modelAction, setModelAction] = useState(false);
    const [quotationObj, setQuotationObj] = useState({
        userKeyID: null,
        requirement: null,
        reviewedEmployeeBy: null,
        quotationFormatID: null,
        address: null,
        quotationKeyID: null,
        leadName: null,
        validFor: null,
        isSendForApproval: null,
        quotationDate: null,
        quotMatters: null,
        reviewedEmpID: null,
        termsAndConditionsID: null,
        quotationNumberFormatID: null,
        termsAndConditions: null,
        quotationNumberFormat: null,
        quotationProductMapping: []
    });
    const [selectedProductIndex, setSelectedProductIndex] = useState(null);

    useEffect(() => {
        if (location.state?.quotationKeyID !== undefined) {
            if (location.state?.quotationKeyID !== null) {
                GetQuotationModelData(location.state?.quotationKeyID);
            }
        }
    }, [location]);

    useEffect(() => {
        GetQuotationNumberFormatLookupListData();
    }, []);
    useEffect(() => {
        const incoming = location.state?.quotationObj || {};
        setQuotationObj((prev) => ({
            ...prev,
            ...incoming,
            leadName: location.state?.leadName || prev.leadName,
            requirement: location.state?.requirement || prev.requirement,
            address: location.state?.address || prev.address,
            quotationFormatID: location.state?.quotationFormatID || prev.quotationFormatID
        }));
    }, [location]);

    const GetQuotationNumberFormatLookupListData = async () => {
        try {
            const response = await GetQutationNumberFormatLookupList(); // Ensure this function is imported correctly

            if (response?.data?.statusCode === 200) {
                const quotationNoFormat = response?.data?.responseData?.data || [];

                const formattedQuotationNoFormatList = quotationNoFormat.map((roleType) => ({
                    value: roleType.quotationNumberFormatID,
                    label: roleType.quotationNumberFormat
                }));

                setQuotationNoFormatOption(formattedQuotationNoFormatList); // Make sure you have a state setter function for IVR list
            } else {
                console.error('Failed to fetch role Type lookup list:', response?.data?.statusMessage || 'Unknown error');
            }
        } catch (error) {
            console.error('Error fetching role Type lookup list:', error);
        }
    };
    console.log(location.state, '3333333sssssssss');





    useEffect(() => {
        if (
            quotationObj?.quotationNumberFormatID &&
            quotationNoFormatOption.length > 0 &&
            !quotationObj?.quotationNumberFormat
        ) {
            const matchedFormat = quotationNoFormatOption.find(
                (item) => item.value === quotationObj.quotationNumberFormatID
            );

            if (matchedFormat) {
                setQuotationObj((prev) => ({
                    ...prev,
                    quotationNumberFormat: matchedFormat.label,
                }));
            }
        }

        if (
            quotationObj?.reviewedEmpID &&
            reviewEmpOption.length > 0 &&
            !quotationObj?.reviewedEmployeeBy
        ) {
            const matchedEmp = reviewEmpOption.find(
                (item) => item.value === quotationObj.reviewedEmpID
            );

            if (matchedEmp) {
                setQuotationObj((prev) => ({
                    ...prev,
                    reviewedEmployeeBy: matchedEmp.label,
                }));
            }
        }
    }, [quotationObj?.quotationNumberFormatID, quotationObj?.reviewedEmpID, quotationNoFormatOption, reviewEmpOption]);


    const { state } = useLocation();


    const handleQuotationNoFormat = (selectedOption) => {
        setQuotationObj((prev) => ({
            ...prev,
            quotationNumberFormatID: selectedOption?.value || null,
            quotationNumberFormat: selectedOption?.label || null
        }));
    };
    useEffect(() => {
        handleQuotationNoFormat()
    }, [])


    useEffect(() => {
        if (state?.quotationObj) {
            console.log('Before debugger');
            // debugger;
            console.log('After debugger');
            setQuotationObj((prev) => ({
                ...prev,
                ...state.quotationObj
            }));
        }
    }, [state]);
    // location.state
    const totalQty = quotationObj.quotationProductMapping.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    console.log(totalQty, '3dsfdsfdsfsd'); // 10 + 5 + 5 = 20

    const GetQuotationModelData = async (id) => {
        if (id === undefined) {
            return;
        }
        setLoader(true);

        try {
            const data = await GetQuotationModel(id);
            if (data?.data?.statusCode === 200) {
                setLoader(false);
                const ModelData = data.data.responseData.data; // Assuming data is an array

                setQuotationObj({
                    ...quotationObj,
                    quotationID: ModelData.quotationID,
                    quotationKeyID: ModelData.quotationKeyID,
                    leadKeyID: ModelData.leadKeyID,
                    validFor: ModelData.validFor,
                    isSendForApproval: ModelData.isSendForApproval,
                    quotationDate: ModelData.quotationDate,
                    quotMatters: ModelData.quotMatters,
                    reviewedEmpID: ModelData.reviewedEmpID,
                    termsAndConditionsID: ModelData.termsAndConditionsID,
                    quotationNumberFormatID: ModelData.quotationNumberFormatID,
                    termsAndConditions: ModelData.termsAndConditions,
                    leadName: ModelData.leadName,
                    requirement: ModelData.requirement,
                    address: ModelData.address,
                    quotationFormatID: ModelData.quotationFormatID,
                    // quotationFormatID: 2,

                    quotationProductMapping: ModelData.quotationProductMapping
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


    const addSalesOrderSerial = () => {

        setModelRequestData({
            leadKeyID: location.state.leadKeyID,
            quotationFormatID: location.state.quotationFormatID,
            purchaseOrderKeyID: location.state.purchaseOrderKeyID,
            Action: 'Update'
        });

        setShowSerialNumberModal(true);

    };

    const navigate = useNavigate();






    const handleAddOrUpdateProduct = (updatedProduct, editIndex) => {
        const updatedProducts = [...quotationObj.quotationProductMapping];

        if (editIndex !== null) {
            updatedProducts[editIndex] = {
                ...updatedProducts[editIndex],
                ...updatedProduct
            };
        } else {
            updatedProducts.push({
                ...updatedProduct,
                salesProductSerNoList: [] // default empty
            });
        }

        setQuotationObj((prev) => ({
            ...prev,
            quotationProductMapping: updatedProducts
        }));
    };



    const closeAllModal = () => {
        setShowSuccessModal(false);
        navigate('/sales-order-management');
    };

    useEffect(() => {
        GetSalesOrderProductListData()
    }, [])



    useEffect(() => {
        if (isAddUpdateActionDone) {

            GetSalesOrderProductListData();

        }
        setIsAddUpdateActionDone(false);
    }, [isAddUpdateActionDone])

    const GetSalesOrderProductListData = async () => {
        // debugger
        setLoader(true);
        try {
            const data = await GetLeadSalesOrderProductList({

                userKeyID: user.userKeyID,
                salesProductKeyID: location?.state?.salesProductKeyID,
                leadKeyID: location?.state?.leadKeyID,
                pageSize: 1000,
                pageNo: 0,
            });

            if (data) {
                if (data?.data?.statusCode === 200) {
                    setLoader(false);
                    const apiList = data?.data?.responseData?.data;

                    // ✅ Flatten out all salesProductList from each lead
                    const flatProducts = apiList.flatMap(item => item.salesProductList || []);

                    setQuotationObj({
                        quotationFormatID: location?.state?.quotationFormatID,
                        quotationProductMapping: flatProducts
                    });
                } else {
                    setErrorMessage(data?.data?.errorMessage);
                    setLoader(false);
                }
            }
        } catch (error) {
            console.log(error);
            setLoader(false);
        }
    };






    const selectedProduct = quotationObj.quotationProductMapping[selectedProductIndex];
    return (
        <>
            <div className="card w-full max-w-[50vh] mx-auto h-auto">
                <div className="card-body p-2 bg-white shadow-md rounded-lg">
                    <div className="position-relative d-flex justify-content-center align-items-center mb-3 mt-3">
                        {/* Back Button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="btn btn-sm btn-outline-secondary position-absolute start-0"
                        >
                            ←
                        </button>

                        {/* Heading */}
                        <h5 className="mb-0 flex-grow-1 text-center">Sales Order Product</h5>

                        {/* Add Product Button */}
                        {/* {location.state.Action !== 'HideForReadyForDispatch' && (
                            <button
                                // onClick={addUpdateProductModal}
                                className="btn text-white btn-sm ms-2"
                                style={{ background: '#ffaa33' }}
                            >
                                + Add Product
                            </button>
                        )} */}
                        {location.state.Action !== 'HideForReadyForDispatch' && totalQty !== location.state.hideTheCreateSalesBtn && (
                            <button
                                onClick={addSalesOrderSerial}
                                className="btn text-white btn-sm ms-2"
                                style={{ background: '#ffaa33' }}
                            >
                                + Create Sales Order
                            </button>
                        )}

                    </div>




                    <div className="table-responsive">
                        <table className="table table-bordered table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Sr No</th>
                                    <th>Product Name</th>
                                    <th>Manufacturer Name</th>
                                    <th>Rating</th>
                                    <th>Model Name</th>
                                    <th>Quantity</th>
                                    {/* <th>Rate</th> */}
                                    {quotationObj.quotationFormatID === 2 && <th>Discount</th>}
                                    <th>Product Serial No.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quotationObj?.quotationProductMapping?.length > 0 ? (
                                    quotationObj.quotationProductMapping.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.productName}</td>
                                            <td>{item.manufacturerName}</td>
                                            <td>{item.variantName}</td>
                                            <td>{item.modelName}</td>
                                            <td>{item.quantity} {item.unit}</td>
                                            {/* <td>{item.rate}</td> */}

                                            {quotationObj.quotationFormatID === 2 && (
                                                <td>{item.discount || item.rate}</td>
                                            )}

                                            <td>
                                                {item.salesProductSerNoList?.length > 0
                                                    ? item.salesProductSerNoList.map((serial, i) => (
                                                        <span key={serial.salesProductSerID}>
                                                            {serial.serialNumber}
                                                            {i !== item.salesProductSerNoList.length - 1 ? ', ' : ''}
                                                        </span>
                                                    ))
                                                    : "-"}
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={quotationObj.quotationFormatID === 2 ? "10" : "9"} className="text-center">
                                            No data found
                                        </td>
                                    </tr>
                                )}
                            </tbody>





                        </table>

                        <span className='d-flex justify-content-center text-center' style={{ color: 'red' }}> {showSerialErrors}</span>
                        <div className="text-end d-flex justify-content-center mt-3">
                            { }
                            {/* {location.state.Action !== 'HideForReadyForDispatch' &&
                                <>
                                    {location.state.isSalesProductAdded !== 'Yes' &&

                                        <button className="btn btn-sm text-white" style={{ background: '#ffaa33' }} onClick={handleCreateSalesOrder}>
                                            <i class="fa-solid fa-circle-plus"></i> Create Sales Order
                                        </button>
                                    }
                                </>
                            } */}
                        </div>
                        {/* ✅ Buttons at bottom with spacing */}

                    </div>



                    {selectedProduct && (
                        <SerialNoProductQtyWiseModal
                            show={showAddUpdateQtySerialNumberModal}
                            onHide={() => setShowAddUpdateQtySerialNumberModal(false)}
                            modelRequestData={{
                                ...selectedProduct,
                                quantity: selectedProduct.quantity || 0,
                                serialNumbers:
                                    selectedProduct.salesProductSerNoList?.map((s) => s.serialNumber) || [],
                            }}
                            onSave={(serialList) => {
                                const updated = [...quotationObj.quotationProductMapping];

                                updated[selectedProductIndex] = {
                                    ...updated[selectedProductIndex],
                                    salesProductSerNoList: serialList.map((serial, i) => ({
                                        salesProductID:
                                            updated[selectedProductIndex].salesProductID ?? null,
                                        salesProductSerID: i + 1,
                                        serialNumber: serial,
                                    })),
                                };

                                setQuotationObj((prev) => ({
                                    ...prev,
                                    quotationProductMapping: updated,
                                }));

                                setSelectedProductIndex(null);
                                setShowAddUpdateQtySerialNumberModal(false);
                            }}
                        />
                    )}



                    {showSerialNumberModal &&
                        <SalesOrderSerialModal
                            show={showSerialNumberModal}
                            onHide={() => setShowSerialNumberModal(false)}
                            modelRequestData={modelRequestData}
                            onSave={handleAddOrUpdateProduct}
                            editIndex={editIndex}
                            productTypeOption={productTypeOption}
                            manufactureOption={manufactureOption}
                            setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                            variantOption={variantOption}
                            modelOption={modelOption}
                            quotationProductList={quotationObj.quotationProductMapping} // 👈 add this
                        />
                    }
                    {showAddUpdateProductQuotationModal &&
                        <SalesOrderProductAddUpdateModal
                            show={showAddUpdateProductQuotationModal}
                            onHide={() => setShowAddUpdateProductQuotationModal(false)}
                            modelRequestData={modelRequestData}
                            onSave={handleAddOrUpdateProduct}
                            editIndex={editIndex}
                            productTypeOption={productTypeOption}
                            manufactureOption={manufactureOption}
                            variantOption={variantOption}
                            modelOption={modelOption}
                            quotationProductList={quotationObj.quotationProductMapping} // 👈 add this
                        />
                    }
                </div>
                {showSuccessModal && (
                    <SuccessPopupModal
                        show={showSuccessModal}
                        onHide={() => closeAllModal()}
                        setShowSuccessModal={setShowSuccessModal}
                        modelAction={modelAction}
                    />
                )}
            </div >
        </>
    );
};

export default SalesOrderProductSerialNo;
