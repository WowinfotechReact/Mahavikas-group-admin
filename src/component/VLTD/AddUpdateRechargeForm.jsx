import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { ConfigContext } from 'context/ConfigContext';
import React, { useContext, useState } from 'react';
import { Table } from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import Select from 'react-select';
const AddUpdateRechargeForm = () => {
  const [selectedAgency, setSelectedAgency] = useState(''); // State to track selected value
  const [showTable, setShowTable] = useState(false); // State for showing the table
  const [selectedOption, setSelectedOption] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [error, setErrors] = useState(null);
  const { setLoader, user, companyID } = useContext(ConfigContext);

  const [newRechargeObj, setNewRechargeObj] = useState({
    customerName: null,
    customerContactNo: null,
    customerAddress: null,
    vehicleNo: null,
    aadharCardNo: null,
    rcBookName: null,
    rtoCode: null,
    mfgDate: null,
    rcBookFile: null,
    vehicleFrontImg: null,
    aadharImg: null,
    devicePhoto: null
  });

  // RC Book File  img
  const [rcBookFileImage, setRcBookFileImage] = useState(null);
  const [rcBookFileImagePreview, setRcBookFileImagePreview] = useState('');
  const [rcBookFileImageSizeError, setRcBookFileImageSizeError] = useState();

  const [uploadRcBookFileImageObj, setUploadRcBookFileImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: newRechargeObj.rcBookFileUrl,
    moduleName: 'New_Recharge'
  });
  // Vehicle Front Photo
  const [vehicleFrontImage, setVehicleFrontImage] = useState(null);
  const [vehicleFrontImagePreview, setVehicleFrontImagePreview] = useState('');
  const [vehicleFrontImageSizeError, setVehicleFrontImageSizeError] = useState();

  const [uploadVehicleFrontImageObj, setUploadVehicleFrontImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: newRechargeObj.vehicleFrontImageUrl,
    moduleName: 'New_Recharge'
  });

  // aadhar Card Photo
  const [aadhaarCardImage, setAadhaarCardImage] = useState(null);
  const [aadhaarCardImagePreview, setAadhaarCardImagePreview] = useState('');
  const [aadhaarCardImageSizeError, setAadhaarCardImageSizeError] = useState();

  const [uploadAadhaarCardImageObj, setUploadAadhaarCardImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: newRechargeObj.AadharCardImageUrl,
    moduleName: 'New_Recharge'
  });

  // device Photo
  const [deviceImage, setDeviceImage] = useState(null);
  const [deviceImagePreview, setDeviceImagePreview] = useState('');
  const [deviceImageSizeError, setDeviceImageSizeError] = useState();

  const [uploadDeviceImageObj, setUploadDeviceImageObj] = useState({
    userId: user.userKeyID,
    projectName: 'GPS_VELVET',
    imageFile: newRechargeObj.DeviceImageUrl,
    moduleName: 'New_Recharge'
  });

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };


  const machineListData = [
    {
      id: 1,
      vehicleNo: 'AP 29 1234',
      customerName: 'Ramesh',
      vehicleType: 'Car',
      rcBookFile: 'file',
      vehicleNoPlate: 'file',
      vehicleFrontView: 'file',
      vehicleSideView: 'file'
    },
    {
      id: 2,
      vehicleNo: 'MH 19 7410',
      customerName: 'Suresh',
      vehicleType: 'Truck',
      rcBookFile: 'file',
      vehicleNoPlate: 'file',
      vehicleFrontView: 'file',
      vehicleSideView: 'file'
    },
    {
      id: 3,
      vehicleNo: 'UP 22 6543',
      customerName: 'Kamlesh',
      vehicleType: 'Bike',
      rcBookFile: 'file',
      vehicleNoPlate: 'file',
      vehicleFrontView: 'file',
      vehicleSideView: 'file'
    },
    {
      id: 4,
      vehicleNo: 'Bh 54 4324',
      customerName: 'vishwes',
      vehicleType: 'JCB',
      rcBookFile: 'file',
      vehicleNoPlate: 'file',
      vehicleFrontView: 'file',
      vehicleSideView: 'file'
    }
  ];

  const handleDateChange = (date) => {
    setNewRechargeObj({
      ...newRechargeObj,
      mfgDate: date
    });
  };



  const setInitialValue = () => {
    setErrorMessage(false)
    setErrors('')
    handleRemoveRcBookFileImage()
    handleRemoveDevicePhoto()
    handleRemoveVehicleFrontImage()
    handleRemoveDevicePhoto()
    setSelectedAgency(false)
    setSelectedOption(false)
    setNewRechargeObj({
      ...newRechargeObj,
      customerName: '',
      customerContactNo: '',
      customerAddress: '',
      vehicleNo: '',
      aadharCardNo: null,
      rcBookName: '',
      rtoCode: '',
      mfgDate: '',
      rcBookFile: '',
      vehicleFrontImg: '',
      aadharImg: '',
      devicePhoto: ''
    });
  }

  const NewRechargeAddUpdateBtnClick = async () => {
    let isValid = false;
    let rcBookFileUrl = null;
    let vehicleFrontImageUrl = null;
    let AadharCardImageUrl = null;
    let DeviceImageUrl = null;

    if (
      newRechargeObj.customerName === '' ||
      newRechargeObj.customerName === undefined ||
      newRechargeObj.customerName === null ||
      newRechargeObj.customerContactNo === '' ||
      newRechargeObj.customerContactNo === undefined ||
      newRechargeObj.customerContactNo === null ||
      newRechargeObj.customerContactNo?.length < 10 ||
      newRechargeObj.customerAddress === '' ||
      newRechargeObj.customerAddress === undefined ||
      newRechargeObj.customerAddress === null ||
      newRechargeObj.vehicleNo === '' ||
      newRechargeObj.vehicleNo === undefined ||
      newRechargeObj.vehicleNo === null ||
      newRechargeObj.aadharCardNo === '' ||
      newRechargeObj.aadharCardNo === undefined ||
      newRechargeObj.aadharCardNo === null ||
      newRechargeObj.rcBookName === '' ||
      newRechargeObj.rcBookName === undefined ||
      newRechargeObj.rcBookName === null ||
      newRechargeObj.rtoCode === '' ||
      newRechargeObj.rtoCode === undefined ||
      newRechargeObj.rtoCode === null ||
      newRechargeObj.mfgDate === '' ||
      newRechargeObj.mfgDate === undefined ||
      newRechargeObj.mfgDate === null ||
      rcBookFileUrl === '' ||
      rcBookFileUrl === null ||
      rcBookFileUrl === undefined ||
      vehicleFrontImageUrl === '' ||
      vehicleFrontImageUrl === null ||
      vehicleFrontImageUrl === undefined ||
      AadharCardImageUrl === '' ||
      AadharCardImageUrl === null ||
      AadharCardImageUrl === undefined ||
      DeviceImageUrl === '' ||
      DeviceImageUrl === null ||
      DeviceImageUrl === undefined ||
      selectedAgency === '' ||
      selectedAgency === null ||
      selectedAgency === undefined
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }
    const apiParam = {
      customerName: newRechargeObj.customerName,
      customerContactNo: newRechargeObj.customerContactNo,
      customerAddress: newRechargeObj.customerAddress,
      vehicleNo: newRechargeObj.vehicleNo,
      aadharCardNo: newRechargeObj.aadharCardNo,
      rcBookName: newRechargeObj.rcBookName,
      rtoCode: newRechargeObj.rtoCode,
      mfgDate: newRechargeObj.mfgDate,
      rcBookFile: rcBookFileUrl,
      vehicleFrontImg: vehicleFrontImageUrl,
      aadharImg: AadharCardImageUrl,
      devicePhoto: DeviceImageUrl
    };


  };
  // RC book file remove
  const handleRemoveRcBookFileImage = () => {
    setRcBookFileImagePreview(null);
    setRcBookFileImage(null);
  };
  //  rc file book change
  const handleRCBookFileImageChange = (e) => {
    const file = e.target.files[0]; // Get the file object
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size <= 2 * 1024 * 1024) {
        setRcBookFileImage(file);
        setRcBookFileImageSizeError('');
        const reader = new FileReader();
        reader.onload = (event) => {
          setRcBookFileImagePreview(event.target.result);
        };
        reader.readAsDataURL(file); // Convert file to a data URL
      } else if (file.size > 2 * 1024 * 1024) {
        setRcBookFileImageSizeError('Size of image should not exceed 2MB');
      } else {
        setRcBookFileImagePreview(null);
        setRcBookFileImageSizeError('');
      }
    } else {
      setRcBookFileImagePreview(null);
      setRcBookFileImage(null);
    }
  };

  // Vehicle Front Photo
  const handleRemoveVehicleFrontImage = () => {
    setVehicleFrontImagePreview(null);
    setVehicleFrontImage(null);
  };
  //  vehicle front view
  const handleVehicleFrontViewImageChange = (e) => {
    const file = e.target.files[0]; // Get the file object
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size <= 2 * 1024 * 1024) {
        setVehicleFrontImage(file);
        setVehicleFrontImageSizeError('');
        const reader = new FileReader();
        reader.onload = (event) => {
          setVehicleFrontImagePreview(event.target.result);
        };
        reader.readAsDataURL(file); // Convert file to a data URL
      } else if (file.size > 2 * 1024 * 1024) {
        setVehicleFrontImageSizeError('Size of image should not exceed 2MB');
      } else {
        vehicleFrontImagePreview(null);
        setVehicleFrontImageSizeError('');
      }
    } else {
      vehicleFrontImagePreview(null);
      setVehicleFrontImage(null);
    }
  };
  // Aadhar Card Image Photo Remove
  const handleRemoveAadhaarCardImage = () => {
    setAadhaarCardImagePreview(null);
    setAadhaarCardImage(null);
  };
  //  vehicle front view
  const handleAadhaarCardImageChange = (e) => {
    const file = e.target.files[0]; // Get the file object
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size <= 2 * 1024 * 1024) {
        setAadhaarCardImage(file);
        setAadhaarCardImageSizeError('');
        const reader = new FileReader();
        reader.onload = (event) => {
          setAadhaarCardImagePreview(event.target.result);
        };
        reader.readAsDataURL(file); // Convert file to a data URL
      } else if (file.size > 2 * 1024 * 1024) {
        setAadhaarCardImageSizeError('Size of image should not exceed 2MB');
      } else {
        aadhaarCardImagePreview(null);
        setAadhaarCardImageSizeError('');
      }
    } else {
      aadhaarCardImagePreview(null);
      setAadhaarCardImage(null);
    }
  };
  // Device Image Photo Remove
  const handleRemoveDevicePhoto = () => {
    setDeviceImagePreview(null);
    setDeviceImage(null);
  };
  //  Device Photo change
  const handleDeviceImageChange = (e) => {
    const file = e.target.files[0]; // Get the file object
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size <= 2 * 1024 * 1024) {
        setDeviceImage(file);
        setDeviceImageSizeError('');
        const reader = new FileReader();
        reader.onload = (event) => {
          setDeviceImagePreview(event.target.result);
        };
        reader.readAsDataURL(file); // Convert file to a data URL
      } else if (file.size > 2 * 1024 * 1024) {
        setDeviceImageSizeError('Size of image should not exceed 2MB');
      } else {
        setDeviceImagePreview(null);
        setDeviceImageSizeError('');
      }
    } else {
      setDeviceImagePreview(null);
      setDeviceImage(null);
    }
  };

  return (
    <div className="card w-full max-w-[50vh] mx-auto h-auto">
      <div className="card-body p-4 bg-white shadow-md rounded-lg">
        <div className="row">
          <div className="col-12 col-md-6 mb-2">
            <div>
              <label htmlFor="customerName" className="form-label">
                Customer Name
                <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                maxLength={50}
                type="text"
                className="form-control"
                id="customerName"
                placeholder="Enter Customer Name"
                aria-describedby="Employee"
                value={newRechargeObj.customerName}
                onChange={(e) => {
                  setErrorMessage(false);
                  let InputValue = e.target.value;
                  // Allow letters, numbers, spaces, and special characters like @, &, ., -, _
                  const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s@&.\-_]/g, '');
                  setNewRechargeObj((prev) => ({
                    ...prev,
                    customerName: updatedValue
                  }));
                }}
              />
              {error &&
                (newRechargeObj.customerName === null || newRechargeObj.customerName === undefined || newRechargeObj.customerName === '') ? (
                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className="col-12 col-md-6 mb-2">
            <div>
              <label htmlFor="aadharNo" className="form-label">
                Customer Mobile Number
                <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                placeholder="Enter Contact No."
                maxLength={10}
                className="form-control"
                value={newRechargeObj.customerContactNo}
                onChange={(e) => {
                  // setErrorMessage('');
                  const value = e.target.value;
                  let FormattedNumber = value.replace(/[^0-9]/g, ''); // Allows only numbers

                  // Apply regex to ensure the first digit is between 6 and 9
                  FormattedNumber = FormattedNumber.replace(/^[0-5]/, '');
                  setNewRechargeObj((prev) => ({
                    ...prev,
                    customerContactNo: FormattedNumber
                  }));
                }}
              />

              <span style={{ color: 'red' }}>
                {error &&
                  (newRechargeObj.customerContactNo === null ||
                    newRechargeObj.customerContactNo === undefined ||
                    newRechargeObj.customerContactNo === '')
                  ? ERROR_MESSAGES
                  : (newRechargeObj.customerContactNo !== null || newRechargeObj.customerContactNo !== undefined) &&
                    newRechargeObj.customerContactNo?.length < 10
                    ? 'Invalid phone Number'
                    : ''}
              </span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6 mb-2">
            <div>
              <label htmlFor="aadharNo" className="form-label">
                Customer Address
                <span style={{ color: 'red' }}>*</span>
              </label>
              <textarea
                className="form-control"
                placeholder="Enter Address"
                maxLength={250}
                value={newRechargeObj.customerAddress}
                onChange={(e) => {
                  setErrorMessage(false);
                  let InputValue = e.target.value;
                  // Updated regex to allow common special characters for addresses
                  const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s,.-/#&()]/g, '');
                  setNewRechargeObj((prev) => ({
                    ...prev,
                    customerAddress: updatedValue
                  }));
                }}
              />
              {error &&
                (newRechargeObj.customerAddress === null ||
                  newRechargeObj.customerAddress === undefined ||
                  newRechargeObj.customerAddress === '') ? (
                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className="col-12 col-md-6 mb-2">
            <div>
              <label htmlFor="vehicleNo" className="form-label">
                Vehicle Number
                <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                maxLength={12}
                type="text"
                value={newRechargeObj.vehicleNo}
                onChange={(e) => {
                  setErrorMessage(false);
                  let InputValue = e.target.value;
                  // Allow letters, numbers, spaces, and special characters like @, &, ., -, _
                  const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s@&.\-_]/g, '');
                  setNewRechargeObj((prev) => ({
                    ...prev,
                    vehicleNo: updatedValue
                  }));
                }}
                className="form-control"
                id="vehicleNo"
                placeholder="Enter Vehicle Number"
                aria-describedby="Employee"
              />
              {error && (newRechargeObj.vehicleNo === null || newRechargeObj.vehicleNo === undefined || newRechargeObj.vehicleNo === '') ? (
                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6 mb-2">
            <div>
              <label htmlFor="aadharCardNo" className="form-label">
                Aadhaar Card Number
                <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                className="form-control"
                placeholder="Aadhaar Card Number"
                maxLength={14}
                type="text"
                value={newRechargeObj.adharNumberFormatted || ''} // Show formatted value
                onChange={(e) => {
                  let value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters

                  // Ensure first digit is between 6 and 9
                  if (value.length > 0 && !/^[0-9]/.test(value)) {
                    value = value.substring(1);
                  }

                  value = value.slice(0, 12); // Restrict to 12 digits

                  // Format into XXXX-XXXX-XXXX
                  let formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1-');

                  setNewRechargeObj((prev) => ({
                    ...prev,
                    aadharCardNo: value, // Store only numbers
                    adharNumberFormatted: formattedValue // Store formatted value for UI
                  }));
                }}
              />
              {error &&
                (newRechargeObj.aadharCardNo === null || newRechargeObj.aadharCardNo === undefined || newRechargeObj.aadharCardNo === '') ? (
                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className="col-12 col-md-6 mb-2">
            <div>
              <label htmlFor="rcPlate" className="form-label">
                Name As per RC-book Plate
                <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                maxLength={50}
                type="text"
                className="form-control"
                id="rcBookName"
                placeholder="Enter Name As Per RC Book"
                aria-describedby="Employee"
                value={newRechargeObj.rcBookName}
                onChange={(e) => {
                  setErrorMessage(false);
                  let InputValue = e.target.value;
                  // Allow letters, numbers, spaces, and special characters like @, &, ., -, _
                  const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s@&.\-_]/g, '');
                  setNewRechargeObj((prev) => ({
                    ...prev,
                    rcBookName: updatedValue
                  }));
                }}
              />
              {error &&
                (newRechargeObj.rcBookName === null || newRechargeObj.rcBookName === undefined || newRechargeObj.rcBookName === '') ? (
                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6 mb-2">
            <div>
              <label htmlFor="rtoCode" className="form-label">
                RTO Code
                <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                maxLength={5}
                type="text"
                className="form-control"
                id="rtoCode"
                placeholder="Enter RTO Code"
                aria-describedby="Employee"
                value={newRechargeObj.rtoCode}
                onChange={(e) => {
                  setErrorMessage(false);
                  let InputValue = e.target.value;
                  // Allow letters, numbers, spaces, and special characters like @, &, ., -, _
                  const updatedValue = InputValue.replace(/[^a-zA-Z0-9\s@&.\-_]/g, '');
                  setNewRechargeObj((prev) => ({
                    ...prev,
                    rtoCode: updatedValue
                  }));
                }}
              />
              {error && (newRechargeObj.rtoCode === null || newRechargeObj.rtoCode === undefined || newRechargeObj.rtoCode === '') ? (
                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className="col-12 col-md-6 mb-2">
            <div>
              <label htmlFor="aadharNo" className="form-label">
                MFG Date
                <span style={{ color: 'red' }}>*</span>
              </label>
              <DatePicker
                value={newRechargeObj?.mfgDate} // Use "selected" instead of "value"
                onChange={handleDateChange}
                label="From Date"
                clearIcon={null}
                popperPlacement="bottom-start"
              />
              {error && (newRechargeObj.mfgDate === null || newRechargeObj.mfgDate === undefined || newRechargeObj.mfgDate === '') ? (
                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6 mb-2">
            <div>
              <label htmlFor="passportProfile" className="form-label">
                RC Book File
                <span style={{ color: 'red' }}>*</span>
              </label>
              <div
                className="d-flex align-items-center justify-content-center position-relative border border-secondary rounded"
                style={{ width: '100%', height: '12rem' }}
              >
                {rcBookFileImagePreview ? (
                  <>
                    <button
                      onClick={handleRemoveRcBookFileImage}
                      className="btn btn-link position-absolute"
                      style={{
                        top: '5px',
                        right: '5px',
                        padding: '0',
                        fontSize: '20px',
                        color: 'black'
                      }}
                    >
                      <i class="fas fa-times"></i>
                    </button>
                    <img
                      className="w-100 h-100 rounded  border"
                      alt="Rc Book File"
                      style={{ objectFit: 'contain' }}
                      src={rcBookFileImagePreview}
                    />
                  </>
                ) : (
                  <label
                    htmlFor="passportProfile"
                    style={{ color: '#6c757d' }}
                    className="d-flex flex-column align-items-center justify-content-center text-center cursor-pointer"
                  >
                    <i style={{ fontSize: '2rem', color: '#6c757d' }} class="fa-solid fa-plus"></i>

                    <span className="d-block mt-2">Upload Image</span>
                  </label>
                )}
                <input
                  type="file"
                  id="passportProfile"
                  accept="image/jpeg, image/png"
                  style={{ display: 'none' }}
                  onChange={handleRCBookFileImageChange}
                />
              </div>
            </div>

            {error && (rcBookFileImage === null || rcBookFileImage === '' || rcBookFileImage === undefined) && (
              <div style={{ color: 'red' }}>{ERROR_MESSAGES}</div>
            )}

            {rcBookFileImageSizeError ? (
              <div style={{ color: 'red' }}>{passportProfileSizeError}</div>
            ) : !rcBookFileImage ? (
              <small>Supported:  (Max 2MB)</small>
            ) : (
              ''
            )}
          </div>
          <div className="col-12 col-md-6 mb-2">
            <div>
              <label htmlFor="setVehicleFrontImage" className="form-label">
                Vehicle Front View
                <span style={{ color: 'red' }}>*</span>
              </label>
              <div
                className="d-flex align-items-center justify-content-center position-relative border border-secondary rounded"
                style={{ width: '100%', height: '12rem' }}
              >
                {vehicleFrontImage ? (
                  <>
                    <button
                      onClick={handleRemoveVehicleFrontImage}
                      className="btn btn-link position-absolute"
                      style={{
                        top: '5px',
                        right: '5px',
                        padding: '0',
                        fontSize: '20px',
                        color: 'black'
                      }}
                    >
                      <i class="fas fa-times"></i>
                    </button>
                    <img
                      className="w-100 h-100 rounded  border"
                      alt="Rc Book File"
                      style={{ objectFit: 'contain' }}
                      // src={rcBookFileImagePreview}
                      src={vehicleFrontImagePreview}
                    />
                  </>
                ) : (
                  <label
                    htmlFor="setVehicleFrontImage"
                    style={{ color: '#6c757d' }}
                    className="d-flex flex-column align-items-center justify-content-center text-center cursor-pointer"
                  >
                    <i style={{ fontSize: '2rem', color: '#6c757d' }} class="fa-solid fa-plus"></i>

                    <span className="d-block mt-2">Upload Image</span>
                  </label>
                )}
                <input
                  type="file"
                  id="setVehicleFrontImage"
                  accept="image/jpeg, image/png"
                  style={{ display: 'none' }}
                  // onChange={handleRCBookFileImageChange}
                  onChange={handleVehicleFrontViewImageChange}
                />
              </div>
            </div>

            {error && (vehicleFrontImage === null || vehicleFrontImage === '' || vehicleFrontImage === undefined) && (
              <div style={{ color: 'red' }}>{ERROR_MESSAGES}</div>
            )}

            {vehicleFrontImageSizeError ? (
              // <div style={{ color: 'red' }}>{passportProfileSizeError}</div>
              <div style={{ color: 'red' }}>{vehicleFrontImageSizeError}</div>
            ) : !vehicleFrontImage ? (
              <small>Supported:  (Max 2MB)</small>
            ) : (
              ''
            )}
          </div>
        </div>

        {/* aadhar image && device photo */}
        <div className="row">
          <div className="col-12 col-md-6 mb-2">
            <div>
              <label htmlFor="aadharImage" className="form-label">
                Aadhaar Card Image
                <span style={{ color: 'red' }}>*</span>
              </label>
              <div
                className="d-flex align-items-center justify-content-center position-relative border border-secondary rounded"
                style={{ width: '100%', height: '12rem' }}
              >
                {aadhaarCardImagePreview ? (
                  <>
                    <button
                      onClick={handleRemoveAadhaarCardImage}
                      className="btn btn-link position-absolute"
                      style={{
                        top: '5px',
                        right: '5px',
                        padding: '0',
                        fontSize: '20px',
                        color: 'black'
                      }}
                    >
                      <i class="fas fa-times"></i>
                    </button>
                    <img
                      className="w-100 h-100 rounded  border"
                      alt="Rc Book File"
                      style={{ objectFit: 'contain' }}
                      src={aadhaarCardImagePreview}
                    />
                  </>
                ) : (
                  <label
                    htmlFor="aadharImage"
                    style={{ color: '#6c757d' }}
                    className="d-flex flex-column align-items-center justify-content-center text-center cursor-pointer"
                  >
                    <i style={{ fontSize: '2rem', color: '#6c757d' }} class="fa-solid fa-plus"></i>

                    <span className="d-block mt-2">Upload Image</span>
                  </label>
                )}
                <input
                  type="file"
                  id="aadharImage"
                  accept="image/jpeg, image/png"
                  style={{ display: 'none' }}
                  // onChange={handleRCBookFileImageChange}
                  onChange={handleAadhaarCardImageChange}
                />
              </div>
            </div>

            {error && (aadhaarCardImage === null || aadhaarCardImage === '' || aadhaarCardImage === undefined) && (
              <div style={{ color: 'red' }}>{ERROR_MESSAGES}</div>
            )}

            {aadhaarCardImageSizeError ? (
              <div style={{ color: 'red' }}>{aadhaarCardImageSizeError}</div>
            ) : !aadhaarCardImage ? (
              <small>Supported:  (Max 2MB)</small>
            ) : (
              ''
            )}
          </div>

          <div className="col-12 col-md-6 mb-2">
            <div>
              <label htmlFor="devicePhotoImage" className="form-label">
                Device Photo
                <span style={{ color: 'red' }}>*</span>
              </label>
              <div
                className="d-flex align-items-center justify-content-center position-relative border border-secondary rounded"
                style={{ width: '100%', height: '12rem' }}
              >
                {deviceImage ? (
                  <>
                    <button
                      onClick={handleRemoveDevicePhoto}
                      className="btn btn-link position-absolute"
                      style={{
                        top: '5px',
                        right: '5px',
                        padding: '0',
                        fontSize: '20px',
                        color: 'black'
                      }}
                    >
                      <i class="fas fa-times"></i>
                    </button>
                    <img
                      className="w-100 h-100 rounded  border"
                      alt="Rc Book File"
                      style={{ objectFit: 'contain' }}
                      src={deviceImagePreview}
                    />
                  </>
                ) : (
                  <label
                    htmlFor="devicePhotoImage"
                    style={{ color: '#6c757d' }}
                    className="d-flex flex-column align-items-center justify-content-center text-center cursor-pointer"
                  >
                    <i style={{ fontSize: '2rem', color: '#6c757d' }} class="fa-solid fa-plus"></i>

                    <span className="d-block mt-2">Upload Image</span>
                  </label>
                )}
                <input
                  type="file"
                  id="devicePhotoImage"
                  accept="image/jpeg, image/png"
                  style={{ display: 'none' }}
                  onChange={handleDeviceImageChange}
                />
              </div>
            </div>

            {error && (deviceImage === null || deviceImage === '' || deviceImage === undefined) && (
              <div style={{ color: 'red' }}>{ERROR_MESSAGES}</div>
            )}

            {deviceImageSizeError ? (
              // <div style={{ color: 'red' }}>{passportProfileSizeError}</div>
              <div style={{ color: 'red' }}>{deviceImageSizeError}</div>
            ) : !deviceImage ? (
              <small>Supported:  (Max 2MB)</small>
            ) : (
              ''
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-md-6 mb-2">
            <div className="d-flex align-items-center gap-5">
              <label className="form-check-label me-1 fw-bold">
                <input
                  type="radio"
                  className="form-check-input me-1"
                  value="Our Agency"
                  checked={selectedAgency === 'Our Agency'}
                  onChange={(e) => {
                    setSelectedAgency(e.target.value);
                    setShowTable(false); // Reset table visibility when changing selection
                  }}
                />
                Our Agency
              </label>
              <label className="form-check-label fw-bold">
                <input
                  type="radio"
                  className="form-check-input me-1"
                  value="Other Agency"
                  checked={selectedAgency === 'Other Agency'}
                  onChange={(e) => {
                    setSelectedAgency(e.target.value);
                    setShowTable(false); // Reset table visibility when changing selection
                  }}
                />
                Other Agency
              </label>
            </div>
            {error && (selectedAgency === null || selectedAgency === '' || selectedAgency === undefined) && (
              <div style={{ color: 'red' }}>{ERROR_MESSAGES}</div>
            )}
          </div>
        </div>

        <div className="row ">
          {selectedAgency === 'Our Agency' && (
            <div style={{ marginTop: '10px' }}>
              <label className="form-check-label fw-bold">
                <input
                  className="form-check-input me-1"
                  type="radio"
                  value="Existing User"
                  checked={showTable}
                  onChange={() => setShowTable(true)} // Show table on selecting "Existing User"
                />
                Existing User
              </label>
            </div>
          )}

          {showTable && (
            <>
              <div className="border  p-3 " style={{ marginTop: '20px' }}>
                <h4>Existing User Details</h4>
                <hr />
                <div className="table-responsive" style={{ maxHeight: '48vh', overflowY: 'auto', position: 'relative' }}>
                  <table className="table table-bordered table-striped">
                    <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
                      <tr>
                        <th className="text-center">ID</th>
                        <th className="text-center">Vehicle No </th>
                        <th className="text-center">Customer Name</th>
                        <th className="text-center">Vehicle Type</th>
                        <th className="text-center">RC Book File</th>
                        <th className="text-center">Vehicle No Plate</th>
                        <th className="text-center">Vehicle Front View</th>
                        <th className="text-center">Vehicle Side View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {machineListData?.map((row, idx) => (
                        <tr key={idx}>
                          <td className="text-center">{row.id}</td>
                          <td className="text-center">{row.vehicleNo}</td>
                          <td className="text-center">{row.customerName}</td>
                          <td className="text-center">{row.vehicleType}</td>
                          <td className="text-center">{row.rcBookFile}</td>
                          <td className="text-center">{row.vehicleNoPlate}</td>
                          <td className="text-center">{row.vehicleSideView}</td>
                          <td className="text-center">{row.vehicleFrontView}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="border p-3 mt-3">
                <h6 className="mt-3">
                  <span className="bg-warning p-1">VLTD Fitment Certificate</span>
                </h6>
                <h3 className="border-bottom pb-2">Vehicle Registration</h3>
                <label className="form-check-label fw-bold">
                  <input
                    type="radio"
                    className="me-2"
                    value="before2016"
                    checked={selectedOption === 'before2016'}
                    onChange={handleOptionChange}
                  />
                  Before 2016
                </label>
                <br />
                <label className="form-check-label fw-bold">
                  <input
                    type="radio"
                    className="me-2"
                    value="after2016"
                    checked={selectedOption === 'after2016'}
                    onChange={handleOptionChange}
                  />
                  After 2016
                </label>
              </div>

              <div className="row mt-2">
                <div className="col-12 col-md-6 mb-2">
                  <div>
                    <label htmlFor="aadharNo" className="form-label">
                      Select Plan
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select />
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-2">
                  <div>
                    <label htmlFor="aadharNo" className="form-label">
                      Recharge Amount (₹)
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      maxLength={50}
                      type="text"
                      className="form-control"
                      id="customerAddress"
                      placeholder="Enter Recharge Amt"
                      aria-describedby="Employee"
                    />
                  </div>
                </div>
              </div>
              <div className="border p-3">
                <h5>Top-up Recharge</h5>
                <div className="row">
                  <div className="col-12 col-md-6 mb-2">
                    <div>
                      <label htmlFor="aadharNo" className="form-label">
                        Used Month
                        <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        maxLength={50}
                        type="text"
                        className="form-control"
                        id="customerAddress"
                        placeholder="Enter Used Month"
                        aria-describedby="Employee"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-2">
                    <div>
                      <label htmlFor="aadharNo" className="form-label">
                        Top Up Amount (₹)
                        <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        maxLength={50}
                        type="text"
                        className="form-control"
                        id="customerAddress"
                        placeholder="Enter Top Up Amt"
                        aria-describedby="Employee"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6 mb-2">
                    <div>
                      <label htmlFor="aadharNo" className="form-label">
                        Recharge Amount To Pay (₹)
                        <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        maxLength={50}
                        type="text"
                        className="form-control"
                        id="customerAddress"
                        placeholder="Enter Recharge Amt To Pay"
                        aria-describedby="Employee"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div></div>
            </>
          )}
        </div>

        <hr />
        <div className="d-flex gap-2 justify-content-center">
          <button onClick={setInitialValue} className="btn btn-info">Reset</button>
          <button className="btn btn-primary" onClick={NewRechargeAddUpdateBtnClick}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUpdateRechargeForm;
