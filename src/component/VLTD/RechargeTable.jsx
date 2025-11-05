import React from 'react';
import { useNavigate } from 'react-router';
import { Tooltip } from '@mui/material';

const RechargeTable = () => {
  const navigate = useNavigate();
  const machineListData = [
    {
      id: 1,
      vehicleNo: 'AP 29 1234',
      phoneNo: '343243453543',
      plan: 'Monthly',
      vehicleType: 'Car',
      VLTD: 'Yes',
      recharge: 'Yes',
      payableAmount: '1000',
      status: 'Pending',
      sendQr: 'Yes',
      accDept: 'Yes',
      sendToVLTD: 'Yes',
      sendToMfg: 'Yes',
      statusFromMfg: 'Yes',
      certificateSent: 'Yes'
    },
    {
      id: 2,
      vehicleNo: 'DS 98 1234',
      phoneNo: '343243453543',
      plan: 'Monthly',
      vehicleType: 'Car',
      VLTD: 'Yes',
      recharge: 'Yes',
      payableAmount: '1000',
      status: 'Pending',
      sendQr: 'Yes',
      accDept: 'Yes',
      sendToVLTD: 'Yes',
      sendToMfg: 'Yes',
      statusFromMfg: 'Yes',
      certificateSent: 'Yes'
    },
    {
      id: 3,
      vehicleNo: 'RE 78 1234',
      phoneNo: '343243453543',
      plan: 'Monthly',
      vehicleType: 'Car',
      VLTD: 'Yes',
      recharge: 'Yes',
      payableAmount: '1000',
      status: 'Pending',
      sendQr: 'Yes',
      accDept: 'Yes',
      sendToVLTD: 'Yes',
      sendToMfg: 'Yes',
      statusFromMfg: 'Yes',
      certificateSent: 'Yes'
    },
    {
      id: 4,
      vehicleNo: 'YR 43 1234',
      phoneNo: '343243453543',
      plan: 'Monthly',
      vehicleType: 'Car',
      VLTD: 'Yes',
      recharge: 'Yes',
      payableAmount: '1000',
      status: 'Pending',
      sendQr: 'Yes',
      accDept: 'Yes',
      sendToVLTD: 'Yes',
      sendToMfg: 'Yes',
      statusFromMfg: 'Yes',
      certificateSent: 'Yes'
    },
    {
      id: 5,
      vehicleNo: 'UK 29 1234',
      phoneNo: '343243453543',
      plan: 'Monthly',
      vehicleType: 'Car',
      VLTD: 'Yes',
      recharge: 'Yes',
      payableAmount: '1000',
      status: 'Pending',
      sendQr: 'Yes',
      accDept: 'Yes',
      sendToVLTD: 'Yes',
      sendToMfg: 'Yes',
      statusFromMfg: 'Yes',
      certificateSent: 'Yes'
    },
    {
      id: 6,
      vehicleNo: 'DS 29 1234',
      phoneNo: '343243453543',
      plan: 'Monthly',
      vehicleType: 'Car',
      VLTD: 'Yes',
      recharge: 'Yes',
      payableAmount: '1000',
      status: 'Pending',
      sendQr: 'Yes',
      accDept: 'Yes',
      sendToVLTD: 'Yes',
      sendToMfg: 'Yes',
      statusFromMfg: 'Yes',
      certificateSent: 'Yes'
    },
    {
      id: 7,
      vehicleNo: 'AA 29 1234',
      phoneNo: '343243453543',
      plan: 'Monthly',
      vehicleType: 'Car',
      VLTD: 'Yes',
      recharge: 'Yes',
      payableAmount: '1000',
      status: 'Pending',
      sendQr: 'Yes',
      accDept: 'Yes',
      sendToVLTD: 'Yes',
      sendToMfg: 'Yes',
      statusFromMfg: 'Yes',
      certificateSent: 'Yes'
    },
    {
      id: 8,
      vehicleNo: 'FF 29 1234',
      phoneNo: '343243453543',
      plan: 'Monthly',
      vehicleType: 'Car',
      VLTD: 'Yes',
      recharge: 'Yes',
      payableAmount: '1000',
      status: 'Pending',
      sendQr: 'Yes',
      accDept: 'Yes',
      sendToVLTD: 'Yes',
      sendToMfg: 'Yes',
      statusFromMfg: 'Yes',
      certificateSent: 'Yes'
    },
    {
      id: 9,
      vehicleNo: 'VC 29 1234',
      phoneNo: '343243453543',
      plan: 'Monthly',
      vehicleType: 'Car',
      VLTD: 'Yes',
      recharge: 'Yes',
      payableAmount: '1000',
      status: 'Pending',
      sendQr: 'Yes',
      accDept: 'Yes',
      sendToVLTD: 'Yes',
      sendToMfg: 'Yes',
      statusFromMfg: 'Yes',
      certificateSent: 'Yes'
    },
    {
      id: 10,
      vehicleNo: 'FD 29 1234',
      phoneNo: '343243453543',
      plan: 'Monthly',
      vehicleType: 'Car',
      VLTD: 'Yes',
      recharge: 'Yes',
      payableAmount: '1000',
      status: 'Pending',
      sendQr: 'Yes',
      accDept: 'Yes',
      sendToVLTD: 'Yes',
      sendToMfg: 'Yes',
      statusFromMfg: 'Yes',
      certificateSent: 'Yes'
    },
    {
      id: 11,
      vehicleNo: 'NH 29 1234',
      phoneNo: '343243453543',
      plan: 'Monthly',
      vehicleType: 'Car',
      VLTD: 'Yes',
      recharge: 'Yes',
      payableAmount: '1000',
      status: 'Pending',
      sendQr: 'Yes',
      accDept: 'Yes',
      sendToVLTD: 'Yes',
      sendToMfg: 'Yes',
      statusFromMfg: 'Yes',
      certificateSent: 'Yes'
    },
    {
      id: 12,
      vehicleNo: 'TR 29 1234',
      phoneNo: '343243453543',
      plan: 'Monthly',
      vehicleType: 'Car',
      VLTD: 'Yes',
      recharge: 'Yes',
      payableAmount: '1000',
      status: 'Pending',
      sendQr: 'Yes',
      accDept: 'Yes',
      sendToVLTD: 'Yes',
      sendToMfg: 'Yes',
      statusFromMfg: 'Yes',
      certificateSent: 'Yes'
    },
    {
      id: 13,
      vehicleNo: 'AP 29 1234',
      phoneNo: '343243453543',
      plan: 'Monthly',
      vehicleType: 'Car',
      VLTD: 'Yes',
      recharge: 'Yes',
      payableAmount: '1000',
      status: 'Pending',
      sendQr: 'Yes',
      accDept: 'Yes',
      sendToVLTD: 'Yes',
      sendToMfg: 'Yes',
      statusFromMfg: 'Yes',
      certificateSent: 'Yes'
    },
    {
      id: 14,
      vehicleNo: 'AP 29 1234',
      phoneNo: '343243453543',
      plan: 'Monthly',
      vehicleType: 'Car',
      VLTD: 'Yes',
      recharge: 'Yes',
      payableAmount: '1000',
      status: 'Pending',
      sendQr: 'Yes',
      accDept: 'Yes',
      sendToVLTD: 'Yes',
      sendToMfg: 'Yes',
      statusFromMfg: 'Yes',
      certificateSent: 'Yes'
    },
    {
      id: 15,
      vehicleNo: 'AP 29 1234',
      phoneNo: '343243453543',
      plan: 'Monthly',
      vehicleType: 'Car',
      VLTD: 'Yes',
      recharge: 'Yes',
      payableAmount: '1000',
      status: 'Pending',
      sendQr: 'Yes',
      accDept: 'Yes',
      sendToVLTD: 'Yes',
      sendToMfg: 'Yes',
      statusFromMfg: 'Yes',
      certificateSent: 'Yes'
    },
    {
      id: 16,
      vehicleNo: 'AP 29 1234',
      phoneNo: '343243453543',
      plan: 'Monthly',
      vehicleType: 'Car',
      VLTD: 'Yes',
      recharge: 'Yes',
      payableAmount: '1000',
      status: 'Pending',
      sendQr: 'Yes',
      accDept: 'Yes',
      sendToVLTD: 'Yes',
      sendToMfg: 'Yes',
      statusFromMfg: 'Yes',
      certificateSent: 'Yes'
    },
    {
      id: 17,
      vehicleNo: 'AP 29 1234',
      phoneNo: '343243453543',
      plan: 'Monthly',
      vehicleType: 'Car',
      VLTD: 'Yes',
      recharge: 'Yes',
      payableAmount: '1000',
      status: 'Pending',
      sendQr: 'Yes',
      accDept: 'Yes',
      sendToVLTD: 'Yes',
      sendToMfg: 'Yes',
      statusFromMfg: 'Yes',
      certificateSent: 'Yes'
    },
    {
      id: 18,
      vehicleNo: 'AP 29 1234',
      phoneNo: '343243453543',
      plan: 'Monthly',
      vehicleType: 'Car',
      VLTD: 'Yes',
      recharge: 'Yes',
      payableAmount: '1000',
      status: 'Pending',
      sendQr: 'Yes',
      accDept: 'Yes',
      sendToVLTD: 'Yes',
      sendToMfg: 'Yes',
      statusFromMfg: 'Yes',
      certificateSent: 'Yes'
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
    const rows = machineListData.map((row) => [
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
    <div className="card w-full max-w-[50vh] mx-auto h-auto">
      <div className="card-body p-2 bg-white shadow-md rounded-lg">
      <h4>Recharge</h4>
<div className="d-flex flex-wrap align-items-center mb-1">
  <div className="col-12 col-md-3">
    <input type="text" className="form-control" placeholder="Search.." />
  </div>
  <div className="col-12 col-md-9 d-flex justify-content-md-end mt-2 mt-md-0">
    <div className="d-flex flex-column flex-md-row gap-2 w-100 w-md-auto" style={{ maxWidth: '500px' }}>
      <Tooltip title="VLTD Certified">
        <button className="bg-success btn text-white bg-gradient btn-sm w-100 w-md-auto btn-sm text-nowrap" style={{ minWidth: '150px' }}>
          VLTD Fitment Certificate
        </button>
      </Tooltip>
      <Tooltip title="Add New Recharge">
        <button
          className="btn bg-warning text-white bg-gradient text-nowrap btn-sm "
          onClick={AddNewRechargeNavigate}
          // style={{ minWidth: '150px' }}
        >
          {/* <i className="fa-solid fa-plus" style={{  }}></i>  */}
          New Recharge
        </button>
      </Tooltip>
      <Tooltip title="Export Recharge Into CSV">
        <button
          className="btn bg-primary bg-gradient btn-sm text-white w-100 w-md-auto"
          onClick={exportToCSV}
          style={{ minWidth: '150px' }}
        >
          Export Recharge to CSV
        </button>
      </Tooltip>
    </div>
  </div>
</div>


        {/* Table */}
        <div className="table-responsive" style={{ maxHeight: '61vh', overflowY: 'auto', position: 'relative' }}>
          <table className="table table-bordered table-striped">
            <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
              <tr className="text-nowrap">
                <th scope="col">Id</th>
                <th scope="col">Phone No</th>
                <th scope="col">Vehicle</th>
                <th scope="col">Plan </th>
                <th scope="col">VLTD</th>
                <th scope="col">Recharge</th>
                <th scope="col">Payable Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Send Qr</th>
                <th scope="col">Acc Dept</th>
                <th scope="col">Send to VLTD</th>
                <th scope="col">Send to Mfg</th>
                <th scope="col">Status from Mfg</th>
                <th scope="col">Certificate Sent</th>
                <th scope="col" style={{ width: '150px' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {machineListData?.map((row, idx) => (
                <tr className="text-nowrap" key={idx}>
                  <td className="text-center">{row.id}</td>
                  <td className="text-center">{row.phoneNo}</td>
                  <td className="text-center">{row.vehicleNo}</td>
                  <td className="text-center">{row.plan}</td>
                  <td className="text-center">{row.VLTD}</td>
                  <td className="text-center">{row.recharge}</td>
                  <td className="text-center">{row.payableAmount}</td>
                  <td className="text-center">{row.status}</td>
                  <td className="text-center">{row.sendQr}</td>
                  <td className="text-center">{row.accDept}</td>
                  <td className="text-center">{row.sendToVLTD}</td>
                  <td className="text-center">{row.sendToMfg}</td>
                  <td className="text-center">{row.statusFromMfg}</td>
                  <td className="text-center">{row.certificateSent}</td>

                  <td className="text-center btn-sm">
                    <Tooltip title="Update Recharge">
                      <button onClick={() => VehicleAddBtnClicked()} type="button" className="btn-sm btn btn-primary">
                        <i class="fa-solid fa-eye"></i>
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
              {machineListData.length === 0 && (
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

export default RechargeTable;
