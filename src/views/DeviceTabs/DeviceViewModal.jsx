import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import { GetDeviceViewDetails } from 'services/DeviceTabCsv/DeviceCSVApi';

function DeviceViewModal({ show, onHide, modelRequestData }) {
  const [deviceViewModal, setDeviceViewModal] = useState({
    companyName: null,
    modelNumber: null,
    imei: null,
    sim1MobileNo: null,
    sim1OperatorName: null,
    sim2MobileNo: null,
    sim2OperatorName: null,
    issuedDate: null,
    serialNo: null
  });

  useEffect(() => {
    if (modelRequestData?.deviceKeyID !== null && modelRequestData?.deviceKeyID !== undefined) {
      GetDeviceViewModelData(modelRequestData.deviceKeyID);
    }
  }, [modelRequestData]);

  const GetDeviceViewModelData = async (id) => {
    try {
      const response = await GetDeviceViewDetails(id);

      if (response?.data?.statusCode === 200) {
        const ModelData = response.data.responseData?.data || {}; // Use empty object as default

        setDeviceViewModal({
          companyName: ModelData.companyName,
          modelNumber: ModelData.modelNumber,
          imei: ModelData.imei,
          sim1MobileNo: ModelData.sim1MobileNo,
          sim1OperatorName: ModelData.sim1OperatorName,
          sim2MobileNo: ModelData.sim2MobileNo,
          sim2OperatorName: ModelData.sim2OperatorName,
          issuedDate: ModelData.issuedDate,
          serialNo: ModelData.serialNo
        });
      } else {
        console.error('Error fetching data: ', response?.data?.statusCode);
      }
    } catch (error) {
      console.error('Error in GetDeviceViewModelData: ', error);
    }
  };

  return (
    <Modal backdrop="static" keyboard={false} style={{ zIndex: 1300 }} show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <b>Device Details</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="scrollable-table">
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>
                  <b>Company Name</b>
                </td>
                <td>{deviceViewModal.companyName}</td>
              </tr>
              <tr>
                <td>
                  <b>Model Number</b>
                </td>
                <td>{deviceViewModal.modelNumber}</td>
              </tr>
              <tr>
                <td>
                  <b>IMEI No.</b>
                </td>
                <td>{deviceViewModal.imei}</td>
              </tr>
              <tr>
                <td>
                  <b>Sim1 Operator Name</b>
                </td>
                <td>{deviceViewModal.sim1OperatorName}</td>
              </tr>
              <tr>
                <td>
                  <b>Sim1 Mobile No</b>
                </td>
                <td>{deviceViewModal.sim1MobileNo}</td>
              </tr>
              <tr>
                <td>
                  <b>Sim2 Operator Name</b>
                </td>
                <td>{deviceViewModal.sim2OperatorName}</td>
              </tr>
              <tr>
                <td>
                  <b>Sim2 Mobile No</b>
                </td>
                <td>{deviceViewModal.sim2MobileNo}</td>
              </tr>
              <tr>
                <td>
                  <b>Issued Date</b>
                </td>
                <td>{deviceViewModal.issuedDate}</td>
              </tr>
              <tr>
                <td>
                  <b> CCID / Serial No</b>
                </td>
                <td>{deviceViewModal.serialNo}</td>
              </tr>
              {/* <tr>
                <td>
                  <b>Address</b>
                </td>
                <td>
                  {deviceViewModal.address?.length > 20 ? (
                    <Tooltip title={deviceViewModal.address}>{`${deviceViewModal.address?.substring(0, 20)}...`}</Tooltip>
                  ) : (
                    <>{deviceViewModal.address}</>
                  )}
                </td>
              </tr> */}
              {/* <tr>
                <td>
                  <b>State Name</b>
                </td>
                <td>{deviceViewModal.stateName}</td>
              </tr>
              <tr>
                <td>
                  <b>District Name</b>
                </td>
                <td>{deviceViewModal.districtName}</td>
              </tr>
              <tr>
                <td>
                  <b>Taluka Name</b>
                </td>
                <td>{deviceViewModal.talukaName}</td>
              </tr>
              <tr>
                <td>
                  <b>Village Name</b>
                </td>
                <td>{deviceViewModal.villageName}</td>
              </tr> */}
              
              
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

export default DeviceViewModal;
