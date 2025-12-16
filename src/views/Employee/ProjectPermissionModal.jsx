import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import SuccessPopupModal from 'component/SuccessPopupModal';
import Select from 'react-select';
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { GetMappedProjectLookupList } from 'services/Project/ProjectApi';
import { ConfigContext } from 'context/ConfigContext';
import { UpdateUserProjectPermission } from 'services/Employee Staff/EmployeeApi';
import { Tooltip } from '@mui/material';

const ProjectPermissionModal = ({ show, onHide, modelRequestData, }) => {
      const { setLoader, user, companyID, permissions } = useContext(ConfigContext);
      const [projectList, setProjectList] = useState([])
      const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false)

      useEffect(() => {
            if (show) {
                  GetMappedProjectLookupListData(modelRequestData.userDetailsKeyID, companyID);
            }
      }, [show]);
      useEffect(() => {
            if (isAddUpdateActionDone) {
                  GetMappedProjectLookupListData(modelRequestData.userDetailsKeyID, companyID);
            }
            setIsAddUpdateActionDone(false)
      }, [isAddUpdateActionDone]);

      const UpdateUserProjectPermissionData = async (apiParam) => {
            setLoader(true);
            try {
                  const url = "/UpdateUserProjectPermission";

                  const response = await UpdateUserProjectPermission(url, apiParam);

                  if (response?.data?.statusCode === 200) {
                        // setShowSuccessModal(true);
                        // setModelAction(
                        //       modelRequestData.Action === null
                        //             ? "Project Added Successfully!"
                        //             : "Project Updated Successfully!"
                        // );

                        setIsAddUpdateActionDone(true);
                  } else {
                        setErrorMessage(response?.response?.data?.errorMessage);
                  }

                  return response; // ✅ IMPORTANT
            } catch (error) {
                  console.error(error);
                  throw error; // ✅ rethrow so caller can catch
            } finally {
                  setLoader(false);
            }
      };

      const GetMappedProjectLookupListData = async (UserDetailsKeyID, companyID) => {
            try {
                  let response = await GetMappedProjectLookupList(UserDetailsKeyID, companyID); // Call to get employee list based on roleTypeID
                  if (response?.data?.statusCode === 200) {
                        const project = response?.data?.responseData?.data || [];

                        const filteredEmployees = project.map((emp) => ({
                              value: emp.projectID,
                              label: emp.projectName,
                              userDetailsKeyID: emp.userDetailsKeyID,
                              canUpdateAttendance: emp.canUpdateAttendance,
                        }));
                        setProjectList(filteredEmployees); // Make sure you have a state setter function for IVR list
                  } else {
                        console.error('Bad request');
                  }
            } catch (error) {
                  console.error('Error fetching employee list:', error);
            }
      };
      const [assigned, setAssigned] = useState({});
      const toggleAssign = async (projectID) => {
            const currentProject = projectList.find(
                  (p) => p.value === projectID
            );

            if (!currentProject) return;

            const payload = {
                  userDetailsKeyID: modelRequestData.userDetailsKeyID,
                  projectID: projectID,
            };

            try {
                  const response = await UpdateUserProjectPermissionData(payload);

                  if (response?.data?.statusCode === 200) {
                        setProjectList((prev) =>
                              prev.map((p) =>
                                    p.value === projectID
                                          ? { ...p, canUpdateAttendance: !currentProject.canUpdateAttendance }
                                          : p
                              )
                        );
                  } else {
                        toast.error("Failed to update project permission");
                  }
            } catch (error) {
                  console.error("Permission update error:", error);
                  toast.error("Something went wrong");
            }
      };




      useEffect(() => {
            const initialAssigned = {};
            projectList.forEach((p) => {
                  initialAssigned[p.value] = true; // or based on API flag
            });
            setAssigned(initialAssigned);
      }, [projectList]);


      return (
            <>
                  <Modal size="md" show={show} style={{ zIndex: 1300 }} onHide={onHide} backdrop="static" keyboard={false} centered>
                        <Modal.Header closeButton>
                              <Modal.Title>
                                    <h4 className="text-center">Project Permission</h4>
                              </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
                              <div

                              // style={{ background: "rgba(0,0,0,0.55)" }}
                              >

                                    {/* Project List */}
                                    <div className="list-group">
                                          {projectList.map((project) => (
                                                <div
                                                      key={project.value}
                                                      className="list-group-item d-flex justify-content-between align-items-center mb-2 border rounded-3 shadow-sm"
                                                      style={{
                                                            transition: "0.3s",
                                                            padding: "14px 18px",
                                                            background: "#f9f9f9",
                                                      }}
                                                >
                                                      {/* Project Name */}
                                                      <div className="fw-semibold" style={{ fontSize: "1rem" }}>


                                                            {project.label?.length > 30 ? (
                                                                  <Tooltip title={project.label}>{`${project.label?.substring(0, 30)}...`}</Tooltip>
                                                            ) : (
                                                                  <>{project.label}</>
                                                            )}
                                                      </div>

                                                      {/* Toggle Button */}
                                                      <div className="form-check form-switch m-0">
                                                            <input
                                                                  className="form-check-input project-toggle"
                                                                  type="checkbox"
                                                                  role="switch"
                                                                  checked={project.canUpdateAttendance}
                                                                  onChange={() =>
                                                                        toggleAssign(project.value, project.canUpdateAttendance)
                                                                  }
                                                                  style={{ cursor: "pointer" }}
                                                            />

                                                      </div>

                                                      {/* Status Label */}
                                                      <span
                                                            className={`fw-bold ${project.canUpdateAttendance ? "text-success" : "text-secondary"
                                                                  }`}
                                                      >
                                                            {project.canUpdateAttendance ? (
                                                                  <>
                                                                        <FaCheckCircle className="me-1" /> Assigned
                                                                  </>
                                                            ) : (
                                                                  <>
                                                                        <FaTimesCircle className="me-1" /> Unassigned
                                                                  </>
                                                            )}
                                                      </span>

                                                </div>
                                          ))}
                                    </div>


                              </div>
                        </Modal.Body>

                  </Modal>
                  {/* {showSuccessModal && (
                        <SuccessPopupModal
                              show={showSuccessModal}
                              onHide={() => closeAllModal()}
                              setShowSuccessModal={setShowSuccessModal}
                              modelAction={modelAction}
                        />
                  )} */}
            </>
      );
};

export default ProjectPermissionModal;

