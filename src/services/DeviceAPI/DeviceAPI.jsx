import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const DeviceBaseURL = `${Base_Url}/IMEI`;

export const GetDeviceIMEILookupList = async (id,companyID) => {
  const url = `${DeviceBaseURL}/GetIMEILookupList?CustomerID=${id}&CompanyKeyID=${companyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};
