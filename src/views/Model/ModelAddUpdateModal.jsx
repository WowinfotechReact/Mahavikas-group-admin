import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { AddUpdateModelApi, GetManufacturerLookupList, GetModelByID } from 'services/Model/ModelListAPI';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';

import { GetVariantLookupList } from 'services/Master Crud/VariantAPI';
import Text_Editor from 'component/Text_Editor';

const AddUpdateModelModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const { setLoader, user } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const [manufacturerList, setManufacturerList] = useState([]);
  const [variantList, setVariantList] = useState([]);

  const WarrantyOption = [
    { value: 1, label: '3 Months ' },
    { value: 2, label: '6 Months ' },
    { value: 3, label: '9 Months ' },
    { value: 4, label: '12 Months ' },
    { value: 5, label: '15 Months ' },
    { value: 6, label: '18 Months ' },
    { value: 7, label: '21 Months ' },
    { value: 8, label: '24 Months ' },
    { value: 9, label: '27 Months ' },
    { value: 10, label: '30 Months ' },
    { value: 11, label: '33 Months ' },
    { value: 12, label: '36 Months ' },
    { value: 13, label: '39 Months ' },
    { value: 14, label: '42 Months ' },
    { value: 15, label: '45 Months ' },
    { value: 16, label: '48 Months ' },
    { value: 17, label: '51 Months ' },
    { value: 18, label: '54 Months ' },
    { value: 19, label: '57 Months ' },
    { value: 20, label: '60 Months ' },
  ]

  const [modelObj, setModelObj] = useState({
    userKeyID: null,
    warrantyInMonthID: null,
    modelKeyID: null,
    manufacturerID: '',
    variantID: '',
    modelName: '',
    modelDescription: '',
    rate: '',
    scopeOfSupply: '',
    warranty: '',
    warrantyInMonthID: null
  });

  useEffect(() => {
    if (show && modelRequestData?.Action === 'Update' && modelRequestData?.modelKeyID) {
      getModelByID(modelRequestData.modelKeyID);
    } else if (show && modelRequestData?.Action === 'Add') {
      setModelObj({
        userKeyID: null,
        modelKeyID: null,
        manufacturerID: '',
        variantID: '',
        modelName: '',
        modelDescription: '',
        rate: '',
        scopeOfSupply: '',
        warranty: ''
      });
      setErrors({});
      setErrorMessage('');
    }
  }, [show, modelRequestData]);

  useEffect(() => {
    GetManufacturerList();
    GetVariantList();
  }, []);

  const GetManufacturerList = async () => {
    try {
      const response = await GetManufacturerLookupList();
      if (response?.data?.statusCode === 200) {
        const list = response?.data?.responseData?.data || [];
        const formatted = list.map((item) => ({
          value: item.manufacturerID,
          label: item.manufacturerName
        }));
        setManufacturerList(formatted);
      }
    } catch (error) {
      console.error('Manufacturer List Error:', error);
    }
  };


  const GetVariantList = async () => {
    try {
      const response = await GetVariantLookupList();
      if (response?.data?.statusCode === 200) {
        const list = response?.data?.responseData?.data || [];
        const formatted = list.map((item) => ({
          value: item.variantID,
          label: item.variantName
        }));
        setVariantList(formatted);
      }
    } catch (error) {
      console.error('Variant List Error:', error);
    }
  };

  const getModelByID = async (id) => {
    setLoader(true);
    try {
      const res = await GetModelByID(id);
      if (res?.data?.statusCode === 200) {
        const data = res.data.responseData.data;
        setModelObj({
          userKeyID: data.userKeyID,
          modelKeyID: id,
          manufacturerID: data.manufacturerID,
          variantID: data.variantID,
          modelName: data.modelName,
          modelDescription: data.modelDescription,
          rate: data.rate,
          scopeOfSupply: data.scopeOfSupply,

          warrantyInMonthID: data.warrantyInMonthID,
          warranty: data.warranty
        });
      }
    } catch (error) {
      console.error('GetModelByID error:', error);
    } finally {
      setLoader(false);
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!modelObj.manufacturerID) newErrors.manufacturerID = true;
    if (!modelObj.variantID) newErrors.variantID = true;
    if (!modelObj.modelName?.trim()) newErrors.modelName = true;
    if (!modelObj.modelDescription?.trim()) newErrors.modelDescription = true;
    if (!modelObj.rate) newErrors.rate = true;
    if (!modelObj.warrantyInMonthID) newErrors.warrantyInMonthID = true;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const apiParam = {
      userKeyID: user.userKeyID,
      modelKeyID: modelRequestData?.modelKeyID ?? null,
      productKeyID: modelRequestData?.productKeyID,
      manufacturerID: modelObj.manufacturerID,
      variantID: modelObj.variantID,
      modelName: modelObj.modelName,
      modelDescription: modelObj.modelDescription,
      rate: parseFloat(modelObj.rate),
      warrantyInMonthID: parseFloat(modelObj.warrantyInMonthID),
      scopeOfSupply: modelObj.scopeOfSupply,
      warranty: modelObj.warranty,
      // warrantyInMonthID: modelObj.warrantyInMonthID,
    };

    setLoader(true);
    try {
      const response = await AddUpdateModelApi('/AddUpdateModel', apiParam);
      if (response?.data?.statusCode === 200) {
        setModelAction(modelRequestData?.Action === 'Update' ? 'Model Updated Successfully!' : 'Model Added Successfully!');
        setShowSuccessModal(true);
        setIsAddUpdateActionDone(true);
      } else {
        setErrorMessage(response?.response?.data?.errorMessage || 'Request failed');
      }
    } catch (error) {
      console.error('AddUpdateModel error:', error);
    } finally {
      setLoader(false);
    }
  };

  const closeAllModal = () => {
    onHide();
    setShowSuccessModal(false);
  };

  const handleProductWarrantyChange = (htmlContent) => {
    setModelObj((obj) => ({
      ...obj,
      modelDescription: htmlContent
    }));
  };

  return (
    <>
      <Modal style={{ zIndex: 1300 }} size="lg" show={show} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modelRequestData?.Action === 'Update' ? 'Update Model' : 'Add Model'}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="row">
            <div className="col-12 col-md-6 mb-2">
              <label className="form-label">
                Manufacturer <span style={{ color: 'red' }}>*</span>
              </label>
              <Select
                options={manufacturerList}
                placeholder="Select Manufacturer"
                value={manufacturerList.find((item) => item.value === modelObj.manufacturerID)}
                onChange={(selected) => setModelObj({ ...modelObj, manufacturerID: selected?.value || '' })}
                menuPosition="fixed"
              />
              {error.manufacturerID && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
            </div>

            <div className="col-12 col-md-6 mb-2">
              <label className="form-label">Scope of Supply</label>
              <textarea
                rows={2}
                className="form-control"
                placeholder="Enter Scope of Supply"
                maxLength={200}
                value={modelObj.scopeOfSupply}
                onChange={(e) => setModelObj({ ...modelObj, scopeOfSupply: e.target.value })}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-md-6 mb-2">
              <label className="form-label">Warranty</label>
              <textarea
                rows={2}
                className="form-control"
                placeholder="Enter Warranty"
                maxLength={500}
                value={modelObj.warranty}
                onChange={(e) => setModelObj({ ...modelObj, warranty: e.target.value })}
              />
            </div>

            <div className="col-12 col-md-6 mb-2">
              <label className="form-label">
                Rating <span style={{ color: 'red' }}>*</span>
              </label>
              <Select
                options={variantList}
                placeholder="Select Rating"
                value={variantList.find((item) => item.value === modelObj.variantID)}
                onChange={(selected) => setModelObj({ ...modelObj, variantID: selected?.value || '' })}
                menuPosition="fixed"
              />
              {error.variantID && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-md-6 mb-2">
              <label className="form-label">
                Model Name <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Model Name"
                maxLength={100}
                value={modelObj.modelName}
                onChange={(e) => setModelObj({ ...modelObj, modelName: e.target.value })}
              />
              {error.modelName && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
            </div>

            <div className="col-12 col-md-6 mb-2">
              <label className="form-label">
                Rate (₹) <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="Enter Rate (₹)"
                value={modelObj.rate}
                onChange={(e) => setModelObj({ ...modelObj, rate: e.target.value })}
              />
              {error.rate && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6 mb-2">
              <label className="form-label">

                Select Warranty (In Month) <span style={{ color: 'red' }}>*</span>
              </label>
              <Select
                options={WarrantyOption}
                placeholder="Select Warranty In Month"
                value={WarrantyOption.find((item) => item.value === modelObj.warrantyInMonthID)}
                onChange={(selected) => setModelObj({ ...modelObj, warrantyInMonthID: selected?.value || '' })}
                menuPosition="fixed"
              />
              {error.warrantyInMonthID && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
            </div>
          </div>

          <div className="col-12 mb-2">
            <label className="form-label">
              Model Description <span style={{ color: 'red' }}>*</span>
            </label>

            <Text_Editor editorState={modelObj.modelDescription} handleContentChange={handleProductWarrantyChange} />

            {error.modelDescription && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
          </div>

          {errorMessage && (
            <div className="col-12 mb-2" style={{ color: 'red' }}>
              {errorMessage}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Close</Button>
          <button className='btn text-white' style={{ background: '#ffaa33' }} onClick={handleSubmit}>Submit</button>
        </Modal.Footer>

        <SuccessPopupModal show={showSuccessModal} onHide={closeAllModal} modelAction={modelAction} />
      </Modal>
    </>
  );
};

export default AddUpdateModelModal;
