import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import { GetVehicleViewDetails } from 'services/Vehicle/VehicleApi';
import { ConfigContext } from 'context/ConfigContext';

function VehicleTableViewModal({ show, onHide, modelRequestData }) {
  const { setLoader } = useContext(ConfigContext);

  const [vehicleViewData, setVehicleViewData] = useState({
    customerName: null,
    custMobileNumber: null,
    vehicleNumber: null,
    vehicleTypeName: null,
    rcBookFileImageURL: null,
    vehicleNumberPlateImageURL: null,
    vehicleFrontViewImageURL: null,
    vehicleSideViewImageURL: null
  });

  useEffect(() => {
    if (modelRequestData?.vehicleKeyID !== null && modelRequestData?.vehicleKeyID !== undefined) {
      GetVehicleModelData(modelRequestData.vehicleKeyID);
    }
  }, [modelRequestData]);

  const GetVehicleModelData = async (id) => {
    setLoader(true);
    try {
      const response = await GetVehicleViewDetails(id);

      if (response?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = response.data.responseData?.data; // Use empty object as default

        setVehicleViewData({
          customerName: ModelData.customerName,
          custMobileNumber: ModelData.custMobileNumber,
          vehicleNumber: ModelData.vehicleNumber,
          vehicleTypeName: ModelData.vehicleTypeName,
          rcBookFileImageURL: ModelData.rcBookFileImageURL,
          vehicleNumberPlateImageURL: ModelData.vehicleNumberPlateImageURL,
          vehicleFrontViewImageURL: ModelData.vehicleFrontViewImageURL,
          vehicleSideViewImageURL: ModelData.vehicleSideViewImageURL
        });
      } else {
        setLoader(false);
        console.error('Error fetching data: ', response?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error in GetVehicleModelData: ', error);
    }
  };

  return (
    <Modal backdrop="static" keyboard={false} style={{ zIndex: 1300 }} show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <b>Vehicle Details</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="scrollable-table">
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>
                  <b>Customer Name</b>
                </td>
                <td>{vehicleViewData.customerName}</td>
              </tr>

              <tr>
                <td>
                  <b>Contact No.</b>
                </td>
                <td>{vehicleViewData.custMobileNumber}</td>
              </tr>

              <tr>
                <td>
                  <b>Vehicle Number</b>
                </td>
                <td>{vehicleViewData.vehicleNumber}</td>
              </tr>
              <tr>
                <td>
                  <b>Vehicle Type Name</b>
                </td>
                <td>{vehicleViewData.vehicleTypeName}</td>
              </tr>

              <tr>
                <td>
                  <b>RC Book File Image</b>
                </td>

                <td className="text-center">
                  <img
                    id="currentPhoto"
                    src={vehicleViewData.rcBookFileImageURL || 'https://placehold.co/400?text=Velvet\nGps&font=roboto'}
                    alt="Company Logo"
                    width={90}
                    height={90}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/400?text=Velvet\nGps&font=roboto';
                    }}
                  />
                  {/* <img src={vehicleViewData.rcBookFileImageURL} width={80} height={80} alt="rcBookFileImageURL" /> */}
                </td>
              </tr>
              <tr>
                <td>
                  <b>Vehicle Number Plate Image</b>
                </td>
                <td className="text-center">
                  <img
                    id="currentPhoto"
                    src={vehicleViewData.vehicleNumberPlateImageURL || 'https://placehold.co/400?text=Velvet\nGps&font=roboto'}
                    alt="Company Logo"
                    width={90}
                    height={90}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/400?text=Velvet\nGps&font=roboto';
                    }}
                  />
                  {/* <img src={vehicleViewData.vehicleNumberPlateImageURL} width={80} height={80} alt="vehicleNumberPlateImageURL" /> */}
                </td>
              </tr>
              <tr>
                <td>
                  <b>Vehicle Front View Image</b>
                </td>
                <td className="text-center">
                  <img
                    id="currentPhoto"
                    src={vehicleViewData.vehicleFrontViewImageURL || 'https://placehold.co/400?text=Velvet\nGps&font=roboto'}
                    alt="Company Logo"
                    width={90}
                    height={90}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/400?text=Velvet\nGps&font=roboto';
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <b>Vehicle Side View Image</b>
                </td>
                <td className="text-center">
                  <img
                    id="currentPhoto"
                    src={vehicleViewData.vehicleSideViewImageURL || 'https://placehold.co/400?text=%F0%9F%93%8D%0AVelvet%0AGps&font=roboto'}
                    alt="Company Logo"
                    width={90}
                    height={90}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/400?text=%F0%9F%93%8D%0AVelvet%0AGps&font=roboto';
                    }}
                  />
                  {/* <img src={vehicleViewData.} width={80} height={80} alt="vehicleSideViewImageURL" /> */}
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

export default VehicleTableViewModal;
