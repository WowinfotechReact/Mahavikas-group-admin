import React, { useEffect, useContext, useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { GetEmployeeIMEILogList } from 'services/Employee Staff/EmployeeApi';
import { ConfigContext } from 'context/ConfigContext';


function ViewIMEILogsModal({ show, onHide, modelRequestData }) {
  const { setLoader, user } = useContext(ConfigContext);
  const [imeiLogsList, setIMEILogsList] = useState([]);



  useEffect(() => {
    if (modelRequestData.Action === 'IEMI') {
      EmployeeIMEILogs();
    }
  }, [modelRequestData.Action]);

  const EmployeeIMEILogs = async () => {
    setLoader(true);
    try {
      const response = await GetEmployeeIMEILogList({
        userKeyID: user.userKeyID,
        employeeKeyID: modelRequestData.employeeKeyID
      });

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
          <b>IMEI Logs</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="scrollable-table">
        {/* <div > */}
        <Table striped bordered hover >
          <thead className="text-nowrap ">
            <tr>
              <th className="text-center" scope="col">
                {' '}
                IMEI Number
              </th>
              <th className="text-center" scope="col">
                {' '}
                Login Date & Time
              </th>
              <th className="text-center" scope="col">
                {' '}
                Reset Date & Time
              </th>

            </tr>
          </thead>
          <tbody>
            {imeiLogsList?.length > 0 ? (
              imeiLogsList.map((employee) => (
                <tr key={employee.id}>
                  <td className="text-center">{employee.imeiNumber}</td>
                  <td className="text-center">
                    {employee.loginDateTime}
                  </td>
                  <td className="text-center">{employee.resetDateTime}</td>

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

export default ViewIMEILogsModal;
