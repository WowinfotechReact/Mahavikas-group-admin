import { MisTrackinOptions } from 'Middleware/Utils';
import React, { useState } from 'react';
import Select from 'react-select';

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
const PointQueryTableData = [
  { id: 1, registration: 'ABC123', sim: '123456789', imei: 'VTS001', deviceCommDate: 'ModelX' },
  { id: 2, registration: 'ABC123', sim: '123456789', imei: 'VTS001', deviceCommDate: 'ModelX' },
  { id: 3, registration: 'ABC123', sim: '123456789', imei: 'VTS001', deviceCommDate: 'ModelX' },
  { id: 4, registration: 'ABC123', sim: '123456789', imei: 'VTS001', deviceCommDate: 'ModelX' },
  { id: 5, registration: 'ABC123', sim: '123456789', imei: 'VTS001', deviceCommDate: 'ModelX' },
  { id: 6, registration: 'ABC123', sim: '123456789', imei: 'VTS001', deviceCommDate: 'ModelX' },
  { id: 7, registration: 'ABC123', sim: '123456789', imei: 'VTS001', deviceCommDate: 'ModelX' },
  { id: 8, registration: 'ABC123', sim: '123456789', imei: 'VTS001', deviceCommDate: 'ModelX' },
  { id: 9, registration: 'ABC123', sim: '123456789', imei: 'VTS001', deviceCommDate: 'ModelX' }
];

const NoDataTableObj = [
  {
    id: 1,
    registration: 'ABC123',
    days: '123456789',
    lastUpdate: 'VTS001',
    status: 'ModelX',
    sim: '2023-01-01',
    imei: '2025-01-01',
    modal: 'GPS',
    deviceCommDate: 'Active',
    cgmLive: '2024-12-01',
    trakinLive: '2024-12-01'
  },
  {
    id: 1,
    registration: 'ABC123',
    days: '123456789',
    lastUpdate: 'VTS001',
    status: 'ModelX',
    sim: '2023-01-01',
    imei: '2025-01-01',
    modal: 'GPS',
    deviceCommDate: 'Active',
    cgmLive: '2024-12-01',
    trakinLive: '2024-12-01'
  },
  {
    id: 1,
    registration: 'ABC123',
    days: '123456789',
    lastUpdate: 'VTS001',
    status: 'ModelX',
    sim: '2023-01-01',
    imei: '2025-01-01',
    modal: 'GPS',
    deviceCommDate: 'Active',
    cgmLive: '2024-12-01',
    trakinLive: '2024-12-01'
  },
  {
    id: 1,
    registration: 'ABC123',
    days: '123456789',
    lastUpdate: 'VTS001',
    status: 'ModelX',
    sim: '2023-01-01',
    imei: '2025-01-01',
    modal: 'GPS',
    deviceCommDate: 'Active',
    cgmLive: '2024-12-01',
    trakinLive: '2024-12-01'
  },
  {
    id: 1,
    registration: 'ABC123',
    days: '123456789',
    lastUpdate: 'VTS001',
    status: 'ModelX',
    sim: '2023-01-01',
    imei: '2025-01-01',
    modal: 'GPS',
    deviceCommDate: 'Active',
    cgmLive: '2024-12-01',
    trakinLive: '2024-12-01'
  },
  {
    id: 1,
    registration: 'ABC123',
    days: '123456789',
    lastUpdate: 'VTS001',
    status: 'ModelX',
    sim: '2023-01-01',
    imei: '2025-01-01',
    modal: 'GPS',
    deviceCommDate: 'Active',
    cgmLive: '2024-12-01',
    trakinLive: '2024-12-01'
  },
  {
    id: 1,
    registration: 'ABC123',
    days: '123456789',
    lastUpdate: 'VTS001',
    status: 'ModelX',
    sim: '2023-01-01',
    imei: '2025-01-01',
    modal: 'GPS',
    deviceCommDate: 'Active',
    cgmLive: '2024-12-01',
    trakinLive: '2024-12-01'
  },
  {
    id: 1,
    registration: 'ABC123',
    days: '123456789',
    lastUpdate: 'VTS001',
    status: 'ModelX',
    sim: '2023-01-01',
    imei: '2025-01-01',
    modal: 'GPS',
    deviceCommDate: 'Active',
    cgmLive: '2024-12-01',
    trakinLive: '2024-12-01'
  },
  {
    id: 1,
    registration: 'ABC123',
    days: '123456789',
    lastUpdate: 'VTS001',
    status: 'ModelX',
    sim: '2023-01-01',
    imei: '2025-01-01',
    modal: 'GPS',
    deviceCommDate: 'Active',
    cgmLive: '2024-12-01',
    trakinLive: '2024-12-01'
  },
  {
    id: 1,
    registration: 'ABC123',
    days: '123456789',
    lastUpdate: 'VTS001',
    status: 'ModelX',
    sim: '2023-01-01',
    imei: '2025-01-01',
    modal: 'GPS',
    deviceCommDate: 'Active',
    cgmLive: '2024-12-01',
    trakinLive: '2024-12-01'
  }
];

const MISTrackingCollection = () => {
  const [selectedOption, setSelectedOption] = useState(1); // Default to IMEI

  const IMEITable = (
    <div className=" w-full max-w-[50vh] mx-auto h-auto">
      <div className="  bg-white shadow-md rounded-lg">
        <div className="d-flex justify-content-between align-items-center mb-1 w-100">
          {/* Left Section: Title and Search Bar */}
          <div className="d-flex justify-content-start gap-3 align-items-center col-12 col-md-auto">
            <h4 className="text-nowrap">Trackin Duplicate IMEI </h4>
            <input
              style={{ width: '250px' }} // Adjust width as needed
              type="text"
              className="form-control mx-2"
              placeholder="Search.."
            />
          </div>

          <div className="d-flex gap-3 col-12 col-md-auto justify-content-end">
            <button className="btn btn-primary">Trackin Duplicate IMEI</button>
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
            <h4 className="text-nowrap">Trackin Duplicate Vehicle </h4>
            <input
              style={{ width: '250px' }} // Adjust width as needed
              type="text"
              className="form-control mx-2"
              placeholder="Search.."
            />
          </div>

          <div className="d-flex gap-3 col-12 col-md-auto justify-content-end">
            <button className="btn btn-primary">Trackin Duplicate Vehicle Number</button>
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
            <h4 className="text-nowrap">Tracking Duplicate Sim Number </h4>
            <input
              style={{ width: '250px' }} // Adjust width as needed
              type="text"
              className="form-control mx-2"
              placeholder="Search.."
            />
          </div>

          <div className="d-flex gap-3 col-12 col-md-auto justify-content-end">
            <button className="btn btn-primary">Tracking Duplicate Sim Number</button>
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
  const PointQueryTable = (
    <div className="w-full max-w-[50vh] mx-auto h-auto">
      <div className="  bg-white shadow-md rounded-lg">
        <div className="d-flex justify-content-between align-items-center mb-1 w-100">
          {/* Left Section: Title and Search Bar */}
          <div className="d-flex justify-content-start gap-3 align-items-center col-12 col-md-auto">
            <h4 className="text-nowrap">Trackin Point </h4>
            <input
              style={{ width: '250px' }} // Adjust width as needed
              type="text"
              className="form-control mx-2"
              placeholder="Search.."
            />
          </div>

          <div className="d-flex gap-3 col-12 col-md-auto justify-content-end">
            <button className="btn btn-primary"> Trackin Point Query</button>
            {/* <button className="btn btn-primary">Back</button> */}
          </div>
        </div>

        <div className="table-responsive" style={{ maxHeight: '48vh', overflowY: 'auto', position: 'relative' }}>
          <table className="table table-bordered table-striped">
            <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
              <tr>
                <th className="text-center">Sr No</th>
                <th className="text-center">Registration</th>
                <th className="text-center">Sim</th>
                <th className="text-center">IMEI</th>
                <th className="text-center">Device Comm Date</th>
              </tr>
            </thead>
            <tbody>
              {PointQueryTableData?.map((row, idx) => (
                <tr key={idx}>
                  <td className="text-center">{idx + 1}</td>
                  <td className="text-center">{row.registration}</td>
                  <td className="text-center">{row.sim}</td>
                  <td className="text-center">{row.imei}</td>
                  <td className="text-center">{row.deviceCommDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  const TrackingPointAvailable = (
    <div className="w-full max-w-[50vh] mx-auto h-auto">
      <div className="  bg-white shadow-md rounded-lg">
        <div className="d-flex justify-content-between align-items-center mb-1 w-100">
          {/* Left Section: Title and Search Bar */}
          <div className="d-flex justify-content-start gap-3 align-items-center col-12 col-md-auto">
            <h4 className="text-nowrap">Trackin Point Availability </h4>
            <input
              style={{ width: '250px' }} // Adjust width as needed
              type="text"
              className="form-control mx-2"
              placeholder="Search.."
            />
          </div>

          <div className="d-flex gap-3 col-12 col-md-auto justify-content-end">
            <button className="btn btn-primary"> Trackin Point Availability</button>
            {/* <button className="btn btn-primary">Back</button> */}
          </div>
        </div>

        <div className="table-responsive" style={{ maxHeight: '48vh', overflowY: 'auto', position: 'relative' }}>
          <table className="table table-bordered table-striped">
            <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
              <tr>
                <th className="text-center">Sr No</th>
                <th className="text-center">Registration</th>
                <th className="text-center">Sim</th>
                <th className="text-center">IMEI</th>
                <th className="text-center">Device Comm Date</th>
              </tr>
            </thead>
            <tbody>
              {PointQueryTableData?.map((row, idx) => (
                <tr key={idx}>
                  <td className="text-center">{idx + 1}</td>
                  <td className="text-center">{row.registration}</td>
                  <td className="text-center">{row.sim}</td>
                  <td className="text-center">{row.imei}</td>
                  <td className="text-center">{row.deviceCommDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  const NoDataTable = (
    <div className="w-full max-w-[50vh] mx-auto h-auto">
      <div className="  bg-white shadow-md rounded-lg">
        <div className="d-flex justify-content-between align-items-center mb-1 w-100">
          {/* Left Section: Title and Search Bar */}
          <div className="d-flex justify-content-start gap-3 align-items-center col-12 col-md-auto">
            <h4 className="text-nowrap">Trackin No Data </h4>
            <input
              style={{ width: '250px' }} // Adjust width as needed
              type="text"
              className="form-control mx-2"
              placeholder="Search.."
            />
          </div>

          <div className="d-flex gap-3 col-12 col-md-auto justify-content-end">
            <button className="btn btn-primary"> Trackin No Data</button>
            {/* <button className="btn btn-primary">Back</button> */}
          </div>
        </div>
        <div className="table-responsive" style={{ maxHeight: '48vh', overflowY: 'auto', position: 'relative' }}>
          <table className="table table-bordered table-striped">
            <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1 }}>
              <tr>
                <th className="text-center">Sr No</th>
                <th className="text-center">Registration</th>
                <th className="text-center">Days</th>
                <th className="text-center">last Update</th>
                <th className="text-center">Status</th>
                <th className="text-center">Sim</th>
                <th className="text-center">IMEI</th>
                <th className="text-center">Modal</th>
                <th className="text-center">Device Comm Date</th>
                <th className="text-center">CGM Live</th>
                <th className="text-center">Trakin Live</th>
              </tr>
            </thead>
            <tbody>
              {NoDataTableObj?.map((row, idx) => (
                <tr key={idx}>
                  <td className="text-center">{idx + 1}</td>
                  <td className="text-center">{row.registration}</td>
                  <td className="text-center">{row.days}</td>
                  <td className="text-center">{row.lastUpdate}</td>
                  <td className="text-center">{row.status}</td>
                  <td className="text-center">{row.sim}</td>
                  <td className="text-center">{row.imei}</td>
                  <td className="text-center">{row.modal}</td>
                  <td className="text-center">{row.deviceCommDate}</td>
                  <td className="text-center">{row.cgmLive}</td>
                  <td className="text-center">{row.trakinLive}</td>
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
            options={MisTrackinOptions}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              container: (base) => ({ ...base, width: '250px' })
            }}
            className="user-role-select phone-input-country-code"
            defaultValue={MisTrackinOptions.find((option) => option.value === 1)}
            onChange={(option) => setSelectedOption(option.value)}
          />
        </div>
        <hr />

        {selectedOption === 1 && IMEITable}
        {selectedOption === 2 && VehicleTable}
        {selectedOption === 3 && SIMTable}
        {selectedOption === 4 && PointQueryTable}
        {selectedOption === 5 && TrackingPointAvailable}
        {selectedOption === 6 && NoDataTable}
      </div>
    </div>
  );
};

export default MISTrackingCollection;
