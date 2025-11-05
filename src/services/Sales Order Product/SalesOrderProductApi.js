import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const SalesOrderProductBaseUrl = `${Base_Url}/SalesOrderProduct`;


export const GetSalesOrderProductList = async (params) => {
  let url = `${SalesOrderProductBaseUrl}/GetSalesOrderProductList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetLeadSalesOrderProductList = async (params) => {
  let url = `${SalesOrderProductBaseUrl}/GetLeadSalesOrderProductList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateSalesOrderProduct = async (url = '', params) => {
  

  const res = await postApiWithAuthenticated(`${SalesOrderProductBaseUrl}${url}`, params);
  return res;
};
export const GetSalesOrderProductModel = async (id) => {
    let url = `${SalesOrderProductBaseUrl}/GetSalesOrderProductModel?SalesOrderKeyID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };

export const GetSalesOrderProductDetailList = async (id) => {
    let url = `${SalesOrderProductBaseUrl}/GetSalesOrderProductDetailList?SalesOrderKeyID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };


export const GetStateLookupList = async () => {
    const url = `${SalesOrderProductBaseUrl}/GetStateLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };
  
  export const ChangeStateStatus = async (id,UserKeyID) => {
    let url = `${SalesOrderProductBaseUrl}/ChangeStateStatus?StateID=${id}&UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };