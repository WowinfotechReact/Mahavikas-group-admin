import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import { GetInstallationViewDetails } from 'services/Installation Device/InstallationDeviceapi';
import { ConfigContext } from 'context/ConfigContext';

function InstallationViewModal({ show, onHide, modelRequestData }) {
  const { setLoader } = useContext(ConfigContext);

  const [installationViewData, setInstallationViewData] = useState({
    companyName: null,
    employeeName: null,
    customerName: null,
    vehicleNumber: null,
    rcImageURL: null,
    numberPlateImageURL: null,
    vehicleFrontImageURL: null,
    vehicleBackImageURL: null,
    vehicleLeftImageURL: null,
    vehicleRightImageURL: null,
    insuranceImageURL: null,
    vehicleTypeName: null,
    installationDate: null,
    installationTypeName: null,
    modalName: null,
    modelNumber: null,
    imei: null,
    isTemporaryDeviceInstalled: null,
    planName: null,
    governmentPortalName: null,
    paymentAmount: null,
    paymentModeName: null,
    paymentDate: null,
    paymentVerifiedByEmployeeName: null,
    paymentVerificationDate: null
  }); // State for booking data

  useEffect(() => {
    if (modelRequestData?.installationKeyID !== null && modelRequestData?.installationKeyID !== undefined) {
      GetInstallationModelData(modelRequestData.installationKeyID);
    }
  }, [modelRequestData]);

  const GetInstallationModelData = async (id) => {
    setLoader(true);
    try {
      const response = await GetInstallationViewDetails(id);

      if (response?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = response.data.responseData?.data || {}; // Use empty object as default

        setInstallationViewData({
          sim1RechargeAmt: ModelData.sim1RechargeAmt,
          sim2RechargeAmt: ModelData.sim2RechargeAmt,
          companyName: ModelData.companyName,
          employeeName: ModelData.employeeName,
          customerName: ModelData.customerName,
          vehicleNumber: ModelData.vehicleNumber,
          rcImageURL: ModelData.rcImageURL,
          numberPlateImageURL: ModelData.numberPlateImageURL,
          vehicleFrontImageURL: ModelData.vehicleFrontImageURL,
          vehicleBackImageURL: ModelData.vehicleBackImageURL,
          vehicleLeftImageURL: ModelData.vehicleLeftImageURL,
          vehicleRightImageURL: ModelData.vehicleRightImageURL,
          insuranceImageURL: ModelData.insuranceImageURL,
          vehicleTypeName: ModelData.vehicleTypeName,
          installationDate: ModelData.installationDate,
          installationTypeName: ModelData.installationTypeName,
          modalName: ModelData.modalName,
          modelNumber: ModelData.modelNumber,
          imei: ModelData.imei,
          isTemporaryDeviceInstalled: ModelData.isTemporaryDeviceInstalled,
          planName: ModelData.planName,
          governmentPortalName: ModelData.governmentPortalName,
          paymentAmount: ModelData.paymentAmount,
          paymentModeName: ModelData.paymentModeName,
          paymentDate: ModelData.paymentDate,
          paymentVerifiedByEmployeeName: ModelData.paymentVerifiedByEmployeeName,
          paymentVerificationDate: ModelData.paymentVerificationDate,
          sim1OperatorName:ModelData.sim1OperatorName,
          sim1Validity:ModelData.sim1Validity,
          sim1RechargeAmt:ModelData.sim1RechargeAmt,
          sim1PaymentStatus:ModelData.sim1PaymentStatus,
          sim2OperatorName:ModelData.sim2OperatorName,
          sim2Validity:ModelData.sim2Validity,
          sim2RechargeAmt:ModelData.sim2RechargeAmt,
          sim2PaymentStatus:ModelData.sim2PaymentStatus
        });
      } else {
        setLoader(false);
        console.error('Error fetching data: ', response?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error in GetInstallationModelData: ', error);
    }
  };

  return (
    <Modal backdrop="static" keyboard={false} style={{ zIndex: 1300 }} show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <b>Installation Details</b>
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
                <td>{installationViewData.companyName}</td>
              </tr>
              <tr>
                <td>
                  <b>Employee Name</b>
                </td>
                <td>{installationViewData.employeeName}</td>
              </tr>
              <tr>
                <td>
                  <b>Customer Name</b>
                </td>
                <td>{installationViewData.customerName}</td>
              </tr>

              <tr>
                <td>
                  <b>Vehicle Number</b>
                </td>
                <td>{installationViewData.vehicleNumber}</td>
              </tr>
              <tr>
                <td>
                  <b>Vehicle Type</b>
                </td>
                <td>{installationViewData.vehicleTypeName}</td>
              </tr>
              <tr>
                <td>
                  <b>Installation Type Name </b>
                </td>
                <td>{installationViewData.installationTypeName}</td>
              </tr>
              <tr>
                <td>
                  <b>Model Name</b>
                </td>
                <td>{installationViewData.modalName}</td>
              </tr>
              <tr>
                <td>
                  <b>Model No</b>
                </td>
                <td>{installationViewData.modelNumber}</td>
              </tr>
              {/* 1 */}
              <tr>
                <td>
                  <b>Sim 1 Operator Name</b>
                </td>
                <td>{installationViewData.sim1OperatorName}</td>
              </tr>
              <tr>
                <td>
                  <b>Sim 1 Validity </b>
                </td>
                <td>{installationViewData.sim1Validity}/ Days</td>
              </tr>
              <tr>
                <td>
                  <b>Sim 1 Payment Status</b>
                </td>
                <td>{installationViewData.sim1PaymentStatus==='True' ? 'Paid ':'Un Paid'}</td>
              </tr>
              <tr>
                <td>
                  <b>Sim 1 Recharge Amt (₹) </b>
                </td>
                <td>{installationViewData.sim1RechargeAmt}</td>
              </tr>
              <tr>
                <td>
                  <b>Sim 2 Operator Name</b>
                </td>
                <td>{installationViewData.sim2OperatorName}</td>
              </tr>
              <tr>
                <td>
                  <b>Sim 2 Validity </b>
                </td>
                <td>{installationViewData.sim2Validity}/ Days</td>
              </tr>
              <tr>
                <td>
                  <b>Sim 2 Payment Status</b>
                </td>
                <td>{installationViewData.sim2PaymentStatus==='True' ? 'Paid ':'Un Paid'}</td>
              </tr>
              <tr>
                <td>
                  <b>Sim 2 Recharge Amt (₹) </b>
                </td>
                <td>{installationViewData.sim2RechargeAmt}</td>
              </tr>
             
               {/* 1 */}
              <tr>
                <td>
                  <b>IMEI No</b>
                </td>
                <td>{installationViewData.imei}</td>
              </tr>
              {/* <tr>
                <td>
                  <b>Is Temporary Device Installed</b>
                </td>
                <td>{installationViewData.isTemporaryDeviceInstalled}</td>
              </tr> */}
              <tr>
                <td>
                  <b>Plan Name</b>
                </td>
                <td>{installationViewData.planName}</td>
              </tr>
              <tr>
                <td>
                  <b>Payment Amount </b>
                </td>
                <td>{installationViewData.paymentModeName}</td>
              </tr>
              <tr>
                <td>
                  <b>Payment Status</b>
                </td>
                <td>{installationViewData.paymentStatus}</td>
              </tr>
              <tr>
                <td>
                  <b>RC Image</b>
                </td>
                <td>
                  <img src={installationViewData.rcImageURL} width={90} height={90} alt="rcImageURL" />
                </td>
              </tr>
              <tr>
                <td>
                  <b>Vehicle Front Image</b>
                </td>
                <td>
                  <img src={installationViewData.vehicleFrontImageURL} width={90} height={90} alt="vehicleFrontImageURL" />
                </td>
              </tr>
              <tr>
                <td>
                  <b>Vehicle Back Image</b>
                </td>
                <td>
                  <img src={installationViewData.vehicleBackImageURL} width={90} height={90} alt="vehicleBackImageURL" />
                </td>
              </tr>
              <tr>
                <td>
                  <b>Vehicle Left Image</b>
                </td>
                <td>
                  <img src={installationViewData.vehicleLeftImageURL} width={90} height={90} alt="vehicleLeftImageURL" />
                </td>
              </tr>
              <tr>
                <td>
                  <b>Vehicle Right Image</b>
                </td>
                <td>
                  <img src={installationViewData.vehicleRightImageURL} width={90} height={90} alt="vehicleRightImageURL" />
                </td>
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

export default InstallationViewModal;
