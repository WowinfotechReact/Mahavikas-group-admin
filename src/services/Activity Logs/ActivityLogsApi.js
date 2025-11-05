import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const ActivityLogBaseUrl = `${Base_Url}/ActivityLog`;


export const GetActivityLogList = async (params) => {
  let url = `${ActivityLogBaseUrl}/GetActivityLogList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
