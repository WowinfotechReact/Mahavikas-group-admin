



import Text_Editor from 'component/Text_Editor';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import { Tooltip } from '@mui/material';
import 'react-date-picker/dist/DatePicker.css';
import { GetQutationNumberFormatLookupList } from 'services/Quotation/QuotationApi';
import { GetEmployeeLookupList } from 'services/Employee Staff/EmployeeApi';
import { GetLeadLookupList, GetquotationFormatLookupList } from 'services/LeadAPI/LeadApi';
import { GetTermsAndConditionsLookupList } from 'services/Terms And Condition/TermsConditionApi';
import { useLocation, useNavigate } from 'react-router';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { ConfigContext } from 'context/ConfigContext';
import SuccessPopupModal from 'component/SuccessPopupModal';
import OEMProductAddUpdateModal from './OEMProductAddUpdateModal';
import { GetCustomerLookupList } from 'services/CustomerStaff/CustomerStaffApi';
import { AddUpdateOEMInstallation, GetOEMInstallationModel, GetOEMLookupList } from 'services/Original Equipment Manufacturer/OriginalEquipmentManufacturerApi';
import dayjs from 'dayjs';
const OEMProductList = () => {
    const [modelRequestData, setModelRequestData] = useState({});
    const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
    const [productList, setProductList] = useState([]);
    const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
    const [editingProductIndex, setEditingProductIndex] = useState(null); // null = add mode
    const [editIndex, setEditIndex] = useState(null); // null for add
    const [productTypeOption, setProductTypeOption] = useState([]);
    const [manufactureOption, setManufactureOption] = useState([]);

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
    const [employeeOption, setEmployeeOption] = useState([]);

    const [showAddUpdateProductQuotationModal, setShowAddUpdateProductQuotationModal] = useState(false);
    const { setLoader, user } = useContext(ConfigContext);
    const location = useLocation();
    const [oemOption, setOemOption] = useState([]);
    const [customerLookupList, setCustomerLookupList] = useState([]);
    const [modelAction, setModelAction] = useState(false);
    const [quotationObj, setQuotationObj] = useState({
        userKeyID: null,
        oemInstallationKeyID: null,
        installationDate: null,
        installationByID: null,
        oemid: null,
        oemInstallationProductMapping: []
    });


    useEffect(() => {
        if (location.state?.oemInstallationKeyID !== undefined) {
            if (location.state?.oemInstallationKeyID !== null) {
                GetOEMInstallationModelData(location.state?.oemInstallationKeyID);
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
    useEffect(() => {
        GetEmployeeLookupListData()
    }, [])
    const GetEmployeeLookupListData = async () => {
        try {
            const payload = {
                employeeTypeID: null,
                roleTypeID: 6
            };

            const response = await GetEmployeeLookupList(payload);

            if (response?.data?.statusCode === 200) {
                const employeeList = response?.data?.responseData?.data || [];

                const filteredEmployees = employeeList.map((emp) => ({
                    value: emp.employeeID,
                    label: emp.employeeName
                }));

                setEmployeeOption(filteredEmployees); // Assuming this is a useState setter
            } else {
                console.error('Bad request');
            }
        } catch (error) {
            console.error('Error fetching employee list:', error);
        }
    };

    useEffect(() => {
        GetLeadLookupListData();
    }, []);
    const GetLeadLookupListData = async () => {
        try {
            const response = await GetLeadLookupList(); // Ensure this function is imported correctly

            if (response?.data?.statusCode === 200) {
                const leadFormat = response?.data?.responseData?.data || [];

                const formattedLeadList = leadFormat.map((roleType) => ({
                    value: roleType.leadName,
                    label: roleType.leadName
                }));

                setLeadOption(formattedLeadList); // Make sure you have a state setter function for IVR list
            } else {
                console.error('Failed to fetch role Type lookup list:', response?.data?.statusMessage || 'Unknown error');
            }
        } catch (error) {
            console.error('Error fetching role Type lookup list:', error);
        }
    };
    useEffect(() => {
        // Load all required data on mount or when ID is available
        if (location?.state?.quotationID) {
            GetOEMInstallationModelData(location?.state?.quotationID); // 1. Get model data
        }

        GetQuotationNumberFormatLookupListData(); // 2. Lookup for number format
        GetEmployeeLookupListData(); // 3. Lookup for employee
    }, []);
    useEffect(() => {

        GetOEMLookupListData();
    }, []);

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
    useEffect(() => {
        GetQuotationFormatLookupListData();
    }, []);
    const GetQuotationFormatLookupListData = async () => {
        try {
            const response = await GetquotationFormatLookupList(); // Ensure this function is imported correctly

            if (response?.data?.statusCode === 200) {
                const quotationFormat = response?.data?.responseData?.data || [];

                const formattedQuotationList = quotationFormat.map((roleType) => ({
                    value: roleType.quotationFormatID,
                    label: roleType.quotationFormatName
                }));

                setQuotationFormatOption(formattedQuotationList); // Make sure you have a state setter function for IVR list
            } else {
                console.error('Failed to fetch role Type lookup list:', response?.data?.statusMessage || 'Unknown error');
            }
        } catch (error) {
            console.error('Error fetching role Type lookup list:', error);
        }
    };
    useEffect(() => {
        GetTermsAndConditionsLookupListData();
    }, []);
    const GetTermsAndConditionsLookupListData = async () => {
        try {
            const response = await GetTermsAndConditionsLookupList(); // Ensure this function is imported correctly

            if (response?.data?.statusCode === 200) {
                const quotationFormat = response?.data?.responseData?.data || [];

                const formattedQuotationList = quotationFormat.map((roleType) => ({
                    value: roleType.termsAndConditionsID,
                    label: roleType.title,
                    termsAndConditions: roleType.termsAndConditions
                }));

                setTermsConditionOption(formattedQuotationList); // Make sure you have a state setter function for IVR list
            } else {
                console.error('Failed to fetch role Type lookup list:', response?.data?.statusMessage || 'Unknown error');
            }
        } catch (error) {
            console.error('Error fetching role Type lookup list:', error);
        }
    };
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






    const handleDateChange = (date) => {
        setQuotationObj((prevState) => ({
            ...prevState,
            installationDate: date // Update state with selected date
        }));
    };

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

    const GetOEMInstallationModelData = async (id) => {
        if (id === undefined) {
            return;
        }
        setLoader(true);

        try {
            const data = await GetOEMInstallationModel(id);
            if (data?.data?.statusCode === 200) {
                setLoader(false);
                const ModelData = data.data.responseData.data; // Assuming data is an array

                setQuotationObj({
                    ...quotationObj,
                    oemid: ModelData.oemid,
                    installationByID: ModelData.installationByID,
                    oemInstallationKeyID: ModelData.oemInstallationKeyID,
                    // installationDate: ModelData.installationDate,
                    installationDate: dayjs(ModelData.installationDate, 'DD/MM/YYYY', true).isValid()
                        ? dayjs(ModelData.installationDate, 'DD/MM/YYYY').toDate()
                        : null,

                    oemInstallationProductMapping: ModelData.oemInstallationProductMapping
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

    const addUpdateProductModal = () => {
        let isValid = false;
        // debugger

        // if (
        //     quotationObj.address === null ||
        //     quotationObj.address === undefined ||
        //     quotationObj.address === ''
        // ) {
        //     setErrors(true);
        //     isValid = true;
        // } else {
        //     setErrors(false);
        //     isValid = false;
        // }

        setModelRequestData({
            quotationFormatID: quotationObj.quotationFormatID,
            productID: null,
            manufacturerName: null,
            modelName: null,
            variantName: null,
            manufacturerID: null,
            variantID: null,
            modelID: null,
            unit: '',
            quantity: '',
            rate: '',
            discount: '',
            scopeOfSupply: '',
            warranty: ''
        });
        setEditIndex(null);

        if (!isValid) {
            setEditIndex(null);
            setShowAddUpdateProductQuotationModal(true);
        }
    };

    const navigate = useNavigate();




    const handleEdit = (item, index) => {
        setModelRequestData({
            ...item,
            quotationFormatID: quotationObj.quotationFormatID || null
        });

        setEditIndex(index);
        setShowAddUpdateProductQuotationModal(true);
    };

    const handleDelete = (index) => {
        setQuotationObj((prev) => {
            const updatedList = [...prev.oemInstallationProductMapping];
            updatedList.splice(index, 1);
            return {
                ...prev,
                oemInstallationProductMapping: updatedList
            };
        });
    };

    const handleAddOrUpdateProduct = (product, index) => {
        const updatedList = [...(quotationObj.oemInstallationProductMapping || [])];

        if (index !== null && index !== undefined) {
            // Update existing
            updatedList[index] = product;
        } else {
            // Check duplicate: same productID + rate
            const duplicate = updatedList.find((item) => item.productID === product.productID && item.rate === product.rate);
            if (duplicate) {
                toast.error('This product with the same rate already exists!');
                return;
            }

            updatedList.push(product); // Add new
        }

        setQuotationObj((prev) => ({
            ...prev,
            oemInstallationProductMapping: updatedList
        }));

        setEditIndex(null);
    };

    console.log(location.state, 'dsauihdsa98dy32p');


    const saveAsDraftBtn = () => {
        debugger
        let isValid = false;

        if (
            quotationObj.oemid === null ||
            quotationObj.oemid === undefined ||
            quotationObj.oemid === '' ||
            quotationObj.installationByID === null ||
            quotationObj.installationByID === undefined ||
            quotationObj.installationByID === '' ||
            quotationObj.oemInstallationProductMapping === null ||
            quotationObj.oemInstallationProductMapping === undefined ||
            !Array.isArray(quotationObj.oemInstallationProductMapping) ||
            quotationObj.oemInstallationProductMapping.length === 0 ||
            quotationObj.installationDate === null ||
            quotationObj.installationDate === undefined ||
            quotationObj.installationDate === ''

        ) {
            setErrors(true);
            isValid = true;
        } else {
            setErrors(false);
            isValid = false;
        }
        const apiParam = {
            userKeyID: user.userKeyID,
            installationDate: quotationObj.installationDate,
            installationByID: quotationObj.installationByID,
            oemInstallationProductMapping: quotationObj.oemInstallationProductMapping,
            oemid: quotationObj.oemid,
            oemInstallationKeyID: quotationObj.oemInstallationKeyID,


        };

        if (!isValid) {
            AddUpdateQuotationData(apiParam);
        }
    };
    const AddUpdateQuotationData = async (apiParam) => {
        setLoader(true);
        try {
            let url = '/AddUpdateOEMInstallation'; // Default URL for Adding Data

            const response = await AddUpdateOEMInstallation(url, apiParam);
            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    setShowSuccessModal(true);
                    setModelAction('OEM Installation has been completed successfully ');

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
    const closeAllModal = () => {
        setShowSuccessModal(false);
        // navigate('/lead');
    };

    useEffect(() => {
        GetCustomerLookUpListData()
    }, [])

    const GetCustomerLookUpListData = async () => {
        setLoader(true);
        try {
            let response = await GetCustomerLookupList();
            if (response?.data?.statusCode === 200) {
                setLoader(false);

                const customerOptions = response?.data?.responseData?.data || [];
                const FormattedRollOptions = customerOptions.map((val) => ({
                    value: val.oemid,
                    label: val.customerFirmName
                }));
                setCustomerLookupList(FormattedRollOptions);
            } else {
                setLoader(false);
                console.error('Bad request');
            }
        } catch (error) {
            setLoader(false);
            console.log(error);
        }
    };
    const handleCustomerChange = (selectedOption) => {
        setQuotationObj((prev) => ({
            ...prev,
            oemid: selectedOption.value
        }));
    };

    const handleAssignEmployeeChange = (selectedOption) => {
        setQuotationObj((prev) => ({
            ...prev,
            installationByID: selectedOption.value
        }));
    };
    console.log("INSTALLATION DATE", quotationObj.installationDate);
    console.log("TYPE:", typeof quotationObj.installationDate);


    const GetOEMLookupListData = async () => {
        try {
            const response = await GetOEMLookupList(); // Ensure this function is imported correctly

            if (response?.data?.statusCode === 200) {
                const quotationNoFormat = response?.data?.responseData?.data || [];

                const formattedQuotationNoFormatList = quotationNoFormat.map((roleType) => ({
                    value: roleType.oemid,
                    label: roleType.oemName
                }));

                setOemOption(formattedQuotationNoFormatList); // Make sure you have a state setter function for IVR list
            } else {
                console.error('Failed to fetch role Type lookup list:', response?.data?.statusMessage || 'Unknown error');
            }
        } catch (error) {
            console.error('Error fetching role Type lookup list:', error);
        }
    };
    return (
        <>
            <div className="card ">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="mb-3">
                                <label htmlFor="leadName" className="form-label">
                                    Installed By<span style={{ color: 'red' }}>*</span>
                                </label>
                                <Select
                                    options={employeeOption}
                                    value={employeeOption.filter((item) => item.value === quotationObj.installationByID)}
                                    onChange={handleAssignEmployeeChange}
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body} // This renders dropdown outside table container
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                        menu: (base) => ({ ...base, zIndex: 9999 })
                                    }}
                                />



                                {error &&
                                    (quotationObj.installationByID === null ||
                                        quotationObj.installationByID === undefined ||
                                        quotationObj.installationByID === '') ? (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>


                        <div className="col-md-3">
                            <div className="mb-3">
                                <label htmlFor="leadName" className="form-label">
                                    Installation Date<span style={{ color: 'red' }}>*</span>
                                </label>
                                <DatePicker
                                    value={quotationObj?.installationDate || null}
                                    onChange={handleDateChange}
                                    label="From Date"
                                    clearIcon={null}
                                    popperPlacement="bottom-start"
                                    calendarClassName="custom-calendar-popup"
                                />

                                {error &&
                                    (quotationObj.installationDate === null || quotationObj.installationDate === undefined || quotationObj.installationDate === '') ? (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="mb-3">
                                <label htmlFor="leadName" className="form-label">
                                    Select OEM Master<span style={{ color: 'red' }}>*</span>
                                </label>


                                <Select
                                    placeholder="Select OEM"
                                    options={oemOption}
                                    value={oemOption.find((item) => item.value === quotationObj.oemid)}
                                    onChange={handleCustomerChange}
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body} // This renders dropdown outside table container
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                        menu: (base) => ({ ...base, zIndex: 9999 })
                                    }}
                                />


                                {error &&
                                    (quotationObj.oemid === null ||
                                        quotationObj.oemid === undefined ||
                                        quotationObj.oemid === '') ? (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>


                    <div className="d-flex justify-content-end mb-2">
                        <button onClick={addUpdateProductModal} className="btn text-white" style={{ background: '#ffaa33' }}>
                            + Add Product
                        </button>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Product Name</th>
                                    <th>Manufacturer Name</th>
                                    <th>Rating</th>
                                    <th>Model Name</th>
                                    <th>Quantity</th>
                                    <th>Rate ⟨₹⟩ </th>
                                    {quotationObj.quotationFormatID === 2 && <th>Discount</th>}
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>

                                {quotationObj?.oemInstallationProductMapping?.length > 0 ? (
                                    quotationObj.oemInstallationProductMapping.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.productName}</td>
                                            <td>{item.manufacturerName}</td>
                                            <td>{item.variantName}</td>
                                            <td>{item.modelName}</td>
                                            <td>{item.quantity}{" "}{item.unit}</td>
                                            <td>

                                                {new Intl.NumberFormat('en-IN', {
                                                    style: 'decimal',
                                                    maximumFractionDigits: 0,
                                                    minimumFractionDigits: 0
                                                }).format(Math.round(item.rate))}
                                            </td>
                                            {quotationObj.quotationFormatID === 2 && (
                                                <td>
                                                    {item.discount
                                                        ? `${item.discount} `
                                                        : `
                 ${item.rate}`}
                                                </td>
                                            )}

                                            <td>
                                                <Tooltip title="Update Product">
                                                    <button onClick={() => handleEdit(item, index)} className="btn btn-warning btn-sm me-2">
                                                        <i class="fa-solid fa-pencil"></i>
                                                    </button>
                                                </Tooltip>
                                                <Tooltip title="Delete Product">
                                                    <button onClick={() => handleDelete(index)} className="btn btn-danger btn-sm">
                                                        <i class="fa-solid fa-trash"></i>{' '}
                                                    </button>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <>
                                        <tr>
                                            <td colSpan="9" className="text-center">


                                                No products added yet.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="9" className="text-center">
                                                {error && (!Array.isArray(quotationObj?.oemInstallationProductMapping) || quotationObj?.oemInstallationProductMapping.length === 0) && (
                                                    <span style={{ color: 'red' }}>Please add at least one product</span>
                                                )}

                                            </td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                        <div
                            style={{
                                display: 'flex',
                                gap: '10px',
                                padding: '16px',
                                justifyContent: 'center', // ✅ center the buttons
                                flexWrap: 'wrap',
                                backgroundColor: '#f9f9f9',
                                borderTop: '1px solid #ddd',
                                position: 'sticky',
                                bottom: 0,
                                zIndex: 5
                            }}
                        >


                            <button className="btn text-white" style={{ background: '#ffaa33' }} onClick={saveAsDraftBtn}>
                                Add OEM
                            </button>



                        </div>
                        {/* ✅ Buttons at bottom with spacing */}

                    </div>

                    <OEMProductAddUpdateModal
                        show={showAddUpdateProductQuotationModal}
                        onHide={() => setShowAddUpdateProductQuotationModal(false)}
                        modelRequestData={modelRequestData}
                        onSave={handleAddOrUpdateProduct}
                        editIndex={editIndex}
                        productTypeOption={productTypeOption}
                        manufactureOption={manufactureOption}
                        variantOption={variantOption}
                        modelOption={modelOption}
                        quotationProductList={quotationObj.oemInstallationProductMapping} // 👈 add this
                    />
                </div>
                {showSuccessModal && (
                    <SuccessPopupModal
                        show={showSuccessModal}
                        onHide={() => closeAllModal()}
                        setShowSuccessModal={setShowSuccessModal}
                        modelAction={modelAction}
                    />
                )}
            </div>
        </>
    );
};

export default OEMProductList;
