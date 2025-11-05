import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const CallTypeBaseUrl = `${Base_Url}/CallType`;

export const App_GetCallTypeLookupList = async () => {
  const url = `${CallTypeBaseUrl}/App_GetCallTypeLookupList`;

  const res = await getListWithAuthenticated(url);
  return res;
};