import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const CommandBaseUrl = `${Base_Url}/Command`;


export const GetCommandList = async (params) => {
  let url = `${CommandBaseUrl}/GetCommandList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateCommandApi = async (url = '', params) => {
  if (params.CommandKeyID === null || params.CommandKeyID === undefined) {
    delete params.CommandKeyID;
  }

  const res = await postApiWithAuthenticated(`${CommandBaseUrl}${url}`, params);
  return res;
};


export const GetVehicleTypeModel = async (id) => {
    let url = `${CommandBaseUrl}/GetVehicleTypeModel?VehicleTypeKeyID=${id}`;  
    const res = await getListWithAuthenticated(url);
    return res;
  };

 

 
  
  
  
