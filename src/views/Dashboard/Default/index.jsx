import React, { useState, useContext, useEffect } from 'react';
import Select from 'react-select';
import { Fade } from "react-bootstrap"; // optional fade animation
import './dash.css'
import dayjs from 'dayjs';
// material-ui
import { useTheme } from '@mui/material/styles';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import PersonIcon from '@mui/icons-material/Person';


import 'react-calendar/dist/Calendar.css';
// import 'react-date-picker/dist/DatePicker.css';
import DatePicker from 'react-date-picker';

import { ConfigContext } from 'context/ConfigContext';
import { useNavigate } from 'react-router';
import { GetAdminDashboardCount } from '../../../services/dashboard/DashboardApi';

import { FaUsers, FaProjectDiagram, FaUniversity, FaUserTie, FaDownload, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import AddUpdateEmployeeModal from 'views/Employee/AddUpdateEmployeeModal';
import ProductAddUpdateModal from 'views/Product/ProductAddUpdateModal'
// ==============================|| DASHBOARD DEFAULT ||============================== //

const Default = () => {
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false)
  const theme = useTheme();
  const { setLoader, user, companyID } = useContext(ConfigContext);

  console.log(companyID, '333333swsssssss')
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showDateFilters, setShowDateFilters] = useState(false);
  const [dashboardCount, setDashboardCount] = useState([]);
  const [openProductModal, setOpenProductModal] = useState(false);

  useEffect(() => {
    DashboardCountData(null, null);
  }, []);
  const [modelRequestData, setModelRequestData] = useState({
    Action: null,
  })

  const addProductBtnClick = () => {
    setModelRequestData({ Action: null, });
    // setLastActionType('Add');
    setOpenProductModal(true);
  };

  const handleToDateChange = (newValue) => {
    if (newValue && dayjs(newValue).isValid()) {
      const newToDate = dayjs(newValue);
      setToDate(newToDate);

      if (fromDate && newToDate.isBefore(fromDate)) {
        setFromDate(newToDate.subtract(1, 'day'));
      }
      DashboardCountData(fromDate, newToDate);
    } else {
      setToDate(null);
      DashboardCountData(fromDate, null);
    }
  };

  const handleFromDateChange = (newValue) => {
    if (newValue && dayjs(newValue).isValid()) {
      const newFromDate = dayjs(newValue);
      setFromDate(newFromDate);

      if (toDate && newFromDate.isAfter(toDate)) {
        setToDate(newFromDate.add(1, 'day'));
      } // Fixed: Pass fromDate first, then toDate to DashboardCountData
      DashboardCountData(newFromDate, toDate);
    } else {
      setFromDate(null);
      DashboardCountData(null, toDate);
    }
  };

  const handleClearDates = () => {
    setFromDate(null);
    setToDate(null);
    DashboardCountData(null, null);
  };

  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation when mounted
    setTimeout(() => setShow(true), 100);
  }, []);

  const DashboardCountData = async (startDate, endDate, i) => {
    setDashboardCount([]);
    if (startDate !== undefined && endDate !== undefined) {
    }
    setLoader(true);
    try {
      const StartDate = startDate === null ? null : startDate.format('YYYY-MM-DD');
      const EndDate = endDate === null ? null : endDate.format('YYYY-MM-DD');

      const response = await GetAdminDashboardCount({
        pageNo: 0,
        pageSize: 30,
        fromDate: StartDate,
        toDate: EndDate,
        companyID: Number(companyID),
        userID: user.userID,
      });

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (startDate !== undefined && endDate !== undefined) {
          }
          if (response?.data?.responseData?.data) {
            const DashboardNumb = response?.data?.responseData?.data;
            setDashboardCount(DashboardNumb);
          }
        } else {
          setLoader(false);
          if (startDate !== undefined && endDate !== undefined) {
          }
          setErrorMessage(response?.data?.errorMessage);
          setLoader(false);
        }

        return response;
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
      if (startDate !== undefined && endDate !== undefined) {
        setLoader(false);
      }
    }
  };
  const navigate = useNavigate()

  const VehicleAddBtnClicked = () => {

    setModelRequestData({
      ...modelRequestData,
      employeeKeyID: null,
      Action: null
    });
    setShowEmployeeModal(true);
  };
  const stats = [
    { id: 1, title: 'Total Contractual Employee', value: dashboardCount.totalContractualEmployees, icon: <FaUsers size={28} />, colorClass: 'bg-warning' },
    { id: 2, title: 'Total Projects', value: dashboardCount.totalProjects, icon: <FaProjectDiagram size={28} />, colorClass: 'bg-danger', route: '/project' },
    { id: 3, title: 'Total Institutes', value: dashboardCount.totalInstitutes, icon: <FaUniversity size={28} />, colorClass: 'bg-warning', },
    { id: 4, title: 'Total Employees', value: dashboardCount.totalEmployees, icon: <FaUserTie size={28} />, colorClass: 'bg-success', route: '/employee-list' },
    { id: 5, title: 'Total Admin', value: dashboardCount.totalAdmin, icon: <FaUserTie size={28} />, colorClass: 'bg-danger ', route: '/admin-employee' },
    { id: 6, title: 'Total Super Admin', value: dashboardCount.totalSuperAdmin, icon: <FaUserTie size={28} />, colorClass: 'bg-warning ', route: '/admin-employee' },
    { id: 7, title: 'Total Site Engineers', value: dashboardCount.totalSiteEngineers, icon: <FaUserTie size={28} />, colorClass: 'bg-danger ', route: '/employee-list' }
  ];
  return (
    <div className="gov-dashboard container-fluid py-4">
      <header className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="brand d-flex align-items-center gap-3">
            <div className="brand-logo">🏛️</div>
            <div>
              <h4 className="mb-0">{ } Dashboard</h4>
              {/* <small className="text-muted">{user?.companyName} — Administrative Panel</small> */}
            </div>
          </div>
        </div>


        <div className="d-flex align-items-center gap-2">
          <div className="input-group me-2">

            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                alignItems: 'center',
                // flexWrap: 'wrap',

              }}
            >
              <DatePicker
                className="date-picker-input text-nowrap  "
                label="From Date"
                value={fromDate ? fromDate.toDate() : null}
                onChange={handleFromDateChange}
                clearIcon={null}
                maxDate={toDate ? dayjs(toDate).toDate() : null}
              />
              {/* DatePicker - To */}
              <DatePicker
                minDate={fromDate ? dayjs(fromDate).toDate() : null}
                className="date-picker-input text-nowrap"
                label="To Date"
                value={toDate ? toDate.toDate() : null}
                onChange={handleToDateChange}
                clearIcon={null}
              />
              <button onClick={() => handleClearDates()} style={{ background: '#ffaa33', color: 'white' }} className="btn  btn-sm d-none d-sm-inline ">

                Clear
              </button>
            </div>

          </div>





        </div>
      </header>
      <section className="mb-4">
        <div className="row g-3">
          {stats.map(item => (
            <div key={item.id} className="col-xl-3 col-md-6" onClick={() => navigate(item.route)}>
              <div className="card shadow-sm h-100 hover-card" role="button" tabIndex={0}>
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    {/* <h5 className="card-title mb-1">{item.title}</h5> */}
                    <p className="display-6 fw-bold mb-0">{item.value}</p>
                    {/* <small className="text-muted">Compared to last month</small> */}
                  </div>
                  <div className={`avatar ${item.colorClass}`}>{item.icon}</div>
                </div>
                <div className={`card-footer small text-white ${item.colorClass}`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{item.title}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <div className="row">
          <div className="col-lg-8 mb-3">

          </div>


        </div>
      </section>
      {/* <footer className="mt-4 text-center small text-muted">
        © {new Date().getFullYear()} Government Project — Maha Vikas Group
      </footer> */}
      {showEmployeeModal && (
        <AddUpdateEmployeeModal
          show={showEmployeeModal}
          onHide={() => {
            setShowEmployeeModal(false);
            // handleClose();
          }}
          modelRequestData={modelRequestData}
          setModelRequestData={setModelRequestData}
          isAddUpdateActionDone={isAddUpdateActionDone}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}



        />


      )}

      {openProductModal && (
        <ProductAddUpdateModal
          show={openProductModal}
          onHide={() => setOpenProductModal(false)}
          modelRequestData={modelRequestData}
          setModelRequestData={setModelRequestData}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        />
      )}
    </div>
  );
};

export default Default;
