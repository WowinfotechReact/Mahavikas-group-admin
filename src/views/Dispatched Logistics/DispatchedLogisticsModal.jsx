


import React, { useContext, useEffect, useState } from "react";
import Select from 'react-select';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import {
      Dialog,
      DialogTitle,
      Typography,
      DialogContent,
      DialogActions,
      IconButton,
      Button,
      RadioGroup,
      FormControlLabel,
      Radio,
      Grid,
      Fade,
      Table,
      TableHead,
      TableBody,
      TableCell,
      TableRow,
      Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import { ConfigContext } from "context/ConfigContext";
import { uploadPdfWithNodeApi } from "services/UploadImage/UploadImage";
import { ERROR_MESSAGES } from "component/GlobalMassage";
import SerialNoModal from './SerialNoModal'
import { AddUpdateDispatchOrder } from "services/Dispatched Order/DispatchedOrderApi";
import SuccessPopupModal from "component/SuccessPopupModal";
const DispatchedLogisticsModal = ({ open, onClose, modelRequestData }) => {
      const [showSuccessModal, setShowSuccessModal] = useState(false);

      const [selfSelected, setSelfSelected] = useState(false);

      const [errorMessage, setErrorMessage] = useState();
      const { setLoader, user } = useContext(ConfigContext);

      const [error, setErrors] = useState(null);

      const [modelAction, setModelAction] = useState();
      const vehicleTypeOption = [
            { value: 1, label: '2 Wheeler' },
            { value: 2, label: '3 Wheeler' },
            { value: 3, label: '4 Wheeler' },
            { value: 4, label: 'Other' },
      ]
      const [isFileChanged, setIsFileChanged] = useState(false); // 🔑 flag
      useEffect(() => {

            setDispatchedObj({
                  ...dispatchedObj,
                  quotationAddress: modelRequestData.address
            })

      }, [modelRequestData])
      const [dispatchedObj, setDispatchedObj] = useState({




            // radio button selections
            dispatchTypeID: "1", // self | customerPickup
            selfType: null, // selfVehicle | vendor (only if self)
            leadKeyID: null,
            // Self Vehicle
            driverName: null,
            moileNo1: null,
            vehicleNumber: null,
            vehicleTypeID: null,
            quotationAddress: null,

            // Vendor
            vendorName: null,
            logisticReceiptNumber: null,
            logisticReceiptDate: null,
            expectedDeliveryDate: null,
            vendorVehicleNo: null,
            moileNo1: null,
            moileNo2: null,
            moileNo3: null,
            logisticReceiptPDF: null,
            lrCopyPdfPreview: null,

            // Customer Pickup
            customerName: null,
            moileNo1: null,
            customerVehicleNo: null,
            pickUpDate: null,


            salesProductSerID: []
      });


      // universal handler
      const handleChange = (field, value) => {
            setDispatchedObj((prev) => ({
                  ...prev,
                  [field]: value,
            }));
      };




      const handleSubmit = () => {
            // ✅ Flatten all selected salesProductSerID
            const allSerialIDs = Object.values(productSerials)
                  .flat()
                  .map(s => s.salesProductSerID);

            // ✅ Add to dispatchedObj
            dispatchedObj.salesProductSerID = allSerialIDs;





            if (allSerialIDs.length === 0) {
                  setErrors(true);
                  alert("Please select at  serial number.");
                  return;
            }
            const errors = {};


            if (dispatchedObj.dispatchTypeID === "1") {
                  if (!dispatchedObj.driverName) errors.driverName = "Driver Name is required";
                  if (!dispatchedObj.moileNo1) errors.moileNo1 = "Mobile Number is required";
                  if (!dispatchedObj.vehicleNumber) errors.vehicleNumber = "Vehicle Number is required";
                  if (!dispatchedObj.vehicleTypeID) errors.vehicleTypeID = "Vehicle Type is required";
                  if (!dispatchedObj.quotationAddress) errors.quotationAddress = "Address is required";
            }

            if (dispatchedObj.dispatchTypeID === "2") {
                  if (!dispatchedObj.vendorName) errors.vendorName = "Vendor Name is required";
                  if (!dispatchedObj.logisticReceiptPDF) errors.logisticReceiptPDF = "LR Copy is required";
                  if (!dispatchedObj.logisticReceiptNumber) errors.lrNumber = "LR Number is required";
                  if (!dispatchedObj.logisticReceiptDate) errors.logisticReceiptDate = "LR Date is required";
                  if (!dispatchedObj.vendorVehicleNo) errors.vendorVehicleNo = "Vehicle Number is required";
                  if (!dispatchedObj.expectedDeliveryDate) errors.expectedDeliveryDate = "Expected Delivery Date is required";
            }


            if (dispatchedObj.dispatchTypeID === "4") {
                  if (!dispatchedObj.customerName) errors.customerName = "Customer Name is required";
                  if (!dispatchedObj.moileNo1) errors.moileNo1 = "Mobile Number is required";
                  if (!dispatchedObj.customerVehicleNo) errors.customerVehicleNo = "Vehicle Number is required";
                  if (!dispatchedObj.pickUpDate) errors.pickupDate = "Pickup Date is required";
            }

            if (Object.keys(errors).length > 0) {

                  setErrors(true); // ✅ trigger inline error rendering
                  return;
            }


            const apiParam = {
                  userKeyID: user.userKeyID,
                  dispatchOrderKeyID: dispatchedObj.dispatchOrderKeyID,
                  dispatchTypeID: dispatchedObj.dispatchTypeID,
                  logisticReceiptNumber: dispatchedObj.logisticReceiptNumber,
                  logisticReceiptPDF: dispatchedObj.logisticReceiptPDF,
                  logisticReceiptDate: dispatchedObj.logisticReceiptDate,
                  driverName: dispatchedObj.driverName,
                  vehicleTypeID: dispatchedObj.vehicleTypeID,
                  vehicleNumber: dispatchedObj.vehicleNumber,
                  quotationAddress: dispatchedObj.quotationAddress,
                  vendorName: dispatchedObj.vendorName,
                  expectedDeliveryDate: dispatchedObj.expectedDeliveryDate,
                  moileNo1: dispatchedObj.moileNo1,
                  moileNo2: dispatchedObj.moileNo2,
                  moileNo3: dispatchedObj.moileNo3
                  ,
                  customerName: dispatchedObj.customerName,
                  leadKeyID: modelRequestData.leadKeyID,
                  invoiceKeyID: modelRequestData.invoiceKeyID,
                  salesProductSerID: allSerialIDs


            }

            AddUpdateDispatchOrderData(apiParam)
            // onConfirm(dispatchedObj);
      };


      const AddUpdateDispatchOrderData = async (apiParam) => {
            setLoader(true);
            try {
                  let url = '/AddUpdateDispatchOrder'; // Default URL for Adding Data

                  const response = await AddUpdateDispatchOrder(url, apiParam);
                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false);
                              setShowSuccessModal(true);
                              setModelAction(
                                    modelRequestData.Action === null || modelRequestData.Action === undefined
                                          ? 'Product Dispatched Successfully!'
                                          : 'Product Dispatched Successfully!'
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


      const handleVehicleType = (selectedOption) => {
            setDispatchedObj((prev) => ({
                  ...prev,
                  vehicleTypeID: selectedOption ? selectedOption.value : null
            }));
      };

      const handleLRDateChange = (date) => {
            setDispatchedObj((prevState) => ({
                  ...prevState,
                  logisticReceiptDate: date // Update state with selected date
            }));
      };
      const handleExpectedDeliveryDateChange = (date) => {
            setDispatchedObj((prevState) => ({
                  ...prevState,
                  expectedDeliveryDate: date // Update state with selected date
            }));
      };
      const handlePickUpDate = (date) => {
            setDispatchedObj((prevState) => ({
                  ...prevState,
                  pickUpDate: date // Update state with selected date
            }));
      };


      const [openSerialModal, setOpenSerialModal] = React.useState(false);
      const [selectedProduct, setSelectedProduct] = React.useState(null);
      const [productSerials, setProductSerials] = React.useState({});



      const closeAllModal = () => {
            setShowSuccessModal(false);
            onClose()
      }

      return (
            <Dialog
                  open={open}
                  onClose={(event, reason) => {
                        if (reason !== "backdropClick") {
                              onClose();
                        }
                  }}
                  maxWidth="sm"
                  fullWidth
                  TransitionComponent={Fade}
            >
                  {/* Header */}
                  <DialogTitle
                        sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontWeight: "bold",
                        }}
                  >
                        <Typography variant="h3" component="h3" >
                              Dispatched Product
                        </Typography>                        <IconButton onClick={onClose} edge="end" aria-label="close">
                              <CloseIcon />
                        </IconButton>
                  </DialogTitle>
                  <span style={{ color: 'red' }}>{errorMessage}</span>
                  <DialogContent dividers>


                        {Array.isArray(modelRequestData?.invoiceProductMappingList) &&
                              modelRequestData.invoiceProductMappingList.length > 0 ? (
                              <Table size="small" sx={{ mt: 2 }}>
                                    <TableHead>
                                          <TableRow>
                                                <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                                                <TableCell sx={{ fontWeight: "bold" }}>Product Name</TableCell>
                                                <TableCell sx={{ fontWeight: "bold" }}>Qty</TableCell>
                                                <TableCell sx={{ fontWeight: "bold" }}>Rate  ⟨₹⟩</TableCell>
                                                <TableCell sx={{ fontWeight: "bold" }}>Amt  ⟨₹⟩</TableCell>
                                                <TableCell sx={{ fontWeight: "bold" }}>Serial Numbers</TableCell>
                                          </TableRow>
                                    </TableHead>

                                    <TableBody>
                                          {modelRequestData.invoiceProductMappingList.map((prod, idx) => (
                                                <TableRow key={idx}>
                                                      <TableCell>{idx + 1}</TableCell>
                                                      <TableCell>{prod.productName || "-"}</TableCell>

                                                      {/* Qty cell clickable */}
                                                      <TableCell

                                                      >
                                                            {prod.quantity || 0}
                                                      </TableCell>

                                                      <TableCell>{prod.rate || 0}</TableCell>
                                                      <TableCell>{(prod.quantity || 0) * (prod.rate || 0)}</TableCell>

                                                      {/* Show assigned serials */}
                                                      <TableCell>
                                                            {productSerials[prod.invoiceProductMapID]?.length > 0 ? (
                                                                  productSerials[prod.invoiceProductMapID]
                                                                        .map((s) =>
                                                                              typeof s === "string" ? s : `${s.serialNumber} (#${s.salesProductSerID})`
                                                                        )
                                                                        .join(", ")
                                                            ) : (
                                                                  <span
                                                                        style={{ color: "blue", cursor: "pointer" }}
                                                                        onClick={() => {
                                                                              setSelectedProduct(prod);

                                                                              // Only auto-assign if the serials belong uniquely to this product
                                                                              const availableSerials = prod.soSerialMappingList || [];
                                                                              if (availableSerials.length === prod.quantity) {
                                                                                    setProductSerials((prev) => ({
                                                                                          ...prev,
                                                                                          [prod.invoiceProductMapID]: availableSerials.map((s) => ({
                                                                                                serialNumber: s.serialNumber,
                                                                                                salesProductSerID: s.salesProductSerID,
                                                                                          })),
                                                                                    }));
                                                                              }

                                                                              // Always open modal for manual adjustments or partial serials
                                                                              setOpenSerialModal(true);
                                                                        }}
                                                                  >
                                                                        Assign Serials
                                                                  </span>
                                                            )}
                                                      </TableCell>



                                                </TableRow>
                                          ))}
                                    </TableBody>
                              </Table>
                        ) : (
                              <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    align="center"
                                    sx={{ mt: 2 }}
                              >
                                    No products available
                              </Typography>
                        )}


                        <Divider sx={{ my: 2 }} />
                        <fieldset
                              style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "6px",
                                    padding: "12px 16px 16px 16px", // extra padding to fit legend
                                    margin: 0,
                              }}
                        >
                              <legend style={{ padding: "0 8px", fontWeight: "500", fontSize: "14px" }}>
                                    Dispatch Type
                              </legend>
                              {/* Parent Radio Group */}
                              <RadioGroup
                                    row
                                    value={["1", "2"].includes(dispatchedObj.dispatchTypeID) ? "self" : dispatchedObj.dispatchTypeID}
                                    onChange={(e) => {
                                          const value = e.target.value;
                                          if (value === "self") {
                                                handleChange("dispatchTypeID", "1");
                                          } else {
                                                handleChange("dispatchTypeID", value);
                                          }
                                          setErrors(false);
                                    }}
                              >
                                    <FormControlLabel value="self" control={<Radio />} label="Self" />
                                    <FormControlLabel value="4" control={<Radio />} label="Customer Pickup" />
                              </RadioGroup>

                              {/* Child Radio Group (only when self is active) */}
                              {["1", "2"].includes(dispatchedObj.dispatchTypeID) && (
                                    <div style={{ marginLeft: "40px", marginTop: "8px" }}>
                                          <RadioGroup
                                                row
                                                value={dispatchedObj.dispatchTypeID}
                                                onChange={(e) => {
                                                      handleChange("dispatchTypeID", e.target.value);
                                                      setErrors(false);
                                                }}
                                          >
                                                <FormControlLabel value="1" control={<Radio />} label="Self Vehicle" />
                                                <FormControlLabel value="2" control={<Radio />} label="Vendor" />
                                          </RadioGroup>
                                    </div>
                              )}
                        </fieldset>



                        {/* Self section */}

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>


                              {/* Self Vehicle Fields */}
                              {dispatchedObj.dispatchTypeID === "1" && (
                                    <Grid container spacing={2} mt={1}>
                                          <Grid item xs={6}>
                                                <label htmlFor="dispatchDriverName" className="form-label">Driver Name</label>
                                                <span style={{ color: "red" }}> * </span>

                                                <input
                                                      maxLength={50}
                                                      type="text"
                                                      className="form-control"
                                                      id="dispatchDriverName"
                                                      name="dispatchDriverName"
                                                      placeholder="Enter Driver Name"
                                                      aria-describedby="Employee"
                                                      value={dispatchedObj.driverName}
                                                      onChange={(e) => {
                                                            let inputValue = e.target.value;

                                                            // Remove leading space
                                                            if (inputValue.startsWith(' ')) {
                                                                  inputValue = inputValue.trimStart();
                                                            }

                                                            // Allow only letters, numbers, and spaces
                                                            inputValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                                                            // Capitalize the first letter of each word
                                                            const capitalized = inputValue
                                                                  .split(' ')
                                                                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                                  .join(' ');

                                                            setDispatchedObj((prev) => ({
                                                                  ...prev,
                                                                  driverName: capitalized
                                                            }));
                                                      }}
                                                />


                                                {error &&
                                                      (dispatchedObj.driverName === null ||
                                                            dispatchedObj.driverName === undefined ||
                                                            dispatchedObj.driverName === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}

                                          </Grid>
                                          <Grid item xs={6}>
                                                <label htmlFor="dispatchDriverMobileNo" className="form-label">Driver Mobile No.</label>
                                                <span style={{ color: "red" }}> * </span>

                                                <input
                                                      maxLength={10}
                                                      type="text"
                                                      className="form-control"
                                                      id="dispatchDriverMobileNo"
                                                      name="dispatchDriverMobileNo"
                                                      placeholder="Enter Contact Number"
                                                      value={dispatchedObj.moileNo1}
                                                      onChange={(e) => {
                                                            setErrorMessage('');
                                                            const value = e.target.value;
                                                            let FormattedNumber = value.replace(/[^0-9]/g, ''); // Allows only numbers

                                                            // Apply regex to ensure the first digit is between 6 and 9
                                                            FormattedNumber = FormattedNumber.replace(/^[0-5]/, '');
                                                            setDispatchedObj((prev) => ({
                                                                  ...prev,
                                                                  moileNo1: FormattedNumber
                                                            }));
                                                      }}
                                                />



                                                {error &&
                                                      (dispatchedObj.moileNo1 === null ||
                                                            dispatchedObj.moileNo1 === undefined ||
                                                            dispatchedObj.moileNo1 === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </Grid>
                                          <Grid item xs={6}>
                                                <label htmlFor="dispatchVehicleNo" className="form-label">Vehicle No.</label>
                                                <span style={{ color: "red" }}> * </span>

                                                <input
                                                      maxLength={10}
                                                      type="text"
                                                      className="form-control"
                                                      id="dispatchVehicleNo"
                                                      name="dispatchVehicleNo"
                                                      placeholder="Enter Vehicle Number"
                                                      value={dispatchedObj.vehicleNumber}
                                                      onChange={(e) => {
                                                            let InputValue = e.target.value;
                                                            const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s]/g, '').toUpperCase();
                                                            setDispatchedObj((prev) => ({
                                                                  ...prev,
                                                                  vehicleNumber: updatedValue
                                                            }));
                                                      }}
                                                />

                                                {error &&
                                                      (dispatchedObj.vehicleNumber === null ||
                                                            dispatchedObj.vehicleNumber === undefined ||
                                                            dispatchedObj.vehicleNumber === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </Grid>
                                          <Grid item xs={6}>
                                                <label htmlFor="dispatchVehicleType" className="form-label">Vehicle Type</label>
                                                <span style={{ color: "red" }}> * </span>

                                                <Select
                                                      options={vehicleTypeOption}
                                                      value={vehicleTypeOption.find((item) => item.value === dispatchedObj.vehicleTypeID) || null}
                                                      id="dispatchVehicleType"
                                                      name="dispatchVehicleType"
                                                      onChange={handleVehicleType}
                                                      className="user-role-select phone-input-country-code" />

                                                {error &&
                                                      (dispatchedObj.vehicleTypeID === null ||
                                                            dispatchedObj.vehicleTypeID === undefined ||
                                                            dispatchedObj.vehicleTypeID === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}

                                          </Grid>

                                          <Grid item xs={12}>
                                                <label htmlFor="dispatchQuotationAddress" className="form-label">Address</label>
                                                <span style={{ color: "red" }}> * </span>

                                                <textarea
                                                      id="dispatchQuotationAddress"
                                                      name="dispatchQuotationAddress"
                                                      className="form-control"
                                                      placeholder="Enter Address"
                                                      maxLength={250}
                                                      value={dispatchedObj.quotationAddress}
                                                      onChange={(e) => {
                                                            setErrorMessage(false);
                                                            let InputValue = e.target.value;
                                                            // Updated regex to allow common special characters for addresses
                                                            const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s,.-/#&()]/g, '');
                                                            setDispatchedObj((prev) => ({
                                                                  ...prev,
                                                                  quotationAddress: updatedValue
                                                            }));
                                                      }}
                                                />


                                                {error &&
                                                      (dispatchedObj.quotationAddress === null ||
                                                            dispatchedObj.quotationAddress === undefined ||
                                                            dispatchedObj.quotationAddress === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </Grid>
                                    </Grid>
                              )}

                              {/* Vendor Fields */}
                              {dispatchedObj.dispatchTypeID === "2" && (
                                    <Grid container spacing={2} mt={1}>

                                          <Grid item xs={6}>
                                                <label htmlFor="dispatchVendorName" className="form-label">Vendor Name</label>
                                                <span style={{ color: "red" }}> * </span>
                                                <input
                                                      maxLength={50}
                                                      type="text"
                                                      className="form-control"
                                                      id="dispatchVendorName"
                                                      name="dispatchVendorName"
                                                      placeholder="Enter Vendor Name"
                                                      aria-describedby="Employee"
                                                      value={dispatchedObj.vendorName}
                                                      onChange={(e) => {
                                                            let inputValue = e.target.value;

                                                            // Remove leading space
                                                            if (inputValue.startsWith(' ')) {
                                                                  inputValue = inputValue.trimStart();
                                                            }

                                                            // Allow only letters, numbers, and spaces
                                                            inputValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                                                            // Capitalize the first letter of each word
                                                            const capitalized = inputValue
                                                                  .split(' ')
                                                                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                                  .join(' ');

                                                            setDispatchedObj((prev) => ({
                                                                  ...prev,
                                                                  vendorName: capitalized
                                                            }));
                                                      }}
                                                />
                                                {error &&
                                                      (dispatchedObj.vendorName === null ||
                                                            dispatchedObj.vendorName === undefined ||
                                                            dispatchedObj.vendorName === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </Grid>
                                          <Grid item xs={6}>
                                                <label htmlFor="vendorMob1" className="form-label">Vendor Mobile 1</label>

                                                <input
                                                      maxLength={10}
                                                      type="text"
                                                      className="form-control"
                                                      id="vendorMob1"
                                                      name="vendorMob1"
                                                      placeholder="Enter Vendor Contact Number 1"
                                                      value={dispatchedObj.moileNo1}
                                                      onChange={(e) => {
                                                            setErrorMessage('');
                                                            const value = e.target.value;
                                                            let FormattedNumber = value.replace(/[^0-9]/g, ''); // Allows only numbers

                                                            // Apply regex to ensure the first digit is between 6 and 9
                                                            FormattedNumber = FormattedNumber.replace(/^[0-5]/, '');
                                                            setDispatchedObj((prev) => ({
                                                                  ...prev,
                                                                  moileNo1: FormattedNumber
                                                            }));
                                                      }}
                                                />

                                          </Grid>


                                          <Grid item xs={6}>
                                                <label htmlFor="dispatchedLrDate" className="form-label">LR Date</label>
                                                <span style={{ color: "red" }}> * </span>

                                                <DatePicker
                                                      id="dispatchedLrDate"
                                                      name="dispatchedLrDate"
                                                      value={dispatchedObj?.logisticReceiptDate} // Use "selected" instead of "value"
                                                      onChange={handleLRDateChange}
                                                      label="From Date"
                                                      clearIcon={null}
                                                      popperPlacement="bottom-start"
                                                />
                                                {error &&
                                                      (dispatchedObj.logisticReceiptDate === null ||
                                                            dispatchedObj.logisticReceiptDate === undefined ||
                                                            dispatchedObj.logisticReceiptDate === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </Grid><Grid item xs={6}>
                                                <label htmlFor="dispatchedExpectedDelivery" className="form-label">Expected Delivery</label>

                                                <DatePicker
                                                      id="dispatchedExpectedDelivery"
                                                      name="dispatchedExpectedDelivery"
                                                      value={dispatchedObj?.expectedDeliveryDate} // Use "selected" instead of "value"
                                                      onChange={handleExpectedDeliveryDateChange}
                                                      label="From Date"
                                                      clearIcon={null}
                                                      popperPlacement="bottom-start"
                                                />
                                                {error &&
                                                      (dispatchedObj.expectedDeliveryDate === null ||
                                                            dispatchedObj.expectedDeliveryDate === undefined ||
                                                            dispatchedObj.expectedDeliveryDate === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </Grid>
                                          <Grid item xs={6}>
                                                <label htmlFor="dispatchedVehicleNo" className="form-label">Vehicle No.</label>
                                                <span style={{ color: "red" }}> * </span>

                                                <input
                                                      maxLength={10}
                                                      type="text"
                                                      className="form-control"
                                                      id="dispatchedVehicleNo"
                                                      name="dispatchedVehicleNo"
                                                      placeholder="Enter Vehicle Number"
                                                      value={dispatchedObj.vendorVehicleNo}
                                                      onChange={(e) => {
                                                            let InputValue = e.target.value;
                                                            const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s]/g, '').toUpperCase();
                                                            setDispatchedObj((prev) => ({
                                                                  ...prev,
                                                                  vendorVehicleNo: updatedValue
                                                            }));
                                                      }}
                                                />
                                                {error &&
                                                      (dispatchedObj.vendorVehicleNo === null ||
                                                            dispatchedObj.vendorVehicleNo === undefined ||
                                                            dispatchedObj.vendorVehicleNo === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </Grid>



                                          <Grid item xs={6}>
                                                <label htmlFor="dispatchedVendorMobile" className="form-label">Vendor Mobile 2</label>

                                                <input
                                                      maxLength={10}
                                                      type="text"
                                                      className="form-control"
                                                      id="dispatchedVendorMobile"
                                                      name="dispatchedVendorMobile"
                                                      placeholder="Enter Vendor Contact Number 2"
                                                      value={dispatchedObj.moileNo2}
                                                      onChange={(e) => {
                                                            setErrorMessage('');
                                                            const value = e.target.value;
                                                            let FormattedNumber = value.replace(/[^0-9]/g, ''); // Allows only numbers

                                                            // Apply regex to ensure the first digit is between 6 and 9
                                                            FormattedNumber = FormattedNumber.replace(/^[0-5]/, '');
                                                            setDispatchedObj((prev) => ({
                                                                  ...prev,
                                                                  moileNo2: FormattedNumber
                                                            }));
                                                      }}
                                                />

                                          </Grid>
                                          <Grid item xs={6}>
                                                <label htmlFor="dispatchedVendorMobile3" className="form-label">Vendor Mobile 3</label>

                                                <input
                                                      maxLength={10}
                                                      type="text"
                                                      className="form-control"
                                                      id="dispatchedVendorMobile3"
                                                      name="dispatchedVendorMobile3"
                                                      placeholder="Enter Vendor Contact Number 3"
                                                      value={dispatchedObj.moileNo3}
                                                      onChange={(e) => {
                                                            setErrorMessage('');
                                                            const value = e.target.value;
                                                            let FormattedNumber = value.replace(/[^0-9]/g, ''); // Allows only numbers

                                                            // Apply regex to ensure the first digit is between 6 and 9
                                                            FormattedNumber = FormattedNumber.replace(/^[0-5]/, '');
                                                            setDispatchedObj((prev) => ({
                                                                  ...prev,
                                                                  moileNo3: FormattedNumber
                                                            }));
                                                      }}
                                                />
                                          </Grid>

                                          <Grid item xs={6}>
                                                <label htmlFor="dispatchedLrNumb" className="form-label">LR Number</label>
                                                <span style={{ color: "red" }}> * </span>

                                                <input
                                                      maxLength={10}
                                                      type="text"
                                                      className="form-control"
                                                      id="dispatchedLrNumb"
                                                      name="dispatchedLrNumb"
                                                      placeholder="Enter LR Number"
                                                      value={dispatchedObj.logisticReceiptNumber}
                                                      onChange={(e) => {
                                                            let InputValue = e.target.value;
                                                            const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s]/g, '').toUpperCase();
                                                            setDispatchedObj((prev) => ({
                                                                  ...prev,
                                                                  logisticReceiptNumber: updatedValue
                                                            }));
                                                      }}
                                                />
                                                {error &&
                                                      (dispatchedObj.logisticReceiptNumber === null ||
                                                            dispatchedObj.logisticReceiptNumber === undefined ||
                                                            dispatchedObj.logisticReceiptNumber === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </Grid>

                                          <Grid item xs={6}>



                                                <label htmlFor="dispatchedLRCopy" className="form-label">
                                                      Upload LR Copy
                                                      <span style={{ color: 'red' }}>*</span>
                                                </label>


                                                <input
                                                      type="file"
                                                      id="dispatchedLRCopy"
                                                      name="dispatchedLRCopy"
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
                                                                        setLoader(false)
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
                                                                        setDispatchedObj((prev) => ({
                                                                              ...prev,
                                                                              logisticReceiptPDF: s3Url,
                                                                              lrCopyPdfPreview: fileURL
                                                                        }));
                                                                        setIsFileChanged(true);

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
                                                      (dispatchedObj.logisticReceiptPDF === null ||
                                                            dispatchedObj.logisticReceiptPDF === undefined ||
                                                            dispatchedObj.logisticReceiptPDF === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </Grid>
                                          <Grid item xs={6}>

                                                {dispatchedObj.lrCopyPdfPreview && (
                                                      <div >

                                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                                  <strong>Preview:</strong>
                                                                  <div>
                                                                        <a
                                                                              href={dispatchedObj.lrCopyPdfPreview}
                                                                              target="_blank"
                                                                              rel="noopener noreferrer"
                                                                              className="btn btn-sm text-white me-2"
                                                                              title="View  PDF"
                                                                              style={{ background: '#ff7d34' }}
                                                                        >
                                                                              <i className="fa-solid fa-eye"></i>
                                                                        </a>
                                                                        <button
                                                                              className="btn btn-sm btn-danger"
                                                                              onClick={() => {
                                                                                    setDispatchedObj((prev) => ({
                                                                                          ...prev,
                                                                                          logisticReceiptPDF: null,
                                                                                          lrCopyPdfPreview: null,
                                                                                    }));
                                                                              }}
                                                                              title="Remove PDF"
                                                                        >
                                                                              <i className="fa-solid fa-trash"></i>
                                                                        </button>
                                                                  </div>
                                                            </div>
                                                            <iframe
                                                                  src={dispatchedObj.lrCopyPdfPreview}
                                                                  title="PO PDF Preview"
                                                                  width="100%"
                                                                  height="100px"
                                                                  style={{ border: '1px solid #ccc', borderRadius: '4px' }}

                                                            />
                                                      </div>
                                                )}


                                          </Grid>
                                    </Grid>
                              )}
                        </motion.div>


                        {/* Customer Pickup */}
                        {dispatchedObj.dispatchTypeID === "4" && (
                              <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ marginTop: 16 }}
                              >
                                    <Grid container spacing={2}>
                                          <Grid item xs={6}>
                                                <label htmlFor="dispatchedCustName" className="form-label">Customer Name</label>
                                                <span style={{ color: "red" }}> * </span>

                                                <input
                                                      maxLength={50}
                                                      type="text"
                                                      className="form-control"
                                                      id="dispatchedCustName"
                                                      name="dispatchedCustName"
                                                      placeholder="Enter Customer Name"
                                                      aria-describedby="Employee"
                                                      value={dispatchedObj.customerName}
                                                      onChange={(e) => {
                                                            let inputValue = e.target.value;

                                                            // Remove leading space
                                                            if (inputValue.startsWith(' ')) {
                                                                  inputValue = inputValue.trimStart();
                                                            }

                                                            // Allow only letters, numbers, and spaces
                                                            inputValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                                                            // Capitalize the first letter of each word
                                                            const capitalized = inputValue
                                                                  .split(' ')
                                                                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                                  .join(' ');

                                                            setDispatchedObj((prev) => ({
                                                                  ...prev,
                                                                  customerName: capitalized
                                                            }));
                                                      }}
                                                />
                                                {error &&
                                                      (dispatchedObj.customerName === null ||
                                                            dispatchedObj.customerName === undefined ||
                                                            dispatchedObj.customerName === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </Grid>
                                          <Grid item xs={6}>
                                                <label htmlFor="dispatchedCustMob" className="form-label">Customer Mobile</label>
                                                <span style={{ color: "red" }}> * </span>

                                                <input
                                                      maxLength={10}
                                                      type="text"
                                                      className="form-control"
                                                      id="dispatchedCustMob"
                                                      name="dispatchedCustMob"
                                                      placeholder="Enter Customer Contact No."
                                                      value={dispatchedObj.moileNo1}
                                                      onChange={(e) => {
                                                            setErrorMessage('');
                                                            const value = e.target.value;
                                                            let FormattedNumber = value.replace(/[^0-9]/g, ''); // Allows only numbers

                                                            // Apply regex to ensure the first digit is between 6 and 9
                                                            FormattedNumber = FormattedNumber.replace(/^[0-5]/, '');
                                                            setDispatchedObj((prev) => ({
                                                                  ...prev,
                                                                  moileNo1: FormattedNumber
                                                            }));
                                                      }}
                                                />
                                                {error &&
                                                      (dispatchedObj.moileNo1 === null ||
                                                            dispatchedObj.moileNo1 === undefined ||
                                                            dispatchedObj.moileNo1 === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </Grid>
                                          <Grid item xs={6}>
                                                <label htmlFor="dispatchedCustVehicleNo" className="form-label">Vehicle No.</label>
                                                <span style={{ color: "red" }}> * </span>

                                                <input
                                                      maxLength={10}
                                                      type="text"
                                                      className="form-control"
                                                      id="dispatchedCustVehicleNo"
                                                      name="dispatchedCustVehicleNo"
                                                      placeholder="Enter Customer Vehicle No."
                                                      value={dispatchedObj.customerVehicleNo}
                                                      onChange={(e) => {
                                                            let InputValue = e.target.value;
                                                            const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s]/g, '').toUpperCase();
                                                            setDispatchedObj((prev) => ({
                                                                  ...prev,
                                                                  customerVehicleNo: updatedValue
                                                            }));
                                                      }}
                                                />
                                                {error &&
                                                      (dispatchedObj.customerVehicleNo === null ||
                                                            dispatchedObj.customerVehicleNo === undefined ||
                                                            dispatchedObj.customerVehicleNo === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </Grid>
                                          <Grid item xs={6}>
                                                <label className="form-label">Pickup Date</label>
                                                <span style={{ color: "red" }}> * </span>

                                                <DatePicker
                                                      value={dispatchedObj?.pickUpDate} // Use "selected" instead of "value"
                                                      onChange={handlePickUpDate}
                                                      label="From Date"
                                                      clearIcon={null}
                                                      popperPlacement="bottom-start"
                                                />
                                                {error &&
                                                      (dispatchedObj.pickUpDate === null ||
                                                            dispatchedObj.pickUpDate === undefined ||
                                                            dispatchedObj.pickUpDate === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </Grid>
                                    </Grid>
                              </motion.div>
                        )}
                  </DialogContent>

                  {/* Footer */}
                  <DialogActions sx={{ justifyContent: "flex-end", p: 2 }}>

                        <button
                              id="submitBtn"                       // 🟢 optional, stable for automation
                              data-testid="submit-button"
                              className="text-white btn "
                              style={{ background: "#ffaa33" }}
                              onClick={handleSubmit}
                        >
                              Dispatched
                        </button>
                  </DialogActions>
                  <SerialNoModal
                        open={openSerialModal}
                        onClose={() => setOpenSerialModal(false)}
                        product={selectedProduct}
                        productSerials={productSerials}
                        setProductSerials={setProductSerials}
                  />
                  {showSuccessModal && (
                        <SuccessPopupModal
                              show={showSuccessModal}
                              onHide={() => closeAllModal()}
                              setShowSuccessModal={setShowSuccessModal}
                              modelAction={modelAction}
                        />
                  )}
            </Dialog>
      );
};
export default DispatchedLogisticsModal;
