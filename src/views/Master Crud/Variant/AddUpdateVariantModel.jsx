import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { AddUpdateVariant, GetVariantModel } from 'services/Master Crud/VariantAPI';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';

const AddUpdateVariantModel = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const [modelAction, setModelAction] = useState('');
  const [error, setError] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { setLoader, user } = useContext(ConfigContext);

  const [variantObj, setVariantObj] = useState({
    variantName: '',
    description: ''
  });

  useEffect(() => {
    if (modelRequestData?.Action === 'Update' && modelRequestData?.variantKeyID) {
      fetchVariantModel(modelRequestData.variantKeyID);
    } else {
      setVariantObj({ variantName: '', description: '' });
    }
  }, [modelRequestData]);

  const fetchVariantModel = async (id) => {
    setLoader(true);
    try {
      const response = await GetVariantModel(id);
      if (response?.data?.statusCode === 200) {
        setVariantObj({
          variantName: response.data.responseData.data.variantName,
          description: response.data.responseData.data.description || ''
        });
      } else {
        console.error('Failed to fetch Rating data.');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoader(false);
    }
  };

  const handleSubmit = async () => {
    if (!variantObj.variantName.trim()) {
      setError(true);
      return;
    }
    setError(false);

    const apiParam = {
      userKeyID: user.userKeyID,
      variantKeyID: modelRequestData?.variantKeyID,
      variantName: variantObj.variantName.trim(),
      description: variantObj.description.trim()
    };

    setLoader(true);
    try {
      const response = await AddUpdateVariant('/AddUpdateVariant', apiParam);
      if (response?.data?.statusCode === 200) {
        setModelAction(modelRequestData?.Action === 'Update' ? 'Rating Updated Successfully!' : 'Rating Added Successfully!');
        setShowSuccessModal(true);
        setIsAddUpdateActionDone(true);
      } else {
        setErrorMessage(response?.response?.data?.errorMessage || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoader(false);
    }
  };

  const closeAllModal = () => {
    onHide();
    setShowSuccessModal(false);
  };

  return (
    <>
      <Modal show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>{modelRequestData?.Action === 'Update' ? 'Update Rating' : 'Add Rating'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="VariantName">Rating Name <span style={{ color: 'red' }}>*</span></label>
          <input
            id="VariantName"
            type="text"
            className="form-control"
            placeholder='Enter Rating Name'
            value={variantObj.variantName}
            onChange={(e) => {
              setErrorMessage('');
              const cleaned = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '').trimStart();
              setVariantObj(prev => ({ ...prev, variantName: cleaned }));
            }}
          />
          {error && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
          <div>
            <label htmlFor="Description" className="mt-3">Description</label>
            <textarea
              id="Description"
              className="form-control"
              placeholder="Enter description"
              rows="3"
              value={variantObj.description}
              onChange={(e) => {
                setErrorMessage('');
                setVariantObj(prev => ({ ...prev, description: e.target.value }));
              }}
            />

            {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Close</Button>
          <button style={{ background: '#ffaa33' }} className='btn text-white' onClick={handleSubmit}>Submit</button>
        </Modal.Footer>
      </Modal>

      {showSuccessModal && (
        <SuccessPopupModal
          show={showSuccessModal}
          onHide={closeAllModal}
          modelAction={modelAction}
        />
      )}
    </>
  );
};

export default AddUpdateVariantModel;
