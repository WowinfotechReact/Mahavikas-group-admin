import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const MasterBloodGrpBaseUrl = `${Base_Url}/BloodGroup`;



export const GetBloodGroupLookupList = async () => {
  const url = `${MasterBloodGrpBaseUrl}/GetBloodGroupLookupList`;

  const res = await getListWithAuthenticated(url);
  return res;
};

