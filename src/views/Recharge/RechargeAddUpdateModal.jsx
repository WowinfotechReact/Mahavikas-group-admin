import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { GetStateModel } from 'services/Master Crud/MasterStateApi';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { GetSimOperatorLookupList } from 'services/Master Crud/MasterSimOperatorLookUpListApi';
import Select from 'react-select';
import { AddUpdateRechargeValidityPlan, GetRechargeValidityPlanModel } from 'services/Recharge/RechargeApi';

const RechargeAddUpdateModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user } = useContext(ConfigContext);
  const [simOperatorOption1, setSimOperatorOption1] = useState([]);

  const [rechargeObj, setRechargeObj] = useState({
    simOperatorID: null,
    validityInDays: null,
    rechargeAmount: null,
    rechargeValidityPlanKeyID: null
  });

  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.rechargeValidityPlanKeyID !== null) {
        GetRechargeValidityPlanModelData(modelRequestData.rechargeValidityPlanKeyID);
      }
    }
  }, [modelRequestData?.Action]);

  const AddStateBtnClick = () => {
    // debugger
    let isValid = false;
    if (
      rechargeObj.validityInDays === null ||
      rechargeObj.validityInDays === undefined ||
      rechargeObj.validityInDays === '' ||
      rechargeObj.rechargeAmount === null ||
      rechargeObj.rechargeAmount === undefined ||
      rechargeObj.rechargeAmount === '' ||
      rechargeObj.simOperatorID === null ||
      rechargeObj.simOperatorID === undefined ||
      rechargeObj.simOperatorID === ''
    ) {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    const apiParam = {
      userKeyID: user.userKeyID,
      validityInDays: rechargeObj.validityInDays,
      rechargeAmount: rechargeObj.rechargeAmount,
      simOperatorID: rechargeObj.simOperatorID,
      rechargeValidityPlanKeyID: rechargeObj?.rechargeValidityPlanKeyID
    };

    if (!isValid) {
      AddUpdateRechargeData(apiParam);
    }
  };

  const AddUpdateRechargeData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateRechargeValidityPlan'; // Default URL for Adding Data

      const response = await AddUpdateRechargeValidityPlan(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null || modelRequestData.Action === undefined
              ? 'Recharge Added Successfully!'
              : 'Recharge Updated Successfully!'
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

  const handleSimOperator1Change = (selectedOption) => {
    setRechargeObj((prev) => ({
      ...prev,
      simOperatorID: selectedOption ? selectedOption.value : ''
    }));
  };

  const GetRechargeValidityPlanModelData = async (id) => {
    if (id === undefined) {
      return;
    }

    setLoader(true);
    try {
      const data = await GetRechargeValidityPlanModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = data.data.responseData.data; // Assuming data is an array

        setRechargeObj({
          ...rechargeObj,
          simOperatorID: ModelData.simOperatorID,
          validityInDays: ModelData.validityInDays,
          rechargeAmount: ModelData.rechargeAmount,
          rechargeValidityPlanKeyID: ModelData.rechargeValidityPlanKeyID
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


  useEffect(() => {
    GetSimOperatorLookupListData();
  }, []);

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
        // setSimOperatorOption2(formattedSimTypeList);
      } else {
        console.error('Failed to fetch sim Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching sim Type lookup list:', error);
    }
  };

  return (
    <>
      <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {modelRequestData?.Action !== null ? 'Update Recharge' : modelRequestData?.Action === null ? 'Add Recharge' : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="row">
              <div>
                <label htmlFor="StateName" className="form-label">
                  Select Operator
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  placeholder="Select Sim 1 Operator"
                  options={simOperatorOption1}
                  value={simOperatorOption1?.filter((item) => item.value === rechargeObj.simOperatorID)}
                  onChange={handleSimOperator1Change}
                  menuPosition="fixed"
                />
                {error && (rechargeObj.simOperatorID === null || rechargeObj.simOperatorID === undefined || rechargeObj.simOperatorID === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}{' '}
                {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
              </div>
            </div>
            <div className="row">
              <div>
                <label htmlFor="validityInDays" className="form-label">
                  Validity in Days
                  <span style={{ color: 'red' }}>*</span>
                </label>

                <input
                  maxLength={4}
                  type="text"
                  className="form-control"
                  id="validityInDays"
                  placeholder="Enter Validity In Days"
                  value={rechargeObj.validityInDays}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters

                    // Ensure first digit is between 6 and 9
                    if (value.length > 0 && !/^[1-9]/.test(value)) {
                      value = value.substring(1);
                    }

                    value = value.slice(0, 12); // Restrict to 12 digits

                    // Format into XXXX-XXXX-XXXX
                    let formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1-');

                    setRechargeObj((prev) => ({
                      ...prev,
                      validityInDays: value // Store only numbers
                    }));
                  }}
                />

                {error &&
                  (rechargeObj.validityInDays === null || rechargeObj.validityInDays === undefined || rechargeObj.validityInDays === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
                {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
              </div>
            </div>
            <div className="row">
              <div>
                <label htmlFor="rechargeAmount" className="form-label">
                  Recharge Amount (₹)
                  <span style={{ color: 'red' }}>*</span>
                </label>

                <input
                  maxLength={5}
                  type="text"
                  className="form-control"
                  id="rechargeAmount"
                  placeholder="Enter Recharge Amount"
                  value={rechargeObj.rechargeAmount}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^1-9]/g, ''); // Remove non-numeric characters

                    // Ensure first digit is between 6 and 9
                    if (value.length > 0 && !/^[0-9]/.test(value)) {
                      value = value.substring(1);
                    }

                    value = value.slice(0, 12); // Restrict to 12 digits

                    setRechargeObj((prev) => ({
                      ...prev,
                      rechargeAmount: value // Store only numbers
                    }));
                  }}
                />

                {error && (rechargeObj.rechargeAmount === null || rechargeObj.rechargeAmount === undefined || rechargeObj.rechargeAmount === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
                {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button type="submit" className="btn btn-primary text-center" onClick={() => AddStateBtnClick()}>
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

      {/* <CusModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} vehicleObj={vehicleObj} /> */}
    </>
  );
};

export default RechargeAddUpdateModal;
