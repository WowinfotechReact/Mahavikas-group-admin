import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const SuccessPopupModal = ({ show, onHide, responseData, modelAction, confirmImportedMsg, setIsAddUpdateActionDone, setShowSuccessModal }) => {
  // ✅ define downloadCSV inside the component
  const downloadCSV = () => {
    const excludedRecords = responseData?.excludedRecords || [];

    if (!excludedRecords.length) return;

    const headers = Object.keys(excludedRecords[0]);

    const csvRows = [
      headers.join(','), // header row
      ...excludedRecords.map(row =>
        headers.map(field => {
          let value = row[field];
          if (typeof value === 'object' && value !== null) {
            value = JSON.stringify(value); // stringify object values
          }
          return `"${String(value ?? '')}"`; // quote and handle null/undefined
        }).join(',')
      )
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'excluded-records.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Modal style={{ zIndex: 1300 }} show={show} backdrop="static" keyboard={false} centered>
        <Modal.Body>
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="#28a745" class="bi bi-check2-circle" viewBox="0 0 16 16">
              <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
              <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
            </svg>
          </div>

          <h4 className="text-center m-3">{`${modelAction} `}</h4>

          <h6 className='text-center m-3'>{confirmImportedMsg} </h6>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ display: 'flex', justifyContent: responseData?.excludedRecords?.length > 0 ? 'space-between' : 'flex-end', width: '100%' }}>
            {responseData?.excludedRecords?.length > 0 && (
              <Button variant="success" onClick={downloadCSV}>
                <i className="fa-solid fa-download"></i>{" "}
                Excluded Records (CSV)
              </Button>
            )}

            <button
              className='btn text-white'
              style={{ background: '#ffaa33' }}


              onClick={() => {
                onHide();
              }}
            >
              Done
            </button>
          </div>
        </Modal.Footer>

      </Modal>
    </>
  );
};

export default SuccessPopupModal;
