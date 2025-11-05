import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated,getListWithAuthenticated } from "services/ApiMethod/ApiMethod";


const AcceptDeviceTabBaseUrl = `${Base_Url}/Device`;



export const GetAcceptDeviceList = async (params) => {
  let url = `${AcceptDeviceTabBaseUrl}/GetAcceptDeviceList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};


  

  export const AddUpdateDeviceAcceptance = async (url = '', params) => {
      
    const res = await postApiWithAuthenticated(`${AcceptDeviceTabBaseUrl}${url}`, params);
    return res;
  };