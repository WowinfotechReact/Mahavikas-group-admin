

import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { AddUpdateAMCInvoicePaymentCollection, GetAMCInvoicePaymentCollectionList } from 'services/AMC Payment Collection/AMCPaymentCollectionApi';


const PaymentCollectionModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
      const [modelAction, setModelAction] = useState('');
      const [error, setErrors] = useState(null);
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [errorMessage, setErrorMessage] = useState();
      const { setLoader, user } = useContext(ConfigContext);
      const [stateChangeStatus, setStateChangeStatus] = useState('');
      const [totalRecords, setTotalRecords] = useState(-1);
      const [currentPage, setCurrentPage] = useState(1);
      const [totalPage, setTotalPage] = useState();
      const [totalCount, setTotalCount] = useState(null);
      const [pageSize, setPageSize] = useState(30);
      const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
      const [searchKeyword, setSearchKeyword] = useState('');
      const [fromDate, setFromDate] = useState(null); // Initialize as null
      const [toDate, setToDate] = useState(null);
      const [paymentData, setStateListData] = useState([]);
      const [paymentCollectionObj, setPaymentCollectionObj] = useState({
            userKeyID: null,
            ipcKeyID: null,
            amcInvoiceKeyID: null,
            paidAmount: null,
            paymentDate: null
      });

      console.log(modelRequestData, 'sssss333');



      // useEffect(() => {
      //   GetStateLookupListData();
      // }, [modelRequestData?.Action]);

      const AddStateBtnClick = () => {
            // debugger;
            let isValid = false;
            if (
                  paymentCollectionObj.paidAmount === null ||
                  paymentCollectionObj.paidAmount === undefined ||
                  paymentCollectionObj.paidAmount === '' ||
                  paymentCollectionObj.paymentDate === null ||
                  paymentCollectionObj.paymentDate === undefined ||
                  paymentCollectionObj.paymentDate === ''
            ) {
                  setErrors(true);
                  isValid = true;
            } else {
                  setErrors(false);
                  isValid = false;
            }

            const apiParam = {
                  userKeyID: user.userKeyID,
                  amcInvoiceKeyID: modelRequestData?.amcInvoiceKeyID,
                  paidAmount: paymentCollectionObj?.paidAmount,
                  paymentDate: paymentCollectionObj?.paymentDate,
                  ipcKeyID: paymentCollectionObj.ipcKeyID
            };

            if (!isValid) {
                  AddUpdateInvoicePaymentCollectionData(apiParam);
            }
      };

      const AddUpdateInvoicePaymentCollectionData = async (apiParam) => {
            setLoader(true)
            try {
                  let url = '/AddUpdateAMCInvoicePaymentCollection'; // Default URL for Adding Data

                  const response = await AddUpdateAMCInvoicePaymentCollection(url, apiParam);
                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false)
                              setShowSuccessModal(true);
                              setModelAction(

                                    'AMC Invoice Payment Collect Successfully!'
                              ); //Do not change this naming convention

                              setIsAddUpdateActionDone(true);
                        } else {
                              setLoader(false)
                              setErrorMessage(response?.response?.data?.errorMessage);
                        }
                  }
            } catch (error) {
                  setLoader(false)
                  console.error(error);
            }
      };


      const handleDateChange = (date) => {
            setPaymentCollectionObj((prevState) => ({
                  ...prevState,
                  paymentDate: date // Update state with selected date
            }));
      };


      const closeAllModal = () => {
            onHide();
            setShowSuccessModal(false);
      };



      useEffect(() => {
            GetInvoicePaymentCollectionListData(1)
      }, [modelRequestData])

      console.log(modelRequestData, '343244dssdsadas');


      const GetInvoicePaymentCollectionListData = async (pageNumber) => {
            // debugger
            setLoader(true);
            try {
                  const data = await GetAMCInvoicePaymentCollectionList({
                        pageSize,
                        pageNo: pageNumber - 1, // Page numbers are typically 0-based in API calls
                        searchKeyword: null,
                        toDate: null,
                        fromDate: null,
                        sortingDirection: null,
                        sortingColumnName: null,
                        userKeyID: user.userKeyID,
                        amcInvoiceKeyID: modelRequestData.amcInvoiceKeyID
                  });

                  if (data) {
                        if (data?.data?.statusCode === 200) {
                              setLoader(false);
                              if (data?.data?.responseData?.data) {
                                    const MasterStateListData = data.data.responseData.data;
                                    const totalItems = data.data?.totalCount; // const totalItems = 44;
                                    setTotalCount(totalItems);
                                    const totalPages = Math.ceil(totalItems / pageSize);
                                    setTotalPage(totalPages);
                                    setTotalRecords(MasterStateListData.length);
                                    setStateListData(MasterStateListData);
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

      return (
            <>
                  <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
                        <Modal.Header closeButton>
                              <Modal.Title>
                                    <h3 className="text-center">
                                          Payment Collection
                                    </h3>
                              </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
                              <div className="container">


                                    <div className="col-12 mb-3">
                                          <label htmlFor="StateName" className="form-label">
                                                Remaining Amount (₹)
                                                <span style={{ color: 'red' }}>*</span>
                                          </label>
                                          <input
                                                type="number"
                                                disabled
                                                className="form-control"
                                                id="paidAmount"
                                                value={(
                                                      modelRequestData?.amcInvoiceAmount -
                                                      (paymentData?.reduce(
                                                            (sum, item) => sum + Number(item.paidAmount || 0),
                                                            0
                                                      ) || 0)
                                                ).toFixed(2)}
                                          />


                                          {/* {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>} */}
                                    </div>
                                    <div className="col-12 mb-3">
                                          <label htmlFor="StateName" className="form-label">
                                                Paid Amount (₹)
                                                <span style={{ color: 'red' }}>*</span>
                                          </label>
                                          <input
                                                type="text"
                                                className="form-control"
                                                id="paidAmount"
                                                placeholder="Enter Paid Amount"
                                                value={paymentCollectionObj.paidAmount}
                                                onChange={(e) => {
                                                      let inputValue = e.target.value;

                                                      // ✅ Allow only digits + decimal
                                                      const cleanedValue = inputValue.replace(/[^0-9.]/g, "");

                                                      // ✅ Prevent multiple dots
                                                      const parts = cleanedValue.split(".");
                                                      if (parts.length > 2) return;

                                                      let finalValue = parts[0];
                                                      if (parts[1] !== undefined) {
                                                            finalValue += "." + parts[1].slice(0, 2); // only 2 decimals
                                                      }

                                                      // ✅ Remaining amount calculation
                                                      const remainingAmount =
                                                            (modelRequestData?.amcInvoiceAmount || 0) -
                                                            (paymentData?.reduce(
                                                                  (sum, item) => sum + Number(item.paidAmount || 0),
                                                                  0
                                                            ) || 0);

                                                      // ✅ Convert to number for comparison
                                                      const numericValue = Number(finalValue);

                                                      // ✅ Block value > remainingAmount
                                                      if (numericValue > remainingAmount) return;

                                                      setPaymentCollectionObj((prev) => ({
                                                            ...prev,
                                                            paidAmount: finalValue,
                                                      }));
                                                }}
                                          />


                                          {error && (paymentCollectionObj.paidAmount === null || paymentCollectionObj.paidAmount === undefined || paymentCollectionObj.paidAmount === '') ? (
                                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                          ) : (
                                                ''
                                          )}
                                          {/* {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>} */}
                                    </div>

                                    <div className="col-12 mb-3">
                                          <label htmlFor="talukaName" className="form-label">
                                                Date :
                                                <span style={{ color: 'red' }}>*</span>
                                          </label>
                                          <DatePicker
                                                value={paymentCollectionObj?.paymentDate} // Use "selected" instead of "value"
                                                onChange={handleDateChange}
                                                label="From Date"
                                                clearIcon={null}
                                                popperPlacement="bottom-start"
                                                defaultValue={paymentCollectionObj.paymentDate


                                                } // Calendar opens to this

                                          />

                                          {error &&
                                                (paymentCollectionObj.paymentDate === null || paymentCollectionObj.paymentDate === undefined || paymentCollectionObj.paymentDate === '') ? (
                                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                          ) : (
                                                ''
                                          )}
                                          {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
                                    </div>

                                    {/* Remaining Amount Input */}


                                    {/* Payments Table */}
                                    <table className="table table-bordered mt-3">
                                          <thead>
                                                <tr >
                                                      <th className='text-center' >Payment Date</th>
                                                      <th className='text-center'>Paid Amt ⟨₹⟩ </th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                {paymentData?.length > 0 ? (
                                                      paymentData.map((item) => (
                                                            <tr className='text-center' key={item.ipcKeyID}>
                                                                  {/* <td>{item.paymentDate}</td> */}
                                                                  <td className='text-center'>{new Date(item.paymentDate).toLocaleDateString()}</td>

                                                                  <td className='text-center'>
                                                                        {new Intl.NumberFormat('en-IN', {
                                                                              style: 'decimal',
                                                                              maximumFractionDigits: 0,
                                                                              minimumFractionDigits: 0
                                                                        }).format(Math.round(item.paidAmount))}
                                                                  </td>
                                                            </tr>
                                                      ))
                                                ) : (
                                                      <tr>
                                                            <td colSpan="2" className="text-center">No Payments Found</td>
                                                      </tr>
                                                )}
                                          </tbody>
                                    </table>
                              </div>
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="secondary" onClick={onHide}>
                                    Close
                              </Button>
                              <button type="submit" className="btn text-white text-center" style={{ background: '#9aa357' }} onClick={() => AddStateBtnClick()}>
                                    Submit
                              </button>
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

export default PaymentCollectionModal;
