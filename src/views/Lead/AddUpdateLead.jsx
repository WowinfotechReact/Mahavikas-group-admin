import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import { ConfigContext } from 'context/ConfigContext';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { LeadTypeNameList } from 'Middleware/Utils';
import { AddUpdateLeadApi, GetLeadModel, GetquotationFormatLookupList } from 'services/LeadAPI/LeadApi';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { GetCustomerLookupList } from 'services/CustomerStaff/CustomerStaffApi';
import { FaTrash } from 'react-icons/fa'; // Import FaTrash from react-icons
import AddUpdateCustomerModal from 'views/Customer/AddUpdateCustomerModal';
import { LocalHospital } from '@mui/icons-material';
import { GetQutationTypeLookupList } from 'services/LeadAPI/LeadApi';

const AddUpdateLeadModal = ({ show, handleClose, modelRequestData, setIsAddUpdateActionDone, isAddUpdateActionDone }) => {
  const [error, setErrors] = useState(null);
  const [contactsError, setContactsError] = useState(''); // for contacts validation messages
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [actionMassage, setActionMassage] = useState(null);
  const [customerOption, setCustomerOption] = useState([]);
  const [showSuccessModel, setShowSuccessModal] = useState('');
  const { user, setLoader, companyID } = useContext(ConfigContext);
  const [quotationTypeOptions, setQuotationTypeOptions] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [quotationFormatList, setQuotationFormatList] = useState([]);

  const [customerLookupList, setCustomerLookupList] = useState([]);
  const [leadObj, setLeadObj] = useState({
    contacts: [
      {
        contactName: '',
        designation: '',
        contactNumber: '',
        contactAlternateNumber: '',
        contactEmailID: ''
      }
    ],
    customerID: null,
    leadName: '',
    requirement: null,
    leadPriorityID: null,
    contactNumber: '',
    alternateNumber: '',
    emailID: '',
    leadLog: null,
    leadKeyID: null,
    userKeyID: null,
    quotationTypeID: null,
    address: '',
    quotationFormatID: null
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (modelRequestData?.leadKeyID !== null && modelRequestData.Action === 'Update') {
      GetLeadModalData(modelRequestData?.leadKeyID);
    }
  }, [modelRequestData.Action]);

  const AddLeadBtnClick = () => {
    let isValid = false;

    // Validate main required fields
    if (
      !leadObj.customerID ||
      !leadObj.leadName?.trim() ||
      !leadObj.requirement?.trim() ||
      !leadObj.contactNumber?.trim() ||
      !leadObj.emailID?.trim() ||
      !leadObj.leadLog?.trim() ||
      !leadObj.leadPriorityID
    ) {
      setErrors(true);
      isValid = true;
    }

    // ✅ Check main email format
    if (leadObj.emailID && !emailRegex.test(leadObj.emailID.trim())) {
      setErrors(true);
      setErrorMessage('Please enter a valid Email ID.');
      isValid = true;
    }

    // Validate contacts
    let contactHasError = false;
    for (const contact of leadObj.contacts) {
      if (
        !contact.contactName?.trim() ||
        !contact.designation?.trim() ||
        !contact.contactNumber?.trim() ||
        !contact.contactEmailID?.trim() ||
        !emailRegex.test(contact.contactEmailID.trim())
      ) {
        contactHasError = true;
        break;
      }
    }

    if (contactHasError) {
      setContactsError('Please fill all required fields in contacts with valid emails.');
      setErrors(true);
      isValid = true;
    }

    if (isValid) return; // 🚫 Stop if any error

    // If valid, build object & submit
    const apiParamObj = {
      customerID: leadObj.customerID,
      leadName: leadObj.leadName,
      requirement: leadObj.requirement,
      leadLog: leadObj.leadLog,
      userKeyID: user.userKeyID,
      leadKeyID: leadObj.leadKeyID,
      leadPriorityID: leadObj.leadPriorityID,
      emailID: leadObj.emailID,
      contactNumber: leadObj.contactNumber,
      alternateNumber: leadObj.alternateNumber,
      contactEmailID: leadObj.contactEmailID,
      quotationType: leadObj.quotationType,
      contacts: leadObj.contacts,
      address: leadObj.address,
      quotationFormatID: leadObj.quotationFormatID
    };

    console.log(JSON.stringify(apiParamObj, null, 2));
    AddUpdateLeadData(apiParamObj);
  };

  useEffect(() => {
    if (show) {
      GetCustomerLookUpListData();
      GetQuotationTypeLookupListData(); // ✅ call this too
      GetQuotationFormatLookupListData();
    }
  }, [show]);

  const GetCustomerLookUpListData = async () => {
    setLoader(true);
    try {
      let response = await GetCustomerLookupList();
      if (response?.data?.statusCode === 200) {
        setLoader(false);

        const customerOptions = response?.data?.responseData?.data || [];
        const FormattedRollOptions = customerOptions.map((val) => ({
          value: val.customerID,
          label: val.customerFirmName
        }));
        setCustomerLookupList(FormattedRollOptions);
      } else {
        setLoader(false);
        console.error('Bad request');
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  const GetQuotationFormatLookupListData = async () => {
    try {
      const response = await GetquotationFormatLookupList();
      if (response?.data?.statusCode === 200) {
        const options = response.data.responseData?.data.map((item) => ({
          value: item.quotationFormatID,
          label: item.quotationFormatName
        }));
        setQuotationFormatList(options);
      } else {
        console.error('Failed to fetch Quotation Format List');
      }
    } catch (err) {
      console.error('Error fetching Quotation Format List:', err);
    }
  };

  const GetQuotationTypeLookupListData = async () => {
    try {
      const response = await GetQutationTypeLookupList();
      if (response?.data?.statusCode === 200) {
        const apiData = response.data.responseData?.data || [];
        const formattedOptions = apiData.map((item) => ({
          value: item.quotationTypeName, // ✅ always string
          label: item.quotationTypeName
        }));
        setQuotationTypeOptions(formattedOptions);
      } else {
        console.error('Failed to fetch Quotation Type Lookup List');
      }
    } catch (err) {
      console.error('Error fetching Quotation Type Lookup List:', err);
    }
  };

  const AddUpdateLeadData = async (apiParams) => {
    setLoader(true);
    try {
      const response = await AddUpdateLeadApi(apiParams);
      if (response?.data.statusCode === 200) {
        setLoader(false);
        setIsAddUpdateActionDone(true);

        // ✅ mark form submitted — hides modal content but keeps modal open
        setIsFormSubmitted(true);

        // ✅ show success modal on top
        setActionMassage(modelRequestData?.Action === null ? 'Lead Added Successfully' : 'Lead Updated Successfully');
        setShowSuccessModal(true);
      } else {
        setLoader(false);
        setErrorMessage(response.response.data.errorMessage);
      }
    } catch (error) {
      setLoader(false);
      setErrorMessage(error.response?.data?.errorMessage || 'An error occurred');
    }
  };

  const GetLeadModalData = async (id) => {
    // debugger
    setLoader(true);
    try {
      const response = await GetLeadModel(id);
      // debugger
      if (response?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = response.data.responseData?.data[0];
        console.log(ModelData, 'ldksahdpiuoashnasd');

        setLeadObj({
          ...leadObj,

          customerID: ModelData.customerID,
          leadName: ModelData.leadName,
          requirement: ModelData.requirement,
          leadLog: ModelData.leadLog,
          userKeyID: user.userKeyID,
          leadKeyID: modelRequestData.leadKeyID,
          leadPriorityID: ModelData.leadPriorityID,
          emailID: ModelData.emailID,
          contactNumber: ModelData.contactNumber,
          alternateNumber: ModelData.alternateNumber,
          contactEmailID: ModelData.contactEmailID,
          quotationType: ModelData.quotationType,
          contacts: ModelData.contacts,
          address: ModelData.address,
          quotationFormatID: ModelData.quotationFormatID
        });
      } else {
        setLoader(false);
        console.error('Error fetching data: ', response?.data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error', error);
    }
  };

  const handleLeadStatusChange = (selectedOption) => {
    setLeadObj((prev) => ({
      ...prev,
      leadPriorityID: selectedOption.value
    }));
  };

  const setInitialData = () => {
    setErrors(false);
    setContactsError('');
    setLeadObj({
      customerID: '',
      leadName: '',
      quantity: '',
      leadLog: '',
      leadPriorityID: '',
      contactNumber: '',
      contactAlternateNumber: '',
      contactEmailID: '',
      quotationType: ''
    });
  };

  const closeAllModal = () => {
    setInitialData();
    setIsFormSubmitted(false); // ✅ reset flag

    setShowSuccessModal(false);

    handleClose();
  };

  useEffect(() => {
    GetCustomerLookupListData();
  }, [isAddUpdateActionDone]);

  const GetCustomerLookupListData = async () => {
    try {
      const response = await GetCustomerLookupList(companyID);
      if (response?.data?.statusCode === 200) {
        const customerLookupList = response?.data?.responseData?.data;
        const formattedCustomerList = customerLookupList.map((customerItem) => ({
          value: customerItem.customerID,
          label: customerItem.name,
          customerKeyID: customerItem.customerKeyID
        }));
        setCustomerOption(formattedCustomerList);
      } else {
        console.error('Failed to fetch Customer lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching Customer lookup list:', error);
    }
  };

  const addContactCard = () => {
    const contacts = leadObj?.contacts ?? [];

    // If there are no contacts at all, allow adding the first one
    if (contacts.length === 0) {
      const newContact = {
        contactName: '',
        designation: '',
        contactNumber: '',
        contactAlternateNumber: '',
        contactEmailID: ''
      };
      setLeadObj((prev) => ({
        ...prev,
        contacts: [newContact]
      }));
      setErrors(false);
      setContactsError('');
      return;
    }

    // Check the last contact card is fully filled
    const lastContact = contacts[contacts.length - 1];
    const isLastContactValid =
      lastContact.contactName?.trim() &&
      lastContact.designation?.trim() &&
      lastContact.contactNumber?.trim() &&
      lastContact.contactEmailID?.trim();

    if (!isLastContactValid) {
      setErrors(true);
      setContactsError('Please fill current contact before adding a new one.');
      return; // ⛔ Do not add new card
    }

    // If valid, add a new blank contact
    const newContact = {
      contactName: '',
      designation: '',
      contactNumber: '',
      contactAlternateNumber: '',
      contactEmailID: ''
    };

    setLeadObj((prev) => ({
      ...prev,
      contacts: [...prev.contacts, newContact]
    }));
    setErrors(false);
    setContactsError('');
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...(leadObj.contacts ?? [])];
    updatedContacts[index][field] = value;

    setLeadObj((prev) => ({
      ...prev,
      contacts: updatedContacts
    }));

    if (contactsError && index === updatedContacts.length - 1) {
      const c = updatedContacts[index];
      if (c.contactName?.trim() && c.designation?.trim() && c.contactNumber?.trim() && c.contactEmailID?.trim()) {
        setError(false);
        setContactsError('');
      }
    }
  };

  const deleteContactCard = (index) => {
    const updatedContacts = [...leadObj.contacts];
    updatedContacts.splice(index, 1);
    setLeadObj((prev) => ({
      ...prev,
      contacts: updatedContacts
    }));
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={() => {
        handleClose();
        setInitialData();
      }}
      style={{ zIndex: 1300 }}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton hidden={isFormSubmitted}>
        <Modal.Title>{modelRequestData?.Action != null ? 'Update Lead' : 'Add Lead'}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }} hidden={isFormSubmitted}>
        <div className="row">
          <div className="col-12 col-md-6 mb-2">
            <label htmlFor="customerID" className="form-label">
              Select Customer
              <span style={{ color: 'red' }}>*</span>
            </label>
            <Select
              menuPosition="fixed"
              menuPlacement="auto"
              options={customerLookupList}
              value={customerLookupList.find((option) => option.value === leadObj.customerID)}
              onChange={(selectedOption) =>
                setLeadObj((prev) => ({
                  ...prev,
                  customerID: selectedOption ? selectedOption.value : null
                }))
              }
              placeholder="Select Customer"
            />
            {error && (leadObj.customerID === null || leadObj.customerID === undefined || leadObj.customerID === '') && (
              <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
            )}
          </div>
          <div className="col-12 col-md-6 mb-2">
            <label htmlFor="leadName" className="form-label">
              Lead Name
              <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Lead Name"
              value={leadObj.leadName}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue === '' || inputValue[0] !== ' ') {
                  setLeadObj({ ...leadObj, leadName: inputValue });
                }
              }}
            />
            {error && leadObj.leadName === '' && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-md-6 mb-2">
            <label htmlFor="requirement" className="form-label">
              Requirement /  Subject
              <span style={{ color: 'red' }}>*</span>
            </label>
            <textarea
              className="form-control"
              value={leadObj.requirement}
              onChange={(e) => setLeadObj({ ...leadObj, requirement: e.target.value })}
              placeholder="Lead Requirement"
            />
            {error && (leadObj.requirement === null || leadObj.requirement === '') && (
              <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
            )}
          </div>

          <div className="col-12 col-md-6 mb-2">
            <label htmlFor="contactAlternateNumber" className="form-label">
              Lead Priority
              <span style={{ color: 'red' }}>*</span>
            </label>
            <Select
              options={LeadTypeNameList}
              value={LeadTypeNameList.find((item) => item.value === leadObj.leadPriorityID)}
              onChange={handleLeadStatusChange}
              className="placeHolderStyle"
              placeholder="Select Lead Priority"
              menuPosition="fixed"
              menuPlacement="auto"
            />
            {error && (leadObj.leadPriorityID === null || leadObj.leadPriorityID === '' || leadObj.leadPriorityID === undefined) && (
              <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
            )}

            {/* {error && (leadObj.contactAlternateNumber === null || leadObj.contactAlternateNumber === '') && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>} */}
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-md-6 mb-2">
            <label htmlFor="address" className="form-label">
              Address <span style={{ color: 'red' }}>*</span>
            </label>
            <textarea
              className="form-control"
              value={leadObj.address}
              onChange={(e) => setLeadObj({ ...leadObj, address: e.target.value })}
              placeholder="Enter address"
            />
            {error && !leadObj.address?.trim() && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
          </div>

          <div className="col-12 col-md-6 mb-2">
            <label htmlFor="quotationFormatID" className="form-label">
              Quotation Format <span style={{ color: 'red' }}>*</span>
            </label>
            <Select
              placeholder="Select Quotation Format"
              value={quotationFormatList.find((item) => item.value === leadObj.quotationFormatID) || null}
              onChange={(selectedOption) =>
                setLeadObj((prev) => ({
                  ...prev,
                  quotationFormatID: selectedOption.value
                }))
              }
              options={quotationFormatList}
              menuPosition="fixed"
              menuPlacement="auto"
            />
            {error && !leadObj.quotationFormatID && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-md-6 mb-2">
            <label htmlFor="contactNumber" className="form-label">
              Contact Number
              <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              className="form-control"
              maxLength={10}
              placeholder="Contact Number"
              value={leadObj.contactNumber}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                setLeadObj({ ...leadObj, contactNumber: onlyNums });
              }}
            />
            {error && leadObj.contactNumber === '' && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
          </div>
          <div className="col-12 col-md-6 mb-2">
            <label htmlFor="contactAlternateNumber" className="form-label">
              Alternate Number
            </label>
            <input
              type="text"
              maxLength={10}
              className="form-control"
              placeholder="Alternate Number"
              value={leadObj.alternateNumber}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                setLeadObj({ ...leadObj, alternateNumber: onlyNums });
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6 mb-2">
            <label htmlFor="contactEmailID" className="form-label">
              Email ID
              <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="contactEmailID"
              className="form-control"
              placeholder="Email ID"
              value={leadObj.emailID}
              onChange={(e) => setLeadObj({ ...leadObj, emailID: e.target.value })}
            />

            {error && leadObj.emailID === '' && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
            {error && leadObj.emailID && !emailRegex.test(leadObj.emailID.trim()) && (
              <span style={{ color: 'red' }}>Please enter a valid Email ID.</span>
            )}
          </div>

        </div>
        <div className="row">
          <div className="col-12 mb-2">
            <label htmlFor="leadLog" className="form-label">
              Remark
              <span style={{ color: 'red' }}>*</span>
            </label>
            <textarea
              className="form-control"
              value={leadObj.leadLog}
              onChange={(e) => setLeadObj({ ...leadObj, leadLog: e.target.value })}
              placeholder="Remark"
            />
            {error && (leadObj.leadLog === null || leadObj.leadLog === '' || leadObj.leadLog === undefined) && (
              <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
            )}{' '}
          </div>
        </div>
        <div className="card mt-3 p-3 position-relative">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <strong>Contact Information</strong>
            <div className="position-absolute end-0 me-2">
              <button onClick={addContactCard} style={{ background: '#ff7d34' }} className="btn text-white btn-sm">
                <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                <span className="ms-1">Add</span>
              </button>
            </div>
          </div>

          {contactsError && (
            <div className="mb-3 text-danger fst-italic" style={{ fontSize: '0.875rem' }}>
              {contactsError}
            </div>
          )}

          {leadObj?.contacts?.map((contact, index) => (
            <div key={index} className="card mb-3 p-3">
              <h5 className="card-header d-flex justify-content-between align-items-center bg-light mb-3 border-rounded">
                {`Contact ${index + 1}`}
                {leadObj.contacts.length > 1 && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteContactCard(index)}
                    aria-label={`Delete Contact ${index + 1}`}
                  >
                    <FaTrash className="text-12" />
                  </button>
                )}
              </h5>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label>
                    Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Name"
                    value={contact.contactName}
                    onChange={(e) => handleContactChange(index, 'contactName', e.target.value)}
                  />
                  {error && !contact.contactName.trim() && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
                </div>

                <div className="col-md-6 mb-2">
                  <label>
                    Designation <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Select Designation"
                    className="form-control"
                    value={contact.designation}
                    onChange={(e) => handleContactChange(index, 'designation', e.target.value)}
                  />
                  {error && !contact.designation.trim() && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
                </div>

                <div className="col-md-6 mb-2">
                  <label>
                    Contact Number <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="Enter Contact No."
                    className="form-control"
                    value={contact.contactNumber}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                      handleContactChange(index, 'contactNumber', onlyNums);
                    }}
                  />
                  {error && !contact.contactNumber.trim() && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
                </div>

                <div className="col-md-6 mb-2">
                  <label>Alternate Contact Number</label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="Enter Alternative Contact No."
                    className="form-control"
                    value={contact.contactAlternateNumber}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                      handleContactChange(index, 'contactAlternateNumber', onlyNums);
                    }}
                  />
                </div>

                <div className="col-md-6 mb-2">
                  <label>
                    Email <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter Email"
                    value={contact.contactEmailID}
                    onChange={(e) => handleContactChange(index, 'contactEmailID', e.target.value)}
                  />
                  {error && !contact.contactEmailID.trim() && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
                  {error && contact.contactEmailID && !emailRegex.test(contact.contactEmailID.trim()) && (
                    <span style={{ color: 'red' }}>Please enter a valid Email ID.</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer hidden={isFormSubmitted}>
        <Button
          variant="secondary"
          onClick={() => {
            handleClose();
            setInitialData();
            setIsFormSubmitted(false);
          }}
        >
          Close
        </Button>
        <button style={{ background: '#ff7d34' }} className='btn text-white' onClick={AddLeadBtnClick}>
          Submit{' '}
        </button>
      </Modal.Footer>

      <SuccessPopupModal
        show={showSuccessModel}
        onHide={() => {
          setShowSuccessModal(false);
          handleClose(); // ✅ This closes parent modal only AFTER success modal is done
          setInitialData();
        }}
        setShowSuccessModal={setShowSuccessModal}
        modelAction={actionMassage}
      />

      {showCustomerModal && (
        <AddUpdateCustomerModal
          modelRequestData={modelRequestData}
          onHide={() => setShowCustomerModal(false)}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
          show={showCustomerModal}
        />
      )}
    </Modal>
  );
};

export default AddUpdateLeadModal;
