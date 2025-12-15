
import SuccessPopupModal from "component/SuccessPopupModal";
import { ConfigContext } from "context/ConfigContext";
import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { AddUpdateCustomerSupport, GetCustomerSupportModel } from "services/Customer Support/CustomerSupportApi";

const HelpAndSupportModal = ({ show, onHide, selectedQuery, setIsAddUpdateActionDone, modelRequestData }) => {
      const [replyText, setReplyText] = useState("");

      const [helpSupportObj, setHelpSupportObj] = useState({
            supportKeyID: null,
            empID: null,
            quetion: null,
            answer: null,
            answerByID: null,
            actionType: null,
      })
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [modelAction, setModelAction] = useState('')
      const { setLoader, user, companyID, permissions } = useContext(ConfigContext);

      useEffect(() => {
            if (modelRequestData?.Action === 'Update') {

                  if (modelRequestData?.supportKeyID !== null || modelRequestData?.supportKeyID !== undefined) {
                        GetCustomerSupportModelData(modelRequestData?.supportKeyID);
                  }
            }
      }, [modelRequestData?.Action]);




      const handleSubmit = () => {
            // onSubmit(replyText);
            const payload = {
                  userKeyID: user.userKeyID,
                  supportKeyID: modelRequestData.supportKeyID,
                  answerByID: user.userID,
                  answer: helpSupportObj.answer,
                  actionType: "ANSWER"

            };

            AddUpdateCustomerSupportData(payload)
      }

      const AddUpdateCustomerSupportData = async (apiParam) => {
            setLoader(true)
            try {
                  let url = '/AddUpdateCustomerSupport'; // Default URL for Adding Data

                  const response = await AddUpdateCustomerSupport(url, apiParam);
                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false)
                              setShowSuccessModal(true);
                              setModelAction(
                                    modelRequestData.Action === null || modelRequestData.Action === undefined
                                          ? 'Query Answer Added Successfully!'
                                          : 'Query Answer Updated Successfully!'
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



      const GetCustomerSupportModelData = async (id) => {

            if (id === undefined) return;

            try {
                  setLoader(true);

                  const data = await GetCustomerSupportModel(id);

                  if (data?.data?.statusCode !== 200) {
                        console.error("Error fetching user model");
                        setLoader(false);
                        return;
                  }

                  const ModelData = data.data.responseData.data || {};


                  setHelpSupportObj((prev) => ({
                        ...prev,
                        empID: ModelData.empID,
                        quetion: ModelData.quetion,
                        answer: ModelData.answer,
                        answerByID: ModelData.answerByID,
                        actionType: ModelData.actionType,


                  }));


            } catch (error) {
                  console.error("Error in GetAppUserModelData:", error);
            } finally {
                  setLoader(false);
            }
      };

      const closeAllModal = () => {
            setReplyText('')
            setShowSuccessModal(false)
            onHide()
      }
      return (

            <Modal size="lg" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>

                  <Modal.Header closeButton>
                        <Modal.Title>
                              {modelRequestData.Action !== null ? 'Update your answer' : 'Reply to Query'}
                        </Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                        <div className="mb-2">
                              <strong>Ticket No:</strong> {modelRequestData.supportID}
                        </div>

                        <div className="mb-3">
                              <strong>Query:</strong> {modelRequestData.quetion}
                        </div>

                        <textarea
                              className="form-control"
                              rows={4}
                              placeholder="Enter reply here..."
                              value={helpSupportObj.answer || ""}
                              onChange={(e) =>
                                    setHelpSupportObj(prev => ({
                                          ...prev,
                                          answer: e.target.value,
                                    }))
                              }
                        />

                  </Modal.Body>

                  <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>
                              Cancel
                        </Button>


                        <button className="btn text-center" style={{ background: '#ffaa33', color: 'white' }} onClick={() => handleSubmit()}>
                              Submit
                        </button>
                  </Modal.Footer>
                  {showSuccessModal && (
                        <SuccessPopupModal
                              show={showSuccessModal}
                              onHide={() => closeAllModal()}
                              setShowSuccessModal={setShowSuccessModal}
                              modelAction={modelAction}
                        />
                  )}
            </Modal>
      );
};

export default HelpAndSupportModal;

