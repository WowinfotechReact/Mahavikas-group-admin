import React, { useState } from 'react';
import Select from 'react-select';

const Utils = {
  MisOptions: [
    { value: 1, label: 'IMEI' },
    { value: 2, label: 'Vehicle No' },
    { value: 3, label: 'SIM' },
    { value: 4, label: 'Offline' },
    { value: 5, label: 'Days to Expire' },
    { value: 6, label: 'Expired' }
  ]
};

const IMEITableData = [
  {
    id: 1,
    vehicleNumber: 'ABC123',
    imeiNumber: '123456789',
    vtsNumber: 'VTS001',
    deviceModel: 'ModelX',
    creationDate: '2023-01-01',
    expiryDate: '2025-01-01',
    category: 'GPS',
    statusIM: 'Active',
    lastUpdate: '2024-12-01'
  },
  {
    id: 2,
    vehicleNumber: 'ABC123',
    imeiNumber: '123456789',
    vtsNumber: 'VTS001',
    deviceModel: 'ModelX',
    creationDate: '2023-01-01',
    expiryDate: '2025-01-01',
    category: 'GPS',
    statusIM: 'Active',
    lastUpdate: '2024-12-01'
  }
];
const VehicleTableData = [
  {
    id: 1,
    vehicleNumber: 'ABC123',
    imeiNumber: '123456789',
    vtsNumber: 'VTS001',
    deviceModel: 'ModelX',
    creationDate: '2023-01-01',
    expiryDate: '2025-01-01',
    category: 'GPS',
    statusIM: 'Active',
    lastUpdate: '2024-12-01'
  },
  {
    id: 2,
    vehicleNumber: 'ABC123',
    imeiNumber: '123456789',
    vtsNumber: 'VTS001',
    deviceModel: 'ModelX',
    creationDate: '2023-01-01',
    expiryDate: '2025-01-01',
    category: 'GPS',
    statusIM: 'Active',
    lastUpdate: '2024-12-01'
  }
];
const SIMTableData = [
  {
    id: 1,
    vehicleNumber: 'ABC123',
    imeiNumber: '123456789',
    vtsNumber: 'VTS001',
    deviceModel: 'ModelX',
    creationDate: '2023-01-01',
    expiryDate: '2025-01-01',
    category: 'GPS',
    statusIM: 'Active',
    lastUpdate: '2024-12-01'
  },
  {
    id: 2,
    vehicleNumber: 'ABC123',
    imeiNumber: '123456789',
    vtsNumber: 'VTS001',
    deviceModel: 'ModelX',
    creationDate: '2023-01-01',
    expiryDate: '2025-01-01',
    category: 'GPS',
    statusIM: 'Active',
    lastUpdate: '2024-12-01'
  }
];

const MISSVTS2Collection = () => {
  const [selectedOption, setSelectedOption] = useState(1); // Default to IMEI

  const IMEITable = (
    <div className=" w-full max-w-[50vh] mx-auto h-auto">
      <div className="  bg-white shadow-md rounded-lg">
        <div className="d-flex justify-content-between align-items-center mb-1 w-100">
          {/* Left Section: Title and Search Bar */}
          <div className="d-flex justify-content-start gap-3 align-items-center col-12 col-md-auto">
            <h4 className="text-nowrap">IMEI </h4>
            <input
              style={{ width: '250px' }} // Adjust width as needed
              type="text"
              className="form-control mx-2"
              placeholder="Search.."
            />
          </div>

          <div className="d-flex gap-3 col-12 col-md-auto justify-content-end">
            <button className="btn btn-primary">SVTS1 Duplicate IMEI Number</button>
            {/* <button className="btn btn-primary">Back</button> */}
          </div>
        </div>
        <div className="table-responsive" style={{ maxHeight: '48vh', overflowY: 'auto', position: 'relative' }}>
          <table className="table table-bordered table-striped">
            <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
              <tr>
                <th className="text-center">Sr No</th>
                <th className="text-center">Vehicle Number</th>
                <th className="text-center">IMEI Number</th>
                <th className="text-center">VTS Number</th>
                <th className="text-center">Device Model</th>
                <th className="text-center">Creation Date</th>
                <th className="text-center">Expiry Date</th>
                <th className="text-center">Category</th>
                <th className="text-center">StatusIM</th>
                <th className="text-center">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {IMEITableData?.map((row, idx) => (
                <tr key={idx}>
                  <td className="text-center">{idx + 1}</td>
                  <td className="text-center">{row.vehicleNumber}</td>
                  <td className="text-center">{row.imeiNumber}</td>
                  <td className="text-center">{row.vtsNumber}</td>
                  <td className="text-center">{row.deviceModel}</td>
                  <td className="text-center">{row.creationDate}</td>
                  <td className="text-center">{row.expiryDate}</td>
                  <td className="text-center">{row.category}</td>
                  <td className="text-center">{row.statusIM}</td>
                  <td className="text-center">{row.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const VehicleTable = (
    <div className=" w-full max-w-[50vh] mx-auto h-auto">
      <div className="  bg-white shadow-md rounded-lg">
        <div className="d-flex justify-content-between align-items-center mb-1 w-100">
          {/* Left Section: Title and Search Bar */}
          <div className="d-flex justify-content-start gap-3 align-items-center col-12 col-md-auto">
            <h4 className="text-nowrap">Vehicle </h4>
            <input
              style={{ width: '250px' }} // Adjust width as needed
              type="text"
              className="form-control mx-2"
              placeholder="Search.."
            />
          </div>

          <div className="d-flex gap-3 col-12 col-md-auto justify-content-end">
            <button className="btn btn-primary">Duplicate SVTS Vehicle Number</button>
            {/* <button className="btn btn-primary">Back</button> */}
          </div>
        </div>

        <div className="table-responsive" style={{ maxHeight: '48vh', overflowY: 'auto', position: 'relative' }}>
          <table className="table table-bordered table-striped">
            <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
              <tr>
                <th className="text-center">Sr No</th>
                <th className="text-center">Vehicle Number</th>
                <th className="text-center">IMEI Number</th>
                <th className="text-center">VTS Number</th>
                <th className="text-center">Device Model</th>
                <th className="text-center">Creation Date</th>
                <th className="text-center">Expiry Date</th>
                <th className="text-center">Category</th>
                <th className="text-center">StatusIM</th>
                <th className="text-center">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {VehicleTableData?.map((row, idx) => (
                <tr key={idx}>
                  <td className="text-center">{idx + 1}</td>
                  <td className="text-center">{row.vehicleNumber}</td>
                  <td className="text-center">{row.imeiNumber}</td>
                  <td className="text-center">{row.vtsNumber}</td>
                  <td className="text-center">{row.deviceModel}</td>
                  <td className="text-center">{row.creationDate}</td>
                  <td className="text-center">{row.expiryDate}</td>
                  <td className="text-center">{row.category}</td>
                  <td className="text-center">{row.statusIM}</td>
                  <td className="text-center">{row.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const SIMTable = (
    <div className=" w-full max-w-[50vh] mx-auto h-auto">
      <div className="  bg-white shadow-md rounded-lg">
        <div className="d-flex justify-content-between align-items-center mb-1 w-100">
          {/* Left Section: Title and Search Bar */}
          <div className="d-flex justify-content-start gap-3 align-items-center col-12 col-md-auto">
            <h4 className="text-nowrap">Sim </h4>
            <input
              style={{ width: '250px' }} // Adjust width as needed
              type="text"
              className="form-control mx-2"
              placeholder="Search.."
            />
          </div>

          <div className="d-flex gap-3 col-12 col-md-auto justify-content-end">
            <button className="btn btn-primary">Duplicate SVTS Sim Number</button>
            {/* <button className="btn btn-primary">Back</button> */}
          </div>
        </div>
        <div className="table-responsive" style={{ maxHeight: '48vh', overflowY: 'auto', position: 'relative' }}>
          <table className="table table-bordered table-striped">
            <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
              <tr>
                <th className="text-center">Sr No</th>
                <th className="text-center">Vehicle Number</th>
                <th className="text-center">IMEI Number</th>
                <th className="text-center">VTS Number</th>
                <th className="text-center">Device Model</th>
                <th className="text-center">Creation Date</th>
                <th className="text-center">Expiry Date</th>
                <th className="text-center">Category</th>
                <th className="text-center">StatusIM</th>
                <th className="text-center">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {SIMTableData?.map((row, idx) => (
                <tr key={idx}>
                  <td className="text-center">{idx + 1}</td>
                  <td className="text-center">{row.vehicleNumber}</td>
                  <td className="text-center">{row.imeiNumber}</td>
                  <td className="text-center">{row.vtsNumber}</td>
                  <td className="text-center">{row.deviceModel}</td>
                  <td className="text-center">{row.creationDate}</td>
                  <td className="text-center">{row.expiryDate}</td>
                  <td className="text-center">{row.category}</td>
                  <td className="text-center">{row.statusIM}</td>
                  <td className="text-center">{row.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  const OfflineTable = (
    <div className="w-full max-w-[50vh] mx-auto h-auto">
      <div className="  bg-white shadow-md rounded-lg">
        <div className="d-flex justify-content-between align-items-center mb-1 w-100">
          {/* Left Section: Title and Search Bar */}
          <div className="d-flex justify-content-start gap-3 align-items-center col-12 col-md-auto">
            <h4 className="text-nowrap">SVTS Offline </h4>
            <input
              style={{ width: '250px' }} // Adjust width as needed
              type="text"
              className="form-control mx-2"
              placeholder="Search.."
            />
          </div>

          <div className="d-flex gap-3 col-12 col-md-auto justify-content-end">
            <button className="btn btn-primary"> SVTS Offline</button>
            <button className="btn btn-warning bg-gradient"> Export Table To Csv</button>
            {/* <button className="btn btn-primary">Back</button> */}
          </div>
        </div>

        <div className="table-responsive" style={{ maxHeight: '48vh', overflowY: 'auto', position: 'relative' }}>
          <table className="table table-bordered table-striped">
            <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
              <tr>
                <th className="text-center">Sr No</th>
                <th className="text-center">Vehicle Number</th>
                <th className="text-center">IMEI Number</th>
                <th className="text-center">VTS Number</th>
                <th className="text-center">Device Model</th>
                <th className="text-center">Creation Date</th>
                <th className="text-center">Expiry Date</th>
                <th className="text-center">Category</th>
                <th className="text-center">StatusIM</th>
                <th className="text-center">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {SIMTableData?.map((row, idx) => (
                <tr key={idx}>
                  <td className="text-center">{idx + 1}</td>
                  <td className="text-center">{row.vehicleNumber}</td>
                  <td className="text-center">{row.imeiNumber}</td>
                  <td className="text-center">{row.vtsNumber}</td>
                  <td className="text-center">{row.deviceModel}</td>
                  <td className="text-center">{row.creationDate}</td>
                  <td className="text-center">{row.expiryDate}</td>
                  <td className="text-center">{row.category}</td>
                  <td className="text-center">{row.statusIM}</td>
                  <td className="text-center">{row.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  const DaysToExpires = (
    <div className="w-full max-w-[50vh] mx-auto h-auto">
      <div className="  bg-white shadow-md rounded-lg">
        <div className="d-flex justify-content-between align-items-center mb-1 w-100">
          {/* Left Section: Title and Search Bar */}
          <div className="d-flex justify-content-start gap-3 align-items-center col-12 col-md-auto">
            <h4 className="text-nowrap">Days To Expire </h4>
            <input
              style={{ width: '250px' }} // Adjust width as needed
              type="text"
              className="form-control mx-2"
              placeholder="Search.."
            />
          </div>

          <div className="d-flex gap-3 col-12 col-md-auto justify-content-end">
            <button className="btn btn-primary"> SVTS Online</button>
            {/* <button className="btn btn-primary">Back</button> */}
          </div>
        </div>

        <div className="table-responsive" style={{ maxHeight: '48vh', overflowY: 'auto', position: 'relative' }}>
          <table className="table table-bordered table-striped">
            <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
              <tr>
                <th className="text-center">Sr No</th>
                <th className="text-center">Vehicle Number</th>
                <th className="text-center">IMEI Number</th>
                <th className="text-center">VTS Number</th>
                <th className="text-center">Device Model</th>
                <th className="text-center">Creation Date</th>
                <th className="text-center">Expiry Date</th>
                <th className="text-center">Category</th>
                <th className="text-center">StatusIM</th>
                <th className="text-center">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {SIMTableData?.map((row, idx) => (
                <tr key={idx}>
                  <td className="text-center">{idx + 1}</td>
                  <td className="text-center">{row.vehicleNumber}</td>
                  <td className="text-center">{row.imeiNumber}</td>
                  <td className="text-center">{row.vtsNumber}</td>
                  <td className="text-center">{row.deviceModel}</td>
                  <td className="text-center">{row.creationDate}</td>
                  <td className="text-center">{row.expiryDate}</td>
                  <td className="text-center">{row.category}</td>
                  <td className="text-center">{row.statusIM}</td>
                  <td className="text-center">{row.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  const MiliTrackEXP = (
    <div className="w-full max-w-[50vh] mx-auto h-auto">
      <div className="  bg-white shadow-md rounded-lg">
        <div className="d-flex justify-content-between align-items-center mb-1 w-100">
          {/* Left Section: Title and Search Bar */}
          <div className="d-flex justify-content-start gap-3 align-items-center col-12 col-md-auto">
            <h4 className="text-nowrap">SVTS Offline </h4>
            <input
              style={{ width: '250px' }} // Adjust width as needed
              type="text"
              className="form-control mx-2"
              placeholder="Search.."
            />
          </div>

          <div className="d-flex gap-3 col-12 col-md-auto justify-content-end">
            <button className="btn btn-primary"> SVTS Online</button>
            {/* <button className="btn btn-primary">Back</button> */}
          </div>
        </div>
        <div className="table-responsive" style={{ maxHeight: '48vh', overflowY: 'auto', position: 'relative' }}>
          <table className="table table-bordered table-striped">
            <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
              <tr>
                <th className="text-center">Sr No</th>
                <th className="text-center">Vehicle Number</th>
                <th className="text-center">IMEI Number</th>
                <th className="text-center">VTS Number</th>
                <th className="text-center">Device Model</th>
                <th className="text-center">Creation Date</th>
                <th className="text-center">Expiry Date</th>
                <th className="text-center">Category</th>
                <th className="text-center">StatusIM</th>
                <th className="text-center">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {SIMTableData?.map((row, idx) => (
                <tr key={idx}>
                  <td className="text-center">{idx + 1}</td>
                  <td className="text-center">{row.vehicleNumber}</td>
                  <td className="text-center">{row.imeiNumber}</td>
                  <td className="text-center">{row.vtsNumber}</td>
                  <td className="text-center">{row.deviceModel}</td>
                  <td className="text-center">{row.creationDate}</td>
                  <td className="text-center">{row.expiryDate}</td>
                  <td className="text-center">{row.category}</td>
                  <td className="text-center">{row.statusIM}</td>
                  <td className="text-center">{row.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card w-full max-w-[50vh] mx-auto h-auto">
      <div className="card-body p-4 bg-white shadow-md rounded-lg">
        <div className="d-flex align-items-center gap-2 mb-3">
          <h6>Select Different MIS:</h6>
          <Select
            placeholder="Select Different MIS"
            options={Utils.MisOptions}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              container: (base) => ({ ...base, width: '250px' })
            }}
            className="user-role-select phone-input-country-code"
            defaultValue={Utils.MisOptions.find((option) => option.value === 1)}
            onChange={(option) => setSelectedOption(option.value)}
          />
        </div>
        <hr />

        {selectedOption === 1 && IMEITable}
        {selectedOption === 2 && VehicleTable}
        {selectedOption === 3 && SIMTable}
        {selectedOption === 4 && OfflineTable}
        {selectedOption === 5 && DaysToExpires}
        {selectedOption === 6 && MiliTrackEXP}
      </div>
    </div>
  );
};

export default MISSVTS2Collection;


