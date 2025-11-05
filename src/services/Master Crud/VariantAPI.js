import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const VariantBaseUrl = `${Base_Url}/Variant`;

export const GetVariantList = async (params) => {
  let url = `${VariantBaseUrl}/GetVariantList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateVariant = async (url = '', params) => {
 

  const res = await postApiWithAuthenticated(`${VariantBaseUrl}${url}`, params);
  return res;
};

export const GetVariantModel = async (id) => {
  let url = `${VariantBaseUrl}/GetVariantModel?VariantKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetVariantLookupList = async (manufacturerID = null, productID = null) => {
  let url = `${VariantBaseUrl}/GetVariantLookupList`; // ✅ Corrected path

  const queryParams = [];

  if (manufacturerID) {
    queryParams.push(`manufacturerID=${manufacturerID}`);
  }

  if (productID) {
    queryParams.push(`productID=${productID}`);
  }

  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};



export const ChangeVariantStatus = async (id, UserKeyID) => {
  let url = `${VariantBaseUrl}/ChangeVariantStatus?VariantKeyID=${id}&UserKeyID=${UserKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};


