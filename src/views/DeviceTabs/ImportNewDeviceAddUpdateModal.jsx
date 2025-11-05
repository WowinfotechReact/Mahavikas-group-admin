import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import { useLocation } from 'react-router';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { GetCompanyLookupList } from 'services/Master Crud/MasterCompany';
import Select from 'react-select';
import DatePicker from 'react-date-picker';
import { AddUpdateDeviceApi, GetDeviceModel } from 'services/DeviceTabCsv/AddNewDeviceApi';
import { GetSimOperatorLookupList } from 'services/Master Crud/MasterSimOperatorLookUpListApi';
import dayjs from 'dayjs';
const ImportNewDeviceAddUpdateModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const { user, setLoader, companyID } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [simOperatorOption1, setSimOperatorOption1] = useState();
  const [simOperatorOption2, setSimOperatorOption2] = useState();
  const [stateOption, setStateOption] = useState([]);
  const [newDeviceImportModalObj, setNewDeviceImportModalObj] = useState({
    userKeyID: null,
    manufacturerKeyID: null,
    companyKeyID: null,
    modalName: null,
    manufacturerModelKeyID: null,
    deviceKeyID: null,
    companyID: null,
    modelNumber: null,
    imei: null,
    sim1MobileNo: null,
    sim1OperatorID: null,
    sim2MobileNo: null,
    sim2OperatorID: null,
    issuedDate: null,
    serialNo: null,
    isDeviceFaulty: null,
    mModelID: null
  });

  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.deviceKeyID !== null) {
        GetNewDeviceImportModalData(modelRequestData?.deviceKeyID);
      }
    }
  }, [modelRequestData?.Action]);

  useEffect(() => {
    GetSimOperatorLookupListData();
  }, []);




  const handleSimOperator1Change = (selectedOption) => {
    setNewDeviceImportModalObj((prev) => ({
      ...prev,
      sim1OperatorID: selectedOption ? selectedOption.value : ''
    }));
  };
  const handleSimOperator2Change = (selectedOption) => {
    setNewDeviceImportModalObj((prev) => ({
      ...prev,
      sim2OperatorID: selectedOption ? selectedOption.value : ''
    }));
  };

  function convertDateFormat(date) {
    if (typeof date !== 'string' || !date.includes('/')) {
      return null; // or return some default date format, if necessary
    }
    const [day, month, year] = date.split('/'); // Split the input date by '/'
    return `${year}/${month}/${day}`; // Rearrange and return in the desired format
  }

  const GetNewDeviceImportModalData = async (id) => {
    if (id === undefined) {
      return;
    }
    setLoader(true);

    try {
      const data = await GetDeviceModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = data.data.responseData.data; // Assuming data is an array
        setNewDeviceImportModalObj({
          ...newDeviceImportModalObj,
          userKeyID: ModelData?.userKeyID,
          deviceKeyID: ModelData.deviceKeyID,
          modelNumber: ModelData.modelNumber,
          imei: ModelData.imei,
          sim1MobileNo: ModelData.sim1MobileNo,
          sim1OperatorID: ModelData.sim1OperatorID,
          sim2MobileNo: ModelData.sim2MobileNo,
          sim2OperatorID: ModelData.sim2OperatorID,
          issuedDate: convertDateFormat(ModelData.issuedDate),
          serialNo: ModelData.serialNo,
          isDeviceFaulty: ModelData.isDeviceFaulty,
          mModelID: ModelData.mModelID
        });
      } else {
        setLoader(false);
        console.error('Error fetching data: ', data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error in Device: ', error);
    }
  };

  const AddManufactureModalBtnClick = async () => {
    let isValid = false;

    if (
      newDeviceImportModalObj.mModelID === null ||
      newDeviceImportModalObj.mModelID === undefined ||
      newDeviceImportModalObj.mModelID === '' ||
      newDeviceImportModalObj.imei === '' ||
      newDeviceImportModalObj.imei === null ||
      newDeviceImportModalObj.imei === undefined ||
      newDeviceImportModalObj.sim1MobileNo === '' ||
      newDeviceImportModalObj.sim1MobileNo === null ||
      newDeviceImportModalObj.sim1MobileNo === undefined ||
      newDeviceImportModalObj.sim1OperatorID === '' ||
      newDeviceImportModalObj.sim1OperatorID === null ||
      newDeviceImportModalObj.sim1OperatorID === undefined ||
      newDeviceImportModalObj.sim2MobileNo === '' ||
      newDeviceImportModalObj.sim2MobileNo === null ||
      newDeviceImportModalObj.sim2MobileNo === undefined ||
      newDeviceImportModalObj.sim2OperatorID === '' ||
      newDeviceImportModalObj.sim2OperatorID === null ||
      newDeviceImportModalObj.sim2OperatorID === undefined ||
      newDeviceImportModalObj.issuedDate === '' ||
      newDeviceImportModalObj.issuedDate === null ||
      newDeviceImportModalObj.issuedDate === undefined ||
      newDeviceImportModalObj.serialNo === '' ||
      newDeviceImportModalObj.serialNo === null ||
      newDeviceImportModalObj.serialNo === undefined
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    const apiParam = {
      userKeyID: user.userKeyID,
      deviceKeyID: newDeviceImportModalObj.deviceKeyID,
      mModelID: newDeviceImportModalObj.mModelID,
      imei: newDeviceImportModalObj.imei,
      sim1MobileNo: newDeviceImportModalObj.sim1MobileNo,
      sim1OperatorID: newDeviceImportModalObj.sim1OperatorID,
      sim2MobileNo: newDeviceImportModalObj.sim2MobileNo,
      sim2OperatorID: newDeviceImportModalObj.sim2OperatorID,
      issuedDate: newDeviceImportModalObj.issuedDate,
      serialNo: newDeviceImportModalObj.serialNo,
      isDeviceFaulty: true,
      companyKeyID: companyID
    };

    if (!isValid) {
      AddUpdateNewDeviceModalData(apiParam);
    }
  };

  const AddUpdateNewDeviceModalData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateDevice'; // Default URL for Adding Data
      const response = await AddUpdateDeviceApi(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'New Device Added Successfully!'
              : 'Device Updated Successfully!'
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

  const closeAllModal = () => {
    onHide();
    setShowSuccessModal(false);
  };

  const GetSimOperatorLookupListData = async () => {
    try {
      const response = await GetSimOperatorLookupList(); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const simOperatorLookupList = response?.data?.responseData?.data || [];

        const formattedSimTypeList = simOperatorLookupList.map((simName) => ({
          value: simName.simOperatorID,
          label: simName.simOperatorName
        }));

        setSimOperatorOption1(formattedSimTypeList);
        setSimOperatorOption2(formattedSimTypeList);
      } else {
        console.error('Failed to fetch sim Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching sim Type lookup list:', error);
    }
  };

  // import dayjs from 'dayjs';

  const handleDateChange = (date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD'); // Local date, no time
    setNewDeviceImportModalObj((prevState) => ({
      ...prevState,
      issuedDate: formattedDate
    }));
  };


  const formattedDate = newDeviceImportModalObj.issuedDate && dayjs(newDeviceImportModalObj.issuedDate).format('YYYY-MM-DD');


  const handleStateChange = (selectedOption) => {
    setNewDeviceImportModalObj((prev) => ({
      ...prev,
      mModelID: selectedOption ? selectedOption.value : '',

    }));
  };
  return (
    <>
      <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {modelRequestData?.Action !== null ? 'Edit New Device' : modelRequestData?.Action === null ? 'Add New Device' : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            {/* modal and legal  */}
            <div className="row">

              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="modelNumber" className="form-label">
                  Model Number
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  options={stateOption}
                  value={stateOption.filter((item) => item.value === newDeviceImportModalObj.mModelID)}
                  onChange={handleStateChange}
                  menuPosition="fixed"
                />
                {error && (newDeviceImportModalObj.mModelID === null || newDeviceImportModalObj.mModelID === undefined || newDeviceImportModalObj.mModelID === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="sim2OperatorID" className="form-label">
                  CCID Number
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={10}
                  type="text"
                  className="form-control"
                  id="serialNo"
                  placeholder="Enter Serial / CCID No"
                  value={newDeviceImportModalObj.serialNo}
                  onChange={(e) => {
                    let inputValue = e.target.value;

                    // Remove invalid characters (only alphanumeric, no space) and convert to uppercase
                    const updatedValue = inputValue.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

                    setNewDeviceImportModalObj((prev) => ({
                      ...prev,
                      serialNo: updatedValue
                    }));
                  }}
                />

                {error &&
                  (newDeviceImportModalObj.serialNo === null ||
                    newDeviceImportModalObj.serialNo === undefined ||
                    newDeviceImportModalObj.serialNo === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="imei" className="form-label">
                  IMEI Number
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={15}
                  type="text"
                  className="form-control"
                  id="imei"
                  placeholder="Enter IMEI Number"
                  value={newDeviceImportModalObj.imei}
                  onChange={(e) => {
                    setErrorMessage(false);
                    let inputValue = e.target.value;

                    // Remove invalid characters including spaces and convert to uppercase
                    const updatedValue = inputValue.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

                    setNewDeviceImportModalObj((prev) => ({
                      ...prev,
                      imei: updatedValue
                    }));
                  }}
                />

                {error &&
                  (newDeviceImportModalObj.imei === null ||
                    newDeviceImportModalObj.imei === undefined ||
                    newDeviceImportModalObj.imei === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="sim2MobileNo" className="form-label">
                  Issue date
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <DatePicker
                  label="From Date"
                  id="issuedDate"
                  dateFormat="yyyy-MM-dd" // Format displayed date
                  value={newDeviceImportModalObj.issuedDate} // Bind selected date from the state
                  onChange={handleDateChange} // Handle date selection
                  clearIcon={null}
                />
                {error &&
                  (newDeviceImportModalObj.issuedDate === null ||
                    newDeviceImportModalObj.issuedDate === undefined ||
                    newDeviceImportModalObj.issuedDate === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>

            </div>
            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="sim1OperatorID" className="form-label">
                  Sim 1 Operator
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  placeholder="Select Sim 1 Operator"
                  options={simOperatorOption1}
                  value={simOperatorOption1?.filter((item) => item.value === newDeviceImportModalObj.sim1OperatorID)}
                  onChange={handleSimOperator1Change}
                  menuPosition="fixed"
                />
                {error &&
                  (newDeviceImportModalObj.sim1OperatorID === null ||
                    newDeviceImportModalObj.sim1OperatorID === undefined ||
                    newDeviceImportModalObj.sim1OperatorID === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}{' '}
              </div>
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="sim1MobileNo" className="form-label">
                  Sim 1 Mobile Number
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={15}
                  type="text"
                  className="form-control"
                  id="sim1MobileNo"
                  placeholder="Enter Sim 1 Mobile Number"
                  value={newDeviceImportModalObj.sim1MobileNo}
                  onChange={(e) => {
                    // setErrorMessage('');
                    const value = e.target.value;
                    let FormattedNumber = value.replace(/[^0-9]/g, ''); // Allows only numbers

                    // Apply regex to ensure the first digit is between 6 and 9
                    FormattedNumber = FormattedNumber.replace(/^[0-0]/, '');
                    setNewDeviceImportModalObj((prev) => ({
                      ...prev,
                      sim1MobileNo: FormattedNumber
                    }));
                  }}
                />


                {error &&
                  (newDeviceImportModalObj.sim1MobileNo === null ||
                    newDeviceImportModalObj.sim1MobileNo === undefined ||
                    newDeviceImportModalObj.sim1MobileNo === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}{' '}
              </div>
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="sim2OperatorID" className="form-label">
                  Sim 2 Operator
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  placeholder="Select Sim 2 Operator"
                  options={simOperatorOption2}
                  value={simOperatorOption2?.filter((item) => item.value === newDeviceImportModalObj.sim2OperatorID)}
                  onChange={handleSimOperator2Change}
                  menuPosition="fixed"
                />
                {error &&
                  (newDeviceImportModalObj.sim2OperatorID === null ||
                    newDeviceImportModalObj.sim2OperatorID === undefined ||
                    newDeviceImportModalObj.sim2OperatorID === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}{' '}
              </div>
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="sim2MobileNo" className="form-label">
                  Sim 2 Mobile Number
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={15}
                  type="text"
                  className="form-control"
                  id="sim2MobileNo"
                  placeholder="Enter Sim 2 Mobile Number"
                  value={newDeviceImportModalObj.sim2MobileNo}
                  onChange={(e) => {
                    // setErrorMessage('');
                    const value = e.target.value;
                    let FormattedNumber = value.replace(/[^0-9]/g, ''); // Allows only numbers

                    // Apply regex to ensure the first digit is between 6 and 9
                    FormattedNumber = FormattedNumber.replace(/^[0-0]/, '');
                    setNewDeviceImportModalObj((prev) => ({
                      ...prev,
                      sim2MobileNo: FormattedNumber
                    }));
                  }}
                />
                {error &&
                  (newDeviceImportModalObj.sim2MobileNo === null ||
                    newDeviceImportModalObj.sim2MobileNo === undefined ||
                    newDeviceImportModalObj.sim2MobileNo === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}{' '}
              </div>

            </div>
            <div className="row">


            </div>
            <span style={{ color: 'red' }}>{errorMessage}</span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button type="submit" className="btn btn-primary text-center" onClick={() => AddManufactureModalBtnClick()}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      {showSuccessModal && (
        <SuccessPopupModal
          show={showSuccessModal}
          onHide={() => closeAllModal()}
          setShowSuccessModal={setShowSuccessModal}
          modelAction={modelAction}
        />
      )}
    </>
  );
};

export default ImportNewDeviceAddUpdateModal;
