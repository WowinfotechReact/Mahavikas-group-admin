import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const AMCBaseURL = `${Base_Url}/AMC`;

export const GetAMCList = async (params) => {
  const url = `${AMCBaseURL}/GetAMCList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetWarrantyVisitScheduleList = async (params) => {
  const url = `${AMCBaseURL}/GetWarrantyVisitScheduleList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetAMCVisitScheduleList = async (params) => {
  const url = `${AMCBaseURL}/GetAMCVisitScheduleList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetWarrantyExpiredReportList = async (params) => {
  const url = `${AMCBaseURL}/GetWarrantyExpiredReportList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetCompletedAMCDataList = async (params) => {
  const url = `${AMCBaseURL}/GetAMCCompletedList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateAMCApi = async (params) => {
  const url = `${AMCBaseURL}/AddUpdateAMC`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetAMCModel = async (id) => {
  const url = `${AMCBaseURL}/GetAMCModel?AMCKeyID=${id}`;
  const res = await getListWithAuthenticated(url);
  return res;
};
export const GetAMCQuotationDetails = async (id) => {
  const url = `${AMCBaseURL}/GetAMCQuotationDetails?AMCKeyID=${id}`;
  const res = await getListWithAuthenticated(url);
  return res;
};
export const GetWarrantyVisitDateList = async (id, WarrantyInMonthID) => {
  const url = `${AMCBaseURL}/GetWarrantyVisitDateList?FirstVisitDate=${id}&WarrantyInMonthID=${WarrantyInMonthID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};


export const AMCAppprovedRejectedByAdmin = async (params) => {
  const url = `${AMCBaseURL}/AMCAppprovedRejectedByAdmin`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
