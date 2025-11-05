import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { AddUpdateQuotationNumFormatApi, GetQuotationNumberFormatByID } from 'services/Quotation-Number-Format/QuotationNumberFormatAPI';

const AddUpdateQuotationNumberFormatModal = ({ show, onHide, setIsAddUpdateActionDone, quotationRequestData }) => {
  const { setLoader, user } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const [quotationObj, setQuotationObj] = useState({
    userKeyID: '',
    quotationNumberFormatKeyID: null,
    quotationNumberFormat: ''
  });

  useEffect(() => {
    if (show && quotationRequestData?.Action === 'Update' && quotationRequestData?.quotationNumberFormatKeyID) {
      getQuotationByID(quotationRequestData.quotationNumberFormatKeyID);
    } else if (show && quotationRequestData?.Action === 'Add') {
      setQuotationObj({
        userKeyID: '',
        quotationNumberFormatKeyID: null,
        quotationNumberFormat: ''
      });
      setError({});
      setErrorMessage('');
    }
  }, [show, quotationRequestData]);

  const getQuotationByID = async (id) => {
    setLoader(true);
    try {
      const res = await GetQuotationNumberFormatByID(id);
      if (res?.data?.statusCode === 200) {
        const data = res.data.responseData.data;
        setQuotationObj({
          userKeyID: data.userKeyID,
          quotationNumberFormatKeyID: id,
          quotationNumberFormat: data.quotationNumberFormat
        });
      }
    } catch (error) {
      console.error('GetQuotationByID error:', error);
    } finally {
      setLoader(false);
    }
  };

  console.log(quotationRequestData?.Action, 'iusadasdas3223');


  const handleSubmit = async () => {
    const newErrors = {};
    if (!quotationObj.quotationNumberFormat?.trim()) newErrors.quotationNumberFormat = true;

    setError(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const apiParam = {
      userKeyID: user.userKeyID,
      quotationNumberFormatKeyID: quotationRequestData?.quotationNumberFormatKeyID ?? null,
      quotationNumberFormat: quotationObj.quotationNumberFormat
    };

    setLoader(true);
    try {
      const response = await AddUpdateQuotationNumFormatApi(apiParam);
      if (response?.data?.statusCode === 200) {
        // debugger

        setShowSuccessModal(true);
        setModelAction(
          quotationRequestData?.Action === 'Update'
            ? 'Quotation Format Updated Successfully!'
            : 'Quotation Format Added Successfully!'
        );
        setIsAddUpdateActionDone(true);
      } else {
        setErrorMessage(response?.response?.data?.errorMessage || 'Request failed');
      }
    } catch (error) {
      console.error('AddUpdateQuotation error:', error);
    } finally {
      setLoader(false);
    }
  };

  const closeAllModal = () => {
    onHide();
    setShowSuccessModal(false);
  };

  return (
    <Modal style={{ zIndex: 1300 }} show={show} onHide={onHide} backdrop="static" keyboard={false} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {quotationRequestData?.Action === 'Update' ? 'Update Quotation Format' : 'Add Quotation Format'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-12 mb-2">
            <label className="form-label">
              Quotation Format <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Quotation Format"
              maxLength={100}
              value={quotationObj.quotationNumberFormat}
              onChange={(e) =>
                setQuotationObj({ ...quotationObj, quotationNumberFormat: e.target.value })
              }
            />
            {error.quotationNumberFormat && (
              <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
            )}
          </div>

          {errorMessage && (
            <div style={{ color: 'red' }} className="col-12 mb-2">
              {errorMessage}
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <button style={{ background: '#ffaa33' }} className='text-white btn' onClick={handleSubmit}>
          Submit
        </button>
      </Modal.Footer>

      <SuccessPopupModal

        show={showSuccessModal}
        onHide={closeAllModal}
        modelAction={modelAction}
        setShowSuccessModal={setShowSuccessModal}

      />
    </Modal>
  );
};

export default AddUpdateQuotationNumberFormatModal;
