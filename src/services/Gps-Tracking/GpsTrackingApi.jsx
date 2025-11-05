import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated,getListWithAuthenticated } from "services/ApiMethod/ApiMethod";

const MachineBaseUrl = Base_Url;
// Machine/GetMachineList
export const GetMachineList = async (params) => {
    let url= `${MachineBaseUrl}/Machine/GetMachineList`
    
  const res = await postApiWithAuthenticated(
  url ,
    params
  );
  return res;
};
export const AddUpdateMachineApi = async (url = '', params) => {
    if (params.machineID === null || params.machineID === undefined) {
      delete params.machineID;
    }
  
    const res = await postApiWithAuthenticated(`${MachineBaseUrl}${url}`, params);
    return res;
  };
  
  
  export const GetMachineModel = async (id) => {
    let url = `${MachineBaseUrl}/Machine/GetMachineModel?MachineID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };
  

 

