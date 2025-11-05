import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const MasterRoleTypeBaseUrl = `${Base_Url}/RoleType`;



export const GetRoleTypeLookupList = async (UserKeyID) => {
    const url = `${MasterRoleTypeBaseUrl}/GetRoleTypeLookupList?UserKeyID=${UserKeyID}`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };
  
