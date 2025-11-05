import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import { GetEmployeeViewDetails } from 'services/Employee Staff/EmployeeApi';

function EmployeeViewModal({ show, onHide, modelRequestData }) {
  const [employeeViewData, setEmployeeViewData] = useState({
    profileImageURL: null,
    name: null,
    birthDate: null,
    mobileNo: null,
    emailID: null,
    stateName: null,
    districtName: null,
    talukaName: null,
    villageName: null,
    adharNumber: null,
    panNumber: null,
    bankAccountNumber: null,
    ifsc: null,
    userName: null,
    password: null,
    status: null,
    createdOnDate: null
  });

  useEffect(() => {
    if (modelRequestData?.employeeKeyID !== null && modelRequestData?.employeeKeyID !== undefined && modelRequestData.Action === 'staffView') {
      GetEmployeeViewModelData(modelRequestData.employeeKeyID);
    }
  }, [modelRequestData.Action]);

  const GetEmployeeViewModelData = async (id) => {
    try {
      const response = await GetEmployeeViewDetails(id);

      if (response?.data?.statusCode === 200) {
        const ModelData = response.data.responseData?.data || {}; // Use empty object as default

        setEmployeeViewData({
          profileImageURL: ModelData.profileImageURL,
          name: ModelData.name,
          birthDate: ModelData.birthDate,
          mobileNo: ModelData.mobileNo,
          emailID: ModelData.emailID,
          stateName: ModelData.stateName,
          districtName: ModelData.districtName,
          talukaName: ModelData.talukaName,
          villageName: ModelData.villageName,
          adharNumber: ModelData.adharNumber,
          panNumber: ModelData.panNumber,
          bankAccountNumber: ModelData.bankAccountNumber,
          ifsc: ModelData.ifsc,
          userName: ModelData.userName,
          password: ModelData.password
        });
      } else {
        console.error('Error fetching data: ', response?.data?.statusCode);
      }
    } catch (error) {
      console.error('Error in GetEmployeeViewModelData: ', error);
    }
  };

  return (
    <Modal backdrop="static" keyboard={false} style={{ zIndex: 1300 }} show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <b>Employee Details</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="scrollable-table">
          <div className="text-center mb-2">

            <img
              src={employeeViewData?.profileImageURL}
              alt="Employee Profile"
              width={150}
              height={150}
              style={{
                borderRadius: '10px',
                border: '1px solid #ddd',
                padding: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
              }}
            />
          </div>
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>
                  <b>Employee Name</b>
                </td>
                <td>{employeeViewData.name}</td>
              </tr>
              <tr>
                <td>
                  <b>Date Of Birth</b>
                </td>
                <td>{employeeViewData.birthDate}</td>
              </tr>
              <tr>
                <td>
                  <b>Contact No.</b>
                </td>
                <td>{employeeViewData.mobileNo}</td>
              </tr>
              <tr>
                <td>
                  <b>Email ID</b>
                </td>
                <td>{employeeViewData.emailID}</td>
              </tr>
              <tr>
                <td>
                  <b>Aadhaar Number</b>
                </td>
                <td>{employeeViewData.adharNumber}</td>
              </tr>
              <tr>
                <td>
                  <b>Pan Card Number</b>
                </td>
                <td>{employeeViewData.panNumber}</td>
              </tr>
              <tr>
                <td>
                  <b>Bank Account Number</b>
                </td>
                <td>{employeeViewData.bankAccountNumber}</td>
              </tr>
              <tr>
                <td>
                  <b>IFSC Code </b>
                </td>
                <td>{employeeViewData.ifsc}</td>
              </tr>
              <tr>
                <td>
                  <b>User Name </b>
                </td>
                <td>{employeeViewData.userName}</td>
              </tr>

            </tbody>
          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          <b>Close</b>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EmployeeViewModal;
