
import React, { useState, useEffect, useContext } from 'react';
import { Modal } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import Select from 'react-select';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { GetCustomerLookupList } from 'services/CustomerStaff/CustomerStaffApi';
import { AssignServiceCallToSiteEng } from 'services/Call Registration/CallRegistrationApi';
import { GetEmployeeLookupList } from 'services/Employee Staff/EmployeeApi';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import Lottie from "lottie-react";
import transferComplaint from '../../assets/images/transferComplaint.json'
import { AddUpdateFollowUp, ChangeLeadFollowUpStatus, GetFollowUpTypeLookupList } from 'services/LeadAPI/FollowUpAPI';
const FollowUpStageModal = ({ show, onHide, setIsAddUpdateActionDone, modalRequestData }) => {
  const [modelAction, setModelAction] = useState('');
  const [error, setErrors] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [employeeOption, setEmployeeOption] = useState([]);
  const { setLoader, user } = useContext(ConfigContext);
  const [customerLookupList, setCustomerLookupList] = useState([]);
  const [followUpTypeList, setFollowUpTypeList] = useState([]);

  const [followUpStageObj, setFollowUpStageObj] = useState({
    followUpDate: null,
    followUpTime: null,
    userKeyID: null,
    serviceCallID: null,
    followUpTypeID: null,
    remark: null,

  });









  useEffect(() => {
    GetCustomerLookUpListData()
  }, [])

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

  useEffect(() => {
    GetEmployeeLookupListData(1)
  }, [])

  useEffect(() => {
    loadLookupData();
  }, []);
  const loadLookupData = async () => {
    setLoader(true);
    try {
      const res = await GetFollowUpTypeLookupList();
      if (res?.data?.statusCode === 200) {
        const list = res.data.responseData.data.map((item) => ({
          value: item.followUpTypeID,
          label: item.followUpType,
        }));
        setFollowUpTypeList(list);
      }
    } catch (error) {
      console.error('FollowUpType lookup load error:', error);
    } finally {
      setLoader(false);
    }
  };



  const AddStateBtnClick = () => {

    let isValid = false;

    // Validate followUpTypeID first
    if (
      followUpStageObj.followUpTypeID === null ||
      followUpStageObj.followUpTypeID === undefined ||
      followUpStageObj.followUpTypeID === '' ||
      followUpStageObj.remark === null ||
      followUpStageObj.remark === undefined ||
      followUpStageObj.remark === ''
    ) {
      isValid = true;
    }
    else {
      setErrors(false);
      isValid = false;
    }
    // Only validate date & time if type is 2 (Call Rescheduled)
    if (followUpStageObj.followUpTypeID === 2) {
      if (
        followUpStageObj.followUpDate === null ||
        followUpStageObj.followUpDate === undefined ||
        followUpStageObj.followUpDate === '' ||
        followUpStageObj.remark === null ||
        followUpStageObj.remark === undefined ||
        followUpStageObj.remark === '' ||
        followUpStageObj.followUpTime === null ||
        followUpStageObj.followUpTime === undefined ||
        followUpStageObj.followUpTime === ''
      ) {
        isValid = true;
      }
      else {

        isValid = false;
      }
    }

    setErrors(isValid); // update error state

    const apiParam = {
      userKeyID: user.userKeyID,
      followUpDate: followUpStageObj?.followUpDate,
      followUpTime: followUpStageObj?.followUpTime,
      remark: followUpStageObj?.remark,
      followUpKeyID: modalRequestData.followUpKeyID,
      leadKeyID: modalRequestData.leadKeyID,
      followUpTypeID: followUpStageObj?.followUpTypeID,
    };

    if (!isValid) {
      AssignServiceCallToSiteEngData(apiParam);
    }
  };


  const AssignServiceCallToSiteEngData = async (apiParam) => {
    setLoader(true)
    try {
      let url = '/AddUpdateFollowUp'; // Default URL for Adding Data

      const response = await AddUpdateFollowUp(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false)
          setShowSuccessModal(true);
          setModelAction(
            'Follow up added successfully!'
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


  const closeAllModal = () => {
    onHide();
    setShowSuccessModal(false);
  };





  useEffect(() => {
    GetEmployeeLookupListData(1)
  }, [])
  const GetEmployeeLookupListData = async () => {
    try {
      const payload = {
        employeeTypeID: null,
        roleTypeID: 6
      };

      const response = await GetEmployeeLookupList(payload);

      if (response?.data?.statusCode === 200) {
        const employeeList = response?.data?.responseData?.data || [];

        const filteredEmployees = employeeList.map((emp) => ({
          value: emp.followUpTypeID,
          label: emp.employeeName
        }));

        setEmployeeOption(filteredEmployees); // Assuming this is a useState setter
      } else {
        console.error('Bad request');
      }
    } catch (error) {
      console.error('Error fetching employee list:', error);
    }
  };



  const handleAssignEmployeeChange = (selectedOption) => {
    setFollowUpStageObj((prev) => ({
      ...prev,
      followUpTypeID: selectedOption.value
    }));
  };
  const handleDateChange = (date) => {
    setFollowUpStageObj((prevState) => ({
      ...prevState,
      followUpDate: date // Update state with selected date
    }));
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        style={{ zIndex: 1300 }}
        backdrop="static"
        keyboard={false}
        centered // Adjust the z-index as needed
      >
        <Modal.Header closeButton>
          <Modal.Title>Follow Up Stage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container ">
            {/* Animated Icon */}
            <div className="d-flex justify-content-center">

              <Lottie animationData={transferComplaint} style={{ width: 100, height: 60 }} />;
            </div>


            <label className="form-label">
              Follow Status
              <span style={{ color: 'red' }}>*</span>
            </label>
            <Select
              options={followUpTypeList}
              value={followUpTypeList.filter((item) => item.value === followUpStageObj.followUpTypeID)}
              onChange={handleAssignEmployeeChange}
              menuPosition="fixed"
            />
            {error &&
              (followUpStageObj.followUpTypeID === null || followUpStageObj.followUpTypeID === undefined || followUpStageObj.followUpTypeID === '') ? (
              <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
            ) : (
              ''
            )}


            {[2].includes(followUpStageObj.followUpTypeID) && (
              <>
                <div className="col-12 mb-2">
                  <label className="form-label">
                    Follow Up Date <span style={{ color: 'red' }}>*</span>
                  </label>
                  <DatePicker
                    value={followUpStageObj?.followUpDate} // Use "selected" instead of "value"
                    onChange={handleDateChange}
                    label="From Date"
                    clearIcon={null}
                    popperPlacement="bottom-start"
                  />
                </div>
                {error &&
                  (followUpStageObj?.followUpDate === null || followUpStageObj?.followUpDate === undefined || followUpStageObj?.followUpDate === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}

                <div className="col-12 mb-2">
                  <label className="form-label">
                    Follow Up Time <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    value={followUpStageObj.followUpTime}
                    onChange={(e) => {
                      setErrors(false);
                      setFollowUpStageObj({ ...followUpStageObj, followUpTime: e.target.value }); // ✅ FIXED
                    }}
                  />
                  {error &&
                    (followUpStageObj?.followUpTime === null ||
                      followUpStageObj?.followUpTime === undefined ||
                      followUpStageObj?.followUpTime === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}                               </div>


              </>
            )}
            <div className="col-12 mb-2">
              <label className="form-label">
                Remark <span style={{ color: 'red' }}>*</span>
              </label>
              <textarea
                rows={3}
                className="form-control"
                placeholder="Enter Remark"
                value={followUpStageObj.remark}

                onChange={(e) => {

                  let inputValue = e.target.value;



                  setFollowUpStageObj(prev => ({
                    ...prev,
                    remark: inputValue
                  }));
                }}
              ></textarea>
              {/* {error.remark && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>} */}
            </div>

          </div>
        </Modal.Body>
        <Modal.Footer>


          <button className='btn btn-sm text-white'
            onClick={AddStateBtnClick}
            style={{ background: '#ffaa33' }}
          >
            Assign
          </button>
        </Modal.Footer>
      </Modal>
      <SuccessPopupModal
        show={showSuccessModal}
        onHide={closeAllModal}
        modelAction={modelAction}

      />
    </>
  );
};

export default FollowUpStageModal;
