// import { ERROR_MESSAGES } from 'GlobalMsg';
import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
// import { RoleTypeList } from 'middleware/Enum';
// import { GetEmployeeLookupList } from 'services/EmployeeAPI/EmployeeAPI';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import { RoleTypeList } from 'Middleware/Enum';
import { AssignTechnicianApi } from 'services/LeadAPI/LeadApi';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
// import { AssignTechnicianApi } from 'services/LeadAPI/LeadApi';

const AddUpdateTechnicianLeadModal = ({ show, handleClose, modelRequestData, setIsAddUpdateActionDone }) => {
  const [error, setErrors] = useState(null);
  const [employeeLookupList, setEmployeeLookupList] = useState([]);
  const [actionMassage, setActionMassage] = useState(null);
  const [showSuccessModel, setShowSuccessModal] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { setLoader, user, companyID } = useContext(ConfigContext);
  const [technicianObj, setTechnicianObj] = useState({
    employeeID: null,
    remark: null,
    userKeyID: null,
    leadKeyID: modelRequestData.leadKeyID,
    companyKeyID: null
  });

  const handleTechnicianChange = (selectedOption) => {
    setTechnicianObj((obj) => ({
      ...obj,
      employeeID: selectedOption.value
    }));
  };

  // const stateList = [
  //   { value: 1, label: 'Sample State' },
  //   { value: 2, label: 'Sample State 2' },
  //   { value: 3, label: 'Sample State 3' }
  // ];

  const addTechnicianBtnClick = () => {
    debugger;
    let isValid = false;
    if (
      technicianObj.employeeID === null ||
      technicianObj.employeeID === undefined ||
      technicianObj.employeeID === '' ||
      technicianObj.remark === null ||
      technicianObj.remark === undefined ||
      technicianObj.remark === ''
    ) {
      setErrors(true);
      isValid = true;
    }

    const apiParamObj = {
      employeeID: technicianObj.employeeID,
      remark: technicianObj.remark,
      leadKeyID: modelRequestData.leadKeyID,
      userKeyID: user.userKeyID,
      companyKeyID: companyID
    };

    if (!isValid) {
      AssignTechnician(apiParamObj);
    }
  };

  const AssignTechnician = async (apiParams) => {
    setLoader(true);
    // debugger;

    try {
      // let url = '/AddUpdateLead';

      const response = await AssignTechnicianApi(apiParams); //Call this api
      //
      // console.log('post response', response);

      if (response?.data.statusCode === 200) {
        // console.log('post response', response);
        setLoader(false);
        setIsAddUpdateActionDone(true);
        // setIsAddUpdateActionDone(true);
        setActionMassage('Technician Assigned Successfully ');
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

 

  const setInitialData = () => {
    setErrors(false);
    setTechnicianObj({
      ...technicianObj,
      employeeID: null,
      remark: null
    });
  };

 

  const closeAllModal = () => {
    setInitialData();
    setShowSuccessModal(false);
    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        handleClose();
        setInitialData();
      }}
      style={{ zIndex: 1300 }}
      backdrop="static"
      keyboard={false}
      centered // Adjust the z-index as needed
    >
      <Modal.Header closeButton>
        <Modal.Title>Assign Technician</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-12 col-md-12 mb-2">
            <label htmlFor="customerName" className="form-label">
              Technician Name
              <span style={{ color: 'red' }}>*</span>
            </label>
            <Select
              options={employeeLookupList}
              value={employeeLookupList.find((item) => item.value === technicianObj.employeeID)} // Correctly maps the selected value
              onChange={handleTechnicianChange}
              placeholder="Select Technician"
            />
            {error & (technicianObj.employeeID === null || technicianObj.employeeID === undefined || technicianObj.employeeID === '') ? (
              <span className="errorMassage" style={{ color: 'red' }}>
                {ERROR_MESSAGES}
              </span>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-12 mb-2">
            <label htmlFor="customerName" className="form-label">
              Remark
              <span style={{ color: 'red' }}>*</span>
            </label>
            <textarea
              className="form-control placeHolderStyle"
              value={technicianObj.remark}
              maxLength={150}
              // onChange={(e) => setTechnicianObj({ ...technicianObj, remark: e.target.value })}
              onChange={(e) => {
                let InputValue = e.target.value;

                // Prevent the first character from being a space
                if (InputValue.startsWith(' ')) {
                  InputValue = InputValue.trimStart(); // Remove leading space
                }

                setTechnicianObj((prev) => ({
                  ...prev,
                  remark: InputValue
                }));
              }}
              placeholder="Enter Remark"
            />
            {error & (technicianObj.remark === null || technicianObj.remark === undefined || technicianObj.remark === '') ? (
              <span className="errorMassage" style={{ color: 'red' }}>
                {ERROR_MESSAGES}
              </span>
            ) : (
              ''
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            addTechnicianBtnClick();
          }}
        >
          Submit
        </Button>
      </Modal.Footer>
      <SuccessPopupModal
        show={showSuccessModel}
        onHide={() => closeAllModal()}
        setShowSuccessModal={setShowSuccessModal}
        modelAction={actionMassage}
      />
    </Modal>
  );
};

export default AddUpdateTechnicianLeadModal;
