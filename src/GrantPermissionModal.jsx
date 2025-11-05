import React, { useState, useEffect, useContext } from 'react';
import { Form, Container, Modal, Button, Accordion } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { ConfigContext } from 'context/ConfigContext';
import { AddUpdateDefaultPermissions, GetPermisionModuleList } from 'services/Permisson Module/RoleTypePermissionApi';
const GrantPermissionModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData, isValid }) => {
  const [modelAction, setModelAction] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { setLoader, user } = useContext(ConfigContext);
  const [errorMessage, setErrorMessage] = useState(false)
  const [roleList, setRoleList] = useState([]);
  useEffect(() => {
    if (show) {
      GetRoleListData();
    }
  }, [show]);

  const [activeRole, setActiveRole] = useState(null); // Track active role

  const GetRoleListData = async () => {
    setLoader(true);
    try {
      const response = await GetPermisionModuleList();

      if (response?.data?.statusCode === 200) {
        const list = response?.data?.responseData?.data?.roleTypePermissions || [];
        setRoleList(list);
      } else {
        console.error(response?.data?.errorMessage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };



  const AddUpdateStateData = async (apiParam) => {
    setLoader(true);
    try {
      let url = '/AddUpdateDefaultPermissions'; // Default URL for Adding Data

      const response = await AddUpdateDefaultPermissions(url, apiParam);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setShowSuccessModal(true);
          setModelAction('Permissions have been set successfully.'
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
  const toggleDropdown = (roleId) => {
    setActiveRole(activeRole === roleId ? null : roleId);
  };

  const handleCheckAllModules = (roleTypeID, event) => {
    const checked = event.target.checked;
    setRoleList((prevList) =>
      prevList.map((role) =>
        role.roleTypeID === roleTypeID
          ? {
            ...role,
            modules: role.modules.map((module) => ({
              ...module,
              moduleActions: module.moduleActions.map((action) => ({
                ...action,
                setDefaultAction: checked,
              })),
            })),
          }
          : role
      )
    );
  };

  //  Handle Submit: Format API Payload
  const handleSubmit = () => {
    const roleTypeActionList = roleList
      .map((role) => {
        const selectedActions = role.modules
          .flatMap((module) =>
            module.moduleActions
              .filter((action) => action.setDefaultAction === true)
              .map((action) => ({ mActionId: action.mActionId }))
          );

        return selectedActions.length > 0
          ? {
            roleTypeID: role.roleTypeID,
            mActionList: selectedActions,
          }
          : null;
      })
      .filter(Boolean); // Remove nulls

    const finalPayload = {
      userKeyID: user?.userKeyID, // assuming you're getting user from context
      roleTypeActionList,
    };

    console.log("Final Payload:", finalPayload);
    AddUpdateStateData(finalPayload);
  };


  const handleCheckboxChange = (roleTypeID, moduleID, actionID, event) => {
    setRoleList((prevList) =>
      prevList.map((role) =>
        role.roleTypeID === roleTypeID
          ? {
            ...role,
            modules: role.modules.map((module) =>
              module.moduleId === moduleID
                ? {
                  ...module,
                  moduleActions: module.moduleActions.map((action) =>
                    action.mActionId === actionID
                      ? { ...action, setDefaultAction: event.target.checked }
                      : action
                  ),
                }
                : module
            ),
          }
          : role
      )
    );
  };


  const closeAllModal = () => {
    onHide();
    setShowSuccessModal(false);
  };


  return (
    <>
      <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="text-center">
              {'Set Permission'}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Container fluid className="p-0">
          <div className="modal-body" style={{ height: '70vh', overflow: 'auto' }}>
            <Accordion flush className="accessModel">
              {roleList.map((role) => {
                const allChecked = role.modules.every((m) =>
                  m.moduleActions.every((a) => a.setDefaultAction === true)
                );
                const someChecked = role.modules.some((m) =>
                  m.moduleActions.some((a) => a.setDefaultAction === true)
                );

                return (
                  <Accordion.Item key={role.roleTypeID} eventKey={role.roleTypeID}>
                    <Accordion.Header onClick={() => toggleDropdown(role.roleTypeID)}>
                      {role.roleTypeName}
                    </Accordion.Header>

                    {activeRole === role.roleTypeID && (
                      <Accordion.Body>
                        <div className="form-check mb-3">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`checkAll_${role.roleTypeID}`}
                            checked={allChecked}
                            ref={(el) => {
                              if (el) el.indeterminate = someChecked && !allChecked;
                            }}
                            onChange={(e) => handleCheckAllModules(role.roleTypeID, e)}
                          />
                          <label className="form-check-label" htmlFor={`checkAll_${role.roleTypeID}`}>
                            Select/Deselect All Actions
                          </label>
                        </div>

                        {role.modules.map((module) => (
                          <div key={module.moduleId} className="mt-3">
                            <h6>{module.moduleName}</h6>
                            <div className="row">
                              {module.moduleActions.map((action) => {
                                const checkboxId = `action_${action.mActionId}`;
                                return (
                                  <div className="col-md-6" key={action.mActionId}>
                                    <div className="form-check">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={checkboxId}
                                        checked={action.setDefaultAction === true}
                                        onChange={(e) => {
                                          handleCheckboxChange(role.roleTypeID, module.moduleId, action.mActionId, e);

                                          // extra condition: if Insert/Update is checked, force "Can View"
                                          if (
                                            (action.mActionName === "Can Insert" || action.mActionName === "Can Update") &&
                                            e.target.checked
                                          ) {
                                            handleCheckboxChange(role.roleTypeID, module.moduleId,
                                              module.moduleActions.find((a) => a.mActionName === "Can View")?.mActionId,
                                              { target: { checked: true } }
                                            );
                                          }
                                        }}
                                      />
                                      <label className="form-check-label" htmlFor={checkboxId}>
                                        {action.mActionName}
                                      </label>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </Accordion.Body>
                    )}

                  </Accordion.Item>
                );
              })}
            </Accordion>
            <span style={{ color: 'red' }}>{errorMessage}</span>
          </div>
        </Container>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          {modelRequestData.Action === null && <button type="submit" onClick={handleSubmit} style={{ background: '#9aa357' }} className="btn text-white text-center">
            Submit
          </button>}

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

export default GrantPermissionModal;
