import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const MasterSimOperatorBaseUrl = `${Base_Url}/SimOperator`;



export const GetSimOperatorLookupList = async () => {
    const url = `${MasterSimOperatorBaseUrl}/GetSimOperatorLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };
  
