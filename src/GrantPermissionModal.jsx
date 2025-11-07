// import React, { useState, useEffect, useContext } from 'react';
// import { Form, Container, Modal, Button, Accordion } from 'react-bootstrap';
// import SuccessPopupModal from 'component/SuccessPopupModal';
// import 'react-calendar/dist/Calendar.css';
// import 'react-date-picker/dist/DatePicker.css';
// import { ConfigContext } from 'context/ConfigContext';
// import { AddUpdateDefaultPermissions, GetPermisionModuleList } from 'services/Permisson Module/RoleTypePermissionApi';
// const GrantPermissionModal = ({ show, onHide, setIsAddUpdateActionDone, modelRequestData, isValid }) => {
//   const [modelAction, setModelAction] = useState('');
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const { setLoader, user } = useContext(ConfigContext);
//   const [errorMessage, setErrorMessage] = useState(false)
//   const [roleList, setRoleList] = useState([]);
//   useEffect(() => {
//     if (show) {
//       GetRoleListData();
//     }
//   }, [show]);

//   const [activeRole, setActiveRole] = useState(null); // Track active role

//   const GetRoleListData = async () => {
//     setLoader(true);
//     try {
//       const response = await GetPermisionModuleList();

//       if (response?.data?.statusCode === 200) {
//         const list = response?.data?.responseData?.data?.roleTypePermissions || [];
//         setRoleList(list);
//       } else {
//         console.error(response?.data?.errorMessage);
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoader(false);
//     }
//   };



//   const AddUpdateStateData = async (apiParam) => {
//     setLoader(true);
//     try {
//       let url = '/AddUpdateDefaultPermissions'; // Default URL for Adding Data

//       const response = await AddUpdateDefaultPermissions(url, apiParam);
//       if (response) {
//         if (response?.data?.statusCode === 200) {
//           setLoader(false);
//           setShowSuccessModal(true);
//           setModelAction('Permissions have been set successfully.'
//           ); //Do not change this naming convention

//           setIsAddUpdateActionDone(true);
//         } else {
//           setLoader(false);
//           setErrorMessage(response?.response?.data?.errorMessage);
//         }
//       }
//     } catch (error) {
//       setLoader(false);
//       console.error(error);
//     }
//   };
//   const toggleDropdown = (roleId) => {
//     setActiveRole(activeRole === roleId ? null : roleId);
//   };

//   const handleCheckAllModules = (roleTypeID, event) => {
//     const checked = event.target.checked;
//     setRoleList((prevList) =>
//       prevList.map((role) =>
//         role.roleTypeID === roleTypeID
//           ? {
//             ...role,
//             modules: role.modules.map((module) => ({
//               ...module,
//               moduleActions: module.moduleActions.map((action) => ({
//                 ...action,
//                 setDefaultAction: checked,
//               })),
//             })),
//           }
//           : role
//       )
//     );
//   };

//   //  Handle Submit: Format API Payload
//   const handleSubmit = () => {
//     const roleTypeActionList = roleList
//       .map((role) => {
//         const selectedActions = role.modules
//           .flatMap((module) =>
//             module.moduleActions
//               .filter((action) => action.setDefaultAction === true)
//               .map((action) => ({ mActionId: action.mActionId }))
//           );

//         return selectedActions.length > 0
//           ? {
//             roleTypeID: role.roleTypeID,
//             mActionList: selectedActions,
//           }
//           : null;
//       })
//       .filter(Boolean); // Remove nulls

//     const finalPayload = {
//       userKeyID: user?.userKeyID, // assuming you're getting user from context
//       roleTypeActionList,
//     };

//     console.log("Final Payload:", finalPayload);
//     AddUpdateStateData(finalPayload);
//   };


//   const handleCheckboxChange = (roleTypeID, moduleID, actionID, event) => {
//     setRoleList((prevList) =>
//       prevList.map((role) =>
//         role.roleTypeID === roleTypeID
//           ? {
//             ...role,
//             modules: role.modules.map((module) =>
//               module.moduleId === moduleID
//                 ? {
//                   ...module,
//                   moduleActions: module.moduleActions.map((action) =>
//                     action.mActionId === actionID
//                       ? { ...action, setDefaultAction: event.target.checked }
//                       : action
//                   ),
//                 }
//                 : module
//             ),
//           }
//           : role
//       )
//     );
//   };


//   const closeAllModal = () => {
//     onHide();
//     setShowSuccessModal(false);
//   };


//   return (
//     <>
//       <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <h3 className="text-center">
//               {'Set Permission'}
//             </h3>
//           </Modal.Title>
//         </Modal.Header>
//         <Container fluid className="p-0">
//           <div className="modal-body" style={{ height: '70vh', overflow: 'auto' }}>
//             <Accordion flush className="accessModel">
//               {roleList.map((role) => {
//                 const allChecked = role.modules.every((m) =>
//                   m.moduleActions.every((a) => a.setDefaultAction === true)
//                 );
//                 const someChecked = role.modules.some((m) =>
//                   m.moduleActions.some((a) => a.setDefaultAction === true)
//                 );

//                 return (
//                   <Accordion.Item key={role.roleTypeID} eventKey={role.roleTypeID}>
//                     <Accordion.Header onClick={() => toggleDropdown(role.roleTypeID)}>
//                       {role.roleTypeName}
//                     </Accordion.Header>

//                     {activeRole === role.roleTypeID && (
//                       <Accordion.Body>
//                         <div className="form-check mb-3">
//                           <input
//                             type="checkbox"
//                             className="form-check-input"
//                             id={`checkAll_${role.roleTypeID}`}
//                             checked={allChecked}
//                             ref={(el) => {
//                               if (el) el.indeterminate = someChecked && !allChecked;
//                             }}
//                             onChange={(e) => handleCheckAllModules(role.roleTypeID, e)}
//                           />
//                           <label className="form-check-label" htmlFor={`checkAll_${role.roleTypeID}`}>
//                             Select/Deselect All Actions
//                           </label>
//                         </div>

//                         {role.modules.map((module) => (
//                           <div key={module.moduleId} className="mt-3">
//                             <h6>{module.moduleName}</h6>
//                             <div className="row">
//                               {module.moduleActions.map((action) => {
//                                 const checkboxId = `action_${action.mActionId}`;
//                                 return (
//                                   <div className="col-md-6" key={action.mActionId}>
//                                     <div className="form-check">
//                                       <input
//                                         type="checkbox"
//                                         className="form-check-input"
//                                         id={checkboxId}
//                                         checked={action.setDefaultAction === true}
//                                         onChange={(e) => {
//                                           handleCheckboxChange(role.roleTypeID, module.moduleId, action.mActionId, e);

//                                           // extra condition: if Insert/Update is checked, force "Can View"
//                                           if (
//                                             (action.mActionName === "Can Insert" || action.mActionName === "Can Update") &&
//                                             e.target.checked
//                                           ) {
//                                             handleCheckboxChange(role.roleTypeID, module.moduleId,
//                                               module.moduleActions.find((a) => a.mActionName === "Can View")?.mActionId,
//                                               { target: { checked: true } }
//                                             );
//                                           }
//                                         }}
//                                       />
//                                       <label className="form-check-label" htmlFor={checkboxId}>
//                                         {action.mActionName}
//                                       </label>
//                                     </div>
//                                   </div>
//                                 );
//                               })}
//                             </div>
//                           </div>
//                         ))}
//                       </Accordion.Body>
//                     )}

//                   </Accordion.Item>
//                 );
//               })}
//             </Accordion>
//             <span style={{ color: 'red' }}>{errorMessage}</span>
//           </div>
//         </Container>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={onHide}>
//             Close
//           </Button>
//           {modelRequestData.Action === null && <button type="submit" onClick={handleSubmit} style={{ background: '#ff7d34' }} className="btn text-white text-center">
//             Submit
//           </button>}

//         </Modal.Footer>
//       </Modal>
//       {showSuccessModal && (
//         <SuccessPopupModal
//           show={showSuccessModal}
//           onHide={() => closeAllModal()}
//           setShowSuccessModal={setShowSuccessModal}
//           modelAction={modelAction}
//         />
//       )}
//     </>
//   );
// };

// export default GrantPermissionModal;




import React, { useState, useEffect, useContext, useRef } from 'react';
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
  const [roleList, setRoleList] = useState([]);
  const initialRoles = [
    {
      roleTypeID: "MTS",
      roleTypeName: "MTS",
      modules: [
        {
          moduleId: "attendance",
          moduleName: "Attendance",
          moduleActions: [
            { mActionId: "fromDate", mActionName: "Set FromDate", type: "date", value: "" },
            { mActionId: "toDate", mActionName: "Set ToDate", type: "date", value: "" },
            { mActionId: "update", mActionName: "Can Update Attendance", type: "checkbox", setDefaultAction: false },
            { mActionId: "view", mActionName: "Can View Attendance", type: "checkbox", setDefaultAction: false },
          ],
        },
      ],
    },
    {
      roleTypeID: "Nursing",
      roleTypeName: "Nursing",
      modules: [
        {
          moduleId: "attendance",
          moduleName: "Attendance",
          moduleActions: [
            { mActionId: "fromDate", mActionName: "Set FromDate", type: "date", value: "" },
            { mActionId: "toDate", mActionName: "Set ToDate", type: "date", value: "" },
            { mActionId: "update", mActionName: "Can Update Attendance", type: "checkbox", setDefaultAction: false },
            { mActionId: "view", mActionName: "Can View Attendance", type: "checkbox", setDefaultAction: false },
          ],
        },
      ],
    },
    {
      roleTypeID: "Teaching",
      roleTypeName: "Teaching",
      modules: [
        {
          moduleId: "attendance",
          moduleName: "Attendance",
          moduleActions: [
            { mActionId: "fromDate", mActionName: "Set FromDate", type: "date", value: "" },
            { mActionId: "toDate", mActionName: "Set ToDate", type: "date", value: "" },
            { mActionId: "update", mActionName: "Can Update Attendance", type: "checkbox", setDefaultAction: false },
            { mActionId: "view", mActionName: "Can View Attendance", type: "checkbox", setDefaultAction: false },
          ],
        },
      ],
    },
  ];
  const [errorMessage, setErrorMessage] = useState(false)

  const [roles, setRoles] = useState(initialRoles);
  const [activeKey, setActiveKey] = useState(null);
  const checkAllRefs = useRef({});

  useEffect(() => {
    roles.forEach((role) => {
      const el = checkAllRefs.current[role.roleTypeID];
      if (!el) return;
      const allChecked = role.modules.every((m) =>
        m.moduleActions.every((a) => a.setDefaultAction === true)
      );
      const someChecked = role.modules.some((m) =>
        m.moduleActions.some((a) => a.setDefaultAction === true)
      );
      el.indeterminate = someChecked && !allChecked;
    });
  }, [roles]);

  function onAccordionSelect(key) {
    setActiveKey((prev) => (prev === key ? null : key));
  }

  function handleCheckAllModules(roleTypeID, e) {
    const checked = e.target.checked;
    setRoles((prev) =>
      prev.map((r) => {
        if (r.roleTypeID !== roleTypeID) return r;
        return {
          ...r,
          modules: r.modules.map((m) => ({
            ...m,
            moduleActions: m.moduleActions.map((a) =>
              a.type === "checkbox" ? { ...a, setDefaultAction: checked } : a
            ),
          })),
        };
      })
    );
  }

  function handleActionChange(roleTypeID, moduleId, mActionId, e) {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const type = e.target.type;

    setRoles((prev) =>
      prev.map((r) => {
        if (r.roleTypeID !== roleTypeID) return r;

        return {
          ...r,
          modules: r.modules.map((m) => {
            if (m.moduleId !== moduleId) return m;

            let updatedActions = m.moduleActions.map((a) => {
              if (a.mActionId === mActionId) {
                return a.type === "checkbox"
                  ? { ...a, setDefaultAction: value }
                  : { ...a, value };
              }
              return a;
            });

            // rule: if update is checked, view must also be true
            if (mActionId === "update" && value === true) {
              updatedActions = updatedActions.map((a) =>
                a.mActionId === "view" ? { ...a, setDefaultAction: true } : a
              );
            }

            // prevent unchecking view while update is still checked
            const updateChecked = updatedActions.find((x) => x.mActionId === "update")?.setDefaultAction;
            const viewChecked = updatedActions.find((x) => x.mActionId === "view")?.setDefaultAction;
            if (!viewChecked && updateChecked) {
              updatedActions = updatedActions.map((a) =>
                a.mActionId === "view" ? { ...a, setDefaultAction: true } : a
              );
            }

            return { ...m, moduleActions: updatedActions };
          }),
        };
      })
    );
  }


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
              {roles.map((role) => {
                const allChecked = role.modules.every((m) =>
                  m.moduleActions
                    .filter((a) => a.type === "checkbox")
                    .every((a) => a.setDefaultAction === true)
                );
                const someChecked = role.modules.some((m) =>
                  m.moduleActions
                    .filter((a) => a.type === "checkbox")
                    .some((a) => a.setDefaultAction === true)
                );

                return (
                  <Accordion.Item eventKey={role.roleTypeID} key={role.roleTypeID}>
                    <Accordion.Header>{role.roleTypeName}</Accordion.Header>

                    <Accordion.Body>
                      <div className="form-check mb-3">
                        <input
                          ref={(el) => (checkAllRefs.current[role.roleTypeID] = el)}
                          type="checkbox"
                          className="form-check-input"
                          id={`checkAll_${role.roleTypeID}`}
                          checked={allChecked}
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
                              const checkboxId = `action_${role.roleTypeID}_${module.moduleId}_${action.mActionId}`;
                              return (
                                <div className="col-md-6" key={action.mActionId}>
                                  <div className="form-check">
                                    {action.type === "date" ? (
                                      <>
                                        <label className="form-label" htmlFor={checkboxId}>
                                          {action.mActionName}
                                        </label>
                                        <Form.Control
                                          type="date"
                                          id={checkboxId}
                                          value={action.value}
                                          onChange={(e) =>
                                            handleActionChange(
                                              role.roleTypeID,
                                              module.moduleId,
                                              action.mActionId,
                                              e
                                            )
                                          }
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <input
                                          type="checkbox"
                                          className="form-check-input"
                                          id={checkboxId}
                                          checked={!!action.setDefaultAction}
                                          onChange={(e) =>
                                            handleActionChange(
                                              role.roleTypeID,
                                              module.moduleId,
                                              action.mActionId,
                                              e
                                            )
                                          }
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor={checkboxId}
                                        >
                                          {action.mActionName}
                                        </label>
                                      </>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </Accordion.Body>
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
          {modelRequestData.Action === null && <button type="submit" style={{ background: '#ff7d34' }} className="btn text-white text-center">
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
