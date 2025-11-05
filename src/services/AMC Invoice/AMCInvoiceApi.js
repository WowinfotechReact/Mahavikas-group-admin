import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const AMCInvoiceBaseUrl = `${Base_Url}/AMCInvoice`;


export const GetAMCInvoiceList = async (params) => {
  let url = `${AMCInvoiceBaseUrl}/GetAMCInvoiceList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdatePurchaseOrder = async (url = '', params) => {
  

  const res = await postApiWithAuthenticated(`${AMCInvoiceBaseUrl}${url}`, params);
  return res;
};
export const AddUpdateAMCInvoice = async (url = '', params) => {
  

  const res = await postApiWithAuthenticated(`${AMCInvoiceBaseUrl}${url}`, params);
  return res;
};


export const GetAMCInvoiceModel = async (id) => {
    let url = `${AMCInvoiceBaseUrl}/GetAMCInvoiceModel?AMCInvoiceKeyID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };


export const GetStateLookupList = async () => {
    const url = `${AMCInvoiceBaseUrl}/GetStateLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };
  
  export const ChangeStateStatus = async (id,UserKeyID) => {
    let url = `${AMCInvoiceBaseUrl}/ChangeStateStatus?StateID=${id}&UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };
  export const SendToDispatched = async (UserKeyID,id) => {
    let url = `${AMCInvoiceBaseUrl}/SendToDispatched?UserKeyID=${UserKeyID}&PurchaseOrderKeyID=${id}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };