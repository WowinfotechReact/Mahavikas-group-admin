

import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { AddUpdateStateApi, GetStateModel } from 'services/Master Crud/MasterStateApi';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import Lottie from "lottie-react";
import approval_Rejection_Gif from '../../assets/images/approval.json'
import { AddUpdateApproveRejectEditPORequest } from 'services/Purchase Order/PurchaseOrderApi';

// import editAnimation from "@/assets/lotties/edit.json"; // download or use a URL

const POEditApprovedRejectModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {


      const [modelAction, setModelAction] = useState('');
      const [error, setErrors] = useState(null);
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [errorMessage, setErrorMessage] = useState();
      const { setLoader, user } = useContext(ConfigContext);
      const [masterStateObj, setMasterStateObj] = useState({
            userKeyID: null,
            stateID: null,
            stateName: null
      });



      const AddStateBtnClick = (isApproved) => {


            const apiParam = {
                  userKeyID: user.userKeyID,
                  leadID: modelRequestData.leadID,
                  isApproved: isApproved
            };


            AddUpdateApproveRejectEditPORequestData(apiParam);

      };

      const AddUpdateApproveRejectEditPORequestData = async (apiParam) => {
            setLoader(true);
            try {
                  let url = '/AddUpdateApproveRejectEditPORequest'; // Default URL for Adding Data

                  const response = await AddUpdateApproveRejectEditPORequest(url, apiParam);
                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false);
                              setShowSuccessModal(true);
                              setModelAction(
                                    'Action Taken Successfully!'

                              ); //Do not change this naming convention

                              setIsAddUpdateActionDone(true);
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
            onHide();
            setShowSuccessModal(false);
      };

      const GetMasterStateModalData = async (id) => {
            if (id === undefined) {
                  return;
            }
            setLoader(true);

            try {
                  const data = await GetStateModel(id);
                  if (data?.data?.statusCode === 200) {
                        setLoader(false);
                        const ModelData = data.data.responseData.data; // Assuming data is an array

                        setMasterStateObj({
                              ...masterStateObj,
                              adminID: ModelData.adminID,
                              userKeyID: ModelData.userKeyID,
                              stateID: ModelData.stateID,
                              stateName: ModelData.stateName
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

      return (
            <>
                  <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
                        <Modal.Header closeButton>
                              <Modal.Title>
                                    <h3 className="text-center">

                                          Pending Request
                                    </h3>
                              </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>


                              <div className="d-flex justify-content-center mb-3">
                                    <Lottie animationData={approval_Rejection_Gif} style={{ height: 120 }} />
                              </div>

                              <p className="text-muted mt-3">
                                    This Purchase Order has an <strong>edit request</strong>. <br />
                                    Please review and choose whether you want to <strong>approve</strong> or <strong>reject</strong> this request.
                              </p>
                        </Modal.Body>
                        <Modal.Footer>

                              <button type="submit" style={{ background: 'red' }} className="btn text-white text-center" onClick={() => AddStateBtnClick(0)}>
                                    Reject
                              </button>
                              <button style={{ background: '#ffaa33' }} className="btn text-white text-center" onClick={() => AddStateBtnClick(1)}>
                                    Approved
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

export default POEditApprovedRejectModal;
