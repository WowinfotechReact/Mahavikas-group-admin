import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const AMCInvoicePaymentCollectionBaseURI = `${Base_Url}/AMCInvoicePaymentCollection`;

export const GetAMCInvoicePaymentCollectionList = async (params) => {
  const url = `${AMCInvoicePaymentCollectionBaseURI}/GetAMCInvoicePaymentCollectionList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};





export const AddUpdateAMCInvoicePaymentCollection = async (url = '', params) => {
 

  const res = await postApiWithAuthenticated(`${AMCInvoicePaymentCollectionBaseURI}${url}`, params);
  return res;
};

export const GetAMCInvoicePaymentCollectionModel = async (id) => {
  const url = `${AMCInvoicePaymentCollectionBaseURI}/GetAMCInvoicePaymentCollectionModel?AMCIPCKeyID=${id}`;
  const res = await getListWithAuthenticated(url);
  return res;
};




