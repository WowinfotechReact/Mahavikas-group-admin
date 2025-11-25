import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const AttendanceBaseURI = `${Base_Url}/AttendanceReport`;
const BaseURI = `${Base_Url}/Attendance`;

export const GetAttendanceReportList = async (params) => {
  const url = `${AttendanceBaseURI}/GetAttendanceReportList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateAttendanceSheet  = async (url = '', params) => {
 


  const res = await postApiWithAuthenticated(`${BaseURI}${url}`, params);
  return res;
};