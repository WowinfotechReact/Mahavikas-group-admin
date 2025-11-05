import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const OEMPurchaseOrderBaseURI = `${Base_Url}/OEMPurchaseOrder`;


export const GetOEMPurchaseOrderList = async (params) => {
  let url = `${OEMPurchaseOrderBaseURI}/GetOEMPurchaseOrderList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};


export const AddUpdateOEMPurchaseOrder = async (url = '', params) => {
  

  const res = await postApiWithAuthenticated(`${OEMPurchaseOrderBaseURI}${url}`, params);
  return res;
};



export const GetOEMPurchaseOrderModel = async (id) => {
    let url = `${OEMPurchaseOrderBaseURI}/GetOEMPurchaseOrderModel?OEMPurchaseOrderKeyID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };
