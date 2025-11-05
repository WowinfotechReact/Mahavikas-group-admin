import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const ManufacturerModalBaseUrl = `${Base_Url}/Manufacturer`;


export const GetManufacturerModelList = async (params) => {
  let url = `${ManufacturerModalBaseUrl}/GetManufacturerList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateManufacturerModelApi = async (url = '', params) => {
  if (params.manufacturerKeyID === null || params.manufacturerKeyID === undefined) {
    delete params.manufacturerKeyID;
  }

  const res = await postApiWithAuthenticated(`${ManufacturerModalBaseUrl}${url}`, params);
  return res;
};


export const GetManufacturerModel = async (id) => {
    let url = `${ManufacturerModalBaseUrl}/GetManufacturerModel?ManufacturerkeyID=${id}`;  
    const res = await getListWithAuthenticated(url);
    return res;
  };

  
  
  
export const ChangeManufacturerStatus = async (id,UserKeyID) => {
    let url = `${ManufacturerModalBaseUrl}/ChangeManufacturerStatus?ManufacturerkeyID=${id}&UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };