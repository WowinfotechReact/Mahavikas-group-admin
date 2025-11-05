





import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { AddUpdateReplacementUnderWarranty } from 'services/Dispatched Order/DispatchedOrderApi';

const AddSerialNoToReplaceDevice = ({ show, onHide, replaceRequestData, onSerialUpdate
}) => {

      const [error, setError] = useState("");
      const [errorMessage, setErrorMessage] = useState();

      const [serialNoObj, setSerialNoObj] = useState({
            serialNo: null
      })

      const { setLoader, user } = useContext(ConfigContext);

      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [modelAction, setModelAction] = useState(false);




      const handleSubmit = () => {
            if (serialNoObj.serialNo === null || serialNoObj.serialNo === '' || serialNoObj.serialNo === undefined) {
                  setError("Serial number is required");
                  return;
            }

            const newSerial = serialNoObj.serialNo.trim();

            // update parent state
            onSerialUpdate(newSerial);

            // build API payload
            const apiParam = {
                  userKeyID: user.userKeyID,
                  ruwidKeyID: null,
                  invoiceID: replaceRequestData.invoiceID,
                  productID: replaceRequestData.productID,
                  salesOrderSerialNo: String(replaceRequestData.oldSerialNumber), // ✅ ensure string
                  salesProductSerID: replaceRequestData.salesProductSerID,
                  // salesOrderSerialNo: replaceRequestData.oldSerialNumber,
                  replaceOrderSerialNo: newSerial, // ✅ use entered serial number
            };

            AddUpdateReplacementUnderWarrantyData(apiParam);
      };

      const setInitialData = () => {
            setSerialNoObj({
                  ...serialNoObj,
                  serialNo: null
            })
      }
      useEffect(() => {
            setInitialData()
      }, [])

      const AddUpdateReplacementUnderWarrantyData = async (apiParam) => {
            setLoader(true);
            try {
                  let url = '/AddUpdateReplacementUnderWarranty'; // Default URL for Adding Data

                  const response = await AddUpdateReplacementUnderWarranty(url, apiParam);
                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false);

                              setShowSuccessModal(true);
                              setModelAction(
                                    'Product Replaced Successfully!'

                              ); //Do not change this naming convention

                              setInitialData()
                        } else {
                              setLoader(false);
                              setErrorMessage(response?.response?.data?.errorMessage);
                        }
                  }
            } catch (error) {
                  setLoader(false);
                  console.error(error);
            }
      };
      const closeAllModal = () => {
            setShowSuccessModal(false)
      }


      const closeModal = () => {
            onHide();
            setInitialData()
            setError();
      }

      return (
            <>
                  <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={closeModal} backdrop="static" keyboard={false} centered>
                        <Modal.Header closeButton>
                              <Modal.Title>
                                    <h3 className="text-center">
                                          New Serial Number
                                    </h3>

                              </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
                              <div className="mb-3">
                                    <label htmlFor="serialNo" className="form-label">
                                          New Serial No. <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                          maxLength={7}
                                          type="text"
                                          className="form-control"
                                          id="serialNo"
                                          placeholder={`Replace ${replaceRequestData?.oldSerialNumber}`}
                                          value={serialNoObj.serialNo}
                                          onChange={(e) => {
                                                setError(false);
                                                setSerialNoObj({
                                                      serialNo: e.target.value.replace(/[^0-9\s]/g, ""),
                                                })
                                          }}
                                    />
                                    {error && <span style={{ color: "red" }}>{error}</span>}

                              </div>
                        </Modal.Body>



                        <Modal.Footer>


                              <button type="submit" onClick={handleSubmit} className="btn  text-center text-white" style={{ background: '#ffaa33' }}>
                                    Submit
                              </button>
                        </Modal.Footer>

                  </Modal>
                  {showSuccessModal &&
                        <SuccessPopupModal
                              show={showSuccessModal}
                              onHide={() => closeAllModal()}
                              setShowSuccessModal={setShowSuccessModal}
                              modelAction={modelAction}
                        />
                  }

            </>
      );
};

export default AddSerialNoToReplaceDevice;
