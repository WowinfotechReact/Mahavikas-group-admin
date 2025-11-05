import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const InvoicePaymentCollectionBaseURI = `${Base_Url}/InvoicePaymentCollection`;

export const GetInvoicePaymentCollectionList = async (params) => {
  let url = `${InvoicePaymentCollectionBaseURI}/GetInvoicePaymentCollectionList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateInvoicePaymentCollection = async (url = '', params) => {
 

  const res = await postApiWithAuthenticated(`${InvoicePaymentCollectionBaseURI}${url}`, params);
  return res;
};

export const GetInvoicePaymentCollectionModel = async (id) => {
  let url = `${InvoicePaymentCollectionBaseURI}/GetInvoicePaymentCollectionModel?IPCKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
