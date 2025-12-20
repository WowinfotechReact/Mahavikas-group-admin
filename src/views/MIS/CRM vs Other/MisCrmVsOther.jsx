import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import UserRegistrationModal from 'component/UserRegistrationModal';
import AssignLocationModal from 'AssignLocationModal';
import GrantPermissionModal from 'GrantPermissionModal';
import { useNavigate } from 'react-router';

const MisCrmVsOther = () => {
  const navigate = useNavigate();
  const crmVsOtherListData = [
    {
      id: 1,
      vehicleNo: 'MH 12 1234',
      crmImei: '123456',
      cgm: '123456',
      cgmModel: '123456',
      vihaana: '123456',
      trakin: '123456',
      mahakhanij: '123456',
      mahakhanijModel: 'Transync SOS',
      svtsImei: '123456',
      svts1Imei: '123456'
    },
    {
      id: 2,
      vehicleNo: 'MH 12 1234',
      crmImei: '123456',
      cgm: '123456',
      cgmModel: '123456',
      vihaana: '123456',
      trakin: '123456',
      mahakhanij: '123456',
      mahakhanijModel: 'Transync SOS',
      svtsImei: '123456',
      svts1Imei: '123456'
    },
    {
      id: 3,
      vehicleNo: 'MH 12 1234',
      crmImei: '123456',
      cgm: '123456',
      cgmModel: '123456',
      vihaana: '123456',
      trakin: '123456',
      mahakhanij: '123456',
      mahakhanijModel: 'Transync SOS',
      svtsImei: '123456',
      svts1Imei: '123456'
    },
    {
      id: 4,
      vehicleNo: 'MH 12 1234',
      crmImei: '123456',
      cgm: '123456',
      cgmModel: '123456',
      vihaana: '123456',
      trakin: '123456',
      mahakhanij: '123456',
      mahakhanijModel: 'Transync SOS',
      svtsImei: '123456',
      svts1Imei: '123456'
    },
    {
      id: 5,
      vehicleNo: 'MH 12 1234',
      crmImei: '123456',
      cgm: '123456',
      cgmModel: '123456',
      vihaana: '123456',
      trakin: '123456',
      mahakhanij: '123456',
      mahakhanijModel: 'Transync SOS',
      svtsImei: '123456',
      svts1Imei: '123456'
    },
    {
      id: 6,
      vehicleNo: 'MH 12 1234',
      crmImei: '123456',
      cgm: '123456',
      cgmModel: '123456',
      vihaana: '123456',
      trakin: '123456',
      mahakhanij: '123456',
      mahakhanijModel: 'Transync SOS',
      svtsImei: '123456',
      svts1Imei: '123456'
    }
  ];

  const AddNewRechargeNavigate = () => {
    navigate('/recharge-foam');
  };

  const exportToCSV = () => {
    // Column headers for CSV
    const headers = [
      'Id',
      'Phone No',
      'Vehicle',
      'Plan',
      'VLTD',
      'Recharge',
      'Payable Amount',
      'Status',
      'Send Qr',
      'Acc Dept',
      'Send to VLTD',
      'Send to Mfg',
      'Status from Mfg',
      'Certificate Sent'
    ];

    // Map rows to CSV format
    const rows = crmVsOtherListData.map((row) => [
      row.id,
      row.phoneNo,
      row.vehicleNo,
      row.plan,
      row.VLTD,
      row.recharge,
      row.payableAmount,
      row.status,
      row.sendQr,
      row.accDept,
      row.sendToVLTD,
      row.sendToMfg,
      row.statusFromMfg,
      row.certificateSent
    ]);

    // Combine headers and rows into a single CSV string
    const csvContent = [headers, ...rows]
      .map((e) => e.join(',')) // Join each row with commas
      .join('\n'); // Join rows with newline characters

    // Create a Blob and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'vltd_recharge_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card w-100 mx-auto h-auto">
      <div className="card-body p-4 bg-white shadow-md rounded-lg">
        <h4 className="mb-2">Crm Vs Other Table</h4>
        <div className="row mb-3 align-items-center">
          <div className="col-12 col-md-3">
            <input type="text" className="form-control" placeholder="Search by Phone No or Vehicle No" />
          </div>
          <div className="col-12 col-md-9 mb-2 mb-md-0">
            <div className="d-flex flex-wrap justify-content-end d-flex align-item-end gap-2">
              {/* <button className="bg-success btn text-white bg-gradient">VLTD Fitment Certificate</button> */}
              <button className="btn bg-warning text-white bg-gradient">Crm Vs Other</button>
              <button className="btn bg-primary bg-gradient  text-white bg-gradient">Export Table to CSV</button>
              {/* <button className="btn btn-danger  text-white bg-gradient">Back</button> */}
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="table-responsive" style={{ maxHeight: '55vh', overflowY: 'auto', position: 'relative' }}>
          <table className="table table-bordered table-striped">
            <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
              <tr>
                <th scope="col">Sr No</th>
                <th scope="col">Vehicle Number</th>
                <th scope="col">CRM IMEI</th>
                <th scope="col">CGM </th>
                <th scope="col">CGM Model</th>
                <th scope="col">Vihaana </th>
                <th scope="col">Trakin</th>
                <th scope="col">Mahakhanij</th>
                <th scope="col">Mahakhanij Model</th>
                <th scope="col">SVTS Imei</th>
                <th scope="col">SVTS1 Imei</th>
                {/* <th scope="col" style={{ width: '150px' }}>
                  Action
                </th> */}
              </tr>
            </thead>
            <tbody>
              {crmVsOtherListData?.map((row, idx) => (
                <tr key={idx}>
                  <td className="text-center">{row.id}</td>
                  <td className="text-center">{row.vehicleNo}</td>
                  <td className="text-center">{row.crmImei}</td>
                  <td className="text-center">{row.cgm}</td>
                  <td className="text-center">{row.cgmModel}</td>
                  <td className="text-center">{row.vihaana}</td>
                  <td className="text-center">{row.trakin}</td>
                  <td className="text-center">{row.mahakhanij}</td>
                  <td className="text-center">{row.mahakhanijModel}</td>
                  <td className="text-center">{row.svtsImei}</td>
                  <td className="text-center">{row.svts1Imei}</td>

                  {/* <td className="text-center">
                    <button onClick={() => VehicleAddBtnClicked()} type="button" className="btn-sm btn btn-primary">
                      <i class="fa-solid fa-eye"></i>
                    </button>
                  </td> */}
                </tr>
              ))}
              {crmVsOtherListData.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MisCrmVsOther;
