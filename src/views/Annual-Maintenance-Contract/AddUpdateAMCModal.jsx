// ModalComponent.js
import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-date-picker';
import { motion, AnimatePresence } from "framer-motion";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { AddUpdateAMCApi, GetAMCModel, GetWarrantyVisitDateList } from 'services/AMCApi/AMCApi';
import { ConfigContext } from 'context/ConfigContext';
import SuccessPopupModal from 'component/SuccessPopupModal';
// import { PaymentStatusList } from 'middleware/Utils';
import dayjs from 'dayjs';
import { ERROR_MESSAGES } from 'component/GlobalMassage';

const AddUpdateAMCModal = ({ show, onHide, modelRequestData, setIsAddUpdateActionDone }) => {
  const [error, setErrors] = useState(null);
  const [image, setImage] = useState(null);
  const [visitDates, setVisitDates] = useState([]);

  const [imagePreview, setImagePreview] = useState('');
  const [sizeError, setSizeError] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [showSuccessModel, setShowSuccessModal] = useState('');
  const [actionMassage, setActionMassage] = useState(null);
  const [paymentStatusID, setPaymentStatusID] = useState(null);
  const fromDate = dayjs();
  const { user, setLoader, companyID } = useContext(ConfigContext);
  const [installationOption, setInstallationOption] = useState([])
  const [amcFormModalObj, setAmcFormModalObj] = useState({

    userKeyID: null,
    amcKeyID: null,
    leadID: null,
    quotationID: null,
    productID: null,
    amcInMonth: null,
    amcCharges: null,
    amcStartDate: null,
    amcFirstVisitDate: null,
    amcTypeID: null
  });
  const WarrantyOption = [
    { value: 1, label: '3 Months ' },
    { value: 2, label: '6 Months ' },
    { value: 3, label: '9 Months ' },
    { value: 4, label: '12 Months ' },
    { value: 5, label: '15 Months ' },
    { value: 6, label: '18 Months ' },
    { value: 7, label: '21 Months ' },
    { value: 8, label: '24 Months ' },
    { value: 9, label: '27 Months ' },
    { value: 10, label: '30 Months ' },
    { value: 11, label: '33 Months ' },
    { value: 12, label: '36 Months ' },
    { value: 13, label: '39 Months ' },
    { value: 14, label: '42 Months ' },
    { value: 15, label: '45 Months ' },
    { value: 16, label: '48 Months ' },
    { value: 17, label: '51 Months ' },
    { value: 18, label: '54 Months ' },
    { value: 19, label: '57 Months ' },
    { value: 20, label: '60 Months ' },
  ]

  const amcTypeOption = [
    { value: 1, label: 'Comprehensive' },
    { value: 2, label: 'Non-Comprehensive' },
  ]

  useEffect(() => {
    if (
      modelRequestData.Action === 'Update' // Don't change this naming convention
    ) {
      GetAMCModalData(modelRequestData?.amcKeyID);
    }
  }, [modelRequestData]);



  const handlSendApprovalBtnClick = async () => {
    // debugger
    let isValid = false;

    if (
      amcFormModalObj.amcFirstVisitDate === null ||
      amcFormModalObj.amcFirstVisitDate === undefined ||
      amcFormModalObj.amcFirstVisitDate === '' ||
      amcFormModalObj.amcStartDate === null ||
      amcFormModalObj.amcStartDate === undefined ||
      amcFormModalObj.amcStartDate === '' ||
      amcFormModalObj.amcCharges === null ||
      amcFormModalObj.amcCharges === undefined ||
      amcFormModalObj.amcCharges === '' ||
      amcFormModalObj.amcInMonth === null ||
      amcFormModalObj.amcInMonth === undefined ||
      amcFormModalObj.amcInMonth === '' ||
      amcFormModalObj.amcTypeID === null ||
      amcFormModalObj.amcTypeID === undefined ||
      amcFormModalObj.amcTypeID === ''
    ) {
      setErrors(true);
      isValid = true;
    }



    const apiParamObj = {
      userKeyID: user.userKeyID,
      leadID: modelRequestData.leadID,
      amcKeyID: amcFormModalObj.amcKeyID,
      quotationID: modelRequestData.quotationID,
      productID: modelRequestData.productID,
      amcInMonth: amcFormModalObj.amcInMonth,
      amcCharges: amcFormModalObj.amcCharges,
      amcStartDate: amcFormModalObj.amcStartDate,
      amcFirstVisitDate: amcFormModalObj.amcFirstVisitDate,
      leadID: modelRequestData.leadID,
      amcTypeID: amcFormModalObj.amcTypeID,
      quotProductMapID: modelRequestData.quotProductMapID




    };

    if (!isValid) {
      AddUpdateAMCData(apiParamObj);
    }
  };



  const AddUpdateAMCData = async (apiParams) => {
    setLoader(true);
    try {

      const response = await AddUpdateAMCApi(apiParams); //Call this api
      if (response?.data.statusCode === 200) {
        setLoader(false);
        setIsAddUpdateActionDone(true);
        if (modelRequestData?.Action === null || modelRequestData?.Action === undefined) {
          setActionMassage('AMC Added Successfully ');
        } else {
          setActionMassage('AMC Updated Successfully ');
        }
        setShowSuccessModal(true);
      } else {
        setLoader(false);
        setErrorMessage(response.data.errorMessage);
        setErrors(true);
        console.error('Bad request');
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  //Get AMC Modal
  const GetAMCModalData = async (id) => {
    setLoader(true);
    try {
      const response = await GetAMCModel(id);
      if (response?.data?.statusCode === 200) {
        setLoader(false);

        const ModelData = response.data.responseData?.data || []; // Assuming the data is an array and we need the first item

        // Convert amcFirstVisitDate from API to Date object
        const firstVisitDate = ModelData.amcFirstVisitDate
          ? new Date(ModelData.amcFirstVisitDate)
          : null;
        setAmcFormModalObj({
          ...amcFormModalObj,
          leadID: ModelData.leadID,
          amcKeyID: ModelData.amcKeyID,
          quotationID: ModelData.quotationID,
          productID: ModelData.productID,
          amcInMonth: ModelData.amcInMonth,
          amcCharges: ModelData.amcCharges,
          amcStartDate: ModelData.amcStartDate,
          amcFirstVisitDate: ModelData.amcFirstVisitDate,
          amcTypeID: ModelData.amcTypeID,
          productID: ModelData.productID,

        });
        setImage(ModelData.paymentScreenshotUpload);
        setImagePreview(ModelData.paymentScreenshotUpload);
        setPaymentStatusID(ModelData.paymentStatus === true ? 1 : 2);

        if (ModelData.amcInMonth && firstVisitDate) {
          GetWarrantyVisitDateListData(ModelData.amcInMonth, firstVisitDate);
        }
      } else {
        setLoader(false);
        console.error('Error fetching data: ', response?.data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error', error);
    }
  };


  const GetWarrantyVisitDateListData = async (amcInMonth, firstVisitDate) => {
    if (!amcInMonth || !firstVisitDate) return;

    setLoader(true);
    try {
      // Convert Date object to ISO string or required format
      const formattedDate = firstVisitDate.toISOString().split('T')[0]; // e.g., "2025-08-28"

      const response = await GetWarrantyVisitDateList(formattedDate, amcInMonth);

      if (response?.data?.statusCode === 200) {
        const ModelData = response.data.responseData?.data || [];
        setVisitDates(ModelData); // store all visit dates
      } else {
        console.error("Error fetching data: ", response?.data?.data?.statusCode);
      }
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoader(false);
    }
  };


  const handleAmcTypeIDChange = (selectedOption) => {
    setAmcFormModalObj((prev) => ({
      ...prev,
      amcTypeID: selectedOption ? selectedOption.value : '',

    }));
  };

  const setInitialData = () => {
    setErrors(false);
    setImagePreview(null);
    setPaymentStatusID(null);
    setAmcFormModalObj({
      paymentImgURL: '',
      amount: null,
      amcValidity: null,
      paymentStatus: null,
      remark: null
    });
  };





  const closeAll = () => {
    setInitialData();
    setShowSuccessModal(false);
    onHide();
  };



  const handleAmcStartDate = (newValue) => {
    if (dayjs(newValue).isValid()) {
      const newToDate = dayjs(newValue).format('YYYY-MM-DD');
      setAmcFormModalObj((prev) => ({ ...prev, amcStartDate: newToDate }));
    } else {
      setAmcFormModalObj((prev) => ({ ...prev, amcStartDate: null }));
    }
  };



  const handleAmc1stVisitDate = (date) => {
    if (date) {
      // Set time to noon to avoid timezone issues
      const normalizedDate = new Date(date);
      normalizedDate.setHours(12, 0, 0, 0);

      setAmcFormModalObj((prevState) => ({
        ...prevState,
        amcFirstVisitDate: normalizedDate,
      }));

      if (amcFormModalObj.amcInMonth) {
        GetWarrantyVisitDateListData(amcFormModalObj.amcInMonth, normalizedDate);
      }
    } else {
      setAmcFormModalObj((prevState) => ({
        ...prevState,
        amcFirstVisitDate: null,
      }));
    }
  };




  return (
    <Modal
      size="lg"
      show={show}
      onHide={() => {
        onHide();
        setInitialData();
      }}
      style={{ zIndex: 1300 }}
      backdrop="static"
      keyboard={false}
      centered // Adjust the z-index as needed
    >
      <Modal.Header closeButton>
        <Modal.Title>{modelRequestData?.Action != null ? 'Update AMC Quotation' : 'Add AMC Quotation '}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-12 col-md-6 mb-2">
            <div>
              <label for="Amount" className="form-label">
                AMC Charges (₹)
                <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                maxLength={9}
                class="form-control"
                placeholder="Enter AMC Charges (₹)"
                value={amcFormModalObj?.amcCharges?.toLocaleString() || ''}
                // onChange={(e) => setAmcFormModalObj({ ...amcFormModalObj, amount: e.target.value })}
                onChange={(e) => {
                  // setErrorMessage('');
                  // let value = e.target.value;
                  // let FormattedNumber = value.replace(/[^0-9]/g, '');

                  let value = e.target.value;

                  // Remove any non-numeric characters
                  let numericValue = value.replace(/[^0-9]/g, '');

                  // Parse to an integer to keep it as a number
                  let formattedValue = parseInt(numericValue, 10) || null;

                  setAmcFormModalObj((prev) => ({
                    ...prev,
                    amcCharges: formattedValue
                  }));
                }}
                id="Amount"
              />

              {error && (amcFormModalObj.amcCharges === null || amcFormModalObj.amcCharges === undefined || amcFormModalObj.amcCharges === '') ? (
                <span className="errorMassage">{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
            </div>

          </div>
          <div className="col-12 col-md-6 mb-2">

            <div>
              <label htmlFor="customerName" className="form-label">
                Select AMC Warranty  In Month
                <span style={{ color: 'red' }}>*</span>
              </label>
              <div>
                <Select
                  options={WarrantyOption}
                  placeholder="Select AMC Warranty In Month"
                  value={WarrantyOption.find(
                    (item) => item.value === amcFormModalObj.amcInMonth
                  )}
                  onChange={(selected) => {
                    const amcInMonth = selected?.value || '';
                    setAmcFormModalObj((prev) => ({ ...prev, amcInMonth }));

                    // Fetch visit dates for selected AMC month and first visit date
                    if (amcInMonth && amcFormModalObj.amcFirstVisitDate) {
                      GetWarrantyVisitDateListData(amcInMonth, amcFormModalObj.amcFirstVisitDate);
                    }
                  }}
                  menuPosition="fixed"
                />

              </div>
              {error && (amcFormModalObj.amcInMonth === null || amcFormModalObj.amcInMonth === undefined || amcFormModalObj.amcInMonth === '') ? (
                <span className="errorMassage">{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
              {/* </div> */}
            </div>
          </div>
          <div className="col-12 col-md-6 mb-2">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="machineName" className="form-label">
                AMC Start Date
                <span style={{ color: 'red' }}>*</span>
              </label>
              <DatePicker
                id="amcStartData"
                value={amcFormModalObj?.amcStartDate || ''}
                // minDate={fromDate.toDate()}
                className=""
                clearIcon={null}
                onChange={handleAmcStartDate}
                renderInput={(params) => (
                  <input {...params.inputProps} className="date-picker-input-field  w-full rounded-md px-2 py-1.5 z-30" />
                )}
                format="dd/MM/yyyy"
                popperPlacement="bottom-start"
              />
              {error &&
                (amcFormModalObj.amcStartDate === null ||
                  amcFormModalObj.amcStartDate === undefined ||
                  amcFormModalObj.amcStartDate === '') ? (
                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
            </div>

          </div>
          <div className="col-12 col-md-6 mb-2">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="machineName" className="form-label">
                AMC 1st Visit Date
                <span style={{ color: 'red' }}>*</span>
              </label>

              <div>
                <DatePicker

                  value={amcFormModalObj?.amcFirstVisitDate} // Use "selected" instead of "value"
                  onChange={handleAmc1stVisitDate}
                  label="From Date"
                  clearIcon={null}
                  popperPlacement="bottom-start"

                />
                {error && (amcFormModalObj?.amcFirstVisitDate === null || amcFormModalObj?.amcFirstVisitDate === undefined || amcFormModalObj?.amcFirstVisitDate === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>


            </div>

          </div>
          <div className="col-12 col-md-6 mb-2">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="machineName" className="form-label">
                AMC Type
                <span style={{ color: 'red' }}>*</span>
              </label>
              <Select
                // menuPortalTarget={document.body}


                options={amcTypeOption}
                value={amcTypeOption.filter((item) => item.value === amcFormModalObj.amcTypeID)}
                onChange={handleAmcTypeIDChange}
                menuPosition="fixed"
              />
              {error &&
                (amcFormModalObj.amcTypeID === null ||
                  amcFormModalObj.amcTypeID === undefined ||
                  amcFormModalObj.amcTypeID === '') ? (
                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
            </div>

          </div>


          <div style={{ overflowX: "auto", padding: "20px 0" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                minWidth: "600px", // ensures horizontal scroll if too many dates
              }}
            >
              {/* Horizontal dotted line */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "0",
                  right: "0",
                  height: "2px",
                  borderTop: "2px dotted #888",
                  zIndex: 0,
                }}
              ></div>

              {visitDates.length > 0 ? (
                visitDates.map((item, index) => (
                  <motion.div
                    key={item.visitNo}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    style={{ position: "relative", textAlign: "center", flex: 1 }}
                  >
                    {/* Circle */}
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: "#FF6B6B",
                        border: "2px solid white",
                        margin: "0 auto",
                        zIndex: 1,
                        boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                      }}
                    ></div>

                    {/* Date box */}
                    <div
                      style={{
                        marginTop: "8px",
                        background: "#f8f9fa",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        display: "inline-block",
                        boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
                        minWidth: "120px",
                      }}
                    >
                      <strong>Visit {item.visitNo}:</strong> {item.visitDate}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-muted">No visit dates available</div>
              )}
            </div>
          </div>



        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            onHide();
            setInitialData();
          }}
        >
          Close
        </Button>
        <button style={{

          background: '#ffaa33',

        }}
          className=" d-flex btn text-white  text-nowrap" onClick={handlSendApprovalBtnClick}>
          Submit
        </button>
      </Modal.Footer>
      <SuccessPopupModal
        show={showSuccessModel}
        onHide={() => closeAll()}
        setShowSuccessModal={setShowSuccessModal}
        modelAction={actionMassage}
      />
    </Modal >
  );
};

export default AddUpdateAMCModal;
