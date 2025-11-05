import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { AddUpdateProductApi, GetProductModel } from 'services/Product/ProductApi';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';

const AddUpdateProductModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData }) => {
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user } = useContext(ConfigContext);
  const [productObj, setProductObj] = useState({
    userKeyID: null,
    productKeyID: null,
    productName: null,
    hsn: '',
    gstPercentage: ''
  });

  useEffect(() => {
    if (modelRequestData?.Action === 'Update') {
      if (modelRequestData?.productKeyID !== null) {
        GetProductModelData(modelRequestData.productKeyID);
      }
    }
  }, [modelRequestData?.Action]);

  const AddProductBtnClick = () => {
    let isValid = false;
    if (productObj.productName === null || productObj.productName === undefined || productObj.productName.trim() === '') {
      setErrors(true);
      isValid = true;
    } else {
      setErrors(false);
      isValid = false;
    }

    const apiParam = {
      userKeyID: user.userKeyID,
      productName: productObj?.productName,
      productKeyID: modelRequestData?.productKeyID,
      hsn: productObj?.hsn,
      gstPercentage: parseFloat(productObj?.gstPercentage)
    };

    if (!isValid) {
      AddUpdateProductData(apiParam);
    }
  };

  const AddUpdateProductData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateProduct';

      const response = await AddUpdateProductApi(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction(
            modelRequestData.Action === null
              ? 'Product Added Successfully!'
              : 'Product Updated Successfully!'
          );

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

  const GetProductModelData = async (id) => {
    if (id === undefined) {
      return;
    }
    setLoader(true);

    try {
      const data = await GetProductModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = data.data.responseData.data;

        setProductObj({
          ...productObj,
          userKeyID: ModelData.userKeyID,
          productKeyID: modelRequestData.productKeyID,
          productName: ModelData.productName,
          hsn: ModelData.hsn,
          gstPercentage: ModelData.gstPercentage
        });
      } else {
        setLoader(false);
        console.error('Error fetching data: ', data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error in product: ', error);
    }
  };

  return (
    <>
      <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {modelRequestData?.Action !== null ? 'Update Product' : modelRequestData?.Action === null ? 'Add Product' : ''}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
          <div className="container">
            <div className="row">
              {/* Product Name */}
              <div className="mb-3">
                <label htmlFor="ProductName" className="form-label">
                  Product Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  maxLength={80}
                  type="text"
                  className="form-control"
                  id="ProductName"
                  placeholder="Enter Product Name"
                  aria-describedby="Product"
                  value={productObj.productName}
                  onChange={(e) => {
                    setErrorMessage(false);
                    let inputValue = e.target.value;

                    if (inputValue.length === 0 || (inputValue.length === 1 && inputValue === ' ')) {
                      inputValue = '';
                    }

                    const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');
                    const trimmedValue = cleanedValue.trimStart();
                    const updatedValue = trimmedValue
                      .split(' ')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');

                    setProductObj((prev) => ({
                      ...prev,
                      productName: updatedValue
                    }));
                  }}
                />
                {error && !productObj.productName && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
                {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
              </div>

              {/* HSN */}
              <div className="mb-3">
                <label htmlFor="HSN" className="form-label">
                  HSN
                </label>
                <input
                  maxLength={20}
                  type="text"
                  className="form-control"
                  id="HSN"
                  placeholder="Enter HSN Code"
                  value={productObj.hsn}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                    setProductObj((prev) => ({ ...prev, hsn: cleaned }));
                  }}
                />
              </div>

              {/* GST Percentage */}
              <div className="mb-3">
                <label htmlFor="GstPercentage" className="form-label">
                  GST %
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="GstPercentage"
                  placeholder="Enter GST %"
                  value={productObj.gstPercentage}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (value === '' || /^\d{0,3}(\.\d{0,2})?$/.test(value)) {
                      setProductObj((prev) => ({ ...prev, gstPercentage: value }));
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <button type="submit" className="btn  text-center text-white" style={{ background: '#ffaa33' }} onClick={() => AddProductBtnClick()}>
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
    </>
  );
};

export default AddUpdateProductModal;
