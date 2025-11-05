import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const PurchaseOrderBaseUrl = `${Base_Url}/PurchaseOrder`;


export const GetPOList = async (params) => {
  let url = `${PurchaseOrderBaseUrl}/GetPOList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetInvoiceProductList = async (params) => {
  let url = `${PurchaseOrderBaseUrl}/GetInvoiceProductList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdatePurchaseOrder = async (url = '', params) => {
  

  const res = await postApiWithAuthenticated(`${PurchaseOrderBaseUrl}${url}`, params);
  return res;
};
export const AddUpdateApproveRejectEditPORequest = async (url = '', params) => {
  

  const res = await postApiWithAuthenticated(`${PurchaseOrderBaseUrl}${url}`, params);
  return res;
};
export const ValidatePOAndInvoiceNumber = async (url = '', params) => {
  

  const res = await postApiWithAuthenticated(`${PurchaseOrderBaseUrl}${url}`, params);
  return res;
};


export const GetPOModel = async (leadKeyID, purchaseOrderKeyID = null) => {
  let url = `${PurchaseOrderBaseUrl}/GetPOModel?LeadKeyID=${leadKeyID}`;

  
  if (purchaseOrderKeyID !== null && purchaseOrderKeyID !== undefined) {
    url += `&PurchaseOrderKeyID=${purchaseOrderKeyID}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};



export const GetStateLookupList = async () => {
    const url = `${PurchaseOrderBaseUrl}/GetStateLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };
  
  export const ChangeStateStatus = async (id,UserKeyID) => {
    let url = `${PurchaseOrderBaseUrl}/ChangeStateStatus?StateID=${id}&UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };
  export const SendToDispatched = async (UserKeyID,id) => {
    let url = `${PurchaseOrderBaseUrl}/SendToDispatched?UserKeyID=${UserKeyID}&PurchaseOrderKeyID=${id}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };