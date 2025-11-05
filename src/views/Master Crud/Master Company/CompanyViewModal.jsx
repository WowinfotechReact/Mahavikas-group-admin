import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import { GetCompanyViewDetails } from 'services/Master Crud/MasterCompany';
import { ConfigContext } from 'context/ConfigContext';

function CompanyViewModal({ show, onHide, modelRequestData }) {
  const { setLoader } = useContext(ConfigContext);
  const [companyViewData, setCompanyViewData] = useState({
    companyName: null,
    companyLogoURL: null,
    gstNo: null,
    stateName: null,
    districtName: null,
    talukaName: null,
    villageName: null,
    address: null,
    contactNumber: null,
    email: null,
    website: null,
    aboutUs: null,
    privacyPolicy: null,
    status: null,
    createdOnDate: null
  });

  useEffect(() => {
    if (modelRequestData?.companyKeyID !== null && modelRequestData?.companyKeyID !== undefined) {
      GetMachineBookingModelData(modelRequestData.companyKeyID);
    }
  }, [modelRequestData]);

  const GetMachineBookingModelData = async (id) => {
    setLoader(true);
    try {
      const response = await GetCompanyViewDetails(id);

      if (response?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = response.data.responseData?.data; // Use empty object as default

        setCompanyViewData({
          companyName: ModelData.companyName,
          companyLogoURL: ModelData.companyLogoURL,
          gstNo: ModelData.gstNo,
          stateName: ModelData.stateName,
          districtName: ModelData.districtName,
          talukaName: ModelData.talukaName,
          villageName: ModelData.villageName,
          address: ModelData.address,
          contactNumber: ModelData.contactNumber,
          email: ModelData.email,
          website: ModelData.website,
          aboutUs: ModelData.aboutUs,
          privacyPolicy: ModelData.privacyPolicy,
          status: ModelData.status,
          createdOnDate: ModelData.createdOnDate
        });
      } else {
        setLoader(false);
        console.error('Error fetching data: ', response?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error in Company View Modal: ', error);
    }
  };

  return (
    <Modal backdrop="static" keyboard={false} style={{ zIndex: 1300 }} show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <b>Company Details</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="scrollable-table container ">
          <div className="text-center mb-2">
            {/* <img id="currentPhoto" 
           src={companyViewData?.companyLogoURL} 
           onerror="this.onerror=null; this.src='Default.jpg'" 
           alt=""  width={150}
           height={150}/> */}
            <img
              id="currentPhoto"
              src={companyViewData?.companyLogoURL || 'https://placehold.co/400?text=Velvet\nGps&font=roboto'}
              alt="Company Logo"
              width={150}
              height={150}
              style={{
                borderRadius: '10px',
                border: '1px solid #ddd',
                padding: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/400?text=Velvet\nGps&font=roboto';
              }}
            />

            {/* <img
              src={companyViewData?.companyLogoURL}
              alt="Company Logo"
              width={150}
              height={150}
              style={{
                borderRadius: '10px',
                border: '1px solid #ddd',
                padding: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
              }}
            /> */}
          </div>
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>
                  <b>Company Name</b>
                </td>
                <td>{companyViewData?.companyName}</td>
              </tr>

              <tr>
                <td>
                  <b>Contact No.</b>
                </td>
                <td>{companyViewData?.contactNumber}</td>
              </tr>
              <tr>
                <td>
                  <b>Address</b>
                </td>
                <td>
                  {companyViewData?.address?.length > 20 ? (
                    <Tooltip title={companyViewData?.address}>{`${companyViewData?.address?.substring(0, 20)}...`}</Tooltip>
                  ) : (
                    <>{companyViewData?.address}</>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <b>State Name</b>
                </td>
                <td>{companyViewData?.stateName}</td>
              </tr>
              <tr>
                <td>
                  <b>District Name</b>
                </td>
                <td>{companyViewData?.districtName}</td>
              </tr>
              <tr>
                <td>
                  <b>Taluka Name</b>
                </td>
                <td>{companyViewData?.talukaName}</td>
              </tr>
              <tr>
                <td>
                  <b>Village Name</b>
                </td>
                <td>{companyViewData?.villageName}</td>
              </tr>
              <tr>
                <td>
                  <b>GST No.</b>
                </td>
                <td>{companyViewData?.gstNo}</td>
              </tr>
              <tr>
                <td>
                  <b>Email</b>
                </td>
                <td>{companyViewData?.email}</td>
              </tr>
              <tr>
                <td>
                  <b>Website</b>
                </td>
                <td>{companyViewData?.website}</td>
              </tr>
              <tr>
                <td>
                  <b>About Us</b>
                </td>
                <td
                  style={{
                    height: '150px', // Fixed height
                    // width: '100px', // Fixed width
                    // overflow: 'auto', // Allow scrolling if content exceeds dimensions
                    // whiteSpace: 'pre-wrap', // Preserve formatting and wrap long text
                    border: '1px solid #ddd', // Optional: Add a border for clarity
                    padding: '2px' // Add padding for better readability
                  }}
                  dangerouslySetInnerHTML={{ __html: companyViewData?.aboutUs }}
                />
              </tr>
              <tr>
                <td>
                  <b>Privacy Policy</b>
                </td>
                <td
                  style={{
                    height: '150px', // Fixed height
                    // width: '100px', // Fixed width
                    // overflow: 'auto', // Allow scrolling if content exceeds dimensions
                    // whiteSpace: 'pre-wrap', // Preserve formatting and wrap long text
                    border: '1px solid #ddd', // Optional: Add a border for clarity
                    padding: '2px' // Add padding for better readability
                  }}
                  dangerouslySetInnerHTML={{ __html: companyViewData?.privacyPolicy }}
                />
              </tr>
              {/* 
              <tr>
                <td>
                  <b>Company Logo</b>
                </td>
                <td>
                  <img src={companyViewData?.companyLogoURL} alt="company logo" width={90} height={90} />
                </td>
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

export default CompanyViewModal;
