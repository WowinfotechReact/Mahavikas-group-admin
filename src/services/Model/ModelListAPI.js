import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const ModelBaseUrl = `${Base_Url}/Model`;
const ManufacturerModalBaseUrl = `${Base_Url}/Manufacturer`;


export const GetModelList = async (params,productKeyID) => {
  let url = `${ModelBaseUrl}/GetModelList?productKeyID=${productKeyID}`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetAllModelList = async (params) => {
  let url = `${ModelBaseUrl}/GetAllModelList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateModelApi = async (url = '', params) => {
  if (params.ModelID === null || params.ModelID === undefined) {
    delete params.ModelID;
  }

  const res = await postApiWithAuthenticated(`${ModelBaseUrl}${url}`, params);
  return res;
};


export const GetModelByID = async (id) => {
    let url = `${ModelBaseUrl}/GetModelModel?ModelKeyID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };


  export const GetModelLookupList = async (manufacturerID = null, productID = null, variantID = null) => {
    let url = `${ModelBaseUrl}/GetModelLookupList`;
    const queryParams = [];
  
    if (manufacturerID) queryParams.push(`manufacturerID=${manufacturerID}`);
    if (productID) queryParams.push(`productID=${productID}`);
    if (variantID) queryParams.push(`variantID=${variantID}`);
  
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
  
    const res = await getListWithAuthenticated(url);
    return res;
  };
  
  

  
  export const GetManufacturerLookupList = async (productID) => {
    let url = `${ManufacturerModalBaseUrl}/GetManufacturerLookupList`; // change from const to let
  
    if (productID) {
      url += `?productID=${productID}`;
    }
  
    const res = await getListWithAuthenticated(url);
    return res;
  };
  
  
  
  export const ChangeModelStatus = async (id,UserKeyID) => {
    let url = `${ModelBaseUrl}/ChangeModelStatus?ModelKeyID=${id}&UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };