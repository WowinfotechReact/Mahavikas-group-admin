import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const ManufacturerBaseUrl = `${Base_Url}/Manufacturer`;


export const GetManufacturerList = async (params) => {
  let url = `${ManufacturerBaseUrl}/GetManufacturerList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateManufacturerApi = async (url = '', params) => {
  if (params.manufacturerKeyID === null || params.manufacturerKeyID === undefined) {
    delete params.manufacturerKeyID;
  }

  const res = await postApiWithAuthenticated(`${ManufacturerBaseUrl}${url}`, params);
  return res;
};


export const GetManufacturerNModel = async (id) => {
    let url = `${ManufacturerBaseUrl}/GetManufacturerModel?ManufacturerKeyID=${id}`;  
    const res = await getListWithAuthenticated(url);
    return res;
  };

 

 
  
  
  
