import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const MvgEmployeeBaseURI = `${Base_Url}/MvgEmployee`;

export const GetMvgEmployeeReportList = async (params) => {
  let url = `${MvgEmployeeBaseURI}/GetMvgEmployeeReportList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
