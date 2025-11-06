import React, { useState, useContext, useEffect } from 'react';
import Select from 'react-select';
import dayjs from 'dayjs';
// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Card, CardHeader, CardContent, Typography, Divider, LinearProgress } from '@mui/material';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import PersonIcon from '@mui/icons-material/Person';

import LocationCityIcon from '@mui/icons-material/LocationCity';
//project import
import SalesLineCard from 'views/Dashboard/card/SalesLineCard';
import SalesLineCardData from 'views/Dashboard/card/sale-chart-1';
import RevenuChartCard from 'views/Dashboard/card/RevenuChartCard';
import RevenuChartCardData from 'views/Dashboard/card/revenu-chart';
import ReportCard from './ReportCard';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import { gridSpacing } from 'config.js';

import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

import 'react-calendar/dist/Calendar.css';
// import 'react-date-picker/dist/DatePicker.css';
import DatePicker from 'react-date-picker';

import { CalenderFilter } from 'Middleware/Utils';
import { CalenderFilterEnum } from 'Middleware/Enum';
import { ConfigContext } from 'context/ConfigContext';
import { useNavigate } from 'react-router';
import BatteryChargingFullTwoToneIcon from '@mui/icons-material/BatteryChargingFullTwoTone';
import PowerTwoToneIcon from '@mui/icons-material/PowerTwoTone';
import BuildCircleTwoToneIcon from '@mui/icons-material/BuildCircleTwoTone';
import SupportAgentTwoToneIcon from '@mui/icons-material/SupportAgentTwoTone';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { GetAdminDashboardCount } from '../../../services/dashboard/DashboardApi';

// custom style
const FlatCardBlock = styled((props) => <Grid item sm={6} xs={12} {...props} />)(({ theme }) => ({
  padding: '25px 25px',
  borderLeft: '1px solid' + theme.palette.background.default,
  [theme.breakpoints.down('sm')]: {
    borderLeft: 'none',
    borderBottom: '1px solid' + theme.palette.background.default
  },
  [theme.breakpoints.down('md')]: {
    borderBottom: '1px solid' + theme.palette.background.default
  }
}));

// ==============================|| DASHBOARD DEFAULT ||============================== //

const Default = () => {
  const theme = useTheme();
  const { setLoader, user, companyID } = useContext(ConfigContext);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showDateFilters, setShowDateFilters] = useState(false);
  const [dashboardCount, setDashboardCount] = useState([]);

  useEffect(() => {
    DashboardCountData(null, null);
  }, []);

  const handleCalenderFilterChange = async (selectedOption) => {
    setSelectedOption(selectedOption);
    setToDate(null);
    setFromDate(null);
    setShowDateFilters(false);

    let startDate;
    let endDate;

    switch (selectedOption.value) {
      case CalenderFilterEnum.All:
        startDate = null;
        endDate = null;
        break;
      case CalenderFilterEnum.This_Week:
        startDate = dayjs().startOf('week');
        endDate = dayjs().endOf('week');

        break;
      case CalenderFilterEnum.Last_Week:
        startDate = dayjs().subtract(1, 'week').startOf('week');
        endDate = dayjs().subtract(1, 'week').endOf('week');
        break;
      case CalenderFilterEnum.This_Month:
        startDate = dayjs().startOf('month');
        endDate = dayjs().endOf('month');
        break;
      case CalenderFilterEnum.Last_Month:
        startDate = dayjs().subtract(1, 'month').startOf('month');
        endDate = dayjs().subtract(1, 'month').endOf('month');
        break;
      case CalenderFilterEnum.This_Quarter:
        startDate = dayjs().startOf('quarter');
        endDate = dayjs().endOf('quarter');
        break;
      case CalenderFilterEnum.Last_Quarter:
        startDate = dayjs().subtract(1, 'quarter').startOf('quarter');
        endDate = dayjs().subtract(1, 'quarter').endOf('quarter');
        break;
      case CalenderFilterEnum.This_6_Months:
        startDate = dayjs().subtract(5, 'months').startOf('month');
        endDate = dayjs().endOf('month');
        break;
      case CalenderFilterEnum.Last_6_Months:
        startDate = dayjs().subtract(11, 'months').startOf('month');
        endDate = dayjs().subtract(6, 'months').endOf('month');
        break;
      case CalenderFilterEnum.This_Year:
        startDate = dayjs().startOf('year');
        endDate = dayjs().endOf('year');
        break;
      case CalenderFilterEnum.Last_Year:
        startDate = dayjs().subtract(1, 'year').startOf('year');
        endDate = dayjs().subtract(1, 'year').endOf('year');
        break;
      case CalenderFilterEnum.Custom_Date_Range:
        setShowDateFilters(true);
        return; // Exit the function to avoid calling the API with undefined dates
      default:
        return;
    }
    // Call the API with the calculated date range
    await DashboardCountData(startDate, endDate);
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
  };

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
        userKeyID: user.userKeyID,
        companyKeyID: companyID
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
  return (
    <Grid container spacing={gridSpacing}>

      <Grid sm={12} item>
        <div
          style={{
            display: 'flex',
            gap: '112px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          {' '}
          <div>
            <Select
              options={CalenderFilter}
              value={selectedOption}
              onChange={handleCalenderFilterChange}
              styles={{
                container: (provided) => ({
                  ...provided,
                  width: '320px',
                  minWidth: '320px'
                })
              }}
            />
          </div>
          {showDateFilters && (
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
              <button className="btn btn-primary customBtn" onClick={handleClearDates}>
                Clear
              </button>
            </div>
          )}
        </div>
      </Grid>
      <Grid item xs={12}>
        <h5 className='mb-2'>Company 1  Data</h5>
        <Grid container spacing={gridSpacing}>
          <Grid style={{ cursor: 'pointer' }} item lg={3} sm={6} xs={12}>
            <div >
              <ReportCard
                primary={23}
                secondary="Total User"
                color={theme.palette.warning.main}
                footerData="Total User"
                iconPrimary={SupervisedUserCircleIcon}
              // iconFooter={}
              />
            </div>
          </Grid>
          <Grid style={{ cursor: 'pointer' }} item lg={3} sm={6} xs={12}>
            <div >
              <ReportCard
                primary={4}
                secondary="Total Project"
                color={theme.palette.error.main}
                footerData="Total Project"
                iconPrimary={AccountTreeIcon}
                iconFooter={TrendingDownIcon}
              />
            </div>
          </Grid>
          <Grid style={{ cursor: 'pointer' }} item lg={3} sm={6} xs={12}>
            <div >
              <ReportCard
                primary={3}
                secondary="Total Institute"
                color={theme.palette.info.main}
                footerData="Total Institute"
                iconPrimary={LocationCityIcon}
                iconFooter={TrendingDownIcon}
              />
            </div>
          </Grid>
          <Grid style={{ cursor: 'pointer' }} item lg={3} sm={6} xs={12}>
            <div >
              <ReportCard
                primary={40}
                secondary="Total Employee"
                color={theme.palette.success.main}
                footerData="Total Employee"
                iconPrimary={PersonIcon}
                iconFooter={TrendingDownIcon}
              />
            </div>
          </Grid>



          {/* <Grid style={{ cursor: 'pointer' }} item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={dashboardCount?.purchaseOrder}
              secondary="Purchase Order"
              color={theme.palette.primary.dark}
              footerData="1k Purchase Order"
              iconPrimary={ThumbUpAltTwoTone}
              iconFooter={TrendingUpIcon}
            />
          </Grid> */}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          {/* <Grid item lg={8} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12}>
                    <SalesLineCard
                      chartData={SalesLineCardData}
                      title="Sales Per Day"
                      percentage="3%"
                      icon={<TrendingDownIcon />}
                      footerData={[
                        {
                          value: '$4230',
                          label: 'Total Revenue'
                        },
                        {
                          value: '321',
                          label: 'Today Sales'
                        }
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ display: { md: 'block', sm: 'none' } }}>
                    <Card>
                      <CardContent sx={{ p: '0 !important' }}>
                        <Grid container alignItems="center" spacing={0}>
                          <FlatCardBlock>
                            <Grid container alignItems="center" spacing={1}>
                              <Grid item>
                                <Typography variant="subtitle2" align="left">
                                  REALTY
                                </Typography>
                              </Grid>
                              <Grid item sm zeroMinWidth>
                                <Typography variant="h5" sx={{ color: theme.palette.error.main }} align="right">
                                  -0.99
                                </Typography>
                              </Grid>
                            </Grid>
                          </FlatCardBlock>
                          <FlatCardBlock>
                            <Grid container alignItems="center" spacing={1}>
                              <Grid item>
                                <Typography variant="subtitle2" align="left">
                                  INFRA
                                </Typography>
                              </Grid>
                              <Grid item sm zeroMinWidth>
                                <Typography variant="h5" sx={{ color: theme.palette.success.main }} align="right">
                                  -7.66
                                </Typography>
                              </Grid>
                            </Grid>
                          </FlatCardBlock>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <RevenuChartCard chartData={RevenuChartCardData} />
              </Grid>
            </Grid>
          </Grid> */}
          {/* <Grid item lg={4} xs={12}>
            <Card>
              <CardHeader
                title={
                  <Typography component="div" className="card-header">
                    Traffic Sources
                  </Typography>
                }
              />
              <Divider />
              <CardContent>
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item sm zeroMinWidth>
                        <Typography variant="body2">Direct</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" align="right">
                          80%
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress variant="determinate" aria-label="direct" value={80} color="primary" />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item sm zeroMinWidth>
                        <Typography variant="body2">Social</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" align="right">
                          50%
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress variant="determinate" aria-label="Social" value={50} color="secondary" />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item sm zeroMinWidth>
                        <Typography variant="body2">Referral</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" align="right">
                          20%
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress variant="determinate" aria-label="Referral" value={20} color="primary" />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item sm zeroMinWidth>
                        <Typography variant="body2">Bounce</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" align="right">
                          60%
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress variant="determinate" aria-label="Bounce" value={60} color="secondary" />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item sm zeroMinWidth>
                        <Typography variant="body2">Internet</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" align="right">
                          40%
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress variant="determinate" aria-label="Internet" value={40} color="primary" />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid> */}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Default;
