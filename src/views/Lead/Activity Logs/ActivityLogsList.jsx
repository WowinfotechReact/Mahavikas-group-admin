

import React, { useContext, useEffect, useState } from 'react';
import "./ActivityLogs.css";
import { GetActivityLogList } from "services/Activity Logs/ActivityLogsApi";
import { ConfigContext } from "context/ConfigContext";
import { useLocation, useNavigate } from 'react-router';

const ActivityLogsList = () => {



      const [searchKeyword, setSearchKeyword] = useState(null);
      const [totalCount, setTotalCount] = useState(null);
      const [totalPages, setTotalPages] = useState(1);
      const [leadListData, setLeadListData] = useState([]);
      const [totalRecords, setTotalRecords] = useState(-1);

      const [pageSize, setPageSize] = useState(30);

      const { user, setLoader, companyID, permissions } = useContext(ConfigContext);
      const location = useLocation();
      const leadName = location?.state?.leadName || "Lead";
      const leadID = location?.state?.leadID || "Lead";


      useEffect(() => {
            GetActivityLogListData(1, null, null, null, null, null)
      }, [location.state])

      const GetActivityLogListData = async (pageNumber, searchKeywordValue, toDate, fromDate, sortingType, sortValueName,) => {
            setLoader(true);
            try {
                  const response = await GetActivityLogList({
                        pageNo: pageNumber - 1,
                        pageSize: pageSize,
                        sortingDirection: sortingType ? sortingType : null, //or null
                        sortingColumnName: sortValueName ? sortValueName : null, //or null
                        searchKeyword: searchKeywordValue === undefined || searchKeywordValue === null ? searchKeyword : searchKeywordValue,
                        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
                        userKeyID: user.userKeyID,
                        leadKeyID: location?.state?.leadKeyID

                  });

                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false);
                              if (response?.data?.responseData?.data) {
                                    const leadList = response.data.responseData.data;
                                    const totalCount = response.data.totalCount;

                                    setTotalCount(totalCount);
                                    setTotalPages(Math.ceil(totalCount / pageSize));
                                    setLeadListData(leadList);
                                    setTotalRecords(leadList?.length);
                              }
                        } else {
                              console.error(response?.data?.errorMessage);
                              setLoader(false);
                        }
                  }
            } catch (error) {
                  setLoader(false);
                  console.log(error);
            }
      };
      const navigate = useNavigate()


      const [loading, setLoading] = useState(true);


      return (
            <div className="container mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                        <button
                              className="btn btn-sm btn-outline-secondary ms-3"
                              onClick={() => navigate(-1)}
                        >
                              ← Back
                        </button>
                        <h4 className="text-center flex-grow-1">
                              Activity Logs  <span style={{ color: '#ffaa33' }}>{leadName} - {leadID}</span>
                        </h4>


                  </div>

                  {leadListData && leadListData.length > 0 ? (
                        <div className="timeline-alt">
                              {leadListData.slice(0, 50).map((event, index) => (
                                    <div
                                          className={`timeline-step ${index % 2 === 0 ? "left" : "right"}`}
                                          key={index}
                                    >
                                          <div className="timeline-dot"></div>
                                          <div className="timeline-info">
                                                <small className="text-muted d-block">{event.logDateTime}</small>
                                                <span >{event.logMessage}</span>
                                          </div>
                                    </div>
                              ))}
                        </div>
                  ) : (
                        <div className="no-records-container text-center py-5">
                              <h5 className="text-secondary mb-2">
                                    No activity logs found for <span style={{ color: '#ffaa33' }}>{leadName}</span>
                              </h5>
                              <p className="text-muted">This lead does not have any recorded updates yet.</p>
                              <button
                                    className="btn mt-3"
                                    style={{
                                          color: "#ffaa33",
                                          borderColor: "#ffaa33"
                                    }}
                                    onClick={() => navigate(-1)}
                              >
                                    ← Back
                              </button>
                        </div>
                  )}
            </div>



      );
};

export default ActivityLogsList;
