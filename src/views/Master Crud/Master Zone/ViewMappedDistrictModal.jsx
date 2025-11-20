







import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import { GetAssignedZoneDistrictList } from 'services/Master Crud/MasterZoneApi';


function ViewMappedDistrictModal({ show, onHide, modelRequestData }) {

      const [distList, setDistList] = useState([])
      useEffect(() => {
            if (show && modelRequestData.Value?.zoneIDs) {
                  GetAssignedZoneDistrictListData();
            }
      }, [show, modelRequestData.Value?.zoneIDs]);





      const GetAssignedZoneDistrictListData = async () => {
            try {
                  let response = await GetAssignedZoneDistrictList(
                        modelRequestData.Value?.zoneIDs
                  );

                  if (response?.data?.statusCode === 200) {
                        const result = response?.data?.responseData?.data?.[0] || null;
                        setDistList(result);
                  }
            } catch (error) {
                  console.log(error);
            }
      };

      return (
            <Modal backdrop="static" keyboard={false} style={{ zIndex: 1300 }} show={show} onHide={onHide} centered>

                  <Modal.Header closeButton>
                        <Modal.Title>  {distList?.zoneName || "N/A"} Mapped </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                        <div className="scrollable-table">
                              <div className="container mt-3">
                                    {/* Zone Header */}
                                    <div className="mb-3">
                                          <h5 className="fw-bold">
                                                Zone:{" "}
                                                <span style={{ color: "#ff8800" }}>
                                                      {distList?.zoneName || "N/A"}
                                                </span>
                                          </h5>
                                    </div>

                                    {/* Table */}
                                    <div className="table-responsive">
                                          <table className="table table-bordered table-striped">
                                                <thead className="table-light">
                                                      <tr>
                                                            <th className="text-center">State Name</th>
                                                            <th className="text-center">District Name</th>
                                                      </tr>
                                                </thead>

                                                <tbody>
                                                      {distList?.districtList?.length > 0 ? (
                                                            distList.districtList.map((item, index) => (
                                                                  <tr key={index}>
                                                                        <td className="text-center">{item.stateName}</td>
                                                                        <td className="text-center">{item.districtName}</td>
                                                                  </tr>
                                                            ))
                                                      ) : (
                                                            <tr>
                                                                  <td colSpan="2" className="text-center text-muted">
                                                                        No district data found
                                                                  </td>
                                                            </tr>
                                                      )}
                                                </tbody>
                                          </table>
                                    </div>
                              </div>

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

export default ViewMappedDistrictModal;
