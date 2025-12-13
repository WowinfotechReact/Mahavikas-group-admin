import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import SuccessPopupModal from 'component/SuccessPopupModal';
import Select from 'react-select';
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { GetMappedProjectLookupList } from 'services/Project/ProjectApi';

const ProjectPermissionModal = ({ show, onHide, modelRequestData, }) => {

      const projectList = [
            { id: 1, name: "Velvet GPS" },
            { id: 2, name: "Sales CRM" },
            { id: 3, name: "Inventory Automation" },
            { id: 4, name: "Smart IoT Portal" },
      ];



      const GetEmployeeLookupListData = async (roleTypeID, companyID) => {
            try {
                  let response = await GetMappedProjectLookupList(roleTypeID, companyID); // Call to get employee list based on roleTypeID
                  if (response?.data?.statusCode === 200) {
                        const employeeList = response?.data?.responseData?.data || [];

                        const filteredEmployees = employeeList.map((emp) => ({
                              value: emp.employeeID,
                              label: emp.name
                        }));
                        setEmployeeOption(filteredEmployees); // Make sure you have a state setter function for IVR list
                  } else {
                        console.error('Bad request');
                  }
            } catch (error) {
                  console.error('Error fetching employee list:', error);
            }
      };
      const [assigned, setAssigned] = useState({});

      const toggleAssign = (id) => {
            setAssigned((prev) => ({ ...prev, [id]: !prev[id] }));
      };


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
                                                      key={project.id}
                                                      className="list-group-item d-flex justify-content-between align-items-center mb-2 border rounded-3 shadow-sm"
                                                      style={{
                                                            transition: "0.3s",
                                                            padding: "14px 18px",
                                                            background: "#f9f9f9",
                                                      }}
                                                >
                                                      {/* Project Name */}
                                                      <div className="fw-semibold" style={{ fontSize: "1rem" }}>
                                                            {project.name}
                                                      </div>

                                                      {/* Toggle Button */}
                                                      <button
                                                            className={`btn px-4 py-2 d-flex align-items-center gap-2 fw-bold ${assigned[project.id] ? "btn-success" : "btn-outline-secondary"
                                                                  }`}
                                                            style={{ transition: "0.3s" }}
                                                            onClick={() => toggleAssign(project.id)}
                                                      >
                                                            {assigned[project.id] ? (
                                                                  <>
                                                                        <FaCheckCircle size={18} /> Assigned
                                                                  </>
                                                            ) : (
                                                                  <>
                                                                        <FaTimesCircle size={18} /> Unassigned
                                                                  </>
                                                            )}
                                                      </button>
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

