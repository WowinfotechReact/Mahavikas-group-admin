



import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import { GetCustomerInstalledDeviceList, GetCustomerModel, GetCustomerViewDetails } from 'services/CustomerStaff/CustomerStaffApi';
import { useLocation } from 'react-router';
import { ConfigContext } from 'context/ConfigContext';

function CustomerFirmViewModal({ show, onHide, modelRequestData }) {
  const { setLoader, user, companyID } = useContext(ConfigContext);


  const [searchKeyword, setSearchKeyword] = useState('');
  const [fromDate, setFromDate] = useState(null); // Initialize as null
  const [toDate, setToDate] = useState(null); const [modelAction, setModelAction] = useState();
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalCount, setTotalCount] = useState(null);
  const [pageSize, setPageSize] = useState(30);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerObj, setcustomerObj] = useState({
    customerKeyID: null,
    accountDetails: true,

    customerFirmName: null,
    gstNumber: null,
    vendorCode: null,
    billingAddress: null,
    addressperGST: null,
    shippingAddress: null,
    mobileNumber: null,
    alternateMobileNumber: null,
    emailID: null,
    accountNumber: null,
    ifscCode: null,
    branchName: null,
    pointofContact: true,
    contactPersonName: null,
    contactPersonDesignation: null,
    contactPersonNumber: null,
    contactAlternateNumber: null,
    contactPersonEmail: null,
    userKeyID: null
  });

  useEffect(() => {
    if (modelRequestData?.Action === 'View') {
      if (modelRequestData?.customerKeyID !== null) {
        GetCustomerModelData(modelRequestData?.customerKeyID);
      }
    }
  }, [modelRequestData?.Action]);
  const GetCustomerModelData = async (id) => {

    if (id === undefined) {
      return;
    }

    setLoader(true);
    try {
      const data = await GetCustomerModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = data.data.responseData.data;


        setcustomerObj({
          ...customerObj,
          customerKeyID: ModelData.customerKeyID,
          accountDetails: ModelData.accountDetails,
          customerFirmName: ModelData.customerFirmName,
          gstNumber: ModelData.gstNumber,
          vendorCode: ModelData.vendorCode,
          billingAddress: ModelData.billingAddress,
          addressperGST: ModelData.addressperGST,
          shippingAddress: ModelData.shippingAddress,
          mobileNumber: ModelData.mobileNumber,
          alternateMobileNumber: ModelData.alternateMobileNumber,
          emailID: ModelData.emailID,
          accountNumber: ModelData.accountNumber,
          contactName: ModelData.contactName,
          ifscCode: ModelData.ifscCode,
          branchName: ModelData.branchName,
          pointofContact: ModelData.pointofContact,
          contactName: ModelData.contactPersonName,
          designation: ModelData.contactPersonDesignation,
          contactNumber: ModelData.contactPersonNumber,
          contactAlternateNumber: ModelData.contactAlternateNumber,
          contactPersonEmailID: ModelData.contactPersonEmail,

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
  console.log(customerObj, 'udsahpiudhsapudiasdasdas');

  return (
    <Modal backdrop="static" keyboard={false} style={{ zIndex: 1300 }} show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <b>Customer / Firm Details</b>
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
                <td>{customerObj.customerFirmName}</td>
              </tr>
              <tr>
                <td>
                  <b>Contact No.</b>
                </td>
                <td>{customerObj.mobileNumber}</td>
              </tr>
              <tr>
                <td>
                  <b>Billing Address</b>
                </td>
                <td>
                  {customerObj.billingAddress?.length > 20 ? (
                    <Tooltip title={customerObj.billingAddress}>{`${customerObj.billingAddress?.substring(0, 20)}...`}</Tooltip>
                  ) : (
                    <>{customerObj.billingAddress}</>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <b>Shipping Address</b>
                </td>
                <td>
                  {customerObj.shippingAddress?.length > 20 ? (
                    <Tooltip title={customerObj.shippingAddress}>{`${customerObj.shippingAddress?.substring(0, 20)}...`}</Tooltip>
                  ) : (
                    <>{customerObj.shippingAddress}</>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <b>GST Number</b>
                </td>
                <td>{customerObj.gstNumber}</td>
              </tr>
              <tr>
                <td>
                  <b>Address Per GST Number</b>
                </td>
                <td>{customerObj.addressperGST}</td>
              </tr>
              <tr>
                <td>
                  <b>Vendor Code</b>
                </td>
                <td>{customerObj.vendorCode}</td>
              </tr>
              <tr>
                <td>
                  <b>Mobile Number </b>
                </td>
                <td>{customerObj.mobileNumber}</td>
              </tr>
              <tr>
                <td>
                  <b>Email ID</b>
                </td>
                <td>{customerObj.emailID}</td>
              </tr>
              <tr>
                <td>
                  <b>
                    Alternate Mobile Number</b>
                </td>
                <td>{customerObj.alternateMobileNumber}</td>
              </tr>
              {customerObj.accountDetails === true &&
                <>
                  <tr>
                    <td>
                      <b>
                        Account Number</b>
                    </td>
                    <td>{customerObj.accountNumber}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>
                        IFSC Code</b>
                    </td>
                    <td>{customerObj.ifscCode}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>
                        Branch Name</b>
                    </td>
                    <td>{customerObj.branchName}</td>
                  </tr>
                </>
              }
              {customerObj.pointofContact === true &&
                <>
                  <tr>
                    <td>
                      <b>
                        Contact Name</b>
                    </td>
                    <td>{customerObj.contactName}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>
                        Designation</b>
                    </td>
                    <td>{customerObj.designation}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>
                        Contact Number</b>
                    </td>
                    <td>{customerObj.contactNumber}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>
                        Contact Alternate Number</b>
                    </td>
                    <td>{customerObj.contactAlternateNumber}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>
                        Contact Person Email ID</b>
                    </td>
                    <td>{customerObj.contactPersonEmailID}</td>
                  </tr>
                </>
              }
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

export default CustomerFirmViewModal;
