import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const PermissionBaseUrl = `${Base_Url}/Permissions`;


export const GetPermisionModuleList = async () => {
    const url = `${PermissionBaseUrl}/GetPermissionModel`;
    const res = await getListWithAuthenticated(url);
    return res;
  };

  export const AddUpdateDefaultPermissions = async (url = '', params) => {
   
    const res = await postApiWithAuthenticated(`${PermissionBaseUrl}${url}`, params);
    return res;
  };