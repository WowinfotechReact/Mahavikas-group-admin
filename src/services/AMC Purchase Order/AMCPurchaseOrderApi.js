import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const AMCPurchaseOrderBaseUrl = `${Base_Url}/AMCPurchaseOrder`;


export const GetPOList = async (params) => {
  let url = `${AMCPurchaseOrderBaseUrl}/GetPOList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetAMCPurchaseOrderList = async (params) => {
  let url = `${AMCPurchaseOrderBaseUrl}/GetAMCPurchaseOrderList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateAMCPurchaseOrder = async (url = '', params) => {
  

  const res = await postApiWithAuthenticated(`${AMCPurchaseOrderBaseUrl}${url}`, params);
  return res;
};


export const GetPOModel = async (id) => {
    let url = `${AMCPurchaseOrderBaseUrl}/GetPOModel?PurchaseOrderKeyID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };


export const GetStateLookupList = async () => {
    const url = `${AMCPurchaseOrderBaseUrl}/GetStateLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };
  
  export const ChangeStateStatus = async (id,UserKeyID) => {
    let url = `${AMCPurchaseOrderBaseUrl}/ChangeStateStatus?StateID=${id}&UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };
  export const SendToDispatched = async (UserKeyID,id) => {
    let url = `${AMCPurchaseOrderBaseUrl}/SendToDispatched?UserKeyID=${UserKeyID}&PurchaseOrderKeyID=${id}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };