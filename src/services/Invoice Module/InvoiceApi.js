import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const InvoiceBaseUrl = `${Base_Url}/Invoice`;

export const GetInvoiceList = async (params) => {
  let url = `${InvoiceBaseUrl}/GetInvoiceList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateInvoice = async (url = '', params) => {
  if (params.stateID === null || params.stateID === undefined) {
    delete params.stateID;
  }

  const res = await postApiWithAuthenticated(`${InvoiceBaseUrl}${url}`, params);
  return res;
};

export const GetInvoiceModel = async (id) => {
  let url = `${InvoiceBaseUrl}/GetInvoiceModel?InvoiceKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetDistrictLookupList = async (stateID) => {
  const url = `${InvoiceBaseUrl}/GetDistrictLookupList?StateID=${stateID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const ChangeDistrictStatus = async (id, UserKeyID) => {
  let url = `${InvoiceBaseUrl}/ChangeDistrictStatus?DistrictID=${id}&UserKeyID=${UserKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};
