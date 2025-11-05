 




 import React, { useEffect, useContext, useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { ConfigContext } from 'context/ConfigContext';
import { GetComplaintLogList } from 'services/ComplaintsApi/ComplaintApi';
import { GetLeadLogList } from 'services/LeadAPI/LeadApi';


function TransferLeadLogsViewModal({ show, onHide, modelRequestData }) {
  const { setLoader, user } = useContext(ConfigContext);
  const [imeiLogsList, setIMEILogsList] = useState([]);



  useEffect(() => {
    if (modelRequestData.Action === 'TransferView') {
      EmployeeIMEILogs(modelRequestData.leadKeyID);
    }
  }, [show]);

  const EmployeeIMEILogs = async (leadKeyID) => {
    
    setLoader(true);
    try {
      const response = await GetLeadLogList(leadKeyID);

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const EmployeeIMEILogs = response?.data?.responseData?.data;

            setIMEILogsList(EmployeeIMEILogs);
          }
        } else {
          setLoader(false);
          setErrorMessage(response?.data?.errorMessage);
          setLoader(false);
        }
        return response;
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
      setLoader(false);
    }
  };

  return (
    <Modal backdrop="static" keyboard={false} style={{ zIndex: 1300 }} show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <b>Lead Transfer Logs</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="scrollable-table">
        {/* <div > */}
        <Table striped bordered hover >
          <thead className="text-nowrap ">
            <tr>
              <th className="text-center" scope="col">
                {' '}
                From Employee
              </th>
              <th className="text-center" scope="col">
                {' '}
                To Employee
              </th>
              <th className="text-center" scope="col">
                {' '}
                Transfer Date
              </th>

            </tr>
          </thead>
          <tbody>
            {imeiLogsList?.length > 0 ? (
              imeiLogsList.map((employee) => (
                <tr key={employee.id}>
                  <td className="text-center">{employee.fromEmployee}</td>
                  <td className="text-center">
                    {employee.toEmployeeID}
                  </td>
                  <td className="text-center">{employee.transferDate}</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No Records Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          <b>Close</b>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TransferLeadLogsViewModal;

