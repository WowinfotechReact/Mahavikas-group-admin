import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const ProductBaseUrl = `${Base_Url}/Product`;


export const GetProductList = async (params) => {
  let url = `${ProductBaseUrl}/GetProductList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateProductApi = async (url = '', params) => {
  if (params.ProductID === null || params.ProductID === undefined) {
    delete params.ProductID;
  }

  const res = await postApiWithAuthenticated(`${ProductBaseUrl}${url}`, params);
  return res;
};


export const GetProductModel = async (id) => {
    let url = `${ProductBaseUrl}/GetProductModel?ProductKeyID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };


export const GetProductLookupList = async () => {
    const url = `${ProductBaseUrl}/GetProductLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };
  
  export const ChangeProductStatus = async (id,UserKeyID) => {
    let url = `${ProductBaseUrl}/ChangeProductStatus?ProductKeyID=${id}&UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };