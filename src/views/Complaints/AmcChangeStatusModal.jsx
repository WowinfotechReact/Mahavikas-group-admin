// ModalComponent.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-date-picker';

import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

const AmcChangeStatusModal = ({ show, handleClose, modelRequestData }) => {
  const [error, setError] = React.useState(false);
  const [leadAssignObj, setLeadAssignObj] = React.useState({
    remark: null,
    statusId: null
  });

  const statusOptions = [
    { value: 1, label: 'Pending' },
    { value: 2, label: 'In Progress' },
    { value: 3, label: 'Completed' }
  ];

  const sendApprovalBtnClick = () => {
    let isValid = true;
    if (
      leadAssignObj.remark === null ||
      leadAssignObj.remark === '' ||
      leadAssignObj.remark === undefined ||
      leadAssignObj.statusId === null ||
      leadAssignObj.statusId === undefined ||
      leadAssignObj.statusId === ''
    ) {
      isValid = true;
      setError(true);
    } else {
      setError(false);
      isValid = false;
    }
    const apiParamObj = {
      statusId: leadAssignObj.statusId,
      remark: leadAssignObj.remark
    };
    if (!isValid) {
      alert(JSON.stringify(apiParamObj));
    }
  };
  return (
    <Modal
      show={show}
      onHide={handleClose}
      style={{ zIndex: 1300 }}
      backdrop="static"
      keyboard={false}
      centered // Adjust the z-index as needed
    >
      <Modal.Header closeButton>
        <Modal.Title>{modelRequestData.action != null ? 'Update Assign' : 'Add Assign '}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-12 col-md-6 mb-2">
            <div>
              <label htmlFor="customerName" className="form-label">
                Remark
                <span style={{ color: 'red' }}>*</span>
              </label>
              <div>
                <input
                  value={leadAssignObj.remark}
                  onChange={(e) => setLeadAssignObj({ ...leadAssignObj, remark: e.target.value })}
                  placeholder="Enter Remark"
                  className="form-control"
                />
              </div>
              {error & (leadAssignObj.remark === null || leadAssignObj.remark === undefined || leadAssignObj.remark === '') ? (
                <span className="errorMassage">{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className="col-12 col-md-6 mb-2">
            <div>
              <label htmlFor="customerName" className="form-label">
                Status
                <span style={{ color: 'red' }}>*</span>
              </label>
              <div>
                <Select
                  options={statusOptions}
                  value={statusOptions.find((option) => option.value === leadAssignObj.statusId)} // Find the selected option
                  onChange={(selectedOption) =>
                    setLeadAssignObj((prev) => ({
                      ...prev,
                      statusId: selectedOption ? selectedOption.value : null
                    }))
                  }
                  placeholder="Select a status"
                />
              </div>
              {error & (leadAssignObj.statusId === null || leadAssignObj.statusId === undefined || leadAssignObj.statusId === '') ? (
                <span className="errorMassage">{ERROR_MESSAGES}</span>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={sendApprovalBtnClick}>
          Send For Approval
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AmcChangeStatusModal;
