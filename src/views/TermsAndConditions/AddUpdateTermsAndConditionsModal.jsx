import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import JoditEditor from 'jodit-react';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { AddUpdateTermsAndCondtionsApi, GetTermsAndCondtionsByID } from 'services/Terms&Conditions/Terms&CondtionsAPI';
import Text_Editor from 'component/Text_Editor';

const AddUpdateTermsAndConditionsModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const { setLoader, user } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [termsObj, setTermsObj] = useState({
    termsAndConditionsKeyID: null,
    title: '',
    termsAndConditions: ''
  });

  useEffect(() => {
    if (show && modelRequestData?.Action === 'Update' && modelRequestData?.termsAndConditionsKeyID) {
      getTermsAndConditionsByID(modelRequestData.termsAndConditionsKeyID);
    } else if (show && modelRequestData?.Action === 'Add') {
      setTermsObj({
        termsAndConditionsKeyID: null,
        title: '',
        termsAndConditions: ''
      });
      setError(false);
      setErrorMessage('');
    }
  }, [show, modelRequestData]);

  const getTermsAndConditionsByID = async (id) => {
    setLoader(true);

    try {
      const res = await GetTermsAndCondtionsByID(id);
      if (res?.data?.statusCode === 200) {
        const data = res.data.responseData.data;
        setTermsObj({
          termsAndConditionsKeyID: id,
          title: data.title || '',
          termsAndConditions: data.termsAndConditions
        });
      }
    } catch (error) {
      console.error('GetTermsAndConditionsByID error:', error);
    } finally {
      setLoader(false);
    }
  };

  const handleSubmit = async () => {
    if (!termsObj.termsAndConditions?.trim()) {
      setError(true);
      return;
    }

    const apiParam = {
      userKeyID: user.userKeyID,
      termsAndConditionsKeyID: modelRequestData?.termsAndConditionsKeyID ?? null,
      title: termsObj.title,
      termsAndConditions: termsObj.termsAndConditions
    };

    setLoader(true);
    try {
      const response = await AddUpdateTermsAndCondtionsApi(apiParam);
      if (response?.data?.statusCode === 200) {
        setModelAction(modelRequestData?.Action === 'Update' ? 'Terms & condition updated successfully!' : 'Terms & condition added successfully!');
        setShowSuccessModal(true);
        setIsAddUpdateActionDone(true);
      } else {
        setErrorMessage(response?.response?.data?.errorMessage || 'Request failed');
      }
    } catch (error) {
      console.error('AddUpdateTermsAndConditions error:', error);
    } finally {
      setLoader(false);
    }
  };

  const closeAllModal = () => {
    onHide();
    setShowSuccessModal(false);
  };
  const handleDescriptionChange = (htmlContent) => {
    setTermsObj((obj) => ({
      ...obj,
      termsAndConditions: htmlContent
    }));
  };

  return (
    <Modal style={{ zIndex: 1300 }} show={show} onHide={onHide} backdrop="static" keyboard={false} centered>
      <Modal.Header closeButton>
        <Modal.Title>{modelRequestData?.Action === 'Update' ? 'Update Terms & Conditions' : 'Add Terms & Conditions'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="col-12 mb-2">
          <label className="form-label">
            Title <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            value={termsObj.title}
            onChange={(e) => setTermsObj({ ...termsObj, title: e.target.value })}
            placeholder="Enter title"
          />
          {error && !termsObj.title.trim() && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
        </div>

        <div className="col-12 mb-2">
          <label className="form-label">
            Terms and Conditions <span style={{ color: 'red' }}>*</span>
          </label>
          <Text_Editor editorState={termsObj.termsAndConditions} handleContentChange={handleDescriptionChange} />


          {error && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
        </div>

        {errorMessage && (
          <div style={{ color: 'red' }} className="col-12 mb-2">
            {errorMessage}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <button style={{ background: '#ffaa33' }} className='text-white btn' onClick={handleSubmit}>
          Submit
        </button>
      </Modal.Footer>

      <SuccessPopupModal show={showSuccessModal} onHide={closeAllModal} modelAction={modelAction} />
    </Modal>
  );
};

export default AddUpdateTermsAndConditionsModal;
