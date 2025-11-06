





import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { Tooltip } from '@mui/material';


function ViewEmployeeModal({ show, onHide, modelRequestData }) {


      const employeeObj = {
            employeeName: "Sandeep Kumar",
            employeeID: "EMP12345",
            designation: "Frontend Developer",
            department: "IT Department",
            contactNumber: "9876543210",
            emailID: "sandeep@company.com",
            alternateContact: "8765432109",
            address: "123, Tech Park, Pune, Maharashtra, India",
            joiningDate: "12/05/2022",
            experience: "3 Years",
            managerName: "Amit Sharma",
            panNumber: "ABCDE1234F",
            aadharNumber: "1234 5678 9012",
            bankDetails: true,
            accountNumber: "123456789012",
            ifscCode: "HDFC0001234",
            branchName: "Pune Hinjewadi",
            emergencyContact: true,
            emergencyContactName: "Neha Sharma",
            emergencyRelation: "Wife",
            emergencyContactNumber: "9999998888",
      };
      return (
            <Modal backdrop="static" keyboard={false} style={{ zIndex: 1300 }} show={show} onHide={onHide} centered>

                  <Modal.Header closeButton>
                        <Modal.Title>Employee Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                        <div className="scrollable-table">
                              <Table striped bordered hover>
                                    <tbody>
                                          <tr>
                                                <td><b>Employee Name</b></td>
                                                <td>{employeeObj.employeeName}</td>
                                          </tr>
                                          <tr>
                                                <td><b>Employee ID</b></td>
                                                <td>{employeeObj.employeeID}</td>
                                          </tr>
                                          <tr>
                                                <td><b>Designation</b></td>
                                                <td>{employeeObj.designation}</td>
                                          </tr>
                                          <tr>
                                                <td><b>Department</b></td>
                                                <td>{employeeObj.department}</td>
                                          </tr>
                                          <tr>
                                                <td><b>Contact Number</b></td>
                                                <td>{employeeObj.contactNumber}</td>
                                          </tr>
                                          <tr>
                                                <td><b>Email ID</b></td>
                                                <td>{employeeObj.emailID}</td>
                                          </tr>
                                          <tr>
                                                <td><b>Alternate Contact</b></td>
                                                <td>{employeeObj.alternateContact}</td>
                                          </tr>
                                          <tr>
                                                <td><b>Address</b></td>
                                                <td>{employeeObj.address}</td>
                                          </tr>
                                          <tr>
                                                <td><b>Joining Date</b></td>
                                                <td>{employeeObj.joiningDate}</td>
                                          </tr>
                                          <tr>
                                                <td><b>Experience</b></td>
                                                <td>{employeeObj.experience}</td>
                                          </tr>
                                          <tr>
                                                <td><b>Manager Name</b></td>
                                                <td>{employeeObj.managerName}</td>
                                          </tr>
                                          <tr>
                                                <td><b>PAN Number</b></td>
                                                <td>{employeeObj.panNumber}</td>
                                          </tr>
                                          <tr>
                                                <td><b>Aadhar Number</b></td>
                                                <td>{employeeObj.aadharNumber}</td>
                                          </tr>

                                          {employeeObj.bankDetails && (
                                                <>
                                                      <tr>
                                                            <td><b>Account Number</b></td>
                                                            <td>{employeeObj.accountNumber}</td>
                                                      </tr>
                                                      <tr>
                                                            <td><b>IFSC Code</b></td>
                                                            <td>{employeeObj.ifscCode}</td>
                                                      </tr>
                                                      <tr>
                                                            <td><b>Branch Name</b></td>
                                                            <td>{employeeObj.branchName}</td>
                                                      </tr>
                                                </>
                                          )}

                                          {employeeObj.emergencyContact && (
                                                <>
                                                      <tr>
                                                            <td><b>Emergency Contact Name</b></td>
                                                            <td>{employeeObj.emergencyContactName}</td>
                                                      </tr>
                                                      <tr>
                                                            <td><b>Relation</b></td>
                                                            <td>{employeeObj.emergencyRelation}</td>
                                                      </tr>
                                                      <tr>
                                                            <td><b>Contact Number</b></td>
                                                            <td>{employeeObj.emergencyContactNumber}</td>
                                                      </tr>
                                                </>
                                          )}
                                    </tbody>
                              </Table>
                        </div>
                  </Modal.Body>


                  <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>
                              <b>Close</b>
                        </Button>
                  </Modal.Footer>
            </Modal>
      );
}

export default ViewEmployeeModal;
