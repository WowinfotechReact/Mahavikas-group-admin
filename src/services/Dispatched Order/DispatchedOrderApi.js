import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated,getListWithAuthenticated } from "services/ApiMethod/ApiMethod";


const DispatchOrderApiBaseURI = `${Base_Url}/DispatchOrder`;



  export const AddUpdateDispatchOrder = async (url = '', params) => {
      
    const res = await postApiWithAuthenticated(`${DispatchOrderApiBaseURI}${url}`, params);
    return res;
  };
  export const AddUpdateReplacementUnderWarranty = async (url = '', params) => {
      
    const res = await postApiWithAuthenticated(`${DispatchOrderApiBaseURI}${url}`, params);
    return res;
  };