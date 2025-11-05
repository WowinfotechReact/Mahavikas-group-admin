import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import { GetCustomerInstalledDeviceList, GetCustomerViewDetails } from 'services/CustomerStaff/CustomerStaffApi';
import { useLocation } from 'react-router';

function CustomerViewModal({ show, onHide, modelRequestData }) {


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
  const [customerViewData, setCustomerViewData] = useState({
    customerID: null,
    customerKeyID: null,
    companyKeyID: null,
    companyID: null,
    companyName: null,
    name: null,
    address: null,
    stateID: null,
    stateName: null,
    districtID: null,
    districtName: null,
    talukaID: null,
    talukaName: null,
    villageID: null,
    villageName: null,
    mobileNo: null,
    adharNumber: null,
    adharFrontImageURL: null,
    adharBackImageURL: null,
    status: null,
    createdOnDate: null
  }); // State for booking data

  const location = useLocation()
  console.log(location.state, 'iujkdsa087gdisadsad');

  useEffect(() => {
    if (location.state?.customerKeyID !== null && location.state?.customerKeyID !== undefined) {
      GetMachineBookingModelData(location.state.customerKeyID);
      GetCustomerInstalledDeviceListData(1, null, null)
    }
  }, [location.state]);

  const GetCustomerInstalledDeviceListData = async (pageNumber, toDate, fromDate) => {

    setLoader(true);
    try {
      const data = await GetCustomerInstalledDeviceList({
        pageSize,
        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        userKeyID: user.userKeyID,
        sortingDirection: null,
        sortingColumnName: null,
        companyKeyID: companyID
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData?.data) {
            const customerListData = data.data.responseData.data;
            const totalItems = data.data?.totalCount; // const totalItems = 44;
            setTotalCount(totalItems);
            const totalPages = Math.ceil(totalItems / pageSize);
            setTotalPage(totalPages);
            setTotalRecords(customerListData.length);
            setCustomerListData(customerListData);
          }
        } else {
          setErrorMessage(data?.data?.errorMessage);
          setLoader(false);
        }
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };
  const GetMachineBookingModelData = async (id) => {

    try {
      const response = await GetCustomerViewDetails(id);

      if (response?.data?.statusCode === 200) {
        const ModelData = response.data.responseData?.data || {}; // Use empty object as default
        console.log(ModelData, 'iuhd0s7aadusad');

        setCustomerViewData({
          companyName: ModelData.companyName,
          name: ModelData.name,
          address: ModelData.address,
          stateName: ModelData.stateName,
          districtName: ModelData.districtName,
          talukaName: ModelData.talukaName,
          villageName: ModelData.villageName,
          mobileNo: ModelData.mobileNo,
          adharNumber: ModelData.adharNumber,
          adharFrontImageURL: ModelData.adharFrontImageURL,
          adharBackImageURL: ModelData.adharBackImageURL,
          status: ModelData.status,
          createdOnDate: ModelData.createdOnDate
        });
      } else {
        console.error('Error fetching data: ', response?.data?.statusCode);
      }
    } catch (error) {
      console.error('Error in GetMachineBookingModelData: ', error);
    }
  };

  return (
    <Modal backdrop="static" keyboard={false} style={{ zIndex: 1300 }} show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <b>Customer Details</b>
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
                <td>{customerViewData.companyName}</td>
              </tr>
              <tr>
                <td>
                  <b>Customer Name</b>
                </td>
                <td>{customerViewData.name}</td>
              </tr>
              <tr>
                <td>
                  <b>Contact No.</b>
                </td>
                <td>{customerViewData.mobileNo}</td>
              </tr>
              <tr>
                <td>
                  <b>Address</b>
                </td>
                <td>
                  {customerViewData.address?.length > 20 ? (
                    <Tooltip title={customerViewData.address}>{`${customerViewData.address?.substring(0, 20)}...`}</Tooltip>
                  ) : (
                    <>{customerViewData.address}</>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <b>State Name</b>
                </td>
                <td>{customerViewData.stateName}</td>
              </tr>
              <tr>
                <td>
                  <b>District Name</b>
                </td>
                <td>{customerViewData.districtName}</td>
              </tr>
              <tr>
                <td>
                  <b>Taluka Name</b>
                </td>
                <td>{customerViewData.talukaName}</td>
              </tr>
              <tr>
                <td>
                  <b>Village Name</b>
                </td>
                <td>{customerViewData.villageName}</td>
              </tr>
              <tr>
                <td>
                  <b>Aadhaar Number</b>
                </td>
                <td>{customerViewData.adharNumber}</td>
              </tr>
              <tr>
                <td>
                  <b>Aadhaar Front Image</b>
                </td>
                <td className="text-center">
                  <img
                    id="currentPhoto"
                    src={customerViewData.adharFrontImageURL || 'https://placehold.co/400?text=Velvet\nGps&font=roboto'}
                    alt="Company Logo"
                    width={90}
                    height={90}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/400?text=Velvet\nGps&font=roboto';
                    }}
                  />
                  {/* <img src={customerViewData.} width={90} height={90} alt="customerViewData" /> */}
                </td>
              </tr>
              <tr>
                <td>
                  <b>Aadhaar Back Image</b>
                </td>
                <td className="text-center">
                  <img
                    id="currentPhoto"
                    src={customerViewData.adharBackImageURL || 'https://placehold.co/400?text=Velvet\nGps&font=roboto'}
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

export default CustomerViewModal;
